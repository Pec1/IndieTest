import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ShieldAlert, Mail, Lock, User, Briefcase, Crosshair, Terminal, ArrowRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router';

// --- Utils ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Brutalist Components ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

function BrutalistInput({ className, icon, type, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#D4FF00] transition-colors z-10">
          {icon}
        </div>
      )}
      <input
        type={inputType}
        className={cn(
          "w-full bg-[#0F1013] border border-[#2C2D35] text-white rounded-none py-3 px-4 font-mono text-sm outline-none transition-all duration-200 placeholder:text-zinc-600 focus:border-[#D4FF00] focus:bg-[#1C1D22]",
          icon && "pl-11",
          isPassword && "pr-11",
          className
        )}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-0 h-full px-3 text-zinc-500 hover:text-[#D4FF00] hover:bg-[#2C2D35]/30 transition-colors focus:outline-none z-10 border-l border-transparent group-focus-within:border-[#2C2D35]"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}

function BrutalistButton({ children, className, variant = 'primary', type = "button" }: { children: React.ReactNode, className?: string, variant?: 'primary' | 'secondary', type?: "button" | "submit" | "reset" }) {
  const isPrimary = variant === 'primary';
  return (
    <button 
      type={type}
      className={cn(
        "font-display font-bold uppercase tracking-widest px-6 py-4 transition-all duration-75 active:translate-y-[2px] active:translate-x-[2px] border border-transparent flex items-center justify-center gap-2",
        isPrimary 
          ? "bg-[#D4FF00] text-black hover:bg-[#e2ff4d] shadow-[4px_4px_0_0_#4A3AFF] active:shadow-[0_0_0_0_#4A3AFF]" 
          : "bg-[#1C1D22] text-white border-[#2C2D35] hover:border-[#D4FF00] shadow-[4px_4px_0_0_#000] active:shadow-[0_0_0_0_#000]",
        className
      )}
    >
      {children}
    </button>
  );
}

// --- Sections ---
function BrandSection() {
  return (
    <div className="hidden lg:flex flex-col justify-between items-start w-full lg:w-1/2 p-12 relative overflow-hidden bg-[#0F1013] border-r border-[#2C2D35]">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoMnYySDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] pointer-events-none" />
      
      {/* Top Protocol Bar */}
      <div className="absolute top-0 left-0 w-full flex items-center border-b border-[#2C2D35] bg-[#1C1D22]">
        <div className="px-4 py-2 font-mono text-[10px] text-[#D4FF00] border-r border-[#2C2D35] tracking-widest">
          SYS_AUTH //
        </div>
        <div className="px-4 py-2 font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
          SECURE_CONNECTION_ESTABLISHED
        </div>
      </div>

      <div className="mt-12 relative z-10 w-full">
        <div className="flex items-center gap-3 mb-6">
          <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={48} />
          <div className="h-12 w-px bg-[#2C2D35]" />
          <div className="font-mono text-xs text-[#4A3AFF] uppercase font-bold tracking-widest bg-[#4A3AFF]/10 px-2 py-1 border border-[#4A3AFF]/30">
            [BETA_PLATFORM]
          </div>
        </div>
        
        <h1 className="text-8xl font-display font-black tracking-tighter text-white uppercase leading-[0.85]">
          INDIE<br/>
          <span className="text-[#D4FF00] mix-blend-difference">TEST</span>
        </h1>
        
        <div className="mt-8 border-l-2 border-[#D4FF00] pl-4">
          <p className="font-mono text-sm text-zinc-400 max-w-sm leading-relaxed uppercase">
            Protocolo de Ingestão de Dados. 
            Identifique-se para acessar o hub central de testes e diagnosticar anomalias no sistema.
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#1C1D22] border border-[#2C2D35] p-6 mt-12">
        <div className="flex justify-between items-start mb-4 border-b border-[#2C2D35] pb-4">
          <span className="font-mono text-[10px] text-[#4A3AFF] font-bold">INFO_LOG</span>
          <span className="font-mono text-[10px] text-zinc-500">v.1.4.0</span>
        </div>
        <p className="font-mono text-xs text-zinc-400 leading-relaxed uppercase">
          &gt; INICIALIZANDO TERMINAL<br/>
          &gt; VERIFICANDO CREDENCIAIS DE REDE... <br/>
          <br/>
          <span className="text-[#D4FF00] animate-pulse flex items-center gap-2">
            <Terminal size={14} /> AGUARDANDO INPUT_DO_USUÁRIO_
          </span>
        </p>
      </div>

      {/* Decorative text */}
      <div className="absolute bottom-4 right-4 text-[120px] font-display font-black text-zinc-800/10 leading-none select-none pointer-events-none -z-0">
        AUTH
      </div>
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();

  return (
    <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" onSubmit={(e) => {
      e.preventDefault();
      navigate('/dashboard');
    }}>
      <div className="space-y-2">
        <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> INPUT_EMAIL
        </label>
        <BrutalistInput type="email" placeholder="usuario@indietest.net" icon={<Mail size={18} />} />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> INPUT_SENHA
          </label>
          <a href="#" className="font-mono text-[10px] font-bold uppercase text-[#4A3AFF] hover:text-white transition-colors border-b border-transparent hover:border-[#4A3AFF]">
            RECUPERAR_ACESSO
          </a>
        </div>
        <BrutalistInput type="password" placeholder="••••••••" icon={<Lock size={18} />} />
      </div>

      <div className="pt-6 border-t border-[#2C2D35] mt-8">
        <BrutalistButton type="submit" className="w-full text-xl py-5">
          <span>INICIAR_SESSÃO</span>
          <ArrowRight size={24} strokeWidth={2.5} />
        </BrutalistButton>
      </div>
    </form>
  );
}

function RegisterForm() {
  const navigate = useNavigate();

  return (
    <form className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300" onSubmit={(e) => {
      e.preventDefault();
      navigate('/dashboard');
    }}>
      <div className="space-y-2">
        <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> ID_USUÁRIO (NOME)
        </label>
        <BrutalistInput type="text" placeholder="NOME_COMPLETO" icon={<User size={18} />} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> REGISTRO_CPF
          </label>
          <BrutalistInput type="text" placeholder="000.000.000-00" icon={<ShieldAlert size={18} />} />
        </div>
        
        <div className="space-y-2">
          <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> CLASSE_DE_PERFIL
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#D4FF00] z-10 transition-colors">
              <Briefcase size={18} />
            </div>
            <select 
              className="w-full bg-[#0F1013] border border-[#2C2D35] text-white rounded-none py-3 pl-11 pr-10 font-mono text-sm outline-none transition-all duration-200 focus:border-[#D4FF00] focus:bg-[#1C1D22] appearance-none cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled className="text-zinc-600 bg-black">SELECIONAR...</option>
              <option value="developer" className="bg-[#1C1D22] text-white">DESENVOLVEDOR</option>
              <option value="tester" className="bg-[#1C1D22] text-white">TESTADOR</option>
              <option value="moderator" className="bg-[#1C1D22] text-white">MODERADOR</option>
            </select>
            <div className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-zinc-500 pointer-events-none z-10 border-l border-transparent group-focus-within:border-[#2C2D35]">
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-t-[6px] border-t-current border-r-[4px] border-r-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> INPUT_EMAIL
        </label>
        <BrutalistInput type="email" placeholder="usuario@indietest.net" icon={<Mail size={18} />} />
      </div>

      <div className="space-y-2">
        <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> GERAR_SENHA
        </label>
        <BrutalistInput type="password" placeholder="••••••••" icon={<Lock size={18} />} />
      </div>

      <div className="pt-6 border-t border-[#2C2D35] mt-8">
        <BrutalistButton type="submit" variant="secondary" className="w-full text-lg py-4">
          CRIAR_REGISTRO
        </BrutalistButton>
      </div>
    </form>
  );
}

function AuthSection() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-16 relative z-10 min-h-screen bg-[#1C1D22]">
      
      <div className="w-full max-w-[480px] relative z-10">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex flex-col items-center gap-3 mb-10 justify-center">
          <Crosshair className="w-12 h-12 text-[#D4FF00]" strokeWidth={1.5} />
          <h1 className="text-5xl font-display font-black tracking-tighter text-white uppercase mt-2">
            INDIE<span className="text-[#D4FF00]">TEST</span>
          </h1>
          <div className="font-mono text-[10px] text-[#4A3AFF] uppercase font-bold tracking-widest border border-[#4A3AFF]/30 px-2 py-1 mt-2">
            [AUTH_REQUIRED]
          </div>
        </div>

        {/* Brutalist Container */}
        <div className="bg-[#0F1013] border border-[#2C2D35] shadow-[16px_16px_0_0_rgba(15,16,19,0.5)]">
          
          {/* Angular Tabs */}
          <div className="flex border-b border-[#2C2D35]">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={cn(
                "flex-1 py-4 px-4 font-display font-bold uppercase tracking-widest text-lg transition-all border-r border-[#2C2D35]",
                activeTab === 'signin' 
                  ? "bg-[#D4FF00] text-black" 
                  : "bg-[#0F1013] text-zinc-500 hover:text-white hover:bg-[#1C1D22]"
              )}
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={cn(
                "flex-1 py-4 px-4 font-display font-bold uppercase tracking-widest text-lg transition-all",
                activeTab === 'signup' 
                  ? "bg-[#4A3AFF] text-white" 
                  : "bg-[#0F1013] text-zinc-500 hover:text-white hover:bg-[#1C1D22]"
              )}
            >
              REGISTRO
            </button>
          </div>

          <div className="p-6 sm:p-10">
            {/* Form Content */}
            <div className="relative min-h-[350px]">
              {activeTab === 'signin' ? <LoginForm /> : <RegisterForm />}
            </div>
          </div>
          
          {/* Card Footer */}
          <div className="bg-[#1C1D22] border-t border-[#2C2D35] p-3 flex justify-between items-center">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-zinc-500 tracking-widest">
              <div className="w-1.5 h-1.5 bg-[#D4FF00] animate-pulse" />
              CONEXÃO_SEGURA
            </div>
            <span className="font-mono text-[10px] text-zinc-600">SYS.2024.1</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export function Auth() {
  useEffect(() => {
    // Inject fonts to DOM
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Oswald:wght@500;700;900&display=swap');
      
      .font-display {
        font-family: 'Oswald', sans-serif;
      }
      .font-mono {
        font-family: 'JetBrains Mono', monospace;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1C1D22] flex overflow-hidden selection:bg-[#D4FF00] selection:text-black flex-col lg:flex-row">
      <BrandSection />
      <AuthSection />
    </div>
  );
}
