# API Routes Migration Status - withPrisma Wrapper

## ✅ Completed Updates

The following files have been updated to use the `withPrisma` wrapper:

1. ✅ `/src/app/api/orders/route.ts` - GET and POST handlers
2. ✅ `/src/app/api/orders/[id]/route.ts` - GET, PUT, and DELETE handlers
3. ✅ `/src/app/api/services/route.ts` - GET and POST handlers
4. ✅ `/src/app/api/benefits/route.ts` - GET and POST handlers
5. ✅ `/src/app/api/user/profile/route.ts` - GET and PATCH handlers

**All updated files have been tested and show no TypeScript errors.**

## 📋 Remaining Files to Update

The following files still need to be updated with the `withPrisma` wrapper:

### Benefits Routes
- [ ] `/src/app/api/benefits/[id]/route.ts` - GET, PUT, DELETE
- [ ] `/src/app/api/benefits-redeemed/route.ts` - GET
- [ ] `/src/app/api/benefits/user/redeem/route.ts` - POST
- [ ] `/src/app/api/benefits/user/redeemed/route.ts` - GET
- [ ] `/src/app/api/benefits/user/available/route.ts` - GET

### Services Routes
- [ ] `/src/app/api/services/[id]/route.ts` - PUT
- [ ] `/src/app/api/services/[id]/notify/route.ts` - POST

### User Routes
- [ ] `/src/app/api/users/search/route.ts` - GET
- [ ] `/src/app/api/user/profile/route.ts` - GET, POST

### Admin Routes
- [ ] `/src/app/api/admin/users/route.ts` - GET, POST
- [ ] `/src/app/api/admin/users/[id]/route.ts` - GET, PUT, DELETE

## 🔧 How to Update a File

For each remaining file, follow these steps:

### 1. Add the import at the top:
```typescript
import { withPrisma } from "@/db/utils";
```

### 2. Wrap the database operations

**Before:**
```typescript
export const GET = async (req: Request) => {
    // ... auth checks ...
    
    try {
        const data = await prisma.model.findMany();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
};
```

**After:**
```typescript
export const GET = async (req: Request) => {
    // ... auth checks ...
    
    return withPrisma(async () => {
        try {
            const data = await prisma.model.findMany();
            return NextResponse.json(data);
        } catch (error) {
            return NextResponse.json({ error: "Failed" }, { status: 500 });
        }
    });
};
```

### 3. Important Rules:
- ✅ Keep auth checks OUTSIDE the `withPrisma` wrapper
- ✅ Keep request body parsing INSIDE the `withPrisma` wrapper
- ✅ Wrap ALL database operations in the same handler
- ✅ Keep the try-catch inside the wrapper
- ✅ Return the wrapper result

## 🚀 Quick Update Commands

For files with similar patterns, you can use these patterns:

### For simple GET handlers:
```typescript
export const GET = async (req: Request) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    return withPrisma(async () => {
        try {
            // ... your database code ...
        } catch (error) {
            // ... error handling ...
        }
    });
};
```

### For handlers with params:
```typescript
export const GET = async (
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    return withPrisma(async () => {
        try {
            const { id } = await params;
            // ... your database code ...
        } catch (error) {
            // ... error handling ...
        }
    });
};
```

## 🧪 Testing After Update

After updating each file:

1. Check for TypeScript errors:
   ```bash
   npm run lint
   ```

2. Test the endpoint:
   ```bash
   # Start dev server
   npm run dev
   
   # Test the endpoint
   curl http://localhost:3000/api/your-endpoint
   ```

3. Monitor connections:
   ```bash
   curl http://localhost:3000/api/health
   ```

## 📝 Notes

- The `withPrisma` wrapper automatically handles connection management for serverless environments
- It will call `prisma.$disconnect()` in Vercel/Lambda environments after each request
- For non-serverless environments, connections are managed by the singleton pattern
- Error handling is preserved - the wrapper re-throws errors after logging

## ✨ Benefits

After all files are updated:
- ✅ Better connection management in production
- ✅ No connection pool exhaustion
- ✅ Consistent error handling
- ✅ Serverless-ready code
- ✅ Easy monitoring via `/api/health` endpoint
