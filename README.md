# Autism — AI Powered Global Autism Network

A global, AI-powered platform connecting people with autism support, trusted information, and verified professionals—safely, ethically, and accessibly.

## Features

- 🤖 **AI Chat Assistant** - Evidence-based Q&A powered by GPT-4
- 📚 **Resource Library** - Curated scientific articles and guides
- 🗺️ **Global Map** - Find autism centers and professionals worldwide
- 👨‍⚕️ **Professional Directory** - Verified therapists and specialists
- 📰 **Daily Research** - AI-generated summaries of latest autism research
- 🌍 **Multilingual** - Support for multiple languages
- ♿ **Accessible** - WCAG 2.1 AA compliant, autism-friendly design

## Tech Stack

- **Frontend:** Next.js 15, React 18, TailwindCSS, ShadCN UI
- **Backend:** Node.js, Prisma ORM
- **Database:** PostgreSQL with pgvector
- **AI:** OpenAI GPT-4, Vercel AI SDK
- **Auth:** NextAuth v5
- **Deployment:** Docker, Portainer

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run development server
npm run dev

# Open http://localhost:3000
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Docker Compose

```bash
docker-compose up -d
```

## Project Structure

```
autism-network/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── map/          # Global map page
│   │   └── resources/    # Resource library
│   ├── components/       # React components
│   │   ├── ai/           # Chat interface
│   │   ├── map/          # Map components
│   │   └── resources/    # Resource components
│   └── lib/              # Utilities
├── prisma/               # Database schema
├── public/               # Static assets
└── compose.yml           # Docker configuration
```

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for auth
- `OPENAI_API_KEY` - OpenAI API key

Optional:
- `GOOGLE_PLACES_API_KEY` - For map features
- `NEXT_PUBLIC_MAPBOX_TOKEN` - For map visualization

## Contributing

This is a private project. For questions or suggestions, please contact the maintainer.

## License

Proprietary - All rights reserved

## Support

For deployment issues, see [DEPLOYMENT.md](./DEPLOYMENT.md)
For technical details, see [specification.md](./specification.md)
