import React, { useState, useEffect, useCallback } from 'react';
import { Crosshair, ArrowLeft, Mail, CheckCircle2, XCircle, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getConvites, responderConvite, type Convite } from '../api/convites';
import { ApiError } from '../api/client';
import { cn } from '../lib/utils';

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
    <div className="min-h-screen bg-[#0F1013] text-white selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <header className="flex flex-col md:flex-row items-stretch border-b border-[#2C2D35] bg-[#0F1013] sticky top-0 z-40">
        <div className="flex items-center gap-3 p-4 md:px-6 md:w-64 border-b md:border-b-0 md:border-r border-[#2C2D35]">
          <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={24} />
          <h1 className="text-2xl font-black tracking-tighter uppercase text-white font-display">IndieTest</h1>
        </div>
        <div className="flex-1 flex overflow-x-auto no-scrollbar items-center px-4 md:px-6">
          <Link to="/dashboard" className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-[#2C2D35] p-2 bg-[#1C1D22]">
            <ArrowLeft size={16} /> VOLTAR_AO_TERMINAL
          </Link>
          <div className="mx-4 h-4 w-px bg-[#2C2D35]" />
          <span className="font-mono text-xs text-[#D4FF00] font-bold tracking-widest">CONVITES // RF_INVITE</span>
        </div>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter">
            Central de <span className="text-[#4A3AFF]">Convites</span>
          </h1>
          <p className="font-mono text-xs text-zinc-500 mt-2">GERENCIAMENTO DE AUTORIZAÇÕES DE ACESSO A PROJETOS.</p>
        </div>

        {erro && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 font-mono text-xs text-red-400">{erro}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#2C2D35] mb-8">
          {[
            { label: 'PENDENTES', value: pendentes.length, color: 'text-[#D4FF00]' },
            { label: 'ACEITOS', value: convites.filter(c => c.statusConvite === 'aceito').length, color: 'text-[#10b981]' },
            { label: 'RECUSADOS', value: convites.filter(c => c.statusConvite === 'recusado').length, color: 'text-red-500' },
          ].map((s, i) => (
            <div key={i} className="p-6 bg-[#1C1D22] border-b md:border-b-0 md:border-r border-[#2C2D35] last:border-0">
              <div className="font-mono text-xs text-zinc-500 mb-3">{s.label}</div>
              <div className={cn("font-display font-black text-5xl tracking-tighter", s.color)}>{s.value}</div>
            </div>
          ))}
        </div>

        {carregando ? (
          <div className="flex items-center justify-center py-24">
            <p className="font-mono text-[#D4FF00] animate-pulse tracking-widest">CARREGANDO_CONVITES...</p>
          </div>
        ) : convites.length === 0 ? (
          <div className="border border-[#2C2D35] bg-[#1C1D22] p-16 text-center">
            <Mail size={48} className="text-zinc-700 mx-auto mb-4" />
            <p className="font-mono text-sm text-zinc-500 uppercase">[NENHUM_CONVITE_ENCONTRADO]</p>
            <p className="font-mono text-xs text-zinc-600 mt-2 max-w-md mx-auto">
              Você ainda não recebeu convites. Quando um desenvolvedor convidar seu email ({user?.email}) para testar um projeto, ele aparecerá aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendentes.length > 0 && (
              <section>
                <div className="flex items-center justify-between border-b border-[#2C2D35] pb-2 mb-4">
                  <h2 className="text-xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <Clock className="text-[#D4FF00]" size={20} /> CONVITES_PENDENTES
                  </h2>
                  <span className="font-mono text-[10px] text-[#D4FF00] bg-[#D4FF00]/10 px-1 border border-[#D4FF00]/20">{pendentes.length} AGUARDANDO</span>
                </div>
                <div className="space-y-3">
                  {pendentes.map(c => (
                    <div key={c.id} className="bg-[#1C1D22] border-2 border-[#D4FF00] p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="font-mono text-[10px] text-zinc-500 mb-1">
                            {c.projeto.desenvolvedor.nomeEstudio} • {new Date(c.dataEnvio).toLocaleDateString('pt-BR')}
                          </div>
                          <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">{c.projeto.nome}</h3>
                          <p className="font-mono text-xs text-zinc-400 mt-1">Categoria: {c.projeto.categoria}</p>
                        </div>
                        <div className="flex gap-3">
                          <button type="button" onClick={() => handleResponder(c.id, 'recusar')} disabled={respondendo === c.id}
                            className="font-display font-bold uppercase tracking-widest px-5 py-3 bg-[#1C1D22] text-red-500 border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2 disabled:opacity-50">
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
                <div className="flex items-center justify-between border-b border-[#2C2D35] pb-2 mb-4">
                  <h2 className="text-xl font-display font-black text-zinc-500 uppercase tracking-tight">HISTÓRICO</h2>
                </div>
                <div className="space-y-2">
                  {processados.map(c => (
                    <div key={c.id} className="bg-[#1C1D22] border border-[#2C2D35] p-4 flex items-center justify-between opacity-60">
                      <div>
                        <div className="font-mono text-[10px] text-zinc-600 mb-1">
                          {c.projeto.desenvolvedor.nomeEstudio} • {new Date(c.dataEnvio).toLocaleDateString('pt-BR')}
                        </div>
                        <h3 className="font-display font-bold text-lg text-zinc-400 uppercase">{c.projeto.nome}</h3>
                      </div>
                      <StatusBadge status={c.statusConvite} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <div className="mt-8 bg-[#1C1D22] border border-[#2C2D35] p-6">
          <div className="flex items-start gap-3">
            <Shield size={18} className="text-[#4A3AFF] shrink-0 mt-0.5" />
            <div>
              <span className="font-display font-bold text-sm text-white tracking-wide uppercase">Sobre Convites</span>
              <p className="font-mono text-[10px] text-zinc-400 mt-1 uppercase leading-relaxed">
                Os convites são enviados por desenvolvedores para o seu endereço de email ({user?.email}). Ao aceitar, você poderá iniciar sessões de teste no projeto.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
