import { supabase } from './supabaseClient';
import { UserProductionMetric, MetricDefinition, MetricSummary, DashboardMetrics, MetricFilter, MetricSort } from '../types/metrics';
import { errorService } from './errorService';

export class MetricsService {
  /**
   * Log a production metric for a user
   */
  static async logMetric(
    userId: string,
    metricType: string,
    value: number,
    options: {
      dimension?: string;
      attribute?: string;
      unit?: string;
      periodStart?: Date;
      periodEnd?: Date;
      metadata?: Record<string, any>;
    } = {}
  ): Promise<void> {
    try {
      const now = new Date();
      const periodStart = options.periodStart || now;
      const periodEnd = options.periodEnd || now;

      const { error } = await supabase
        .from('user_production_metrics')
        .insert({
          user_id: userId,
          metric_type: metricType,
          dimension: options.dimension || 'general',
          attribute: options.attribute,
          value,
          unit: options.unit || 'count',
          period_start: periodStart.toISOString(),
          period_end: periodEnd.toISOString(),
          metadata: options.metadata || {}
        });

      if (error) {
        throw new Error(`Failed to log metric: ${error.message}`);
      }
    } catch (error) {
      errorService.logError(error as Error, { 
        context: 'Metric logging', 
        userId, 
        metricType, 
        value 
      });
      // Don't throw - metrics logging should not break user workflows
    }
  }

  /**
   * Get dashboard metrics summary
   */
  static async getDashboardMetrics(timeRange: string = '30d'): Promise<DashboardMetrics> {
    try {
      const days = parseInt(timeRange.replace('d', ''));
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get summary stats
      const { data: summaryData, error: summaryError } = await supabase
        .rpc('get_metrics_dashboard_summary', {
          start_date: startDate.toISOString(),
          end_date: new Date().toISOString()
        });

      if (summaryError) {
        throw new Error(`Failed to get dashboard summary: ${summaryError.message}`);
      }

      // Get top performers
      const { data: topPerformers, error: performersError } = await supabase
        .rpc('get_top_performers', {
          start_date: startDate.toISOString(),
          end_date: new Date().toISOString(),
          limit_count: 10
        });

      if (performersError) {
        throw new Error(`Failed to get top performers: ${performersError.message}`);
      }

      // Get dimension summaries
      const { data: dimensionData, error: dimensionError } = await supabase
        .rpc('get_dimension_summaries', {
          start_date: startDate.toISOString(),
          end_date: new Date().toISOString()
        });

      if (dimensionError) {
        throw new Error(`Failed to get dimension summaries: ${dimensionError.message}`);
      }

      // Get recent activity
      const { data: recentActivity, error: activityError } = await supabase
        .from('user_production_metrics')
        .select(`
          id,
          user_id,
          metric_type,
          value,
          unit,
          created_at,
          users!inner(first_name, last_name)
        `)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

      if (activityError) {
        throw new Error(`Failed to get recent activity: ${activityError.message}`);
      }

      return {
        summary: summaryData?.[0] || {
          totalUsers: 0,
          activeUsers: 0,
          totalMetrics: 0,
          averagePerformance: 0
        },
        topPerformers: topPerformers || [],
        dimensionSummaries: this.groupByDimension(dimensionData || []),
        recentActivity: (recentActivity || []).map(item => ({
          id: item.id,
          userId: item.user_id,
          userName: `${item.users.first_name} ${item.users.last_name}`,
          metricType: item.metric_type,
          value: item.value,
          unit: item.unit,
          createdAt: item.created_at
        }))
      };
    } catch (error) {
      errorService.logError(error as Error, { context: 'Dashboard metrics fetch' });
      throw error;
    }
  }

  /**
   * Search and filter metrics
   */
  static async searchMetrics(
    filters: MetricFilter = {},
    sort: MetricSort = { field: 'createdAt', direction: 'desc' },
    page: number = 1,
    pageSize: number = 50
  ): Promise<{ data: UserProductionMetric[]; total: number }> {
    try {
      let query = supabase
        .from('user_production_metrics')
        .select(`
          *,
          users!inner(first_name, last_name, email, role),
          metric_definitions(display_name, description, target_value)
        `, { count: 'exact' });

      // Apply filters
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.metricType) {
        query = query.eq('metric_type', filters.metricType);
      }
      if (filters.dimension) {
        query = query.eq('dimension', filters.dimension);
      }
      if (filters.unit) {
        query = query.eq('unit', filters.unit);
      }
      if (filters.minValue !== undefined) {
        query = query.gte('value', filters.minValue);
      }
      if (filters.maxValue !== undefined) {
        query = query.lte('value', filters.maxValue);
      }
      if (filters.dateRange) {
        const days = parseInt(filters.dateRange.replace('d', ''));
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        query = query.gte('created_at', startDate.toISOString());
      }

      // Apply sorting
      const sortField = sort.field === 'userName' ? 'users.first_name' : sort.field;
      query = query.order(sortField, { ascending: sort.direction === 'asc' });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Failed to search metrics: ${error.message}`);
      }

      const transformedData: UserProductionMetric[] = (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        metricType: item.metric_type,
        dimension: item.dimension,
        attribute: item.attribute,
        value: item.value,
        unit: item.unit,
        periodStart: item.period_start,
        periodEnd: item.period_end,
        metadata: item.metadata,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        user: {
          firstName: item.users.first_name,
          lastName: item.users.last_name,
          email: item.users.email,
          role: item.users.role
        },
        definition: item.metric_definitions ? {
          id: '',
          metricType: item.metric_type,
          displayName: item.metric_definitions.display_name,
          description: item.metric_definitions.description,
          dimension: item.dimension,
          unit: item.unit,
          targetValue: item.metric_definitions.target_value,
          isActive: true,
          createdAt: '',
          updatedAt: ''
        } : undefined
      }));

      return {
        data: transformedData,
        total: count || 0
      };
    } catch (error) {
      errorService.logError(error as Error, { context: 'Metrics search', filters, sort });
      throw error;
    }
  }

  /**
   * Get metric definitions
   */
  static async getMetricDefinitions(): Promise<MetricDefinition[]> {
    try {
      const { data, error } = await supabase
        .from('metric_definitions')
        .select('*')
        .eq('is_active', true)
        .order('dimension', { ascending: true })
        .order('display_name', { ascending: true });

      if (error) {
        throw new Error(`Failed to get metric definitions: ${error.message}`);
      }

      return (data || []).map(item => ({
        id: item.id,
        metricType: item.metric_type,
        displayName: item.display_name,
        description: item.description,
        dimension: item.dimension,
        unit: item.unit,
        calculationMethod: item.calculation_method,
        targetValue: item.target_value,
        isActive: item.is_active,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      errorService.logError(error as Error, { context: 'Metric definitions fetch' });
      throw error;
    }
  }

  /**
   * Bulk log metrics for common operations
   */
  static async logProviderRegistration(userId: string, providerId: string, specialty: string): Promise<void> {
    const now = new Date();
    await Promise.all([
      this.logMetric(userId, 'providers_registered', 1, {
        dimension: 'productivity',
        attribute: specialty,
        metadata: { providerId, specialty }
      }),
      this.logMetric(userId, 'specialty_coverage', 1, {
        dimension: 'coverage',
        attribute: specialty,
        metadata: { providerId, specialty }
      })
    ]);
  }

  static async logBulkImport(userId: string, jobId: string, successCount: number, errorCount: number, processingTimeMs: number): Promise<void> {
    const processingTimeMinutes = processingTimeMs / (1000 * 60);
    await Promise.all([
      this.logMetric(userId, 'bulk_imports_completed', 1, {
        dimension: 'productivity',
        metadata: { jobId, successCount, errorCount }
      }),
      this.logMetric(userId, 'records_processed', successCount, {
        dimension: 'productivity',
        metadata: { jobId, errorCount }
      }),
      this.logMetric(userId, 'processing_time_avg', processingTimeMinutes, {
        dimension: 'efficiency',
        unit: 'minutes',
        metadata: { jobId, recordCount: successCount + errorCount }
      }),
      this.logMetric(userId, 'data_validation_rate', (successCount / (successCount + errorCount)) * 100, {
        dimension: 'quality',
        unit: 'percentage',
        metadata: { jobId, successCount, errorCount }
      })
    ]);
  }

  static async logSystemUsage(userId: string, sessionDurationMinutes: number, featuresUsed: string[]): Promise<void> {
    await Promise.all([
      this.logMetric(userId, 'system_logins', 1, {
        dimension: 'engagement',
        metadata: { sessionDuration: sessionDurationMinutes, featuresUsed }
      }),
      this.logMetric(userId, 'session_duration_avg', sessionDurationMinutes, {
        dimension: 'engagement',
        unit: 'minutes',
        metadata: { featuresUsed }
      }),
      this.logMetric(userId, 'feature_usage_rate', featuresUsed.length, {
        dimension: 'engagement',
        attribute: 'features_used',
        metadata: { featuresUsed }
      })
    ]);
  }

  /**
   * Helper method to group metrics by dimension
   */
  private static groupByDimension(data: any[]): Record<string, MetricSummary[]> {
    const grouped: Record<string, MetricSummary[]> = {};
    
    for (const item of data) {
      if (!grouped[item.dimension]) {
        grouped[item.dimension] = [];
      }
      grouped[item.dimension].push(item);
    }
    
    return grouped;
  }

  /**
   * Calculate achievement rate against targets
   */
  static calculateAchievementRate(value: number, target?: number, unit: string = 'count'): number | undefined {
    if (!target) return undefined;
    
    // For percentage metrics, direct comparison
    if (unit === 'percentage') {
      return Math.min((value / target) * 100, 100);
    }
    
    // For count metrics, direct comparison
    if (unit === 'count') {
      return Math.min((value / target) * 100, 100);
    }
    
    // For time metrics (lower is better for some)
    if (unit === 'minutes' || unit === 'hours') {
      // Assume lower is better for processing time
      return target > 0 ? Math.max(100 - ((value - target) / target) * 100, 0) : 0;
    }
    
    return (value / target) * 100;
  }

  /**
   * Export metrics data
   */
  static async exportMetrics(
    filters: MetricFilter = {},
    format: 'csv' | 'json' = 'csv'
  ): Promise<string> {
    try {
      const { data } = await this.searchMetrics(filters, { field: 'createdAt', direction: 'desc' }, 1, 10000);
      
      if (format === 'json') {
        return JSON.stringify(data, null, 2);
      }
      
      // CSV format
      const headers = [
        'User Name',
        'Email',
        'Role',
        'Metric Type',
        'Display Name',
        'Dimension',
        'Value',
        'Unit',
        'Target',
        'Achievement %',
        'Period Start',
        'Period End',
        'Created At'
      ];
      
      const rows = data.map(metric => [
        `${metric.user?.firstName} ${metric.user?.lastName}`,
        metric.user?.email || '',
        metric.user?.role || '',
        metric.metricType,
        metric.definition?.displayName || metric.metricType,
        metric.dimension,
        metric.value.toString(),
        metric.unit,
        metric.definition?.targetValue?.toString() || '',
        metric.definition?.targetValue 
          ? this.calculateAchievementRate(metric.value, metric.definition.targetValue, metric.unit)?.toFixed(1) + '%'
          : '',
        metric.periodStart,
        metric.periodEnd,
        metric.createdAt
      ]);
      
      return [headers, ...rows]
        .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
        .join('\n');
    } catch (error) {
      errorService.logError(error as Error, { context: 'Metrics export', filters, format });
      throw error;
    }
  }

  /**
   * Delete metrics (admin only)
   */
  static async deleteMetrics(metricIds: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_production_metrics')
        .delete()
        .in('id', metricIds);

      if (error) {
        throw new Error(`Failed to delete metrics: ${error.message}`);
      }
    } catch (error) {
      errorService.logError(error as Error, { context: 'Metrics deletion', metricIds });
      throw error;
    }
  }

  /**
   * Update metric value (admin only)
   */
  static async updateMetric(metricId: string, value: number, metadata?: Record<string, any>): Promise<void> {
    try {
      const updateData: any = { value, updated_at: new Date().toISOString() };
      if (metadata) {
        updateData.metadata = metadata;
      }

      const { error } = await supabase
        .from('user_production_metrics')
        .update(updateData)
        .eq('id', metricId);

      if (error) {
        throw new Error(`Failed to update metric: ${error.message}`);
      }
    } catch (error) {
      errorService.logError(error as Error, { context: 'Metric update', metricId, value });
      throw error;
    }
  }
}

// Auto-logging hooks for common operations
export const useMetricsLogging = (userId: string) => {
  const logProviderAction = async (action: string, providerId?: string, specialty?: string) => {
    switch (action) {
      case 'register':
        if (providerId && specialty) {
          await MetricsService.logProviderRegistration(userId, providerId, specialty);
        }
        break;
      case 'update':
        await MetricsService.logMetric(userId, 'profiles_updated', 1, {
          dimension: 'productivity',
          metadata: { providerId, action }
        });
        break;
      case 'search':
        await MetricsService.logMetric(userId, 'search_queries', 1, {
          dimension: 'engagement',
          metadata: { action }
        });
        break;
    }
  };

  const logSystemUsage = async (sessionStart: Date, featuresUsed: string[]) => {
    const sessionDuration = (Date.now() - sessionStart.getTime()) / (1000 * 60);
    await MetricsService.logSystemUsage(userId, sessionDuration, featuresUsed);
  };

  return { logProviderAction, logSystemUsage };
};