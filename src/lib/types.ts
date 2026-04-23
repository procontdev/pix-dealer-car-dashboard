export interface Dealer {
  id: string;
  name: string;
  dealer_code?: string;
  location_count: number | string;
  status: boolean | string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  dealer_id: string;
  name: string;
  image_url: string;
  status: "approved" | "pending" | "rejected" | "pending_review" | string;
  primary: boolean;
  address?: string | null;
  source_type: string;
  created_at: string;
}

export interface BaseAsset {
  id: string;
  dealer_id: string | null;
  vehicle_key: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  image_url: string;
  mask_available: boolean;
  fingerprint: string | null;
  version: number;
  status: string;
  created_at: string;
}

export interface ColorSpec {
  id: string;
  name: string;
  family: string | null;
  rgb: { r: number; g: number; b: number };
  hex_value?: string | null;
  strategy: string;
  generation_profile?: string | null;
  status: string;
  primary_color: boolean;
  last_generated_at?: string | null;
  created_at: string;
  vehicle_key: string;
}

export interface VehicleColorAsset {
  id: string;
  base_asset_id: string;
  color_spec_id: string;
  vehicle_key: string;
  color_name: string;
  color_code: string;
  rgb: { r: number; g: number; b: number } | null;
  recolor_strategy: string;
  strategy_used: string | null;
  provider: string | null;
  model?: string | null;
  prediction_id?: string | null;
  output_image_url: string | null;
  image_width: number | null;
  image_height: number | null;
  quality_score: number | string | null;
  status: string;
  processing_status: string;
  validation_status: string;
  fallback_used: boolean | null;
  run_id: string;
  fingerprint: string;
  version: number;
  created_at: string;
}

export interface RunLog {
  id: string;
  run_id: string;
  dealer_id?: string | null;
  asset_id?: string | null;
  operation: string;
  status: string;
  message: string;
  latency_ms?: number | null;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  dealer_id: string;
  dealer_name: string | null;
  dealer_location_id: string | null;
  location_name: string | null;
  base_asset_id: string | null;
  color_spec_id: string | null;
  year: number;
  make: string;
  model: string;
  trim: string;
  vehicle_key: string;
  stock_number: string;
  vin: string;
  color_name: string | null;
  color_code: string | null;
  enable_composition: boolean;
  enable_video360: boolean;
  inventory_status: string;
  composition_status: string;
  video_status: string;
  priority: number;
  quantity: number;
  fingerprint: string | null;
  run_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleGroup {
  vehicle_key: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  inventory_count: number;
  color_specs_count: number;
  dealers: string[];
  inventory_ids: string[];
  color_spec_ids: string[];
}

export interface CompositionAsset {
  id: string;
  dealer_id: string;
  dealer_name: string | null;
  inventory_id: string;
  dealer_location_id: string;
  location_name: string | null;
  vehicle_color_asset_id: string;
  vehicle_key: string | null;
  color_name: string | null;
  composition_profile: string | null;
  composition_method: string;
  output_image_url: string | null;
  output_filename: string | null;
  validation_status: string;
  processing_status: string;
  processing_attempts: number;
  quality_score: number | string | null;
  fingerprint: string;
  version: number;
  run_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface VideoJob {
  id: string;
  dealer_id: string;
  dealer_name: string | null;
  inventory_id: string;
  dealer_composed_asset_id: string | null;
  source_image_url: string | null;
  enable_video360_dealer: boolean | null;
  enable_video360_inventory: boolean | null;
  job_eligible: boolean | null;
  provider: string | null;
  provider_model: string | null;
  provider_job_id: string | null;
  job_status: string;
  attempts: number;
  output_video_url: string | null;
  preview_gif_url: string | null;
  duration_seconds: number | null;
  resolution: string | null;
  error_message: string | null;
  submitted_at: string | null;
  completed_at: string | null;
  run_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobRun {
  id: string;
  run_id: string;
  job_type: string;
  trigger_source: string;
  started_at: string;
  finished_at: string | null;
  run_status: string;
  total_items: number;
  processed_items: number;
  success_items: number;
  failed_items: number;
  skipped_items: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardGenerationJobResponse {
  ok: boolean;
  run_id: string;
  queue_items_prepared: number;
  workflow_triggered: boolean;
  trigger_mode: string;
  monitoring_url: string;
  color_assets_url: string;
  compositions_url: string;
  payload_sent: Record<string, unknown>;
  notes?: string | null;
}
