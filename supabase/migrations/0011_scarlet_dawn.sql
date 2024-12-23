-- Function to update suggested check-in dates when frequency changes
CREATE OR REPLACE FUNCTION update_suggested_checkins(
  p_contact_id UUID,
  p_user_id UUID,
  p_new_frequency TEXT,
  p_last_contact_date TIMESTAMPTZ
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_next_date TIMESTAMPTZ;
BEGIN
  -- Calculate next date based on frequency
  v_next_date := CASE p_new_frequency
    WHEN 'Daily' THEN p_last_contact_date + INTERVAL '1 day'
    WHEN 'Weekly' THEN p_last_contact_date + INTERVAL '1 week'
    WHEN 'Monthly' THEN p_last_contact_date + INTERVAL '1 month'
    WHEN 'Quarterly' THEN p_last_contact_date + INTERVAL '3 months'
    WHEN 'Yearly' THEN p_last_contact_date + INTERVAL '1 year'
    ELSE p_last_contact_date + INTERVAL '1 month'
  END;

  -- Update future suggested check-ins
  UPDATE check_ins
  SET 
    check_in_date = v_next_date + (
      CASE check_in_frequency
        WHEN 'Daily' THEN (ROW_NUMBER() OVER (ORDER BY check_in_date) - 1) * INTERVAL '1 day'
        WHEN 'Weekly' THEN (ROW_NUMBER() OVER (ORDER BY check_in_date) - 1) * INTERVAL '1 week'
        WHEN 'Monthly' THEN (ROW_NUMBER() OVER (ORDER BY check_in_date) - 1) * INTERVAL '1 month'
        WHEN 'Quarterly' THEN (ROW_NUMBER() OVER (ORDER BY check_in_date) - 1) * INTERVAL '3 months'
        WHEN 'Yearly' THEN (ROW_NUMBER() OVER (ORDER BY check_in_date) - 1) * INTERVAL '1 year'
        ELSE (ROW_NUMBER() OVER (ORDER BY check_in_date) - 1) * INTERVAL '1 month'
      END
    ),
    updated_at = NOW()
  WHERE 
    contact_id = p_contact_id
    AND user_id = p_user_id
    AND check_in_type = 'suggested'
    AND status = 'Scheduled'
    AND check_in_date > NOW();
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_suggested_checkins TO authenticated;