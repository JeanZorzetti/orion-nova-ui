"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PushNotificationButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se o navegador suporta notificações push
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error("Erro ao verificar subscrição:", error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    setIsLoading(true);

    try {
      // Pedir permissão de notificação
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        toast({
          title: "Permissão negada",
          description:
            "Você precisa permitir notificações para receber alertas.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Registrar service worker
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // Pegar chave pública VAPID
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error("VAPID public key não configurada");
      }

      const convertedVapidKey = urlBase64ToUint8Array(publicKey);

      // Criar subscrição push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      // Enviar subscrição para o backend
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar subscrição");
      }

      setIsSubscribed(true);
      toast({
        title: "Notificações ativadas!",
        description: "Você receberá alertas mesmo com o app fechado.",
      });
    } catch (error: any) {
      console.error("Erro ao ativar notificações push:", error);
      toast({
        title: "Erro",
        description:
          error.message || "Não foi possível ativar as notificações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        setIsSubscribed(false);
        setIsLoading(false);
        return;
      }

      // Cancelar subscrição no navegador
      await subscription.unsubscribe();

      // Remover subscrição do backend
      await fetch(
        `/api/push/unsubscribe?endpoint=${encodeURIComponent(
          subscription.endpoint
        )}`,
        {
          method: "DELETE",
        }
      );

      setIsSubscribed(false);
      toast({
        title: "Notificações desativadas",
        description: "Você não receberá mais alertas push.",
      });
    } catch (error: any) {
      console.error("Erro ao desativar notificações push:", error);
      toast({
        title: "Erro",
        description:
          error.message || "Não foi possível desativar as notificações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null; // Navegador não suporta push notifications
  }

  return (
    <Button
      variant={isSubscribed ? "outline" : "default"}
      size="sm"
      onClick={isSubscribed ? unsubscribe : subscribe}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isSubscribed ? "Desativando..." : "Ativando..."}
        </>
      ) : isSubscribed ? (
        <>
          <BellOff className="mr-2 h-4 w-4" />
          Desativar Push
        </>
      ) : (
        <>
          <Bell className="mr-2 h-4 w-4" />
          Ativar Notificações Push
        </>
      )}
    </Button>
  );
}
