/**
 * Netlify Scheduled Function — Veille automatisée
 * Exécution : tous les matins à 7h00 heure de Paris (5h UTC)
 * schedule = "0 5 * * *"  (dans netlify.toml)
 *
 * Env vars requis :
 *   OPENAI_API_KEY
 *   BREVO_API_KEY
 *   ADMIN_EMAIL          ex: alexis.bourla@gmail.com
 *   SENDER_EMAIL         ex: contact@generations-medecins.fr
 *   SENDER_NAME          ex: Générations Médecins
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

const GOOGLE_NEWS_BASE = 'https://news.google.com/rss/search?q={q}&hl=fr&gl=FR&ceid=FR:fr';
const GOOGLE_NEWS_QUERIES = [
  'convention médicale médecins généralistes',
  'syndicat médecins libéraux CNAM négociation',
  'médecins libéraux honoraires secteur conventionnel',
  'médecin libéral retraite CARMF',
  'PLFSS médecins libéraux',
  'démographie médicale déserts France politique',
  'grève mobilisation médecins syndicat',
  'télémédecine téléconsultation remboursement',
];

const RSS_FEEDS = [
  { nom: 'Egora', url: 'https://www.egora.fr/rss.xml' },
  ...GOOGLE_NEWS_QUERIES.map(q => ({
    nom: 'Google News',
    url: GOOGLE_NEWS_BASE.replace('{q}', encodeURIComponent(q)),
  })),
];

const TAGS_ALLOWED = [
  'CCAM/Cotation',
  'Convention médicale',
  'Accès aux soins',
  'Télémédecine',
  'Formation/DPC',
  'Fiscalité/Retraite',
  'Installation/Libéral',
  'Politique de santé',
  'Syndicat',
];

// ── RSS parsing (minimal, no external deps) ─────────────────────────────────

function parseXml(xml) {
  const items = [];
  const itemRe = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const get = (tag) => {
      const r = new RegExp(`<${tag}(?:[^>]*)><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}(?:[^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'i');
      const x = r.exec(block);
      return x ? (x[1] ?? x[2] ?? '').trim() : '';
    };
    items.push({
      title:       get('title'),
      link:        get('link') || get('guid'),
      pubDate:     get('pubDate'),
      description: get('description'),
      content:     get('content:encoded') || get('description'),
    });
  }
  return items;
}

function isRecent(pubDateStr) {
  if (!pubDateStr) return true;
  try {
    const diff = (Date.now() - new Date(pubDateStr)) / 36e5;
    return diff <= 36;
  } catch {
    return true;
  }
}

// ── GPT-4o-mini classification ───────────────────────────────────────────────

async function classifyArticle(article) {
  const description = (article.description || '').replace(/<[^>]+>/g, '').slice(0, 500);

  const prompt = `Tu es assistant éditorial pour le syndicat Générations Médecins IDF.

Article :
- Titre : ${article.title}
- Source : ${article.nom}
- Résumé : ${description}

Réponds UNIQUEMENT en JSON valide, sans texte avant ni après.

Règles :
1. "pertinent" : true si l'article concerne un enjeu NATIONAL français lié aux médecins (exercice libéral, conventionnement, honoraires, syndicats, démographie, politiques de santé, CNAM, retraite CARMF, télémédecine, formation). false si c'est un article PUREMENT LOCAL (ex: ouverture d'un cabinet dans une ville précise, un médecin qui s'installe dans un village) sans portée nationale, ou sans rapport avec la médecine.
2. "tags" : entre 1 et 3 tags choisis UNIQUEMENT parmi cette liste exacte (respecte l'orthographe et la casse) : ${TAGS_ALLOWED.map(t => JSON.stringify(t)).join(', ')}
3. "resume" : 2-3 phrases factuelles résumant l'enjeu.

Exemple de réponse valide :
{"pertinent": true, "tags": ["Convention médicale", "Syndicat"], "resume": "La CNAM et les syndicats de médecins ont ouvert de nouvelles négociations conventionnelles. Les discussions portent sur la revalorisation des honoraires."}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model:           'gpt-4o-mini',
      max_tokens:      400,
      response_format: { type: 'json_object' },
      messages:        [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('GPT error:', res.status, err?.error?.message || '');
    return null;
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  try {
    const parsed = JSON.parse(text);
    if (parsed.tags) {
      parsed.tags = parsed.tags.filter(t => TAGS_ALLOWED.includes(t));
    }
    return parsed;
  } catch {
    return null;
  }
}

// ── Supabase helpers ─────────────────────────────────────────────────────────

async function urlAlreadyExists(url) {
  const since = new Date(Date.now() - 7 * 24 * 36e5).toISOString();
  const res = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/decrypteurs?url=eq.${encodeURIComponent(url)}&auto_import=eq.true&created_at=gte.${since}&select=id&limit=1`,
    {
      headers: {
        apikey:        process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
  const rows = await res.json();
  return Array.isArray(rows) && rows.length > 0;
}

async function insertDecrypteur(row) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/decrypteurs`, {
    method: 'POST',
    headers: {
      apikey:         process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization:  `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer:         'return=representation',
    },
    body: JSON.stringify(row),
  });
  return res.ok ? await res.json() : null;
}

// ── Slug helper ──────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// ── Brevo admin digest ───────────────────────────────────────────────────────

async function sendAdminDigest(articles) {
  if (!process.env.ADMIN_EMAIL || !articles.length) return;

  const logoUrl = 'https://generations-medecins.fr/logoGM.jpeg';
  const siteUrl = 'https://generations-medecins.fr';
  const rows    = articles.map(a => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e8edf2">
        <strong>${a.titre}</strong><br>
        <span style="font-size:13px;color:#555">${a.source} — ${new Date(a.publie_le).toLocaleDateString('fr-FR')}</span><br>
        <span style="font-size:13px">${a.resume || ''}</span><br>
        ${a.tags?.length ? `<span style="font-size:12px;color:#38a8b5">${a.tags.join(' · ')}</span>` : ''}
      </td>
    </tr>`).join('');

  const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;margin:0;padding:0">
<div style="max-width:680px;margin:0 auto">
  <div style="background:linear-gradient(135deg,#1a5c3e,#27956a,#38a8b5);padding:32px 40px;text-align:center">
    <img src="${logoUrl}" width="90" style="border-radius:16px;margin-bottom:12px"><br>
    <span style="color:#fff;font-size:22px;font-weight:700">Veille du matin</span><br>
    <span style="color:rgba(255,255,255,.8);font-size:14px">${new Date().toLocaleDateString('fr-FR', {weekday:'long',day:'numeric',month:'long'})}</span>
  </div>
  <div style="padding:24px 32px;background:#f8fafc">
    <p style="color:#333;margin:0 0 16px">${articles.length} article${articles.length > 1 ? 's' : ''} importé${articles.length > 1 ? 's' : ''} automatiquement. <a href="${siteUrl}/mockup/admin.html" style="color:#2a6db8">Espace admin → Veille</a> pour rejeter les non pertinents.</p>
    <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e8edf2">
      ${rows}
    </table>
  </div>
  <div style="text-align:center;padding:20px;color:#999;font-size:12px">
    <img src="${logoUrl}" width="60" style="border-radius:10px;margin-bottom:8px"><br>
    Générations Médecins IDF
  </div>
</div></body></html>`;

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender:      { name: process.env.SENDER_NAME || 'Générations Médecins', email: process.env.SENDER_EMAIL },
      to:          [{ email: process.env.ADMIN_EMAIL }],
      subject:     `[Veille] ${articles.length} article${articles.length > 1 ? 's' : ''} importé${articles.length > 1 ? 's' : ''} — ${new Date().toLocaleDateString('fr-FR')}`,
      htmlContent: html,
    }),
  });
}

// ── Auth helper ──────────────────────────────────────────────────────────────

async function verifySuperAdmin(token) {
  if (!token) return null;
  const userRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: process.env.SUPABASE_ANON_KEY },
  });
  if (!userRes.ok) return null;
  const user = await userRes.json();
  if (!user?.id) return null;
  const adminRes = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/admins?select=role&user_id=eq.${user.id}`,
    { headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, apikey: process.env.SUPABASE_SERVICE_ROLE_KEY } }
  );
  const admins = await adminRes.json();
  return admins?.[0]?.role === 'super_admin' ? user : null;
}

// ── Core logic ───────────────────────────────────────────────────────────────

async function runVeille() {
  const results = { imported: [], skipped: 0, skipped_regional: 0, gpt_errors: 0, errors: [] };
  const today   = new Date().toISOString().slice(0, 10);

  for (const feed of RSS_FEEDS) {
    let xml;
    try {
      const r = await fetch(feed.url, { headers: { 'User-Agent': 'GenerationsMedecins-Veille/1.0' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      xml = await r.text();
    } catch (e) {
      results.errors.push(`${feed.nom}: ${e.message}`);
      continue;
    }

    const items = parseXml(xml).filter(i => isRecent(i.pubDate));

    for (const item of items.slice(0, 10)) {
      if (!item.link || !item.title) { results.skipped++; continue; }
      if (await urlAlreadyExists(item.link)) { results.skipped++; continue; }

      const classification = await classifyArticle({ ...item, nom: feed.nom });

      if (classification === null) {
        results.gpt_errors++;
        // GPT indisponible — on skippe plutôt que d'importer sans tags
        results.skipped++;
        continue;
      }

      if (!classification.pertinent) {
        results.skipped_regional++;
        results.skipped++;
        continue;
      }

      const titre = item.title.slice(0, 250);
      const slug  = slugify(titre) + '-' + Date.now().toString(36);

      const row = {
        titre,
        slug,
        url:           item.link,
        source:        feed.nom,
        publie_le:     item.pubDate ? new Date(item.pubDate).toISOString().slice(0, 10) : today,
        resume:        classification.resume || (item.description || '').replace(/<[^>]+>/g, '').slice(0, 300),
        contenu:       item.content || item.description || '',
        auteur:        null,
        categorie:     'veille',
        acces:         'public',
        publie:        true,
        auto_import:   true,
        veille_statut: 'publie',
        tags:          classification.tags || [],
      };

      const inserted = await insertDecrypteur(row);
      if (inserted) {
        results.imported.push({ titre, source: feed.nom, publie_le: row.publie_le, resume: row.resume, tags: row.tags });
      } else {
        results.errors.push(`Insert failed: ${titre.slice(0, 60)}`);
      }
    }
  }

  if (results.imported.length > 0) {
    await sendAdminDigest(results.imported);
  }

  console.log(`Veille : ${results.imported.length} importés, ${results.skipped} ignorés (dont ${results.skipped_regional} régionaux, ${results.gpt_errors} erreurs GPT), ${results.errors.length} erreurs feed`);
  if (results.errors.length) console.error(results.errors.join('\n'));

  return results;
}

// ── Main handler ─────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  };

  if (!event.httpMethod || event.httpMethod === 'GET') {
    const results = await runVeille();
    return { statusCode: 200, headers, body: JSON.stringify(results) };
  }

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };

  if (event.httpMethod === 'POST') {
    const token = (event.headers.authorization || '').replace('Bearer ', '').trim();
    const user  = await verifySuperAdmin(token);
    if (!user) return { statusCode: 403, headers, body: '{"error":"Accès réservé aux super-admins"}' };
    const results = await runVeille();
    return { statusCode: 200, headers, body: JSON.stringify(results) };
  }

  return { statusCode: 405, headers, body: '{"error":"Method not allowed"}' };
};
