import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({
  items,
  dark = false,
  className,
}: {
  items: BreadcrumbItem[];
  dark?: boolean;
  className?: string;
}) {
  return (
    <nav className={cn("flex items-center gap-2 mb-8", className)}>
      {items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span className={cn("text-xs", dark ? "text-cream-dim/30" : "text-text-light/40")}>/</span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                "font-sans text-xs transition-colors duration-200 hover:text-gold",
                dark ? "text-cream-dim" : "text-text-light"
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn("font-sans text-xs font-medium", dark ? "text-cream" : "text-text-dark")}>
              {item.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
