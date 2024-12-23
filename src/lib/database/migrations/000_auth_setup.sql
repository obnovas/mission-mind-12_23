-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create auth schema if not exists
CREATE SCHEMA IF NOT EXISTS auth;

-- Create migrations tracking
CREATE TABLE IF NOT EXISTS migrations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user settings table first
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create auth trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Check if settings already exist to prevent duplicates
    SELECT COUNT(*) INTO v_count
    FROM public.user_settings
    WHERE user_id = NEW.id;
    
    -- Only create settings if they don't exist
    IF v_count = 0 THEN
        BEGIN
            INSERT INTO public.user_settings (
                user_id,
                timezone,
                created_at,
                updated_at
            ) VALUES (
                NEW.id,
                COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC'),
                NOW(),
                NOW()
            );
        EXCEPTION WHEN OTHERS THEN
            -- Log error but don't fail the trigger
            RAISE LOG 'Error creating user settings: %', SQLERRM;
        END;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate auth trigger safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Add RLS policies
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
    ON public.user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
    ON public.user_settings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
    ON public.user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id 
    ON public.user_settings(user_id);

-- Create function to validate email domains (optional)
CREATE OR REPLACE FUNCTION auth.validate_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Add any validation logic here
    -- Example: Prevent disposable email domains
    IF NEW.email ~ '@(temp|fake|disposable)\.' THEN
        RAISE EXCEPTION 'Invalid email domain';
    END IF;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Email validation error: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create email validation trigger
DROP TRIGGER IF EXISTS validate_email_before_signup ON auth.users;

CREATE TRIGGER validate_email_before_signup
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION auth.validate_email();