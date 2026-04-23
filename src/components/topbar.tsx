import { Search, Bell, User, Settings, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  const notificationCount = 3;
  const systemStatus = 'operational';

  return (
    <header className="bg-slate-950/95 backdrop-blur-sm border-b border-slate-800/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Vehicle Color AI</h2>
              <p className="text-xs text-slate-400 -mt-1">Operations Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-400" />
            <div className={`w-2 h-2 rounded-full ${systemStatus === 'operational' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm text-slate-300 capitalize">{systemStatus}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Global Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search assets, dealers, jobs..."
              className="pl-10 w-80 bg-slate-900/50 border-slate-700/50 text-white placeholder-slate-400 focus:border-slate-600 transition-colors"
            />
          </div>

          {/* Environment Badge */}
          <Badge variant="outline" className="border-slate-700 text-slate-300">
            Production
          </Badge>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-2 pl-4 border-l border-slate-800">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-slate-300" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-slate-400">Operations Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
