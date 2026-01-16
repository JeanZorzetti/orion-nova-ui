import { Check, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const tasks = [
  {
    title: "Revisar relatório financeiro",
    time: "Há 2 horas",
    completed: true,
  },
  {
    title: "Aprovar pedido #1234",
    time: "Há 4 horas",
    completed: true,
  },
  {
    title: "Reunião com fornecedor",
    time: "Hoje, 15:00",
    completed: false,
  },
  {
    title: "Atualizar catálogo de produtos",
    time: "Amanhã",
    completed: false,
  },
];

const RecentTasksCard = () => {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Tarefas Recentes
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            4 tarefas no total
          </p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          Ver todas
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors cursor-pointer group"
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                task.completed
                  ? "bg-primary/20 text-primary"
                  : "border-2 border-muted-foreground/30 group-hover:border-primary/50"
              )}
            >
              {task.completed && <Check className="w-3.5 h-3.5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm truncate",
                  task.completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                )}
              >
                {task.title}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{task.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTasksCard;
