/*
 * Baja de los correos de seguimiento y de los artículos mensuales.
 *
 * GET  /.netlify/functions/baja?t=…  → página con un botón para confirmar (así los antivirus del correo,
 *                                      que abren los enlaces, no dan de baja a nadie por error).
 * POST /.netlify/functions/baja?t=…  → cancela en Resend los correos programados que quedan, avisa a Jose
 *                                      para que quite el correo de la lista de artículos y muestra la confirmación.
 *                                      También atiende la baja con un clic de Gmail y Apple Mail (List-Unsubscribe-Post).
 */
const { leerToken } = require('../lib/baja');
const { enviar } = require('./submission-created');

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const pagina = (titulo, cuerpo) => ({
  statusCode: 200,
  headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  body: `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${esc(titulo)} · DEX</title>
<style>body{margin:0;background:#F4F1EA;color:#0B0B0D;font:17px/1.6 Arial,sans-serif;display:grid;place-items:center;min-height:100vh;padding:24px;box-sizing:border-box}
main{max-width:520px;background:#FBFAF7;border:1px solid #e3ddd1;border-radius:14px;padding:32px}
.l{font:400 26px Georgia,serif;letter-spacing:.3em;margin:0}.s{font:600 10px Arial,sans-serif;letter-spacing:.32em;margin:4px 0 26px}
h1{font:400 28px Georgia,serif;margin:0 0 12px}p{margin:0 0 16px;color:#2b2a27}
button{background:#0B0B0D;color:#F8F8F6;border:0;border-radius:999px;font:600 16px Arial,sans-serif;padding:14px 26px;cursor:pointer}
a{color:#0B0B0D}</style></head>
<body><main><p class="l">DEX</p><p class="s">DIRECCIÓN EXTERNA</p>${cuerpo}</main></body></html>`,
});

async function cancelar(id) {
  const r = await fetch(`https://api.resend.com/emails/${encodeURIComponent(id)}/cancel`, {
    method: 'POST', headers: { authorization: `Bearer ${process.env.EMAIL_API_KEY}` } });
  if (!r.ok) console.error('Cancelar', id, r.status, await r.text());
  return r.ok;
}

exports.handler = async (event) => {
  const t = (event.queryStringParameters || {}).t;
  const d = leerToken(t);
  if (!d) {
    return pagina('Enlace no válido', `<h1>Este enlace no es válido</h1>
      <p>Puede que esté incompleto. Si quieres darte de baja, responde a cualquiera de nuestros correos o escribe a
      <a href="mailto:jrodriguez@dexdireccionygestion.com">jrodriguez@dexdireccionygestion.com</a> y lo hacemos a mano.</p>`);
  }

  if (event.httpMethod !== 'POST') {
    return pagina('Darte de baja', `<h1>¿Quieres darte de baja?</h1>
      <p>Dejarás de recibir en <b>${esc(d.e)}</b> los correos de seguimiento de tu autodiagnóstico y los artículos mensuales de DEX.</p>
      <form method="post" action="/.netlify/functions/baja?t=${esc(encodeURIComponent(t))}"><button type="submit">Sí, darme de baja</button></form>`);
  }

  try {
    if ((process.env.EMAIL_PROVIDER || '').toLowerCase() === 'resend' && process.env.EMAIL_API_KEY) {
      await Promise.all(d.i.slice(0, 5).map(id => cancelar(id).catch(e => console.error('Cancelar', id, e))));
    }
    const aviso = process.env.EMAIL_REPLY_TO || 'jrodriguez@dexdireccionygestion.com';
    if (process.env.EMAIL_PROVIDER && process.env.EMAIL_API_KEY && process.env.EMAIL_FROM) {
      const asunto = `Baja de artículos: ${d.e}`;
      const r = await enviar({ to: aviso, tipo: 'baja', asunto,
        html: `<p style="font:15px Arial,sans-serif">${esc(d.e)} se ha dado de baja de los correos de seguimiento y de los artículos mensuales.</p>
               <p style="font:15px Arial,sans-serif">Los seguimientos que tenía programados ya se han cancelado. Si lo tienes en alguna lista de envío de artículos, quítalo.</p>`,
        text: `${d.e} se ha dado de baja de los correos de seguimiento y de los artículos mensuales. Los seguimientos programados ya se han cancelado. Si lo tienes en alguna lista de envío de artículos, quítalo.` });
      if (!r.ok) console.error('Aviso de baja fallido', r.status, await r.text());
    }
  } catch (e) {
    console.error('baja', e);
  }

  return pagina('Baja confirmada', `<h1>Listo, te hemos dado de baja</h1>
    <p>No recibirás más correos de seguimiento ni artículos de DEX en <b>${esc(d.e)}</b>.</p>
    <p>Si ha sido un error o cambias de opinión, escríbenos a <a href="mailto:jrodriguez@dexdireccionygestion.com">jrodriguez@dexdireccionygestion.com</a>.</p>
    <p><a href="https://dexdireccionygestion.com/">Volver a la web</a></p>`);
};
