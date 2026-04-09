#!/bin/bash

# Este script inicializa el certificado SSL para gegethebrand.com
# Debe ejecutarse en el servidor una vez que el DNS apunte a la IP 34.176.8.184

DOMAIN="gegethebrand.com"
EMAIL="gege.santi@hotmail.com"

echo "### Generando certificado para $DOMAIN..."

# Crear carpetas si no existen
mkdir -p certbot/conf
mkdir -p certbot/www

# Iniciar nginx temporalmente para el reto de Let's Encrypt
docker compose up -d nginx

# Solicitar el certificado
# --staging se puede usar para pruebas, pero aquí iremos directo a producción
docker compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email $EMAIL --agree-tos --no-eff-email \
    -d $DOMAIN -d www.$DOMAIN

# Reiniciar nginx para que cargue los nuevos certificados
docker compose restart nginx

echo "### ¡Proceso completado! Verifica entrando a https://$DOMAIN"
