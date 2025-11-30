# Autism Network - Deployment Guide

## Prerequisites

- Docker installed on your NAS
- Portainer configured
- GitHub repository set up (optional, for CI/CD)

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Production Deployment (Docker)

### 1. Environment Variables

Create a `.env.production` file with:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/autism_network

# Authentication
NEXTAUTH_SECRET=your-secure-random-secret-here
NEXTAUTH_URL=https://your-domain.com

# API Keys
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
GOOGLE_PLACES_API_KEY=your-google-places-key
OPENAI_API_KEY=your-openai-api-key

# Optional
REDIS_URL=redis://redis:6379
MEILISEARCH_HOST=http://meilisearch:7700
```

### 2. Build and Deploy with Docker Compose

```bash
# Build the application
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app
```

### 3. Initialize Database

```bash
# Run Prisma migrations
docker-compose exec app npx prisma migrate deploy

# (Optional) Seed initial data
docker-compose exec app npx prisma db seed
```

## Portainer Deployment

### Method 1: Stack Deployment

1. Open Portainer
2. Go to **Stacks** → **Add Stack**
3. Name: `autism-network`
4. Build method: **Repository**
5. Repository URL: `https://github.com/your-username/autism-network`
6. Compose path: `compose.yml`
7. Add environment variables from `.env.production`
8. Click **Deploy the stack**

### Method 2: Manual Upload

1. Build locally: `docker build -t autism-network:latest .`
2. Save image: `docker save autism-network:latest | gzip > autism-network.tar.gz`
3. Upload to NAS
4. Load image: `docker load < autism-network.tar.gz`
5. Deploy via Portainer using the uploaded image

## Post-Deployment

### 1. Verify Services

```bash
# Check all containers are running
docker-compose ps

# Test the application
curl http://localhost:3000

# Test API endpoints
curl http://localhost:3000/api/auth/providers
```

### 2. Setup HTTPS (Recommended)

Update `compose.yml` to include Traefik or Nginx for SSL:

```yaml
services:
  traefik:
    image: traefik:v2.10
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.email=your@email.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./letsencrypt:/letsencrypt
```

### 3. Database Backup

```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres autism_network > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres autism_network < backup.sql
```

## Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Health Checks

Add to `compose.yml`:

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Troubleshooting

### Build Fails

```bash
# Clear build cache
docker-compose build --no-cache

# Check Node version
docker run --rm node:20-alpine node --version
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose exec postgres psql -U postgres -c "SELECT 1"

# Verify DATABASE_URL
docker-compose exec app printenv DATABASE_URL
```

### AI Chat Not Working

1. Verify `OPENAI_API_KEY` is set
2. Check API route logs: `docker-compose logs -f app | grep chat`
3. Test API directly: `curl -X POST http://localhost:3000/api/chat -d '{"messages":[]}'`

## Scaling

### Horizontal Scaling

```yaml
services:
  app:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

### Load Balancer

Add Nginx or Traefik to distribute traffic across replicas.

## Security Checklist

- [ ] Change default passwords in `.env`
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set up firewall rules (only expose 80/443)
- [ ] Enable rate limiting on API routes
- [ ] Regular security updates: `docker-compose pull && docker-compose up -d`
- [ ] Database backups scheduled (daily recommended)
- [ ] Monitor logs for suspicious activity

## Maintenance

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Run migrations if needed
docker-compose exec app npx prisma migrate deploy
```

### Clean Up

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Review [specification.md](./specification.md)
- Review [walkthrough.md](./walkthrough.md)
