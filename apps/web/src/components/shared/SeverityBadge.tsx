import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

const COLORS: Record<string, string> = {
  Critica: 'bg-red-500/10 text-red-500 border-red-500',
  Alta: 'bg-orange-500/10 text-orange-500 border-orange-500',
  Media: 'bg-[#D4FF00]/10 text-[#D4FF00] border-[#D4FF00]',
  Baixa: 'bg-zinc-500/10 text-it-muted border-zinc-500',
};

const LABELS: Record<string, string> = {
  Critica: 'CRÍTICA',
  Alta: 'ALTA',
  Media: 'MÉDIA',
  Baixa: 'BAIXA',
};

interface SeverityBadgeProps {
  severity: string;
  /** sm: badge inline (tabelas); lg: badge display (cabeçalho de bug) */
  size?: 'sm' | 'lg';
  className?: string;
}

/**
 * Badge de severidade de bug. Dois tamanhos: inline para tabelas, display para cabeçalhos.
 *
 * @example
 * <SeverityBadge severity="Critica" />
 * <SeverityBadge severity="Alta" size="lg" />
 */
export function SeverityBadge({ severity, size = 'sm', className }: SeverityBadgeProps) {
  const colorClass = COLORS[severity] || 'border-zinc-500 text-it-muted';
  const label = LABELS[severity] || severity;

  if (size === 'lg') {
    return (
      <div className={cn(
        "font-display font-black text-lg uppercase px-4 py-2 border-2 inline-flex items-center gap-2",
        colorClass, className
      )}>
        <AlertTriangle size={20} strokeWidth={2.5} /> SEVERIDADE: {label}
      </div>
    );
  }

  return (
    <span className={cn(
      "font-mono text-[10px] font-bold uppercase px-2 py-1 border",
      colorClass, className
    )}>
      {label}
    </span>
  );
}
