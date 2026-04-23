// components/status-badge.tsx
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, AlertCircle, Play, Pause } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  showIcon?: boolean;
}

export function StatusBadge({ status, variant, showIcon = true }: StatusBadgeProps) {
  const getBadgeProps = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'approved':
      case 'success':
        return {
          variant: 'default' as const,
          className: 'bg-green-900/20 text-green-300 border-green-700/30',
          icon: CheckCircle
        };
      case 'processing':
      case 'pending':
      case 'running':
        return {
          variant: 'secondary' as const,
          className: 'bg-yellow-900/20 text-yellow-300 border-yellow-700/30',
          icon: Clock
        };
      case 'failed':
      case 'rejected':
      case 'error':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-900/20 text-red-300 border-red-700/30',
          icon: XCircle
        };
      case 'fallback':
      case 'warning':
        return {
          variant: 'outline' as const,
          className: 'border-orange-700/30 text-orange-300',
          icon: AlertCircle
        };
      case 'active':
        return {
          variant: 'default' as const,
          className: 'bg-blue-900/20 text-blue-300 border-blue-700/30',
          icon: Play
        };
      case 'inactive':
        return {
          variant: 'secondary' as const,
          className: 'bg-slate-800/50 text-slate-400 border-slate-700/30',
          icon: Pause
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'border-slate-700/30 text-slate-400',
          icon: null
        };
    }
  };

  const badgeProps = getBadgeProps(status);
  const IconComponent = badgeProps.icon;

  return (
    <Badge
      variant={variant || badgeProps.variant}
      className={`${badgeProps.className} flex items-center space-x-1 px-2 py-1`}
    >
      {showIcon && IconComponent && <IconComponent className="h-3 w-3" />}
      <span className="capitalize font-medium">{status}</span>
    </Badge>
  );
}