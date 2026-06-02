import { cn } from '../../lib/utils';

interface TerminalFieldProps {
  label: string;
  id: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Wrapper de campo de formulário com estética de terminal.
 * Exibe label no estilo mono uppercase e um prefixo `>` antes do input.
 *
 * @example
 * <TerminalField label="NOME_DO_PROJETO" id="nome" required>
 *   <input id="nome" ... className="w-full bg-transparent ..." />
 * </TerminalField>
 */
export function TerminalField({ label, id, required, className, children }: TerminalFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group flex items-start border border-it-border bg-it-surface focus-within:border-[#D4FF00] transition-colors">
        <div className="pl-3 pr-2 pt-3 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
        {children}
      </div>
    </div>
  );
}
