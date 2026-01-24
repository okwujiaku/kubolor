type StatsCardProps = {
  label: string;
  value: number | string;
};

export function StatsCard({ label, value }: StatsCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
