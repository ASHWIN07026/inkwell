# ✦ Inkwell — Full-Stack Blog Platform

A production-grade blogging platform built with **React**, **Node.js/Express**, and **MongoDB**.

---

## 🗂 Project Structure

```
inkwell/
├── backend/               # Express REST API
│   ├── config/
│   │   └── seed.js        # Database seeder
│   ├── controllers/       # Route handlers
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js        # JWT middleware
│   ├── models/            # Mongoose schemas
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
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
        │   ├── comments/  CommentSection
        │   ├── layout/    Navbar
        │   ├── posts/     PostCard
        │   └── ui/        Button, Input, Avatar, CategoryBadge
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
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Install

```bash
# Install all dependencies
npm run install:all
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inkwell
JWT_SECRET=your_very_long_random_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Seed the Database (optional)

```bash
npm run seed
```

Creates sample users and posts. Demo login: `demo@inkwell.com` / `demo1234`

### 4. Start Development Servers

```bash
# Run both frontend and backend simultaneously
npm run dev
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
- **Full-text Search** — MongoDB text index on title, content, tags
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
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| Dev tools | nodemon, concurrently |

---

## 🌐 Deploying to Production

### Backend (Railway / Render / Fly.io)
1. Push to GitHub
2. Connect repo to Railway/Render
3. Set environment variables (MONGODB_URI, JWT_SECRET, NODE_ENV=production)
4. Set start command: `node server.js`

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL=https://your-backend-url.com/api`
2. Build: `npm run build`
3. Deploy `frontend/build/` folder

### MongoDB Atlas (Free tier)
1. Create free cluster at mongodb.com/atlas
2. Copy connection string to `MONGODB_URI`

---

## 📝 License
MIT — free to use for learning and projects.
