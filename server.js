// server.js
// Bağımlılıksız (yalnızca Node.js çekirdek modülleri) HTTP sunucusu.
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const db = require('./lib/db');
const auth = require('./lib/auth');
const render = require('./lib/render');

const PORT = process.env.PORT || 3000;
const SESSION_COOKIE = 'ss_session';

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  header.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx === -1) return;
    out[pair.slice(0, idx).trim()] = decodeURIComponent(pair.slice(idx + 1).trim());
  });
  return out;
}

function isAuthed(req) {
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE];
  if (!token) return false;
  return !!auth.getSession(token);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) req.destroy();
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function parseForm(req) {
  const raw = await readBody(req);
  return querystring.parse(raw);
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', ...headers });
  res.end(body);
}

function redirect(res, location, extraHeaders = {}) {
  res.writeHead(302, { Location: location, ...extraHeaders });
  res.end();
}

function notFound(res) {
  send(res, 404, render.layout({ title: 'Bulunamadı', body: '<main class="legal-page"><h1>404</h1><p>Aradığınız sayfa bulunamadı.</p><p><a href="/">Ana sayfaya dön</a></p></main>' }));
}

function serveStatic(req, res, pathname) {
  const filePath = path.join(__dirname, 'public', pathname.replace('/', ''));
  if (!filePath.startsWith(path.join(__dirname, 'public'))) return notFound(res);
  fs.readFile(filePath, (err, data) => {
    if (err) return notFound(res);
    const ext = path.extname(filePath);
    const type = ext === '.css' ? 'text/css' : ext === '.js' ? 'text/javascript' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type + '; charset=utf-8', 'Cache-Control': 'public, max-age=3600' });
    res.end(data);
  });
}

function requireAdmin(req, res) {
  if (!isAuthed(req)) {
    redirect(res, '/admin/login');
    return false;
  }
  return true;
}

async function handle(req, res) {
  const parsed = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsed.pathname);
  const method = req.method;
  const segments = pathname.split('/').filter(Boolean);

  // Static files
  if (pathname === '/styles.css') return serveStatic(req, res, pathname);

  // ---------- Home ----------
  if (pathname === '/' && method === 'GET') {
    const cities = db.getCities();
    return send(res, 200, render.homePage({ cities }));
  }

  // ---------- Legal pages ----------
  if (pathname === '/gizlilik-politikasi' && method === 'GET') {
    return send(
      res,
      200,
      render.legalPage(
        'Gizlilik Politikası',
        `<p>Şehirde Şimdi ("Platform"), Çanakkale ve ileride eklenecek diğer şehirlerdeki güncel içerikleri
        tek bir akışta sunan bir bilgilendirme platformudur. Bu sayfa, MVP/demo sürümü için hazırlanmış
        örnek bir gizlilik politikasıdır ve yayına alınmadan önce bir hukuk danışmanı tarafından gözden
        geçirilmelidir.</p>
        <h2>Toplanan Veriler</h2>
        <p>MVP sürümünde ziyaretçilerden kişisel veri toplanmamaktadır. İçerik gönderen işletmelerin
        ilettiği iletişim bilgileri yalnızca ilgili içeriğin yayınlanma amacıyla kullanılır.</p>
        <h2>Çerezler</h2>
        <p>Platform, oturum yönetimi (yönetim paneli girişi) amacıyla teknik çerezler kullanır. Ayrıntılar için
        Çerez Politikası sayfasını inceleyebilirsiniz.</p>
        <h2>İletişim</h2>
        <p>Sorularınız için site yöneticisiyle iletişime geçebilirsiniz.</p>`
      )
    );
  }
  if (pathname === '/kullanim-kosullari' && method === 'GET') {
    return send(
      res,
      200,
      render.legalPage(
        'Kullanım Koşulları',
        `<p>Bu platform demo/MVP aşamasındadır. İçerikler bilgilendirme amaçlıdır; tarih, konum ve
        detaylar değişebilir, güncel bilgi için ilgili kaynakla teyit edilmesi önerilir.</p>
        <h2>İçerik Sorumluluğu</h2>
        <p>Platformdaki ilanlar ve duyurular ilgili kaynaklarca sağlanır. Platform, üçüncü taraf
        içeriklerinin doğruluğunu garanti etmez.</p>
        <h2>Ticari İçerikler</h2>
        <p>İleride öne çıkan işletme, sponsorlu etkinlik ve öne çıkan kampanya gibi ücretli içerik
        seçenekleri sunulabilir; bu içerikler ilgili şekilde etiketlenecektir.</p>`
      )
    );
  }
  if (pathname === '/cerez-politikasi' && method === 'GET') {
    return send(
      res,
      200,
      render.legalPage(
        'Çerez Politikası',
        `<p>Platform yalnızca temel işlevsellik için (yönetim paneli oturum çerezi) çerez kullanır.
        Reklam veya izleme amaçlı üçüncü taraf çerezleri MVP sürümünde kullanılmamaktadır.</p>`
      )
    );
  }

  // ---------- Admin ----------
  if (pathname === '/admin/login' && method === 'GET') {
    return send(res, 200, render.adminLoginPage());
  }
  if (pathname === '/admin/login' && method === 'POST') {
    const form = await parseForm(req);
    const user = db.getAdminByUsername(form.username || '');
    if (!user || !auth.verifyPassword(form.password || '', user.password_hash)) {
      return send(res, 401, render.adminLoginPage('Kullanıcı adı veya şifre hatalı.'));
    }
    const token = auth.createSession(user.username);
    return redirect(res, '/admin', { 'Set-Cookie': `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax` });
  }
  if (pathname === '/admin/logout' && method === 'POST') {
    const cookies = parseCookies(req);
    if (cookies[SESSION_COOKIE]) auth.destroySession(cookies[SESSION_COOKIE]);
    return redirect(res, '/admin/login', { 'Set-Cookie': `${SESSION_COOKIE}=; Path=/; Max-Age=0` });
  }
  if (pathname === '/admin' && method === 'GET') {
    if (!requireAdmin(req, res)) return;
    const posts = db.getPosts({ onlyPublished: false }).filter((p) => p.status !== 'onay_bekliyor');
    const pending = db.getPendingPosts();
    return send(res, 200, render.adminDashboard({ posts, categories: db.getCategories(), cities: db.getCities(), pending }));
  }
  if (pathname === '/admin/posts/new' && method === 'GET') {
    if (!requireAdmin(req, res)) return;
    return send(res, 200, render.adminPostForm({ post: null, categories: db.getCategories(), cities: db.getCities(), isEdit: false }));
  }
  if (pathname === '/admin/posts/new' && method === 'POST') {
    if (!requireAdmin(req, res)) return;
    const form = await parseForm(req);
    db.createPost({
      city_slug: form.city_slug,
      category_slug: form.category_slug,
      title: form.title,
      description: form.description,
      image_emoji: form.image_emoji,
      location: form.location,
      event_date: form.event_date ? new Date(form.event_date).toISOString() : '',
      source: form.source,
      source_url: form.source_url,
      is_featured: form.is_featured === 'on',
      is_published: form.is_published === 'on',
    });
    return redirect(res, '/admin');
  }
  if (segments[0] === 'admin' && segments[1] === 'posts' && segments[3] === 'edit' && method === 'GET') {
    if (!requireAdmin(req, res)) return;
    const post = db.getPostById(segments[2]);
    if (!post) return notFound(res);
    return send(res, 200, render.adminPostForm({ post, categories: db.getCategories(), cities: db.getCities(), isEdit: true }));
  }
  if (segments[0] === 'admin' && segments[1] === 'posts' && segments[3] === 'edit' && method === 'POST') {
    if (!requireAdmin(req, res)) return;
    const form = await parseForm(req);
    db.updatePost(segments[2], {
      city_slug: form.city_slug,
      category_slug: form.category_slug,
      title: form.title,
      description: form.description,
      image_emoji: form.image_emoji,
      location: form.location,
      event_date: form.event_date ? new Date(form.event_date).toISOString() : '',
      source: form.source,
      source_url: form.source_url,
      is_featured: form.is_featured === 'on',
      is_published: form.is_published === 'on',
    });
    return redirect(res, '/admin');
  }
  if (segments[0] === 'admin' && segments[1] === 'posts' && segments[3] === 'delete' && method === 'POST') {
    if (!requireAdmin(req, res)) return;
    db.deletePost(segments[2]);
    return redirect(res, '/admin');
  }
  if (segments[0] === 'admin' && segments[1] === 'posts' && segments[3] === 'toggle-publish' && method === 'POST') {
    if (!requireAdmin(req, res)) return;
    const post = db.getPostById(segments[2]);
    if (post) db.updatePost(segments[2], { is_published: !post.is_published });
    return redirect(res, '/admin');
  }
  if (segments[0] === 'admin' && segments[1] === 'posts' && segments[3] === 'toggle-feature' && method === 'POST') {
    if (!requireAdmin(req, res)) return;
    const post = db.getPostById(segments[2]);
    if (post) db.updatePost(segments[2], { is_featured: !post.is_featured });
    return redirect(res, '/admin');
  }
  if (segments[0] === 'admin' && segments[1] === 'posts' && segments[3] === 'approve' && method === 'POST') {
    if (!requireAdmin(req, res)) return;
    db.approvePost(segments[2]);
    return redirect(res, '/admin');
  }
  if (segments[0] === 'admin' && segments[1] === 'posts' && segments[3] === 'reject' && method === 'POST') {
    if (!requireAdmin(req, res)) return;
    db.rejectPost(segments[2]);
    return redirect(res, '/admin');
  }

  // ---------- İşletme içerik gönderimi (herkese açık, onay bekler) ----------
  if (segments.length === 2 && segments[1] === 'icerik-ekle' && method === 'GET') {
    const city = db.getCityBySlug(segments[0]);
    if (!city || !city.is_active) return notFound(res);
    return send(res, 200, render.submitPostForm({ city, categories: db.getCategories() }));
  }
  if (segments.length === 2 && segments[1] === 'icerik-ekle' && method === 'POST') {
    const city = db.getCityBySlug(segments[0]);
    if (!city || !city.is_active) return notFound(res);
    const form = await parseForm(req);
    const required = ['category_slug', 'title', 'description', 'location', 'business_name', 'submitter_contact'];
    const missing = required.some((f) => !form[f] || !String(form[f]).trim());
    if (missing || !db.getCategoryBySlug(form.category_slug)) {
      return send(
        res,
        400,
        render.submitPostForm({ city, categories: db.getCategories(), error: 'Lütfen tüm zorunlu alanları doldurun.', values: form })
      );
    }
    db.submitPublicPost({
      city_slug: city.slug,
      category_slug: form.category_slug,
      title: form.title,
      description: form.description,
      location: form.location,
      event_date: form.event_date ? new Date(form.event_date).toISOString() : '',
      image_emoji: form.image_emoji,
      business_name: form.business_name,
      submitter_contact: form.submitter_contact,
    });
    return send(res, 200, render.submitPostSuccessPage(city));
  }

  // ---------- City / category / post routes ----------
  // /:city
  if (segments.length === 1 && method === 'GET') {
    const city = db.getCityBySlug(segments[0]);
    if (!city || !city.is_active) return notFound(res);
    const q = parsed.query.q;
    const posts = db.getPosts({ citySlug: city.slug, q });
    const categoryCounts = db.getCategoryCounts(city.slug, q);
    return send(res, 200, render.feedPage({ city, categories: db.getCategories(), category: null, posts, q, categoryCounts }));
  }
  // /:city/icerik/:slug
  if (segments.length === 3 && segments[1] === 'icerik' && method === 'GET') {
    const city = db.getCityBySlug(segments[0]);
    if (!city || !city.is_active) return notFound(res);
    const post = db.getPostBySlug(city.slug, segments[2]);
    if (!post || !post.is_published) return notFound(res);
    const category = db.getCategoryBySlug(post.category_slug);
    return send(res, 200, render.postDetailPage({ city, category, post }));
  }
  // /:city/:category
  if (segments.length === 2 && method === 'GET') {
    const city = db.getCityBySlug(segments[0]);
    if (!city || !city.is_active) return notFound(res);
    const category = db.getCategoryBySlug(segments[1]);
    if (!category) return notFound(res);
    const q = parsed.query.q;
    const posts = db.getPosts({ citySlug: city.slug, categorySlug: category.slug, q });
    const categoryCounts = db.getCategoryCounts(city.slug, q);
    return send(res, 200, render.feedPage({ city, categories: db.getCategories(), category, posts, q, categoryCounts }));
  }

  return notFound(res);
}

const server = http.createServer((req, res) => {
  handle(req, res).catch((err) => {
    console.error(err);
    send(res, 500, '<h1>500</h1><p>Sunucu hatası.</p>');
  });
});

server.listen(PORT, () => {
  console.log(`Şehirde Şimdi çalışıyor: http://localhost:${PORT}`);
});

module.exports = server;
