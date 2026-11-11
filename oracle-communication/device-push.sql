
-- Additive migration. Apply to existing DB with psql -v ON_ERROR_STOP=1 -f device-push.sql.
-- Device token belongs only to the cryptographically authenticated device identity.
CREATE TABLE IF NOT EXISTS device_push_tokens(
  token text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES device_users(id) ON DELETE CASCADE,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (length(token) BETWEEN 24 AND 4096)
);
CREATE INDEX IF NOT EXISTS device_push_tokens_user ON device_push_tokens(user_id, updated_at DESC);
