# Populating Test Data

## Quick Start - Test Endpoint (Recommended)

The easiest way to populate the database with test data is to call the test endpoint once your app is running and connected to the database:

```bash
# If running locally
curl "http://localhost:3000/api/test-populate?secret=changeme_dev_secret"

# If deployed on Portainer/NAS (replace with your IP)
curl "http://192.168.1.74:3000/api/test-populate?secret=changeme_dev_secret"
```

**Or open in a browser:**
- Local: http://localhost:3000/api/test-populate?secret=changeme_dev_secret
- Network: http://192.168.1.74:3000/api/test-populate?secret=changeme_dev_secret

### What This Creates

- **10 Professional Profiles** across globe (New York, London, Madrid, Toronto, Sydney, etc.)
- **5 Educational Resources** (visual schedules, social stories, emotion cards, etc.)
- **3 Articles** covering autism research topics

All data includes proper embeddings and is marked as APPROVED for instant visibility.

## Alternative: Seed Script

If you have direct database access, you can run the comprehensive seed script:

```bash
npm run seed
```

This requires:
- PostgreSQL running and accessible
- DATABASE_URL environment variable configured
- Direct database connection (works in development with local database)

## After Populating Data

Navigate to:
- `/articles` - Should show 3 research articles
- `/resources` - Should show 5 downloadable resources
- `/map` - Should show 10 professional providers on the map

## Troubleshooting

**"Unauthorized" error:**
- Check that `secret` parameter matches your `NEXTAUTH_SECRET`  in .env

**"Database connection error":**
- Ensure your PostgreSQL database is running
- Check DATABASE_URL in your environment
- For Portainer deployments, ensure the database container is healthy

**"No data showing":**
- Check browser console for errors
- Verify `status='APPROVED'` in database
- Clear cache and refresh the page

## Production Use

For production, use the AI-powered cron jobs instead:

```bash
# Generate articles from real research
curl "http://your-domain.com/api/cron/generate-articles?secret=$CRON_SECRET"

# Discover educational resources
curl "http://your-domain.com/api/cron/discover-resources?secret=$CRON_SECRET"
```

These require additional API keys (Google Custom Search) configured in your environment.
