# Etapa 1: Build da aplicação Angular
FROM node:18 AS build
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar código fonte
COPY . .

# Build da aplicação com base-href correto
RUN npm run build -- --configuration=production --base-href=/ --output-path=dist/dizzme-frontend

# Verificar se o build foi bem-sucedido
RUN ls -la dist/dizzme-frontend

# Etapa 2: Servir com Nginx
FROM nginx:alpine

# Copiar arquivos do build
COPY --from=build /app/dist/dizzme-frontend /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]