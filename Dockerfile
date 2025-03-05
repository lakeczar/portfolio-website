# Base stage
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Development stage
FROM base AS development
COPY . .
EXPOSE 5173 6006
CMD ["sh", "-c", "npm run dev & npm run storybook -- --ci"]

# Build stage for app and Storybook
FROM base AS build
COPY . .
RUN npm run build
RUN npm run build-storybook

# Production stage using node server
FROM node:22-alpine AS production
WORKDIR /app

# Install serve for hosting static files
RUN npm install -g serve

# Copy built assets
COPY --from=build /app/dist /app/dist
COPY --from=build /app/storybook-static /app/storybook-static

# Expose ports for app and Storybook
EXPOSE 5000 6006

# Script to serve both app and Storybook
COPY serve.sh /serve.sh
RUN chmod +x /serve.sh

CMD ["/serve.sh"]