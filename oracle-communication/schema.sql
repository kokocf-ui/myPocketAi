-- PostgreSQL schema for Oracle-hosted private communication.
-- No Cloudflare D1, no chat history from Eva and no third-party contact import.
CREATE TABLE IF NOT EXISTS comm_users(
 id uuid PRIMARY KEY, email text NOT NULL UNIQUE, display_name text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), disabled_at timestamptz
);
CREATE TABLE IF NOT EXISTS comm_otp(
 id uuid PRIMARY KEY, email text NOT NULL, code_hash text NOT NULL,
 expires_at timestamptz NOT NULL, attempts integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now(), consumed_at timestamptz
);
CREATE INDEX IF NOT EXISTS comm_otp_email_date ON comm_otp(email, created_at DESC);
CREATE TABLE IF NOT EXISTS comm_sessions(
 token_hash text PRIMARY KEY, user_id uuid NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), revoked_at timestamptz
);
CREATE INDEX IF NOT EXISTS comm_sessions_user ON comm_sessions(user_id);
CREATE TABLE IF NOT EXISTS comm_invites(
 id uuid PRIMARY KEY, token_hash text NOT NULL UNIQUE,
 inviter_id uuid NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 accepted_by uuid REFERENCES comm_users(id), status text NOT NULL DEFAULT 'pending'
 CHECK(status IN('pending','accepted','declined','revoked')),
 created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS comm_invites_inviter ON comm_invites(inviter_id);
CREATE TABLE IF NOT EXISTS comm_contacts(
 user_id uuid NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 contact_id uuid NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,contact_id),
 CONSTRAINT no_self_contact CHECK(user_id<>contact_id)
);
CREATE TABLE IF NOT EXISTS comm_blocks(
 user_id uuid NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 blocked_id uuid NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,blocked_id),
 CONSTRAINT no_self_block CHECK(user_id<>blocked_id)
);
CREATE TABLE IF NOT EXISTS comm_threads(
 id uuid PRIMARY KEY, created_by uuid NOT NULL REFERENCES comm_users(id),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS comm_thread_members(
 thread_id uuid NOT NULL REFERENCES comm_threads(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 PRIMARY KEY(thread_id,user_id)
);
CREATE TABLE IF NOT EXISTS comm_messages(
 id uuid PRIMARY KEY, thread_id uuid NOT NULL REFERENCES comm_threads(id) ON DELETE CASCADE,
 sender_id uuid NOT NULL REFERENCES comm_users(id),
 ciphertext text NOT NULL, nonce text NOT NULL, client_id text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(sender_id,client_id)
);
CREATE INDEX IF NOT EXISTS comm_messages_thread_date ON comm_messages(thread_id,created_at);
CREATE TABLE IF NOT EXISTS comm_lists(
 id uuid PRIMARY KEY, title text NOT NULL, owner_id uuid NOT NULL REFERENCES comm_users(id),
 revision integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS comm_list_members(
 list_id uuid NOT NULL REFERENCES comm_lists(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES comm_users(id) ON DELETE CASCADE,
 role text NOT NULL CHECK(role IN('owner','editor','viewer')),
 PRIMARY KEY(list_id,user_id)
);
CREATE TABLE IF NOT EXISTS comm_list_ops(
 id uuid PRIMARY KEY, list_id uuid NOT NULL REFERENCES comm_lists(id) ON DELETE CASCADE,
 actor_id uuid NOT NULL REFERENCES comm_users(id),
 client_id text NOT NULL,
 revision integer NOT NULL, kind text NOT NULL
 CHECK(kind IN('add','change_quantity','check','uncheck','remove')),
 item_id text NOT NULL, detail jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(list_id,revision), UNIQUE(list_id,actor_id,client_id)
);
CREATE INDEX IF NOT EXISTS comm_list_ops_rev ON comm_list_ops(list_id,revision);

-- One non-exportable ECDH device key per verified beta user. Public JWK only.
CREATE TABLE IF NOT EXISTS comm_device_keys(
 user_id uuid PRIMARY KEY REFERENCES comm_users(id) ON DELETE CASCADE,
 exchange_public jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
-- Direct threads are singletons for each unordered pair of verified contacts.
CREATE TABLE IF NOT EXISTS comm_direct_threads(
 pair_key text PRIMARY KEY,
 thread_id uuid NOT NULL UNIQUE REFERENCES comm_threads(id) ON DELETE CASCADE
);
