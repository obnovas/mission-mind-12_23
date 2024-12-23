import { supabase } from '../../supabase';

interface Migration {
  id: string;
  name: string;
  sql: string;
}

const migrations: Migration[] = [
  {
    id: '001',
    name: 'extensions',
    sql: require('./001_extensions.sql'),
  },
  {
    id: '002',
    name: 'base_schema',
    sql: require('./001_initial_schema.sql'),
  },
  {
    id: '003',
    name: 'indexes',
    sql: require('./002_indexes.sql'),
  },
  {
    id: '004',
    name: 'analytics',
    sql: require('./003_analytics.sql'),
  },
];

export async function runMigrations() {
  try {
    // Create migrations table if it doesn't exist
    const { error: tableError } = await supabase.rpc('create_migrations_table');
    if (tableError) throw tableError;

    // Get applied migrations
    const { data: applied, error: fetchError } = await supabase
      .from('migrations')
      .select('id')
      .order('id');
    
    if (fetchError) throw fetchError;

    // Run pending migrations
    for (const migration of migrations) {
      if (!applied?.find(m => m.id === migration.id)) {
        console.log(`Running migration ${migration.id}: ${migration.name}`);
        
        const { error } = await supabase.rpc('run_migration', {
          migration_id: migration.id,
          migration_name: migration.name,
          migration_sql: migration.sql
        });

        if (error) throw error;
      }
    }

    console.log('Migrations completed successfully');
  } catch (err) {
    console.error('Migration error:', err);
    throw err;
  }
}