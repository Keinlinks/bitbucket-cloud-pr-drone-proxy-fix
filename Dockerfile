FROM node:22

RUN apt-get update && apt-get install -y openssl

WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 443 80

ENTRYPOINT ["/entrypoint.sh"]