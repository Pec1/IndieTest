import React, { useEffect } from 'react';
import {
  Crosshair, AlertTriangle, Bug, Activity,
  Users, PlusSquare, ArrowUpRight, BarChart, Settings
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link, useNavigate } from 'react-router';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const METRICS = [
  { label: 'BUGS ATIVOS', value: '142', icon: Bug, color: 'text-white' },
  { label: 'ÍNDICE DE ESTABILIDADE', value: '94%', icon: Activity, color: 'text-[#D4FF00]' },
  { label: 'TESTADORES ENGAJADOS', value: '38', icon: Users, color: 'text-[#4A3AFF]' },
];

const CRITICAL_BUGS = [
  { id: 'BUG-991', project: 'TREVIUM', title: 'Memory Leak on Level Transition', time: '12m atrás' },
  { id: 'BUG-992', project: 'SYS_SHOCK', title: 'Authentication Bypass Exploit', time: '1h atrás' }
];

const PROJECTS = [
  { id: 'PRJ-1', name: 'TREVIUM', category: 'JOGO (RPG)', version: 'V1.2.0', sparkline: [40, 55, 60, 45, 30, 20, 15] },
  { id: 'PRJ-2', name: 'NEON DRIFT', category: 'JOGO (CORRIDA)', version: 'V0.9.8', sparkline: [10, 15, 12, 18, 25, 40, 35] },
  { id: 'PRJ-3', name: 'VOID BUILD', category: 'UTILITÁRIO', version: 'V2.1.0', sparkline: [30, 25, 20, 15, 10, 5, 2] },
  { id: 'PRJ-4', name: 'INDIE_TOOL', category: 'APLICATIVO', version: 'V0.1.0', sparkline: [5, 10, 25, 50, 45, 30, 20] },
];

// --- Components ---
function BrutalistBox({ children, className, border = true }: { children: React.ReactNode, className?: string, border?: boolean }) {
  return (
    <div className={cn(
      "bg-[#1C1D22] text-white",
      border && "border border-white/20",
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

function Sparkline({ data, color = "#4A3AFF" }: { data: number[], color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible" preserveAspectRatio="none">
      <polyline 
        points={points} 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="square" 
        strokeLinejoin="miter" 
      />
    </svg>
  );
}

// --- Sections ---
function DevHeader() {
  return (
    <header className="flex flex-col md:flex-row items-stretch border-b border-white/20 bg-[#0F1013] sticky top-0 z-40">
      <div className="flex items-center gap-3 p-4 md:px-6 md:w-64 border-b md:border-b-0 md:border-r border-white/20">
        <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={24} />
        <h1 className="text-2xl font-black tracking-tighter uppercase text-white font-display">
          IndieTest
        </h1>
      </div>

      <div className="flex-1 flex overflow-x-auto no-scrollbar">
        <div className="flex flex-col justify-center px-6 border-r border-white/20 min-w-max">
          <span className="text-[10px] text-zinc-500 font-mono mb-1">ID_USUÁRIO</span>
          <span className="font-mono text-white text-sm">DEV-0081</span>
        </div>
        
        <div className="flex flex-col justify-center px-6 border-r border-white/20 min-w-max">
          <span className="text-[10px] text-zinc-500 font-mono mb-1">PERFIL</span>
          <span className="font-mono text-[#D4FF00] font-bold text-sm bg-[#D4FF00]/10 px-2 py-0.5 border border-[#D4FF00]/30">
            [DESENVOLVEDOR]
          </span>
        </div>

        <div className="flex flex-col justify-center px-6 border-r border-white/20 min-w-max">
          <span className="text-[10px] text-zinc-500 font-mono mb-1">VISÃO</span>
          <div className="flex gap-2">
            <Link to="/dashboard" className="font-mono text-[10px] text-zinc-400 hover:text-white border border-transparent hover:border-white/20 px-1 transition-colors">
              TESTADOR
            </Link>
            <span className="font-mono text-[10px] text-[#4A3AFF] font-bold border border-[#4A3AFF] bg-[#4A3AFF]/10 px-1">
              DEV
            </span>
          </div>
        </div>

        {/* Settings Button */}
        <Link
          to="/settings"
          className="flex items-center justify-center px-4 hover:bg-[#1C1D22] transition-colors group"
          title="Configurações"
        >
          <Settings
            size={20}
            className="text-zinc-500 group-hover:text-[#D4FF00] transition-colors"
            strokeWidth={1.5}
          />
        </Link>
      </div>
    </header>
  );
}

function MetricsGrid() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <TechnicalLabel>RF13_METRICS</TechnicalLabel>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/20">
        {METRICS.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="p-6 bg-[#1C1D22] border-b md:border-b-0 md:border-r border-white/20 last:border-0 relative group hover:bg-[#22232a] transition-colors">
              <div className="flex justify-between items-start mb-8">
                <span className="font-mono text-xs text-zinc-400">{metric.label}</span>
                <Icon size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <div className={cn("font-display font-black text-6xl tracking-tighter leading-none", metric.color)}>
                {metric.value}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CriticalHighlight() {
  return (
    <section className="mb-8 relative overflow-hidden border border-[#D4FF00]">
      {/* Hazard Stripes Background */}
      <div 
        className="absolute inset-0 opacity-20 animate-[pulse_3s_ease-in-out_infinite]"
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, #FFCC00, #FFCC00 20px, #000 20px, #000 40px)'
        }}
      />
      
      <div className="relative z-10 bg-[#0F1013]/90 p-6 flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-[#D4FF00] border-2 border-black">
          <AlertTriangle size={32} className="text-black" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-display font-black text-2xl text-white uppercase tracking-tight">
              Atenção Imediata 
            </span>
            <TechnicalLabel className="bg-red-500/10 text-red-500 border-red-500/30">RN06_CRITICAL</TechnicalLabel>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {CRITICAL_BUGS.map(bug => (
              <div key={bug.id} className="bg-[#1C1D22] border border-red-500/30 p-3 hover:border-red-500 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-[10px] text-zinc-400">[{bug.project}]</span>
                  <span className="font-mono text-[10px] text-red-500 group-hover:animate-pulse">{bug.time}</span>
                </div>
                <h4 className="font-mono text-sm text-white font-bold">{bug.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SoftwareStatusTable() {
  const navigate = useNavigate();

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-display font-black tracking-tight text-white uppercase flex items-center gap-2">
          STATUS DOS SOFTWARES
        </h2>
        <Link to="/dev/new-project" className="font-display font-bold uppercase tracking-widest px-4 py-2 bg-[#D4FF00] text-black border border-transparent hover:bg-white hover:border-black transition-all active:translate-y-[2px] flex items-center gap-2 shadow-[2px_2px_0_0_#4A3AFF]">
          <PlusSquare size={16} strokeWidth={2} />
          Cadastrar Novo
        </Link>
      </div>

      <div className="border border-white/20 bg-[#1C1D22] overflow-x-auto">
        <table className="w-full text-left font-mono text-xs whitespace-nowrap">
          <thead className="bg-[#0F1013] border-b border-white/20 text-zinc-500">
            <tr>
              <th className="p-4 font-normal">PROJETO_ID</th>
              <th className="p-4 font-normal">NOME</th>
              <th className="p-4 font-normal">CATEGORIA</th>
              <th className="p-4 font-normal">VERSÃO_ATUAL</th>
              <th className="p-4 font-normal w-48">VOLUME_DE_ERROS (7D)</th>
              <th className="p-4 font-normal text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {PROJECTS.map(proj => (
              <tr
                key={proj.id}
                onClick={() => navigate(`/project/${proj.id}`)}
                className="hover:bg-[#25262c] transition-colors group cursor-pointer"
              >
                <td className="p-4 text-zinc-400">{proj.id}</td>
                <td className="p-4 font-bold text-white font-display text-lg tracking-wide uppercase">{proj.name}</td>
                <td className="p-4 text-[#D4FF00]">{proj.category}</td>
                <td className="p-4">
                  <span className="border border-white/20 bg-[#0F1013] px-2 py-1">{proj.version}</span>
                </td>
                <td className="p-4">
                  <div className="w-full h-8 px-2 border-l border-r border-white/10 group-hover:border-white/30 transition-colors">
                    <Sparkline data={proj.sparkline} color="#4A3AFF" />
                  </div>
                </td>
                <td className="p-4 text-right">
                  <Link
                    to={`/project/${proj.id}`}
                    className="text-zinc-500 hover:text-white border border-transparent hover:border-white/20 p-2 transition-colors inline-flex"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function DevDashboard() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Oswald:wght@500;700;900&display=swap');
      
      .font-display {
        font-family: 'Oswald', sans-serif;
      }
      .font-mono {
        font-family: 'JetBrains Mono', monospace;
      }
      
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
      <DevHeader />
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8">
        <MetricsGrid />
        <CriticalHighlight />
        <SoftwareStatusTable />
      </main>
    </div>
  );
}
