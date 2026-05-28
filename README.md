# ✦ Inkwell — Full-Stack Blog Platform

A production-grade blogging platform built with **React**, **Node.js/Express**, and **Supabase (PostgreSQL)**.

🌐 **Live Demo:** https://inkwell-h42a.vercel.app

---

## 🗂 Project Structure

```
inkwell/
├── backend/               # Express REST API
│   ├── config/
│   │   ├── supabase.js    # Supabase client
│   │   ├── schema.sql     # Database schema
│   │   └── seed.js        # Database seeder
│   ├── controllers/       # Route handlers
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js        # JWT middleware
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── comments.js
│   │   └── users.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/              # React SPA
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── comments/  # CommentSection
        │   ├── layout/    # Navbar
        │   ├── posts/     # PostCard
        │   └── ui/        # Button, Input, Avatar, CategoryBadge
        ├── context/
        │   └── AuthContext.js
        ├── pages/
        │   ├── Home.jsx
        │   ├── PostDetail.jsx
        │   ├── WritePost.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Profile.jsx
        │   └── Settings.jsx
        ├── utils/
        │   ├── api.js     # Axios instance + interceptors
        │   └── helpers.js
        ├── App.jsx
        ├── index.js
        └── index.css
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A free [Supabase](https://supabase.com) account

### 1. Clone & Install

```bash
git clone https://github.com/ASHWIN07026/inkwell.git
cd inkwell

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** and run the contents of `backend/config/schema.sql`
3. Go to **Settings → API** and copy your **Project URL** and **service_role** key

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your_very_long_random_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4. Seed the Database (optional)

```bash
cd backend
node config/seed.js
```

Creates 4 sample users and 10 posts across all categories.

Demo login credentials:
- `demo@inkwell.com` / `demo1234`
- `sarah@inkwell.com` / `password123`
- `maya@inkwell.com` / `password123`
- `james@inkwell.com` / `pass5678`

### 5. Start Development Servers

```bash
# Terminal 1 — Backend
cd backend
node server.js

# Terminal 2 — Frontend
cd frontend
npm start
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 🔌 REST API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login → returns JWT |
| GET | `/api/auth/me` | Get current user (auth required) |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List posts (filter: `category`, `search`, `author`, `page`, `limit`) |
| GET | `/api/posts/:id` | Get single post |
| POST | `/api/posts` | Create post (auth required) |
| PUT | `/api/posts/:id` | Update post (owner only) |
| DELETE | `/api/posts/:id` | Delete post + comments (owner only) |
| PUT | `/api/posts/:id/like` | Toggle like (auth required) |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/:postId/comments` | Get comments for a post |
| POST | `/api/posts/:postId/comments` | Add comment (auth required) |
| DELETE | `/api/comments/:id` | Delete comment (owner only) |
| PUT | `/api/comments/:id/like` | Toggle comment like (auth required) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | Get user profile |
| GET | `/api/users/:id/posts` | Get user's posts |
| PUT | `/api/users/profile` | Update own profile (auth required) |
| PUT | `/api/users/password` | Change password (auth required) |

### Authentication
Protected routes require `Authorization: Bearer <token>` header.

---

## ✨ Features

- **JWT Authentication** — register, login, protected routes
- **CRUD Posts** — create, read, update, delete with owner enforcement
- **Comments** — add, delete, real-time count
- **Likes** — toggle likes on posts and comments (per-user tracking)
- **Categories** — filter posts by Technology, Design, Science, Lifestyle, Culture, Business, Health
- **Full-text Search** — search by title and content
- **Pagination** — server-side pagination for the post feed
- **Markdown Support** — post content rendered with headings, blockquotes, lists, bold/italic
- **Profile Pages** — view any user's published stories and stats
- **Settings** — update name, bio, and password
- **View Counter** — tracks post views

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Axios |
| Styling | Custom CSS (CSS variables, no framework) |
| Backend | Node.js, Express 4 |
| Database | Supabase (PostgreSQL) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| Hosting | Vercel (frontend) + Render (backend) |

---

## 🌐 Deploying to Production

### Backend (Render)
1. Push to GitHub
2. Connect repo to [Render](https://render.com)
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `node server.js`
6. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=7d`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-vercel-url.vercel.app`

### Frontend (Vercel)
1. Connect repo to [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `REACT_APP_API_URL=https://your-render-url.onrender.com/api`
4. Deploy

---

## 📝 License
MIT — free to use for learning and projects.