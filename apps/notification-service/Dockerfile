# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies if needed (e.g. for native modules)
# RUN apk add --no-cache python3 make g++

# Copy package definition
COPY package*.json ./
COPY tsconfig*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY src ./src

# Build the application
RUN npm run build

# Remove devDependencies to prepare for production copy (optional strategy)
# RUN npm prune --production

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Copy templates explicitly (since they are non-ts files, sometimes build process misses them if not configured in nest-cli.json)
# Assuming templates are in src/modules/.../templates and dist structure mirrors src
COPY --from=builder /app/src/modules/notification/infrastructure/channels/email/templates ./dist/modules/notification/infrastructure/channels/email/templates

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3002

# Start command
CMD ["node", "dist/main"]