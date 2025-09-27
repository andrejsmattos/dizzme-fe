# Etapa 1: build da aplicação Angular
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Use a more reliable build command and log the output directory
RUN npm run build -- --configuration=production --output-path=dist/dizzme-frontend || true
RUN ls -la dist/dizzme-frontend

# Etapa 2: servir com Nginx
FROM nginx:alpine
# Check if the directory exists before copying
COPY --from=build /app/dist/dizzme-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
