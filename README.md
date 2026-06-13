<div align="center">
  <br />
  <img src="public/favicon.svg" alt="LMS Admin Panel" width="80" height="80" />
  <h1 align="center">LMS Admin Panel</h1>
  <p align="center">
    A comprehensive, multi-tenant administration dashboard for SaaS Learning Management Platforms.
    <br />
    Built with React, TypeScript, and Tailwind CSS.
    <br />
    <br />
    <a href="#features"><strong>Explore Features</strong></a>
    ·
    <a href="#getting-started"><strong>Getting Started</strong></a>
    ·
    <a href="#tech-stack"><strong>Tech Stack</strong></a>
    ·
    <a href="#project-structure"><strong>Project Structure</strong></a>
  </p>
  <br />
</div>

---

## Overview

The **LMS Admin Panel** is a full-featured administration interface for managing a multi-tenant Software-as-a-Service (SaaS) Learning Management System. It provides platform operators with a unified dashboard to oversee tenants, users, subscriptions, billing, courses, classes, and more — all with real-time analytics, role-based access control, and a polished, themeable UI.

This application serves as the central command center for platform-level administrators who need to monitor performance, manage customer organizations (tenants), configure pricing plans, and maintain the health of the entire LMS ecosystem.

## Features

### 📊 Dashboard & Analytics
- **Platform Overview** — Real-time stats on total tenants, monthly recurring revenue (MRR), active subscriptions, and total students
- **Revenue Analytics** — Track MRR, ARR, churn rate, and average revenue with interactive charts
- **Tenant Analytics** — Visualize tenant growth trends over time
- **Plan Distribution** — Pie chart breakdown of subscription plan adoption

### 🏢 Tenant Management
- Complete CRUD operations for tenant organizations
- Status badges (active, suspended, etc.) with visual indicators
- Tenant detail views with comprehensive information
- Suspension and deletion workflows with confirmation dialogs

### 🔐 Role-Based Access Control (RBAC)
- **User Management** — Create, view, and manage platform users
- **Roles** — Define custom roles with granular permission sets
- **Permissions** — Fine-grained permission system with search and group management
- **Permission Assigner** — Intuitive UI for assigning permissions to roles

### 💰 Billing & Subscriptions
- **Plan Management** — Create and edit pricing plans with a feature editor
- **Subscription Management** — View and manage all tenant subscriptions
- **Coupon System** — Create discount coupons with configurable rules
- **Campaign Management** — Run marketing campaigns with tracking

### 📚 Educational Content
- **Course Management** — Browse and manage courses with detail views
- **Class Management** — Organize classes by status (running, previous)
- **Class View** — Detailed class information at a glance
- **Asset Management** — Upload and manage media and learning assets
- **Learner Management** — View and manage enrolled students

### ⚙️ Platform Configuration
- **General Settings** — Configure platform-wide preferences
- **Payment Settings** — Manage payment gateway and billing configuration
- **Region Settings** — Localization and regional preferences
- **System Settings** — System-level configuration options
- **Environment Settings** — Environment-specific configuration

### 🎨 Theming & UX
- **5 Color Themes** — Purple (default), Green, Blue, Rose, and Copper
- **Dark Mode** — Full dark mode support with system-aware defaults
- **Smooth Theme Transitions** — Animated transitions when switching themes
- **Responsive Design** — Optimized for desktop with responsive layouts
- **Toast Notifications** — Real-time feedback with sonner
- **Loading States** — Skeleton loaders and loading spinners
- **Offline Detection** — Graceful offline notice component
- **Error Boundaries** — Robust error handling with fallback UI

## Tech Stack

### Core
| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI component library |
| [TypeScript 6](https://www.typescriptlang.org/) | Type-safe development |
| [Vite 8](https://vitejs.dev/) | Build tool and dev server |
| [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first CSS framework |

### State & Data
| Technology | Purpose |
|---|---|
| [TanStack React Query 5](https://tanstack.com/query) | Server state management and caching |
| [Zustand](https://github.com/pmndrs/zustand) | Lightweight client state management |
| [Axios](https://axios-http.com/) | HTTP client with interceptors |

### Routing & Navigation
| Technology | Purpose |
|---|---|
| [React Router 7](https://reactrouter.com/) | Client-side routing with protected routes |
| [Lucide React](https://lucide.dev/) | Icon library |

### Forms & Validation
| Technology | Purpose |
|---|---|
| [React Hook Form](https://react-hook-form.com/) | Performant form management |
| [Zod](https://zod.dev/) | Schema validation |

### UI Components & Styling
| Technology | Purpose |
|---|---|
| [Radix UI](https://www.radix-ui.com/) | Accessible, unstyled UI primitives |
| [Framer Motion](https://www.framer.com/motion/) | Declarative animations |
| [Recharts](https://recharts.org/) | Composable charting library |
| [Class Variance Authority](https://cva.style/) | Component variant management |
| [next-themes](https://github.com/pacocoursey/next-themes) | Theme (dark/light) management |
| [sonner](https://sonner.emilkowal.ski/) | Toast notification system |

### Dev Tools
| Technology | Purpose |
|---|---|
| [ESLint](https://eslint.org/) | Code linting |
| [PostCSS](https://postcss.org/) | CSS transformations |

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **pnpm**, **npm**, or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/lms-admin-panel.git
cd lms-admin-panel

# Install dependencies
pnpm install
# or
npm install
# or
yarn install

# Start the development server
pnpm dev
# or
npm run dev
# or
yarn dev
```

The development server will start at `http://localhost:5173`.

### Build for Production

```bash
pnpm build
# or
npm run build
# or
yarn build
```

The production build will be output to the `dist/` directory.

### Preview Production Build

```bash
pnpm preview
# or
npm run preview
# or
yarn preview
```

## Project Structure

```
src/
├── components/
│   ├── common/           # Shared UI components (DataTable, LoadingSpinner, etc.)
│   ├── layout/           # Layout components (DashboardLayout, Sidebar, Header)
│   └── ui/               # Base UI primitives (Button, Card, Dialog, etc.)
├── config/               # App configuration (query client, etc.)
├── constants/            # Route constants and app-wide constants
├── features/             # Feature modules (domain-driven structure)
│   ├── analytics/        # Revenue and tenant analytics
│   ├── assets/           # Asset/media management
│   ├── auth/             # Authentication (login, auth store)
│   ├── campaigns/        # Marketing campaign management
│   ├── classes/          # Class management
│   ├── coupons/          # Discount coupon management
│   ├── courses/          # Course management
│   ├── dashboard/        # Dashboard widgets and stats
│   ├── permissions/      # Permission management
│   ├── plans/            # Pricing plan management
│   ├── roles/            # Role management with permission assignment
│   ├── settings/         # Platform settings (general, payment, region, etc.)
│   ├── subscriptions/    # Subscription management
│   ├── tenants/          # Tenant management
│   └── users/            # User management
├── hooks/                # Shared React hooks
├── pages/                # Page-level components (route entries)
├── routes/               # Routing configuration with guards
├── services/             # API client and service layer
├── store/                # Zustand stores (theme, UI)
├── types/                # Global TypeScript type definitions
└── utils/                # Utility functions (cn, formatCurrency, formatDate)
```

### Architecture Highlights

- **Feature-Based Organization** — Each domain (tenants, users, plans, etc.) is encapsulated within its own feature module containing components, hooks, services, and types
- **Protected Routes** — Authenticated routes are guarded by `ProtectedRoute` and `GuestRoute` components
- **API Layer** — Centralized Axios instance with JWT authentication interceptors and automatic 401 redirect handling
- **Server State** — TanStack React Query manages all server data fetching, caching, and invalidation
- **Theme System** — CSS custom properties drive a 5-color theme system with dark mode support and smooth transitions

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint across the codebase |

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://your-api-endpoint.com/api/v1
```

The application communicates with a backend API for all data operations. Configure the base URL in `src/services/api.ts` or via environment variables.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Built with ❤️ for SaaS LMS platforms
</div>
