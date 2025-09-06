import { createClient } from '@supabase/supabase-js';
import { SearchParams, Company } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      search_results: {
        Row: {
          id: string;
          search_params: SearchParams;
          companies: Company[];
          created_at: string;
          total_results: number;
          user_id?: string;
        };
        Insert: {
          id?: string;
          search_params: SearchParams;
          companies: Company[];
          created_at?: string;
          total_results: number;
          user_id?: string;
        };
        Update: {
          id?: string;
          search_params?: SearchParams;
          companies?: Company[];
          created_at?: string;
          total_results?: number;
          user_id?: string;
        };
      };
    };
  };
}