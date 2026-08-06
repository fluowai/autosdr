import React, { useState } from 'react';
import {
  Kanban as KanbanIcon,
  Plus,
  MessageSquare,
  Mail,
  DollarSign,
  Building2,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react';
import { Lead, LeadStatus } from '../types';

interface KanbanViewProps {
  leads: Lead[];
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
}

const KANBAN_COLUMNS: { id: LeadStatus; title: string; color: string; border: string }[] = [
  { id: 'NOVO_LEAD', title: 'Novo Lead', color: 'bg-slate-100 text-slate-800', border: 'border-slate-300' },
  { id: 'CONTATO_INICIADO', title: 'Contato Iniciado', color: 'bg-blue-100 text-blue-800', border: 'border-blue-300' },
  { id: 'RESPONDEU', title: 'Respondeu', color: 'bg-indigo-100 text-indigo-800', border: 'border-indigo-300' },
  { id: 'QUALIFICADO', title: 'Qualificado', color: 'bg-amber-100 text-amber-800', border: 'border-amber-300' },
  { id: 'PROPOSTA', title: 'Proposta Enviada', color: 'bg-purple-100 text-purple-800', border: 'border-purple-300' },
  { id: 'FECHADO', title: 'Fechado (Venda)', color: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-300' },
];

export const KanbanView: React.FC<KanbanViewProps> = ({
  leads,
  onUpdateLeadStatus,
}) => {
  const getNextStatus = (current: LeadStatus): LeadStatus | null => {
    const order: LeadStatus[] = ['NOVO_LEAD', 'CONTATO_INICIADO', 'RESPONDEU', 'QUALIFICADO', 'PROPOSTA', 'FECHADO'];
    const idx = order.indexOf(current);
    if (idx !== -1 && idx < order.length - 1) return order[idx + 1];
    return null;
  };

  const getPrevStatus = (current: LeadStatus): LeadStatus | null => {
    const order: LeadStatus[] = ['NOVO_LEAD', 'CONTATO_INICIADO', 'RESPONDEU', 'QUALIFICADO', 'PROPOSTA', 'FECHADO'];
    const idx = order.indexOf(current);
    if (idx > 0) return order[idx - 1];
    return null;
  };

  return (
    <div className="space-y-6 pb-12 overflow-hidden">
      {/* Top Pipeline Stats */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <KanbanIcon className="w-5 h-5 text-blue-600" />
            Funil Kanban de Vendas B2B
          </h2>
          <p className="text-xs text-slate-500">
            Acompanhe o avanço das oportunidades. Alterne as etapas conforme a evolução com o lead.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px]">Total em Pipeline</span>
            <span className="font-bold text-emerald-700 text-sm">
              R$ {leads.reduce((sum, l) => sum + l.estimatedValue, 0).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-300">
        {KANBAN_COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.id);
          const colValue = colLeads.reduce((sum, l) => sum + l.estimatedValue, 0);

          return (
            <div
              key={col.id}
              className="w-72 shrink-0 bg-slate-100/80 rounded-2xl p-3 border border-slate-200 flex flex-col max-h-[75vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80 px-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.color}`}>
                    {col.title}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{colLeads.length}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-600 font-semibold">
                  R$ {(colValue / 1000).toFixed(0)}k
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-300">
                {colLeads.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-300 rounded-xl">
                    Nenhum lead nesta etapa
                  </div>
                ) : (
                  colLeads.map((lead) => {
                    const prev = getPrevStatus(lead.status);
                    const next = getNextStatus(lead.status);

                    return (
                      <div
                        key={lead.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2.5"
                      >
                        {/* Company & Score */}
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs leading-snug">{lead.company}</h4>
                            <p className="text-[11px] text-slate-500">{lead.name}</p>
                          </div>

                          {lead.opportunityScore === 'HIGH' && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                              ALTA
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2 rounded-lg">
                          <p className="truncate"><strong>Segmento:</strong> {lead.segment}</p>
                          <p className="truncate font-mono"><strong>Tel:</strong> {lead.phone}</p>
                          {lead.siteStatus === 'SEM_SITE' && (
                            <p className="text-rose-600 font-bold text-[10px]">🔴 Sem Site Institucional</p>
                          )}
                        </div>

                        {/* Value & Channel */}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                          <span className="font-bold text-emerald-700 font-mono text-[11px]">
                            R$ {lead.estimatedValue.toLocaleString('pt-BR')}
                          </span>

                          <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            <MessageSquare className="w-3 h-3 text-emerald-600" /> WhatsApp
                          </span>
                        </div>

                        {/* Move stage controls */}
                        <div className="flex items-center justify-between pt-1">
                          {prev ? (
                            <button
                              onClick={() => onUpdateLeadStatus(lead.id, prev)}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="Voltar etapa"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div></div>
                          )}

                          {next && (
                            <button
                              onClick={() => onUpdateLeadStatus(lead.id, next)}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center gap-0.5"
                              title="Avançar etapa"
                            >
                              <span>Avançar</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
