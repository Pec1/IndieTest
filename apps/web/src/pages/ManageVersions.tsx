import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, FileCode } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { getProjeto, criarVersao, type Projeto, type Versao } from '../api/projetos';
import { ApiError } from '../api/client';
import { cn } from '../lib/utils';
import { AppHeader } from '../components/ui/AppHeader';
import { VersionCard } from '../components/shared/VersionCard';

export function ManageVersions() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [novaVersao, setNovaVersao] = useState('');
  const [novoChangelog, setNovoChangelog] = useState('');
  const [novoStatus, setNovoStatus] = useState('ativa');
  const [salvando, setSalvando] = useState(false);
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
    } catch (err) {
      console.error(err);
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
      <AppHeader>
        <AppHeader.Brand />
        <AppHeader.Nav className="justify-between">
          <div className="flex items-center gap-4">
            <AppHeader.NavLabel>GERENCIAR_VERSÕES</AppHeader.NavLabel>
          </div>
          <button type="button" onClick={() => setShowForm(!showForm)}
            className="font-display font-bold uppercase tracking-widest px-4 py-2 bg-[#D4FF00] text-black hover:bg-[#e2ff4d] transition-all text-xs flex items-center gap-2 shadow-[2px_2px_0_0_#4A3AFF]">
            <Plus size={16} strokeWidth={2} /> NOVA_VERSÃO
          </button>
        </AppHeader.Nav>
      </AppHeader>
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
            </div>
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
            {versoes.map((v, i) => <VersionCard key={v.id} versao={v} isLatest={i === 0} showStatus />)}
          </div>
        )}
      </main>
    </div>
  );
}
