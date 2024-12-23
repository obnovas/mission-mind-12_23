import { supabase } from '../../supabase';

export async function setupTablePartitioning() {
  try {
    // Create partitioned check_ins table
    await supabase.rpc('setup_check_ins_partitioning', {
      sql: `
        CREATE TABLE IF NOT EXISTS check_ins_new (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL,
          contact_id UUID NOT NULL,
          check_in_date TIMESTAMPTZ NOT NULL,
          status TEXT NOT NULL,
          check_in_notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        ) PARTITION BY RANGE (check_in_date);

        -- Create current year partition
        CREATE TABLE IF NOT EXISTS check_ins_current 
        PARTITION OF check_ins_new
        FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

        -- Create next year partition
        CREATE TABLE IF NOT EXISTS check_ins_future 
        PARTITION OF check_ins_new
        FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
      `
    });
  } catch (err) {
    console.error('Error setting up partitioning:', err);
    throw err;
  }
}