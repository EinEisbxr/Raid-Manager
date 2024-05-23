FROM node:20 AS production
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./src ./src
COPY ./data ./data
COPY ./prisma ./prisma
COPY ./tsconfig.json ./
# COPY .env ./
RUN npm run build
RUN npx prisma generate
EXPOSE 8000
CMD sh -c 'node .'