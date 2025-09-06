import { supabase } from '../lib/supabase';
import { SearchResult, SearchParams, Company } from '../types';

export const saveSearchResult = async (
  searchParams: SearchParams,
  companies: Company[]
): Promise<SearchResult | null> => {
  try {
    console.log('Saving search result with params:', searchParams);
    console.log('Number of companies:', companies.length);
    
    const searchResult = {
      search_params: searchParams,
      companies: companies,
      total_results: companies.length,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('search_results')
      .insert([searchResult])
      .select()
      .single();

    if (error) {
      console.error('Error saving search result:', error.message, error.details, error.hint);
      return null;
    }

    console.log('Search result saved successfully:', data.id);
    return {
      id: data.id,
      searchParams: data.search_params,
      companies: data.companies,
      createdAt: data.created_at,
      totalResults: data.total_results
    };
  } catch (error) {
    console.error('Database error:', error instanceof Error ? error.message : error);
    return null;
  }
};

export const getSearchHistory = async (limit: number = 10): Promise<SearchResult[]> => {
  try {
    const { data, error } = await supabase
      .from('search_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching search history:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      searchParams: item.search_params,
      companies: item.companies,
      createdAt: item.created_at,
      totalResults: item.total_results
    }));
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
};

export const deleteSearchResult = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('search_results')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting search result:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Database error:', error);
    return false;
  }
};