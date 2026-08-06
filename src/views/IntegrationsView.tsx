import React, { useState } from 'react';
import {
  Plug,
  MessageSquare,
  Search,
  Building2,
  Mail,
  RefreshCw,
  CheckCircle2,
  XCircle,
  QrCode,
  Sparkles,
  X,
  ExternalLink,
} from 'lucide-react';
import { Integration } from '../types';

interface IntegrationsViewProps {
  integrations: Integration[];
  onToggleConnection: (id: string) => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  integrations,
  onToggleConnection,
}) => {
  const [qrModalOpen, setQrModalOpen] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Plug className="w-6 h-6 text-blue-600" />
            Conexões & Integrações de Sistema
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie as conexões ativas com o WhatsApp Business API, Servidor SMTP, Google Maps Scraper e Receita Federal
          </p>
        </div>

        <button
          onClick={() => setQrModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 shrink-0"
        >
          <QrCode className="w-4 h-4" /> Visualizar QR Code WhatsApp
        </button>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((int) => (
          <div
            key={int.id}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="p-3 bg-slate-50 rounded-2xl text-slate-800 border border-slate-100">
                  {int.category === 'whatsapp' && <MessageSquare className="w-6 h-6 text-emerald-600" />}
                  {int.category === 'scraping' && <Search className="w-6 h-6 text-indigo-600" />}
                  {int.category === 'cnpj' && <Building2 className="w-6 h-6 text-blue-600" />}
                  {int.category === 'email' && <Mail className="w-6 h-6 text-amber-600" />}
                  {int.category === 'crm' && <RefreshCw className="w-6 h-6 text-purple-600" />}
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    int.connected
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {int.connected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Conectado</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>Desconectado</span>
                    </>
                  )}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">{int.name}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{int.description}</p>
              </div>

              {int.details && (
                <div className="p-2.5 bg-slate-50 rounded-xl text-xs font-mono text-slate-700 border border-slate-100">
                  {int.details}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Sinc: {int.lastSync || 'Nunca'}</span>
              <button
                onClick={() => onToggleConnection(int.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  int.connected
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {int.connected ? 'Reconectar' : 'Conectar Agora'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Modal for WhatsApp */}
      {qrModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-center animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-left">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" /> QR Code WhatsApp
              </h3>
              <button
                onClick={() => setQrModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
              {/* Simulated QR Code SVG */}
              <svg className="w-48 h-48 mx-auto" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 10h10v10H40zM50 20h10v10H50zM30 40h10v10H30zM50 40h20v10H50zM80 40h10v20H80zM10 50h20v10H10zM40 60h10v30H40zM60 60h10v10H60zM70 70h20v10H70zM80 80h20v20H80z" />
              </svg>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Abra o WhatsApp no seu celular &gt; Aparelhos Conectados &gt; Conectar um Aparelho e aponte para a tela.
            </p>

            <button
              onClick={() => setQrModalOpen(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer"
            >
              Confirmar Conexão Ativa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
