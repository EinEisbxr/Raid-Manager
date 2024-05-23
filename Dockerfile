FROM node:latest AS production
RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./src ./src
COPY ./data ./data
COPY ./prisma ./prisma
COPY ./tsconfig.json ./
# COPY .env ./
RUN ls /app
RUN npm run build
RUN npx prisma generate
RUN ls /app
EXPOSE 8000
CMD sh -c 'node .'