-- Create operator class for gin indexes if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_opclass WHERE opcname = 'gin_trgm_ops'
    ) THEN
        EXECUTE 'CREATE OPERATOR CLASS gin_trgm_ops
        FOR TYPE text USING gin AS
        OPERATOR 1 ~~(text, text),
        OPERATOR 2 ~~*(text, text),
        FUNCTION 1 gin_extract_value_trgm(text),
        FUNCTION 2 gin_extract_query_trgm(text),
        FUNCTION 3 gin_consistent_trgm(internal, smallint, text, integer, internal, internal)';
    END IF;
END
$$;

-- Performance indexes for contacts
CREATE INDEX IF NOT EXISTS idx_contacts_user_id 
    ON contacts(user_id);
    
CREATE INDEX IF NOT EXISTS idx_contacts_next_contact_date 
    ON contacts(next_contact_date);
    
CREATE INDEX IF NOT EXISTS idx_contacts_name_trgm 
    ON contacts USING gin(name gin_trgm_ops);
    
CREATE INDEX IF NOT EXISTS idx_contacts_email_trgm 
    ON contacts USING gin(email gin_trgm_ops);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contacts_user_check_in 
    ON contacts(user_id, next_contact_date);
    
CREATE INDEX IF NOT EXISTS idx_contacts_user_type 
    ON contacts(user_id, type);

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