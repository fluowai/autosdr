import React, { useState } from 'react';
import { Settings, Clock, ShieldCheck, Bot, Sparkles, Save, Key } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [workingHoursStart, setWorkingHoursStart] = useState('08:00');
  const [workingHoursEnd, setWorkingHoursEnd] = useState('19:00');
  const [dailyMaxMessages, setDailyMaxMessages] = useState('800');
  const [minDelaySeconds, setMinDelaySeconds] = useState('15');
  const [maxDelaySeconds, setMaxDelaySeconds] = useState('45');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Configurações da Plataforma AutoSDR
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Ajuste horários de operação dos robôs, limites de segurança de disparo e parâmetros operacionais
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Anti-Ban & Limits */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Parâmetros de Segurança Anti-Bloqueio WhatsApp
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Limite Máximo de Disparos por Dia:</label>
              <input
                type="number"
                value={dailyMaxMessages}
                onChange={(e) => setDailyMaxMessages(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
              />
              <p className="text-[10px] text-slate-400 mt-1">Recomendado: até 1.000 mensagens/dia por conta.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Intervalo Mín/Máx entre Mensagens (segundos):</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minDelaySeconds}
                  onChange={(e) => setMinDelaySeconds(e.target.value)}
                  className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-center"
                />
                <span className="text-slate-400">até</span>
                <input
                  type="number"
                  value={maxDelaySeconds}
                  onChange={(e) => setMaxDelaySeconds(e.target.value)}
                  className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Horário Comercial de Funcionamento do AI SDR
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Início da Operação:</label>
              <input
                type="time"
                value={workingHoursStart}
                onChange={(e) => setWorkingHoursStart(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Término da Operação:</label>
              <input
                type="time"
                value={workingHoursEnd}
                onChange={(e) => setWorkingHoursEnd(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* API Credentials Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-600" /> Credenciais da IA e do Servidor
          </h3>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" /> Google Gemini API Key:
            </p>
            <p className="text-slate-500 text-[11px]">
              Sua chave de API do Gemini é gerenciada pelo painel de Secrets do Google AI Studio e injetada no backend com suporte completo ao modelo Gemini 3.6 Flash.
            </p>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 animate-in fade-in">
              ✓ Configurações salvas com sucesso!
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Salvar Alterações
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
