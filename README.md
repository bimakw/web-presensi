# Web Presensi

Frontend for the attendance management system — SvelteKit 2 + Svelte 5 + Tailwind CSS 4.

**Demo:** [verdant-malasada-f57e00.netlify.app](https://verdant-malasada-f57e00.netlify.app)

Pairs with [service-presensi](https://github.com/bimakw/service-presensi) backend.

## Running

```bash
npm install
cp .env.example .env
npm run dev
```

Or via Docker:

```bash
docker-compose up -d --build
```

Set `VITE_API_URL` in `.env` to point at the backend.

## What It Does

- Login/register with JWT auth
- Check-in/check-out with geolocation validation
- Dashboard + analytics charts
- Role-based views (admin vs employee)

## Testing

```bash
npm run test:run
```

## License

MIT with attribution — see [LICENSE](LICENSE).
