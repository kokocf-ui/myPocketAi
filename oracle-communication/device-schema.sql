-- Device-only identities: no mandatory email or telephone number.
-- Apply this migration manually to the existing private Oracle PostgreSQL database.
CREATE TABLE IF NOT EXISTS device_users(
 id uuid PRIMARY KEY,
 display_name text NOT NULL,
 key_hash text NOT NULL UNIQUE,
 sign_public jsonb NOT NULL,
 exchange_public jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 disabled_at timestamptz
);
CREATE TABLE IF NOT EXISTS device_nonces(
 user_id uuid NOT NULL REFERENCES device_users(id) ON DELETE CASCADE,
 nonce text NOT NULL,
 expires_at timestamptz NOT NULL,
 PRIMARY KEY(user_id,nonce)
);
CREATE TABLE IF NOT EXISTS device_invites(
 code_hash text PRIMARY KEY,
 inviter_id uuid NOT NULL REFERENCES device_users(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL,
 accepted_by uuid REFERENCES device_users(id),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS device_contacts(
 user_id uuid NOT NULL REFERENCES device_users(id) ON DELETE CASCADE,
 friend_id uuid NOT NULL REFERENCES device_users(id) ON DELETE CASCADE,
 PRIMARY KEY(user_id,friend_id),
 CHECK(user_id<>friend_id)
);
CREATE TABLE IF NOT EXISTS device_blocks(
 user_id uuid NOT NULL REFERENCES device_users(id) ON DELETE CASCADE,
 friend_id uuid NOT NULL REFERENCES device_users(id) ON DELETE CASCADE,
 PRIMARY KEY(user_id,friend_id),
 CHECK(user_id<>friend_id)
);
CREATE TABLE IF NOT EXISTS device_attachments(
 id uuid PRIMARY KEY,
 iv text NOT NULL,
 cipher text NOT NULL,
 kind text NOT NULL,
 mime text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS device_messages(
 id uuid PRIMARY KEY,
 pair_key text NOT NULL,
 sender_id uuid NOT NULL REFERENCES device_users(id),
 recipient_id uuid NOT NULL REFERENCES device_users(id),
 client_id uuid NOT NULL,
 iv text NOT NULL,
 cipher text NOT NULL,
 kind text NOT NULL CHECK(kind IN('text','media')),
 attachment_id uuid REFERENCES device_attachments(id),
 created_ms bigint NOT NULL,
 UNIQUE(sender_id,client_id)
);
CREATE INDEX IF NOT EXISTS device_messages_pair ON device_messages(pair_key,created_ms DESC);
CREATE TABLE IF NOT EXISTS device_lists(
 id uuid PRIMARY KEY,
 owner_id uuid NOT NULL REFERENCES device_users(id),
 title text NOT NULL,
 revision integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS device_list_members(
 list_id uuid NOT NULL REFERENCES device_lists(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES device_users(id) ON DELETE CASCADE,
 role text NOT NULL CHECK(role IN('owner','editor','viewer')),
 PRIMARY KEY(list_id,user_id)
);
CREATE TABLE IF NOT EXISTS device_list_ops(
 id uuid PRIMARY KEY,
 list_id uuid NOT NULL REFERENCES device_lists(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES device_users(id),
 op_id uuid NOT NULL,
 item_id uuid NOT NULL,
 kind text NOT NULL CHECK(kind IN('add','change_quantity','check','uncheck','remove')),
 detail jsonb NOT NULL DEFAULT '{}'::jsonb,
 revision integer NOT NULL,
 UNIQUE(list_id,user_id,op_id),
 UNIQUE(list_id,revision)
);
