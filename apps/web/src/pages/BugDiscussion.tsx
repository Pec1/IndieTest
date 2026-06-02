import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, FileWarning, MessageSquare, Send, Shield, Calendar, Terminal, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { getBug, atualizarStatusBug, criarRespostaBug, type Bug } from '../api/bugs';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../api/client';
import { cn } from '../lib/utils';
import { AppHeader } from '../components/ui/AppHeader';
import { SeverityBadge } from '../components/shared/SeverityBadge';

function UserBadge({ tipo }: { tipo: string }) {
  const colors: Record<string, string> = {
    testador: 'text-[#4A3AFF] border-[#4A3AFF] bg-[#4A3AFF]/10',
    desenvolvedor: 'text-[#D4FF00] border-[#D4FF00] bg-[#D4FF00]/10',
    administrador: 'text-red-500 border-red-500 bg-red-500/10',
  };
  return (
    <span className={cn("font-mono text-[10px] font-bold uppercase px-2 py-0.5 border", colors[tipo] || 'text-it-muted border-zinc-500 bg-zinc-500/10')}>
      [{tipo.toUpperCase()}]
    </span>
  );
}

const STATUS_OPTIONS = [
  { id: 'aberto', label: 'ABERTO', color: '#D4FF00' },
  { id: 'em_analise', label: 'EM_ANÁLISE', color: '#4A3AFF' },
  { id: 'corrigido', label: 'CORRIGIDO', color: '#10b981' },
  { id: 'fechado', label: 'FECHADO', color: '#6b7280' },
];

export function BugDiscussion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bug, setBug] = useState<Bug | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const podeAlterarStatus = user?.tipo === 'desenvolvedor' || user?.tipo === 'administrador';
  const ehDesenvolvedor = user?.tipo === 'desenvolvedor';

  useEffect(() => {
    if (!id) return;
    getBug(id)
      .then(({ bug: b }) => { setBug(b); setCurrentStatus(b.status); })
      .catch(() => navigate('/bug-tracker'))
      .finally(() => setCarregando(false));
  }, [id]);

  async function handleStatusChange(novoStatus: string) {
    if (!id) return;
    try {
      await atualizarStatusBug(id, novoStatus);
      setCurrentStatus(novoStatus);
      setShowStatusDropdown(false);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao alterar status');
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !id) return;
    setEnviando(true);
    setErro('');
    try {
      const { resposta } = await criarRespostaBug(id, { mensagem: newMessage });
      setBug(prev => prev ? { ...prev, respostas: [...(prev.respostas || []), resposta] } : prev);
      setNewMessage('');
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao enviar mensagem');
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-it-page flex items-center justify-center">
        <p className="font-mono text-[#D4FF00] animate-pulse tracking-widest">CARREGANDO_BUG...</p>
      </div>
    );
  }

  if (!bug) return null;
  const currentStatusData = STATUS_OPTIONS.find(s => s.id === currentStatus);

  return (
    <div className="min-h-screen bg-it-page text-it-text selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <AppHeader>
        <AppHeader.Brand />
        <AppHeader.Nav className="justify-between gap-4">
          <div className="flex items-center min-w-0">
            <AppHeader.NavBack to="/bug-tracker"><ArrowLeft size={16} /> VOLTAR_TRACKER</AppHeader.NavBack>
            <AppHeader.NavDivider />
            <AppHeader.NavLabel>BUG_DISCUSSION</AppHeader.NavLabel>
          </div>
          <AppHeader.Utilities />
        </AppHeader.Nav>
      </AppHeader>
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-it-surface border border-it-border p-6">
              <div className="grid grid-cols-3 gap-4 mb-6 border-b border-it-border pb-6">
                <div>
                  <div className="font-mono text-[10px] text-it-muted uppercase mb-2">BUG_ID</div>
                  <div className="font-mono text-sm text-it-text font-bold">{bug.id.slice(0, 8).toUpperCase()}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-it-muted uppercase mb-2">TIMESTAMP</div>
                  <div className="font-mono text-sm text-it-text">{new Date(bug.dataCriacao).toLocaleString('pt-BR')}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-it-muted uppercase mb-2">PROJETO</div>
                  <div className="font-mono text-sm text-[#D4FF00] font-bold">{bug.testeSessao?.versao?.projeto?.nome || '—'}</div>
                </div>
              </div>
              <h2 className="font-display font-black text-3xl text-it-text uppercase tracking-tight mb-4">{bug.titulo}</h2>
              <SeverityBadge severity={bug.severidade} size="lg" />
            </div>
            <div className="bg-it-surface border border-it-border">
              <div className="border-b border-it-border p-4 bg-it-page flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileWarning className="text-[#4A3AFF]" size={20} />
                  <h3 className="font-display font-black text-it-text uppercase tracking-tight">Metadados e Diagnóstico</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="font-mono text-[10px] text-it-muted uppercase mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> DESCRIÇÃO_COMPLETA
                </div>
                <div className="bg-it-page border border-it-border p-4">
                  <pre className="font-mono text-xs text-it-subtle leading-relaxed whitespace-pre-wrap">{bug.descricao}</pre>
                </div>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-it-page border border-it-border p-3">
                    <div className="font-mono text-[10px] text-it-muted mb-1">TIPO</div>
                    <div className="font-mono text-xs text-it-text font-bold">{bug.tipo}</div>
                  </div>
                  <div className="bg-it-page border border-it-border p-3">
                    <div className="font-mono text-[10px] text-it-muted mb-1">VERSÃO</div>
                    <div className="font-mono text-xs text-[#D4FF00] font-bold">{bug.testeSessao?.versao?.numeroVersao || '—'}</div>
                  </div>
                  <div className="bg-it-page border border-it-border p-3">
                    <div className="font-mono text-[10px] text-it-muted mb-1">DISPOSITIVO</div>
                    <div className="font-mono text-xs text-it-text font-bold truncate">{bug.testeSessao?.dispositivo || '—'}</div>
                  </div>
                  <div className="bg-it-page border border-it-border p-3">
                    <div className="font-mono text-[10px] text-it-muted mb-1">S.O.</div>
                    <div className="font-mono text-xs text-it-text font-bold truncate">{bug.testeSessao?.sistemaOperacional || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
            {bug.anexos && bug.anexos.length > 0 && (
              <div className="bg-it-surface border border-it-border">
                <div className="border-b border-it-border p-4 bg-it-page flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="text-[#4A3AFF]" size={20} />
                    <h3 className="font-display font-black text-it-text uppercase tracking-tight">Repositório de Evidências</h3>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-2 gap-3">
                  {bug.anexos.map(a => (
                    <div key={a.id} className="bg-it-page border border-it-border p-4 flex items-center gap-3 hover:border-[#4A3AFF] transition-colors">
                      <ImageIcon size={20} className="text-it-muted shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <div className="font-mono text-xs text-it-text truncate">{a.nomeArquivo}</div>
                        <div className="font-mono text-[10px] text-it-muted">{(a.tamanho / 1024).toFixed(1)} KB</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-it-surface border border-it-border">
              <div className="border-b border-it-border p-4 bg-it-page flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="text-[#4A3AFF]" size={20} />
                  <h3 className="font-display font-black text-it-text uppercase tracking-tight">Mural de Discussão Técnica</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {(!bug.respostas || bug.respostas.length === 0) && (
                  <div className="text-center py-8 font-mono text-xs text-it-muted">[NENHUMA_RESPOSTA_AINDA]</div>
                )}
                {bug.respostas?.map(r => (
                  <div key={r.id} className="bg-it-page border border-it-border p-4 hover:border-[#4A3AFF]/50 transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-3 pb-3 border-b border-it-border">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-it-text uppercase text-sm">{r.desenvolvedor?.usuario?.nome || 'DESENVOLVEDOR'}</span>
                        <UserBadge tipo="desenvolvedor" />
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-it-muted">
                        <Calendar size={12} /> {new Date(r.dataResposta).toLocaleString('pt-BR')}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-[#4A3AFF] to-transparent opacity-50" />
                      <pre className="font-mono text-xs text-it-subtle leading-relaxed whitespace-pre-wrap pl-2">{r.mensagem}</pre>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                {erro && <div className="bg-red-500/10 border border-red-500/30 p-3 font-mono text-xs text-red-400">{erro}</div>}
                {ehDesenvolvedor && (
                  <form onSubmit={handleSendMessage} className="mt-4">
                    <div className="border border-it-border bg-it-page focus-within:border-[#4A3AFF] transition-colors">
                      <div className="flex items-center border-b border-it-border p-2 gap-2">
                        <Terminal size={14} className="text-[#4A3AFF]" />
                        <span className="font-mono text-[10px] text-it-muted uppercase">INSERIR_RESPOSTA_TÉCNICA</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-mono text-[#4A3AFF] px-3 pt-3 text-sm select-none">&gt;</span>
                        <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Escreva sua análise técnica aqui..." rows={4}
                          className="flex-1 bg-transparent text-it-text py-3 px-2 font-mono text-sm outline-none placeholder:text-it-muted resize-none" />
                      </div>
                      <div className="border-t border-it-border p-3 flex justify-end">
                        <button type="submit" disabled={enviando || !newMessage.trim()}
                          className="font-display font-bold uppercase tracking-widest px-6 py-2 bg-[#4A3AFF] text-on-brand hover:bg-[#382bd6] transition-colors flex items-center gap-2 disabled:opacity-50">
                          <Send size={16} /> {enviando ? 'ENVIANDO...' : 'TRANSMITIR'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-it-surface border border-it-border sticky top-24">
              <div className="border-b border-it-border p-4 bg-it-page">
                <div className="flex items-center gap-2">
                  <Shield className="text-[#D4FF00]" size={20} />
                  <h3 className="font-display font-black text-it-text uppercase text-sm tracking-tight">Controle de Status</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-it-page border border-it-border p-3">
                  <div className="font-mono text-[10px] text-it-muted uppercase mb-2">STATUS_ATUAL</div>
                  <div className="font-display font-black text-xl uppercase tracking-tight"
                    style={{ color: currentStatusData?.color || '#fff' }}>
                    {currentStatusData?.label || currentStatus}
                  </div>
                </div>
                {podeAlterarStatus ? (
                  <div>
                    <div className="relative">
                      <button type="button" onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        className="w-full font-display font-bold uppercase tracking-widest px-4 py-3 bg-[#D4FF00] text-black hover:bg-[#e2ff4d] transition-colors flex items-center justify-between">
                        ALTERAR_STATUS <ChevronDown size={16} className={cn("transition-transform", showStatusDropdown && "rotate-180")} />
                      </button>
                      {showStatusDropdown && (
                        <div className="absolute top-full left-0 right-0 bg-it-surface border border-it-border z-10">
                          {STATUS_OPTIONS.filter(s => s.id !== currentStatus).map(st => (
                            <button key={st.id} onClick={() => handleStatusChange(st.id)}
                              className="w-full px-4 py-3 font-mono text-xs font-bold uppercase text-left hover:bg-it-elevated transition-colors flex items-center gap-2"
                              style={{ color: st.color }}>
                              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: st.color }} />
                              {st.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="font-mono text-[10px] text-it-muted mt-2 uppercase">Apenas desenvolvedor ou administrador pode alterar</p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 bg-it-page border border-it-border p-3">
                    <Shield size={14} className="text-it-muted shrink-0 mt-0.5" />
                    <p className="font-mono text-[10px] text-it-muted uppercase">Apenas desenvolvedores e administradores podem alterar o status</p>
                  </div>
                )}
                <div className="border-t border-it-border pt-3 space-y-2">
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-it-muted">RESPOSTAS</span>
                    <span className="text-it-text">{bug.respostas?.length || 0}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-it-muted">ANEXOS</span>
                    <span className="text-it-text">{bug.anexos?.length || 0}</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px]">
                    <span className="text-it-muted">REPORTADO_EM</span>
                    <span className="text-it-text">{new Date(bug.dataCriacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
