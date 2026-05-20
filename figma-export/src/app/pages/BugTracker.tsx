import React, { useEffect, useState } from 'react';
import {
  Crosshair, ArrowLeft, Search, Filter, Bug,
  AlertTriangle, X, Image as ImageIcon, MessageSquare,
  Shield, ChevronRight, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router';

// --- Utils ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const PROJECTS = [
  { id: 'all', name: 'TODOS' },
  { id: 'proj-1', name: 'TREVIUM' },
  { id: 'proj-2', name: 'NEON DRIFT' },
  { id: 'proj-3', name: 'VOID BUILD' },
];

const VERSIONS = [
  { id: 'all', name: 'TODAS VERSÕES' },
  { id: 'v1.2.0', name: 'V1.2.0' },
  { id: 'v1.1.9', name: 'V1.1.9' },
  { id: 'v0.9.8', name: 'V0.9.8' },
];

const SEVERITIES = [
  { id: 'all', name: 'TODAS' },
  { id: 'critical', name: 'CRÍTICA', color: 'red' },
  { id: 'high', name: 'ALTA', color: 'orange' },
  { id: 'medium', name: 'MÉDIA', color: 'yellow' },
  { id: 'low', name: 'BAIXA', color: 'gray' },
];

const STATUSES = [
  { id: 'all', name: 'TODOS' },
  { id: 'open', name: 'ABERTO', color: '#D4FF00' },
  { id: 'investigating', name: 'INVESTIGANDO', color: '#4A3AFF' },
  { id: 'fixed', name: 'CORRIGIDO', color: '#10b981' },
  { id: 'closed', name: 'FECHADO', color: '#6b7280' },
];

const BUGS = [
  {
    id: 'BUG-991',
    titulo: 'Memory Leak on Level Transition',
    projeto: 'TREVIUM',
    versao: 'V1.2.0',
    severidade: 'critical',
    status: 'open',
    descricao: 'Ao transitar do nível 2 para o nível 3, ocorre um vazamento de memória crítico que causa travamento completo do jogo após aproximadamente 2 minutos. O consumo de RAM aumenta exponencialmente de 2GB para 8GB em questão de segundos.\n\nPassos para reproduzir:\n1. Iniciar novo jogo\n2. Completar nível 2\n3. Aguardar carregamento do nível 3\n4. Observar travamento após ~2 minutos\n\nO problema foi reportado por múltiplos testadores em diferentes configurações de hardware.',
    reportadoPor: 'GHOST_RUNNER_88',
    timestamp: '2h atrás',
    anexos: [
      { type: 'image', name: 'screenshot_crash_001.png', url: '#' },
      { type: 'log', name: 'memory_dump.log', url: '#' }
    ],
    comentarios: [
      { autor: 'DEV-0081', texto: 'Identificado possível leak no sistema de partículas. Investigando.', tempo: '1h atrás' },
      { autor: 'TST-0423', texto: 'Confirmado em build Linux também. Mesmo comportamento.', tempo: '45m atrás' }
    ]
  },
  {
    id: 'BUG-992',
    titulo: 'Authentication Bypass Exploit',
    projeto: 'TREVIUM',
    versao: 'V1.2.0',
    severidade: 'critical',
    status: 'investigating',
    descricao: 'Vulnerabilidade crítica de segurança que permite bypass do sistema de autenticação usando requisições manipuladas.',
    reportadoPor: 'VOID_WALKER',
    timestamp: '5h atrás',
    anexos: [],
    comentarios: []
  },
  {
    id: 'BUG-874',
    titulo: 'UI Overlap in Settings Menu',
    projeto: 'NEON DRIFT',
    versao: 'V0.9.8',
    severidade: 'high',
    status: 'open',
    descricao: 'Elementos de UI se sobrepõem no menu de configurações em resoluções 1366x768.',
    reportadoPor: 'NEON_PIXEL',
    timestamp: '12h atrás',
    anexos: [
      { type: 'image', name: 'ui_overlap.png', url: '#' }
    ],
    comentarios: []
  },
  {
    id: 'BUG-753',
    titulo: 'Audio Crackling on Low-End Devices',
    projeto: 'VOID BUILD',
    versao: 'V2.1.0',
    severidade: 'medium',
    status: 'fixed',
    descricao: 'Som apresenta chiados em dispositivos com menos de 4GB de RAM.',
    reportadoPor: 'BYTE_KNIGHT',
    timestamp: '1d atrás',
    anexos: [],
    comentarios: [
      { autor: 'DEV-0092', texto: 'Corrigido na build interna. Aguardando deploy.', tempo: '8h atrás' }
    ]
  },
  {
    id: 'BUG-621',
    titulo: 'Typo in Tutorial Text',
    projeto: 'NEON DRIFT',
    versao: 'V0.9.7',
    severidade: 'low',
    status: 'closed',
    descricao: 'Erro de digitação no texto do tutorial inicial.',
    reportadoPor: 'SYNTH_TESTER',
    timestamp: '3d atrás',
    anexos: [],
    comentarios: []
  },
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
    <span className={cn(
      "font-mono text-[10px] font-bold uppercase px-2 py-1 border",
      colors[severity as keyof typeof colors]
    )}>
      {labels[severity as keyof typeof labels]}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusData = STATUSES.find(s => s.id === status);
  if (!statusData || statusData.id === 'all') return null;

  return (
    <span
      className="font-mono text-[10px] font-bold uppercase px-2 py-1 border"
      style={{
        color: statusData.color,
        borderColor: statusData.color,
        backgroundColor: `${statusData.color}20`
      }}
    >
      {statusData.name}
    </span>
  );
}

function BugDetailPanel({ bug, onClose, isModerator = false }: { bug: typeof BUGS[0], onClose: () => void, isModerator?: boolean }) {
  const [selectedStatus, setSelectedStatus] = useState(bug.status);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/80" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-2xl bg-[#1C1D22] border-l-2 border-[#D4FF00] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0F1013] border-b border-[#2C2D35] p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-zinc-500">{bug.id}</span>
                <SeverityBadge severity={bug.severidade} />
                <StatusBadge status={selectedStatus} />
              </div>
              <h2 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                {bug.titulo}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-xs font-mono text-zinc-500">
                <span>{bug.projeto}</span>
                <span>•</span>
                <span>{bug.versao}</span>
                <span>•</span>
                <span>Por: {bug.reportadoPor}</span>
                <span>•</span>
                <span>{bug.timestamp}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-white border border-transparent hover:border-[#2C2D35] p-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Descrição Detalhada (RN02 - Obrigatória) */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Bug className="text-[#4A3AFF]" size={18} />
              <h3 className="font-display font-bold text-white uppercase text-sm tracking-wide">
                Descrição Detalhada
              </h3>
              <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">
                RN02
              </TechnicalLabel>
            </div>
            <div className="bg-[#0F1013] border border-[#2C2D35] p-4">
              <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
{bug.descricao}
              </pre>
            </div>
          </section>

          {/* Galeria de Anexos (RF08) */}
          {bug.anexos.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="text-[#4A3AFF]" size={18} />
                <h3 className="font-display font-bold text-white uppercase text-sm tracking-wide">
                  Arquivos Anexados
                </h3>
                <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">
                  RF08
                </TechnicalLabel>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {bug.anexos.map((anexo, idx) => (
                  <div key={idx} className="bg-[#0F1013] border border-[#2C2D35] p-3 hover:border-[#4A3AFF] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-2 mb-2">
                      {anexo.type === 'image' ? (
                        <ImageIcon size={16} className="text-[#D4FF00]" />
                      ) : (
                        <Bug size={16} className="text-zinc-500" />
                      )}
                      <span className="font-mono text-[10px] text-zinc-500 uppercase">
                        {anexo.type}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-white truncate">{anexo.name}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Thread de Comentários */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="text-[#4A3AFF]" size={18} />
              <h3 className="font-display font-bold text-white uppercase text-sm tracking-wide">
                Thread de Comunicação
              </h3>
            </div>
            <div className="space-y-2">
              {bug.comentarios.length === 0 ? (
                <div className="bg-[#0F1013] border border-[#2C2D35] p-4 text-center">
                  <p className="font-mono text-xs text-zinc-600 uppercase">
                    Nenhum comentário registrado
                  </p>
                </div>
              ) : (
                bug.comentarios.map((comment, idx) => (
                  <div key={idx} className="bg-[#0F1013] border border-[#2C2D35] p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] text-[#D4FF00] font-bold">
                        {comment.autor}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-600">
                        {comment.tempo}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                      {comment.texto}
                    </p>
                  </div>
                ))
              )}

              {/* Input de Novo Comentário */}
              <div className="bg-[#0F1013] border border-[#2C2D35] focus-within:border-[#D4FF00] transition-colors">
                <textarea
                  placeholder="DIGITE SEU COMENTÁRIO..."
                  rows={3}
                  className="w-full bg-transparent text-white font-mono text-xs p-3 outline-none placeholder:text-zinc-600 resize-none"
                />
                <div className="border-t border-[#2C2D35] p-2 flex justify-end">
                  <button className="font-display font-bold uppercase text-xs px-4 py-2 bg-[#4A3AFF] text-white border border-[#4A3AFF] hover:bg-[#382bd6] transition-colors">
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Alteração de Status (RN08 - Apenas Moderador) */}
          <section className="border-t border-[#2C2D35] pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="text-[#D4FF00]" size={18} />
              <h3 className="font-display font-bold text-white uppercase text-sm tracking-wide">
                Controle de Status
              </h3>
              <TechnicalLabel className="text-orange-500 bg-orange-500/10 border-orange-500/30">
                RN08_MOD_ONLY
              </TechnicalLabel>
            </div>

            {!isModerator && (
              <div className="bg-zinc-900/50 border border-zinc-700 p-4 mb-4 flex items-start gap-3">
                <AlertTriangle size={16} className="text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-display font-bold text-sm text-white uppercase mb-1">
                    Permissão Restrita
                  </p>
                  <p className="font-mono text-[10px] text-zinc-500 uppercase leading-relaxed">
                    Apenas usuários com flag de moderador podem alterar o status final do bug.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {STATUSES.filter(s => s.id !== 'all').map(status => (
                <button
                  key={status.id}
                  onClick={() => isModerator && setSelectedStatus(status.id)}
                  disabled={!isModerator}
                  className={cn(
                    "font-display font-bold uppercase text-xs px-4 py-3 border transition-all",
                    selectedStatus === status.id
                      ? "shadow-[2px_2px_0_0_currentColor]"
                      : "opacity-50",
                    !isModerator && "cursor-not-allowed opacity-30"
                  )}
                  style={{
                    color: status.color,
                    borderColor: status.color,
                    backgroundColor: selectedStatus === status.id ? `${status.color}20` : 'transparent'
                  }}
                >
                  {status.name}
                </button>
              ))}
            </div>

            {isModerator && (
              <div className="mt-4">
                <button className="w-full font-display font-bold uppercase tracking-widest px-6 py-3 bg-[#D4FF00] text-black border-2 border-[#D4FF00] hover:bg-[#b8e000] transition-colors">
                  Salvar Status
                </button>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

// --- Sections ---
function TrackerHeader() {
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
            BUG_TRACKER // RF11
          </span>
        </div>
      </div>
    </header>
  );
}

export function BugTracker() {
  const [selectedBug, setSelectedBug] = useState<typeof BUGS[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [filterVersion, setFilterVersion] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModerator] = useState(true); // Simular usuário moderador

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

  // Filtragem de bugs
  const filteredBugs = BUGS.filter(bug => {
    const matchSearch = searchQuery === '' ||
      bug.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProject = filterProject === 'all' || bug.projeto === PROJECTS.find(p => p.id === filterProject)?.name;
    const matchVersion = filterVersion === 'all' || bug.versao === filterVersion.toUpperCase();
    const matchSeverity = filterSeverity === 'all' || bug.severidade === filterSeverity;
    const matchStatus = filterStatus === 'all' || bug.status === filterStatus;

    return matchSearch && matchProject && matchVersion && matchSeverity && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#0F1013] text-white selection:bg-[#D4FF00] selection:text-black flex flex-col">
      <TrackerHeader />

      <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8">

        {/* Título Principal */}
        <div className="mb-6">
          <h1 className="text-5xl font-display font-black uppercase tracking-tighter mb-2">
            Central de <span className="text-[#D4FF00]">Rastreamento</span> de Bugs
          </h1>
          <p className="font-mono text-xs text-zinc-500 uppercase">
            Matriz de Triagem e Gestão de Anomalias
          </p>
        </div>

        {/* Painel de Filtros Avançados (Matriz de Triagem) */}
        <section className="mb-6 bg-[#1C1D22] border border-[#2C2D35] p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={16} className="text-[#4A3AFF]" />
            <h2 className="font-display font-bold text-white uppercase text-sm tracking-wide">
              Matriz de Triagem
            </h2>
            <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">
              FILTROS
            </TechnicalLabel>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Busca Textual */}
            <div className="lg:col-span-2">
              <div className="relative flex items-center border border-[#2C2D35] bg-[#0F1013] focus-within:border-[#D4FF00] transition-colors">
                <div className="pl-3 pr-2 text-zinc-500">
                  <Search size={16} strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="BUSCAR POR ID OU TÍTULO..."
                  className="w-full bg-transparent text-white rounded-none py-2 px-2 font-mono text-xs outline-none placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Projeto */}
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="bg-[#0F1013] text-white border border-[#2C2D35] font-mono text-xs px-3 py-2 outline-none cursor-pointer hover:border-[#4A3AFF] transition-colors appearance-none"
            >
              {PROJECTS.map(proj => (
                <option key={proj.id} value={proj.id}>{proj.name}</option>
              ))}
            </select>

            {/* Versão */}
            <select
              value={filterVersion}
              onChange={(e) => setFilterVersion(e.target.value)}
              className="bg-[#0F1013] text-white border border-[#2C2D35] font-mono text-xs px-3 py-2 outline-none cursor-pointer hover:border-[#4A3AFF] transition-colors appearance-none"
            >
              {VERSIONS.map(ver => (
                <option key={ver.id} value={ver.id}>{ver.name}</option>
              ))}
            </select>

            {/* Severidade */}
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-[#0F1013] text-white border border-[#2C2D35] font-mono text-xs px-3 py-2 outline-none cursor-pointer hover:border-[#4A3AFF] transition-colors appearance-none"
            >
              {SEVERITIES.map(sev => (
                <option key={sev.id} value={sev.id}>{sev.name}</option>
              ))}
            </select>

            {/* Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#0F1013] text-white border border-[#2C2D35] font-mono text-xs px-3 py-2 outline-none cursor-pointer hover:border-[#4A3AFF] transition-colors appearance-none"
            >
              {STATUSES.map(stat => (
                <option key={stat.id} value={stat.id}>{stat.name}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Tabela de Logs Central (RF11) */}
        <section className="bg-[#1C1D22] border border-[#2C2D35] overflow-x-auto">
          <table className="w-full text-left font-mono text-xs whitespace-nowrap">
            <thead className="bg-[#0F1013] border-b border-[#2C2D35] text-zinc-500">
              <tr>
                <th className="p-4 font-normal uppercase">ID</th>
                <th className="p-4 font-normal uppercase">Título</th>
                <th className="p-4 font-normal uppercase">Projeto</th>
                <th className="p-4 font-normal uppercase">Versão</th>
                <th className="p-4 font-normal uppercase">Severidade</th>
                <th className="p-4 font-normal uppercase">Status</th>
                <th className="p-4 font-normal uppercase text-right">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2C2D35]">
              {filteredBugs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <Bug size={48} className="text-zinc-600 mx-auto mb-4" />
                    <p className="font-display font-bold text-xl text-zinc-500 uppercase">
                      Nenhum Bug Encontrado
                    </p>
                    <p className="font-mono text-xs text-zinc-600 mt-2">
                      Ajuste os filtros ou limpe a busca
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBugs.map(bug => (
                  <tr
                    key={bug.id}
                    className="hover:bg-[#25262c] transition-colors cursor-pointer group"
                    onClick={() => setSelectedBug(bug)}
                  >
                    <td className="p-4 text-[#D4FF00] font-bold">{bug.id}</td>
                    <td className="p-4 text-white max-w-md">
                      <div className="truncate font-bold">{bug.titulo}</div>
                      <div className="text-zinc-500 text-[10px] mt-1">
                        Por: {bug.reportadoPor} • {bug.timestamp}
                      </div>
                    </td>
                    <td className="p-4 text-[#4A3AFF] font-bold">{bug.projeto}</td>
                    <td className="p-4">
                      <span className="border border-white/20 bg-[#0F1013] px-2 py-1">
                        {bug.versao}
                      </span>
                    </td>
                    <td className="p-4">
                      <SeverityBadge severity={bug.severidade} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={bug.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-zinc-500 hover:text-white border border-transparent hover:border-white/20 p-2 transition-colors inline-flex">
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* Estatísticas Rápidas */}
        <section className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1C1D22] border border-red-500/30 p-4">
            <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">Críticos</div>
            <div className="font-display font-black text-3xl text-red-500">
              {BUGS.filter(b => b.severidade === 'critical').length}
            </div>
          </div>
          <div className="bg-[#1C1D22] border border-orange-500/30 p-4">
            <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">Altos</div>
            <div className="font-display font-black text-3xl text-orange-500">
              {BUGS.filter(b => b.severidade === 'high').length}
            </div>
          </div>
          <div className="bg-[#1C1D22] border border-[#D4FF00]/30 p-4">
            <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">Abertos</div>
            <div className="font-display font-black text-3xl text-[#D4FF00]">
              {BUGS.filter(b => b.status === 'open').length}
            </div>
          </div>
          <div className="bg-[#1C1D22] border border-green-500/30 p-4">
            <div className="font-mono text-[10px] text-zinc-500 uppercase mb-2">Corrigidos</div>
            <div className="font-display font-black text-3xl text-green-500">
              {BUGS.filter(b => b.status === 'fixed').length}
            </div>
          </div>
        </section>

      </main>

      {/* Painel Lateral de Detalhes (RF15) */}
      {selectedBug && (
        <BugDetailPanel
          bug={selectedBug}
          onClose={() => setSelectedBug(null)}
          isModerator={isModerator}
        />
      )}
    </div>
  );
}
