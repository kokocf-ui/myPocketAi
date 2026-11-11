-- myPocketAI Communication v1 — Cloudflare D1
-- Apply only after creating a private D1 database and binding it as COMM_DB.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS comm_users (
 id TEXT PRIMARY KEY,
 email_normalized TEXT NOT NULL UNIQUE,
 display_name TEXT NOT NULL,
 verified_at INTEGER NOT NULL,
 created_at INTEGER NOT NULL DEFAULT (unixepoch()),
 disabled_at INTEGER
);
CREATE TABLE IF NOT EXISTS comm_sessions (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 token_hash TEXT NOT NULL UNIQUE,
 expires_at INTEGER NOT NULL,
 revoked_at INTEGER,
 created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS comm_sessions_user ON comm_sessions(user_id);
CREATE TABLE IF NOT EXISTS comm_email_challenges (
 id TEXT PRIMARY KEY,
 email_normalized TEXT NOT NULL,
 code_hash TEXT NOT NULL,
 expires_at INTEGER NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 0,
 consumed_at INTEGER,
 created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS comm_challenges_email ON comm_email_challenges(email_normalized,created_at);
CREATE TABLE IF NOT EXISTS comm_invites (
 id TEXT PRIMARY KEY,
 inviter_id TEXT NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 invitee_id TEXT REFERENCES comm_users(id) ON DELETE CASCADE,
 token_hash TEXT NOT NULL UNIQUE,
 status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','declined','revoked','expired')),
 expires_at INTEGER NOT NULL,
 accepted_at INTEGER,
 created_at INTEGER NOT NULL DEFAULT (unixepoch()),
 CHECK(inviter_id != invitee_id)
);
CREATE INDEX IF NOT EXISTS comm_invites_inviter ON comm_invites(inviter_id,status);
CREATE INDEX IF NOT EXISTS comm_invites_invitee ON comm_invites(invitee_id,status);
CREATE TABLE IF NOT EXISTS comm_contacts (
 user_id TEXT NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 contact_id TEXT NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 created_at INTEGER NOT NULL DEFAULT (unixepoch()),
 PRIMARY KEY(user_id,contact_id),
 CHECK(user_id != contact_id)
);
CREATE TABLE IF NOT EXISTS comm_blocks (
 blocker_id TEXT NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 blocked_id TEXT NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 created_at INTEGER NOT NULL DEFAULT (unixepoch()),
 PRIMARY KEY(blocker_id,blocked_id),
 CHECK(blocker_id != blocked_id)
);
CREATE TABLE IF NOT EXISTS comm_threads (
 id TEXT PRIMARY KEY,
 kind TEXT NOT NULL CHECK(kind IN ('direct','group')),
 created_by TEXT NOT NULL REFERENCES comm_users(id),
 created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE TABLE IF NOT EXISTS comm_thread_members (
 thread_id TEXT NOT NULL REFERENCES comm_threads(id) ON DELETE CASCADE,
 user_id TEXT NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 role TEXT NOT NULL CHECK(role IN ('owner','member')),
 joined_at INTEGER NOT NULL DEFAULT (unixepoch()),
 removed_at INTEGER,
 PRIMARY KEY(thread_id,user_id)
);
CREATE TABLE IF NOT EXISTS comm_messages (
 id TEXT PRIMARY KEY,
 thread_id TEXT NOT NULL REFERENCES comm_threads(id) ON DELETE CASCADE,
 sender_id TEXT NOT NULL REFERENCES comm_users(id),
 ciphertext TEXT NOT NULL,
 nonce TEXT NOT NULL,
 client_message_id TEXT NOT NULL,
 created_at INTEGER NOT NULL DEFAULT (unixepoch()),
 deleted_at INTEGER,
 UNIQUE(sender_id,client_message_id)
);
CREATE INDEX IF NOT EXISTS comm_messages_thread ON comm_messages(thread_id,created_at);
CREATE TABLE IF NOT EXISTS comm_shared_lists (
 id TEXT PRIMARY KEY,
 owner_id TEXT NOT NULL REFERENCES comm_users(id),
 title TEXT NOT NULL,
 revision INTEGER NOT NULL DEFAULT 0,
 created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE TABLE IF NOT EXISTS comm_list_members (
 list_id TEXT NOT NULL REFERENCES comm_shared_lists(id) ON DELETE CASCADE,
 user_id TEXT NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 role TEXT NOT NULL CHECK(role IN ('owner','editor','viewer')),
 PRIMARY KEY(list_id,user_id)
);
CREATE TABLE IF NOT EXISTS comm_list_operations (
 id TEXT PRIMARY KEY,
 list_id TEXT NOT NULL REFERENCES comm_shared_lists(id) ON DELETE CASCADE,
 actor_id TEXT NOT NULL REFERENCES comm_users(id),
 item_id TEXT NOT NULL,
 operation TEXT NOT NULL CHECK(operation IN ('add','change_quantity','check','uncheck','remove')),
 payload TEXT NOT NULL,
 revision INTEGER NOT NULL,
 created_at INTEGER NOT NULL DEFAULT (unixepoch()),
 UNIQUE(list_id,revision)
);
CREATE INDEX IF NOT EXISTS comm_list_ops_list ON comm_list_operations(list_id,revision);
