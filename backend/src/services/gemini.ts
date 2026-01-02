import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("🔑 Verificando GEMINI_API_KEY...");
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY não está configurada!");
} else {
  console.log("✅ GEMINI_API_KEY está configurada (primeiros 10 caracteres):", process.env.GEMINI_API_KEY.substring(0, 10) + "...");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Prompt para classificação de gastos
const EXPENSE_CLASSIFICATION_PROMPT = `Você é o motor de inteligência do LuminiFin. Sua função é processar frases de gastos.

Regras de Classificação: Use apenas estas categorias: [Mercado, Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Vestuário, Serviços, Investimentos, Outros].

Formato de Saída (Obrigatório): Retorne apenas um JSON com este formato:
{
  "texto_chat": "Gasto Classificado ✅, foram gastos R$ [VALOR] com [ICONE] [CATEGORIA]",
  "valor": 0.00,
  "categoria": "Nome da Categoria",
  "icone": "Emoji correspondente"
}

Categorias e Emojis:
- Mercado: 🛒
- Alimentação: 🍽️
- Transporte: 🚗
- Moradia: 🏠
- Lazer: 🎮
- Saúde: 🏥
- Educação: 📚
- Vestuário: 👕
- Serviços: 🔧
- Investimentos: 💰
- Outros: 📦

Se o valor não estiver claro, extraia o máximo possível da descrição.`;

// Prompt para dicas de metas
const GOALS_TIPS_PROMPT = `Você é o motor de insights do LuminiFin. Sua função é analisar o progresso financeiro do usuário e fornecer dicas curtas e motivacionais.

Diretrizes para as Dicas:

1. Analise qual meta está mais próxima de ser concluída e dê um incentivo extra para ela.
2. Se houver uma meta com prazo próximo e pouco progresso, faça um alerta amigável.
3. Caso o usuário tenha um bom valor total guardado, elogie a disciplina.
4. Considere oportunidades de economia em categorias de gastos.
5. Reforce a importância de manter o foco nas metas.

Restrições:
- Cada dica deve ter no máximo 100 caracteres
- Cada dica deve conter emojis
- Retorne exatamente 5 dicas motivacionais

Formato de Saída (Obrigatório): Retorne apenas um JSON com este formato:
{
  "dicas": [
    "Dica 1 com emoji (máx 100 caracteres)",
    "Dica 2 com emoji (máx 100 caracteres)",
    "Dica 3 com emoji (máx 100 caracteres)",
    "Dica 4 com emoji (máx 100 caracteres)",
    "Dica 5 com emoji (máx 100 caracteres)"
  ]
}

Dados do Usuário (Preenchimento Dinâmico):
Nome do Usuário: {{nome}}
Total Guardado: {{total_geral}}
Lista de Metas Atuais: {{lista_de_metas}} (Cada meta contém: Nome, Valor Atual, Valor Objetivo, % Concluída e Prazo).`;

interface ClassificationResult {
  texto_chat: string;
  valor: number;
  categoria: string;
  icone: string;
}

interface GoalsTipsResult {
  dicas: string[];
}

// Mapear erros da API para mensagens amigáveis
function getMensagemErroAmigavel(error: any): string {
  const errorMessage = error?.message || error?.toString() || "";
  
  if (errorMessage.includes("403") || errorMessage.includes("Forbidden")) {
    return "Desculpe! Parece que há um problema com a autenticação da IA. Verifique se a chave de API está correta.";
  }
  
  if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
    return "Oops! Não consegui autenticar com a IA. Verifique a configuração da API.";
  }
  
  if (errorMessage.includes("429") || errorMessage.includes("Too Many Requests")) {
    return "Muitas requisições no momento! Tente novamente em alguns segundos.";
  }
  
  if (errorMessage.includes("timeout") || errorMessage.includes("ETIMEDOUT")) {
    return "A IA está demorando a responder. Tente novamente!";
  }
  
  if (errorMessage.includes("não contém JSON")) {
    return "A IA teve dificuldade em processar sua mensagem. Tente ser mais específico!";
  }
  
  return "Algo deu errado ao processar sua mensagem. Tente novamente mais tarde.";
}

// Função para extrair e parsear JSON de forma robusta
function extrairJSON(texto: string): any {
  try {
    // Tenta encontrar JSON entre chaves
    const jsonMatch = texto.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Nenhum JSON encontrado na resposta");
    }

    let jsonStr = jsonMatch[0];
    
    // Tentar fazer parse direto
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      // Se falhar, tentar limpar caracteres problemáticos
      jsonStr = jsonStr
        .replace(/[\x00-\x1F\x7F]/g, '') // Remove caracteres de controle
        .replace(/,\s*([}\]])/g, '$1') // Remove vírgulas antes de } ou ]
        .trim();
      
      return JSON.parse(jsonStr);
    }
  } catch (error) {
    console.error("Erro ao extrair JSON:", error, "\nTexto recebido:", texto.substring(0, 200));
    throw new Error("Não foi possível extrair JSON da resposta da IA");
  }
}

export class GeminiService {
  /**
   * Classifica um gasto descrito pelo usuário
   */
  static async classifyExpense(userInput: string): Promise<ClassificationResult> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY_NOT_SET");
      }

      console.log("🚀 Iniciando classificação de gasto...");
      // Usando Gemini 3.0 Flash (mais rápido e eficiente)
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      console.log("✅ Modelo Gemini carregado");

      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "Você é um assistente que classifica gastos." }],
          },
          {
            role: "model",
            parts: [{ text: "Entendido! Estou pronto para classificar seus gastos." }],
          },
        ],
      });

      console.log("📤 Enviando mensagem para Gemini...");
      const result = await chat.sendMessage(
        `${EXPENSE_CLASSIFICATION_PROMPT}\n\nGasto do usuário: "${userInput}"`
      );
      console.log("📥 Resposta recebida da Gemini");

      const responseText = result.response.text();
      console.log("📋 Texto da resposta:", responseText.substring(0, 100) + "...");
      
      const classification = extrairJSON(responseText);
      console.log("✅ JSON extraído com sucesso");
      
      // Validar que o JSON tem os campos obrigatórios
      if (!classification.texto_chat || classification.valor === undefined || !classification.categoria) {
        throw new Error("JSON da IA está incompleto ou em formato incorreto");
      }

      console.log("✅ Classificação validada:", classification);
      return classification;
    } catch (error: any) {
      console.error("❌ Erro ao classificar gasto:", {
        message: error?.message,
        name: error?.name,
        code: error?.code,
        status: error?.status,
      });
      const mensagemAmigavel = getMensagemErroAmigavel(error);
      const errorObj = new Error(mensagemAmigavel);
      errorObj.name = error?.name || "GeminiError";
      throw errorObj;
    }
  }

  /**
   * Gera dicas para as metas do usuário
   */
  static async generateGoalsTips(goalsData: string): Promise<GoalsTipsResult> {
    try {
      // Usando Gemini 3.0 Flash (mais rápido e eficiente)
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      // Alternativa: gemini-2.0-flash (versão anterior, mais estável)
      // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const result = await model.generateContent(
        `${GOALS_TIPS_PROMPT}\n\nMetas do usuário:\n${goalsData}`
      );

      const responseText = result.response.text();
      const tips = extrairJSON(responseText);
      
      // Validar que o JSON tem os campos obrigatórios
      if (!tips.dicas || !Array.isArray(tips.dicas) || tips.dicas.length === 0) {
        throw new Error("JSON das dicas está incompleto ou em formato incorreto");
      }

      return tips;
    } catch (error: any) {
      console.error("Erro ao gerar dicas de metas:", error);
      const mensagemAmigavel = getMensagemErroAmigavel(error);
      const errorObj = new Error(mensagemAmigavel);
      errorObj.name = error?.name || "GeminiError";
      throw errorObj;
    }
  }

  /**
   * Conversa genérica com o assistente
   */
  static async chat(message: string, conversationHistory?: any[]): Promise<string> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY_NOT_SET");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      // const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const systemInstruction = `Você é LuminiFin, um assistente financeiro amigável e prestativo.
Você ajuda usuários a gerenciar suas finanças, classificar gastos, alcançar metas e tomar decisões financeiras inteligentes.
Sempre seja educado, motivador e prático nas suas respostas.
Se algo não está relacionado a finanças, redirecione a conversa de forma amigável.`;

      const chat = model.startChat({
        history: conversationHistory || [],
        systemInstruction,
      });

      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error: any) {
      console.error("Erro ao enviar mensagem para Gemini:", error);
      const mensagemAmigavel = getMensagemErroAmigavel(error);
      const errorObj = new Error(mensagemAmigavel);
      errorObj.name = error?.name || "GeminiError";
      throw errorObj;
    }
  }
}
