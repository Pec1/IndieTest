import { Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  /** Estilo do ícone na barra do header (igual a notificações/config) */
  variant?: 'default' | 'header';
}

const headerBtnClass =
  'flex items-center justify-center px-4 hover:bg-it-surface transition-colors border-r border-it-border group';

export function ThemeToggle({ className, showLabel = false, variant = 'default' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const Icon = isLight ? Moon : Sun;
  const label = isLight ? 'Modo escuro' : 'Modo claro';

  if (variant === 'header') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        title={label}
        className={cn(headerBtnClass, className)}
      >
        <Icon
          size={20}
          strokeWidth={1.5}
          className="text-it-muted group-hover:text-it-header-icon-hover transition-colors"
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        'flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest',
        'border border-it-border bg-it-surface text-it-muted',
        'hover:border-it-accent-border hover:text-it-accent-fg transition-colors p-2',
        className,
      )}
    >
      <Icon size={16} strokeWidth={2} />
      {showLabel && <span>{isLight ? 'ESCURO' : 'CLARO'}</span>}
    </button>
  );
}
