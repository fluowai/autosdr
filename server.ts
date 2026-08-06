import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Route: Prospect Search / Scraping with AI Enriched Data
app.post('/api/prospect/search', async (req, res) => {
  try {
    const { query, city, segment, hasWebsite, hasInstagram, hasWhatsapp } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // Fallback simulated enrichment if no GEMINI_API_KEY is configured
      const fallbackResults = generateFallbackProspects(query || 'Empresas', city || 'São Paulo');
      return res.json({ success: true, results: fallbackResults, isMock: true });
    }

    const prompt = `Você é um motor de scraping B2B e inteligência de mercado do Google Maps no Brasil.
Pesquise ou gere 6 empresas reais ou altamente realistas no Brasil para a busca: "${query || segment || 'Empresas'}" na cidade "${city || 'São Paulo - SP'}".
Filtros solicitados:
- Possui site: ${hasWebsite !== undefined ? (hasWebsite ? 'Sim' : 'Não') : 'Misto'}
- Possui Instagram: ${hasInstagram ? 'Sim' : 'Qualquer'}
- Tem WhatsApp: ${hasWhatsapp ? 'Sim' : 'Qualquer'}

Retorne uma lista JSON estruturada contendo:
- name: nome da pessoa de contato (ex: Carlos Silva)
- company: nome da empresa
- segment: segmento detalhado
- city: cidade e estado (ex: São Paulo - SP)
- phone: telefone fixo ou WhatsApp formatado no padrão BR (ex: (11) 98877-6655)
- whatsappValid: boolean
- email: email de contato
- website: URL do site ou string vazia se não tiver
- siteStatus: "OK" (site moderno), "DESATUALIZADO" (site ruim) ou "SEM_SITE" (sem site)
- instagram: handle do Instagram com @ ou vazio
- cnpj: CNPJ formatado válido
- opportunityScore: "HIGH" (se sem site ou sem presença digital), "MEDIUM" (se site ruim), "LOW" (se empresa estruturada)
- scoreReason: breve explicação comercial de 1 frase do porquê essa empresa é uma boa oportunidade de prospecção
- estimatedValue: valor numérico em BRL estimado da oportunidade (ex: 8500)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              company: { type: Type.STRING },
              segment: { type: Type.STRING },
              city: { type: Type.STRING },
              phone: { type: Type.STRING },
              whatsappValid: { type: Type.BOOLEAN },
              email: { type: Type.STRING },
              website: { type: Type.STRING },
              siteStatus: { type: Type.STRING },
              instagram: { type: Type.STRING },
              cnpj: { type: Type.STRING },
              opportunityScore: { type: Type.STRING },
              scoreReason: { type: Type.STRING },
              estimatedValue: { type: Type.NUMBER },
            },
            required: ['company', 'phone', 'siteStatus', 'opportunityScore', 'scoreReason'],
          },
        },
      },
    });

    const jsonText = response.text || '[]';
    const parsed = JSON.parse(jsonText);
    
    // Add unique IDs and origins
    const results = parsed.map((item: any, idx: number) => ({
      ...item,
      id: `scraped-${Date.now()}-${idx}`,
      status: 'NOVO_LEAD',
      origin: 'Google Maps Scraping IA',
      createdAt: new Date().toISOString().split('T')[0],
    }));

    res.json({ success: true, results, isMock: false });
  } catch (error: any) {
    console.error('Error in prospect search:', error);
    const fallbackResults = generateFallbackProspects(req.body.query || 'Empresas', req.body.city || 'São Paulo');
    res.json({ success: true, results: fallbackResults, isMock: true, error: error.message });
  }
});

// API Route: AI SDR Message Generation
app.post('/api/ai-sdr/generate-message', async (req, res) => {
  try {
    const { lead, agent, customContext } = req.body;
    const ai = getAIClient();

    if (!ai) {
      const fallbackMsg = `Olá ${lead.name || 'tudo bem'}! Vi a ${lead.company} no Google em ${lead.city}. Notei que ${lead.siteStatus === 'SEM_SITE' ? 'vocês ainda não possuem um site oficial' : 'seu site poderia converter até 3x mais clientes no WhatsApp'}. Podemos bater um papo rápido de 10 minutos essa semana?`;
      return res.json({ success: true, message: fallbackMsg, isMock: true });
    }

    const prompt = `Você é um Agente AI SDR (Sales Development Representative) de elite B2B.
Suas configurações:
- Nome do agente: ${agent?.name || 'SDR Bot'}
- Tom de comunicação: ${agent?.tone || 'consultivo'} (Opções: formal, consultivo, agressivo, descontraido)
- Objetivo da mensagem: ${agent?.objective || 'marcar_reuniao'} (Opções: marcar_reuniao, qualificar, vender, resgatar_frio)
- Canal preferencial: ${agent?.channel || 'WHATSAPP'} (Opções: WHATSAPP, EMAIL)
- Regras adicionais: ${agent?.customPrompt || 'Seja direto e foque no valor gerado'}

Dados do Lead/Empresa a ser prospectado:
- Nome do contato: ${lead.name}
- Empresa: ${lead.company}
- Segmento: ${lead.segment}
- Cidade: ${lead.city}
- Status do Site: ${lead.siteStatus} (${lead.website || 'Sem site'})
- Instagram: ${lead.instagram || 'Sem instagram'}
- Score de oportunidade: ${lead.opportunityScore} - Razão: ${lead.scoreReason}
${customContext ? `Contexto extra do usuário: ${customContext}` : ''}

Escreva uma mensagem perfeita e pronta para envio pelo canal ${agent?.channel || 'WHATSAPP'}.
Se for WhatsApp, use quebras de linha leves e tom humano, com até 3 parágrafos curtos.
Se for Email, inclua uma linha de Assunto ("Assunto: ...") antes do corpo da mensagem.
Não use clichês de vendas. Foque na dor da empresa e no ganho claro.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ success: true, message: response.text, isMock: false });
  } catch (error: any) {
    console.error('Error generating AI SDR message:', error);
    res.json({
      success: true,
      message: `Olá ${req.body.lead?.name || 'tudo bem'}! Gostaria de apresentar uma oportunidade incrível para a ${req.body.lead?.company || 'sua empresa'}. Podemos conversar?`,
      isMock: true,
    });
  }
});

// Helper: Fallback prospects generator
function generateFallbackProspects(query: string, city: string) {
  const segments = ['Imobiliária', 'Clínica Médica', 'Restaurante', 'Escritório de Advocacia', 'Autocenter', 'Studio de Estética'];
  return Array.from({ length: 6 }).map((_, i) => {
    const isNoSite = i % 2 === 0;
    const isOutdated = i % 3 === 0 && !isNoSite;
    const companyName = `${query} ${['Nacional', 'Central', 'VIP', 'Master', 'Express', 'Elite'][i]}`;
    return {
      id: `fallback-${Date.now()}-${i}`,
      name: ['Marcos Silva', 'Luciana Costa', 'Paulo Henrique', 'Renata Souza', 'Diego Ramos', 'Camila Duarte'][i],
      company: companyName,
      segment: segments[i % segments.length],
      city: city || 'São Paulo - SP',
      phone: `(${11 + i}) 98${i}76-543${i}`,
      whatsappValid: true,
      email: `contato@${companyName.toLowerCase().replace(/[^a-z0-0]/g, '')}.com.br`,
      website: isNoSite ? '' : `www.${companyName.toLowerCase().replace(/[^a-z0-0]/g, '')}.com.br`,
      siteStatus: isNoSite ? 'SEM_SITE' : (isOutdated ? 'DESATUALIZADO' : 'OK'),
      instagram: `@${companyName.toLowerCase().replace(/[^a-z0-0]/g, '')}`,
      cnpj: `${10 + i}.${234 + i}.${567 + i}/0001-${80 + i}`,
      opportunityScore: isNoSite ? 'HIGH' : (isOutdated ? 'MEDIUM' : 'LOW'),
      scoreReason: isNoSite 
        ? 'Empresa sem site institucional. Alta oportunidade para venda de site e automação.'
        : (isOutdated ? 'Site antigo desatualizado e lento no celular.' : 'Empresa estruturada com presença online.'),
      estimatedValue: (i + 1) * 3500 + 4000,
      status: 'NOVO_LEAD',
      origin: 'Google Maps Scraping',
      createdAt: new Date().toISOString().split('T')[0],
    };
  });
}

// Start Server & Vite Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
