import React, { useEffect, useState } from 'react';
import {
  Crosshair, ArrowLeft, TrendingUp, Users,
  Star, MessageSquare, Filter, BarChart3
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router';

// --- Utils ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const PROJECTS = [
  { id: 'all', name: 'TODOS OS PROJETOS' },
  { id: 'proj-1', name: 'TREVIUM' },
  { id: 'proj-2', name: 'NEON DRIFT' },
  { id: 'proj-3', name: 'VOID BUILD' },
];

const FEEDBACKS = [
  {
    id: 'FDB-001',
    testerName: 'GHOST_RUNNER_88',
    testerId: 'TST-0423',
    project: 'TREVIUM',
    version: 'V1.2.0',
    notaExperiencia: 5,
    comentario: 'A mecânica de combate está extremamente fluida. Os controles respondem perfeitamente e a progressão do personagem é gratificante. Excelente trabalho na otimização.',
    timestamp: '2h atrás'
  },
  {
    id: 'FDB-002',
    testerName: 'NEON_PIXEL',
    testerId: 'TST-0891',
    project: 'NEON DRIFT',
    version: 'V0.9.8',
    notaExperiencia: 4,
    comentario: 'Visual incrível e trilha sonora envolvente. Senti que as curvas precisam de um pouco mais de ajuste fino no handling, mas no geral a experiência é muito boa.',
    timestamp: '5h atrás'
  },
  {
    id: 'FDB-003',
    testerName: 'VOID_WALKER',
    testerId: 'TST-0124',
    project: 'TREVIUM',
    version: 'V1.1.9',
    notaExperiencia: 3,
    comentario: 'Interface de usuário confusa em algumas áreas. Os tutoriais poderiam ser mais claros. Mecânicas principais são sólidas, mas a curva de aprendizado é íngreme.',
    timestamp: '8h atrás'
  },
  {
    id: 'FDB-004',
    testerName: 'BYTE_KNIGHT',
    testerId: 'TST-0567',
    project: 'VOID BUILD',
    version: 'V2.1.0',
    notaExperiencia: 5,
    comentario: 'Ferramenta essencial! A integração com outros sistemas é perfeita e a performance é excepcional. A documentação é clara e o fluxo de trabalho é intuitivo.',
    timestamp: '12h atrás'
  },
  {
    id: 'FDB-005',
    testerName: 'SYNTH_TESTER',
    testerId: 'TST-0392',
    project: 'NEON DRIFT',
    version: 'V0.9.7',
    notaExperiencia: 2,
    comentario: 'Problemas de performance em pistas com muitos elementos. O framerate cai significativamente em momentos críticos. Precisa de otimização urgente.',
    timestamp: '1d atrás'
  },
  {
    id: 'FDB-006',
    testerName: 'CIRCUIT_BREAKER',
    testerId: 'TST-0745',
    project: 'TREVIUM',
    version: 'V1.2.0',
    notaExperiencia: 4,
    comentario: 'Design de níveis criativo e desafiador. Alguns checkpoints poderiam estar melhor posicionados, mas a exploração é recompensadora.',
    timestamp: '1d atrás'
  },
  {
    id: 'FDB-007',
    testerName: 'DATA_PHANTOM',
    testerId: 'TST-0218',
    project: 'VOID BUILD',
    version: 'V2.0.5',
    notaExperiencia: 5,
    comentario: 'Incrível produtividade! A ferramenta economiza horas de trabalho. Interface clean e funcional. Espero ansiosamente pelas próximas features.',
    timestamp: '2d atrás'
  },
  {
    id: 'FDB-008',
    testerName: 'NEON_SHADOW',
    testerId: 'TST-0956',
    project: 'NEON DRIFT',
    version: 'V0.9.8',
    notaExperiencia: 5,
    comentario: 'A sensação de velocidade é perfeita! Os efeitos visuais são impressionantes sem prejudicar a jogabilidade. Multiplayer é viciante.',
    timestamp: '2d atrás'
  }
];

// --- Components ---
function TechnicalLabel({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("text-[10px] font-mono text-[#D4FF00] bg-[#D4FF00]/10 px-1 border border-[#D4FF00]/20 inline-flex items-center gap-1", className)}>
      {children}
    </div>
  );
}

function EnergyBlocks({ value, max = 5 }: { value: number, max?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-8 h-10 border transition-all",
            i < value
              ? "bg-[#D4FF00] border-[#D4FF00] shadow-[0_0_8px_rgba(212,255,0,0.4)]"
              : "bg-[#0F1013] border-[#2C2D35]"
          )}
        />
      ))}
    </div>
  );
}

function FeedbackCard({ feedback }: { feedback: typeof FEEDBACKS[0] }) {
  return (
    <div className="bg-[#1C1D22] border border-[#2C2D35] p-6 hover:border-[#4A3AFF]/50 transition-colors group">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 pb-4 border-b border-[#2C2D35]">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display font-black text-lg text-white uppercase tracking-wide">
              {feedback.testerName}
            </span>
            <span className="font-mono text-[10px] text-zinc-500 bg-[#0F1013] px-2 py-0.5 border border-[#2C2D35]">
              {feedback.testerId}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">
              {feedback.project}
            </TechnicalLabel>
            <span className="font-mono text-xs text-zinc-400">
              VERSÃO: <span className="text-white">{feedback.version}</span>
            </span>
            <span className="font-mono text-[10px] text-zinc-600">
              {feedback.timestamp}
            </span>
          </div>
        </div>

        {/* Energy Blocks Rating */}
        <div className="flex flex-col items-start sm:items-end gap-2">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
            NOTA_EXPERIÊNCIA
          </span>
          <EnergyBlocks value={feedback.notaExperiencia} />
          <span className="font-display font-black text-2xl text-[#D4FF00]">
            {feedback.notaExperiencia}.0
          </span>
        </div>
      </div>

      {/* Comentário */}
      <div className="relative">
        <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[#4A3AFF]/50 to-transparent" />
        <p className="font-mono text-sm text-zinc-300 leading-relaxed pl-2">
          {feedback.comentario}
        </p>
      </div>
    </div>
  );
}

// --- Sections ---
function FeedbackHeader() {
  return (
    <header className="flex flex-col md:flex-row items-stretch border-b border-[#2C2D35] bg-[#0F1013] sticky top-0 z-40">
      <div className="flex items-center gap-3 p-4 md:px-6 md:w-64 border-b md:border-b-0 md:border-r border-[#2C2D35]">
        <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={24} />
        <h1 className="text-2xl font-black tracking-tighter uppercase text-white font-display">
          IndieTest
        </h1>
      </div>

      <div className="flex-1 flex overflow-x-auto no-scrollbar items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dev" className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-[#2C2D35] p-2 bg-[#1C1D22]">
            <ArrowLeft size={16} /> VOLTAR_DASHBOARD
          </Link>
          <div className="h-4 w-px bg-[#2C2D35]" />
          <span className="font-mono text-xs text-[#D4FF00] font-bold tracking-widest">
            CENTRAL_UX // RF09
          </span>
        </div>
      </div>
    </header>
  );
}

function MetricsPanel({ selectedProject, feedbacks }: { selectedProject: string, feedbacks: typeof FEEDBACKS }) {
  const filteredFeedbacks = selectedProject === 'all'
    ? feedbacks
    : feedbacks.filter(f => f.project === PROJECTS.find(p => p.id === selectedProject)?.name);

  const avgRating = filteredFeedbacks.length > 0
    ? (filteredFeedbacks.reduce((sum, f) => sum + f.notaExperiencia, 0) / filteredFeedbacks.length).toFixed(1)
    : '0.0';

  const totalTestadores = new Set(filteredFeedbacks.map(f => f.testerId)).size;

  return (
    <section className="mb-8 sticky top-[73px] z-30 bg-[#0F1013] pt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/20">
        {/* Métrica 1: Média de Satisfação */}
        <div className="p-6 bg-[#1C1D22] border-b md:border-b-0 md:border-r border-white/20 relative group hover:bg-[#22232a] transition-colors">
          <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-xs text-zinc-400">SATISFAÇÃO_MÉDIA</span>
            <TrendingUp size={18} className="text-zinc-600 group-hover:text-[#D4FF00] transition-colors" />
          </div>
          <div className="font-display font-black text-6xl tracking-tighter leading-none text-[#D4FF00] flex items-baseline gap-2">
            {avgRating}
            <span className="text-2xl text-zinc-500">/5.0</span>
          </div>
        </div>

        {/* Métrica 2: Total de Feedbacks */}
        <div className="p-6 bg-[#1C1D22] border-b md:border-b-0 md:border-r border-white/20 relative group hover:bg-[#22232a] transition-colors">
          <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-xs text-zinc-400">DEPOIMENTOS_ATIVOS</span>
            <MessageSquare size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
          </div>
          <div className="font-display font-black text-6xl tracking-tighter leading-none text-white">
            {filteredFeedbacks.length}
          </div>
        </div>

        {/* Métrica 3: Testadores Únicos */}
        <div className="p-6 bg-[#1C1D22] relative group hover:bg-[#22232a] transition-colors">
          <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-xs text-zinc-400">TESTADORES_ÚNICOS</span>
            <Users size={18} className="text-zinc-600 group-hover:text-[#4A3AFF] transition-colors" />
          </div>
          <div className="font-display font-black text-6xl tracking-tighter leading-none text-[#4A3AFF]">
            {totalTestadores}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeedbackHub() {
  const [selectedProject, setSelectedProject] = useState('all');

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

  const filteredFeedbacks = selectedProject === 'all'
    ? FEEDBACKS
    : FEEDBACKS.filter(f => f.project === PROJECTS.find(p => p.id === selectedProject)?.name);

  return (
    <div className="min-h-screen bg-[#0F1013] text-white selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <FeedbackHeader />

      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8">

        {/* Título Principal */}
        <div className="mb-6">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter mb-2">
            Central de <span className="text-[#D4FF00]">Percepção</span> de UX
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase">
            Mural de Depoimentos // Análise de Experiência do Usuário
          </p>
        </div>

        {/* Métricas Consolidadas */}
        <MetricsPanel selectedProject={selectedProject} feedbacks={FEEDBACKS} />

        {/* Filtro de Projetos */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-[#4A3AFF]" />
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
              Filtrar_Por_Projeto
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROJECTS.map(proj => (
              <button
                key={proj.id}
                onClick={() => setSelectedProject(proj.id)}
                className={cn(
                  "font-display font-bold uppercase tracking-wider px-4 py-2 border transition-all text-sm",
                  selectedProject === proj.id
                    ? "bg-[#4A3AFF] text-white border-[#4A3AFF] shadow-[2px_2px_0_0_#D4FF00]"
                    : "bg-[#1C1D22] text-zinc-400 border-[#2C2D35] hover:border-[#4A3AFF] hover:text-white"
                )}
              >
                {proj.name}
              </button>
            ))}
          </div>
        </section>

        {/* Mural de Feedbacks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-display font-black tracking-tight text-white uppercase flex items-center gap-2">
              <BarChart3 className="text-[#4A3AFF]" size={24} />
              Depoimentos Registrados
            </h2>
            <span className="font-mono text-xs text-zinc-500">
              {filteredFeedbacks.length} ENTRADAS
            </span>
          </div>

          {filteredFeedbacks.length === 0 ? (
            <div className="bg-[#1C1D22] border border-[#2C2D35] p-12 text-center">
              <MessageSquare size={48} className="text-zinc-600 mx-auto mb-4" />
              <p className="font-display font-bold text-xl text-zinc-500 uppercase">
                Nenhum Feedback Encontrado
              </p>
              <p className="font-mono text-xs text-zinc-600 mt-2">
                Ajuste os filtros ou aguarde novos depoimentos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredFeedbacks.map(feedback => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
