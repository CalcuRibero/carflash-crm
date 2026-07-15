import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRight, Filter } from "lucide-react";
import { useState } from "react";
import { MetricsTableProps, StatusVariant } from "../type";
import { formatDate } from "../utils";
import { STATUS_LABELS } from "@/features/kanban/types";


export function MetricsTable({tickets}: MetricsTableProps) {

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;
    const totalTickets = tickets.length ;
    const totalPages = Math.ceil(tickets.length / itemsPerPage);
    const currentTickets = tickets.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );


    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Tickets de Empleado</CardTitle>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="size-4" />
                        FILTRAR POR
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>TÍTULO</TableHead>
                            <TableHead>ESTADO</TableHead>
                            <TableHead>FECHA DE INICIO</TableHead>
                            <TableHead>FECHA DE VENCIMIENTO</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentTickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No hay tickets disponibles
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentTickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-medium">{ticket.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={StatusVariant[ticket.status]}>
                                            {STATUS_LABELS[ticket.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                                    <TableCell>{formatDate(ticket.dueDate)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {totalTickets > 0 && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {currentTickets.length} de {totalTickets} tickets
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                                disabled={currentPage === 0}
                            >
                                <ChevronLeftIcon className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={currentPage >= totalPages - 1}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}