#!/bin/sh
echo "starting entrypoint..."
CERT_DIR=/certs
KEY_FILE=$CERT_DIR/key.pem
CERT_FILE=$CERT_DIR/cert.pem

mkdir -p $CERT_DIR

if [ ! -f "$KEY_FILE" ] || [ ! -f "$CERT_FILE" ]; then
  echo "🔐 generating keys..."

  openssl req -x509 -newkey rsa:4096 -sha256 -days 365 -nodes \
    -keyout $KEY_FILE -out $CERT_FILE \
    -subj "/CN=localhost" \
    -addext "subjectAltName=DNS:localhost"

  echo "✔ Certs generated in $CERT_DIR"
else
  echo "🔑 Using old keys."
fi
echo "starting the server..."
npm run start