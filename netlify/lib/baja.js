/* Enlace de baja firmado: lleva el correo y los ids de los correos programados que hay que cancelar.
   La firma usa la clave del proveedor de correo (EMAIL_API_KEY), así que no hace falta otra variable. */
const crypto = require('crypto');
const SITE = 'https://dexdireccionygestion.com';

const firma = b => crypto.createHmac('sha256', 'dex-baja:' + (process.env.EMAIL_API_KEY || '')).update(b).digest('base64url').slice(0, 24);

function crearToken(email, ids = []) {
  const b = Buffer.from(JSON.stringify({ e: email, i: ids })).toString('base64url');
  return `${b}.${firma(b)}`;
}
function leerToken(t) {
  const [b, f] = String(t || '').split('.');
  if (!b || !f) return null;
  const ok = firma(b);
  if (f.length !== ok.length || !crypto.timingSafeEqual(Buffer.from(f), Buffer.from(ok))) return null;
  try {
    const d = JSON.parse(Buffer.from(b, 'base64url').toString('utf8'));
    return d && typeof d.e === 'string' && Array.isArray(d.i) ? d : null;
  } catch (e) { return null; }
}
const enlaceBaja = (email, ids) => `${SITE}/.netlify/functions/baja?t=${crearToken(email, ids)}`;

module.exports = { crearToken, leerToken, enlaceBaja };
