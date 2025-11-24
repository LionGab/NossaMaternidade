# Dockerfile para deploy da versão web do Expo no Cloud Run
# Build multi-stage para otimizar tamanho da imagem

# Stage 1: Build da aplicação
FROM node:20-alpine AS builder

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json pnpm-lock.yaml* ./

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da versão web do Expo para produção
# O Expo export cria os arquivos em dist/ por padrão (SDK 54+)
RUN pnpm run build:web

# Stage 2: Servidor web (Nginx)
FROM nginx:alpine

# Copiar arquivos buildados do Expo
# Expo SDK 54+ cria em dist/, versões antigas podem criar em web-build/
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 8080 (padrão do Cloud Run)
EXPOSE 8080

# Comando para iniciar Nginx na porta 8080
CMD ["sh", "-c", "sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

