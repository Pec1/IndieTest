import React, { useState } from 'react';
import { Crosshair, User, Shield, Bell, Lock, Mail, Phone, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { SectionHeader } from '../components/ui/SectionHeader';
import { AppHeader } from '../components/ui/AppHeader';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { Palette } from 'lucide-react';

function ReadonlyField({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="space-y-2">
      <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> {label}
      </label>
      <div className="relative group flex items-center border border-zinc-700 bg-zinc-900/30 transition-colors">
        <div className="pl-3 pr-2 text-it-muted"><Icon size={16} strokeWidth={1.5} /></div>
        <input type="text" value={value} readOnly className="w-full bg-transparent text-it-muted rounded-none py-3 px-2 font-mono text-sm outline-none cursor-not-allowed" />
        <div className="pr-3 text-zinc-700"><Lock size={14} /></div>
      </div>
    </div>
  );
}

function NotificationToggle({ label, description, enabled, onChange }: { label: string; description: string; enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 bg-it-page border border-it-border hover:border-[#4A3AFF]/30 transition-colors group">
      <div className="flex-1">
        <div className="font-display font-bold text-it-text uppercase tracking-wide text-sm mb-1">{label}</div>
        <p className="font-mono text-[10px] text-it-muted uppercase leading-relaxed">{description}</p>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <button type="button" onClick={() => onChange(!enabled)}
          className={cn("w-12 h-6 border-2 transition-colors relative", enabled ? "bg-[#D4FF00] border-[#D4FF00]" : "bg-it-page border-it-border")}>
          <div className={cn("absolute top-0.5 w-4 h-4 bg-black transition-all", enabled ? "left-[calc(100%-1.125rem)]" : "left-0.5")} />
        </button>
        <span className={cn("font-mono text-[10px] font-bold uppercase tracking-widest", enabled ? "text-[#D4FF00]" : "text-it-muted")}>
          {enabled ? 'ATIVO' : 'INATIVO'}
        </span>
      </div>
    </div>
  );
}

export function Settings() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const [notifBugs, setNotifBugs] = useState(true);
  const [notifFeedback, setNotifFeedback] = useState(true);
  const [notifUpdates, setNotifUpdates] = useState(false);
  const [notifNewsletter, setNotifNewsletter] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  const isDev = user?.tipo === 'desenvolvedor';

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setErroSenha('');
    if (newPassword !== confirmPassword) { setErroSenha('As senhas não coincidem'); return; }
    if (newPassword.length < 6) { setErroSenha('A nova senha deve ter ao menos 6 caracteres'); return; }
    alert('Funcionalidade de troca de senha não disponível nesta versão.');
  }

  return (
    <div className="min-h-screen bg-it-page text-it-text selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <AppHeader>
        <AppHeader.Brand />
        <AppHeader.Nav className="justify-between gap-4">
          <AppHeader.NavLabel>CONFIG_SISTEMA</AppHeader.NavLabel>
          <AppHeader.Utilities hideSettings />
        </AppHeader.Nav>
      </AppHeader>
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter mb-2">
            Configurações de <span className="text-[#D4FF00]">Sistema</span>
          </h1>
          <p className="font-mono text-xs text-it-muted uppercase">Gerenciamento de Perfil e Preferências de Segurança</p>
        </div>
        <section className="mb-8">
          <div className={cn("relative overflow-hidden border-2 p-8", isDev ? "border-[#D4FF00] bg-[#D4FF00]/5" : "border-[#4A3AFF] bg-[#4A3AFF]/5")}>
            <div className="absolute inset-0 opacity-[0.07] it-grid-pattern" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className={cn("flex-shrink-0 flex items-center justify-center w-20 h-20 border-4", isDev ? "bg-[#D4FF00] border-black" : "bg-[#4A3AFF] border-white")}>
                <Shield size={40} className={isDev ? "text-black" : "text-on-brand"} strokeWidth={2} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="font-mono text-[10px] text-it-muted uppercase tracking-widest block mb-2">NÍVEL_DE_ACESSO // AUTENTICADO</span>
                <div className={cn("font-display font-black text-4xl tracking-tighter uppercase inline-block px-4 py-2 border-2",
                  isDev ? "text-[#D4FF00] border-[#D4FF00] bg-[#D4FF00]/10" : "text-[#4A3AFF] border-[#4A3AFF] bg-[#4A3AFF]/10")}>
                  [ACESSO_{user?.tipo?.toUpperCase()}]
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="font-mono text-xs text-it-muted text-right">
                  <div className="mb-1">EMAIL</div>
                  <div className={cn("font-bold text-sm", isDev ? "text-[#D4FF00]" : "text-[#4A3AFF]")}>{user?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <section className="bg-it-surface border border-it-border p-6">
              <SectionHeader title="Aparência" icon={Palette} className="pb-3 mt-0" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-it-page border border-it-border">
                <div>
                  <div className="font-display font-bold text-it-text uppercase tracking-wide text-sm mb-1">Modo de interface</div>
                  <p className="font-mono text-[10px] text-it-muted uppercase leading-relaxed">
                    Atual: {theme === 'light' ? 'CLARO' : 'ESCURO'} — preferência salva neste navegador
                  </p>
                </div>
                <ThemeToggle showLabel className="px-4 py-3" />
              </div>
            </section>
            <section className="bg-it-surface border border-it-border p-6">
              <SectionHeader title="Dados de Identidade" icon={User} className="pb-3" />
              <div className="space-y-4">
                <ReadonlyField label="NOME_COMPLETO" value={user?.nome || ''} icon={User} />
                <ReadonlyField label="EMAIL_INSTITUCIONAL" value={user?.email || ''} icon={Mail} />
                {user?.desenvolvedor && <ReadonlyField label="NOME_DO_ESTÚDIO" value={user.desenvolvedor.nomeEstudio} icon={Phone} />}
                {user?.testador?.pais && <ReadonlyField label="PAÍS" value={user.testador.pais} icon={Phone} />}
                <div className="flex items-start gap-2 bg-it-page border border-it-border p-3 mt-4">
                  <CheckCircle2 size={14} className="text-[#D4FF00] mt-0.5 flex-shrink-0" />
                  <p className="font-mono text-[10px] text-it-muted uppercase leading-relaxed">
                    Edição de perfil não disponível nesta versão. Entre em contato com o administrador para alterações.
                  </p>
                </div>
              </div>
            </section>
            <section className="bg-it-surface border border-it-border p-6">
              <SectionHeader title="Segurança de Criptografia" icon={Shield} className="pb-3" />
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {erroSenha && <div className="bg-red-500/10 border border-red-500/30 p-3 font-mono text-xs text-red-400">{erroSenha}</div>}
                {['SENHA_ATUAL', 'NOVA_SENHA', 'CONFIRMAR_NOVA_SENHA'].map((label, i) => {
                  const vals = [currentPassword, newPassword, confirmPassword];
                  const setters = [setCurrentPassword, setNewPassword, setConfirmPassword];
                  return (
                    <div key={label} className="space-y-2">
                      <label className="font-mono text-[10px] font-bold uppercase text-it-muted tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" /> {label} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group flex items-center border border-it-border bg-it-page focus-within:border-[#D4FF00] transition-colors">
                        <div className="pl-3 pr-2 text-it-muted"><Lock size={16} strokeWidth={1.5} /></div>
                        <input type="password" value={vals[i]} onChange={e => setters[i](e.target.value)} required placeholder="••••••••"
                          className="w-full bg-transparent text-it-text rounded-none py-3 px-2 font-mono text-sm outline-none placeholder:text-it-muted" />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-4">
                  <button type="submit" className="w-full font-display font-bold uppercase tracking-widest px-6 py-3 bg-[#D4FF00] text-black border-2 border-[#D4FF00] hover:bg-[#b8e000] transition-colors">
                    Atualizar Credenciais
                  </button>
                </div>
                <div className="mt-6 pt-4 border-t border-it-border">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-[#D4FF00] mt-0.5 flex-shrink-0" />
                    <p className="font-mono text-[10px] text-it-muted leading-relaxed">Autenticação baseada em tokens JWT e criptografia ativa via algoritmo bcrypt.</p>
                  </div>
                </div>
              </form>
            </section>
          </div>
          <div className="space-y-8">
            <section className="bg-it-surface border border-it-border p-6">
              <SectionHeader title="Painel de Notificações" icon={Bell} className="pb-3" />
              <div className="space-y-3">
                <NotificationToggle label="Alertas de Bugs Críticos" description="Receba notificações quando bugs críticos forem reportados em seus projetos" enabled={notifBugs} onChange={setNotifBugs} />
                <NotificationToggle label="Novos Feedbacks de UX" description="Seja notificado quando testadores submeterem novos depoimentos" enabled={notifFeedback} onChange={setNotifFeedback} />
                <NotificationToggle label="Atualizações de Sistema" description="Receba alertas sobre manutenções programadas e novas funcionalidades" enabled={notifUpdates} onChange={setNotifUpdates} />
                <NotificationToggle label="Newsletter IndieTest" description="Receba mensalmente insights sobre desenvolvimento indie" enabled={notifNewsletter} onChange={setNotifNewsletter} />
              </div>
              <div className="mt-6 pt-4 border-t border-it-border">
                <button type="button" className="w-full font-display font-bold uppercase tracking-widest px-6 py-3 bg-it-surface text-it-text border border-it-border hover:bg-it-elevated hover:border-[#4A3AFF] transition-colors">
                  Salvar Preferências
                </button>
              </div>
            </section>
            <section className="bg-it-surface border-2 border-red-500/30 p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #ef4444, #ef4444 20px, transparent 20px, transparent 40px)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-red-500" size={24} />
                  <h3 className="font-display font-black text-xl text-it-text uppercase tracking-tight">Zona de Perigo</h3>
                </div>
                <p className="font-mono text-xs text-it-muted mb-6 uppercase leading-relaxed">Ações irreversíveis que afetam permanentemente sua conta e dados associados.</p>
                <button type="button" onClick={() => { if (confirm('Tem certeza? Esta ação é irreversível.')) signOut(); }}
                  className="w-full font-display font-bold uppercase tracking-widest px-6 py-3 bg-red-500/10 text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-it-text transition-all">
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
