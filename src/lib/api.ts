import type {
  BaseAsset,
  ColorSpec,
  CompositionAsset,
  Dealer,
  InventoryItem,
  JobRun,
  Location,
  RunLog,
  VehicleColorAsset,
  VideoJob,
  DashboardGenerationJobResponse,
} from "@/lib/types";

const API_BASE_URL = "";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getDashboardKPIs(): Promise<{
    total_dealers: number;
    active_locations: number;
    total_base_assets: number;
    total_color_specs: number;
    generated_assets: number;
    composed_assets: number;
    processing_queue: number;
    recent_fallbacks: number;
    average_quality_score: number;
  }> {
    return this.request('/api/dashboard/kpis');
  }

  async getDashboardHome(): Promise<{
    kpis: {
      total_dealers: number;
      active_locations: number;
      total_base_assets: number;
      total_color_specs: number;
      generated_assets: number;
      composed_assets: number;
      processing_queue: number;
      recent_fallbacks: number;
      average_quality_score: number;
    };
    recent_activity: Array<{
      id?: string;
      type: string;
      title: string;
      description: string;
      timestamp: string;
      status: string;
    }>;
    recent_runs: JobRun[];
    recent_errors: RunLog[];
    recent_compositions: CompositionAsset[];
    active_video_jobs: number;
  }> {
    return this.request('/api/dashboard/home');
  }

  async getRecentActivity(): Promise<Array<{
    id?: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    status: string;
  }>> {
    return this.request('/api/dashboard/recent-activity');
  }

  async getDealers(): Promise<Dealer[]> {
    return this.request('/api/dealers');
  }

  async getLocations(): Promise<Location[]> {
    return this.request('/api/locations');
  }

  async getBaseAssets(): Promise<BaseAsset[]> {
    return this.request('/api/base-assets');
  }

  async getColorSpecs(): Promise<ColorSpec[]> {
    return this.request('/api/color-specs');
  }

  async getVehicleColorAssets(): Promise<VehicleColorAsset[]> {
    return this.request('/api/color-assets');
  }

  async getRunLogs(): Promise<RunLog[]> {
    return this.request('/api/run-logs');
  }

  async getMonitoringData(): Promise<{
    runs: JobRun[];
    logs: RunLog[];
  }> {
    return this.request('/api/monitoring');
  }

  async getInventory(): Promise<InventoryItem[]> {
    return this.request('/api/inventory');
  }

  async getCompositions(): Promise<CompositionAsset[]> {
    return this.request('/api/compositions');
  }

  async getVideoJobs(): Promise<VideoJob[]> {
    return this.request('/api/video-jobs');
  }

  async getJobRuns(): Promise<JobRun[]> {
    return this.request('/api/job-runs');
  }

  async createGenerationJob(payload: {
    job_type: string;
    scope_type: string;
    dealer_id?: string | null;
    inventory_ids: string[];
    color_spec_ids: string[];
    dealer_location_id?: string | null;
    generation_mode: string;
    recolor_strategy: string;
    export_transparent_png: boolean;
    notes?: string;
    priority: string;
  }): Promise<DashboardGenerationJobResponse> {
    return this.request('/api/generation-jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
