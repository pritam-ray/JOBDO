# InternFinder - Local Internship Opportunity Finder

InternFinder is a comprehensive web application that helps students and job seekers discover local companies offering internship opportunities based on their location and skills.

## Features

- **Location-Based Search**: Find companies within a specified radius of any location
- **Skills Filtering**: Filter results based on skills and interests (AI/ML, Web Development, etc.)
- **Comprehensive Company Data**: Extract company names, addresses, phone numbers, emails, and ratings
- **Export Functionality**: Download results in Excel or CSV format
- **Free API Integration**: Uses OpenStreetMap and free business directories for company data
- **Database Storage**: Store and retrieve search results using Supabase
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Maps & Places**: OpenStreetMap / Nominatim API / Overpass API
- **Database**: Supabase (PostgreSQL)
- **File Export**: XLSX library for Excel/CSV generation
- **Icons**: Lucide React

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

### 2. Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Add them to your `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### 3. Database Schema

**IMPORTANT**: You must create the database table before using the application.

#### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** tab
3. Copy and paste the following SQL code:

```sql
/*
  # Create search results table

  1. New Tables
    - `search_results`
      - `id` (uuid, primary key)
      - `search_params` (jsonb) - stores search parameters
      - `companies` (jsonb array) - stores company data as array
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
```

4. Click **Run** to execute the SQL
5. Verify the table was created by checking the **Table Editor** tab

#### Option 2: Using Migration File
The SQL migration file is also available at `supabase/migrations/create_search_results.sql` in your project.

#### Troubleshooting Database Setup
If you encounter errors:
1. **Check your environment variables** in `.env` file
2. **Verify Supabase URL and API key** are correct
3. **Ensure the table exists** in your Supabase dashboard
4. **Check RLS policies** are properly configured
5. **Look at browser console** for detailed error messages

### 4. Installation & Running

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

## Usage

1. **Enter Location**: Type in a city, address, or use current location
2. **Select Skills**: Choose from predefined skills or add custom ones
3. **Set Search Radius**: Adjust the search radius (1-50 km)
4. **Search**: Click "Find Companies" to start the search
5. **View Results**: Browse through the company cards with detailed information
6. **Export Data**: Download results in Excel or CSV format

## API Integration

### Free APIs Used

The application uses several free APIs:
- **Nominatim (OpenStreetMap)**: For geocoding addresses to coordinates
- **Overpass API**: For searching nearby businesses from OpenStreetMap data
- **DuckDuckGo Instant Answer**: For finding company websites
- **Business Directory APIs**: For additional company information

### Rate Limiting

The app implements rate limiting to respect free API quotas:
- Delays between API calls
- Limited results per search
- Efficient caching mechanisms

## File Export Features

### Excel Export
- Comprehensive company data in spreadsheet format
- Properly formatted columns with headers
- Automatic column width adjustment

### CSV Export
- Plain text format for universal compatibility
- Easy import into other applications
- Lightweight file size

## Data Fields

Each company record includes:
- Company Name
- Full Address
- Phone Number (when available)
- Email Address (estimated based on website)
- Website URL
- Business Category
- Google Rating
- Business Status
- Coordinates
- Opening Hours
- Photos

## Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
Ensure all environment variables are properly set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Legal Considerations

- Ensure compliance with OpenStreetMap and Nominatim usage policies
- Respect rate limits and usage quotas
- Follow data privacy regulations (GDPR, etc.)
- Implement proper attribution for OpenStreetMap data

## Troubleshooting

### Common Issues

1. **API Rate Limits**: Free APIs have rate limits - the app includes delays to respect these
2. **CORS Issues**: Some APIs may have CORS restrictions - the app handles these gracefully
3. **No Results**: Try expanding the search radius or selecting different skills
4. **Database Errors**: Check your Supabase configuration and table permissions

### Debug Mode

Set additional logging by adding to your `.env`:
```
VITE_DEBUG=true
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support or questions, please contact support@internfinder.com or create an issue in the repository.