export const STATUS_LABELS: Record<string, string> = {
  approved: "Aprobado",
  pending: "Pendiente",
  rejected: "Rechazado",
  in_process: "En proceso",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export const STATUS_STYLES: Record<string, string> = {
  approved: "text-green-400 bg-green-400/10",
  pending: "text-yellow-400 bg-yellow-400/10",
  rejected: "text-red-400 bg-red-400/10",
  in_process: "text-blue-400 bg-blue-400/10",
  cancelled: "text-cream-dim bg-cream-dim/10",
  refunded: "text-cream-dim bg-cream-dim/10",
};

export const STATUS_COLORS: Record<string, string> = {
  approved: "text-green-600 bg-green-50 border-green-200",
  pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
  rejected: "text-red-500 bg-red-50 border-red-200",
  in_process: "text-blue-600 bg-blue-50 border-blue-200",
  cancelled: "text-text-light bg-surface-2 border-border-light",
  refunded: "text-text-light bg-surface-2 border-border-light",
};
