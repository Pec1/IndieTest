import React, { useEffect, useState } from 'react';
import { Crosshair, ArrowLeft, MessageSquare, Star, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { getBugs, type Bug } from '../api/bugs';
import { cn } from '../lib/utils';
import { TechnicalLabel } from '../components/ui/TechnicalLabel';
import { StatsGrid } from '../components/ui/StatsGrid';
import { AppHeader } from '../components/ui/AppHeader';

function EnergyBlocks({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={cn("w-4 h-8 border border-[#2C2D35]", i < value ? "bg-[#D4FF00]" : "bg-[#0F1013]")} />
      ))}
    </div>
  );
}

export function FeedbackHub() {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroProjeto, setFiltroProjeto] = useState('');

  useEffect(() => {
    getBugs().then(({ bugs: b }) => setBugs(b)).catch(console.error).finally(() => setCarregando(false));
  }, []);

  const projetos = Array.from(new Set(bugs.map(b => b.testeSessao?.versao?.projeto?.nome).filter(Boolean)));
  const bugsFiltrados = filtroProjeto ? bugs.filter(b => b.testeSessao?.versao?.projeto?.nome === filtroProjeto) : bugs;

  const totalBugs = bugsFiltrados.length;
  const corrigidosFiltrados = bugsFiltrados.filter(b => b.status === 'corrigido' || b.status === 'fechado').length;
  const satisfacaoMedia = totalBugs > 0
    ? parseFloat(((corrigidosFiltrados / totalBugs) * 5).toFixed(1))
    : 0;

  const corrigidos = bugs.filter(b => b.status === 'corrigido').length;
  const testadoresUnicos = new Set(bugs.map(b => b.testeSessao?.testadorId).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-[#0F1013] text-white selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <AppHeader>
        <AppHeader.Brand />
        <AppHeader.Nav>
          <AppHeader.NavBack onClick={() => navigate(-1)}><ArrowLeft size={16} /> VOLTAR</AppHeader.NavBack>
          <AppHeader.NavDivider />
          <AppHeader.NavLabel>FEEDBACK_HUB // RF14</AppHeader.NavLabel>
        </AppHeader.Nav>
      </AppHeader>
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter mb-1">
            Central de <span className="text-[#4A3AFF]">Feedback</span>
          </h1>
          <p className="font-mono text-xs text-zinc-500">ANÁLISE DE QUALIDADE E EXPERIÊNCIA DO USUÁRIO</p>
        </div>
        <StatsGrid cols={3}>
          <StatsGrid.Item label="SATISFAÇÃO MÉDIA" value={satisfacaoMedia > 0 ? `${satisfacaoMedia}/5` : '—'} color="text-[#D4FF00]" labelClassName="mb-4" />
          <StatsGrid.Item label="BUGS CORRIGIDOS" value={String(corrigidos)} color="text-[#10b981]" labelClassName="mb-4" />
          <StatsGrid.Item label="TESTADORES ÚNICOS" value={String(testadoresUnicos)} color="text-[#4A3AFF]" labelClassName="mb-4" />
        </StatsGrid>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <Filter size={14} /> FILTRAR_PROJETO:
          </div>
          <select value={filtroProjeto} onChange={e => setFiltroProjeto(e.target.value)}
            className="bg-[#1C1D22] border border-[#2C2D35] text-white py-2 px-4 font-mono text-xs outline-none focus:border-[#D4FF00] appearance-none cursor-pointer">
            <option value="">TODOS OS PROJETOS</option>
            {projetos.map(p => <option key={p} value={p!} className="bg-[#1C1D22]">{p}</option>)}
          </select>
          <TechnicalLabel>{bugsFiltrados.length} REGISTROS</TechnicalLabel>
        </div>
        {carregando ? (
          <div className="flex items-center justify-center py-24">
            <p className="font-mono text-[#D4FF00] animate-pulse tracking-widest">CARREGANDO_DADOS...</p>
          </div>
        ) : bugsFiltrados.length === 0 ? (
          <div className="border border-[#2C2D35] bg-[#1C1D22] p-16 text-center">
            <MessageSquare size={48} className="text-zinc-700 mx-auto mb-4" />
            <p className="font-mono text-sm text-zinc-500 uppercase">[NENHUM_FEEDBACK_DISPONÍVEL]</p>
            <p className="font-mono text-xs text-zinc-600 mt-2">Os feedbacks serão gerados a partir dos bugs reportados e suas respostas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bugsFiltrados.map(bug => {
              const severidadeScore: Record<string, number> = { Baixa: 2, Media: 3, Alta: 4, Critica: 5 };
              const satisfacao = 6 - (severidadeScore[bug.severidade] || 3);
              return (
                <Link key={bug.id} to={`/bug/${bug.id}`}
                  className="bg-[#1C1D22] border border-[#2C2D35] hover:border-[#4A3AFF] transition-colors p-5 group">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="font-mono text-[10px] text-zinc-500 mb-1">{bug.testeSessao?.versao?.projeto?.nome || 'PROJETO'} — {bug.testeSessao?.testador?.usuario?.nome || 'TESTADOR'}</div>
                      <h3 className="font-display font-bold text-white uppercase tracking-tight group-hover:text-[#4A3AFF] transition-colors">{bug.titulo}</h3>
                    </div>
                    <div className="shrink-0">
                      <EnergyBlocks value={satisfacao} />
                    </div>
                  </div>
                  <p className="font-mono text-xs text-zinc-400 line-clamp-2 mb-3">{bug.descricao}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star size={12} className="text-[#D4FF00]" />
                      <span className="font-mono text-[10px] text-zinc-500">{satisfacao}/5 IMPACTO</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-600">{new Date(bug.dataCriacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
