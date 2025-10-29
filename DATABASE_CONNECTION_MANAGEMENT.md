# Database Connection Management Guide

## Problem
The application was opening too many database connections and not closing them properly, leading to connection exhaustion on the production PostgreSQL database.

## Solutions Implemented

### 1. Connection Pooling Parameters
Added connection pooling parameters to the `DATABASE_URL` in `.env`:

```
connection_limit=10      # Maximum connections per Prisma Client instance
pool_timeout=20          # Timeout in seconds for acquiring a connection
connect_timeout=15       # Timeout in seconds for establishing a connection
```

**Adjust these values based on your needs:**
- For Vercel/Serverless: Use lower limits (5-10)
- For traditional servers: Can use higher limits (20-50)
- Check your database plan's connection limit on Aiven

### 2. Improved Prisma Client Singleton
Updated `/src/db/index.ts` with:
- Proper logging configuration
- Graceful shutdown handlers (SIGINT, SIGTERM)
- Environment-aware configuration

### 3. Database Utility Functions
Created `/src/db/utils.ts` with helper functions:

#### `withPrisma(callback)`
Wraps database operations with automatic connection management for serverless:

```typescript
import { withPrisma } from "@/db/utils";

export async function GET() {
  return withPrisma(async () => {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  });
}
```

#### `checkDatabaseConnection()`
Checks if database is reachable:

```typescript
const isHealthy = await checkDatabaseConnection();
```

#### `getDatabaseInfo()`
Gets active connection count for monitoring:

```typescript
const info = await getDatabaseInfo();
console.log(`Active connections: ${info?.activeConnections}`);
```

### 4. Health Check Endpoint
Created `/api/health` endpoint to monitor database connections:

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "activeConnections": 5
  },
  "timestamp": "2025-10-29T..."
}
```

## Best Practices

### For API Routes
```typescript
// GOOD: Use the singleton prisma instance
import prisma from "@/db";

export async function GET() {
  const data = await prisma.user.findMany();
  return NextResponse.json(data);
}

// EVEN BETTER: Use withPrisma wrapper (for serverless)
import { withPrisma } from "@/db/utils";

export async function GET() {
  return withPrisma(async () => {
    const data = await prisma.user.findMany();
    return NextResponse.json(data);
  });
}
```

### What NOT to do
```typescript
// ❌ BAD: Creating new PrismaClient instances
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient(); // This creates a new connection pool!
  const data = await prisma.user.findMany();
  return NextResponse.json(data);
}

// ❌ BAD: Not importing from the singleton
import { PrismaClient } from "../../prisma/client";
const prisma = new PrismaClient();
```

### Always Use Transactions for Multiple Operations
```typescript
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.userDetails.create({ data: { userId: user.id, ...detailsData } });
});
```

## Monitoring

### Check Active Connections
Visit: `http://localhost:3000/api/health` or `https://your-domain.com/api/health`

### Check PostgreSQL Connection Limits
```sql
-- Maximum connections allowed
SHOW max_connections;

-- Current active connections
SELECT count(*) FROM pg_stat_activity;

-- Connections by application
SELECT application_name, count(*) 
FROM pg_stat_activity 
GROUP BY application_name;
```

### On Aiven Dashboard
1. Go to your Aiven Console
2. Select your PostgreSQL service
3. Check "Connection pooling" settings
4. Monitor "Current connections" graph

## Troubleshooting

### Too Many Connections Error
If you still get "too many connections":

1. **Reduce connection_limit in DATABASE_URL**
   ```
   connection_limit=5  # Lower the limit
   ```

2. **Check your Aiven plan limits**
   - Each plan has a max connection limit
   - Upgrade plan if needed

3. **Use connection pooling service**
   - Consider PgBouncer
   - Or Prisma Data Proxy (Prisma Accelerate)

### Slow Queries
If connections are held too long:

1. **Optimize your queries**
   - Add proper indexes
   - Use `select` to limit fields
   - Avoid N+1 queries

2. **Add query timeout**
   ```typescript
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL + "&statement_timeout=30000", // 30s
       },
     },
   });
   ```

### Memory Leaks
If connections aren't released:

1. **Ensure proper error handling**
   ```typescript
   try {
     await prisma.user.findMany();
   } catch (error) {
     console.error(error);
     throw error; // Re-throw to ensure cleanup
   }
   ```

2. **Check for long-running operations**
   - Move heavy processing outside database operations
   - Use background jobs for intensive tasks

## Next Steps

1. **Regenerate Prisma Client** (important!)
   ```bash
   npx prisma generate
   ```

2. **Test locally**
   ```bash
   npm run dev
   ```
   Then visit: http://localhost:3000/api/health

3. **Monitor in production**
   - Check `/api/health` regularly
   - Set up alerts for high connection counts
   - Monitor Aiven dashboard

4. **Consider Prisma Accelerate** (optional)
   - Built-in connection pooling
   - Caching layer
   - Better for serverless
   - https://www.prisma.io/data-platform/accelerate

## Additional Resources
- [Prisma Connection Management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Next.js + Prisma Best Practices](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)
- [PostgreSQL Connection Pooling](https://www.postgresql.org/docs/current/runtime-config-connection.html)
