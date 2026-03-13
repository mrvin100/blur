# Use lightweight Node.js base image
ARG NODE_VERSION=22.14.0-alpine
FROM node:${NODE_VERSION} AS base

# Set working directory
WORKDIR /app

# Copy package files first (better cache)
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm ci --no-audit

# Copy project files
COPY . .

# Build the Next.js app for production
RUN npm run build

# Create cache directory with proper permissions
RUN mkdir -p .next/cache/images && \
    chown -R node:node .next

# Use non-root user for security
USER node

# Expose Next.js default port
EXPOSE 3000

# Start Next.js in production
CMD ["npm", "run", "start"]
