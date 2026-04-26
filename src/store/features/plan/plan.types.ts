export interface FeatureDetail {
  id: number;
  name: string;
  feature_identifier: string;
  description: string;
  have_limit: boolean;
  value: number;
  overage_price: string;
  price: string;
  currency: string;
  interval: string;
  marketing_features: string[];
  active: boolean;
  stripe_product_id: string;
  stripe_price_id: string;
  created_at: string;
  updated_at: string;
}

 

export interface Plan {
  id: number;
  features_details: FeatureDetail[];

  name: string;
  interval: string;
  marketing_features: string[];
  price: string;
  currency: string;
  trial_period_days: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  stripe_product_id: string;
  stripe_price_id: string;

  features: number[];
}

export type PlanResponse = Plan[];