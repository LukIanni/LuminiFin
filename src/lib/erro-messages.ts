/**
 * Mensagens de erro amigáveis para o usuário
 * Utilizadas em toda a aplicação para tornar os erros mais claros e menos assustadores
 */

export const MENSAGENS_ERRO = {
  // Erros de Classificação de Gasto
  CLASSIFICACAO_INVALIDA: "Desculpe! Não consegui entender seu gasto. Tente ser mais específico, como: 'Gastei 50 no mercado'",
  CLASSIFICACAO_SEM_VALOR: "Precisei do valor para registrar! Exemplo: 'Gastei 45 reais no mercado'",
  CLASSIFICACAO_ERRO: "Oops! Tive um problema ao processar seu gasto. Tente novamente em alguns momentos!",

  // Erros de API
  API_NÃO_AUTORIZADA: "Desculpe! Parece que há um problema com a autenticação. Verifique se está logado.",
  API_CHAVE_INVALIDA: "Desculpe! A chave de API está inválida ou expirou. Entre em contato com o suporte.",
  MUITAS_REQUISICOES: "Você enviou muitas requisições! Aguarde um momento e tente novamente.",
  TIMEOUT: "A IA está demorando a responder. Tente novamente em alguns segundos!",
  CONEXAO_ERRO: "Problema na conexão com a IA. Verifique sua internet e tente novamente.",

  // Erros de Metas
  METAS_NENHUMA: "Crie uma meta para receber dicas personalizadas! 💡",
  METAS_ERRO: "Não consegui gerar as dicas no momento. Tente mais tarde!",

  // Erros Genéricos
  ERRO_GENERICO: "Algo inesperado aconteceu! Tente novamente ou entre em contato com o suporte.",
  ERRO_ENVIO: "Não consegui enviar sua mensagem. Verifique a conexão e tente novamente.",
};

export const EMOJIS_ERRO = {
  AVISO: "⚠️",
  ERRO: "❌",
  PROBLEMA: "😅",
  CONEXAO: "🔌",
  TEMPO: "⏱️",
};

/**
 * Função para obter mensagem de erro amigável baseada no erro recebido
 */
export function obterMensagemErro(error: any): string {
  const mensagem = error?.response?.data?.error || error?.message || "";

  if (mensagem.includes("GEMINI_API_KEY_NOT_SET") || mensagem.includes("chave")) {
    return MENSAGENS_ERRO.API_CHAVE_INVALIDA;
  }

  if (mensagem.includes("403") || mensagem.includes("Forbidden")) {
    return MENSAGENS_ERRO.API_CHAVE_INVALIDA;
  }

  if (mensagem.includes("401") || mensagem.includes("Unauthorized")) {
    return MENSAGENS_ERRO.API_NÃO_AUTORIZADA;
  }

  if (mensagem.includes("429") || mensagem.includes("Too Many")) {
    return MENSAGENS_ERRO.MUITAS_REQUISICOES;
  }

  if (mensagem.includes("timeout") || mensagem.includes("ETIMEDOUT")) {
    return MENSAGENS_ERRO.TIMEOUT;
  }

  if (mensagem.includes("ECONNREFUSED") || mensagem.includes("conexão")) {
    return MENSAGENS_ERRO.CONEXAO_ERRO;
  }

  if (mensagem.includes("não contém JSON")) {
    return MENSAGENS_ERRO.CLASSIFICACAO_INVALIDA;
  }

  if (mensagem.includes("Nenhuma meta")) {
    return MENSAGENS_ERRO.METAS_NENHUMA;
  }

  if (mensagem.includes("classificar")) {
    return MENSAGENS_ERRO.CLASSIFICACAO_ERRO;
  }

  if (mensagem.includes("gasto") || mensagem.includes("despesa")) {
    return MENSAGENS_ERRO.CLASSIFICACAO_SEM_VALOR;
  }

  return MENSAGENS_ERRO.ERRO_GENERICO;
}

/**
 * Formatar mensagem de erro com emoji
 */
export function formatarMensagemErro(erro: any, emoji: string = EMOJIS_ERRO.PROBLEMA): string {
  const mensagem = obterMensagemErro(erro);
  return `${emoji} ${mensagem}`;
}
