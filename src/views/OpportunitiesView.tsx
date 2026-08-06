import React, { useState } from 'react';
import {
  Zap,
  Globe,
  Instagram,
  Sparkles,
  ArrowUpRight,
  Send,
  Building2,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { Lead } from '../types';

interface OpportunitiesViewProps {
  leads: Lead[];
  onProspectLead: (lead: Lead) => void;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  leads,
  onProspectLead,
}) => {
  const [activeTab, setActiveTab] = useState<'NO_SITE' | 'OUTDATED' | 'NO_INSTA'>('NO_SITE');

  const noSiteLeads = leads.filter((l) => l.siteStatus === 'SEM_SITE');
  const outdatedLeads = leads.filter((l) => l.siteStatus === 'DESATUALIZADO');
  const noInstaLeads = leads.filter((l) => !l.instagram);

  const getActiveList = () => {
    if (activeTab === 'NO_SITE') return noSiteLeads;
    if (activeTab === 'OUTDATED') return outdatedLeads;
    return noInstaLeads;
  };

  const activeList = getActiveList();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-200 mb-2">
            <Zap className="w-3.5 h-3.5 fill-current" /> Oportunidades Quentes Detectadas
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Insights de Prospecção & Contatos com Alta Propensão de Compra
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Classificamos empresas onde a ausência de site ou presença digital gera dor imediata, facilitando o fechamento do seu AI SDR
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-slate-400 block font-medium">Oportunidades Totais</span>
          <span className="text-2xl font-extrabold text-rose-600">{noSiteLeads.length + outdatedLeads.length}</span>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('NO_SITE')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'NO_SITE'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>🔴 Sem Site Institucional</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'NO_SITE' ? 'bg-rose-800 text-white' : 'bg-rose-100 text-rose-800'}`}>
            {noSiteLeads.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('OUTDATED')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'OUTDATED'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>🟡 Site Desatualizado / Lento</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'OUTDATED' ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-800'}`}>
            {outdatedLeads.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('NO_INSTA')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'NO_INSTA'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>🟣 Sem Presença no Instagram</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'NO_INSTA' ? 'bg-purple-800 text-white' : 'bg-purple-100 text-purple-800'}`}>
            {noInstaLeads.length}
          </span>
        </button>
      </div>

      {/* Opportunity Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeList.map((lead) => (
          <div
            key={lead.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{lead.company}</h4>
                  <p className="text-xs text-slate-500">{lead.name} • {lead.city}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  SCORE 98%
                </span>
              </div>

              {/* AI Insight Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <p className="font-bold text-slate-800 mb-0.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Motivo da Oportunidade:
                </p>
                <p className="text-slate-600">{lead.scoreReason}</p>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Telefone:</strong> <span className="font-mono">{lead.phone}</span></p>
                <p><strong>CNPJ:</strong> <span className="font-mono">{lead.cnpj || 'Simulado'}</span></p>
              </div>
            </div>

            <button
              onClick={() => onProspectLead(lead)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Prospectar Agora com AI SDR</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
