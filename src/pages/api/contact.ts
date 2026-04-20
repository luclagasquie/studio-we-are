import { Resend } from 'resend';
import type { APIRoute } from 'astro';

export const prerender = false;

// --- HTML escape to prevent XSS in email body ---
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Allowed values for objet field ---
const VALID_OBJETS = ['nouveau-site', 'refonte', 'maintenance', 'conseil', 'photographie', 'autre'];

// --- Rate limiting via KV (Cloudflare) ---
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 3600_000;

async function isRateLimited(ip: string, env: any): Promise<boolean> {
  const kv = env?.CONTACT_RATE_LIMIT_KV;
  if (!kv) return false;

  const key = `rate:${ip}`;
  const record = await kv.get(key, 'json') as { count: number; resetAt: number } | null;
  const now = Date.now();

  if (!record || now > record.resetAt) {
    await kv.put(key, JSON.stringify({ count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS }), {
      expirationTtl: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
    });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) return true;

  await kv.put(key, JSON.stringify({ count: record.count + 1, resetAt: record.resetAt }), {
    expirationTtl: Math.ceil((record.resetAt - now) / 1000),
  });
  return false;
}

export const GET: APIRoute = async () => {
  return new Response(null, {
    status: 301,
    headers: { Location: '/contact/' },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  return handlePost(request, locals);
};

async function handlePost(request: Request, locals: App.Locals) {
  // Rate limiting
  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const env = locals.runtime?.env ?? {};
  if (await isRateLimited(ip, env)) {
    return new Response(JSON.stringify({ error: 'Trop de tentatives, réessayez plus tard.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await request.formData();
  } catch {
    return new Response(JSON.stringify({ error: 'Requête invalide' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Honeypot — silently discard bot submissions
  if (body.get('website')) {
    return new Response(null, {
      status: 303,
      headers: { Location: '/contact/?merci=1' },
    });
  }

  // Verify Turnstile
  const turnstileToken = body.get('cf-turnstile-response')?.toString().trim() ?? '';
  if (!turnstileToken) {
    return new Response(JSON.stringify({ error: 'Vérification anti-spam requise' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY || locals.runtime?.env?.TURNSTILE_SECRET_KEY;
  if (!turnstileSecret) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    return new Response(JSON.stringify({ error: 'Configuration serveur manquante' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken }),
  });
  const turnstileData = await turnstileRes.json();

  if (!turnstileData.success) {
    console.error('Turnstile verification failed:', turnstileData['error-codes']);
    return new Response(JSON.stringify({ error: 'Vérification anti-spam échouée' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const nom = body.get('nom')?.toString().trim() ?? '';
  const email = body.get('email')?.toString().trim() ?? '';
  const objet = body.get('objet')?.toString().trim() ?? '';
  const message = body.get('message')?.toString().trim() ?? '';
  const telephone = body.get('telephone')?.toString().trim() ?? '';

  // Validate required fields
  if (!nom || !email || !objet || !message) {
    return new Response(JSON.stringify({ error: 'Champs manquants' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validate objet against whitelist
  if (!VALID_OBJETS.includes(objet)) {
    return new Response(JSON.stringify({ error: 'Objet invalide' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Robust email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: 'Adresse email invalide' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Sanitize inputs (limit length to prevent abuse)
  if (nom.length > 100 || email.length > 254 || message.length > 5000 || objet.length > 200 || telephone.length > 30) {
    return new Response(JSON.stringify({ error: 'Données trop longues' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check for API key
  const apiKey = import.meta.env.RESEND_API_KEY || locals.runtime?.env?.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY not configured');
    return new Response(JSON.stringify({ error: 'Configuration serveur manquante' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: 'Studio We Are <email@we-are.fr>',
    to: ['luc@we-are.fr'],
    replyTo: `${escapeHtml(nom)} <${email}>`,
    subject: `[Contact] ${escapeHtml(objet)} — ${escapeHtml(nom)}`,
    html: [
      `<p><strong>Nom :</strong> ${escapeHtml(nom)}</p>`,
      `<p><strong>Email :</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`,
      telephone ? `<p><strong>Téléphone :</strong> ${escapeHtml(telephone)}</p>` : '',
      `<p><strong>Objet :</strong> ${escapeHtml(objet)}</p>`,
      `<hr>`,
      `<p>${message.replace(/\n/g, '<br>')}</p>`,
    ].filter(Boolean).join('\n'),
  });

  if (error) {
    console.error('Resend error:', error);
    return new Response(JSON.stringify({ error: "Erreur lors de l'envoi" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(null, {
    status: 303,
    headers: { Location: '/contact/?merci=1' },
  });
};
