#!/bin/bash

# Script to update all API routes to use withPrisma wrapper

echo "🔄 Updating API routes to use withPrisma wrapper..."

# List of files to update (excluding already updated ones)
files=(
    "src/app/api/services/[id]/route.ts"
    "src/app/api/services/[id]/notify/route.ts"
    "src/app/api/benefits/route.ts"
    "src/app/api/benefits/[id]/route.ts"
    "src/app/api/benefits-redeemed/route.ts"
    "src/app/api/benefits/user/redeem/route.ts"
    "src/app/api/benefits/user/redeemed/route.ts"
    "src/app/api/benefits/user/available/route.ts"
    "src/app/api/users/search/route.ts"
    "src/app/api/user/profile/route.ts"
    "src/app/api/admin/users/route.ts"
    "src/app/api/admin/users/[id]/route.ts"
)

echo "📝 Files to update: ${#files[@]}"

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ Found: $file"
    else
        echo "  ✗ Not found: $file"
    fi
done

echo ""
echo "⚠️  Manual update required for each file:"
echo "   1. Add import: import { withPrisma } from '@/db/utils';"
echo "   2. Wrap database operations in: return withPrisma(async () => { ... });"
echo ""
echo "🔧 Use GitHub Copilot to help with the updates!"
