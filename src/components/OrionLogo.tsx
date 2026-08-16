import { Logo } from "./Logo";

const OrionLogo = ({ collapsed = false }: { collapsed?: boolean }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 flex items-center justify-center">
        <Logo className="w-full h-full text-primary" />
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-lg font-semibold tracking-wide gradient-text">
            ORION
          </span>
          <span className="text-[10px] text-muted-foreground tracking-[0.2em] -mt-1">
            ERP SYSTEM
          </span>
        </div>
      )}
    </div>
  );
};

export default OrionLogo;
