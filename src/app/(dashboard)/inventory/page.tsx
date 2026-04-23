"use client";

import { useMemo, useState } from "react";
import { DataTable, Column } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { useInventory } from "@/hooks/use-inventory";
import type { InventoryItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function InventoryPage() {
  const { data: inventory, isLoading } = useInventory();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredInventory = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (inventory || []).filter((item) => {
      const matchesSearch = !term || [
        item.vehicle_key,
        item.stock_number,
        item.vin,
        item.dealer_name,
        item.location_name,
        item.make,
        item.model,
        item.color_name,
      ].some((value) => String(value || "").toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "all" ||
        String(item.inventory_status).toLowerCase() === statusFilter ||
        String(item.composition_status).toLowerCase() === statusFilter ||
        String(item.video_status).toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inventory, search, statusFilter]);

  const columns: Column<InventoryItem>[] = [
    {
      key: "vehicle_key",
      header: "Vehicle",
      render: (_, item) => (
        <div>
          <p className="font-medium text-white">{item.year} {item.make} {item.model} {item.trim}</p>
          <p className="text-xs text-slate-400">{item.stock_number} • {item.vin}</p>
        </div>
      ),
    },
    {
      key: "dealer_name",
      header: "Dealer",
      render: (value, item) => (
        <div>
          <p className="text-slate-200">{value || item.dealer_id}</p>
          <p className="text-xs text-slate-500">{item.location_name || "No location"}</p>
        </div>
      ),
    },
    {
      key: "color_name",
      header: "Color",
      render: (value, item) => <span className="text-slate-300">{value || item.color_code || "-"}</span>,
    },
    {
      key: "inventory_status",
      header: "Inventory",
      render: (value) => <StatusBadge status={String(value || "unknown")} />,
    },
    {
      key: "composition_status",
      header: "Composition",
      render: (value) => <StatusBadge status={String(value || "unknown")} />,
    },
    {
      key: "video_status",
      header: "Video",
      render: (value) => <StatusBadge status={String(value || "unknown")} />,
    },
    {
      key: "priority",
      header: "Priority",
      render: (value) => <span className="text-slate-300">{value}</span>,
    },
    {
      key: "id",
      header: "Details",
      render: (_, item) => (
        <button
          type="button"
          onClick={() => setSelectedItem(item)}
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
        <h1 className="text-2xl font-bold text-white">Inventory</h1>
        <p className="text-slate-400">Operational bridge between dealer, location, asset and color generation</p>
      </div>

      <div className="grid gap-4 rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:grid-cols-[1.4fr_0.8fr] shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by vehicle, VIN, stock number, dealer or location"
          className="h-10 border-slate-700 bg-slate-950/80 text-slate-100"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <DataTable
        data={filteredInventory}
        columns={columns}
        loading={isLoading}
        emptyTitle="No inventory linked yet"
        emptyDescription="Inventory records will appear here once dealers, assets, colors and locations are connected."
      />

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-3xl border border-slate-800 bg-slate-950 text-slate-100">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.year} {selectedItem.make} {selectedItem.model} {selectedItem.trim}</DialogTitle>
                <DialogDescription>
                  Inventory detail view for operational tracing across dealer, location, composition and video flow.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Dealer</p>
                      <p className="text-slate-100">{selectedItem.dealer_name || selectedItem.dealer_id}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Location</p>
                      <p className="text-slate-100">{selectedItem.location_name || 'No location'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Vehicle key</p>
                      <p className="text-slate-100">{selectedItem.vehicle_key}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Stock number</p>
                      <p className="text-slate-100">{selectedItem.stock_number}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">VIN</p>
                      <p className="text-slate-100">{selectedItem.vin}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Run ID</p>
                      <p className="font-mono text-slate-100">{selectedItem.run_id || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Color</p>
                      <p className="text-slate-100">{selectedItem.color_name || selectedItem.color_code || '-'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Quantity</p>
                      <p className="text-slate-100">{selectedItem.quantity}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="mb-2 text-slate-500">Inventory status</p>
                      <StatusBadge status={String(selectedItem.inventory_status || 'unknown')} />
                    </div>
                    <div>
                      <p className="mb-2 text-slate-500">Composition</p>
                      <StatusBadge status={String(selectedItem.composition_status || 'unknown')} />
                    </div>
                    <div>
                      <p className="mb-2 text-slate-500">Video</p>
                      <StatusBadge status={String(selectedItem.video_status || 'unknown')} />
                    </div>
                    <div>
                      <p className="text-slate-500">Priority</p>
                      <p className="text-slate-100">{selectedItem.priority}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Composition enabled</p>
                      <p className="text-slate-100">{selectedItem.enable_composition ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Video enabled</p>
                      <p className="text-slate-100">{selectedItem.enable_video360 ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm">
                    <p className="mb-2 text-slate-500">Fingerprint</p>
                    <p className="break-all font-mono text-slate-200">{selectedItem.fingerprint || '-'}</p>
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
