-- Create check_ins table
CREATE TABLE IF NOT EXISTS check_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL,
    check_in_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Scheduled', 'Completed', 'Missed')),
    check_in_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create prayer_requests table
CREATE TABLE IF NOT EXISTS prayer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL,
    request TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Answered', 'Archived')),
    answer_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create relationships table
CREATE TABLE IF NOT EXISTS relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    from_contact_id UUID NOT NULL,
    to_contact_id UUID NOT NULL,
    type TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, from_contact_id, to_contact_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_contact_date ON check_ins(contact_id, check_in_date);
CREATE INDEX IF NOT EXISTS idx_check_ins_status ON check_ins(status);

CREATE INDEX IF NOT EXISTS idx_prayer_requests_user_id ON prayer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_contact ON prayer_requests(contact_id);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_status ON prayer_requests(status);

CREATE INDEX IF NOT EXISTS idx_relationships_user_id ON relationships(user_id);
CREATE INDEX IF NOT EXISTS idx_relationships_contacts ON relationships(from_contact_id, to_contact_id);

-- Enable RLS
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view own check-ins"
    ON check_ins FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check-ins"
    ON check_ins FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins"
    ON check_ins FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own check-ins"
    ON check_ins FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own prayer requests"
    ON prayer_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prayer requests"
    ON prayer_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prayer requests"
    ON prayer_requests FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prayer requests"
    ON prayer_requests FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own relationships"
    ON relationships FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own relationships"
    ON relationships FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own relationships"
    ON relationships FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own relationships"
    ON relationships FOR DELETE
    USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_check_ins_updated_at
    BEFORE UPDATE ON check_ins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prayer_requests_updated_at
    BEFORE UPDATE ON prayer_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relationships_updated_at
    BEFORE UPDATE ON relationships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();