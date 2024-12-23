-- Drop existing constraint if it exists
ALTER TABLE contacts 
  DROP CONSTRAINT IF EXISTS check_in_frequency_check;

-- Add new constraint with correct values
ALTER TABLE contacts 
  ADD CONSTRAINT check_in_frequency_check 
  CHECK (check_in_frequency IN ('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'));

-- Update any invalid values to 'Monthly'
UPDATE contacts 
SET check_in_frequency = 'Monthly' 
WHERE check_in_frequency NOT IN ('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly');

-- Create type for check-in frequency
CREATE TYPE check_in_frequency_type AS ENUM (
  'Daily', 
  'Weekly', 
  'Monthly', 
  'Quarterly', 
  'Yearly'
);

-- Add validation function
CREATE OR REPLACE FUNCTION validate_check_in_frequency()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.check_in_frequency IS NULL THEN
    NEW.check_in_frequency := 'Monthly';
  END IF;

  IF NEW.check_in_frequency NOT IN ('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly') THEN
    RAISE EXCEPTION 'Invalid check-in frequency. Must be one of: Daily, Weekly, Monthly, Quarterly, Yearly';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_check_in_frequency_trigger ON contacts;
CREATE TRIGGER validate_check_in_frequency_trigger
  BEFORE INSERT OR UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION validate_check_in_frequency();