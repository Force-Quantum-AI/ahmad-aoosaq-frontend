// admin.types.ts

export interface SuperAdminPanelOverview {
  total_businesses: number;
  active_businesses: number;
  free_trial: number;
  paid_businesses: number;
  mrr: number;
  cash_collected_this_month: number;
  total_calls_today: number;
  minutes_today: number;
  avg_usage_per_business: number;
  trial_conversion_rate: number;
}

export interface MonthlyValue {
  month: string;
  [key: string]: string | number;
}

export interface MRRByMonth extends MonthlyValue {
  mrr: number;
}

export interface CashCollectedByMonth extends MonthlyValue {
  cash_collected: number;
}

export interface RevenueByPlan {
  plan: string;
  revenue: number;
  businesses: number;
}

export interface RevenueByIndustry {
  industry: string;
  revenue: number;
}

export interface RevenueAnalytics {
  monthly_recurring_revenue: number;
  mrr_by_month: MRRByMonth[];
  cash_collected_by_month: CashCollectedByMonth[];
  revenue_by_plan: RevenueByPlan[];
  revenue_by_industry: RevenueByIndustry[];
}

export interface ClientManagementItem {
  business: string;
  industry: string;
  plan: string;
  status: string;
  calls: number;
  minutes: number;
  subscription_mrr: number;
  cash_collected: number;
  phone: string;
  last_active: string;
}

export interface CallVolumeDay {
  day: string;
  calls: number;
}

export interface MinutesUsedDay {
  day: string;
  minutes: number;
}

export interface TopBusinessByUsage {
  rank: number;
  business: string;
  industry: string;
  calls: number;
  minutes: number;
}

export interface UsageAnalytics {
  call_volume_this_week: CallVolumeDay[];
  minutes_used_this_week: MinutesUsedDay[];
  total_calls_this_week: number;
  total_minutes_this_week: number;
  top_businesses_by_usage: TopBusinessByUsage[];
}

export interface TrialConversionFunnel {
  trials_started: number;
  active_trials: number;
  activated_trials: number;
  expiring_in_3_days: number;
  high_activity_trials: number;
  converted_to_paid: number;
  no_activity_trials: number;
}

export interface SuperAdminPanelData {
  overview: SuperAdminPanelOverview;
  revenue_analytics: RevenueAnalytics;
  client_management: ClientManagementItem[];
  usage_analytics: UsageAnalytics;
  trial_conversion_funnel: TrialConversionFunnel;
}

export interface SuperAdminPanelResponse {
  success: boolean;
  message: string;
  data: SuperAdminPanelData;
}
