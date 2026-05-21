FROM mcr.microsoft.com/playwright:v1.60.0-jammy

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["sh","-c","node index.js & node screenshot.js"]
