# Orion ERP - Guia de Setup

## 🚀 Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.local` e configure as variáveis:

```env
# Database
DATABASE_URL="postgres://user:password@host:port/database"

# NextAuth
NEXTAUTH_SECRET="seu-secret-aleatorio"
NEXTAUTH_URL="http://localhost:3000"

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN="TEST-seu-token-aqui"
MERCADOPAGO_PUBLIC_KEY="TEST-sua-public-key-aqui"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Sincronizar Banco de Dados

**IMPORTANTE**: Antes de iniciar o projeto, você precisa aplicar o schema do Prisma ao banco de dados.

#### Opção A: Usando migrations (Recomendado para produção)

```bash
npm run prisma:migrate
```

Isso criará as migrations e aplicará ao banco de dados.

#### Opção B: Push direto (Desenvolvimento)

```bash
npx prisma db push
```

Isso sincroniza o schema diretamente sem criar arquivos de migration.

### 4. Popular Banco com Dados Iniciais (Seed)

```bash
npm run prisma:seed
```

Isso irá criar:
- ✅ 3 Planos (Starter, Professional, Enterprise)
- ✅ 5 Categorias de blog
- ✅ 6 Tags
- ✅ 1 Usuário Admin (admin@orion.com / admin123)
- ✅ 3 Posts de blog
- ✅ 1 Cupom de desconto (BEMVINDO2026)

### 5. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📊 Prisma Studio (Opcional)

Para visualizar e editar dados no banco:

```bash
npm run prisma:studio
```

Acesse: http://localhost:5555

## 🔑 Credenciais Padrão

Após executar o seed, você pode fazer login com:

- **Email**: admin@orion.com
- **Senha**: admin123
- **Role**: SUPER_ADMIN

⚠️ **IMPORTANTE**: Altere esta senha em produção!

## 🐛 Troubleshooting

### Erro: "Column does not exist in the current database"

**Causa**: O schema do Prisma não foi aplicado ao banco de dados.

**Solução**:
```bash
npx prisma db push
```

### Erro: "Cannot connect to database"

**Causa**: DATABASE_URL incorreta ou banco não acessível.

**Solução**:
1. Verifique se o banco PostgreSQL está rodando
2. Confirme a DATABASE_URL no `.env.local`
3. Teste a conexão:
```bash
npx prisma db pull
```

### Erro: "Environment variable not found: DATABASE_URL"

**Causa**: Arquivo `.env.local` não encontrado ou variável não definida.

**Solução**:
1. Certifique-se que `.env.local` existe na raiz do projeto
2. Verifique se a variável DATABASE_URL está definida

## 📦 Deploy

### Vercel

1. Configure as variáveis de ambiente no painel da Vercel
2. Adicione build command customizado:
```bash
prisma generate && next build
```

3. **IMPORTANTE**: Execute as migrations manualmente no banco de produção:
```bash
npx prisma db push
npx prisma db seed
```

Ou use um script de deploy automatizado.

### Outras Plataformas

Certifique-se de:
1. Rodar `prisma generate` antes do build
2. Aplicar migrations no banco de produção
3. Configurar todas as variáveis de ambiente

## 🔄 Atualizações do Schema

Quando modificar o `prisma/schema.prisma`:

1. Aplicar mudanças ao banco:
```bash
npx prisma db push
```

2. Regenerar o Prisma Client:
```bash
npx prisma generate
```

3. Atualizar tipos TypeScript (automático após generate)

## 📝 Comandos Úteis

```bash
# Ver schema do banco
npx prisma db pull

# Resetar banco (CUIDADO: apaga tudo!)
npx prisma migrate reset

# Formatar schema
npx prisma format

# Validar schema
npx prisma validate
```

## 🆘 Suporte

Se encontrar problemas, verifique:
1. Logs do Next.js no terminal
2. Console do navegador (F12)
3. Prisma Studio para verificar dados
4. Arquivo `.next/trace` para erros de build

## 🎯 Próximos Passos

Após o setup, você pode:
1. Acessar `/admin` com as credenciais admin
2. Ver os planos em `/precos`
3. Testar o checkout (use credenciais de teste do Mercado Pago)
4. Explorar o blog em `/blog`
5. Gerenciar conteúdo no painel admin
