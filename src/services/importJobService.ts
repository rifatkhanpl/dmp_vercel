import { supabase } from './supabaseClient';
import { errorService } from './errorService';
import { ImportJob, ValidationError } from '../types/dmp';

export class ImportJobService {
  /**
   * Create a new import job
   */
  static async createImportJob(jobData: {
    type: 'template' | 'ai-map' | 'url';
    fileName?: string;
    sourceUrl?: string;
    fileSize?: number;
    fileHash?: string;
    metadata?: Record<string, any>;
  }, userId: string): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('import_jobs')
        .insert({
          id: `job_${Date.now()}`,
          type: jobData.type,
          status: 'processing',
          file_name: jobData.fileName,
          source_url: jobData.sourceUrl,
          file_size: jobData.fileSize,
          file_hash: jobData.fileHash,
          total_records: 0,
          success_count: 0,
          error_count: 0,
          warning_count: 0,
          created_by: userId,
          metadata: jobData.metadata || {}
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(`Failed to create import job: ${error.message}`);
      }

      return data.id;
    } catch (error) {
      errorService.logError(error as Error, { context: 'Import job creation', jobData, userId });
      throw error;
    }
  }

  /**
   * Update import job status and results
   */
  static async updateImportJob(jobId: string, updates: {
    status?: 'processing' | 'completed' | 'failed' | 'partial';
    totalRecords?: number;
    successCount?: number;
    errorCount?: number;
    warningCount?: number;
    processingTimeMs?: number;
    metadata?: Record<string, any>;
  }) {
    try {
      const updateData: any = {
        ...updates,
        completed_at: ['completed', 'failed', 'partial'].includes(updates.status || '') 
          ? new Date().toISOString() 
          : undefined
      };

      if (updates.processingTimeMs) {
        updateData.processing_time_ms = updates.processingTimeMs;
      }

      const { error } = await supabase
        .from('import_jobs')
        .update(updateData)
        .eq('id', jobId);

      if (error) {
        throw new Error(`Failed to update import job: ${error.message}`);
      }
    } catch (error) {
      errorService.logError(error as Error, { context: 'Import job update', jobId, updates });
      throw error;
    }
  }

  /**
   * Add validation errors to an import job
   */
  static async addValidationErrors(jobId: string, errors: ValidationError[]) {
    try {
      const errorsToInsert = errors.map(error => ({
        import_job_id: jobId,
        row_number: error.row,
        field_name: error.field,
        error_message: error.message,
        severity: error.severity,
        field_value: error.value
      }));

      const { error } = await supabase
        .from('validation_errors')
        .insert(errorsToInsert);

      if (error) {
        throw new Error(`Failed to add validation errors: ${error.message}`);
      }
    } catch (error) {
      errorService.logError(error as Error, { context: 'Validation errors insert', jobId, errorCount: errors.length });
      throw error;
    }
  }

  /**
   * Get import jobs with filtering
   */
  static async getImportJobs(filters: {
    type?: string;
    status?: string;
    createdBy?: string;
    dateRange?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      let query = supabase
        .from('import_job_summary')
        .select('*')
        .order('created_at', { ascending: false });

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
      if (filters.dateRange) {
        const days = parseInt(filters.dateRange.replace('d', ''));
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        query = query.gte('created_at', cutoffDate.toISOString());
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
        throw new Error(`Failed to fetch import jobs: ${error.message}`);
      }

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      errorService.logError(error as Error, { context: 'Import jobs fetch', filters });
      throw error;
    }
  }

  /**
   * Get validation errors for a specific job
   */
  static async getValidationErrors(jobId: string) {
    try {
      const { data, error } = await supabase
        .from('validation_errors')
        .select('*')
        .eq('import_job_id', jobId)
        .order('row_number', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch validation errors: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      errorService.logError(error as Error, { context: 'Validation errors fetch', jobId });
      throw error;
    }
  }
}