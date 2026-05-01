"use client";

// app/(dashboard)/base-assets/page.tsx
import { useMemo, useState } from 'react';
import { useBaseAssets } from '@/hooks/use-base-assets';
import { ImagePreview } from '@/components/image-preview';
import { StatusBadge } from '@/components/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function BaseAssetsPage() {
  const { data: assets, isLoading } = useBaseAssets();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  const filteredAssets = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (assets || []).filter((asset) => {
      const matchesSearch = !term || [asset.vehicle_key, asset.make, asset.model, asset.trim, asset.fingerprint].some((value) => String(value || '').toLowerCase().includes(term));
      const matchesStatus = statusFilter === 'all' || String(asset.status).toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [assets, search, statusFilter]);

  if (isLoading) {
    return <div className="text-slate-400">Loading base assets...</div>;
  }

  const getPreviewUrl = (asset: any) => asset.preferred_image_url || asset.normalized_image_url || asset.image_url;
  const getNormalizedUrl = (asset: any) => asset.normalized_image_url || null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Base Assets</h1>
        <p className="text-slate-400">Vehicle base images for color variations</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:grid-cols-[1.4fr_0.8fr] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by vehicle key, make, model, trim or fingerprint"
          className="h-10 border-slate-700 bg-slate-950/80 text-slate-100"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none"
        >
          <option value="all">All statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets?.map((asset) => (
          <Card key={asset.id} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">{asset.make} {asset.model} {asset.trim}</CardTitle>
              <div className="flex items-center gap-2">
                <StatusBadge status={asset.status} />
                {asset.mask_available && <StatusBadge status="mask_available" />}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImagePreview
                src={getPreviewUrl(asset)}
                alt={`${asset.make} ${asset.model}`}
                width={300}
                height={200}
              />
              <div className="space-y-2 text-sm">
                <p className="text-slate-300">
                  <span className="font-medium">Year:</span> {asset.year}
                </p>
                <p className="text-slate-300">
                  <span className="font-medium">Dealer:</span> {asset.dealer_id}
                </p>
                <p className="text-slate-300">
                  <span className="font-medium">Key:</span> {asset.vehicle_key}
                </p>
                <p className="text-slate-300">
                  <span className="font-medium">Fingerprint:</span> {asset.fingerprint}
                </p>
                <p className="text-slate-400">
                  v{asset.version} • {new Date(asset.created_at).toLocaleDateString()}
                </p>
                <p className="text-slate-400">
                  <span className="font-medium">Preview source:</span> {asset.normalized_image_url ? 'Normalized PNG' : 'Original base'}
                </p>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-xs">
                  <p className="mb-1 text-slate-500">Preview URL</p>
                  <p className="break-all font-mono text-slate-300">{getPreviewUrl(asset) || '-'}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-xs">
                  <p className="mb-1 text-slate-500">Normalized PNG URL</p>
                  <p className="break-all font-mono text-slate-300">{getNormalizedUrl(asset) || 'Not available'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAsset(asset)}
                  className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70"
                >
                  View details
                </button>
                {asset.normalized_image_url ? (
                  <a
                    href={asset.normalized_image_url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70"
                  >
                    Download PNG
                  </a>
                ) : (
                  <span className="inline-flex rounded-lg border border-dashed border-slate-800 px-3 py-2 text-xs text-slate-500">
                    PNG not available
                  </span>
                )}
                {asset.image_url && (
                  <a
                    href={asset.image_url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70"
                  >
                    Download original
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )) || (
          <div className="col-span-full text-center text-slate-400 py-8">
            No base assets found
          </div>
        )}
      </div>

      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        <DialogContent className="max-w-3xl border border-slate-800 bg-slate-950 text-slate-100">
          {selectedAsset && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAsset.make} {selectedAsset.model} {selectedAsset.trim}</DialogTitle>
                <DialogDescription>
                  Base asset detail view with mask readiness and version metadata.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <ImagePreview
                    src={getPreviewUrl(selectedAsset) || ''}
                    alt={`${selectedAsset.make} ${selectedAsset.model}`}
                    width={540}
                    height={360}
                  />
                  <div className="mt-4 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
                    <div>
                      <p className="mb-1 text-slate-500">Preview URL</p>
                      <p className="break-all font-mono text-slate-200">{getPreviewUrl(selectedAsset) || '-'}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-slate-500">Normalized PNG URL</p>
                      <p className="break-all font-mono text-slate-200">{getNormalizedUrl(selectedAsset) || 'Not available'}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                  {selectedAsset.normalized_image_url && (
                    <a
                      href={selectedAsset.normalized_image_url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70"
                    >
                      Download PNG
                    </a>
                  )}
                  {selectedAsset.image_url && (
                    <a
                      href={selectedAsset.image_url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70"
                    >
                      Download original
                    </a>
                  )}
                  {!selectedAsset.normalized_image_url && (
                    <span className="inline-flex rounded-lg border border-dashed border-slate-800 px-3 py-2 text-xs text-slate-500">
                      PNG not available
                    </span>
                  )}
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Year</p>
                      <p className="text-slate-100">{selectedAsset.year}</p>
                    </div>
                    <div>
                      <p className="mb-2 text-slate-500">Status</p>
                      <StatusBadge status={String(selectedAsset.status || 'unknown')} />
                    </div>
                    <div>
                      <p className="text-slate-500">Vehicle key</p>
                      <p className="text-slate-100">{selectedAsset.vehicle_key}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Mask available</p>
                      <p className="text-slate-100">{selectedAsset.mask_available ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Version</p>
                      <p className="text-slate-100">{selectedAsset.version}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Created</p>
                      <p className="text-slate-100">{new Date(selectedAsset.created_at).toLocaleString()}</p>
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
