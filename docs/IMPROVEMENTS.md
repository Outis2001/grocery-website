# Project Improvements Roadmap

This document outlines recommended improvements for the Ambalangoda Grocery website project, organized by priority and category.

**Last Updated**: February 6, 2026

---

## 🔴 High Priority Improvements

### 1. Security Enhancements

#### Critical: Environment Variables Security

- **Issue**: `.env.local` contains sensitive credentials that could be exposed
- **Actions**:
  - ✅ Verify `.env.local` is in `.gitignore`
  - 🔄 Rotate all exposed API keys:
    - Supabase keys (anon key, service role key)
    - SMTP password
    - Resend API key
  - 📝 Add security reminder in README
  - 💡 Consider using environment variable management tools (Doppler, Vault)

#### Secure Admin Access

- Review and audit admin access patterns
- Implement rate limiting for admin login
- Add audit logs for admin actions

### 2. Type Safety Issues

**Current Problems**:

- `Header.tsx` uses `any` for user type (line 11)
- `CartDrawer.tsx` uses `any` for user type (line 17)
- `ProductManagement.tsx` uses `@ts-ignore` directives (lines 86, 71, 125)

**Solutions**:

```typescript
// Create proper type definitions in lib/supabase/types.ts
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  phone: string | null;
  is_admin: boolean;
  skip_verification: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends User {
  profile?: UserProfile;
}
```

**Tasks**:

- [ ] Define proper Supabase user types
- [ ] Remove all `any` types from components
- [ ] Remove all `@ts-ignore` directives
- [ ] Add strict null checks where needed

### 3. Testing Infrastructure

**Current State**: Zero automated tests ❌

**Recommended Setup**:

#### Unit Tests

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
```

**Priority Test Coverage**:

- [ ] Utility functions (cart calculations, distance calculations, formatting)
- [ ] Components (ProductCard, CartDrawer, LocationPicker)
- [ ] API routes (order creation, product updates)

#### Integration Tests

- [ ] Authentication flows
- [ ] Checkout process
- [ ] Admin order management

#### E2E Tests

```bash
npm install -D @playwright/test
```

**Critical User Flows**:

- [ ] Browse products → Add to cart → Checkout → Place order
- [ ] Admin login → View orders → Update status
- [ ] User signup → Verify email → Login → Order

**Add to `package.json`**:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### 4. Error Handling

**Current Issues**:

- Using `alert()` for errors (poor UX)
- No centralized error handling
- Inconsistent error messages across components

**Solutions**:

- [ ] Create a toast notification system
- [ ] Implement error boundary components
- [ ] Standardize error messages
- [ ] Add retry mechanisms for failed requests

**Recommended Libraries**:

- `sonner` - Beautiful toast notifications
- `react-error-boundary` - Error boundaries

---

## 🟡 Medium Priority Improvements

### 5. Code Quality Tools

#### Prettier - Code Formatting

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

**Create `.prettierrc.json`**:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

#### Pre-commit Hooks

```bash
npm install -D husky lint-staged
npx husky install
```

**Add to `package.json`**:

```json
{
  "scripts": {
    "prepare": "husky install",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

#### ESLint Configuration

**Create `.eslintrc.json`**:

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### 6. Component Architecture Improvements

#### Missing Shared UI Components

**Create `components/ui/` directory** with:

##### Button Component (`components/ui/Button.tsx`)

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

##### Input Component (`components/ui/Input.tsx`)

- Text input with error states
- Consistent styling
- Proper accessibility

##### Modal Component (`components/ui/Modal.tsx`)

- Reusable dialog component
- Backdrop with proper focus management
- Keyboard navigation (Esc to close)

##### LoadingSpinner Component (`components/ui/LoadingSpinner.tsx`)

- Consistent loading states
- Size variants

##### Toast Component (`components/ui/Toast.tsx`)

- Success, error, warning, info variants
- Auto-dismiss functionality
- Queue management

#### Extract Reusable Components

**QuantitySelector Component** (`components/ui/QuantitySelector.tsx`)

- Currently duplicated in ProductCard and CartDrawer
- Should have increment/decrement buttons
- Min/max validation
- Disabled state

**Tasks**:

- [ ] Create `components/ui/` directory
- [ ] Build Button component with variants
- [ ] Build Input component
- [ ] Build Modal component
- [ ] Build LoadingSpinner component
- [ ] Build Toast notification system
- [ ] Extract QuantitySelector component
- [ ] Update existing components to use new UI components

#### Consider UI Library

- **shadcn/ui** - Copy-paste components, full customization
- **Radix UI** - Unstyled accessible primitives
- **Headless UI** - Tailwind-optimized components

### 7. State Management

**Current Issues**:

- Cart state in localStorage + custom events
- No centralized state management
- State updates scattered across components

**Solutions**:

#### Option 1: Custom React Hook (Recommended for current size)

```typescript
// lib/hooks/useCart.ts
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, quantity: number) => {
    /* ... */
  };
  const removeItem = (productId: string) => {
    /* ... */
  };
  const updateQuantity = (productId: string, quantity: number) => {
    /* ... */
  };
  const clearCart = () => {
    /* ... */
  };

  return { items, addItem, removeItem, updateQuantity, clearCart };
}
```

#### Option 2: React Context

- Good for medium-sized apps
- Avoid prop drilling
- Central state management

#### Option 3: Zustand (if app grows)

- Lightweight state management
- No boilerplate
- DevTools support

**Tasks**:

- [ ] Create `useCart()` custom hook
- [ ] Create `useAuth()` custom hook
- [ ] Centralize cart logic
- [ ] Remove custom events (use proper state management)

### 8. CI/CD Pipeline

**Create `.github/workflows/ci.yml`**:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

  e2e-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
```

**Additional Workflows**:

- [ ] Automated deployment on merge to main
- [ ] PR preview deployments (Vercel)
- [ ] Dependency updates (Dependabot)
- [ ] Security scanning (Snyk, npm audit)

### 9. Performance Optimization

#### Image Optimization

- [ ] Replace `<img>` tags with Next.js `<Image>` component
- [ ] Add image loading states
- [ ] Implement lazy loading for product images
- [ ] Use responsive images (different sizes for mobile/desktop)
- [ ] Consider WebP format with fallbacks

#### Code Splitting

- [ ] Lazy load admin components
- [ ] Dynamic import for heavy libraries (Leaflet)
- [ ] Split vendor bundles

#### Data Fetching

- [ ] Implement SWR or React Query for caching
- [ ] Add stale-while-revalidate strategy
- [ ] Prefetch product data on hover
- [ ] Optimize Supabase queries (select only needed columns)

#### Performance Monitoring

- [ ] Run Lighthouse audit
- [ ] Optimize Core Web Vitals
- [ ] Add bundle analyzer
- [ ] Monitor bundle size

**Add to `package.json`**:

```json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "lighthouse": "lighthouse http://localhost:3000 --view"
  }
}
```

### 10. Accessibility (a11y)

**Current Issues**:

- Some buttons lack ARIA labels
- Missing keyboard navigation in some components
- No skip-to-content link

**Improvements**:

- [ ] Add ARIA labels to all interactive elements
- [ ] Ensure all images have alt text
- [ ] Add keyboard navigation support
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)
- [ ] Add skip-to-content link
- [ ] Ensure proper heading hierarchy (h1 → h2 → h3)
- [ ] Add focus indicators
- [ ] Test color contrast ratios
- [ ] Add form field labels and error announcements

**Tools**:

- `eslint-plugin-jsx-a11y` - Accessibility linting
- `@axe-core/react` - Runtime accessibility testing
- Lighthouse accessibility audit

---

## 🟢 Nice-to-Have Improvements

### 11. Internationalization (i18n)

**Current State**: Structure mentioned in README, not implemented

**Implementation**:

```bash
npm install next-intl
```

**Structure**:

```
messages/
├── en.json
├── si.json (Sinhala)
└── ta.json (Tamil)
```

**Tasks**:

- [ ] Install next-intl
- [ ] Create translation files
- [ ] Add language switcher in header
- [ ] Translate all UI text
- [ ] Handle RTL for Tamil (if needed)
- [ ] Translate product names and categories

### 12. Analytics & Monitoring

#### Analytics

**Options**:

- Vercel Analytics (built-in)
- Google Analytics 4
- Plausible (privacy-focused)
- Umami (self-hosted)

**Tasks**:

- [ ] Add analytics provider
- [ ] Track key events (page views, add to cart, checkout, orders)
- [ ] Set up conversion funnels
- [ ] Monitor cart abandonment rate

#### Error Tracking

**Recommended: Sentry**

```bash
npm install @sentry/nextjs
```

**Benefits**:

- Real-time error reporting
- Source maps support
- User context and breadcrumbs
- Performance monitoring

**Tasks**:

- [ ] Set up Sentry account
- [ ] Add Sentry to project
- [ ] Configure error boundaries
- [ ] Set up alerts

#### Performance Monitoring

- [ ] Track Web Vitals
- [ ] Monitor API response times
- [ ] Set up uptime monitoring (UptimeRobot, Better Uptime)

### 13. Documentation

#### Developer Documentation

**CONTRIBUTING.md**:

- [ ] How to set up local environment
- [ ] Coding standards and conventions
- [ ] Git workflow (branching strategy)
- [ ] How to submit PRs
- [ ] Testing requirements

**ARCHITECTURE.md**:

- [ ] System architecture diagram
- [ ] Database schema documentation
- [ ] API endpoints reference
- [ ] Authentication flow
- [ ] Deployment architecture

**API.md**:

- [ ] Document all API routes
- [ ] Request/response examples
- [ ] Error codes and messages
- [ ] Rate limiting information

**CODE_STYLE.md**:

- [ ] TypeScript conventions
- [ ] Component structure guidelines
- [ ] File naming conventions
- [ ] Import order standards

#### Code Documentation

- [ ] Add JSDoc comments to complex functions
- [ ] Document custom hooks
- [ ] Add inline comments for complex logic
- [ ] Create Storybook for component documentation

### 14. Database Improvements

#### Migrations Management

```bash
# Install Supabase CLI
npm install -g supabase
supabase init
supabase db pull
```

**Tasks**:

- [ ] Set up Supabase CLI for migrations
- [ ] Version control all schema changes
- [ ] Add migration scripts
- [ ] Document rollback procedures

#### Database Optimization

- [ ] Add indexes on frequently queried columns:
  - `orders.user_id`
  - `orders.status`
  - `orders.created_at`
  - `products.category`
  - `products.is_available`
- [ ] Review and optimize RLS policies
- [ ] Add database triggers for audit logs
- [ ] Set up automatic backups

#### Audit Logging

**Create audit log table**:

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tasks**:

- [ ] Create audit_logs table
- [ ] Add triggers for admin actions
- [ ] Create audit log viewer in admin panel

### 15. Feature Enhancements

#### Real-time Order Notifications

```typescript
// Use Supabase Realtime
supabase
  .channel('orders')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'orders',
    },
    (payload) => {
      // Notify admin of new order
    }
  )
  .subscribe();
```

**Tasks**:

- [ ] Implement Supabase Realtime
- [ ] Add desktop notifications for new orders
- [ ] Add sound notification option
- [ ] Show real-time order count in admin panel

#### Customer Reviews System

**New Tables**:

- `product_reviews` (rating, comment, user_id, product_id)
- `review_images` (optional photos)

**Features**:

- [ ] Star rating system (1-5 stars)
- [ ] Written reviews
- [ ] Admin moderation
- [ ] Reply to reviews
- [ ] Display average rating on product cards

#### Wishlist Feature

**New Table**: `wishlists`

**Features**:

- [ ] Add/remove products from wishlist
- [ ] View saved items
- [ ] Share wishlist
- [ ] Move wishlist items to cart

#### Promotions & Discounts

**New Tables**:

- `promo_codes` (code, discount_type, value, expiry)
- `promotions` (banner_text, active, start_date, end_date)

**Features**:

- [ ] Apply promo codes at checkout
- [ ] Percentage or fixed amount discounts
- [ ] Promotional banners on homepage
- [ ] Category-specific promotions
- [ ] Buy X get Y offers

#### Inventory Management

**Extend products table**:

- `stock_quantity`
- `low_stock_threshold`
- `reorder_point`

**Features**:

- [ ] Track product stock levels
- [ ] Low stock alerts for admin
- [ ] Out-of-stock indicators
- [ ] Auto-disable products when out of stock
- [ ] Inventory history log

#### Sales Analytics Dashboard

**Metrics**:

- Total sales (daily, weekly, monthly)
- Order volume trends
- Top-selling products
- Customer acquisition
- Average order value
- Delivery vs pickup ratio

**Visualizations**:

- [ ] Charts using recharts or Chart.js
- [ ] Revenue over time
- [ ] Category breakdown
- [ ] Peak ordering hours
- [ ] Customer retention rate

#### Advanced Search

**Features**:

- [ ] Full-text search for products
- [ ] Search by category
- [ ] Price range filters
- [ ] Sort by (price, popularity, newest)
- [ ] Search suggestions/autocomplete

#### Payment Integration

**Options**:

- Stripe (international)
- PayHere (Sri Lanka)
- iPay (Sri Lanka)
- Cash on delivery (existing)

**Tasks**:

- [ ] Research payment providers
- [ ] Implement payment gateway
- [ ] Add payment status tracking
- [ ] Handle payment failures
- [ ] Refund management

### 16. Mobile App

Consider building a native mobile app:

**Options**:

- React Native with Expo
- Progressive Web App (PWA)
- Capacitor (web to native)

**Benefits**:

- Push notifications
- Better mobile performance
- App store presence
- Offline capabilities

### 17. SEO Optimization

#### Meta Tags & Open Graph

```typescript
// app/layout.tsx
export const metadata = {
  title: 'Ambalangoda Grocery - Fresh Groceries Delivered',
  description: 'Order fresh groceries online in Ambalangoda...',
  openGraph: {
    images: ['/og-image.jpg'],
  },
};
```

**Tasks**:

- [ ] Add proper meta tags to all pages
- [ ] Create Open Graph images
- [ ] Add Twitter Card meta tags
- [ ] Implement dynamic meta tags for products

#### Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": "product-image-url",
  "price": "100",
  "priceCurrency": "LKR"
}
```

**Tasks**:

- [ ] Add Product schema
- [ ] Add LocalBusiness schema
- [ ] Add BreadcrumbList schema
- [ ] Test with Google Rich Results Test

#### Additional SEO

- [ ] Create and submit `sitemap.xml`
- [ ] Create `robots.txt`
- [ ] Optimize Core Web Vitals
- [ ] Improve page load speeds
- [ ] Add canonical URLs
- [ ] Implement proper heading hierarchy

### 18. Development Experience

#### VS Code Workspace Settings

**Create `.vscode/settings.json`**:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

**Create `.vscode/extensions.json`**:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss"
  ]
}
```

#### Development Scripts

**Add to `package.json`**:

```json
{
  "scripts": {
    "db:pull": "supabase db pull",
    "db:push": "supabase db push",
    "db:reset": "supabase db reset",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next node_modules",
    "reinstall": "npm run clean && npm install"
  }
}
```

#### Storybook

```bash
npx storybook@latest init
```

**Benefits**:

- Component documentation
- Visual testing
- Isolated development
- Design system documentation

#### Local Supabase

```bash
supabase start
```

**Benefits**:

- No need for internet
- Fast development
- Free during development
- Database branching

---

## 📋 Implementation Priority Matrix

### Phase 1: Foundation (Week 1-2)

1. ✅ Security: Rotate exposed credentials
2. 🔧 Fix TypeScript type safety issues
3. 🎨 Add Prettier + ESLint configuration
4. 📦 Extract shared UI components (Button, Input, Modal)
5. 🧪 Set up testing infrastructure (Vitest)

### Phase 2: Quality & Testing (Week 3-4)

1. ✅ Add pre-commit hooks (Husky + lint-staged)
2. 🧪 Write unit tests for utilities
3. 🧪 Write component tests
4. 🎯 Improve error handling (toast system)
5. 🔄 Set up CI/CD pipeline

### Phase 3: Performance & UX (Week 5-6)

1. 🖼️ Optimize images (Next.js Image component)
2. ⚡ Implement data caching (SWR or React Query)
3. ♿ Accessibility improvements
4. 📊 Add analytics
5. 🐛 Set up Sentry for error tracking

### Phase 4: Features & Scale (Week 7-8)

1. 🌐 Implement i18n (trilingual support)
2. 🔔 Real-time order notifications
3. ⭐ Customer reviews system
4. 📊 Sales analytics dashboard
5. 🔍 Advanced product search

### Phase 5: Advanced Features (Week 9-10)

1. 💳 Payment gateway integration
2. 📦 Inventory management
3. 🎁 Promotions and discount system
4. 📱 PWA or mobile app
5. 🚀 SEO optimization

---

## 🎯 Quick Wins (Can be done in < 2 hours each)

1. **Add Prettier** - 30 minutes
2. **Create Button component** - 1 hour
3. **Fix TypeScript `any` types** - 1 hour
4. **Add CI/CD workflow** - 1 hour
5. **Run Lighthouse audit and fix critical issues** - 2 hours
6. **Add proper error messages instead of alerts** - 1 hour
7. **Create LoadingSpinner component** - 30 minutes
8. **Add analytics (Vercel Analytics)** - 30 minutes
9. **Create CONTRIBUTING.md** - 1 hour
10. **Add proper meta tags for SEO** - 1 hour

---

## 📚 Resources & Learning

### Testing

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)

### Performance

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)

### Accessibility

- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### State Management

- [SWR](https://swr.vercel.app/)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)

---

## ✅ Progress Tracking

Use this checklist to track implementation progress:

### High Priority

- [ ] Rotate exposed API credentials
- [ ] Fix all TypeScript type issues
- [ ] Set up testing infrastructure
- [ ] Implement toast notification system

### Medium Priority

- [ ] Add Prettier and ESLint config
- [ ] Create shared UI components
- [ ] Set up pre-commit hooks
- [ ] Create CI/CD pipeline
- [ ] Optimize performance (Lighthouse audit)
- [ ] Accessibility improvements

### Nice to Have

- [ ] Add internationalization (i18n)
- [ ] Set up analytics and monitoring
- [ ] Create comprehensive documentation
- [ ] Implement database improvements
- [ ] Add feature enhancements (reviews, wishlist, etc.)
- [ ] Mobile app development
- [ ] SEO optimization
- [ ] Improve developer experience

---

## 🤝 Contributing

When implementing improvements, please:

1. Create a new branch for each improvement
2. Write tests for new features
3. Update documentation
4. Submit PR with clear description
5. Ensure CI passes before merging

---

**Remember**: Focus on high-priority items first, then gradually work through medium and nice-to-have improvements. Quality over quantity!
