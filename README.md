# VoltCred Fleet

A real-time fleet management dashboard for tracking and controlling vehicles via the Traccar GPS platform.

---

## Features

- **Live Dashboard** — vehicle count, online/offline status, live GPS count
- **Real-time Map** — positions auto-refresh every 10 seconds using Leaflet + OpenStreetMap
- **Vehicle Table** — searchable, with per-row status indicators and stale position warnings
- **Remote Commands** — send engine lock / unlock commands to vehicles (allow-listed: `engineStop`, `engineResume`)
- **Trips** — historical trip data with start/end times, distance, speed, and route map with polyline
- **Reports** — summary report with total distance, drive time, engine hours, and top speed aggregation
- **Settings** — configurable poll interval and stale threshold (persisted to localStorage)

---

## Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React 19, Vite, React-Leaflet |
| Backend   | Node.js, Express 5            |
| Tracking  | Traccar (app.voltcred.com)    |
| Map       | Leaflet + OpenStreetMap       |

---

## Project Structure

```
voltcred-fleet/
├── backend/
│   ├── src/
│   │   ├── app.js                  # Express entry point
│   │   ├── routes/
│   │   │   ├── vehicle.routes.js   # GET /api/vehicles
│   │   │   ├── position.routes.js  # GET /api/positions
│   │   │   ├── command.routes.js   # GET/POST /api/vehicles/:id/command(s)
│   │   │   └── reports.routes.js   # GET /api/reports/trips|summary|route
│   │   └── services/
│   │       └── traccar.service.js  # Traccar API auth + requests
│   └── .env                        # ← NOT committed (see below)
└── frontend/
    └── src/
        ├── App.jsx                 # All UI components + logic
        └── App.css                 # Design system styles
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/voltcred-fleet.git
cd voltcred-fleet
```

### 2. Configure the backend

Create `backend/.env` — **never commit this file**:

```env
PORT=5000
TRACCAR_EMAIL=your@email.com
TRACCAR_PASSWORD=yourpassword
```

### 3. Run the backend

```bash
cd backend
npm install
npm run dev      # uses nodemon for auto-reload
# or
npm start        # plain node
```

Backend runs on `http://localhost:5000`

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` — open this in your browser.

Both must be running simultaneously.

---

## API Endpoints

| Method | Endpoint                          | Description                        |
|--------|-----------------------------------|------------------------------------|
| GET    | `/api/vehicles`                   | All vehicles from Traccar          |
| GET    | `/api/positions`                  | Current positions of all devices   |
| GET    | `/api/vehicles/:id/commands`      | Supported commands for a device    |
| POST   | `/api/vehicles/:id/command`       | Send `engineStop` or `engineResume`|
| GET    | `/api/reports/trips`              | Trip history for a device          |
| GET    | `/api/reports/summary`            | Summary report for a device        |
| GET    | `/api/reports/route`              | Raw GPS route points for a period  |

Report endpoints require `?deviceId=&from=&to=` (ISO 8601 timestamps).

---

## Security Notes

- `.env` is gitignored — never commit credentials
- Commands are server-side allow-listed to only `engineStop` and `engineResume`
- No arbitrary command types can reach a vehicle through this API

---

## License

MIT
