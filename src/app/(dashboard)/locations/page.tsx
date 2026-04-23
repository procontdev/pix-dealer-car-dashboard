"use client";

// app/(dashboard)/locations/page.tsx
import { useMemo, useState } from 'react';
import { useLocations } from '@/hooks/use-locations';
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

export default function LocationsPage() {
  const { data: locations, isLoading } = useLocations();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);

  const filteredLocations = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (locations || []).filter((location) => {
      const matchesSearch = !term || [location.name, location.address, location.source_type, location.dealer_id].some((value) => String(value || '').toLowerCase().includes(term));
      const matchesStatus = statusFilter === 'all' || String(location.status).toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [locations, search, statusFilter]);

  if (isLoading) {
    return <div className="text-slate-400">Loading locations...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Locations</h1>
        <p className="text-slate-400">Manage background locations for compositions</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:grid-cols-[1.4fr_0.8fr] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by location, address, source or dealer id"
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
          <option value="pending_review">Pending review</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations?.map((location) => (
          <Card key={location.id} className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-white">{location.name}</CardTitle>
                <StatusBadge status={location.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImagePreview
                src={location.image_url}
                alt={location.name}
                width={300}
                height={200}
              />
              <div className="space-y-2 text-sm">
                <p className="text-slate-300">
                  <span className="font-medium">Dealer:</span> {location.dealer_id}
                </p>
                <p className="text-slate-300">
                  <span className="font-medium">Primary:</span> {location.primary ? 'Yes' : 'No'}
                </p>
                <p className="text-slate-300">
                  <span className="font-medium">Source:</span> {location.source_type}
                </p>
                <p className="text-slate-400">
                  Created: {new Date(location.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLocation(location)}
                className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70"
              >
                View details
              </button>
            </CardContent>
          </Card>
        )) || (
          <div className="col-span-full text-center text-slate-400 py-8">
            No locations found
          </div>
        )}
      </div>

      <Dialog open={!!selectedLocation} onOpenChange={(open) => !open && setSelectedLocation(null)}>
        <DialogContent className="max-w-3xl border border-slate-800 bg-slate-950 text-slate-100">
          {selectedLocation && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedLocation.name}</DialogTitle>
                <DialogDescription>
                  Location detail view with source, assignment and review state.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div>
                  <ImagePreview
                    src={selectedLocation.image_url || ''}
                    alt={selectedLocation.name || 'Location'}
                    width={540}
                    height={360}
                  />
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Dealer ID</p>
                      <p className="text-slate-100">{selectedLocation.dealer_id}</p>
                    </div>
                    <div>
                      <p className="mb-2 text-slate-500">Status</p>
                      <StatusBadge status={String(selectedLocation.status || 'unknown')} />
                    </div>
                    <div>
                      <p className="text-slate-500">Primary</p>
                      <p className="text-slate-100">{selectedLocation.primary ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Source type</p>
                      <p className="text-slate-100">{selectedLocation.source_type || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-500">Address</p>
                      <p className="text-slate-100">{selectedLocation.address || 'No resolved address'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-500">Created</p>
                      <p className="text-slate-100">{new Date(selectedLocation.created_at).toLocaleString()}</p>
                    </div>
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
