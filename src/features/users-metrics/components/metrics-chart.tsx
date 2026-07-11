import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { useMemo } from "react";
import { chartConfig, MetricsChartProps } from "../type";


export function MetricsChart({ tickets }: MetricsChartProps) {

    const totalTickets = tickets.length;
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = {
            abierto: tickets.filter((t) => t.status === "open").length,
            resuelto: tickets.filter((t) => t.status === "resolved").length,
            en_progreso: tickets.filter((t) => t.status === "in_progress").length,
            cerrado: tickets.filter((t) => t.status === "closed").length,
        };
        return Object.entries(counts)
            .filter(([_, count]) => count > 0)
            .map(([status, count]) => ({ status, count }));
    }, [tickets]);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribución por Estado</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-48 h-48">
                        <ChartContainer config={chartConfig} className="aspect-square">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{totalTickets}</div>
                                        <div className="text-xs text-muted-foreground">TOTAL</div>
                                    </div>
                                </div>
                                {/* Simple CSS-based donut chart representation */}
                                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                    {statusCounts.map((item, index) => {
                                        const percentage = (item.count / totalTickets) * 100;
                                        const offset = statusCounts
                                            .slice(0, index)
                                            .reduce((acc, prev) => acc + (prev.count / totalTickets) * 100, 0);
                                        return (
                                            <circle
                                                key={item.status}
                                                cx="18"
                                                cy="18"
                                                r="15.91549430918954"
                                                fill="transparent"
                                                stroke={chartConfig[item.status as keyof typeof chartConfig]?.color}
                                                strokeWidth="3"
                                                strokeDasharray={`${percentage} ${100 - percentage}`}
                                                strokeDashoffset={-offset}
                                            />
                                        );
                                    })}
                                </svg>
                            </div>
                        </ChartContainer>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {statusCounts.map((item) => (
                            <div key={item.status} className="flex items-center gap-2">
                                <div
                                    className="size-3 rounded-full"
                                    style={{
                                        backgroundColor: chartConfig[item.status as keyof typeof chartConfig]?.color,
                                    }}
                                />
                                <span className="text-sm">
                                    {chartConfig[item.status as keyof typeof chartConfig]?.label} ({item.count})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}