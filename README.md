# Web de DEX Dirección y Gestión

- `src/dex.html` — archivo maestro de la web (todas las secciones en una página, con anclas #metodo, #blog…). Se puede abrir tal cual como vista previa.
- `src/assets/` — imágenes, tipografías e imagen para compartir.
- `src/build.py` — genera la web publicable en `public/`: una página por sección, con su título, descripción, datos estructurados y sitemap.
- `public/` — lo que publica Netlify (no editar a mano).

Para publicar un cambio: editar `src/dex.html`, ejecutar `python3 src/build.py`, comprobar y subir a `main`.
Netlify publica `public/` automáticamente (ver `netlify.toml`).
