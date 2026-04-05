# ShipLog 🚢

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wsbjwjt/shiplog)

A beautiful changelog SaaS platform for your products. Built with Next.js 14, Prisma, and NextAuth.js v5.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)

## Features

- ✨ **Product Management** - Create and manage products with auto-generated slugs
- 📝 **Changelog Management** - Write changelogs with Markdown support and semver validation
- 👥 **Team Collaboration** - Invite team members with role-based access (OWNER/MEMBER)
- 👍 **Voting System** - Users can upvote/downvote changelogs
- 🔐 **OAuth Authentication** - GitHub and Google login
- 🖼️ **OG Images** - Auto-generated Open Graph images for social sharing
- 🎨 **Beautiful UI** - Linear-inspired dark theme with Tailwind CSS
- 📱 **Responsive** - Works on all devices

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (Prisma ORM v7)
- **Auth:** NextAuth.js v5
- **UI Components:** shadcn/ui
- **Deployment:** Vercel

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database (Supabase recommended)
- GitHub OAuth App
- Google OAuth Client

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/wsbjwjt/shiplog.git
cd shiplog

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Run database migrations
npx prisma migrate dev

# 5. Generate Prisma client
npx prisma generate

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

### Vercel (Recommended)

1. Click the "Deploy with Vercel" button above
2. Configure environment variables
3. Deploy!

Or manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) for detailed instructions.

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret"

# OAuth
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Documentation

- [BUILD_SUMMARY.md](./BUILD_SUMMARY.md) - Build details
- [REVIEW_REPORT.md](./REVIEW_REPORT.md) - Code review
- [QA_REPORT.md](./QA_REPORT.md) - QA results
- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Deployment guide
- [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) - CI/CD setup

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/products` | GET, POST | List/create products |
| `/api/products/[id]` | GET, PUT, DELETE | Product CRUD |
| `/api/changelogs/[id]` | GET, PUT, DELETE | Changelog operations |
| `/api/changelogs/[id]/vote` | POST | Vote on changelog |
| `/api/teams` | GET, POST | Team management |
| `/api/teams/[id]/invites` | GET, POST | Invite members |
| `/api/og` | GET | OG image generation |
| `/api/public/[user]/[product]` | GET | Public product data |

## Project Structure

```
shiplog/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Dashboard page
│   │   ├── login/         # Login page
│   │   └── p/             # Public product pages
│   ├── components/        # React components
│   └── lib/               # Utilities
│       ├── auth.ts        # NextAuth config
│       ├── prisma.ts      # Prisma client
│       └── utils-server.ts # Server utilities
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

Built with ❤️ by [wsbjwjt](https://github.com/wsbjwjt)
