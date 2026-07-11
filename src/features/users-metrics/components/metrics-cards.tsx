import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, Mail } from "lucide-react";
import { MetricsCardsProps } from "../type";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricsCards({ tickets = [], isLoading, errorMessage }: MetricsCardsProps) {

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
                <Skeleton className="size-32 rounded-xl" />
                <Skeleton className="size-32 rounded-xl" />
                <Skeleton className="size-32 rounded-xl" />
            </div>
        )
    }

    const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
    const openCount = tickets.filter((t) => t.status === "open").length;
    const overdueCount = tickets.filter((t) => {
        if (!t.dueDate) return false;
        const dueDate = new Date(t.dueDate);
        return dueDate < new Date() && t.status !== "resolved" && t.status !== "closed";
    }).length;


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tickets en Progreso */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Clock className="size-5 text-primary" />
                            </div>
                            <CardTitle className="text-base">Tickets en Progreso</CardTitle>
                        </div>
                        <Badge variant="default" className="gap-1">
                            <span className="size-2 rounded-full bg-green-500" />
                            Activo
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{inProgressCount}</div>
                </CardContent>
            </Card>

            {/* Tickets Abiertos */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-yellow-500/10">
                                <Mail className="size-5 text-yellow-600" />
                            </div>
                            <CardTitle className="text-base">Tickets Abiertos</CardTitle>
                        </div>
                        <Badge variant="outline" className="gap-1">
                            <AlertTriangle className="size-3 text-yellow-600" />
                            Nuevo
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{openCount}</div>
                </CardContent>
            </Card>

            {/* Tickets Atrasados */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-red-500/10">
                                <AlertTriangle className="size-5 text-red-600" />
                            </div>
                            <CardTitle className="text-base">Tickets Atrasados</CardTitle>
                        </div>
                        <Badge variant="destructive" className="gap-1">
                            <span className="size-2 rounded-full bg-red-500" />
                            Crítico
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{overdueCount}</div>
                </CardContent>
            </Card>
        </div>
    )
}