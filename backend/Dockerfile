FROM --platform=linux/amd64 node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm i -g typescript
COPY . .
RUN tsc
EXPOSE 3000
CMD ["npm","run","start"]


