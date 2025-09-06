export interface Company {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  category: string;
  rating?: number;
  priceLevel?: number;
  lat: number;
  lng: number;
  placeId: string;
  businessStatus?: string;
  openingHours?: string[];
  photos?: string[];
  source?: string; // Track where the company data came from
}

export interface SearchParams {
  location: string;
  skills: string[];
  radius: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface SearchResult {
  id: string;
  searchParams: SearchParams;
  companies: Company[];
  createdAt: string;
  totalResults: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}