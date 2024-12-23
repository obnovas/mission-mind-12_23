-- Create materialized view for analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS contact_analytics AS
SELECT 
    user_id,
    type,
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as contact_count,
    COUNT(CASE WHEN next_contact_date < NOW() THEN 1 END) as overdue_count
FROM contacts
GROUP BY user_id, type, DATE_TRUNC('month', created_at)
WITH DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_contact_analytics_unique 
ON contact_analytics (user_id, type, month);

-- Create refresh function
CREATE OR REPLACE FUNCTION refresh_contact_analytics()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY contact_analytics;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for analytics refresh
DROP TRIGGER IF EXISTS refresh_contact_analytics_trigger ON contacts;
CREATE TRIGGER refresh_contact_analytics_trigger
    AFTER INSERT OR UPDATE OR DELETE ON contacts
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_contact_analytics();