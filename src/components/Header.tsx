import React, { useState } from 'react';
import { Search, Bell, Sparkles, Plus, Play, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ViewId } from './Sidebar';

interface HeaderProps {
  currentView: ViewId;
  onNavigate: (view: ViewId) => void;
  onQuickSearch: (query: string) => void;
  activeAgentsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onQuickSearch,
  activeAgentsCount,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const viewTitles: Record<ViewId, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard de Operação', subtitle: 'Métricas gerais de prospecção, disparos e taxa de conversão B2B' },
    leads: { title: 'CRM de Leads Enriquecidos', subtitle: 'Gerencie sua base com contatos validados, telefones e score de oportunidade' },
    prospecting: { title: 'Prospecção Automática Google Maps', subtitle: 'Busque empresas por cidade e segmento com detecção inteligente de site e CNPJ' },
    agents: { title: 'Agentes Automatizados (AI SDR / BDR)', subtitle: 'Configure inteligências artificiais com diferentes tons e objetivos de venda' },
    cadences: { title: 'Cadências Multicanal', subtitle: 'Sequências automatizadas de mensagens via WhatsApp e Email com follow-up' },
    whatsapp: { title: 'Disparos em Massa WhatsApp', subtitle: 'Campanhas diretas com envio humanizado, personalização e métricas em tempo real' },
    email: { title: 'Sequências de Email Outbound', subtitle: 'Templates frios, testes de assunto e fluxos automatizados de follow-up' },
    opportunities: { title: 'Score de Oportunidades Quentes', subtitle: 'Empresas identificadas sem site ou com presencia digital fraca prontas para fechar' },
    kanban: { title: 'Funil de Vendas Kanban', subtitle: 'Acompanhe as etapas de negociação desde o primeiro contato até o fechamento' },
    integrations: { title: 'Conexões & Integrações', subtitle: 'Status das instâncias do WhatsApp, SMTP, scraping do Google e API de CNPJ' },
    settings: { title: 'Configurações do Sistema', subtitle: 'Parâmetros operacionais, horários de envio e limites dos Agentes AI' },
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onQuickSearch(searchVal.trim());
      onNavigate('prospecting');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Title & Context */}
      <div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          {viewTitles[currentView]?.title || 'AutoSDR AI'}
        </h1>
        <p className="text-xs text-slate-500 hidden sm:block">
          {viewTitles[currentView]?.subtitle || 'Plataforma B2B de Automação Outbound'}
        </p>
      </div>

      {/* Center Search / Action bar */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-72">
          <input
            type="text"
            placeholder="Buscar empresas ex: Imobiliárias SP..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>

        {/* Quick Prospect Button */}
        <button
          onClick={() => onNavigate('prospecting')}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nova Busca</span>
        </button>

        {/* AI Agent Quick Status Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200/80 rounded-xl text-blue-800 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>{activeAgentsCount} Agentes Operando</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative transition-colors cursor-pointer"
            title="Notificações da Automação"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-3 px-4 z-50 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="font-bold text-slate-900">Atividades Recentes do Agente</span>
                <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                  Tempo Real
                </span>
              </div>
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                <div className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Lead Respondeu no WhatsApp!</p>
                    <p className="text-slate-500 text-[11px]">Roberto Mendonça (Advocacia) respondeu à cadência. Qualificado automaticamente.</p>
                    <span className="text-[10px] text-slate-400">Há 12 min</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-xl">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800">Scraping Concluído</p>
                    <p className="text-slate-500 text-[11px]">6 novas empresas encontradas em São Paulo sem site institucional.</p>
                    <span className="text-[10px] text-slate-400">Há 35 min</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
