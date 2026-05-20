import React, { useEffect, useState, useRef } from 'react';
import { 
  Crosshair, ArrowLeft, Save, Plus, 
  Terminal, Shield, FileText, CheckSquare, X,
  UploadCloud, FileArchive, CheckCircle2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link, useNavigate } from 'react-router';

// --- Utils ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---
function TechnicalLabel({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("text-[10px] font-mono text-[#D4FF00] bg-[#D4FF00]/10 px-1 border border-[#D4FF00]/20 inline-flex items-center gap-1", className)}>
      {children}
    </div>
  );
}

function SectionHeader({ title, code, icon: Icon }: { title: string, code: string, icon: any }) {
  return (
    <div className="flex items-center justify-between border-b border-[#2C2D35] pb-2 mb-6 mt-10 first:mt-0">
      <h2 className="text-xl font-display font-black tracking-tight text-white uppercase flex items-center gap-2">
        <Icon className="text-[#4A3AFF]" size={20} strokeWidth={2} /> {title}
      </h2>
      <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">{code}</TechnicalLabel>
    </div>
  );
}

function TerminalInput({ 
  label, id, type = "text", placeholder, as = "input", children, className
}: { 
  label: string, id: string, type?: string, placeholder?: string, as?: "input" | "textarea" | "select", children?: React.ReactNode, className?: string
}) {
  const Component = as as any;
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> {label}
      </label>
      <div className="relative group flex items-center border border-[#2C2D35] bg-[#1C1D22] focus-within:border-[#D4FF00] transition-colors">
        <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
        {as === "select" ? (
          <select 
            id={id}
            className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none appearance-none cursor-pointer"
            defaultValue=""
          >
            {children}
          </select>
        ) : as === "textarea" ? (
          <textarea
            id={id}
            placeholder={placeholder}
            rows={5}
            className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600 resize-none"
          />
        ) : (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600"
          />
        )}
      </div>
    </div>
  );
}

// --- Sections ---
function FormHeader() {
  return (
    <header className="flex flex-col md:flex-row items-stretch border-b border-[#2C2D35] bg-[#0F1013] sticky top-0 z-40">
      <div className="flex items-center gap-3 p-4 md:px-6 md:w-64 border-b md:border-b-0 md:border-r border-[#2C2D35]">
        <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={24} />
        <h1 className="text-2xl font-black tracking-tighter uppercase text-white font-display">
          IndieTest
        </h1>
      </div>

      <div className="flex-1 flex overflow-x-auto no-scrollbar items-center px-4 md:px-6">
        <Link to="/dev" className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-[#2C2D35] p-2 bg-[#1C1D22]">
          <ArrowLeft size={16} /> VOLTAR_AO_TERMINAL
        </Link>
        <div className="mx-4 h-4 w-px bg-[#2C2D35]" />
        <span className="font-mono text-xs text-[#D4FF00] font-bold tracking-widest">NOVO_PROJETO // SYS_CONFIG</span>
      </div>
    </header>
  );
}

export function NewProject() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States
  const [testers, setTesters] = useState<string[]>(['qa_lead@indietest.net', 'beta_runner_01@net.com']);
  const [testerInput, setTesterInput] = useState('');
  
  // File Upload States
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleAddTester = () => {
    if (testerInput && !testers.includes(testerInput)) {
      setTesters([...testers, testerInput]);
      setTesterInput('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile);
    simulateUpload();
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 300);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Oswald:wght@500;700;900&display=swap');
      
      .font-display {
        font-family: 'Oswald', sans-serif;
      }
      .font-mono {
        font-family: 'JetBrains Mono', monospace;
      }
      
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1013] text-white selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <FormHeader />
      
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter">
            Configuração de <span className="text-[#D4FF00]">Projeto</span>
          </h1>
          <p className="font-mono text-xs text-zinc-500 mt-2">PREENCHIMENTO DE DADOS EXIGIDO. PROTOCOLO SYS_CONFIG_001.</p>
        </div>

        <form className="space-y-0" onSubmit={(e) => { e.preventDefault(); navigate('/dev'); }}>
          
          {/* Dados do Software */}
          <div className="bg-[#1C1D22] border border-[#2C2D35] p-6 sm:p-8">
            <SectionHeader title="DADOS DO SOFTWARE" code="RF03/RF04" icon={Terminal} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TerminalInput 
                label="NOME_DO_PROJETO" 
                id="name" 
                placeholder="EX: TREVIUM_PROTOCOL" 
                className="md:col-span-1"
              />
              <TerminalInput 
                label="CATEGORIA_CLASSIFICAÇÃO" 
                id="category" 
                as="select"
                className="md:col-span-1"
              >
                <option value="" disabled className="text-zinc-600 bg-black">SELECIONAR...</option>
                <option value="jogo" className="bg-[#1C1D22] text-white">JOGO</option>
                <option value="aplicativo" className="bg-[#1C1D22] text-white">APLICATIVO</option>
                <option value="utilitario" className="bg-[#1C1D22] text-white">UTILITÁRIO</option>
              </TerminalInput>
              <TerminalInput 
                label="DESCRIÇÃO_TÉCNICA" 
                id="description" 
                as="textarea"
                placeholder="INSERIR_DESCRIÇÃO_AQUI..."
                className="md:col-span-2"
              />
            </div>
          </div>

          {/* Injeção de Build Obrigatória e Upload */}
          <div className="bg-[#1C1D22] border-x border-[#2C2D35] border-b p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(212,255,0,0.03)_10px,rgba(212,255,0,0.03)_20px)] pointer-events-none" />
            
            <SectionHeader title="INJEÇÃO DE BUILD INICIAL" code="RN05_REQ" icon={FileText} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* ZONA DE UPLOAD DO SOFTWARE */}
              <div className="md:col-span-2">
                <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> ZONA DE UPLOAD DO SOFTWARE
                </label>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".exe,.zip,.apk,.rar"
                />

                <div 
                  className={cn(
                    "border-2 border-dashed p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative",
                    isDragActive 
                      ? "border-[#D4FF00] bg-[#D4FF00]/5" 
                      : (file && uploadProgress === 100) 
                        ? "border-[#D4FF00] bg-[#1C1D22]" 
                        : "border-[#2C2D35] bg-[#0F1013] hover:border-zinc-500"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!file ? (
                    <>
                      <UploadCloud size={32} className="text-zinc-500 mb-4" strokeWidth={1.5} />
                      <span className="font-display font-black text-xl tracking-tight text-white uppercase mb-2">
                        [INJETAR_ARQUIVO_DO_SOFTWARE]
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500 uppercase">
                        Formatos suportados: .EXE, .ZIP, .APK, .RAR
                      </span>
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
                        {uploadProgress === 100 && (
                          <CheckCircle2 size={24} className="text-[#D4FF00]" />
                        )}
                      </div>

                      {/* ProgressBar */}
                      <div className="w-full space-y-1">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className={uploadProgress === 100 ? "text-[#D4FF00]" : "text-zinc-400"}>
                            {uploadProgress === 100 ? "UPLOAD_CONCLUÍDO" : "INJETANDO_DADOS..."}
                          </span>
                          <span className="text-white">{uploadProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#0F1013] border border-[#2C2D35] overflow-hidden">
                          <div 
                            className="h-full bg-[#D4FF00] transition-all duration-300 ease-out" 
                            style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <TerminalInput 
                label="VERSÃO_DA_BUILD" 
                id="version" 
                placeholder="EX: v1.0.0-beta" 
                className="md:col-span-1"
              />
              <TerminalInput 
                label="NOTAS_DE_ATUALIZAÇÃO (CHANGELOG)" 
                id="changelog" 
                as="textarea"
                placeholder="- CORE ENGINE UPDATED&#10;- BUG #12 RESOLVED"
                className="md:col-span-1"
              />
            </div>
          </div>

          {/* Painel de Convite */}
          <div className="bg-[#1C1D22] border-x border-[#2C2D35] border-b p-6 sm:p-8">
            <SectionHeader title="PAINEL DE AUTORIZAÇÃO" code="RF05_INV" icon={Shield} />
            
            <div className="space-y-4">
              <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> INJETAR_TESTADOR (EMAIL)
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group flex items-center border border-[#2C2D35] bg-[#0F1013] focus-within:border-[#D4FF00] transition-colors">
                  <div className="pl-3 pr-2 text-[#D4FF00] font-mono font-bold select-none">&gt;</div>
                  <input
                    type="email"
                    value={testerInput}
                    onChange={(e) => setTesterInput(e.target.value)}
                    placeholder="EMAIL_DO_USUÁRIO..."
                    className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTester())}
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleAddTester}
                  className="font-display font-bold uppercase tracking-widest px-6 py-3 bg-[#4A3AFF] text-white hover:bg-[#382bd6] transition-colors border border-transparent active:translate-y-[1px] flex items-center justify-center gap-2"
                >
                  <Plus size={18} strokeWidth={2.5} /> Injetar
                </button>
              </div>

              {/* Lista de Testadores */}
              <div className="mt-4 border border-[#2C2D35] bg-[#0F1013] p-4 min-h-[120px]">
                <div className="font-mono text-[10px] text-zinc-500 mb-3 border-b border-[#2C2D35] pb-2">LISTA_DE_PERMISSÃO_ATIVA [{testers.length}]</div>
                {testers.length === 0 ? (
                  <div className="text-zinc-600 font-mono text-xs flex items-center justify-center h-16">
                    [NENHUM_USUÁRIO_AUTORIZADO]
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {testers.map(email => (
                      <div key={email} className="flex items-center gap-2 bg-[#1C1D22] border border-[#2C2D35] px-3 py-1.5 group hover:border-red-500 transition-colors">
                        <CheckSquare size={14} className="text-[#D4FF00]" />
                        <span className="font-mono text-xs text-white">{email}</span>
                        <button 
                          type="button" 
                          onClick={() => setTesters(testers.filter(t => t !== email))}
                          className="text-zinc-600 hover:text-red-500 ml-2 focus:outline-none"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-[#0F1013] border border-t-0 border-[#2C2D35] p-6 flex flex-col sm:flex-row gap-4 items-center justify-end">
            <Link to="/dev" className="font-display font-bold uppercase tracking-widest px-8 py-4 bg-[#1C1D22] text-white border border-[#2C2D35] hover:bg-[#25262c] hover:border-white transition-colors w-full sm:w-auto text-center">
              ABORTAR_OPERAÇÃO
            </Link>
            <button type="submit" className="font-display text-lg font-black uppercase tracking-widest px-8 py-4 bg-[#D4FF00] text-black border border-[#D4FF00] hover:bg-[#e2ff4d] shadow-[4px_4px_0_0_#4A3AFF] active:shadow-[0_0_0_0_#4A3AFF] active:translate-y-[2px] active:translate-x-[2px] transition-all w-full sm:w-auto flex items-center justify-center gap-2">
              <Save size={20} strokeWidth={2.5} /> COMPILAR_E_SALVAR
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
