# Supabase Database Setup Guide

This project uses **Supabase** as the managed PostgreSQL database provider. Supabase provides a fully-managed PostgreSQL database with built-in features like authentication, real-time subscriptions, and storage.

## Project Details

- **Project Name**: magicofit
- **Project ID**: hmphprybilzjdyaypgcy
- **Region**: eu-west-3 (Paris)
- **Database Version**: PostgreSQL 17.6.1.111
- **Status**: ACTIVE_HEALTHY

## Connection Information

### Database URL
```
postgresql://postgres.hmphprybilzjdyaypgcy:YOUR_PASSWORD@db.hmphprybilzjdyaypgcy.supabase.co:5432/postgres
```

**Important**: Replace `YOUR_PASSWORD` with your actual database password from Supabase dashboard.

### API Endpoints
- **Project URL**: https://hmphprybilzjdyaypgcy.supabase.co
- **REST API**: https://hmphprybilzjdyaypgcy.supabase.co/rest/v1/
- **GraphQL**: https://hmphprybilzjdyaypgcy.supabase.co/graphql/v1
- **Studio**: https://supabase.com/dashboard/project/hmphprybilzjdyaypgcy

### API Keys
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtcGhwcnliaWx6amR5YXlwZ2N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjU3NzEsImV4cCI6MjA5Mjk0MTc3MX0.hy8NIIZn0rkFtYZriZfDi0Z9QLh7y5liRokqfE8W1nw`
- **Publishable Key**: `sb_publishable_Rg6qjN9CvvgfMLxS8vxtHg_Zi6l7NIL`

**Note**: For server-side operations, you need the `service_role` key from Supabase dashboard.

## Getting Your Database Password

1. Go to https://supabase.com/dashboard/project/hmphprybilzjdyaypgcy
2. Navigate to **Settings** → **Database**
3. Scroll to **Connection String**
4. Click **Copy** to get the full connection string with password
5. Update the `.env` file with your password

## Environment Variables

The following variables are already configured in your `.env` files:

```env
# Database
DATABASE_URL=postgresql://postgres.hmphprybilzjdyaypgcy:YOUR_PASSWORD@db.hmphprybilzjdyaypgcy.supabase.co:5432/postgres

# Supabase Client
NEXT_PUBLIC_SUPABASE_URL=https://hmphprybilzjdyaypgcy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtcGhwcnliaWx6amR5YXlwZ2N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjU3NzEsImV4cCI6MjA5Mjk0MTc3MX0.hy8NIIZn0rkFtYZriZfDi0Z9QLh7y5liRokqfE8W1nw
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Rg6qjN9CvvgfMLxS8vxtHg_Zi6l7NIL
```

## Connecting to Database

### Option 1: Using Supabase Studio (Web UI)

1. Go to https://supabase.com/dashboard/project/hmphprybilzjdyaypgcy
2. Click on **Table Editor** to view and edit tables
3. Click on **SQL Editor** to run SQL queries

### Option 2: Using psql (CLI)

```bash
# Get connection string from Supabase dashboard
psql "postgresql://postgres.hmphprybilzjdyaypgcy:YOUR_PASSWORD@db.hmphprybilzjdyaypgcy.supabase.co:5432/postgres"
```

### Option 3: Using TablePlus, DBeaver, or pgAdmin

Use the connection details:
- **Host**: db.hmphprybilzjdyaypgcy.supabase.co
- **Port**: 5432
- **Database**: postgres
- **User**: postgres
- **Password**: YOUR_PASSWORD

## Running Migrations

When you run the Medusa backend, it will automatically create the necessary tables:

```bash
cd backend/apps/backend
npm run dev
```

Medusa will:
- Create all required tables
- Run migrations
- Seed initial data

## Supabase Features

### 1. Database
- Fully managed PostgreSQL 17
- Automatic backups
- Point-in-time recovery
- Connection pooling

### 2. Authentication (Optional)
If you want to use Supabase Auth instead of Medusa Auth:
- Email/password authentication
- OAuth providers (Google, GitHub, etc.)
- Phone authentication
- Magic links

### 3. Real-time (Optional)
Subscribe to database changes in real-time:
- Row level changes
- Database notifications
- Presence tracking

### 4. Storage (Optional)
Store files directly in Supabase:
- Image uploads
- File management
- CDN delivery

## Security Best Practices

### 1. Row Level Security (RLS)

Enable RLS to restrict data access:

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Public products are viewable by everyone"
ON products FOR SELECT
USING (true);
```

### 2. API Keys

- **Anon Key**: Use in client-side code (public)
- **Service Role Key**: Use in server-side code (secret, never expose)
- Get service role key from: Settings → API

### 3. Environment Variables

Never commit service role keys to version control. Use environment variables:

```env
# Client-side (safe)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Server-side (secret)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Monitoring

### Database Metrics

View metrics in Supabase Dashboard:
- CPU usage
- Memory usage
- Storage usage
- Connection count
- Query performance

### Logs

View logs in Supabase Dashboard:
- Database logs
- API logs
- Auth logs
- Function logs

## Backup & Restore

### Automatic Backups

Supabase provides automatic daily backups (retention: 7 days for free tier).

### Manual Backup

1. Go to **Database** → **Backups**
2. Click **Create backup**
3. Download the backup file

### Restore

1. Go to **Database** → **Backups**
2. Select a backup
3. Click **Restore**

## Troubleshooting

### Connection Timeout

- Check your firewall allows outbound connections to Supabase
- Verify the database password is correct
- Check if the project is paused (free tier pauses after 1 week of inactivity)

### Migration Failed

- Check Medusa logs for specific error
- Verify database permissions
- Run migrations manually in Supabase SQL Editor

### Performance Issues

- Check database metrics in Supabase Dashboard
- Add indexes to frequently queried columns
- Consider upgrading to Pro tier for better performance

## Switching Back to Local Development

If you want to switch back to local PostgreSQL (Docker):

1. Comment out Supabase DATABASE_URL in `.env`
2. Uncomment local DATABASE_URL:
   ```env
   # DATABASE_URL=postgresql://postgres.hmphprybilzjdyaypgcy:YOUR_PASSWORD@db.hmphprybilzjdyaypgcy.supabase.co:5432/postgres
   DATABASE_URL=postgresql://medusa:medusa_password@localhost:5432/magicofit
   ```
3. Run Docker Compose:
   ```bash
   docker-compose up -d postgres
   ```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Dashboard](https://supabase.com/dashboard/project/hmphprybilzjdyaypgcy)
- [Medusa with Supabase](https://docs.medusajs.com/guides/architecture/modules/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
