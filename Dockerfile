# Dockerfile raíz: construye UN sitio del repo (por defecto la taquería).
# Para otro sitio en Easypanel, agrega la variable de entorno / build arg SITE=<carpeta>
FROM nginx:1.27-alpine

ARG SITE=taquerialosgueros

COPY ${SITE}/nginx.conf /etc/nginx/conf.d/default.conf
COPY ${SITE}/ /usr/share/nginx/html/
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/nginx.conf /usr/share/nginx/html/.dockerignore

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
