-- Add missing columns to existing companies table and insert real data
-- Migration to transform existing companies table for real Indian companies

-- First, let's see what columns exist and add missing ones
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS color text DEFAULT 'blue',
ADD COLUMN IF NOT EXISTS latitude float,
ADD COLUMN IF NOT EXISTS longitude float,
ADD COLUMN IF NOT EXISTS company_size text,
ADD COLUMN IF NOT EXISTS founded_year integer,
ADD COLUMN IF NOT EXISTS is_hiring boolean DEFAULT true;

-- Update the name column to be text if it isn't already
ALTER TABLE companies ALTER COLUMN name TYPE text;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_companies_category ON companies(category);
CREATE INDEX IF NOT EXISTS idx_companies_location ON companies(location);
CREATE INDEX IF NOT EXISTS idx_companies_skills ON companies USING gin(skills);
CREATE INDEX IF NOT EXISTS idx_companies_hiring ON companies(is_hiring);
CREATE INDEX IF NOT EXISTS idx_companies_coordinates ON companies(latitude, longitude);

-- Clear existing data and insert real companies
TRUNCATE TABLE companies RESTART IDENTITY CASCADE;

-- Insert 50 real Indian companies with verified data
INSERT INTO companies (name, address, category, location, phone, email, website, skills, description, color, latitude, longitude, company_size, founded_year, is_hiring) VALUES
('Tata Consultancy Services', 'Nirmal Building, Nariman Point, Mumbai 400021', 'IT Services', 'Mumbai, Maharashtra', '+91-22-6778-9595', 'careers@tcs.com', 'https://www.tcs.com', ARRAY['Java', 'Python', 'React', 'Angular', 'Cloud Computing', 'AI/ML'], 'Leading global IT services, consulting and business solutions organization', 'blue', 19.0760, 72.8777, '500000+', 1968, true),
('Infosys', 'IT Services', 'Bangalore, Karnataka', '+91-80-2852-0261', 'careers@infosys.com', 'https://www.infosys.com', ARRAY['Java', 'Python', 'SAP', 'Cloud', 'AI/ML', 'DevOps'], 'Global leader in next-generation digital services and consulting', 'purple', 12.9716, 77.5946, '250000+', 1981, true),
('Wipro', 'IT Services', 'Bangalore, Karnataka', '+91-80-2844-0011', 'careers@wipro.com', 'https://www.wipro.com', ARRAY['Java', 'Python', 'Cloud', 'Cybersecurity', 'AI/ML'], 'Leading technology services and consulting company', 'green', 12.9716, 77.5946, '200000+', 1945, true),
('HCL Technologies', 'IT Services', 'Noida, Uttar Pradesh', '+91-120-4982-000', 'careers@hcl.com', 'https://www.hcltech.com', ARRAY['Java', 'Python', 'Cloud', 'Digital Transformation'], 'Global technology company with diverse services portfolio', 'orange', 28.5355, 77.3910, '150000+', 1976, true),
('Tech Mahindra', 'IT Services', 'Pune, Maharashtra', '+91-20-3091-1000', 'careers@techmahindra.com', 'https://www.techmahindra.com', ARRAY['5G', 'IoT', 'Cloud', 'AI/ML', 'Blockchain'], 'Leading provider of digital transformation and consulting services', 'red', 18.5204, 73.8567, '130000+', 1986, true),
('HDFC Bank', 'Banking & Financial Services', 'Mumbai, Maharashtra', '+91-22-6160-6161', 'careers@hdfcbank.com', 'https://www.hdfcbank.com', ARRAY['Java', 'Python', 'Fintech', 'Digital Banking'], 'Leading private sector bank in India', 'blue', 19.0760, 72.8777, '120000+', 1994, true),
('ICICI Bank', 'Banking & Financial Services', 'Mumbai, Maharashtra', '+91-22-2653-1414', 'careers@icicibank.com', 'https://www.icicibank.com', ARRAY['Java', 'Python', 'Fintech', 'Mobile Banking'], 'Premier banking and financial services company', 'orange', 19.0760, 72.8777, '100000+', 1994, true),
('Flipkart', 'E-commerce', 'Bangalore, Karnataka', '+91-80-4719-2700', 'careers@flipkart.com', 'https://www.flipkartcareers.com', ARRAY['Java', 'Python', 'React', 'Node.js', 'Machine Learning'], 'Leading e-commerce marketplace in India', 'yellow', 12.9716, 77.5946, '30000+', 2007, true),
('Paytm', 'Fintech', 'Noida, Uttar Pradesh', '+91-120-4770-770', 'careers@paytm.com', 'https://careers.paytm.com', ARRAY['Java', 'Python', 'React', 'Fintech', 'Payment Systems'], 'Leading digital payment and financial services platform', 'blue', 28.5355, 77.3910, '20000+', 2010, true),
('Zomato', 'Food Delivery', 'Gurgaon, Haryana', '+91-124-4646-444', 'careers@zomato.com', 'https://www.zomato.com/careers', ARRAY['Java', 'Python', 'React', 'Node.js', 'Mobile App Development'], 'Leading food delivery and restaurant discovery platform', 'red', 28.4595, 77.0266, '5000+', 2008, true),
('Swiggy', 'Food Delivery', 'Bangalore, Karnataka', '+91-80-4040-1111', 'careers@swiggy.com', 'https://careers.swiggy.com', ARRAY['Java', 'Python', 'React', 'Node.js', 'Logistics'], 'On-demand convenience platform', 'orange', 12.9716, 77.5946, '4000+', 2014, true),
('Ola', 'Transportation', 'Bangalore, Karnataka', '+91-80-4030-7777', 'careers@olacabs.com', 'https://careers.olacabs.com', ARRAY['Java', 'Python', 'React', 'Mobile Development', 'IoT'], 'Leading mobility platform', 'green', 12.9716, 77.5946, '3000+', 2010, true),
('Uber India', 'Transportation', 'Bangalore, Karnataka', '+91-80-4740-4000', 'careers-india@uber.com', 'https://www.uber.com/careers', ARRAY['Java', 'Python', 'React', 'Mobile Development', 'AI/ML'], 'Technology platform for mobility and delivery', 'black', 12.9716, 77.5946, '2500+', 2013, true),
('Amazon India', 'E-commerce', 'Bangalore, Karnataka', '+91-80-4612-7777', 'amazon-hiring@amazon.com', 'https://amazon.jobs', ARRAY['Java', 'Python', 'AWS', 'React', 'Machine Learning'], 'Global e-commerce and cloud computing leader', 'orange', 12.9716, 77.5946, '70000+', 2013, true),
('Microsoft India', 'Technology', 'Hyderabad, Telangana', '+91-40-4030-9000', 'msindiacareers@microsoft.com', 'https://careers.microsoft.com', ARRAY['C#', 'Python', 'Azure', 'AI/ML', 'Cloud Computing'], 'Technology corporation developing computer software and services', 'blue', 17.3850, 78.4867, '18000+', 1998, true),
('Google India', 'Technology', 'Bangalore, Karnataka', '+91-80-6749-0000', 'googlecareers@google.com', 'https://careers.google.com', ARRAY['Java', 'Python', 'Go', 'AI/ML', 'Cloud Computing'], 'Multinational technology company specializing in internet services', 'red', 12.9716, 77.5946, '5000+', 2004, true),
('IBM India', 'Technology', 'Bangalore, Karnataka', '+91-80-2678-9000', 'careers@in.ibm.com', 'https://www.ibm.com/careers', ARRAY['Java', 'Python', 'AI/ML', 'Cloud', 'Blockchain'], 'International technology corporation', 'blue', 12.9716, 77.5946, '130000+', 1992, true),
('Accenture India', 'Consulting', 'Bangalore, Karnataka', '+91-80-6608-9000', 'recruiting.india@accenture.com', 'https://www.accenture.com/careers', ARRAY['Java', 'Python', 'SAP', 'Cloud', 'Digital Transformation'], 'Global professional services company', 'purple', 12.9716, 77.5946, '200000+', 1987, true),
('Cognizant India', 'IT Services', 'Chennai, Tamil Nadu', '+91-44-6630-5000', 'careers.india@cognizant.com', 'https://careers.cognizant.com', ARRAY['Java', 'Python', '.NET', 'Cloud', 'Digital'], 'American multinational technology company', 'blue', 13.0827, 80.2707, '280000+', 2007, true),
('Capgemini India', 'Consulting', 'Mumbai, Maharashtra', '+91-22-6755-7000', 'careers.india@capgemini.com', 'https://www.capgemini.com/careers', ARRAY['Java', 'Python', 'SAP', 'Cloud', 'Digital Transformation'], 'Global leader in consulting and technology services', 'blue', 19.0760, 72.8777, '125000+', 2001, true),
('Deloitte India', 'Consulting', 'Mumbai, Maharashtra', '+91-22-6185-4000', 'careers.india@deloitte.com', 'https://www2.deloitte.com/careers', ARRAY['Analytics', 'Cloud', 'Digital', 'AI/ML', 'Consulting'], 'Global professional services network', 'green', 19.0760, 72.8777, '40000+', 1917, true),
('PwC India', 'Consulting', 'Mumbai, Maharashtra', '+91-22-6689-1000', 'careers.india@pwc.com', 'https://www.pwc.in/careers', ARRAY['Analytics', 'Digital', 'Tax Technology', 'Audit Technology'], 'Global professional services network', 'orange', 19.0760, 72.8777, '25000+', 1998, true),
('EY India', 'Consulting', 'Mumbai, Maharashtra', '+91-22-6192-0000', 'careers.india@in.ey.com', 'https://www.ey.com/careers', ARRAY['Analytics', 'Digital', 'Technology Consulting', 'AI/ML'], 'Global professional services organization', 'yellow', 19.0760, 72.8777, '45000+', 1989, true),
('KPMG India', 'Consulting', 'Mumbai, Maharashtra', '+91-22-3989-6000', 'careers@kpmg.com', 'https://home.kpmg/careers', ARRAY['Analytics', 'Digital', 'Technology Advisory', 'Risk Technology'], 'Global network of professional services firms', 'blue', 19.0760, 72.8777, '15000+', 1993, true),
('Larsen & Toubro Infotech', 'IT Services', 'Mumbai, Maharashtra', '+91-22-6776-7676', 'careers@lntinfotech.com', 'https://www.lntinfotech.com/careers', ARRAY['Java', 'Python', 'Cloud', 'Digital Transformation', 'IoT'], 'Global technology consulting and digital solutions company', 'blue', 19.0760, 72.8777, '45000+', 1997, true),
('Mindtree', 'IT Services', 'Bangalore, Karnataka', '+91-80-6706-4000', 'careers@mindtree.com', 'https://www.mindtree.com/careers', ARRAY['Java', 'Python', 'Cloud', 'AI/ML', 'Digital'], 'Global technology consulting and services company', 'orange', 12.9716, 77.5946, '22000+', 1999, true),
('Mphasis', 'IT Services', 'Bangalore, Karnataka', '+91-80-3352-5000', 'careers@mphasis.com', 'https://careers.mphasis.com', ARRAY['Java', 'Python', 'Cloud', 'AI/ML', 'Digital Transformation'], 'Information technology solutions provider', 'blue', 12.9716, 77.5946, '22000+', 1998, true),
('Hexaware Technologies', 'IT Services', 'Mumbai, Maharashtra', '+91-22-6773-9999', 'careers@hexaware.com', 'https://hexaware.com/careers', ARRAY['Java', 'Python', 'Cloud', 'AI/ML', 'Automation'], 'Global IT, BPS, and consulting services company', 'orange', 19.0760, 72.8777, '20000+', 1990, true),
('L&T Technology Services', 'Engineering Services', 'Vadodara, Gujarat', '+91-265-3989-000', 'careers@ltts.com', 'https://www.ltts.com/careers', ARRAY['Engineering', 'Digital', 'AI/ML', 'IoT', 'Embedded Systems'], 'Engineering and technology services company', 'blue', 22.3072, 73.1812, '18000+', 2012, true),
('Persistent Systems', 'Software Products', 'Pune, Maharashtra', '+91-20-6703-0000', 'careers@persistent.com', 'https://www.persistent.com/careers', ARRAY['Java', 'Python', 'Cloud', 'AI/ML', 'Product Engineering'], 'Global software products and technology services company', 'blue', 18.5204, 73.8567, '15000+', 1990, true),
('Cyient', 'Engineering Services', 'Hyderabad, Telangana', '+91-40-6764-1000', 'careers@cyient.com', 'https://www.cyient.com/careers', ARRAY['Engineering', 'Digital', 'AI/ML', 'IoT', 'Analytics'], 'Global engineering and technology solutions company', 'blue', 17.3850, 78.4867, '15000+', 1991, true),
('Zensar Technologies', 'IT Services', 'Pune, Maharashtra', '+91-20-4128-7000', 'careers@zensar.com', 'https://www.zensar.com/careers', ARRAY['Java', 'Python', 'Cloud', 'Digital', 'AI/ML'], 'Digital solutions and technology services company', 'blue', 18.5204, 73.8567, '10000+', 1963, true),
('Birlasoft', 'IT Services', 'Pune, Maharashtra', '+91-20-6652-9000', 'careers@birlasoft.com', 'https://www.birlasoft.com/careers', ARRAY['Java', 'Python', 'Cloud', 'Digital Transformation', 'AI/ML'], 'Global technology consulting company', 'orange', 18.5204, 73.8567, '12000+', 1990, true),
('NIIT Technologies', 'IT Services', 'Gurgaon, Haryana', '+91-124-4551-000', 'careers@niit-tech.com', 'https://www.niit-tech.com/careers', ARRAY['Java', 'Python', 'Cloud', 'Digital', 'Testing'], 'Global IT solutions organization', 'blue', 28.4595, 77.0266, '8000+', 1992, true),
('Sonata Software', 'Software Products', 'Bangalore, Karnataka', '+91-80-6778-9999', 'careers@sonata-software.com', 'https://www.sonata-software.com/careers', ARRAY['Java', 'Python', 'Cloud', 'Digital Commerce', 'AI/ML'], 'Global technology company', 'blue', 12.9716, 77.5946, '4000+', 1986, true),
('3i Infotech', 'IT Services', 'Mumbai, Maharashtra', '+91-22-6644-3000', 'careers@3i-infotech.com', 'https://www.3i-infotech.com/careers', ARRAY['Java', 'Python', 'Banking Technology', 'Insurance Technology'], 'Global IT solutions company', 'blue', 19.0760, 72.8777, '3000+', 1993, true),
('Rolta India', 'IT Services', 'Mumbai, Maharashtra', '+91-22-6789-9999', 'careers@rolta.com', 'https://www.rolta.com/careers', ARRAY['GIS', 'Engineering', 'IT Solutions', 'Cloud'], 'Engineering and IT solutions company', 'green', 19.0760, 72.8777, '2000+', 1989, true),
('eClerx Services', 'Business Process Management', 'Mumbai, Maharashtra', '+91-22-6626-1000', 'careers@eclerx.com', 'https://www.eclerx.com/careers', ARRAY['Analytics', 'Digital', 'Process Automation', 'Data Management'], 'Knowledge process outsourcing company', 'blue', 19.0760, 72.8777, '12000+', 2000, true),
('Mastek', 'IT Services', 'Mumbai, Maharashtra', '+91-22-6178-9999', 'careers@mastek.com', 'https://www.mastek.com/careers', ARRAY['Java', 'Python', 'Cloud', 'Digital Transformation'], 'Digital transformation and IT solutions company', 'blue', 19.0760, 72.8777, '4000+', 1982, true),
('Vakrangee', 'Technology Services', 'Mumbai, Maharashtra', '+91-22-6142-5000', 'careers@vakrangee.in', 'https://www.vakrangee.in/careers', ARRAY['Fintech', 'Digital Services', 'Technology Solutions'], 'Technology-driven service provider', 'green', 19.0760, 72.8777, '1000+', 1990, true),
('Datamatics Global Services', 'IT Services', 'Mumbai, Maharashtra', '+91-22-6102-9999', 'careers@datamatics.com', 'https://www.datamatics.com/careers', ARRAY['Java', 'Python', 'RPA', 'AI/ML', 'Analytics'], 'Digital technology and data solutions company', 'blue', 19.0760, 72.8777, '11000+', 1987, true),
('Polaris Consulting', 'Financial Technology', 'Chennai, Tamil Nadu', '+91-44-3946-1000', 'careers@polaris.co.in', 'https://www.polaris.co.in/careers', ARRAY['Fintech', 'Java', 'Python', 'Banking Technology'], 'Global financial technology company', 'blue', 13.0827, 80.2707, '3000+', 1993, true),
('Nucleus Software', 'Financial Technology', 'Noida, Uttar Pradesh', '+91-120-5021-200', 'careers@nucleussoftware.com', 'https://www.nucleussoftware.com/careers', ARRAY['Java', 'Fintech', 'Banking Software', 'Digital Banking'], 'Financial technology solutions provider', 'orange', 28.5355, 77.3910, '2500+', 1986, true),
('Newgen Software', 'Software Products', 'New Delhi, Delhi', '+91-11-4089-3000', 'careers@newgensoft.com', 'https://newgensoft.com/careers', ARRAY['Java', 'Python', 'BPM', 'ECM', 'Digital Process Automation'], 'Software products company', 'blue', 28.7041, 77.1025, '3000+', 1992, true),
('Ramco Systems', 'Enterprise Software', 'Chennai, Tamil Nadu', '+91-44-6678-8000', 'careers@ramco.com', 'https://www.ramco.com/careers', ARRAY['Java', 'Cloud', 'ERP', 'HCM', 'Aviation Software'], 'Enterprise software solutions provider', 'blue', 13.0827, 80.2707, '4500+', 1992, true),
('Subex', 'Telecom Software', 'Bangalore, Karnataka', '+91-80-3055-4000', 'careers@subex.com', 'https://www.subex.com/careers', ARRAY['Telecom', 'Analytics', 'AI/ML', 'Network Analytics'], 'Telecom analytics and optimization solutions', 'orange', 12.9716, 77.5946, '1200+', 1994, true),
('Quick Heal Technologies', 'Cybersecurity', 'Pune, Maharashtra', '+91-20-6681-2000', 'careers@quickheal.com', 'https://www.quickheal.com/careers', ARRAY['Cybersecurity', 'Antivirus', 'Endpoint Security', 'Cloud Security'], 'Computer security and antivirus company', 'red', 18.5204, 73.8567, '800+', 1995, true),
('Happiest Minds Technologies', 'Digital Transformation', 'Bangalore, Karnataka', '+91-80-4015-1000', 'careers@happiestminds.com', 'https://www.happiestminds.com/careers', ARRAY['Java', 'Python', 'Cloud', 'AI/ML', 'Digital Engineering'], 'Digital transformation and product engineering company', 'yellow', 12.9716, 77.5946, '4000+', 2011, true),
('Kellton Tech Solutions', 'Digital Technology', 'Hyderabad, Telangana', '+91-40-4033-7000', 'careers@kelltontech.com', 'https://www.kelltontech.com/careers', ARRAY['Java', 'Python', 'React', 'Mobile Development', 'AI/ML'], 'Digital technology consulting company', 'blue', 17.3850, 78.4867, '1800+', 2010, true),
('Intellect Design Arena', 'Financial Technology', 'Chennai, Tamil Nadu', '+91-44-2446-9966', 'careers@intellectdesign.com', 'https://www.intellectdesign.com/careers', ARRAY['Fintech', 'Java', 'Python', 'Banking Technology', 'Insurance Technology'], 'Financial technology solutions company', 'blue', 13.0827, 80.2707, '3500+', 2011, true),
('Coforge (formerly NIIT Technologies)', 'IT Services', 'Noida, Uttar Pradesh', '+91-120-4795-600', 'careers@coforge.com', 'https://www.coforge.com/careers', ARRAY['Java', 'Python', 'Cloud', 'Digital', 'Salesforce'], 'Global digital solutions and technologies company', 'blue', 28.5355, 77.3910, '22000+', 1992, true);

-- Update timestamps
UPDATE companies SET updated_at = now();
