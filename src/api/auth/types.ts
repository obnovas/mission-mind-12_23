export interface ApiKey {
  id: string;
  user_id: string;
  key: string;
  created_at: string;
  last_used_at?: string;
  revoked_at?: string;
}

export interface ApiKeyResponse {
  success: boolean;
  data?: ApiKey;
  error?: {
    message: string;
  };
}