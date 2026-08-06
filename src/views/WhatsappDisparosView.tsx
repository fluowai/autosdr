import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  CheckCheck,
  RotateCcw,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Lead, WhatsappDispatch } from '../types';

interface WhatsappDisparosViewProps {
  dispatches: WhatsappDispatch[];
  leads: Lead[];
  onStartCampaign: (campaign: WhatsappDispatch) => void;
}

export const WhatsappDisparosView: React.FC<WhatsappDisparosViewProps> = ({
  dispatches,
  leads,
  onStartCampaign,
}) => {
  const [campaignName, setCampaignName] = useState('Campanha Outbound WhatsApp - ' + new Date().toLocaleDateString('pt-BR'));
  const [templateMsg, setTemplateMsg] = useState(
    'Olá {nome}, tudo bem? Vi a {empresa} no Google em {cidade}. Notei que vocês ainda não possuem um site institucional responsivo. Posso te enviar uma prévia sem compromisso?'
  );
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set(leads.map((l) => l.id)));

  const [isDispathing, setIsDispatching] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggleSelectAll = () => {
    if (selectedLeadIds.size === leads.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(leads.map((l) => l.id)));
    }
  };

  const toggleSelectLead = (id: string) => {
    const next = new Set(selectedLeadIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedLeadIds(next);
  };

  const handleStartDispatch = () => {
    if (selectedLeadIds.size === 0) return;

    setIsDispatching(true);
    setProgress(10);

    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += 15;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        setIsDispatching(false);

        const newDispatch: WhatsappDispatch = {
          id: `disp-${Date.now()}`,
          campaignName,
          totalLeads: selectedLeadIds.size,
          sentCount: selectedLeadIds.size,
          deliveredCount: Math.round(selectedLeadIds.size * 0.98),
          readCount: Math.round(selectedLeadIds.size * 0.75),
          repliedCount: Math.round(selectedLeadIds.size * 0.32),
          status: 'CONCLUIDO',
          templateMessage: templateMsg,
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        };

        onStartCampaign(newDispatch);
        alert('Disparo em massa concluído com sucesso!');
      } else {
        setProgress(currentProgress);
      }
    }, 400);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            Disparos em Massa & Automação WhatsApp
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Envie mensagens com variáveis dinâmicas e atraso aleatório para simular digitação humana e evitar bloqueios
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-700">Instância WhatsApp Conectada</span>
        </div>
      </div>

      {/* Campaign Builder & Audience Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Box */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-600" /> Configurar Nova Campanha
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nome da Campanha:</label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Mensagem do Disparo (suporta variáveis):</label>
                <div className="flex items-center gap-1 text-[11px] text-indigo-600">
                  <Sparkles className="w-3 h-3" />
                  <span>Personalização Dinâmica</span>
                </div>
              </div>

              <textarea
                value={templateMsg}
                onChange={(e) => setTemplateMsg(e.target.value)}
                rows={5}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-sans leading-relaxed focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              ></textarea>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {['{nome}', '{empresa}', '{cidade}', '{segmento}'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setTemplateMsg((prev) => prev + ' ' + v)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    + {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bar when dispatching */}
          {isDispathing && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> Disparando mensagens via WhatsApp...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-emerald-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <button
            onClick={handleStartDispatch}
            disabled={isDispathing || selectedLeadIds.size === 0}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isDispathing ? (
              <span>Enviando...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Iniciar Disparo para {selectedLeadIds.size} Contatos</span>
              </>
            )}
          </button>
        </div>

        {/* Audience Selector List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-600" />
              <h3 className="font-bold text-sm text-slate-900">Público Alvo</h3>
            </div>
            <button
              onClick={toggleSelectAll}
              className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              {selectedLeadIds.size === leads.length ? 'Desmarcar Todos' : 'Marcar Todos'}
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
            {leads.map((lead) => {
              const isChecked = selectedLeadIds.has(lead.id);

              return (
                <div
                  key={lead.id}
                  onClick={() => toggleSelectLead(lead.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300 text-slate-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <p className="text-xs">{lead.company}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{lead.phone}</p>
                  </div>

                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Past Campaigns History */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">Histórico de Disparos Realizados</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-wider bg-slate-50">
                <th className="p-3">Campanha</th>
                <th className="p-3">Total Leads</th>
                <th className="p-3">Enviados</th>
                <th className="p-3">Entregues</th>
                <th className="p-3">Lidos</th>
                <th className="p-3">Respondidos</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dispatches.map((disp) => (
                <tr key={disp.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{disp.campaignName}</td>
                  <td className="p-3 font-mono font-bold text-slate-800">{disp.totalLeads}</td>
                  <td className="p-3 font-mono text-blue-700">{disp.sentCount}</td>
                  <td className="p-3 font-mono text-emerald-700">{disp.deliveredCount}</td>
                  <td className="p-3 font-mono text-indigo-700">{disp.readCount}</td>
                  <td className="p-3 font-mono font-extrabold text-emerald-800">{disp.repliedCount}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Concluído
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
