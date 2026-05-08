# MeraDev Admin

## API Setup

Set `VITE_API_URL` in `.env`:

Use live backend:

```env
VITE_API_URL=https://api.meradevtechnologies.com
```

Use local backend:

```env
VITE_API_URL=http://localhost:5500
```

If `VITE_API_URL` is not set, admin auto-fallback works like this:
- On `localhost` or `127.0.0.1` -> `http://localhost:5500`
- Otherwise -> `https://api.meradevtechnologies.com`

## Run

Install and start:

```bash
npm install
npm run dev
```
