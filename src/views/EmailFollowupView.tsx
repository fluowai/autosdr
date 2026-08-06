import React, { useState } from 'react';
import {
  Mail,
  Send,
  Sparkles,
  CheckCircle2,
  FileText,
  Plus,
  Copy,
  Edit,
} from 'lucide-react';
import { EmailTemplate } from '../types';

interface EmailFollowupViewProps {
  templates: EmailTemplate[];
  onAddTemplate: (tpl: EmailTemplate) => void;
}

export const EmailFollowupView: React.FC<EmailFollowupViewProps> = ({
  templates,
  onAddTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(templates[0]);
  const [subject, setSubject] = useState(templates[0]?.subject || '');
  const [body, setBody] = useState(templates[0]?.body || '');

  const [aiGenerating, setAiGenerating] = useState(false);

  const handleApplyTemplate = (tpl: EmailTemplate) => {
    setSelectedTemplate(tpl);
    setSubject(tpl.subject);
    setBody(tpl.body);
  };

  const handleAIEnhanceSubject = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setSubject((prev) => `[Exclusivo para {empresa}] ${prev.replace(/\[Exclusivo.*?\]\s*/, '')}`);
      setAiGenerating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            Email Follow-up & Sequências Outbound
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Crie emails frios de alta conversão com alta entregabilidade via SMTP e variáveis dinâmicas de personalização
          </p>
        </div>

        <button
          onClick={handleAIEnhanceSubject}
          disabled={aiGenerating}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-4 h-4" /> Otimizar Assunto com IA
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates Sidebar */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Templates Pré-Configurados ({templates.length})
          </h3>

          <div className="space-y-3">
            {templates.map((tpl) => {
              const isSelected = selectedTemplate.id === tpl.id;

              return (
                <div
                  key={tpl.id}
                  onClick={() => handleApplyTemplate(tpl)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <h4 className="font-bold text-slate-900 text-xs">{tpl.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate mt-1">{tpl.subject}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Email Editor */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">Editor de Sequência de Email</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Linha de Assunto (Subject):</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Corpo do E-mail:</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-sans leading-relaxed focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <span className="text-[11px] text-slate-400">Variáveis: {'{nome}'}, {'{empresa}'}, {'{cidade}'}</span>
            <button
              onClick={() => alert('Sequência salva com sucesso no motor de disparos!')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Salvar Sequência de Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
