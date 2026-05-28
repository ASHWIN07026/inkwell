-- ============================================================
-- Inkwell Blog Platform - Supabase SQL Schema
-- Run this entire file in Supabase → SQL Editor → Run
-- ============================================================

-- USERS table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  bio         TEXT DEFAULT '',
  avatar      TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- POSTS table
CREATE TABLE IF NOT EXISTS public.posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL CHECK (char_length(title) >= 5 AND char_length(title) <= 150),
  content      TEXT NOT NULL CHECK (char_length(content) >= 20),
  excerpt      TEXT,
  category     TEXT NOT NULL DEFAULT 'Technology'
                 CHECK (category IN ('Technology','Design','Science','Lifestyle','Culture','Business','Health')),
  tags         TEXT[] DEFAULT '{}',
  author_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  views        INTEGER DEFAULT 0,
  published    BOOLEAN DEFAULT TRUE,
  cover_image  TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- LIKES table (post likes)
CREATE TABLE IF NOT EXISTS public.post_likes (
  post_id   UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- COMMENTS table
CREATE TABLE IF NOT EXISTS public.comments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content         TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 1000),
  post_id         UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_comment  UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- COMMENT LIKES table
CREATE TABLE IF NOT EXISTS public.comment_likes (
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (comment_id, user_id)
);

-- AUTO-UPDATE updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON public.post_likes(post_id);

-- DISABLE Row Level Security (using our own JWT auth)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- SAMPLE DATA (optional - run after schema)
-- ============================================================
/*
INSERT INTO public.users (id, name, email, password, bio) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Sarah Chen', 'sarah@inkwell.com',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HSAzVle', 'Full-stack developer'),
  ('22222222-2222-2222-2222-222222222222', 'Demo User', 'demo@inkwell.com',
   '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Just exploring!');
-- passwords above: sarah=password123, demo=demo1234 (pre-hashed)
*/
