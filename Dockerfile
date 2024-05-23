FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
RUN npm run build

FROM node:20 AS production
WORKDIR /app
COPY --from=build /app /app
RUN npm ci --omit dev
EXPOSE 8000
CMD ["node", "."]
