/*
  # Add Core Tables and Relationships

  1. New Tables
    - contacts (core contact information)
    - journeys (journey templates)
    - contact_journeys (contact journey progress)
    - favorites (favorite contacts)

  2. Foreign Keys
    - Add relationships between tables
    
  3. Indexes
    - Add B-tree and trigram indexes for performance
    
  4. Security
    - Enable RLS on all tables
    - Add policies for user data isolation
*/

-- Create extension for text search if not exists
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    email CITEXT,
    phone TEXT,
    address TEXT,
    notes TEXT,
    check_in_frequency TEXT NOT NULL,
    last_contact_date TIMESTAMPTZ,
    next_contact_date TIMESTAMPTZ,
    prayer_week INTEGER CHECK (prayer_week BETWEEN 1 AND 52),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create journeys table
CREATE TABLE IF NOT EXISTS journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    stages TEXT[] NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create contact_journeys table
CREATE TABLE IF NOT EXISTS contact_journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    stage TEXT NOT NULL,
    notes TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(contact_id, journey_id)
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, contact_id)
);

-- Add foreign key constraints
ALTER TABLE check_ins
ADD CONSTRAINT fk_check_ins_contact
FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;

ALTER TABLE prayer_requests
ADD CONSTRAINT fk_prayer_requests_contact
FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE;

ALTER TABLE relationships
ADD CONSTRAINT fk_relationships_from_contact
FOREIGN KEY (from_contact_id) REFERENCES contacts(id) ON DELETE CASCADE;

ALTER TABLE relationships
ADD CONSTRAINT fk_relationships_to_contact
FOREIGN KEY (to_contact_id) REFERENCES contacts(id) ON DELETE CASCADE;

-- Add B-tree indexes for foreign keys and common queries
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_next_contact ON contacts(next_contact_date);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(type);
CREATE INDEX IF NOT EXISTS idx_contacts_check_in_frequency ON contacts(check_in_frequency);

CREATE INDEX IF NOT EXISTS idx_journeys_user_id ON journeys(user_id);

CREATE INDEX IF NOT EXISTS idx_contact_journeys_user_id ON contact_journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_journeys_contact ON contact_journeys(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_journeys_journey ON contact_journeys(journey_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_contact ON favorites(contact_id);

-- Add trigram indexes for text search
CREATE INDEX IF NOT EXISTS idx_contacts_name_trgm ON contacts USING gist (name gist_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_contacts_email_trgm ON contacts USING gist (email gist_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_journeys_name_trgm ON journeys USING gist (name gist_trgm_ops);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for contacts
CREATE POLICY "Users can view own contacts"
    ON contacts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contacts"
    ON contacts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts"
    ON contacts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
    ON contacts FOR DELETE
    USING (auth.uid() = user_id);

-- Add RLS policies for journeys
CREATE POLICY "Users can view own journeys"
    ON journeys FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journeys"
    ON journeys FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journeys"
    ON journeys FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journeys"
    ON journeys FOR DELETE
    USING (auth.uid() = user_id);

-- Add RLS policies for contact_journeys
CREATE POLICY "Users can view own contact journeys"
    ON contact_journeys FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contact journeys"
    ON contact_journeys FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contact journeys"
    ON contact_journeys FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contact journeys"
    ON contact_journeys FOR DELETE
    USING (auth.uid() = user_id);

-- Add RLS policies for favorites
CREATE POLICY "Users can view own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
    ON favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
    ON favorites FOR DELETE
    USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journeys_updated_at
    BEFORE UPDATE ON journeys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_journeys_updated_at
    BEFORE UPDATE ON contact_journeys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();