

CREATE TABLE avatars (
  avatar_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  avatar BYTEA NOT NULL,
  mime_type TEXT NOT NULL CHECK (
    mime_type IN ('image/jpeg', 'image/png', 'image/webp')
  ),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id)
);
