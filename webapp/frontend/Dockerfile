FROM node:16-alpine as build
ARG REACT_APP_PROD_BASE_API
ENV REACT_APP_PROD_BASE_API $REACT_APP_PROD_BASE_API
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# new
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]