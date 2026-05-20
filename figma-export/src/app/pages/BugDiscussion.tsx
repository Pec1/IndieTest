import React, { useEffect, useState, useRef } from 'react';
import {
  Crosshair, ArrowLeft, AlertTriangle, FileWarning,
  MessageSquare, Send, Shield, Lock, User,
  Calendar, Terminal, Image as ImageIcon, ChevronDown
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link, useNavigate } from 'react-router';

// --- Utils ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const BUG_DATA = {
  id: '#401_CRITICAL',
  titulo: 'Memory Leak on Level Transition',
  projeto: 'TREVIUM',
  versao: 'V1.2.0',
  timestamp: '2026-05-19_13:25',
  severidade: 'critical',
  status: 'investigating',
  reportadoPor: {
    id: 'TST-0423',
    nome: 'GHOST_RUNNER_88',
    tipo: 'TESTADOR'
  },
  descricao: `PASSOS PARA REPRODUÇÃO:

1. INICIAR NOVO JOGO NO MODO HISTÓRIA
2. COMPLETAR TODAS AS MISSÕES DO NÍVEL 2
3. AGUARDAR TRANSIÇÃO AUTOMÁTICA PARA O NÍVEL 3
4. OBSERVAR TRAVAMENTO APÓS APROXIMADAMENTE 120 SEGUNDOS

RESULTADO ESPERADO:
Transição suave entre níveis sem impacto na performance.

RESULTADO OBTIDO:
O consumo de memória RAM aumenta exponencialmente de 2GB para 8GB em questão de segundos, causando travamento completo do jogo. O processo não responde e precisa ser finalizado via gerenciador de tarefas.

FREQUÊNCIA:
Reproduzível em 100% das tentativas.

AMBIENTE:
- SO: Windows 11 Pro (Build 22621)
- CPU: Intel i7-12700K
- RAM: 16GB DDR4
- GPU: RTX 3070 Ti

LOGS ANEXADOS:
Ver arquivos memory_dump.log e crash_report.txt`,
  anexos: [
    {
      id: 'ANX-001',
      tipo: 'image',
      nome: 'screenshot_crash_001.png',
      url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      tamanho: '2.4 MB',
      timestamp: '2026-05-19_13:27'
    },
    {
      id: 'ANX-002',
      tipo: 'log',
      nome: 'memory_dump.log',
      url: '#',
      tamanho: '856 KB',
      timestamp: '2026-05-19_13:28'
    },
    {
      id: 'ANX-003',
      tipo: 'log',
      nome: 'crash_report.txt',
      url: '#',
      tamanho: '124 KB',
      timestamp: '2026-05-19_13:28'
    },
    {
      id: 'ANX-004',
      tipo: 'image',
      nome: 'task_manager_ram.png',
      url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      tamanho: '1.8 MB',
      timestamp: '2026-05-19_13:29'
    }
  ],
  comentarios: [
    {
      id: 'MSG-001',
      autor: {
        id: 'DEV-0081',
        nome: 'RAFAEL_SANTOS',
        tipo: 'DESENVOLVEDOR'
      },
      mensagem: 'Confirmado. Identificado possível leak no sistema de partículas durante a transição. Estou investigando o código do GarbageCollector.',
      timestamp: '2026-05-19_14:12'
    },
    {
      id: 'MSG-002',
      autor: {
        id: 'TST-0423',
        nome: 'GHOST_RUNNER_88',
        tipo: 'TESTADOR'
      },
      mensagem: 'Realizei novos testes em build Linux (Ubuntu 24.04). Mesmo comportamento observado. O leak é consistente entre plataformas.',
      timestamp: '2026-05-19_14:45'
    },
    {
      id: 'MSG-003',
      autor: {
        id: 'DEV-0092',
        nome: 'JULIA_TECH',
        tipo: 'DESENVOLVEDOR'
      },
      mensagem: 'Encontrei o problema. O sistema de streaming de assets não está liberando texturas do nível anterior. Preparando fix na branch hotfix/memory-leak-401.',
      timestamp: '2026-05-19_15:20'
    },
    {
      id: 'MSG-004',
      autor: {
        id: 'MOD-0001',
        nome: 'SYSTEM_ADMIN',
        tipo: 'MODERADOR'
      },
      mensagem: 'PRIORIDADE MÁXIMA. Este bug está bloqueando o release da versão 1.2.1. Aguardando merge do fix para testes de validação.',
      timestamp: '2026-05-19_16:05'
    }
  ]
};

const STATUS_OPTIONS = [
  { id: 'open', label: 'ABERTO', color: '#D4FF00' },
  { id: 'investigating', label: 'INVESTIGANDO', color: '#4A3AFF' },
  { id: 'fixed', label: 'CORRIGIDO', color: '#10b981' },
  { id: 'closed', label: 'FECHADO', color: '#6b7280' },
];

// --- Components ---
function TechnicalLabel({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("text-[10px] font-mono text-[#D4FF00] bg-[#D4FF00]/10 px-1 border border-[#D4FF00]/20 inline-flex items-center gap-1", className)}>
      {children}
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors = {
    critical: 'bg-red-500/10 text-red-500 border-red-500',
    high: 'bg-orange-500/10 text-orange-500 border-orange-500',
    medium: 'bg-[#D4FF00]/10 text-[#D4FF00] border-[#D4FF00]',
    low: 'bg-zinc-500/10 text-zinc-500 border-zinc-500',
  };

  const labels = {
    critical: 'CRÍTICA',
    high: 'ALTA',
    medium: 'MÉDIA',
    low: 'BAIXA',
  };

  return (
    <div className={cn(
      "font-display font-black text-lg uppercase px-4 py-2 border-2 inline-flex items-center gap-2",
      colors[severity as keyof typeof colors]
    )}>
      <AlertTriangle size={20} strokeWidth={2.5} />
      SEVERIDADE: {labels[severity as keyof typeof labels]}
    </div>
  );
}

function UserBadge({ tipo }: { tipo: string }) {
  const colors = {
    TESTADOR: 'text-[#4A3AFF] border-[#4A3AFF] bg-[#4A3AFF]/10',
    DESENVOLVEDOR: 'text-[#D4FF00] border-[#D4FF00] bg-[#D4FF00]/10',
    MODERADOR: 'text-red-500 border-red-500 bg-red-500/10',
  };

  return (
    <span className={cn(
      "font-mono text-[10px] font-bold uppercase px-2 py-0.5 border",
      colors[tipo as keyof typeof colors] || 'text-zinc-500 border-zinc-500 bg-zinc-500/10'
    )}>
      [{tipo}]
    </span>
  );
}

function CommentBlock({ comment }: { comment: typeof BUG_DATA.comentarios[0] }) {
  return (
    <div className="bg-[#1C1D22] border border-[#2C2D35] p-4 hover:border-[#4A3AFF]/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3 pb-3 border-b border-[#2C2D35]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display font-bold text-white uppercase text-sm">
            {comment.autor.nome}
          </span>
          <UserBadge tipo={comment.autor.tipo} />
          <span className="font-mono text-[10px] text-zinc-600">
            {comment.autor.id}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
          <Calendar size={12} />
          {comment.timestamp}
        </div>
      </div>

      {/* Mensagem */}
      <div className="relative">
        <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-[#4A3AFF] to-transparent opacity-50" />
        <pre className="font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap pl-2">
{comment.mensagem}
        </pre>
      </div>
    </div>
  );
}

// --- Main Component ---
export function BugDiscussion() {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState(BUG_DATA.status);
  const [isModerator] = useState(false); // Simular usuário não-moderador
  const [newMessage, setNewMessage] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      /* Hazard Stripes Animation */
      @keyframes slide-hazard {
        0% { background-position: 0 0; }
        100% { background-position: 40px 0; }
      }
      .hazard-stripes {
        animation: slide-hazard 1s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Aqui enviaria a mensagem para o backend
      console.log('Enviando mensagem:', newMessage);
      setNewMessage('');
      setTimeout(scrollToBottom, 100);
    }
  };

  const currentStatusData = STATUS_OPTIONS.find(s => s.id === currentStatus);

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
              onClick={() => navigate('/bug-tracker')}
              className="flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-[#2C2D35] p-2 bg-[#1C1D22]"
            >
              <ArrowLeft size={16} /> VOLTAR_TRACKER
            </button>
            <div className="h-4 w-px bg-[#2C2D35]" />
            <span className="font-mono text-xs text-[#D4FF00] font-bold tracking-widest">
              DISCUSSÃO_TÉCNICA // RF15
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8">

        {/* Cabeçalho de Identificação (Header Técnico) */}
        <section className="mb-6 bg-[#1C1D22] border-2 border-[#D4FF00] p-6 relative overflow-hidden">
          {/* Background Grid */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(#D4FF00 1px, transparent 1px), linear-gradient(90deg, #D4FF00 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bug ID */}
            <div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2 flex items-center gap-1">
                <Terminal size={12} /> BUG_ID
              </div>
              <div className="font-display font-black text-3xl text-[#D4FF00] tracking-tighter">
                {BUG_DATA.id}
              </div>
            </div>

            {/* Timestamp */}
            <div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2 flex items-center gap-1">
                <Calendar size={12} /> DATA_RELATÓRIO
              </div>
              <div className="font-mono text-lg text-white">
                {BUG_DATA.timestamp}
              </div>
            </div>

            {/* Projeto */}
            <div>
              <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2 flex items-center gap-1">
                <Shield size={12} /> PROJETO
              </div>
              <div className="font-display font-black text-2xl text-[#4A3AFF] uppercase tracking-wide">
                {BUG_DATA.projeto}
              </div>
              <div className="font-mono text-xs text-zinc-400 mt-1">
                VERSÃO: {BUG_DATA.versao}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Coluna Principal (2/3) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Metadados e Diagnóstico (RN02) */}
            <section className="bg-[#1C1D22] border border-[#2C2D35]">
              <div className="border-b border-[#2C2D35] p-4 bg-[#0F1013]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileWarning className="text-[#4A3AFF]" size={20} />
                    <h2 className="font-display font-black text-white uppercase text-lg tracking-tight">
                      Metadados e Diagnóstico
                    </h2>
                  </div>
                  <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">
                    RN02_OBRIGATÓRIO
                  </TechnicalLabel>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Título */}
                <div className="border-l-2 border-[#D4FF00] pl-4">
                  <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">
                    TÍTULO_DO_ERRO
                  </div>
                  <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                    {BUG_DATA.titulo}
                  </h3>
                </div>

                {/* Severidade */}
                <div>
                  <SeverityBadge severity={BUG_DATA.severidade} />
                </div>

                {/* Descrição Detalhada */}
                <div>
                  <div className="font-mono text-[10px] text-zinc-500 uppercase mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#4A3AFF] inline-block" />
                    DESCRIÇÃO_E_PASSOS_DE_REPRODUÇÃO
                  </div>
                  <div className="bg-[#0F1013] border border-[#2C2D35] p-4">
                    <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
{BUG_DATA.descricao}
                    </pre>
                  </div>
                </div>

                {/* Reportado Por */}
                <div className="flex items-center gap-4 pt-4 border-t border-[#2C2D35]">
                  <User size={16} className="text-zinc-500" />
                  <div>
                    <span className="font-mono text-[10px] text-zinc-500 uppercase">
                      Reportado por:{' '}
                    </span>
                    <span className="font-display font-bold text-white uppercase">
                      {BUG_DATA.reportadoPor.nome}
                    </span>
                    <UserBadge tipo={BUG_DATA.reportadoPor.tipo} />
                    <span className="font-mono text-[10px] text-zinc-600 ml-2">
                      {BUG_DATA.reportadoPor.id}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Repositório de Evidências Visuais (RF08) */}
            <section className="bg-[#1C1D22] border border-[#2C2D35]">
              <div className="border-b border-[#2C2D35] p-4 bg-[#0F1013]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="text-[#4A3AFF]" size={20} />
                    <h2 className="font-display font-black text-white uppercase text-lg tracking-tight">
                      Repositório de Evidências
                    </h2>
                  </div>
                  <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">
                    RF08_CLOUDINARY
                  </TechnicalLabel>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BUG_DATA.anexos.map((anexo) => (
                    <div
                      key={anexo.id}
                      className="bg-[#0F1013] border border-[#2C2D35] p-4 hover:border-[#D4FF00] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {anexo.tipo === 'image' ? (
                          <div className="flex-shrink-0 w-10 h-10 bg-[#D4FF00]/10 border border-[#D4FF00] flex items-center justify-center">
                            <ImageIcon size={20} className="text-[#D4FF00]" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-10 h-10 bg-zinc-700/30 border border-zinc-600 flex items-center justify-center">
                            <Terminal size={20} className="text-zinc-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-xs text-white font-bold truncate">
                            {anexo.nome}
                          </div>
                          <div className="font-mono text-[10px] text-zinc-500 uppercase mt-1">
                            {anexo.tipo} • {anexo.tamanho}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600">
                        <span>{anexo.id}</span>
                        <span>{anexo.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Mural de Discussão Técnica (RF15) */}
            <section className="bg-[#1C1D22] border border-[#2C2D35]">
              <div className="border-b border-[#2C2D35] p-4 bg-[#0F1013]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="text-[#4A3AFF]" size={20} />
                    <h2 className="font-display font-black text-white uppercase text-lg tracking-tight">
                      Mural de Discussão Técnica
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">
                      RF15
                    </TechnicalLabel>
                    <span className="font-mono text-xs text-zinc-500">
                      {BUG_DATA.comentarios.length} MENSAGENS
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                {BUG_DATA.comentarios.map((comment) => (
                  <CommentBlock key={comment.id} comment={comment} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Terminal de Input de Mensagens */}
              <div className="border-t-2 border-[#D4FF00] bg-[#0F1013]">
                <form onSubmit={handleSendMessage}>
                  <div className="relative">
                    <div className="absolute left-3 top-3 font-mono text-[#D4FF00] font-bold select-none">
                      &gt;&gt;
                    </div>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="[DIGITE_SUA_MENSAGEM_AQUI...]"
                      rows={3}
                      className="w-full bg-transparent text-white font-mono text-sm pl-10 pr-4 py-3 outline-none placeholder:text-zinc-600 resize-none border-b border-[#2C2D35]"
                    />
                  </div>
                  <div className="p-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="font-display font-bold uppercase tracking-widest px-6 py-3 bg-[#D4FF00] text-black border-2 border-[#D4FF00] hover:bg-[#b8e000] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-[3px_3px_0_0_#4A3AFF] active:shadow-[0_0_0_0_#4A3AFF] active:translate-y-[2px] active:translate-x-[2px]"
                    >
                      <Send size={16} strokeWidth={2.5} />
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </section>

          </div>

          {/* Coluna Lateral (1/3) */}
          <div className="space-y-6">

            {/* Seletor de Status Exclusivo (RN08) */}
            <section className="bg-[#1C1D22] border border-[#2C2D35] sticky top-24">
              <div className="border-b border-[#2C2D35] p-4 bg-[#0F1013]">
                <div className="flex items-center gap-2">
                  <Shield className="text-[#D4FF00]" size={20} />
                  <h2 className="font-display font-black text-white uppercase text-sm tracking-tight">
                    Controle de Status
                  </h2>
                </div>
                <TechnicalLabel className="text-orange-500 bg-orange-500/10 border-orange-500/30 mt-2">
                  RN08_MOD_ONLY
                </TechnicalLabel>
              </div>

              <div className="p-4 space-y-4">
                {/* Status Atual */}
                <div>
                  <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">
                    STATUS_ATUAL
                  </div>
                  <div
                    className="font-display font-bold text-lg uppercase px-4 py-2 border-2"
                    style={{
                      color: currentStatusData?.color,
                      borderColor: currentStatusData?.color,
                      backgroundColor: `${currentStatusData?.color}20`
                    }}
                  >
                    {currentStatusData?.label}
                  </div>
                </div>

                {/* Validação de Permissão */}
                {!isModerator && (
                  <div
                    className="border-2 border-red-500 p-4 relative overflow-hidden"
                  >
                    {/* Hazard Stripes */}
                    <div
                      className="absolute inset-0 opacity-10 hazard-stripes"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(-45deg, #ef4444, #ef4444 20px, transparent 20px, transparent 40px)',
                        backgroundSize: '40px 40px'
                      }}
                    />

                    <div className="relative z-10 flex items-start gap-3">
                      <Lock size={20} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-display font-black text-sm text-red-500 uppercase mb-1 tracking-tight">
                          [ALTERAÇÃO_RESTRITA_A_MODERADORES]
                        </div>
                        <p className="font-mono text-[10px] text-zinc-400 uppercase leading-relaxed">
                          Apenas usuários com permissão de moderador podem alterar o status do bug.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dropdown de Status */}
                <div className="relative">
                  <button
                    onClick={() => isModerator && setShowStatusDropdown(!showStatusDropdown)}
                    disabled={!isModerator}
                    className={cn(
                      "w-full font-display font-bold uppercase text-sm px-4 py-3 border transition-all flex items-center justify-between",
                      isModerator
                        ? "bg-[#0F1013] text-white border-[#2C2D35] hover:border-[#D4FF00] cursor-pointer"
                        : "bg-zinc-900/30 text-zinc-600 border-zinc-700 cursor-not-allowed"
                    )}
                  >
                    Alterar Status
                    <ChevronDown size={16} className={cn(
                      "transition-transform",
                      showStatusDropdown && "rotate-180"
                    )} />
                  </button>

                  {showStatusDropdown && isModerator && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#1C1D22] border border-[#2C2D35] z-50">
                      {STATUS_OPTIONS.map(status => (
                        <button
                          key={status.id}
                          onClick={() => {
                            setCurrentStatus(status.id);
                            setShowStatusDropdown(false);
                          }}
                          className={cn(
                            "w-full font-mono text-xs uppercase px-4 py-3 border-b border-[#2C2D35] last:border-b-0 text-left hover:bg-[#0F1013] transition-colors",
                            currentStatus === status.id && "bg-[#0F1013]"
                          )}
                          style={{
                            color: status.color
                          }}
                        >
                          {status.label}
                          {currentStatus === status.id && (
                            <span className="float-right text-[#D4FF00]">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isModerator && (
                  <button className="w-full font-display font-bold uppercase tracking-widest px-4 py-3 bg-[#4A3AFF] text-white border-2 border-[#4A3AFF] hover:bg-[#382bd6] transition-colors">
                    Salvar Alteração
                  </button>
                )}
              </div>
            </section>

            {/* Info Box Adicional */}
            <section className="bg-[#1C1D22] border border-[#2C2D35] p-4">
              <div className="font-mono text-[10px] text-zinc-500 uppercase mb-3">
                INFORMAÇÕES_DO_SISTEMA
              </div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total de Comentários:</span>
                  <span className="text-white font-bold">{BUG_DATA.comentarios.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Anexos:</span>
                  <span className="text-white font-bold">{BUG_DATA.anexos.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Última Atualização:</span>
                  <span className="text-white font-bold">{BUG_DATA.comentarios[BUG_DATA.comentarios.length - 1]?.timestamp || 'N/A'}</span>
                </div>
              </div>
            </section>

          </div>

        </div>

      </main>
    </div>
  );
}
