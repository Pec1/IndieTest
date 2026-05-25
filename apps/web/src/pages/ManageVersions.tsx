import React, { useState, useEffect } from 'react';
import { Crosshair, ArrowLeft, Plus, ChevronDown, Clock, FileCode, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { getProjeto, criarVersao, type Projeto, type Versao } from '../api/projetos';
import { ApiError } from '../api/client';
import { cn } from '../lib/utils';

function TechnicalLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-[10px] font-mono text-[#D4FF00] bg-[#D4FF00]/10 px-1 border border-[#D4FF00]/20 inline-flex items-center gap-1", className)}>{children}</div>;
}

function VersionCard({ versao, isLatest }: { versao: Versao; isLatest: boolean }) {
  const [isExpanded, setIsExpanded] = useState(isLatest);
  return (
    <div className={cn("border-2 transition-colors", isLatest ? "border-[#D4FF00] bg-[#1C1D22]" : "border-[#2C2D35] bg-[#1C1D22] hover:border-[#4A3AFF]")}>
      <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="w-full p-4 flex items-center justify-between hover:bg-[#25262c] transition-colors">
        <div className="flex items-center gap-4">
          <div className={cn("font-display font-black text-2xl tracking-tighter", isLatest ? "text-[#D4FF00]" : "text-white")}>{versao.numeroVersao}</div>
          {isLatest && <TechnicalLabel className="text-[#D4FF00] bg-[#D4FF00]/10 border-[#D4FF00]/30">ATUAL</TechnicalLabel>}
          <span className={cn("font-mono text-[10px] px-2 py-0.5 border",
            versao.status === 'ativa' ? "text-[#10b981] border-[#10b981] bg-[#10b981]/10" : "text-zinc-500 border-zinc-500")}>
            {versao.status.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-zinc-500 flex items-center gap-2">
            <Clock size={14} />{new Date(versao.dataPublicacao).toLocaleDateString('pt-BR')}
          </div>
          <ChevronDown size={20} className={cn("text-zinc-500 transition-transform", isExpanded && "rotate-180")} />
        </div>
      </button>
      {isExpanded && (
        <div className="border-t border-[#2C2D35] p-4 bg-[#0F1013]">
          <div className="font-mono text-[10px] text-zinc-500 uppercase mb-3 flex items-center gap-2">
            <FileCode size={14} /> CHANGELOG
          </div>
          <pre className="font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">{versao.changelog}</pre>
        </div>
      )}
    </div>
  );
}

export function ManageVersions() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [novaVersao, setNovaVersao] = useState('');
  const [novoChangelog, setNovoChangelog] = useState('');
  const [novoStatus, setNovoStatus] = useState('ativa');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProjeto(id)
      .then(({ projeto: p }) => setProjeto(p))
      .catch(() => navigate('/dev'))
      .finally(() => setCarregando(false));
  }, [id]);

  async function handleAdicionarVersao(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !novaVersao.trim()) return;
    setErro('');
    setSucesso('');
    setSalvando(true);
    try {
      const { versao } = await criarVersao(id, { numeroVersao: novaVersao, changelog: novoChangelog, status: novoStatus });
      setProjeto(prev => prev ? { ...prev, versoes: [versao, ...(prev.versoes || [])] } : prev);
      setNovaVersao('');
      setNovoChangelog('');
      setNovoStatus('ativa');
      setSucesso(`Versão ${versao.numeroVersao} publicada com sucesso!`);
      setShowForm(false);
      setTimeout(() => setSucesso(''), 3000);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao criar versão');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#0F1013] flex items-center justify-center">
        <p className="font-mono text-[#D4FF00] animate-pulse tracking-widest">CARREGANDO...</p>
      </div>
    );
  }

  if (!projeto) return null;
  const versoes = projeto.versoes || [];

  return (
    <div className="min-h-screen bg-[#0F1013] text-white selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <header className="flex flex-col md:flex-row items-stretch border-b border-[#2C2D35] bg-[#0F1013] sticky top-0 z-40">
        <div className="flex items-center gap-3 p-4 md:px-6 md:w-64 border-b md:border-b-0 md:border-r border-[#2C2D35]">
          <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={24} />
          <h1 className="text-2xl font-black tracking-tighter uppercase text-white font-display">IndieTest</h1>
        </div>
        <div className="flex-1 flex overflow-x-auto no-scrollbar items-center px-4 md:px-6 justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/project/${id}`} className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-[#2C2D35] p-2 bg-[#1C1D22]">
              <ArrowLeft size={16} /> VOLTAR_AO_PROJETO
            </Link>
            <div className="h-4 w-px bg-[#2C2D35]" />
            <span className="font-mono text-xs text-[#D4FF00] font-bold tracking-widest">GERENCIAR_VERSÕES // RF05</span>
          </div>
          <button type="button" onClick={() => setShowForm(!showForm)}
            className="font-display font-bold uppercase tracking-widest px-4 py-2 bg-[#D4FF00] text-black hover:bg-[#e2ff4d] transition-all text-xs flex items-center gap-2 shadow-[2px_2px_0_0_#4A3AFF]">
            <Plus size={16} strokeWidth={2} /> NOVA_VERSÃO
          </button>
        </div>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter">
            Versões de <span className="text-[#D4FF00]">{projeto.nome}</span>
          </h1>
          <p className="font-mono text-xs text-zinc-500 mt-2">{versoes.length} BUILD{versoes.length !== 1 ? 'S' : ''} REGISTRADA{versoes.length !== 1 ? 'S' : ''} // {projeto.categoria}</p>
        </div>
        {sucesso && (
          <div className="mb-6 bg-[#10b981]/10 border border-[#10b981] p-4 font-mono text-xs text-[#10b981] flex items-center gap-2">
            <CheckCircle2 size={16} /> {sucesso}
          </div>
        )}
        {showForm && (
          <div className="mb-8 bg-[#1C1D22] border-2 border-[#D4FF00] p-6">
            <div className="flex items-center justify-between border-b border-[#2C2D35] pb-4 mb-6">
              <h2 className="font-display font-black text-2xl text-white uppercase tracking-tight">NOVA_BUILD</h2>
              <TechnicalLabel>RF05_VERSAO</TechnicalLabel>
            </div>
            {erro && <div className="mb-4 bg-red-500/10 border border-red-500/30 p-3 font-mono text-xs text-red-400">{erro}</div>}
            <form onSubmit={handleAdicionarVersao} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> NÚMERO_DA_VERSÃO *
                  </label>
                  <div className="flex items-center border border-[#2C2D35] bg-[#0F1013] focus-within:border-[#D4FF00] transition-colors">
                    <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                    <input type="text" value={novaVersao} onChange={e => setNovaVersao(e.target.value)} placeholder="EX: v1.3.0-beta" required
                      className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> STATUS
                  </label>
                  <div className="flex items-center border border-[#2C2D35] bg-[#0F1013] focus-within:border-[#D4FF00] transition-colors">
                    <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                    <select value={novoStatus} onChange={e => setNovoStatus(e.target.value)}
                      className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none appearance-none cursor-pointer">
                      <option value="ativa" className="bg-[#1C1D22]">ATIVA</option>
                      <option value="beta" className="bg-[#1C1D22]">BETA</option>
                      <option value="deprecated" className="bg-[#1C1D22]">DEPRECATED</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> CHANGELOG *
                </label>
                <div className="flex items-start border border-[#2C2D35] bg-[#0F1013] focus-within:border-[#D4FF00] transition-colors">
                  <div className="pl-3 pr-2 pt-3 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                  <textarea value={novoChangelog} onChange={e => setNovoChangelog(e.target.value)} rows={6} required
                    placeholder="• Correção de bugs&#10;• Melhorias de performance&#10;• Novas funcionalidades"
                    className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600 resize-none" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-[#2C2D35]">
                <button type="button" onClick={() => setShowForm(false)}
                  className="font-display font-bold uppercase tracking-widest px-8 py-3 bg-[#1C1D22] text-white border border-[#2C2D35] hover:bg-[#25262c] hover:border-white transition-colors">
                  CANCELAR
                </button>
                <button type="submit" disabled={salvando}
                  className="font-display font-bold uppercase tracking-widest px-8 py-3 bg-[#D4FF00] text-black border border-[#D4FF00] hover:bg-[#e2ff4d] shadow-[3px_3px_0_0_#4A3AFF] active:shadow-none transition-all flex items-center gap-2 disabled:opacity-50">
                  <Plus size={16} /> {salvando ? 'PUBLICANDO...' : 'PUBLICAR_VERSÃO'}
                </button>
              </div>
            </form>
          </div>
        )}
        {versoes.length === 0 ? (
          <div className="border border-[#2C2D35] bg-[#1C1D22] p-16 text-center">
            <FileCode size={48} className="text-zinc-700 mx-auto mb-4" />
            <p className="font-mono text-sm text-zinc-500 uppercase">[NENHUMA_VERSÃO_CADASTRADA]</p>
            <p className="font-mono text-xs text-zinc-600 mt-2">Clique em "Nova Versão" para publicar a primeira build.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {versoes.map((v, i) => <VersionCard key={v.id} versao={v} isLatest={i === 0} />)}
          </div>
        )}
      </main>
    </div>
  );
}
