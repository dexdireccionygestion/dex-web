/*
 * Envío automático del informe del autodiagnóstico DEX.
 *
 * Netlify ejecuta esta función cada vez que llega un envío de un formulario (evento "submission-created").
 * Si el envío es del formulario "autodiagnostico", manda a la persona su informe por correo y,
 * si marcó la casilla de seguimiento y artículos, le programa dos correos de seguimiento (a los 2 y 6 días, a las 9:00,
 * solo con Resend) con enlace de baja que los cancela (función "baja"), y la añade a la lista de suscriptores (solo con Brevo).
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
const { enlaceBaja } = require('../lib/baja');
const SITE = 'https://dexdireccionygestion.com';
const UTM = 'utm_source=informe-autodiagnostico&utm_medium=email';

const AREAS = {
  'Diagnóstico y datos': {
    porque: 'Sin datos fiables, cualquier decisión sobre agenda, equipo o precios se toma a ciegas. Es la base de todo lo demás.',
    paso: 'Reserva media hora esta semana y saca de tu programa de gestión la producción del último mes. Divídela entre el número de gabinetes y entre las horas que estuvieron ocupados. Ese número es tu punto de partida.',
    acciones: ['Calcula la producción del último mes por gabinete y por hora ocupada.', 'Elige tres números que vas a revisar cada mes a partir de ahora.'],
    lectura: ['blog-gabinete', 'Facturación por gabinete: cómo calcularla y qué hacer con el dato'] },
  'Objetivos y cuadro de mando': {
    porque: 'Un objetivo escrito convierte la sensación de «este mes ha ido regular» en un número que se puede comparar y corregir a tiempo.',
    paso: 'Coge la producción de los tres últimos meses y escribe un objetivo realista para cada uno de los tres próximos. Ponlo en un sitio visible para ti y para recepción.',
    acciones: ['Escribe el objetivo de producción de los próximos tres meses, mes a mes.', 'Fija un día al mes para comparar lo real con el objetivo.'],
    lectura: ['blog-indicadores', 'Los 8 indicadores que todo propietario debería revisar cada mes'] },
  'Equipo y organización': {
    porque: 'Cuando todo pasa por el propietario, la clínica crece hasta donde llega su tiempo, y no más.',
    paso: 'Durante esta semana, apunta en una hoja cada consulta o decisión que te llegue. El viernes, marca cuáles podría resolver otra persona si supiera que puede hacerlo.',
    acciones: ['Apunta durante dos semanas todo lo que llega a ti y asigna un responsable a cada tarea.', 'Escribe qué puede decidir cada puesto sin preguntarte.'],
    lectura: ['blog-equipo', 'Funciones y responsables: el organigrama que evita que todo pase por ti'] },
  'Protocolos por puesto': {
    porque: 'Un protocolo bien escrito hace que el paciente reciba el mismo trato lo atienda quien lo atienda, y que una baja o un cambio de personal no lo desordene todo.',
    paso: 'Siéntate 20 minutos con la persona de recepción y escribid juntos, en una página, cómo se atiende la llamada de un paciente nuevo: qué se pregunta, qué se ofrece y cómo se cierra la cita.',
    acciones: ['Empieza por un solo protocolo: la llamada de primera visita en recepción.', 'Escríbelo con quien lo hace cada día y revisa en un mes si se cumple.'],
    lectura: ['blog-protocolos', 'Protocolos por puesto: cómo escribirlos para que se cumplan'] },
  'Experiencia del paciente': {
    porque: 'Cada cita que se pierde es tiempo de gabinete que no vuelve, y un paciente que se siente bien atendido vuelve y recomienda.',
    paso: 'Durante siete días, apunta cada cancelación y cada paciente que no se presenta, con el motivo si lo sabes. Al final de la semana sabrás de dónde salen los huecos de tu agenda.',
    acciones: ['Confirma todas las citas con 48 horas de antelación y registra la respuesta.', 'Llama a los pacientes después de los tratamientos importantes.'],
    lectura: ['blog-agenda', 'Huecos y cancelaciones: cómo recuperar el control de la agenda'] },
  'Primeras visitas y presupuestos': {
    porque: 'Un presupuesto que nadie sigue suele quedarse en el cajón, aunque el paciente necesite el tratamiento. Es trabajo que ya has hecho.',
    paso: 'Saca la lista de presupuestos no aceptados de los últimos tres meses, ordénalos por importe y elige los diez primeros. Decide quién los llamará esta semana y con qué mensaje.',
    acciones: ['Revisa los presupuestos no aceptados de los últimos seis meses y llama primero a los de mayor importe.', 'Fija un seguimiento con fechas: a las 48–72 horas, a la semana y al mes.'],
    lectura: ['blog-presupuestos', 'Cómo mejorar la aceptación de presupuestos en tu clínica dental'] },
  'Captación y marketing': {
    porque: 'Si no sabes de dónde viene cada paciente nuevo, no puedes saber qué inversión funciona y cuál deberías cortar.',
    paso: 'Añade hoy en recepción una pregunta fija para cada paciente nuevo, «¿cómo nos has conocido?», con cuatro o cinco respuestas cerradas. Revisa las respuestas dentro de un mes.',
    acciones: ['Pregunta y registra cómo ha llegado cada paciente nuevo, con opciones cerradas.', 'Calcula el coste por paciente nuevo de cada canal en el que inviertes.'],
    lectura: ['blog-captacion', 'Marketing para clínicas dentales: cómo saber qué canal te trae pacientes y a qué coste'] },
  'Costes, caja y herramientas': {
    porque: 'Facturar más no sirve de mucho si el margen se escapa. El cierre de mes te dice cuánto queda de verdad.',
    paso: 'Elige un día fijo de la primera semana de cada mes y apunta cuatro cifras del mes anterior: caja, producción, costes y lo que ha quedado.',
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

function informe(d, baja) {
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
  <p style="margin:0;font:12px/1.5 Arial,sans-serif;color:#8a8478">Recibes este correo porque lo pediste al hacer el autodiagnóstico en <a href="${SITE}/" style="color:#8a8478">dexdireccionygestion.com</a>. Si respondes a este mensaje, me llega directamente. <a href="${SITE}/privacidad/" style="color:#8a8478">Política de privacidad</a>.${baja ? ` Si no quieres recibir los correos de seguimiento ni los artículos, <a href="${esc(baja)}" style="color:#8a8478">date de baja aquí</a>.` : ''}</p>
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
    baja ? `\nDarte de baja de los correos de seguimiento y los artículos: ${baja}` : '',
  ].join('\n');
  return { asunto, html, text };
}

/* ---------- Secuencia tras el informe (solo si marcó la casilla de seguimiento y artículos) ---------- */
const DIAS_SEGUIMIENTO = [2, 6];

/* Fecha ISO de dentro de "dias" días a las 9:00 de Madrid; si cae en fin de semana, pasa al lunes. */
function aLas9(dias, desde = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
  let d = new Date(desde.getTime() + dias * 864e5);
  const dia = () => Object.fromEntries(fmt.formatToParts(d).map(x => [x.type, x.value]));
  let x = dia();
  if (x.weekday === 'Sat') { d = new Date(d.getTime() + 2 * 864e5); x = dia(); }
  else if (x.weekday === 'Sun') { d = new Date(d.getTime() + 864e5); x = dia(); }
  const guess = new Date(`${x.year}-${x.month}-${x.day}T09:00:00Z`);
  const h = +new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', hourCycle: 'h23' }).format(guess);
  return new Date(guess.getTime() - (h - 9) * 36e5).toISOString();
}

function marco(asunto, cuerpo, pie) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(asunto)}</title></head>
<body style="margin:0;background:#F4F1EA;padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FBFAF7;border:1px solid #e3ddd1;border-radius:14px">
<tr><td style="padding:32px">
  <p style="margin:0 0 4px;font:400 26px Georgia,serif;letter-spacing:.3em;color:#0B0B0D">DEX</p>
  <p style="margin:0 0 26px;font:600 10px Arial,sans-serif;letter-spacing:.32em;color:#0B0B0D">DIRECCIÓN EXTERNA</p>
  ${cuerpo}
  <p style="margin:22px 0 4px;font:15px/1.5 Arial,sans-serif;color:#2b2a27">Un saludo,</p>
  <p style="margin:0;font:600 15px Arial,sans-serif;color:#0B0B0D">Jose Rodríguez Horrillo</p>
  <p style="margin:0 0 18px;font:14px Arial,sans-serif;color:#6b665d">Fundador de DEX · Dirección y gestión de clínicas dentales</p>
  <p style="margin:0;font:12px/1.5 Arial,sans-serif;color:#8a8478">${pie}</p>
</td></tr></table></td></tr></table></body></html>`;
}
const P = t => `<p style="margin:0 0 14px;font:16px/1.6 Arial,sans-serif;color:#2b2a27">${t}</p>`;
const BTN = (href, t) => `<p style="margin:8px 0 20px"><a href="${href}" style="display:inline-block;background:#0B0B0D;color:#F8F8F6;text-decoration:none;font:600 15px Arial,sans-serif;padding:14px 24px;border-radius:999px">${t}</a></p>`;
const pieSeq = baja => `Recibes este correo porque, al hacer el autodiagnóstico en <a href="${SITE}/" style="color:#8a8478">dexdireccionygestion.com</a>, pediste recibir el seguimiento de tu informe y un artículo al mes. Si respondes, me llega directamente. <a href="${esc(baja)}" style="color:#8a8478">Darme de baja</a> · <a href="${SITE}/privacidad/" style="color:#8a8478">Privacidad</a>.`;
const UTM_SEQ = n => `utm_source=seguimiento-${n}&utm_medium=email`;
const urlSeq = (path, n) => `${SITE}/${path}?${UTM_SEQ(n)}`;

function seguimiento1(d, baja) {
  const pri = (Array.isArray(d.prioridades) ? d.prioridades : []).filter(a => AREAS[a]);
  const a = pri[0]; if (!a) return null;
  const A = AREAS[a];
  const asunto = `Tu primera prioridad: ${a.toLowerCase()}`;
  const cuerpo = P('Hola:') +
    P(`Hace un par de días hiciste el autodiagnóstico de DEX y tu primera prioridad salió en <b>${esc(a)}</b>. Te escribo para ayudarte a dar el primer paso, que suele ser el más difícil.`) +
    P(`<b>Por qué importa.</b> ${esc(A.porque)}`) +
    P(`<b>Tu primer paso, esta semana.</b> ${esc(A.paso)}`) +
    P(`Si quieres ir un poco más allá, en este artículo lo explico con más detalle:`) +
    `<p style="margin:0 0 20px;font:16px Arial,sans-serif"><a href="${urlSeq(A.lectura[0] + '/', 1)}" style="color:#0B0B0D">${esc(A.lectura[1])} →</a></p>` +
    P('Y si te ayuda contármelo, respóndeme a este correo con lo que hayas encontrado. Lo leo yo.');
  const text = ['Hola:', '', `Hace un par de días hiciste el autodiagnóstico de DEX y tu primera prioridad salió en ${a}. Te escribo para ayudarte a dar el primer paso, que suele ser el más difícil.`, '',
    `Por qué importa. ${A.porque}`, '', `Tu primer paso, esta semana. ${A.paso}`, '', `Más detalle: ${A.lectura[1]} → ${urlSeq(A.lectura[0] + '/', 1)}`, '',
    'Y si te ayuda contármelo, respóndeme a este correo con lo que hayas encontrado. Lo leo yo.', '', 'Jose Rodríguez Horrillo · DEX', '', `Darme de baja: ${baja}`].join('\n');
  return { asunto, html: marco(asunto, cuerpo, pieSeq(baja)), text };
}

function seguimiento2(d, baja) {
  const pri = (Array.isArray(d.prioridades) ? d.prioridades : []).filter(a => AREAS[a]);
  if (!pri.length) return null;
  const resto = pri.slice(1, 3);
  const asunto = `¿Cómo vas con ${pri[0].toLowerCase()}?`;
  const lista = resto.length ? P('Cuando lo tengas en marcha, estas son tus otras dos prioridades y por dónde empezar con cada una:') +
    `<ul style="margin:0 0 18px;padding-left:18px;font:15px/1.6 Arial,sans-serif;color:#2b2a27">${resto.map(a => `<li style="margin-bottom:8px"><b>${esc(a)}.</b> ${esc(AREAS[a].paso)} <a href="${urlSeq(AREAS[a].lectura[0] + '/', 2)}" style="color:#0B0B0D">Leer más →</a></li>`).join('')}</ul>` : '';
  const cuerpo = P('Hola:') +
    P(`Hace unos días te propuse un primer paso en <b>${esc(pri[0])}</b>. ¿Has podido darlo? Si no, no pasa nada: en una clínica siempre hay algo urgente que se cruza. Lo importante es no perderlo de vista.`) +
    lista +
    P(`Si prefieres verlo con alguien de fuera, te ofrezco un café de 30 minutos por videollamada. Repasamos tu resultado, te digo qué haría primero en tu clínica y, con franqueza, si DEX encaja o no. Sin compromiso.`) +
    BTN(`${SITE}/?${UTM_SEQ(2)}#contacto`, 'Reservar mi café de 30 min →') +
    (d.id ? P(`<span style="font-size:14px;color:#6b665d">Al reservar, indica tu código <b>${esc(d.id)}</b> y tendré tus respuestas delante.</span>`) : '') +
    P('Este es el último correo sobre tu informe. A partir de ahora solo recibirás un artículo práctico al mes.');
  const text = ['Hola:', '', `Hace unos días te propuse un primer paso en ${pri[0]}. ¿Has podido darlo? Si no, no pasa nada: en una clínica siempre hay algo urgente que se cruza. Lo importante es no perderlo de vista.`, '',
    ...(resto.length ? ['Tus otras dos prioridades:', ...resto.map(a => `- ${a}. ${AREAS[a].paso} → ${urlSeq(AREAS[a].lectura[0] + '/', 2)}`), ''] : []),
    'Si prefieres verlo con alguien de fuera, te ofrezco un café de 30 minutos por videollamada, sin compromiso:', `${SITE}/?${UTM_SEQ(2)}#contacto`,
    d.id ? `Al reservar, indica tu código ${d.id}.` : '', '', 'Este es el último correo sobre tu informe. A partir de ahora solo recibirás un artículo práctico al mes.', '',
    'Jose Rodríguez Horrillo · DEX', '', `Darme de baja: ${baja}`].join('\n');
  return { asunto, html: marco(asunto, cuerpo, pieSeq(baja)), text };
}

/* Programa la secuencia en Resend. Se crean del último al primero para que cada enlace de baja
   cancele también los correos que aún quedan por salir. Devuelve los ids programados. */
async function programarSecuencia(to, d) {
  if ((process.env.EMAIL_PROVIDER || '').toLowerCase() !== 'resend') return [];
  const pasos = [seguimiento1, seguimiento2];
  const ids = [];
  for (let k = pasos.length - 1; k >= 0; k--) {
    const baja = enlaceBaja(to, ids.slice());
    const m = pasos[k](d, baja); if (!m) continue;
    const r = await enviar({ to, tipo: `seguimiento-${k + 1}`, programado: aLas9(DIAS_SEGUIMIENTO[k]), baja, ...m });
    if (!r.ok) { console.error('Programar seguimiento fallido', k + 1, r.status, await r.text()); continue; }
    const j = await r.json().catch(() => ({}));
    if (j.id) ids.unshift(j.id);
  }
  return ids;
}

async function enviar({ to, asunto, html, text, tipo = 'autodiagnostico', programado, baja }) {
  const P = (process.env.EMAIL_PROVIDER || '').toLowerCase(), key = process.env.EMAIL_API_KEY, from = process.env.EMAIL_FROM;
  const name = process.env.EMAIL_FROM_NAME || 'Jose Rodríguez · DEX';
  const reply = process.env.EMAIL_REPLY_TO || 'jrodriguez@dexdireccionygestion.com';
  if (P === 'brevo') {
    return fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ sender: { name, email: from }, to: [{ email: to }], replyTo: { email: reply }, subject: asunto, htmlContent: html, textContent: text, tags: [tipo] }) });
  }
  if (P === 'resend') {
    return fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: `${name} <${from}>`, to: [to], reply_to: reply, subject: asunto, html, text, tags: [{ name: 'tipo', value: tipo }],
        ...(programado ? { scheduled_at: programado } : {}),
        ...(baja ? { headers: { 'List-Unsubscribe': `<${baja}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } } : {}) }) });
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
    const quiere = String(f.novedades || '').toLowerCase().startsWith('s');
    let ids = [];
    if (quiere) {
      try { ids = await programarSecuencia(to, d); } catch (e) { console.error('Secuencia', e); }
    }
    const baja = quiere ? enlaceBaja(to, ids) : '';
    const r = await enviar({ to, baja, ...informe(d, baja) });
    if (!r.ok) console.error('Envío del informe fallido', r.status, await r.text());
    if (quiere) {
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
exports._seguimiento1 = seguimiento1;
exports._seguimiento2 = seguimiento2;
exports._aLas9 = aLas9;
exports.enviar = enviar;
