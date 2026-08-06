import React, { useState } from 'react';
import {
  GitFork,
  Plus,
  MessageSquare,
  Mail,
  Clock,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  ArrowDown,
  X,
  Send,
} from 'lucide-react';
import { Cadence, CadenceStep } from '../types';

interface CadencesViewProps {
  cadences: Cadence[];
  onAddCadence: (cadence: Cadence) => void;
}

export const CadencesView: React.FC<CadencesViewProps> = ({
  cadences,
  onAddCadence,
}) => {
  const [selectedCadence, setSelectedCadence] = useState<Cadence>(cadences[0]);
  const [isAddStepOpen, setIsAddStepOpen] = useState(false);

  // New step state
  const [stepDay, setStepDay] = useState(5);
  const [stepChannel, setStepChannel] = useState<'WHATSAPP' | 'EMAIL'>('WHATSAPP');
  const [stepTitle, setStepTitle] = useState('Follow-up WhatsApp (Mensagem Personalizada)');
  const [stepTemplate, setStepTemplate] = useState('Olá {nome}, conseguiu analisar nossa proposta para a {empresa}?');

  const handleAddStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStep: CadenceStep = {
      id: `step-${Date.now()}`,
      day: Number(stepDay),
      channel: stepChannel,
      title: stepTitle,
      contentTemplate: stepTemplate,
      autoSend: true,
    };

    const updatedSteps = [...selectedCadence.steps, newStep].sort((a, b) => a.day - b.day);
    const updatedCadence = { ...selectedCadence, steps: updatedSteps, stepsCount: updatedSteps.length };

    setSelectedCadence(updatedCadence);
    setIsAddStepOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GitFork className="w-6 h-6 text-blue-600" />
            Cadências Multicanal de Follow-up
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Crie sequências automatizadas combinando WhatsApp e Email para garantir 100% de contato com todos os leads
          </p>
        </div>

        <button
          onClick={() => setIsAddStepOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Adicionar Etapa à Cadência
        </button>
      </div>

      {/* Cadences Selection Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-slate-200">
        {cadences.map((cad) => {
          const isSelected = selectedCadence.id === cad.id;
          return (
            <button
              key={cad.id}
              onClick={() => setSelectedCadence(cad)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{cad.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {cad.activeLeads} leads ativos
              </span>
            </button>
          );
        })}
      </div>

      {/* Visual Cadence Flow Builder */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">{selectedCadence.name}</h3>
            <p className="text-xs text-slate-500">Segmento alvo: {selectedCadence.targetSegment}</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-slate-500">{selectedCadence.completedLeads} leads concluídos</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px]">
              ● Cadência Ativa
            </span>
          </div>
        </div>

        {/* Vertical Flow Steps */}
        <div className="max-w-2xl mx-auto space-y-4 relative py-4">
          {selectedCadence.steps.map((step, idx) => {
            const isWhatsApp = step.channel === 'WHATSAPP';

            return (
              <React.Fragment key={step.id}>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs relative flex items-start gap-4">
                  {/* Day Badge */}
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-xs flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">Dia</span>
                    <span className="text-base leading-none font-mono text-amber-400">{step.day}</span>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isWhatsApp ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> WhatsApp
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 font-bold text-[10px] rounded-full flex items-center gap-1">
                            <Mail className="w-3 h-3" /> Email
                          </span>
                        )}
                        <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-400">
                        {step.autoSend ? 'Envio Automático' : 'Manual'}
                      </span>
                    </div>

                    {/* Template box */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-sans leading-relaxed whitespace-pre-wrap">
                      {step.contentTemplate}
                    </div>
                  </div>
                </div>

                {/* Arrow Down Connector */}
                {idx < selectedCadence.steps.length - 1 && (
                  <div className="flex items-center justify-center text-slate-300 py-1">
                    <ArrowDown className="w-5 h-5 animate-bounce" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Add Step Modal */}
      {isAddStepOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddStepSubmit} className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <GitFork className="w-5 h-5 text-indigo-600" /> Adicionar Etapa na Cadência
              </h3>
              <button
                type="button"
                onClick={() => setIsAddStepOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dia do Envio:</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={stepDay}
                    onChange={(e) => setStepDay(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Canal de Envio:</label>
                  <select
                    value={stepChannel}
                    onChange={(e) => setStepChannel(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  >
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="EMAIL">Email</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título da Etapa:</label>
                <input
                  type="text"
                  required
                  value={stepTitle}
                  onChange={(e) => setStepTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Template de Mensagem (com variáveis):</label>
                <textarea
                  rows={4}
                  required
                  value={stepTemplate}
                  onChange={(e) => setStepTemplate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-sans"
                ></textarea>
                <p className="text-[10px] text-slate-400 mt-1">Variáveis disponíveis: {'{nome}'}, {'{empresa}'}, {'{cidade}'}, {'{segmento}'}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddStepOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Salvar Etapa
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
