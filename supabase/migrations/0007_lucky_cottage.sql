/*
  # Add Welcome Notes Table

  1. Creates welcome_notes table for storing biblical and inspirational quotes
  2. Adds RLS policies
  3. Inserts initial welcome note data
*/

-- Create welcome_notes table
CREATE TABLE IF NOT EXISTS welcome_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('biblical', 'inspirational')),
    author TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_welcome_notes_category 
ON welcome_notes(category);

-- Enable RLS
ALTER TABLE welcome_notes ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for reading welcome notes
CREATE POLICY "Welcome notes are viewable by all users"
    ON welcome_notes FOR SELECT
    USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_welcome_notes_updated_at
    BEFORE UPDATE ON welcome_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial biblical quotes
INSERT INTO welcome_notes (content, category, author) VALUES
('Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.', 'biblical', 'Joshua 1:9'),
('I can do all things through Christ who strengthens me.', 'biblical', 'Philippians 4:13'),
('Trust in the Lord with all your heart and lean not on your own understanding.', 'biblical', 'Proverbs 3:5'),
('The Lord is my shepherd, I lack nothing.', 'biblical', 'Psalm 23:1'),
('For I know the plans I have for you, plans to prosper you and not to harm you, plans to give you hope and a future.', 'biblical', 'Jeremiah 29:11');

-- Insert initial inspirational quotes
INSERT INTO welcome_notes (content, category, author) VALUES
('The best way to predict the future is to create it.', 'inspirational', 'Peter Drucker'),
('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'inspirational', 'Winston Churchill'),
('The only way to do great work is to love what you do.', 'inspirational', 'Steve Jobs'),
('Change your thoughts and you change your world.', 'inspirational', 'Norman Vincent Peale'),
('What you get by achieving your goals is not as important as what you become by achieving your goals.', 'inspirational', 'Zig Ziglar');