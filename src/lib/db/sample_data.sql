-- Set the user ID
\set user_id 'bc9eb5bc-22b3-4cd8-83db-3b43a784c593'

-- Insert Contacts
INSERT INTO contacts (id, user_id, name, type, email, phone, address, notes, check_in_frequency, last_contact_date, next_contact_date, created_at, updated_at) VALUES
-- Individual Contacts
('c001', :'user_id', 'Tony Stark', 'Individual', 'tony@starkindustries.com', '555-0001', '10880 Malibu Point, Malibu, CA', 'Genius billionaire philanthropist', 'Monthly', NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days', NOW() - INTERVAL '60 days', NOW()),
('c002', :'user_id', 'Bruce Wayne', 'Individual', 'bruce@wayneenterprises.com', '555-0002', 'Wayne Manor, Gotham City', 'Night meetings only', 'Weekly', NOW() - INTERVAL '5 days', NOW() + INTERVAL '2 days', NOW() - INTERVAL '45 days', NOW()),
('c003', :'user_id', 'Peter Parker', 'Individual', 'peter.parker@dailybugle.com', '555-0003', 'Queens, NY', 'Photography enthusiast', 'Weekly', NOW() - INTERVAL '3 days', NOW() + INTERVAL '4 days', NOW() - INTERVAL '30 days', NOW()),
('c004', :'user_id', 'Diana Prince', 'Individual', 'diana@themyscira.gov', '555-0004', 'Paris, France', 'Art curator at the Louvre', 'Monthly', NOW() - INTERVAL '20 days', NOW() + INTERVAL '10 days', NOW() - INTERVAL '90 days', NOW()),

-- Organization Contacts
('c005', :'user_id', 'Avengers Initiative', 'Organization', 'info@avengers.org', '555-0005', 'Avengers Tower, NYC', 'Superhero team coordination', 'Weekly', NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', NOW() - INTERVAL '120 days', NOW()),
('c006', :'user_id', 'Xavier School', 'Organization', 'admissions@xavierschool.edu', '555-0006', '1407 Graymalkin Lane, Salem Center', 'Gifted youngsters program', 'Monthly', NOW() - INTERVAL '25 days', NOW() + INTERVAL '5 days', NOW() - INTERVAL '150 days', NOW()),

-- Business Contacts
('c007', :'user_id', 'Stark Industries', 'Business', 'contact@starkindustries.com', '555-0007', 'Los Angeles, CA', 'Clean energy initiatives', 'Quarterly', NOW() - INTERVAL '45 days', NOW() + INTERVAL '45 days', NOW() - INTERVAL '180 days', NOW()),
('c008', :'user_id', 'Wayne Enterprises', 'Business', 'info@wayneenterprises.com', '555-0008', 'Gotham City', 'Applied Sciences Division', 'Monthly', NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days', NOW() - INTERVAL '200 days', NOW());

-- Insert Journeys
INSERT INTO journeys (id, user_id, name, description, stages, created_at, updated_at) VALUES
('j001', :'user_id', 'Hero''s Journey', 'Guide individuals through their heroic transformation', ARRAY['Call to Adventure', 'Training', 'First Challenge', 'Transformation', 'Return'], NOW() - INTERVAL '180 days', NOW()),
('j002', :'user_id', 'Team Integration', 'Process for integrating new members into the team', ARRAY['Recruitment', 'Assessment', 'Training', 'Field Test', 'Active Duty'], NOW() - INTERVAL '150 days', NOW()),
('j003', :'user_id', 'Mentorship Program', 'Developing the next generation of leaders', ARRAY['Discovery', 'Connection', 'Growth', 'Leadership', 'Independence'], NOW() - INTERVAL '120 days', NOW());

-- Insert Contact Journeys
INSERT INTO contact_journeys (user_id, contact_id, journey_id, stage, notes, started_at, updated_at) VALUES
(:'user_id', 'c003', 'j001', 'Training', 'Showing great potential, needs guidance with power management', NOW() - INTERVAL '30 days', NOW()),
(:'user_id', 'c004', 'j002', 'Active Duty', 'Natural leader, excellent team player', NOW() - INTERVAL '90 days', NOW()),
(:'user_id', 'c001', 'j002', 'Field Test', 'Works well with others despite initial resistance', NOW() - INTERVAL '60 days', NOW()),
(:'user_id', 'c002', 'j003', 'Leadership', 'Excellent mentor to younger members', NOW() - INTERVAL '45 days', NOW());

-- Insert Prayer Requests
INSERT INTO prayer_requests (user_id, contact_id, request, status, created_at, updated_at) VALUES
(:'user_id', 'c003', 'Balance between personal life and responsibilities', 'Active', NOW() - INTERVAL '15 days', NOW()),
(:'user_id', 'c001', 'Guidance in leading the team through challenging times', 'Active', NOW() - INTERVAL '10 days', NOW()),
(:'user_id', 'c002', 'Wisdom in mentoring new team members', 'Active', NOW() - INTERVAL '5 days', NOW()),
(:'user_id', 'c004', 'Strength in diplomatic missions', 'Answered', NOW() - INTERVAL '30 days', NOW() - INTERVAL '5 days'),
(:'user_id', 'c006', 'Protection for students during field trips', 'Active', NOW() - INTERVAL '3 days', NOW()),
(:'user_id', 'c005', 'Unity among team members', 'Active', NOW() - INTERVAL '7 days', NOW());

-- Insert Network Groups
INSERT INTO network_groups (id, user_id, name, description, created_at, updated_at) VALUES
('g001', :'user_id', 'Core Team', 'Primary response team members', NOW() - INTERVAL '180 days', NOW()),
('g002', :'user_id', 'Support Network', 'Administrative and logistical support', NOW() - INTERVAL '150 days', NOW()),
('g003', :'user_id', 'Training Division', 'Members involved in training and development', NOW() - INTERVAL '120 days', NOW());

-- Insert Network Group Members
INSERT INTO network_group_members (user_id, group_id, contact_id) VALUES
(:'user_id', 'g001', 'c001'),
(:'user_id', 'g001', 'c002'),
(:'user_id', 'g001', 'c004'),
(:'user_id', 'g002', 'c007'),
(:'user_id', 'g002', 'c008'),
(:'user_id', 'g003', 'c003'),
(:'user_id', 'g003', 'c006');