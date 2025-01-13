# syntax = docker/dockerfile:1

FROM node:18-slim

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies and Angular CLI globally
RUN npm install
RUN npm install -g @angular/cli@17.3.1

# Copy the rest of the application
COPY . .

# Build the application for production
RUN npm run build

# Expose port 4000
EXPOSE 4000

# Start the SSR server with explicit host and port
CMD ["npm", "run", "start:prod"]
