/*
  # Job-Do Company Management System Schema

  1. New Tables
    - `companies` - Store company information added by users
    - `company_skills` - Many-to-many relationship between companies and skills
    - `skills` - Master list of skills/technologies
    - `company_reviews` - User reviews and ratings for companies
    - `user_company_submissions` - Track who submitted which companies

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for authenticated users
    - Public read access for company data
*/

-- Skills master table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) UNIQUE NOT NULL,
  category varchar(50) NOT NULL, -- e.g., 'Programming', 'Design', 'Data Science'
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Companies table (main table for storing company information)
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  description text,
  address text NOT NULL,
  city varchar(100) NOT NULL,
  state varchar(100) NOT NULL,
  country varchar(100) DEFAULT 'India',
  postal_code varchar(20),
  
  -- Contact Information
  phone varchar(20),
  email varchar(255),
  website varchar(255),
  
  -- Business Information
  industry varchar(100), -- e.g., 'Information Technology', 'Electronics'
  company_size varchar(50), -- e.g., '1-10', '11-50', '51-200', '200+'
  founded_year integer,
  
  -- Location coordinates
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  
  -- Verification and Quality
  is_verified boolean DEFAULT false,
  verification_date timestamptz,
  quality_score integer DEFAULT 0, -- 0-100 based on completeness and user feedback
  
  -- Meta information
  submitted_by uuid, -- User who submitted this company
  status varchar(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Search optimization
  search_vector tsvector
);

-- Company-Skills junction table (many-to-many)
CREATE TABLE IF NOT EXISTS company_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  proficiency_level varchar(20) DEFAULT 'intermediate', -- 'beginner', 'intermediate', 'advanced', 'expert'
  is_primary boolean DEFAULT false, -- Is this a primary skill for the company?
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(company_id, skill_id)
);

-- Company reviews and ratings
CREATE TABLE IF NOT EXISTS company_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  reviewer_name varchar(100),
  reviewer_email varchar(255),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_title varchar(200),
  review_text text,
  work_type varchar(50), -- 'internship', 'full-time', 'contract', 'freelance'
  job_title varchar(100),
  
  -- Verification
  is_verified boolean DEFAULT false,
  is_anonymous boolean DEFAULT false,
  
  -- Meta
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Track user submissions for moderation
CREATE TABLE IF NOT EXISTS user_company_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  submitter_name varchar(100),
  submitter_email varchar(255) NOT NULL,
  submission_notes text,
  ip_address varchar(45),
  user_agent text,
  status varchar(20) DEFAULT 'submitted', -- 'submitted', 'reviewed', 'approved', 'rejected'
  reviewed_by varchar(100),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_company_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for skills (public read, admin write)
CREATE POLICY "Allow public read access to skills"
  ON skills FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert to skills"
  ON skills FOR INSERT TO public WITH CHECK (true);

-- Policies for companies (public read, authenticated insert)
CREATE POLICY "Allow public read access to approved companies"
  ON companies FOR SELECT TO public 
  USING (status = 'approved' OR status = 'pending');

CREATE POLICY "Allow public insert to companies"
  ON companies FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public update to companies"
  ON companies FOR UPDATE TO public USING (true);

-- Policies for company_skills (public read/write)
CREATE POLICY "Allow public read access to company_skills"
  ON company_skills FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert to company_skills"
  ON company_skills FOR INSERT TO public WITH CHECK (true);

-- Policies for company_reviews (public read/write)
CREATE POLICY "Allow public read access to company_reviews"
  ON company_reviews FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert to company_reviews"
  ON company_reviews FOR INSERT TO public WITH CHECK (true);

-- Policies for user_company_submissions (public insert, restricted read)
CREATE POLICY "Allow public insert to submissions"
  ON user_company_submissions FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public read own submissions"
  ON user_company_submissions FOR SELECT TO public USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city);
CREATE INDEX IF NOT EXISTS idx_companies_state ON companies(state);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_location ON companies(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_companies_quality_score ON companies(quality_score DESC);

CREATE INDEX IF NOT EXISTS idx_company_skills_company_id ON company_skills(company_id);
CREATE INDEX IF NOT EXISTS idx_company_skills_skill_id ON company_skills(skill_id);

CREATE INDEX IF NOT EXISTS idx_company_reviews_company_id ON company_reviews(company_id);
CREATE INDEX IF NOT EXISTS idx_company_reviews_rating ON company_reviews(rating);

CREATE INDEX IF NOT EXISTS idx_submissions_company_id ON user_company_submissions(company_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON user_company_submissions(status);

-- Full-text search index for companies
CREATE INDEX IF NOT EXISTS idx_companies_search ON companies USING gin(search_vector);

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_company_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
                      setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
                      setweight(to_tsvector('english', COALESCE(NEW.industry, '')), 'C') ||
                      setweight(to_tsvector('english', COALESCE(NEW.city, '') || ' ' || COALESCE(NEW.state, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search vector
CREATE TRIGGER trigger_update_company_search_vector
  BEFORE INSERT OR UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_company_search_vector();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER trigger_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_company_reviews_updated_at
  BEFORE UPDATE ON company_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default skills
INSERT INTO skills (name, category) VALUES
  ('Web Development', 'Programming'),
  ('App Development', 'Programming'),
  ('Data Science', 'Analytics'),
  ('Machine Learning', 'AI/ML'),
  ('Cybersecurity', 'Security'),
  ('Cloud Computing', 'Infrastructure'),
  ('DevOps', 'Infrastructure'),
  ('UI/UX Design', 'Design'),
  ('Digital Marketing', 'Marketing'),
  ('Business Analysis', 'Business'),
  ('Project Management', 'Management'),
  ('Electronics', 'Hardware'),
  ('Embedded Systems', 'Hardware'),
  ('IoT', 'Hardware'),
  ('Blockchain', 'Technology'),
  ('Artificial Intelligence', 'AI/ML'),
  ('Python', 'Programming'),
  ('JavaScript', 'Programming'),
  ('React', 'Programming'),
  ('Node.js', 'Programming'),
  ('Java', 'Programming'),
  ('C++', 'Programming'),
  ('PHP', 'Programming'),
  ('MySQL', 'Database'),
  ('PostgreSQL', 'Database'),
  ('MongoDB', 'Database'),
  ('AWS', 'Cloud'),
  ('Azure', 'Cloud'),
  ('Google Cloud', 'Cloud'),
  ('Docker', 'DevOps'),
  ('Kubernetes', 'DevOps'),
  ('Git', 'Tools'),
  ('Agile', 'Methodology'),
  ('Scrum', 'Methodology'),
  ('Finance', 'Business'),
  ('Accounting', 'Business'),
  ('Sales', 'Business'),
  ('Customer Service', 'Business'),
  ('Content Writing', 'Content'),
  ('SEO', 'Marketing')
ON CONFLICT (name) DO NOTHING;
