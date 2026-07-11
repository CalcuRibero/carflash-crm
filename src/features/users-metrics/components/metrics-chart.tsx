import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useMemo } from "react";
import { chartConfig, MetricsChartProps } from "../type";
import { Label, Pie, PieChart } from "recharts";


export function MetricsChart({ tickets }: MetricsChartProps) {

    const totalTickets = tickets.length;
    

    const [{assignedTo: user}] = tickets
    const title = `Tickets de ${user?.fullName}`
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = {
            abierto: tickets.filter((t) => t.status === "open").length,
            resuelto: tickets.filter((t) => t.status === "resolved").length,
            en_progreso: tickets.filter((t) => t.status === "in_progress").length,
            cerrado: tickets.filter((t) => t.status === "closed").length,
        };
        return Object.entries(counts)
            .filter(([_, count]) => count > 0)
            .map(([status, count]) => ({ status, count, fill: `var(--color-${status})` }));
    }, [tickets, chartConfig]);


    return (
        <Card>
            <CardHeader className="flex justify-center">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-8">
                    <div className="relative w-48 h-48">
                        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-48 flex-1">
                            <PieChart
                                className="m-0"
                                margin={{
                                    top: 0,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={statusCounts}
                                    dataKey="count"
                                    nameKey="status"
                                    innerRadius={45}
                                    outerRadius={60}
                                    paddingAngle={2}
                                    cornerRadius={4}
                                >
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground font-bold text-3xl tabular-nums"
                                                        >
                                                            {totalTickets.toLocaleString()}
                                                        </tspan>
                                                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                            TOTAL
                                                        </tspan>
                                                    </text>
                                                );
                                            }
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </div>
                    <div className="flex flex-col flex-wrap gap-4">
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