import React, { useState } from 'react';
import { Sidebar, ViewId } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { LeadsView } from './views/LeadsView';
import { ProspectingView } from './views/ProspectingView';
import { AgentsView } from './views/AgentsView';
import { CadencesView } from './views/CadencesView';
import { WhatsappDisparosView } from './views/WhatsappDisparosView';
import { EmailFollowupView } from './views/EmailFollowupView';
import { OpportunitiesView } from './views/OpportunitiesView';
import { KanbanView } from './views/KanbanView';
import { IntegrationsView } from './views/IntegrationsView';
import { SettingsView } from './views/SettingsView';

import {
  initialStats,
  initialLeads,
  initialAgents,
  initialCadences,
  initialWhatsappDispatches,
  initialEmailTemplates,
  initialIntegrations,
} from './mockData';
import { Lead, LeadStatus, Agent, Cadence, WhatsappDispatch, EmailTemplate, Integration } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Core App State
  const [stats, setStats] = useState(initialStats);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [cadences, setCadences] = useState<Cadence[]>(initialCadences);
  const [dispatches, setDispatches] = useState<WhatsappDispatch[]>(initialWhatsappDispatches);
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialEmailTemplates);
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);

  // Derived metrics
  const activeAgentsCount = agents.filter((a) => a.active).length;
  const opportunitiesCount = leads.filter(
    (l) => l.opportunityScore === 'HIGH' || l.siteStatus === 'SEM_SITE' || l.siteStatus === 'DESATUALIZADO'
  ).length;

  // Handlers
  const handleImportLead = (newLead: Lead) => {
    setLeads((prev) => {
      if (prev.some((l) => l.id === newLead.id || l.company === newLead.company)) return prev;
      return [newLead, ...prev];
    });

    setStats((prev) => ({
      ...prev,
      totalLeads: prev.totalLeads + 1,
      whatsappValids: newLead.whatsappValid ? prev.whatsappValids + 1 : prev.whatsappValids,
      opportunitiesCount: newLead.opportunityScore === 'HIGH' ? prev.opportunitiesCount + 1 : prev.opportunitiesCount,
      pipelineValue: prev.pipelineValue + newLead.estimatedValue,
    }));
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              status: newStatus,
              lastInteraction: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : l
      )
    );
  };

  const handleAddAgent = (newAgent: Agent) => {
    setAgents((prev) => [newAgent, ...prev]);
  };

  const handleToggleAgent = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, active: !a.active } : a))
    );
  };

  const handleAddCadence = (newCadence: Cadence) => {
    setCadences((prev) => [newCadence, ...prev]);
  };

  const handleStartCampaign = (newDispatch: WhatsappDispatch) => {
    setDispatches((prev) => [newDispatch, ...prev]);
    setStats((prev) => ({
      ...prev,
      dispatchesToday: prev.dispatchesToday + newDispatch.sentCount,
    }));
  };

  const handleAddEmailTemplate = (newTpl: EmailTemplate) => {
    setTemplates((prev) => [newTpl, ...prev]);
  };

  const handleToggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === id ? { ...int, connected: !int.connected, lastSync: 'Agora' } : int
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        leadsCount={leads.length}
        opportunitiesCount={opportunitiesCount}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header
          currentView={currentView}
          onNavigate={setCurrentView}
          onQuickSearch={() => setCurrentView('prospecting')}
          activeAgentsCount={activeAgentsCount}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              stats={stats}
              leads={leads}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'leads' && (
            <LeadsView
              leads={leads}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onNavigateToAgents={() => setCurrentView('agents')}
              agentsCount={agents.length}
            />
          )}

          {currentView === 'prospecting' && (
            <ProspectingView
              onImportLead={handleImportLead}
              existingLeads={leads}
            />
          )}

          {currentView === 'agents' && (
            <AgentsView
              agents={agents}
              onAddAgent={handleAddAgent}
              onToggleAgent={handleToggleAgent}
              sampleLeads={leads}
            />
          )}

          {currentView === 'cadences' && (
            <CadencesView
              cadences={cadences}
              onAddCadence={handleAddCadence}
            />
          )}

          {currentView === 'whatsapp' && (
            <WhatsappDisparosView
              dispatches={dispatches}
              leads={leads}
              onStartCampaign={handleStartCampaign}
            />
          )}

          {currentView === 'email' && (
            <EmailFollowupView
              templates={templates}
              onAddTemplate={handleAddEmailTemplate}
            />
          )}

          {currentView === 'opportunities' && (
            <OpportunitiesView
              leads={leads}
              onProspectLead={(lead) => {
                setCurrentView('leads');
              }}
            />
          )}

          {currentView === 'kanban' && (
            <KanbanView
              leads={leads}
              onUpdateLeadStatus={handleUpdateLeadStatus}
            />
          )}

          {currentView === 'integrations' && (
            <IntegrationsView
              integrations={integrations}
              onToggleConnection={handleToggleIntegration}
            />
          )}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
