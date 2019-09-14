#################################
# STEP 1: Build
#################################
FROM node:12.10.0-alpine as build

# Create app folder
RUN mkdir /app
WORKDIR /app

# Add path
ENV PATH /app/node_modules/.bin:$PATH

# Copy package*.json to app folder
COPY package.json package-lock.json /app/

# Install app dependencies
RUN npm set progress=false
RUN npm install

# Copy all files to app folder
COPY . /app

# Build the app
RUN npm run build -- --prod --build-optimizer

#################################
# STEP 2: Deployment
#################################
FROM nginx:1.13.9-alpine

# Add configuration files
COPY image-files/ /

RUN chmod 700 /usr/local/bin/docker-entrypoint.sh

# Add path
ENV PATH /usr/local/bin:$PATH

# Copy dist files from build step
COPY --from=build /app/dist /srv/

# Expose port 80
EXPOSE 80

# Run entry point
CMD ["docker-entrypoint.sh"]
