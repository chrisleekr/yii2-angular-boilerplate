#################################
# STEP 1: NPM install
#################################
FROM node:13-alpine as initial-stage

WORKDIR /srv

COPY package*.json ./

RUN npm install

#################################
# STEP 2: Build
#################################
FROM initial-stage AS build-stage

WORKDIR /srv

COPY . .

RUN npm run build -- --prod --build-optimizer

#################################
# STEP 3: Deployment
#################################
FROM nginx:stable-alpine AS production-stage

COPY image-files/ /

COPY --from=build-stage /srv/dist /srv

EXPOSE 80

ENTRYPOINT [ "docker-entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
