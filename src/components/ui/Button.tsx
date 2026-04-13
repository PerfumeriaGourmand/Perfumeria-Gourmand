import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          "relative inline-flex items-center justify-center font-sans tracking-widest uppercase transition-all duration-300 select-none",
          // Sizes
          size === "sm" && "text-xs px-5 py-2.5 gap-2",
          size === "md" && "text-xs px-8 py-3.5 gap-2.5",
          size === "lg" && "text-sm px-10 py-4 gap-3",
          // Variants
          variant === "primary" &&
            "bg-gold text-obsidian hover:bg-gold-light active:bg-gold-dark",
          variant === "outline" &&
            "border border-gold text-gold hover:bg-gold hover:text-obsidian",
          variant === "ghost" &&
            "text-cream-muted hover:text-cream hover:bg-obsidian-surface",
          variant === "gold" &&
            "bg-transparent border border-gold/30 text-gold hover:border-gold/70 hover:bg-gold/5",
          // States
          (disabled || loading) && "opacity-40 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
          </span>
        )}
        <span className={cn(loading && "opacity-0")}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
