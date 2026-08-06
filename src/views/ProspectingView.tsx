import React, { useState } from 'react';
import {
  Search,
  Filter,
  Building2,
  Globe,
  Phone,
  Instagram,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Bot,
  RefreshCw,
  Loader2,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { Lead, OpportunityScore, SiteStatus } from '../types';

interface ProspectingViewProps {
  onImportLead: (lead: Lead) => void;
  existingLeads: Lead[];
}

export const ProspectingView: React.FC<ProspectingViewProps> = ({
  onImportLead,
  existingLeads,
}) => {
  const [query, setQuery] = useState('Imobiliárias em São Paulo');
  const [city, setCity] = useState('São Paulo - SP');
  const [segment, setSegment] = useState('Imobiliária');
  const [hasWebsite, setHasWebsite] = useState<'ALL' | 'NO' | 'YES'>('ALL');
  const [hasInstagramFilter, setHasInstagramFilter] = useState(false);
  const [hasWhatsappFilter, setHasWhatsappFilter] = useState(true);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [results, setResults] = useState<Lead[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setLoadingStep('Scrapeando Google Maps & Busca B2B...');

    try {
      setTimeout(() => setLoadingStep('Enriquecendo telefones e validando WhatsApp...'), 800);
      setTimeout(() => setLoadingStep('Consultando CNPJ e Sócios na Receita Federal...'), 1600);
      setTimeout(() => setLoadingStep('Analisando presença digital e gerando Score de Oportunidade IA...'), 2400);

      const response = await fetch('/api/prospect/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          city,
          segment,
          hasWebsite: hasWebsite === 'ALL' ? undefined : hasWebsite === 'YES',
          hasInstagram: hasInstagramFilter,
          hasWhatsapp: hasWhatsappFilter,
        }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.results)) {
        setResults(data.results);
      }
    } catch (err) {
      console.error('Scraping error:', err);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setLoadingStep('');
      }, 3000);
    }
  };

  const handleImportSingle = (lead: Lead) => {
    onImportLead(lead);
    setImportedIds((prev) => new Set(prev).add(lead.id));
  };

  const handleImportAll = () => {
    results.forEach((lead) => {
      if (!importedIds.has(lead.id)) {
        onImportLead(lead);
      }
    });
    setImportedIds(new Set(results.map((r) => r.id)));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-blue-900/40">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Motor de Prospecção & Scraping IA
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Encontre Empresas e Oportunidades em Qualquer Cidade do Brasil
          </h2>
          <p className="text-xs text-slate-300">
            O algoritmo busca empresas no Google, detecta a qualidade do site, valida o WhatsApp e enriquece o CNPJ automaticamente para o seu AI SDR.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Imobiliárias em São Paulo, Clínicas de Estética no Rio, Autocenters em Curitiba..."
                className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Buscando...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Buscar Empresas</span>
                </>
              )}
            </button>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 text-[11px] font-medium">Cidade / Estado</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: São Paulo - SP"
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 text-[11px] font-medium">Segmento</label>
              <input
                type="text"
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                placeholder="Ex: Imobiliária"
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 text-[11px] font-medium">Filtro de Site</label>
              <select
                value={hasWebsite}
                onChange={(e) => setHasWebsite(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200"
              >
                <option value="ALL">Todos os sites</option>
                <option value="NO">🔴 Apenas Sem Site (Alta Oportunidade)</option>
                <option value="YES">🟢 Apenas com site</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="instaFilter"
                checked={hasInstagramFilter}
                onChange={(e) => setHasInstagramFilter(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="instaFilter" className="text-slate-300 text-xs cursor-pointer">
                Possui Instagram
              </label>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="wspFilter"
                checked={hasWhatsappFilter}
                onChange={(e) => setHasWhatsappFilter(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="wspFilter" className="text-slate-300 text-xs cursor-pointer">
                WhatsApp Validado
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* Loading Bar Indicator */}
      {loading && (
        <div className="p-6 bg-white border border-indigo-100 rounded-2xl shadow-xs text-center space-y-3 animate-pulse">
          <div className="flex items-center justify-center gap-2 text-indigo-700 font-bold text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{loadingStep}</span>
          </div>
          <div className="w-full h-2 bg-indigo-50 rounded-full overflow-hidden max-w-md mx-auto">
            <div className="h-full bg-indigo-600 animate-pulse w-3/4 rounded-full"></div>
          </div>
          <p className="text-xs text-slate-500">
            Aguarde enquanto os robôs do Google Scraping extraem dados atualizados do mercado.
          </p>
        </div>
      )}

      {/* Results Section */}
      {hasSearched && !loading && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {results.length} Empresas Encontradas para "{query}"
              </h3>
              <p className="text-xs text-slate-500">
                Score de Oportunidade gerado pela IA baseado na presença digital e necessidade de site/automação
              </p>
            </div>

            {results.length > 0 && (
              <button
                onClick={handleImportAll}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Importar Todos para o CRM ({results.length})</span>
              </button>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((lead) => {
              const isImported = importedIds.has(lead.id);

              return (
                <div
                  key={lead.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 relative"
                >
                  {/* Top Info */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug">{lead.company}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {lead.segment} • {lead.city}
                        </p>
                      </div>

                      {/* Score Badge */}
                      {lead.opportunityScore === 'HIGH' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200 shrink-0">
                          🔴 ALTA OPORTUNIDADE
                        </span>
                      )}
                      {lead.opportunityScore === 'MEDIUM' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                          🟡 MÉDIA OPORTUNIDADE
                        </span>
                      )}
                      {lead.opportunityScore === 'LOW' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                          🟢 BAIXA OPORTUNIDADE
                        </span>
                      )}
                    </div>

                    {/* AI Score Explanation */}
                    <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-900 mb-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-600" /> Insight IA:
                      </p>
                      <p className="text-slate-600 leading-tight">{lead.scoreReason}</p>
                    </div>

                    {/* Contact & Presence Details */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> WhatsApp / Tel:
                        </span>
                        <span className="font-mono font-bold text-slate-800 flex items-center gap-1">
                          {lead.phone}
                          {lead.whatsappValid && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" title="WhatsApp Ativo" />
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Globe className="w-3.5 h-3.5 text-slate-400" /> Site Oficial:
                        </span>
                        {lead.siteStatus === 'SEM_SITE' && (
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                            Não possui site
                          </span>
                        )}
                        {lead.siteStatus === 'DESATUALIZADO' && (
                          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                            Desatualizado / Lento
                          </span>
                        )}
                        {lead.siteStatus === 'OK' && (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            {lead.website}
                          </span>
                        )}
                      </div>

                      {lead.instagram && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <Instagram className="w-3.5 h-3.5 text-slate-400" /> Instagram:
                          </span>
                          <span className="font-medium text-indigo-600">{lead.instagram}</span>
                        </div>
                      )}

                      {lead.cnpj && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> CNPJ:
                          </span>
                          <span className="font-mono text-slate-700 text-[11px]">{lead.cnpj}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Est. R$ {lead.estimatedValue.toLocaleString('pt-BR')}
                    </span>

                    {isImported ? (
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Importado
                      </span>
                    ) : (
                      <button
                        onClick={() => handleImportSingle(lead)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Importar Lead</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Initial state before searching */}
      {!hasSearched && !loading && (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-4 max-w-xl mx-auto shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Inicie uma Pesquisa de Empresas
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Digite o segmento e a cidade desejada (ex: "Clínicas de Odontologia em Campinas" ou "Autocenters em Curitiba"). Nossa inteligência vai raspar o Google, identificar se possuem site e classificar as melhores oportunidades.
          </p>
          <button
            onClick={() => handleSearch()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Buscar Exemplos em São Paulo
          </button>
        </div>
      )}
    </div>
  );
};
