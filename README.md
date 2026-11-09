# web-genericas

Repositorio de páginas web para negocios. Cada sitio vive en su propia carpeta, es estático (HTML + CSS + JS, sin dependencias) y trae su propio `Dockerfile` (nginx) para desplegarse en Easypanel.

| Carpeta | Negocio |
|---|---|
| [taquerialosgueros/](taquerialosgueros/) | Taquería Los Güeros — Cristo Rey, Álvaro Obregón, CDMX |

## Desplegar en Easypanel

1. **Create Service → App**.
2. **Source → GitHub**: repositorio `Antonio598/web-genericas`, rama `main`, Build Path `/`.
3. **Build → Dockerfile** (ruta `Dockerfile`).
4. **Domains**: agrega el dominio y apunta al **puerto 80**.
5. **Deploy**. Activa *Auto Deploy* para que cada `git push` publique los cambios.

El `Dockerfile` de la raíz sirve `taquerialosgueros` por defecto. Para otro sitio, crea otra app y elige una de estas:
- poner **Build Path** = `/<carpeta>` (usa el Dockerfile de esa carpeta), o
- dejar Build Path `/` y agregar la variable `SITE=<carpeta>` en *Environment*.

## Probar local

```bash
cd taquerialosgueros
docker build -t taquerialosgueros .
docker run --rm -p 8080:80 taquerialosgueros
# http://localhost:8080
```
