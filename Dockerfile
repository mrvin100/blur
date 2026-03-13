# ---- Base Image ----
# Use a lightweight Node.js image
ARG NODE_VERSION=22.14.0-alpine
FROM node:${NODE_VERSION} AS base

# Set working directory
WORKDIR /app

# ---- Dependencies ----
# Install pnpm globally
RUN npm install -g pnpm

# Copy only package files first (for better Docker caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies with pnpm using frozen lockfile for reproducibility
RUN pnpm install --frozen-lockfile

# ---- Build Phase ----
# Copy all source files
COPY . .

# Build Next.js for production
RUN pnpm build

# Fix permissions for Next.js cache directory (avoids EACCES errors)
RUN mkdir -p .next/cache/images && \
    chown -R node:node .next .next/cache /app

# ---- Runtime ----
# Use non-root user for better security
USER node

# Expose Next.js port
EXPOSE 3000

# Start the Next.js production server
CMD ["pnpm", "start"]
