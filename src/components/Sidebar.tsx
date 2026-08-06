import React from 'react';
import {
  LayoutDashboard,
  Users,
  Search,
  Bot,
  GitFork,
  MessageSquare,
  Mail,
  Zap,
  Kanban,
  Plug,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export type ViewId = 
  | 'dashboard'
  | 'leads'
  | 'prospecting'
  | 'agents'
  | 'cadences'
  | 'whatsapp'
  | 'email'
  | 'opportunities'
  | 'kanban'
  | 'integrations'
  | 'settings';

interface SidebarProps {
  currentView: ViewId;
  onSelectView: (view: ViewId) => void;
  leadsCount: number;
  opportunitiesCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  leadsCount,
  opportunitiesCount,
  collapsed,
  onToggleCollapse,
}) => {
  const menuItems: { id: ViewId; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'leads', label: 'Leads (CRM)', icon: <Users className="w-5 h-5" />, badge: leadsCount, badgeColor: 'bg-slate-800 text-slate-300' },
    { id: 'prospecting', label: 'Prospecção', icon: <Search className="w-5 h-5" />, badge: 'IA Maps', badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium' },
    { id: 'agents', label: 'Agentes (AI SDR)', icon: <Bot className="w-5 h-5" />, badge: '3 Ativos', badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
    { id: 'cadences', label: 'Cadências', icon: <GitFork className="w-5 h-5" /> },
    { id: 'whatsapp', label: 'Disparos WhatsApp', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'email', label: 'Email Follow-up', icon: <Mail className="w-5 h-5" /> },
    { id: 'opportunities', label: 'Oportunidades', icon: <Zap className="w-5 h-5" />, badge: opportunitiesCount, badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold' },
    { id: 'kanban', label: 'Kanban (Funil)', icon: <Kanban className="w-5 h-5" /> },
    { id: 'integrations', label: 'Integrações', icon: <Plug className="w-5 h-5" /> },
    { id: 'settings', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-slate-900 text-slate-300 flex flex-col z-30 transition-all duration-300 border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header / Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-950/50">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                AutoSDR <span className="text-[10px] uppercase tracking-widest bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">AI v2</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Outbound & Growth SDR</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* AI SDR Live Operational Badge */}
      {!collapsed && (
        <div className="mx-3 my-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-200 font-medium text-xs">Agente SDR Ativo</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
            AUTOPILOT
          </span>
        </div>
      )}

      {/* Menu Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                {item.icon}
              </span>
              {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
              {!collapsed && item.badge !== undefined && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge !== undefined && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-white text-sm">
            B2B
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Sua Empresa B2B</p>
              <p className="text-[11px] text-emerald-400 truncate flex items-center gap-1 font-medium">
                <TrendingUp className="w-3 h-3" /> Plano Unlimited SDR
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
