-- Migration to add unique constraint for company name and location
-- This ensures no duplicate company names exist in the same location

-- Add unique constraint on company name and location (city, state combination)
-- This prevents two companies with the same name from being in the same city/state
ALTER TABLE companies 
ADD CONSTRAINT unique_company_location 
UNIQUE (name, city, state);

-- Add index for better query performance on location-based searches
CREATE INDEX IF NOT EXISTS idx_companies_location ON companies (city, state);
CREATE INDEX IF NOT EXISTS idx_companies_coordinates ON companies (latitude, longitude);

-- Add index for company name searches
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies (name);

-- Add full-text search index for company names and descriptions
CREATE INDEX IF NOT EXISTS idx_companies_search ON companies USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Update existing search vector if it exists
UPDATE companies SET search_vector = to_tsvector('english', name || ' ' || COALESCE(description, '')) WHERE search_vector IS NULL;
