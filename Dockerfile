FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# ENV DISCORD_TOKEN=DISCORD_TOKEN
# ENV DISCORD_CLIENT_ID=DISCORD_CLIENT_ID
# ENV DATABASE_URL=DATABASE_URL
# ENV DIRECT_URL=DIRECT_URL
# ENV COC_API_TOKEN=COC_API_TOKEN
# ENV ADMIN_ROLE_IDS=ADMIN_ROLE_IDS
RUN npm run build

FROM node:20 AS production
COPY --from=build /app/dist .
COPY --from=build /app/package*.json .
COPY --from=build /app/data .
COPY --from=build /app/prisma .
RUN npm ci --omit dev
EXPOSE 8000
CMD ["node", "."]
