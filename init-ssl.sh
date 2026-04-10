#!/bin/bash

# Este script inicializa el certificado SSL para gegethebrand.com
# Debe ejecutarse en el servidor una vez que el DNS apunte a la IP 34.176.8.184

DOMAIN="gegethebrand.com"
EMAIL="gege.santi@hotmail.com"

echo "### Generando certificado para $DOMAIN..."

# Asegurarnos de que nada esté usando el puerto 80/443
docker compose down

# Solicitar el certificado real usando modo STANDALONE
# Esto levantará un servidor temporal en el puerto 80 para validar el dominio
docker compose run --rm -p 80:80 --entrypoint "certbot" certbot certonly --standalone \
    --email $EMAIL --agree-tos --no-eff-email \
    -d $DOMAIN -d www.$DOMAIN

# Una vez obtenido, levantamos todo el sistema
docker compose up -d

echo "### ¡Proceso completado! Verifica entrando a https://$DOMAIN"
