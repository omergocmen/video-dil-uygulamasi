# LingoMaster - İngilizce Öğrenme Uygulaması 🎓

Duolingo benzeri, AI destekli interaktif İngilizce öğrenme platformu.

## Özellikler

- 📚 **Bölüm Bazlı İlerleme**: Sırayla bölümleri tamamla
- ❓ **Çeşitli Soru Tipleri**: Çoktan seçmeli ve boşluk doldurma
- 🤖 **AI Tutor**: Mistral AI ile İngilizce öğretmen asistanı
- ⚙️ **Admin Paneli**: Bölüm ve soru yönetimi
- 📊 **İlerleme Takibi**: localStorage ile seviye kaydetme
  
## Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Supabase Kurulumu

1. [Supabase](https://supabase.com)'a gidin ve ücretsiz hesap oluşturun
2. Yeni bir proje oluşturun
3. **Settings > API** kısmından:
   - `Project URL` kopyalayın
   - `anon public` key kopyalayın
4. **SQL Editor** kısmına gidin ve `supabase-schema.sql` dosyasındaki SQL'i çalıştırın

### 3. Ortam Değişkenlerini Ayarla

`.env.local` dosyasını düzenleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
MISTRAL_API_KEY=6Imx01IqvXQUTjG2SHFvaybE48W7HQMd
```

### 4. Çalıştır

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacak.

## Kullanım

### Ana Sayfa (`/`)
- Mevcut bölümleri görüntüle
- Kilitli/açık bölümleri gör
- Bölüm seçerek oyuna başla

### Oyun Ekranı (`/game/[levelId]`)
- Soruları cevapla
- Doğru/yanlış geri bildirimi al
- AI Tutor'dan yardım iste
- Bölümü tamamla ve sonraki bölüme geç

### Admin Paneli (`/admin`)
- Yeni bölüm ekle
- Bölüm sil
- Soru ekle (çoktan seçmeli veya boşluk doldurma)
- Soru sil

### AI Tutor
- Sağ alttaki 🤖 butonuna tıkla
- İngilizce sorularını sor
- Dil bilgisi, kelime, çeviri yardımı al

## Teknolojiler

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Mistral AI API
- **Deployment**: Vercel (önerilen)

## Proje Yapısı

```
src/
├── app/
│   ├── page.tsx              # Ana sayfa (bölüm seçimi)
│   ├── admin/page.tsx        # Admin paneli
│   ├── game/[levelId]/       # Oyun ekranı
│   └── api/chat/route.ts     # AI chat API
├── components/
│   └── ChatBot.tsx           # AI Tutor chat bileşeni
├── lib/
│   ├── supabase.ts           # Supabase client ve fonksiyonlar
│   └── mistral.ts            # Mistral AI helper
└── types/
    └── index.ts              # TypeScript tipleri
```

## SQL Şeması

`supabase-schema.sql` dosyası:
- `levels` tablosu: Bölüm bilgileri
- `questions` tablosu: Soru bilgileri
- `progress` tablosu: Kullanıcı ilerlemesi (opsiyonel)
- Örnek veriler
- Row Level Security (RLS) politikaları

## Lisans

MIT
