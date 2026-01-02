# 💡 LuminiFin - Assistente Financeiro Inteligente

> Um projeto desenvolvido para o **BOOTCAMP Caixa de Inteligência Artificial**, utilizando tecnologias modernas e IA generativa para revolucionar a gestão financeira pessoal.

## 🎯 Sobre o Projeto

**LuminiFin** é um assistente financeiro inteligente que combina tecnologias de ponta para oferecer uma experiência completa de gerenciamento financeiro. Desenvolvido com foco em usabilidade e inteligência artificial, o projeto demonstra como a IA pode ser integrada de forma prática e útil no dia a dia.

### Propósito

Este projeto foi criado como parte do **BOOTCAMP Caixa de Inteligência Artificial**, com o objetivo de:

- 🤖 Demonstrar aplicações práticas de IA generativa
- 📊 Facilitar o gerenciamento financeiro pessoal
- 💬 Implementar processamento de linguagem natural
- 🎯 Oferecer insights inteligentes sobre gastos e metas financeiras

## 👨‍💻 Créditos

**Desenvolvido principalmente com Vibe Coding** - Uma abordagem inovadora de desenvolvimento guiado por IA.

## 🚀 Funcionalidades

### 💰 Gestão de Despesas
- ✨ **Classificação Inteligente**: Registre gastos usando linguagem natural (ex: "gastei 50 reais em um café")
- 📝 Armazenamento de despesas com descrição completa
- 🗂️ Categorização automática (Mercado, Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Vestuário, Serviços, Investimentos)
- 📊 Visualização de gastos por categoria com gráficos interativos
- 🗑️ Exclusão de despesas

### 💳 Gerenciamento de Saldo
- 💵 Saldo editável - Defina seu saldo inicial manualmente
- ➕ Adicionar valores ao saldo
- ➖ Remover valores do saldo
- 📈 Rastreamento em tempo real

### 📊 Relatórios Inteligentes
- 📅 **Seletor de Período**: Analise despesas em períodos customizados
- 📉 **Gráficos Dinâmicos**: Visualize gastos por categoria com tooltips informativos
- 💰 **Resumo Financeiro**:
  - Saldo atual
  - Gastos do período
  - Economizado
  - Média diária de gastos
- 📋 **Histórico de Transações**: Lista paginada de despesas (3 por página)
- 👁️ **Detalhes de Transações**: Veja informações completas de cada gasto

### 🎯 Metas Financeiras
- 🎪 Criar e gerenciar metas de economias
- 📊 Acompanhar progresso em tempo real
- ⏰ Definir prazos para metas
- 🤖 **IA Geradora de Dicas**: Receba dicas motivacionais e insights personalizados

### 🔐 Autenticação e Segurança
- 📧 Sistema de cadastro e login com JWT
- 🔑 Autenticação baseada em token
- 👤 Gerenciamento de perfil de usuário
- 🛡️ Rotas protegidas

### 💬 Chat Financeiro
- 🤖 Assistente IA integrado para conversar sobre finanças
- 🧠 Processamento de linguagem natural via Google Gemini
- 📞 Suporte contextual e motivacional

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool rápido e moderno
- **Tailwind CSS** - Estilização utilitária
- **Recharts** - Gráficos e visualizações
- **Shadcn/ui** - Componentes acessíveis e estilizados
- **Axios** - Cliente HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM type-safe
- **Google Gemini API** - IA Generativa para classificação e insights
- **JWT** - Autenticação segura
- **CORS** - Compartilhamento de recursos

### Ferramentas
- **Git** - Controle de versão
- **npm/yarn** - Gerenciador de pacotes
- **Drizzle Kit** - Migrations do banco de dados

## 📋 Estrutura do Projeto

```
LuminiFin/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio (auth, expenses, balance, goals)
│   │   ├── routes/            # Definição de rotas
│   │   ├── services/          # Serviços externos (Gemini AI)
│   │   ├── middleware/        # Middlewares (autenticação)
│   │   ├── db/                # Conexão e schema do banco
│   │   ├── auth.ts            # Lógica de autenticação
│   │   └── server.ts          # Inicialização do servidor
│   └── migrations/            # Migrations do banco de dados
│
├── src/
│   ├── components/
│   │   ├── reports/           # Componentes de relatórios
│   │   ├── layout/            # Layout principal
│   │   ├── chat/              # Componentes de chat
│   │   ├── goals/             # Componentes de metas
│   │   └── ui/                # Componentes UI reutilizáveis
│   ├── pages/                 # Páginas da aplicação
│   ├── contexts/              # Context API (Auth, Expenses, Goals)
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilitários e API client
│   └── App.tsx                # Componente raiz
```

## 🚀 Como Começar

### Pré-requisitos
- Node.js 16+
- PostgreSQL
- Google Gemini API Key

### Instalação

#### 1. Clone o repositório
```bash
git clone https://github.com/LukIanni/LuminiFin.git
cd LuminiFin
```

#### 2. Configure as variáveis de ambiente

**Backend** (criar `.env` em `backend/`):
```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/luminifin
JWT_SECRET=sua_chave_secreta_aqui
GEMINI_API_KEY=sua_chave_gemini_aqui
PORT=3000
FRONTEND_URL=http://localhost:8000
```

**Frontend** (criar `.env.local` em `./`):
```env
VITE_API_URL=http://localhost:3000/api
```

#### 3. Instale as dependências

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

#### 4. Configure o banco de dados

```bash
cd backend
npm run db:push
```

#### 5. Inicie os servidores

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

Acesse `http://localhost:8000` no seu navegador.

## 🎨 Features em Destaque

### ✨ Classificação Inteligente de Gastos
Graças à integração com Google Gemini, o LuminiFin pode entender descrições em linguagem natural:
- "Gastei 50 reais em um café" → 🍽️ Alimentação
- "Paguei a conta de internet" → 🏠 Moradia
- "Comprei um livro" → 📚 Educação

### 📊 Dashboard Inteligente
- Período customizável para análise
- Gráficos interativos com tooltips informativos
- Cálculo automático de economias
- Média diária de gastos

### 💡 Dicas Alimentadas por IA
Receba dicas personalizadas baseadas em seus hábitos financeiros:
- Análise de progresso em metas
- Alertas para prazos próximos
- Elogios por disciplina
- Sugestões de otimização de gastos

## 📱 Interface Responsiva
- Design mobile-first
- Componentes adaptáveis para diferentes tamanhos de tela
- Navegação intuitiva com bottom nav
- Carregamento otimizado

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Hash de senhas com bcrypt
- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Dados isolados por usuário

## 🐛 Melhorias Recentes

### Página de Relatórios Aprimorada
- ✅ Corrigido armazenamento de valores (numeric em vez de string)
- ✅ Seletor de período minimalista
- ✅ Saldo editável e gerenciável
- ✅ Gráfico com tooltips informativos
- ✅ Histórico de transações com paginação
- ✅ Modal para detalhes completos de transações

## 📈 Roadmap Futuro

- [ ] Exportar relatórios em PDF
- [ ] Integração com bancos via API aberta
- [ ] Previsão de gastos com IA
- [ ] Comparativo com períodos anteriores
- [ ] Notificações push para metas
- [ ] Suporte multi-moeda
- [ ] Dashboard customizável
- [ ] Análise de padrões de gasto

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para:
- Reportar bugs
- Sugerir melhorias
- Enviar pull requests

## 📄 Licença

Este projeto foi desenvolvido como parte do BOOTCAMP Caixa de Inteligência Artificial.

## 📞 Contato

**Desenvolvedor**: Lukas Ianni
**Email**: [seu-email@example.com]
**GitHub**: [@LukIanni](https://github.com/LukIanni)

---

<div align="center">

**Feito com ❤️ usando Vibe Coding e IA Generativa**

[⬆ Voltar ao topo](#-luminifin---assistente-financeiro-inteligente)

</div>
