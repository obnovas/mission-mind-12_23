-- Add partitioning for large tables
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY HASH (user_id);

-- Create partitions for contacts
CREATE TABLE contacts_0 PARTITION OF contacts FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE contacts_1 PARTITION OF contacts FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE contacts_2 PARTITION OF contacts FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE contacts_3 PARTITION OF contacts FOR VALUES WITH (MODULUS 4, REMAINDER 3);

-- Add check-ins table with partitioning
CREATE TABLE IF NOT EXISTS check_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    check_in_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL,
    check_in_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (check_in_date);

-- Create partitions for check_ins by date range
CREATE TABLE check_ins_current PARTITION OF check_ins
    FOR VALUES FROM ('2024-01-01') TO ('2024-12-31');
CREATE TABLE check_ins_future PARTITION OF check_ins
    FOR VALUES FROM ('2025-01-01') TO ('2025-12-31');

-- Add triggers for updated_at
CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_check_ins_updated_at
    BEFORE UPDATE ON check_ins
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();