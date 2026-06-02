import React, { useState, useRef } from 'react';
import { Crosshair, ArrowLeft, Save, Plus, Terminal, Shield, FileText, CheckSquare, X, UploadCloud, FileArchive, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { criarProjeto, criarVersao } from '../api/projetos';
import { convidarTestador } from '../api/convites';
import { ApiError } from '../api/client';
import { cn } from '../lib/utils';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TerminalField } from '../components/ui/TerminalField';
import { AppHeader } from '../components/ui/AppHeader';

export function NewProject() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [versaoNum, setVersaoNum] = useState('');
  const [changelog, setChangelog] = useState('');
  const [testers, setTesters] = useState<string[]>([]);
  const [testerInput, setTesterInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [erro, setErro] = useState('');
  const [avisoConvites, setAvisoConvites] = useState('');
  const [salvando, setSalvando] = useState(false);

  function handleAddTester() {
    if (testerInput && !testers.includes(testerInput)) {
      setTesters([...testers, testerInput]);
      setTesterInput('');
    }
  }

  function handleFileSelection(f: File) {
    setFile(f);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return Math.min(prev + Math.floor(Math.random() * 15) + 5, 100);
      });
    }, 200);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setAvisoConvites('');
    setSalvando(true);
    try {
      const { projeto } = await criarProjeto({ nome, descricao, categoria });
      if (versaoNum.trim()) {
        await criarVersao(projeto.id, { numeroVersao: versaoNum, changelog: changelog || 'Versão inicial' });
      }
      if (testers.length > 0) {
        const resultados = await Promise.allSettled(
          testers.map(email => convidarTestador(projeto.id, email))
        );
        const falhas = resultados
          .map((r, i) => ({ r, email: testers[i] }))
          .filter(({ r }) => r.status === 'rejected')
          .map(({ email, r }) => {
            const msg = r.status === 'rejected' && r.reason instanceof ApiError ? r.reason.message : 'Erro desconhecido';
            return `${email}: ${msg}`;
          });
        if (falhas.length > 0) {
          setAvisoConvites(`${testers.length - falhas.length}/${testers.length} convites enviados. Falhas:\n${falhas.join('\n')}`);
          setSalvando(false);
          setTimeout(() => navigate('/dev'), 3000);
          return;
        }
      }
      navigate('/dev');
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao criar projeto');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-it-page text-it-text selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <AppHeader>
        <AppHeader.Brand />
        <AppHeader.Nav className="justify-between gap-4">
          <div className="flex items-center min-w-0">
            <AppHeader.NavBack to="/dev"><ArrowLeft size={16} /> VOLTAR_AO_TERMINAL</AppHeader.NavBack>
            <AppHeader.NavDivider />
            <AppHeader.NavLabel>NOVO_PROJETO</AppHeader.NavLabel>
          </div>
          <AppHeader.Utilities />
        </AppHeader.Nav>
      </AppHeader>
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter">
            Configuração de <span className="text-[#D4FF00]">Projeto</span>
          </h1>
          <p className="font-mono text-xs text-it-muted mt-2">Preencha os dados obrigatórios para publicar o projeto.</p>
        </div>
        {erro && <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 font-mono text-xs text-red-400">{erro}</div>}
        {avisoConvites && (
          <div className="mb-6 bg-[#D4FF00]/10 border border-[#D4FF00]/30 p-4 font-mono text-xs text-[#D4FF00] whitespace-pre-line">
            PROJETO_CRIADO. {avisoConvites}{'\n'}Redirecionando...
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="bg-it-surface border border-it-border p-6 sm:p-8">
            <SectionHeader title="DADOS DO SOFTWARE" icon={Terminal} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TerminalField label="NOME_DO_PROJETO" id="nome" required>
                <input id="nome" value={nome} onChange={e => setNome(e.target.value)} placeholder="EX: TREVIUM_PROTOCOL" required
                  className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-it-muted" />
              </TerminalField>
              <TerminalField label="CATEGORIA_CLASSIFICAÇÃO" id="categoria" required>
                <select id="categoria" value={categoria} onChange={e => setCategoria(e.target.value)} required
                  className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none appearance-none cursor-pointer">
                  <option value="" disabled className="bg-black">SELECIONAR...</option>
                  <option value="Jogo" className="bg-it-surface">JOGO</option>
                  <option value="Aplicativo" className="bg-it-surface">APLICATIVO</option>
                  <option value="Utilitário" className="bg-it-surface">UTILITÁRIO</option>
                  <option value="Outro" className="bg-it-surface">OUTRO</option>
                </select>
              </TerminalField>
              <div className="md:col-span-2">
                <TerminalField label="DESCRIÇÃO_TÉCNICA" id="descricao" required>
                  <textarea id="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="INSERIR_DESCRIÇÃO_AQUI..." required rows={5}
                    className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-it-muted resize-none" />
                </TerminalField>
              </div>
            </div>
          </div>
          <div className="bg-it-surface border-x border-it-border border-b p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(212,255,0,0.03)_10px,rgba(212,255,0,0.03)_20px)] pointer-events-none" />
            <SectionHeader title="INJEÇÃO DE BUILD INICIAL" icon={FileText} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <input type="file" ref={fileInputRef} onChange={e => e.target.files?.[0] && handleFileSelection(e.target.files[0])} className="hidden" accept=".exe,.zip,.apk,.rar" />
                <div
                  className={cn("border-2 border-dashed p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative",
                    isDragActive ? "border-[#D4FF00] bg-[#D4FF00]/5" : file && uploadProgress === 100 ? "border-[#D4FF00] bg-it-surface" : "border-it-border bg-it-page hover:border-zinc-500")}
                  onDragOver={e => { e.preventDefault(); setIsDragActive(true); }}
                  onDragLeave={e => { e.preventDefault(); setIsDragActive(false); }}
                  onDrop={e => { e.preventDefault(); setIsDragActive(false); e.dataTransfer.files?.[0] && handleFileSelection(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current?.click()}>
                  {!file ? (
                    <>
                      <UploadCloud size={32} className="text-it-muted mb-4" strokeWidth={1.5} />
                      <span className="font-display font-black text-xl tracking-tight text-it-text uppercase mb-2">[INJETAR_ARQUIVO_DO_SOFTWARE]</span>
                      <span className="font-mono text-[10px] text-it-muted uppercase">Formatos suportados: .EXE, .ZIP, .APK, .RAR</span>
                    </>
                  ) : (
                    <div className="w-full flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <FileArchive size={24} className="text-[#D4FF00]" strokeWidth={1.5} />
                          <div>
                            <div className="font-mono text-sm text-[#D4FF00] font-bold">{file.name}</div>
                            <div className="font-mono text-[10px] text-it-muted">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                          </div>
                        </div>
                        {uploadProgress === 100 && <CheckCircle2 size={24} className="text-[#D4FF00]" />}
                      </div>
                      <div className="w-full space-y-1">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className={uploadProgress === 100 ? "text-[#D4FF00]" : "text-it-muted"}>{uploadProgress === 100 ? "UPLOAD_CONCLUÍDO" : "INJETANDO_DADOS..."}</span>
                          <span className="text-it-text">{uploadProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-it-page border border-it-border overflow-hidden">
                          <div className="h-full bg-[#D4FF00] transition-all duration-300 ease-out" style={{ width: `${Math.min(uploadProgress, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <TerminalField label="VERSÃO_DA_BUILD" id="versao">
                <input id="versao" value={versaoNum} onChange={e => setVersaoNum(e.target.value)} placeholder="EX: v1.0.0-beta"
                  className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-it-muted" />
              </TerminalField>
              <TerminalField label="NOTAS_DE_ATUALIZAÇÃO (CHANGELOG)" id="changelog">
                <textarea id="changelog" value={changelog} onChange={e => setChangelog(e.target.value)} placeholder="- CORE ENGINE UPDATED&#10;- BUG #12 RESOLVED" rows={5}
                  className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-it-muted resize-none" />
              </TerminalField>
            </div>
          </div>
          <div className="bg-it-surface border-x border-it-border border-b p-6 sm:p-8">
            <SectionHeader title="PAINEL DE AUTORIZAÇÃO" icon={Shield} />
            <div className="space-y-4">
              <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> INJETAR_TESTADOR (EMAIL)
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group flex items-center border border-it-border bg-it-page focus-within:border-[#D4FF00] transition-colors">
                  <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                  <input type="email" value={testerInput} onChange={e => setTesterInput(e.target.value)} placeholder="EMAIL_DO_USUÁRIO..."
                    className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-it-muted"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTester())} />
                </div>
                <button type="button" onClick={handleAddTester}
                  className="font-display font-bold uppercase tracking-widest px-6 py-3 bg-[#4A3AFF] text-on-brand hover:bg-[#382bd6] transition-colors active:translate-y-[1px] flex items-center justify-center gap-2">
                  <Plus size={18} strokeWidth={2.5} /> Injetar
                </button>
              </div>
              <div className="mt-4 border border-it-border bg-it-page p-4 min-h-[80px]">
                <div className="font-mono text-[10px] text-it-muted mb-3 border-b border-it-border pb-2">LISTA_DE_PERMISSÃO_ATIVA [{testers.length}]</div>
                {testers.length === 0 ? (
                  <div className="text-it-muted font-mono text-xs flex items-center justify-center h-10">[NENHUM_USUÁRIO_AUTORIZADO]</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {testers.map(email => (
                      <div key={email} className="flex items-center gap-2 bg-it-surface border border-it-border px-3 py-1.5 group hover:border-red-500 transition-colors">
                        <CheckSquare size={14} className="text-[#D4FF00]" />
                        <span className="font-mono text-xs text-it-text">{email}</span>
                        <button type="button" onClick={() => setTesters(testers.filter(t => t !== email))} className="text-it-muted hover:text-red-500 ml-2 focus:outline-none">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-it-page border border-t-0 border-it-border p-6 flex flex-col sm:flex-row gap-4 items-center justify-end">
            <Link to="/dev" className="font-display font-bold uppercase tracking-widest px-8 py-4 bg-it-surface text-it-text border border-it-border hover:bg-it-elevated hover:border-it-border-strong transition-colors w-full sm:w-auto text-center">
              ABORTAR_OPERAÇÃO
            </Link>
            <button type="submit" disabled={salvando}
              className="font-display text-lg font-black uppercase tracking-widest px-8 py-4 bg-[#D4FF00] text-black border border-[#D4FF00] hover:bg-[#e2ff4d] shadow-[4px_4px_0_0_#4A3AFF] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-50">
              <Save size={20} strokeWidth={2.5} /> {salvando ? 'COMPILANDO...' : 'COMPILAR_E_SALVAR'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
