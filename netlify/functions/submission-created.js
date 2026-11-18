/*
 * Envío automático del informe del autodiagnóstico DEX.
 *
 * Netlify ejecuta esta función cada vez que llega un envío de un formulario (evento "submission-created").
 * Si el envío es del formulario "autodiagnostico", manda a la persona su informe por correo y,
 * si marcó la casilla de artículos mensuales, la añade a la lista de suscriptores (solo con Brevo).
 *
 * Variables de entorno (Netlify > Site configuration > Environment variables):
 *   EMAIL_PROVIDER   "brevo" o "resend"
 *   EMAIL_API_KEY    clave de la API del proveedor
 *   EMAIL_FROM       remitente, p. ej. informe@dexdireccionygestion.com (verificado en el proveedor)
 *   EMAIL_FROM_NAME  nombre del remitente (opcional; por defecto "Jose Rodríguez · DEX")
 *   EMAIL_REPLY_TO   a dónde llegan las respuestas (opcional; por defecto jrodriguez@dexdireccionygestion.com)
 *   BREVO_LIST_ID    lista de Brevo para los artículos mensuales (opcional)
 * Si faltan EMAIL_PROVIDER, EMAIL_API_KEY o EMAIL_FROM, la función no envía nada (Jose sigue recibiendo el aviso de Netlify).
 */
const SITE = 'https://dexdireccionygestion.com';
const UTM = 'utm_source=informe-autodiagnostico&utm_medium=email';

const AREAS = {
  'Diagnóstico y datos': {
    acciones: ['Calcula la producción del último mes por gabinete y por hora ocupada.', 'Elige tres números que vas a revisar cada mes a partir de ahora.'],
    lectura: ['blog-gabinete', 'Facturación por gabinete: cómo calcularla y qué hacer con el dato'] },
  'Objetivos y cuadro de mando': {
    acciones: ['Escribe el objetivo de producción de los próximos tres meses, mes a mes.', 'Fija un día al mes para comparar lo real con el objetivo.'],
    lectura: ['blog-indicadores', 'Los 8 indicadores que todo propietario debería revisar cada mes'] },
  'Equipo y organización': {
    acciones: ['Apunta durante dos semanas todo lo que llega a ti y asigna un responsable a cada tarea.', 'Escribe qué puede decidir cada puesto sin preguntarte.'],
    lectura: ['blog-equipo', 'Funciones y responsables: el organigrama que evita que todo pase por ti'] },
  'Protocolos por puesto': {
    acciones: ['Empieza por un solo protocolo: la llamada de primera visita en recepción.', 'Escríbelo con quien lo hace cada día y revisa en un mes si se cumple.'],
    lectura: ['blog-protocolos', 'Protocolos por puesto: cómo escribirlos para que se cumplan'] },
  'Experiencia del paciente': {
    acciones: ['Confirma todas las citas con 48 horas de antelación y registra la respuesta.', 'Llama a los pacientes después de los tratamientos importantes.'],
    lectura: ['blog-agenda', 'Huecos y cancelaciones: cómo recuperar el control de la agenda'] },
  'Primeras visitas y presupuestos': {
    acciones: ['Revisa los presupuestos no aceptados de los últimos seis meses y llama primero a los de mayor importe.', 'Fija un seguimiento con fechas: a las 48–72 horas, a la semana y al mes.'],
    lectura: ['blog-presupuestos', 'Cómo mejorar la aceptación de presupuestos en tu clínica dental'] },
  'Captación y marketing': {
    acciones: ['Pregunta y registra cómo ha llegado cada paciente nuevo, con opciones cerradas.', 'Calcula el coste por paciente nuevo de cada canal en el que inviertes.'],
    lectura: ['blog-captacion', 'Marketing para clínicas dentales: cómo saber qué canal te trae pacientes y a qué coste'] },
  'Costes, caja y herramientas': {
    acciones: ['Haz un cierre de mes propio en los primeros días: caja, producción, costes y margen.', 'Compara lo que pagas por los trabajos de laboratorio más habituales.'],
    lectura: ['blog-cierre-mes', 'El cierre de mes de una clínica dental: qué revisar y en qué orden'] },
};
const NIVEL_TXT = s => s < 40
  ? 'Hay mucho margen, y eso es una buena noticia: las primeras mejoras se notan pronto.'
  : s < 70 ? 'Tienes cimientos. Ordenando dos o tres áreas, la clínica puede dar un salto claro.'
  : 'Vas por delante de muchas clínicas. El reto es sostenerlo y medirlo cada mes.';

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const url = path => `${SITE}/${path}${path.includes('?') ? '&' : '?'}${UTM}`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function informe(d) {
  const score = Math.max(0, Math.min(100, parseInt(d.puntuacion, 10) || 0));
  const areas = Array.isArray(d.areas) ? d.areas : [];
  const prioridades = (Array.isArray(d.prioridades) ? d.prioridades : []).filter(a => AREAS[a]).slice(0, 3);
  const color = e => e === 'Prioridad' ? '#9a3b2e' : e === 'Mejorable' ? '#8a6d1f' : '#3d6b46';
  const asunto = `Tu autodiagnóstico DEX: ${score}/100 · ${d.nivel || ''}`.trim();

  const pri = prioridades.map((a, k) => {
    const A = AREAS[a];
    return `<tr><td style="padding:18px 0;border-top:1px solid #e3ddd1">
      <p style="margin:0 0 6px;font:600 12px Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#6b665d">Prioridad ${k + 1}</p>
      <p style="margin:0 0 10px;font:400 21px Georgia,serif;color:#0B0B0D">${esc(a)}</p>
      <p style="margin:0 0 6px;font:600 14px Arial,sans-serif;color:#0B0B0D">Qué puedes hacer este mes</p>
      <ul style="margin:0 0 12px;padding-left:18px;font:15px/1.55 Arial,sans-serif;color:#2b2a27">${A.acciones.map(x => `<li style="margin-bottom:4px">${esc(x)}</li>`).join('')}</ul>
      <p style="margin:0;font:15px Arial,sans-serif"><a href="${url(A.lectura[0] + '/')}" style="color:#0B0B0D">Lee: ${esc(A.lectura[1])} →</a></p>
    </td></tr>`;
  }).join('');

  const filas = areas.map(a => `<tr><td style="padding:7px 0;border-top:1px solid #eee8dc;font:14px Arial,sans-serif;color:#2b2a27">${esc(a.area)}</td><td style="padding:7px 0;border-top:1px solid #eee8dc;font:600 13px Arial,sans-serif;color:${color(a.estado)};text-align:right">${esc(a.estado)}</td></tr>`).join('');

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(asunto)}</title></head>
<body style="margin:0;background:#F4F1EA;padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FBFAF7;border:1px solid #e3ddd1;border-radius:14px">
<tr><td style="padding:32px 32px 8px">
  <p style="margin:0 0 4px;font:400 26px Georgia,serif;letter-spacing:.3em;color:#0B0B0D">DEX</p>
  <p style="margin:0 0 26px;font:600 10px Arial,sans-serif;letter-spacing:.32em;color:#0B0B0D">DIRECCIÓN EXTERNA</p>
  <p style="margin:0 0 14px;font:16px/1.6 Arial,sans-serif;color:#2b2a27">Hola:</p>
  <p style="margin:0 0 22px;font:16px/1.6 Arial,sans-serif;color:#2b2a27">Aquí tienes el informe de tu autodiagnóstico. Es orientativo y se basa solo en tus respuestas, pero ya dice mucho de por dónde empezar.</p>
  <table role="presentation" width="100%" style="background:#0B0B0D;border-radius:12px"><tr><td style="padding:24px 26px">
    <p style="margin:0 0 4px;font:600 11px Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#bdb6a8">Tu puntuación</p>
    <p style="margin:0 0 6px;font:400 44px Georgia,serif;color:#F8F8F6">${score}<span style="font-size:18px;color:#bdb6a8"> / 100</span></p>
    <p style="margin:0 0 6px;font:400 20px Georgia,serif;color:#F8F8F6">${esc(d.nivel || '')}</p>
    <p style="margin:0;font:15px/1.5 Arial,sans-serif;color:#d9d4c9">${esc(NIVEL_TXT(score))}</p>
  </td></tr></table>
</td></tr>
<tr><td style="padding:22px 32px 0">
  <p style="margin:0 0 4px;font:400 22px Georgia,serif;color:#0B0B0D">Por dónde empezaríamos</p>
  <table role="presentation" width="100%">${pri}</table>
</td></tr>
<tr><td style="padding:12px 32px 0">
  <p style="margin:0 0 8px;font:400 18px Georgia,serif;color:#0B0B0D">Tus ocho áreas</p>
  <table role="presentation" width="100%">${filas}</table>
</td></tr>
<tr><td style="padding:26px 32px 8px">
  <table role="presentation" width="100%" style="background:#F1EEE7;border-radius:12px"><tr><td style="padding:22px 24px">
    <p style="margin:0 0 8px;font:400 20px Georgia,serif;color:#0B0B0D">¿Lo revisamos juntos?</p>
    <p style="margin:0 0 16px;font:15px/1.55 Arial,sans-serif;color:#2b2a27">En una videollamada de 30 minutos repasamos tu resultado, te doy una primera visión externa de qué haría primero en tu clínica y te digo con franqueza si DEX encaja o no. Sin compromiso.</p>
    <a href="${SITE}/?${UTM}#contacto" style="display:inline-block;background:#0B0B0D;color:#F8F8F6;text-decoration:none;font:600 15px Arial,sans-serif;padding:14px 24px;border-radius:999px">Reservar mi café de 30 min →</a>
    ${d.id ? `<p style="margin:14px 0 0;font:13px Arial,sans-serif;color:#6b665d">Al reservar, indica tu código <b>${esc(d.id)}</b> y tendré tus respuestas delante.</p>` : ''}
  </td></tr></table>
</td></tr>
<tr><td style="padding:22px 32px 30px">
  <p style="margin:0 0 4px;font:15px/1.5 Arial,sans-serif;color:#2b2a27">Un saludo,</p>
  <p style="margin:0;font:600 15px Arial,sans-serif;color:#0B0B0D">Jose Rodríguez Horrillo</p>
  <p style="margin:0 0 18px;font:14px Arial,sans-serif;color:#6b665d">Fundador de DEX · Dirección y gestión de clínicas dentales</p>
  <p style="margin:0;font:12px/1.5 Arial,sans-serif;color:#8a8478">Recibes este correo porque lo pediste al hacer el autodiagnóstico en <a href="${SITE}/" style="color:#8a8478">dexdireccionygestion.com</a>. Si respondes a este mensaje, me llega directamente. <a href="${SITE}/privacidad/" style="color:#8a8478">Política de privacidad</a>.</p>
</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    'Tu autodiagnóstico DEX', '',
    `Puntuación orientativa: ${score}/100 · ${d.nivel || ''}`, NIVEL_TXT(score), '',
    'POR DÓNDE EMPEZARÍAMOS',
    ...prioridades.flatMap((a, k) => [`${k + 1}. ${a}`, ...AREAS[a].acciones.map(x => `   - ${x}`), `   Lee: ${AREAS[a].lectura[1]} → ${url(AREAS[a].lectura[0] + '/')}`, '']),
    'TUS OCHO ÁREAS', ...areas.map(a => `- ${a.area}: ${a.estado}`), '',
    '¿Lo revisamos juntos? Reserva un café de 30 minutos, sin compromiso:', `${SITE}/?${UTM}#contacto`,
    d.id ? `Al reservar, indica tu código ${d.id}.` : '', '',
    'Jose Rodríguez Horrillo · DEX',
  ].join('\n');
  return { asunto, html, text };
}

async function enviar({ to, asunto, html, text, tipo = 'autodiagnostico' }) {
  const P = (process.env.EMAIL_PROVIDER || '').toLowerCase(), key = process.env.EMAIL_API_KEY, from = process.env.EMAIL_FROM;
  const name = process.env.EMAIL_FROM_NAME || 'Jose Rodríguez · DEX';
  const reply = process.env.EMAIL_REPLY_TO || 'jrodriguez@dexdireccionygestion.com';
  if (P === 'brevo') {
    return fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ sender: { name, email: from }, to: [{ email: to }], replyTo: { email: reply }, subject: asunto, htmlContent: html, textContent: text, tags: [tipo] }) });
  }
  if (P === 'resend') {
    return fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: `${name} <${from}>`, to: [to], reply_to: reply, subject: asunto, html, text, tags: [{ name: 'tipo', value: tipo }] }) });
  }
  throw new Error('EMAIL_PROVIDER no válido: ' + P);
}

/* Confirmación a quien deja sus datos para el café */
const AGENDA = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1_Kj4iHs_FCSsyS0xB2yHaWgu-Uw0VuNAlB6cUgd5hRD3F-hP_XqIem6Ktf3cyCJGGj-Z-FTea?hl=es';
function confirmacion(f) {
  const nombre = String(f.nombre || '').trim().split(/\s+/)[0] || '';
  const conDiag = !!String(f.autodiagnostico || '').trim();
  const asunto = 'Hemos recibido tus datos · Café con DEX';
  const p = t => `<p style="margin:0 0 14px;font:16px/1.6 Arial,sans-serif;color:#2b2a27">${t}</p>`;
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(asunto)}</title></head>
<body style="margin:0;background:#F4F1EA;padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FBFAF7;border:1px solid #e3ddd1;border-radius:14px">
<tr><td style="padding:32px">
  <p style="margin:0 0 4px;font:400 26px Georgia,serif;letter-spacing:.3em;color:#0B0B0D">DEX</p>
  <p style="margin:0 0 26px;font:600 10px Arial,sans-serif;letter-spacing:.32em;color:#0B0B0D">DIRECCIÓN EXTERNA</p>
  ${p(`Hola${nombre ? ' ' + esc(nombre) : ''}:`)}
  ${p(`Gracias por tu interés en DEX. Hemos recibido tus datos${f.clinica ? ` y los de <b>${esc(f.clinica)}</b>` : ''}.`)}
  ${p('<b>Si ya has elegido día y hora</b>, te llegará la invitación de Google Calendar con el enlace de Google Meet. <b>Si aún no</b>, puedes elegirla aquí:')}
  <p style="margin:6px 0 22px"><a href="${AGENDA}" style="display:inline-block;background:#0B0B0D;color:#F8F8F6;text-decoration:none;font:600 15px Arial,sans-serif;padding:14px 24px;border-radius:999px">Elegir día y hora →</a></p>
  ${p('En el café, 30 minutos por videollamada, me cuentas cómo funciona hoy tu clínica, te doy una primera visión externa de por dónde empezaría y te digo con franqueza si DEX encaja o no.')}
  ${conDiag ? '' : p(`Si tienes dos minutos antes, haz el <a href="${url('autodiagnostico/')}" style="color:#0B0B0D">autodiagnóstico gratuito</a>: así llego con tus respuestas delante y aprovechamos mejor el tiempo.`)}
  <p style="margin:22px 0 4px;font:15px/1.5 Arial,sans-serif;color:#2b2a27">Un saludo,</p>
  <p style="margin:0;font:600 15px Arial,sans-serif;color:#0B0B0D">Jose Rodríguez Horrillo</p>
  <p style="margin:0 0 18px;font:14px Arial,sans-serif;color:#6b665d">Fundador de DEX · Dirección y gestión de clínicas dentales</p>
  <p style="margin:0;font:12px/1.5 Arial,sans-serif;color:#8a8478">Recibes este correo porque dejaste tus datos para reservar un café en <a href="${SITE}/" style="color:#8a8478">dexdireccionygestion.com</a>. Si respondes, me llega directamente. <a href="${SITE}/privacidad/" style="color:#8a8478">Política de privacidad</a>.</p>
</td></tr></table></td></tr></table></body></html>`;
  const text = [`Hola${nombre ? ' ' + nombre : ''}:`, '', 'Gracias por tu interés en DEX. Hemos recibido tus datos.', '',
    'Si ya has elegido día y hora, te llegará la invitación de Google Calendar con el enlace de Google Meet. Si aún no, puedes elegirla aquí:', AGENDA, '',
    'En el café, 30 minutos por videollamada, me cuentas cómo funciona hoy tu clínica, te doy una primera visión externa y te digo con franqueza si DEX encaja o no.', '',
    conDiag ? '' : `Si tienes dos minutos antes, haz el autodiagnóstico gratuito: ${url('autodiagnostico/')}`, '',
    'Jose Rodríguez Horrillo · DEX'].join('\n');
  return { asunto, html, text };
}

async function suscribir(email) {
  const list = parseInt(process.env.BREVO_LIST_ID, 10);
  if ((process.env.EMAIL_PROVIDER || '').toLowerCase() !== 'brevo' || !list) return null;
  return fetch('https://api.brevo.com/v3/contacts', { method: 'POST', headers: { 'api-key': process.env.EMAIL_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ email, listIds: [list], updateEnabled: true, attributes: { ORIGEN: 'autodiagnostico' } }) });
}

exports.handler = async (event) => {
  try {
    const { payload } = JSON.parse(event.body || '{}');
    const form = payload && payload.form_name;
    if (form !== 'autodiagnostico' && form !== 'reserva') return { statusCode: 200, body: 'ignorado' };
    if (!process.env.EMAIL_PROVIDER || !process.env.EMAIL_API_KEY || !process.env.EMAIL_FROM) return { statusCode: 200, body: 'envío no configurado' };
    const f = payload.data || {};
    const to = String(f.correo || f.email || '').trim();
    if (!EMAIL_RE.test(to)) return { statusCode: 200, body: 'sin correo válido' };
    if (form === 'reserva') {
      const c = await enviar({ to, tipo: 'reserva', ...confirmacion(f) });
      if (!c.ok) console.error('Envío de la confirmación fallido', c.status, await c.text());
      return { statusCode: 200, body: 'ok' };
    }
    let d = {};
    try { d = JSON.parse(f.datos_informe || '{}'); } catch (e) { d = {}; }
    if (!d.puntuacion && f.puntuacion) d.puntuacion = parseInt(f.puntuacion, 10);
    const r = await enviar({ to, ...informe(d) });
    if (!r.ok) console.error('Envío del informe fallido', r.status, await r.text());
    if (String(f.novedades).toLowerCase().startsWith('s')) {
      const s = await suscribir(to);
      if (s && !s.ok && s.status !== 204) console.error('Alta en la lista fallida', s.status, await s.text());
    }
    return { statusCode: 200, body: 'ok' };
  } catch (e) {
    console.error('submission-created', e);
    return { statusCode: 200, body: 'error' };
  }
};

exports._informe = informe; // para pruebas
exports._confirmacion = confirmacion;
