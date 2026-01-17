"use client";

import { Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function CalendarDropdown() {
  // Mock events - em produção, viriam da API
  const events = [
    {
      id: 1,
      title: "Reunião com cliente",
      date: "Hoje às 14:00",
      type: "meeting",
    },
    {
      id: 2,
      title: "Vencimento de conta",
      date: "Amanhã às 10:00",
      type: "payment",
    },
    {
      id: 3,
      title: "Entrega de pedido #1234",
      date: "23/01 às 09:00",
      type: "delivery",
    },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case "meeting":
        return "bg-blue-500";
      case "payment":
        return "bg-destructive";
      case "delivery":
        return "bg-green-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl">
          <Calendar className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Próximos Eventos</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {events.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhum evento próximo
          </div>
        ) : (
          <>
            {events.map((event) => (
              <DropdownMenuItem
                key={event.id}
                className="flex items-start gap-3 p-3 cursor-pointer"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 ${getEventColor(
                    event.type
                  )}`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.date}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-xs text-primary cursor-pointer">
              Ver agenda completa
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
