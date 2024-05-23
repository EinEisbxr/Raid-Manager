FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20 AS production
WORKDIR /app
COPY --from=build /app .
RUN npm ci --omit dev
EXPOSE 8000
CMD sh -c 'sudo apt-get install tree && tree && node .'
