"use client";

import { Shield, Lock, Award, Zap } from "lucide-react";
import { ReactNode } from "react";

interface Badge {
  icon: ReactNode;
  label: string;
}

interface TrustBadgesProps {
  variant?: "default" | "compact";
}

const badges: Badge[] = [
  {
    icon: <Shield className="w-5 h-5" />,
    label: "ISO 27001",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    label: "LGPD Compliant",
  },
  {
    icon: <Award className="w-5 h-5" />,
    label: "AWS Partner",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "99.9% Uptime",
  },
];

export default function TrustBadges({
  variant = "default",
}: TrustBadgesProps) {
  if (variant === "compact") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-6">
        {badges.map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm text-muted-foreground opacity-60 hover:opacity-100 transition-opacity"
          >
            <div className="text-primary">{badge.icon}</div>
            <span>{badge.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {badge.icon}
          </div>
          <p className="text-sm font-medium text-center">{badge.label}</p>
        </div>
      ))}
    </div>
  );
}
