import Logo from "./Logo";

const OrionLogo = ({ collapsed = false }: { collapsed?: boolean }) => {
  return (
    <div className="flex items-center gap-3">
      <Logo className="h-9 w-auto text-primary" />
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
