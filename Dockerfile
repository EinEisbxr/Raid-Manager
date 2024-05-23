FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20 AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/data ./data
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma
RUN apt-get update && apt-get install -y tree
RUN npm ci --omit dev
EXPOSE 8000
CMD sh -c 'tree 1>&2 && node .'