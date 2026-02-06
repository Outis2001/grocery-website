# Tasks: Code Quality Foundation Initiative

**Based on**: `prd-code-quality-foundation.md`  
**Timeline**: 2-3 weeks  
**Status**: Not Started  
**Last Updated**: February 6, 2026

---

## Relevant Files

### Prettier Configuration

- `.prettierrc.json` - Prettier configuration file (to be created)
- `.prettierignore` - Files to exclude from formatting (to be created)
- `.eslintrc.json` - ESLint configuration with Prettier integration (to be created/updated)
- `package.json` - Add Prettier scripts and dependencies

### Button Component

- `components/ui/Button.tsx` - New reusable Button component (to be created)
- `components/ui/` - New directory for shared UI components (to be created)
- `tailwind.config.ts` - Reference for color tokens and styling

### TypeScript Types

- `lib/supabase/types.ts` - Domain type definitions (to be created)
- `components/layout/Header.tsx` - Fix `any` types (line 11)
- `components/cart/CartDrawer.tsx` - Fix `any` types (line 17)
- `components/admin/ProductManagement.tsx` - Remove `@ts-ignore` directives (lines 86, 71, 125)
- `lib/supabase/client.ts` - Reference for Supabase client types
- `lib/supabase/server.ts` - Reference for server-side client types

### CI/CD Pipeline

- `.github/workflows/ci.yml` - GitHub Actions CI workflow (to be created)
- `.github/workflows/` - GitHub workflows directory (to be created)
- `README.md` - Add CI status badge

### Testing & Verification

- All `.ts` and `.tsx` files - Will be formatted by Prettier
- `tsconfig.json` - TypeScript configuration (reference only, no changes)

### Notes

- This initiative does not include test files (testing infrastructure is Phase 2 in IMPROVEMENTS.md)
- Husky pre-commit hooks are not included (will be added in Phase 2)
- Existing button refactoring is not included (gradual migration approach)
- Use `npm run format` to format files after Prettier setup
- Use `npx tsc --noEmit` to verify TypeScript types
- Use `npm run build` to verify build succeeds

---

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:

- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

---

## Tasks

### Phase 1: Setup and Branching

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature: `git checkout -b feature/code-quality-foundation`
  - [x] 0.2 Verify you're on the correct branch: `git branch`
  - [x] 0.3 Ensure the branch is clean with no uncommitted changes: `git status`

### Phase 2: Prettier Configuration (Day 1-2)

- [x] 1.0 Setup Prettier and Code Formatting
  - [x] 1.1 Install Prettier and ESLint integration packages: `npm install -D prettier eslint-config-prettier eslint-plugin-prettier`
  - [x] 1.2 Create `.prettierrc.json` file in the project root with configuration:
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
  - [x] 1.3 Create `.prettierignore` file in the project root with exclusions:
    ```
    node_modules/
    .next/
    out/
    build/
    dist/
    *.min.js
    package-lock.json
    .git/
    ```
  - [x] 1.4 Check if `.eslintrc.json` exists in the project root
  - [x] 1.5 If `.eslintrc.json` exists, update it to integrate Prettier. If not, create it with:
    ```json
    {
      "extends": ["next/core-web-vitals", "prettier"],
      "plugins": ["prettier"],
      "rules": {
        "prettier/prettier": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        "no-console": ["warn", { "allow": ["warn", "error"] }]
      }
    }
    ```
  - [x] 1.6 Add npm scripts to `package.json` in the "scripts" section:
    ```json
    "format": "prettier --write .",
    "format:check": "prettier --check ."
    ```
  - [x] 1.7 Test Prettier configuration by running: `npm run format:check`
  - [x] 1.8 Format the entire codebase: `npm run format`
  - [x] 1.9 Review the changes made by Prettier (use `git diff` to see what changed)
  - [x] 1.10 Commit the formatted code: `git add . && git commit -m "chore: setup Prettier and format codebase"`
  - [x] 1.11 Verify no ESLint/Prettier conflicts by running: `npm run lint`

### Phase 3: Button Component (Day 3-5)

- [x] 2.0 Create Button Component
  - [x] 2.1 Create `components/ui/` directory: `mkdir -p components/ui`
  - [x] 2.2 Create `components/ui/Button.tsx` file
  - [x] 2.3 Import necessary dependencies (React, clsx or cn utility for class merging)
  - [x] 2.4 Define TypeScript interface `ButtonProps` with all required props:
    - `variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'`
    - `size?: 'sm' | 'md' | 'lg'`
    - `loading?: boolean`
    - `disabled?: boolean`
    - `icon?: React.ComponentType<{ className?: string }>`
    - `type?: 'button' | 'submit' | 'reset'`
    - `className?: string`
    - `onClick?: () => void`
    - `children?: React.ReactNode`
  - [x] 2.5 Create base button styles using Tailwind classes (transitions, focus states, etc.)
  - [x] 2.6 Implement variant styles:
    - [x] 2.6.1 `primary` variant - green background, white text, hover states
    - [x] 2.6.2 `secondary` variant - white background, green border, green text
    - [x] 2.6.3 `outline` variant - transparent background, border, hover fill
    - [x] 2.6.4 `ghost` variant - transparent background, no border, subtle hover
    - [x] 2.6.5 `danger` variant - red theme for destructive actions
  - [x] 2.7 Implement size styles:
    - [x] 2.7.1 `sm` size - smaller padding and font size
    - [x] 2.7.2 `md` size - default medium size
    - [x] 2.7.3 `lg` size - larger padding and font size
  - [x] 2.8 Implement loading state:
    - [x] 2.8.1 Create or import a loading spinner component (simple SVG animation)
    - [x] 2.8.2 Show spinner when `loading` prop is true
    - [x] 2.8.3 Disable button when loading
    - [x] 2.8.4 Maintain button width during loading (prevent layout shift)
  - [x] 2.9 Implement disabled state:
    - [x] 2.9.1 Add opacity and cursor styles for disabled state
    - [x] 2.9.2 Add `aria-disabled` attribute
    - [x] 2.9.3 Prevent onClick when disabled
  - [x] 2.10 Implement icon support:
    - [x] 2.10.1 Render icon component if provided
    - [x] 2.10.2 Position icon to the left of text with proper spacing
    - [x] 2.10.3 Handle icon-only buttons (no text)
    - [x] 2.10.4 Apply appropriate icon size based on button size
  - [x] 2.11 Add accessibility attributes:
    - [x] 2.11.1 Proper `type` attribute (default to "button")
    - [x] 2.11.2 `aria-disabled` for disabled state
    - [x] 2.11.3 `aria-busy` for loading state
    - [x] 2.11.4 Focus visible styles for keyboard navigation
  - [x] 2.12 Combine all className logic using clsx or template literals
  - [x] 2.13 Export the Button component as default
  - [x] 2.14 Add JSDoc comments documenting the component and its props
  - [x] 2.15 Test the Button component by creating a temporary test page or using existing page
  - [x] 2.16 Verify all variants render correctly (visual check)
  - [x] 2.17 Verify all sizes work as expected
  - [x] 2.18 Test loading state (toggle loading prop)
  - [x] 2.19 Test disabled state
  - [x] 2.20 Test with icons (import from lucide-react and test)
  - [x] 2.21 Test keyboard navigation (Tab to focus, Enter to click)
  - [x] 2.22 Run format check: `npm run format:check`
  - [x] 2.23 Fix any formatting issues if needed: `npm run format`
  - [ ] 2.24 Commit the Button component: `git add . && git commit -m "feat: create reusable Button component with variants and states"`

### Phase 4: TypeScript Type Safety (Day 6-10)

- [ ] 3.0 Fix TypeScript Type Safety Issues
  - [ ] 3.1 Create `lib/supabase/types.ts` file
  - [ ] 3.2 Import Supabase base types: `import { User } from '@supabase/supabase-js'`
  - [ ] 3.3 Define `UserProfile` interface with all fields:
    - `id: string`
    - `email: string`
    - `phone: string | null`
    - `is_admin: boolean`
    - `skip_verification: boolean`
    - `created_at: string`
    - `updated_at: string`
  - [ ] 3.4 Define `AuthUser` interface extending Supabase User:
    ```typescript
    export interface AuthUser extends User {
      profile?: UserProfile;
    }
    ```
  - [ ] 3.5 Define `Product` interface with all fields:
    - `id: string`
    - `name: string`
    - `name_si: string | null`
    - `category: string`
    - `price: number`
    - `is_available: boolean`
    - `image_url: string | null`
    - `created_at: string`
    - `updated_at: string`
  - [ ] 3.6 Define `Order` interface with all fields:
    - `id: string`
    - `user_id: string`
    - `order_number: string`
    - `status: 'pending' | 'confirmed' | 'packing' | 'ready' | 'dispatched' | 'completed' | 'cancelled'`
    - `fulfillment_type: 'pickup' | 'delivery'`
    - `items: OrderItem[]`
    - `subtotal: number`
    - `delivery_fee: number`
    - `total: number`
    - `created_at: string`
    - `updated_at: string`
  - [ ] 3.7 Define `OrderItem` interface:
    - `product_id: string`
    - `quantity: number`
    - `price: number`
    - `product_name: string`
  - [ ] 3.8 Add any other domain types as needed (CartItem, etc.)
  - [ ] 3.9 Read `components/layout/Header.tsx` to understand current usage
  - [ ] 3.10 Fix `Header.tsx` - replace `any` type on line 11 with proper `AuthUser` type
  - [ ] 3.11 Update imports in `Header.tsx` to include `AuthUser` from `@/lib/supabase/types`
  - [ ] 3.12 Test Header component to ensure it still works correctly
  - [ ] 3.13 Read `components/cart/CartDrawer.tsx` to understand current usage
  - [ ] 3.14 Fix `CartDrawer.tsx` - replace `any` type on line 17 with proper `AuthUser` type
  - [ ] 3.15 Update imports in `CartDrawer.tsx` to include `AuthUser` from `@/lib/supabase/types`
  - [ ] 3.16 Test CartDrawer component to ensure it still works correctly
  - [ ] 3.17 Read `components/admin/ProductManagement.tsx` to understand the `@ts-ignore` usage
  - [ ] 3.18 Fix `ProductManagement.tsx` - remove `@ts-ignore` on line 71 and properly type the update operation
  - [ ] 3.19 Fix `ProductManagement.tsx` - remove `@ts-ignore` on line 86 and properly type the update operation
  - [ ] 3.20 Fix `ProductManagement.tsx` - remove `@ts-ignore` on line 125 and properly type the update operation
  - [ ] 3.21 Update imports in `ProductManagement.tsx` to use proper types from `@/lib/supabase/types`
  - [ ] 3.22 Test ProductManagement features to ensure all CRUD operations work
  - [ ] 3.23 Search codebase for any remaining `any` types: `grep -r "any" --include="*.ts" --include="*.tsx" components/`
  - [ ] 3.24 Fix any additional `any` types found
  - [ ] 3.25 Search codebase for any remaining `@ts-ignore` directives: `grep -r "@ts-ignore" --include="*.ts" --include="*.tsx" .`
  - [ ] 3.26 Fix any additional `@ts-ignore` directives found
  - [ ] 3.27 Run TypeScript type check: `npx tsc --noEmit`
  - [ ] 3.28 Fix any type errors that appear
  - [ ] 3.29 Run build to verify everything compiles: `npm run build`
  - [ ] 3.30 Fix any build errors
  - [ ] 3.31 Test all affected features:
    - [ ] 3.31.1 User authentication and header menu
    - [ ] 3.31.2 Cart functionality (add/remove items)
    - [ ] 3.31.3 Admin product management
    - [ ] 3.31.4 Admin order management
  - [ ] 3.32 Run format check: `npm run format:check`
  - [ ] 3.33 Commit type safety improvements: `git add . && git commit -m "fix: improve TypeScript type safety, remove any types and ts-ignore"`

### Phase 5: CI/CD Pipeline (Day 11-14)

- [ ] 4.0 Setup CI/CD Pipeline
  - [ ] 4.1 Create `.github/workflows/` directory: `mkdir -p .github/workflows`
  - [ ] 4.2 Create `.github/workflows/ci.yml` file
  - [ ] 4.3 Add workflow name and triggers (on push to main/develop, on pull requests)
  - [ ] 4.4 Configure workflow to use Node.js 18.x
  - [ ] 4.5 Add checkout step using `actions/checkout@v4`
  - [ ] 4.6 Add Node.js setup step using `actions/setup-node@v4` with npm caching
  - [ ] 4.7 Add install dependencies step: `npm ci`
  - [ ] 4.8 Add lint check step: `npm run lint`
  - [ ] 4.9 Add type check step: `npx tsc --noEmit`
  - [ ] 4.10 Add format check step: `npm run format:check`
  - [ ] 4.11 Add build check step: `npm run build`
  - [ ] 4.12 Configure steps to fail the workflow on errors
  - [ ] 4.13 Add appropriate permissions (read for repo content)
  - [ ] 4.14 Test CI workflow locally if possible (act CLI or similar)
  - [ ] 4.15 Commit the CI workflow: `git add . && git commit -m "ci: add GitHub Actions workflow for automated quality checks"`
  - [ ] 4.16 Push branch to GitHub: `git push -u origin feature/code-quality-foundation`
  - [ ] 4.17 Create a draft pull request to test CI workflow
  - [ ] 4.18 Verify CI runs automatically on the PR
  - [ ] 4.19 Check CI logs to ensure all steps pass
  - [ ] 4.20 If CI fails, fix issues and push again
  - [ ] 4.21 Copy the CI status badge markdown from GitHub Actions
  - [ ] 4.22 Open `README.md` file
  - [ ] 4.23 Add CI status badge near the top of README (after title, before description)
  - [ ] 4.24 Commit README update: `git add README.md && git commit -m "docs: add CI status badge to README"`
  - [ ] 4.25 Push changes: `git push`
  - [ ] 4.26 Verify badge appears correctly in GitHub

### Phase 6: Documentation and Verification (Day 15)

- [ ] 5.0 Documentation and Final Verification
  - [ ] 5.1 Update `README.md` to document new npm scripts:
    - [ ] 5.1.1 Add section for development scripts
    - [ ] 5.1.2 Document `npm run format` - Format all files with Prettier
    - [ ] 5.1.3 Document `npm run format:check` - Check if files are formatted
  - [ ] 5.2 Document Button component usage:
    - [ ] 5.2.1 Add inline JSDoc comments if not already done
    - [ ] 5.2.2 Create usage examples in comments at top of Button.tsx
    - [ ] 5.2.3 Consider adding a COMPONENTS.md file documenting the Button component
  - [ ] 5.3 Document TypeScript types structure:
    - [ ] 5.3.1 Add comments to `lib/supabase/types.ts` explaining each interface
    - [ ] 5.3.2 Document which types to use where (in README or separate doc)
  - [ ] 5.4 Update `docs/IMPROVEMENTS.md`:
    - [ ] 5.4.1 Mark "Add Prettier" as complete in Phase 1 checklist
    - [ ] 5.4.2 Mark "Create Button component" as complete in Phase 1 checklist
    - [ ] 5.4.3 Mark "Fix TypeScript any types" as complete in Phase 1 checklist
    - [ ] 5.4.4 Mark "Add CI/CD workflow" as complete in Phase 1 checklist
  - [ ] 5.5 Create or update CONTRIBUTING.md with:
    - [ ] 5.5.1 Code formatting guidelines (use Prettier)
    - [ ] 5.5.2 Component guidelines (use ui/ directory for shared components)
    - [ ] 5.5.3 TypeScript guidelines (no any types, no ts-ignore)
    - [ ] 5.5.4 CI/CD requirements (all checks must pass)
  - [ ] 5.6 Run full verification suite:
    - [ ] 5.6.1 `npm run lint` - should pass with no errors
    - [ ] 5.6.2 `npm run format:check` - should pass with no errors
    - [ ] 5.6.3 `npx tsc --noEmit` - should pass with no errors
    - [ ] 5.6.4 `npm run build` - should succeed
  - [ ] 5.7 Manual testing of all features:
    - [ ] 5.7.1 Browse products on homepage
    - [ ] 5.7.2 Add items to cart
    - [ ] 5.7.3 View cart drawer
    - [ ] 5.7.4 Proceed to checkout
    - [ ] 5.7.5 Place an order
    - [ ] 5.7.6 Login as admin
    - [ ] 5.7.7 View orders in admin panel
    - [ ] 5.7.8 Update order status
    - [ ] 5.7.9 Manage products (toggle availability, upload images)
  - [ ] 5.8 Test Button component in various contexts (if time permits):
    - [ ] 5.8.1 Replace a button in one component with new Button component
    - [ ] 5.8.2 Verify it works correctly
    - [ ] 5.8.3 This validates the component is production-ready
  - [ ] 5.9 Review all git commits to ensure good commit messages
  - [ ] 5.10 Squash or clean up commits if needed (optional)
  - [ ] 5.11 Ensure all changes are committed: `git status`
  - [ ] 5.12 Push final changes: `git push`
  - [ ] 5.13 Update the PR from draft to ready for review
  - [ ] 5.14 Request code review from team members
  - [ ] 5.15 Address any review comments
  - [ ] 5.16 Once approved, merge the PR using "Squash and merge" or "Merge commit" based on team preference
  - [ ] 5.17 Delete the feature branch after merging
  - [ ] 5.18 Pull latest main branch: `git checkout main && git pull`
  - [ ] 5.19 Verify CI passes on main branch
  - [ ] 5.20 Celebrate! 🎉 The code quality foundation is now in place!

---

## Post-Implementation Notes

After completing all tasks, consider these follow-up improvements (not part of this task list):

1. **Husky Pre-commit Hooks** - Prevent unformatted code from being committed
2. **Additional UI Components** - Create Input, Modal, Toast, LoadingSpinner components
3. **Button Migration** - Gradually refactor existing buttons to use new Button component
4. **Testing Infrastructure** - Add Vitest for unit tests, Playwright for E2E tests
5. **Enhanced CI/CD** - Add test running, security scanning, bundle size analysis

These are documented in `docs/IMPROVEMENTS.md` as Phase 2 and beyond.
