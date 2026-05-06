# FreelanceHub Admin Panel

Complete admin-focused MERN module for moderation, analytics, and control.

## Included Features

- Admin role-based authentication with JWT
- User management (view/search/filter, ban/unban, delete)
- Job moderation (view/search/filter, approve/reject/flag/delete)
- Platform analytics (users, jobs, proposals, pending reports + chart)
- Report management (view reports, resolve reports)
- Secure admin route protection on backend and frontend

## Folder Structure

- `backend/` Express + MongoDB API
- `frontend/` React + Redux Toolkit + Tailwind admin app

## Backend Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Fill environment variables
3. Run:
   - `npm install`
   - `npm run dev`

Backend runs on `http://localhost:5003`.

## Frontend Setup

1. Copy `frontend/.env.example` to `frontend/.env`
2. Run:
   - `npm install`
   - `npm run dev`

Frontend reads API URL from `VITE_API_BASE_URL`.

## Key Endpoints

- `POST /api/auth/admin/register`
- `POST /api/auth/admin/login`
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/toggle`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/jobs`
- `PUT /api/admin/jobs/:id/status`
- `DELETE /api/admin/jobs/:id`
- `GET /api/admin/reports`
- `PUT /api/admin/reports/:id/resolve`
