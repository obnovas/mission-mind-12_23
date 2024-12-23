-- Create migrations table
CREATE TABLE IF NOT EXISTS migrations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create migration function
CREATE OR REPLACE FUNCTION run_migration(
    migration_id TEXT,
    migration_name TEXT,
    migration_sql TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if migration was already applied
    IF EXISTS (SELECT 1 FROM migrations WHERE id = migration_id) THEN
        RAISE NOTICE 'Migration % already applied', migration_id;
        RETURN;
    END IF;

    -- Run migration in transaction
    BEGIN
        EXECUTE migration_sql;
        
        -- Record successful migration
        INSERT INTO migrations (id, name) 
        VALUES (migration_id, migration_name);
        
        RAISE NOTICE 'Migration % completed successfully', migration_id;
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Migration % failed: %', migration_id, SQLERRM;
    END;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION run_migration TO authenticated;