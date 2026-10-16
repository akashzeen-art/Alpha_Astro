import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  badgeIcon?: LucideIcon;
  className?: string;
  align?: "center" | "left";
  ornament?: boolean;
}

const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  badgeIcon: BadgeIcon,
  className,
  align = "center",
  ornament = false,
}: SectionHeaderProps) => (
  <div
    className={cn(
      "mb-10 md:mb-12",
      align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl text-left",
      className
    )}
  >
    {eyebrow && (
      <Badge
        variant="outline"
        className="mb-4 border-teal-400/30 bg-teal-400/5 px-3 py-1.5 text-xs text-teal-200/90 sm:text-sm"
      >
        {BadgeIcon && <BadgeIcon className="mr-1.5 inline h-3.5 w-3.5" />}
        {eyebrow}
      </Badge>
    )}

    {ornament && align === "center" && (
      <div className="section-ornament" aria-hidden>
        <span className="font-display text-lg text-teal-400/35">✧</span>
      </div>
    )}

    <h2 className="font-display mb-3 text-2xl font-semibold leading-tight text-slate-50 sm:text-3xl md:text-4xl">
      {title}
    </h2>

    <div className={cn("alpha-divider mb-4", align === "center" ? "mx-auto max-w-xs" : "max-w-[8rem]")} />

    {subtitle && (
      <p className="text-sm leading-relaxed text-slate-400/80 md:text-base">{subtitle}</p>
    )}
  </div>
);

export default SectionHeader;
