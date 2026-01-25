type StatsCardProps = {
  label: string;
  value: number | string;
};

export function StatsCard({ label, value }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
