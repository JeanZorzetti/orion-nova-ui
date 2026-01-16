import { Activity, Wifi, Server } from "lucide-react";

const SystemStatusCard = () => {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Status do Sistema
          </h3>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {/* Status Online */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div className="flex items-center gap-3">
            <Wifi className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-green-500 font-medium">Online</span>
          </div>
        </div>

        {/* Latência */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div className="flex items-center gap-3">
            <Server className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Latência</span>
          </div>
          <span className="text-sm text-primary font-medium">12ms</span>
        </div>

        {/* Uptime Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Uptime (30 dias)</span>
            <span className="text-xs text-primary font-medium">99.98%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full gradient-primary"
              style={{ width: "99.98%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusCard;
