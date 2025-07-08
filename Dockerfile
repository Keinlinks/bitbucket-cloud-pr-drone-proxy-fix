FROM node:22
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 443 80
RUN chmod +x /entrypoint.sh