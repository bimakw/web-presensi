# Web Presensi

Frontend application for attendance management system built with SvelteKit and Tailwind CSS.

**[Live Demo](https://verdant-malasada-f57e00.netlify.app)**

## Tech Stack

- **Framework:** SvelteKit 2.x with Svelte 5
- **Styling:** Tailwind CSS 4.x
- **Language:** TypeScript
- **Build Tool:** Vite
- **Container:** Docker

## Features

- [x] User Authentication (Login/Register)
- [x] Dashboard with attendance statistics
- [x] Attendance list with filtering
- [x] Check-in/Check-out functionality with geolocation
- [x] Role-based access (Admin/Employee)
- [x] Responsive design
- [x] User Profile management
- [x] Analytics dashboard with charts
- [x] Geolocation-based check-in validation

## Prerequisites

- Node.js 18+
- npm or pnpm
- [service-presensi](https://github.com/bimakw/service-presensi) backend running

## Quick Start

```bash
# Clone repository
git clone https://github.com/bimakw/web-presensi.git
cd web-presensi

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Run development server
npm run dev
```

## Docker

```bash
# Create network (if not exists)
docker network create presensi-network

# Build and run
docker-compose up -d --build

# View logs
docker-compose logs -f
```

Application will be available at `http://localhost:11080`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080` |
| `PORT` | Server port | `11080` |
| `ORIGIN` | Allowed origin for CORS | `http://localhost:11080` |

## Project Structure

```
web-presensi/
├── src/
│   ├── lib/
│   │   ├── api/          # API client & services
│   │   │   ├── auth.ts
│   │   │   ├── presensi.ts
│   │   │   ├── analytics.ts
│   │   │   └── client.ts
│   │   ├── components/   # Reusable components
│   │   │   ├── ui/       # UI components (Button, Input, etc.)
│   │   │   └── layout/   # Layout components (Navbar, Footer)
│   │   ├── stores/       # Svelte stores
│   │   │   ├── auth.svelte.ts
│   │   │   └── geolocation.svelte.ts
│   │   └── types/        # TypeScript types
│   ├── routes/
│   │   ├── (app)/        # Protected routes
│   │   │   ├── dashboard/
│   │   │   ├── presensi/
│   │   │   ├── analytics/
│   │   │   └── profile/
│   │   ├── login/
│   │   └── register/
│   └── app.css           # Global styles
├── static/               # Static assets
├── .env.example
├── LICENSE
├── NOTICE
└── README.md
```

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Run tests
npm run test:run
```

## Testing

```bash
# Run tests once
npm run test:run

# Run tests in watch mode
npm run test
```

| Module | Tests |
|--------|-------|
| API Client | 10 |

## API Integration

This frontend consumes the following API endpoints from [service-presensi](https://github.com/bimakw/service-presensi):

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Attendance
- `GET /api/presensi` - List attendance records
- `POST /api/presensi` - Create attendance
- `GET /api/presensi/:id` - Get attendance by ID
- `PUT /api/presensi/:id` - Update attendance
- `DELETE /api/presensi/:id` - Delete attendance
- `POST /api/presensi/:id/checkin` - Check-in with location
- `POST /api/presensi/:id/checkout` - Check-out with location

### Analytics
- `GET /api/analytics/summary` - Overall attendance summary
- `GET /api/analytics/monthly` - Monthly statistics
- `GET /api/analytics/status-breakdown` - Status distribution

## Screenshots

### Landing Page
Modern landing page with feature highlights.

### Dashboard
User dashboard showing today's attendance and statistics.

### Attendance List
Filterable attendance records with pagination.

## Related Projects

- [service-presensi](https://github.com/bimakw/service-presensi) - Backend API (Go + MongoDB)

## License

This project is licensed under the MIT License with Attribution Requirement.

**You are free to:**
- Use this code for personal/commercial projects
- Modify and distribute

**You must:**
- Include the original copyright notice
- Provide visible attribution to the original author

**You cannot:**
- Sell this code without significant modifications
- Remove copyright notices
- Claim this as your original work

See [LICENSE](LICENSE) for details.

---

&copy; 2024 Bima Kharisma Wicaksana
