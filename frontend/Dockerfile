FROM node:lts-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json .

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# -------------------------------
FROM nginx:stable-alpine

# Disable nginx daemon mode
RUN sed -i '1idaemon off;' /etc/nginx/nginx.conf

# Copy nginx configuration
# COPY --from=builder /app/docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx"]
