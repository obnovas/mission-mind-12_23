-- Set the user ID
\set user_id 'bc9eb5bc-22b3-4cd8-83db-3b43a784c593'

-- Insert sample relationships
INSERT INTO relationships (user_id, from_contact_id, to_contact_id, type, notes, created_at, updated_at) VALUES
-- Tony Stark's relationships
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c001', 'c002', 'Colleague', 'Fellow superhero and occasional rival', NOW() - INTERVAL '60 days', NOW()),
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c001', 'c003', 'Mentor', 'Mentoring in technology and heroics', NOW() - INTERVAL '45 days', NOW()),
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c001', 'c005', 'Member', 'Core team member', NOW() - INTERVAL '90 days', NOW()),

-- Bruce Wayne's relationships
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c002', 'c001', 'Colleague', 'Strategic alliance and friendly competition', NOW() - INTERVAL '60 days', NOW()),
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c002', 'c004', 'Partner', 'Justice League collaboration', NOW() - INTERVAL '30 days', NOW()),
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c002', 'c006', 'Partner', 'Supporting youth education initiatives', NOW() - INTERVAL '15 days', NOW()),

-- Peter Parker's relationships
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c003', 'c001', 'Mentee', 'Learning from Mr. Stark', NOW() - INTERVAL '45 days', NOW()),
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c003', 'c005', 'Member', 'Junior team member', NOW() - INTERVAL '20 days', NOW()),

-- Diana Prince's relationships
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c004', 'c002', 'Partner', 'Justice League coordination', NOW() - INTERVAL '30 days', NOW()),
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c004', 'c005', 'Member', 'Senior team member', NOW() - INTERVAL '75 days', NOW()),

-- Organization relationships
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c005', 'c007', 'Partner', 'Technology and equipment supplier', NOW() - INTERVAL '100 days', NOW()),
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c005', 'c008', 'Partner', 'Research and development collaboration', NOW() - INTERVAL '85 days', NOW()),

-- School relationships
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c006', 'c002', 'Partner', 'Financial support and mentorship programs', NOW() - INTERVAL '15 days', NOW()),
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c006', 'c007', 'Partner', 'Technology education partnership', NOW() - INTERVAL '40 days', NOW()),

-- Business relationships
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c007', 'c008', 'Partner', 'Joint research initiatives', NOW() - INTERVAL '70 days', NOW()),
('bc9eb5bc-22b3-4cd8-83db-3b43a784c593', 'c007', 'c005', 'Partner', 'Primary equipment provider', NOW() - INTERVAL '100 days', NOW());