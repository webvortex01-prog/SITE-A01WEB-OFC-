import { useState } from 'react';
import {
  Sparkles,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  MessageCircle,
  CheckCircle2,
  Check,
  X,
  Layers,
  ArrowRight,
  Eye,
  Sliders,
  Send,
  Zap,
  Bell
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { ProjectData } from '../ProjectModal';

interface GenericSystemDemoProps {
  project: ProjectData;
  initialViewMode?: 'site' | 'system';
}

interface GenericRecord {
  id: string;
  name: string;
  serviceOrProduct: string;
  status: string;
  value: string;
  time: string;
}

export default function GenericSystemDemo({ project, initialViewMode = 'site' }: GenericSystemDemoProps) {
  const [activeTab, setActiveTab] = useState<'site' | 'system'>(initialViewMode);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [clientInputName, setClientInputName] = useState('Cliente VIP');
  const [clientInputContact, setClientInputContact] = useState('(11) 98877-6655');
  const [leadSuccessMsg, setLeadSuccessMsg] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Simulated records for the CEO system
  const [records, setRecords] = useState<GenericRecord[]>([
    {
      id: 'r-1',
      name: 'Camila Ferreira',
      serviceOrProduct: project.mockupContent.items[0]?.title || 'Atendimento Premium',
      status: 'Pendente',
      value: project.mockupContent.items[0]?.price || 'R$ 350,00',
      time: 'Há 5 min',
    },
    {
      id: 'r-2',
      name: 'Lucas Brandão',
      serviceOrProduct: project.mockupContent.items[1]?.title || 'Consultoria VIP',
      status: 'Confirmado',
      value: project.mockupContent.items[1]?.price || 'R$ 890,00',
      time: 'Há 22 min',
    },
    {
      id: 'r-3',
      name: 'Beatriz Vasconcelos',
      serviceOrProduct: project.mockupContent.items[2]?.title || 'Assinatura Mensal',
      status: 'Finalizado',
      value: project.mockupContent.items[2]?.price || 'R$ 250,00',
      time: 'Há 1 hora',
    },
  ]);

  const handleConvertLead = () => {
    sound.playSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setLeadSuccessMsg(true);

    const newRecord: GenericRecord = {
      id: 'r-' + Date.now(),
      name: clientInputName || 'Novo Contato',
      serviceOrProduct: project.mockupContent.items[selectedItemIndex]?.title || 'Serviço Selecionado',
      status: 'Pendente',
      value: project.mockupContent.items[selectedItemIndex]?.price || 'Sob Consulta',
      time: 'Agora mesmo',
    };
    setRecords([newRecord, ...records]);
  };

  const handleAdvanceRecord = (recId: string) => {
    sound.playSelect();
    setRecords(prev => prev.map(r => {
      if (r.id !== recId) return r;
      const nextStatus = r.status === 'Pendente' ? 'Confirmado' : r.status === 'Confirmado' ? 'Finalizado' : 'Finalizado';
      return { ...r, status: nextStatus };
    }));
  };

  const sendWhatsAppUpdate = (record: GenericRecord) => {
    sound.playSuccess();
    setNotificationToast(
      `WhatsApp enviado para ${record.name}: "Olá! Seu pedido de ${record.serviceOrProduct} em ${project.title} foi atualizado com sucesso!"`
    );
    setTimeout(() => setNotificationToast(null), 4500);
  };

  return (
    <div className="w-full flex flex-col bg-[#080b15] text-slate-100 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl">
      {/* Top Demo Bar Switcher */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#0f1424] via-[#151c33] to-[#0f1424] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-black font-black shadow-md">
            🚀
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 font-heading">
              <span>{project.title}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {project.categoryLabel}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Site de Alta Conversão + Sistema Gerencial Sob Medida
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              setActiveTab('site');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'site'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30 scale-105'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌐 Site Front-end</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              setActiveTab('system');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'system'
                ? 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30 scale-105'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>⚡ Sistema & Painel do CEO</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>
      </div>

      {notificationToast && (
        <div className="bg-cyan-500 text-slate-950 px-4 py-2 text-xs font-mono font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>{notificationToast}</span>
          </div>
          <button type="button" onClick={() => setNotificationToast(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* VIEW 1: FRONT SITE */}
      {activeTab === 'site' && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Hero Banner with real image */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0d1326] via-[#101730] to-[#0a0d1a] border border-cyan-500/30 p-6 sm:p-8">
            <div className="relative z-10 max-w-xl space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                {project.mockupContent.badgeText}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight leading-tight">
                {project.mockupContent.heroTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                {project.mockupContent.heroSubtitle}
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Abertura em 0.28s</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Integração 24/7 WhatsApp</span>
                </span>
              </div>
            </div>
            {/* Background image overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none hidden md:block">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Interactive Catalog / Services Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Selecione um Pacote ou Serviço para Simular Atendimento:
              </h4>
              <span className="text-[11px] text-cyan-400 font-mono">100% Interativo</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {project.mockupContent.items.map((it, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedItemIndex(idx);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedItemIndex === idx
                      ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/20'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>{it.title}</span>
                    {selectedItemIndex === idx && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{it.subtitle}</div>
                  {it.price && (
                    <div className="text-sm font-mono font-bold text-emerald-400 mt-2">
                      {it.price}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Interactive Lead Capture / WhatsApp Box */}
          <div className="p-5 rounded-2xl bg-[#0b0e1b] border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono uppercase font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulação de Atendimento Imediato</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Robô de Triagem 24/7 Ativo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={clientInputName}
                onChange={e => setClientInputName(e.target.value)}
                placeholder="Seu nome completo"
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <input
                type="text"
                value={clientInputContact}
                onChange={e => setClientInputContact(e.target.value)}
                placeholder="Seu telefone / WhatsApp"
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            {leadSuccessMsg ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center space-y-1">
                <div className="font-bold flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Solicitação Enviada com Sucesso!</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  O sistema gerencial já registrou seu pedido em tempo real.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('system');
                    setLeadSuccessMsg(false);
                  }}
                  className="mt-2 w-full py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Ver no Painel do CEO / Sistema →
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConvertLead}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-400/25 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{project.mockupContent.ctaText}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: SYSTEM & CEO MANAGEMENT PANEL */}
      {activeTab === 'system' && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Top Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Total de Atendimentos</span>
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-heading text-white">
                {records.length} Atendimentos
              </div>
              <div className="text-[10px] text-emerald-400 font-mono font-bold">+18% essa semana</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Conversão de Leads</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-heading text-emerald-400">
                {project.metric1.value}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{project.metric1.label}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Velocidade de Resposta</span>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-heading text-cyan-300">
                {project.metric2.value}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{project.metric2.label}</div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
              <div className="text-[11px] font-mono text-cyan-300 flex items-center justify-between">
                <span>Score de Performance</span>
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-heading text-cyan-300">
                {project.speedScore}/100
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Google Lighthouse Oficial</div>
            </div>
          </div>

          {/* Records Table / Kanban */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Gestão Operacional de Clientes & Atendimentos</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Clique para avançar status ou notificar o cliente via WhatsApp
              </span>
            </div>

            <div className="space-y-2.5">
              {records.map(rec => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl bg-[#0b0f1e] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{rec.name}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        rec.status === 'Pendente'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : rec.status === 'Confirmado'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {rec.status.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{rec.time}</span>
                    </div>
                    <div className="text-xs text-slate-300">
                      Serviço / Item: <strong className="text-cyan-300">{rec.serviceOrProduct}</strong> • Valor: {rec.value}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {rec.status !== 'Finalizado' && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceRecord(rec.id)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
                      >
                        Avançar Status →
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => sendWhatsAppUpdate(rec)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Notificar no Zap</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
