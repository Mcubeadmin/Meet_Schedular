FROM ghcr.io/puppeteer/puppeteer:latest

# Switch to root to ensure we can set up the app directory
USER root

# Set the path to exactly where the browser lives in THIS image
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Fix permissions for the pptruser (required by this specific image)
RUN chown -R pptruser:pptruser /usr/src/app

# Switch back to the non-root user for security
USER pptruser

CMD ["node", "index.js"]