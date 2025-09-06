/*
  # Create search results table

  1. New Tables
    - `search_results`
      - `id` (uuid, primary key)
      - `search_params` (jsonb) - stores search parameters
      - `companies` (jsonb array) - stores company data
      - `total_results` (integer) - number of companies found
      - `created_at` (timestamp) - when search was performed
      - `user_id` (uuid, optional) - for user association

  2. Security
    - Enable RLS on `search_results` table
    - Add policies for public access (adjust based on your needs)
*/

CREATE TABLE IF NOT EXISTS search_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_params jsonb NOT NULL,
  companies jsonb[] NOT NULL,
  total_results integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  user_id uuid
);

ALTER TABLE search_results ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo purposes
-- In production, you might want to restrict this to authenticated users
CREATE POLICY "Allow public read access"
  ON search_results
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON search_results
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_search_results_created_at ON search_results(created_at DESC);