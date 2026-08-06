export type OpportunityScore = 'HIGH' | 'MEDIUM' | 'LOW';

export type SiteStatus = 'OK' | 'DESATUALIZADO' | 'SEM_SITE';

export type LeadStatus = 
  | 'NOVO_LEAD' 
  | 'CONTATO_INICIADO' 
  | 'RESPONDEU' 
  | 'QUALIFICADO' 
  | 'PROPOSTA' 
  | 'FECHADO' 
  | 'PERDIDO';

export type ChannelType = 'WHATSAPP' | 'EMAIL' | 'MULTICANAL';

export interface Lead {
  id: string;
  name: string;
  company: string;
  segment: string;
  city: string;
  phone: string;
  whatsappValid: boolean;
  email: string;
  website: string;
  siteStatus: SiteStatus;
  instagram?: string;
  cnpj?: string;
  opportunityScore: OpportunityScore;
  scoreReason: string;
  status: LeadStatus;
  origin: string;
  estimatedValue: number;
  lastInteraction?: string;
  lastChannel?: ChannelType;
  notes?: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string; // e.g. "SDR Inbound", "BDR Outbound SaaS"
  avatarUrl: string;
  tone: 'formal' | 'consultivo' | 'agressivo' | 'descontraido';
  objective: 'marcar_reuniao' | 'qualificar' | 'vender' | 'resgatar_frio';
  channel: ChannelType;
  active: boolean;
  totalConversations: number;
  conversionRate: number; // percentage
  customPrompt?: string;
}

export interface CadenceStep {
  id: string;
  day: number;
  channel: 'WHATSAPP' | 'EMAIL';
  title: string;
  contentTemplate: string;
  autoSend: boolean;
}

export interface Cadence {
  id: string;
  name: string;
  targetSegment: string;
  stepsCount: number;
  activeLeads: number;
  completedLeads: number;
  steps: CadenceStep[];
  active: boolean;
}

export interface WhatsappDispatch {
  id: string;
  campaignName: string;
  totalLeads: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  repliedCount: number;
  status: 'RASCUNHO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'PAUSADO';
  templateMessage: string;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  title: string;
  subject: string;
  body: string;
  category: 'prospeccao_fria' | 'followup' | 'proposta' | 'breakup';
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'whatsapp' | 'email' | 'scraping' | 'cnpj' | 'crm';
  connected: boolean;
  iconName: string;
  lastSync?: string;
  details?: string;
}

export interface DashboardStats {
  totalLeads: number;
  whatsappValids: number;
  opportunitiesCount: number;
  responseRate: number;
  dispatchesToday: number;
  pipelineValue: number;
}
