// Consistent status badge across all pages.
// Applies colored neon badge styles based on status string.

const STATUS_CLASS: Record<string, string> = {
  available: "badge-available",
  reserved: "badge-reserved",
  funded: "badge-funded badge-funded-glow",
  funding: "badge-funding",
  draft: "badge-draft",
  published: "badge-published",
  archived: "badge-archived",
  contributed: "badge-funding",
  single: "badge-neon",
  group: "badge-neon",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]";
  const variant = STATUS_CLASS[status.toLowerCase()] ?? "badge-neon";
  return (
    <span className={`${base} ${variant} ${className}`}>{status}</span>
  );
}
