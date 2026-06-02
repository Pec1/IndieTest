import { cn } from '../../lib/utils';

const STATUSES = [
  { id: 'aberto', name: 'ABERTO', color: '#D4FF00' },
  { id: 'em_analise', name: 'EM_ANÁLISE', color: '#4A3AFF' },
  { id: 'corrigido', name: 'CORRIGIDO', color: '#10b981' },
  { id: 'fechado', name: 'FECHADO', color: '#6b7280' },
];

interface BugStatusBadgeProps {
  status: string;
  className?: string;
}

/**
 * Badge de status de bug com cor dinâmica.
 *
 * @example
 * <BugStatusBadge status="aberto" />
 * <BugStatusBadge status="corrigido" />
 */
export function BugStatusBadge({ status, className }: BugStatusBadgeProps) {
  const st = STATUSES.find(s => s.id === status);
  if (!st) return <span className={cn("font-mono text-[10px] text-it-muted", className)}>{status}</span>;
  return (
    <span
      className={cn("font-mono text-[10px] font-bold uppercase px-2 py-1 border", className)}
      style={{ color: st.color, borderColor: st.color, backgroundColor: `${st.color}20` }}
    >
      {st.name}
    </span>
  );
}
