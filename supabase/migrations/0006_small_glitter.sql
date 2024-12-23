/*
  # Fix Schema Issues

  1. Add missing columns and constraints
  2. Fix foreign key relationships
  3. Update indexes
  4. Add cleanup functions
*/

-- Add missing columns to contacts if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE contacts ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure check_in_frequency has valid values
ALTER TABLE contacts 
  DROP CONSTRAINT IF EXISTS check_in_frequency_check,
  ADD CONSTRAINT check_in_frequency_check 
  CHECK (check_in_frequency IN ('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'));

-- Ensure contact type has valid values
ALTER TABLE contacts 
  DROP CONSTRAINT IF EXISTS contact_type_check,
  ADD CONSTRAINT contact_type_check 
  CHECK (type IN ('Individual', 'Organization', 'Business'));

-- Create function to cleanup orphaned records
CREATE OR REPLACE FUNCTION cleanup_orphaned_records()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete orphaned check-ins
  DELETE FROM check_ins
  WHERE contact_id NOT IN (SELECT id FROM contacts);
  
  -- Delete orphaned prayer requests
  DELETE FROM prayer_requests
  WHERE contact_id NOT IN (SELECT id FROM contacts);
  
  -- Delete orphaned relationships
  DELETE FROM relationships
  WHERE from_contact_id NOT IN (SELECT id FROM contacts)
  OR to_contact_id NOT IN (SELECT id FROM contacts);
  
  -- Delete orphaned contact journeys
  DELETE FROM contact_journeys
  WHERE contact_id NOT IN (SELECT id FROM contacts)
  OR journey_id NOT IN (SELECT id FROM journeys);
  
  -- Delete orphaned favorites
  DELETE FROM favorites
  WHERE contact_id NOT IN (SELECT id FROM contacts);
  
  -- Delete orphaned network group members
  DELETE FROM network_group_members
  WHERE contact_id NOT IN (SELECT id FROM contacts)
  OR group_id NOT IN (SELECT id FROM network_groups);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION cleanup_orphaned_records TO authenticated;

-- Create function to validate contact data
CREATE OR REPLACE FUNCTION validate_contact()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure email is lowercase
  IF NEW.email IS NOT NULL THEN
    NEW.email := LOWER(NEW.email);
  END IF;
  
  -- Ensure name is not empty
  IF TRIM(NEW.name) = '' THEN
    RAISE EXCEPTION 'Contact name cannot be empty';
  END IF;
  
  -- Set default check-in frequency if not provided
  IF NEW.check_in_frequency IS NULL THEN
    NEW.check_in_frequency := 'Monthly';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for contact validation
DROP TRIGGER IF EXISTS validate_contact_trigger ON contacts;
CREATE TRIGGER validate_contact_trigger
  BEFORE INSERT OR UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION validate_contact();

-- Refresh existing indexes
REINDEX TABLE contacts;
REINDEX TABLE check_ins;
REINDEX TABLE prayer_requests;
REINDEX TABLE relationships;
REINDEX TABLE journeys;
REINDEX TABLE contact_journeys;
REINDEX TABLE favorites;
REINDEX TABLE network_groups;
REINDEX TABLE network_group_members;