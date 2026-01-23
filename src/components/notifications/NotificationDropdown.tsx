"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  DollarSign,
  CreditCard,
  HelpCircle,
  Settings,
  Check,
  Trash2,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationDropdownProps {
  onUpdate?: () => void;
}

export default function NotificationDropdown({
  onUpdate,
}: NotificationDropdownProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications?limit=10");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "INFO":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "SUCCESS":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "WARNING":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "ERROR":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "PAYMENT":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case "SUBSCRIPTION":
        return <CreditCard className="h-5 w-5 text-primary" />;
      case "SUPPORT":
        return <HelpCircle className="h-5 w-5 text-blue-500" />;
      case "SYSTEM":
        return <Settings className="h-5 w-5 text-gray-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    setLoadingId(notification.id);

    try {
      // Marcar como lida
      if (!notification.isRead) {
        await fetch(`/api/notifications/${notification.id}`, {
          method: "PATCH",
        });
      }

      // Navegar para o link se existir
      if (notification.link) {
        router.push(notification.link);
      }

      // Atualizar lista
      await fetchNotifications();
      onUpdate?.();
    } catch (error) {
      console.error("Erro ao processar notificação:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
      });

      await fetchNotifications();
      onUpdate?.();
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    }
  };

  const handleDeleteNotification = async (
    e: React.MouseEvent,
    id: string
  ) => {
    e.stopPropagation();
    setLoadingId(id);

    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });

      await fetchNotifications();
      onUpdate?.();
    } catch (error) {
      console.error("Erro ao deletar notificação:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Notificações</h3>
        {notifications.some((n) => !n.isRead) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-xs"
          >
            <Check className="mr-1 h-3 w-3" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhuma notificação</p>
        </div>
      ) : (
        <ScrollArea className="h-96">
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-accent cursor-pointer transition-colors relative group ${
                  !notification.isRead ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="mt-0.5">{getIcon(notification.type)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-sm font-medium ${
                          !notification.isRead ? "font-semibold" : ""
                        }`}
                      >
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={(e) =>
                      handleDeleteNotification(e, notification.id)
                    }
                    disabled={loadingId === notification.id}
                  >
                    {loadingId === notification.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
