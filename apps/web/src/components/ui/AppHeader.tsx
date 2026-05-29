import { useEffect, useState } from 'react';
import { Crosshair, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '../../lib/utils';

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
  useEffect(() => {
    const savedTheme = localStorage.getItem('@indietest:theme') || 'dark';
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, []);

  return (
    <header className={cn(
      "flex flex-col md:flex-row items-stretch border-b border-[#2C2D35] bg-[#0F1013] sticky top-0 z-40",
      className
    )}>
      <style dangerouslySetInnerHTML={{ __html: `
        :root { --transition-speed: 0.3s; }
        html, body, div, header, main, section, aside, nav, button, input, textarea, select {
          transition: background-color var(--transition-speed) ease, border-color var(--transition-speed) ease, color var(--transition-speed) ease, shadow var(--transition-speed) ease !important;
        }
        html.light-mode {
          --bg-terminal: #f1f5f9;
          --bg-card: #ffffff;
          --border-dim: #cbd5e1;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --accent-lime-contrast: #65a30d; /* Verde mais escuro para leitura em fundo branco */
        }
        html.light-mode, html.light-mode body, html.light-mode .min-h-screen { background-color: var(--bg-terminal) !important; color: var(--text-main) !important; }
        html.light-mode .bg-\\[\\#0F1013\\] { background-color: var(--bg-terminal) !important; }
        html.light-mode .bg-\\[\\#1C1D22\\] { background-color: var(--bg-card) !important; }
        html.light-mode .border-\\[\\#2C2D35\\] { border-color: var(--border-dim) !important; }
        html.light-mode .border-zinc-700 { border-color: var(--border-dim) !important; }
        html.light-mode .text-white { color: var(--text-main) !important; }
        html.light-mode .text-zinc-300, html.light-mode .text-zinc-400, html.light-mode .text-zinc-500 { color: var(--text-muted) !important; }
        html.light-mode .text-\\[\\#D4FF00\\] { color: var(--accent-lime-contrast) !important; }
        html.light-mode input, html.light-mode textarea, html.light-mode select { background-color: var(--bg-card) !important; color: var(--text-main) !important; border-color: var(--border-dim) !important; }
        html.light-mode select option { background-color: var(--bg-card) !important; color: var(--text-main) !important; }
        html.light-mode .hover\\:bg-\\[\\#1C1D22\\]:hover { background-color: #f8fafc !important; }
        html.light-mode .bg-zinc-900\\/30 { background-color: #f8fafc !important; }
        html.light-mode .text-zinc-600 { color: #94a3b8 !important; }
        html.light-mode aside { background-color: var(--bg-terminal) !important; }
        html.light-mode .selection\\:bg-\\[\\#D4FF00\\]::selection { background-color: #d9f99d !important; color: #000000 !important; }
      `}} />
      {children}
    </header>
  );
}

function AppHeaderBrand({ className }: { className?: string }) {
  return (
    <Link
      to="/dashboard"
      className={cn(
        "flex items-center gap-3 p-4 md:px-6 md:w-64 border-b md:border-b-0 md:border-r border-[#2C2D35]",
        "hover:bg-[#1C1D22] transition-colors cursor-pointer",
        className
      )}
      aria-label="Ir para o dashboard"
    >
      <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={24} />
      <h1 className="text-2xl font-black tracking-tighter uppercase text-white font-display">IndieTest</h1>
    </Link>
  );
}

/** Barra de informações scrollável (contém AppHeader.InfoCell) */
function AppHeaderInfoBar({ children, className }: { children: React.ReactNode; className?: string }) {
  const [isLight, setIsLight] = useState(() => document.documentElement.classList.contains('light-mode'));

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(document.documentElement.classList.contains('light-mode'));
    };
    window.addEventListener('theme-change', handleThemeChange);
    return () => window.removeEventListener('theme-change', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('light-mode')) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('@indietest:theme', 'dark');
    } else {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('@indietest:theme', 'light');
    }
    window.dispatchEvent(new Event('theme-change'));
  };

  return (
    <div className={cn("flex-1 flex overflow-x-auto no-scrollbar items-center", className)}>
      {children}
      <button type="button" onClick={toggleTheme} className="ml-auto flex items-center justify-center h-full px-6 hover:bg-[#1C1D22] text-zinc-500 hover:text-[#D4FF00] border-l border-r border-[#2C2D35] transition-colors" title="Alternar Tema (Claro/Escuro)">
        {isLight ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
      </button>
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
    <div className={cn("hidden lg:flex items-stretch px-0 border-l border-[#2C2D35]", className)}>
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
