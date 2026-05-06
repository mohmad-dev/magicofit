# Database Setup Guide

This project supports multiple database options. Choose the one that best fits your needs:

- **Supabase** (Recommended for Production) - Managed PostgreSQL with free tier
- **PostgreSQL via Docker** - Self-hosted, good for development
- **Local PostgreSQL** - Installed directly on your machine

## Quick Start

### Option 1: Supabase (Recommended for Production) ✨

A managed PostgreSQL database with free tier, automatic backups, and built-in features.

**Already configured for this project:**
- Project: magicofit
- Region: eu-west-3 (Paris)
- Status: ACTIVE_HEALTHY

**Setup:**
1. Get your database password from [Supabase Dashboard](https://supabase.com/dashboard/project/hmphprybilzjdyaypgcy)
2. Update `.env` file with your password:
   ```env
   DATABASE_URL=postgresql://postgres.hmphprybilzjdyaypgcy:YOUR_PASSWORD@db.hmphprybilzjdyaypgcy.supabase.co:5432/postgres
   ```
3. Run backend:
   ```bash
   cd backend/apps/backend
   npm run dev
   ```

**Full Guide:** See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

---

### Option 2: Using Docker (Recommended for Development)

#### 1. Start Database Services

Run the following command from the project root:

```bash
# Start PostgreSQL only (minimal setup)
docker-compose up -d postgres

# Or start all services (PostgreSQL + Redis + Meilisearch)
docker-compose --profile full up -d
```

This will start:
- **PostgreSQL 16** (port 5432) - Primary database
- **Redis 7** (port 6379) - Caching and event bus (with `--profile full`)
- **Meilisearch** (port 7700) - Search engine (with `--profile full`)

#### 2. Verify Services are Running

```bash
docker-compose ps
```

All services should show as "Up" with healthy status.

#### 3. Initialize Database

The database will be automatically initialized when you first run the Medusa backend:

```bash
cd backend
npm run dev
```

Medusa will automatically:
- Create all required tables
- Run migrations
- Seed initial data

### Option 2: Without Docker (Alternative)

If you don't have Docker installed:

1. **Install PostgreSQL locally**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql@16`
   - Linux: `sudo apt-get install postgresql-16`

2. **Create database**
   ```bash
   psql -U postgres
   CREATE DATABASE magicofit;
   CREATE USER medusa WITH PASSWORD 'medusa_password';
   GRANT ALL PRIVILEGES ON DATABASE magicofit TO medusa;
   \q
   ```

3. **Update .env**
   ```env
   DATABASE_URL=postgresql://medusa:medusa_password@localhost:5432/magicofit
   # Comment out REDIS_URL if not using Redis
   # REDIS_URL=redis://localhost:6379
   ```

4. **Run backend**
   ```bash
   cd backend
   npm run dev
   ```

## Database Connection Details

- **Database**: magicofit
- **User**: medusa
- **Password**: medusa_password
- **Host**: localhost
- **Port**: 5432
- **Connection String**: `postgresql://medusa:medusa_password@localhost:5432/magicofit`

## Stopping Services

```bash
docker-compose down
```

To stop and remove volumes (this will delete all data):

```bash
docker-compose down -v
```

## Viewing Database Data

### Using pgAdmin (GUI)

1. Install pgAdmin from https://www.pgadmin.org/
2. Connect to: `localhost:5432`
3. Use credentials from above
4. Browse the `magicofit` database

### Using psql (CLI)

```bash
# Connect to PostgreSQL container
docker exec -it magicofit-postgres psql -U medusa -d magicofit

# List tables
\dt

# Exit
\q
```

## Redis Management

### Using Redis CLI

```bash
# Connect to Redis container
docker exec -it magicofit-redis redis-cli

# Ping
ping

# List all keys
keys *

# Exit
exit
```

### Using RedisInsight (GUI)

1. Download from https://redis.com/redis-enterprise/redis-insight/
2. Connect to: `localhost:6379`
3. Browse data in real-time

## Meilisearch Management

### Using Web Interface

Open: http://localhost:7700

Default master key: `masterKey123`

### Using CLI

```bash
# Get indexes
curl http://localhost:7700/indexes

# Get documents
curl http://localhost:7700/indexes/products/documents
```

## Backup & Restore

### Backup PostgreSQL

```bash
# Backup
docker exec magicofit-postgres pg_dump -U medusa magicofit > backup.sql

# Restore
cat backup.sql | docker exec -i magicofit-postgres psql -U medusa -d magicofit
```

### Backup Redis

```bash
# Redis data is automatically persisted to Docker volume
# The volume is located at: redis_data
```

### Backup Meilisearch

```bash
# Meilisearch data is automatically persisted to Docker volume
# The volume is located at: meili_data
```

## Troubleshooting

### Port Already in Use

If you get a port conflict, change the port in `.env`:

```env
POSTGRES_PORT=5433
REDIS_PORT=6380
MEILI_PORT=7701
```

Then update connection strings in `backend/apps/backend/.env` accordingly.

### Database Connection Failed

1. Ensure Docker is running
2. Check if PostgreSQL container is healthy: `docker-compose ps`
3. Check logs: `docker-compose logs postgres`
4. Verify credentials in `.env` match

### Services Not Starting

1. Check Docker Desktop is running
2. Check port conflicts
3. View logs: `docker-compose logs [service-name]`
4. Restart: `docker-compose restart [service-name]`

## Production Deployment

For production, you should:

1. **Use managed PostgreSQL** (AWS RDS, Google Cloud SQL, etc.)
2. **Use managed Redis** (ElastiCache, Memorystore, etc.)
3. **Use managed Meilisearch** or switch to Algolia
4. **Change all secrets** in environment variables
5. **Enable SSL** for database connections
6. **Set up regular backups**

Example production DATABASE_URL:
```
postgresql://user:password@production-db.rds.amazonaws.com:5432/magicofit?sslmode=require
```

## Development vs Production

### Development (Current Setup)
- PostgreSQL via Docker
- Redis via Docker
- Meilisearch via Docker
- Local file system for uploads

### Production (Recommended)
- Managed PostgreSQL (AWS RDS, Neon, Supabase)
- Managed Redis (AWS ElastiCache, Upstash)
- Managed Search (Meilisearch Cloud, Algolia)
- Cloud storage for uploads (AWS S3, Cloudflare R2)

## Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/docs/)
- [Meilisearch Documentation](https://docs.meilisearch.com/)
- [Medusa Database Guide](https://docs.medusajs.com/learn-fundamentals/databases)
