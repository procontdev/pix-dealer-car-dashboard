// hooks/use-dashboard.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

interface DashboardKPIs {
  total_dealers: number;
  active_locations: number;
  total_base_assets: number;
  total_color_specs: number;
  generated_assets: number;
  composed_assets: number;
  processing_queue: number;
  recent_fallbacks: number;
  average_quality_score: number;
}

interface RecentActivityItem {
  id?: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

interface DashboardHomeData {
  kpis: DashboardKPIs;
  recent_activity: RecentActivityItem[];
  recent_runs: Array<{
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
  }>;
  recent_errors: Array<{
    id: string;
    run_id: string;
    dealer_id?: string | null;
    asset_id?: string | null;
    operation: string;
    status: string;
    message: string;
    latency_ms?: number | null;
    created_at: string;
  }>;
  recent_compositions: Array<{
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
  }>;
  active_video_jobs: number;
}

export function useDashboardHome() {
  return useQuery<DashboardHomeData>({
    queryKey: ['dashboard-home'],
    queryFn: () => apiClient.getDashboardHome(),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
  });
}

export function useDashboardKPIs() {
  return useQuery<DashboardKPIs>({
    queryKey: ['dashboard-kpis'],
    queryFn: () => apiClient.getDashboardKPIs(),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnMount: false,
  });
}

export function useRecentActivity() {
  return useQuery<RecentActivityItem[]>({
    queryKey: ['recent-activity'],
    queryFn: () => apiClient.getRecentActivity(),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
  });
}
