import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, Bug, Calendar, Clock, FileCode, Shield, Package, AlertCircle, ExternalLink } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { getProjeto, type Projeto, type Versao } from '../api/projetos';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { TechnicalLabel } from '../components/ui/TechnicalLabel';
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
      <div className="min-h-screen bg-[#0F1013] flex items-center justify-center">
        <p className="font-mono text-[#D4FF00] animate-pulse tracking-widest">CARREGANDO_PROJETO...</p>
      </div>
    );
  }

  if (!projeto) return null;

  const versoes = projeto.versoes || [];
  const versaoAtual = versoes[0];

  return (
    <div className="min-h-screen bg-[#0F1013] text-white selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <AppHeader>
        <AppHeader.Brand />
        <AppHeader.Nav className="justify-between">
          <div className="flex items-center gap-4">
            <AppHeader.NavBack onClick={() => navigate(-1)}><ArrowLeft size={16} /> VOLTAR_DASHBOARD</AppHeader.NavBack>
            <AppHeader.NavDivider />
            <AppHeader.NavLabel>DETALHES_PROJETO // RF06</AppHeader.NavLabel>
          </div>
          {user?.tipo === 'desenvolvedor' && (
            <Link to={`/dev/project/${id}/versoes`} className="hidden sm:flex font-display font-bold uppercase tracking-widest px-4 py-2 bg-[#D4FF00] text-black hover:bg-[#e2ff4d] transition-all text-xs items-center gap-2">
              GERENCIAR_VERSÕES
            </Link>
          )}
        </AppHeader.Nav>
      </AppHeader>
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8">
        <section className="mb-8 bg-[#1C1D22] border-2 border-[#4A3AFF] p-8 relative overflow-hidden">
          <div className="absolute inset-0 animated-grid" style={{ backgroundImage: 'linear-gradient(#4A3AFF 1px, transparent 1px), linear-gradient(90deg, #4A3AFF 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#D4FF00] border-4 border-black flex items-center justify-center text-5xl">🎮</div>
              <div>
                <div className="font-mono text-[10px] text-zinc-500 uppercase mb-1">DESENVOLVEDOR</div>
                <div className="font-display font-bold text-white uppercase text-lg tracking-wide">{projeto.desenvolvedor.nomeEstudio}</div>
                <div className="font-mono text-xs text-zinc-600">{projeto.desenvolvedor.usuario?.nome}</div>
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">PROJETO_ID: {projeto.id.slice(0, 8).toUpperCase()}</div>
              <h1 className="font-display font-black text-6xl tracking-tighter uppercase text-[#D4FF00] mb-2">{projeto.nome}</h1>
              <div className="font-display font-bold text-xl text-[#4A3AFF] uppercase tracking-wide">{projeto.categoria}</div>
            </div>
            <div className="flex justify-end">
              <div className="bg-[#0F1013] border border-[#D4FF00] p-4">
                <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">STATUS</div>
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
              <section className="bg-[#0F1013] border-4 border-[#D4FF00] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-2" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #D4FF00, #D4FF00 20px, #000 20px, #000 40px)' }} />
                <div className="absolute bottom-0 left-0 w-full h-2" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #D4FF00, #D4FF00 20px, #000 20px, #000 40px)' }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2 flex items-center gap-2"><Download size={14} />PAINEL_DE_DOWNLOAD</div>
                      <h2 className="font-display font-black text-3xl text-white uppercase tracking-tight">Build Ativa</h2>
                    </div>
                    <TechnicalLabel className="text-orange-500 bg-orange-500/10 border-orange-500/30">RF05_BUILD</TechnicalLabel>
                  </div>
                  <div className="bg-[#1C1D22] border border-[#2C2D35] p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">BUILD_ATIVA</div>
                        <div className="font-display font-black text-4xl text-[#D4FF00] tracking-tighter">{versaoAtual.numeroVersao}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">STATUS</div>
                        <div className="font-mono text-lg text-white font-bold">{versaoAtual.status}</div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">DATA_PUBLICAÇÃO</div>
                        <div className="font-mono text-sm text-white flex items-center gap-2">
                          <Calendar size={16} className="text-[#4A3AFF]" />{new Date(versaoAtual.dataPublicacao).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                    <Link to={`/start-session`}
                      className="w-full font-display font-bold uppercase tracking-widest px-6 py-4 bg-[#D4FF00] text-black border-2 border-[#D4FF00] hover:bg-[#b8e000] shadow-[4px_4px_0_0_#4A3AFF] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all flex items-center justify-center gap-3 text-lg">
                      <Download size={24} strokeWidth={2.5} /> INICIAR_SESSÃO_DE_TESTE
                    </Link>
                  </div>
                  <div className="flex items-start gap-3 bg-[#1C1D22] border-l-2 border-[#D4FF00] p-4">
                    <AlertCircle size={18} className="text-[#D4FF00] shrink-0 mt-0.5" />
                    <p className="font-mono text-[10px] text-zinc-400 uppercase leading-relaxed">Baixe o software, teste e reporte qualquer anomalia encontrada durante sua sessão de testes.</p>
                  </div>
                </div>
              </section>
            )}
            <section className="bg-[#1C1D22] border border-[#2C2D35]">
              <div className="border-b border-[#2C2D35] p-4 bg-[#0F1013]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="text-[#4A3AFF]" size={20} />
                    <h2 className="font-display font-black text-white uppercase text-lg tracking-tight">Especificações e Escopo</h2>
                  </div>
                  <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">MODEL_PROJETO</TechnicalLabel>
                </div>
              </div>
              <div className="p-6">
                <div className="font-mono text-[10px] text-zinc-500 uppercase mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> DESCRIÇÃO_DETALHADA
                </div>
                <div className="bg-[#0F1013] border border-[#2C2D35] p-4 mb-4">
                  <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">{projeto.descricao}</pre>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#2C2D35]">
                  <div className="p-4 border-b md:border-b-0 md:border-r border-[#2C2D35] bg-[#0F1013]">
                    <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">VERSÕES</div>
                    <div className="font-display font-black text-2xl text-white">{versoes.length}</div>
                  </div>
                  <div className="p-4 border-b md:border-b-0 md:border-r border-[#2C2D35] bg-[#0F1013]">
                    <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">CONVITES</div>
                    <div className="font-display font-black text-2xl text-[#D4FF00]">{projeto._count?.convites || 0}</div>
                  </div>
                  <div className="p-4 bg-[#0F1013]">
                    <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">CRIADO_EM</div>
                    <div className="font-mono text-sm text-white">{new Date(projeto.dataCriacao).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-[#1C1D22] border border-[#2C2D35]">
              <div className="border-b border-[#2C2D35] p-4 bg-[#0F1013]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="text-[#4A3AFF]" size={20} />
                    <h2 className="font-display font-black text-white uppercase text-lg tracking-tight">Histórico de Versões</h2>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">{versoes.length} BUILDS</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {versoes.length === 0 && <p className="font-mono text-xs text-zinc-500 text-center py-8">[NENHUMA_VERSÃO_CADASTRADA]</p>}
                {versoes.map((v, i) => <VersionCard key={v.id} versao={v} isLatest={i === 0} activeLabel="BUILD_ATIVA" changelogLabel="NOTAS_DE_ATUALIZAÇÃO" />)}
              </div>
            </section>
          </div>
          <div className="space-y-6">
            <section className="bg-[#1C1D22] border border-[#2C2D35] sticky top-24">
              <div className="border-b border-[#2C2D35] p-4 bg-[#0F1013]">
                <div className="flex items-center gap-2">
                  <Shield className="text-[#D4FF00]" size={20} />
                  <h2 className="font-display font-black text-white uppercase text-sm tracking-tight">Atalhos Operacionais</h2>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {user?.tipo === 'testador' && (
                  <Link to="/start-session" className="w-full font-display font-bold uppercase tracking-widest px-6 py-4 border-2 bg-[#D4FF00] text-black border-[#D4FF00] hover:bg-[#b8e000] shadow-[4px_4px_0_0_#4A3AFF] active:shadow-none transition-all flex items-center justify-center gap-3 text-lg">
                    <Download size={24} strokeWidth={2.5} /> INICIAR_TESTE
                  </Link>
                )}
                <Link to="/report-bug" className="w-full font-display font-bold uppercase tracking-widest px-6 py-4 border-2 bg-[#4A3AFF] text-white border-[#4A3AFF] hover:bg-[#382bd6] shadow-[3px_3px_0_0_#D4FF00] active:shadow-none transition-all flex items-center justify-center gap-3 text-lg">
                  <Bug size={24} strokeWidth={2.5} /> REPORTAR_BUG
                </Link>
                {user?.tipo === 'desenvolvedor' && (
                  <Link to={`/dev/project/${id}/versoes`} className="w-full font-display font-bold uppercase tracking-widest px-6 py-4 border-2 bg-[#1C1D22] text-white border-[#2C2D35] hover:border-[#D4FF00] transition-all flex items-center justify-center gap-3">
                    GERENCIAR_VERSÕES
                  </Link>
                )}
                <div className="pt-3 border-t border-[#2C2D35]">
                  <Link to="/bug-tracker" className="w-full font-mono text-xs uppercase px-4 py-3 bg-[#0F1013] text-zinc-400 border border-[#2C2D35] hover:border-[#4A3AFF] hover:text-white transition-all flex items-center justify-center gap-2">
                    <ExternalLink size={14} /> Ver Bug Tracker
                  </Link>
                </div>
              </div>
            </section>
            <section className="bg-[#1C1D22] border border-[#2C2D35] p-4">
              <div className="font-mono text-[10px] text-zinc-500 uppercase mb-3">INFORMAÇÕES_ADICIONAIS</div>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#D4FF00] mt-1 shrink-0" />
                  <p className="text-zinc-400 leading-relaxed">Inicie uma sessão de teste antes de reportar bugs.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#4A3AFF] mt-1 shrink-0" />
                  <p className="text-zinc-400 leading-relaxed">Reporte todos os bugs encontrados com o máximo de detalhes possível.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
