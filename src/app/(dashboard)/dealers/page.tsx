"use client";

// app/(dashboard)/dealers/page.tsx
import { useMemo, useState } from 'react';
import { useDealers } from '@/hooks/use-dealers';
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

export default function DealersPage() {
  const { data: dealers, isLoading } = useDealers();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDealer, setSelectedDealer] = useState<any | null>(null);

  const filteredDealers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (dealers || []).filter((dealer) => {
      const dealerStatus = dealer.status === true || String(dealer.status).toLowerCase() === 'true' ? 'active' : String(dealer.status).toLowerCase();
      const matchesSearch = !term || [dealer.name, dealer.dealer_code, dealer.id].some((value) => String(value || '').toLowerCase().includes(term));
      const matchesStatus = statusFilter === 'all' || dealerStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [dealers, search, statusFilter]);

  const columns: Column<any>[] = [
    {
      key: 'name',
      header: 'Dealer Name',
      render: (value) => <span className="font-medium text-white">{value}</span>,
    },
    {
      key: 'location_count',
      header: 'Locations',
      render: (value) => <span className="text-slate-300">{value}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value === true || String(value).toLowerCase() === 'true' ? 'active' : String(value || 'unknown')} />,
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (value) => (
        <span className="text-slate-400 text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'id',
      header: 'Details',
      render: (_, item) => (
        <button
          type="button"
          onClick={() => setSelectedDealer(item)}
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
        <h1 className="text-2xl font-bold text-white">Dealers</h1>
        <p className="text-slate-400">Manage and monitor dealer accounts</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:grid-cols-[1.4fr_0.8fr] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by dealer name, code or id"
          className="h-10 border-slate-700 bg-slate-950/80 text-slate-100"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <DataTable
        data={filteredDealers}
        columns={columns}
        loading={isLoading}
        emptyTitle="No dealers registered"
        emptyDescription="Active dealer accounts will appear here once they are available in the catalog."
      />

      <Dialog open={!!selectedDealer} onOpenChange={(open) => !open && setSelectedDealer(null)}>
        <DialogContent className="max-w-2xl border border-slate-800 bg-slate-950 text-slate-100">
          {selectedDealer && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedDealer.name}</DialogTitle>
                <DialogDescription>
                  Dealer detail view with catalog identity and current operational status.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:grid-cols-2">
                <div>
                  <p className="text-slate-500">Dealer code</p>
                  <p className="text-slate-100">{selectedDealer.dealer_code || '-'}</p>
                </div>
                <div>
                  <p className="mb-2 text-slate-500">Status</p>
                  <StatusBadge status={selectedDealer.status === true || String(selectedDealer.status).toLowerCase() === 'true' ? 'active' : String(selectedDealer.status || 'unknown')} />
                </div>
                <div>
                  <p className="text-slate-500">Locations</p>
                  <p className="text-slate-100">{selectedDealer.location_count}</p>
                </div>
                <div>
                  <p className="text-slate-500">Dealer ID</p>
                  <p className="break-all font-mono text-slate-100">{selectedDealer.id}</p>
                </div>
                <div>
                  <p className="text-slate-500">Created</p>
                  <p className="text-slate-100">{new Date(selectedDealer.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Updated</p>
                  <p className="text-slate-100">{new Date(selectedDealer.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
