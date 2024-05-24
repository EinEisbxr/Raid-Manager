# FROM node:latest AS production
# RUN mkdir /app
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY ./src ./src
# COPY ./data ./data
# COPY ./prisma ./prisma
# COPY ./tsconfig.json ./
# # COPY .env ./
# RUN ls /app
# RUN npm run build
# RUN npx prisma generate
# RUN ls /app
# EXPOSE 8000
# CMD sh -c 'node .'
# Use an official Node runtime as the base image
FROM arm64v8/node:latest

RUN apt-get update && mkdir -p /usr/src/app

# Set the working directory in the container to /app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the working directory contents into the container at /usr/src/app
COPY . .

# Compile TypeScript into JavaScript
RUN npm run build

RUN npx prisma generate

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the app when the container launches
CMD sh -c 'npx prisma migrate dev --name init && node build/index.js'