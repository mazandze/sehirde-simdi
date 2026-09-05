// lib/db.js
// Basit, bağımlılıksız dosya tabanlı veri katmanı.
// Şema, ileride Supabase/Postgres'e taşınacak şekilde tasarlandı (bkz. supabase-schema.sql).
'use strict';

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function readDb() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

// ---- cities ----
function getCities() {
  return readDb().cities;
}
function getCityBySlug(slug) {
  return readDb().cities.find((c) => c.slug === slug);
}

// ---- categories ----
function getCategories() {
  return readDb().categories;
}
function getCategoryBySlug(slug) {
  return readDb().categories.find((c) => c.slug === slug);
}

// ---- posts ----
function getPosts({ citySlug, citySlugs, categorySlug, q, onlyPublished = true } = {}) {
  let posts = readDb().posts;
  if (citySlug) posts = posts.filter((p) => p.city_slug === citySlug);
  if (citySlugs) posts = posts.filter((p) => citySlugs.includes(p.city_slug));
  if (categorySlug) posts = posts.filter((p) => p.category_slug === categorySlug);
  if (onlyPublished) posts = posts.filter((p) => p.is_published);
  if (q) {
    const needle = q.toLocaleLowerCase('tr-TR');
    posts = posts.filter(
      (p) =>
        p.title.toLocaleLowerCase('tr-TR').includes(needle) ||
        p.description.toLocaleLowerCase('tr-TR').includes(needle) ||
        p.location.toLocaleLowerCase('tr-TR').includes(needle)
    );
  }
  // En yeni üstte, öne çıkanlar en üstte
  posts.sort((a, b) => {
    if (!!b.is_featured !== !!a.is_featured) return b.is_featured ? 1 : -1;
    return new Date(b.created_at) - new Date(a.created_at);
  });
  return posts;
}

// Kategori çiplerinde gösterilecek sayaçlar: { [category_slug]: adet }
function getCategoryCounts(citySlug, q) {
  const posts = getPosts({ citySlug, q });
  const counts = {};
  for (const p of posts) counts[p.category_slug] = (counts[p.category_slug] || 0) + 1;
  return counts;
}

function getPostById(id) {
  return readDb().posts.find((p) => String(p.id) === String(id));
}
function getPostBySlug(citySlug, slug) {
  return readDb().posts.find((p) => p.city_slug === citySlug && p.slug === slug);
}

function nextId(list) {
  return list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

function slugify(str) {
  const map = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', İ: 'i', Ç: 'c', Ğ: 'g', Ö: 'o', Ş: 's', Ü: 'u' };
  return str
    .split('')
    .map((ch) => map[ch] || ch)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function createPost(input) {
  const db = readDb();
  const id = nextId(db.posts);
  const slugBase = slugify(input.title) || `icerik-${id}`;
  let slug = slugBase;
  let n = 1;
  while (db.posts.some((p) => p.city_slug === input.city_slug && p.slug === slug)) {
    n += 1;
    slug = `${slugBase}-${n}`;
  }
  const post = {
    id,
    slug,
    city_slug: input.city_slug,
    category_slug: input.category_slug,
    title: input.title,
    description: input.description || '',
    image_emoji: input.image_emoji || '🗞️',
    location: input.location || '',
    event_date: input.event_date || '',
    source: input.source || '',
    source_url: input.source_url || '',
    status: 'yayinda',
    submitted_by: 'admin',
    business_name: '',
    submitter_contact: '',
    is_published: input.is_published !== false,
    is_featured: !!input.is_featured,
    created_at: new Date().toISOString(),
  };
  db.posts.unshift(post);
  writeDb(db);
  return post;
}

// İşletmelerin herkese açık formdan gönderdiği içerik: doğrudan yayınlanmaz,
// admin onayına düşer (status: 'onay_bekliyor').
function submitPublicPost(input) {
  const db = readDb();
  const id = nextId(db.posts);
  const slugBase = slugify(input.title) || `icerik-${id}`;
  let slug = slugBase;
  let n = 1;
  while (db.posts.some((p) => p.city_slug === input.city_slug && p.slug === slug)) {
    n += 1;
    slug = `${slugBase}-${n}`;
  }
  const post = {
    id,
    slug,
    city_slug: input.city_slug,
    category_slug: input.category_slug,
    title: input.title,
    description: input.description || '',
    image_emoji: input.image_emoji || '🏪',
    location: input.location || '',
    event_date: input.event_date || '',
    source: input.business_name || 'İşletme bildirimi',
    source_url: '',
    status: 'onay_bekliyor',
    submitted_by: 'isletme',
    business_name: input.business_name || '',
    submitter_contact: input.submitter_contact || '',
    is_published: false,
    is_featured: false,
    created_at: new Date().toISOString(),
  };
  db.posts.unshift(post);
  writeDb(db);
  return post;
}

function getPendingPosts() {
  return readDb()
    .posts.filter((p) => p.status === 'onay_bekliyor')
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

function approvePost(id) {
  return updatePost(id, { is_published: true, status: 'yayinda' });
}
function rejectPost(id) {
  return updatePost(id, { is_published: false, status: 'reddedildi' });
}

function updatePost(id, updates) {
  const db = readDb();
  const idx = db.posts.findIndex((p) => String(p.id) === String(id));
  if (idx === -1) return null;
  db.posts[idx] = { ...db.posts[idx], ...updates };
  writeDb(db);
  return db.posts[idx];
}

function deletePost(id) {
  const db = readDb();
  const before = db.posts.length;
  db.posts = db.posts.filter((p) => String(p.id) !== String(id));
  writeDb(db);
  return db.posts.length < before;
}

// ---- admin_users ----
function getAdminByUsername(username) {
  return readDb().admin_users.find((u) => u.username === username);
}

module.exports = {
  readDb,
  writeDb,
  getCities,
  getCityBySlug,
  getCategories,
  getCategoryBySlug,
  getPosts,
  getCategoryCounts,
  getPostById,
  getPostBySlug,
  createPost,
  submitPublicPost,
  getPendingPosts,
  approvePost,
  rejectPost,
  updatePost,
  deletePost,
  getAdminByUsername,
  slugify,
};
