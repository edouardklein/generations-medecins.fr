/**
 * auth-header.js — chargé sur toutes les pages publiques.
 * Si l'utilisateur est connecté, remplace le bouton "Adhérer →"
 * par un avatar initiales avec menu déroulant.
 */
(function () {
  const SUPABASE_URL  = 'https://faegpfkhlkkwmtaichin.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZWdwZmtobGtrd210YWljaGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwOTEyODQsImV4cCI6MjA5NTY2NzI4NH0.pHJjb5RIuhRPRi1shnKvScnpLk5Wd8wOiDrmG2143xo';

  // Supabase est déjà chargé via CDN sur toutes les pages
  if (typeof supabase === 'undefined') return;
  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

  async function init() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
      // Non connecté → ajouter un lien "Se connecter" à côté du bouton Adhérer
      const adhererBtn = document.querySelector('a[href="adherer.html"].btn.btn-primary, a[href="adherer.html"].btn-primary');
      if (adhererBtn) {
        const loginLink = document.createElement('a');
        loginLink.href = 'connexion.html';
        loginLink.textContent = 'Se connecter';
        loginLink.style.cssText = 'font-size:0.85rem;font-weight:700;color:var(--blue-dark,#1a4a80);text-decoration:none;white-space:nowrap;';
        adhererBtn.parentNode.insertBefore(loginLink, adhererBtn);
      }
      return;
    }

    // Récupérer prénom/nom du membre
    const { data: membre } = await sb.from('membres')
      .select('prenom, nom, statut')
      .eq('user_id', session.user.id)
      .single();

    const prenom = membre?.prenom || session.user.email[0].toUpperCase();
    const nom    = membre?.nom    || '';
    const initiales = (prenom[0] + (nom[0] || '')).toUpperCase();
    const nomComplet = prenom + (nom ? ' ' + nom : '');
    const statut = membre?.statut || 'en_attente';

    // Injecter le CSS de l'avatar (une seule fois)
    if (!document.getElementById('auth-header-style')) {
      const style = document.createElement('style');
      style.id = 'auth-header-style';
      style.textContent = `
        .user-avatar-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
          font-family: inherit;
        }
        .user-avatar-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #17365f, #326aa2, #58aab3);
          color: white;
          font-size: 0.8rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.02em;
          flex-shrink: 0;
          transition: box-shadow 0.2s;
        }
        .user-avatar-btn:hover .user-avatar-circle {
          box-shadow: 0 0 0 3px rgba(42,109,184,0.25);
        }
        .user-avatar-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--blue-dark, #1a4a80);
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: white;
          border: 1.5px solid #e8edf4;
          border-radius: 14px;
          box-shadow: 0 12px 40px rgba(23,54,95,0.14);
          min-width: 200px;
          padding: 8px;
          z-index: 200;
          display: none;
        }
        .user-dropdown.open { display: block; }
        .user-dropdown-header {
          padding: 10px 12px 8px;
          border-bottom: 1px solid #e8edf4;
          margin-bottom: 6px;
        }
        .user-dropdown-name {
          font-size: 0.85rem;
          font-weight: 800;
          color: #1a4a80;
        }
        .user-dropdown-status {
          font-size: 0.7rem;
          font-weight: 700;
          margin-top: 2px;
        }
        .status-actif    { color: #2d7a1a; }
        .status-attente  { color: #b06c00; }
        .status-suspendu { color: #b91c1c; }
        .user-dropdown a,
        .user-dropdown button.dd-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 9px;
          font-size: 0.83rem;
          font-weight: 600;
          color: #1a2332;
          text-decoration: none;
          width: 100%;
          text-align: left;
          border: none;
          background: none;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.15s;
        }
        .user-dropdown a:hover,
        .user-dropdown button.dd-item:hover { background: #f5f7fb; }
        .user-dropdown .dd-icon {
          font-size: 1rem;
          width: 20px;
          text-align: center;
          font-family: 'Apple Color Emoji','Noto Color Emoji','Segoe UI Emoji',sans-serif;
        }
        .user-dropdown .dd-sep {
          border: none;
          border-top: 1px solid #e8edf4;
          margin: 6px 0;
        }
        .user-dropdown .dd-danger { color: #b91c1c; }
      `;
      document.head.appendChild(style);
    }

    // Construire le widget avatar
    const statusLabels = { actif: '● Actif', en_attente: '● En attente', suspendu: '● Suspendu' };
    const statusClasses = { actif: 'status-actif', en_attente: 'status-attente', suspendu: 'status-suspendu' };

    const widget = document.createElement('div');
    widget.className = 'user-avatar-btn';
    widget.setAttribute('role', 'button');
    widget.setAttribute('tabindex', '0');
    widget.innerHTML = `
      <div class="user-avatar-circle">${initiales}</div>
      <span class="user-avatar-name">${prenom}</span>
      <div class="user-dropdown" id="user-dropdown">
        <div class="user-dropdown-header">
          <div class="user-dropdown-name">${nomComplet}</div>
          <div class="user-dropdown-status ${statusClasses[statut] || ''}">${statusLabels[statut] || statut}</div>
        </div>
        <a href="espace-membre.html"><span class="dd-icon">👤</span> Mon espace</a>
        <a href="espace-membre.html#profil"><span class="dd-icon">⚙️</span> Paramètres</a>
        <hr class="dd-sep">
        <button class="dd-item dd-danger" id="dd-logout"><span class="dd-icon">🚪</span> Se déconnecter</button>
      </div>
    `;

    // Remplacer le bouton Adhérer
    const adhererBtn = document.querySelector('a[href="adherer.html"].btn.btn-primary, a[href="adherer.html"].btn-primary');
    if (adhererBtn) adhererBtn.replaceWith(widget);

    // Toggle dropdown
    widget.addEventListener('click', function (e) {
      e.stopPropagation();
      document.getElementById('user-dropdown').classList.toggle('open');
    });
    widget.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') document.getElementById('user-dropdown').classList.toggle('open');
    });
    document.addEventListener('click', function () {
      const dd = document.getElementById('user-dropdown');
      if (dd) dd.classList.remove('open');
    });

    // Logout
    document.getElementById('dd-logout').addEventListener('click', async function (e) {
      e.stopPropagation();
      await sb.auth.signOut();
      window.location.href = 'index.html';
    });
  }

  // Attendre que le DOM soit prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
