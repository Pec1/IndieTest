import { cn } from '../../lib/utils';

interface StatsGridItemProps {
  label: string;
  value: string | number;
  color?: string;
  className?: string;
  labelClassName?: string;
}

/**
 * Item individual dentro do StatsGrid.
 *
 * @example
 * <StatsGrid.Item label="CRÍTICOS" value={3} color="text-red-500" />
 */
function StatsGridItem({ label, value, color = 'text-it-text', className, labelClassName }: StatsGridItemProps) {
  return (
    <div className={cn("p-6 bg-it-surface border-b md:border-b-0 md:border-r border-it-border last:border-0", className)}>
      <div className={cn("font-mono text-xs text-it-muted mb-3", labelClassName)}>{label}</div>
      <div className={cn("font-display font-black text-5xl tracking-tighter", color)}>{value}</div>
    </div>
  );
}

interface StatsGridProps {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}

/**
 * Grid de estatísticas brutalista usado nos dashboards e páginas de lista.
 *
 * @example
 * <StatsGrid cols={3}>
 *   <StatsGrid.Item label="NÃO LIDAS" value={5} color="text-[#D4FF00]" />
 *   <StatsGrid.Item label="TOTAL" value={12} />
 *   <StatsGrid.Item label="LIDAS" value={7} color="text-it-muted" />
 * </StatsGrid>
 */
function StatsGrid({ children, cols = 3, className }: StatsGridProps) {
  const colsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[cols];

  return (
    <div className={cn(`grid grid-cols-1 ${colsClass} gap-0 border border-it-border mb-8`, className)}>
      {children}
    </div>
  );
}

StatsGrid.Item = StatsGridItem;

export { StatsGrid };
