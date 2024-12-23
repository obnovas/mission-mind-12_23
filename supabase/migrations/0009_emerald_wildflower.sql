/*
  # Add Check-in Type Support

  1. New Fields
    - Add check_in_type column to check_ins table
    - Add check constraint for valid types

  2. Data Migration
    - Set existing check-ins to 'suggested' by default
    - Add function to convert suggested to planned
*/

-- Add check_in_type column
ALTER TABLE check_ins 
ADD COLUMN IF NOT EXISTS check_in_type TEXT NOT NULL 
CHECK (check_in_type IN ('suggested', 'planned'))
DEFAULT 'suggested';

-- Create function to convert check-in type
CREATE OR REPLACE FUNCTION convert_check_in_type(
  p_check_in_id UUID,
  p_user_id UUID,
  p_new_type TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE check_ins
  SET 
    check_in_type = p_new_type,
    updated_at = NOW()
  WHERE 
    id = p_check_in_id
    AND user_id = p_user_id
    AND check_in_type != p_new_type;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION convert_check_in_type TO authenticated;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_check_ins_type 
ON check_ins(check_in_type);