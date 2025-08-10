[![Netlify Status](https://api.netlify.com/api/v1/badges/66759a92-d1d0-4acf-b05b-7c354b819ce0/deploy-status)](https://app.netlify.com/projects/nevzatayaz-admin/deploys)
# Nevzat Ayaz Anatolian High School Club Management System

A modern club management system. A web application that includes certificate creation for club members, club information management, and URL redirection features.

## 🚀 Features

- **Certificate Management**: Create and manage digital and PDF certificates
- **Club Information**: Edit club profile information
- **URL Management**: URL redirection system
- **Role-Based Access**: Admin and user roles
- **Modern UI**: User interface designed with Tailwind CSS and shadcn/ui
- **Responsive Design**: Mobile and desktop compatible

## 🛠️ Technologies

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Authentication, Database)
- **Forms**: React Hook Form, Zod
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📋 Requirements

- Node.js 18+ 
- npm/pnpm/yarn
- Supabase account

## 🏃‍♂️ Installation

1. **Clone the project:**
```bash
git clone https://github.com/naaltech/naal-org-admin.git
cd naal-org-yonet
```

2. **Install dependencies:**
```bash
pnpm install
# or
npm install
```

3. **Set environment variables:**
Create a `.env.local` file:
```bash
# Supabase Keys
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Catbox User Hash
NEXT_PUBLIC_CATBOX_USERHASH=

# ImageBB API Key
IBB_API_KEY=

# Cloudflare Turnstile Site Key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

4. **Start the development server:**
```bash
pnpm dev
# or
npm run dev
```

The application will run at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── certificates/       # Certificate management
│   ├── club-info/         # Club information
│   ├── dashboard/         # Main dashboard
│   ├── login/             # Login page
│   └── urls/              # URL management
├── components/            # UI components
│   └── ui/               # shadcn/ui components
├── contexts/             # React Contexts
├── hooks/                # Custom Hooks
├── lib/                  # Utility functions
└── public/               # Static files
```

## 🎯 Usage

### Logging In
- Log in with club email through Supabase authentication
- Admin account: `admin@naal.org.tr`

### Creating Certificates
1. Click on "Create Certificate" option from the dashboard
2. Choose digital certificate or PDF certificate
3. Fill in the required information
4. Create the certificate

### Editing Club Information
1. Click on "Club Information" option from the dashboard
2. Update information such as logo, description, Instagram accounts, etc.
3. Save the changes

### Admin Features
- View all clubs' certificates
- Edit all club information
- System-wide management

## 🔧 Configuration

### Supabase Database

Required tables:
- `clubs`: Club information
- `cert`: Digital certificates  
- `cert_pdf`: PDF certificates

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous API key |
| `NEXT_PUBLIC_CATBOX_USERHASH` | CATBOX.MOE Userhash |
| `IBB_API_KEY` | IBB.CO API key |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile Website Key |

## 🚀 Deployment

### Deploy with Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy

### Manual Deployment

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
