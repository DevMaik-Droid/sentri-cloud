FROM node:24.10.0-alpine3.22

WORKDIR /app
COPY package*.json .
RUN npm install 

COPY . .
EXPOSE 3030

CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "--port", "3030"]
