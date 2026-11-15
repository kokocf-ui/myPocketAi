-- Additive migration for end-to-end encrypted message delivery/read receipts.
-- Run once on the existing Oracle PostgreSQL database with ON_ERROR_STOP=1.
-- It never changes or decrypts message contents and does not touch push tokens.
ALTER TABLE device_messages ADD COLUMN IF NOT EXISTS delivered_at timestamptz;
ALTER TABLE device_messages ADD COLUMN IF NOT EXISTS read_at timestamptz;
ALTER TABLE device_messages ADD COLUMN IF NOT EXISTS played_at timestamptz;
CREATE INDEX IF NOT EXISTS device_messages_pending_delivery
  ON device_messages(recipient_id,created_ms)
  WHERE delivered_at IS NULL;
