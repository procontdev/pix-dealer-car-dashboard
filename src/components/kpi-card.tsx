// components/kpi-card.tsx
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function KPICard({ title, value, icon: Icon, description, trend }: KPICardProps) {
  return (
    <Card className="relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 backdrop-blur-sm shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)] transition-all duration-300 hover:border-slate-700 hover:shadow-[0_28px_80px_-32px_rgba(8,47,73,0.7)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_30%)]" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="relative flex items-center space-x-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-2.5 shadow-inner shadow-cyan-950/20">
            <Icon className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-sm font-medium text-slate-200">{title}</CardTitle>
            {description && (
              <p className="mt-0.5 text-xs text-slate-500">{description}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative pt-0">
        <div className="mb-2 text-3xl font-bold tracking-tight text-white">{value}</div>
        {trend && (
          <div className="flex items-center space-x-1">
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-400" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-400" />
            )}
            <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}% vs last period
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
