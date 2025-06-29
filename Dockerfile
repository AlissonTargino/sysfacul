# Dockerfile Otimizado para Next.js

# ----------------------------------------------------
# Estágio 1: Instala dependências de PRODUÇÃO
# Cria uma pasta node_modules leve apenas com o necessário para rodar a aplicação.
# ----------------------------------------------------
FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# ----------------------------------------------------
# Estágio 2: Instala TODAS as dependências e faz o BUILD
# Instala tudo (incluindo devDependencies) para que o `next build` funcione.
# ----------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./

# Instala todas as dependências (dev e prod)
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Executa o build. Agora ele tem o TypeScript e outras ferramentas para funcionar.
RUN npm run build

# ----------------------------------------------------
# Estágio 3: Imagem final de PRODUÇÃO
# Usa uma base limpa e copia apenas os artefatos necessários.
# ----------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Cria um usuário com menos privilégios por segurança
RUN addgroup --system --gid 1001 nextjs
RUN adduser --system --uid 1001 nextjs

# Copia os artefatos da aplicação já "buildada" do estágio 'builder'
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Copia a pasta node_modules leve do estágio 'dependencies'
COPY --from=dependencies /app/node_modules ./node_modules

# Copia o package.json para que o `npm start` funcione
COPY package.json ./

# Define o usuário para rodar a aplicação
USER nextjs

EXPOSE 3000

# Comando para iniciar o servidor Next.js
CMD ["npm", "start"]