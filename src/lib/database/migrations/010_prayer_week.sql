-- Add prayer week field to contacts table
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS prayer_week INTEGER CHECK (prayer_week BETWEEN 1 AND 52);

-- Create function to assign prayer week
CREATE OR REPLACE FUNCTION assign_prayer_week()
RETURNS TRIGGER AS $$
DECLARE
  next_week INTEGER;
BEGIN
  -- Find the least used prayer week for this user
  SELECT COALESCE(
    (
      SELECT prayer_week 
      FROM (
        SELECT prayer_week, COUNT(*) as count
        FROM contacts 
        WHERE user_id = NEW.user_id 
          AND prayer_week IS NOT NULL
        GROUP BY prayer_week
        ORDER BY count ASC, prayer_week ASC
        LIMIT 1
      ) subq
    ),
    1  -- Default to week 1 if no assignments exist
  ) INTO next_week;

  -- Assign the week
  NEW.prayer_week := next_week;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new contacts
DROP TRIGGER IF EXISTS assign_prayer_week_trigger ON contacts;
CREATE TRIGGER assign_prayer_week_trigger
  BEFORE INSERT ON contacts
  FOR EACH ROW
  WHEN (NEW.prayer_week IS NULL)
  EXECUTE FUNCTION assign_prayer_week();

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_contacts_prayer_week
ON contacts(user_id, prayer_week);