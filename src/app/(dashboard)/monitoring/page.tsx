"use client";

// app/(dashboard)/monitoring/page.tsx
import { useMemo, useState } from 'react';
import { useMonitoring } from '@/hooks/use-monitoring';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { Column } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { JobRun, RunLog } from '@/lib/types';

export default function MonitoringPage() {
  const { data, isLoading } = useMonitoring();
  const runs = data?.runs || [];
  const logs = data?.logs || [];
  const [search, setSearch] = useState('');
  const [runStatusFilter, setRunStatusFilter] = useState('all');
  const [logStatusFilter, setLogStatusFilter] = useState('all');
  const [selectedRun, setSelectedRun] = useState<JobRun | null>(null);

  const filteredRuns = useMemo(() => {
    const term = search.trim().toLowerCase();
    return runs.filter((run) => {
      const matchesSearch = !term || [run.run_id, run.job_type, run.trigger_source, run.run_status].some((value) => String(value || '').toLowerCase().includes(term));
      const matchesStatus = runStatusFilter === 'all' || String(run.run_status).toLowerCase() === runStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [runs, search, runStatusFilter]);

  const filteredLogs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesSearch = !term || [log.run_id, log.operation, log.message, log.status].some((value) => String(value || '').toLowerCase().includes(term));
      const matchesStatus = logStatusFilter === 'all' || String(log.status).toLowerCase() === logStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [logs, search, logStatusFilter]);

  const selectedRunLogs = useMemo(() => {
    if (!selectedRun) return [];
    return logs.filter((log) => log.run_id === selectedRun.run_id).slice(0, 12);
  }, [logs, selectedRun]);

  const runColumns: Column<any>[] = [
    {
      key: 'run_id',
      header: 'Run ID',
      render: (value, item) => (
        <div>
          <p className="font-mono text-xs text-white">{value}</p>
          <p className="text-xs text-slate-500">{item.job_type} • {item.trigger_source}</p>
        </div>
      ),
    },
    {
      key: 'run_status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'processed_items',
      header: 'Processed',
      render: (value, item) => <span className="text-slate-300">{value}/{item.total_items}</span>,
    },
    {
      key: 'success_items',
      header: 'Success',
      render: (value) => <span className="text-emerald-300">{value}</span>,
    },
    {
      key: 'failed_items',
      header: 'Failed',
      render: (value) => <span className="text-rose-300">{value}</span>,
    },
    {
      key: 'id',
      header: 'Details',
      render: (_, item) => (
        <button
          type="button"
          onClick={() => setSelectedRun(item)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70"
        >
          View
        </button>
      ),
    },
  ];

  const columns: Column<any>[] = [
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'operation',
      header: 'Operation',
      render: (value) => <span className="text-slate-300">{value}</span>,
    },
    {
      key: 'message',
      header: 'Message',
      render: (value) => <span className="text-white">{value}</span>,
    },
    {
      key: 'run_id',
      header: 'Run ID',
      render: (value) => <span className="text-slate-400 text-sm font-mono">{value.slice(-8)}</span>,
    },
    {
      key: 'latency_ms',
      header: 'Latency',
      render: (value) => value ? <span className="text-slate-300">{value}ms</span> : <span className="text-slate-400">-</span>,
    },
    {
      key: 'created_at',
      header: 'Timestamp',
      render: (value) => (
        <span className="text-slate-400 text-sm">
          {new Date(value).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pipeline Monitoring</h1>
        <p className="text-slate-400">Real-time processing logs and pipeline status</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:grid-cols-[1.4fr_0.8fr_0.8fr] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by run id, operation, message or job type"
          className="h-10 border-slate-700 bg-slate-950/80 text-slate-100"
        />
        <select
          value={runStatusFilter}
          onChange={(e) => setRunStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none"
        >
          <option value="all">All run statuses</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={logStatusFilter}
          onChange={(e) => setLogStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none"
        >
          <option value="all">All log levels</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Recent Runs</h2>
            <p className="text-sm text-slate-500">Aggregated executions from the orchestration layer</p>
          </div>
          <DataTable
            data={filteredRuns}
            columns={runColumns}
            loading={isLoading}
            emptyTitle="No recent runs"
            emptyDescription="Pipeline executions will appear here when orchestrated jobs are triggered."
          />
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Processing Logs</h2>
            <p className="text-sm text-slate-500">Recent operational events and issues</p>
          </div>
          <DataTable
            data={filteredLogs}
            columns={columns}
            loading={isLoading}
            emptyTitle="No processing logs"
            emptyDescription="Operational events, warnings and errors will be listed here as the pipeline runs."
          />
        </div>
      </div>

      <Dialog open={!!selectedRun} onOpenChange={(open) => !open && setSelectedRun(null)}>
        <DialogContent className="max-w-4xl border border-slate-800 bg-slate-950 text-slate-100">
          {selectedRun && (
            <>
              <DialogHeader>
                <DialogTitle>Run {selectedRun.run_id}</DialogTitle>
                <DialogDescription>
                  Monitoring detail view for a pipeline execution and its latest correlated logs.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Job type</p>
                      <p className="text-slate-100">{selectedRun.job_type}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Trigger source</p>
                      <p className="text-slate-100">{selectedRun.trigger_source}</p>
                    </div>
                    <div>
                      <p className="mb-2 text-slate-500">Run status</p>
                      <StatusBadge status={String(selectedRun.run_status || 'unknown')} />
                    </div>
                    <div>
                      <p className="text-slate-500">Started</p>
                      <p className="text-slate-100">{new Date(selectedRun.started_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Finished</p>
                      <p className="text-slate-100">{selectedRun.finished_at ? new Date(selectedRun.finished_at).toLocaleString() : '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Processed</p>
                      <p className="text-slate-100">{selectedRun.processed_items}/{selectedRun.total_items}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Success</p>
                      <p className="text-emerald-300">{selectedRun.success_items}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Failed</p>
                      <p className="text-rose-300">{selectedRun.failed_items}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
                    <p className="mb-2 text-slate-500">Notes</p>
                    <p className="text-slate-200">{selectedRun.notes || 'No notes recorded for this run.'}</p>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Correlated Logs</h3>
                    <p className="text-xs text-slate-500">Latest operational entries linked to this run id.</p>
                  </div>

                  {selectedRunLogs.length > 0 ? selectedRunLogs.map((log: RunLog) => (
                    <div key={log.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <StatusBadge status={String(log.status || 'unknown')} />
                        <span className="text-xs text-slate-500">{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-200">{log.operation}</p>
                      <p className="mt-1 text-sm text-white">{log.message}</p>
                    </div>
                  )) : (
                    <div className="rounded-xl border border-dashed border-slate-800 px-4 py-8 text-center text-sm text-slate-500">
                      No logs found for this run.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
