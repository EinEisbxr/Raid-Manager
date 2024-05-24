FROM node:latest

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the working directory contents into the container at /usr/src/app
COPY . .

# Compile TypeScript into JavaScript
RUN npm run build

RUN npx prisma generate

# Run the app when the container launches
CMD sh -c 'npx prisma migrate dev --init && node build/index.js'