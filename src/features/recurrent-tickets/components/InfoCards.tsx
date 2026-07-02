"use client";

interface InfoCardProps {
  title: string;
  value: string;
  color?: string;
}

function InfoCard({ title, value, color = "text-primary" }: InfoCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

interface InfoCardsProps {
  totalActive: string;
  next24h: string;
  highPriority: string;
  complianceRate: string;
}

export function InfoCards({
  totalActive,
  next24h,
  highPriority,
  complianceRate,
}: InfoCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <InfoCard title="TOTAL ACTIVOS" value={totalActive} />
      <InfoCard title="PRÓXIMAS 24H" value={next24h} />
      <InfoCard title="PRIORIDAD ALTA" value={highPriority} color="text-destructive" />
      <InfoCard title="TASA DE CUMPLIMIENTO" value={complianceRate} color="text-green-600" />
    </div>
  );
}
