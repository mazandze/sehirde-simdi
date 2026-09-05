# Şehirde Şimdi — MVP

"Şehrinde şimdi ne oluyor?" — seçilen şehirdeki etkinlik, konser, sinema, yeme-içme,
indirim, iş ilanı, emlak, trafik, belediye duyurusu ve şehir gündemi içeriklerini
tek bir sürekli akışta gösteren mobil öncelikli web uygulaması.

## Neden bu teknik yaklaşım kullanıldı?

İstediğin tercih sırası Next.js + TypeScript + Tailwind + Supabase idi ve bu doğru
uzun vadeli yön. Ancak bu kod çalışma ortamımda **internet erişimi yok**, yani
`npm install` ile Next.js/Supabase paketlerini indiremiyorum — bu yüzden gerçek bir
`next build` çalıştırıp senin için doğrulayamazdım (istediğin gibi "build/test yap,
hataları düzelt" sözünü tam tutabilmek için).

Bunun yerine, **sıfır bağımlılıklı, yalnızca Node.js'in kendi modüllerini kullanan**
bir sunucu yazdım. Böylece kodu bu ortamda gerçekten çalıştırıp uçtan uca test
edebildim (giriş → şehir seç → kategori seç → akışı gör → içeriğe gir → admin'den
içerik ekle/düzenle/sil/öne çıkar/yayından kaldır — hepsini gerçek isteklerle test
ettim, hepsi çalışıyor). Next.js'te olduğu gibi App Router mantığına yakın, temiz
dosya/URL yapısı kurdum; ileride Next.js'e taşımak istersen yapı doğrudan haritalanır
(bkz. aşağıdaki "İleride Next.js/Supabase'e geçiş" bölümü).

## Nasıl çalıştırılır

```bash
npm run seed   # data/db.json içine 37 demo içerik oluşturur (bir kez, veya sıfırlamak istediğinde)
npm start      # http://localhost:3000
```

Hiçbir `npm install` gerekmez — proje harici pakete ihtiyaç duymuyor.

## Test ettiğim akış (gerçekten çalıştırdım)

1. `/` → şehir seçimi (Çanakkale aktif, diğerleri "yakında")
2. `/canakkale` → tüm kategori akışı, en yeni üstte, arama ve kategori filtreleri
3. `/canakkale/etkinlikler`, `/canakkale/konserler`, `/canakkale/indirimler` vb. → kategoriye göre akış
4. `/canakkale/icerik/:slug` → detay sayfası (görsel, başlık, kategori, açıklama, konum, tarih, kaynak, paylaş butonu)
5. `/admin/login` → giriş (demo hesap aşağıda)
6. `/admin` → içerik listesi, düzenle / öne çıkar / yayından kaldır / sil işlemleri
7. `/admin/posts/new` → yeni içerik ekleme formu → kaydedince akışta anında görünüyor
8. Yayından kaldırılan içerik → herkese açık detay sayfası 404 veriyor (doğru davranış)
9. `/gizlilik-politikasi`, `/kullanim-kosullari`, `/cerez-politikasi` → yasal sayfalar

## Kapsam: Türkiye geneli (81 il)

Sistem artık 81 ilin tamamında aktif — her il için `/il-slug`, `/il-slug/kategori`,
`/il-slug/icerik-ekle` otomatik çalışır. Ana sayfadaki şehir seçimi, 81 seçenek arasında
hızlıca gezinebilmek için aramalı bir listeye dönüştürüldü.

**İçerik durumu şehir bazında farklı:**
**Şu anda 81 ilin 80'i gerçek içerikli** — resmi kaynaklardan (belediyeler, valilikler, T.C.
Kültür ve Turizm Bakanlığı, güvenilir haber siteleri) araştırılıp kendi cümlelerimizle
özetlenmiş içerik, her birinde kaynak linki var. **Sadece Muş** boş kaldı; o il için resmi
kanallarda somut/güncel etkinlik bilgisi bulunamadı — uydurma içerik eklenmedi.

Not: Bazı küçük iller için içerik zayıf/tek kaynaklı olabilir (nüfusu az illerde resmi
kaynaklarda az veri var). Bu içerikler bir anlık görüntü — zamanla eskiyecek, ihtiyaç
halinde tekrar araştırılabilir. 81 il için uydurma işletme/etkinlik içeriği
  doldurmak projenin "gerçek içeriği izinsiz kopyalama/uydurmama" ilkesine aykırı olurdu. Bu
  iller şu an boş durum mesajı ve "işletmeniz mi var, ekleyin" çağrısıyla açılıyor — talep
  geldikçe ("İzmir için güncel içerik araştır" gibi) o ilin resmi kaynaklarını araştırıp
  gerçek içerik eklenebilir.

## İçerik güncellemesi: gerçek veri + işletme başvuruları

Etkinlikler, konserler, belediye duyuruları, trafik ve şehir gündemi kategorilerindeki
içerikler artık **gerçek** — Çanakkale Belediyesi'nin resmi sitesi (canakkale.bel.tr) ve
T.C. Kültür ve Turizm Bakanlığı'nın Troya Kültür Yolu Festivali duyurularından araştırılıp
kendi cümlelerimizle özetlendi. Her birinde kaynak adı ve kaynak linki (`source_url`) var;
detay sayfasında tıklanabilir link olarak görünüyor. Bu içerik zamanla eskiyecek bir anlık
görüntü — güncel tutmak için "Çanakkale için güncel içerikleri tekrar araştır" diyerek tekrar
isteyebilirsin; otomatik/zamanlanmış scraping kurulu değil (brief'teki "ilk aşamada otomatik
scraping yapma" kuralı gereği).

Sinema, yeme-içme, indirimler, iş ilanları ve emlak kategorileri hâlâ demo içerik içeriyor —
işletmeler kendi içeriklerini gönderdikçe gerçek verilerle dolacak:

`/canakkale/icerik-ekle` herkese açık bir form. Gönderilen içerik **doğrudan yayınlanmaz**,
`onay_bekliyor` durumunda admin panelindeki "🕓 Onay Bekleyenler" kutusuna düşer; sen onaylayana
veya reddedene kadar herkese açık akışta görünmez.

## Google Analytics ekleme

`lib/render.js` dosyasının en üstünde şu satır var:

```js
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
```

Google Analytics hesabı açıp (analytics.google.com) bir "Veri Akışı" oluşturduğunda sana
`G-` ile başlayan bir Ölçüm Kimliği (Measurement ID) verilir. O kodu kopyalayıp yukarıdaki
satırdaki `G-XXXXXXXXXX` yerine yapıştırman yeterli — placeholder değerdeyken izleme kodu
hiç eklenmiyor, gerçek ID girince tüm sayfalarda otomatik aktif oluyor.

## Demo admin girişi

- Kullanıcı adı: `admin`
- Şifre: `canakkale2026`

**Önemli:** Canlıya almadan önce bu şifreyi değiştir (`lib/auth.js` içindeki
`hashPassword` fonksiyonuyla yeni hash üretip `data/db.json` içindeki
`admin_users[0].password_hash` alanına yazman yeterli).

## Veri modeli (cities / categories / posts / admin_users)

`data/db.json` dört tabloyu da içerir. `lib/db.js` bu dosyayı okuyup yazan tüm
fonksiyonları barındırır (`getPosts`, `createPost`, `updatePost`, `deletePost`, ...).
Yeni şehir eklemek için `data/seed.js` içindeki `cities` dizisine satır eklemen ve
`is_active: true` yapman yeterli — kategori/post yapısı hiç değişmeden yeni şehri
destekler.

## Önemli sınırlama: Vercel gibi sunucusuz ortamlarda kalıcılık

`data/db.json` bir dosya. Bunu bir sunucuya (Railway, Render, bir VPS, kendi
sunucun) koyarsan admin panelinden yaptığın ekleme/silme kalıcı olur. **Ancak
Vercel gibi sunucusuz (serverless) platformlarda dosya sistemi salt-okunur ve her
istekte sıfırlanır** — yani admin panelinden içerik eklesen bile bir süre sonra
kaybolur. Demo/gösterim için sorun değil, ama gerçek kullanım için bir sonraki
adımda gerçek bir veritabanına geçmen gerekiyor.

## İleride Next.js/Supabase'e geçiş

1. `supabase-schema.sql` dosyasını Supabase projenin SQL Editor'ünde çalıştır
   (mobil tarayıcıdan da yapılabilir, kopyala-yapıştır yeterli).
2. `lib/db.js` içindeki fonksiyonları aynı isimlerle, içeride `@supabase/supabase-js`
   sorguları yapacak şekilde değiştir — geri kalan tüm sayfa/route kodu değişmeden
   çalışmaya devam eder, çünkü render katmanı bu fonksiyonların döndürdüğü veri
   şekline bağımlı, veri kaynağına değil.
3. `supabase-schema.sql` içinde `is_sponsored`, `sponsor_tier`, `sponsor_active_until`
   gibi alanlar şimdiden hazır — "öne çıkan işletme / sponsorlu etkinlik / öne çıkan
   kampanya" özelliklerini ödeme sistemi eklerken bu alanlar üzerinden kolayca
   bağlayabilirsin (örn. Stripe/iyzico webhook'u bu alanları günceller).

## Dosya yapısı

```
server.js          → tüm route'lar (SEO uyumlu URL'ler dahil)
lib/db.js           → veri katmanı (cities/categories/posts/admin_users)
lib/auth.js         → şifre hash + oturum yönetimi
lib/render.js       → sayfa HTML şablonları
public/styles.css   → tasarım
data/seed.js        → demo veri üretici (37 kurgusal içerik)
data/db.json        → çalışma zamanı veritabanı (seed'den üretilir)
supabase-schema.sql → gelecekteki Postgres şeması
```

## Deploy (bilgisayarsız, telefondan)

En basit yol: bir Node.js barındırma servisi (Railway, Render gibi) GitHub reponu
bağla, "Start command" olarak `npm start`, "Build command" boş bırakılabilir
(bağımlılık yok). Vercel kullanacaksan yukarıdaki kalıcılık uyarısını oku — demo
göstermek için sorun yok, gerçek admin kullanımı için önce Supabase geçişini yap.
