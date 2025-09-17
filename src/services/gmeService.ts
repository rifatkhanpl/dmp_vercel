import { supabase } from './supabaseClient';
import { errorService } from './errorService';
import { GMEProgram, GMEInstitution } from '../types/gme';

export class GMEService {
  /**
   * Get all GME programs with filtering
   */
  static async getPrograms(filters: {
    search?: string;
    specialty?: string;
    state?: string;
    programType?: string;
    institution?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      let query = supabase
        .from('gme_programs')
        .select('*');

      // Apply filters
      if (filters.search) {
        query = query.or(`program_name.ilike.%${filters.search}%,institution.ilike.%${filters.search}%,specialty.ilike.%${filters.search}%`);
      }
      if (filters.specialty) {
        query = query.eq('specialty', filters.specialty);
      }
      if (filters.state) {
        query = query.eq('state', filters.state);
      }
      if (filters.programType) {
        query = query.eq('program_type', filters.programType);
      }
      if (filters.institution) {
        query = query.eq('institution', filters.institution);
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch programs: ${error.message}`);
      }

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      errorService.logError(error as Error, { context: 'GME programs fetch', filters });
      throw error;
    }
  }

  /**
   * Get GME business review data
   */
  static async getBusinessReviewData(filters: {
    search?: string;
    specialty?: string;
    state?: string;
    programType?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      let query = supabase
        .from('gme_business_review_data')
        .select('*');

      // Apply filters
      if (filters.search) {
        query = query.or(`program_name.ilike.%${filters.search}%,institution.ilike.%${filters.search}%,specialty.ilike.%${filters.search}%`);
      }
      if (filters.specialty) {
        query = query.eq('specialty', filters.specialty);
      }
      if (filters.state) {
        query = query.eq('state', filters.state);
      }
      if (filters.programType) {
        query = query.eq('program_type', filters.programType);
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Failed to fetch business review data: ${error.message}`);
      }

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      errorService.logError(error as Error, { context: 'GME business review fetch', filters });
      throw error;
    }
  }

  /**
   * Get program statistics
   */
  static async getProgramStats() {
    try {
      const { data, error } = await supabase
        .rpc('get_program_statistics');

      if (error) {
        throw new Error(`Failed to get program statistics: ${error.message}`);
      }

      return data;
    } catch (error) {
      errorService.logError(error as Error, { context: 'Program statistics fetch' });
      throw error;
    }
  }
}