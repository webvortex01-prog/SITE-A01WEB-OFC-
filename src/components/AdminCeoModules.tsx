import { useState } from 'react';
import {
  Flame,
  Thermometer,
  Snowflake,
  MessageCircle,
  Trash2,
  Plus,
  Lightbulb,
  CheckSquare,
  Pin,
  Globe,
  Copy,
  ExternalLink,
  Rocket,
  Check,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import {
  Lead,
  LeadStatus,
  LeadTemperature,
  CeoIdea,
  CeoTask,
  AgencyTemplate,
  ProjectChecklist,
} from '../types/lead';
import { leadService } from '../services/leadService';
import { buildDirectWaUrl } from '../utils/adminScripts';
import { sound } from '../utils/audio';

// ============================================================================
// 1. TERMÔMETRO DE LEADS (DOS MAIS QUENTES 🔥 PROS MAIS FRIOS ❄️)
// ============================================================================
export function AdminThermometerTab({
  leads,
  onStatusChange,
  onTemperatureChange,
  onBudgetChange,
  onNotesChange,
  onInspectLead,
  onOpenScripts,
}: {
  leads: Lead[];
  onStatusChange: (id: string, status: LeadStatus) => void;
  onTemperatureChange: (id: string, temp: LeadTemperature) => void;
  onBudgetChange: (id: string, budget: number) => void;
  onNotesChange: (id: string, notes: string) => void;
  onInspectLead: (lead: Lead) => void;
  onOpenScripts: (id: string) => void;
}) {
  const [tempFilter, setTempFilter] = useState<'ALL' | LeadTemperature>('ALL');

  // Always sort from HOTTEST (highest score) to COLDEST (lowest score)
  const sortedByHeat = [...leads].sort((a, b) => (b.score || 80) - (a.score || 80));

  const hotLeads = sortedByHeat.filter((l) => (l.temperature || 'HOT') === 'HOT');
  const warmLeads = sortedByHeat.filter((l) => l.temperature === 'WARM');
  const coldLeads = sortedByHeat.filter((l) => l.temperature === 'COLD');

  const visibleLeads =
    tempFilter === 'ALL'
      ? sortedByHeat
      : sortedByHeat.filter((l) => (l.temperature || 'HOT') === tempFilter);

  return (
    <div className="space-y-6">
      {/* Thermometer Header Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => {
            sound.playSelect();
            setTempFilter(tempFilter === 'HOT' ? 'ALL' : 'HOT');
          }}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            tempFilter === 'HOT'
              ? 'bg-rose-500/20 border-rose-400 shadow-lg shadow-rose-950/50'
              : 'bg-[#090D1A] border-rose-500/30 hover:border-rose-400/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-extrabold text-rose-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
              1º Pelando / Quentes 🔥
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-mono text-xs font-bold">
              {hotLeads.length} leads
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-2">
            R${' '}
            {hotLeads
              .reduce((acc, l) => acc + (l.budgetEstimate || 2000), 0)
              .toLocaleString('pt-BR')}
          </div>
          <p className="text-[11px] text-rose-200/80 mt-1">
            Urgência imediata · Prontos para fechar no WhatsApp hoje
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playSelect();
            setTempFilter(tempFilter === 'WARM' ? 'ALL' : 'WARM');
          }}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            tempFilter === 'WARM'
              ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-950/50'
              : 'bg-[#090D1A] border-amber-500/30 hover:border-amber-400/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-extrabold text-amber-300 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-400" />
              2º Leads Mornos 🌡️
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono text-xs font-bold">
              {warmLeads.length} leads
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-2">
            R${' '}
            {warmLeads
              .reduce((acc, l) => acc + (l.budgetEstimate || 2000), 0)
              .toLocaleString('pt-BR')}
          </div>
          <p className="text-[11px] text-amber-200/80 mt-1">
            Início em 15-30 dias · Precisam de prova social e follow-up
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playSelect();
            setTempFilter(tempFilter === 'COLD' ? 'ALL' : 'COLD');
          }}
          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
            tempFilter === 'COLD'
              ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-950/50'
              : 'bg-[#090D1A] border-cyan-500/30 hover:border-cyan-400/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-extrabold text-cyan-300 flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-cyan-400" />
              3º Leads Frios ❄️
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200 font-mono text-xs font-bold">
              {coldLeads.length} leads
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-2">
            R${' '}
            {coldLeads
              .reduce((acc, l) => acc + (l.budgetEstimate || 2000), 0)
              .toLocaleString('pt-BR')}
          </div>
          <p className="text-[11px] text-cyan-200/80 mt-1">
            Apenas orçando · Nutrir com demonstrações e remarketing
          </p>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090D1A] p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Exibindo:</span>
          {(
            [
              { id: 'ALL', label: `Ranking Completo (${leads.length})` },
              { id: 'HOT', label: `🔥 Quentes (${hotLeads.length})` },
              { id: 'WARM', label: `🌡️ Mornos (${warmLeads.length})` },
              { id: 'COLD', label: `❄️ Frios (${coldLeads.length})` },
            ] as const
          ).map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setTempFilter(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tempFilter === btn.id
                  ? 'bg-cyan-400 text-slate-950'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-emerald-400">
          Ordenado automaticamente: Mais Quente 🔥 → Mais Frio ❄️
        </span>
      </div>

      {/* Ranked Lead Cards */}
      <div className="space-y-3">
        {visibleLeads.map((lead, index) => {
          const temp = lead.temperature || 'HOT';
          const isHot = temp === 'HOT';
          const isWarm = temp === 'WARM';

          return (
            <div
              key={lead.id}
              className={`p-5 rounded-2xl bg-[#090D1A] border transition-all space-y-4 ${
                isHot
                  ? 'border-rose-500/40 shadow-lg shadow-rose-950/20'
                  : isWarm
                  ? 'border-amber-500/30'
                  : 'border-cyan-500/20 opacity-90'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-mono font-extrabold text-xs shrink-0 ${
                      isHot
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-950'
                        : isWarm
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    <span>#{index + 1}</span>
                    <span className="text-[9px]">{lead.score || 90}°</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-extrabold text-white">{lead.name}</h4>
                      <span className="text-xs text-slate-400">· {lead.businessName}</span>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-white/5 text-cyan-300 border border-white/10">
                        {lead.segment}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
                      <span>Urgência: <strong className="text-white">{lead.urgencyLabel}</strong></span>
                      <span>·</span>
                      <span>WhatsApp: <strong className="text-emerald-400 font-mono">{lead.whatsapp}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Temperature Selector & Status */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-white/10">
                    {(
                      [
                        { id: 'HOT', label: '🔥 Quente', activeClass: 'bg-rose-500 text-white' },
                        { id: 'WARM', label: '🌡️ Morno', activeClass: 'bg-amber-400 text-slate-950' },
                        { id: 'COLD', label: '❄️ Frio', activeClass: 'bg-cyan-500 text-slate-950' },
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onTemperatureChange(lead.id, t.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          temp === t.id ? t.activeClass : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <select
                    value={lead.status}
                    onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/15 text-xs font-mono font-bold text-white cursor-pointer"
                  >
                    <option value="NOVO">NOVO 🔥</option>
                    <option value="EM_CONTATO">EM CONTATO 💬</option>
                    <option value="PROPOSTA_ENVIADA">PROPOSTA 📄</option>
                    <option value="FECHADO">FECHADO 🎉</option>
                    <option value="PERDIDO">PERDIDO ❌</option>
                  </select>
                </div>
              </div>

              {/* Qualification Details + AI Solution Box */}
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/90 border border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">
                      ⚠️ Problema / Dor do Cliente:
                    </span>
                    <div className="text-rose-200 font-bold mt-0.5">{lead.bottleneckLabel}</div>
                    {lead.problemDetails && (
                      <p className="text-[11px] text-slate-300 italic mt-1">
                        &ldquo;{lead.problemDetails}&rdquo;
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      Estrutura que Deseja:
                    </span>
                    <div className="text-cyan-300 font-bold mt-0.5">{lead.needLabel}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">
                        Orçamento Estimado (R$)
                      </span>
                      <input
                        type="number"
                        defaultValue={lead.budgetEstimate || 2200}
                        onBlur={(e) => onBudgetChange(lead.id, Number(e.target.value) || 0)}
                        className="w-28 px-2.5 py-1 mt-0.5 rounded-lg bg-slate-900 border border-white/10 text-emerald-400 font-mono font-extrabold text-sm"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onInspectLead(lead)}
                        className="px-3 py-2 rounded-xl bg-cyan-400/15 hover:bg-cyan-400/25 border border-cyan-400/40 text-xs font-extrabold text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Solução IA</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenScripts(lead.id)}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer"
                      >
                        Scripts
                      </button>
                      <a
                        href={buildDirectWaUrl(lead, lead.aiBlueprint?.whatsappScript)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          if (lead.status === 'NOVO') {
                            onStatusChange(lead.id, 'EM_CONTATO');
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs cursor-pointer shadow-md shadow-emerald-950/50"
                      >
                        <MessageCircle className="w-4 h-4 fill-slate-950 stroke-none" />
                        <span>Mandar Solução IA no Zap</span>
                      </a>
                    </div>
                  </div>
                </div>

                {lead.aiBlueprint && (
                  <div className="p-3 rounded-xl bg-cyan-950/25 border border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-mono text-[10px] uppercase text-cyan-300 font-bold">
                          🤖 IA 01 WEB Indica para {lead.name.split(' ')[0]}:{' '}
                        </span>
                        <span className="text-slate-200 font-medium">
                          {lead.aiBlueprint.recommendedSolution}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onInspectLead(lead)}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline shrink-0 cursor-pointer"
                    >
                      Ver plano completo da IA →
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 2. LABORATÓRIO DE IDEIAS, NOTAS & TAREFAS DO CEO (SEGUNDO CÉREBRO)
// ============================================================================
export function AdminIdeasVaultTab({
  ideas,
  tasks,
}: {
  ideas: CeoIdea[];
  tasks: CeoTask[];
}) {
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaCategory, setIdeaCategory] = useState<CeoIdea['category']>('anuncio_criativo');
  const [ideaPriority, setIdeaPriority] = useState<CeoIdea['priority']>('alta');
  const [ideaContent, setIdeaContent] = useState('');

  const [taskText, setTaskText] = useState('');
  const [taskTag, setTaskTag] = useState<CeoTask['tag']>('vendas');

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim()) return;
    sound.playSuccess();
    leadService.addIdea({
      title: ideaTitle.trim(),
      category: ideaCategory,
      priority: ideaPriority,
      content: ideaContent.trim() || 'Anote os próximos passos para executar essa ideia.',
      pinned: ideaPriority === 'alta',
    });
    setIdeaTitle('');
    setIdeaContent('');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;
    sound.playSuccess();
    leadService.addTask(taskText.trim(), taskTag);
    setTaskText('');
  };

  const sortedIdeas = [...ideas].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const completedTasks = tasks.filter((t) => t.done).length;
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const categoryLabels: Record<CeoIdea['category'], { label: string; color: string }> = {
    anuncio_criativo: { label: '📢 Criativo / Tráfego Pago', color: 'text-rose-300 bg-rose-500/15 border-rose-500/30' },
    saas_produto: { label: '💻 Novo Sistema / SaaS', color: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30' },
    oferta_nicho: { label: '💰 Nova Oferta / Nicho', color: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' },
    automacao: { label: '🤖 Automação WhatsApp', color: 'text-amber-300 bg-amber-500/15 border-amber-500/30' },
    estrategia: { label: '🚀 Estratégia da Agência', color: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30' },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left 7 Cols: CEO Brainstorm & Ideas Board */}
      <div className="lg:col-span-7 space-y-5">
        <form
          onSubmit={handleAddIdea}
          className="p-5 rounded-2xl bg-[#090D1A] border border-cyan-500/30 space-y-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-extrabold text-white">
                Anotar Nova Ideia / Estratégia do CEO
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 uppercase">
              Salvo Automaticamente
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Título da Ideia (ex: Novo nicho de Clínicas Odontológicas)..."
              value={ideaTitle}
              onChange={(e) => setIdeaTitle(e.target.value)}
              className="sm:col-span-2 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
            />

            <select
              value={ideaCategory}
              onChange={(e) => setIdeaCategory(e.target.value as CeoIdea['category'])}
              className="px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none"
            >
              <option value="anuncio_criativo">📢 Criativo de Anúncio</option>
              <option value="saas_produto">💻 Novo Sistema / Template</option>
              <option value="oferta_nicho">💰 Oferta / Precificação</option>
              <option value="automacao">🤖 Fluxo de Automação</option>
              <option value="estrategia">🚀 Estratégia Geral</option>
            </select>
          </div>

          <textarea
            rows={3}
            placeholder="Descreva os detalhes da sua ideia, copy de anúncio, funcionalidade de sistema ou meta..."
            value={ideaContent}
            onChange={(e) => setIdeaContent(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono">Prioridade:</span>
              {(['alta', 'media', 'baixa'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setIdeaPriority(p)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] uppercase font-bold cursor-pointer ${
                    ideaPriority === p
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-xs cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Salvar no Cofre de Ideias</span>
            </button>
          </div>
        </form>

        {/* Ideas Grid */}
        <div className="space-y-3">
          {sortedIdeas.map((idea) => {
            const cat = categoryLabels[idea.category] || categoryLabels.estrategia;
            return (
              <div
                key={idea.id}
                className={`p-5 rounded-2xl bg-[#090D1A] border transition-all space-y-2.5 ${
                  idea.pinned ? 'border-amber-400/40' : 'border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border ${cat.color}`}>
                      {cat.label}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400">
                      Prioridade {idea.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        leadService.togglePinIdea(idea.id);
                      }}
                      className={`p-1.5 rounded-lg cursor-pointer ${
                        idea.pinned
                          ? 'bg-amber-400/20 text-amber-300'
                          : 'text-slate-500 hover:text-white'
                      }`}
                      title="Fixar no topo"
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick(300);
                        leadService.deleteIdea(idea.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 cursor-pointer"
                      title="Excluir ideia"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-white">{idea.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {idea.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 5 Cols: CEO Daily To-Do & Execution Checklist */}
      <div className="lg:col-span-5 space-y-5">
        <div className="p-5 rounded-2xl bg-[#090D1A] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Rotina & Tarefas do CEO
                </h3>
                <p className="text-[11px] text-slate-400">
                  Foco diário em Vendas, Entregas e Escala de Anúncios
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {taskProgress}% concluído
            </span>
          </div>

          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${taskProgress}%` }}
            />
          </div>

          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              placeholder="Nova tarefa rápida..."
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <select
              value={taskTag}
              onChange={(e) => setTaskTag(e.target.value as CeoTask['tag'])}
              className="px-2 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300"
            >
              <option value="vendas">Vendas</option>
              <option value="dev">Dev</option>
              <option value="trafego">Tráfego</option>
              <option value="financeiro">Finanças</option>
            </select>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              +
            </button>
          </form>

          <div className="space-y-2 pt-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                  task.done
                    ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-500 line-through'
                    : 'bg-slate-950 border-white/10 text-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    sound.playSelect();
                    leadService.toggleTask(task.id);
                  }}
                  className="flex items-center gap-2.5 text-left text-xs flex-1 cursor-pointer"
                >
                  <span
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                      task.done
                        ? 'bg-emerald-400 text-slate-950'
                        : 'border border-slate-600'
                    }`}
                  >
                    {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                  <span>{task.text}</span>
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-cyan-300">
                    {task.tag}
                  </span>
                  <button
                    type="button"
                    onClick={() => leadService.deleteTask(task.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. FÁBRICA DE SOFTWARE, COFRE DE LINKS VERCEL & ENTREGAS (DEV OPS)
// ============================================================================
export function AdminDevFactoryTab({
  templates,
  closedLeads,
  onToggleChecklist,
  onTogglePayment,
}: {
  templates: AgencyTemplate[];
  closedLeads: Lead[];
  onToggleChecklist: (
    leadId: string,
    key: keyof ProjectChecklist,
    currentVal: boolean
  ) => void;
  onTogglePayment: (
    leadId: string,
    field: 'paidDeposit' | 'paidFinal',
    val: boolean
  ) => void;
}) {
  const [tplName, setTplName] = useState('');
  const [tplNiche, setTplNiche] = useState('Advocacia / Jurídico');
  const [tplUrl, setTplUrl] = useState('');
  const [tplPrice, setTplPrice] = useState(2400);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplName.trim() || !tplUrl.trim()) return;
    sound.playSuccess();
    leadService.addTemplate({
      name: tplName.trim(),
      niche: tplNiche,
      url: tplUrl.trim().startsWith('http') ? tplUrl.trim() : `https://${tplUrl.trim()}`,
      highlights: 'Modelo de alta conversão pronto para demonstração ao cliente.',
      suggestedPrice: Number(tplPrice) || 2200,
    });
    setTplName('');
    setTplUrl('');
  };

  const copyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    sound.playSelect();
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* SECTION A: VERCEL LINKS & TEMPLATES VAULT */}
      <div className="p-6 rounded-2xl bg-[#090D1A] border border-cyan-500/30 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
              ARSENAL DE DEMONSTRAÇÃO DO CEO
            </span>
            <h3 className="text-lg font-extrabold text-white mt-0.5">
              Cofre de Sites & Sistemas Prontos (Links Vercel por Nicho)
            </h3>
            <p className="text-xs text-slate-400">
              Guarde todos os seus links prontos da Vercel aqui para copiar em 1 clique e mandar para o lead no WhatsApp.
            </p>
          </div>
        </div>

        {/* Add New Template Form */}
        <form
          onSubmit={handleAddTemplate}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-xl bg-slate-950 border border-white/10"
        >
          <input
            type="text"
            required
            placeholder="Nome do Projeto (ex: Clínica Odonto Prime)"
            value={tplName}
            onChange={(e) => setTplName(e.target.value)}
            className="sm:col-span-3 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
          />
          <input
            type="text"
            required
            placeholder="Link Vercel (ex: https://meu-site.vercel.app)"
            value={tplUrl}
            onChange={(e) => setTplUrl(e.target.value)}
            className="sm:col-span-4 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-cyan-300 font-mono"
          />
          <input
            type="text"
            placeholder="Nicho"
            value={tplNiche}
            onChange={(e) => setTplNiche(e.target.value)}
            className="sm:col-span-2 px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-white"
          />
          <input
            type="number"
            placeholder="Valor R$"
            value={tplPrice}
            onChange={(e) => setTplPrice(Number(e.target.value))}
            className="sm:col-span-1 px-2 py-2 rounded-lg bg-slate-900 border border-white/10 text-xs text-emerald-400 font-mono"
          />
          <button
            type="submit"
            className="sm:col-span-2 py-2 px-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs cursor-pointer"
          >
            + Salvar Link
          </button>
        </form>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-xl bg-[#0C1222] border border-white/10 hover:border-cyan-400/50 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300">
                    {tpl.niche}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Sugerido: R$ {tpl.suggestedPrice.toLocaleString('pt-BR')}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{tpl.name}</h4>
                <div className="text-[11px] font-mono text-cyan-400 truncate">{tpl.url}</div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => copyLink(tpl.id, tpl.url)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{copiedId === tpl.id ? 'Copiado!' : 'Copiar Link'}</span>
                </button>

                <a
                  href={tpl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-cyan-400/15 hover:bg-cyan-400/25 text-cyan-300"
                  title="Abrir site em nova aba"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => leadService.deleteTemplate(tpl.id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION B: CLOSED PROJECTS & PRODUCTION CHECKLIST */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
          <Rocket className="w-5 h-5 text-emerald-400" />
          <span>Projetos Fechados em Produção & Controle de Pagamento 50/50 ({closedLeads.length})</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {closedLeads.map((project) => {
            const cl = project.checklist || {
              briefing: true,
              designMobile: false,
              domainHosting: false,
              whatsappAutomation: false,
              finalDelivery: false,
            };
            const steps: { key: keyof ProjectChecklist; label: string }[] = [
              { key: 'briefing', label: '1. Briefing, Identidade & Copywriting' },
              { key: 'designMobile', label: '2. Desenvolvimento Mobile-First Rápido' },
              { key: 'domainHosting', label: '3. Domínio .com.br + Hospedagem Nuvem' },
              { key: 'whatsappAutomation', label: '4. Fluxo de Triagem WhatsApp 24/7' },
              { key: 'finalDelivery', label: '5. Entrega Oficial + Projeto no Ar' },
            ];

            const doneCount = steps.filter((s) => cl[s.key]).length;
            const pct = Math.round((doneCount / steps.length) * 100);
            const halfVal = Math.round((project.budgetEstimate || 2000) / 2);

            return (
              <div
                key={project.id}
                className="p-5 rounded-2xl bg-[#090D1A] border border-emerald-500/30 space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
                      {project.segment}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      {project.businessName} ({project.name})
                    </h4>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-sm font-extrabold text-emerald-400">
                      R$ {(project.budgetEstimate || 2000).toLocaleString('pt-BR')}
                    </div>
                    <div className="text-[10px] text-slate-400">{pct}% concluído</div>
                  </div>
                </div>

                {/* Payment 50% / 50% Control */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-950 border border-white/5">
                  <button
                    type="button"
                    onClick={() =>
                      onTogglePayment(project.id, 'paidDeposit', !project.paidDeposit)
                    }
                    className={`p-2 rounded-lg border text-xs font-mono font-bold flex items-center justify-between cursor-pointer ${
                      project.paidDeposit
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-white/10 text-slate-400'
                    }`}
                  >
                    <span>50% Sinal (R$ {halfVal})</span>
                    <span>{project.paidDeposit ? 'PAGO ✅' : 'PENDENTE'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onTogglePayment(project.id, 'paidFinal', !project.paidFinal)
                    }
                    className={`p-2 rounded-lg border text-xs font-mono font-bold flex items-center justify-between cursor-pointer ${
                      project.paidFinal
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900 border-white/10 text-slate-400'
                    }`}
                  >
                    <span>50% Entrega (R$ {halfVal})</span>
                    <span>{project.paidFinal ? 'PAGO ✅' : 'PENDENTE'}</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {steps.map((s) => {
                    const checked = cl[s.key];
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => onToggleChecklist(project.id, s.key, checked)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          checked
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 font-semibold'
                            : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{s.label}</span>
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center ${
                            checked
                              ? 'bg-emerald-400 text-slate-950'
                              : 'bg-slate-800 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
