-- Create function to check table size
CREATE OR REPLACE FUNCTION check_table_size(table_name text)
RETURNS bigint AS $$
DECLARE
    table_size bigint;
BEGIN
    EXECUTE format('SELECT pg_total_relation_size(%L)', table_name) INTO table_size;
    RETURN table_size;
END;
$$ LANGUAGE plpgsql;

-- Create function to manage partitioning
CREATE OR REPLACE FUNCTION manage_partitioning()
RETURNS void AS $$
DECLARE
    contacts_size bigint;
    check_ins_size bigint;
    partition_threshold bigint := 5 * 1024 * 1024 * 1024; -- 5GB
BEGIN
    -- Get current table sizes
    contacts_size := check_table_size('contacts');
    check_ins_size := check_table_size('check_ins');
    
    -- Log sizes for monitoring
    RAISE NOTICE 'Contacts table size: % bytes', contacts_size;
    RAISE NOTICE 'Check-ins table size: % bytes', check_ins_size;
    
    -- Create notification if approaching threshold
    IF contacts_size > (partition_threshold * 0.8) THEN
        RAISE WARNING 'Contacts table approaching partition threshold';
    END IF;
    
    IF check_ins_size > (partition_threshold * 0.8) THEN
        RAISE WARNING 'Check-ins table approaching partition threshold';
    END IF;
END;
$$ LANGUAGE plpgsql;