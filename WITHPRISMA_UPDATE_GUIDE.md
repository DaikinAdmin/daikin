# withPrisma Wrapper Update Script

This repository has been updated to use the `withPrisma` wrapper for better database connection management.

## ✅ Already Updated Files

- `/src/app/api/orders/route.ts`
- `/src/app/api/orders/[id]/route.ts`
- `/src/app/api/services/route.ts`
- `/src/app/api/benefits/route.ts`
- `/src/app/api/user/profile/route.ts`

## 🔧 Quick Pattern for Remaining Files

### Simple Handler Pattern:
```typescript
import { withPrisma } from "@/db/utils";

export const GET = async (req: Request) => {
    // Auth checks here
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    // Wrap all Prisma operations
    return withPrisma(async () => {
        try {
            const data = await prisma.model.findMany();
            return NextResponse.json(data);
        } catch (error) {
            console.error("Error:", error);
            return NextResponse.json({ error: "Failed" }, { status: 500 });
        }
    });
};
```

### Handler with Params:
```typescript
export const GET = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    // Auth checks
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    return withPrisma(async () => {
        try {
            const { id } = await params; // Get params inside withPrisma
            const data = await prisma.model.findUnique({ where: { id } });
            return NextResponse.json(data);
        } catch (error) {
            console.error("Error:", error);
            return NextResponse.json({ error: "Failed" }, { status: 500 });
        }
    });
};
```

## 🎯 Files Still Needing Update

Run this command to find all files:
```bash
grep -r "import prisma from" src/app/api --include="*.ts" | grep -v "withPrisma"
```

Then for each file:
1. Add import: `import { withPrisma } from "@/db/utils";`
2. Move auth checks BEFORE `withPrisma`
3. Wrap database operations IN `withPrisma(async () => { ... })`
4. Move `await params` INSIDE `withPrisma`
5. Keep try-catch INSIDE `withPrisma`

## 🧪 Test After Each Update

```bash
# Check syntax
npm run lint

# Test endpoint
curl -X GET http://localhost:3000/api/your-endpoint \
  -H "Cookie: your-session-cookie"

# Check connections
curl http://localhost:3000/api/health
```

## 💡 Why This Matters

- Prevents connection pool exhaustion
- Automatic cleanup in serverless environments
- Better error handling and logging
- Production-ready connection management

## 📊 Monitor Connections

Visit `/api/health` to see:
- Database connection status
- Active connection count
- Server health

Example response:
```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "activeConnections": 3
  },
  "timestamp": "2025-10-29T..."
}
```
