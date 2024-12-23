-- Add stage_notes column to journeys table
ALTER TABLE journeys
ADD COLUMN IF NOT EXISTS stage_notes JSONB DEFAULT '{}'::jsonb;

-- Create function to update stage notes
CREATE OR REPLACE FUNCTION update_stage_notes(
  p_journey_id UUID,
  p_stage TEXT,
  p_notes TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE journeys
  SET 
    stage_notes = jsonb_set(
      COALESCE(stage_notes, '{}'::jsonb),
      array[p_stage],
      to_jsonb(p_notes)
    ),
    updated_at = NOW()
  WHERE id = p_journey_id
  AND user_id = auth.uid();
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_stage_notes TO authenticated;