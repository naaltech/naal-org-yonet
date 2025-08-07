# Nevzat Ayaz Anadolu Lisesi Kulüp Yönetim Sistemi

Modern bir kulüp yönetim sistemi. Kulüp üyeleri için sertifika oluşturma, kulüp bilgilerini yönetme ve URL yönlendirme özelliklerini içeren web uygulaması.

## 🚀 Özellikler

- **Sertifika Yönetimi**: Dijital ve PDF sertifika oluşturma ve yönetme
- **Kulüp Bilgileri**: Kulüp profil bilgilerini düzenleme
- **URL Yönetimi**: URL yönlendirme sistemi
- **Yetki Tabanlı Erişim**: Admin ve kullanıcı rolleri
- **Modern UI**: Tailwind CSS ve shadcn/ui ile tasarlanmış kullanıcı arayüzü
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu

## 🛠️ Teknolojiler

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Authentication, Database)
- **Forms**: React Hook Form, Zod
- **Icons**: Lucide React
- **Deployment**: Vercel (önerilen)

## 📋 Gereksinimler

- Node.js 18+ 
- npm/pnpm/yarn
- Supabase hesabı

## 🏃‍♂️ Kurulum

1. **Projeyi klonlayın:**
```bash
git clone https://github.com/naaltech/naal-org-yonet.git
cd naal-org-yonet
```

2. **Bağımlılıkları yükleyin:**
```bash
pnpm install
# veya
npm install
```

3. **Ortam değişkenlerini ayarlayın:**
`.env.local` dosyasını oluşturun:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Discord Webhook (opsiyonel)
NEXT_PUBLIC_DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

4. **Geliştirme sunucusunu başlatın:**
```bash
pnpm dev
# veya
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 📁 Proje Yapısı

```
├── app/                    # Next.js App Router
│   ├── certificates/       # Sertifika yönetimi
│   ├── club-info/         # Kulüp bilgileri
│   ├── dashboard/         # Ana panel
│   ├── login/             # Giriş sayfası
│   └── urls/              # URL yönetimi
├── components/            # UI bileşenleri
│   └── ui/               # shadcn/ui bileşenleri
├── contexts/             # React Context'leri
├── hooks/                # Custom Hook'lar
├── lib/                  # Yardımcı fonksiyonlar
└── public/               # Statik dosyalar
```

## 🎯 Kullanım

### Giriş Yapma
- Kulüp email'i ile Supabase authentication üzerinden giriş yapın
- Admin hesabı: `admin@naal.org.tr`

### Sertifika Oluşturma
1. Dashboard'dan "Sertifika Oluştur" seçeneğine tıklayın
2. Dijital sertifika veya PDF sertifika seçin
3. Gerekli bilgileri doldurun
4. Sertifikayı oluşturun

### Kulüp Bilgilerini Düzenleme
1. Dashboard'dan "Kulüp Bilgileri" seçeneğine tıklayın
2. Logo, açıklama, Instagram hesapları vb. bilgileri güncelleyin
3. Değişiklikleri kaydedin

### Admin Özellikleri
- Tüm kulüplerin sertifikalarını görüntüleme
- Tüm kulüp bilgilerini düzenleme
- Sistem genelinde yönetim

## 🔧 Yapılandırma

### Supabase Veritabanı

Gerekli tablolar:
- `clubs`: Kulüp bilgileri
- `cert`: Dijital sertifikalar  
- `cert_pdf`: PDF sertifikaları

### Ortam Değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL'i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonim API anahtarı |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase servis rolü anahtarı |
| `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` | Discord bildirim webhook'u |

## 🚀 Deployment

### Vercel ile Deploy

1. GitHub repository'nizi Vercel'e bağlayın
2. Ortam değişkenlerini Vercel dashboard'unda ekleyin
3. Deploy edin

### Manuel Deploy

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## 📝 Geliştirme

### Kod Standartları
- TypeScript kullanın
- ESLint kurallarına uyun
- Tailwind CSS sınıflarını kullanın
- shadcn/ui bileşenlerini tercih edin

### Yeni Özellik Ekleme
1. Feature branch oluşturun
2. Geliştirmeyi yapın
3. Test edin
4. Pull request açın

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.
