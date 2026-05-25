import React, { useState, useRef } from 'react';
import { Crosshair, ArrowLeft, Save, Plus, Terminal, Shield, FileText, CheckSquare, X, UploadCloud, FileArchive, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { criarProjeto, criarVersao } from '../api/projetos';
import { ApiError } from '../api/client';
import { cn } from '../lib/utils';

function TechnicalLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-[10px] font-mono text-[#D4FF00] bg-[#D4FF00]/10 px-1 border border-[#D4FF00]/20 inline-flex items-center gap-1", className)}>{children}</div>;
}

function SectionHeader({ title, code, icon: Icon }: { title: string; code: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center justify-between border-b border-[#2C2D35] pb-2 mb-6 mt-10 first:mt-0">
      <h2 className="text-xl font-display font-black tracking-tight text-white uppercase flex items-center gap-2">
        <Icon className="text-[#4A3AFF]" size={20} strokeWidth={2} /> {title}
      </h2>
      <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">{code}</TechnicalLabel>
    </div>
  );
}

function TerminalField({ label, id, required, children }: { label: string; id: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group flex items-start border border-[#2C2D35] bg-[#1C1D22] focus-within:border-[#D4FF00] transition-colors">
        <div className="pl-3 pr-2 pt-3 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
        {children}
      </div>
    </div>
  );
}

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
    setSalvando(true);
    try {
      const { projeto } = await criarProjeto({ nome, descricao, categoria });
      if (versaoNum.trim()) {
        await criarVersao(projeto.id, { numeroVersao: versaoNum, changelog: changelog || 'Versão inicial' });
      }
      navigate('/dev');
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao criar projeto');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1013] text-white selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <header className="flex flex-col md:flex-row items-stretch border-b border-[#2C2D35] bg-[#0F1013] sticky top-0 z-40">
        <div className="flex items-center gap-3 p-4 md:px-6 md:w-64 border-b md:border-b-0 md:border-r border-[#2C2D35]">
          <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={24} />
          <h1 className="text-2xl font-black tracking-tighter uppercase text-white font-display">IndieTest</h1>
        </div>
        <div className="flex-1 flex overflow-x-auto no-scrollbar items-center px-4 md:px-6">
          <Link to="/dev" className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-[#2C2D35] p-2 bg-[#1C1D22]">
            <ArrowLeft size={16} /> VOLTAR_AO_TERMINAL
          </Link>
          <div className="mx-4 h-4 w-px bg-[#2C2D35]" />
          <span className="font-mono text-xs text-[#D4FF00] font-bold tracking-widest">NOVO_PROJETO // SYS_CONFIG</span>
        </div>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter">
            Configuração de <span className="text-[#D4FF00]">Projeto</span>
          </h1>
          <p className="font-mono text-xs text-zinc-500 mt-2">PREENCHIMENTO DE DADOS EXIGIDO. PROTOCOLO SYS_CONFIG_001.</p>
        </div>
        {erro && <div className="mb-6 bg-red-500/10 border border-red-500/30 p-4 font-mono text-xs text-red-400">{erro}</div>}
        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="bg-[#1C1D22] border border-[#2C2D35] p-6 sm:p-8">
            <SectionHeader title="DADOS DO SOFTWARE" code="RF03/RF04" icon={Terminal} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TerminalField label="NOME_DO_PROJETO" id="nome" required>
                <input id="nome" value={nome} onChange={e => setNome(e.target.value)} placeholder="EX: TREVIUM_PROTOCOL" required
                  className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600" />
              </TerminalField>
              <TerminalField label="CATEGORIA_CLASSIFICAÇÃO" id="categoria" required>
                <select id="categoria" value={categoria} onChange={e => setCategoria(e.target.value)} required
                  className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none appearance-none cursor-pointer">
                  <option value="" disabled className="bg-black">SELECIONAR...</option>
                  <option value="Jogo" className="bg-[#1C1D22]">JOGO</option>
                  <option value="Aplicativo" className="bg-[#1C1D22]">APLICATIVO</option>
                  <option value="Utilitário" className="bg-[#1C1D22]">UTILITÁRIO</option>
                  <option value="Outro" className="bg-[#1C1D22]">OUTRO</option>
                </select>
              </TerminalField>
              <div className="md:col-span-2">
                <TerminalField label="DESCRIÇÃO_TÉCNICA" id="descricao" required>
                  <textarea id="descricao" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="INSERIR_DESCRIÇÃO_AQUI..." required rows={5}
                    className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600 resize-none" />
                </TerminalField>
              </div>
            </div>
          </div>
          <div className="bg-[#1C1D22] border-x border-[#2C2D35] border-b p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(212,255,0,0.03)_10px,rgba(212,255,0,0.03)_20px)] pointer-events-none" />
            <SectionHeader title="INJEÇÃO DE BUILD INICIAL" code="RF05" icon={FileText} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <input type="file" ref={fileInputRef} onChange={e => e.target.files?.[0] && handleFileSelection(e.target.files[0])} className="hidden" accept=".exe,.zip,.apk,.rar" />
                <div
                  className={cn("border-2 border-dashed p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative",
                    isDragActive ? "border-[#D4FF00] bg-[#D4FF00]/5" : file && uploadProgress === 100 ? "border-[#D4FF00] bg-[#1C1D22]" : "border-[#2C2D35] bg-[#0F1013] hover:border-zinc-500")}
                  onDragOver={e => { e.preventDefault(); setIsDragActive(true); }}
                  onDragLeave={e => { e.preventDefault(); setIsDragActive(false); }}
                  onDrop={e => { e.preventDefault(); setIsDragActive(false); e.dataTransfer.files?.[0] && handleFileSelection(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current?.click()}>
                  {!file ? (
                    <>
                      <UploadCloud size={32} className="text-zinc-500 mb-4" strokeWidth={1.5} />
                      <span className="font-display font-black text-xl tracking-tight text-white uppercase mb-2">[INJETAR_ARQUIVO_DO_SOFTWARE]</span>
                      <span className="font-mono text-[10px] text-zinc-500 uppercase">Formatos suportados: .EXE, .ZIP, .APK, .RAR</span>
                    </>
                  ) : (
                    <div className="w-full flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <FileArchive size={24} className="text-[#D4FF00]" strokeWidth={1.5} />
                          <div>
                            <div className="font-mono text-sm text-[#D4FF00] font-bold">{file.name}</div>
                            <div className="font-mono text-[10px] text-zinc-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                          </div>
                        </div>
                        {uploadProgress === 100 && <CheckCircle2 size={24} className="text-[#D4FF00]" />}
                      </div>
                      <div className="w-full space-y-1">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className={uploadProgress === 100 ? "text-[#D4FF00]" : "text-zinc-400"}>{uploadProgress === 100 ? "UPLOAD_CONCLUÍDO" : "INJETANDO_DADOS..."}</span>
                          <span className="text-white">{uploadProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#0F1013] border border-[#2C2D35] overflow-hidden">
                          <div className="h-full bg-[#D4FF00] transition-all duration-300 ease-out" style={{ width: `${Math.min(uploadProgress, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <TerminalField label="VERSÃO_DA_BUILD" id="versao">
                <input id="versao" value={versaoNum} onChange={e => setVersaoNum(e.target.value)} placeholder="EX: v1.0.0-beta"
                  className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600" />
              </TerminalField>
              <TerminalField label="NOTAS_DE_ATUALIZAÇÃO (CHANGELOG)" id="changelog">
                <textarea id="changelog" value={changelog} onChange={e => setChangelog(e.target.value)} placeholder="- CORE ENGINE UPDATED&#10;- BUG #12 RESOLVED" rows={5}
                  className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600 resize-none" />
              </TerminalField>
            </div>
          </div>
          <div className="bg-[#1C1D22] border-x border-[#2C2D35] border-b p-6 sm:p-8">
            <SectionHeader title="PAINEL DE AUTORIZAÇÃO" code="RF05_INV" icon={Shield} />
            <div className="space-y-4">
              <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> INJETAR_TESTADOR (EMAIL)
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group flex items-center border border-[#2C2D35] bg-[#0F1013] focus-within:border-[#D4FF00] transition-colors">
                  <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                  <input type="email" value={testerInput} onChange={e => setTesterInput(e.target.value)} placeholder="EMAIL_DO_USUÁRIO..."
                    className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTester())} />
                </div>
                <button type="button" onClick={handleAddTester}
                  className="font-display font-bold uppercase tracking-widest px-6 py-3 bg-[#4A3AFF] text-white hover:bg-[#382bd6] transition-colors active:translate-y-[1px] flex items-center justify-center gap-2">
                  <Plus size={18} strokeWidth={2.5} /> Injetar
                </button>
              </div>
              <div className="mt-4 border border-[#2C2D35] bg-[#0F1013] p-4 min-h-[80px]">
                <div className="font-mono text-[10px] text-zinc-500 mb-3 border-b border-[#2C2D35] pb-2">LISTA_DE_PERMISSÃO_ATIVA [{testers.length}]</div>
                {testers.length === 0 ? (
                  <div className="text-zinc-600 font-mono text-xs flex items-center justify-center h-10">[NENHUM_USUÁRIO_AUTORIZADO]</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {testers.map(email => (
                      <div key={email} className="flex items-center gap-2 bg-[#1C1D22] border border-[#2C2D35] px-3 py-1.5 group hover:border-red-500 transition-colors">
                        <CheckSquare size={14} className="text-[#D4FF00]" />
                        <span className="font-mono text-xs text-white">{email}</span>
                        <button type="button" onClick={() => setTesters(testers.filter(t => t !== email))} className="text-zinc-600 hover:text-red-500 ml-2 focus:outline-none">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-[#0F1013] border border-t-0 border-[#2C2D35] p-6 flex flex-col sm:flex-row gap-4 items-center justify-end">
            <Link to="/dev" className="font-display font-bold uppercase tracking-widest px-8 py-4 bg-[#1C1D22] text-white border border-[#2C2D35] hover:bg-[#25262c] hover:border-white transition-colors w-full sm:w-auto text-center">
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
