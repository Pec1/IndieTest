import React, { useEffect, useState } from 'react';
import {
  Crosshair, ArrowLeft, User, Shield, Bell,
  Lock, Mail, Phone, CreditCard, Calendar,
  AlertTriangle, CheckCircle2, Settings as SettingsIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router';
import { Switch } from '../components/ui/switch';

// --- Utils ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const USER_DATA = {
  id: 'USR-0081',
  nome: 'Rafael Santos',
  email: 'rafael.santos@indietest.dev',
  telefone: '+55 11 98765-4321',
  cpf: '123.456.789-00',
  dataNascimento: '15/03/1995',
  tipoUsuario: 'DESENVOLVEDOR', // ou 'TESTADOR'
};

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
    <div className="flex items-center justify-between border-b border-[#2C2D35] pb-3 mb-6">
      <h2 className="text-xl font-display font-black tracking-tight text-white uppercase flex items-center gap-2">
        <Icon className="text-[#4A3AFF]" size={20} strokeWidth={2} /> {title}
      </h2>
      <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">{code}</TechnicalLabel>
    </div>
  );
}

function TerminalInput({
  label,
  id,
  type = "text",
  value,
  icon: Icon,
  readonly = false,
  required = false,
  placeholder,
  onChange
}: {
  label: string,
  id: string,
  type?: string,
  value: string,
  icon: any,
  readonly?: boolean,
  required?: boolean,
  placeholder?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> {label}
        {required && <span className="text-red-500">*</span>}
        {readonly && <span className="text-zinc-600">[BLOQUEADO]</span>}
      </label>
      <div className={cn(
        "relative group flex items-center border bg-[#0F1013] transition-colors",
        readonly
          ? "border-zinc-700 bg-zinc-900/30"
          : "border-[#2C2D35] focus-within:border-[#D4FF00]"
      )}>
        <div className="pl-3 pr-2 text-zinc-500">
          <Icon size={16} strokeWidth={1.5} />
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          readOnly={readonly}
          required={required}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600",
            readonly && "cursor-not-allowed text-zinc-500"
          )}
        />
        {readonly && (
          <div className="pr-3 text-zinc-700">
            <Lock size={14} />
          </div>
        )}
      </div>
    </div>
  );
}

function AccessBadge({ userType }: { userType: string }) {
  const isDev = userType === 'DESENVOLVEDOR';

  return (
    <div className={cn(
      "relative overflow-hidden border-2 p-8",
      isDev ? "border-[#D4FF00] bg-[#D4FF00]/5" : "border-[#4A3AFF] bg-[#4A3AFF]/5"
    )}>
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className={cn(
          "flex-shrink-0 flex items-center justify-center w-20 h-20 border-4",
          isDev ? "bg-[#D4FF00] border-black" : "bg-[#4A3AFF] border-white"
        )}>
          <Shield size={40} className={isDev ? "text-black" : "text-white"} strokeWidth={2} />
        </div>

        <div className="flex-1 text-center md:text-left">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">
            NÍVEL_DE_ACESSO // AUTENTICADO
          </span>
          <div className={cn(
            "font-display font-black text-4xl tracking-tighter uppercase inline-block px-4 py-2 border-2",
            isDev
              ? "text-[#D4FF00] border-[#D4FF00] bg-[#D4FF00]/10"
              : "text-[#4A3AFF] border-[#4A3AFF] bg-[#4A3AFF]/10"
          )}>
            [ACESSO_{userType}]
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="font-mono text-xs text-zinc-400 text-right">
            <div className="mb-1">ID_USUÁRIO</div>
            <div className={cn(
              "font-bold text-lg",
              isDev ? "text-[#D4FF00]" : "text-[#4A3AFF]"
            )}>
              {USER_DATA.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationToggle({
  label,
  description,
  enabled,
  onChange
}: {
  label: string,
  description: string,
  enabled: boolean,
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 bg-[#0F1013] border border-[#2C2D35] hover:border-[#4A3AFF]/30 transition-colors group">
      <div className="flex-1">
        <div className="font-display font-bold text-white uppercase tracking-wide text-sm mb-1">
          {label}
        </div>
        <p className="font-mono text-[10px] text-zinc-500 uppercase leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <Switch
          checked={enabled}
          onCheckedChange={onChange}
          className={cn(
            "data-[state=checked]:bg-[#D4FF00] data-[state=unchecked]:bg-[#2C2D35]",
            "w-12 h-6 border-2 border-[#2C2D35] data-[state=checked]:border-[#D4FF00]",
            "!rounded-none"
          )}
        />
        <span className={cn(
          "font-mono text-[10px] font-bold uppercase tracking-widest",
          enabled ? "text-[#D4FF00]" : "text-zinc-600"
        )}>
          {enabled ? 'ATIVO' : 'INATIVO'}
        </span>
      </div>
    </div>
  );
}

// --- Sections ---
function SettingsHeader() {
  return (
    <header className="flex flex-col md:flex-row items-stretch border-b border-[#2C2D35] bg-[#0F1013] sticky top-0 z-40">
      <div className="flex items-center gap-3 p-4 md:px-6 md:w-64 border-b md:border-b-0 md:border-r border-[#2C2D35]">
        <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={24} />
        <h1 className="text-2xl font-black tracking-tighter uppercase text-white font-display">
          IndieTest
        </h1>
      </div>

      <div className="flex-1 flex overflow-x-auto no-scrollbar items-center px-4 md:px-6 justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dev" className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-[#2C2D35] p-2 bg-[#1C1D22]">
            <ArrowLeft size={16} /> VOLTAR_DASHBOARD
          </Link>
          <div className="h-4 w-px bg-[#2C2D35]" />
          <span className="font-mono text-xs text-[#D4FF00] font-bold tracking-widest">
            CONFIG_SISTEMA // RF11
          </span>
        </div>
      </div>
    </header>
  );
}

export function Settings() {
  // User Profile States
  const [nome, setNome] = useState(USER_DATA.nome);
  const [email, setEmail] = useState(USER_DATA.email);
  const [telefone, setTelefone] = useState(USER_DATA.telefone);

  // Notification States
  const [notifBugs, setNotifBugs] = useState(true);
  const [notifFeedback, setNotifFeedback] = useState(true);
  const [notifUpdates, setNotifUpdates] = useState(false);
  const [notifNewsletter, setNotifNewsletter] = useState(true);

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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

      /* Brutalist Switch Overrides */
      button[role="switch"] {
        border-radius: 0 !important;
      }
      button[role="switch"] [data-slot="switch-thumb"] {
        border-radius: 0 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Password change logic here
    console.log('Password change submitted');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Profile save logic here
    console.log('Profile saved');
  };

  return (
    <div className="min-h-screen bg-[#0F1013] text-white selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <SettingsHeader />

      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">

        {/* Título Principal */}
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter mb-2 flex items-center gap-4">
            <SettingsIcon className="text-[#4A3AFF]" size={48} />
            Configurações de <span className="text-[#D4FF00]">Sistema</span>
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase">
            Gerenciamento de Perfil e Preferências de Segurança
          </p>
        </div>

        {/* Badge de Atribuição */}
        <section className="mb-8">
          <AccessBadge userType={USER_DATA.tipoUsuario} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Coluna Esquerda */}
          <div className="space-y-8">

            {/* Dados de Identidade */}
            <section className="bg-[#1C1D22] border border-[#2C2D35] p-6">
              <SectionHeader title="Dados de Identidade" code="MODEL_USER" icon={User} />

              <form onSubmit={handleProfileSave} className="space-y-4">
                <TerminalInput
                  label="NOME_COMPLETO"
                  id="name"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  icon={User}
                  required
                />

                <TerminalInput
                  label="EMAIL_INSTITUCIONAL"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  required
                />

                <TerminalInput
                  label="TELEFONE_DE_CONTATO"
                  id="phone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  icon={Phone}
                />

                <TerminalInput
                  label="CPF"
                  id="cpf"
                  type="text"
                  value={USER_DATA.cpf}
                  icon={CreditCard}
                  readonly
                />

                <TerminalInput
                  label="DATA_DE_NASCIMENTO"
                  id="birthdate"
                  type="text"
                  value={USER_DATA.dataNascimento}
                  icon={Calendar}
                  readonly
                />

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full font-display font-bold uppercase tracking-widest px-6 py-3 bg-[#4A3AFF] text-white border border-[#4A3AFF] hover:bg-[#382bd6] shadow-[3px_3px_0_0_#D4FF00] active:shadow-[0_0_0_0_#D4FF00] active:translate-y-[2px] active:translate-x-[2px] transition-all"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </section>

            {/* Segurança de Criptografia */}
            <section className="bg-[#1C1D22] border border-[#2C2D35] p-6">
              <SectionHeader title="Segurança de Criptografia" code="RNF03" icon={Shield} />

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> SENHA_ATUAL
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group flex items-center border border-[#2C2D35] bg-[#0F1013] focus-within:border-[#D4FF00] transition-colors">
                    <div className="pl-3 pr-2 text-zinc-500">
                      <Lock size={16} strokeWidth={1.5} />
                    </div>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> NOVA_SENHA
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group flex items-center border border-[#2C2D35] bg-[#0F1013] focus-within:border-[#D4FF00] transition-colors">
                    <div className="pl-3 pr-2 text-zinc-500">
                      <Lock size={16} strokeWidth={1.5} />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> CONFIRMAR_NOVA_SENHA
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group flex items-center border border-[#2C2D35] bg-[#0F1013] focus-within:border-[#D4FF00] transition-colors">
                    <div className="pl-3 pr-2 text-zinc-500">
                      <Lock size={16} strokeWidth={1.5} />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-transparent text-white rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full font-display font-bold uppercase tracking-widest px-6 py-3 bg-[#D4FF00] text-black border-2 border-[#D4FF00] hover:bg-[#b8e000] transition-colors"
                  >
                    Atualizar Credenciais
                  </button>
                </div>

                {/* Security Footer */}
                <div className="mt-6 pt-4 border-t border-[#2C2D35]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-[#D4FF00] mt-0.5 flex-shrink-0" />
                    <p className="font-mono text-[10px] text-zinc-500 leading-relaxed">
                      Autenticação baseada em tokens JWT e criptografia ativa via algoritmo bcrypt.
                    </p>
                  </div>
                </div>
              </form>
            </section>

          </div>

          {/* Coluna Direita */}
          <div className="space-y-8">

            {/* Painel de Notificações */}
            <section className="bg-[#1C1D22] border border-[#2C2D35] p-6">
              <SectionHeader title="Painel de Notificações" code="RF12" icon={Bell} />

              <div className="space-y-3">
                <NotificationToggle
                  label="Alertas de Bugs Críticos"
                  description="Receba notificações por email quando bugs de prioridade crítica forem reportados em seus projetos"
                  enabled={notifBugs}
                  onChange={setNotifBugs}
                />

                <NotificationToggle
                  label="Novos Feedbacks de UX"
                  description="Seja notificado quando testadores submeterem novos depoimentos sobre suas aplicações"
                  enabled={notifFeedback}
                  onChange={setNotifFeedback}
                />

                <NotificationToggle
                  label="Atualizações de Sistema"
                  description="Receba alertas sobre manutenções programadas e novas funcionalidades da plataforma"
                  enabled={notifUpdates}
                  onChange={setNotifUpdates}
                />

                <NotificationToggle
                  label="Newsletter IndieTest"
                  description="Receba mensalmente insights sobre desenvolvimento indie e tendências do mercado"
                  enabled={notifNewsletter}
                  onChange={setNotifNewsletter}
                />
              </div>

              <div className="mt-6 pt-4 border-t border-[#2C2D35]">
                <button
                  type="button"
                  className="w-full font-display font-bold uppercase tracking-widest px-6 py-3 bg-[#1C1D22] text-white border border-[#2C2D35] hover:bg-[#25262c] hover:border-[#4A3AFF] transition-colors"
                >
                  Salvar Preferências
                </button>
              </div>
            </section>

            {/* Zona de Perigo */}
            <section className="bg-[#1C1D22] border-2 border-red-500/30 p-6 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'repeating-linear-gradient(-45deg, #ef4444, #ef4444 20px, transparent 20px, transparent 40px)'
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-red-500" size={24} />
                  <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">
                    Zona de Perigo
                  </h3>
                </div>

                <p className="font-mono text-xs text-zinc-400 mb-6 uppercase leading-relaxed">
                  Ações irreversíveis que afetam permanentemente sua conta e dados associados.
                </p>

                <button
                  type="button"
                  className="w-full font-display font-bold uppercase tracking-widest px-6 py-3 bg-red-500/10 text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  Desativar Conta
                </button>
              </div>
            </section>

          </div>

        </div>
      </main>
    </div>
  );
}
