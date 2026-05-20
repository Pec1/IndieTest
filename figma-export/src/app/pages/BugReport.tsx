import React, { useEffect, useState, useRef } from 'react';
import { 
  Crosshair, ArrowLeft, Send, Activity, 
  Terminal, ShieldAlert, Cpu, CheckSquare, X,
  UploadCloud, FileWarning, CheckCircle2,
  AlertTriangle, Image as ImageIcon
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
  label, id, type = "text", placeholder, as = "input", children, className, rows = 5
}: { 
  label: string, id: string, type?: string, placeholder?: string, as?: "input" | "textarea" | "select", children?: React.ReactNode, className?: string, rows?: number
}) {
  const Component = as as any;
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> {label}
      </label>
      <div className="relative group flex items-center border border-[#2C2D35] bg-[#0F1013] focus-within:border-[#D4FF00] transition-colors">
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
            rows={rows}
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
        <Link to="/dashboard" className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-[#2C2D35] p-2 bg-[#1C1D22]">
          <ArrowLeft size={16} /> VOLTAR_AO_TERMINAL
        </Link>
        <div className="mx-4 h-4 w-px bg-[#2C2D35]" />
        <span className="font-mono text-xs text-[#D4FF00] font-bold tracking-widest">REPORTAR_FALHA // SYS_DEBUG</span>
      </div>
    </header>
  );
}

export function BugReport() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States
  const [severity, setSeverity] = useState<string | null>(null);
  
  // File Upload States
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  // Styling effect
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
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const severities = [
    { id: 'low', label: 'BAIXA', color: 'text-zinc-300 border-zinc-500 hover:border-zinc-300' },
    { id: 'medium', label: 'MÉDIA', color: 'text-[#D4FF00] border-[#D4FF00] hover:bg-[#D4FF00]/10' },
    { id: 'high', label: 'ALTA', color: 'text-orange-500 border-orange-500 hover:bg-orange-500/10' },
    { id: 'critical', label: 'CRÍTICA', color: 'text-red-500 border-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white' },
  ];

  return (
    <div className="min-h-screen bg-[#0F1013] text-white selection:bg-[#4A3AFF] selection:text-white flex flex-col">
      <FormHeader />
      
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter">
            Registro de <span className="text-[#4A3AFF]">Anomalias</span>
          </h1>
          <p className="font-mono text-xs text-zinc-500 mt-2">SYS_DEBUG. REGISTRAR PARÂMETROS DA FALHA ENCONTRADA.</p>
        </div>

        <form className="space-y-0" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
          
          {/* Dados do Software */}
          <div className="bg-[#1C1D22] border border-[#2C2D35] p-6 sm:p-8">
            <SectionHeader title="DADOS DA ANOMALIA" code="RN02" icon={ShieldAlert} />
            
            <div className="space-y-6">
              {/* Título do Erro */}
              <div className="space-y-2">
                <label htmlFor="title" className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> TÍTULO_DO_ERRO
                </label>
                <div className="relative group flex items-center border border-[#2C2D35] bg-[#0F1013] focus-within:border-[#4A3AFF] transition-colors">
                  <div className="pl-4 pr-2 text-[#4A3AFF] font-mono font-bold select-none">&gt;&gt;</div>
                  <input
                    id="title"
                    type="text"
                    placeholder="EX: CRASH AO INICIAR O NÍVEL 3"
                    className="w-full bg-transparent text-white rounded-none py-4 px-2 font-display text-xl outline-none placeholder:text-zinc-600 font-bold tracking-wide uppercase"
                    required
                  />
                </div>
              </div>

              {/* Descrição Detalhada */}
              <TerminalInput 
                label="PASSOS_PARA_REPRODUÇÃO_E_DESCRIÇÃO" 
                id="description" 
                as="textarea"
                rows={8}
                placeholder="1. INICIAR O JOGO&#10;2. ABRIR O MENU DE OPÇÕES&#10;3. CLICAR EM 'GRÁFICOS'&#10;&#10;RESULTADO: A TELA CONGELA E OCORRE FECHAMENTO INESPERADO."
                className="w-full"
              />

              {/* Nível de Severidade */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> CLASSIFICAÇÃO_DE_SEVERIDADE
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {severities.map((sev) => (
                    <button
                      key={sev.id}
                      type="button"
                      onClick={() => setSeverity(sev.id)}
                      className={cn(
                        "font-display font-bold uppercase tracking-widest px-4 py-3 border transition-all active:translate-y-[1px] text-center",
                        severity === sev.id 
                          ? cn(sev.color, "bg-current/[0.15] border-current shadow-[2px_2px_0_0_currentColor]") 
                          : "border-[#2C2D35] bg-[#0F1013] text-zinc-500 hover:border-zinc-500"
                      )}
                    >
                      {sev.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Upload de Mídias e Arquivos */}
          <div className="bg-[#1C1D22] border-x border-[#2C2D35] border-b p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(74,58,255,0.03)_10px,rgba(74,58,255,0.03)_20px)] pointer-events-none" />
            
            <SectionHeader title="MÍDIAS E ARQUIVOS" code="RF08" icon={FileWarning} />
            
            <div className="md:col-span-2 space-y-4">
              <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> EVIDÊNCIAS_DO_FALHA (LOGS/PRINTS)
              </label>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                multiple
                accept="image/*,.log,.txt"
              />

              <div 
                className={cn(
                  "border-2 border-dashed p-8 flex flex-col items-center justify-center transition-all cursor-pointer relative min-h-[160px]",
                  isDragActive 
                    ? "border-[#4A3AFF] bg-[#4A3AFF]/5" 
                    : "border-[#4A3AFF] bg-[#0F1013] hover:bg-[#4A3AFF]/[0.02]"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={32} className="text-[#4A3AFF] mb-4" strokeWidth={1.5} />
                <span className="font-display font-black text-xl tracking-tight text-white uppercase mb-2">
                  [ARRASTE_ARQUIVOS_AQUI]
                </span>
                <span className="font-mono text-[10px] text-zinc-500 uppercase text-center">
                  FORMATOS SUPORTADOS: JPG, PNG, LOG, TXT.<br/>
                  CLIQUE OU ARRASTE PARA ANEXAR.
                </span>
              </div>

              {/* Lista de Arquivos */}
              {files.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {files.map((f, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#0F1013] border border-[#2C2D35] p-3 group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {f.type.startsWith('image') ? (
                          <ImageIcon size={18} className="text-[#4A3AFF] shrink-0" />
                        ) : (
                          <Terminal size={18} className="text-zinc-500 shrink-0" />
                        )}
                        <div className="truncate">
                          <div className="font-mono text-xs text-white truncate">{f.name}</div>
                          <div className="font-mono text-[10px] text-zinc-500">{(f.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions & Validation Note */}
          <div className="bg-[#0F1013] border border-t-0 border-[#2C2D35] p-6 flex flex-col gap-6">
            
            {/* Aviso RN07 */}
            <div className="flex items-start gap-3 bg-[#1C1D22] border-l-2 border-orange-500 p-4">
              <AlertTriangle size={18} className="text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-display font-bold text-sm text-white tracking-wide uppercase">Aviso do Sistema // RN07</span>
                <p className="font-mono text-[10px] text-zinc-400 mt-1 uppercase">
                  O protocolo do sistema invalida e bloqueia o envio de múltiplos relatórios sobre a mesma falha para o mesmo projeto.
                  Verifique se o erro já foi reportado antes da submissão.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-end">
              <Link to="/dashboard" className="font-display font-bold uppercase tracking-widest px-8 py-4 bg-[#1C1D22] text-white border border-[#2C2D35] hover:bg-[#25262c] hover:border-white transition-colors w-full sm:w-auto text-center">
                CANCELAR
              </Link>
              <button
                type="submit"
                className="font-display text-lg font-black uppercase tracking-widest px-8 py-4 bg-[#4A3AFF] text-white border border-[#4A3AFF] hover:bg-[#382bd6] shadow-[4px_4px_0_0_#D4FF00] active:shadow-[0_0_0_0_#D4FF00] active:translate-y-[2px] active:translate-x-[2px] transition-all w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <Send size={20} strokeWidth={2.5} /> INJETAR_RELATÓRIO
              </button>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}