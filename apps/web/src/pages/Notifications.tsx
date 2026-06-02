import React, { useState, useEffect, useCallback } from 'react';
import { Bell, BellOff, CheckCheck, AlertTriangle, Info, Bug, Mail, Filter } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { getNotificacoes, marcarNotificacaoLida, type Notificacao } from '../api/notificacoes';
import { cn } from '../lib/utils';
import { StatsGrid } from '../components/ui/StatsGrid';
import { AppHeader } from '../components/ui/AppHeader';

type NotifTipo = string;
type NotifStatus = 'pendente' | 'lida';

const TIPO_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string; bg: string }> = {
  bug_critico: { icon: Bug, color: 'text-red-400', label: 'BUG_CRÍTICO', bg: 'bg-red-500/10 border-red-500/30' },
  convite: { icon: Mail, color: 'text-[#4A3AFF]', label: 'CONVITE', bg: 'bg-[#4A3AFF]/10 border-[#4A3AFF]/30' },
  feedback: { icon: Info, color: 'text-[#D4FF00]', label: 'FEEDBACK', bg: 'bg-[#D4FF00]/10 border-[#D4FF00]/30' },
  sistema: { icon: AlertTriangle, color: 'text-it-muted', label: 'SISTEMA', bg: 'bg-zinc-500/10 border-zinc-500/30' },
  atualizacao: { icon: CheckCheck, color: 'text-[#10b981]', label: 'ATUALIZAÇÃO', bg: 'bg-[#10b981]/10 border-[#10b981]/30' },
};

function getTipoConfig(tipo: string) {
  return TIPO_CONFIG[tipo] ?? { icon: Bell, color: 'text-it-muted', label: tipo.toUpperCase(), bg: 'bg-zinc-500/10 border-zinc-500/30' };
}

function NotifCard({ notif, onMarcarLida }: { notif: Notificacao; onMarcarLida: (id: string) => void }) {
  const { icon: Icon, color, label, bg } = getTipoConfig(notif.tipo);
  const isNova = notif.status === 'pendente';

  return (
    <div className={cn(
      "relative border p-4 transition-all",
      isNova ? "border-it-border bg-it-surface border-l-4 border-l-[#D4FF00]" : "border-it-border bg-it-surface opacity-60"
    )}>
      {isNova && (
        <div className="absolute top-3 right-3 w-2 h-2 bg-[#D4FF00] rounded-full animate-pulse" />
      )}
      <div className="flex items-start gap-4">
        <div className={cn("flex-shrink-0 flex items-center justify-center w-10 h-10 border", bg)}>
          <Icon size={18} className={color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("font-mono text-[10px] font-bold px-1 border", bg, color)}>{label}</span>
            <span className="font-mono text-[10px] text-it-muted">
              {new Date(notif.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="font-mono text-xs text-it-subtle leading-relaxed">{notif.mensagem}</p>
        </div>
        {isNova && (
          <button type="button" onClick={() => onMarcarLida(notif.id)}
            className="flex-shrink-0 font-mono text-[10px] text-it-muted hover:text-[#D4FF00] border border-it-border hover:border-[#D4FF00] px-2 py-1 transition-colors">
            MARCAR_LIDA
          </button>
        )}
      </div>
    </div>
  );
}

export function Notifications() {
  const { user } = useAuth();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<NotifStatus | ''>('');

  const carregar = useCallback(() => {
    setCarregando(true);
    getNotificacoes({ limit: 50 })
      .then(({ notificacoes: n }) => setNotificacoes(n))
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function marcarLida(id: string) {
    try {
      await marcarNotificacaoLida(id);
      setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, status: 'lida' } : n));
    } catch (e) {
      console.error(e);
    }
  }

  async function marcarTodasLidas() {
    const pendentes = notificacoes.filter(n => n.status === 'pendente');
    await Promise.allSettled(pendentes.map(n => marcarNotificacaoLida(n.id)));
    setNotificacoes(prev => prev.map(n => ({ ...n, status: 'lida' as const })));
  }

  const filtradas = notificacoes.filter(n => !filtroStatus || n.status === filtroStatus);
  const pendentes = notificacoes.filter(n => n.status === 'pendente').length;

  return (
    <div className="min-h-screen bg-it-page text-it-text selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <AppHeader>
        <AppHeader.Brand />
        <AppHeader.Nav className="justify-between">
          <AppHeader.NavLabel>NOTIFICAÇÕES</AppHeader.NavLabel>
          <div className="flex items-stretch shrink-0">
            {pendentes > 0 && (
              <button type="button" onClick={marcarTodasLidas}
                className="font-mono text-[10px] text-it-muted hover:text-it-text border border-it-border hover:border-[#D4FF00] px-3 py-1.5 transition-colors flex items-center gap-2 self-center mx-2">
                <CheckCheck size={12} /> MARCAR_TODAS_COMO_LIDAS
              </button>
            )}
            <AppHeader.Utilities />
          </div>
        </AppHeader.Nav>
      </AppHeader>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter">
            Central de <span className="text-[#4A3AFF]">Notificações</span>
          </h1>
          <p className="font-mono text-xs text-it-muted mt-2 uppercase">SISTEMA DE ALERTAS E COMUNICAÇÕES DO INDIETEST.</p>
        </div>

        <StatsGrid cols={3}>
          <StatsGrid.Item label="NÃO LIDAS" value={pendentes} color="text-[#D4FF00]" />
          <StatsGrid.Item label="TOTAL" value={notificacoes.length} />
          <StatsGrid.Item label="LIDAS" value={notificacoes.filter(n => n.status === 'lida').length} color="text-it-muted" />
        </StatsGrid>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2 font-mono text-xs text-it-muted">
            <Filter size={14} /> FILTROS:
          </div>
          <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value as NotifStatus | '')}
            className="bg-it-surface border border-it-border text-it-text py-2 px-4 font-mono text-xs outline-none focus:border-[#D4FF00] appearance-none cursor-pointer">
            <option value="">TODOS OS STATUS</option>
            <option value="pendente" className="bg-it-surface">NÃO LIDAS</option>
            <option value="lida" className="bg-it-surface">LIDAS</option>
          </select>
          <span className="font-mono text-[10px] text-[#D4FF00] bg-[#D4FF00]/10 px-1 border border-[#D4FF00]/20">{filtradas.length} REGISTROS</span>
        </div>

        {carregando ? (
          <div className="flex items-center justify-center py-24">
            <p className="font-mono text-[#D4FF00] animate-pulse tracking-widest">CARREGANDO_NOTIFICAÇÕES...</p>
          </div>
        ) : filtradas.length === 0 ? (
          <div className="border border-it-border bg-it-surface p-16 text-center">
            <BellOff size={48} className="text-zinc-700 mx-auto mb-4" />
            <p className="font-mono text-sm text-it-muted uppercase">[NENHUMA_NOTIFICAÇÃO_ENCONTRADA]</p>
            <p className="font-mono text-xs text-it-muted mt-2 max-w-md mx-auto">
              {filtroStatus
                ? 'Nenhuma notificação corresponde ao filtro selecionado.'
                : 'Você não possui notificações no momento.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtradas.filter(n => n.status === 'pendente').length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 border-b border-it-border pb-2 mb-3">
                  <Bell size={16} className="text-[#D4FF00]" />
                  <h2 className="font-display font-black text-sm text-it-text uppercase tracking-widest">NÃO LIDAS</h2>
                  <span className="font-mono text-[10px] text-[#D4FF00] bg-[#D4FF00]/10 px-1 border border-[#D4FF00]/20">{filtradas.filter(n => n.status === 'pendente').length}</span>
                </div>
                <div className="space-y-2">
                  {filtradas.filter(n => n.status === 'pendente').map(n => (
                    <NotifCard key={n.id} notif={n} onMarcarLida={marcarLida} />
                  ))}
                </div>
              </div>
            )}
            {filtradas.filter(n => n.status === 'lida').length > 0 && (
              <div>
                <div className="flex items-center gap-2 border-b border-it-border pb-2 mb-3">
                  <CheckCheck size={16} className="text-it-muted" />
                  <h2 className="font-display font-black text-sm text-it-muted uppercase tracking-widest">HISTÓRICO</h2>
                </div>
                <div className="space-y-2">
                  {filtradas.filter(n => n.status === 'lida').map(n => (
                    <NotifCard key={n.id} notif={n} onMarcarLida={marcarLida} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-it-surface border border-it-border p-6">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-[#4A3AFF] shrink-0 mt-0.5" />
            <div>
              <span className="font-display font-bold text-sm text-it-text tracking-wide uppercase">Sobre Notificações</span>
              <p className="font-mono text-[10px] text-it-muted mt-1 uppercase leading-relaxed">
                Notificações são geradas pelo sistema com base nas atividades dos seus projetos e sessões de teste.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
