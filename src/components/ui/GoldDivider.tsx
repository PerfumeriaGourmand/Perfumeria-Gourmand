import { cn } from "@/lib/utils";

interface GoldDividerProps {
  className?: string;
  ornament?: boolean;
}

export default function GoldDivider({ className, ornament = false }: GoldDividerProps) {
  if (ornament) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="flex-1 gold-line" />
        <span className="text-gold opacity-50 text-xs tracking-[0.4em] font-display">✦</span>
        <div className="flex-1 gold-line" />
      </div>
    );
  }
  return <div className={cn("gold-line w-full", className)} />;
}
