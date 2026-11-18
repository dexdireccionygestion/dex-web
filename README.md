# Web de DEX Dirección y Gestión

- `src/dex.html` — archivo maestro de la web (todas las secciones en una página, con anclas #metodo, #blog…). Se puede abrir tal cual como vista previa.
- `src/assets/` — imágenes, tipografías e imagen para compartir.
- `src/build.py` — genera la web publicable en `public/`: una página por sección, con su título, descripción, datos estructurados y sitemap.
- `public/` — lo que publica Netlify (no editar a mano).

Para publicar un cambio: editar `src/dex.html`, ejecutar `python3 src/build.py`, comprobar y subir a `main`.
Netlify publica `public/` automáticamente (ver `netlify.toml`).

## Informe del autodiagnóstico por correo

Cuando alguien pide su informe, el formulario `autodiagnostico` llega a Netlify y la función
`netlify/functions/submission-created.js` le envía el informe por correo (prioridades, qué hacer este mes y
qué leer). Si marcó la casilla de artículos mensuales, se le da de alta en la lista de Brevo.

Estado (18/11/2026): activo con **Resend** (dominio verificado en Resend, región Irlanda; variables EMAIL_PROVIDER, EMAIL_FROM, EMAIL_REPLY_TO y EMAIL_API_KEY en Netlify).
La misma función envía también un correo de confirmación a quien deja sus datos para el café (formulario `reserva`).

Para configurarlo con Brevo en su lugar:
1. Crear una cuenta en Brevo (brevo.com, plan gratuito) con el correo de DEX.
2. En Brevo, verificar el remitente (p. ej. informe@dexdireccionygestion.com) y autenticar el dominio
   (añadir en Squarespace los registros DNS que indique Brevo). Crear una lista «Artículos DEX» y anotar su número.
3. En Brevo, crear una clave de API (SMTP & API > API keys).
4. En Netlify > Site configuration > Environment variables, añadir:
   `EMAIL_PROVIDER=brevo`, `EMAIL_API_KEY=<clave>`, `EMAIL_FROM=informe@dexdireccionygestion.com`, `BREVO_LIST_ID=<número>`.
5. En `src/dex.html`, poner `informeAuto: true` en `CONFIG.form` y añadir Brevo a `CONFIG.legal.proveedores`.

También funciona con Resend (`EMAIL_PROVIDER=resend`), sin la lista de suscriptores.
Sin estas variables, la función no envía nada y Jose sigue recibiendo el aviso de cada autodiagnóstico.
