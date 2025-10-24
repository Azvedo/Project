FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src

# install deps and build
RUN npm ci --silent
ARG VITE_API_URL=http://backend:80
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
