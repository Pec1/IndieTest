import React, { useEffect, useState } from 'react';
import {
  Terminal, Activity, Crosshair, Cpu,
  ArrowUpRight, BarChart2, PlusSquare, Disc, Settings
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router';

// --- Utils ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const TOP_PROJECTS = [
  { id: 1, name: 'TREVIUM', version: 'V1.2.0', volume: 85 },
  { id: 2, name: 'NEON DRIFT', version: 'V0.9.8', volume: 72 },
  { id: 3, name: 'VOID BUILD', version: 'V2.1.0', volume: 45 },
  { id: 4, name: 'CHRONO X', version: 'V1.0.1', volume: 30 },
  { id: 5, name: 'SYS_SHOCK', version: 'V0.5.5', volume: 15 },
];

const LINKED_PROJECTS = [
  { id: 'PRJ-881', name: 'CYBER ESCAPE', status: 'ACTIVE', client: 'OMEGA_DEV' },
  { id: 'PRJ-882', name: 'MYSTIC FALLS', status: 'PAUSED', client: 'INDIE_CO' },
  { id: 'PRJ-883', name: 'PIXEL DEFEND', status: 'ACTIVE', client: 'RETRO_FRG' },
  { id: 'PRJ-884', name: 'NEURO LINK', status: 'ACTIVE', client: 'NEXUS_INC' },
];

const TERMINAL_LOGS = [
  { id: 1, type: 'N_REGISTRO', text: 'Bug #001 alterado para Corrigido', time: '10:42:01' },
  { id: 2, type: 'SISTEMA', text: 'Upload de telemetria concluído (14MB)', time: '10:45:12' },
  { id: 3, type: 'CONVITE', text: 'Novo projeto disponível [PRJ-885]', time: '11:02:55' },
  { id: 4, type: 'ALERTA', text: 'Instabilidade detectada no servidor EU-East', time: '11:15:30' },
  { id: 5, type: 'N_REGISTRO', text: 'Nova submissão de log em TREVIUM', time: '11:20:05' },
  { id: 6, type: 'SISTEMA', text: 'Sincronização de rede OK', time: '11:30:00' },
];

// --- Brutalist UI Components ---
function BrutalistBox({ children, className, border = true }: { children: React.ReactNode, className?: string, border?: boolean }) {
  return (
    <div className={cn(
      "bg-[#1C1D22] text-white",
      border && "border border-[#2C2D35]",
      className
    )}>
      {children}
    </div>
  );
}

function TechnicalLabel({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("text-[10px] font-mono text-[#D4FF00] bg-[#D4FF00]/10 px-1 border border-[#D4FF00]/20 inline-flex items-center gap-1", className)}>
      {children}
    </div>
  );
}

// --- Sections ---
function StructuralHeader() {
  return (
    <header className="flex flex-col md:flex-row items-stretch border-b border-[#2C2D35] bg-[#0F1013] sticky top-0 z-40">
      {/* Logo Area */}
      <div className="flex items-center gap-3 p-4 md:px-6 md:w-64 border-b md:border-b-0 md:border-r border-[#2C2D35] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoMnYySDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')]">
        <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={24} />
        <h1 className="text-2xl font-black tracking-tighter uppercase text-white font-display">
          IndieTest
        </h1>
      </div>

      {/* Info Blocks */}
      <div className="flex-1 flex overflow-x-auto no-scrollbar">
        <div className="flex flex-col justify-center px-6 border-r border-[#2C2D35] min-w-max">
          <span className="text-[10px] text-zinc-500 font-mono mb-1">ID_USUÁRIO</span>
          <span className="font-mono text-white text-sm">USR-9942</span>
        </div>
        
        <div className="flex flex-col justify-center px-6 border-r border-[#2C2D35] min-w-max">
          <span className="text-[10px] text-zinc-500 font-mono mb-1">PERFIL</span>
          <span className="font-mono text-[#4A3AFF] font-bold text-sm bg-[#4A3AFF]/10 px-2 py-0.5 border border-[#4A3AFF]/30">
            [TESTADOR_BETA]
          </span>
        </div>

        <div className="flex flex-col justify-center px-6 border-r border-[#2C2D35] min-w-max">
          <span className="text-[10px] text-zinc-500 font-mono mb-1">REDE GLOBAL</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#D4FF00] animate-pulse" />
            <span className="font-mono text-[#D4FF00] font-bold text-sm tracking-wider">
              SYS.ONLINE
            </span>
          </div>
        </div>

        {/* Settings Button */}
        <Link
          to="/settings"
          className="flex items-center justify-center px-4 hover:bg-[#1C1D22] transition-colors border-r border-[#2C2D35] group"
          title="Configurações"
        >
          <Settings
            size={20}
            className="text-zinc-500 group-hover:text-[#D4FF00] transition-colors"
            strokeWidth={1.5}
          />
        </Link>
      </div>

      {/* Corner Action */}
      <div className="hidden lg:flex items-center justify-center px-6 bg-[#4A3AFF] hover:bg-[#382bd6] transition-colors border-l border-[#2C2D35]">
        <Link to="/dev" className="font-display font-bold text-white tracking-widest uppercase text-sm w-full h-full flex items-center justify-center">
          ACESSAR // DEV_MODE
        </Link>
      </div>
    </header>
  );
}

function TopProjects() {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between border-b border-[#2C2D35] pb-2 mb-6">
        <h2 className="text-2xl font-display font-black tracking-tight text-white uppercase flex items-center gap-2">
          <ZapIcon /> Projetos em Foco <span className="text-[#4A3AFF]">[TOP 5]</span>
        </h2>
        <TechnicalLabel className="hidden sm:flex">RN_01_DASH</TechnicalLabel>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border border-[#2C2D35] bg-[#1C1D22]">
        {TOP_PROJECTS.map((project, index) => {
          const isTop2 = index < 2;
          return (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className={cn(
                "relative flex flex-col p-4 border-r border-b md:border-b-0 border-[#2C2D35] last:border-r-0 aspect-[3/4] md:aspect-auto group hover:bg-[#25262c] transition-colors cursor-pointer",
                isTop2 && "border-2 border-[#D4FF00] z-10 shadow-[0_0_15px_rgba(212,255,0,0.1)]"
              )}
            >
              {/* Top Number */}
              <div className="flex justify-between items-start mb-auto">
                <span className={cn(
                  "font-display font-black text-3xl leading-none",
                  isTop2 ? "text-[#D4FF00]" : "text-zinc-600"
                )}>
                  0{index + 1}
                </span>
                {isTop2 && <ArrowUpRight className="text-[#D4FF00]" size={20} strokeWidth={1.5} />}
              </div>

              {/* Data Content */}
              <div className="mt-8">
                <span className="block font-mono text-[10px] text-zinc-500 mb-1 border-b border-[#2C2D35] pb-1">
                  BUILD: {project.version}
                </span>
                <h3 className="font-display font-bold text-xl uppercase tracking-tighter text-white mb-4 group-hover:text-[#D4FF00] transition-colors">
                  {project.name}
                </h3>

                {/* Digital Data Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-zinc-400">PROCESSADOS</span>
                    <span className="text-white">{project.volume}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#0F1013] border border-[#2C2D35]">
                    <div
                      className="h-full bg-[#D4FF00]"
                      style={{ width: `${project.volume}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ActiveTerminal() {
  return (
    <section>
      <div className="flex items-center justify-between border-b border-[#2C2D35] pb-2 mb-6">
        <h2 className="text-2xl font-display font-black tracking-tight text-white uppercase flex items-center gap-2">
          <Terminal size={24} className="text-[#4A3AFF]" strokeWidth={1.5} /> [PROJETOS_VINCULADOS]
        </h2>
        <div className="flex items-center gap-4">
          <Link to="/report-bug" className="hidden sm:flex font-display font-bold uppercase tracking-widest px-4 py-1.5 bg-[#4A3AFF] text-white hover:bg-white hover:text-black transition-all text-xs items-center gap-2">
            <Activity size={14} strokeWidth={2} />
            REPORTAR_FALHA
          </Link>
          <TechnicalLabel>RN03_LINKED</TechnicalLabel>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LINKED_PROJECTS.map((project) => {
          const isActive = project.status === 'ACTIVE';
          return (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="relative p-0 group hover:border-[#D4FF00] transition-colors cursor-pointer flex flex-col bg-[#1C1D22] text-white border border-[#2C2D35]"
            >
              {/* Technical Edge Label */}
              <div className="absolute top-0 right-0 flex">
                <div className={cn(
                  "font-mono text-[10px] px-2 py-1 font-bold border-b border-l border-[#2C2D35] flex items-center gap-1.5",
                  isActive ? "bg-[#D4FF00] text-black" : "bg-zinc-800 text-zinc-400"
                )}>
                  {isActive && <Disc size={10} className="animate-spin" />}
                  {project.status}
                </div>
              </div>

              <div className="p-5 flex-1">
                <div className="font-mono text-xs text-zinc-500 mb-2">{project.id} // {project.client}</div>
                <h3 className="font-display font-bold text-2xl uppercase tracking-tighter text-white">
                  {project.name}
                </h3>
              </div>

              {/* Action Bar Footer */}
              <div className="border-t border-[#2C2D35] bg-[#0F1013] p-3 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-6 h-6 border border-[#2C2D35] flex items-center justify-center text-zinc-500 hover:text-white hover:border-[#D4FF00]">
                    <Activity size={14} strokeWidth={1.5} />
                  </div>
                  <div className="w-6 h-6 border border-[#2C2D35] flex items-center justify-center text-zinc-500 hover:text-white hover:border-[#D4FF00]">
                    <BarChart2 size={14} strokeWidth={1.5} />
                  </div>
                </div>
                <span className="font-mono text-[10px] text-[#4A3AFF] font-bold tracking-widest flex items-center gap-1 group-hover:text-[#D4FF00]">
                  INJETAR RELATÓRIO <PlusSquare size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function DataIngestionFeed() {
  return (
    <aside className="w-full xl:w-96 flex-shrink-0 flex flex-col h-[600px] xl:h-[calc(100vh-80px)] sticky top-20 border-l border-[#2C2D35] bg-[#0F1013]">
      <div className="p-4 border-b border-[#2C2D35] bg-[#1C1D22]">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-display font-black tracking-tight text-white uppercase">
            LOG_DE_INGESTÃO
          </h2>
          <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/20">RF12</TechnicalLabel>
        </div>
        <p className="font-mono text-[10px] text-zinc-500">MONITORAMENTO DE REDE EM TEMPO REAL</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 no-scrollbar bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDE5aDIwdi0xSDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')]">
        {TERMINAL_LOGS.map((log) => {
          let colorClass = "text-[#D4FF00]"; // Default Acid Green
          if (log.type === 'ALERTA') colorClass = "text-red-500";
          if (log.type === 'SISTEMA') colorClass = "text-zinc-400";
          if (log.type === 'CONVITE') colorClass = "text-[#4A3AFF]";

          return (
            <div key={log.id} className="group hover:bg-[#1C1D22] p-1 -mx-1 transition-colors border-l-2 border-transparent hover:border-[#D4FF00] flex gap-3">
              <span className="text-zinc-600 shrink-0 select-none">[{log.time}]</span>
              <div>
                <span className={cn("font-bold mr-2", colorClass)}>
                  {log.type}:
                </span>
                <span className="text-zinc-300">{log.text}</span>
              </div>
            </div>
          );
        })}
        
        {/* Blinking Cursor */}
        <div className="flex gap-3 mt-4">
          <span className="text-zinc-600">[{new Date().toLocaleTimeString('en-US', {hour12:false})}]</span>
          <span className="w-2 h-4 bg-[#D4FF00] animate-pulse inline-block" />
        </div>
      </div>

      <div className="p-4 border-t border-[#2C2D35] bg-[#1C1D22]">
        <div className="flex items-center border border-[#2C2D35] bg-[#0F1013] p-1 focus-within:border-[#D4FF00] transition-colors">
          <span className="font-mono text-[#D4FF00] px-2">&gt;</span>
          <input 
            type="text" 
            placeholder="INSERIR_COMANDO..."
            className="w-full bg-transparent font-mono text-xs text-white outline-none placeholder:text-zinc-600"
          />
        </div>
      </div>
    </aside>
  );
}

// Simple internal icon to replace Lucide Zap for a sharper look
function ZapIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#D4FF00" strokeWidth="1.5" strokeLinejoin="miter"/>
    </svg>
  );
}

export function Dashboard() {
  // Inject fonts to DOM
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Oswald:wght@500;700&display=swap');
      
      .font-display {
        font-family: 'Oswald', sans-serif;
      }
      .font-mono {
        font-family: 'JetBrains Mono', monospace;
      }
      
      /* Hide scrollbar for cleaner brutalist look */
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1013] text-white selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <StructuralHeader />
      
      <main className="flex-1 flex flex-col xl:flex-row w-full max-w-[1920px] mx-auto">
        <div className="flex-1 p-4 md:p-8 xl:pr-12 overflow-x-hidden">
          <TopProjects />
          <ActiveTerminal />
        </div>

        <DataIngestionFeed />
      </main>

      {/* Floating command button - brutalist style */}
      <button className="xl:hidden fixed bottom-6 right-6 bg-[#D4FF00] text-black font-display font-bold uppercase tracking-widest px-4 py-3 border-2 border-black flex items-center gap-2 hover:bg-white transition-colors z-50">
        <Terminal size={18} strokeWidth={2} />
        Acessar Log
      </button>
    </div>
  );
}
