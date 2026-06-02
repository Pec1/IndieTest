import React, { useState } from 'react';
import { ShieldAlert, Mail, Lock, User, Briefcase, Crosshair, Terminal, ArrowRight } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { criarUsuario } from '../api/auth';
import { ApiError } from '../api/client';
import { cn } from '../lib/utils';
import { BrutalistInput } from '../components/ui/BrutalistInput';
import { BrutalistButton } from '../components/ui/BrutalistButton';
import { ThemeToggle } from '../components/ui/ThemeToggle';

function BrandSection() {
  return (
    <div className="hidden lg:flex flex-col justify-between items-start w-full lg:w-1/2 p-12 relative overflow-hidden bg-it-page border-r border-it-border">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoMnYySDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9zdmc+')] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full flex items-center border-b border-it-border bg-it-surface">
        <div className="px-4 py-2 font-mono text-[10px] text-[#D4FF00] border-r border-it-border tracking-widest">SYS_AUTH //</div>
        <div className="px-4 py-2 font-mono text-[10px] text-it-muted tracking-widest uppercase">SECURE_CONNECTION_ESTABLISHED</div>
      </div>
      <div className="mt-12 relative z-10 w-full">
        <div className="flex items-center gap-3 mb-6">
          <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={48} />
          <div className="h-12 w-px bg-it-border" />
          <div className="font-mono text-xs text-[#4A3AFF] uppercase font-bold tracking-widest bg-[#4A3AFF]/10 px-2 py-1 border border-[#4A3AFF]/30">[BETA_PLATFORM]</div>
        </div>
        <h1 className="text-8xl font-display font-black tracking-tighter text-it-text uppercase leading-[0.85]">
          INDIE<br /><span className="text-[#D4FF00]">TEST</span>
        </h1>
        <div className="mt-8 border-l-2 border-[#D4FF00] pl-4">
          <p className="font-mono text-sm text-it-muted max-w-sm leading-relaxed uppercase">
            Protocolo de Ingestão de Dados. Identifique-se para acessar o hub central de testes e diagnosticar anomalias no sistema.
          </p>
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md bg-it-surface border border-it-border p-6 mt-12">
        <div className="flex justify-between items-start mb-4 border-b border-it-border pb-4">
          <span className="font-mono text-[10px] text-[#4A3AFF] font-bold">INFO_LOG</span>
          <span className="font-mono text-[10px] text-it-muted">v.1.4.0</span>
        </div>
        <p className="font-mono text-xs text-it-muted leading-relaxed uppercase">
          &gt; INICIALIZANDO TERMINAL<br />
          &gt; VERIFICANDO CREDENCIAIS DE REDE...<br /><br />
          <span className="text-[#D4FF00] animate-pulse flex items-center gap-2">
            <Terminal size={14} /> AGUARDANDO INPUT_DO_USUÁRIO_
          </span>
        </p>
      </div>
      <div className="absolute bottom-4 right-4 text-[120px] font-display font-black text-it-watermark leading-none select-none pointer-events-none -z-0">AUTH</div>
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await signIn(email, senha);
      // user já foi carregado pelo signIn via getPainel — busca o estado atualizado
      const { getPainel } = await import('../api/auth');
      const { user } = await getPainel();
      navigate('/dashboard');
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Credenciais inválidas');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" onSubmit={handleSubmit}>
      {erro && (
        <div className="bg-red-500/10 border border-red-500/30 p-3 font-mono text-xs text-red-400">{erro}</div>
      )}
      <div className="space-y-2">
        <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> INPUT_EMAIL
        </label>
        <BrutalistInput type="email" placeholder="usuario@indietest.net" icon={<Mail size={18} />}
          value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> INPUT_SENHA
          </label>
        </div>
        <BrutalistInput type="password" placeholder="••••••••" icon={<Lock size={18} />}
          value={senha} onChange={e => setSenha(e.target.value)} required />
      </div>
      <div className="pt-6 border-t border-it-border mt-8">
        <BrutalistButton type="submit" className="w-full text-xl py-5" disabled={carregando}>
          <span>{carregando ? 'AUTENTICANDO...' : 'INICIAR_SESSÃO'}</span>
          <ArrowRight size={24} strokeWidth={2.5} />
        </BrutalistButton>
      </div>
    </form>
  );
}

function RegisterForm() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState<'testador' | 'desenvolvedor'>('testador');
  const [nomeEstudio, setNomeEstudio] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    if (tipo === 'desenvolvedor' && !nomeEstudio.trim()) {
      setErro('Nome do estúdio é obrigatório para desenvolvedores');
      return;
    }
    setCarregando(true);
    try {
      await criarUsuario({ nome, email, senha, tipo, ...(tipo === 'desenvolvedor' ? { nomeEstudio } : {}) });
      await signIn(email, senha);
      navigate('/dashboard');
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : 'Erro ao criar conta');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300" onSubmit={handleSubmit}>
      {erro && <div className="bg-red-500/10 border border-red-500/30 p-3 font-mono text-xs text-red-400">{erro}</div>}
      <div className="space-y-2">
        <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> ID_USUÁRIO (NOME)
        </label>
        <BrutalistInput type="text" placeholder="NOME_COMPLETO" icon={<User size={18} />}
          value={nome} onChange={e => setNome(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> CLASSE_DE_PERFIL
        </label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-it-muted group-focus-within:text-[#D4FF00] z-10 transition-colors">
            <Briefcase size={18} />
          </div>
          <select
            className="w-full bg-it-input border border-it-border text-it-text rounded-none py-3 pl-11 pr-10 font-mono text-sm outline-none transition-all duration-200 focus:border-[#D4FF00] focus:bg-it-surface appearance-none cursor-pointer"
            value={tipo} onChange={e => setTipo(e.target.value as 'testador' | 'desenvolvedor')}>
            <option value="testador" className="bg-it-surface text-it-text">TESTADOR</option>
            <option value="desenvolvedor" className="bg-it-surface text-it-text">DESENVOLVEDOR</option>
          </select>
          <div className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-it-muted pointer-events-none z-10 border-l border-transparent group-focus-within:border-it-border">
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-t-[6px] border-t-current border-r-[4px] border-r-transparent" />
          </div>
        </div>
      </div>
      {tipo === 'desenvolvedor' && (
        <div className="space-y-2">
          <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> NOME_DO_ESTÚDIO
          </label>
          <BrutalistInput type="text" placeholder="EX: PIXEL_FORGE_STUDIO" icon={<ShieldAlert size={18} />}
            value={nomeEstudio} onChange={e => setNomeEstudio(e.target.value)} />
        </div>
      )}
      <div className="space-y-2">
        <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> INPUT_EMAIL
        </label>
        <BrutalistInput type="email" placeholder="usuario@indietest.net" icon={<Mail size={18} />}
          value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#D4FF00] inline-block" /> GERAR_SENHA
        </label>
        <BrutalistInput type="password" placeholder="••••••••" icon={<Lock size={18} />}
          value={senha} onChange={e => setSenha(e.target.value)} required minLength={6} />
      </div>
      <div className="pt-6 border-t border-it-border mt-8">
        <BrutalistButton type="submit" variant="secondary" className="w-full text-lg py-4" disabled={carregando}>
          {carregando ? 'CRIANDO_REGISTRO...' : 'CRIAR_REGISTRO'}
        </BrutalistButton>
      </div>
    </form>
  );
}

function AuthSection() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-16 relative z-10 min-h-screen bg-it-surface">
      <div className="w-full max-w-[480px] relative z-10">
        <div className="lg:hidden flex flex-col items-center gap-3 mb-10 justify-center">
          <Crosshair className="w-12 h-12 text-[#D4FF00]" strokeWidth={1.5} />
          <h1 className="text-5xl font-display font-black tracking-tighter text-it-text uppercase mt-2">
            INDIE<span className="text-[#D4FF00]">TEST</span>
          </h1>
          <div className="font-mono text-[10px] text-[#4A3AFF] uppercase font-bold tracking-widest border border-[#4A3AFF]/30 px-2 py-1 mt-2">[AUTH_REQUIRED]</div>
        </div>
        <div className="bg-it-page border border-it-border shadow-[16px_16px_0_0_var(--it-shadow)]">
          <div className="flex border-b border-it-border">
            <button type="button" onClick={() => setActiveTab('signin')}
              className={cn("flex-1 py-4 px-4 font-display font-bold uppercase tracking-widest text-lg transition-all border-r border-it-border",
                activeTab === 'signin' ? "bg-[#D4FF00] text-black" : "bg-it-page text-it-muted hover:text-it-text hover:bg-it-surface")}>
              LOGIN
            </button>
            <button type="button" onClick={() => setActiveTab('signup')}
              className={cn("flex-1 py-4 px-4 font-display font-bold uppercase tracking-widest text-lg transition-all",
                activeTab === 'signup' ? "bg-[#4A3AFF] text-on-brand" : "bg-it-page text-it-muted hover:text-it-text hover:bg-it-surface")}>
              REGISTRO
            </button>
          </div>
          <div className="p-6 sm:p-10">
            <div className="relative min-h-[350px]">
              {activeTab === 'signin' ? <LoginForm /> : <RegisterForm />}
            </div>
          </div>
          <div className="bg-it-surface border-t border-it-border p-3 flex justify-between items-center">
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest">
              <div className="w-1.5 h-1.5 bg-[#D4FF00] animate-pulse" />CONEXÃO_SEGURA
            </div>
            <span className="font-mono text-[10px] text-it-muted">SYS.2024.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Auth() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return null;
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-it-surface flex overflow-hidden selection:bg-[#D4FF00] selection:text-black flex-col lg:flex-row relative">
      <div className="absolute top-0 right-0 z-50 flex items-stretch border-l border-b border-it-border bg-it-page">
        <ThemeToggle variant="header" className="border-r-0" />
      </div>
      <BrandSection />
      <AuthSection />
    </div>
  );
}
