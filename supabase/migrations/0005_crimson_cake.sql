/*
  # Add Network Groups Support

  1. New Tables
    - network_groups (group information)
    - network_group_members (group membership)

  2. Indexes
    - Add B-tree indexes for performance
    - Add trigram indexes for text search
    
  3. Security
    - Enable RLS
    - Add policies for user data isolation
*/

-- Create network_groups table
CREATE TABLE IF NOT EXISTS network_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create network_group_members table
CREATE TABLE IF NOT EXISTS network_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES network_groups(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(group_id, contact_id)
);

-- Add B-tree indexes
CREATE INDEX IF NOT EXISTS idx_network_groups_user_id 
ON network_groups(user_id);

CREATE INDEX IF NOT EXISTS idx_network_group_members_user_id 
ON network_group_members(user_id);

CREATE INDEX IF NOT EXISTS idx_network_group_members_group 
ON network_group_members(group_id);

CREATE INDEX IF NOT EXISTS idx_network_group_members_contact 
ON network_group_members(contact_id);

-- Add trigram index for text search
CREATE INDEX IF NOT EXISTS idx_network_groups_name_trgm 
ON network_groups USING gist (name gist_trgm_ops);

-- Enable RLS
ALTER TABLE network_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_group_members ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for network_groups
CREATE POLICY "Users can view own network groups"
    ON network_groups FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own network groups"
    ON network_groups FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own network groups"
    ON network_groups FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own network groups"
    ON network_groups FOR DELETE
    USING (auth.uid() = user_id);

-- Add RLS policies for network_group_members
CREATE POLICY "Users can view own network group members"
    ON network_group_members FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own network group members"
    ON network_group_members FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own network group members"
    ON network_group_members FOR DELETE
    USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_network_groups_updated_at
    BEFORE UPDATE ON network_groups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();