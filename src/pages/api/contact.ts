import { Resend } from 'resend';
import type { APIRoute } from 'astro';

export const prerender = false;

export const ALL: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return handlePost(request);
};

export const POST: APIRoute = async ({ request }) => {
  return handlePost(request);
};

async function handlePost(request: Request) {
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

  // Basic email format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Adresse email invalide' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Sanitize inputs (limit length to prevent abuse)
  if (nom.length > 100 || email.length > 254 || message.length > 5000) {
    return new Response(JSON.stringify({ error: 'Données trop longues' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Check for API key
  const apiKey = import.meta.env.RESEND_API_KEY;
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
    replyTo: `${nom} <${email}>`,
    subject: `[Contact] ${objet} — ${nom}`,
    html: [
      `<p><strong>Nom :</strong> ${nom}</p>`,
      `<p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>`,
      telephone ? `<p><strong>Téléphone :</strong> ${telephone}</p>` : '',
      `<p><strong>Objet :</strong> ${objet}</p>`,
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
