-- Create welcome notes table
CREATE TABLE IF NOT EXISTS welcome_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('biblical', 'inspirational')),
  author TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE welcome_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Welcome notes are viewable by all users"
  ON welcome_notes FOR SELECT
  USING (true);

-- Biblical quotes
INSERT INTO welcome_notes (content, category, author) VALUES
('Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.', 'biblical', 'Joshua 1:9'),
('I can do all things through Christ who strengthens me.', 'biblical', 'Philippians 4:13'),
('Trust in the Lord with all your heart and lean not on your own understanding.', 'biblical', 'Proverbs 3:5'),
('The Lord is my shepherd, I lack nothing.', 'biblical', 'Psalm 23:1'),
('For I know the plans I have for you, plans to prosper you and not to harm you, plans to give you hope and a future.', 'biblical', 'Jeremiah 29:11'),
('Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.', 'biblical', 'Galatians 6:9'),
('But those who hope in the Lord will renew their strength. They will soar on wings like eagles.', 'biblical', 'Isaiah 40:31'),
('Be joyful in hope, patient in affliction, faithful in prayer.', 'biblical', 'Romans 12:12'),
('The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.', 'biblical', 'Numbers 6:24-25'),
('This is the day that the Lord has made; let us rejoice and be glad in it.', 'biblical', 'Psalm 118:24'),
('Cast your cares on the Lord and he will sustain you.', 'biblical', 'Psalm 55:22'),
('The joy of the Lord is your strength.', 'biblical', 'Nehemiah 8:10'),
('Give thanks in all circumstances; for this is God''s will for you in Christ Jesus.', 'biblical', '1 Thessalonians 5:18'),
('Let your light shine before others, that they may see your good deeds.', 'biblical', 'Matthew 5:16'),
('Be kind and compassionate to one another, forgiving each other.', 'biblical', 'Ephesians 4:32'),
('Whatever you do, work at it with all your heart, as working for the Lord.', 'biblical', 'Colossians 3:23'),
('The Lord is my light and my salvation—whom shall I fear?', 'biblical', 'Psalm 27:1'),
('Blessed are the peacemakers, for they will be called children of God.', 'biblical', 'Matthew 5:9'),
('Do not be anxious about anything, but in every situation, present your requests to God.', 'biblical', 'Philippians 4:6'),
('Love must be sincere. Hate what is evil; cling to what is good.', 'biblical', 'Romans 12:9'),
('Therefore encourage one another and build each other up.', 'biblical', '1 Thessalonians 5:11'),
('Let us love one another, for love comes from God.', 'biblical', '1 John 4:7'),
('Be completely humble and gentle; be patient, bearing with one another in love.', 'biblical', 'Ephesians 4:2'),
('The Lord is good to all; he has compassion on all he has made.', 'biblical', 'Psalm 145:9'),
('May the God of hope fill you with all joy and peace as you trust in him.', 'biblical', 'Romans 15:13'),
('Blessed is the one who perseveres under trial.', 'biblical', 'James 1:12'),
('The Lord is near to all who call on him in truth.', 'biblical', 'Psalm 145:18'),
('Let us not love with words or speech but with actions and in truth.', 'biblical', '1 John 3:18'),
('Be strong in the Lord and in his mighty power.', 'biblical', 'Ephesians 6:10'),
('The name of the Lord is a fortified tower; the righteous run to it and are safe.', 'biblical', 'Proverbs 18:10'),
('Commit to the Lord whatever you do, and he will establish your plans.', 'biblical', 'Proverbs 16:3'),
('The Lord gives strength to his people; the Lord blesses his people with peace.', 'biblical', 'Psalm 29:11'),
('Let the morning bring me word of your unfailing love.', 'biblical', 'Psalm 143:8'),
('Great is the Lord and most worthy of praise.', 'biblical', 'Psalm 145:3'),
('The Lord is gracious and righteous; our God is full of compassion.', 'biblical', 'Psalm 116:5'),
('Your word is a lamp for my feet, a light on my path.', 'biblical', 'Psalm 119:105'),
('The Lord is my rock, my fortress and my deliverer.', 'biblical', 'Psalm 18:2'),
('I will praise you, Lord, with all my heart.', 'biblical', 'Psalm 138:1'),
('The Lord is my strength and my shield.', 'biblical', 'Psalm 28:7'),
('Give thanks to the Lord, for he is good; his love endures forever.', 'biblical', 'Psalm 107:1'),
('May God be gracious to us and bless us and make his face shine on us.', 'biblical', 'Psalm 67:1'),
('The Lord watches over you—the Lord is your shade at your right hand.', 'biblical', 'Psalm 121:5'),
('Taste and see that the Lord is good; blessed is the one who takes refuge in him.', 'biblical', 'Psalm 34:8'),
('The Lord is faithful to all his promises and loving toward all he has made.', 'biblical', 'Psalm 145:13'),
('I lift up my eyes to the mountains—where does my help come from? My help comes from the Lord.', 'biblical', 'Psalm 121:1-2'),
('The Lord gives wisdom; from his mouth come knowledge and understanding.', 'biblical', 'Proverbs 2:6'),
('In the morning, Lord, you hear my voice.', 'biblical', 'Psalm 5:3'),
('The Lord is my portion; therefore I will wait for him.', 'biblical', 'Lamentations 3:24'),
('My soul finds rest in God alone.', 'biblical', 'Psalm 62:1'),
('The Lord is righteous in all his ways and faithful in all he does.', 'biblical', 'Psalm 145:17'),
('Blessed are those who keep his statutes and seek him with all their heart.', 'biblical', 'Psalm 119:2'),
('The Lord is good to those whose hope is in him.', 'biblical', 'Lamentations 3:25'),

-- Inspirational quotes
('The best way to predict the future is to create it.', 'inspirational', 'Peter Drucker'),
('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'inspirational', 'Winston Churchill'),
('The only way to do great work is to love what you do.', 'inspirational', 'Steve Jobs'),
('Change your thoughts and you change your world.', 'inspirational', 'Norman Vincent Peale'),
('What you get by achieving your goals is not as important as what you become by achieving your goals.', 'inspirational', 'Zig Ziglar'),
('The future belongs to those who believe in the beauty of their dreams.', 'inspirational', 'Eleanor Roosevelt'),
('Do not wait to strike till the iron is hot; but make it hot by striking.', 'inspirational', 'William Butler Yeats'),
('The only limit to our realization of tomorrow will be our doubts of today.', 'inspirational', 'Franklin D. Roosevelt'),
('It always seems impossible until it''s done.', 'inspirational', 'Nelson Mandela'),
('Don''t watch the clock; do what it does. Keep going.', 'inspirational', 'Sam Levenson'),
('The best preparation for tomorrow is doing your best today.', 'inspirational', 'H. Jackson Brown Jr.'),
('Life is 10% what happens to you and 90% how you react to it.', 'inspirational', 'Charles R. Swindoll'),
('Believe you can and you''re halfway there.', 'inspirational', 'Theodore Roosevelt'),
('Start where you are. Use what you have. Do what you can.', 'inspirational', 'Arthur Ashe'),
('Everything you''ve ever wanted is on the other side of fear.', 'inspirational', 'George Addair'),
('The only person you are destined to become is the person you decide to be.', 'inspirational', 'Ralph Waldo Emerson'),
('Don''t let yesterday take up too much of today.', 'inspirational', 'Will Rogers'),
('You are never too old to set another goal or to dream a new dream.', 'inspirational', 'C.S. Lewis'),
('The way to get started is to quit talking and begin doing.', 'inspirational', 'Walt Disney'),
('If you can dream it, you can do it.', 'inspirational', 'Walt Disney'),
('Quality is not an act, it is a habit.', 'inspirational', 'Aristotle'),
('The secret of getting ahead is getting started.', 'inspirational', 'Mark Twain'),
('All our dreams can come true if we have the courage to pursue them.', 'inspirational', 'Walt Disney'),
('It''s not whether you get knocked down, it''s whether you get up.', 'inspirational', 'Vince Lombardi'),
('The harder you work for something, the greater you''ll feel when you achieve it.', 'inspirational', 'Anonymous'),
('Dream big and dare to fail.', 'inspirational', 'Norman Vaughan'),
('Don''t let what you cannot do interfere with what you can do.', 'inspirational', 'John Wooden'),
('You miss 100% of the shots you don''t take.', 'inspirational', 'Wayne Gretzky'),
('The difference between ordinary and extraordinary is that little extra.', 'inspirational', 'Jimmy Johnson'),
('The expert in anything was once a beginner.', 'inspirational', 'Helen Hayes'),
('Set your goals high, and don''t stop till you get there.', 'inspirational', 'Bo Jackson'),
('Success is walking from failure to failure with no loss of enthusiasm.', 'inspirational', 'Winston Churchill'),
('What you do today can improve all your tomorrows.', 'inspirational', 'Ralph Marston'),
('Don''t count the days, make the days count.', 'inspirational', 'Muhammad Ali'),
('The only way to achieve the impossible is to believe it is possible.', 'inspirational', 'Charles Kingsleigh'),
('Success is liking yourself, liking what you do, and liking how you do it.', 'inspirational', 'Maya Angelou'),
('The journey of a thousand miles begins with one step.', 'inspirational', 'Lao Tzu'),
('Every moment is a fresh beginning.', 'inspirational', 'T.S. Eliot'),
('Never give up on a dream just because of the time it will take to accomplish it.', 'inspirational', 'Earl Nightingale'),
('Life is what happens while you''re busy making other plans.', 'inspirational', 'John Lennon'),
('The purpose of our lives is to be happy.', 'inspirational', 'Dalai Lama'),
('Get busy living or get busy dying.', 'inspirational', 'Stephen King'),
('Those who dare to fail miserably can achieve greatly.', 'inspirational', 'John F. Kennedy'),
('The past cannot be changed. The future is yet in your power.', 'inspirational', 'Unknown'),
('It is never too late to be what you might have been.', 'inspirational', 'George Eliot'),
('Everything has beauty, but not everyone sees it.', 'inspirational', 'Confucius'),
('Happiness is not something ready made. It comes from your own actions.', 'inspirational', 'Dalai Lama'),
('Life is either a daring adventure or nothing at all.', 'inspirational', 'Helen Keller'),
('Success usually comes to those who are too busy to be looking for it.', 'inspirational', 'Henry David Thoreau'),
('If you want to lift yourself up, lift up someone else.', 'inspirational', 'Booker T. Washington'),
('You have within you right now, everything you need to deal with whatever the world can throw at you.', 'inspirational', 'Brian Tracy');