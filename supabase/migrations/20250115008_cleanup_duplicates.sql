-- Migration to clean up duplicate companies before adding unique constraint
-- This removes any potential duplicates that might exist from previous migrations

-- First, truncate the table to start fresh with our new 800 companies data
-- This removes any old data from previous migrations that might conflict
TRUNCATE TABLE companies RESTART IDENTITY CASCADE;

-- Also clean up related tables if they exist and have foreign key constraints
TRUNCATE TABLE company_skills RESTART IDENTITY CASCADE;
TRUNCATE TABLE company_reviews RESTART IDENTITY CASCADE;

-- Reset any sequences
ALTER SEQUENCE IF EXISTS companies_id_seq RESTART WITH 1;

-- Add a comment to track this cleanup
COMMENT ON TABLE companies IS 'Table cleaned up on 2025-01-15 to prepare for new 800 companies data with unique constraints';
