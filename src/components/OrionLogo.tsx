const OrionLogo = ({ collapsed = false }: { collapsed?: boolean }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Constellation/Atom Icon */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer ring */}
          <circle
            cx="20"
            cy="20"
            r="16"
            className="stroke-primary/30"
            strokeWidth="1"
          />
          {/* Inner orbits */}
          <ellipse
            cx="20"
            cy="20"
            rx="12"
            ry="6"
            className="stroke-primary/40"
            strokeWidth="1"
            transform="rotate(-30 20 20)"
          />
          <ellipse
            cx="20"
            cy="20"
            rx="12"
            ry="6"
            className="stroke-primary/40"
            strokeWidth="1"
            transform="rotate(30 20 20)"
          />
          {/* Core */}
          <circle cx="20" cy="20" r="3" className="fill-primary animate-pulse-glow" />
          {/* Orbital dots */}
          <circle cx="8" cy="20" r="1.5" className="fill-accent" />
          <circle cx="32" cy="20" r="1.5" className="fill-primary" />
          <circle cx="20" cy="8" r="1.5" className="fill-primary/60" />
        </svg>
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
