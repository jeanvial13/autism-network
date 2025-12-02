# Portainer Deployment Guide

## Quick Fix - Rebuild and Populate Data

### Step 1: Commit Latest Changes

```powershell
cd c:\Users\mande\Desktop\AW\autism-network
git add .
git commit -m "Add database initialization and test-populate endpoint"
git push origin main
```

### Step 2: Rebuild Stack in Portainer

1. Log into Portainer
2. Go to **Stacks** → Find your autism-network stack
3. Click on the stack name
4. Scroll down and click **"Pull and redeploy"** or **"Update the stack"**
5. Wait for rebuild (5-10 minutes)

### Step 3: Check Container Logs

1. Go to **Containers**
2. Find `autism-network_app` (or similar name)
3. Click on it and go to **Logs** tab
4. Look for these SUCCESS messages:
   ```
   ✅ PostgreSQL is up!
   ✅ Database schema synced!
   🌐 Starting Next.js server...
   ```

### Step 4: Verify Health

Open in browser:
```
http://192.168.1.74:3000/api/health
```

Should show:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-12-02T..."
}
```

### Step 5: Populate Data

Open in browser:
```
http://192.168.1.74:3000/api/test-populate?secret=changeme_dev_secret
```

Should show:
```json
{
  "success": true,
  "message": "Test data populated successfully",
  "data": {
    "professionals": 10,
    "resources": 5,
    "articles": 3
  }
}
```

### Step 6: Verify Pages

All these should now show data:
- http://192.168.1.74:3000/articles
- http://192.168.1.74:3000/resources  
- http://192.168.1.74:3000/map

---

## What Was Fixed

1. **Added entrypoint.sh** - Automatically syncs database schema on container startup
2. **Added health check endpoint** - `/api/health` to verify database connection
3. **Updated Dockerfile** - Installs netcat for database waiting
4. **Test populate endpoint** - Already created, just needed to deploy

## Troubleshooting

### Container won't start / keeps restarting

**Check logs for errors:**
1. Portainer → Containers → Click your app container → Logs
2. Look for red errors

**Common fixes:**
- Ensure PostgreSQL container is running and healthy
- Check DATABASE_URL in stack environment variables
- Verify port 3000 isn't already in use

### Health endpoint shows "disconnected"

**Fix database connection:**
1. Verify PostgreSQL container is running
2. Check DATABASE_URL format: `postgresql://postgres:postgres@postgres:5432/autism_network`
3. Ensure postgres container name matches (should be `postgres` in same Docker network)

### test-populate returns 404

**Code not deployed:**
- Rebuild the stack (force pull from git)
- Check that git push was successful
- Verify Portainer is pulling from correct branch

### Pages still empty after populate

**Clear cache and check:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Check browser console for JavaScript errors  
3. Verify data was inserted:
   ```bash
   docker exec <postgres-container-name> psql -U postgres -d autism_network -c "SELECT COUNT(*) FROM \"Article\""
   ```

---

## Files Changed in This Update

- ✅ [entrypoint.sh](file:///c:/Users/mande/Desktop/AW/autism-network/entrypoint.sh) - Database init script
- ✅ [Dockerfile](file:///c:/Users/mande/Desktop/AW/autism-network/Dockerfile) - Uses entrypoint
- ✅ [src/app/api/health/route.ts](file:///c:/Users/mande/Desktop/AW/autism-network/src/app/api/health/route.ts) - Health check
- ✅ [src/app/api/test-populate/route.ts](file:///c:/Users/mande/Desktop/AW/autism-network/src/app/api/test-populate/route.ts) - Data population
