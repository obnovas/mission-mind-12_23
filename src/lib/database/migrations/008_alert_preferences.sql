-- Add alert preferences to user settings table
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS alert_preferences JSONB NOT NULL DEFAULT '{
  "emailAlerts": false,
  "smsAlerts": false,
  "alertPhoneNumber": null,
  "alertProvider": null,
  "smsGatewayAddress": null
}'::jsonb;

-- Create function to update SMS gateway address
CREATE OR REPLACE FUNCTION update_sms_gateway_address()
RETURNS TRIGGER AS $$
DECLARE
  provider_domain TEXT;
BEGIN
  -- Get provider domain based on alert provider
  provider_domain := CASE NEW.alert_preferences->>'alertProvider'
    WHEN 'att' THEN '@txt.att.net'
    WHEN 'verizon' THEN '@vtext.com'
    WHEN 'tmobile' THEN '@tmomail.net'
    WHEN 'sprint' THEN '@messaging.sprintpcs.com'
    WHEN 'boost' THEN '@sms.myboostmobile.com'
    WHEN 'cricket' THEN '@sms.cricketwireless.net'
    WHEN 'uscellular' THEN '@email.uscc.net'
    WHEN 'virgin' THEN '@vmobl.com'
    WHEN 'republic' THEN '@text.republicwireless.com'
    WHEN 'googlefi' THEN '@msg.fi.google.com'
    ELSE NULL
  END;

  -- Update SMS gateway address if we have both phone number and provider
  IF NEW.alert_preferences->>'alertPhoneNumber' IS NOT NULL 
     AND NEW.alert_preferences->>'alertProvider' IS NOT NULL THEN
    NEW.alert_preferences := jsonb_set(
      NEW.alert_preferences,
      '{smsGatewayAddress}',
      to_jsonb(NEW.alert_preferences->>'alertPhoneNumber' || provider_domain)
    );
  ELSE
    NEW.alert_preferences := jsonb_set(
      NEW.alert_preferences,
      '{smsGatewayAddress}',
      'null'::jsonb
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update SMS gateway address
DROP TRIGGER IF EXISTS update_sms_gateway_trigger ON user_settings;
CREATE TRIGGER update_sms_gateway_trigger
  BEFORE INSERT OR UPDATE OF alert_preferences
  ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_sms_gateway_address();

-- Add index for alert preferences
CREATE INDEX IF NOT EXISTS idx_user_settings_alert_prefs 
ON user_settings USING gin (alert_preferences);

-- Update existing rows with default alert preferences
UPDATE user_settings
SET alert_preferences = '{
  "emailAlerts": false,
  "smsAlerts": false,
  "alertPhoneNumber": null,
  "alertProvider": null,
  "smsGatewayAddress": null
}'::jsonb
WHERE alert_preferences IS NULL;