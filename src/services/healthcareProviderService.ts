import { supabase } from './supabaseClient';
import { errorService } from './errorService';
import { SecurityUtils } from '../utils/security';

export interface HealthcareProvider {
  id: string;
  npi: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  credentials: string;
  gender?: string;
  date_of_birth?: string;
  email?: string;
  phone?: string;
  alternate_phone?: string;
  practice_address_1: string;
  practice_address_2?: string;
  practice_city: string;
  practice_state: string;
  practice_zip: string;
  mailing_address_1: string;
  mailing_address_2?: string;
  mailing_city: string;
  mailing_state: string;
  mailing_zip: string;
  primary_specialty: string;
  secondary_specialty?: string;
  taxonomy_code?: string;
  license_state: string;
  license_number: string;
  license_issue_date?: string;
  license_expire_date?: string;
  board_name?: string;
  certificate_name?: string;
  certification_start_date?: string;
  program_name?: string;
  institution?: string;
  program_type?: string;
  training_start_date?: string;
  training_end_date?: string;
  pgy_year?: string;
  dea_number?: string;
  medicare_number?: string;
  medicaid_number?: string;
  sole_proprietor?: boolean;
  source_type: string;
  source_artifact?: string;
  source_url?: string;
  source_fetch_date?: string;
  source_hash?: string;
  status: string;
  duplicate_of?: string;
  entered_by?: string;
  entered_at?: string;
  last_modified_by?: string;
  last_modified_at?: string;
  entered_by_user?: {
    first_name: string;
    last_name: string;
  };
}

export interface ProviderFilters {
  search?: string;
  specialty?: string;
  state?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface ProviderResponse {
  data: HealthcareProvider[];
  total: number;
}

export class HealthcareProviderService {
  static async getProviders(filters: ProviderFilters = {}): Promise<ProviderResponse> {
    try {
      let query = supabase
        .from('healthcare_providers')
        .select(`
          *,
          entered_by_user:users!healthcare_providers_entered_by_fkey(
            first_name,
            last_name
          )
        `, { count: 'exact' });

      // Apply filters
      if (filters.search) {
        const sanitizedSearch = SecurityUtils.sanitizeText(filters.search);
        query = query.or(`first_name.ilike.%${sanitizedSearch}%,last_name.ilike.%${sanitizedSearch}%,primary_specialty.ilike.%${sanitizedSearch}%,npi.ilike.%${sanitizedSearch}%`);
      }

      if (filters.specialty) {
        query = query.eq('primary_specialty', filters.specialty);
      }

      if (filters.state) {
        query = query.eq('practice_state', filters.state);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
      }

      // Order by last modified
      query = query.order('last_modified_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      errorService.logError(error as Error, { context: 'getProviders', filters });
      throw new Error('Failed to fetch healthcare providers');
    }
  }

  static async getProviderById(id: string): Promise<HealthcareProvider | null> {
    try {
      const sanitizedId = SecurityUtils.sanitizeText(id);
      
      const { data, error } = await supabase
        .from('healthcare_providers')
        .select(`
          *,
          entered_by_user:users!healthcare_providers_entered_by_fkey(
            first_name,
            last_name
          )
        `)
        .eq('id', sanitizedId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw error;
      }

      return data;
    } catch (error) {
      errorService.logError(error as Error, { context: 'getProviderById', id });
      throw new Error('Failed to fetch healthcare provider');
    }
  }

  static async createProvider(providerData: Partial<HealthcareProvider>, userId: string): Promise<HealthcareProvider> {
    try {
      // Sanitize all input data
      const sanitizedData = Object.keys(providerData).reduce((acc, key) => {
        const value = providerData[key as keyof HealthcareProvider];
        if (typeof value === 'string') {
          acc[key] = SecurityUtils.sanitizeText(value);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      // Set metadata
      sanitizedData.entered_by = userId;
      sanitizedData.last_modified_by = userId;
      sanitizedData.entered_at = new Date().toISOString();
      sanitizedData.last_modified_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('healthcare_providers')
        .insert([sanitizedData])
        .select(`
          *,
          entered_by_user:users!healthcare_providers_entered_by_fkey(
            first_name,
            last_name
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      errorService.logError(error as Error, { context: 'createProvider', providerData });
      throw new Error('Failed to create healthcare provider');
    }
  }

  static async updateProvider(id: string, updates: Partial<HealthcareProvider>, userId: string): Promise<HealthcareProvider> {
    try {
      const sanitizedId = SecurityUtils.sanitizeText(id);
      
      // Sanitize all update data
      const sanitizedUpdates = Object.keys(updates).reduce((acc, key) => {
        const value = updates[key as keyof HealthcareProvider];
        if (typeof value === 'string') {
          acc[key] = SecurityUtils.sanitizeText(value);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      // Set metadata
      sanitizedUpdates.last_modified_by = userId;
      sanitizedUpdates.last_modified_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('healthcare_providers')
        .update(sanitizedUpdates)
        .eq('id', sanitizedId)
        .select(`
          *,
          entered_by_user:users!healthcare_providers_entered_by_fkey(
            first_name,
            last_name
          )
        `)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      errorService.logError(error as Error, { context: 'updateProvider', id, updates });
      throw new Error('Failed to update healthcare provider');
    }
  }

  static async deleteProvider(id: string): Promise<void> {
    try {
      const sanitizedId = SecurityUtils.sanitizeText(id);
      
      const { error } = await supabase
        .from('healthcare_providers')
        .delete()
        .eq('id', sanitizedId);

      if (error) {
        throw error;
      }
    } catch (error) {
      errorService.logError(error as Error, { context: 'deleteProvider', id });
      throw new Error('Failed to delete healthcare provider');
    }
  }

  static async searchProviders(query: string, limit: number = 50): Promise<HealthcareProvider[]> {
    try {
      const sanitizedQuery = SecurityUtils.sanitizeText(query);
      
      const { data, error } = await supabase
        .from('healthcare_providers')
        .select(`
          *,
          entered_by_user:users!healthcare_providers_entered_by_fkey(
            first_name,
            last_name
          )
        `)
        .or(`first_name.ilike.%${sanitizedQuery}%,last_name.ilike.%${sanitizedQuery}%,primary_specialty.ilike.%${sanitizedQuery}%,npi.ilike.%${sanitizedQuery}%,email.ilike.%${sanitizedQuery}%`)
        .limit(limit)
        .order('last_modified_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      errorService.logError(error as Error, { context: 'searchProviders', query });
      throw new Error('Failed to search healthcare providers');
    }
  }

  static async getProvidersBySpecialty(specialty: string, limit: number = 50): Promise<HealthcareProvider[]> {
    try {
      const sanitizedSpecialty = SecurityUtils.sanitizeText(specialty);
      
      const { data, error } = await supabase
        .from('healthcare_providers')
        .select(`
          *,
          entered_by_user:users!healthcare_providers_entered_by_fkey(
            first_name,
            last_name
          )
        `)
        .eq('primary_specialty', sanitizedSpecialty)
        .limit(limit)
        .order('last_modified_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      errorService.logError(error as Error, { context: 'getProvidersBySpecialty', specialty });
      throw new Error('Failed to fetch providers by specialty');
    }
  }

  static async getProviderStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    bySpecialty: Record<string, number>;
  }> {
    try {
      // Get total count
      const { count: total, error: totalError } = await supabase
        .from('healthcare_providers')
        .select('*', { count: 'exact', head: true });

      if (totalError) {
        throw totalError;
      }

      // Get counts by status
      const { data: statusData, error: statusError } = await supabase
        .from('healthcare_providers')
        .select('status')
        .not('status', 'is', null);

      if (statusError) {
        throw statusError;
      }

      const byStatus = statusData.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get counts by specialty
      const { data: specialtyData, error: specialtyError } = await supabase
        .from('healthcare_providers')
        .select('primary_specialty')
        .not('primary_specialty', 'is', null);

      if (specialtyError) {
        throw specialtyError;
      }

      const bySpecialty = specialtyData.reduce((acc, item) => {
        acc[item.primary_specialty] = (acc[item.primary_specialty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        total: total || 0,
        byStatus,
        bySpecialty
      };
    } catch (error) {
      errorService.logError(error as Error, { context: 'getProviderStats' });
      throw new Error('Failed to fetch provider statistics');
    }
  }
}