# Stage 1: Build the React application
FROM node:26.5.0-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the frontend source code COPY <source> <destination>
COPY . .

# Build the production frontend
RUN npm run build

# Stage 2: Serve the frontend using Nginx
FROM nginx:alpine

# Copy the React production build to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"] 