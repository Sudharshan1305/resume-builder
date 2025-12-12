# Stage 1: Build the client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build server
FROM node:18-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./

# Final
FROM node:18-alpine
WORKDIR /app

# Copy server
COPY --from=server-build /app/server ./server

# Copy built frontend from Vite
COPY --from=client-build /app/client/dist ./server/public

WORKDIR /app/server

# server runs on port 3000, not 5000
EXPOSE 3000

CMD ["node", "server.js"]