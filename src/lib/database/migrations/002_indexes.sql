-- Performance indexes for contacts
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_next_contact_date ON contacts(next_contact_date);
CREATE INDEX IF NOT EXISTS idx_contacts_name_text ON contacts USING gin(to_tsvector('simple_unaccent', name));
CREATE INDEX IF NOT EXISTS idx_contacts_email_text ON contacts USING gin(to_tsvector('simple_unaccent', email::text));

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contacts_user_check_in ON contacts(user_id, next_contact_date);
CREATE INDEX IF NOT EXISTS idx_contacts_user_type ON contacts(user_id, type);

-- Indexes for check_ins
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_contact_date ON check_ins(contact_id, check_in_date);
CREATE INDEX IF NOT EXISTS idx_check_ins_status ON check_ins(status);

-- Add table optimizations
ALTER TABLE contacts SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_analyze_scale_factor = 0.02
);

ALTER TABLE check_ins SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_analyze_scale_factor = 0.02
);

-- Improve query planning
ALTER TABLE contacts ALTER COLUMN user_id SET STATISTICS 1000;
ALTER TABLE contacts ALTER COLUMN type SET STATISTICS 1000;
ALTER TABLE contacts ALTER COLUMN next_contact_date SET STATISTICS 1000;