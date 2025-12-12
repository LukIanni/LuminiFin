# LuminiFin Backend

Backend da aplicação LuminiFin - Assistente Financeiro.

## 🚀 Setup Inicial

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz da pasta `backend`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/luminifin
PORT=3000
NODE_ENV=development
JWT_SECRET=sua-chave-secreta-super-segura
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar PostgreSQL

#### Windows (usando PostgreSQL instalado):

1. Abra o PowerShell como administrador
2. Conecte ao PostgreSQL:

```powershell
psql -U postgres
```

3. Crie o banco de dados:

```sql
CREATE DATABASE luminifin;
```

4. Saia do psql:

```
\q
```

#### Com Docker (alternativa):

```bash
docker run --name postgres-luminifin -e POSTGRES_PASSWORD=password -e POSTGRES_DB=luminifin -p 5432:5432 -d postgres:latest
```

### 4. Migrar Banco de Dados

```bash
npm run db:generate
npm run db:push
```

### 5. Iniciar o Servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📚 Endpoints da API

### Autenticação

#### Cadastro (POST)
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}

Response (201):
{
  "message": "Cadastro realizado com sucesso",
  "token": "jwt_token_aqui",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "name": "Nome do Usuário"
  }
}
```

#### Login (POST)
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123"
}

Response (200):
{
  "message": "Login realizado com sucesso",
  "token": "jwt_token_aqui",
  "user": {
    "id": "uuid",
    "email": "usuario@email.com",
    "name": "Nome do Usuário"
  }
}
```

#### Obter Perfil (GET)
```
GET /api/auth/profile
Authorization: Bearer jwt_token_aqui

Response (200):
{
  "id": "uuid",
  "email": "usuario@email.com",
  "name": "Nome do Usuário",
  "avatar": null,
  "createdAt": "2025-12-11T..."
}
```

## 🗄️ Schema do Banco de Dados

### Tabela: users
- `id` - UUID (primary key)
- `email` - String (unique)
- `name` - String
- `password` - String (hashed)
- `avatar` - String (opcional)
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Tabela: expenses
- `id` - UUID (primary key)
- `userId` - UUID (foreign key)
- `amount` - Numeric
- `category` - String
- `description` - String (opcional)
- `date` - Timestamp
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Tabela: goals
- `id` - UUID (primary key)
- `userId` - UUID (foreign key)
- `title` - String
- `description` - String (opcional)
- `targetAmount` - Numeric
- `currentAmount` - Numeric
- `deadline` - Timestamp (opcional)
- `status` - String (active, completed, cancelled)
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## 🛠️ Scripts Disponíveis

- `npm run dev` - Iniciar servidor em modo desenvolvimento
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar servidor compilado
- `npm run db:generate` - Gerar migrações do banco de dados
- `npm run db:push` - Executar migrações
- `npm run db:studio` - Abrir Drizzle Studio (interface visual do banco)

## 📝 Próximos Passos

1. Implementar endpoints para CRUD de despesas
2. Implementar endpoints para CRUD de metas
3. Implementar autenticação no frontend
4. Integrar rotas do frontend com a API
5. Adicionar validação mais robusta com Zod
6. Implementar testes
