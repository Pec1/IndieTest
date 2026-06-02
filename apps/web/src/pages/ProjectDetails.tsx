import React, { useEffect, useState } from 'react';
import { Download, Bug, Calendar, Clock, FileCode, Shield, Package, AlertCircle, ExternalLink } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { getProjeto, type Projeto, type Versao } from '../api/projetos';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { AppHeader } from '../components/ui/AppHeader';
import { VersionCard } from '../components/shared/VersionCard';

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [carregando, setCarregando] = useState(true);

  const ehDono = user?.tipo === 'desenvolvedor' && projeto?.desenvolvedor?.id === user?.desenvolvedor?.id;

  useEffect(() => {
    if (!id) return;
    getProjeto(id)
      .then(({ projeto: p }) => setProjeto(p))
      .catch(() => navigate('/dashboard'))
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-it-page flex items-center justify-center">
        <p className="font-mono text-[#D4FF00] animate-pulse tracking-widest">CARREGANDO_PROJETO...</p>
      </div>
    );
  }

  if (!projeto) return null;

  const versoes = projeto.versoes || [];
  const versaoAtual = versoes[0];

  return (
    <div className="min-h-screen bg-it-page text-it-text selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <AppHeader>
        <AppHeader.Brand />
        <AppHeader.Nav className="justify-between">
          <AppHeader.NavLabel>DETALHES_PROJETO</AppHeader.NavLabel>
          <div className="flex items-stretch shrink-0">
            {user?.tipo === 'desenvolvedor' && (
              <Link to={`/dev/project/${id}/versoes`} className="hidden sm:flex font-display font-bold uppercase tracking-widest px-4 py-2 bg-[#D4FF00] text-black hover:bg-[#e2ff4d] transition-all text-xs items-center gap-2 border-r border-it-border">
                GERENCIAR_VERSÕES
              </Link>
            )}
            <AppHeader.Utilities />
          </div>
        </AppHeader.Nav>
      </AppHeader>
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8">
        <section className="mb-8 bg-it-surface border-2 border-[#4A3AFF] p-8 relative overflow-hidden">
          <div className="absolute inset-0 animated-grid" style={{ backgroundImage: 'linear-gradient(#4A3AFF 1px, transparent 1px), linear-gradient(90deg, #4A3AFF 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#D4FF00] border-4 border-black flex items-center justify-center text-5xl">🎮</div>
              <div>
                <div className="font-mono text-[10px] text-it-muted uppercase mb-1">DESENVOLVEDOR</div>
                <div className="font-display font-bold text-it-text uppercase text-lg tracking-wide">{projeto.desenvolvedor.nomeEstudio}</div>
                <div className="font-mono text-xs text-it-muted">{projeto.desenvolvedor.usuario?.nome}</div>
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-[10px] text-it-muted uppercase mb-2">PROJETO_ID: {projeto.id.slice(0, 8).toUpperCase()}</div>
              <h1 className="font-display font-black text-6xl tracking-tighter uppercase text-[#D4FF00] mb-2">{projeto.nome}</h1>
              <div className="font-display font-bold text-xl text-[#4A3AFF] uppercase tracking-wide">{projeto.categoria}</div>
            </div>
            <div className="flex justify-end">
              <div className="bg-it-page border border-[#D4FF00] p-4">
                <div className="font-mono text-[10px] text-it-muted uppercase mb-2">STATUS</div>
                <div className="font-display font-black text-2xl text-[#D4FF00] uppercase tracking-tight flex items-center gap-2">
                  <Package size={24} />{projeto.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {versaoAtual && (
              <section className="bg-it-page border-4 border-[#D4FF00] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-2" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #D4FF00, #D4FF00 20px, #000 20px, #000 40px)' }} />
                <div className="absolute bottom-0 left-0 w-full h-2" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #D4FF00, #D4FF00 20px, #000 20px, #000 40px)' }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="font-mono text-[10px] text-it-muted uppercase mb-2 flex items-center gap-2"><Download size={14} />PAINEL_DE_DOWNLOAD</div>
                      <h2 className="font-display font-black text-3xl text-it-text uppercase tracking-tight">Build Ativa</h2>
                    </div>
                  </div>
                  <div className="bg-it-surface border border-it-border p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <div className="font-mono text-[10px] text-it-muted uppercase mb-2">BUILD_ATIVA</div>
                        <div className="font-display font-black text-4xl text-[#D4FF00] tracking-tighter">{versaoAtual.numeroVersao}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-it-muted uppercase mb-2">STATUS</div>
                        <div className="font-mono text-lg text-it-text font-bold">{versaoAtual.status}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-it-muted uppercase mb-2">DATA_PUBLICAÇÃO</div>
                        <div className="font-mono text-sm text-it-text flex items-center gap-2">
                          <Calendar size={16} className="text-[#4A3AFF]" />{new Date(versaoAtual.dataPublicacao).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    <Link to={`/start-session`}
                      className="w-full font-display font-bold uppercase tracking-widest px-6 py-4 bg-[#D4FF00] text-black border-2 border-[#D4FF00] hover:bg-[#b8e000] shadow-[4px_4px_0_0_#4A3AFF] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all flex items-center justify-center gap-3 text-lg">
                      <Download size={24} strokeWidth={2.5} /> INICIAR_SESSÃO_DE_TESTE
                    </Link>
                  </div>
                  <div className="flex items-start gap-3 bg-it-surface border-l-2 border-[#D4FF00] p-4">
                    <AlertCircle size={18} className="text-[#D4FF00] shrink-0 mt-0.5" />
                    <p className="font-mono text-[10px] text-it-muted uppercase leading-relaxed">Baixe o software, teste e reporte qualquer anomalia encontrada durante sua sessão de testes.</p>
                  </div>
                </div>
              </section>
            )}
            <section className="bg-it-surface border border-it-border">
              <div className="border-b border-it-border p-4 bg-it-page">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="text-[#4A3AFF]" size={20} />
                    <h2 className="font-display font-black text-it-text uppercase text-lg tracking-tight">Especificações e Escopo</h2>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="font-mono text-[10px] text-it-muted uppercase mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> DESCRIÇÃO_DETALHADA
                </div>
                <div className="bg-it-page border border-it-border p-4 mb-4">
                  <pre className="font-mono text-xs text-it-subtle whitespace-pre-wrap leading-relaxed">{projeto.descricao}</pre>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-it-border">
                  <div className="p-4 border-b md:border-b-0 md:border-r border-it-border bg-it-page">
                    <div className="font-mono text-[10px] text-it-muted uppercase mb-2">VERSÕES</div>
                    <div className="font-display font-black text-2xl text-it-text">{versoes.length}</div>
                  </div>
                  <div className="p-4 border-b md:border-b-0 md:border-r border-it-border bg-it-page">
                    <div className="font-mono text-[10px] text-it-muted uppercase mb-2">CONVITES</div>
                    <div className="font-display font-black text-2xl text-[#D4FF00]">{projeto._count?.convites || 0}</div>
                  </div>
                  <div className="p-4 bg-it-page">
                    <div className="font-mono text-[10px] text-it-muted uppercase mb-2">CRIADO_EM</div>
                    <div className="font-mono text-sm text-it-text">{new Date(projeto.dataCriacao).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-it-surface border border-it-border">
              <div className="border-b border-it-border p-4 bg-it-page">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="text-[#4A3AFF]" size={20} />
                    <h2 className="font-display font-black text-it-text uppercase text-lg tracking-tight">Histórico de Versões</h2>
                  </div>
                  <span className="font-mono text-xs text-it-muted">{versoes.length} BUILDS</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {versoes.length === 0 && <p className="font-mono text-xs text-it-muted text-center py-8">[NENHUMA_VERSÃO_CADASTRADA]</p>}
                {versoes.map((v, i) => <VersionCard key={v.id} versao={v} isLatest={i === 0} activeLabel="BUILD_ATIVA" changelogLabel="NOTAS_DE_ATUALIZAÇÃO" />)}
              </div>
            </section>
          </div>
          <div className="space-y-6">
            <section className="bg-it-surface border border-it-border sticky top-24">
              <div className="border-b border-it-border p-4 bg-it-page">
                <div className="flex items-center gap-2">
                  <Shield className="text-[#D4FF00]" size={20} />
                  <h2 className="font-display font-black text-it-text uppercase text-sm tracking-tight">Atalhos Operacionais</h2>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {user?.tipo === 'testador' && (
                  <Link to="/start-session" className="w-full font-display font-bold uppercase tracking-widest px-6 py-4 border-2 bg-[#D4FF00] text-black border-[#D4FF00] hover:bg-[#b8e000] shadow-[4px_4px_0_0_#4A3AFF] active:shadow-none transition-all flex items-center justify-center gap-3 text-lg">
                    <Download size={24} strokeWidth={2.5} /> INICIAR_TESTE
                  </Link>
                )}
                <Link to="/report-bug" className="w-full font-display font-bold uppercase tracking-widest px-6 py-4 border-2 bg-[#4A3AFF] text-on-brand border-[#4A3AFF] hover:bg-[#382bd6] shadow-[3px_3px_0_0_#D4FF00] active:shadow-none transition-all flex items-center justify-center gap-3 text-lg">
                  <Bug size={24} strokeWidth={2.5} /> REPORTAR_BUG
                </Link>
                {user?.tipo === 'desenvolvedor' && (
                  <Link to={`/dev/project/${id}/versoes`} className="w-full font-display font-bold uppercase tracking-widest px-6 py-4 border-2 bg-it-surface text-it-text border-it-border hover:border-[#D4FF00] transition-all flex items-center justify-center gap-3">
                    GERENCIAR_VERSÕES
                  </Link>
                )}
                <div className="pt-3 border-t border-it-border">
                  <Link to="/bug-tracker" className="w-full font-mono text-xs uppercase px-4 py-3 bg-it-page text-it-muted border border-it-border hover:border-[#4A3AFF] hover:text-it-text transition-all flex items-center justify-center gap-2">
                    <ExternalLink size={14} /> Ver Bug Tracker
                  </Link>
                </div>
              </div>
            </section>
            <section className="bg-it-surface border border-it-border p-4">
              <div className="font-mono text-[10px] text-it-muted uppercase mb-3">INFORMAÇÕES_ADICIONAIS</div>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#D4FF00] mt-1 shrink-0" />
                  <p className="text-it-muted leading-relaxed">Inicie uma sessão de teste antes de reportar bugs.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#4A3AFF] mt-1 shrink-0" />
                  <p className="text-it-muted leading-relaxed">Reporte todos os bugs encontrados com o máximo de detalhes possível.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
