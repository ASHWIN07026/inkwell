# Supabase Setup Guide

## Step 1 — Create Supabase Project

1. Go to https://supabase.com → Sign up free
2. Click **New Project** → enter project name "inkwell" → set a database password → Create
3. Wait ~2 minutes for it to provision

## Step 2 — Run the SQL Schema

1. In your Supabase dashboard → click **SQL Editor** (left sidebar)
2. Click **New query**
3. Open `backend/config/schema.sql` from this project
4. Copy the entire contents → paste into the SQL Editor
5. Click **Run** (green button)
6. You should see "Success. No rows returned"

## Step 3 — Get Your API Keys

1. In Supabase dashboard → **Settings** (gear icon) → **API**
2. Copy:
   - **Project URL** → this is your `SUPABASE_URL`
   - **service_role** key (under "Project API keys", click reveal) → this is your `SUPABASE_SERVICE_KEY`

⚠️ Use the `service_role` key (not `anon`), since we handle our own auth.

## Step 4 — Configure .env

Create `backend/.env`:

```
PORT=5000
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_service_role_key
JWT_SECRET=313a955e9d2f06ee764f08b3cd0f8943c87dc6e6c173d241f885e9e50be5bfc1
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## Step 5 — Start the Server

```powershell
cd backend
npm install
npm run dev
```

You should see:
```
🚀 Inkwell API running on http://localhost:5000
📦 Database: Supabase
```

## Step 6 — Seed Sample Data (optional)

```powershell
npm run seed
```

Login with: `demo@inkwell.com` / `demo1234`

## Step 7 — Start Frontend

In a new terminal:
```powershell
cd frontend
npm install
npm start
```

Open http://localhost:3000 ✅
