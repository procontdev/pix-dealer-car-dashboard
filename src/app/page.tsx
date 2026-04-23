"use client";
import { useState, useEffect } from 'react';
import { KPICard } from '@/components/kpi-card';
import { StatusBadge } from '@/components/status-badge';
import { useDashboardHome } from '@/hooks/use-dashboard';
import {
  Users,
  MapPin,
  Car,
  Palette,
  Image,
  Film,
  Clock,
  AlertTriangle,
  TrendingUp,
  Zap,
  Activity,
  Layers3,
  Boxes,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data, isLoading } = useDashboardHome();
  const [currentTime, setCurrentTime] = useState('Loading...');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const kpis = data?.kpis;
  const activities = data?.recent_activity || [];
  const recentRuns = data?.recent_runs || [];
  const recentErrors = data?.recent_errors || [];
  const recentCompositions = data?.recent_compositions || [];
  const activeVideoJobs = data?.active_video_jobs || 0;
  const systemHealth = kpis?.processing_queue === 0 ? 'healthy' : kpis?.processing_queue && kpis.processing_queue < 5 ? 'warning' : 'critical';

  const quickLinks = [
    { href: '/inventory', label: 'Inventory', icon: Boxes, caption: 'Bridge dealer, asset and location' },
    { href: '/color-assets', label: 'Color Assets', icon: Sparkles, caption: 'Review generated outputs' },
    { href: '/compositions', label: 'Compositions', icon: Layers3, caption: 'Inspect dealer-ready images' },
    { href: '/video-jobs', label: 'Video Jobs', icon: Film, caption: 'Track video pipeline status' },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_28%)]" />
        <div className="relative grid gap-8 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-200">
              MVP Operations Command Center
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-white">Vehicle Asset Pipeline Dashboard</h1>
              <p className="max-w-3xl text-base leading-7 text-slate-300">
                Supervisa generacion de assets, composiciones, inventario operativo y jobs de video desde una sola vista premium enfocada en flujo real de produccion.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-200">
                <span className={`h-2 w-2 rounded-full ${systemHealth === 'healthy' ? 'bg-emerald-400' : systemHealth === 'warning' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                <span>{systemHealth === 'healthy' ? 'Operational flow' : systemHealth === 'warning' ? 'Moderate load' : 'Attention required'}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-300">
                <Activity className="h-4 w-4 text-cyan-300" />
                <span>Last refresh {currentTime}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 text-slate-300">
                <Film className="h-4 w-4 text-violet-300" />
                <span>{activeVideoJobs} video jobs active</span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {quickLinks.map(({ href, label, icon: Icon, caption }) => (
                <Link
                  key={href}
                  href={href}
                  className="group rounded-2xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-slate-700 hover:bg-slate-900"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-cyan-200">
                      <Icon className="h-4 w-4" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-white" />
                  </div>
                  <p className="font-medium text-white">{label}</p>
                  <p className="mt-1 text-sm text-slate-400">{caption}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/75 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Operational pulse</p>
                <h2 className="text-xl font-semibold text-white">Realtime production view</h2>
              </div>
              <StatusBadge status={systemHealth === 'critical' ? 'warning' : 'completed'} showIcon={false} />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-400">Color assets generated</span>
                  <span className="text-white">{kpis?.generated_assets || 0}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Compositions</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{kpis?.composed_assets || 0}</p>
                  <p className="mt-1 text-sm text-slate-400">Dealer-ready outputs</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Quality score</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{kpis?.average_quality_score ? `${(kpis.average_quality_score * 100).toFixed(1)}%` : '0%'}</p>
                  <p className="mt-1 text-sm text-slate-400">Recent completed assets</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-white">Recent run activity</p>
                  <p className="text-xs text-slate-500">{recentRuns.length} visible</p>
                </div>
                <div className="space-y-2">
                  {recentRuns.length > 0 ? recentRuns.map((run) => (
                    <div key={run.id} className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                      <div>
                        <p className="text-sm text-white">{run.job_type}</p>
                        <p className="font-mono text-xs text-slate-500">{run.run_id}</p>
                      </div>
                      <StatusBadge status={run.run_status} />
                    </div>
                  )) : (
                    <div className="rounded-xl border border-dashed border-slate-800 px-4 py-5 text-sm text-slate-500">
                      No recent runs available.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Dealers"
          value={kpis?.total_dealers || 0}
          icon={Users}
          description="Licensed partners"
        />
        <KPICard
          title="Approved Locations"
          value={kpis?.active_locations || 0}
          icon={MapPin}
          description="Background scenes"
        />
        <KPICard
          title="Base Assets"
          value={kpis?.total_base_assets || 0}
          icon={Car}
          description="Vehicle templates"
        />
        <KPICard
          title="Color Palettes"
          value={kpis?.total_color_specs || 0}
          icon={Palette}
          description="Available colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Generated Assets"
          value={kpis?.generated_assets || 0}
          icon={Image}
          description="Color variants created"
        />
        <KPICard
          title="Composed Images"
          value={kpis?.composed_assets || 0}
          icon={Film}
          description="Final deliverables"
        />
        <KPICard
          title="Processing Queue"
          value={kpis?.processing_queue || 0}
          icon={Clock}
          description="Jobs in progress"
        />
        <KPICard
          title="Quality Score"
          value={kpis?.average_quality_score ? (kpis.average_quality_score * 100).toFixed(1) + '%' : '0%'}
          icon={TrendingUp}
          description="Average performance"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_30%)]" />
            <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <span>Recent Pipeline Activity</span>
              </h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-400">Live</span>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-slate-400 flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
                    <span>Loading activities...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                {activities?.slice(0, 6).map((activity, index) => (
                  <div key={`${activity.id}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 transition-colors hover:bg-slate-900/70">
                    <div className="flex items-center space-x-4">
                      <StatusBadge status={activity.status} />
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-sm truncate">{activity.title}</p>
                        <p className="text-slate-400 text-xs mt-1">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-slate-500 text-xs font-mono">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-slate-400">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.08),transparent_34%)]" />
              <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Recent Errors & Fallbacks</h3>
                  <p className="text-sm text-slate-500">Operational warnings requiring attention</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-amber-300" />
              </div>

              <div className="space-y-3">
                {recentErrors.length > 0 ? recentErrors.map((log) => (
                  <div key={log.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <StatusBadge status={log.status} />
                      <span className="font-mono text-[11px] text-slate-500">{log.run_id || '-'}</span>
                    </div>
                    <p className="text-sm text-white">{log.message}</p>
                    <p className="mt-2 text-xs text-slate-500">{new Date(log.created_at).toLocaleString()}</p>
                  </div>
                )) : (
                  <div className="rounded-xl border border-dashed border-slate-800 px-4 py-8 text-center text-sm text-slate-500">
                    No recent warnings or errors.
                  </div>
                )}
              </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,70,239,0.08),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.08),transparent_34%)]" />
              <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Recent Compositions</h3>
                  <p className="text-sm text-slate-500">Latest composed outputs ready for review</p>
                </div>
                <Layers3 className="h-5 w-5 text-fuchsia-300" />
              </div>

              <div className="space-y-3">
                {recentCompositions.length > 0 ? recentCompositions.map((composition) => (
                  <div key={composition.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">{composition.dealer_name || composition.dealer_id}</p>
                      <StatusBadge status={composition.processing_status} />
                    </div>
                    <p className="text-sm text-slate-300">{composition.vehicle_key || 'Unknown asset'} • {composition.color_name || composition.composition_method}</p>
                    <p className="mt-2 text-xs text-slate-500">{composition.location_name || 'No location'} • {composition.run_id || 'No run id'}</p>
                  </div>
                )) : (
                  <div className="rounded-xl border border-dashed border-slate-800 px-4 py-8 text-center text-sm text-slate-500">
                    No compositions available yet.
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.08),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_34%)]" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span>Processing Status</span>
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <span className="text-slate-300">Queue Length</span>
                  <span className="text-white font-medium">{kpis?.processing_queue || 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <span className="text-slate-300">Recent Fallbacks</span>
                  <span className="text-white font-medium">{kpis?.recent_fallbacks || 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <span className="text-slate-300">Video Jobs Active</span>
                  <span className="text-white font-medium">{activeVideoJobs}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.08),transparent_34%)]" />
            <div className="relative">
              <h4 className="mb-4 text-lg font-semibold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span>Recent Runs</span>
              </h4>
              <div className="space-y-3">
                {recentRuns.length > 0 ? recentRuns.map((run) => (
                  <div key={run.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm text-white">{run.job_type}</p>
                      <StatusBadge status={run.run_status} />
                    </div>
                    <p className="font-mono text-xs text-slate-500">{run.run_id}</p>
                    <p className="mt-2 text-xs text-slate-400">Processed {run.processed_items} of {run.total_items} items</p>
                  </div>
                )) : (
                  <div className="rounded-2xl border border-dashed border-slate-800 px-4 py-8 text-center text-sm text-slate-500">
                    No recent pipeline runs.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
