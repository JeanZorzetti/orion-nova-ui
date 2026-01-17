"use client";

import { useSession } from "next-auth/react";
import { checkSubscriptionStatus, getSubscriptionMessage, getSubscriptionBadgeColor, SubscriptionInfo } from "@/lib/subscription";
import { useMemo } from "react";

export function useSubscription(): SubscriptionInfo & {
  message: string;
  badgeColor: "default" | "secondary" | "destructive" | "outline";
  isLoading: boolean;
} {
  const { data: session, status } = useSession();

  const subscriptionInfo = useMemo(() => {
    if (status === "loading" || !session?.user) {
      return {
        status: "TRIAL" as const,
        isActive: false,
        trialEndsAt: null,
        daysRemaining: null,
        canAccess: false,
        message: "Carregando...",
        badgeColor: "outline" as const,
        isLoading: true,
      };
    }

    const user = session.user as any; // Type assertion pois o NextAuth type não inclui nossos campos customizados

    const info = checkSubscriptionStatus({
      subscriptionStatus: user.subscriptionStatus || "TRIAL",
      trialEndsAt: user.trialEndsAt ? new Date(user.trialEndsAt) : null,
      createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
    });

    const message = getSubscriptionMessage(info);
    const badgeColor = getSubscriptionBadgeColor(info);

    return {
      ...info,
      message,
      badgeColor,
      isLoading: false,
    };
  }, [session, status]);

  return subscriptionInfo;
}
