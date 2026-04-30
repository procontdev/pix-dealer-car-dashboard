"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Building,
  ChevronLeft,
  ChevronRight,
  Car,
  Image,
  Images,
  MapPin,
  Monitor,
  Palette,
  Settings,
  Boxes,
  Layers3,
  Film,
  Rocket,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Dealers", href: "/dealers", icon: Building },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Base Assets", href: "/base-assets", icon: Car },
  { name: "Normalized Bases", href: "/normalized-bases", icon: Images },
  { name: "Inventory", href: "/inventory", icon: Boxes },
  { name: "Color Specs", href: "/color-specs", icon: Palette },
  { name: "Color Assets", href: "/color-assets", icon: Image },
  { name: "Compositions", href: "/compositions", icon: Layers3 },
  { name: "Video Jobs", href: "/video-jobs", icon: Film },
  { name: "Generate Jobs", href: "/generate-jobs", icon: Rocket },
  { name: "Monitoring", href: "/monitoring", icon: Monitor },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col border-r border-slate-800 bg-slate-950 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        {!collapsed && <h1 className="text-lg font-semibold text-white">Recolor Dashboard</h1>}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed((value) => !value)}
          className="text-slate-400 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white",
                collapsed && "justify-center",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
