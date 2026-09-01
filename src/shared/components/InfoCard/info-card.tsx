

interface InfoCardProps {
  title: string;
  value: string;
  color?: string;
}

export function InfoCard({ title, value, color = "text-primary" }: InfoCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
