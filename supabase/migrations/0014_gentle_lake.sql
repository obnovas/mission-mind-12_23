/*
  # Add API Keys Support

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `key` (text, unique)
      - `created_at` (timestamptz)
      - `last_used_at` (timestamptz)
      - `revoked_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for user access
    - Add unique constraint on active keys per user

  3. Indexes
    - Index on user_id for lookups
    - Index on key for validation
*/

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ
);

-- Create unique index for active keys
CREATE UNIQUE INDEX idx_active_api_keys ON api_keys (user_id, key) 
WHERE revoked_at IS NULL;

-- Add additional indexes
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key ON api_keys(key) 
WHERE revoked_at IS NULL;

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view own API keys"
    ON api_keys FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own API keys"
    ON api_keys FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys"
    ON api_keys FOR UPDATE
    USING (auth.uid() = user_id);

-- Create function to validate API key
CREATE OR REPLACE FUNCTION validate_api_key(p_key TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT user_id INTO v_user_id
    FROM api_keys
    WHERE key = p_key
    AND revoked_at IS NULL;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Invalid API key';
    END IF;

    -- Update last used timestamp
    UPDATE api_keys
    SET last_used_at = NOW()
    WHERE key = p_key;

    RETURN v_user_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION validate_api_key TO authenticated;