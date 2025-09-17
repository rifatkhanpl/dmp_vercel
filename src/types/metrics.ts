export interface MetricDefinition {
  id: string;
  metricType: string;
  displayName: string;
  description?: string;
  dimension: string;
  unit: string;
  calculationMethod?: string;
  targetValue?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProductionMetric {
  id: string;
  userId: string;
  metricType: string;
  dimension: string;
  attribute?: string;
  value: number;
  unit: string;
  periodStart: string;
  periodEnd: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  
  // Joined data
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  definition?: MetricDefinition;
}

export interface MetricSummary {
  dimension: string;
  metricType: string;
  displayName: string;
  totalValue: number;
  averageValue: number;
  targetValue?: number;
  unit: string;
  recordCount: number;
  achievementRate?: number;
  trend?: 'up' | 'down' | 'stable';
  trendPercentage?: number;
}

export interface DashboardMetrics {
  summary: {
    totalUsers: number;
    activeUsers: number;
    totalMetrics: number;
    averagePerformance: number;
  };
  topPerformers: Array<{
    userId: string;
    userName: string;
    totalScore: number;
    metrics: Record<string, number>;
  }>;
  dimensionSummaries: Record<string, MetricSummary[]>;
  recentActivity: Array<{
    id: string;
    userId: string;
    userName: string;
    metricType: string;
    value: number;
    unit: string;
    createdAt: string;
  }>;
}

export type MetricDimension = 'productivity' | 'quality' | 'efficiency' | 'engagement' | 'coverage' | 'ai_performance' | 'compliance';

export type MetricUnit = 'count' | 'percentage' | 'minutes' | 'hours' | 'days' | 'score';

export interface MetricFilter {
  userId?: string;
  metricType?: string;
  dimension?: string;
  dateRange?: string;
  minValue?: number;
  maxValue?: number;
  unit?: string;
}

export interface MetricSort {
  field: 'value' | 'createdAt' | 'metricType' | 'dimension' | 'userName';
  direction: 'asc' | 'desc';
}