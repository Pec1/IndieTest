import { Crosshair, Settings } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';

/**
 * Primitivo de header global do app.
 * Composto por Brand, InfoBar (células de info), Nav e Actions.
 *
 * @example
 * <AppHeader>
 *   <AppHeader.Brand />
 *   <AppHeader.Nav>
 *     <AppHeader.NavBack to="/dashboard">VOLTAR</AppHeader.NavBack>
 *     <AppHeader.NavLabel>BUG_TRACKER</AppHeader.NavLabel>
 *   </AppHeader.Nav>
 *   <AppHeader.Actions>
 *     <button onClick={signOut}>SAIR</button>
 *   </AppHeader.Actions>
 * </AppHeader>
 */
function AppHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <header className={cn(
      "flex flex-col md:flex-row items-stretch border-b border-it-border bg-it-page sticky top-0 z-40",
      className
    )}>
      {children}
    </header>
  );
}

function AppHeaderBrand({ className }: { className?: string }) {
  const { user } = useAuth();
  const to = '/dashboard';
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 p-4 md:px-6 md:w-64 border-b md:border-b-0 md:border-r border-it-border hover:bg-it-surface transition-colors",
        className
      )}
    >
      <Crosshair className="text-it-accent-fg" strokeWidth={1.5} size={24} />
      <h1 className="text-2xl font-black tracking-tighter uppercase text-it-text font-display">IndieTest</h1>
    </Link>
  );
}

/** Barra de informações scrollável (contém AppHeader.InfoCell) */
function AppHeaderInfoBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex-1 flex overflow-x-auto no-scrollbar", className)}>
      {children}
    </div>
  );
}

/** Célula individual de informação na InfoBar */
function AppHeaderInfoCell({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col justify-center px-6 border-r border-it-border min-w-max", className)}>
      <span className="text-[10px] text-it-muted font-mono mb-1">{label}</span>
      <div className="font-mono text-sm">{children}</div>
    </div>
  );
}

/** Área de navegação principal (volta + breadcrumb ou links contextuais) */
function AppHeaderNav({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex-1 flex overflow-x-auto no-scrollbar items-center px-4 md:px-6", className)}>
      {children}
    </div>
  );
}

/** Link de voltar padronizado dentro do Nav */
function AppHeaderNavBack({ to, onClick, children, className }: {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const base = cn(
    "flex items-center gap-2 font-mono text-xs text-it-muted hover:text-it-text transition-colors border border-transparent hover:border-it-border p-2 bg-it-surface",
    className
  );
  if (to) return <Link to={to} className={base}>{children}</Link>;
  return <button onClick={onClick} className={base}>{children}</button>;
}

/** Label de contexto/breadcrumb no Nav (ex: "BUG_TRACKER") */
function AppHeaderNavLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("font-mono text-xs text-it-accent-fg font-bold tracking-widest", className)}>
      {children}
    </span>
  );
}

/** Separador vertical entre elementos do Nav */
function AppHeaderNavDivider({ className }: { className?: string }) {
  return <div className={cn("mx-4 h-4 w-px bg-it-border", className)} />;
}

/** Ícone de configurações + alternância de tema (barra do header) */
function AppHeaderUtilities({
  className,
  hideSettings = false,
  settingsBorder = true,
}: {
  className?: string;
  hideSettings?: boolean;
  settingsBorder?: boolean;
}) {
  return (
    <div className={cn('flex items-stretch shrink-0', className)}>
      {!hideSettings && (
        <Link
          to="/settings"
          className={cn(
            'flex items-center justify-center px-4 hover:bg-it-surface transition-colors group',
            settingsBorder && 'border-r border-it-border',
          )}
          title="Configurações"
        >
          <Settings
            size={20}
            className="text-it-muted group-hover:text-it-header-icon-hover transition-colors"
            strokeWidth={1.5}
          />
        </Link>
      )}
      <ThemeToggle variant="header" />
    </div>
  );
}

/** Área de ações (botões CTA, logout) alinhada à direita */
function AppHeaderActions({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center px-4 border-l border-it-border gap-2 shrink-0', className)}>
      {children}
    </div>
  );
}

AppHeader.Brand = AppHeaderBrand;
AppHeader.InfoBar = AppHeaderInfoBar;
AppHeader.InfoCell = AppHeaderInfoCell;
AppHeader.Nav = AppHeaderNav;
AppHeader.NavBack = AppHeaderNavBack;
AppHeader.NavLabel = AppHeaderNavLabel;
AppHeader.NavDivider = AppHeaderNavDivider;
AppHeader.Actions = AppHeaderActions;
AppHeader.Utilities = AppHeaderUtilities;

export { AppHeader };
