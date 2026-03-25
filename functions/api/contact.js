/**
 * Cloudflare Pages Function — contact form handler
 * POST /api/contact
 */
export async function onRequestPost(context) {
  const { request } = context;

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
    return Response.redirect(new URL('/contact?merci=1', request.url).toString(), 303);
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

  // Send via Mailchannels (Cloudflare Pages native — no API key required)
  const emailPayload = {
    personalizations: [
      {
        to: [{ email: 'luc@studioweare.fr', name: 'Luc Lagasquie' }],
      },
    ],
    from: { email: 'noreply@studioweare.fr', name: 'Studio We Are — Formulaire' },
    reply_to: { email, name: nom },
    subject: `[Contact] ${objet} — ${nom}`,
    content: [
      {
        type: 'text/plain',
        value: [
          `Nom : ${nom}`,
          `Email : ${email}`,
          `Téléphone : ${telephone || '—'}`,
          `Objet : ${objet}`,
          '',
          message,
        ].join('\n'),
      },
    ],
  };

  const res = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailPayload),
  });

  // Mailchannels returns 202 on success
  if (!res.ok && res.status !== 202) {
    console.error('Mailchannels error:', res.status, await res.text());
    return new Response(JSON.stringify({ error: "Erreur lors de l'envoi" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return Response.redirect(new URL('/contact?merci=1', request.url).toString(), 303);
}
