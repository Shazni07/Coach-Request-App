# ===============================
# Backend Dockerfile
# ===============================

# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 4000

# Run database migrations automatically (optional but neat)
CMD ["sh", "-c", "npx knex migrate:latest && npx knex seed:run && npm run start"]
