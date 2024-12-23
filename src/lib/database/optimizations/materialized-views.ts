import { supabase } from '../../supabase';

export async function setupMaterializedViews() {
  try {
    await supabase.rpc('setup_materialized_views', {
      sql: `
        CREATE MATERIALIZED VIEW IF NOT EXISTS contact_analytics AS
        SELECT 
          user_id,
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as total_contacts,
          COUNT(CASE WHEN next_contact_date < NOW() THEN 1 END) as overdue_contacts,
          COUNT(CASE WHEN type = 'Individual' THEN 1 END) as individual_contacts,
          COUNT(CASE WHEN type = 'Organization' THEN 1 END) as org_contacts
        FROM contacts
        GROUP BY user_id, DATE_TRUNC('month', created_at)
        WITH DATA;

        CREATE UNIQUE INDEX IF NOT EXISTS idx_contact_analytics_user_month 
        ON contact_analytics (user_id, month);

        -- Create refresh function
        CREATE OR REPLACE FUNCTION refresh_contact_analytics()
        RETURNS TRIGGER AS $$
        BEGIN
          REFRESH MATERIALIZED VIEW CONCURRENTLY contact_analytics;
          RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;

        -- Create trigger
        DROP TRIGGER IF EXISTS refresh_contact_analytics_trigger ON contacts;
        CREATE TRIGGER refresh_contact_analytics_trigger
        AFTER INSERT OR UPDATE OR DELETE ON contacts
        FOR EACH STATEMENT
        EXECUTE FUNCTION refresh_contact_analytics();
      `
    });
  } catch (err) {
    console.error('Error setting up materialized views:', err);
    throw err;
  }
}