-- Apply indexes from previous file
\i src/lib/database/indexes.sql

-- Add additional performance optimizations
ALTER TABLE contacts SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_analyze_scale_factor = 0.02
);

ALTER TABLE check_ins SET (
    autovacuum_vacuum_scale_factor = 0.05,
    autovacuum_analyze_scale_factor = 0.02
);

-- Add statistics targets for better query planning
ALTER TABLE contacts ALTER COLUMN user_id SET STATISTICS 1000;
ALTER TABLE contacts ALTER COLUMN type SET STATISTICS 1000;
ALTER TABLE contacts ALTER COLUMN next_contact_date SET STATISTICS 1000;

-- Create materialized view for common analytics queries
CREATE MATERIALIZED VIEW contact_analytics AS
SELECT 
    user_id,
    type,
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as contact_count,
    COUNT(CASE WHEN next_contact_date < NOW() THEN 1 END) as overdue_count
FROM contacts
GROUP BY user_id, type, DATE_TRUNC('month', created_at)
WITH DATA;

CREATE UNIQUE INDEX ON contact_analytics (user_id, type, month);

-- Create refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_contact_analytics()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY contact_analytics;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh materialized view
CREATE TRIGGER refresh_contact_analytics_trigger
AFTER INSERT OR UPDATE OR DELETE ON contacts
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_contact_analytics();