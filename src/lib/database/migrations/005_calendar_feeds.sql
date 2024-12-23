-- Add calendar feed tokens table
CREATE TABLE IF NOT EXISTS calendar_feed_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_accessed TIMESTAMPTZ,
    CONSTRAINT unique_user_token UNIQUE (user_id, token)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_calendar_feed_tokens_user ON calendar_feed_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_feed_tokens_token ON calendar_feed_tokens(token);

-- Add RLS policies
ALTER TABLE calendar_feed_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feed tokens"
    ON calendar_feed_tokens FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own feed tokens"
    ON calendar_feed_tokens FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own feed tokens"
    ON calendar_feed_tokens FOR DELETE
    USING (auth.uid() = user_id);