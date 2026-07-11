'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation";

export function MetricsHeader() {

    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
                <ChevronLeft className="size-5" />
            </Button>
            <div>
                <h1 className="text-2xl font-semibold">Métricas de Empleados</h1>
                <p className="text-muted-foreground">
                    Monitoreo en tiempo real del rendimiento y eficiencia del equipo operativo.
                </p>
            </div>
        </div>
    )
}