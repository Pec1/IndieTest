import { Crosshair } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Primitivo de header global do app.
 * Composto por Brand, InfoBar (células de info), Nav e Actions.
 *
 * @example
 * <AppHeader>
 *   <AppHeader.Brand />
 *   <AppHeader.Nav>
 *     <AppHeader.NavBack to="/dashboard">VOLTAR</AppHeader.NavBack>
 *     <AppHeader.NavLabel>BUG_TRACKER // RF09</AppHeader.NavLabel>
 *   </AppHeader.Nav>
 *   <AppHeader.Actions>
 *     <button onClick={signOut}>SAIR</button>
 *   </AppHeader.Actions>
 * </AppHeader>
 */
function AppHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <header className={cn(
      "flex flex-col md:flex-row items-stretch border-b border-[#2C2D35] bg-[#0F1013] sticky top-0 z-40",
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
        "flex items-center gap-3 p-4 md:px-6 md:w-64 border-b md:border-b-0 md:border-r border-[#2C2D35] hover:bg-[#1C1D22] transition-colors",
        className
      )}
    >
      <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={24} />
      <h1 className="text-2xl font-black tracking-tighter uppercase text-white font-display">IndieTest</h1>
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
    <div className={cn("flex flex-col justify-center px-6 border-r border-[#2C2D35] min-w-max", className)}>
      <span className="text-[10px] text-zinc-500 font-mono mb-1">{label}</span>
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
    "flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-[#2C2D35] p-2 bg-[#1C1D22]",
    className
  );
  if (to) return <Link to={to} className={base}>{children}</Link>;
  return <button onClick={onClick} className={base}>{children}</button>;
}

/** Label de contexto/breadcrumb no Nav (ex: "BUG_TRACKER // RF09") */
function AppHeaderNavLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("font-mono text-xs text-[#D4FF00] font-bold tracking-widest", className)}>
      {children}
    </span>
  );
}

/** Separador vertical entre elementos do Nav */
function AppHeaderNavDivider({ className }: { className?: string }) {
  return <div className={cn("mx-4 h-4 w-px bg-[#2C2D35]", className)} />;
}

/** Área de ações (botões CTA, logout) alinhada à direita */
function AppHeaderActions({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("hidden lg:flex items-center justify-center px-4 border-l border-[#2C2D35] gap-2", className)}>
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

export { AppHeader };
