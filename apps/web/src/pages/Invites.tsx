import React, { useState, useEffect, useCallback } from 'react';
import { Mail, CheckCircle2, XCircle, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getConvites, responderConvite, type Convite } from '../api/convites';
import { ApiError } from '../api/client';
import { cn } from '../lib/utils';
import { StatsGrid } from '../components/ui/StatsGrid';
import { AppHeader } from '../components/ui/AppHeader';

function StatusBadge({ status }: { status: Convite['statusConvite'] }) {
  const configs = {
    pendente: { icon: Clock, color: 'text-[#D4FF00] border-[#D4FF00] bg-[#D4FF00]/10', label: 'PENDENTE' },
    aceito: { icon: CheckCircle2, color: 'text-[#10b981] border-[#10b981] bg-[#10b981]/10', label: 'ACEITO' },
    recusado: { icon: XCircle, color: 'text-red-500 border-red-500 bg-red-500/10', label: 'RECUSADO' },
  };
  const { icon: Icon, color, label } = configs[status];
  return (
    <span className={cn("font-mono text-[10px] font-bold uppercase px-2 py-1 border flex items-center gap-1", color)}>
      <Icon size={10} /> {label}
    </span>
  );
}

export function Invites() {
  const { user } = useAuth();
  const [convites, setConvites] = useState<Convite[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [respondendo, setRespondendo] = useState<string | null>(null);
  const [erro, setErro] = useState('');

  const carregar = useCallback(() => {
    setCarregando(true);
    getConvites()
      .then(({ convites: c }) => setConvites(c))
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function handleResponder(id: string, acao: 'aceitar' | 'recusar') {
    setRespondendo(id);
    setErro('');
    try {
      const { convite: atualizado } = await responderConvite(id, acao);
      setConvites(prev => prev.map(c => c.id === id ? { ...c, statusConvite: atualizado.statusConvite } : c));
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao responder convite');
    } finally {
      setRespondendo(null);
    }
  }

  const pendentes = convites.filter(c => c.statusConvite === 'pendente');
  const processados = convites.filter(c => c.statusConvite !== 'pendente');

  return (
    <div className="min-h-screen bg-it-page text-it-text selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <AppHeader>
        <AppHeader.Brand />
        <AppHeader.Nav className="justify-between gap-4">
          <AppHeader.NavLabel>CONVITES</AppHeader.NavLabel>
          <AppHeader.Utilities />
        </AppHeader.Nav>
      </AppHeader>
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter">
            Central de <span className="text-[#4A3AFF]">Convites</span>
          </h1>
          <p className="font-mono text-xs text-it-muted mt-2">GERENCIAMENTO DE AUTORIZAÇÕES DE ACESSO A PROJETOS.</p>
        </div>

        {erro && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 font-mono text-xs text-red-400">{erro}</div>
        )}

        <StatsGrid cols={3}>
          <StatsGrid.Item label="PENDENTES" value={pendentes.length} color="text-[#D4FF00]" />
          <StatsGrid.Item label="ACEITOS" value={convites.filter(c => c.statusConvite === 'aceito').length} color="text-[#10b981]" />
          <StatsGrid.Item label="RECUSADOS" value={convites.filter(c => c.statusConvite === 'recusado').length} color="text-red-500" />
        </StatsGrid>

        {carregando ? (
          <div className="flex items-center justify-center py-24">
            <p className="font-mono text-[#D4FF00] animate-pulse tracking-widest">CARREGANDO_CONVITES...</p>
          </div>
        ) : convites.length === 0 ? (
          <div className="border border-it-border bg-it-surface p-16 text-center">
            <Mail size={48} className="text-zinc-700 mx-auto mb-4" />
            <p className="font-mono text-sm text-it-muted uppercase">[NENHUM_CONVITE_ENCONTRADO]</p>
            <p className="font-mono text-xs text-it-muted mt-2 max-w-md mx-auto">
              Você ainda não recebeu convites. Quando um desenvolvedor convidar seu email ({user?.email}) para testar um projeto, ele aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendentes.length > 0 && (
              <section>
                <div className="flex items-center justify-between border-b border-it-border pb-2 mb-4">
                  <h2 className="text-xl font-display font-black text-it-text uppercase tracking-tight flex items-center gap-2">
                    <Clock className="text-[#D4FF00]" size={20} /> CONVITES_PENDENTES
                  </h2>
                  <span className="font-mono text-[10px] text-[#D4FF00] bg-[#D4FF00]/10 px-1 border border-[#D4FF00]/20">{pendentes.length} AGUARDANDO</span>
                </div>
                <div className="space-y-3">
                  {pendentes.map(c => (
                    <div key={c.id} className="bg-it-surface border-2 border-[#D4FF00] p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="font-mono text-[10px] text-it-muted mb-1">
                            {c.projeto.desenvolvedor.nomeEstudio} • {new Date(c.dataEnvio).toLocaleDateString('pt-BR')}
                          </div>
                          <h3 className="font-display font-black text-2xl text-it-text uppercase tracking-tight">{c.projeto.nome}</h3>
                          <p className="font-mono text-xs text-it-muted mt-1">Categoria: {c.projeto.categoria}</p>
                        </div>
                        <div className="flex gap-3">
                          <button type="button" onClick={() => handleResponder(c.id, 'recusar')} disabled={respondendo === c.id}
                            className="font-display font-bold uppercase tracking-widest px-5 py-3 bg-it-surface text-red-500 border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2 disabled:opacity-50">
                            <XCircle size={16} /> RECUSAR
                          </button>
                          <button type="button" onClick={() => handleResponder(c.id, 'aceitar')} disabled={respondendo === c.id}
                            className="font-display font-bold uppercase tracking-widest px-5 py-3 bg-[#D4FF00] text-black border-2 border-[#D4FF00] hover:bg-[#e2ff4d] shadow-[3px_3px_0_0_#4A3AFF] active:shadow-none transition-all flex items-center gap-2 disabled:opacity-50">
                            <CheckCircle2 size={16} /> {respondendo === c.id ? '...' : 'ACEITAR'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {processados.length > 0 && (
              <section>
                <div className="flex items-center justify-between border-b border-it-border pb-2 mb-4">
                  <h2 className="text-xl font-display font-black text-it-muted uppercase tracking-tight">HISTÓRICO</h2>
                </div>
                <div className="space-y-2">
                  {processados.map(c => (
                    <div key={c.id} className="bg-it-surface border border-it-border p-4 flex items-center justify-between opacity-60">
                      <div>
                        <div className="font-mono text-[10px] text-it-muted mb-1">
                          {c.projeto.desenvolvedor.nomeEstudio} • {new Date(c.dataEnvio).toLocaleDateString('pt-BR')}
                        </div>
                        <h3 className="font-display font-bold text-lg text-it-muted uppercase">{c.projeto.nome}</h3>
                      </div>
                      <StatusBadge status={c.statusConvite} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <div className="mt-8 bg-it-surface border border-it-border p-6">
          <div className="flex items-start gap-3">
            <Shield size={18} className="text-[#4A3AFF] shrink-0 mt-0.5" />
            <div>
              <span className="font-display font-bold text-sm text-it-text tracking-wide uppercase">Sobre Convites</span>
              <p className="font-mono text-[10px] text-it-muted mt-1 uppercase leading-relaxed">
                Os convites são enviados por desenvolvedores para o seu endereço de email ({user?.email}). Ao aceitar, você poderá iniciar sessões de teste no projeto.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
