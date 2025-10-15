# Use Node LTS as the base image
FROM node:lts

# Set working directory
WORKDIR /app

# Install runtime dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends bash \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and app code
COPY prisma ./prisma
COPY . .

# Build Next.js app for production
RUN npm run build

# Copy helper scripts and make them executable (after COPY . . so they are not overwritten)
COPY wait-for-it.sh /app/wait-for-it.sh
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/wait-for-it.sh /app/entrypoint.sh

# Optional: Fix permissions
RUN chown -R node:node /app/node_modules && chmod -R 775 /app/node_modules

# Expose API port
EXPOSE 3000

# Use entrypoint script to start the app
CMD ["/bin/sh", "/app/entrypoint.sh"]
