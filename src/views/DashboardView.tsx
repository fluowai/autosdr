import React from 'react';
import {
  Users,
  MessageSquare,
  Zap,
  CheckCircle2,
  Send,
  DollarSign,
  TrendingUp,
  Search,
  Sparkles,
  ArrowUpRight,
  Bot,
  Filter,
} from 'lucide-react';
import { DashboardStats, Lead } from '../types';
import { ViewId } from '../components/Sidebar';

interface DashboardViewProps {
  stats: DashboardStats;
  leads: Lead[];
  onNavigate: (view: ViewId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  leads,
  onNavigate,
}) => {
  const highOppLeads = leads.filter((l) => l.opportunityScore === 'HIGH').length;
  const whatsappValidsPercent = Math.round((stats.whatsappValids / (stats.totalLeads || 1)) * 100);

  // Conversion funnel stage calculation
  const novoCount = leads.filter((l) => l.status === 'NOVO_LEAD').length;
  const contatoCount = leads.filter((l) => l.status === 'CONTATO_INICIADO').length;
  const respondeuCount = leads.filter((l) => l.status === 'RESPONDEU').length;
  const qualificadoCount = leads.filter((l) => l.status === 'QUALIFICADO').length;
  const propostaCount = leads.filter((l) => l.status === 'PROPOSTA').length;
  const fechadoCount = leads.filter((l) => l.status === 'FECHADO').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Alert */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg border border-blue-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Agente AI SDR Operando</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-medium border border-emerald-500/30">
                PROSPECÇÃO ATIVA
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Identificamos <strong className="text-blue-200">{highOppLeads} empresas com alta oportunidade (sem site)</strong> prontas para abordagem automatizada hoje.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('opportunities')}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" /> Ver Oportunidades
          </button>
          <button
            onClick={() => onNavigate('prospecting')}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" /> Buscar Mais
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total de Leads</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{stats.totalLeads.toLocaleString('pt-BR')}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14% essa semana
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">WhatsApp Válido</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{stats.whatsappValids.toLocaleString('pt-BR')}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            <span className="text-emerald-600 font-bold">{whatsappValidsPercent}%</span> de taxa de validação
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Oportunidades</span>
            <Zap className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600 tracking-tight">{stats.opportunitiesCount}</p>
          <p className="text-[11px] text-rose-600 font-semibold mt-1">
            Sem site ou presencia fraca
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Taxa de Resposta</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{stats.responseRate}%</p>
          <p className="text-[11px] text-blue-600 font-medium mt-1">
            Média da indústria: 12%
          </p>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Disparos Hoje</span>
            <Send className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{stats.dispatchesToday}</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Limite seguro: 1000/dia
          </p>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Valor em Pipeline</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 tracking-tight">
            R$ {(stats.pipelineValue / 1000).toFixed(0)}k
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {leads.length} oportunidades ativas
          </p>
        </div>
      </div>

      {/* Main Grid: Pipeline Funnel + Visual Lead Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Mini Funnel (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Funil Visual de Conversão SDR</h2>
              <p className="text-xs text-slate-500">Distribuição dos leads em tempo real por etapa do CRM</p>
            </div>
            <button
              onClick={() => onNavigate('kanban')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              Abrir Kanban <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Funnel Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> 1. Novo Lead
                </span>
                <span className="font-bold text-slate-900">{novoCount} leads ({Math.round((novoCount/leads.length)*100 || 0)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full transition-all duration-500" style={{ width: `${Math.max((novoCount/leads.length)*100, 8)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> 2. Contato Iniciado (AI SDR)
                </span>
                <span className="font-bold text-slate-900">{contatoCount} leads ({Math.round((contatoCount/leads.length)*100 || 0)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${Math.max((contatoCount/leads.length)*100, 10)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> 3. Respondeu
                </span>
                <span className="font-bold text-slate-900">{respondeuCount} leads ({Math.round((respondeuCount/leads.length)*100 || 0)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${Math.max((respondeuCount/leads.length)*100, 12)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 4. Qualificado
                </span>
                <span className="font-bold text-slate-900">{qualificadoCount} leads ({Math.round((qualificadoCount/leads.length)*100 || 0)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${Math.max((qualificadoCount/leads.length)*100, 14)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> 5. Proposta Enviada
                </span>
                <span className="font-bold text-slate-900">{propostaCount} leads ({Math.round((propostaCount/leads.length)*100 || 0)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${Math.max((propostaCount/leads.length)*100, 16)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 6. Fechado (Venda)
                </span>
                <span className="font-bold text-emerald-700">{fechadoCount} leads ({Math.round((fechadoCount/leads.length)*100 || 0)}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.max((fechadoCount/leads.length)*100, 18)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Agent Live Feed & Recent Opportunities */}
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-sm text-white">IA SDR Trabalhando</span>
              </div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-medium border border-indigo-500/30">
                LIVE LOG
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span>Lucas AI • WhatsApp</span>
                  <span>Agora</span>
                </div>
                <p className="text-slate-200 font-medium">Enviou abordagem para <strong>Imobiliária Prime SP</strong></p>
                <p className="text-slate-400 text-[11px] mt-1 italic">"Olá Carlos, vi que não possuem site cadastrado no Google..."</p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span>Google Scraping Bot</span>
                  <span>Há 8 min</span>
                </div>
                <p className="text-slate-200 font-medium">Scrapeou <strong>Clínica Odonto Glow</strong></p>
                <p className="text-emerald-400 text-[11px] mt-1 font-mono">
                  [CNPJ 23.456.789/0001-01 Validado]
                </p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                  <span>Sofia AI • Email</span>
                  <span>Há 22 min</span>
                </div>
                <p className="text-slate-200 font-medium">Qualificou lead <strong>Mendonça Advocacia</strong></p>
                <p className="text-indigo-300 text-[11px] mt-1">
                  Agendamento confirmado para Quinta às 10h.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('agents')}
            className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl text-center transition-all cursor-pointer shadow-md"
          >
            Gerenciar Agentes AI
          </button>
        </div>
      </div>

      {/* High Opportunity Leads Table Preview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-rose-500" />
              Empresas com Maior Potencial de Fechamento Rápidos
            </h2>
            <p className="text-xs text-slate-500">
              Empresas sem site ou com presença digital precária descobertas recentemente pelo Google Scraping
            </p>
          </div>
          <button
            onClick={() => onNavigate('opportunities')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            Ver Todas ({highOppLeads}) <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-wider bg-slate-50">
                <th className="p-3 rounded-l-xl">Empresa</th>
                <th className="p-3">Segmento & Cidade</th>
                <th className="p-3">Status do Site</th>
                <th className="p-3">WhatsApp / Telefone</th>
                <th className="p-3">Score</th>
                <th className="p-3 rounded-r-xl text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.filter((l) => l.opportunityScore === 'HIGH').slice(0, 4).map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{lead.company}</p>
                    <p className="text-[11px] text-slate-500">{lead.name}</p>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-slate-800">{lead.segment}</p>
                    <p className="text-[11px] text-slate-500">{lead.city}</p>
                  </td>
                  <td className="p-3">
                    {lead.siteStatus === 'SEM_SITE' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        🔴 SEM SITE
                      </span>
                    )}
                    {lead.siteStatus === 'DESATUALIZADO' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        🟡 DESATUALIZADO
                      </span>
                    )}
                    {lead.siteStatus === 'OK' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        🟢 SITE OK
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-slate-700">
                    {lead.phone}
                    {lead.whatsappValid && (
                      <span className="ml-1 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-sans font-medium">
                        Wsp Válido
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                      ALTA (Score 95/100)
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onNavigate('leads')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs transition-all cursor-pointer"
                    >
                      Disparar AI SDR
                    </button>
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
