import { useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

export interface ActiveSubscription {
  planId: "starter" | "pro" | "lifetime";
  status: string;
  activeUntil: string | null;
}

export function useActiveSubscription(userId: string | undefined) {
  const [subscription, setSubscription] = useState<ActiveSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("active_subscription")
      .select("plan_id, status, active_until")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("[Code Mage] Erro ao carregar assinatura:", error.message);
    } else if (data) {
      setSubscription({ planId: data.plan_id, status: data.status, activeUntil: data.active_until });
    } else {
      setSubscription(null);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { subscription, loading, refresh };
}
