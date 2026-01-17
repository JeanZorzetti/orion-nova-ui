"use client";

import { SubscriptionBanner } from "@/components/subscription-banner";
import { useSubscription } from "@/hooks/use-subscription";

export function DashboardSubscriptionWrapper({ children }: { children: React.ReactNode }) {
  const subscription = useSubscription();

  return (
    <>
      <SubscriptionBanner
        status={subscription.status}
        daysRemaining={subscription.daysRemaining}
        message={subscription.message}
      />
      <div className={subscription.status !== "ACTIVE" && subscription.daysRemaining !== null && subscription.daysRemaining <= 7 ? "mt-14" : ""}>
        {children}
      </div>
    </>
  );
}
