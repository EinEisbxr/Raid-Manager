FROM node:20 AS production
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
RUN npm run build
EXPOSE 8000
CMD sh -c 'tree 1>&2 && node .'