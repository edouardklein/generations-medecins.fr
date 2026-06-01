/**
 * Netlify Function — Envoi communiqué de presse via Gmail API (OAuth2)
 * Les contacts presse sont récupérés depuis une liste Brevo.
 *
 * Env vars requis dans Netlify :
 *   GMAIL_CLIENT_ID         Google OAuth2 client ID
 *   GMAIL_CLIENT_SECRET     Google OAuth2 client secret
 *   GMAIL_REFRESH_TOKEN     refresh token obtenu lors de l'autorisation OAuth2
 *   GMAIL_SENDER            adresse d'envoi ex: contact@generations-medecins.fr
 *   BREVO_API_KEY           pour récupérer la liste presse
 *   PRESS_LIST_ID           ID de la liste Brevo presse (ex: 4)
 *   SUPABASE_URL
 *   SUPABASE_ANON_KEY
 *   SUPABASE_SERVICE_ROLE_KEY
 */

async function verifySuperAdmin(token) {
  if (!token) return null;

  const userRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: process.env.SUPABASE_ANON_KEY,
    },
  });
  if (!userRes.ok) return null;
  const user = await userRes.json();
  if (!user?.id) return null;

  const adminRes = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/admins?select=role&user_id=eq.${user.id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    }
  );
  const admins = await adminRes.json();
  return admins?.[0]?.role === 'super_admin' ? user : null;
}

async function getGmailAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID,
      client_secret: process.env.GMAIL_CLIENT_SECRET,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Token Gmail invalide : ' + JSON.stringify(data));
  return data.access_token;
}

async function getBrevoContacts(listId) {
  let contacts = [];
  let offset = 0;
  const limit = 500;

  while (true) {
    const res = await fetch(
      `https://api.brevo.com/v3/contacts?listId=${listId}&limit=${limit}&offset=${offset}`,
      { headers: { 'api-key': process.env.BREVO_API_KEY } }
    );
    const data = await res.json();
    const batch = data?.contacts || [];
    contacts = contacts.concat(batch);
    if (batch.length < limit) break;
    offset += limit;
  }
  return contacts.map(c => c.email).filter(Boolean);
}

function buildRawEmail({ from, bccList, subject, textContent, htmlContent }) {
  const boundary = `boundary_${Date.now()}`;
  const lines = [
    `From: ${from}`,
    `Bcc: ${bccList.join(', ')}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(textContent).toString('base64'),
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(htmlContent || textContent.replace(/\n/g, '<br>')).toString('base64'),
    '',
    `--${boundary}--`,
  ];
  return Buffer.from(lines.join('\r\n')).toString('base64url');
}

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: '{"error":"Method not allowed"}' };

  const token = (event.headers.authorization || '').replace('Bearer ', '').trim();
  const user = await verifySuperAdmin(token);
  if (!user) return { statusCode: 403, headers, body: '{"error":"Accès réservé aux super-admins"}' };

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, headers, body: '{"error":"JSON invalide"}' }; }

  const { subject, textContent, htmlContent, listId } = body;
  if (!subject?.trim() || !textContent?.trim()) {
    return { statusCode: 400, headers, body: '{"error":"Sujet et contenu requis"}' };
  }

  const pressListId = listId || process.env.PRESS_LIST_ID;

  // 1) Récupérer contacts presse depuis Brevo
  let emails;
  try {
    emails = await getBrevoContacts(pressListId);
  } catch (e) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'Erreur lecture liste Brevo', detail: e.message }) };
  }

  if (emails.length === 0) {
    return { statusCode: 400, headers, body: '{"error":"Aucun contact dans la liste presse Brevo"}' };
  }

  // 2) Obtenir access token Gmail
  let accessToken;
  try {
    accessToken = await getGmailAccessToken();
  } catch (e) {
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'Erreur auth Gmail', detail: e.message }) };
  }

  // 3) Envoyer (en BCC par blocs de 50 pour éviter les limites Gmail)
  const CHUNK = 50;
  const sender = process.env.GMAIL_SENDER;
  let sent = 0;

  for (let i = 0; i < emails.length; i += CHUNK) {
    const chunk = emails.slice(i, i + CHUNK);
    const raw = buildRawEmail({
      from: sender,
      bccList: chunk,
      subject,
      textContent,
      htmlContent: htmlContent || null,
    });

    const sendRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!sendRes.ok) {
      const err = await sendRes.json().catch(() => ({}));
      console.error('Gmail send error on chunk', i, err);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Erreur envoi Gmail', detail: err, sentSoFar: sent }) };
    }
    sent += chunk.length;
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true, sent, total: emails.length }),
  };
};
