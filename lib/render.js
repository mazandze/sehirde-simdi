// lib/render.js
'use strict';

// Google Analytics 4 Measurement ID
// Kendi ID'ni buraya yaz (Google Analytics hesabında "Veri Akışları" sayfasında bulunur,
// G- ile başlar, örn: G-ABC1234XYZ). Yer tutucu değerdeyken script hiç eklenmez.
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

function gaSnippet() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return '';
  return `
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_MEASUREMENT_ID}');
</script>`;
}

function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function layout({ title, description = 'Şehrinde şimdi ne oluyor?', body, activeCitySlug = '' }) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)} · Şehirde Şimdi</title>
<meta name="description" content="${esc(description)}">
<link rel="stylesheet" href="/styles.css">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕐</text></svg>">
${gaSnippet()}
</head>
<body>
<header class="topbar">
  <a href="/" class="brand">Şehirde<span>Şimdi</span></a>

  <nav class="topnav">
    <a href="/${activeCitySlug || 'canakkale'}">Akış</a>
    <a href="/admin">Yönetim</a>
  </nav>
</header>
${body}
<footer class="footer">
  <div class="footer-links">
    <a href="/gizlilik-politikasi">Gizlilik Politikası</a>
    <a href="/kullanim-kosullari">Kullanım Koşulları</a>
    <a href="/cerez-politikasi">Çerez Politikası</a>
  </div>
  <p>© ${new Date().getFullYear()} Şehirde Şimdi — Demo/MVP sürümü.</p>
</footer>
</body>
</html>`;
}

function citySwitcher(cities, activeSlug) {
  return `<form class="city-switcher" method="GET" action="/goto-city" onsubmit="event.preventDefault(); if(this.city.value) window.location.href='/'+this.city.value;">
    <select name="city" aria-label="Şehir seç">
      ${cities
        .map(
          (c) =>
            `<option value="${esc(c.slug)}" ${c.slug === activeSlug ? 'selected' : ''} ${!c.is_active ? 'disabled' : ''}>${esc(c.name)}${!c.is_active ? ' (yakında)' : ''}</option>`
        )
        .join('')}
    </select>
  </form>`;
}

function categoryChips(categories, activeSlug, citySlug, counts = {}) {
  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);
  const all = `<a class="chip ${!activeSlug ? 'chip-active' : ''}" href="/${citySlug}">Tümü${totalCount ? ` (${totalCount})` : ''}</a>`;
  const rest = categories
    .map((c) => {
      const n = counts[c.slug] || 0;
      return `<a class="chip ${c.slug === activeSlug ? 'chip-active' : ''}" style="--chip-color:${c.color}" href="/${citySlug}/${c.slug}">${c.emoji} ${esc(c.name)}${n ? ` (${n})` : ''}</a>`;
    })
    .join('');
  return `<div class="chips">${all}${rest}</div>`;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('tr-TR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });
}
function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'az önce';
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}
// Gelecekteki bir tarihe göre "3 gün sonra" / "yarın" / "2 sa sonra" gibi geri sayım metni
function countdown(iso) {
  const diffMs = new Date(iso).getTime() - Date.now();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} dk sonra`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} sa sonra`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'yarın';
  return `${days} gün sonra`;
}
function isUpcoming(post) {
  return !!post.event_date && new Date(post.event_date).getTime() > Date.now();
}

function postCard(post, category, citySlug) {
  const upcoming = isUpcoming(post);
  return `<article class="card">
    <a href="/${citySlug}/icerik/${post.slug}" class="card-media" style="--cat-color:${category ? category.color : '#475569'}">
      <span class="card-emoji">${esc(post.image_emoji || '🗞️')}</span>
      ${post.is_featured ? '<span class="badge-featured">Öne Çıkan</span>' : upcoming ? `<span class="badge-upcoming">${countdown(post.event_date)}</span>` : ''}
    </a>
    <div class="card-body">
      <div class="card-meta">
        <span class="cat-tag" style="--cat-color:${category ? category.color : '#475569'}">${category ? category.emoji + ' ' + esc(category.name) : ''}</span>
        <span class="dot">·</span>
        <time>${upcoming ? countdown(post.event_date) : timeAgo(post.created_at)}</time>
      </div>
      <h3><a href="/${citySlug}/icerik/${post.slug}">${esc(post.title)}</a></h3>
      <p class="card-desc">${esc(post.description).slice(0, 110)}${post.description.length > 110 ? '…' : ''}</p>
      <div class="card-foot">
        ${post.location ? `<span>📍 ${esc(post.location)}</span>` : ''}
        ${post.event_date ? `<span>🗓️ ${formatDate(post.event_date)}</span>` : ''}
      </div>
    </div>
  </article>`;
}

function featuredStrip(featuredPosts, categories, citySlug) {
  if (!featuredPosts.length) return '';
  return `<section class="featured-strip">
    <h2 class="section-title">⭐ Öne Çıkanlar</h2>
    <div class="strip-scroll">
      ${featuredPosts
        .map((post) => {
          const cat = categories.find((c) => c.slug === post.category_slug);
          return `<a class="strip-card" href="/${citySlug}/icerik/${post.slug}" style="--cat-color:${cat ? cat.color : '#475569'}">
            <span class="strip-emoji">${esc(post.image_emoji || '🗞️')}</span>
            <span class="strip-title">${esc(post.title)}</span>
            <span class="strip-cat">${cat ? cat.emoji + ' ' + esc(cat.name) : ''}</span>
          </a>`;
        })
        .join('')}
    </div>
  </section>`;
}

function homePage({ cities }) {
  const active = cities.filter((c) => c.is_active).sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  const soon = cities.filter((c) => !c.is_active);
  const script = `
  <script>
    function filterCities(q){
      q = q.toLocaleLowerCase('tr-TR');
      document.querySelectorAll('#city-list .city-card').forEach(function(el){
        const name = el.getAttribute('data-name');
        el.style.display = name.includes(q) ? '' : 'none';
      });
    }
  </script>`;
  const body = `
  <main class="hero">
    <h1>Şehrinde şimdi ne oluyor?</h1>
    <p class="hero-sub">Etkinlikler, konserler, fırsatlar, duyurular — tek akışta, en yeni en üstte. Türkiye genelinde 81 il.</p>
    <input class="city-search" type="text" placeholder="Şehir ara..." oninput="filterCities(this.value)" aria-label="Şehir ara">
    <div class="city-grid" id="city-list">
      ${active
        .map((c) => `<a class="city-card city-card-active" data-name="${esc(c.name.toLocaleLowerCase('tr-TR'))}" href="/${c.slug}"><span>${esc(c.name)}</span><small>Akışa gir →</small></a>`)
        .join('')}
      ${soon
        .map((c) => `<div class="city-card city-card-soon" data-name="${esc(c.name.toLocaleLowerCase('tr-TR'))}"><span>${esc(c.name)}</span><small>yakında</small></div>`)
        .join('')}
    </div>
  </main>
  ${script}`;
  return layout({ title: 'Şehrinde şimdi ne oluyor?', body });
}

function feedPage({ city, categories, category, posts, q, categoryCounts = {} }) {
  const heading = category ? category.name : 'Tüm Akış';
  const featured = posts.filter((p) => p.is_featured);
  const rest = posts; // öne çıkanlar zaten en üstte sıralı geliyor, ayrıca listede de görünürler
  const upcoming = rest.filter((p) => isUpcoming(p)).sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  const current = rest.filter((p) => !isUpcoming(p));

  const body = `
  <main class="feed-page">
    <section class="feed-head">
      <h1>${esc(city.name)} <span class="muted">/ ${esc(heading)}</span></h1>
      <form class="search" method="GET" action="/${city.slug}${category ? '/' + category.slug : ''}">
        <input type="text" name="q" value="${esc(q || '')}" placeholder="Ara: etkinlik, mekan, ilan...">
        <button type="submit">Ara</button>
      </form>
    </section>
    ${categoryChips(categories, category ? category.slug : '', city.slug, categoryCounts)}
    <a class="submit-cta" href="/${city.slug}/icerik-ekle">🏪 İşletmenizin etkinliği/ilanı mı var? Ücretsiz ekleyin →</a>
    ${featuredStrip(featured, categories, city.slug)}
    ${!posts.length ? `<div class="empty">Bu kriterlere uygun içerik yok. Başka bir kategori ya da arama dene.</div>` : ''}
    ${
      current.length
        ? `<section class="stream-section">
            <h2 class="section-title">🔴 Şimdi</h2>
            <div class="stream">${current.map((p) => postCard(p, categories.find((c) => c.slug === p.category_slug), city.slug)).join('')}</div>
          </section>`
        : ''
    }
    ${
      upcoming.length
        ? `<section class="stream-section">
            <h2 class="section-title">🗓️ Yakında</h2>
            <div class="stream">${upcoming.map((p) => postCard(p, categories.find((c) => c.slug === p.category_slug), city.slug)).join('')}</div>
          </section>`
        : ''
    }
  </main>`;
  return layout({ title: `${city.name} · ${heading}`, body, activeCitySlug: city.slug });
}

function postDetailPage({ city, category, post }) {
  const shareScript = `
  <script>
    function paylas(){
      const data = { title: document.title, url: window.location.href };
      if (navigator.share) { navigator.share(data).catch(()=>{}); }
      else { navigator.clipboard.writeText(window.location.href); alert('Bağlantı kopyalandı: ' + window.location.href); }
    }
  </script>`;
  const body = `
  <main class="detail-page">
    <a class="back-link" href="/${city.slug}/${post.category_slug}">← ${esc(category ? category.name : 'Akış')}</a>
    <div class="detail-media" style="--cat-color:${category ? category.color : '#475569'}"><span>${esc(post.image_emoji)}</span></div>
    <span class="cat-tag" style="--cat-color:${category ? category.color : '#475569'}">${category ? category.emoji + ' ' + esc(category.name) : ''}</span>
    <h1>${esc(post.title)}</h1>
    <div class="detail-meta">
      ${post.location ? `<span>📍 ${esc(post.location)}</span>` : ''}
      ${post.event_date ? `<span>🗓️ ${formatDate(post.event_date)}</span>` : ''}
      ${post.source ? `<span>🔗 Kaynak: ${post.source_url ? `<a href="${esc(post.source_url)}" target="_blank" rel="noopener noreferrer">${esc(post.source)}</a>` : esc(post.source)}</span>` : ''}
    </div>
    <p class="detail-desc">${esc(post.description)}</p>
    <button class="share-btn" onclick="paylas()">Paylaş</button>
  </main>
  ${shareScript}`;
  return layout({ title: post.title, description: post.description, body, activeCitySlug: city.slug });
}

function legalPage(title, contentHtml) {
  const body = `<main class="legal-page"><h1>${esc(title)}</h1>${contentHtml}</main>`;
  return layout({ title, body });
}

// ---------- İşletme içerik gönderim formu (herkese açık) ----------
function submitPostForm({ city, categories, error, values }) {
  const v = values || {};
  const submittableCategories = categories.filter((c) => !['belediye', 'trafik'].includes(c.slug));
  const body = `
  <main class="admin-page">
    <a class="back-link" href="/${city.slug}">← ${esc(city.name)} akışına dön</a>
    <h1>İçeriğinizi Ekleyin</h1>
    <p class="muted">Etkinliğiniz, kampanyanız ya da ilanınız incelendikten sonra ${esc(city.name)} akışında yayınlanır. Bu ücretsizdir.</p>
    ${error ? `<p class="form-error">${esc(error)}</p>` : ''}
    <form method="POST" action="/${city.slug}/icerik-ekle" class="admin-form post-form">
      <label>Kategori
        <select name="category_slug" required>
          <option value="">Seçiniz</option>
          ${submittableCategories.map((c) => `<option value="${c.slug}" ${v.category_slug === c.slug ? 'selected' : ''}>${c.emoji} ${esc(c.name)}</option>`).join('')}
        </select>
      </label>
      <label>Başlık<input type="text" name="title" required value="${esc(v.title || '')}" placeholder="Örn: Cuma Akşamı Canlı Müzik"></label>
      <label>Açıklama<textarea name="description" rows="4" required placeholder="Kısaca ne olduğunu anlatın">${esc(v.description || '')}</textarea></label>
      <label>Konum<input type="text" name="location" required value="${esc(v.location || '')}" placeholder="Adres / mahalle"></label>
      <label>Tarih/saat (etkinlikse)<input type="datetime-local" name="event_date" value="${esc(v.event_date || '')}"></label>
      <label>Görsel (emoji)<input type="text" name="image_emoji" value="${esc(v.image_emoji || '🏪')}" maxlength="4"></label>
      <hr style="border:none;border-top:1px solid var(--line);margin:6px 0">
      <label>İşletme / kurum adı<input type="text" name="business_name" required value="${esc(v.business_name || '')}"></label>
      <label>İletişim (e-posta veya telefon)<input type="text" name="submitter_contact" required value="${esc(v.submitter_contact || '')}" placeholder="Onaylanınca ya da soru olursa ulaşmak için"></label>
      <button type="submit" class="btn">Gönder</button>
    </form>
  </main>`;
  return layout({ title: `${city.name} · İçerik Ekle`, body, activeCitySlug: city.slug });
}

function submitPostSuccessPage(city) {
  const body = `
  <main class="admin-page">
    <h1>Teşekkürler! 🎉</h1>
    <p>İçeriğiniz incelemeye alındı. Onaylandığında ${esc(city.name)} akışında yayınlanacak.</p>
    <a class="btn" href="/${city.slug}">Akışa dön</a>
    <a class="btn-ghost" href="/${city.slug}/icerik-ekle" style="margin-left:8px">Başka içerik ekle</a>
  </main>`;
  return layout({ title: 'Gönderildi', body, activeCitySlug: city.slug });
}

// ---------- ADMIN ----------
function adminLoginPage(error) {
  const body = `
  <main class="admin-auth">
    <h1>Yönetim Girişi</h1>
    ${error ? `<p class="form-error">${esc(error)}</p>` : ''}
    <form method="POST" action="/admin/login" class="admin-form">
      <label>Kullanıcı adı<input type="text" name="username" required autofocus></label>
      <label>Şifre<input type="password" name="password" required></label>
      <button type="submit">Giriş yap</button>
    </form>
  </main>`;
  return layout({ title: 'Yönetim Girişi', body });
}

function adminDashboard({ posts, categories, cities, pending = [] }) {
  const pendingRows = pending
    .map((post) => {
      const cat = categories.find((c) => c.slug === post.category_slug);
      return `<tr>
        <td>${esc(post.image_emoji)}</td>
        <td>
          <strong>${esc(post.title)}</strong><br>
          <small class="muted">${cat ? esc(cat.name) : ''} · ${esc(post.business_name || '')} · ${esc(post.submitter_contact || '')}</small><br>
          <small class="muted">${esc(post.description).slice(0, 140)}</small>
        </td>
        <td class="admin-actions">
          <a href="/admin/posts/${post.id}/edit">Düzenle</a>
          <form method="POST" action="/admin/posts/${post.id}/approve"><button>✅ Onayla</button></form>
          <form method="POST" action="/admin/posts/${post.id}/reject" onsubmit="return confirm('Reddedilsin mi?');"><button class="danger">✖ Reddet</button></form>
        </td>
      </tr>`;
    })
    .join('');

  const rows = posts
    .map((post) => {
      const cat = categories.find((c) => c.slug === post.category_slug);
      const city = cities.find((c) => c.slug === post.city_slug);
      return `<tr class="${!post.is_published ? 'row-unpublished' : ''}">
        <td>${esc(post.image_emoji)}</td>
        <td>
          <strong>${esc(post.title)}</strong><br>
          <small class="muted">${city ? esc(city.name) : ''} · ${cat ? esc(cat.name) : ''} · ${timeAgo(post.created_at)} ${post.is_featured ? '· ⭐ öne çıkan' : ''} ${!post.is_published ? '· 🚫 yayından kaldırıldı' : ''} ${post.submitted_by === 'isletme' ? '· 🏪 işletme bildirimi' : ''}</small>
        </td>
        <td class="admin-actions">
          <a href="/admin/posts/${post.id}/edit">Düzenle</a>
          <form method="POST" action="/admin/posts/${post.id}/toggle-feature"><button>${post.is_featured ? 'Öne çıkarmayı kaldır' : 'Öne çıkar'}</button></form>
          <form method="POST" action="/admin/posts/${post.id}/toggle-publish"><button>${post.is_published ? 'Yayından kaldır' : 'Yayına al'}</button></form>
          <form method="POST" action="/admin/posts/${post.id}/delete" onsubmit="return confirm('Silinsin mi?');"><button class="danger">Sil</button></form>
        </td>
      </tr>`;
    })
    .join('');

  const body = `
  <main class="admin-page">
    <div class="admin-head">
      <h1>Yönetim Paneli</h1>
      <div>
        <a class="btn" href="/admin/posts/new">+ Yeni İçerik</a>
        <form method="POST" action="/admin/logout" style="display:inline"><button class="btn-ghost">Çıkış</button></form>
      </div>
    </div>
    <p class="muted">Toplam ${posts.length} içerik · ${cities.filter((c) => c.is_active).length} şehir aktif</p>
    ${
      pending.length
        ? `<h2 class="section-title">🕓 Onay Bekleyenler (${pending.length})</h2>
           <table class="admin-table pending-table"><thead><tr><th></th><th>İçerik</th><th>İşlemler</th></tr></thead><tbody>${pendingRows}</tbody></table>`
        : ''
    }
    <h2 class="section-title">Tüm İçerikler</h2>
    <table class="admin-table">
      <thead><tr><th></th><th>İçerik</th><th>İşlemler</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </main>`;
  return layout({ title: 'Yönetim Paneli', body });
}

function postFormFields(post, categories, cities) {
  const p = post || {};
  return `
    <label>Şehir
      <select name="city_slug" required>
        ${cities.filter((c) => c.is_active).map((c) => `<option value="${c.slug}" ${p.city_slug === c.slug ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
      </select>
    </label>
    <label>Kategori
      <select name="category_slug" required>
        ${categories.map((c) => `<option value="${c.slug}" ${p.category_slug === c.slug ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}
      </select>
    </label>
    <label>Başlık<input type="text" name="title" required value="${esc(p.title || '')}"></label>
    <label>Açıklama<textarea name="description" rows="4" required>${esc(p.description || '')}</textarea></label>
    <label>Görsel (emoji)<input type="text" name="image_emoji" value="${esc(p.image_emoji || '🗞️')}" maxlength="4"></label>
    <label>Konum<input type="text" name="location" value="${esc(p.location || '')}"></label>
    <label>Tarih/saat (varsa)<input type="datetime-local" name="event_date" value="${p.event_date ? p.event_date.slice(0, 16) : ''}"></label>
    <label>Kaynak<input type="text" name="source" value="${esc(p.source || '')}"></label>
    <label>Kaynak linki (varsa)<input type="url" name="source_url" value="${esc(p.source_url || '')}" placeholder="https://..."></label>
    <label class="checkbox-row"><input type="checkbox" name="is_featured" ${p.is_featured ? 'checked' : ''}> Öne çıkan içerik</label>
    <label class="checkbox-row"><input type="checkbox" name="is_published" ${p.is_published !== false ? 'checked' : ''}> Yayında</label>
  `;
}

function adminPostForm({ post, categories, cities, isEdit }) {
  const body = `
  <main class="admin-page">
    <a class="back-link" href="/admin">← Panele dön</a>
    <h1>${isEdit ? 'İçeriği Düzenle' : 'Yeni İçerik'}</h1>
    <form method="POST" action="${isEdit ? `/admin/posts/${post.id}/edit` : '/admin/posts/new'}" class="admin-form post-form">
      ${postFormFields(post, categories, cities)}
      <button type="submit" class="btn">${isEdit ? 'Kaydet' : 'Yayınla'}</button>
    </form>
  </main>`;
  return layout({ title: isEdit ? 'İçeriği Düzenle' : 'Yeni İçerik', body });
}

module.exports = {
  esc,
  layout,
  homePage,
  feedPage,
  postDetailPage,
  legalPage,
  submitPostForm,
  submitPostSuccessPage,
  adminLoginPage,
  adminDashboard,
  adminPostForm,
};
