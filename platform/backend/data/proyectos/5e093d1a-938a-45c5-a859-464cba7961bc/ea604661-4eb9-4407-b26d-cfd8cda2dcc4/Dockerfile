FROM node:24-alpine3.22 AS builder
                WORKDIR /app
                COPY package*.json ./
                RUN npm install
                COPY . .
                RUN npm run build

                FROM node:24-alpine3.22
                WORKDIR /app
                COPY --from=builder /app/.next ./.next
                COPY --from=builder /app/package*.json ./
                RUN npm install --omit=dev
                EXPOSE 3000
                CMD ["npm","start"]