import { cn } from '../../lib/utils';

interface BrutalistButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

/**
 * Botão com efeito de sombra offset (brutalist). Dois variants:
 * - `primary`: fundo amarelo, sombra roxa
 * - `secondary`: fundo escuro, borda, sombra preta
 *
 * @example
 * <BrutalistButton type="submit" variant="primary">ENTRAR</BrutalistButton>
 * <BrutalistButton variant="secondary" disabled={loading}>REGISTRAR</BrutalistButton>
 */
export function BrutalistButton({
  children,
  className,
  variant = 'primary',
  type = 'button',
  disabled,
}: BrutalistButtonProps) {
  const isPrimary = variant === 'primary';
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'font-display font-bold uppercase tracking-widest px-6 py-4 transition-all duration-75 active:translate-y-[2px] active:translate-x-[2px] border border-transparent flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        isPrimary
          ? 'bg-[#D4FF00] text-black hover:bg-[#e2ff4d] shadow-[4px_4px_0_0_#4A3AFF] active:shadow-[0_0_0_0_#4A3AFF]'
          : 'bg-it-surface text-it-text border-it-border hover:border-[#D4FF00] shadow-[4px_4px_0_0_var(--it-shadow)] active:shadow-[0_0_0_0_var(--it-shadow)]',
        className,
      )}
    >
      {children}
    </button>
  );
}
