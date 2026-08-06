import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Globe,
  Building2,
  Sparkles,
  MessageSquare,
  Send,
  MoreHorizontal,
  ChevronRight,
  Eye,
  GitFork,
  CheckCircle2,
  AlertCircle,
  X,
  Bot,
  Loader2,
} from 'lucide-react';
import { Lead, LeadStatus, OpportunityScore } from '../types';

interface LeadsViewProps {
  leads: Lead[];
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onNavigateToAgents: () => void;
  agentsCount: number;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onUpdateLeadStatus,
  onNavigateToAgents,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [scoreFilter, setScoreFilter] = useState<string>('ALL');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // AI Message Generation Modal state
  const [messagingLead, setMessagingLead] = useState<Lead | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [generating, setGenerating] = useState(false);
  const [agentTone, setAgentTone] = useState<'consultivo' | 'formal' | 'agressivo'>('consultivo');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.segment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    const matchesScore = scoreFilter === 'ALL' || lead.opportunityScore === scoreFilter;

    return matchesSearch && matchesStatus && matchesScore;
  });

  const handleGenerateAIMessage = async (lead: Lead) => {
    setMessagingLead(lead);
    setGenerating(true);
    setGeneratedMessage('');

    try {
      const response = await fetch('/api/ai-sdr/generate-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead,
          agent: {
            name: 'Lucas AI SDR',
            tone: agentTone,
            objective: 'marcar_reuniao',
            channel: 'WHATSAPP',
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedMessage(data.message);
      }
    } catch (err) {
      console.error('Error generating AI message:', err);
      setGeneratedMessage(
        `Olá ${lead.name}! Vi a ${lead.company} no Google em ${lead.city}. Notei que vocês ${lead.siteStatus === 'SEM_SITE' ? 'não possuem um site oficial registrado' : 'poderiam converter mais clientes no WhatsApp'}. Podemos conversar 10 minutos essa semana?`
      );
    } finally {
      setGenerating(false);
    }
  };

  const statusLabels: Record<LeadStatus, { label: string; color: string }> = {
    NOVO_LEAD: { label: 'Novo Lead', color: 'bg-slate-100 text-slate-800 border-slate-200' },
    CONTATO_INICIADO: { label: 'Contato Iniciado', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    RESPONDEU: { label: 'Respondeu', color: 'bg-indigo-100 text-indigo-800 border-indigo-200 font-bold' },
    QUALIFICADO: { label: 'Qualificado', color: 'bg-amber-100 text-amber-800 border-amber-200 font-bold' },
    PROPOSTA: { label: 'Proposta Enviada', color: 'bg-purple-100 text-purple-800 border-purple-200 font-bold' },
    FECHADO: { label: 'Fechado (Ganho)', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold' },
    PERDIDO: { label: 'Perdido', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Filtrar por empresa, nome ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Todos os Status</option>
              <option value="NOVO_LEAD">Novo Lead</option>
              <option value="CONTATO_INICIADO">Contato Iniciado</option>
              <option value="RESPONDEU">Respondeu</option>
              <option value="QUALIFICADO">Qualificado</option>
              <option value="PROPOSTA">Proposta</option>
              <option value="FECHADO">Fechado</option>
            </select>

            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Todos os Scores</option>
              <option value="HIGH">🔴 Alta Oportunidade</option>
              <option value="MEDIUM">🟡 Média Oportunidade</option>
              <option value="LOW">🟢 Baixa Oportunidade</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Exibindo <strong className="text-slate-900">{filteredLeads.length}</strong> de {leads.length} leads
        </div>
      </div>

      {/* CRM Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-wider bg-slate-50">
                <th className="p-3.5">Empresa / Contato</th>
                <th className="p-3.5">Segmento & Local</th>
                <th className="p-3.5">WhatsApp / Email</th>
                <th className="p-3.5">Presença Digital</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Score IA</th>
                <th className="p-3.5 text-right">Ações SDR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                  {/* Company */}
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900 text-sm">{lead.company}</p>
                    <p className="text-[11px] text-slate-500">{lead.name}</p>
                  </td>

                  {/* Segment & City */}
                  <td className="p-3.5">
                    <p className="font-medium text-slate-800">{lead.segment}</p>
                    <p className="text-[11px] text-slate-500">{lead.city}</p>
                  </td>

                  {/* WhatsApp / Email */}
                  <td className="p-3.5">
                    <p className="font-mono font-medium text-slate-800 flex items-center gap-1">
                      {lead.phone}
                      {lead.whatsappValid && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-sans font-semibold">
                          Wsp
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[160px]">{lead.email}</p>
                  </td>

                  {/* Presence / Site Status */}
                  <td className="p-3.5">
                    {lead.siteStatus === 'SEM_SITE' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        🔴 Sem Site
                      </span>
                    )}
                    {lead.siteStatus === 'DESATUALIZADO' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        🟡 Desatualizado
                      </span>
                    )}
                    {lead.siteStatus === 'OK' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        🟢 Site OK
                      </span>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-3.5">
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                        statusLabels[lead.status]?.color || 'bg-slate-100'
                      }`}
                    >
                      <option value="NOVO_LEAD">Novo Lead</option>
                      <option value="CONTATO_INICIADO">Contato Iniciado</option>
                      <option value="RESPONDEU">Respondeu</option>
                      <option value="QUALIFICADO">Qualificado</option>
                      <option value="PROPOSTA">Proposta</option>
                      <option value="FECHADO">Fechado</option>
                      <option value="PERDIDO">Perdido</option>
                    </select>
                  </td>

                  {/* Score */}
                  <td className="p-3.5">
                    {lead.opportunityScore === 'HIGH' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                        Alta Oportunidade
                      </span>
                    )}
                    {lead.opportunityScore === 'MEDIUM' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                        Média Oportunidade
                      </span>
                    )}
                    {lead.opportunityScore === 'LOW' && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-slate-100 text-slate-700">
                        Baixa
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right space-x-1">
                    <button
                      onClick={() => handleGenerateAIMessage(lead)}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                      title="Gerar Mensagem de Prospecção com IA"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI SDR</span>
                    </button>
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer inline-flex"
                      title="Ver Detalhes do Lead"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Modal / Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{selectedLead.company}</h3>
                <p className="text-xs text-slate-500">{selectedLead.name} • {selectedLead.segment}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-900 text-xs block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Diagnóstico da Oportunidade IA
                </span>
                <p className="text-indigo-800">{selectedLead.scoreReason}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[11px]">Cidade</span>
                  <span className="font-semibold">{selectedLead.city}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">CNPJ</span>
                  <span className="font-mono font-semibold">{selectedLead.cnpj || 'Não cadastrado'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Telefone / WhatsApp</span>
                  <span className="font-mono font-semibold">{selectedLead.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Email</span>
                  <span className="font-semibold">{selectedLead.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Instagram</span>
                  <span className="font-semibold text-indigo-600">{selectedLead.instagram || 'Sem Instagram'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Valor Estimado</span>
                  <span className="font-bold text-emerald-700">R$ {selectedLead.estimatedValue.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              {selectedLead.notes && (
                <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                  <span className="font-bold text-slate-800 text-[11px] block mb-0.5">Notas da Negociação:</span>
                  <p>{selectedLead.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  const target = selectedLead;
                  setSelectedLead(null);
                  handleGenerateAIMessage(target);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Disparar AI SDR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Message Preview / Dispatch Modal */}
      {messagingLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Abordagem AI SDR para {messagingLead.company}</h3>
                  <p className="text-xs text-slate-500">Contato: {messagingLead.name} ({messagingLead.phone})</p>
                </div>
              </div>
              <button
                onClick={() => setMessagingLead(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Agent Tone selector */}
            <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-700">Tom da Abordagem:</span>
              <div className="flex items-center gap-1">
                {(['consultivo', 'formal', 'agressivo'] as const).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setAgentTone(tone)}
                    className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                      agentTone === tone
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generated Textarea */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Mensagem Gerada pela IA:</label>
              {generating ? (
                <div className="h-36 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 gap-2 text-xs">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  <span>Analisando {messagingLead.company} e gerando abordagem...</span>
                </div>
              ) : (
                <textarea
                  value={generatedMessage}
                  onChange={(e) => setGeneratedMessage(e.target.value)}
                  rows={6}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-sans leading-relaxed focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleGenerateAIMessage(messagingLead)}
                disabled={generating}
                className="px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Gerar Outra Opção
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMessagingLead(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    onUpdateLeadStatus(messagingLead.id, 'CONTATO_INICIADO');
                    alert(`Mensagem disparada com sucesso via WhatsApp para ${messagingLead.company}!`);
                    setMessagingLead(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Enviar via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
