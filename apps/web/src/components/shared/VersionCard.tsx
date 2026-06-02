import { useState } from 'react';
import { ChevronDown, Clock, FileCode } from 'lucide-react';
import { type Versao } from '../../api/projetos';
import { cn } from '../../lib/utils';
interface VersionCardProps {
  versao: Versao;
  isLatest: boolean;
  /** Exibe o badge de status da versão (ativa/beta/deprecated) */
  showStatus?: boolean;
  /** Badge quando é a versão mais recente */
  activeLabel?: string;
  /** Label do bloco de changelog */
  changelogLabel?: string;
}

/**
 * Card expansível de versão. Compartilhado entre ProjectDetails e ManageVersions.
 *
 * @example
 * // ProjectDetails (sem status badge, label de build):
 * <VersionCard versao={v} isLatest={i === 0} activeLabel="BUILD_ATIVA" changelogLabel="NOTAS_DE_ATUALIZAÇÃO" />
 *
 * // ManageVersions (com status badge):
 * <VersionCard versao={v} isLatest={i === 0} showStatus />
 */
export function VersionCard({
  versao,
  isLatest,
  showStatus = false,
  activeLabel = 'ATUAL',
  changelogLabel = 'CHANGELOG',
}: VersionCardProps) {
  const [isExpanded, setIsExpanded] = useState(isLatest);

  return (
    <div className={cn('border-2 transition-colors bg-it-surface', isLatest ? 'border-[#D4FF00]' : 'border-it-border hover:border-[#4A3AFF]')}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-it-elevated transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn('font-display font-black text-2xl tracking-tighter', isLatest ? 'text-[#D4FF00]' : 'text-it-text')}>
            {versao.numeroVersao}
          </div>
          {isLatest && (
            <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 border border-[#D4FF00]/40 bg-[#D4FF00]/10 text-it-accent-fg">
              {activeLabel}
            </span>
          )}
          {showStatus && (
            <span className={cn(
              'font-mono text-[10px] px-2 py-0.5 border',
              versao.status === 'ativa'
                ? 'text-[#10b981] border-[#10b981] bg-[#10b981]/10'
                : 'text-it-muted border-zinc-500',
            )}>
              {versao.status.toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-it-muted flex items-center gap-2">
            <Clock size={14} />
            {new Date(versao.dataPublicacao).toLocaleDateString('pt-BR')}
          </div>
          <ChevronDown size={20} className={cn('text-it-muted transition-transform', isExpanded && 'rotate-180')} />
        </div>
      </button>
      {isExpanded && (
        <div className="border-t border-it-border p-4 bg-it-page">
          <div className="font-mono text-[10px] text-it-muted uppercase mb-3 flex items-center gap-2">
            <FileCode size={14} /> {changelogLabel}
          </div>
          <pre className="font-mono text-xs text-it-subtle leading-relaxed whitespace-pre-wrap">{versao.changelog}</pre>
        </div>
      )}
    </div>
  );
}
