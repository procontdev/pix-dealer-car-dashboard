"use client";

// app/(dashboard)/color-specs/page.tsx
import { useMemo, useState } from 'react';
import { useColorSpecs } from '@/hooks/use-color-specs';
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

export default function ColorSpecsPage() {
  const { data: specs, isLoading } = useColorSpecs();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSpec, setSelectedSpec] = useState<any | null>(null);

  const filteredSpecs = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (specs || []).filter((spec) => {
      const matchesSearch = !term || [spec.name, spec.family, spec.hex_value, spec.strategy, spec.generation_profile].some((value) => String(value || '').toLowerCase().includes(term));
      const matchesStatus = statusFilter === 'all' || String(spec.status).toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [specs, search, statusFilter]);

  const columns: Column<any>[] = [
    {
      key: 'name',
      header: 'Color Name',
      render: (value) => <span className="font-medium text-white">{value}</span>,
    },
    {
      key: 'family',
      header: 'Family',
      render: (value) => <span className="text-slate-300">{value}</span>,
    },
    {
      key: 'hex_value',
      header: 'Hex',
      render: (value) => value ? <span className="text-slate-300 font-mono">{value}</span> : <span className="text-slate-400">-</span>,
    },
    {
      key: 'strategy',
      header: 'Strategy',
      render: (value) => <span className="text-slate-300">{value}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'primary_color',
      header: 'Primary',
      render: (value) => value ? <StatusBadge status="primary" /> : <span className="text-slate-400">-</span>,
    },
    {
      key: 'id',
      header: 'Details',
      render: (_, item) => (
        <button
          type="button"
          onClick={() => setSelectedSpec(item)}
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
        <h1 className="text-2xl font-bold text-white">Color Specifications</h1>
        <p className="text-slate-400">Manage color definitions and processing strategies</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:grid-cols-[1.4fr_0.8fr] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, family, hex, strategy or generation profile"
          className="h-10 border-slate-700 bg-slate-950/80 text-slate-100"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none"
        >
          <option value="all">All statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <DataTable
        data={filteredSpecs}
        columns={columns}
        loading={isLoading}
        emptyTitle="No color specs available"
        emptyDescription="Color definitions and generation strategies will appear here when configured in the system."
      />

      <Dialog open={!!selectedSpec} onOpenChange={(open) => !open && setSelectedSpec(null)}>
        <DialogContent className="max-w-2xl border border-slate-800 bg-slate-950 text-slate-100">
          {selectedSpec && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedSpec.name}</DialogTitle>
                <DialogDescription>
                  Color spec detail view with generation strategy and current readiness metadata.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:grid-cols-2">
                <div>
                  <p className="text-slate-500">Family</p>
                  <p className="text-slate-100">{selectedSpec.family || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Hex</p>
                  <p className="font-mono text-slate-100">{selectedSpec.hex_value || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500">RGB</p>
                  <p className="text-slate-100">
                    {selectedSpec.rgb ? `${selectedSpec.rgb.r}, ${selectedSpec.rgb.g}, ${selectedSpec.rgb.b}` : '-'}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-slate-500">Status</p>
                  <StatusBadge status={String(selectedSpec.status || 'unknown')} />
                </div>
                <div>
                  <p className="text-slate-500">Strategy</p>
                  <p className="text-slate-100">{selectedSpec.strategy}</p>
                </div>
                <div>
                  <p className="text-slate-500">Generation profile</p>
                  <p className="text-slate-100">{selectedSpec.generation_profile || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Primary color</p>
                  <p className="text-slate-100">{selectedSpec.primary_color ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Last generated</p>
                  <p className="text-slate-100">{selectedSpec.last_generated_at ? new Date(selectedSpec.last_generated_at).toLocaleString() : '-'}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
