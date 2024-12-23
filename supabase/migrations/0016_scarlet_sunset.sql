-- Drop existing policy if it exists
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view own rate limits" ON api_rate_limits;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- Add RLS policies
CREATE POLICY "Users can view own rate limits"
    ON api_rate_limits FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM api_keys
        WHERE api_keys.id = api_rate_limits.api_key_id
        AND api_keys.user_id = auth.uid()
    ));

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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS cleanup_old_rate_limits ON api_rate_limits;

-- Create trigger that runs on insert
CREATE TRIGGER cleanup_old_rate_limits
    AFTER INSERT ON api_rate_limits
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_cleanup_rate_limits();