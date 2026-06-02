import React, { useEffect, useState } from 'react';
import { Terminal, Activity, ArrowUpRight, BarChart2, PlusSquare, Disc, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getProjetos, type Projeto } from '../api/projetos';
import { getAtividades, type Atividade } from '../api/atividades';
import { cn } from '../lib/utils';
import { AppHeader } from '../components/ui/AppHeader';

function ZapIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-it-accent-fg" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" />
    </svg>
  );
}

function StructuralHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/');
  }

  return (
    <AppHeader>
      <AppHeader.Brand className="bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoMnYySDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9zdmc+')]" />
      <AppHeader.InfoBar>
        <AppHeader.InfoCell label="ID_USUÁRIO">
          <span className="text-it-text">{user?.id?.slice(0, 8).toUpperCase() || 'USR-????'}</span>
        </AppHeader.InfoCell>
        <AppHeader.InfoCell label="PERFIL">
          <span className="font-mono text-[#4A3AFF] font-bold text-sm bg-[#4A3AFF]/10 px-2 py-0.5 border border-[#4A3AFF]/30">
            [{user?.tipo?.toUpperCase() || 'TESTADOR'}]
          </span>
        </AppHeader.InfoCell>
        <AppHeader.InfoCell label="REDE GLOBAL">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#D4FF00] animate-pulse" />
            <span className="font-mono text-[#D4FF00] font-bold text-sm tracking-wider">SYS.ONLINE</span>
          </div>
        </AppHeader.InfoCell>
        <Link to="/notificacoes" className="flex items-center justify-center px-4 hover:bg-it-surface transition-colors border-r border-it-border group" title="Notificações">
          <Bell size={20} className="text-it-muted group-hover:text-it-header-icon-hover transition-colors" strokeWidth={1.5} />
        </Link>
        <AppHeader.Utilities />
      </AppHeader.InfoBar>
      <AppHeader.Actions className="px-0 overflow-hidden">
        {user?.tipo === 'desenvolvedor' && (
          <Link
            to="/dev"
            className="font-display font-bold text-black tracking-widest uppercase text-sm h-full flex items-center justify-center px-5 bg-[#D4FF00] hover:bg-[#b8e600] transition-colors border-r border-it-border"
          >
            ÁREA DEV
          </Link>
        )}
        <button
          onClick={handleSignOut}
          className="font-display font-bold text-on-brand tracking-widest uppercase text-sm h-full flex items-center justify-center px-5 bg-[#4A3AFF] hover:bg-[#382bd6] transition-colors"
        >
          SAIR // LOGOUT
        </button>
      </AppHeader.Actions>
    </AppHeader>
  );
}

function TopProjects({ projetos }: { projetos: Projeto[] }) {
  const top5 = projetos.slice(0, 5);
  return (
    <section className="mb-10">
      <div className="border-b border-it-border pb-2 mb-6">
        <h2 className="text-2xl font-display font-black tracking-tight text-it-text uppercase flex items-center gap-2">
          <ZapIcon /> Projetos em Foco <span className="text-[#4A3AFF]">[TOP 5]</span>
        </h2>
      </div>
      {top5.length === 0 ? (
        <div className="border border-it-border bg-it-surface p-12 text-center">
          <p className="font-mono text-sm text-it-muted uppercase">[NENHUM_PROJETO_DISPONÍVEL]</p>
          <p className="font-mono text-xs text-it-muted mt-2">Aguardando convite de um desenvolvedor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border border-it-border bg-it-surface">
          {top5.map((proj, index) => {
            const isTop2 = index < 2;
            const totalVersoes = proj._count?.versoes || 0;
            const volumePct = Math.min(100, totalVersoes * 20 + 20);
            return (
              <Link key={proj.id} to={`/project/${proj.id}`}
                className={cn("relative flex flex-col p-4 border-r border-b md:border-b-0 border-it-border last:border-r-0 aspect-[3/4] md:aspect-auto group hover:bg-it-elevated transition-colors cursor-pointer",
                  isTop2 && "border-2 border-[#D4FF00] z-10 shadow-[0_0_15px_rgba(212,255,0,0.1)]")}>
                <div className="flex justify-between items-start mb-auto">
                  <span className={cn("font-display font-black text-3xl leading-none", isTop2 ? "text-[#D4FF00]" : "text-it-muted")}>0{index + 1}</span>
                  {isTop2 && <ArrowUpRight className="text-[#D4FF00]" size={20} strokeWidth={1.5} />}
                </div>
                <div className="mt-8">
                  <span className="block font-mono text-[10px] text-it-muted mb-1 border-b border-it-border pb-1">{proj.categoria}</span>
                  <h3 className="font-display font-bold text-xl uppercase tracking-tighter text-it-text mb-4 group-hover:text-it-header-icon-hover transition-colors">{proj.nome}</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-it-muted">VERSÕES</span>
                      <span className="text-it-text">{totalVersoes}</span>
                    </div>
                    <div className="h-1.5 w-full bg-it-page border border-it-border">
                      <div className="h-full bg-[#D4FF00]" style={{ width: `${volumePct}%` }} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ActiveTerminal({ projetos }: { projetos: Projeto[] }) {
  return (
    <section>
      <div className="flex items-center justify-between border-b border-it-border pb-2 mb-6">
        <h2 className="text-2xl font-display font-black tracking-tight text-it-text uppercase flex items-center gap-2">
          <Terminal size={24} className="text-[#4A3AFF]" strokeWidth={1.5} /> [PROJETOS_DISPONÍVEIS]
        </h2>
        <Link to="/report-bug" className="hidden sm:flex font-display font-bold uppercase tracking-widest px-4 py-1.5 bg-[#4A3AFF] text-on-brand hover:bg-it-elevated hover:text-it-text transition-all text-xs items-center gap-2">
          <Activity size={14} strokeWidth={2} /> REPORTAR_FALHA
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projetos.length === 0 && (
          <div className="col-span-2 border border-it-border bg-it-surface p-12 text-center">
            <p className="font-mono text-sm text-it-muted uppercase">[SEM_PROJETOS]</p>
          </div>
        )}
        {projetos.map((proj) => {
          const isAtivo = proj.status === 'em_teste';
          return (
            <Link key={proj.id} to={`/project/${proj.id}`}
              className="relative p-0 group hover:border-[#D4FF00] transition-colors cursor-pointer flex flex-col bg-it-surface text-it-text border border-it-border">
              <div className="absolute top-0 right-0 flex">
                <div className={cn("font-mono text-[10px] px-2 py-1 font-bold border-b border-l border-it-border flex items-center gap-1.5",
                  isAtivo ? "bg-[#D4FF00] text-black" : "bg-zinc-800 text-it-muted")}>
                  {isAtivo && <Disc size={10} className="animate-spin" />}
                  {isAtivo ? 'ATIVO' : proj.status.toUpperCase()}
                </div>
              </div>
              <div className="p-5 flex-1">
                <div className="font-mono text-xs text-it-muted mb-2">{proj.categoria} // {proj.desenvolvedor.nomeEstudio}</div>
                <h3 className="font-display font-bold text-2xl uppercase tracking-tighter text-it-text">{proj.nome}</h3>
                <p className="font-mono text-xs text-it-muted mt-2 line-clamp-2">{proj.descricao}</p>
              </div>
              <div className="border-t border-it-border bg-it-page p-3 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-6 h-6 border border-it-border flex items-center justify-center text-it-muted hover:text-it-text hover:border-[#D4FF00]">
                    <Activity size={14} strokeWidth={1.5} />
                  </div>
                  <div className="w-6 h-6 border border-it-border flex items-center justify-center text-it-muted hover:text-it-text hover:border-[#D4FF00]">
                    <BarChart2 size={14} strokeWidth={1.5} />
                  </div>
                </div>
                <span className="font-mono text-[10px] text-[#4A3AFF] font-bold tracking-widest flex items-center gap-1 group-hover:text-it-header-icon-hover">
                  VER_DETALHES <PlusSquare size={12} />
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
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    getAtividades()
      .then(({ atividades: a }) => setAtividades(a))
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  return (
    <aside className="w-full xl:w-96 flex-shrink-0 flex flex-col h-[600px] xl:h-[calc(100vh-80px)] sticky top-20 border-l border-it-border bg-it-page">
      <div className="p-4 border-b border-it-border bg-it-surface">
        <h2 className="text-lg font-display font-black tracking-tight text-it-text uppercase mb-1">LOG_DE_ATIVIDADE</h2>
        <p className="font-mono text-[10px] text-it-muted">EVENTOS RECENTES DA PLATAFORMA</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 no-scrollbar">
        {carregando && <p className="text-it-muted animate-pulse">CARREGANDO...</p>}
        {!carregando && atividades.length === 0 && <p className="text-it-muted">[SEM_ATIVIDADE_RECENTE]</p>}
        {atividades.map((a, i) => (
          <div key={i} className="group hover:bg-it-surface p-1 -mx-1 transition-colors border-l-2 border-transparent hover:border-[#D4FF00] flex gap-3">
            <span className="text-it-muted shrink-0 select-none">[{new Date(a.data).toLocaleTimeString('pt-BR', { hour12: false })}]</span>
            <div>
              <span className="font-bold mr-2" style={{ color: a.cor }}>{a.tipo.toUpperCase()}:</span>
              <span className="text-it-subtle">{a.texto}</span>
            </div>
          </div>
        ))}
        <div className="flex gap-3 mt-4">
          <span className="text-it-muted">[{new Date().toLocaleTimeString('pt-BR', { hour12: false })}]</span>
          <span className="w-2 h-4 bg-[#D4FF00] animate-pulse inline-block" />
        </div>
      </div>
      <div className="p-4 border-t border-it-border bg-it-surface">
        <div className="flex items-center gap-4">
          <Link to="/start-session" className="flex-1 font-display font-bold uppercase tracking-widest px-4 py-2 bg-[#D4FF00] text-black hover:bg-[#e2ff4d] transition-all text-xs flex items-center justify-center gap-2">INICIAR_SESSÃO</Link>
          <Link to="/convites" className="flex-1 font-display font-bold uppercase tracking-widest px-4 py-2 bg-it-surface border border-it-border text-it-text hover:border-[#4A3AFF] transition-all text-xs flex items-center justify-center gap-2">CONVITES</Link>
        </div>
      </div>
    </aside>
  );
}

export function Dashboard() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    getProjetos()
      .then(({ projetos: p }) => setProjetos(p))
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="min-h-screen bg-it-page text-it-text selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <StructuralHeader />
      <main className="flex-1 flex flex-col xl:flex-row w-full max-w-[1920px] mx-auto">
        <div className="flex-1 p-4 md:p-8 xl:pr-12 overflow-x-hidden">
          {carregando ? (
            <div className="flex items-center justify-center py-24">
              <p className="font-mono text-[#D4FF00] animate-pulse tracking-widest">CARREGANDO_DADOS...</p>
            </div>
          ) : (
            <>
              <TopProjects projetos={projetos} />
              <ActiveTerminal projetos={projetos} />
            </>
          )}
        </div>
        <DataIngestionFeed />
      </main>
    </div>
  );
}
