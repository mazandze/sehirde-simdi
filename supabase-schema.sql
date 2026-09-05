-- Şehirde Şimdi — Supabase/PostgreSQL şeması (MVP sonrası geçiş için)
-- Bu şema, mevcut data/db.json yapısıyla birebir uyumludur.
-- Ödeme sistemi bu aşamada YOK; ancak "sponsorlu/öne çıkan" alanları ileride
-- ücretli görünürlük özellikleri eklenebilecek şekilde şimdiden hazırlanmıştır.

create extension if not exists "uuid-ossp";

create table cities (
  id           uuid primary key default uuid_generate_v4(),
  slug         text unique not null,      -- örn: 'canakkale'
  name         text not null,             -- örn: 'Çanakkale'
  is_active    boolean not null default false,
  created_at   timestamptz not null default now()
);

create table categories (
  id           uuid primary key default uuid_generate_v4(),
  slug         text unique not null,      -- örn: 'konserler'
  name         text not null,             -- örn: 'Konserler'
  emoji        text,
  color        text,
  sort_order   int default 0,
  created_at   timestamptz not null default now()
);

create table admin_users (
  id            uuid primary key default uuid_generate_v4(),
  username      text unique not null,
  password_hash text not null,           -- bcrypt kullanılması önerilir
  role          text not null default 'editor', -- 'editor' | 'superadmin'
  created_at    timestamptz not null default now()
);

create table posts (
  id             uuid primary key default uuid_generate_v4(),
  city_id        uuid not null references cities(id) on delete cascade,
  category_id    uuid not null references categories(id) on delete restrict,
  slug           text not null,
  title          text not null,
  description    text not null default '',
  image_url      text,                    -- MVP'de emoji, ileride gerçek görsel URL'si
  location       text default '',
  event_date     timestamptz,             -- etkinlik/duyuru tarihi (varsa)
  source         text default '',         -- içeriğin kaynağı (işletme/kurum/duyuru)
  is_published   boolean not null default true,
  is_featured    boolean not null default false,

  -- İleride ücretli görünürlük için hazır alanlar (MVP'de kullanılmıyor):
  is_sponsored       boolean not null default false,
  sponsor_name       text,
  sponsor_tier       text,      -- örn: 'featured_business' | 'sponsored_event' | 'featured_deal'
  sponsor_active_until timestamptz,

  created_by     uuid references admin_users(id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  unique (city_id, slug)
);

create index idx_posts_city_category on posts (city_id, category_id);
create index idx_posts_published_created on posts (is_published, created_at desc);

-- Row Level Security (RLS) — genel okuma herkese açık, yazma yalnızca servis rolüyle
alter table posts enable row level security;
create policy "Herkes yayındaki içerikleri okuyabilir"
  on posts for select
  using (is_published = true);
