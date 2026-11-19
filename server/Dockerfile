FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --no-audit --no-fund

COPY . .

EXPOSE 4030

CMD ["npm", "start"]
