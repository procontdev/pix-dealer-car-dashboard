// app/(dashboard)/settings/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400">Read-only operational reference for current defaults and planned administrative controls</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">AI Models</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Default Model</label>
              <p className="text-slate-400">nano-banana-2-edit (MuAPI)</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Fallback Model</label>
              <p className="text-slate-400">Deterministic Enhanced</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-400">
              Source of truth today: backend strategy selection and premium recolor provider integration.
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Processing Defaults</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Quality Threshold</label>
              <p className="text-slate-400">0.85</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Max Processing Time</label>
              <p className="text-slate-400">240 seconds</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-400">
              Planned next phase: expose runtime-safe defaults as read-only config with eventual admin editing.
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">System Flags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Auto Fallback</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Transparent Export</span>
              <span className="text-green-400">Enabled</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-400">
              Current MVP behavior is derived from backend pipeline capabilities, not editable frontend controls.
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Backend URL</label>
              <p className="text-slate-400">http://localhost:8000</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Database</label>
              <p className="text-slate-400">PostgreSQL 17.9</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-400">
              Dashboard now consumes aggregated operational endpoints for home and monitoring to reduce perceived latency.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Planned Admin Surface</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm font-medium text-slate-200">Prompt Templates</p>
            <p className="mt-2 text-sm text-slate-400">Future read/write management for composition and video prompt resolution.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm font-medium text-slate-200">Execution Profiles</p>
            <p className="mt-2 text-sm text-slate-400">Future operational presets for deterministic and premium generation paths.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm font-medium text-slate-200">Master Tables</p>
            <p className="mt-2 text-sm text-slate-400">Future administrative control over catalogs, defaults and pipeline metadata.</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <p className="text-sm font-medium text-slate-200">System Flags</p>
            <p className="mt-2 text-sm text-slate-400">Future guarded toggles once runtime-safe backend exposure is defined.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
