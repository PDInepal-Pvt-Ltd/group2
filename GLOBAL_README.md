# ClientX — Global Overview

This document provides a high-level overview of the ClientX repository and how the three primary components interact.

Repository layout

- `backend/` — Django REST API (serves data and authentication).
- `clientx_web/` — Web client (React + Vite) that consumes the backend API.
- `Mobile/` — Flutter mobile application that consumes the backend API.

Recommended local run order

1. Start the backend (Django) so the API endpoints are available.
   - See `backend/README.md` for setup and commands.
2. Start the web client (`clientx_web`) in dev mode (`npm run dev`) and point its API base URL to the running backend.
3. Start the mobile client (Flutter) using `flutter run` and configure the API base URL similarly.

Configuration

- Backend: use environment variables for SECRET_KEY, DEBUG, and database settings in production. Defaults use `db.sqlite3` for local dev.
- Web & Mobile: configure API base URL in their respective service/config files to point at the backend (e.g., `http://localhost:8000` when running locally).

Testing & data

- The repo may contain sample JSON files (`login.json`, `register.json`) and a SQLite DB for quick local testing.

Contributing

- Follow standard git workflow: feature branches, meaningful commit messages, and open a PR for review.
- Keep backend API changes documented and update client code when API shapes change.

Where to find more details

- Backend README: [backend/README.md](backend/README.md)
- Web README: [clientx_web/README.md](clientx_web/README.md)
- Mobile README: [Mobile/README.md](Mobile/README.md)
