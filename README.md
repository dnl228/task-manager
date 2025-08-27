# Task Manager — Docker Setup Guide

This README walks you through running the **Task Manager** app (React frontend + .NET 8 backend + SQLite) with Docker.

---

## Included artefacts

- Two containers:
  - **taskweb**: React app built and served by Nginx (port `8081` in container)
  - **taskapi**: .NET 8 Web API with EF Core + SQLite (port `8080` in container)
- Same-origin requests: the frontend calls `/api/*`, and Nginx forwards those to the API container. This safeguards against CORS.
- EF Core **migrations applied automatically** at API startup.
- Simple JWT **login**:
  - `admin/admin123`
  - `user/user123`

---

## Prerequisites

- Docker and Docker Compose installed
- A shell/terminal

---

## Project structure

```
/backend/TaskApi/TaskApi
  Dockerfile
  appsettings.json
  (controllers, models, Program.cs with auto-migrate)

 /frontend/task-web/
  Dockerfile
  nginx.conf
  (React app using axios baseURL '/api')

docker-compose.yml
```

---

## Quick start

From the repository root:

```bash
docker compose build
docker compose up
```

- Open the app: http://localhost:8081  
- API: http://localhost:8080/swagger

To stop:

```bash
docker compose down
```

**Data persistence:** SQLite is stored in a Docker volume (`taskapi-data`). Your tasks survive container restarts.

---

## What the containers do

### Frontend (`taskweb`)
- Built with Node, served by **Nginx**.
- Nginx routes:
  - Static site at `/`
  - Proxy `/api/*` → `taskapi:8080/api/` (internal Docker network)

### Backend (`taskapi`)
- .NET 8 Web API
- **SQLite** database at `/app/data/App.db` (mounted volume)
- **EF Core migrations run on startup**
- JWT auth wired; all endpoints require an Authorization header

---

## Configuration & environment

The API reads configuration from `appsettings.json` and environment variables.

- SQLite connection (default):
  ```
  Data Source=/app/data/App.db
  ```
- JWT:
  - Issuer: `TaskApi`
  - Audience: `TaskWeb`
  - Key: set via env var `Jwt__Key` in production (see below)

---

## Basic usage

1) Open the app at http://localhost:8081
2) Log in with `admin/admin123` or `user/user123`
3) Add tasks, mark complete/pending, delete, and **reorder** (up/down buttons)
4) Filter tasks (All, Completed, Pending)

---

## Health and logs

- Container healthchecks:
  - Frontend checks `/` on Nginx
  - Backend checks `/swagger` by default (you can swap to `/health` if you add one)
- View logs:
  ```bash
  docker compose logs -f taskapi
  docker compose logs -f taskweb
  ```

---

## Troubleshooting

**Port already in use**
- Change the published ports in `docker-compose.yml` (map `8081:80` to something else).

**Frontend can’t reach API**
- The frontend calls `/api/*`. Ensure Nginx proxy in `frontend/task-web/nginx.conf` points to `http://taskapi:8080/api/`.
- Both services must be on the same Docker network (they are by default in the provided compose files).

**Unauthorized on endpoints**
- You must log in to get a token (the UI has a simple login form).
- The axios client sends the token automatically from `localStorage`.

**Migrations didn’t apply**
- The API applies migrations at startup. Check `taskapi` logs for migration messages.
- If you changed the connection string, ensure the path or DB host is reachable.

---

## Useful commands

Rebuild after code changes:
```bash
docker compose build --no-cache
docker compose up -d
```

Clean everything (containers + volumes):
```bash
docker compose down -v
```

Open a shell in the API container:
```bash
docker compose exec taskapi sh
```

---

## Future improvements

1) Substitute the storing mechanism for authentication token from localStorage to cookies. LocalStorage stores the data indefinitely whilst cookies can be set to expire, making them more secure.
2) Add confirmation modal when deleting a task
3) Wire the user to the database rather than having the credentials hard-coded in the database. Store the password in hashed format and compare that to the hashed user input.
4) Add pagination to the list of tasks
