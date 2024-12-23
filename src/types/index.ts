// Update Journey interface to include stage notes
export interface Journey {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  stages: string[];
  stage_notes?: Record<string, string>;
  created_at: string;
  updated_at: string;
}