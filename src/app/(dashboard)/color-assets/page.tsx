"use client";

// app/(dashboard)/color-assets/page.tsx
import { useMemo, useState } from 'react';
import { useVehicleColorAssets } from '@/hooks/use-vehicle-color-assets';
import { DataTable } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { ImagePreview } from '@/components/image-preview';
import { Column } from '@/components/data-table';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ColorAssetsPage() {
  const { data: assets, isLoading } = useVehicleColorAssets();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  const filteredAssets = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (assets || []).filter((asset) => {
      const matchesSearch = !term || [
        asset.color_name,
        asset.vehicle_key,
        asset.strategy_used,
        asset.run_id,
        asset.validation_status,
      ].some((value) => String(value || '').toLowerCase().includes(term));

      const matchesStatus = statusFilter === 'all' || String(asset.status).toLowerCase() === statusFilter || String(asset.validation_status).toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [assets, search, statusFilter]);

  const columns: Column<any>[] = [
    {
      key: 'output_image_url',
      header: 'Preview',
      render: (value, item) => (
        <ImagePreview
          src={value}
          alt={item.color_name}
          width={80}
          height={60}
          zoomable={false}
        />
      ),
    },
    {
      key: 'color_name',
      header: 'Color',
      render: (value) => <span className="font-medium text-white">{value}</span>,
    },
    {
      key: 'strategy_used',
      header: 'Strategy',
      render: (value) => <span className="text-slate-300">{value}</span>,
    },
    {
      key: 'provider',
      header: 'Provider',
      render: (value) => <span className="text-slate-300">{value}</span>,
    },
    {
      key: 'quality_score',
      header: 'Quality',
      render: (value) => <span className="text-slate-300">{(value * 100).toFixed(1)}%</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'fallback_used',
      header: 'Fallback',
      render: (value) => value ? <StatusBadge status="fallback" /> : <span className="text-slate-400">-</span>,
    },
    {
      key: 'run_id',
      header: 'Run ID',
      render: (value) => <span className="text-slate-400 text-sm font-mono">{value.slice(-8)}</span>,
    },
    {
      key: 'id',
      header: 'Actions',
      render: (_, item) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedAsset(item)}
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
        <h1 className="text-2xl font-bold text-white">Vehicle Color Assets</h1>
        <p className="text-slate-400">Generated color variations and processing pipeline</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:grid-cols-[1.4fr_0.8fr] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by color, vehicle key, strategy or run id"
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
        data={filteredAssets}
        columns={columns}
        loading={isLoading}
        emptyTitle="No generated color assets"
        emptyDescription="Completed or in-flight recolor outputs will appear here for operational review."
      />

      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        <DialogContent className="max-w-3xl border border-slate-800 bg-slate-950 text-slate-100">
          {selectedAsset && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAsset.color_name}</DialogTitle>
                <DialogDescription>
                  Detailed operational view for the selected generated color asset.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <ImagePreview
                    src={selectedAsset.output_image_url || ''}
                    alt={selectedAsset.color_name || 'Generated asset'}
                    width={520}
                    height={360}
                  />
                  {selectedAsset.output_image_url && (
                    <a
                      href={selectedAsset.output_image_url}
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
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Vehicle key</p>
                      <p className="text-slate-100">{selectedAsset.vehicle_key || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Run ID</p>
                      <p className="font-mono text-slate-100">{selectedAsset.run_id || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Strategy</p>
                      <p className="text-slate-100">{selectedAsset.strategy_used || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Provider</p>
                      <p className="text-slate-100">{selectedAsset.provider || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Processing</p>
                      <StatusBadge status={String(selectedAsset.processing_status || 'unknown')} />
                    </div>
                    <div>
                      <p className="text-slate-500">Validation</p>
                      <StatusBadge status={String(selectedAsset.validation_status || 'unknown')} />
                    </div>
                    <div>
                      <p className="text-slate-500">Quality</p>
                      <p className="text-slate-100">{selectedAsset.quality_score ? `${(Number(selectedAsset.quality_score) * 100).toFixed(1)}%` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Version</p>
                      <p className="text-slate-100">{selectedAsset.version || '-'}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
                    <p className="mb-2 text-slate-500">Fingerprint</p>
                    <p className="break-all font-mono text-slate-200">{selectedAsset.fingerprint || '-'}</p>
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
