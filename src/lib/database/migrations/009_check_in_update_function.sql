-- Create the function with correct parameter order and types
CREATE OR REPLACE FUNCTION update_past_scheduled_checkins(
  p_user_id UUID,
  p_current_time TIMESTAMPTZ
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update all past scheduled check-ins in a single transaction
  UPDATE check_ins
  SET 
    status = 'Missed'::text,
    updated_at = p_current_time
  WHERE 
    user_id = p_user_id
    AND status = 'Scheduled'
    AND check_in_date < p_current_time;

  -- Return success
  RETURN;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't expose details
    RAISE WARNING 'Error updating check-ins: %', SQLERRM;
    RETURN;
END;
$$;

-- Add performance optimizations
CREATE INDEX IF NOT EXISTS idx_check_ins_status_date
ON check_ins(status, check_in_date)
WHERE status = 'Scheduled';

CREATE INDEX IF NOT EXISTS idx_user_scheduled_checkins
ON check_ins(user_id, check_in_date)
WHERE status = 'Scheduled';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_past_scheduled_checkins(UUID, TIMESTAMPTZ) TO authenticated;

-- Analyze tables for better query planning
ANALYZE check_ins;