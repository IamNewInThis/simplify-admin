# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Dev server at http://localhost:5173
npm run build     # Production build
npm run lint      # ESLint
```

No test suite is configured.

## Architecture

Admin panel for the Simplify B2B price comparison platform. Provides full CRUD over the reference data tables: manufacturers, brands, categories, stores, and products catalog. Also has read-only views for scraped products.

### API Client

`src/lib/api.js` — single Axios instance with `baseURL: 'http://localhost:8080/api'`. Each resource is exported as an object of async methods (`getAll`, `getById`, `create`, `update`, `delete`). All pages import from this file — never call `axios` directly in components.

The `.env` file defines `API_BASE_URL` but it is **not** read by Vite (no `VITE_` prefix); the base URL is hardcoded in `api.js`.

### Routing & Pages

`src/App.jsx` sets up `BrowserRouter` with a sidebar nav. Each route maps to a page in `src/pages/`:

| Route | Page |
|---|---|
| `/` | Home |
| `/categories` | Categories |
| `/brands` | Brands |
| `/manufacturers` | Manufacturers |
| `/products` | Products (scraped, read-only) |
| `/products-catalog` | ProductsCatalog |
| `/stores` | Stores |

### Page Pattern

Every page follows the same pattern:
1. `useState` for `data`, `loading`, `error`, dialog open/close, and `editingItem` / `deletingItem`
2. `useEffect(() => loadData(), [])` — fetch on mount; a refresh button triggers `loadData()` manually
3. Table renders with inline Edit / Delete buttons per row
4. Controlled dialogs: `isCreateDialogOpen`, `editingItem` (truthy = edit dialog open), `deletingItem` (truthy = delete confirm open)
5. Form components (`BrandForm`, `CategoryForm`, etc.) are in `src/components/<resource>/` and receive `onSubmit`, `initialData`, `onCancel`

### Form Handling

- All forms use **react-hook-form** (`useForm`, `register`, `handleSubmit`, `formState.errors`)
- Some forms use **Zod** schema validation via `@hookform/resolvers/zod` — prefer this for new forms
- On submit: clean empty strings to `null`, call the relevant API method, then call parent's `loadData()` and close dialog
- Errors are shown in a shadcn `<Alert variant="destructive">` component

### UI Components

`src/components/ui/` contains shadcn/ui wrappers over Radix UI primitives (Button, Input, Dialog, Form, Table, Select, Checkbox, Badge, Alert). Use `cn()` from `src/lib/utils.js` to merge Tailwind classes.

Tailwind is configured with CSS variables for theming (HSL values in `src/index.css`) and class-based dark mode.

### Path Alias

`@/` resolves to `src/` — configured in both `vite.config.js` and `jsconfig.json`.
