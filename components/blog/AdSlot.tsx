type AdSlotProps = {
  label?: string;
};

export function AdSlot({ label = "Sponsored" }: AdSlotProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-sm text-slate-400">
      {label} placement
    </div>
  );
}
