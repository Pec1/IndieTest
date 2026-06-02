import React, { useEffect, useState } from 'react';
import { Crosshair, ArrowLeft, Search, Bug, AlertTriangle, X, Image as ImageIcon, MessageSquare, Shield, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { getBugs, atualizarStatusBug, type Bug as BugType, type Paginacao } from '../api/bugs';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { AppHeader } from '../components/ui/AppHeader';
import { SeverityBadge } from '../components/shared/SeverityBadge';
import { BugStatusBadge } from '../components/shared/BugStatusBadge';

const SEVERIDADES = [
  { id: '', name: 'TODAS' },
  { id: 'Critica', name: 'CRÍTICA', color: 'red' },
  { id: 'Alta', name: 'ALTA', color: 'orange' },
  { id: 'Media', name: 'MÉDIA', color: 'yellow' },
  { id: 'Baixa', name: 'BAIXA', color: 'gray' },
];

const STATUSES = [
  { id: '', name: 'TODOS' },
  { id: 'aberto', name: 'ABERTO', color: '#D4FF00' },
  { id: 'em_analise', name: 'EM_ANÁLISE', color: '#4A3AFF' },
  { id: 'corrigido', name: 'CORRIGIDO', color: '#10b981' },
  { id: 'fechado', name: 'FECHADO', color: '#6b7280' },
];

function BugDetailPanel({ bug, onClose, podeAlterarStatus }: { bug: BugType; onClose: () => void; podeAlterarStatus: boolean }) {
  const [selectedStatus, setSelectedStatus] = useState(bug.status);
  const [salvando, setSalvando] = useState(false);

  async function handleStatusChange(novoStatus: string) {
    setSalvando(true);
    try {
      await atualizarStatusBug(bug.id, novoStatus);
      setSelectedStatus(novoStatus);
    } catch (e) {
      console.error(e);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/80" onClick={onClose} />
      <div className="w-full max-w-2xl bg-it-surface border-l-2 border-[#D4FF00] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-it-page border-b border-it-border p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-xs text-it-muted">{bug.id.slice(0, 8)}</span>
                <SeverityBadge severity={bug.severidade} />
                <BugStatusBadge status={selectedStatus} />
              </div>
              <h2 className="font-display font-black text-2xl text-it-text uppercase tracking-tight">{bug.titulo}</h2>
              <div className="flex items-center gap-4 mt-2 text-xs font-mono text-it-muted">
                <span>{bug.testeSessao?.versao?.projeto?.nome || 'PROJETO'}</span>
                <span>{bug.testeSessao?.versao?.numeroVersao}</span>
                <span>{new Date(bug.dataCriacao).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-it-muted hover:text-it-text border border-transparent hover:border-it-border p-2 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <div className="font-mono text-[10px] text-it-muted uppercase mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> DESCRIÇÃO
            </div>
            <div className="bg-it-page border border-it-border p-4">
              <pre className="font-mono text-xs text-it-subtle leading-relaxed whitespace-pre-wrap">{bug.descricao}</pre>
            </div>
          </div>
          {bug.anexos && bug.anexos.length > 0 && (
            <div>
              <div className="font-mono text-[10px] text-it-muted uppercase mb-3 flex items-center gap-2">
                <ImageIcon size={14} /> EVIDÊNCIAS
              </div>
              <div className="grid grid-cols-2 gap-2">
                {bug.anexos.map(a => (
                  <div key={a.id} className="bg-it-page border border-it-border p-3 flex items-center gap-2">
                    <ImageIcon size={14} className="text-it-muted" />
                    <span className="font-mono text-xs text-it-subtle truncate">{a.nomeArquivo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {bug.respostas && bug.respostas.length > 0 && (
            <div>
              <div className="font-mono text-[10px] text-it-muted uppercase mb-3 flex items-center gap-2">
                <MessageSquare size={14} /> DISCUSSÃO
              </div>
              <div className="space-y-3">
                {bug.respostas.map(r => (
                  <div key={r.id} className="bg-it-page border border-it-border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-display font-bold text-it-text uppercase text-sm">{r.desenvolvedor?.usuario?.nome || 'DESENVOLVEDOR'}</span>
                      <span className="font-mono text-[10px] text-[#D4FF00] border border-[#D4FF00]/30 px-1">[DEV]</span>
                    </div>
                    <p className="font-mono text-xs text-it-subtle">{r.mensagem}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {podeAlterarStatus && (
            <div>
              <div className="font-mono text-[10px] text-it-muted uppercase mb-3 flex items-center gap-2">
                <Shield size={14} /> CONTROLE DE STATUS
              </div>
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.filter(s => s.id).map(st => (
                  <button key={st.id} onClick={() => handleStatusChange(st.id)} disabled={salvando || selectedStatus === st.id}
                    className={cn("font-mono text-[10px] font-bold uppercase px-3 py-2 border transition-all",
                      selectedStatus === st.id ? "opacity-50 cursor-not-allowed" : "hover:opacity-80")}
                    style={{ color: st.color, borderColor: st.color, backgroundColor: `${st.color}15` }}>
                    {salvando && selectedStatus !== st.id ? '...' : st.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="pt-4 border-t border-it-border">
            <Link to={`/bug/${bug.id}`} className="font-display font-bold uppercase tracking-widest px-6 py-3 bg-[#4A3AFF] text-on-brand hover:bg-[#382bd6] transition-colors flex items-center justify-center gap-2 w-full">
              <ChevronRight size={16} /> ABRIR_DISCUSSÃO_COMPLETA
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BugTracker() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bugs, setBugs] = useState<BugType[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroSeveridade, setFiltroSeveridade] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [bugSelecionado, setBugSelecionado] = useState<BugType | null>(null);
  const [paginacao, setPaginacao] = useState<Paginacao | null>(null);
  const [pagina, setPagina] = useState(1);

  const podeAlterarStatus = user?.tipo === 'desenvolvedor' || user?.tipo === 'administrador';

  useEffect(() => {
    setCarregando(true);
    getBugs({
      ...(filtroSeveridade ? { severidade: filtroSeveridade } : {}),
      ...(filtroStatus ? { status: filtroStatus } : {}),
      page: pagina,
    })
      .then(({ bugs: b, paginacao: p }) => { setBugs(b); if (p) setPaginacao(p); })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, [filtroSeveridade, filtroStatus, pagina]);

  const bugsFiltrados = bugs.filter(b =>
    !busca || b.titulo.toLowerCase().includes(busca.toLowerCase()) || b.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const estatisticas = {
    criticos: bugs.filter(b => b.severidade === 'Critica').length,
    altos: bugs.filter(b => b.severidade === 'Alta').length,
    abertos: bugs.filter(b => b.status === 'aberto').length,
    corrigidos: bugs.filter(b => b.status === 'corrigido').length,
  };

  return (
    <div className="min-h-screen bg-it-page text-it-text selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <AppHeader>
        <AppHeader.Brand />
        <AppHeader.Nav className="justify-between">
          <div className="flex items-center gap-4">
            <AppHeader.NavBack onClick={() => navigate(-1)}><ArrowLeft size={16} /> VOLTAR</AppHeader.NavBack>
            <AppHeader.NavDivider />
            <AppHeader.NavLabel>BUG_TRACKER</AppHeader.NavLabel>
          </div>
          <div className="flex items-stretch shrink-0">
            <Link to="/report-bug" className="hidden sm:flex font-display font-bold uppercase tracking-widest px-4 py-2 bg-[#4A3AFF] text-on-brand hover:bg-it-elevated hover:text-it-text transition-all text-xs items-center gap-2 border-r border-it-border">
              <Bug size={14} /> REPORTAR BUG
            </Link>
            <AppHeader.Utilities />
          </div>
        </AppHeader.Nav>
      </AppHeader>
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-4xl font-display font-black uppercase tracking-tighter mb-1">Matriz de <span className="text-[#D4FF00]">Triagem</span></h1>
          <p className="font-mono text-xs text-it-muted">CENTRAL DE RASTREAMENTO E CLASSIFICAÇÃO DE ANOMALIAS</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-it-border mb-6">
          {[
            { label: 'CRÍTICOS', value: estatisticas.criticos, color: 'text-red-500' },
            { label: 'ALTOS', value: estatisticas.altos, color: 'text-orange-500' },
            { label: 'ABERTOS', value: estatisticas.abertos, color: 'text-[#D4FF00]' },
            { label: 'CORRIGIDOS', value: estatisticas.corrigidos, color: 'text-[#10b981]' },
          ].map((s, i) => (
            <div key={i} className="p-4 bg-it-surface border-r border-it-border last:border-r-0">
              <div className="font-mono text-[10px] text-it-muted mb-2">{s.label}</div>
              <div className={cn("font-display font-black text-4xl tracking-tighter", s.color)}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-48 relative flex items-center border border-it-border bg-it-surface focus-within:border-[#D4FF00] transition-colors">
            <Search size={16} className="absolute left-3 text-it-muted" />
            <input type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="BUSCAR BUGS..."
              className="w-full bg-transparent text-it-text py-3 pl-10 pr-4 font-mono text-sm outline-none placeholder:text-it-muted" />
          </div>
          <select value={filtroSeveridade} onChange={e => setFiltroSeveridade(e.target.value)}
            className="bg-it-surface border border-it-border text-it-text py-3 px-4 font-mono text-xs outline-none focus:border-[#D4FF00] appearance-none cursor-pointer">
            {SEVERIDADES.map(s => <option key={s.id} value={s.id} className="bg-it-surface">{s.name}</option>)}
          </select>
          <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}
            className="bg-it-surface border border-it-border text-it-text py-3 px-4 font-mono text-xs outline-none focus:border-[#D4FF00] appearance-none cursor-pointer">
            {STATUSES.map(s => <option key={s.id} value={s.id} className="bg-it-surface">{s.name}</option>)}
          </select>
        </div>
        <div className="border border-it-border bg-it-surface overflow-x-auto">
          <table className="w-full text-left font-mono text-xs whitespace-nowrap">
            <thead className="bg-it-page border-b border-it-border text-it-muted">
              <tr>
                <th className="p-4 font-normal">BUG_ID</th>
                <th className="p-4 font-normal">TÍTULO</th>
                <th className="p-4 font-normal">PROJETO</th>
                <th className="p-4 font-normal">SEVERIDADE</th>
                <th className="p-4 font-normal">STATUS</th>
                <th className="p-4 font-normal">DATA</th>
                <th className="p-4 font-normal">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-it-border">
              {carregando && <tr><td colSpan={7} className="p-8 text-center text-[#D4FF00] animate-pulse">CARREGANDO_BUGS...</td></tr>}
              {!carregando && bugsFiltrados.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-it-muted">[NENHUM_BUG_ENCONTRADO]</td></tr>
              )}
              {bugsFiltrados.map(bug => (
                <tr key={bug.id} onClick={() => setBugSelecionado(bug)}
                  className="hover:bg-it-elevated transition-colors group cursor-pointer">
                  <td className="p-4 text-it-muted">{bug.id.slice(0, 8)}</td>
                  <td className="p-4 font-bold text-it-text max-w-xs truncate">{bug.titulo}</td>
                  <td className="p-4 text-[#D4FF00]">{bug.testeSessao?.versao?.projeto?.nome || '—'}</td>
                  <td className="p-4"><SeverityBadge severity={bug.severidade} /></td>
                  <td className="p-4"><BugStatusBadge status={bug.status} /></td>
                  <td className="p-4 text-it-muted">{new Date(bug.dataCriacao).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={e => { e.stopPropagation(); setBugSelecionado(bug); }}
                        className="text-it-muted hover:text-it-text border border-transparent hover:border-it-border p-1 transition-colors">
                        <AlertTriangle size={14} />
                      </button>
                      <Link to={`/bug/${bug.id}`} onClick={e => e.stopPropagation()}
                        className="text-it-muted hover:text-[#4A3AFF] border border-transparent hover:border-[#4A3AFF]/30 p-1 transition-colors">
                        <MessageSquare size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginacao && paginacao.paginas > 1 && (
          <div className="flex items-center justify-between mt-4 font-mono text-xs text-it-muted">
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina <= 1}
              className="px-4 py-2 border border-it-border bg-it-surface hover:border-[#D4FF00] hover:text-it-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              Anterior
            </button>
            <span className="font-mono text-[10px] text-it-muted uppercase">
              Página {paginacao.pagina} de {paginacao.paginas} — {paginacao.total} registros
            </span>
            <button
              onClick={() => setPagina(p => Math.min(paginacao.paginas, p + 1))}
              disabled={pagina >= paginacao.paginas}
              className="px-4 py-2 border border-it-border bg-it-surface hover:border-[#D4FF00] hover:text-it-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-widest"
            >
              Próximo
            </button>
          </div>
        )}
      </main>
      {bugSelecionado && <BugDetailPanel bug={bugSelecionado} onClose={() => setBugSelecionado(null)} podeAlterarStatus={podeAlterarStatus} />}
    </div>
  );
}
