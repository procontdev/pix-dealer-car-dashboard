"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useColorSpecs } from "@/hooks/use-color-specs";
import { useInventory } from "@/hooks/use-inventory";
import { useLocations } from "@/hooks/use-locations";
import { apiClient } from "@/lib/api";
import type { ColorSpec, DashboardGenerationJobResponse, VehicleGroup } from "@/lib/types";

export default function GenerateJobsPage() {
  const { data: inventory, isLoading: inventoryLoading } = useInventory();
  const { data: colorSpecs, isLoading: colorSpecsLoading } = useColorSpecs();
  const { data: locations } = useLocations();

  const [jobType, setJobType] = useState("color_assets");
  const [scopeType, setScopeType] = useState("inventory");
  const [selectedVehicleKeys, setSelectedVehicleKeys] = useState<string[]>([]);
  const [selectedColorSpecIds, setSelectedColorSpecIds] = useState<string[]>([]);
  const [dealerLocationId, setDealerLocationId] = useState("");
  const [generationMode, setGenerationMode] = useState("missing_only");
  const [recolorStrategy, setRecolorStrategy] = useState("deterministic_enhanced");
  const [exportTransparentPng, setExportTransparentPng] = useState(true);
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("normal");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<DashboardGenerationJobResponse | null>(null);
  const [error, setError] = useState("");

  const availableInventory = useMemo(() => inventory || [], [inventory]);
  const availableColorSpecs = useMemo(() => colorSpecs || [], [colorSpecs]);
  const availableLocations = useMemo(() => locations || [], [locations]);

  const normalizeVehicleKey = (value: string | null | undefined) => String(value || "").trim().toLowerCase();

  // Debug logging (only in browser)
  if (typeof window !== 'undefined' && availableColorSpecs.length > 0) {
    console.log('Color specs loaded:', availableColorSpecs.length, 'specs');
    console.log('Sample spec:', availableColorSpecs[0]);
  }

  // Group inventory by vehicle_key
  const vehicleGroups = useMemo((): VehicleGroup[] => {
    const groups: Record<string, VehicleGroup> = {};
    const colorSpecsByVehicleKey = new Map<string, ColorSpec[]>();
    const colorSpecsById = new Map<string, ColorSpec>(availableColorSpecs.map((spec) => [spec.id, spec]));

    availableColorSpecs.forEach((spec) => {
      const key = normalizeVehicleKey(spec.vehicle_key);
      const existingSpecs = colorSpecsByVehicleKey.get(key) || [];
      existingSpecs.push(spec);
      colorSpecsByVehicleKey.set(key, existingSpecs);
    });

    availableInventory.forEach((item) => {
      const key = item.vehicle_key;
      if (!groups[key]) {
        groups[key] = {
          vehicle_key: key,
          year: item.year,
          make: item.make,
          model: item.model,
          trim: item.trim,
          inventory_count: 0,
          color_specs_count: 0,
          dealers: [],
          inventory_ids: [],
          color_spec_ids: [],
        };
      }

      groups[key].inventory_count++;
      groups[key].inventory_ids.push(item.id);

      if (item.color_spec_id && !groups[key].color_spec_ids.includes(item.color_spec_id)) {
        groups[key].color_spec_ids.push(item.color_spec_id);
      }

      if (item.dealer_name && !groups[key].dealers.includes(item.dealer_name)) {
        groups[key].dealers.push(item.dealer_name);
      }
    });

    Object.values(groups).forEach((group) => {
      const matchedByVehicleKey = colorSpecsByVehicleKey.get(normalizeVehicleKey(group.vehicle_key)) || [];
      const matchedByInventoryIds = group.color_spec_ids
        .map((specId) => colorSpecsById.get(specId))
        .filter((spec): spec is NonNullable<typeof spec> => Boolean(spec));
      const vehicleSpecs = Array.from(new Map(
        [...matchedByVehicleKey, ...matchedByInventoryIds].map((spec) => [spec.id, spec]),
      ).values());

      group.color_specs_count = vehicleSpecs.length;
      group.color_spec_ids = vehicleSpecs.map((spec) => spec.id);
    });

    return Object.values(groups);
  }, [availableInventory, availableColorSpecs]);

  const selectedVehicleGroups = useMemo(
    () => vehicleGroups.filter((group) => selectedVehicleKeys.includes(group.vehicle_key)),
    [vehicleGroups, selectedVehicleKeys],
  );

  const selectedInventoryIds = useMemo(
    () => selectedVehicleGroups.flatMap((group) => group.inventory_ids),
    [selectedVehicleGroups],
  );

  const availableColorSpecsForSelection = useMemo(() => {
    if (selectedVehicleKeys.length === 0) {
      return [];
    }

    // When vehicles are selected, show only specs for those vehicles
    const selectedVehicleSpecs = new Set<string>();
    selectedVehicleKeys.forEach(vehicleKey => {
      const vehicleGroup = vehicleGroups.find(g => g.vehicle_key === vehicleKey);
      if (vehicleGroup) {
        vehicleGroup.color_spec_ids.forEach(specId => selectedVehicleSpecs.add(specId));
      }
    });

    return availableColorSpecs.filter(spec => selectedVehicleSpecs.has(spec.id));
  }, [selectedVehicleKeys, availableColorSpecs, vehicleGroups]);

  const selectedSpecs = useMemo(
    () => availableColorSpecs.filter((item) => selectedColorSpecIds.includes(item.id)),
    [availableColorSpecs, selectedColorSpecIds],
  );

  const estimatedColorAssets = useMemo(() => {
    if (selectedVehicleKeys.length === 0) return 0;

    return selectedVehicleGroups.reduce((total, vehicleGroup) => {
      const vehicleSpecs = availableColorSpecs.filter(
        (spec) => normalizeVehicleKey(spec.vehicle_key) === normalizeVehicleKey(vehicleGroup.vehicle_key),
      );
      const specsForThisVehicle = selectedSpecs.filter(spec => vehicleSpecs.some(vs => vs.id === spec.id));
      return total + (vehicleGroup.inventory_ids.length * Math.max(specsForThisVehicle.length, 1));
    }, 0);
  }, [availableColorSpecs, selectedSpecs, selectedVehicleGroups, selectedVehicleKeys.length]);

  const estimatedCompositions = jobType === "compositions" || jobType === "color_assets_and_compositions"
    ? estimatedColorAssets
    : 0;

  function toggleSelection(current: string[], id: string) {
    return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    setResult(null);

    try {
      const response = await apiClient.createGenerationJob({
        job_type: jobType,
        scope_type: scopeType,
        inventory_ids: selectedInventoryIds,
        color_spec_ids: selectedColorSpecIds,
        dealer_location_id: dealerLocationId || null,
        generation_mode: generationMode,
        recolor_strategy: recolorStrategy,
        export_transparent_png: exportTransparentPng,
        notes,
        priority,
      });

      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create generation job");
    } finally {
      setSubmitting(false);
    }
  }

  // Show loading state if data is not available
  if (inventoryLoading || colorSpecsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Generate Jobs</h1>
          <p className="text-slate-400">Prepare queue state and trigger WF-01 from the dashboard</p>
        </div>
        <div className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-slate-400 flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
              <span>Loading inventory and color specifications...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Generate Jobs</h1>
        <p className="text-slate-400">Prepare queue state and trigger WF-01 from the dashboard</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
            <h2 className="mb-4 text-lg font-semibold text-white">Scope</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Job Type</label>
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none">
                  <option value="color_assets">Color Assets</option>
                  <option value="compositions">Compositions</option>
                  <option value="color_assets_and_compositions">Color Assets + Compositions</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Scope Type</label>
                <select value={scopeType} onChange={(e) => setScopeType(e.target.value)} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none">
                  <option value="inventory">Inventory</option>
                </select>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-medium text-slate-200">Vehicle Selection</p>
                <div className="max-h-72 space-y-2 overflow-auto rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                  {vehicleGroups.map((group) => (
                    <label key={group.vehicle_key} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 p-3 hover:bg-slate-900/70">
                      <input type="checkbox" checked={selectedVehicleKeys.includes(group.vehicle_key)} onChange={() => setSelectedVehicleKeys(toggleSelection(selectedVehicleKeys, group.vehicle_key))} className="mt-1" />
                      <div className="text-sm">
                        <p className="text-white">{group.year} {group.make} {group.model} {group.trim}</p>
                        <p className="text-slate-400">{group.inventory_count} inventory • {group.color_specs_count} color specs • {group.dealers.join(", ")}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-slate-200">
                  Color Specs Selection
                  {selectedVehicleKeys.length === 0 && (
                    <span className="ml-2 text-xs text-slate-500">(select a vehicle first)</span>
                  )}
                </p>
                <div className="max-h-72 space-y-2 overflow-auto rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                  {selectedVehicleKeys.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-800 px-4 py-8 text-center text-sm text-slate-500">
                      Select a vehicle to load available color variations
                    </div>
                  ) : (
                    availableColorSpecsForSelection.map((spec) => (
                      <label key={spec.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 p-3 hover:bg-slate-900/70">
                        <input type="checkbox" checked={selectedColorSpecIds.includes(spec.id)} onChange={() => setSelectedColorSpecIds(toggleSelection(selectedColorSpecIds, spec.id))} className="mt-1" />
                        <div className="text-sm">
                          <p className="text-white">{spec.name}</p>
                          <p className="text-slate-400">{spec.family || "No family"} • {spec.strategy}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm text-slate-300">Dealer Location</label>
              <select value={dealerLocationId} onChange={(e) => setDealerLocationId(e.target.value)} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none">
                <option value="">No location / transparent flow</option>
                {availableLocations.map((location) => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
            <h2 className="mb-4 text-lg font-semibold text-white">Generation Settings</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Generation Mode</label>
                <select value={generationMode} onChange={(e) => setGenerationMode(e.target.value)} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none">
                  <option value="missing_only">Missing Only</option>
                  <option value="force_regenerate">Force Regenerate</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Recolor Strategy</label>
                <select value={recolorStrategy} onChange={(e) => setRecolorStrategy(e.target.value)} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none">
                  <option value="deterministic_basic">deterministic_basic</option>
                  <option value="deterministic_enhanced">deterministic_enhanced</option>
                  <option value="muapi_nano-banana-2-edit">muapi_nano-banana-2-edit</option>
                  <option value="auto">auto</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-sm text-slate-200 outline-none">
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
                <input type="checkbox" checked={exportTransparentPng} onChange={(e) => setExportTransparentPng(e.target.checked)} />
                Export transparent PNG
              </label>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm text-slate-300">Notes</label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Reason for launch, regen context, expected outcome" className="h-10 border-slate-700 bg-slate-950/80 text-slate-100" />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
            <h2 className="mb-4 text-lg font-semibold text-white">Execution Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <span className="text-slate-400">Selected vehicles</span>
                <span className="text-white">{selectedVehicleGroups.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <span className="text-slate-400">Inventory items affected</span>
                <span className="text-white">{selectedInventoryIds.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <span className="text-slate-400">Selected color specs</span>
                <span className="text-white">{selectedSpecs.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <span className="text-slate-400">Estimated color assets</span>
                <span className="text-white">{estimatedColorAssets}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <span className="text-slate-400">Estimated compositions</span>
                <span className="text-white">{estimatedCompositions}</span>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
              Color Assets should be regenerated without dealer background. Use location only when intentionally preparing composition flow. Selected vehicles will generate {selectedInventoryIds.length} inventory items × {selectedSpecs.length} color variations = {estimatedColorAssets} color assets.
            </div>

            <Button onClick={handleSubmit} disabled={submitting || selectedVehicleKeys.length === 0 || selectedColorSpecIds.length === 0} className="mt-6 w-full">
              {submitting ? "Launching..." : "Launch Job"}
            </Button>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                {error}
              </div>
            )}
          </section>

          {result && (
            <section className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
              <h2 className="mb-4 text-lg font-semibold text-white">Job Result</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-500">Run ID</p>
                  <p className="font-mono text-slate-100">{result.run_id}</p>
                </div>
                <div>
                  <p className="text-slate-500">Queue prepared</p>
                  <p className="text-slate-100">{result.queue_items_prepared}</p>
                </div>
                <div>
                  <p className="text-slate-500">Trigger mode</p>
                  <p className="text-slate-100">{result.trigger_mode}</p>
                </div>
                <div>
                  <p className="text-slate-500">Notes</p>
                  <p className="text-slate-100">{result.notes || '-'}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={result.monitoring_url} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70">
                  Open Monitoring
                </Link>
                <Link href={result.color_assets_url} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70">
                  Open Color Assets
                </Link>
                <Link href={result.compositions_url} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-800/70">
                  Open Compositions
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
