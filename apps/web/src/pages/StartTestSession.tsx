import React, { useState, useEffect } from 'react';
import { Play, Monitor, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { getProjetos, getProjeto, type Projeto, type Versao } from '../api/projetos';
import { criarSessao } from '../api/sessoes';
import { ApiError } from '../api/client';
import { cn } from '../lib/utils';
import { SectionHeader } from '../components/ui/SectionHeader';
import { AppHeader } from '../components/ui/AppHeader';

const SISTEMAS = ['Windows 10', 'Windows 11', 'Ubuntu 24.04', 'macOS Sonoma', 'macOS Ventura', 'Fedora 40', 'Outro'];
const DISPOSITIVOS = ['PC Desktop', 'Notebook', 'MacBook', 'Workstation', 'Outro'];

export function StartTestSession() {
  const navigate = useNavigate();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [projetoId, setProjetoId] = useState('');
  const [versoes, setVersoes] = useState<Versao[]>([]);
  const [versaoId, setVersaoId] = useState('');
  const [dispositivo, setDispositivo] = useState('');
  const [sistemaOperacional, setSistemaOperacional] = useState('');
  const [dispositivoCustom, setDispositivoCustom] = useState('');
  const [soCustom, setSoCustom] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    getProjetos({ status: 'em_teste' })
      .then(({ projetos: p }) => setProjetos(p))
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    if (!projetoId) { setVersoes([]); setVersaoId(''); return; }
    getProjeto(projetoId)
      .then(({ projeto: p }) => { setVersoes(p.versoes || []); setVersaoId(''); })
      .catch(console.error);
  }, [projetoId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    const dispFinal = dispositivo === 'Outro' ? dispositivoCustom : dispositivo;
    const soFinal = sistemaOperacional === 'Outro' ? soCustom : sistemaOperacional;
    if (!dispFinal || !soFinal) { setErro('Preencha todos os campos obrigatórios'); return; }
    setSalvando(true);
    try {
      const { sessao } = await criarSessao({ versaoId, dispositivo: dispFinal, sistemaOperacional: soFinal });
      setSucesso(`Sessão iniciada com sucesso! ID: ${sessao.id.slice(0, 8).toUpperCase()}`);
      setTimeout(() => navigate('/report-bug'), 2000);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao iniciar sessão');
    } finally {
      setSalvando(false);
    }
  }

  const versaoSelecionada = versoes.find(v => v.id === versaoId);

  return (
    <div className="min-h-screen bg-it-page text-it-text selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <AppHeader>
        <AppHeader.Brand />
        <AppHeader.Nav className="justify-between gap-4">
          <AppHeader.NavLabel>INICIAR_SESSÃO</AppHeader.NavLabel>
          <AppHeader.Utilities />
        </AppHeader.Nav>
      </AppHeader>
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter">
            Iniciar <span className="text-[#D4FF00]">Sessão de Teste</span>
          </h1>
          <p className="font-mono text-xs text-it-muted mt-2">PROTOCOLO DE INICIALIZAÇÃO DE AMBIENTE DE TESTES BETA.</p>
        </div>
        {sucesso ? (
          <div className="bg-it-surface border-2 border-[#D4FF00] p-12 flex flex-col items-center justify-center gap-6 text-center">
            <CheckCircle2 size={64} className="text-[#D4FF00]" />
            <div>
              <h2 className="font-display font-black text-3xl text-it-text uppercase mb-2">SESSÃO_INICIADA</h2>
              <p className="font-mono text-sm text-it-muted">{sucesso}</p>
              <p className="font-mono text-xs text-it-muted mt-2">Redirecionando para reportar bugs...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-0">
            {erro && <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 font-mono text-xs text-red-400">{erro}</div>}
            <div className="bg-it-surface border border-it-border p-6 sm:p-8">
              <SectionHeader title="SELECIONAR PROJETO E VERSÃO" icon={Play} iconColor="text-[#D4FF00]" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> PROJETO *
                  </label>
                  <div className="relative group flex items-center border border-it-border bg-it-page focus-within:border-[#D4FF00] transition-colors">
                    <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                    <select value={projetoId} onChange={e => setProjetoId(e.target.value)} required
                      className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none appearance-none cursor-pointer">
                      <option value="" className="bg-black">{carregando ? 'CARREGANDO...' : 'SELECIONAR PROJETO...'}</option>
                      {projetos.map(p => <option key={p.id} value={p.id} className="bg-it-surface">{p.nome} — {p.desenvolvedor.nomeEstudio}</option>)}
                    </select>
                  </div>
                  {projetos.length === 0 && !carregando && <p className="font-mono text-[10px] text-orange-400">Nenhum projeto disponível para teste no momento.</p>}
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> VERSÃO *
                  </label>
                  <div className="relative group flex items-center border border-it-border bg-it-page focus-within:border-[#D4FF00] transition-colors">
                    <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                    <select value={versaoId} onChange={e => setVersaoId(e.target.value)} required disabled={!projetoId || versoes.length === 0}
                      className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none appearance-none cursor-pointer disabled:opacity-50">
                      <option value="" className="bg-black">SELECIONAR VERSÃO...</option>
                      {versoes.map(v => <option key={v.id} value={v.id} className="bg-it-surface">{v.numeroVersao} — {v.status}</option>)}
                    </select>
                  </div>
                  {projetoId && versoes.length === 0 && <p className="font-mono text-[10px] text-orange-400">Este projeto não tem versões cadastradas.</p>}
                </div>
              </div>
              {versaoSelecionada && (
                <div className="mt-4 bg-it-page border border-[#D4FF00] p-4">
                  <div className="font-mono text-[10px] text-[#D4FF00] uppercase mb-2">CHANGELOG_DA_VERSÃO_SELECIONADA</div>
                  <pre className="font-mono text-xs text-it-subtle leading-relaxed whitespace-pre-wrap">{versaoSelecionada.changelog}</pre>
                </div>
              )}
            </div>
            <div className="bg-it-surface border-x border-it-border border-b p-6 sm:p-8">
              <SectionHeader title="AMBIENTE DE TESTE" icon={Monitor} iconColor="text-[#D4FF00]" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> DISPOSITIVO *
                  </label>
                  <div className="relative group flex items-center border border-it-border bg-it-page focus-within:border-[#D4FF00] transition-colors">
                    <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                    <select value={dispositivo} onChange={e => setDispositivo(e.target.value)} required
                      className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none appearance-none cursor-pointer">
                      <option value="" className="bg-black">SELECIONAR DISPOSITIVO...</option>
                      {DISPOSITIVOS.map(d => <option key={d} value={d} className="bg-it-surface">{d}</option>)}
                    </select>
                  </div>
                  {dispositivo === 'Outro' && (
                    <div className="relative group flex items-center border border-it-border bg-it-page focus-within:border-[#D4FF00] transition-colors mt-2">
                      <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                      <input type="text" value={dispositivoCustom} onChange={e => setDispositivoCustom(e.target.value)} placeholder="DESCREVA_SEU_DISPOSITIVO..." required
                        className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-it-muted" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> SISTEMA_OPERACIONAL *
                  </label>
                  <div className="relative group flex items-center border border-it-border bg-it-page focus-within:border-[#D4FF00] transition-colors">
                    <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                    <select value={sistemaOperacional} onChange={e => setSistemaOperacional(e.target.value)} required
                      className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none appearance-none cursor-pointer">
                      <option value="" className="bg-black">SELECIONAR S.O....</option>
                      {SISTEMAS.map(s => <option key={s} value={s} className="bg-it-surface">{s}</option>)}
                    </select>
                  </div>
                  {sistemaOperacional === 'Outro' && (
                    <div className="relative group flex items-center border border-it-border bg-it-page focus-within:border-[#D4FF00] transition-colors mt-2">
                      <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                      <input type="text" value={soCustom} onChange={e => setSoCustom(e.target.value)} placeholder="EX: ARCH_LINUX_6.9" required
                        className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-it-muted" />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 bg-it-page border border-it-border p-4">
                <div className="font-mono text-[10px] text-it-muted uppercase mb-3">DETECÇÃO_AUTOMÁTICA</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Monitor size={14} className="text-[#D4FF00]" />
                    <span className="text-it-muted">Resolução: {window.screen.width}x{window.screen.height}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-[#D4FF00]" />
                    <span className="text-it-muted">Núcleos: {navigator.hardwareConcurrency || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-it-page border border-t-0 border-it-border p-6 flex flex-col gap-6">
              <div className="flex items-start gap-3 bg-it-surface border-l-2 border-[#D4FF00] p-4">
                <AlertTriangle size={18} className="text-[#D4FF00] shrink-0 mt-0.5" />
                <div>
                  <span className="font-display font-bold text-sm text-it-text tracking-wide uppercase">Atenção // Protocolo de Sessão</span>
                  <p className="font-mono text-[10px] text-it-muted mt-1 uppercase">
                    Ao iniciar a sessão, você será redirecionado para o formulário de reporte de bugs. Todos os bugs reportados nesta sessão serão automaticamente vinculados à versão selecionada.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
                <Link to="/dashboard" className="font-display font-bold uppercase tracking-widest px-8 py-4 bg-it-surface text-it-text border border-it-border hover:bg-it-elevated hover:border-it-border-strong transition-colors w-full sm:w-auto text-center">
                  CANCELAR
                </Link>
                <button type="submit" disabled={salvando || !versaoId}
                  className="font-display text-lg font-black uppercase tracking-widest px-8 py-4 bg-[#D4FF00] text-black border border-[#D4FF00] hover:bg-[#e2ff4d] shadow-[4px_4px_0_0_#4A3AFF] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50">
                  <Play size={20} strokeWidth={2.5} /> {salvando ? 'INICIALIZANDO...' : 'INICIAR_SESSÃO'}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
