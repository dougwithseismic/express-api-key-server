-- Create api_keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create licenses table
CREATE TABLE licenses (
    id UUID PRIMARY KEY,
    api_key_id UUID NOT NULL REFERENCES api_keys(id),
    product_id TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create indexes for better query performance
CREATE INDEX idx_api_keys_key ON api_keys(key);

CREATE INDEX idx_licenses_api_key_id ON licenses(api_key_id);