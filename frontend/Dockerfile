# ===============================
# Frontend Dockerfile
# ===============================

# Base image
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source
COPY . .

# Build the production app
RUN npm run build

# Serve the built app using a lightweight web server
RUN npm install -g serve

EXPOSE 5173

# Start the server
CMD ["serve", "-s", "dist", "-l", "5173"]
