# web-genericas

Repositorio de páginas web para negocios. Cada sitio vive en su propia carpeta, es estático (HTML + CSS + JS, sin dependencias) y trae su propio `Dockerfile` (nginx) para desplegarse en Easypanel.

| Carpeta | Negocio |
|---|---|
| [taquerialosgueros/](taquerialosgueros/) | Taquería Los Güeros — Cristo Rey, Álvaro Obregón, CDMX |

## Desplegar en Easypanel

1. **Create Service → App**.
2. **Source → GitHub**: repositorio `Antonio598/web-genericas`, rama `main`.
   - **Build Path**: la carpeta del sitio, p. ej. `/taquerialosgueros`
3. **Build → Dockerfile** (ruta `Dockerfile`).
4. **Domains**: agrega el dominio y apunta al **puerto 80**.
5. **Deploy**. Activa *Auto Deploy* para que cada `git push` publique los cambios.

Para otro sitio, repite con otra app cambiando solo el *Build Path*.

## Probar local

```bash
cd taquerialosgueros
docker build -t taquerialosgueros .
docker run --rm -p 8080:80 taquerialosgueros
# http://localhost:8080
```
