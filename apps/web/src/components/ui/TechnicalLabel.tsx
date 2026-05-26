import { cn } from '../../lib/utils';

/**
 * Label técnica visual usada como tag de referência de requisito ou código do sistema.
 *
 * @example
 * <TechnicalLabel>RF01_DASH</TechnicalLabel>
 * <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/20">RN02</TechnicalLabel>
 */
export function TechnicalLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "text-[10px] font-mono text-[#D4FF00] bg-[#D4FF00]/10 px-1 border border-[#D4FF00]/20 inline-flex items-center gap-1",
      className
    )}>
      {children}
    </div>
  );
}
