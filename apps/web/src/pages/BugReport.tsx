import React, { useState, useRef, useEffect } from 'react';
import { Send, ShieldAlert, FileWarning, AlertTriangle, X, UploadCloud, Image as ImageIcon, Terminal } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { criarBug } from '../api/bugs';
import { getProjetos, getProjeto } from '../api/projetos';
import { criarSessao } from '../api/sessoes';
import type { Projeto, Versao } from '../api/projetos';
import { ApiError } from '../api/client';
import { cn } from '../lib/utils';
import { SectionHeader } from '../components/ui/SectionHeader';
import { AppHeader } from '../components/ui/AppHeader';

const SEVERIDADES = [
  { id: 'Baixa', label: 'BAIXA', color: 'text-it-subtle border-zinc-500 hover:border-zinc-300' },
  { id: 'Media', label: 'MÉDIA', color: 'text-[#D4FF00] border-[#D4FF00] hover:bg-[#D4FF00]/10' },
  { id: 'Alta', label: 'ALTA', color: 'text-orange-500 border-orange-500 hover:bg-orange-500/10' },
  { id: 'Critica', label: 'CRÍTICA', color: 'text-red-500 border-red-500 bg-red-500/10 hover:bg-red-500 hover:text-it-text' },
];

const TIPOS = ['Bug', 'Melhoria', 'Outro'];

export function BugReport() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState('');
  const [versaoSelecionada, setVersaoSelecionada] = useState('');
  const [versoes, setVersoes] = useState<Versao[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('Bug');
  const [severidade, setSeveridade] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getProjetos().then(({ projetos: p }) => setProjetos(p)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!projetoSelecionado) { setVersoes([]); setVersaoSelecionada(''); return; }
    getProjeto(projetoSelecionado)
      .then(({ projeto: p }) => { setVersoes(p.versoes || []); setVersaoSelecionada(''); })
      .catch(console.error);
  }, [projetoSelecionado]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!severidade) { setErro('Selecione a severidade do bug'); return; }
    if (!versaoSelecionada) { setErro('Selecione uma versão do projeto'); return; }
    setErro('');
    setEnviando(true);
    try {
      const ua = navigator.userAgent;
      const so = ua.includes('Win') ? 'Windows' : ua.includes('Mac') ? 'macOS' : ua.includes('Linux') ? 'Linux' : 'Outro';
      const dispositivo = (navigator as { userAgentData?: { platform?: string } }).userAgentData?.platform || so;
      const { sessao } = await criarSessao({
        versaoId: versaoSelecionada,
        dispositivo,
        sistemaOperacional: so,
      });
      const { bug } = await criarBug({ testeSessaoId: sessao.id, titulo, descricao, tipo, severidade });
      if (files.length > 0) {
        for (const arquivo of files) {
          const formData = new FormData();
          formData.append('file', arquivo);
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3333'}/bugs/${bug.id}/anexos`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });
        }
      }
      navigate('/bug-tracker');
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao reportar bug');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-it-page text-it-text selection:bg-[#4A3AFF] selection:text-white flex flex-col">
      <AppHeader>
        <AppHeader.Brand />
        <AppHeader.Nav className="justify-between gap-4">
          <AppHeader.NavLabel>REPORTAR_FALHA</AppHeader.NavLabel>
          <AppHeader.Utilities />
        </AppHeader.Nav>
      </AppHeader>
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter">
            Registro de <span className="text-[#4A3AFF]">Anomalias</span>
          </h1>
          <p className="font-mono text-xs text-it-muted mt-2">Registre os detalhes da falha encontrada durante o teste.</p>
        </div>
        {erro && <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 font-mono text-xs text-red-400">{erro}</div>}
        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="bg-it-surface border border-it-border p-6 sm:p-8">
            <SectionHeader title="PROJETO E VERSÃO" icon={Terminal} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> PROJETO *
                </label>
                <div className="relative group flex items-center border border-it-border bg-it-page focus-within:border-[#D4FF00] transition-colors">
                  <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                  <select value={projetoSelecionado} onChange={e => setProjetoSelecionado(e.target.value)} required
                    className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none appearance-none cursor-pointer">
                    <option value="" className="bg-black">SELECIONAR PROJETO...</option>
                    {projetos.map(p => <option key={p.id} value={p.id} className="bg-it-surface">{p.nome}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> VERSÃO *
                </label>
                <div className="relative group flex items-center border border-it-border bg-it-page focus-within:border-[#D4FF00] transition-colors">
                  <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                  <select value={versaoSelecionada} onChange={e => setVersaoSelecionada(e.target.value)} required disabled={!projetoSelecionado}
                    className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none appearance-none cursor-pointer disabled:opacity-50">
                    <option value="" className="bg-black">SELECIONAR VERSÃO...</option>
                    {versoes.map(v => <option key={v.id} value={v.id} className="bg-it-surface">{v.numeroVersao}</option>)}
                  </select>
                </div>
                {projetoSelecionado && versoes.length === 0 && (
                  <p className="font-mono text-[10px] text-orange-400">Este projeto ainda não tem versões cadastradas.</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> TIPO_DO_REPORTE
                </label>
                <div className="flex gap-2">
                  {TIPOS.map(t => (
                    <button key={t} type="button" onClick={() => setTipo(t)}
                      className={cn("font-display font-bold uppercase tracking-wide px-3 py-2 border text-sm transition-all",
                        tipo === t ? "bg-[#4A3AFF] text-on-brand border-[#4A3AFF]" : "border-it-border bg-it-page text-it-muted hover:border-zinc-500")}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <SectionHeader title="DADOS DA ANOMALIA" icon={ShieldAlert} />
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="titulo" className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> TÍTULO_DO_ERRO *
                </label>
                <div className="relative group flex items-center border border-it-border bg-it-page focus-within:border-[#4A3AFF] transition-colors">
                  <div className="pl-4 pr-2 text-[#4A3AFF] font-mono font-bold select-none">&gt;&gt;</div>
                  <input id="titulo" type="text" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="EX: CRASH AO INICIAR O NÍVEL 3" required
                    className="w-full bg-transparent text-it-text rounded-none py-4 px-2 font-display text-xl outline-none placeholder:text-it-muted font-bold tracking-wide uppercase" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="descricao" className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> PASSOS_PARA_REPRODUÇÃO_E_DESCRIÇÃO *
                </label>
                <div className="relative group flex items-start border border-it-border bg-it-page focus-within:border-[#D4FF00] transition-colors">
                  <div className="pl-3 pr-2 pt-3 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                  <textarea id="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} rows={8} required
                    placeholder="1. INICIAR O JOGO&#10;2. ABRIR O MENU DE OPÇÕES&#10;3. CLICAR EM 'GRÁFICOS'&#10;&#10;RESULTADO: A TELA CONGELA E OCORRE FECHAMENTO INESPERADO."
                    className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-it-muted resize-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> CLASSIFICAÇÃO_DE_SEVERIDADE *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {SEVERIDADES.map(sev => (
                    <button key={sev.id} type="button" onClick={() => setSeveridade(sev.id)}
                      className={cn("font-display font-bold uppercase tracking-widest px-4 py-3 border transition-all active:translate-y-[1px] text-center",
                        severidade === sev.id ? cn(sev.color, "shadow-[2px_2px_0_0_currentColor]") : "border-it-border bg-it-page text-it-muted hover:border-zinc-500")}>
                      {sev.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-it-surface border-x border-it-border border-b p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(74,58,255,0.03)_10px,rgba(74,58,255,0.03)_20px)] pointer-events-none" />
            <SectionHeader title="MÍDIAS E ARQUIVOS" icon={FileWarning} />
            <input type="file" ref={fileInputRef} onChange={e => e.target.files && setFiles(prev => [...prev, ...Array.from(e.target.files!)])} className="hidden" multiple accept="image/*,.log,.txt" />
            <div
              className={cn("border-2 border-dashed p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative min-h-[160px]",
                isDragActive ? "border-[#4A3AFF] bg-[#4A3AFF]/5" : "border-[#4A3AFF] bg-it-page hover:bg-[#4A3AFF]/[0.02]")}
              onDragOver={e => { e.preventDefault(); setIsDragActive(true); }}
              onDragLeave={e => { e.preventDefault(); setIsDragActive(false); }}
              onDrop={e => { e.preventDefault(); setIsDragActive(false); e.dataTransfer.files && setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); }}
              onClick={() => fileInputRef.current?.click()}>
              <UploadCloud size={32} className="text-[#4A3AFF] mb-4" strokeWidth={1.5} />
              <span className="font-display font-black text-xl tracking-tight text-it-text uppercase mb-2">[ARRASTE_ARQUIVOS_AQUI]</span>
              <span className="font-mono text-[10px] text-it-muted uppercase text-center">FORMATOS SUPORTADOS: JPG, PNG, LOG, TXT.</span>
            </div>
            {files.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {files.map((f, index) => (
                  <div key={index} className="flex items-center justify-between bg-it-page border border-it-border p-3 group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {f.type.startsWith('image') ? <ImageIcon size={18} className="text-[#4A3AFF] shrink-0" /> : <Terminal size={18} className="text-it-muted shrink-0" />}
                      <div className="truncate">
                        <div className="font-mono text-xs text-it-text truncate">{f.name}</div>
                        <div className="font-mono text-[10px] text-it-muted">{(f.size / 1024).toFixed(1)} KB</div>
                      </div>
                    </div>
                    <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== index))} className="p-1 text-it-muted hover:text-red-500 hover:bg-red-500/10 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-it-page border border-t-0 border-it-border p-6 flex flex-col gap-6">
            <div className="flex items-start gap-3 bg-it-surface border-l-2 border-orange-500 p-4">
              <AlertTriangle size={18} className="text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-display font-bold text-sm text-it-text tracking-wide uppercase">Aviso do sistema</span>
                <p className="font-mono text-[10px] text-it-muted mt-1 uppercase">
                  O protocolo invalida envios de múltiplos relatórios sobre a mesma falha para o mesmo projeto. Verifique se o erro já foi reportado antes da submissão.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
              <Link to="/dashboard" className="font-display font-bold uppercase tracking-widest px-8 py-4 bg-it-surface text-it-text border border-it-border hover:bg-it-elevated hover:border-it-border-strong transition-colors w-full sm:w-auto text-center">
                CANCELAR
              </Link>
              <button type="submit" disabled={enviando}
                className="font-display text-lg font-black uppercase tracking-widest px-8 py-4 bg-[#4A3AFF] text-on-brand border border-[#4A3AFF] hover:bg-[#382bd6] shadow-[4px_4px_0_0_#D4FF00] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50">
                <Send size={20} strokeWidth={2.5} /> {enviando ? 'ENVIANDO...' : 'INJETAR_RELATÓRIO'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
