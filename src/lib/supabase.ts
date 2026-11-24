import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Ward = {
  id: string;
  name: string;
  short_name: string;
  points: number;
  created_at: string;
};

export type Report = {
  id: string;
  ward_id: string;
  photo_url: string | null;
  note: string | null;
  status: string;
  created_at: string;
  wards?: Ward | Ward[];
};
