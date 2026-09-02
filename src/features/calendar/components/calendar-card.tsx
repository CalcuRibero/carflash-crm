import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PRIORITY_LABELS } from "@/features/tickets/types";
import { Ticket, TicketPriority } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Flame, LucideIcon, Minus } from "lucide-react";

const priorityBadgeConfig: Record<
    TicketPriority,
    { icon: LucideIcon; variant: "destructive" | "secondary"; className: string }
> = {
    critical: {
        icon: Flame,
        variant: "destructive",
        className: "border-transparent",
    },
    high: {
        icon: Flame,
        variant: "destructive",
        className: "border-transparent",
    },
    low: {
        icon: Minus,
        variant: "secondary",
        className: "bg-slate-500/10 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
    },
    medium: {
        icon: ArrowUpRight,
        variant: "secondary",
        className: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    },
};


export function CalendarCard({ ticket }: { ticket: Ticket }) {
    return (
        <article
            className="flex flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-xs transition-colors"
        >
            <div className="min-w-0 space-y-1.5">
                <div className="flex flex-col justify-between gap-3">
                    <div className="flex items-center">
                        <h3 className="min-w-0 truncate font-medium text-sm leading-none items-center">{ticket.title}</h3>
                    </div>
                    <Separator />
                    <div className="flex items-center gap-1">
                        <Badge
                            variant={ticket.isRecurrent ? "default" : "secondary"}
                            className="shrink-0 rounded-md border-transparent px-2 font-medium"
                        >
                            {ticket.isRecurrent ? "Fijo" : "Variable"}
                        </Badge>
                        <Badge
                            variant={priorityBadgeConfig[ticket.priority as TicketPriority].variant}
                            className={cn(
                                "shrink-0 rounded-md border-transparent px-2 font-medium",
                                priorityBadgeConfig[ticket.priority as TicketPriority].className,
                            )}
                        >
                            {/* <PriorityIcon data-icon="inline-start" /> */}
                            {PRIORITY_LABELS[ticket.priority]}
                        </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-end gap-2">
                        <p className="text-xs text-muted-foreground">
                            {new Date(ticket.createdAt).toLocaleDateString('es-AR')}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    )
}
