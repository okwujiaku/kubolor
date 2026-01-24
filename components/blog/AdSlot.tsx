type AdSlotProps = {
  label?: string;
};

export function AdSlot({ label = "Sponsored" }: AdSlotProps) {
  return (
    <div className="rounded-2xl border border-dashed bg-muted/30 p-6 text-sm text-muted-foreground">
      {label} placement
    </div>
  );
}
