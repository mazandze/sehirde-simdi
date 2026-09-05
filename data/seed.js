// data/seed.js
// Bu dosyayı çalıştırınca data/db.json sıfırdan oluşturulur.
// İçerik durumu:
// - Etkinlikler, konserler, belediye duyuruları, trafik ve şehir gündemi kategorilerindeki
//   içerikler GERÇEKTİR: Çanakkale Belediyesi'nin resmi sitesi ve T.C. Kültür ve Turizm
//   Bakanlığı'nın Troya Kültür Yolu Festivali duyurularından derlenip kendi cümlelerimizle
//   özetlenmiştir. Her birinde kaynak ve kaynak linki (source_url) bulunur.
// - Sinema, yeme-içme, indirimler, iş ilanları ve emlak kategorilerindeki içerikler DEMO'dur
//   (kurgusal işletme adları). Bu kategoriler, işletmelerin /canakkale/icerik-ekle sayfasından
//   kendi içeriklerini gönderebileceği self-servis akışla gerçek verilerle dolacak.
'use strict';

const fs = require('fs');
const path = require('path');

const cities = [
  { slug: 'adana', name: 'Adana', is_active: true },
  { slug: 'adiyaman', name: 'Adıyaman', is_active: true },
  { slug: 'afyonkarahisar', name: 'Afyonkarahisar', is_active: true },
  { slug: 'agri', name: 'Ağrı', is_active: true },
  { slug: 'aksaray', name: 'Aksaray', is_active: true },
  { slug: 'amasya', name: 'Amasya', is_active: true },
  { slug: 'ankara', name: 'Ankara', is_active: true },
  { slug: 'antalya', name: 'Antalya', is_active: true },
  { slug: 'ardahan', name: 'Ardahan', is_active: true },
  { slug: 'artvin', name: 'Artvin', is_active: true },
  { slug: 'aydin', name: 'Aydın', is_active: true },
  { slug: 'balikesir', name: 'Balıkesir', is_active: true },
  { slug: 'bartin', name: 'Bartın', is_active: true },
  { slug: 'batman', name: 'Batman', is_active: true },
  { slug: 'bayburt', name: 'Bayburt', is_active: true },
  { slug: 'bilecik', name: 'Bilecik', is_active: true },
  { slug: 'bingol', name: 'Bingöl', is_active: true },
  { slug: 'bitlis', name: 'Bitlis', is_active: true },
  { slug: 'bolu', name: 'Bolu', is_active: true },
  { slug: 'burdur', name: 'Burdur', is_active: true },
  { slug: 'bursa', name: 'Bursa', is_active: true },
  { slug: 'canakkale', name: 'Çanakkale', is_active: true },
  { slug: 'cankiri', name: 'Çankırı', is_active: true },
  { slug: 'corum', name: 'Çorum', is_active: true },
  { slug: 'denizli', name: 'Denizli', is_active: true },
  { slug: 'diyarbakir', name: 'Diyarbakır', is_active: true },
  { slug: 'duzce', name: 'Düzce', is_active: true },
  { slug: 'edirne', name: 'Edirne', is_active: true },
  { slug: 'elazig', name: 'Elazığ', is_active: true },
  { slug: 'erzincan', name: 'Erzincan', is_active: true },
  { slug: 'erzurum', name: 'Erzurum', is_active: true },
  { slug: 'eskisehir', name: 'Eskişehir', is_active: true },
  { slug: 'gaziantep', name: 'Gaziantep', is_active: true },
  { slug: 'giresun', name: 'Giresun', is_active: true },
  { slug: 'gumushane', name: 'Gümüşhane', is_active: true },
  { slug: 'hakkari', name: 'Hakkari', is_active: true },
  { slug: 'hatay', name: 'Hatay', is_active: true },
  { slug: 'igdir', name: 'Iğdır', is_active: true },
  { slug: 'isparta', name: 'Isparta', is_active: true },
  { slug: 'istanbul', name: 'İstanbul', is_active: true },
  { slug: 'izmir', name: 'İzmir', is_active: true },
  { slug: 'kahramanmaras', name: 'Kahramanmaraş', is_active: true },
  { slug: 'karabuk', name: 'Karabük', is_active: true },
  { slug: 'karaman', name: 'Karaman', is_active: true },
  { slug: 'kars', name: 'Kars', is_active: true },
  { slug: 'kastamonu', name: 'Kastamonu', is_active: true },
  { slug: 'kayseri', name: 'Kayseri', is_active: true },
  { slug: 'kirikkale', name: 'Kırıkkale', is_active: true },
  { slug: 'kirklareli', name: 'Kırklareli', is_active: true },
  { slug: 'kirsehir', name: 'Kırşehir', is_active: true },
  { slug: 'kilis', name: 'Kilis', is_active: true },
  { slug: 'kocaeli', name: 'Kocaeli', is_active: true },
  { slug: 'konya', name: 'Konya', is_active: true },
  { slug: 'kutahya', name: 'Kütahya', is_active: true },
  { slug: 'malatya', name: 'Malatya', is_active: true },
  { slug: 'manisa', name: 'Manisa', is_active: true },
  { slug: 'mardin', name: 'Mardin', is_active: true },
  { slug: 'mersin', name: 'Mersin', is_active: true },
  { slug: 'mugla', name: 'Muğla', is_active: true },
  { slug: 'mus', name: 'Muş', is_active: true },
  { slug: 'nevsehir', name: 'Nevşehir', is_active: true },
  { slug: 'nigde', name: 'Niğde', is_active: true },
  { slug: 'ordu', name: 'Ordu', is_active: true },
  { slug: 'osmaniye', name: 'Osmaniye', is_active: true },
  { slug: 'rize', name: 'Rize', is_active: true },
  { slug: 'sakarya', name: 'Sakarya', is_active: true },
  { slug: 'samsun', name: 'Samsun', is_active: true },
  { slug: 'siirt', name: 'Siirt', is_active: true },
  { slug: 'sinop', name: 'Sinop', is_active: true },
  { slug: 'sivas', name: 'Sivas', is_active: true },
  { slug: 'sanliurfa', name: 'Şanlıurfa', is_active: true },
  { slug: 'sirnak', name: 'Şırnak', is_active: true },
  { slug: 'tekirdag', name: 'Tekirdağ', is_active: true },
  { slug: 'tokat', name: 'Tokat', is_active: true },
  { slug: 'trabzon', name: 'Trabzon', is_active: true },
  { slug: 'tunceli', name: 'Tunceli', is_active: true },
  { slug: 'usak', name: 'Uşak', is_active: true },
  { slug: 'van', name: 'Van', is_active: true },
  { slug: 'yalova', name: 'Yalova', is_active: true },
  { slug: 'yozgat', name: 'Yozgat', is_active: true },
  { slug: 'zonguldak', name: 'Zonguldak', is_active: true },
];

const categories = [
  { slug: 'etkinlikler', name: 'Etkinlikler', emoji: '🎪', color: '#F2A93B' },
  { slug: 'konserler', name: 'Konserler', emoji: '🎵', color: '#8B5CF6' },
  { slug: 'sinema', name: 'Sinema', emoji: '🎬', color: '#E11D6A' },
  { slug: 'yeme-icme', name: 'Yeme & İçme', emoji: '🍽️', color: '#EA7317' },
  { slug: 'indirimler', name: 'İndirimler', emoji: '🏷️', color: '#0E9F6E' },
  { slug: 'is-ilanlari', name: 'İş İlanları', emoji: '💼', color: '#0EA5E9' },
  { slug: 'emlak', name: 'Emlak', emoji: '🏠', color: '#14B8A6' },
  { slug: 'trafik', name: 'Trafik / Yol Çalışmaları', emoji: '🚧', color: '#DC2626' },
  { slug: 'belediye', name: 'Belediye Duyuruları', emoji: '🏛️', color: '#4F46E5' },
  { slug: 'gundem', name: 'Şehir Gündemi', emoji: '📰', color: '#475569' },
];

const admin_users = [
  // Demo şifre: canakkale2026  (SHA-256 hash, bkz. lib/auth.js)
  {
    id: 1,
    username: 'admin',
    password_hash: '32284b71f5d7474a004f016693a7cea6297d40c2cb9d36f31d83750717024ad1',
    created_at: new Date().toISOString(),
  },
];

function dateAt(daysOffset, hour, minute = 0) {
  const dt = new Date();
  dt.setDate(dt.getDate() + daysOffset);
  dt.setHours(hour, minute, 0, 0);
  return dt.toISOString();
}
function hoursAgo(h) {
  const dt = new Date();
  dt.setHours(dt.getHours() - h);
  return dt.toISOString();
}

let postId = 1;
function p(category_slug, title, description, location, event_date, source, image_emoji, createdHoursAgo, extra = {}) {
  return {
    id: postId++,
    slug: '', // aşağıda dolduruluyor
    city_slug: 'canakkale',
    category_slug,
    title,
    description,
    image_emoji,
    location,
    event_date,
    source,
    source_url: '',
    status: 'yayinda', // 'yayinda' | 'onay_bekliyor' | 'reddedildi'
    submitted_by: 'admin', // 'admin' | 'isletme'
    is_published: true,
    is_featured: false,
    created_at: hoursAgo(createdHoursAgo),
    ...extra,
  };
}
// Çanakkale dışındaki şehirler için aynı yapı, city_slug parametreli
function pCity(city_slug, category_slug, title, description, location, event_date, source, image_emoji, createdHoursAgo, extra = {}) {
  return {
    id: postId++,
    slug: '',
    city_slug,
    category_slug,
    title,
    description,
    image_emoji,
    location,
    event_date,
    source,
    source_url: '',
    status: 'yayinda',
    submitted_by: 'admin',
    is_published: true,
    is_featured: false,
    created_at: hoursAgo(createdHoursAgo),
    ...extra,
  };
}

const raw = [
  // ---- ETKİNLİKLER (gerçek, Çanakkale Belediyesi ve T.C. Kültür ve Turizm Bakanlığı duyurularından derlendi) ----
  p('etkinlikler', 'Uluslararası Karma Sergi: "Gaia IV Myth"', 'Yazar ve Sanatçı Evi\'nde açılacak uluslararası karma sergi, mit temalı eserleri bir araya getiriyor.', 'Yazar ve Sanatçı Evi', dateAt(2, 17, 0), 'Çanakkale Belediyesi', '🖼️', 5, { source_url: 'https://www.canakkale.bel.tr/tr/sayfa/1135-tiyatro-etkinlikler', is_featured: true }),
  p('etkinlikler', '"Ege Kimin Hikayesi?" Sergisi', 'Seramik Müzesi\'nde Ege bölgesinin kültürel mirasını konu alan yeni bir sergi açılıyor.', 'Seramik Müzesi', dateAt(5, 17, 30), 'Çanakkale Belediyesi', '🏺', 9, { source_url: 'https://www.canakkale.bel.tr/tr/sayfa/1135-tiyatro-etkinlikler' }),
  p('etkinlikler', 'Karma Seramik Sergisi: "Şahmaran\'la Kesişen Yollar"', 'Seramik Müzesi\'nde yerli sanatçıların katıldığı karma seramik sergisi.', 'Seramik Müzesi', dateAt(12, 17, 30), 'Çanakkale Belediyesi', '🎨', 20, { source_url: 'https://www.canakkale.bel.tr/tr/sayfa/1135-tiyatro-etkinlikler' }),
  p('etkinlikler', 'Troya Kültür Yolu Festivali: Sergi ve Kısa Film Gösterimleri', 'Anadolu Hamidiye Tabyası Hangar\'da "Yaşayan Miras: Çanakkale Sergisi" ile kısa film gösterimleri 6 Eylül\'e kadar ziyaret edilebiliyor. Troya Müzesi\'nde ise "Osmanlı\'nın Mukaddes Emanetleri" sergisi yer alıyor.', 'Anadolu Hamidiye Tabyası / Troya Müzesi', '', 'T.C. Kültür ve Turizm Bakanlığı', '🏛️', 3, { source_url: 'https://www.takvim.com.tr/kultur-sanat/2026/08/26/canakkalede-9-gun-surecek-kultur-ve-sanat-soleni-basliyor', is_featured: true }),
  p('etkinlikler', 'KPSS Adayları İçin Ücretsiz Deneme Sınavı', 'Belediye, KPSS\'ye hazırlanan adaylar için iki oturumlu ücretsiz deneme sınavı düzenleyecek.', 'Çanakkale merkez', '', 'Çanakkale Belediyesi', '📝', 30, { source_url: 'https://www.canakkale.bel.tr/tr/sayfa/1140-tum-haberler/11790-kpss-adaylari-icin-ucretsiz-deneme-sinavi-iki-oturum-olarak-duzenlenecek' }),
  p('etkinlikler', 'Çocuk Köyü Etkinlikleri', 'Festival kapsamında Hamidiye Tabyası\'nda kurulan Çocuk Köyü\'nde çocuklara yönelik eğlenceli ve öğretici etkinlikler sürüyor.', 'Anadolu Hamidiye Tabyası', '', 'T.C. Kültür ve Turizm Bakanlığı', '🧒', 8, { source_url: 'https://www.takvim.com.tr/kultur-sanat/2026/08/26/canakkalede-9-gun-surecek-kultur-ve-sanat-soleni-basliyor' }),

  // ---- KONSERLER (gerçek) ----
  p('konserler', 'Türkiye Kültür Yolu Festivali: Ücretsiz Açık Hava Konserleri', 'Anadolu Hamidiye Tabyası Açık Hava Sahnesi\'nde 6 Eylül\'e kadar sürecek, bilet gerektirmeyen konser programı devam ediyor. Program rap, pop ve arabesk gibi farklı türlerden isimleri bir araya getiriyor.', 'Anadolu Hamidiye Tabyası Açık Hava Sahnesi', '', 'T.C. Kültür ve Turizm Bakanlığı', '🎤', 2, { source_url: 'https://marufkahvalti.com/blog/canakkale-kultur-yolu-festivali-2026', is_featured: true }),
  p('konserler', 'Çanakkale Boğaz Komutanlığı Bandosu Konseri', '30 Ağustos Zafer Bayramı kapsamında bando konseri, Hamidiye Tabyası Açık Hava Sahnesi\'nde gerçekleşiyor.', 'Anadolu Hamidiye Tabyası Açık Hava Sahnesi', '', 'T.C. Kültür ve Turizm Bakanlığı', '🎺', 1, { source_url: 'https://www.takvim.com.tr/kultur-sanat/2026/08/26/canakkalede-9-gun-surecek-kultur-ve-sanat-soleni-basliyor' }),
  p('konserler', 'HoonDoo Grubundan Özel Repertuvar', 'Güney Koreli HoonDoo grubu, festival kapsamında Türkçe şarkılardan oluşan özel bir repertuvarla sahne alıyor.', 'ÇOMÜ İÇDAŞ Kara Yusuf Kongre Merkezi', '', 'T.C. Kültür ve Turizm Bakanlığı', '🎸', 6, { source_url: 'https://www.takvim.com.tr/kultur-sanat/2026/08/26/canakkalede-9-gun-surecek-kultur-ve-sanat-soleni-basliyor' }),
  p('konserler', 'Kanun Piyano Konseri', 'Çanakkale Belediyesi Kültür Merkezi\'nde kanun ve piyano düetinden oluşan bir konser programı.', 'Çanakkale Belediyesi Kültür Merkezi', dateAt(8, 19, 0), 'Çanakkale Belediyesi', '🎹', 14, { source_url: 'https://www.canakkale.bel.tr/tr/sayfa/1135-tiyatro-etkinlikler' }),

  // ---- BELEDİYE DUYURULARI (gerçek) ----
  p('belediye', 'Eylül Ayı Kültür ve Sanat Etkinlikleri Açıklandı', 'Belediye, Eylül ayı boyunca sürecek kültür ve sanat programının detaylarını duyurdu.', 'Çanakkale geneli', '', 'Çanakkale Belediyesi', '📅', 4, { source_url: 'https://www.canakkale.bel.tr/tr/sayfa/1140-tum-haberler/11808-eylul-ayi-kultur-ve-sanat-etkinlikleri', is_featured: true }),
  p('belediye', '"Bütçe Benim" Anketi İçin Bilgilendirme Toplantısı', 'Belediye, 2027 bütçe sürecine vatandaş katılımını almak amacıyla "Bütçe Benim" anketi kapsamında bilgilendirme toplantısı düzenliyor.', 'Çanakkale Belediyesi', '', 'Çanakkale Belediyesi', '🗳️', 16, { source_url: 'https://www.canakkale.bel.tr/tr/sayfa/1140-tum-haberler/11778-butce-benim-canakkalenin-gelecegine-birlikte-karar-veriyoruz' }),
  p('belediye', 'Kapalı Yol Bilgilendirmesi', 'Belediye, devam eden çalışmalar nedeniyle bazı güzergahlarda geçici kapatmalar olduğunu duyurdu. Güncel güzergah bilgisi için belediyenin resmi kanallarını takip edebilirsiniz.', 'Çanakkale merkez', '', 'Çanakkale Belediyesi', '🚧', 10, { source_url: 'https://www.canakkale.bel.tr/' }),

  // ---- TRAFİK / YOL ÇALIŞMALARI (gerçek) ----
  p('trafik', 'Üstyapı Çalışmaları Hız Kesmeden Sürüyor', 'Belediye ekipleri, şehir genelinde yol üstyapı yenileme çalışmalarını sürdürüyor. Çalışma yapılan güzergahlarda geçici trafik düzenlemeleri olabilir.', 'Çanakkale geneli', '', 'Çanakkale Belediyesi', '🚧', 12, { source_url: 'https://www.canakkale.bel.tr/tr/sayfa/1140-tum-haberler/11796-ustyapi-calismalari-hiz-kesmeden-suruyor', is_featured: true }),

  // ---- ŞEHİR GÜNDEMİ (gerçek) ----
  p('gundem', 'Çin Başkonsolosluğu Heyetinden Belediyeye Ziyaret', 'Çin Halk Cumhuriyeti İstanbul Başkonsolosluğu heyeti, Çanakkale Belediyesi\'ni ziyaret etti.', 'Çanakkale Belediyesi', '', 'Çanakkale Belediyesi', '🤝', 26, { source_url: 'https://www.canakkale.bel.tr/tr/sayfa/1140-tum-haberler/11801-cin-halk-cumhuriyeti-istanbul-baskonsoloslugu-heyetinden-canakkale-belediyesine-ziyaret' }),
  p('gundem', 'Belediyespor Yaz Spor Okulu Kapanış Töreni', 'Çanakkale Belediyespor\'un düzenlediği yaz spor okulu, kapanış töreniyle tamamlandı.', 'Çanakkale', '', 'Çanakkale Belediyesi', '🏅', 34, { source_url: 'https://www.canakkale.bel.tr/tr/sayfa/1140-tum-haberler/11802-canakkale-belediyespor-yaz-spor-okulu-kapanis-toreni-gerceklestirildi' }),
  p('gundem', 'Troya Sosyal Yaşam Evi\'nde Çocuk Akademisi', 'Troya Sosyal Yaşam Evi\'nde düzenlenen çocuk akademisi çalışması tamamlandı.', 'Troya Sosyal Yaşam Evi', '', 'Çanakkale Belediyesi', '📚', 45, { source_url: 'https://www.canakkale.bel.tr/tr/sayfa/1140-tum-haberler/11792-troya-sosyal-yasam-evinde-cocuk-akademisi-calismasi-duzenlendi' }),

  // ---- SİNEMA (demo — gerçek gösterim verisi işletme/sinema onayı sonrası eklenecek) ----
  p('sinema', '"Rüzgarın İzinde" Gösterimi', 'Yerli dramanın vizyon haftası gösterimleri.', 'Sahil Sineması, Salon 1', daysFromNowCompat(0, 19), 'Sinema Programı', '🎬', 2),
  p('sinema', 'Açık Hava Sineması: Klasikler Gecesi', 'Sahilde açık havada klasik film gösterimi, battaniyenizi getirin.', 'Kordon Açık Alan', daysFromNowCompat(4, 20), 'Şehir Etkinlik Takvimi', '🍿', 15),
  p('sinema', 'Belgesel Günleri: Boğaz ve Tarih', 'Bölge tarihini konu alan belgesel gösterim serisi.', 'Halk Eğitim Merkezi Salonu', daysFromNowCompat(8, 18), 'Kültür Merkezi', '🎞️', 33),

  // ---- YEME & İÇME (demo — işletmeler kendi içeriğini gönderdikçe gerçek verilerle değişecek) ----
  p('yeme-icme', 'Balık Ekmek Teknesi Yeni Menü', 'Kordon\'daki balık ekmek teknesinde mevsimlik yeni menü tanıtıldı.', 'Kordon İskele Önü', '', 'İşletme Bildirimi', '🐟', 6),
  p('yeme-icme', 'Sahil Kahvecisi Kahvaltı Saatleri Güncellendi', 'Hafta sonu kahvaltı servisi 08:00-13:00 arasına genişletildi.', 'Kordon Caddesi', '', 'İşletme Bildirimi', '☕', 10),
  p('yeme-icme', 'Zeytinyağlı Sofrası Haftalık Menü', 'Bu haftaki ev yemekleri menüsü yayınlandı.', 'Fevzipaşa Mahallesi', '', 'İşletme Bildirimi', '🍽️', 14),
  p('yeme-icme', 'Yeni Açılan Pastane: Tatlı Köşe', 'Şehir merkezinde yeni bir pastane hizmete açıldı.', 'Çarşı Caddesi', '', 'Yerel Duyuru', '🍰', 22),
  p('yeme-icme', 'Kahve Dükkanı Canlı Müzik Akşamları', 'Her Cuma akşamı canlı müzik eşliğinde kahve keyfi.', 'Kayserili Ahmet Paşa Mahallesi', daysFromNowCompat(2, 20), 'İşletme Bildirimi', '🎶', 18),

  // ---- İNDİRİMLER (demo) ----
  p('indirimler', 'Kırtasiyede Okula Dönüş Kampanyası', 'Defter ve kalem setlerinde %20 indirim.', 'Çarşı, İnönü Caddesi', daysFromNowCompat(10, 0), 'İşletme Bildirimi', '🏷️', 7),
  p('indirimler', 'Spor Mağazasında Sezon Sonu İndirimi', 'Seçili ürünlerde %30\'a varan indirim fırsatı.', 'Atatürk Caddesi', daysFromNowCompat(15, 0), 'İşletme Bildirimi', '👟', 16),
  p('indirimler', 'Bisiklet Kiralamada Öğrenci İndirimi', 'Öğrenci kimliğiyle günlük kiralamalarda %25 indirim.', 'Kordon Bisiklet Yolu', '', 'İşletme Bildirimi', '🚲', 24),
  p('indirimler', 'Optikte İkinci Gözlüğe Özel Fiyat', 'İlk gözlük alımında ikinci çift için özel kampanya.', 'Çarşı Merkezi', daysFromNowCompat(20, 0), 'İşletme Bildirimi', '👓', 44),

  // ---- İŞ İLANLARI (demo) ----
  p('is-ilanlari', 'Kafe İçin Barista Aranıyor', 'Kordon üzerindeki bir kafe için deneyimli barista aranıyor.', 'Kordon Caddesi', '', 'İşletme İlanı', '💼', 9),
  p('is-ilanlari', 'Otelde Resepsiyon Görevlisi Alınacak', 'Sezonluk çalışacak, İngilizce bilen resepsiyon personeli aranıyor.', 'Şehir Merkezi', '', 'İşletme İlanı', '🏨', 19),
  p('is-ilanlari', 'Muhasebe Bürosunda Stajyer Aranıyor', 'Üniversite öğrencileri için yarı zamanlı staj imkanı.', 'Merkez İş Merkezi', '', 'İşletme İlanı', '🧾', 27),
  p('is-ilanlari', 'Restoranda Aşçı Yardımcısı Alınacak', 'Vardiyalı çalışacak aşçı yardımcısı aranıyor.', 'Kordon Bölgesi', '', 'İşletme İlanı', '👨‍🍳', 35),

  // ---- EMLAK (demo) ----
  p('emlak', 'Kordon Yakınında Kiralık 2+1 Daire', 'Deniz manzaralı, eşyalı, kiralık daire ilanı.', 'Kordon Mahallesi', '', 'İlan Sahibi', '🏠', 11),
  p('emlak', 'Şehir Merkezinde Satılık Dükkan', 'Cadde üzerinde, yüksek yaya trafiğine sahip satılık işyeri.', 'İnönü Caddesi', '', 'İlan Sahibi', '🏬', 28),
  p('emlak', 'Öğrenciye Uygun Kiralık Stüdyo Daire', 'Kampüse yakın, ulaşımı kolay stüdyo daire kiralık.', 'ÇOMÜ Kampüs Çevresi', '', 'İlan Sahibi', '🏢', 37),

  // ============================================================
  // DİĞER BÜYÜK ŞEHİRLER — gerçek, resmi kaynaklardan derlenmiş içerik
  // (İBB, Ankara BB, İzmir BB, Antalya BB, Bursa BB ve haber siteleri)
  // ============================================================

  // ---- İSTANBUL ----
  pCity('istanbul', 'etkinlikler', 'Taste and the City Gastronomi Festivali', 'Gastronomi ve şehir kültürünü bir araya getiren festivalde ziyaretçiler farklı lezzetleri deneyimleme fırsatı buluyor.', 'İstanbul', dateAt(6, 12, 0), 'Yerel Haber', '🍴', 3, { source_url: 'https://www.birgun.net/haber/istanbulda-eylul-ayi-festival-takvimi-uc-farkli-etkinlik-duzenlenecek-729911', is_featured: true }),
  pCity('istanbul', 'etkinlikler', 'İstanbul Cocktail Festival ALL STAR', 'Kokteyl kültürünü merkeze alan festivalde farklı içecek deneyimleri, gastronomi ve müzik bir araya geliyor.', 'İstanbul', dateAt(20, 20, 0), 'Yerel Haber', '🍹', 8, { source_url: 'https://www.birgun.net/haber/istanbulda-eylul-ayi-festival-takvimi-uc-farkli-etkinlik-duzenlenecek-729911' }),
  pCity('istanbul', 'etkinlikler', 'İstanbul Oktoberfest', 'Eylül ayının son festival etkinliği olarak İstanbul Oktoberfest düzenleniyor.', 'İstanbul', '', 'Yerel Haber', '🍺', 12, { source_url: 'https://www.birgun.net/haber/istanbulda-eylul-ayi-festival-takvimi-uc-farkli-etkinlik-duzenlenecek-729911' }),
  pCity('istanbul', 'etkinlikler', 'Eylül Ayı Tiyatro Programı', 'Kadıköy Belediyesi Selamiçeşme Özgürlük Parkı ve kentin çeşitli sahnelerinde eylül boyunca 15 farklı oyun sahnelenecek.', 'Kadıköy ve çeşitli sahneler', dateAt(2, 21, 0), 'Yerel Haber', '🎭', 1, { source_url: 'https://onedio.com/haber/eylul-2026-istanbul-tiyatro-takvimi-ay-boyunca-sahnelenecek-15-oyun-1377830' }),

  // ---- ANKARA ----
  pCity('ankara', 'etkinlikler', 'Ankara Dondurma Tatlı Fuarı', 'Sektörün önde gelen markalarını ve üreticilerini bir araya getiren fuar, Altınpark Expo Center\'da düzenleniyor.', 'Altınpark Expo Center', dateAt(24, 10, 0), 'Yerel Haber', '🍦', 5, { source_url: 'https://isacoturoglu.com.tr/akm-fuar/ankara-fuar-takvimi-2026.html', is_featured: true }),
  pCity('ankara', 'etkinlikler', 'Ankara Coffee Festivali', 'Kahve kültürünü Başkentlilerle buluşturan festival, Bilkent Center\'da gerçekleştiriliyor.', 'Bilkent Center', dateAt(25, 11, 0), 'Yerel Haber', '☕', 9, { source_url: 'https://isacoturoglu.com.tr/akm-fuar/ankara-fuar-takvimi-2026.html' }),
  pCity('ankara', 'etkinlikler', '29. Agrotec Tarım Fuarı', 'Tarım sektörünün buluşma noktası olan fuar, Başkent\'te ziyaretçilerini ağırlıyor.', 'Ankara', dateAt(10, 10, 0), 'Yerel Haber', '🌾', 15, { source_url: 'https://isacoturoglu.com.tr/akm-fuar/ankara-fuar-takvimi-2026.html' }),
  pCity('ankara', 'sinema', 'CSO Ada Ankara Açık Hava Sinema ve Konser Programı', 'Açık alanda film gösterimleri ve konserlerden oluşan program sürüyor; aralarında "Odyssey" ve bebekli aileler için özel klasik müzik dinletisi de var.', 'CSO Ada Ankara', '', 'Yerel Haber', '🎬', 6, { source_url: 'https://csoadaankara.gov.tr/tr/Event' }),
  pCity('ankara', 'gundem', 'Çiftçiye Mısır Silajı Desteği', 'Ankara Büyükşehir Belediyesi, çiftçiden alınan mısır silajlarını hayvan yetiştiricilerine dağıtıyor.', 'Ankara', '', 'Ankara Büyükşehir Belediyesi', '🌽', 20, { source_url: 'https://www.ankara.bel.tr/' }),

  // ---- İZMİR ----
  pCity('izmir', 'etkinlikler', '9 Eylül Kurtuluş Kutlamaları', 'İzmir\'in kurtuluşunun yıl dönümü Zafer Yürüyüşü, fener alayı ve akşam konseriyle kutlanıyor.', 'Basmane ve kent geneli', dateAt(9, 9, 0), 'İzmir Büyükşehir Belediyesi', '🎉', 2, { source_url: 'https://www.izmir.bel.tr/tr/Haberler/9-eylul-u-tarihi-bir-coskuyla-izmir-e-yakisan-gorkemle-kutlayalim/50806/156', is_featured: true }),
  pCity('izmir', 'konserler', '9 Eylül Akşamı Haluk Levent Konseri', 'Kurtuluş kutlamaları kapsamında akşam saatlerinde Haluk Levent sahne alıyor.', 'İzmir', dateAt(9, 20, 0), 'İzmir Büyükşehir Belediyesi', '🎤', 2, { source_url: 'https://www.izmir.bel.tr/tr/Haberler/9-eylul-u-tarihi-bir-coskuyla-izmir-e-yakisan-gorkemle-kutlayalim/50806/156' }),
  pCity('izmir', 'konserler', '95. İzmir Enternasyonal Fuarı Çim Konserleri', 'Kültürpark\'ta düzenlenen fuar kapsamında akşamları Çim Konserleri geleneği sürüyor.', 'Kültürpark', dateAt(5, 21, 30), 'Yerel Haber', '🎸', 4, { source_url: 'https://www.songelenhaber.com.tr/izmir-enternasyonal-fuarinda-yildizlar-gecidi/11711' }),
  pCity('izmir', 'etkinlikler', 'Sonbahar Sergileri: Afro-Türk Spirit ve Kentlerde Dönüşüm', 'Vasıf Çınar Meydanı\'nda "Afro-Türk Spirit" ve Ahmed Adnan Saygun Sanat Merkezi\'nde "Kentlerde Dönüşüm" sergileri eylül boyunca ziyarete açık.', 'Vasıf Çınar Meydanı / Ahmed Adnan Saygun Sanat Merkezi', '', 'İzmir Büyükşehir Belediyesi', '🖼️', 10, { source_url: 'https://www.izmir.bel.tr/tr/Haberler/izmir-sonbahari-kultur-sanat-etkinlikleri-ile-karsiliyor/56787/156' }),
  pCity('izmir', 'gundem', '"Parkta Etkinlik Var" 103\'üncü Buluşmasını Tamamladı', 'Kentin parklarında doğa, spor, sanat ve çevre temalı etkinliklerle süren buluşmalar 103\'üncü etkinliğe ulaştı.', 'İzmir geneli', '', 'İzmir Büyükşehir Belediyesi', '🌳', 18, { source_url: 'https://www.izmir.bel.tr/' }),

  // ---- ANTALYA ----
  pCity('antalya', 'gundem', 'BM İklim Değişikliği Konferansı (COP31) Antalya\'da Yapılacak', 'Birleşmiş Milletler İklim Değişikliği Konferansı\'nın 31\'inci oturumu, 9-20 Kasım 2026 tarihlerinde Antalya Expo Center\'da düzenlenecek.', 'Antalya Expo Center', dateAt(70, 9, 0), 'Wikipedia', '🌍', 5, { source_url: 'https://en.wikipedia.org/wiki/2026_United_Nations_Climate_Change_Conference', is_featured: true }),
  pCity('antalya', 'etkinlikler', 'Antalya Kum Heykel Müzesi 2026 Sergisi', 'Kum heykel sanatının örneklerinin sergilendiği müze, ziyaretçilerini ağırlamaya devam ediyor.', 'Antalya Kum Heykel Müzesi, Muratpaşa', '', 'Yerel Haber', '🏖️', 7, { source_url: 'https://etkinlik.io/antalya' }),
  pCity('antalya', 'etkinlikler', 'Antalya Açıkhava Tiyatro Etkinlikleri', 'Eylül ayı boyunca Antalya Açıkhava sahnesinde farklı tiyatro oyunları sahneleniyor.', 'Antalya Açıkhava', dateAt(3, 21, 0), 'Yerel Haber', '🎭', 4, { source_url: 'https://www.biletmio.com/tr/Turkiye' }),
  pCity('antalya', 'etkinlikler', 'Digifest Antalya 2026', 'Antalya Büyükşehir Belediyesi\'nin dijital kültür ve teknoloji temalı etkinliği Digifest, şehirde gerçekleşiyor.', 'Antalya', '', 'Antalya Büyükşehir Belediyesi', '💻', 11, { source_url: 'https://www.antalya.bel.tr/etkinlikler' }),

  // ---- BURSA ----
  pCity('bursa', 'etkinlikler', 'Uluslararası Bursa Karagöz Kukla ve Gölge Oyunları Festivali', 'Festival, 18-27 Eylül 2026 tarihleri arasında kentin çeşitli sahnelerinde gerçekleştirilecek.', 'Bursa', dateAt(18, 19, 0), 'Bursa Büyükşehir Belediyesi', '🎭', 6, { source_url: 'https://www.bursa.bel.tr/haber/bkstv-2026-festival-takvimini-duyurdu-36742', is_featured: true }),
  pCity('bursa', 'konserler', 'Zafer Haftası Konserleri', 'Kültürpark Göl Kenarı\'nda Türk Halk Müziği, Türk Sanat Müziği ve Roman Orkestrası konserleri düzenlendi.', 'Kültürpark Göl Kenarı', '', 'Bursa Büyükşehir Belediyesi', '🎻', 3, { source_url: 'https://www.bursavar.com/haber/28583361/bursada-30-agustos-programi-belli-oldu' }),
  pCity('bursa', 'konserler', 'Sertab Erener Konseri', 'Sanatçı Sertab Erener, Bursa\'da hayranlarıyla buluşuyor.', 'Bursa', dateAt(25, 21, 0), 'Bursada Bu Hafta', '🎤', 14, { source_url: 'https://www.bursadabuhafta.com/' }),
  pCity('bursa', 'trafik', 'İznik Cadde ve Sokak Yenileme Çalışmaları', 'Tamamlanan kanalizasyon ve içme suyu altyapısının ardından İznik Müşküle Mahallesi\'nde cadde ve sokak yenileme çalışmaları başladı.', 'İznik, Müşküle Mahallesi', '', 'Bursa Büyükşehir Belediyesi', '🚧', 2, { source_url: 'https://www.bursa.bel.tr/' }),

  // ---- KONYA ----
  pCity('konya', 'yeme-icme', 'Konya Mutfak Günleri', 'Konya mutfağının zengin lezzetlerinin tanıtıldığı etkinlik, Kalehan Ecdat Bahçesi\'nde düzenleniyor.', 'Kalehan Ecdat Bahçesi', dateAt(4, 12, 0), 'Konya Büyükşehir Belediyesi', '🍲', 3, { source_url: 'https://konyamutfakgunleri.konya.bel.tr/', is_featured: true }),
  pCity('konya', 'konserler', 'Selçuklu Kongre Merkezi Konser Programı', 'Maher Zain, Mustafa Sandal, Serdar Ortaç ve Koray Avcı gibi sanatçılar eylül ayında Selçuklu Kongre Merkezi sahnesinde.', 'Selçuklu Kongre Merkezi', dateAt(14, 20, 30), 'Yerel Haber', '🎤', 6, { source_url: 'https://scckonya.com/Etkinlik/EtkinlikListesi' }),

  // ---- GAZİANTEP ----
  pCity('gaziantep', 'etkinlikler', '7. Rumkale Festivali', 'Kürek kupası, trekking turları, bisiklet turu ve kamplı etkinliklerin yer aldığı festival, tarihin suyla buluştuğu Rumkale\'de düzenleniyor.', 'Rumkale', dateAt(8, 9, 0), 'Yerel Haber', '🚣', 4, { source_url: 'https://www.dha.com.tr/yerel-haberler/gaziantep/gaziantepte-rumkale-festivali-basliyor-2926595', is_featured: true }),
  pCity('gaziantep', 'konserler', '"Mahallemde Konser Var"', 'Yaz etkinlikleri kapsamında kent merkezi ve ilçelerde mahalle konserleri devam ediyor.', 'Gaziantep geneli', '', 'Gaziantep Büyükşehir Belediyesi', '🎶', 10, { source_url: 'https://www.gaziantep.bel.tr/tr/haberler/gaziantep-buyuksehirin-yaz-etkinlikleri-tum-hiziyla-suruyor' }),

  // ---- ADANA ----
  pCity('adana', 'sinema', '33. Adana Altın Koza Film Festivali', 'Türkiye\'nin en köklü film festivallerinden Altın Koza, Adana Büyükşehir Belediyesi tarafından düzenleniyor.', 'Adana', dateAt(27, 19, 0), 'Adana Büyükşehir Belediyesi', '🎬', 5, { source_url: 'https://www.adana.bel.tr/?web=1', is_featured: true }),

  // ---- MERSİN ----
  pCity('mersin', 'etkinlikler', 'Avrupa Hareketlilik Haftası Etkinlikleri', 'Kenti hareketli yaşama teşvik eden etkinlikler, sahilde gün doğumu sporundan özel gereksinimli bireylere yönelik programlara kadar hafta boyunca sürüyor.', 'Mersin geneli', dateAt(17, 6, 0), 'Mersin Büyükşehir Belediyesi', '🚴', 7, { source_url: 'https://www.mersin.bel.tr/haber/buyuksehir-avrupa-hareketlilik-haftasina-ozel-etkinlikler-duzenliyor-1758099500' }),
  pCity('mersin', 'etkinlikler', 'Enstrüman Kursları Kayıtları Başlıyor', 'Kültür, Sanat ve Sosyal İşler Dairesi Başkanlığı bünyesinde açılacak enstrüman kurslarına kayıtlar başladı.', 'MBB Kültür, Sanat ve Sosyal İşler Dairesi', dateAt(2, 9, 0), 'Mersin Büyükşehir Belediyesi', '🎻', 13, { source_url: 'https://x.com/mersin_bld' }),

  // ---- KAYSERİ ----
  pCity('kayseri', 'gundem', 'Kayseri Turizm Ödülleri 2026 Başvuruları Başladı', 'KAYOTED tarafından ikinci kez düzenlenecek ödüllerde şehrin turizm, kültür, gastronomi ve spor alanındaki değerleri öne çıkarılacak.', 'Kayseri', '', 'Yerel Haber', '🏆', 9, { source_url: 'https://etkinlikayseri.com/haberler' }),

  // ---- ESKİŞEHİR ----
  pCity('eskisehir', 'etkinlikler', 'Uluslararası Eskişehir Porsuk Festivali', '2026 Eskişehir Yılı kapsamında ilk kez düzenlenen festival; 21 ülkeden 136 sanatçıyı konser, tiyatro, atölye ve sergilerle Porsuk Nehri kıyısında buluşturuyor.', 'Porsuk Bulvarı Adalar, Kentpark, Sümerpark, İskele26', dateAt(3, 18, 0), 'Eskişehir Büyükşehir Belediyesi', '🎪', 2, { source_url: 'https://www.eskisehir.bel.tr/icerik-detay.php?icerik_id=13116&cat_icerik=1&menu_id=24', is_featured: true }),
  pCity('eskisehir', 'etkinlikler', '"Fırçanın Sırdaki İzi" Seramik Sempozyumu', 'Sanatçıların eserlerini ziyaretçilerin gözü önünde hazırladığı üç günlük seramik sempozyumu Sanat Sokağı\'nda gerçekleşiyor.', 'Sanat Sokağı', dateAt(8, 10, 0), 'Yerel Haber', '🏺', 1, { source_url: 'https://www.haberes.com.tr/fircanin-sirdaki-izi-sanat-sokaginda-hayat-bulacak' }),

  // ---- SAMSUN ----
  pCity('samsun', 'konserler', 'Derya Bedavacı Konseri', 'Sanatçı Derya Bedavacı, Samsun Doğu Park Amfi Tiyatro\'da hayranlarıyla buluşuyor.', 'Samsun Doğu Park Amfi Tiyatro', dateAt(5, 21, 0), 'Yerel Haber', '🎤', 3, { source_url: 'https://www.samsungazetesi.com/samsun-konserleri-ne-zaman-iste-tarih-tarih-etkinlikler', is_featured: true }),
  pCity('samsun', 'sinema', 'Açık Hava Sinema Geceleri', 'Büyükşehir Belediyesi\'nin 17 ilçede düzenlediği açık hava sinema etkinliğinde bu yıl "Mucize" filmi gösteriliyor; mısır, dondurma ve gazoz ikramı da var.', 'Samsun geneli (17 ilçe)', '', 'Samsun Büyükşehir Belediyesi', '🍿', 8, { source_url: 'https://www.tireboluhaber.net/samsun-buyuksehir-belediyesi-nden-acik-hava-sinema-geceleri/' }),

  // ---- DİYARBAKIR ----
  pCity('diyarbakir', 'gundem', '"Bugünün Gençleri Geleceğin Meslekleri" Projesi', 'Belediye, gençlere yönelik çevrim içi meslek tanıtımı etkinlikleri düzenliyor.', 'Diyarbakır', '', 'Diyarbakır Büyükşehir Belediyesi', '💼', 15, { source_url: 'https://www.diyarbakir.bel.tr/tr/haberler/17743-etkinlik.html' }),

  // ---- TRABZON ----
  pCity('trabzon', 'etkinlikler', 'Trabzon Günleri', 'Trabzon\'un kültürü, tarihi ve değerlerinin tanıtıldığı etkinlikte Yenimahalle Fuar Alanı\'nda her akşam farklı sanatçılar sahne alıyor.', 'Yenimahalle Fuar Alanı', '', 'Trabzon Büyükşehir Belediyesi', '🎪', 4, { source_url: 'https://www.trabzon.bel.tr/Web/Icerik/trabzon-gunleri-basliyor', is_featured: true }),

  // ---- ŞANLIURFA ----
  pCity('sanliurfa', 'etkinlikler', 'TEKNOFEST Güneydoğu', 'Türkiye\'nin en önemli teknoloji etkinliklerinden TEKNOFEST\'in Güneydoğu ayağı GAP Havalimanı\'nda gerçekleştirilecek.', 'GAP Havalimanı', dateAt(31, 10, 0), 'Yerel Haber', '🚀', 6, { source_url: 'https://urfagaste.com/haber/28516143/sanliurfada-teknofest-guneydogu-hazirliklari-hiz-kazandi', is_featured: true }),
  pCity('sanliurfa', 'etkinlikler', 'Açık Hava Yaz Etkinlikleri: Karaköprü', 'Hacivat ve Karagöz gösterisi ile Urfa Ahengi Müzik Topluluğu\'nun konserinin yer aldığı program, Karaköprü Mesire Alanı\'nda düzenlendi.', 'Karaköprü Mesire Alanı', '', 'Yerel Haber', '🎭', 9, { source_url: 'https://www.kenthaber27.com/haber/sanliurfa-da-muzik-ve-eglence-dolu-gece-1279047.html' }),

  // ---- KOCAELİ ----
  pCity('kocaeli', 'etkinlikler', '"Çık Dışarıya Oynayalım 2026"', 'Kadın ve Aile Hizmetleri Dairesi Başkanlığı\'nın yaz etkinlikleri, Gebze\'den başlayarak 12 ilçede çocuklarla buluşuyor.', 'Kocaeli geneli (12 ilçe)', '', 'Kocaeli Büyükşehir Belediyesi', '🎈', 5, { source_url: 'https://www.cagdaskocaeli.com.tr/haber/28430419/kocaeli-buyuksehir-belediyesi-2026-yaz-etkinlikleri', is_featured: true }),
  pCity('kocaeli', 'sinema', 'Ormanya Gece Sineması', 'Kocaeli\'nin doğal yaşam ve ekoturizm merkezi Ormanya\'da açık hava sineması etkinlikleri sürüyor.', 'Ormanya', '', 'Kocaeli Büyükşehir Belediyesi', '🎬', 11, { source_url: 'https://www.cagdaskocaeli.com.tr/haber/28430419/kocaeli-buyuksehir-belediyesi-2026-yaz-etkinlikleri' }),

  // ---- SAKARYA ----
  pCity('sakarya', 'etkinlikler', '"Mahallemde Neşe Var"', 'Sosyal Hizmetler Dairesi Başkanlığı\'nın çocuk etkinlikleri Sapanca, Akyazı ve Arifiye\'de gölge oyunu, yüz boyama ve atölyelerle devam ediyor.', 'Sakarya geneli', '', 'Sakarya Büyükşehir Belediyesi', '🎪', 1, { source_url: 'https://anibalgazete.com/haber/sakarya-mahallelerinde-yaz-nesesi-39500', is_featured: true }),

  // ---- BALIKESİR ----
  pCity('balikesir', 'gundem', 'Balıkesir\'in Kurtuluşunun 103. Yıl Dönümü', '6 Eylül Balıkesir, 7 Eylül İvrindi\'nin düşman işgalinden kurtuluşunun yıl dönümü resmi törenlerle kutlanıyor.', 'Kuva-yi Milliye Meydanı ve ilçeler', dateAt(7, 10, 0), 'Yerel Haber', '🎉', 12, { source_url: 'https://balikesirkentkonseyi.org/', is_featured: true }),

  // ---- MANİSA ----
  pCity('manisa', 'yeme-icme', 'Manisa Bağbozumu Şenliği', 'Manisa\'nın bağcılık kültürünü kent yaşamıyla buluşturan ilk Bağbozumu Şenliği; gastronomi, kadın emeği stantları, söyleşi ve konserlerle Şehzadeler\'de gerçekleşiyor.', 'Şehzadeler ilçesi', dateAt(6, 10, 0), 'Yerel Haber', '🍇', 4, { source_url: 'https://45haber.com/manisada-bag-bozumu-senligi-5-eylulde-basliyor', is_featured: true }),
  pCity('manisa', 'konserler', 'Kurtuluş Haftası Konserleri', 'İlçelerin kurtuluş yıl dönümleri dolayısıyla düzenlenen konser programında Akhisar\'da Ceza, Kula\'da Onur Akın sahne alıyor.', 'Manisa ilçeleri', dateAt(6, 21, 0), 'Yerel Haber', '🎤', 3, { source_url: 'https://www.akhisarhaber.net/manisa-ve-ilcelerindeki-kurtulus-konserleri-belli-oldu/18760' }),

  // ---- DENİZLİ ----
  pCity('denizli', 'etkinlikler', 'Denizli Çocuk Şenliği', 'Bilim, sanat ve eğlenceyi bir araya getiren şenlikte VR deneyimi, STEM atölyeleri ve hafta sonu sinema gösterimleri çocukları bekliyor.', 'Denizli Büyükşehir Belediyesi Kongre ve Kültür Merkezi', dateAt(14, 14, 0), 'Denizli Büyükşehir Belediyesi', '🧪', 2, { source_url: 'https://www.nethaber.com.tr/denizli-buyuksehir-den-cocuklara-yaz-surprizi/829901/', is_featured: true }),

  // ---- MALATYA ----
  pCity('malatya', 'gundem', 'Malatya Kültür Yolu Festivali Tamamlandı', 'Kültür ve Turizm Bakanlığı iş birliğinde ikinci kez düzenlenen festival; konser, sergi ve gastronomi etkinlikleriyle depremin ardından kentin sosyal hayatının yeniden canlandığının bir işareti oldu.', 'Arslantepe Höyüğü ve kent geneli', '', 'Yerel Haber', '🎪', 20, { source_url: 'https://www.malatyadetay.com/malatya-kultur-yolu-festivali-2026-basladi/11270' }),

  // ---- AYDIN ----
  pCity('aydin', 'etkinlikler', '"7\'den 70\'e Kurtuluş Destanı Aydın" Yarışması', 'Aydın\'ın kurtuluş yıl dönümü kapsamında düzenlenen ödüllü resim, şiir ve kompozisyon yarışmasına öğrenciler davet ediliyor; sonuçlar 3 Eylül\'de açıklanacak.', 'Vali Yazıcıoğlu Kültür Merkezi', dateAt(4, 12, 0), 'Aydın Büyükşehir Belediyesi', '🎨', 6, { source_url: 'https://www.sesgazetesi.com.tr/buyuksehirden-7-eylul-temali-yarisma' }),

  // ---- MUĞLA ----
  pCity('mugla', 'konserler', '11. Uluslararası Zurnazen Festivali', 'Romanya, Çin ve Azerbaycan\'dan sanatçıların da katılacağı festival, Menteşe, Milas ve Fethiye\'de konser ve panellerle gerçekleşiyor.', 'Menteşe, Milas, Fethiye', dateAt(1, 18, 0), 'Yerel Haber', '🎺', 3, { source_url: 'https://www.haber48.com.tr/muglada-uluslararasi-zurnazen-festivali-icin-geri-sayim-basladi', is_featured: true }),

  // ---- TEKİRDAĞ ----
  pCity('tekirdag', 'etkinlikler', 'Okula Uyum Etkinlikleri', 'Çerkezköy ve Kapaklı\'da yeni eğitim dönemi öncesinde çocuklar için etkinlikler, ebeveynler için ise psikolog eşliğinde atölyeler düzenleniyor.', 'Çerkezköy Kadın Danışma Merkezi / Kapaklı Sosyal Yaşam Merkezi', dateAt(2, 10, 0), 'Tekirdağ Büyükşehir Belediyesi', '🎒', 1, { source_url: 'https://marmarahaber.com.tr/haber/28605685/buyuksehirden-miniklere-okula-uyum-destegi' }),

  // ---- KAHRAMANMARAŞ ----
  pCity('kahramanmaras', 'etkinlikler', 'Türkiye Kültür Yolu Festivali Kahramanmaraş\'ta', 'Kahramanmaraş, 2026 Türkiye Kültür Yolu Festivali kapsamında 9 gün boyunca konser, sergi ve söyleşilere ev sahipliği yapacak.', 'Kahramanmaraş geneli', dateAt(13, 19, 0), 'T.C. Kültür ve Turizm Bakanlığı', '🎪', 7, { source_url: 'https://www.marasmanset.com/kahramanamaras-festival-sehri-oluyor', is_featured: true }),

  // ---- ERZURUM ----
  pCity('erzurum', 'belediye', 'Kültür Merkezi Kiralama Ücretleri Güncellendi', 'Belediye meclisi, Necip Fazıl Kısakürek ve Dadaş İbrahim Erkal kültür merkezlerinin 2026-2027 kiralama tarifesini yeniden belirledi; yeni tarife 1 Eylül\'den itibaren uygulanacak.', 'Erzurum', dateAt(1, 0, 0), 'Erzurum Büyükşehir Belediyesi', '🏛️', 3, { source_url: 'https://vanpostasigazetesi.com/haber/erzurum-buyuksehir-belediye-meclisi-kararlari-aciklandi-396120' }),

  // ---- SİVAS ----
  pCity('sivas', 'etkinlikler', '4 Eylül Sivas Kongresi Kutlamaları', 'Sivas Kongresi\'nin yıl dönümü, Geleneksel Aşıklar Bayramı ve Türk Halk Müziği konseriyle Kongre Müzesi Bahçesi\'nde kutlanıyor.', 'Kongre Müzesi Bahçesi', dateAt(5, 19, 0), 'Sivas Belediyesi', '🎉', 5, { source_url: 'https://sivas.bel.tr/haber/4-eylul-sivas-kongresi-nin-106-yil-donumu-coskuyla-kutlaniyor', is_featured: true }),

  // ---- ELAZIĞ ----
  pCity('elazig', 'gundem', 'Elazığ Belediyesi Yaz Etkinlikleri Sona Erdi', 'Kültür Park Amfi Tiyatro\'da haziran-ağustos boyunca süren yaz konserleri, Azmi Ozan ve Seyfi Yalçınses\'in sahne aldığı final gecesiyle tamamlandı.', 'Kültür Park Amfi Tiyatro', '', 'Yerel Haber', '🎤', 4, { source_url: 'https://www.elazigdetayhaber.com/elazig-belediyesi-yaz-etkinlikleri-sona-erdi/24097' }),

  // ---- EDİRNE ----
  pCity('edirne', 'konserler', 'Wegh Konseri', 'Alternatif müzik dinleyicileri için Wegh, Just Of Karnaval\'da sahne alıyor.', 'Just Of Karnaval, Merkez', dateAt(27, 21, 0), 'Yerel Haber', '🎸', 6, { source_url: 'https://etkinlik.io/edirne' }),

  // ---- KÜTAHYA ----
  pCity('kutahya', 'konserler', '30 Ağustos Zafer Bayramı: maNga Konseri', 'Zafer Bayramı kutlamaları kapsamında rock grubu maNga, Belediye Bahçesi\'nde Kütahyalılarla buluşuyor.', 'Belediye Bahçesi', '', 'Kütahya Belediyesi', '🎸', 0, { source_url: 'https://kutahyaekspres.com/kutahya-belediyesinden-30-agustosta-manga-konseri', is_featured: true }),

  // ---- AFYONKARAHİSAR ----
  pCity('afyonkarahisar', 'etkinlikler', 'NG Afyon Motofest 2026', 'Motor sporları ve müziği bir araya getiren festivalde Haluk Levent, Ceza, Murat Boz ve Pentagram gibi isimler 14 konserde sahne alacak; ayrıca yaklaşık 50 etkinlik düzenlenecek.', 'Afyon Motor Sporları Merkezi', dateAt(3, 18, 0), 'Yerel Haber', '🏍️', 2, { source_url: 'https://www.afyonpostasi.com.tr/afyona-13-sanatci-konsere-geliyor-haluk-leventten-cezaya-murat-bozdan-demet-akalina-tarih-belli-oldu', is_featured: true }),

  // ---- ZONGULDAK ----
  pCity('zonguldak', 'konserler', 'Cehennemağzı Amfi Tiyatro Konser Programı', 'Ereğli\'deki amfi tiyatroda pop müzik konseri düzenleniyor.', 'Cehennemağzı Amfi Tiyatro, Ereğli', dateAt(12, 21, 0), 'Yerel Haber', '🎤', 10, { source_url: 'https://etkinlik.io/zonguldak' }),

  // ---- ÇORUM ----
  pCity('corum', 'trafik', 'Gazi Caddesi\'nde Yol Bakım Çalışması', 'Şehir merkezinin en yoğun ulaşım akslarından Gazi Caddesi\'nde altyapı çalışması sonrası yol bakım çalışması yapılacak.', 'Gazi Caddesi', '', 'Çorum Belediyesi', '🚧', 8, { source_url: 'https://www.corum.bel.tr/haberler' }),

  // ---- ISPARTA ----
  pCity('isparta', 'belediye', 'Isparta Sanat ve Sergi Merkezi İhalesi', 'Yayla Mahallesi\'nde inşa edilecek 3 katlı sanat ve sergi merkezinin yapım ihalesi 4 Eylül\'de açılacak.', 'Isparta Belediyesi Encümen Odası', dateAt(4, 11, 30), 'Yerel Haber', '🏗️', 6, { source_url: 'https://www.gazete32.com.tr/isparta/ispartaya-yeni-sanat-kompleksi-3-katli-sergi-merkezi-icin-ihaleye-cikildi/' }),

  // ---- OSMANİYE ----
  pCity('osmaniye', 'gundem', 'Amanos Ultra Trail Heyecanı', 'Osmaniye\'de ilk kez düzenlenen Amanos Ultra Trail\'de 81 ilden ve 6 ülkeden 1100 sporcu, Amanos Dağları\'nın zorlu parkurlarında yarıştı.', 'Amanos Dağları', '', 'Osmaniye Belediyesi', '🏃', 12, { source_url: 'https://osmaniye-bld.gov.tr/', is_featured: true }),

  // ---- ORDU ----
  pCity('ordu', 'etkinlikler', '"Osmanlı\'nın Mukaddes Emanetleri" Sergisi', 'Türkiye Kültür Yolu Festivali kapsamında düzenlenen sergi, Ordu Büyükşehir Belediyesi Binası Fuaye Alanı\'nda ziyaretçilerini ağırlıyor.', 'Ordu Büyükşehir Belediyesi Binası', '', 'T.C. Kültür ve Turizm Bakanlığı', '🕌', 3, { source_url: 'https://ordu.bel.tr/', is_featured: true }),
  pCity('ordu', 'trafik', 'Ordu-Tokat Sınırında Asfalt Çalışması', 'Belediye, iki il arasındaki 10 kilometrelik güzergahta asfalt çalışması gerçekleştiriyor.', 'Ordu-Tokat sınırı', '', 'Ordu Büyükşehir Belediyesi', '🚧', 15, { source_url: 'https://www.ordu.bel.tr/haberler' }),

  // ---- RİZE ----
  pCity('rize', 'gundem', 'RİBEGEM Yaz Etkinlikleri Konserle Tamamlandı', 'Rize Belediyesi Gençlik Merkezi\'nin yaz boyunca sürdürdüğü etkinlikler, bir konserle sona erdi.', 'Rize', '', 'Rize Belediyesi', '🎵', 6, { source_url: 'https://www.rize.bel.tr/etkinlikler' }),

  // ---- GİRESUN ----
  pCity('giresun', 'gundem', 'Giresun Belediyesi Yaz Etkinlikleri Sona Erdi', 'Kültür ve Turizm Bakanlığı\'nın da desteklediği yaz etkinlikleri; yazlık sinema, çocuk etkinlikleri, kitap günleri ve konserlerle bir ay boyunca kenti açık hava festivaline dönüştürdü.', 'Giresun geneli', '', 'Yerel Haber', '🎪', 9, { source_url: 'https://www.yesilgiresun.com.tr/haber/28487153/giresun-belediyesinin-yaz-etkinlikleri-sona-erdi' }),

  // ---- BOLU ----
  pCity('bolu', 'etkinlikler', 'Yeniçağa Panayırı', 'Geleneksel panayır, yöresel lezzetler, alışveriş ve kültürel etkinliklerle 17 Eylül ve 1 Ekim olmak üzere iki ayrı tarihte kapılarını açıyor.', 'Yeniçağa', dateAt(18, 10, 0), 'Yerel Haber', '🎡', 4, { source_url: 'https://www.boluolay.com/haber/28575261/bolu-yenicaga-panayiri-kapilarini-aciyor-17-eylul-ve-1-ekimde-geleneksel-bulusma', is_featured: true }),

  // ---- DÜZCE ----
  pCity('duzce', 'sinema', 'Açık Hava Sineması İki Noktada Devam Ediyor', 'Yaz boyunca süren açık hava sineması etkinlikleri, bu hafta hem Bahçeşehir Yeşil Vadi hem de Asar Kemer Park\'ta gösterimlerle sürüyor.', 'Bahçeşehir Yeşil Vadi / Asar Kemer Park', dateAt(2, 20, 0), 'Düzce Belediyesi', '🎬', 1, { source_url: 'https://www.gazetebirlik.com/kultur-sanat/duzcede-yaz-geceleri-sinema-ile-bulusuyor/1081454' }),

  // ---- KARS ----
  pCity('kars', 'etkinlikler', 'Kars\'ta Ücretsiz Sirk Gösterisi', 'Belediye katkılarıyla düzenlenen ücretsiz gösteride çocuklar akrobasi, jonglörlük ve palyaço performanslarıyla eğlendi.', 'Fethiye Camii önü', '', 'Kars Belediyesi', '🎪', 7, { source_url: 'https://www.politikars.com/karsta-ucretsiz-sirk-gosterisi-cocuklar-akrobasi-ve-renkli-gosterilerle-bulustu-588546h.htm' }),
  pCity('kars', 'trafik', 'Hat Sokak\'ta Yol Yapım Çalışması', 'Şehitler Mahallesi Hat Sokak\'ta yol yapım çalışmaları hız kesmeden sürüyor.', 'Şehitler Mahallesi', '', 'Kars Belediyesi', '🚧', 6, { source_url: 'https://www.kars.bel.tr/' }),

  // ---- YALOVA ----
  pCity('yalova', 'konserler', 'Yaşar Konseri', 'Sanatçı Yaşar, Barış Manço Açıkhava Tiyatrosu\'nda Yalovalılarla buluşuyor.', 'Yalova Barış Manço Açıkhava Tiyatrosu', dateAt(1, 21, 0), 'Yerel Haber', '🎤', 5, { source_url: 'https://etkinlik.io/yalova', is_featured: true }),

  // ---- ARTVİN ----
  pCity('artvin', 'gundem', '45. Kafkasör Kültür, Turizm ve Sanat Festivali Tamamlandı', 'Boğa güreşleri, halk oyunları ve yöresel ürün stantlarının yer aldığı geleneksel festival büyük bir coşkuyla sona erdi.', 'Kafkasör Yaylası', '', 'Artvin Belediyesi', '🐂', 20, { source_url: 'https://artvin.bel.tr/' }),

  // ---- HATAY ----
  pCity('hatay', 'konserler', 'Karsu "Dayanışmanın Ezgisi" Konseri', 'Avrupa Birliği himayesinde düzenlenen ücretsiz konserde Karsu, deprem sonrası dayanışma temasıyla Hataylılarla buluşuyor.', 'Defne Sümerler Amfitiyatro', dateAt(17, 20, 0), 'Yerel Haber', '🎤', 1, { source_url: 'https://antakyagazetesi.com/karsu-dayanismanin-ezgileriyle-hatayda-sahne-alacak/', is_featured: true }),
  pCity('hatay', 'etkinlikler', 'Payas Kervansaray Şenlikleri', 'Payas Belediyesi tarafından düzenlenen şenlik, ay boyunca sürecek kültürel etkinliklerle ziyaretçilerini ağırlıyor.', 'Payas', '', 'Payas Belediyesi', '🏰', 5, { source_url: 'https://hatay.gov.tr/festival-ve-senliklerimiz' }),

  // ---- VAN ----
  pCity('van', 'gundem', '1 Eylül Dünya Barış Günü Yürüyüşü', 'Van Demokrasi Platformu öncülüğünde, Van AVM önünden Kent Meydanı\'na yürüyüş ve barış temalı bir etkinlik düzenleniyor.', 'Van AVM - Kent Meydanı', dateAt(1, 19, 0), 'Yerel Haber', '🕊️', 0, { source_url: 'https://www.bolgegazetesivan.com/vanda-1-eylul-icin-baris-cagrisi-barisin-sesini-yukseltelim' }),

  // ---- TOKAT ----
  pCity('tokat', 'etkinlikler', 'Kadınlara Özel Ücretsiz Spor Kursları', 'Tokat Belediyesi, kadınlar için ücretsiz Step, Aerobik ve Pilates kursları düzenliyor; başvurular 1-21 Eylül arasında alınacak.', 'Perakende Spor Salonu', '', 'Tokat Belediyesi', '🏋️', 2, { source_url: 'https://www.hursozgazetesi.com/tokat-belediyesinden-kadinlara-ozel-saglikli-yasam-destegi' }),

  // ---- MARDİN ----
  pCity('mardin', 'etkinlikler', 'Türkiye Kültür Yolu Festivali Mardin\'de', 'Türkiye Kültür Yolu Festivali\'nin bu yılki programı kapsamında Mardin, 17-25 Ekim tarihleri arasında festivale ev sahipliği yapacak.', 'Mardin geneli', dateAt(47, 19, 0), 'T.C. Kültür ve Turizm Bakanlığı', '🏛️', 10, { source_url: 'https://www.vansesigazetesi.com/kultur-yolu-festivali-11-19-temmuz-da-van-da-duzenlenecek/155788/', is_featured: true }),

  // ---- SİNOP ----
  pCity('sinop', 'etkinlikler', 'Sinopale 10: Anadolu\'nun İlk Bienali', '"Karada Akıl Yürür, Denizde Sezgi" temalı bienal, 12 ülkeden 25 sanatçıyı yerel zanaatkârlarla buluşturuyor; ana sergi 25 Eylül\'de açılacak.', 'Sinop Askeri Gazino Binası', dateAt(2, 12, 0), 'T.C. Kültür ve Turizm Bakanlığı', '🎨', 0, { source_url: 'https://tr.euronews.com/kultur/2026/08/31/sinopale-10-basliyor-sanat-eserleri-sergiden-once-uretilecek', is_featured: true }),

  // ---- NEVŞEHİR ----
  pCity('nevsehir', 'yeme-icme', 'Nevşehir GastroFest', 'Kapadokya\'nın gastronomi kültürünü öne çıkaran ilk GastroFest, 16-20 Eylül\'de düzenlenecek; açılış gecesinde Simge sahne alacak.', 'Nevşehir Belediyesi Etkinlik Alanı', dateAt(16, 20, 0), 'Nevşehir Belediyesi', '🍽️', 2, { source_url: 'https://www.fibhaber.com/nevsehirde-bir-ilk-gastrofest-icin-geri-sayim-basladi', is_featured: true }),

  // ---- ADIYAMAN ----
  pCity('adiyaman', 'sinema', '"Yıldızların Altında Çocuk Sineması"', 'Adıyaman Belediyesi, çocuklar ve aileler için Eğriçay Parkı\'nda açık hava sineması etkinlikleri düzenliyor.', 'Eğriçay Parkı', '', 'Adıyaman Belediyesi', '🎬', 6, { source_url: 'https://adiyaman.bel.tr/' }),

  // ---- KIRKLARELİ ----
  pCity('kirklareli', 'etkinlikler', '17. Yayla Bolluk, Bereket, Hasat ve Bağbozumu Şenliği', 'Üç gün sürecek şenlikte halk oyunları, sanat atölyeleri ve konserler yer alacak; 5 Eylül akşamı sanatçı Çelik sahne alacak.', 'Yayla Meydanı', dateAt(4, 16, 0), 'Yerel Haber', '🍇', 1, { source_url: 'https://www.babaeskisozgazetesi.com/kirklarelinde-bag-bozumu-coskusu-basliyor-17-senlik-icin-geri-sayim/58721', is_featured: true }),

  // ---- KIRŞEHİR ----
  pCity('kirsehir', 'etkinlikler', '39. Ahilik Haftası', 'Ahiliğin başkenti Kırşehir, 14-20 Eylül tarihleri arasında ulusal düzeyde kutlanan Ahilik Haftası\'na ev sahipliği yapacak.', 'Kırşehir geneli', dateAt(14, 10, 0), 'Yerel Haber', '🤝', 2, { source_url: 'https://www.kirsehirhaberturk.com/', is_featured: true }),

  // ---- BATMAN ----
  pCity('batman', 'konserler', '"Parklarda Şenlik Var" Eylül Konserleri', 'Kentin farklı parklarında açık hava konserleri ve çocuk etkinlikleri eylül ayında da sürüyor.', 'Batman geneli (çeşitli parklar)', dateAt(1, 21, 0), 'Batman Belediyesi', '🎵', 0, { source_url: 'https://www.batmangazetesi.com.tr/haber/haber-66203.html' }),

  // ---- BİTLİS ----
  pCity('bitlis', 'gundem', 'Büyük Bitlis Buluşmaları', 'Bitlis\'in düşman işgalinden kurtuluşunun 110. yıl dönümü, kortej yürüyüşü, konserler ve çocuk şenlikleriyle üç gün süren etkinliklerle kutlandı.', 'Bitlis merkez', '', 'Yerel Haber', '🎉', 24, { source_url: 'https://www.mersinhaber.com/haber-bitliste-110-kurtulus-yildonumu-icin-geleneksel-etkinlikler-duzenlendi/736400' }),

  // ---- KARABÜK ----
  pCity('karabuk', 'sinema', 'Uluslararası Altın Safran Film Festivali', 'Safranbolu\'da düzenlenen köklü film festivali, 16-18 Eylül tarihlerinde sinemaseverleri ağırlayacak.', 'Safranbolu', dateAt(16, 19, 0), 'Yerel Haber', '🎞️', 3, { source_url: 'https://visitkarabuk.com/bilgi-kutusu/onemli-gun-ve-haftalar', is_featured: true }),

  // ---- AĞRI ----
  pCity('agri', 'etkinlikler', 'Taşlıçay Balık Gölü Festivali', 'İl Kültür ve Turizm Müdürlüğü\'nün geleneksel etkinlik takviminde yer alan festival, bölgenin doğal güzelliklerini tanıtmayı amaçlıyor.', 'Taşlıçay', '', 'Ağrı İl Kültür ve Turizm Müdürlüğü', '🎣', 15, { source_url: 'https://agri.ktb.gov.tr/TR-95733/etkinlikler.html' }),

  // ---- AKSARAY ----
  pCity('aksaray', 'etkinlikler', 'Mamasın Barajı Dev Sazan Festivali', 'AKSOBDER tarafından düzenlenen geleneksel sazan avı festivali, 5-6 Eylül\'de çevre illerden yüzlerce balıkçıyı ağırlayacak.', 'Mamasın Barajı', dateAt(5, 8, 0), 'Yerel Haber', '🎣', 0, { source_url: 'https://yenigungazete.com/genel/aksaray-mamasin-barajinda-dev-sazan-festivali-5-eylulde-basliyor/', is_featured: true }),

  // ---- BURDUR ----
  pCity('burdur', 'konserler', 'Yaz Konserleri: "Sandalyeni Kap Gel"', 'Burdur Belediyesi\'nin açık hava konser serisinde Nuri Çelik, Gökhan Akkaleli ve Gültekin Aslan gibi isimler sahne alacak.', 'Burdur merkez', '', 'Burdur Belediyesi', '🎤', 3, { source_url: 'https://www.burduryenigun.com/burdur-belediyesinden-yaz-konserleri-etkinligi' }),

  // ---- YOZGAT ----
  pCity('yozgat', 'etkinlikler', 'Yaz Kulübü ve Yaz Okulu Kapanış Şenliği', 'Gençlik Merkezi\'nin yaz programı, 1 Eylül\'de Spor Vadisi Amfi Alanı\'nda düzenlenecek kapanış şenliğiyle sona eriyor.', 'Spor Vadisi Amfi Alanı', dateAt(1, 16, 0), 'Yerel Haber', '🎊', 0, { source_url: 'https://merhabayozgat.com/haber/28599462/yozgatta-yaz-kulubu-ve-yaz-okulu-kapanisi-1-eylulde-yapilacak' }),

  // ---- NİĞDE ----
  pCity('nigde', 'etkinlikler', 'Ulukışla Üzüm ve Kültür Festivali', 'Geleneksel festival, il kültür ve turizm takviminde eylül ayının son haftasına planlanıyor.', 'Ulukışla', '', 'Ulukışla Belediyesi', '🍇', 20, { source_url: 'https://nigde.ktb.gov.tr/TR-74743/yerel-etkinlikler.html' }),

  // ---- BARTIN ----
  pCity('bartin', 'etkinlikler', 'İnkumu Yaz Voleybolu Turnuvası', 'Plaj voleybolu tutkunlarını bir araya getirecek turnuva, 4-6 Eylül tarihlerinde İnkumu sahilinde düzenlenecek.', 'İnkumu Sahili', dateAt(4, 10, 0), 'Bartın Belediyesi', '🏐', 1, { source_url: 'https://www.bartinhalkgazetesi.com.tr/basvurmayi-unutmayin/55733' }),

  // ---- ERZİNCAN ----
  pCity('erzincan', 'etkinlikler', 'Üzümlü Kültür, Turizm ve Üzüm Festivali', 'Üzümlü Belediyesi tarafından düzenlenen festival, 20-21 Eylül tarihlerinde gerçekleştirilecek.', 'Üzümlü', dateAt(20, 10, 0), 'Üzümlü Belediyesi', '🍇', 5, { source_url: 'https://erzincan.ktb.gov.tr/TR-57423/yerel-etkinlikler.html' }),

  // ---- BİNGÖL ----
  pCity('bingol', 'yeme-icme', 'Yöresel Yemekler & Ballı Lezzetler Yarışması', 'İl Özel İdaresi\'nin etkinlik takviminde yer alan yarışma, Bingöl\'ün yöresel lezzetlerini ve balını tanıtmayı amaçlıyor.', 'Bingöl merkez', '', 'Bingöl İl Özel İdaresi', '🍯', 8, { source_url: 'http://www.bingolozelidare.gov.tr/duyurular' }),

  // ---- AMASYA ----
  pCity('amasya', 'etkinlikler', 'Piribaba Kültür ve Sanat Şenliği', 'Merzifon ilçesinde düzenlenen geleneksel şenlik, 9-10 Eylül tarihlerinde kültürel etkinliklerle sürecek.', 'Merzifon', dateAt(9, 15, 0), 'Amasya Valiliği', '🎪', 3, { source_url: 'http://www.amasya.gov.tr/etkinlikler' }),
  pCity('amasya', 'gundem', 'Suluova 1 Eylül Kültür ve Sanat Festivali', 'İlçenin kuruluş yıl dönümü kapsamında düzenlenen festival; türkü geceleri ve uçurtma şenliğiyle devam ediyor.', 'Suluova, Demokrasi Meydanı', '', 'Suluova Belediyesi', '🪁', 1, { source_url: 'https://www.objektifamasya.com/haber/28616687/amasyada-rengarenk-ucurtmalar-gokyuzunu-kapladi' }),

  // ---- KASTAMONU ----
  pCity('kastamonu', 'etkinlikler', 'Gökçeağaç Panayırı', 'Hanönü ilçesinin geleneksel panayırı, 8-12 Eylül tarihleri arasında yöresel ürün ve el sanatları stantlarıyla düzenlenecek.', 'Hanönü, Gökçeağaç Panayır Alanı', dateAt(8, 10, 0), 'Hanönü Belediyesi', '🎡', 1, { source_url: 'https://www.kastamonugundemgazetesi.com/gokceagac-panayiri-heyecani-basliyor/124768', is_featured: true }),

  // ---- UŞAK ----
  pCity('usak', 'etkinlikler', 'Milli Mücadele, Zafer ve Gençlik Günleri', 'Uşak Valiliği öncülüğünde düzenlenen etkinlikler; konserler, atlı okçuluk ve teknoloji etkinlikleriyle Millet Bahçesi\'nde sürüyor.', 'Uşak Millet Bahçesi', dateAt(0, 12, 0), 'Uşak Valiliği', '🎊', 3, { source_url: 'https://www.bha.net.tr/usak/usakta-milli-mucadele-ruhu-yeniden-canlaniyor/464123', is_featured: true }),

  // ---- KİLİS ----
  pCity('kilis', 'gundem', 'Kilis Festival Takvimi Netleşiyor', 'Vali başkanlığında yapılan toplantıda Zeytin, Biber ve Üzüm festivalleri ile Mercidabık Zaferi anma programlarının hazırlıkları ele alındı.', 'Kilis Valiliği', '', 'Kilis Valiliği', '🫒', 10, { source_url: 'https://www.kiliskenthaber.com/haber/kilis-te-festival-coskusu-basliyor-zeytin-biber-ve-uzum-sahneye-cikiyor-89123.html' }),

  // ---- BİLECİK ----
  pCity('bilecik', 'konserler', '100. Yıl Kurtuluş Festivali Konserleri', 'Zafer Bayramı ve kurtuluş kutlamaları kapsamında Cumhuriyet Meydanı\'nda Derya Uluğ, Zeynep Bastık ve Sakiler gibi isimler sahne alıyor.', 'Cumhuriyet Meydanı', dateAt(5, 21, 0), 'Bilecik Belediyesi', '🎤', 1, { source_url: 'https://www.bilecik.bel.tr/Haberler/470', is_featured: true }),

  // ---- KARAMAN ----
  pCity('karaman', 'sinema', 'Altın Elma Film Festivali ve 18. Akçaşehir Elma Kültür ve Sanat Festivali', 'Sinema dünyasından isimlerin konuk olacağı festival, 3-6 Eylül tarihlerinde Akçaşehir Belediyesi Festival Alanı\'nda düzenlenecek.', 'Akçaşehir Belediyesi Festival Alanı', dateAt(3, 10, 0), 'Akçaşehir Belediyesi', '🎬', 1, { source_url: 'https://www.gazeteanadolu.com/akcasehir-yildizlari-agirlacak/155774', is_featured: true }),

  // ---- KIRIKKALE ----
  pCity('kirikkale', 'etkinlikler', 'Yörük Türkmen Çalıştayı', 'Anadolu\'nun kültürel mirasını konu alan çalıştay, 4-6 Eylül tarihlerinde ilk kez Kırıkkale\'de düzenlenecek.', 'Kırıkkale', dateAt(4, 10, 0), 'İç Anadolu Yörük Türkmen Dernekleri Federasyonu', '🤝', 14, { source_url: 'https://haberkale.com/haber/turkmen-calistayi-olacak-50390' }),

  // ---- ÇANKIRI ----
  pCity('cankiri', 'trafik', 'Yol Çalışması Nedeniyle Geçici Trafik Kapatması', 'Abdülhalik Renda Mahallesi\'nde yürütülen çalışmalar nedeniyle bazı yollar 1-2 Eylül tarihlerinde araç trafiğine kapatılacak.', 'Abdülhalik Renda Mahallesi', dateAt(1, 8, 0), 'Çankırı Belediyesi', '🚧', 0, { source_url: 'https://www.cankirihaber.net/cankiri-belediyesi-duyurdu-dikkat' }),

  // ---- IĞDIR ----
  pCity('igdir', 'gundem', 'Kolektif Emekle Temiz Kentler Seferberlik Kampanyası', 'Belediye ve sivil toplum kuruluşlarının iş birliğiyle kentin farklı noktalarında çevre temizliği çalışmaları sürdürülüyor.', 'Iğdır geneli', '', 'Iğdır Belediyesi', '🧹', 5, { source_url: 'https://www.politikars.com/igdirda-temizlik-kampanyasi-baslatildi-kentin-farkli-bolgelerinde-calismalar-yapildi-588164h.htm' }),

  // ---- BAYBURT ----
  pCity('bayburt', 'gundem', '30. Uluslararası Bayburt Dede Korkut Bilim, Kültür ve Spor Şölenleri', 'Belediye, Valilik ve Üniversite iş birliğiyle düzenlenen köklü şölen; sergiler, sempozyum ve konserlerle gerçekleştirildi.', 'Bayburt Üniversitesi ve kent geneli', '', 'Bayburt Belediyesi', '🎉', 15, { source_url: 'https://www.bayburt.bel.tr/' }),

  // ---- GÜMÜŞHANE ----
  pCity('gumushane', 'etkinlikler', 'Yaşayan Miras Festivali Bu Sonbahar Gümüşhane\'de', 'T.C. Kültür ve Turizm Bakanlığı tarafından organize edilen festival, üç gün boyunca atölyeler, halk oyunları ve açık hava konserleriyle şehri kültür ve sanatla buluşturacak.', 'Gümüşhane merkez', '', 'T.C. Kültür ve Turizm Bakanlığı', '🎪', 3, { source_url: 'https://www.haber29.net/gumushane-sonbaharda-kultur-ve-sanat-solenine-ev-sahipligi-yapacak', is_featured: true }),

  // ---- ARDAHAN ----
  pCity('ardahan', 'gundem', 'Geleneksel ve Ulusal Bal Festivali', 'Ardahan Belediyesi\'nin düzenlediği bal festivali, yöresel ürün tanıtımları ve kültürel programlarla gerçekleştirildi.', 'Ardahan merkez', '', 'Ardahan Belediyesi', '🍯', 15, { source_url: 'https://ardahanhaberi.com/ardahan-da-2026-yaz-festivalleri-takvimi-aciklandi/190900/' }),

  // ---- SİİRT ----
  pCity('siirt', 'etkinlikler', 'TEKNOFEST 2026 Savaşan İHA Yarışmaları', 'Türkiye\'nin dört bir yanından gençlerin katıldığı yarışmalar, 3 Eylül\'e kadar Siirt Havalimanı\'nda sürüyor; Bayraktar TB2 SİHA da ziyarete açık.', 'Siirt Havalimanı', dateAt(3, 10, 0), 'T3 Vakfı / Baykar Teknoloji', '🚁', 4, { source_url: 'https://www.siirtmanset.com/teknofest-2026-heyecani-siirtte-basladi', is_featured: true }),

  // ---- TUNCELİ ----
  pCity('tunceli', 'gundem', 'Mameki Fest 2026', 'Aile, doğa, spor ve kültürü bir araya getiren festival; su sporları, çocuk programları ve atölyelerle 15 Temmuz Parkı\'nda gerçekleşti.', '15 Temmuz Parkı', '', 'Tunceli Belediyesi', '🎪', 20, { source_url: 'http://tunceli.bel.tr/haber/mameki-fest-basliyor' }),

  // ---- HAKKARİ ----
  pCity('hakkari', 'sinema', 'Ücretsiz Çocuk Sineması Günleri', 'Belediye, çocukları dijital ekranlardan uzaklaştırmak amacıyla ücretsiz animasyon film gösterimleri düzenliyor.', 'Hakkari merkez', '', 'Hakkari Belediyesi', '🎬', 10, { source_url: 'https://www.haberhakkari.com/haber/28360882/hakkari-belediyesinden-cocuklara-ucretsiz-sinema-soleni' }),

  // ---- ŞIRNAK ----
  pCity('sirnak', 'konserler', 'Uludere Gençlik ve Huzur Festivali', '27-30 Eylül tarihlerinde İnceler köyünde düzenlenecek festivalde Cengiz Ateş, Manuş Baba ve Yusuf Güney sahne alacak.', 'Uludere, İnceler Köyü', dateAt(27, 20, 0), 'Şırnak Valiliği', '🎤', 5, { source_url: 'http://sirnak.gov.tr/uludere-ilcesinde-genclik-ve-huzur-festivali', is_featured: true }),
];

function daysFromNowCompat(d, h = 12) {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  dt.setHours(h, 0, 0, 0);
  return dt.toISOString();
}

const posts = raw.map((post) => {
  const catSlugify = (s) =>
    s
      .toLocaleLowerCase('tr-TR')
      .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
      .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  return { ...post, slug: catSlugify(post.title) };
});

const db = { cities, categories, admin_users, posts };

fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2), 'utf-8');
console.log(`db.json oluşturuldu. ${posts.length} içerik eklendi.`);
