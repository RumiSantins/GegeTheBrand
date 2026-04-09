#!/bin/bash

# Este script inicializa el certificado SSL para gegethebrand.com
# Debe ejecutarse en el servidor una vez que el DNS apunte a la IP 34.176.8.184

DOMAIN="gegethebrand.com"
EMAIL="gege.santi@hotmail.com"

echo "### Generando certificado para $DOMAIN..."

# Crear carpetas si no existen
mkdir -p certbot/conf/live/$DOMAIN
mkdir -p certbot/www

# Crear certificados dummy si no existen (para que nginx pueda arrancar la primera vez)
if [ ! -f "certbot/conf/live/$DOMAIN/fullchain.pem" ]; then
    echo "### Creando certificados temporales para el arranque inicial..."
    openssl req -x509 -nodes -newkey rsa:4096 -days 1\
        -keyout "certbot/conf/live/$DOMAIN/privkey.pem" \
        -out "certbot/conf/live/$DOMAIN/fullchain.pem" \
        -subj "/CN=localhost"
fi

# Iniciar nginx para el reto de Let's Encrypt
docker compose up -d nginx

# Solicitar el certificado real
docker compose run --rm --entrypoint "certbot" certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email $EMAIL --agree-tos --no-eff-email \
    -d $DOMAIN -d www.$DOMAIN

# Reiniciar nginx para que cargue los nuevos certificados reales
docker compose restart nginx

echo "### ¡Proceso completado! Verifica entrando a https://$DOMAIN"
