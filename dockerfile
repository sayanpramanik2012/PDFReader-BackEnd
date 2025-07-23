# Base image with Node.js
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose backend port
EXPOSE 3000

# Run the server
CMD ["node", "server.js"]
