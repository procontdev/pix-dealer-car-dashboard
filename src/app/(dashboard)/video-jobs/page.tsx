"use client";

import { useMemo, useState } from "react";
import { DataTable, Column } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { useVideoJobs } from "@/hooks/use-video-jobs";
import type { VideoJob } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function VideoJobsPage() {
  const { data: jobs, isLoading } = useVideoJobs();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<VideoJob | null>(null);

  const filteredJobs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (jobs || []).filter((item) => {
      const matchesSearch = !term || [
        item.dealer_name,
        item.inventory_id,
        item.provider,
        item.provider_model,
        item.run_id,
        item.provider_job_id,
      ].some((value) => String(value || "").toLowerCase().includes(term));

      const matchesStatus = statusFilter === "all" || String(item.job_status).toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const columns: Column<VideoJob>[] = [
    {
      key: "dealer_name",
      header: "Dealer",
      render: (value, item) => (
        <div>
          <p className="text-white">{value || item.dealer_id}</p>
          <p className="text-xs text-slate-500">Inventory {item.inventory_id}</p>
        </div>
      ),
    },
    {
      key: "provider",
      header: "Provider",
      render: (value, item) => (
        <div>
          <p className="text-slate-200">{value || "-"}</p>
          <p className="text-xs text-slate-500">{item.provider_model || "No model"}</p>
        </div>
      ),
    },
    {
      key: "job_status",
      header: "Status",
      render: (value) => <StatusBadge status={String(value || "unknown")} />,
    },
    {
      key: "job_eligible",
      header: "Eligible",
      render: (value) => <StatusBadge status={value ? "approved" : "pending"} showIcon={false} />,
    },
    {
      key: "resolution",
      header: "Resolution",
      render: (value) => <span className="text-slate-300">{value || "-"}</span>,
    },
    {
      key: "duration_seconds",
      header: "Duration",
      render: (value) => <span className="text-slate-300">{value ? `${value}s` : "-"}</span>,
    },
    {
      key: "run_id",
      header: "Run ID",
      render: (value) => <span className="font-mono text-xs text-slate-500">{value || "-"}</span>,
    },
    {
      key: "id",
      header: "Details",
      render: (_, item) => (
        <button
          type="button"
          onClick={() => setSelectedJob(item)}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Video Jobs</h1>
        <p className="text-slate-400">Video pipeline status for composed assets and dealer-ready outputs</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:grid-cols-[1.4fr_0.8fr] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by dealer, provider, model, inventory, run id or provider job id"
          className="h-10 border-slate-700 bg-slate-950/80 text-slate-100"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <DataTable
        data={filteredJobs}
        columns={columns}
        loading={isLoading}
        emptyTitle="No video jobs available"
        emptyDescription="Video rendering jobs will show up here once the downstream video pipeline starts processing composed assets."
      />

      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-4xl border border-slate-800 bg-slate-950 text-slate-100">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedJob.dealer_name || selectedJob.dealer_id}</DialogTitle>
                <DialogDescription>
                  Video job detail with provider metadata and downstream output status.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Inventory</p>
                      <p className="text-slate-100">{selectedJob.inventory_id}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Run ID</p>
                      <p className="font-mono text-slate-100">{selectedJob.run_id || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Provider</p>
                      <p className="text-slate-100">{selectedJob.provider || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Model</p>
                      <p className="text-slate-100">{selectedJob.provider_model || '-'}</p>
                    </div>
                    <div>
                      <p className="mb-2 text-slate-500">Job status</p>
                      <StatusBadge status={String(selectedJob.job_status || 'unknown')} />
                    </div>
                    <div>
                      <p className="text-slate-500">Eligible</p>
                      <p className="text-slate-100">{selectedJob.job_eligible ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Attempts</p>
                      <p className="text-slate-100">{selectedJob.attempts}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Resolution</p>
                      <p className="text-slate-100">{selectedJob.resolution || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Duration</p>
                      <p className="text-slate-100">{selectedJob.duration_seconds ? `${selectedJob.duration_seconds}s` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Provider Job ID</p>
                      <p className="break-all font-mono text-slate-100">{selectedJob.provider_job_id || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm">
                  <div>
                    <p className="mb-2 text-slate-500">Source image</p>
                    <p className="break-all text-slate-200">{selectedJob.source_image_url || '-'}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-slate-500">Output video</p>
                    <p className="break-all text-slate-200">{selectedJob.output_video_url || '-'}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-slate-500">Preview GIF</p>
                    <p className="break-all text-slate-200">{selectedJob.preview_gif_url || '-'}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-slate-500">Error message</p>
                    <p className="text-slate-200">{selectedJob.error_message || 'No error recorded.'}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
