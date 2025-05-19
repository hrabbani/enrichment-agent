export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string | null;
  status: string;
  enriched_data: string | null;
  created_at: string;
  updated_at: string;
}
