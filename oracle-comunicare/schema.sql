-- Private Oracle PostgreSQL schema. No e-mail, phone, GPS or Eva history.
CREATE TABLE IF NOT EXISTS users(
 id UUID PRIMARY KEY, display_name VARCHAR(45) NOT NULL,
 sign_public JSONB NOT NULL, exchange_public JSONB NOT NULL,
 created_ms BIGINT NOT NULL, disabled BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS invitations(
 token_hash CHAR(64) PRIMARY KEY, inviter UUID NOT NULL REFERENCES users(id),
 expires_ms BIGINT NOT NULL, used_by UUID REFERENCES users(id),
 created_ms BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS invitations_owner ON invitations(inviter,created_ms);
CREATE TABLE IF NOT EXISTS contacts(
 a UUID NOT NULL REFERENCES users(id), b UUID NOT NULL REFERENCES users(id),
 created_ms BIGINT NOT NULL, PRIMARY KEY(a,b),
 CONSTRAINT pair_order CHECK(a<b)
);
CREATE TABLE IF NOT EXISTS blocks(
 a UUID NOT NULL REFERENCES users(id), b UUID NOT NULL REFERENCES users(id),
 created_ms BIGINT NOT NULL, PRIMARY KEY(a,b),
 CONSTRAINT distinct_block CHECK(a<>b)
);
CREATE TABLE IF NOT EXISTS messages(
 id UUID PRIMARY KEY, sender UUID NOT NULL REFERENCES users(id),
 recipient UUID NOT NULL REFERENCES users(id), iv VARCHAR(32) NOT NULL,
 cipher TEXT NOT NULL, kind VARCHAR(16) NOT NULL DEFAULT 'text',
 attachment_id UUID, created_ms BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS messages_recipients ON messages(sender,recipient,created_ms);
CREATE TABLE IF NOT EXISTS request_nonces(
 uid UUID NOT NULL REFERENCES users(id), nonce VARCHAR(100) NOT NULL,
 created_ms BIGINT NOT NULL, PRIMARY KEY(uid,nonce)
);
CREATE INDEX IF NOT EXISTS nonces_date ON request_nonces(created_ms);
CREATE TABLE IF NOT EXISTS shared_lists(
 id UUID PRIMARY KEY, owner UUID NOT NULL REFERENCES users(id),
 title VARCHAR(120) NOT NULL, revision INTEGER NOT NULL DEFAULT 0, created_ms BIGINT NOT NULL
);
CREATE TABLE IF NOT EXISTS list_members(
 list_id UUID NOT NULL REFERENCES shared_lists(id) ON DELETE CASCADE,
 user_id UUID NOT NULL REFERENCES users(id), role VARCHAR(10) NOT NULL
 CHECK(role IN ('owner','editor','viewer')), PRIMARY KEY(list_id,user_id)
);
CREATE TABLE IF NOT EXISTS list_ops(
 op_id UUID PRIMARY KEY, list_id UUID NOT NULL REFERENCES shared_lists(id) ON DELETE CASCADE,
 actor UUID NOT NULL REFERENCES users(id), item_id UUID NOT NULL, kind VARCHAR(20) NOT NULL
 CHECK(kind IN('add','change_quantity','check','uncheck','remove')),
 detail JSONB NOT NULL, revision INTEGER NOT NULL, created_ms BIGINT NOT NULL,
 UNIQUE(list_id,revision), UNIQUE(list_id,actor,op_id)
);
CREATE INDEX IF NOT EXISTS list_ops_revision ON list_ops(list_id,revision);
CREATE TABLE IF NOT EXISTS attachments(
 id UUID PRIMARY KEY, sender UUID NOT NULL REFERENCES users(id),
 recipient UUID NOT NULL REFERENCES users(id), encrypted BYTEA NOT NULL,
 iv VARCHAR(32) NOT NULL, encrypted_name TEXT NOT NULL,
 media_kind VARCHAR(8) NOT NULL CHECK(media_kind IN ('image','video','audio','file')),
 mime_type VARCHAR(80) NOT NULL,
 size_bytes INTEGER NOT NULL CHECK(size_bytes>0 AND size_bytes<=12582912),
 created_ms BIGINT NOT NULL, expires_ms BIGINT NOT NULL
);
CREATE INDEX IF NOT EXISTS attachments_owner ON attachments(sender,recipient);
