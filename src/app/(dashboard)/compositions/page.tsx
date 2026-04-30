"use client";

import { useMemo, useState } from "react";
import { DataTable, Column } from "@/components/data-table";
import { ImagePreview } from "@/components/image-preview";
import { StatusBadge } from "@/components/status-badge";
import { useCompositions } from "@/hooks/use-compositions";
import type { CompositionAsset } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CompositionsPage() {
  const { data: compositions, isLoading } = useCompositions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedComposition, setSelectedComposition] = useState<CompositionAsset | null>(null);

  const filteredCompositions = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (compositions || []).filter((item) => {
      const matchesSearch = !term || [
        item.dealer_name,
        item.location_name,
        item.vehicle_key,
        item.color_name,
        item.composition_method,
        item.run_id,
      ].some((value) => String(value || "").toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "all" ||
        String(item.processing_status).toLowerCase() === statusFilter ||
        String(item.validation_status).toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [compositions, search, statusFilter]);

  const columns: Column<CompositionAsset>[] = [
    {
      key: "output_image_url",
      header: "Preview",
      render: (value, item) => (
        <ImagePreview src={String(value || "")} alt={String(item.output_filename || item.id)} width={88} height={64} zoomable={false} />
      ),
    },
    {
      key: "dealer_name",
      header: "Dealer",
      render: (value, item) => (
        <div>
          <p className="text-white">{value || item.dealer_id}</p>
          <p className="text-xs text-slate-500">{item.location_name || "No location"}</p>
        </div>
      ),
    },
    {
      key: "vehicle_key",
      header: "Asset",
      render: (value, item) => (
        <div>
          <p className="text-slate-200">{value || "Unknown vehicle"}</p>
          <p className="text-xs text-slate-500">{item.color_name || item.composition_method}</p>
        </div>
      ),
    },
    {
      key: "processing_status",
      header: "Processing",
      render: (value) => <StatusBadge status={String(value || "unknown")} />,
    },
    {
      key: "validation_status",
      header: "Validation",
      render: (value) => <StatusBadge status={String(value || "unknown")} />,
    },
    {
      key: "quality_score",
      header: "Quality",
      render: (value) => <span className="text-slate-300">{value ? `${(Number(value) * 100).toFixed(1)}%` : "-"}</span>,
    },
    {
      key: "run_id",
      header: "Run ID",
      render: (value) => <span className="font-mono text-xs text-slate-500">{value || "-"}</span>,
    },
    {
      key: "id",
      header: "Actions",
      render: (_, item) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedComposition(item)}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70"
          >
            View
          </button>
          {item.output_image_url && (
            <a
              href={item.output_image_url}
              download
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70"
            >
              Download
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Compositions</h1>
        <p className="text-slate-400">Dealer-composed image outputs ready for review and downstream delivery</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:grid-cols-[1.4fr_0.8fr] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by dealer, location, vehicle, color, method or run id"
          className="h-10 border-slate-700 bg-slate-950/80 text-slate-100"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none"
        >
          <option value="all">All statuses</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <DataTable
        data={filteredCompositions}
        columns={columns}
        loading={isLoading}
        emptyTitle="No compositions generated"
        emptyDescription="Dealer-composed outputs will appear here once the composition pipeline starts producing assets."
      />

      <Dialog open={!!selectedComposition} onOpenChange={(open) => !open && setSelectedComposition(null)}>
        <DialogContent className="max-w-4xl border border-slate-800 bg-slate-950 text-slate-100">
          {selectedComposition && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedComposition.dealer_name || selectedComposition.dealer_id}</DialogTitle>
                <DialogDescription>
                  Composition detail with downstream delivery metadata and operational validation state.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <ImagePreview
                    src={selectedComposition.output_image_url || ""}
                    alt={selectedComposition.output_filename || selectedComposition.id}
                    width={540}
                    height={360}
                  />
                  {selectedComposition.output_image_url && (
                    <a
                      href={selectedComposition.output_image_url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70"
                    >
                      Download image
                    </a>
                  )}
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Location</p>
                      <p className="text-slate-100">{selectedComposition.location_name || 'No location'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Run ID</p>
                      <p className="font-mono text-slate-100">{selectedComposition.run_id || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Vehicle key</p>
                      <p className="text-slate-100">{selectedComposition.vehicle_key || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Color</p>
                      <p className="text-slate-100">{selectedComposition.color_name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Method</p>
                      <p className="text-slate-100">{selectedComposition.composition_method}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Profile</p>
                      <p className="text-slate-100">{selectedComposition.composition_profile || '-'}</p>
                    </div>
                    <div>
                      <p className="mb-2 text-slate-500">Processing</p>
                      <StatusBadge status={String(selectedComposition.processing_status || 'unknown')} />
                    </div>
                    <div>
                      <p className="mb-2 text-slate-500">Validation</p>
                      <StatusBadge status={String(selectedComposition.validation_status || 'unknown')} />
                    </div>
                    <div>
                      <p className="text-slate-500">Quality</p>
                      <p className="text-slate-100">{selectedComposition.quality_score ? `${(Number(selectedComposition.quality_score) * 100).toFixed(1)}%` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Attempts</p>
                      <p className="text-slate-100">{selectedComposition.processing_attempts}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
                    <p className="mb-2 text-slate-500">Fingerprint</p>
                    <p className="break-all font-mono text-slate-200">{selectedComposition.fingerprint || '-'}</p>
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
