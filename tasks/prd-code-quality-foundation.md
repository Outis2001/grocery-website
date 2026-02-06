# PRD: Code Quality Foundation Initiative

**Status**: Draft  
**Priority**: High  
**Timeline**: 2-3 weeks  
**Last Updated**: February 6, 2026

---

## 1. Introduction/Overview

This initiative establishes fundamental code quality infrastructure for the Ambalangoda Grocery project by implementing four critical improvements that work together to create a robust development foundation:

1. **Prettier** - Automated code formatting
2. **Button Component** - Reusable UI component
3. **TypeScript Type Safety** - Remove all `any` types and `@ts-ignore` directives
4. **CI/CD Pipeline** - Automated quality checks

**Problem Statement**: The codebase currently lacks:
- Consistent code formatting standards
- Reusable UI components (causing code duplication)
- Type safety (with `any` types and type suppressions)
- Automated quality checks (relying on manual review)

**Solution**: Implement foundational tooling and components that will improve code quality, reduce bugs, enhance developer experience, and ensure consistency across the codebase.

---

## 2. Goals

1. **Establish code consistency** - All code follows uniform formatting standards
2. **Improve type safety** - Eliminate all TypeScript type suppressions and `any` types
3. **Reduce code duplication** - Create reusable Button component for UI consistency
4. **Automate quality checks** - Prevent bugs from reaching production through CI/CD
5. **Enhance developer experience** - Make development faster and less error-prone
6. **Create foundation for future improvements** - Enable easier refactoring and feature development

---

## 3. User Stories

### Developer Stories

**Story 1: Code Formatting**
> As a developer, I want code to be automatically formatted on save, so that I don't waste time on manual formatting and code reviews focus on logic rather than style.

**Story 2: Reusable Components**
> As a developer, I want a standardized Button component, so that I can quickly build consistent UIs without duplicating button code across components.

**Story 3: Type Safety**
> As a developer, I want proper TypeScript types throughout the codebase, so that I can catch errors at compile-time and have better IDE autocomplete.

**Story 4: Automated Checks**
> As a developer, I want CI/CD to catch issues automatically, so that I have confidence my changes won't break production.

### Team Stories

**Story 5: Code Review Efficiency**
> As a code reviewer, I want automated formatting and type checking, so that reviews can focus on business logic and architecture rather than style issues.

**Story 6: Onboarding**
> As a new team member, I want clear component patterns and automated tooling, so that I can contribute productively from day one.

---

## 4. Functional Requirements

### 4.1 Prettier Configuration

**FR-1.1** The system must install Prettier and related ESLint integration packages.

**FR-1.2** The system must create a `.prettierrc.json` configuration file with the following settings:
- Semi-colons: enabled
- Trailing commas: ES5 style
- Single quotes: enabled
- Print width: 100 characters
- Tab width: 2 spaces
- Use tabs: false

**FR-1.3** The system must create a `.prettierignore` file to exclude:
- `node_modules/`
- `.next/`
- `out/`
- `build/`
- `dist/`
- `*.min.js`
- `package-lock.json`

**FR-1.4** The system must add npm scripts to `package.json`:
- `format` - Format all files
- `format:check` - Check if files are formatted

**FR-1.5** The system must configure ESLint to work with Prettier (no conflicting rules).

**FR-1.6** The system must format the entire codebase as part of initial setup.

### 4.2 Button Component

**FR-2.1** The system must create a Button component at `components/ui/Button.tsx`.

**FR-2.2** The Button component must support the following variants:
- `primary` - Main call-to-action style (green background)
- `secondary` - Less prominent actions (white background, green border)
- `outline` - Minimal style with border
- `ghost` - Text-only, no background
- `danger` - Destructive actions (red theme)

**FR-2.3** The Button component must support the following sizes:
- `sm` - Small (padding, font size)
- `md` - Medium (default)
- `lg` - Large

**FR-2.4** The Button component must support a `loading` prop that:
- Displays a loading spinner
- Disables the button
- Maintains button width (prevents layout shift)

**FR-2.5** The Button component must support a `disabled` prop that:
- Visually indicates disabled state (opacity, cursor)
- Prevents click events
- Maintains accessibility (aria-disabled)

**FR-2.6** The Button component must support an `icon` prop that:
- Accepts a React component (e.g., Lucide icons)
- Positions icon to the left of text
- Handles icon-only buttons (no text)

**FR-2.7** The Button component must support all standard button attributes:
- `onClick` - Click handler
- `type` - button, submit, reset
- `className` - Additional custom classes
- `children` - Button content

**FR-2.8** The Button component must be fully typed with TypeScript interfaces.

**FR-2.9** The Button component must follow Tailwind CSS conventions and use existing color tokens from `tailwind.config.ts`.

**FR-2.10** The Button component must be accessible:
- Proper ARIA attributes
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

**FR-2.11** The system must create a `components/ui/` directory for shared UI components.

**FR-2.12** The implementation should not immediately refactor existing buttons (gradual migration approach).

### 4.3 TypeScript Type Safety

**FR-3.1** The system must create a proper type definitions file at `lib/supabase/types.ts` containing:
- `UserProfile` interface
- `AuthUser` interface (extending Supabase User)
- `Product` interface
- `Order` interface
- Other domain types as needed

**FR-3.2** The system must remove all `any` types from:
- `components/layout/Header.tsx` (line 11)
- `components/cart/CartDrawer.tsx` (line 17)
- Any other files containing `any` types

**FR-3.3** The system must remove all `@ts-ignore` directives from:
- `components/admin/ProductManagement.tsx` (lines 86, 71, 125)
- Any other files containing `@ts-ignore`

**FR-3.4** The system must properly type Supabase client responses and database queries.

**FR-3.5** The system must ensure all function parameters and return types are explicitly typed.

**FR-3.6** The system must maintain TypeScript strict mode (`strict: true` in `tsconfig.json`).

**FR-3.7** The system must not introduce any new TypeScript compilation errors.

**FR-3.8** The system must add proper null checks where types indicate nullable values.

### 4.4 CI/CD Pipeline

**FR-4.1** The system must create a GitHub Actions workflow at `.github/workflows/ci.yml`.

**FR-4.2** The CI workflow must trigger on:
- Push to `main` branch
- Push to `develop` branch (if exists)
- All pull requests to `main` and `develop`

**FR-4.3** The CI workflow must run the following checks in parallel where possible:
1. **Linting** - Run ESLint (`npm run lint`)
2. **Type checking** - Run TypeScript compiler (`npx tsc --noEmit`)
3. **Format checking** - Check Prettier formatting (`npm run format:check`)
4. **Build** - Verify project builds successfully (`npm run build`)
5. **Tests** - Run tests when test suite exists (`npm test` - skip if no tests)

**FR-4.4** The CI workflow must use Node.js version 18.x.

**FR-4.5** The CI workflow must use npm caching for faster builds.

**FR-4.6** The CI workflow must fail (exit with error) if:
- ESLint has errors (warnings are allowed)
- TypeScript compilation fails
- Code is not properly formatted
- Build fails

**FR-4.7** The CI workflow must display clear error messages indicating which check failed.

**FR-4.8** The CI workflow must complete in under 5 minutes for typical changes.

**FR-4.9** The system must add a status badge to `README.md` showing CI status.

**FR-4.10** The workflow must have appropriate permissions (read for code, write for checks).

---

## 5. Non-Goals (Out of Scope)

**NG-1** Unit or integration testing setup - This will be a separate initiative (covered in IMPROVEMENTS.md Phase 2).

**NG-2** Husky pre-commit hooks - Will be added after Prettier is stable (Phase 2).

**NG-3** Refactoring existing buttons to use new Button component - Will happen gradually in future PRs.

**NG-4** Creating additional UI components (Input, Modal, etc.) - Button only for now, others will follow.

**NG-5** Advanced CI/CD features like deployment, Docker builds, or security scanning - Basic checks only.

**NG-6** Storybook or visual component documentation - Future improvement.

**NG-7** TypeScript configuration changes - Keep existing `tsconfig.json` settings.

**NG-8** Refactoring component architecture - Only fix types, no restructuring.

**NG-9** Bundle size analysis or performance monitoring - Future improvement.

**NG-10** E2E tests in CI - Will be added when E2E tests exist.

---

## 6. Design Considerations

### 6.1 Prettier Configuration Rationale

- **Semi-colons: enabled** - Prevents ASI (Automatic Semicolon Insertion) bugs
- **Single quotes: true** - More common in React/TypeScript projects
- **Print width: 100** - Balance readability and screen space
- **2 spaces** - Matches Next.js/React conventions

### 6.2 Button Component Design

**Visual Design**:
- Follow existing brand colors (primary green, accent yellow/orange)
- Use Tailwind CSS classes for consistency
- Smooth transitions for hover/active states
- Loading spinner matches button text color

**Component API Design**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
  type?: 'button' | 'submit' | 'reset'
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}
```

**Example Usage**:
```tsx
// Primary button
<Button variant="primary" size="md">
  Add to Cart
</Button>

// Loading state
<Button loading={isSubmitting}>
  Place Order
</Button>

// With icon
<Button icon={ShoppingCart} variant="secondary">
  View Cart
</Button>

// Icon only
<Button icon={Trash} variant="ghost" size="sm" />
```

### 6.3 TypeScript Types Architecture

**File Structure**:
```
lib/
└── supabase/
    ├── types.ts          # Domain types (NEW)
    ├── client.ts         # Supabase clients
    └── server.ts         # Server-side client
```

**Type Hierarchy**:
```typescript
// Base Supabase types
import { User } from '@supabase/supabase-js'

// Domain types
export interface UserProfile { /* ... */ }
export interface Product { /* ... */ }
export interface Order { /* ... */ }

// Composed types
export interface AuthUser extends User {
  profile?: UserProfile
}
```

### 6.4 CI/CD Workflow Design

**Workflow Structure**:
```
CI Workflow
├── Install & Cache (setup)
├── Parallel Jobs:
│   ├── Lint (ESLint)
│   ├── Type Check (tsc)
│   ├── Format Check (Prettier)
│   └── Build (next build)
└── Report Results
```

**Optimization Strategies**:
- Use `npm ci` instead of `npm install` (faster, deterministic)
- Cache `node_modules` using actions/cache
- Run independent checks in parallel
- Fail fast on errors

---

## 7. Technical Considerations

### 7.1 Dependencies to Install

```bash
# Prettier
npm install -D prettier eslint-config-prettier eslint-plugin-prettier

# Button component (likely already installed)
# - lucide-react (for icons)
# - clsx (for conditional classes) - optional but recommended
```

### 7.2 Files to Create

1. `.prettierrc.json` - Prettier configuration
2. `.prettierignore` - Prettier ignore patterns
3. `components/ui/Button.tsx` - Button component
4. `lib/supabase/types.ts` - TypeScript type definitions
5. `.github/workflows/ci.yml` - CI/CD workflow

### 7.3 Files to Modify

1. `package.json` - Add scripts and dependencies
2. `.eslintrc.json` - Integrate Prettier (create if doesn't exist)
3. `components/layout/Header.tsx` - Fix `any` types
4. `components/cart/CartDrawer.tsx` - Fix `any` types
5. `components/admin/ProductManagement.tsx` - Remove `@ts-ignore`
6. `README.md` - Add CI status badge
7. All existing `.ts` and `.tsx` files - Format with Prettier

### 7.4 Integration Points

**Prettier + ESLint**:
- Extend `eslint-config-prettier` to disable conflicting rules
- Add `prettier/prettier` rule as error in ESLint

**Button + Tailwind**:
- Use Tailwind utility classes
- Leverage existing color theme from `tailwind.config.ts`
- Use `clsx` or template literals for conditional classes

**Types + Supabase**:
- Import Supabase base types (`User`, `Session`, etc.)
- Extend base types for application-specific needs
- Type Supabase query responses properly

**CI + Vercel**:
- CI runs on PRs before Vercel preview deployments
- Vercel can be configured to block deployments if CI fails
- Both systems should run similar checks

### 7.5 Migration Strategy

**Phase 1: Setup (Day 1-2)**
- Install and configure Prettier
- Create ESLint integration
- Format entire codebase
- Commit formatted code

**Phase 2: Components (Day 3-5)**
- Create `components/ui/` directory
- Build Button component
- Test Button with various props
- Document usage examples

**Phase 3: Type Safety (Day 6-10)**
- Create type definitions file
- Fix `Header.tsx` and `CartDrawer.tsx` types
- Remove `@ts-ignore` from `ProductManagement.tsx`
- Fix any other type issues
- Run `tsc --noEmit` to verify

**Phase 4: CI/CD (Day 11-14)**
- Create GitHub Actions workflow
- Test workflow on feature branch
- Add status badge to README
- Merge to main

**Phase 5: Documentation (Day 15)**
- Update README with new scripts
- Document Button component
- Add contributing guidelines for code quality

### 7.6 Potential Challenges

**Challenge 1: Prettier Formatting Conflicts**
- **Risk**: Formatting entire codebase may create large diffs
- **Mitigation**: Do in separate PR, format once, then enforce

**Challenge 2: TypeScript Errors**
- **Risk**: Removing `any` types may reveal hidden bugs
- **Mitigation**: Fix issues properly, don't just silence them

**Challenge 3: Button Component Adoption**
- **Risk**: Developers might not use new component
- **Mitigation**: Clear documentation, lead by example, gradual migration

**Challenge 4: CI Build Time**
- **Risk**: Slow CI reduces developer velocity
- **Mitigation**: Use caching, run checks in parallel, optimize build

**Challenge 5: Breaking Changes**
- **Risk**: Type changes might affect existing code
- **Mitigation**: Thorough testing, fix incrementally, use feature branches

---

## 8. Success Metrics

### Quantitative Metrics

**M-1: Code Consistency**
- **Target**: 100% of code passes Prettier checks
- **Measurement**: `npm run format:check` exits with code 0

**M-2: Type Safety**
- **Target**: 0 instances of `any` type in components
- **Target**: 0 instances of `@ts-ignore` directives
- **Measurement**: Code search for `any` and `@ts-ignore`

**M-3: CI/CD Reliability**
- **Target**: CI completes in under 5 minutes
- **Target**: CI fails on all PRs with linting/type errors
- **Measurement**: GitHub Actions run time, failure rate on bad PRs

**M-4: Build Success Rate**
- **Target**: 0 TypeScript compilation errors
- **Measurement**: `npm run build` and `tsc --noEmit` both succeed

### Qualitative Metrics

**M-5: Developer Experience**
- **Indicator**: Developers report easier code reviews
- **Indicator**: New contributors can set up development environment quickly
- **Measurement**: Team feedback, onboarding time

**M-6: Code Quality Confidence**
- **Indicator**: Team has confidence in automated checks
- **Indicator**: Fewer production bugs related to type errors
- **Measurement**: Bug tracking, incident reports

**M-7: Component Reusability**
- **Indicator**: Button component is used in new features
- **Indicator**: Reduced button-related code duplication
- **Measurement**: Usage count, code analysis

### Acceptance Criteria

✅ **Prettier**
- [ ] Prettier configuration files created
- [ ] ESLint integration configured
- [ ] Entire codebase formatted
- [ ] Format check npm script works
- [ ] No formatting errors in CI

✅ **Button Component**
- [ ] Component created with all required props
- [ ] All 5 variants render correctly
- [ ] All 3 sizes work as expected
- [ ] Loading state displays spinner and disables button
- [ ] Disabled state works properly
- [ ] Icon support works with and without text
- [ ] TypeScript types are complete
- [ ] Component is accessible (keyboard nav, ARIA)

✅ **TypeScript Types**
- [ ] `lib/supabase/types.ts` created with all domain types
- [ ] All `any` types removed from Header.tsx
- [ ] All `any` types removed from CartDrawer.tsx
- [ ] All `@ts-ignore` directives removed from ProductManagement.tsx
- [ ] `npm run build` succeeds with no errors
- [ ] `tsc --noEmit` succeeds with no errors

✅ **CI/CD Pipeline**
- [ ] `.github/workflows/ci.yml` created
- [ ] CI runs on pushes to main/develop
- [ ] CI runs on all pull requests
- [ ] Lint check works and fails on errors
- [ ] Type check works and fails on errors
- [ ] Format check works and fails on unformatted code
- [ ] Build check works and fails on build errors
- [ ] CI completes in under 5 minutes
- [ ] Status badge added to README

---

## 9. Open Questions

**Q1**: Should we add a `fullWidth` prop to Button component for responsive layouts? yes
- **Impact**: Medium - Would improve mobile UX
- **Decision needed by**: Before Button implementation

**Q2**: Should CI also run on commits to feature branches (not just main/develop)? yes
- **Impact**: Low - More CI runs, but better quality
- **Decision needed by**: Before CI setup

**Q3**: Do we need to type Supabase Realtime subscriptions now, or later?
- **Impact**: Low - Not critical for current features
- **Decision needed by**: During TypeScript fixes

**Q4**: Should we configure Vercel to require CI passing before deployment? yes
- **Impact**: High - Prevents broken deployments
- **Decision needed by**: After CI is stable

**Q5**: Should Button component use `forwardRef` for ref forwarding?
- **Impact**: Medium - Needed for some advanced patterns
- **Decision needed by**: Before Button implementation

**Q6**: Do we need a `loading` prop for Button, or should we handle loading at parent level? yes
- **Decision**: Include loading prop (already specified in FR-2.4)
- **Rationale**: Common use case, better UX

---

## 10. Implementation Phases

### Phase 1: Prettier Setup (2-3 days)

**Tasks**:
1. Install Prettier and ESLint integration packages
2. Create `.prettierrc.json` configuration
3. Create `.prettierignore` file
4. Update `.eslintrc.json` (or create if missing)
5. Add npm scripts to `package.json`
6. Run `npm run format` to format codebase
7. Commit formatted code
8. Test format check in CI locally

**Deliverables**:
- Formatted codebase
- Prettier configuration files
- Updated package.json

**Verification**:
- `npm run format:check` passes
- ESLint doesn't conflict with Prettier
- Code reviews confirm formatting is consistent

### Phase 2: Button Component (3-4 days)

**Tasks**:
1. Create `components/ui/` directory
2. Create `Button.tsx` with TypeScript interface
3. Implement all variants (primary, secondary, outline, ghost, danger)
4. Implement all sizes (sm, md, lg)
5. Implement loading state with spinner
6. Implement disabled state
7. Implement icon support
8. Add proper TypeScript types
9. Test component with various prop combinations
10. Add accessibility features (ARIA, keyboard nav)
11. Create usage examples (in comments or separate file)

**Deliverables**:
- `components/ui/Button.tsx`
- Usage examples
- TypeScript types

**Verification**:
- Button renders all variants correctly
- All props work as expected
- TypeScript compiler is happy
- Accessibility audit passes (manual or axe-core)

### Phase 3: TypeScript Type Safety (4-5 days)

**Tasks**:
1. Create `lib/supabase/types.ts` file
2. Define `UserProfile` interface
3. Define `AuthUser` interface
4. Define `Product` interface
5. Define `Order` interface
6. Fix `Header.tsx` - replace `any` with `AuthUser`
7. Fix `CartDrawer.tsx` - replace `any` with `AuthUser`
8. Fix `ProductManagement.tsx` - remove `@ts-ignore` (lines 86, 71, 125)
9. Properly type Supabase queries
10. Add null checks where needed
11. Search codebase for any remaining `any` types
12. Run `tsc --noEmit` to verify no errors
13. Run `npm run build` to verify build succeeds
14. Test all affected features

**Deliverables**:
- `lib/supabase/types.ts`
- Fixed component files
- No TypeScript errors

**Verification**:
- `tsc --noEmit` passes
- `npm run build` succeeds
- No `any` types in components (grep search)
- No `@ts-ignore` directives (grep search)
- All features work correctly

### Phase 4: CI/CD Pipeline (3-4 days)

**Tasks**:
1. Create `.github/workflows/` directory
2. Create `ci.yml` workflow file
3. Configure workflow triggers (push, PR)
4. Add Node.js setup with caching
5. Add lint job
6. Add type-check job
7. Add format-check job
8. Add build job
9. Configure parallel execution
10. Test workflow on feature branch
11. Add status badge to README.md
12. Merge workflow to main
13. Verify CI runs on new PRs

**Deliverables**:
- `.github/workflows/ci.yml`
- Updated README.md with badge
- Working CI pipeline

**Verification**:
- CI runs on push to main/develop
- CI runs on all PRs
- CI fails when it should (test with bad code)
- CI passes on clean code
- CI completes in under 5 minutes

### Phase 5: Documentation & Polish (1-2 days)

**Tasks**:
1. Update README.md with new npm scripts
2. Document Button component usage
3. Document TypeScript types structure
4. Update contributing guidelines
5. Add comments to CI workflow file
6. Create summary of changes
7. Update IMPROVEMENTS.md to mark items complete

**Deliverables**:
- Updated documentation
- Clear contributing guidelines
- Summary of improvements

**Verification**:
- New developers can understand how to use new tools
- Documentation is accurate and helpful
- All checklists in IMPROVEMENTS.md are updated

---

## 11. Testing Strategy

### Manual Testing

**Prettier Testing**:
1. Make formatting changes to a file
2. Run `npm run format`
3. Verify file is properly formatted
4. Make intentional formatting error
5. Run `npm run format:check`
6. Verify it catches the error

**Button Component Testing**:
1. Create test page with all Button variants
2. Verify visual appearance of each variant
3. Test hover/active states
4. Test loading state (enable/disable)
5. Test disabled state
6. Test with icons
7. Test keyboard navigation (Tab, Enter)
8. Test with screen reader

**TypeScript Testing**:
1. Verify `tsc --noEmit` passes
2. Verify `npm run build` succeeds
3. Test Header with authenticated user
4. Test CartDrawer with items
5. Test ProductManagement admin actions
6. Verify IDE autocomplete works properly
7. Verify no runtime errors

**CI/CD Testing**:
1. Create PR with good code - verify CI passes
2. Create PR with lint error - verify CI fails
3. Create PR with type error - verify CI fails
4. Create PR with unformatted code - verify CI fails
5. Create PR with build error - verify CI fails
6. Verify CI completes in reasonable time
7. Check CI logs are clear and helpful

### Regression Testing

**Test all critical user flows**:
1. Browse products → Add to cart → Checkout → Order
2. User signup → Verify email → Login
3. Admin login → View orders → Update status
4. Admin product management → Upload image
5. Location picker for delivery

**Verify no breaking changes**:
- All existing features work
- No TypeScript errors introduced
- Build succeeds
- No console errors
- Mobile responsiveness maintained

---

## 12. Rollback Plan

### If Issues Occur

**Prettier Issues**:
- **Problem**: Formatting breaks something
- **Rollback**: Revert formatting commit, investigate specific file

**Button Component Issues**:
- **Problem**: Component has bugs
- **Rollback**: Don't use Button yet, fix issues before adoption

**TypeScript Issues**:
- **Problem**: Type changes break features
- **Rollback**: Revert type changes, investigate proper types, reapply

**CI/CD Issues**:
- **Problem**: CI blocks legitimate PRs
- **Rollback**: Temporarily disable failing check, fix workflow, re-enable

### Rollback Commands

```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert <commit-hash>

# Temporarily disable CI check
# Comment out failing job in .github/workflows/ci.yml
```

---

## 13. Dependencies

### External Dependencies

- **GitHub Actions** - Must have GitHub repo with Actions enabled
- **Node.js 18+** - CI requires this version
- **npm** - Package manager for dependencies
- **Prettier** - Code formatting
- **ESLint** - Linting (already installed)
- **TypeScript** - Type checking (already installed)
- **Tailwind CSS** - Styling for Button (already installed)
- **Lucide React** - Icons for Button (already installed)

### Internal Dependencies

- **Existing codebase** - Must be stable and building successfully
- **Git repository** - Must be using Git and GitHub
- **Supabase types** - Must understand Supabase schema for types
- **Tailwind config** - Must have color theme defined for Button

---

## 14. Risk Assessment

### High Risk

**Risk 1: Large Formatting Diff**
- **Impact**: Hard to review PR, potential merge conflicts
- **Likelihood**: High
- **Mitigation**: Format in separate PR, don't include logic changes

**Risk 2: Hidden TypeScript Bugs**
- **Impact**: Removing `any` reveals real bugs
- **Likelihood**: Medium
- **Mitigation**: Thorough testing, fix properly, don't rush

### Medium Risk

**Risk 3: CI Blocking Development**
- **Impact**: Slow down development if CI is too strict
- **Likelihood**: Medium
- **Mitigation**: Make CI fast, provide clear error messages

**Risk 4: Component Adoption**
- **Impact**: New Button component not used
- **Likelihood**: Low-Medium
- **Mitigation**: Documentation, code reviews, gradual migration

### Low Risk

**Risk 5: Prettier Configuration Disputes**
- **Impact**: Team disagrees on formatting rules
- **Likelihood**: Low
- **Mitigation**: Use community standards, focus on consistency

---

## 15. Post-Implementation

### Follow-up Tasks (Not in This PRD)

1. **Add Husky pre-commit hooks** - Prevent unformatted code from being committed
2. **Create more UI components** - Input, Modal, Toast, etc.
3. **Migrate existing buttons** - Gradually refactor to use Button component
4. **Add unit tests** - Test Button component, utilities
5. **Improve CI/CD** - Add tests, security scanning, bundle analysis
6. **Create Storybook** - Visual documentation for components

### Monitoring

**Week 1 After Launch**:
- Monitor CI failure rate
- Collect developer feedback
- Track Button component usage
- Check for TypeScript errors in logs

**Month 1 After Launch**:
- Measure code review efficiency (qualitative)
- Count production bugs related to types
- Assess onboarding time for new developers
- Evaluate CI/CD reliability

---

## 16. Approval & Sign-off

**Prepared by**: AI Assistant  
**Review required from**:
- [ ] Tech Lead - Architecture and technical approach
- [ ] Senior Developer - Implementation details and feasibility
- [ ] Product Owner - Priority and timeline alignment

**Approved by**: _________________  
**Date**: _________________

---

## Appendix A: Related Documents

- `docs/IMPROVEMENTS.md` - Full improvement roadmap
- `README.md` - Project setup and deployment
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind theme configuration

---

## Appendix B: Code Examples

### Example Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf"
}
```

### Example Button Component Usage

```tsx
import Button from '@/components/ui/Button';
import { ShoppingCart, Plus, Trash } from 'lucide-react';

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    // ... add to cart logic
    setLoading(false);
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.price}</p>

      {/* Primary button with loading */}
      <Button
        variant="primary"
        size="md"
        loading={loading}
        onClick={handleAddToCart}
        icon={Plus}
      >
        Add to Cart
      </Button>

      {/* Secondary button */}
      <Button variant="secondary" icon={ShoppingCart}>
        View Cart
      </Button>

      {/* Danger button */}
      <Button variant="danger" size="sm" icon={Trash}>
        Remove
      </Button>

      {/* Disabled button */}
      <Button disabled>Out of Stock</Button>
    </div>
  );
}
```

### Example TypeScript Types

```typescript
// lib/supabase/types.ts
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

export interface Product {
  id: string;
  name: string;
  name_si: string | null;
  category: string;
  price: number;
  is_available: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'packing' | 'ready' | 'dispatched' | 'completed' | 'cancelled';
  fulfillment_type: 'pickup' | 'delivery';
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
}
```

### Example CI Workflow

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality-checks:
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

      - name: Format check
        run: npm run format:check

      - name: Build
        run: npm run build
```

---

**End of PRD**