-- Performance indexes for contacts table
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_next_contact_date ON contacts(next_contact_date);
CREATE INDEX IF NOT EXISTS idx_contacts_name_trigram ON contacts USING gin(name gin_trig_ops);
CREATE INDEX IF NOT EXISTS idx_contacts_email_trigram ON contacts USING gin(email gin_trig_ops);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contacts_user_check_in ON contacts(user_id, next_contact_date);
CREATE INDEX IF NOT EXISTS idx_contacts_user_type ON contacts(user_id, type);

-- Indexes for check_ins table
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_contact_date ON check_ins(contact_id, check_in_date);
CREATE INDEX IF NOT EXISTS idx_check_ins_status ON check_ins(status);

-- Indexes for prayer_requests table
CREATE INDEX IF NOT EXISTS idx_prayers_user_id ON prayer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_prayers_contact_status ON prayer_requests(contact_id, status);
CREATE INDEX IF NOT EXISTS idx_prayers_created_at ON prayer_requests(created_at);

-- Indexes for journeys and related tables
CREATE INDEX IF NOT EXISTS idx_journeys_user_id ON journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_journeys_composite ON contact_journeys(user_id, contact_id, journey_id);

-- Indexes for network groups
CREATE INDEX IF NOT EXISTS idx_network_groups_user_id ON network_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_network_members_composite ON network_group_members(user_id, group_id, contact_id);