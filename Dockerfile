# Stage 1: Build the Angular application
FROM node:20-slim AS build

# Set the working directory
WORKDIR /app/movies-app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build -- --configuration=production --verbose

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the built Angular application from the build stage
COPY --from=build /app/movies-app/dist/movie-app/browser /usr/share/nginx/html

# # Copy icon -> favicon.ico file
COPY --from=build /app/movies-app/dist/movie-app/browser/favicon.ico /usr/share/nginx/html/favicon.ico


# Copy custom Nginx configuration if needed
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 8090

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
