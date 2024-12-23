-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Create text search configuration
CREATE TEXT SEARCH CONFIGURATION IF NOT EXISTS public.simple_unaccent ( COPY = pg_catalog.simple );

-- Create GIN operator class if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_opclass WHERE opcname = 'gin_trgm_ops'
    ) THEN
        CREATE OPERATOR CLASS gin_trgm_ops
        DEFAULT FOR TYPE text USING gin AS
        OPERATOR 1 pg_catalog.like(text, text),
        OPERATOR 2 pg_catalog.ilike(text, text),
        FUNCTION 1 gin_extract_value_trgm(text),
        FUNCTION 2 gin_extract_query_trgm(text),
        FUNCTION 3 gin_consistent_trgm(internal, smallint, text, integer, internal, internal);
    END IF;
END
$$;

-- Create custom functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';