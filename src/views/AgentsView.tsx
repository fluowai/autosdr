import React, { useState } from 'react';
import {
  Bot,
  Plus,
  Sparkles,
  CheckCircle2,
  Settings,
  MessageSquare,
  Send,
  Play,
  RotateCcw,
  Loader2,
  X,
  Sliders,
  TrendingUp,
} from 'lucide-react';
import { Agent, Lead } from '../types';

interface AgentsViewProps {
  agents: Agent[];
  onAddAgent: (agent: Agent) => void;
  onToggleAgent: (agentId: string) => void;
  sampleLeads: Lead[];
}

export const AgentsView: React.FC<AgentsViewProps> = ({
  agents,
  onAddAgent,
  onToggleAgent,
  sampleLeads,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const [selectedLead, setSelectedLead] = useState<Lead>(sampleLeads[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [testingMsg, setTestingMsg] = useState(false);
  const [testResultMsg, setTestResultMsg] = useState('');

  // Create Agent Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('SDR Outbound High-Ticket');
  const [newTone, setNewTone] = useState<'consultivo' | 'formal' | 'agressivo' | 'descontraido'>('consultivo');
  const [newObjective, setNewObjective] = useState<'marcar_reuniao' | 'qualificar' | 'vender' | 'resgatar_frio'>('marcar_reuniao');
  const [newChannel, setNewChannel] = useState<'WHATSAPP' | 'EMAIL' | 'MULTICANAL'>('WHATSAPP');

  const handleRunAgentTest = async () => {
    setTestingMsg(true);
    setTestResultMsg('');

    try {
      const response = await fetch('/api/ai-sdr/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: selectedLead,
          agent: selectedAgent,
          customContext: customPrompt,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTestResultMsg(data.message);
      }
    } catch (err) {
      console.error('Error running agent test:', err);
      setTestResultMsg(
        `Olá ${selectedLead.name}! Me chamo ${selectedAgent.name}. Analisei o perfil da ${selectedLead.company} e notei que vocês ${selectedLead.siteStatus === 'SEM_SITE' ? 'não possuem um site registrado no Google' : 'podem melhorar a taxa de conversão do site'}. Gostaria de agendar uma demonstração?`
      );
    } finally {
      setTestingMsg(false);
    }
  };

  const handleCreateAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: newName,
      role: newRole,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random()*1000)}?auto=format&fit=crop&q=80&w=250`,
      tone: newTone,
      objective: newObjective,
      channel: newChannel,
      active: true,
      totalConversations: 0,
      conversionRate: 0,
      customPrompt: 'Atue focado no benefício direto ao cliente e responda em até 3 parágrafos curtos.',
    };

    onAddAgent(newAgent);
    setSelectedAgent(newAgent);
    setIsCreateOpen(false);
    setNewName('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            Agentes Automatizados (AI SDR & BDR)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Agentes inteligentes que abordam leads automaticamente via WhatsApp e Email com diferentes personalidades e objetivos
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Criar Novo Agente AI
        </button>
      </div>

      {/* Main Grid: Agents Cards + AI Sandbox Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Agents List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Seus Agentes Configurados ({agents.length})
          </h3>

          <div className="space-y-3">
            {agents.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;

              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-md ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={agent.avatarUrl}
                        alt={agent.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-blue-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{agent.name}</h4>
                        <p className="text-xs text-slate-500">{agent.role}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAgent(agent.id);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                        agent.active
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {agent.active ? '● Ativo' : 'Pausado'}
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tom de Voz</span>
                      <span className="font-semibold capitalize text-slate-800">{agent.tone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Objetivo</span>
                      <span className="font-semibold text-slate-800">
                        {agent.objective === 'marcar_reuniao' ? 'Marcar Reunião' : 'Qualificação'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{agent.totalConversations} conversas iniciadas</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {agent.conversionRate}% conv.
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Interactive Agent Sandbox / Preview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Sandbox de Teste do Agente: <span className="text-blue-600">{selectedAgent.name}</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500">Simule como este AI SDR se comporta diante de um lead específico</p>
            </div>

            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-100">
              Modo Teste ao Vivo
            </span>
          </div>

          {/* Configuration Inputs for Test */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Select Lead */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Selecione o Lead para Simulação:</label>
              <select
                value={selectedLead.id}
                onChange={(e) => {
                  const found = sampleLeads.find((l) => l.id === e.target.value);
                  if (found) setSelectedLead(found);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500"
              >
                {sampleLeads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.company} ({l.segment} - {l.siteStatus === 'SEM_SITE' ? 'Sem Site' : 'Com Site'})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Extra Context */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Instrução Extra ao Agente (Opcional):</label>
              <input
                type="text"
                placeholder="Ex: Oferecer 20% de desconto no primeiro mês..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={handleRunAgentTest}
            disabled={testingMsg}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {testingMsg ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Raciocinando com IA Gemini...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Testar Geração de Abordagem para {selectedLead.company}</span>
              </>
            )}
          </button>

          {/* Test Output Box */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Preview da Mensagem Enviada pelo AI SDR:</span>
              <span className="text-[11px] text-slate-400 font-normal">Canal: {selectedAgent.channel}</span>
            </span>

            {testResultMsg ? (
              <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 space-y-3 font-sans text-xs leading-relaxed animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mensagem Pronta para Envio
                  </span>
                  <span>Tom: {selectedAgent.tone}</span>
                </div>
                <div className="whitespace-pre-wrap text-slate-200">{testResultMsg}</div>
              </div>
            ) : (
              <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs">
                Clique no botão acima para rodar o motor do Agente AI SDR e visualizar a mensagem gerada.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Agent Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateAgentSubmit} className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-600" /> Criar Novo Agente AI SDR
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Agente:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gabriel AI - SDR High Ticket"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Papel / Função:</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tom de Comunicação:</label>
                  <select
                    value={newTone}
                    onChange={(e) => setNewTone(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="consultivo">Consultivo</option>
                    <option value="formal">Formal</option>
                    <option value="agressivo">Agressivo</option>
                    <option value="descontraido">Descontraído</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Objetivo:</label>
                  <select
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="marcar_reuniao">Marcar Reunião</option>
                    <option value="qualificar">Qualificar</option>
                    <option value="vender">Venda Direta</option>
                    <option value="resgatar_frio">Resgatar Lead Frio</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Salvar Agente
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
