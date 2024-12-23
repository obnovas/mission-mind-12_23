-- Create function to update past scheduled check-ins
CREATE OR REPLACE FUNCTION update_past_scheduled_checkins(
    p_user_id UUID,
    p_current_time TIMESTAMPTZ
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE check_ins
    SET 
        status = 'Missed',
        updated_at = p_current_time
    WHERE 
        user_id = p_user_id
        AND status = 'Scheduled'
        AND check_in_date < p_current_time;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_past_scheduled_checkins TO authenticated;

-- Create function to cleanup old data
CREATE OR REPLACE FUNCTION cleanup_old_data(
    p_user_id UUID,
    p_days_old INTEGER DEFAULT 180
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Archive old check-ins
    UPDATE check_ins
    SET status = 'Archived'
    WHERE user_id = p_user_id
    AND check_in_date < NOW() - (p_days_old || ' days')::INTERVAL;

    -- Archive old prayer requests
    UPDATE prayer_requests
    SET status = 'Archived'
    WHERE user_id = p_user_id
    AND updated_at < NOW() - (p_days_old || ' days')::INTERVAL
    AND status = 'Active';
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION cleanup_old_data TO authenticated;