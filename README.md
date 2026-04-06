# Order Tracking System - Frontend

A React + TypeScript frontend for the Order Tracking System MVP with Vite, Tailwind CSS, and React Router.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Prerequisites

- Node.js 18+ and npm/yarn
- Access to the backend API (https://localhost:56742)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/MrTrooper101/order-tracking-frontend.git
cd order-tracking-frontend
```

### Installation

```bash
npm install
```

### Configuration

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=https://localhost:56742/api
VITE_APP_NAME=Order Tracking System
VITE_APP_VERSION=1.0.0
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # API integration with Axios
├── components/       # Reusable UI components
├── pages/           # Page components
│   ├── Dashboard.tsx
│   ├── Orders/      # Order management pages
│   └── Products/    # Product management pages
├── App.tsx          # Main app component with routing
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Pages

- **Dashboard** - Overview with key metrics
- **Products** - List, create, and edit products
- **Orders** - List, create, and manage orders
- **Order Details** - View and manage individual orders

## Features

- 📊 Dashboard with key metrics
- 📦 Product management (CRUD)
- 🛒 Order management with status tracking
- 💳 Payment status management
- 🎨 Responsive UI with Tailwind CSS
- 🔐 Type-safe with TypeScript
- 🚀 Fast development with Vite

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://localhost:56742/api` |
| `VITE_APP_NAME` | Application name | `Order Tracking System` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## License

MIT
