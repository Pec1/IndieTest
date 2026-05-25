import React, { useEffect, useState } from 'react';
import { Crosshair, AlertTriangle, Bug, Activity, Users, PlusSquare, ArrowUpRight, BarChart, Settings, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getProjetos, type Projeto } from '../api/projetos';
import { getBugs, type Bug as BugType } from '../api/bugs';
import { cn } from '../lib/utils';

function TechnicalLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-[10px] font-mono text-[#D4FF00] bg-[#D4FF00]/10 px-1 border border-[#D4FF00]/20 inline-flex items-center gap-1", className)}>
      {children}
    </div>
  );
}

function Sparkline({ data, color = "#4A3AFF" }: { data: number[]; color?: string }) {
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
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

function DevHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="flex flex-col md:flex-row items-stretch border-b border-white/20 bg-[#0F1013] sticky top-0 z-40">
      <div className="flex items-center gap-3 p-4 md:px-6 md:w-64 border-b md:border-b-0 md:border-r border-white/20">
        <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={24} />
        <h1 className="text-2xl font-black tracking-tighter uppercase text-white font-display">IndieTest</h1>
      </div>
      <div className="flex-1 flex overflow-x-auto no-scrollbar">
        <div className="flex flex-col justify-center px-6 border-r border-white/20 min-w-max">
          <span className="text-[10px] text-zinc-500 font-mono mb-1">ID_USUÁRIO</span>
          <span className="font-mono text-white text-sm">{user?.id?.slice(0, 8).toUpperCase()}</span>
        </div>
        <div className="flex flex-col justify-center px-6 border-r border-white/20 min-w-max">
          <span className="text-[10px] text-zinc-500 font-mono mb-1">PERFIL</span>
          <span className="font-mono text-[#D4FF00] font-bold text-sm bg-[#D4FF00]/10 px-2 py-0.5 border border-[#D4FF00]/30">
            [{user?.tipo?.toUpperCase()}]
          </span>
        </div>
        <div className="flex flex-col justify-center px-6 border-r border-white/20 min-w-max">
          <span className="text-[10px] text-zinc-500 font-mono mb-1">ESTÚDIO</span>
          <span className="font-mono text-white text-sm">{user?.desenvolvedor?.nomeEstudio || '—'}</span>
        </div>
        <Link to="/notificacoes" className="flex items-center justify-center px-4 hover:bg-[#1C1D22] transition-colors group">
          <Bell size={20} className="text-zinc-500 group-hover:text-[#D4FF00] transition-colors" strokeWidth={1.5} />
        </Link>
        <Link to="/settings" className="flex items-center justify-center px-4 hover:bg-[#1C1D22] transition-colors group">
          <Settings size={20} className="text-zinc-500 group-hover:text-[#D4FF00] transition-colors" strokeWidth={1.5} />
        </Link>
      </div>
      <div className="hidden lg:flex items-center justify-center px-4 border-l border-white/20 gap-2">
        <Link to="/dashboard" className="font-mono text-[10px] text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-2 transition-colors">TESTADOR</Link>
        <button onClick={() => { signOut(); navigate('/'); }} className="font-display font-bold text-xs text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-300/30 px-3 py-2 transition-colors">SAIR</button>
      </div>
    </header>
  );
}

function MetricsGrid({ bugs, projetos }: { bugs: BugType[]; projetos: Projeto[] }) {
  const bugsAtivos = bugs.filter(b => b.status === 'aberto' || b.status === 'em_analise').length;
  const totalBugs = bugs.length;
  const corrigidos = bugs.filter(b => b.status === 'corrigido').length;
  const estabilidade = totalBugs > 0 ? Math.round((corrigidos / totalBugs) * 100) : 100;

  const metrics = [
    { label: 'BUGS ATIVOS', value: String(bugsAtivos), icon: Bug, color: 'text-white' },
    { label: 'ÍNDICE DE ESTABILIDADE', value: `${estabilidade}%`, icon: Activity, color: 'text-[#D4FF00]' },
    { label: 'PROJETOS ATIVOS', value: String(projetos.length), icon: Users, color: 'text-[#4A3AFF]' },
  ];

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <TechnicalLabel>RF13_METRICS</TechnicalLabel>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/20">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="p-6 bg-[#1C1D22] border-b md:border-b-0 md:border-r border-white/20 last:border-0 relative group hover:bg-[#22232a] transition-colors">
              <div className="flex justify-between items-start mb-8">
                <span className="font-mono text-xs text-zinc-400">{metric.label}</span>
                <Icon size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <div className={cn("font-display font-black text-6xl tracking-tighter leading-none", metric.color)}>{metric.value}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CriticalHighlight({ bugs }: { bugs: BugType[] }) {
  const criticos = bugs.filter(b => b.severidade === 'Critica' || b.severidade === 'Alta').slice(0, 2);
  if (criticos.length === 0) return null;
  return (
    <section className="mb-8 relative overflow-hidden border border-[#D4FF00]">
      <div className="absolute inset-0 opacity-20 animate-[pulse_3s_ease-in-out_infinite]"
        style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #FFCC00, #FFCC00 20px, #000 20px, #000 40px)' }} />
      <div className="relative z-10 bg-[#0F1013]/90 p-6 flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-[#D4FF00] border-2 border-black">
          <AlertTriangle size={32} className="text-black" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-display font-black text-2xl text-white uppercase tracking-tight">Atenção Imediata</span>
            <TechnicalLabel className="bg-red-500/10 text-red-500 border-red-500/30">RN06_CRITICAL</TechnicalLabel>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {criticos.map(bug => (
              <Link key={bug.id} to={`/bug/${bug.id}`}
                className="bg-[#1C1D22] border border-red-500/30 p-3 hover:border-red-500 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-[10px] text-zinc-400">[{bug.testeSessao?.versao?.projeto?.nome || 'PROJETO'}]</span>
                  <span className="font-mono text-[10px] text-red-500 group-hover:animate-pulse">{bug.severidade}</span>
                </div>
                <h4 className="font-mono text-sm text-white font-bold">{bug.titulo}</h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SoftwareStatusTable({ projetos }: { projetos: Projeto[] }) {
  const navigate = useNavigate();
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-display font-black tracking-tight text-white uppercase flex items-center gap-2">STATUS DOS SOFTWARES</h2>
        <Link to="/dev/new-project" className="font-display font-bold uppercase tracking-widest px-4 py-2 bg-[#D4FF00] text-black border border-transparent hover:bg-white hover:border-black transition-all active:translate-y-[2px] flex items-center gap-2 shadow-[2px_2px_0_0_#4A3AFF]">
          <PlusSquare size={16} strokeWidth={2} /> Cadastrar Novo
        </Link>
      </div>
      <div className="border border-white/20 bg-[#1C1D22] overflow-x-auto">
        <table className="w-full text-left font-mono text-xs whitespace-nowrap">
          <thead className="bg-[#0F1013] border-b border-white/20 text-zinc-500">
            <tr>
              <th className="p-4 font-normal">PROJETO</th>
              <th className="p-4 font-normal">CATEGORIA</th>
              <th className="p-4 font-normal">VERSÕES</th>
              <th className="p-4 font-normal">STATUS</th>
              <th className="p-4 font-normal w-48">VOLUME_BUGS (7D)</th>
              <th className="p-4 font-normal text-right">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {projetos.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-zinc-500">[NENHUM_PROJETO_CADASTRADO]</td></tr>
            )}
            {projetos.map(proj => {
              const sparkData = [5, 10, 8, 15, 12, 7, proj._count?.versoes || 0].map(n => n + Math.random() * 5);
              return (
                <tr key={proj.id} onClick={() => navigate(`/project/${proj.id}`)}
                  className="hover:bg-[#25262c] transition-colors group cursor-pointer">
                  <td className="p-4 font-bold text-white font-display text-lg tracking-wide uppercase">{proj.nome}</td>
                  <td className="p-4 text-[#D4FF00]">{proj.categoria}</td>
                  <td className="p-4"><span className="border border-white/20 bg-[#0F1013] px-2 py-1">{proj._count?.versoes || 0}</span></td>
                  <td className="p-4">
                    <span className={cn("px-2 py-1 border font-mono text-[10px] font-bold uppercase",
                      proj.status === 'em_teste' ? "border-[#D4FF00] text-[#D4FF00] bg-[#D4FF00]/10" : "border-zinc-500 text-zinc-500")}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="w-full h-8 px-2 border-l border-r border-white/10 group-hover:border-white/30 transition-colors">
                      <Sparkline data={sparkData} color="#4A3AFF" />
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/dev/project/${proj.id}/versoes`}
                        className="text-zinc-500 hover:text-[#D4FF00] border border-transparent hover:border-[#D4FF00]/30 px-2 py-1 transition-colors inline-flex items-center gap-1 text-[10px] font-mono"
                        onClick={e => e.stopPropagation()}>
                        <BarChart size={14} /> VERSÕES
                      </Link>
                      <Link to={`/project/${proj.id}`}
                        className="text-zinc-500 hover:text-white border border-transparent hover:border-white/20 p-2 transition-colors inline-flex"
                        onClick={e => e.stopPropagation()}>
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function DevDashboard() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [bugs, setBugs] = useState<BugType[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([getProjetos(), getBugs()])
      .then(([{ projetos: p }, { bugs: b }]) => {
        setProjetos(p);
        setBugs(b);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1013] text-white selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <DevHeader />
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8">
        {carregando ? (
          <div className="flex items-center justify-center py-24">
            <p className="font-mono text-[#D4FF00] animate-pulse tracking-widest">CARREGANDO_DADOS...</p>
          </div>
        ) : (
          <>
            <MetricsGrid bugs={bugs} projetos={projetos} />
            <CriticalHighlight bugs={bugs} />
            <SoftwareStatusTable projetos={projetos} />
          </>
        )}
      </main>
    </div>
  );
}
