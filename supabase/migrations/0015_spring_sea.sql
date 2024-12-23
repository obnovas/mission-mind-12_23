-- Add API rate limiting table
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    request_count INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT unique_api_key_window UNIQUE (api_key_id, window_start)
);

-- Add indexes for rate limiting
CREATE INDEX IF NOT EXISTS idx_rate_limits_api_key ON api_rate_limits(api_key_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON api_rate_limits(window_start);

-- Enable RLS
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view own rate limits"
    ON api_rate_limits FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM api_keys
        WHERE api_keys.id = api_rate_limits.api_key_id
        AND api_keys.user_id = auth.uid()
    ));

-- Function to check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(p_api_key TEXT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_api_key_id UUID;
    v_count INTEGER;
    v_window_start TIMESTAMPTZ;
BEGIN
    -- Get API key ID
    SELECT id INTO v_api_key_id
    FROM api_keys
    WHERE key = p_api_key
    AND revoked_at IS NULL;

    IF v_api_key_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Set window start to current hour
    v_window_start := date_trunc('hour', NOW());

    -- Get or create rate limit record
    INSERT INTO api_rate_limits (api_key_id, window_start, request_count)
    VALUES (v_api_key_id, v_window_start, 1)
    ON CONFLICT (api_key_id, window_start)
    DO UPDATE SET request_count = api_rate_limits.request_count + 1
    RETURNING request_count INTO v_count;

    -- Check if under limit (1000 requests per hour)
    RETURN v_count <= 1000;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION check_rate_limit TO authenticated;

-- Add function to cleanup old rate limit records
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete records older than 24 hours
    DELETE FROM api_rate_limits
    WHERE window_start < NOW() - INTERVAL '24 hours';
END;
$$;

-- Create trigger to cleanup old records periodically
CREATE OR REPLACE FUNCTION trigger_cleanup_rate_limits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Run cleanup if more than 1 hour has passed since last cleanup
    IF (SELECT COUNT(*) FROM api_rate_limits WHERE window_start < NOW() - INTERVAL '24 hours') > 0 THEN
        PERFORM cleanup_rate_limits();
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger that runs on insert
CREATE TRIGGER cleanup_old_rate_limits
    AFTER INSERT ON api_rate_limits
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_cleanup_rate_limits();