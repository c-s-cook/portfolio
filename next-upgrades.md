# Next.js Upgrade Guide: v13 → v14 → v15 → v16

**Current Status:** Next.js 13.4.19 → Upgrading to 16 incrementally  
**Node.js:** 22.9.0 ✓ (Exceeds all requirements)  
**Environment:** Windows, Local development

---

## Overview

This project will be upgraded one major version at a time to catch and fix issues incrementally:
- **v13 → v14** (React 18 → 19)
- **v14 → v15** (Async cookies/headers, fetch changes)
- **v15 → v16** (Turbopack default, middleware rename, async params)

---

## v13 → v14 Upgrade

### Key Changes
- **React minimum: 19** (required)
- **Node.js minimum: 18.17** (we have 22.9.0 ✓)
- `@next/font` removed (use built-in `next/font/google` ✓ Already done)
- `next export` removed (use `output: 'export'` config)
- `ImageResponse` import: `next/server` → `next/og`
- `ImageResponse` removed from this project (no usage found)

### This Project: v14 Status
- ✅ No `@next/font` imports to fix
- ✅ No `useFormState` → `useActionState` migration needed
- ✅ No `ImageResponse` imports
- ✅ No `output: 'export'` currently used
- ⚠️ **Check:** Cookies still work synchronously (will break in v15)

### Migration Steps
```bash
npm install next@14 react@19 react-dom@19 eslint-config-next@14 @types/react@latest @types/react-dom@latest
npm run build
npm run dev
```

### Expected Errors
- React 19 deprecation warnings (normal)
- None expected for this project (minimal breaking changes)

---

## v14 → v15 Upgrade

### Key Breaking Changes

#### 1. **Async Request APIs (MAJOR BREAKING CHANGE)**
Cookies, headers, and params are now asynchronous:

**Before (v14):**
```typescript
// layout.js line 37
let isLoggedin = cookies().get('jwt')?.value ? true : false;

// api/auth/route.ts lines 152, 161, 189-192
cookies().set({ ... })
cookies().has('jwt')
cookies().delete('jwt')
```

**After (v15):**
```typescript
// Must be async function
let isLoggedin = (await cookies()).get('jwt')?.value ? true : false;

// In async Route Handler
(await cookies()).set({ ... })
(await cookies()).has('jwt')
(await cookies()).delete('jwt')
```

#### 2. **Fetch Requests Not Cached by Default**
```typescript
// Before: cached
const data = await fetch('https://...')

// After: NOT cached - must opt in
const data = await fetch('https://...', { cache: 'force-cache' })

// Or at layout/page level:
export const fetchCache = 'default-cache'
```

#### 3. **Client-Side Router Cache Changed**
- Page segments no longer reused on navigation
- Layouts still cached and reused
- Use `staleTimes` config to control behavior

#### 4. **Route Handlers (GET) No Longer Cached**
```typescript
// Must opt in to caching
export const dynamic = 'force-static'
export async function GET() { }
```

#### 5. **Removed: Speed Insights Auto-instrumentation**
- If using Vercel Speed Insights, manually configure per their docs

### This Project: v15 Impacted Files
1. **`app/layout.js` line 37** - cookies() call
   - Status: ⚠️ MUST FIX
   - Action: Convert to async layout, use `await cookies()`

2. **`app/api/auth/route.ts` lines 152, 161, 189-192** - cookies() calls
   - Status: ⚠️ MUST FIX
   - Action: Already async Route Handler, just add `await` prefix

3. **`middleware.ts` line 13** - request.cookies.get()
   - Status: ✅ OK (NextRequest.cookies is still sync)
   - No action needed

4. **Fetch calls in route handlers/layouts**
   - Status: ⚠️ AUDIT NEEDED
   - Action: Check `lib/getPortfolio.ts` and API routes for unintended cache changes

### Migration Codemod
```bash
# Automatic migration for async APIs (optional)
npx @next/codemod@canary upgrade latest
```

### Migration Steps
```bash
npm install next@15 react@latest react-dom@latest eslint-config-next@15
npm run build  # Will error on sync cookies() calls
# Fix errors in layout.js and route.ts
npm run build
npm run dev
```

### Expected Errors
```
Error: cookies() expects to be called from a Server Component or Route Handler
```

---

## v15 → v16 Upgrade

### Key Breaking Changes

#### 1. **Turbopack Now Default (replaces Webpack)**
- `next dev` and `next build` now use Turbopack by default
- Custom webpack configs will fail the build
- This project has no custom webpack config ✓

**Remove from scripts if present:**
```json
"dev": "next dev --turbopack"  // No longer needed
```

#### 2. **Middleware Renamed to Proxy (breaking)**
**Status for this project:** ⚠️ NEEDS FIX

**Migration:**
```bash
# Rename file
mv middleware.ts proxy.ts

# Update function name
export function proxy(request: NextRequest) { }  // was: middleware
```

**CRITICAL WARNING:** Edge runtime is **NO LONGER SUPPORTED** in `proxy`.
- Current `middleware.ts` uses edge runtime (no explicit declaration, but check runtime config)
- Proxy runtime is `nodejs` only
- If you need edge runtime, keep using `middleware.ts` (documented as deprecated but still works in v16)

#### 3. **Async Parameters (Image & Sitemap Generators)**
This project doesn't use image generation or sitemaps, so no impact.

#### 4. **Async Request APIs Further Enforced**
- Cookies, headers, params **must** be awaited (no synchronous fallback)
- Already fixed in v15 migration

#### 5. **next lint Command Removed**
- Use ESLint CLI directly: `npx eslint .`
- Remove `"lint": "next lint"` from package.json if present
- Current project: `"lint": "next lint"` exists ⚠️ WILL BREAK

#### 6. **Image Optimization Changes**
```javascript
// next.config.js - deprecated feature
images: {
  domains: ['...']  // ⚠️ DEPRECATED - use remotePatterns instead
}

// New way:
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cscook-portfolio.s3.us-east-2.amazonaws.com',
    }
  ]
}
```

#### 7. **Removed Features**
- `next lint` command → use ESLint directly
- AMP support (not used here)
- `serverRuntimeConfig` and `publicRuntimeConfig` (not used here)
- `unstable_rootParams` (not used here)
- `experimental.dynamicIO` → renamed to `cacheComponents`

### This Project: v16 Impacted Files
1. **`middleware.ts`** → rename to `proxy.ts`
   - Status: ⚠️ MUST RENAME
   - Check: Verify no edge runtime-specific code
   - Runtime will change to `nodejs`

2. **`next.config.js`** - images.domains
   - Status: ⚠️ SHOULD UPDATE
   - Action: Replace with `remotePatterns`

3. **`package.json`** - lint script
   - Status: ⚠️ NEEDS UPDATE
   - Action: Change `next lint` → `eslint .` (requires ESLint setup)

4. **`postcss.config.js`**
   - Status: ✅ OK (tailwind already removed)

### Migration Steps
```bash
npm install next@16 react@latest react-dom@latest eslint-config-next@16

# Manual file renames/updates
mv frontend/middleware.ts frontend/proxy.ts
# Update function name: middleware -> proxy
# Update next.config.js: images.domains -> images.remotePatterns
# Update package.json: lint script

npm run build
npm run dev
```

### Expected Build Errors
```
Error: ESLint not available. next lint requires ESLint
Error: The middleware file has been removed
Error: images.domains is deprecated
```

---

## Known Issues & Solutions

### Issue 1: Cookies Synchronously Called in Server Component
**Error:** `Error: cookies() expects to be called from a Server Component`  
**Fix:** Make parent component async or use `use()` hook from React

### Issue 2: Fetch Cache Behavior Changes
**Symptom:** Data becomes stale on deployment  
**Fix:** Explicitly set `cache: 'force-cache'` on fetch calls that should cache

### Issue 3: Middleware → Proxy Runtime Mismatch
**Error:** `Error: edge runtime is not supported in proxy`  
**Fix:** Move edge-specific code to middleware.ts (keep as deprecated) OR rewrite for nodejs runtime

### Issue 4: ESLint Configuration
**Error:** `ESLint not available`  
**Fix in v16:** Need to configure eslint.config.js (flat config) instead of .eslintrc

---

## Testing Checklist

After each upgrade run:

```bash
# After each version upgrade
npm run build          # Check for errors
npm run dev            # Check dev server starts
npm run lint           # Check linting (v16: may need eslint setup)

# Manual tests
- [ ] Login/logout flow (uses cookies)
- [ ] Dashboard loads (checks auth)
- [ ] Images load from S3 (remotePatterns)
- [ ] Navigation works
- [ ] Build completes without warnings
```

---

## File-by-File Changes Required

### v14 → v15
- ✏️ `app/layout.js`: Make async, await cookies()
- ✏️ `app/api/auth/route.ts`: Add await to cookies() calls

### v15 → v16
- ✏️ `middleware.ts` → `proxy.ts` (rename file + function)
- ✏️ `next.config.js`: Update images config
- ✏️ `package.json`: Update lint script (optional, depends on ESLint setup)

---

## Rollback Plan

If any version breaks the app:

```bash
git stash
git checkout <previous-working-commit>
npm install
npm run build && npm run dev
```

---

## References

- v14: https://nextjs.org/docs/14/app/building-your-application/upgrading/version-14
- v15: https://nextjs.org/docs/15/app/guides/upgrading/version-15
- v16: https://nextjs.org/docs/app/guides/upgrading/version-16
