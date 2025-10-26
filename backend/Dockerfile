# Stage 1: Build dependencies
FROM node:22-alpine AS builder

# Install Chromium and dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Install Puppeteer browsers
RUN npx puppeteer browsers install chrome

COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Install Chromium and dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Copy Puppeteer cache to nodejs user home
COPY --from=builder /root/.cache/puppeteer /home/nodejs/.cache/puppeteer

# Change ownership
RUN chown -R nodejs:nodejs /app /home/nodejs/.cache

# Switch to non-root user
USER nodejs

EXPOSE 8000

CMD ["npm", "start"]

# Stage 3: Development image
FROM node:22-alpine AS development

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Install Chromium and dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Install Puppeteer browsers
RUN npx puppeteer browsers install chrome

COPY . .

# Change ownership
RUN chown -R nodejs:nodejs /app /root/.cache

# Switch to non-root user
USER nodejs

EXPOSE 8000

CMD ["npm", "run", "dev"]