import React, { useEffect, useState } from 'react';
import {
  Crosshair, ArrowLeft, Download, Bug, MessageSquare,
  Calendar, HardDrive, FileCode, Shield, ChevronDown,
  Package, AlertCircle, Clock, ExternalLink
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link, useNavigate } from 'react-router';

// --- Utils ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const PROJECT_DATA = {
  id: 'PRJ-001',
  nome: 'TREVIUM',
  categoria: 'JOGO (RPG)',
  desenvolvedor: {
    nome: 'PIXEL FORGE STUDIO',
    id: 'DEV-0081',
    logo: '🎮'
  },
  versaoAtual: 'V1.2.0',
  buildAtiva: {
    versao: 'V1.2.0',
    downloadUrl: 'https://res.cloudinary.com/demo/raw/upload/trevium_v1.2.0.zip',
    tamanho: '342 MB',
    dataLancamento: '2026-05-18_14:30',
    changelog: `• Corrigido memory leak crítico na transição de níveis
• Melhorias significativas de performance em RTX 3070+
• Novos efeitos de partículas para magias de fogo
• Balanceamento de dano das armas corpo-a-corpo
• Correção de 24 bugs reportados pela comunidade
• Novo sistema de autosave automático a cada 5 minutos`
  },
  descricao: `TREVIUM é um RPG de ação em terceira pessoa ambientado em um mundo cyberpunk distópico. Os jogadores assumem o papel de um hacker renegado que deve infiltrar corporações corruptas para descobrir a verdade por trás de uma conspiração global.

ESCOPO DO TESTE:
O foco principal é testar a estabilidade do sistema de combate, progressão de personagem e detecção de bugs críticos que possam quebrar a experiência do jogador. Atenção especial para memory leaks, crashes e problemas de performance.

REQUISITOS MÍNIMOS:
- SO: Windows 10 64-bit
- Processador: Intel i5-8400 / AMD Ryzen 5 2600
- Memória: 8 GB RAM
- Placa de vídeo: GTX 1060 6GB / RX 580 8GB
- DirectX: Versão 12
- Armazenamento: 15 GB disponível`,
  createdAt: '2026-03-15_10:00',
  historicoVersoes: [
    {
      versao: 'V1.2.0',
      data: '2026-05-18_14:30',
      status: 'ATUAL',
      changelog: `• Corrigido memory leak crítico na transição de níveis
• Melhorias significativas de performance em RTX 3070+
• Novos efeitos de partículas para magias de fogo
• Balanceamento de dano das armas corpo-a-corpo
• Correção de 24 bugs reportados pela comunidade
• Novo sistema de autosave automático a cada 5 minutos`
    },
    {
      versao: 'V1.1.9',
      data: '2026-05-10_09:15',
      status: 'ANTERIOR',
      changelog: `• Correção de bug de colisão no nível 3
• Ajustes no sistema de iluminação
• Melhorias na IA dos NPCs
• Correção de problemas de sincronização de áudio
• Otimização de uso de VRAM`
    },
    {
      versao: 'V1.1.5',
      data: '2026-05-01_16:45',
      status: 'ANTERIOR',
      changelog: `• Implementação do sistema de conquistas
• Novos modos de dificuldade: Fácil e Pesadelo
• Adição de 15 novas missões secundárias
• Melhorias no sistema de crafting
• Correção de bugs no sistema de inventário`
    },
    {
      versao: 'V1.0.8',
      data: '2026-04-20_11:20',
      status: 'ANTERIOR',
      changelog: `• Primeira build estável para testes externos
• Sistema completo de combate implementado
• 8 níveis jogáveis disponíveis
• Sistema de progressão de personagem funcional
• Tutorial inicial completamente implementado`
    }
  ]
};

// --- Components ---
function TechnicalLabel({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("text-[10px] font-mono text-[#D4FF00] bg-[#D4FF00]/10 px-1 border border-[#D4FF00]/20 inline-flex items-center gap-1", className)}>
      {children}
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = 'primary'
}: {
  icon: any,
  label: string,
  onClick: () => void,
  variant?: 'primary' | 'secondary' | 'danger'
}) {
  const variants = {
    primary: 'bg-[#D4FF00] text-black border-[#D4FF00] hover:bg-[#b8e000] shadow-[4px_4px_0_0_#4A3AFF]',
    secondary: 'bg-[#4A3AFF] text-white border-[#4A3AFF] hover:bg-[#382bd6] shadow-[3px_3px_0_0_#D4FF00]',
    danger: 'bg-red-500 text-white border-red-500 hover:bg-red-600 shadow-[3px_3px_0_0_#D4FF00]'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full font-display font-bold uppercase tracking-widest px-6 py-4 border-2 transition-all active:shadow-none active:translate-y-[2px] active:translate-x-[2px] flex items-center justify-center gap-3 text-lg",
        variants[variant]
      )}
    >
      <Icon size={24} strokeWidth={2.5} />
      {label}
    </button>
  );
}

function VersionCard({ version }: { version: typeof PROJECT_DATA.historicoVersoes[0] }) {
  const [isExpanded, setIsExpanded] = useState(version.status === 'ATUAL');

  return (
    <div className={cn(
      "bg-[#1C1D22] border-2 transition-colors",
      version.status === 'ATUAL' ? "border-[#D4FF00]" : "border-[#2C2D35] hover:border-[#4A3AFF]"
    )}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-[#25262c] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "font-display font-black text-2xl tracking-tighter",
            version.status === 'ATUAL' ? "text-[#D4FF00]" : "text-white"
          )}>
            {version.versao}
          </div>
          {version.status === 'ATUAL' && (
            <TechnicalLabel className="text-[#D4FF00] bg-[#D4FF00]/10 border-[#D4FF00]/30">
              BUILD_ATIVA
            </TechnicalLabel>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-zinc-500 flex items-center gap-2">
            <Clock size={14} />
            {version.data}
          </div>
          <ChevronDown
            size={20}
            className={cn(
              "text-zinc-500 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Changelog */}
      {isExpanded && (
        <div className="border-t border-[#2C2D35] p-4 bg-[#0F1013]">
          <div className="font-mono text-[10px] text-zinc-500 uppercase mb-3 flex items-center gap-2">
            <FileCode size={14} />
            NOTAS_DE_ATUALIZAÇÃO
          </div>
          <pre className="font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
{version.changelog}
          </pre>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
export function ProjectDetails() {
  const navigate = useNavigate();

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

      /* Animated Grid */
      @keyframes grid-pulse {
        0%, 100% { opacity: 0.05; }
        50% { opacity: 0.1; }
      }
      .animated-grid {
        animation: grid-pulse 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleDownload = () => {
    // Simular download
    console.log('Iniciando download:', PROJECT_DATA.buildAtiva.downloadUrl);
    alert('Download iniciado! Arquivo: ' + PROJECT_DATA.buildAtiva.versao);
  };

  return (
    <div className="min-h-screen bg-[#0F1013] text-white selection:bg-[#D4FF00] selection:text-black flex flex-col">

      {/* Header Principal */}
      <header className="flex flex-col md:flex-row items-stretch border-b border-[#2C2D35] bg-[#0F1013] sticky top-0 z-40">
        <div className="flex items-center gap-3 p-4 md:px-6 md:w-64 border-b md:border-b-0 md:border-r border-[#2C2D35]">
          <Crosshair className="text-[#D4FF00]" strokeWidth={1.5} size={24} />
          <h1 className="text-2xl font-black tracking-tighter uppercase text-white font-display">
            IndieTest
          </h1>
        </div>

        <div className="flex-1 flex overflow-x-auto no-scrollbar items-center px-4 md:px-6 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-[#2C2D35] p-2 bg-[#1C1D22]"
            >
              <ArrowLeft size={16} /> VOLTAR_DASHBOARD
            </button>
            <div className="h-4 w-px bg-[#2C2D35]" />
            <span className="font-mono text-xs text-[#D4FF00] font-bold tracking-widest">
              DETALHES_PROJETO // RN05
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8">

        {/* Cabeçalho do Software (Main Banner) */}
        <section className="mb-8 bg-[#1C1D22] border-2 border-[#4A3AFF] p-8 relative overflow-hidden">
          {/* Background Grid Animado */}
          <div
            className="absolute inset-0 animated-grid"
            style={{
              backgroundImage: 'linear-gradient(#4A3AFF 1px, transparent 1px), linear-gradient(90deg, #4A3AFF 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Logo/Selo do Desenvolvedor */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#D4FF00] border-4 border-black flex items-center justify-center text-5xl">
                {PROJECT_DATA.desenvolvedor.logo}
              </div>
              <div>
                <div className="font-mono text-[10px] text-zinc-500 uppercase mb-1">
                  DESENVOLVEDOR
                </div>
                <div className="font-display font-bold text-white uppercase text-lg tracking-wide">
                  {PROJECT_DATA.desenvolvedor.nome}
                </div>
                <div className="font-mono text-xs text-zinc-600">
                  {PROJECT_DATA.desenvolvedor.id}
                </div>
              </div>
            </div>

            {/* Nome do Projeto */}
            <div className="text-center">
              <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">
                PROJETO_ID: {PROJECT_DATA.id}
              </div>
              <h1 className="font-display font-black text-6xl tracking-tighter uppercase text-[#D4FF00] mb-2">
                {PROJECT_DATA.nome}
              </h1>
              <div className="font-display font-bold text-xl text-[#4A3AFF] uppercase tracking-wide">
                {PROJECT_DATA.categoria}
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-end">
              <div className="bg-[#0F1013] border border-[#D4FF00] p-4">
                <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">
                  STATUS
                </div>
                <div className="font-display font-black text-2xl text-[#D4FF00] uppercase tracking-tight flex items-center gap-2">
                  <Package size={24} />
                  DISPONÍVEL
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Coluna Principal (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Painel de Download Central (RN05) */}
            <section className="bg-[#0F1013] border-4 border-[#D4FF00] p-8 relative overflow-hidden">
              {/* Hazard Stripes */}
              <div
                className="absolute top-0 right-0 w-full h-2"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #D4FF00, #D4FF00 20px, #000 20px, #000 40px)'
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-full h-2"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #D4FF00, #D4FF00 20px, #000 20px, #000 40px)'
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2 flex items-center gap-2">
                      <Download size={14} />
                      PAINEL_DE_DOWNLOAD
                    </div>
                    <h2 className="font-display font-black text-3xl text-white uppercase tracking-tight">
                      Ação Crítica
                    </h2>
                  </div>
                  <TechnicalLabel className="text-orange-500 bg-orange-500/10 border-orange-500/30">
                    RN05_OBRIGATÓRIO
                  </TechnicalLabel>
                </div>

                {/* Build Ativa */}
                <div className="bg-[#1C1D22] border border-[#2C2D35] p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">
                        BUILD_ATIVA
                      </div>
                      <div className="font-display font-black text-4xl text-[#D4FF00] tracking-tighter">
                        {PROJECT_DATA.buildAtiva.versao}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">
                        TAMANHO_ARQUIVO
                      </div>
                      <div className="font-mono text-2xl text-white font-bold flex items-center gap-2">
                        <HardDrive size={20} className="text-[#4A3AFF]" />
                        {PROJECT_DATA.buildAtiva.tamanho}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">
                        DATA_LANÇAMENTO
                      </div>
                      <div className="font-mono text-sm text-white flex items-center gap-2">
                        <Calendar size={16} className="text-[#4A3AFF]" />
                        {PROJECT_DATA.buildAtiva.dataLancamento}
                      </div>
                    </div>
                  </div>

                  {/* Botão de Download */}
                  <ActionButton
                    icon={Download}
                    label=" BAIXAR_SOFTWARE_BINÁRIO"
                    onClick={handleDownload}
                    variant="primary"
                  />
                </div>

                {/* Aviso */}
                <div className="flex items-start gap-3 bg-[#1C1D22] border-l-2 border-[#D4FF00] p-4">
                  <AlertCircle size={18} className="text-[#D4FF00] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-display font-bold text-sm text-white uppercase mb-1">
                      Download Seguro via Cloudinary
                    </div>
                    <p className="font-mono text-[10px] text-zinc-400 uppercase leading-relaxed">
                      O arquivo será baixado através de conexão segura. Certifique-se de ter espaço suficiente em disco antes de prosseguir.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Especificações e Dados do Escopo */}
            <section className="bg-[#1C1D22] border border-[#2C2D35]">
              <div className="border-b border-[#2C2D35] p-4 bg-[#0F1013]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="text-[#4A3AFF]" size={20} />
                    <h2 className="font-display font-black text-white uppercase text-lg tracking-tight">
                      Especificações e Escopo
                    </h2>
                  </div>
                  <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">
                    MODEL_PROJETO
                  </TechnicalLabel>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  {/* Descrição Detalhada */}
                  <div>
                    <div className="font-mono text-[10px] text-zinc-500 uppercase mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" />
                      DESCRIÇÃO_DETALHADA
                    </div>
                    <div className="bg-[#0F1013] border border-[#2C2D35] p-4">
                      <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
{PROJECT_DATA.descricao}
                      </pre>
                    </div>
                  </div>

                  {/* Grid de Metadados */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#2C2D35]">
                    <div className="p-4 border-b md:border-b-0 md:border-r border-[#2C2D35] bg-[#0F1013]">
                      <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">
                        TAMANHO
                      </div>
                      <div className="font-display font-black text-2xl text-white">
                        {PROJECT_DATA.buildAtiva.tamanho}
                      </div>
                    </div>
                    <div className="p-4 border-b md:border-b-0 md:border-r border-[#2C2D35] bg-[#0F1013]">
                      <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">
                        VERSÃO_ATUAL
                      </div>
                      <div className="font-display font-black text-2xl text-[#D4FF00]">
                        {PROJECT_DATA.versaoAtual}
                      </div>
                    </div>
                    <div className="p-4 bg-[#0F1013]">
                      <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">
                        CRIADO_EM
                      </div>
                      <div className="font-mono text-sm text-white">
                        {PROJECT_DATA.createdAt}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Histórico de Versões & Changelog */}
            <section className="bg-[#1C1D22] border border-[#2C2D35]">
              <div className="border-b border-[#2C2D35] p-4 bg-[#0F1013]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="text-[#4A3AFF]" size={20} />
                    <h2 className="font-display font-black text-white uppercase text-lg tracking-tight">
                      Histórico de Versões
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">
                      MODEL_VERSAO
                    </TechnicalLabel>
                    <span className="font-mono text-xs text-zinc-500">
                      {PROJECT_DATA.historicoVersoes.length} BUILDS
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {PROJECT_DATA.historicoVersoes.map((version, index) => (
                  <VersionCard key={index} version={version} />
                ))}
              </div>
            </section>

          </div>

          {/* Barra Lateral de Atalhos Operacionais */}
          <div className="space-y-6">

            {/* Menu de Ações */}
            <section className="bg-[#1C1D22] border border-[#2C2D35] sticky top-24">
              <div className="border-b border-[#2C2D35] p-4 bg-[#0F1013]">
                <div className="flex items-center gap-2">
                  <Shield className="text-[#D4FF00]" size={20} />
                  <h2 className="font-display font-black text-white uppercase text-sm tracking-tight">
                    Atalhos Operacionais
                  </h2>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <ActionButton
                  icon={Bug}
                  label=" REPORTAR_BUG"
                  onClick={() => navigate('/report-bug')}
                  variant="secondary"
                />

                <ActionButton
                  icon={MessageSquare}
                  label=" ENVIAR_FEEDBACK_UX"
                  onClick={() => navigate('/feedback')}
                  variant="secondary"
                />

                <div className="pt-3 border-t border-[#2C2D35]">
                  <Link
                    to="/bug-tracker"
                    className="w-full font-mono text-xs uppercase px-4 py-3 bg-[#0F1013] text-zinc-400 border border-[#2C2D35] hover:border-[#4A3AFF] hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} />
                    Ver Bug Tracker
                  </Link>
                </div>
              </div>
            </section>

            {/* Info Box */}
            <section className="bg-[#1C1D22] border border-[#2C2D35] p-4">
              <div className="font-mono text-[10px] text-zinc-500 uppercase mb-3">
                INFORMAÇÕES_ADICIONAIS
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#D4FF00] mt-1 shrink-0" />
                  <p className="text-zinc-400 leading-relaxed">
                    Após o download, extraia os arquivos e execute o instalador.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#4A3AFF] mt-1 shrink-0" />
                  <p className="text-zinc-400 leading-relaxed">
                    Reporte todos os bugs encontrados através do formulário oficial.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#D4FF00] mt-1 shrink-0" />
                  <p className="text-zinc-400 leading-relaxed">
                    Seu feedback é essencial para melhorar a qualidade do software.
                  </p>
                </div>
              </div>
            </section>

          </div>

        </div>

      </main>
    </div>
  );
}
