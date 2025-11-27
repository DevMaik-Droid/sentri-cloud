import { cn } from "@/lib/utils"

type Status = "running" | "building" | "error" | "stopped" | "ready"

const statusConfig: Record<Status, { label: string; className: string }> = {
  running: { label: "Running", className: "bg-success/10 text-success" },
  ready: { label: "Ready", className: "bg-success/10 text-success" },
  building: { label: "Building", className: "bg-warning/10 text-warning" },
  error: { label: "Error", className: "bg-destructive/10 text-destructive" },
  stopped: { label: "Stopped", className: "bg-muted text-muted-foreground" },
}

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  )
}
