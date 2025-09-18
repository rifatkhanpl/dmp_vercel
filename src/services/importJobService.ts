import { supabase } from './supabaseClient';
import { errorService } from './errorService';

export interface ImportJob {
  id: string;
  type: 'template' | 'ai-map' | 'url';
  status: 'processing' | 'completed' | 'failed' | 'partial';
  file_name?: string;
  source_url?: string;
  file_size?: number;
  file_hash?: string;
  total_records: number;
  success_count: number;
  error_count: number;
  warning_count: number;
  created_by?: string;
  created_at: string;
  completed_at?: string;
  processing_time_ms?: number;
  metadata?: any;
  created_by_name?: string;
}

export interface ValidationError {
  id: string;
  import_job_id?: string;
  row_number: number;
  field_name: string;
  error_message: string;
  severity: 'error' | 'warning';
  field_value?: string;
  created_at: string;
}

export interface ImportJobFilters {
  type?: string;
  status?: string;
  createdBy?: string;
  dateRange?: string;
  limit?: number;
  offset?: number;
}

export class ImportJobService {
  static async getImportJobs(filters: ImportJobFilters = {}): Promise<{ data: ImportJob[], total: number }> {
    try {
      let query = supabase
        .from('import_job_summary')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.createdBy) {
        query = query.ilike('created_by_name', `%${filters.createdBy}%`);
      }

      // Date range filter
      if (filters.dateRange) {
        const daysAgo = parseInt(filters.dateRange.replace('d', ''));
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
        query = query.gte('created_at', cutoffDate.toISOString());
      }

      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
      }

      // Order by created_at descending
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching import jobs:', error);
      errorService.showError('Failed to fetch import jobs');
      return { data: [], total: 0 };
    }
  }

  static async getImportJob(id: string): Promise<ImportJob | null> {
    try {
      const { data, error } = await supabase
        .from('import_job_summary')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching import job:', error);
      errorService.showError('Failed to fetch import job');
      return null;
    }
  }

  static async getValidationErrors(jobId: string): Promise<ValidationError[]> {
    try {
      const { data, error } = await supabase
        .from('validation_errors')
        .select('*')
        .eq('import_job_id', jobId)
        .order('row_number', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching validation errors:', error);
      errorService.showError('Failed to fetch validation errors');
      return [];
    }
  }

  static async createImportJob(jobData: Partial<ImportJob>): Promise<ImportJob | null> {
    try {
      const { data, error } = await supabase
        .from('import_jobs')
        .insert([{
          ...jobData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating import job:', error);
      errorService.showError('Failed to create import job');
      return null;
    }
  }

  static async updateImportJob(id: string, updates: Partial<ImportJob>): Promise<ImportJob | null> {
    try {
      const { data, error } = await supabase
        .from('import_jobs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating import job:', error);
      errorService.showError('Failed to update import job');
      return null;
    }
  }

  static async deleteImportJob(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('import_jobs')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting import job:', error);
      errorService.showError('Failed to delete import job');
      return false;
    }
  }

  static async retryImportJob(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('import_jobs')
        .update({ 
          status: 'processing',
          error_count: 0,
          warning_count: 0,
          completed_at: null
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error retrying import job:', error);
      errorService.showError('Failed to retry import job');
      return false;
    }
  }
}