window.DEX_PAGES = ["autodiagnostico", "aviso-legal", "blog", "blog-agenda", "blog-captacion", "blog-cierre-mes", "blog-equipo", "blog-facturacion", "blog-gabinete", "blog-gerente", "blog-indicadores", "blog-plan-anual", "blog-presupuestos", "blog-protocolos", "blog-recepcion", "consultoria-clinicas-dentales", "consultoria-dental-madrid", "cookies", "gestion-clinicas-dentales", "inversion-detalle", "metodo", "preguntas", "privacidad"];
/* =====================================================================
   CONFIG DEX · todo el contenido variable se edita aquí.
   Estados:  [CONFIRMADO] dato dado por DEX · [PROVISIONAL] supuesto o texto a validar · [PENDIENTE] falta el dato
   ===================================================================== */
const CONFIG = {
  empresa: {
    marca: "DEX",
    razonSocial: "DEX Dirección y Gestión SL",            // [CONFIRMADO]
    nif: "",                                               // [PENDIENTE]
    domicilio: "",                                         // [PENDIENTE]
    registro: "",                                          // [PENDIENTE] datos del Registro Mercantil
    fundador: "Jose Rodríguez Horrillo",                   // [CONFIRMADO]
    cobertura: "Trabajamos con clínicas dentales de la Comunidad de Madrid, en modelo híbrido: visitas a la clínica y trabajo en remoto.", // [CONFIRMADO] nov 2026: de momento solo Madrid
    provincias: []                                         // [PENDIENTE] p. ej. ["Madrid","Toledo"]
  },
  contacto: {
    email: "jrodriguez@dexdireccionygestion.com",          // [CONFIRMADO]
    telefono: "+34 697 33 48 48",                          // [CONFIRMADO]
    whatsapp: "",                                          // Vacío = sin WhatsApp en la web (decisión 15/11/2026). Para activarlo: "34697334848"
    whatsappTexto: "Hola, me gustaría reservar un café con DEX para hablar de mi clínica.",
    redes: []                                              // [PENDIENTE] [{nombre:"LinkedIn", url:"https://..."}]
  },
  /* Texto junto a los botones de reserva. [CONFIRMADO] */
  cafeNota: "Videollamada. Sin compromiso. Si no encaja, te lo decimos.",  // [CONFIRMADO]

  /* Niveles de acompañamiento. Sin precios hasta que DEX los facilite.
     precio: texto opcional, p. ej. "desde 000 €/mes" [PENDIENTE]. Descripciones [CONFIRMADO] textos autorizados por Jose (26/10/2026). */
  packs: [
    { id:"control", nombre:"DEX Control", idea:"Dirección con datos", para:"1–3 gabinetes · propietario que ejecuta",
      desc:"DEX diagnostica, fija objetivos y decide contigo. Tu clínica ejecuta.", base:"Incluye:",
      incluye:["1 visita a la clínica al trimestre","Diagnóstico, objetivos y cuadro de mando","Control de costes, caja y herramientas"], precioMes:990 },
    { id:"management", nombre:"DEX Management", idea:"Dirección que implanta", para:"3–6 gabinetes · equipo que necesita orden", destacado:"Recomendado",
      desc:"DEX implanta los cambios contigo y con tu equipo.", base:"Todo lo de Control, más:",
      incluye:["1 visita a la clínica al mes","Equipo, organigrama y protocolos por puesto","Experiencia del paciente, primeras visitas y presupuestos","Role-play de primeras visitas y formación en protocolos","Respuesta entre reuniones"], precioMes:1890 },
    { id:"executive", nombre:"DEX Executive", idea:"Dirección integral", para:"6+ gabinetes · varias clínicas o grupos",
      desc:"DEX actúa como dirección de referencia para tu equipo.", base:"Todo lo de Management, más:",
      incluye:["2 visitas al mes y reuniones con mandos","Informe de diagnóstico de marca corporativa, presencia digital y automatización de procesos","Plan de formación anual del equipo"], precioMes:3290 }
  ],  // [PROVISIONAL] alcance y precios propuestos, no confirmados por DEX. precioMes: cuota mensual "desde", sin implantación. 0 = no mostrar precio
  comunes: [["scope","Diagnóstico 360º y DEX Score"],["calendar","Plan de 12 meses"],["team","Reunión semanal de dirección"],["doc","Reportes del día 15 y de cierre"],["chart","Revisión trimestral"],["screen","Plataforma de cliente"]],

  /* Calculadora a 1 año. Supuestos de plantilla [PROVISIONAL · ilustrativos].
     dex / implantacion: null = el visitante los introduce desde su propuesta. */
  calc: { salario:42000, cotizaciones:31, variable:6000, otros:2500, incorporacion:5000, dex:null, implantacion:null, dexOtros:0 },

  /* Videollamada-café tras el formulario.
     url: enlace de reserva real (Google Calendar, Calendly…). Si se rellena, el paso 2 abre ese calendario.
     Vacío = selector propio; la cita se envía como solicitud y DEX la confirma. Horas siempre en hora de Madrid. */
  booking: {
    url: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1_Kj4iHs_FCSsyS0xB2yHaWgu-Uw0VuNAlB6cUgd5hRD3F-hP_XqIem6Ktf3cyCJGGj-Z-FTea?hl=es", // [CONFIRMADO] (hl=es: página de reserva siempre en español) agenda de citas «Café con DEX» de Google Calendar (Jose): L–V 8:30–13:00 y 14:00–17:00, 30 min, 30 min entre citas, 24 h de antelación
    titulo: "Videollamada-café con DEX",
    duracionMin: 30,                                       // [PROVISIONAL]
    dias: [1,2,3,4,5],                                     // lunes a viernes [PROVISIONAL]
    franjas: ["08:30","09:00","14:00","14:30","15:00","15:30","20:00","20:30"], // [PROVISIONAL] fuera del horario habitual de consulta
    diasVista: 10,
    antelacionDias: 1,
    tz: "Europe/Madrid",
    zona: "Hora peninsular"
  },

  /* Plan de 12 meses RELATIVO al mes de inicio (mes 1 = primer mes de trabajo). */
  plan: [
    { nombre:"Diagnóstico y cimientos", meses:[
      { t:"Bienvenida y diagnóstico", i:["Accesos a las herramientas, recogida de datos y mapa de procesos.","Entrevista y valoración individual de todo el equipo.","Radiografía económica y primer DEX Score.","Análisis inicial de marketing: qué canales funcionan y a qué coste."]},
      { t:"Objetivos, equipo y primeras visitas", i:["Objetivos de los 12 meses por escrito, por mes, área y puesto, con su cuadro de mando.","Nuevo organigrama, funciones y responsables.","Protocolo de primera visita: guion, documentación y cierre.","Formación con role-play a quien pasa las primeras visitas.","Plan de 90 días cerrado y aprobado."]},
      { t:"Protocolos por puesto", i:["Protocolos escritos para recepción, asistentes, higienistas, coordinación, doctores y gerencia.","Presentación al equipo y resolución de dudas.","Primera revisión de la primera visita: observación y feedback.","Cierre del primer trimestre: segundo DEX Score y comparativa con el mes 1."]}]},
    { nombre:"Paciente y captación", meses:[
      { t:"Experiencia del paciente", i:["Auditoría del recorrido completo: llamada, llegada, consulta, despedida y seguimiento.","Bienvenida, comunicación antes y después de cada cita, y seguimiento tras los tratamientos.","Sistema de petición de reseñas."]},
      { t:"Marketing y reactivación", i:["Decisión de inversión en marketing con los datos de los cuatro primeros meses.","Puesta en marcha de las campañas de captación.","Reactivación de pacientes antiguos y recuperación de presupuestos no aceptados."]},
      { t:"Control y ajuste", i:["Revisión de la aplicación de los protocolos por puesto.","Formación de refuerzo donde haga falta.","Cierre del semestre: balance económico, DEX Score y ajuste de objetivos."]}]},
    { nombre:"Consolidación", meses:[
      { t:"Consolidar la rutina", i:["Revisión de procesos y actualización de protocolos.","Seguimiento de agenda, producción y conversión de presupuestos frente al objetivo."]},
      { t:"Formación y preparación", i:["Plan de formación del equipo para el último trimestre.","Preparación de la siguiente campaña de captación."]},
      { t:"Revisión del tercer trimestre", i:["Tercer DEX Score y valoración del equipo.","Objetivos del último trimestre y responsable de cada uno."]}]},
    { nombre:"Objetivos y nuevo ciclo", meses:[
      { t:"Empuje hacia los objetivos", i:["Cuánto falta para cada objetivo, mes a mes.","Refuerzo de la captación y de la conversión de presupuestos.","Revisión final de protocolos y de la experiencia del paciente."]},
      { t:"Ajuste fino", i:["Acciones correctoras inmediatas si hay desviación.","Cierre de presupuestos pendientes.","Reconocimiento y motivación del equipo.","Auditoría de las herramientas para empezar el siguiente ciclo en orden."]},
      { t:"Cierre y balance", i:["DEX Score final y comparativa con el mes 1.","Informe para la propiedad: qué se ha conseguido, qué ha fallado y por qué.","Objetivos, presupuesto y plan de marketing del segundo ciclo."]}]}
  ],
  /* Autodiagnóstico: una pregunta por área. Las opciones van de peor (0) a mejor (3). [CONFIRMADO] textos autorizados por Jose (26/10/2026) */
  diagnostico: [
    { area:"Diagnóstico y datos", gana:"Saber qué mejorar primero y con qué impacto.", q:"¿Sabes, con datos, cuánto factura tu clínica por gabinete cada mes?", ops:["No lo tengo calculado","Lo intuyo, pero sin datos","Lo miro de vez en cuando","Sí, lo reviso cada mes"] },
    { area:"Objetivos y cuadro de mando", gana:"Saber cada mes si vas por delante o por detrás del objetivo.", q:"¿Tienes objetivos anuales por escrito, desglosados por mes?", ops:["No","Tengo una cifra en la cabeza","Por escrito, pero sin seguimiento","Sí, y los reviso cada mes"] },
    { area:"Equipo y organización", gana:"Un equipo que conoce sus prioridades y responde de ellas.", q:"¿Cada persona del equipo tiene funciones y responsables claros?", ops:["No, cada uno resuelve a su manera","Solo en algunos puestos","Sí, pero no está por escrito","Sí, con organigrama y funciones escritas"] },
    { area:"Protocolos por puesto", gana:"Que la clínica funcione igual de bien aunque no estés delante.", q:"¿Hay protocolos escritos para recepción, asistentes e higienistas?", ops:["No","Alguno suelto","Sí, pero nadie revisa que se cumplan","Sí, y se revisan"] },
    { area:"Experiencia del paciente", gana:"Más confianza, más fidelidad y una agenda más estable.", q:"¿Confirmáis las citas y hacéis seguimiento después de los tratamientos?", ops:["Ni una cosa ni otra","Solo a veces","Confirmamos, pero sin seguimiento","Las dos cosas, siempre"] },
    { area:"Primeras visitas y presupuestos", gana:"Convertir más primeras visitas en tratamientos.", q:"¿Qué pasa con un presupuesto que el paciente no acepta en el momento?", ops:["Se queda ahí","Alguien llama si se acuerda","Hay seguimiento, pero no lo medimos","Seguimiento con fechas y tasa de aceptación medida"] },
    { area:"Captación y marketing", gana:"Que cada euro de marketing tenga un objetivo y una medición.", q:"¿Sabes qué canal te trae pacientes nuevos y a qué coste?", ops:["No lo sé","Invertimos, pero sin medir","Lo sé a grandes rasgos","Sí, por canal y coste por paciente"] },
    { area:"Costes, caja y herramientas", gana:"Más control sobre la rentabilidad real de la clínica.", q:"¿Revisas cada mes los costes de laboratorio, el cierre de caja y los márgenes?", ops:["Nunca","Solo cuando algo falla","Algunas cosas","Sí, todo cada mes"] }
  ],
  /* Lectura recomendada para cada área del autodiagnóstico (en el resultado y en el informe por correo). */
  lecturas: {
    "Diagnóstico y datos": ["blog-gabinete", "Facturación por gabinete: cómo calcularla y qué hacer con el dato"],
    "Objetivos y cuadro de mando": ["blog-indicadores", "Los 8 indicadores que todo propietario debería revisar cada mes"],
    "Equipo y organización": ["blog-equipo", "Funciones y responsables: el organigrama que evita que todo pase por ti"],
    "Protocolos por puesto": ["blog-protocolos", "Protocolos por puesto: cómo escribirlos para que se cumplan"],
    "Experiencia del paciente": ["blog-agenda", "Huecos y cancelaciones: cómo recuperar el control de la agenda"],
    "Primeras visitas y presupuestos": ["blog-presupuestos", "Cómo mejorar la aceptación de presupuestos en tu clínica dental"],
    "Captación y marketing": ["blog-captacion", "Marketing para clínicas dentales: cómo saber qué canal te trae pacientes y a qué coste"],
    "Costes, caja y herramientas": ["blog-cierre-mes", "El cierre de mes de una clínica dental: qué revisar y en qué orden"]
  },
  /* Calculadora "Lo que se escapa": valores de ejemplo [PROVISIONAL] */
  fuga: { huecosSemana:4, valorHora:120, presupuestosMes:6, importeMedio:900, semanasAnio:44, recuperable:25 },
  /* Acciones de temporada por mes natural (0 = enero). Se suman al mes del plan que caiga en ese mes. */
  temporada: {
    0:["Arranque del año natural: cierre del año anterior y objetivos anuales por escrito."],
    5:["Planificación de vacaciones para no dejar la clínica descubierta."],
    6:["Seguimiento estrecho de agenda y producción antes del parón.","Control de cancelaciones y huecos."],
    7:["Reportes simplificados para no saturar a la propiedad.","Preparación de la campaña de septiembre: mensajes, creatividades y presupuesto."],
    8:["Campaña de vuelta a la rutina: revisiones, higienes y presupuestos pendientes."],
    9:["Campañas para llenar la agenda de noviembre y diciembre."],
    11:["Cuidado extra de la experiencia del paciente en la época de máxima demanda.","Balance del año natural y plan de marketing del año siguiente."]
  },
  /* Multimedia: añadir src (ruta o URL) cuando existan. Sin src no se muestra nada. */
  media: {
    fundador: { src:"/assets/jose-rodriguez-horrillo-480.webp", alt:"Jose Rodríguez Horrillo, fundador y CEO de DEX" }, // [CONFIRMADO]
    videos: {
      presentacion: { titulo:"Vídeo de presentación de DEX", src:"", poster:"" }      // [PENDIENTE] aparece en el hero cuando exista
    }
  },
  /* Solo testimonios reales y autorizados: { texto, nombre, cargo, clinica } */
  testimonios: [],
  /* Formulario: endpoint de un servicio de formularios o CRM (Formspree, Getform, HubSpot Forms, endpoint propio).
     Vacío = el formulario valida y prepara el mensaje, y se muestra cómo enviarlo por correo, teléfono o WhatsApp. */
  /* Textos legales (aviso legal, privacidad y cookies). Lo vacío se muestra como [pendiente] en la web. */
  legal: {
    actualizado: "20 de noviembre de 2026",
    dominio: "dexdireccionygestion.com",              // [CONFIRMADO]
    jurisdiccion: "",                                      // [PENDIENTE] ciudad del domicilio social, p. ej. "Madrid"
    emailPrivacidad: "",                                   // [OPCIONAL] vacío = se usa contacto.email
    dpd: "",                                               // [OPCIONAL] solo si se designa delegado de protección de datos
    marcaOEPM: "",                                         // [OPCIONAL] número de registro de la marca DEX
    conservacionMeses: 12,                                 // [PROVISIONAL] reservas y consultas sin contratación
    fuentesPropias: true,
    ubicacionUmami: "Unión Europea (región de datos UE de Umami Cloud). No guarda tu dirección IP ni usa cookies.",                                  // true cuando las tipografías se alojen en el propio dominio
    proveedores: [                                         // [PENDIENTE] completar al conectar los servicios
      { servicio:"Alojamiento de la web", nombre:"Netlify, Inc.", ubicacion:"Estados Unidos (adherida al Marco de Privacidad de Datos UE-EE. UU.)" },
      { servicio:"Correo electrónico", nombre:"Google (Google Workspace: Gmail)", ubicacion:"UE y otros países (Google Ireland Ltd.; Google LLC adherida al Marco de Privacidad de Datos UE-EE. UU.)" },
      { servicio:"Envío del informe del autodiagnóstico y de la confirmación de reserva", nombre:"Resend, Inc.", ubicacion:"Envío desde la UE (Irlanda); empresa en Estados Unidos adherida al Marco de Privacidad de Datos UE-EE. UU." },
      { servicio:"Envío de formularios por correo", nombre:"Netlify, Inc. (Netlify Forms)", ubicacion:"Estados Unidos (adherida al Marco de Privacidad de Datos UE-EE. UU.)" },
      { servicio:"Agenda de citas y videollamada", nombre:"Google (Google Workspace: Calendar y Meet)", ubicacion:"UE y otros países (Google Ireland Ltd.; Google LLC adherida al Marco de Privacidad de Datos UE-EE. UU.)" }
    ],
    terceros: [{ nombre:"Google Calendar (agenda de citas)", uso:"la agenda de citas de Google solo se carga dentro de esta web cuando, después de dejar tus datos, pasas a elegir día y hora. En ese momento Google puede usar sus propias cookies, necesarias para mostrar y reservar la cita, y se aplican sus condiciones y su política de privacidad. Si prefieres no cargarla aquí, puedes abrirla en una pestaña nueva o pedirnos la cita por correo o teléfono." }]                                           // p. ej. { nombre:"Calendly", uso:"agenda de citas; instala cookies propias, solo con tu consentimiento." }
  },
  /* Envío de formularios por correo a DEX.
     "netlify": Netlify Forms (la web alojada en Netlify). El aviso por correo a "destino" se configura en
       Netlify > Site configuration > Forms > Form notifications. Formularios: "reserva" y "autodiagnostico".
     "formsubmit": alternativa sin cuenta (formsubmit.co); el primer envío pide activar desde el correo "destino". */
  form: {
    proveedor: "netlify",                                  // "netlify" | "formsubmit"
    destino: "jrodriguez@dexdireccionygestion.com",       // [CONFIRMADO] a dónde llegan reservas y autodiagnósticos
    alias: "",                                             // solo FormSubmit: alias aleatorio tras activar
    get endpoint(){ return this.proveedor === "netlify" ? "/" : "https://formsubmit.co/ajax/" + (this.alias || this.destino); },
    minSegundos: 3,
    /* true cuando esté configurado el envío automático del informe (función de Netlify + Brevo o Resend). Ver README. */
    informeAuto: true
  },                    // [PENDIENTE]
  /* Analítica: Umami, sin cookies (no hace falta banner). Se activa sola al poner el Website ID de la cuenta de Umami
     (cloud.umami.is > Settings > Websites > Edit > Website ID). Solo mide en el dominio real, no en vistas previas. */
  analytics: {
    proveedor: "umami",
    websiteId: "4c55efe9-618a-4890-a2f9-3d17b116ed4f",     // cuenta de Umami Cloud de jrodriguez@ (región UE)
    src: "https://cloud.umami.is/script.js",
    dominio: "dexdireccionygestion.com",
    get enabled(){ return !!this.websiteId; }
  }
};

/* ===================== utilidades ===================== */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const eur = new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0,useGrouping:"always"});
const f = n => eur.format(Math.round(n));
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store = { get(k){try{return localStorage.getItem(k)}catch(e){return null}}, set(k,v){try{localStorage.setItem(k,v)}catch(e){}} };

function track(name, data={}){
  try{ document.dispatchEvent(new CustomEvent("dex:track",{detail:{name,...data}})); }catch(e){}
  if(!CONFIG.analytics.enabled || name === "page_view") return;   // Umami ya cuenta las visitas solo
  try{ if(window.umami && window.umami.track) window.umami.track(name === "cta_click" && data.id ? data.id : name, data); }catch(e){}
}
function initAnalytics(){
  const A = CONFIG.analytics;
  if(!A.enabled || document.getElementById("umami") || location.hostname.replace(/^www\./,"") !== A.dominio) return;
  const s = document.createElement("script");
  s.id = "umami"; s.defer = true; s.src = A.src;
  s.dataset.websiteId = A.websiteId; s.dataset.domains = A.dominio + ",www." + A.dominio; s.dataset.doNotTrack = "true";
  document.head.appendChild(s);
}
document.addEventListener("click", e => { const t = e.target.closest("[data-track]"); if(t) track("cta_click",{id:t.dataset.track}); });

const ICONS = {
  scope:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5M11 8v6M8 11h6"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  team:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 14.5c3 0 6 1.8 6 5.5"/>',
  doc:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 12h7M9 16h7"/>',
  smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14c1 1.5 2.4 2.2 4 2.2s3-.7 4-2.2M9 9.5h.01M15 9.5h.01"/>',
  handshake:'<path d="M3 12l4-4 4 2 3-2 7 4-4 5-3-2-3 3-4-3z"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  screen:'<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>',
  coins:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>'
};
const icon = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]||ICONS.target}</svg>`;
function renderIcons(){ $$("[data-ico]").forEach(el => el.innerHTML = icon(el.dataset.ico)); }
function renderCafeNotes(){ $$(".cafe-note").forEach(el => el.textContent = CONFIG.cafeNota); }

/* ===================== cálculo (función pura) ===================== */
function compute(v){
  const cotiz = (v.salario + v.variable) * v.cotizaciones/100;
  const hireAnnual = v.salario + cotiz + v.variable + v.otros;
  const hireY1 = hireAnnual + v.incorporacion;
  const dexAnnual = v.dex*12 + v.dexOtros;
  const dexY1 = dexAnnual + v.implantacion;
  const save = hireY1 - dexY1;
  const pct = hireY1 > 0 ? save/hireY1*100 : 0;
  return { cotiz, hireAnnual, hireY1, dexAnnual, dexY1, save, pct };
}

/* ===================== plan de 12 meses ===================== */
function renderCalendar(){
  const MES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const sel = $("#startMonth"), ph = $("#phases"), now = new Date(), curM = now.getMonth(), curY = now.getFullYear();
  if(!ph) return;
  sel.innerHTML = MES.map((m,i)=>`<option value="${i}"${i===curM?" selected":""}>${m}</option>`).join("");
  const all = []; CONFIG.plan.forEach((F,fi) => F.meses.forEach(M => all.push({...M, fase:F.nombre, fi})));
  const SCORE = [0,2,5,8,11];
  const real = n => { const s0 = +sel.value, y0 = s0 < curM ? curY+1 : curY, k = s0 + n; return { m: k % 12, y: y0 + Math.floor(k/12) }; };
  let cur = 0;
  const build = () => {
    ph.innerHTML = `<div class="ms-phases">${CONFIG.plan.map((F,fi)=>`<div class="ms-ph ph${fi}"><b>${esc(F.nombre)}</b><small>Meses ${fi*3+1}–${fi*3+3}</small></div>`).join("")}</div>
      <div class="ms-months">${all.map((M,i)=>{ const r = real(i), season = !!CONFIG.temporada[r.m], sc = SCORE.includes(i);
        return `<button type="button" role="tab" id="mtab${i}" class="ms-m ph${M.fi}" aria-controls="monthPanel" aria-selected="false" data-i="${i}" aria-label="Mes ${i+1}, ${MES[r.m]} ${r.y}${sc?", medición del DEX Score":""}${season?", con acciones de temporada":""}"><span class="mm-n">Mes ${i+1}</span><span class="mm-d">${MES[r.m].slice(0,3)} ${String(r.y).slice(2)}</span><span class="mm-k">${sc?'<i class="lg-score"></i>':""}${season?'<i class="lg-season"></i>':""}</span></button>`; }).join("")}</div>`;
    show(cur, false);
  };
  const show = (i, focus) => {
    cur = i; const M = all[i], r = real(i), extra = CONFIG.temporada[r.m] || [], sc = SCORE.includes(i);
    $$("#phases [role=tab]").forEach(b => { const on = +b.dataset.i===i; b.setAttribute("aria-selected", on); b.tabIndex = on?0:-1; });
    const p = $("#monthPanel"); p.setAttribute("aria-labelledby","mtab"+i);
    p.innerHTML = `<div class="mp-top"><div><p class="eyebrow">Mes ${i+1} · ${MES[r.m]} ${r.y}</p><h3>${esc(M.t)}</h3><p class="mp-phase">Fase ${M.fi+1} · ${esc(M.fase)}${sc?' · <span class="mp-score">Medición del DEX Score</span>':""}</p></div>
        <div class="mp-nav"><button type="button" class="mp-btn" data-step="-1" ${i===0?"disabled":""} aria-label="Mes anterior">←</button><button type="button" class="mp-btn" data-step="1" ${i===all.length-1?"disabled":""} aria-label="Mes siguiente">→</button></div></div>
      <div class="mp-body"><ul>${M.i.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      ${extra.length?`<div class="season"><p class="how-label"><i></i>Por la época del año</p><ul>${extra.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:""}</div>`;
    if(focus) $("#mtab"+i).focus();
  };
  ph.addEventListener("click", e => { const b = e.target.closest("[role=tab]"); if(b){ show(+b.dataset.i); track("calendar_month",{mes:+b.dataset.i+1}); } });
  ph.addEventListener("keydown", e => {
    const b = e.target.closest("[role=tab]"); if(!b) return;
    let i = +b.dataset.i;
    if(e.key==="ArrowRight"||e.key==="ArrowDown") i = Math.min(all.length-1,i+1); else if(e.key==="ArrowLeft"||e.key==="ArrowUp") i = Math.max(0,i-1); else return;
    e.preventDefault(); show(i, true);
  });
  $("#monthPanel").addEventListener("click", e => { const b = e.target.closest("[data-step]"); if(b && !b.disabled) show(Math.min(all.length-1, Math.max(0, cur + +b.dataset.step))); });
  build();
}

/* ===================== contenido ===================== */
let PACK = "";
const rd = x => Math.round(x/500)*500;  /* ahorro redondeado a 500 € para no mostrar cuotas exactas */
const pctR = (a,b) => Math.round(a/b*100);
function renderPacks(){
  const CK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const d = CONFIG.calc, dir = compute({salario:d.salario, cotizaciones:d.cotizaciones, variable:d.variable, otros:d.otros, incorporacion:d.incorporacion, dex:0, dexOtros:0, implantacion:0});
  const min = Math.min(...CONFIG.packs.map(p=>p.precioMes||Infinity));
  if($("#pkDir")) $("#pkDir").innerHTML = `<div class="pkd-a"><small>Referencia: un director en plantilla</small><b>${f(dir.hireAnnual/12)}<span>/mes</span></b><span class="pkd-y">${f(dir.hireAnnual)} al año en coste empresa, más selección e incorporación</span></div>
    <p class="pkd-txt">Esto es lo que te ahorras con cada nivel de DEX: sin nómina, cotizaciones ni costes de selección.</p>`;
  $("#packs").innerHTML = CONFIG.packs.map(p => { const save = p.precioMes ? dir.hireAnnual - p.precioMes*12 : 0;
    return `<article class="pack${p.destacado?" hl":""}">${p.destacado?`<span class="chip">${esc(p.destacado)}</span>`:""}
      <div class="pk-top"><span class="lab">${esc(p.idea)}</span><h3>${esc(p.nombre)}</h3><p class="pk-for">${esc(p.para)}</p></div>
      ${p.precioMes?`<div class="pk-price pk-saving"><small class="pks-l">Ahorro estimado frente a un director</small><p class="price">≈ ${f(rd(save))}<small>/año</small></p><p class="pk-save">${pctR(save, dir.hireAnnual)} % menos que un director en plantilla</p></div>`:""}
      <p class="pk-desc">${esc(p.desc)}</p>
      <div class="pk-list"><p class="pk-base">${esc(p.base||"Incluye:")}</p><ul class="pk-inc">${p.incluye.map(x=>`<li>${CK}<span>${esc(x)}</span></li>`).join("")}</ul></div>
      <a class="btn pk-cta" href="/#contacto" data-pack="${esc(p.nombre)}" data-track="cta_pack_${p.id}">Me interesa ${esc(p.nombre.replace("DEX ",""))} <span class="arr" aria-hidden="true">→</span></a></article>`; }).join("");
  $("#packsNote").innerHTML = `<div class="pk-common"><div class="pkc-head"><p class="pk-base">En los tres niveles</p><h3>La misma base de dirección.</h3><p>El mismo método y el mismo compromiso en todos. Lo que cambia es el alcance: cuántas áreas abordamos y cuánta presencia necesita tu clínica.</p></div><ul>${CONFIG.comunes.map(([ic,x])=>`<li><span class="pkc-ico">${icon(ic)}</span><span>${esc(x)}</span></li>`).join("")}</ul></div>
    <p class="note">Estimación orientativa: compara el coste anual recurrente de un director en plantilla con la cuota de cada nivel, sin IVA ni implantación. El precio exacto se concreta en tu propuesta. <a class="link" href="/inversion-detalle/">Calcula tu ahorro con tu caso →</a></p>`;
  $("#packs").addEventListener("click", e => { const b = e.target.closest("[data-pack]"); if(b) PACK = b.dataset.pack; });
}
function initFAQ(){
  $("#faqList").addEventListener("toggle", e => { if(e.target.open) track("faq_open",{q:e.target.querySelector("summary").textContent}); }, true);
}
function renderTestimonials(){
  const t = CONFIG.testimonios; if(!t.length) return;
  const el = $("#testimonials"); el.hidden = false;
  el.innerHTML = t.map(x => `<figure class="mcard" style="margin:0"><blockquote style="margin:0;font-family:var(--f-display);font-size:1.3rem">“${esc(x.texto)}”</blockquote><figcaption><small>${esc(x.nombre)} · ${esc(x.cargo)}, ${esc(x.clinica)}</small></figcaption></figure>`).join("");
}
function renderMedia(){
  const fo = CONFIG.media.fundador;
  if(fo.src && $("#hostPhoto")) $("#hostPhoto").innerHTML = `<img src="${esc(fo.src)}" alt="" width="480" height="480" loading="lazy" decoding="async">`;
  if(fo.src && $("#founderPhoto")) $("#founderPhoto").innerHTML = `<img src="${esc(fo.src)}" alt="${esc(fo.alt)}" width="480" height="480" loading="lazy" decoding="async">`;
  const v = CONFIG.media.videos.presentacion;
  if(v.src) $("#heroVideo").innerHTML = `<button type="button" class="hero-play" data-video="presentacion"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg>${esc(v.titulo)}</button>`;
}
const waLink = () => CONFIG.contacto.whatsapp ? `https://wa.me/${CONFIG.contacto.whatsapp}?text=${encodeURIComponent(CONFIG.contacto.whatsappTexto)}` : "";
function initWhatsApp(){
  const u = waLink(); if(!u || $("#waFab")) return;
  const a = document.createElement("a");
  a.id = "waFab"; a.className = "wa-fab"; a.href = u; a.target = "_blank"; a.rel = "noopener";
  a.setAttribute("aria-label", "Escribir a DEX por WhatsApp"); a.dataset.track = "cta_whatsapp_fab";
  a.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1.3-4A8 8 0 1 1 8 19z"/><path d="M9.5 9.5c0 2.5 2.5 5 5 5l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z" fill="currentColor" stroke="none"/></svg><span class="wa-tip" aria-hidden="true">¿Hablamos por WhatsApp?</span>`;
  document.body.appendChild(a);
}
function renderContact(){
  const c = CONFIG.contacto;
  const row = (lab, val, href, ext) => `<div><span><small>${lab}</small><b>${esc(val)}</b></span><span style="display:flex;gap:8px"><button type="button" class="copy" data-copy="${esc(val)}">Copiar</button>${href?`<a class="copy" href="${href}"${ext?' target="_blank" rel="noopener"':""} style="text-decoration:none">Abrir</a>`:""}</span></div>`;
  if($("#direct")) $("#direct").innerHTML = row("Correo", c.email, "mailto:"+c.email) + row("Teléfono", c.telefono, "tel:"+c.telefono.replace(/\s/g,""))
    + (c.whatsapp ? `<div><span><small>WhatsApp</small><b>Escríbenos un mensaje</b></span><a class="copy" href="${waLink()}" target="_blank" rel="noopener" data-track="cta_whatsapp" style="text-decoration:none">Abrir WhatsApp</a></div>` : "");
  const FI = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const mail = FI('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'), tel = FI('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'), wa = FI('<path d="M4 20l1.3-4A8 8 0 1 1 8 19z"/><path d="M9 10c0 3 2 5 5 5l1-1.5-2-1-1 1c-1-.5-1.5-1-2-2l1-1-1-2z"/>');
  const at = esc(c.email).replace("@","@<wbr>");
  if($("#footContact")) $("#footContact").innerHTML = `<li><a href="mailto:${esc(c.email)}">${mail}<span>${at}</span></a></li><li><a href="tel:${esc(c.telefono.replace(/\s/g,""))}">${tel}<span>${esc(c.telefono)}</span></a></li>` +
    (c.whatsapp ? `<li><a href="${waLink()}" target="_blank" rel="noopener">${wa}<span>WhatsApp</span></a></li>` : "") +
    c.redes.map(r=>`<li><a href="${esc(r.url)}" rel="noopener" target="_blank"><span>${esc(r.nombre)}</span></a></li>`).join("");
  const E = CONFIG.empresa;
  if($("#coverageText")) $("#coverageText").textContent = E.cobertura + (E.provincias.length?` ${E.provincias.join(" · ")}.`:"");
  $("#legalLine").textContent = `© ${new Date().getFullYear()} ${E.razonSocial}. Todos los derechos reservados.`;
}
document.addEventListener("click", async e => {
  const b = e.target.closest("[data-copy]"); if(!b) return;
  const txt = b.dataset.copy, old = b.textContent;
  try{ await navigator.clipboard.writeText(txt); b.textContent = "Copiado"; }
  catch(err){ const r = document.createRange(); const target = b.closest("div,.form-state")?.querySelector("b,pre"); if(target){ r.selectNodeContents(target); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } b.textContent = "Selecciona y copia"; }
  setTimeout(()=> b.textContent = old, 1800);
});

/* Comparativa: en móvil, una tarjeta por opción construida a partir de la tabla */
function renderCmpCards(){
  const t = $("#cmpTable"); const heads = $$("thead th", t).slice(1).map(th => ({name: th.textContent, dex: th.classList.contains("dexcol")}));
  const rows = $$("tbody tr", t).map(tr => ({k: tr.querySelector("th").textContent, v: $$("td", tr).map(td => td.textContent)}));
  $("#cmpCards").innerHTML = heads.map((h,c) => `<article class="cmp-card${h.dex?" dex":""}"><h4>${esc(h.name)}</h4><dl>${rows.map(r=>`<div><dt>${esc(r.k)}</dt><dd>${esc(r.v[c])}</dd></div>`).join("")}</dl></article>`).join("");
}

/* ===================== calculadora (1 año, dos niveles) ===================== */
const IDS = { salario:"c_sal", cotizaciones:"c_ss", variable:"c_var", otros:"c_otr", incorporacion:"c_ini", dex:"c_dex", implantacion:"c_imp", dexOtros:"c_dexo" };
const NUM = new Intl.NumberFormat("es-ES",{maximumFractionDigits:2,useGrouping:"always"});
const isPct = id => id==="c_ss";
function parseVal(id){
  let s = String($("#"+id).value).replace(/[\s€%]/g,"");
  if(isPct(id)) s = s.replace(",", ".");
  else s = s.replace(/\./g,"").replace(",", ".");
  const n = parseFloat(s); return isFinite(n) && n > 0 ? n : 0;
}
function fmtField(id){ const el = $("#"+id); if(el.value.trim()==="") return; const n = parseVal(id); el.value = n ? NUM.format(n) : "0"; }
function setDefaults(){
  const d = CONFIG.calc;
  const set = (id, v) => { $("#"+id).value = (v===null || v===undefined || v==="") ? "" : NUM.format(v); };
  set("c_sal", d.salario); set("c_ss", d.cotizaciones); set("c_var", d.variable); set("c_otr", d.otros); set("c_ini", d.incorporacion);
  set("c_dex", d.dex); set("c_imp", d.implantacion); set("c_dexo", d.dexOtros || 0);
}
function readCalc(){
  const v = {}; for(const [k,id] of Object.entries(IDS)) v[k] = parseVal(id);
  v.cotizaciones = Math.min(v.cotizaciones, 100); v.hasDex = v.dex > 0; return v;
}
let lastShown = 0, calcTracked = false, LVL = "";
function renderLevels(){
  const box = $("#lvlPick"); if(!box) return;
  const packs = CONFIG.packs.filter(p => p.precioMes);
  box.innerHTML = packs.map(p => `<button type="button" class="lvl" role="radio" aria-checked="false" data-lvl="${esc(p.nombre)}" data-price="${p.precioMes}"><b>${esc(p.nombre.replace("DEX ",""))}</b><span>${esc(p.para||"")}</span>${p.destacado?`<em>${esc(p.destacado)}</em>`:""}</button>`).join("")
;
  const pick = b => {
    $$(".lvl", box).forEach(x => x.setAttribute("aria-checked", String(x===b)));
    LVL = b.dataset.lvl; if(LVL) PACK = LVL;
    if(b.dataset.price){ $("#c_dex").value = NUM.format(+b.dataset.price); $("#c_imp").value = ""; $("#c_dexo").value = "0"; $("#dexDetails").open = false; }
    else { $("#dexDetails").open = true; $("#c_dex").focus(); }
    updateCalc();
  };
  if(box._bound) { /* ya enlazado */ } else {
  box._bound = true;
  box.addEventListener("click", e => { const b = e.target.closest(".lvl"); if(b){ pick(b); track("calc_level",{nivel:b.dataset.lvl||"propuesta"}); } });
  $("#c_dex").addEventListener("input", () => { const c = $$(".lvl", box).find(x => !x.dataset.lvl); $$(".lvl", box).forEach(x => x.setAttribute("aria-checked", String(x===c))); LVL = ""; });
  }
  const def = $$(".lvl", box).find(x => CONFIG.packs.some(p => p.destacado && p.nombre===x.dataset.lvl)) || box.querySelector(".lvl");
  if(def){ def.setAttribute("aria-checked","true"); LVL = def.dataset.lvl; if(def.dataset.price) $("#c_dex").value = NUM.format(+def.dataset.price); }
}
function tween(el, from, to){
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){ el.textContent = f(to); return; }
  const t0 = performance.now(), d = 450;
  const step = t => { const k = Math.min(1,(t-t0)/d), e = 1-Math.pow(1-k,3); el.textContent = f(from+(to-from)*e); if(k<1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function seg(w, bg, op, title){ return `<i style="width:${w}%;background:${bg};opacity:${op}" title="${esc(title)}"></i>`; }
const pctTxt = x => Math.abs(x).toFixed(1).replace(".",",") + " %";
function updateCalc(){
  const v = readCalc(), r = compute(v);
  const hero = $("#o_hero"), fg = "var(--band-fg)", tp = "var(--brass)";
  let shown;
  if(!v.hasDex){
    hero.classList.remove("neg");
    $("#o_hero_l").textContent = "Coste real de un director el primer año";
    shown = r.hireY1;
    $("#o_pct").textContent = "Si ya tienes tu propuesta DEX, añade la cuota para ver la diferencia.";
  } else {
    const neg = r.save < 0; hero.classList.toggle("neg", neg);
    $("#o_hero_l").textContent = neg ? "Con estos datos, un director en plantilla te sale más barato" : `Ahorro estimado el primer año con ${LVL || "DEX"}`;
    shown = neg ? 0 : rd(r.save);
    $("#o_pct").textContent = neg ? "Con un salario tan bajo, DEX no te ahorra dinero: cuéntanos tu caso en el café." : `Alrededor de un ${Math.round(r.pct)} % menos que un director en plantilla`;
  }
  tween($("#o_save"), lastShown, shown); lastShown = shown;
  $("#o_hA").textContent = f(r.hireAnnual); $("#o_h1").textContent = f(r.hireY1);
  const saveA = r.hireAnnual - r.dexAnnual;
  $("#o_d1").textContent = v.hasDex ? (saveA>0 ? "≈ "+f(rd(saveA)) : "—") : "Según propuesta";
  $("#o_diff").textContent = v.hasDex ? (r.save>0 ? "≈ "+f(rd(r.save)) : "—") : "—";
  const m = Math.max(r.hireY1, 1), p = x => x/m*100;
  $("#b_h1").innerHTML = seg(p(v.salario),fg,.95,"Salario")+seg(p(r.cotiz),fg,.7,"Cotizaciones")+seg(p(v.variable),fg,.5,"Variable")+seg(p(v.otros),fg,.32,"Otros")+seg(p(v.incorporacion),tp,.6,"Incorporación");
  $("#b_d1").innerHTML = v.hasDex ? seg(p(v.dex*12),tp,1,"Cuota DEX")+seg(p(v.dexOtros),tp,.75,"Otros DEX")+seg(p(v.implantacion),tp,.55,"Implantación") : "";
  $("#bv_h1").textContent = f(r.hireY1); $("#bv_d1").textContent = v.hasDex ? f(r.dexY1) : "—";
  $("#legend").innerHTML = `<span><i style="background:var(--band-fg)"></i>Salario, cotizaciones, variable y otros</span><span><i style="background:var(--brass);opacity:.6"></i>Selección e incorporación</span>`;
  $("#t_hi").textContent = f(v.incorporacion); $("#t_hr").textContent = f(r.hireAnnual); $("#t_h1").textContent = f(r.hireY1);
  $("#t_di").textContent = v.hasDex ? f(v.implantacion) : "—"; $("#t_dr").textContent = v.hasDex ? f(r.dexAnnual) : "—"; $("#t_d1").textContent = v.hasDex ? f(r.dexY1) : "—";
  $("#t_diff").textContent = !v.hasDex ? "Elige un nivel para compararlo" : r.save>0 ? `≈ ${f(rd(r.save))} el primer año con ${LVL || "DEX"}` : "Sin ahorro con estos datos";
  $("#calcCta").firstChild.textContent = v.hasDex ? `Hablar de ${LVL || "mi caso"} en un café ` : "Pedir mi propuesta en un café ";
}
function initCalc(){
  setDefaults(); renderLevels();
  const form = $("#calcForm");
  form.addEventListener("input", () => { if(!calcTracked){ calcTracked = true; track("calculator_used"); } updateCalc(); });
  form.addEventListener("focusout", e => { if(e.target.matches("input")) fmtField(e.target.id); });
  form.addEventListener("submit", e => e.preventDefault());
  $("#calcReset").addEventListener("click", ()=>{ setDefaults(); renderLevels(); updateCalc(); });
  updateCalc();
}
function renderCostStack(){
  if(!$("#costStack")) return;
  const d = CONFIG.calc, cot = (d.salario+d.variable)*d.cotizaciones/100;
  const parts = [["Salario bruto",d.salario,1],["Cotizaciones de empresa",cot,.75],["Variable o bonus",d.variable,.55],["Medios y otros gastos",d.otros,.4],["Selección e incorporación (año 1)",d.incorporacion,.25]];
  const tot = parts.reduce((a,p)=>a+p[1],0), max = Math.max(...parts.map(p=>p[1]));
  $("#costStack").innerHTML = parts.map(([l,v,o])=>`<div class="row"><span>${l}</span><span class="num">${f(v)}</span><div class="track"><div class="fill" style="width:${v/max*100}%;--o:${o}"></div></div></div>`).join("")
    + `<div class="row total"><span>Primer año, supuesto ilustrativo</span><span class="num">${f(tot)}</span></div><p class="note">Ejemplo con supuestos editables, no datos de mercado. Ajústalos en la calculadora.</p>`;
}

/* ===================== horario: siempre hora de Madrid ===================== */
function tzOffsetMin(date, tz){
  const p = new Intl.DateTimeFormat("en-US",{timeZone:tz,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).formatToParts(date);
  const g = t => +p.find(x=>x.type===t).value;
  return (Date.UTC(g("year"),g("month")-1,g("day"),g("hour"),g("minute"),g("second")) - date.getTime())/60000;
}
function wallToDate(y,m,d,hh,mm,tz){
  const guess = Date.UTC(y,m,d,hh,mm);
  let t = guess - tzOffsetMin(new Date(guess), tz)*60000;
  t = guess - tzOffsetMin(new Date(t), tz)*60000;
  return new Date(t);
}
function todayIn(tz){
  const p = new Intl.DateTimeFormat("en-US",{timeZone:tz,year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
  const g = t => +p.find(x=>x.type===t).value; return { y:g("year"), m:g("month")-1, d:g("day") };
}
const LOCAL_TZ = (()=>{ try{ return Intl.DateTimeFormat().resolvedOptions().timeZone || ""; }catch(e){ return ""; } })();
const hm = (date, tz) => new Intl.DateTimeFormat("es-ES",{timeZone:tz,hour:"2-digit",minute:"2-digit"}).format(date);

/* ===================== formulario + reserva ===================== */
const formStart = Date.now();
let LEAD = null;
function setErr(id, msg){ const inp = $("#l_"+id), e = $("#e_"+id); if(e) e.textContent = msg||""; if(inp){ inp.setAttribute("aria-invalid", msg?"true":"false"); if(msg) inp.setAttribute("aria-describedby","e_"+id); else inp.removeAttribute("aria-describedby"); } }
function validate(){
  const v = id => $("#l_"+id).value.trim(); let first = null;
  const rules = [
    ["name", v("name").length>=3 ? "" : "Escribe tu nombre y apellidos."],
    ["clinic", v("clinic").length>=2 ? "" : "Indica el nombre de la clínica."],
    ["contact", (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("contact")) || /^[+\d][\d\s().-]{7,}$/.test(v("contact"))) ? "" : "Escribe un teléfono (600 000 000) o un correo (nombre@clinica.es)."],
    ["priv", $("#l_priv").checked ? "" : "Necesitamos que aceptes la política de privacidad para responderte."]
  ];
  rules.forEach(([id,msg]) => { setErr(id,msg); if(msg && !first) first = id; });
  if(first) $("#l_"+first).focus();
  return !first;
}
function payload(){
  const fd = new FormData($("#leadForm")); const o = {}; for(const [k,v] of fd) if(k!=="web") o[k] = typeof v==="string" ? v.trim() : v;
  if(PACK) o.nivel = PACK;
  if(FUGA) o.fugaEstimada = FUGA;
  if(o.contacto){ if(o.contacto.includes("@")) o.email = o.contacto; else o.telefono = o.contacto; delete o.contacto; }
  if(DIAG && DIAG.email && !o.email) o.email = DIAG.email;
  if(DIAG && DIAG_ON){ o.autodiagnostico = { id:DIAG.id, fecha:DIAG.fecha, puntuacion:DIAG.score, nivel:DIAG.nivel, prioridades:DIAG.prioridades, areas:DIAG.areas }; o.autodiagnosticoRespuestas = DIAG.respuestas; }
  const sen = painsChecked(); if(sen.length) o.senales = sen;
  o.origen = "web-dex"; o.fecha = new Date().toISOString(); return o;
}
function compose(o, citaTxt){
  return `Reserva de videollamada-café con DEX\n\n${citaTxt ? `Día y hora propuestos: ${citaTxt} (${CONFIG.booking.zona})\n\n` : "Prefiero que me llaméis para fijar la cita.\n\n"}Nombre: ${o.nombre}\nClínica: ${o.clinica}${o.email?`\nCorreo: ${o.email}`:""}${o.telefono?`\nTeléfono: ${o.telefono}`:""}${o.cargo?`\nCargo: ${o.cargo}`:""}${o.gabinetes?`\nGabinetes: ${o.gabinetes}`:""}${o.necesidad?`\nNecesidad principal: ${o.necesidad}`:""}${o.provincia?`\nProvincia: ${o.provincia}`:""}${o.nivel?`\nNivel de interés: ${o.nivel}`:""}${o.fugaEstimada?`\nFacturación que se escapa (estimación): ${o.fugaEstimada}`:""}${o.mensaje?`\n\nMensaje:\n${o.mensaje}`:""}${o.senales?`\n\nLo que nos ha marcado en «¿Te pasa esto?»:\n${o.senales.map(x=>"· "+x).join("\n")}`:""}${o.autodiagnostico?`\n\nFICHA DE LA CLÍNICA · Autodiagnóstico ${o.autodiagnostico.id}\nPuntuación: ${o.autodiagnostico.puntuacion}/100 · ${o.autodiagnostico.nivel}\nPrioridades: ${o.autodiagnostico.prioridades.join(", ")}\n${o.autodiagnostico.areas.map(a=>`· ${a.area}: ${a.estado} — ${a.respuesta}`).join("\n")}`:""}`;
}
/* Convierte cualquier envío en un correo legible: asunto, campos en español y la ficha del autodiagnóstico en texto. */
function mailFields(d){
  const o = { _captcha:"false", _template:"table" };
  const ad = d.autodiagnostico && typeof d.autodiagnostico === "object" ? d.autodiagnostico : null;
  if(d.tipo === "autodiagnostico"){
    o._subject = `Nuevo autodiagnóstico DEX · ${d.puntuacion}/100`;
    o["Tipo"] = "Autodiagnóstico enviado por correo (sin reserva todavía)";
    o["Correo"] = d.email; o._replyto = d.email;
    o["Código"] = d.autodiagnosticoId; o["Puntuación"] = `${d.puntuacion}/100 · ${d.nivel}`;
    o["Prioridades"] = (d.prioridades||[]).join(", ");
    o["Áreas"] = (d.areas||[]).map(a => `${a.area}: ${a.estado} — ${a.respuesta}`).join("\n");
    o["Quiere artículos mensuales"] = d.novedades ? "Sí" : "No";
    o["Datos del informe"] = JSON.stringify({ id:d.autodiagnosticoId, puntuacion:d.puntuacion, nivel:d.nivel, prioridades:d.prioridades, areas:(d.areas||[]).map(a => ({ area:a.area, valor:a.valor, estado:a.estado, respuesta:a.respuesta })) });
  } else {
    const previo = d.tipo === "lead";
    const cuando = d.cita ? d.cita : previo ? "Está eligiendo hora en la agenda de citas de Google Calendar" : "Prefiere que le llamemos para fijar la cita";
    o._subject = `${d.cita ? "Nueva reserva de café" : previo ? "Nuevo café: datos de la clínica" : "Petición de llamada"} · ${d.clinica || d.nombre}${d.cita ? " · " + d.cita : ""}`;
    o["Tipo"] = d.cita ? "Reserva de videollamada-café (30 min)" : previo ? "Datos previos a la reserva (la hora llega por Google Calendar)" : "Petición de llamada";
    o["Día y hora"] = cuando;
    o["Nombre"] = d.nombre; o["Clínica"] = d.clinica;
    if(d.telefono) o["Teléfono"] = d.telefono;
    if(d.email){ o["Correo"] = d.email; o._replyto = d.email; }
    [["cargo","Cargo"],["gabinetes","Gabinetes"],["necesidad","Necesidad principal"],["provincia","Provincia"],["nivel","Nivel de interés"],["mensaje","Mensaje"]].forEach(([k,l]) => { if(d[k]) o[l] = d[k]; });
    if(d.senales) o["Marcó en «¿Te pasa esto?»"] = d.senales.join(" · ");
    if(ad){
      o["Autodiagnóstico"] = `${ad.puntuacion}/100 · ${ad.nivel} · código ${ad.id}`;
      o["Prioridades"] = ad.prioridades.join(", ");
      o["Ficha de la clínica"] = ad.areas.map(a => `${a.area}: ${a.estado} — ${a.respuesta}`).join("\n");
    } else o["Autodiagnóstico"] = "No adjuntado";
  }
  o["Enviado desde"] = "Web DEX · " + new Date().toLocaleString("es-ES",{timeZone:"Europe/Madrid"});
  return o;
}
/* Nombres de campo de Netlify Forms (deben coincidir con los formularios ocultos del HTML). */
const NF_KEYS = { "Tipo":"tipo", "Día y hora":"dia_y_hora", "Nombre":"nombre", "Clínica":"clinica", "Teléfono":"telefono", "Correo":"correo",
  "Cargo":"cargo", "Gabinetes":"gabinetes", "Necesidad principal":"necesidad", "Provincia":"provincia", "Nivel de interés":"nivel_de_interes",
  "Mensaje":"mensaje", "Marcó en «¿Te pasa esto?»":"te_pasa_esto", "Autodiagnóstico":"autodiagnostico", "Prioridades":"prioridades",
  "Ficha de la clínica":"ficha_de_la_clinica", "Código":"codigo", "Puntuación":"puntuacion", "Áreas":"areas", "Enviado desde":"enviado_desde",
  "Quiere artículos mensuales":"novedades", "Datos del informe":"datos_informe" };
async function post(data){
  const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 12000), m = mailFields(data);
  try{
    let res;
    if(CONFIG.form.proveedor === "netlify"){
      if(location.protocol === "blob:" || /claude\.ai|claudeusercontent/.test(location.hostname)) throw new Error("vista previa");
      const b = new URLSearchParams({ "form-name": data.tipo === "autodiagnostico" ? "autodiagnostico" : "reserva", subject: m._subject });
      for(const [k,v] of Object.entries(m)) if(!k.startsWith("_") && NF_KEYS[k]) b.append(NF_KEYS[k], v);
      res = await fetch("/", { method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body: b.toString(), signal: ctl.signal });
      if(!res.ok) throw new Error("HTTP "+res.status);
    } else {
      res = await fetch(CONFIG.form.endpoint, { method:"POST", headers:{"Content-Type":"application/json","Accept":"application/json"}, body: JSON.stringify(m), signal: ctl.signal });
      if(!res.ok) throw new Error("HTTP "+res.status);
      const j = await res.json().catch(() => ({})); if(j && (j.success === false || j.success === "false")) throw new Error(j.message || "rechazado");
    }
  } finally { clearTimeout(tm); }
}
function initForm(){
  const form = $("#leadForm"), st = $("#formState"), btn = $("#leadSubmit");
  form.addEventListener("change", e => { if(e.target.id==="l_need") delete e.target.dataset.auto; });
  form.addEventListener("input", e => { const id = (e.target.id||"").replace("l_",""); if(e.target.getAttribute("aria-invalid")==="true") setErr(id,""); });
  form.addEventListener("submit", async e => {
    e.preventDefault(); st.innerHTML = "";
    if(!validate()) return;
    if($("#l_web").value || (Date.now()-formStart)/1000 < CONFIG.form.minSegundos){ st.innerHTML = `<div class="form-state bad"><p>No hemos podido procesar el envío. Espera unos segundos y vuelve a intentarlo.</p></div>`; return; }
    if(!CONFIG.booking.url && !PRE){ $("#quickMsg").innerHTML = `<b class="q-err">Elige un hueco para el café</b> o pulsa «Prefiero que me llaméis».`; $("#quick").scrollIntoView({behavior:"smooth", block:"center"}); return; }
    LEAD = payload(); track("form_submit",{necesidad:LEAD.necesidad||""});
    if(CONFIG.form.endpoint && CONFIG.booking.url){
      btn.disabled = true; const label = btn.innerHTML; btn.textContent = "Guardando tus datos…";
      try{ await post({tipo:"lead", ...LEAD}); track("form_success"); }
      catch(err){ track("form_error"); LEAD._noEnviado = true; }
      btn.disabled = false; btn.innerHTML = label;
    }
    if(CONFIG.booking.url){ openBooking(); return; }
    const days = $("#quick")._days || [];
    if(PRE && PRE.call){ showResult(); finishBooking(null); return; }
    if(PRE && days[PRE.d] && slotsFor(days[PRE.d]).includes(PRE.t)){ showResult(); finishBooking(PRE.txt, days[PRE.d], PRE.t); return; }
    PRE = null;
    $("#quickMsg").innerHTML = `<b class="q-err">Elige un hueco para el café</b> o pulsa «Prefiero que me llaméis».`;
    $("#quick").scrollIntoView({behavior:"smooth", block:"center"});
  });
}

const CUP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3c0 1.5 1 1.5 1 3M12 3c0 1.5 1 1.5 1 3"/></svg>';
const dFmt = new Intl.DateTimeFormat("es-ES",{weekday:"long", day:"numeric", month:"long", timeZone:"UTC"});
const wFmt = new Intl.DateTimeFormat("es-ES",{weekday:"short", timeZone:"UTC"});
const mFmt = new Intl.DateTimeFormat("es-ES",{month:"short", timeZone:"UTC"});
function bookingDays(){
  const B = CONFIG.booking, t = todayIn(B.tz), out = [];
  let ms = Date.UTC(t.y, t.m, t.d + B.antelacionDias);
  while(out.length < B.diasVista){ const dt = new Date(ms); if(B.dias.includes(dt.getUTCDay())) out.push({ y:dt.getUTCFullYear(), m:dt.getUTCMonth(), d:dt.getUTCDate(), date:dt }); ms += 864e5; }
  return out;
}
function slotsFor(day){
  const now = Date.now(), tz = CONFIG.booking.tz;
  return CONFIG.booking.franjas.filter(t => { const [hh,mm] = t.split(":").map(Number); return wallToDate(day.y,day.m,day.d,hh,mm,tz).getTime() > now + 2*3600e3; });
}
function localHint(day, time){
  const tz = CONFIG.booking.tz; if(!LOCAL_TZ || LOCAL_TZ===tz) return "";
  const [hh,mm] = time.split(":").map(Number); const dt = wallToDate(day.y,day.m,day.d,hh,mm,tz);
  const loc = hm(dt, LOCAL_TZ); return loc !== time ? ` (${loc} en tu hora local)` : "";
}
function bkHead(){
  const B = CONFIG.booking;
  return `<div class="bk-head"><span class="cup">${CUP}</span><div><h3>${esc(B.titulo)}</h3><div class="bk-meta"><span>${B.duracionMin} min</span><span>Videollamada</span><span>${esc(B.zona)}</span></div></div></div>`;
}
function fallbackChannels(msg){
  const C = CONFIG.contacto;
  return `<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="copy" data-copy="${esc(msg)}">Copiar mensaje</button><a class="copy" style="text-decoration:none" href="mailto:${esc(C.email)}?subject=${encodeURIComponent("Café con DEX · "+LEAD.clinica)}&body=${encodeURIComponent(msg)}">Abrir en mi correo</a>${C.whatsapp?`<a class="copy" style="text-decoration:none" target="_blank" rel="noopener" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}">Enviar por WhatsApp</a>`:""}</div>`;
}
let PRE = null;
function setStep(){}
function renderQuickSlots(){
  const q = $("#quick"); if(!q) return;
  if(CONFIG.booking.url){
    q.hidden = false; q.classList.add("agenda-real");
    $("#quickLbl").textContent = "Cómo se reserva";
    $("#quickSlots").innerHTML = `<ol class="steps-real"><li><b>Tus datos</b><span>Y tu autodiagnóstico, si lo hiciste.</span></li><li><b>Eliges día y hora</b><span>En la agenda real de Jose: solo verás huecos libres.</span></li><li><b>Recibes la invitación</b><span>Con el enlace de Google Meet y un recordatorio.</span></li></ol>`;
    $("#leadLbl").textContent = "Continuar y elegir hora";
    return;
  }
  const days = bookingDays().filter(d => slotsFor(d).length); if(!days.length) return;
  q.hidden = false;
  let more = false, selDay = 0;
  const lab = d => `${wFmt.format(d.date).replace(".","")} ${d.d} ${mFmt.format(d.date).replace(".","")}`;
  const isSel = (di,t) => PRE && !PRE.call && PRE.d===di && PRE.t===t;
  const msg = () => {
    const lbl = $("#leadLbl");
    if(!PRE){ $("#quickMsg").textContent = ""; lbl.textContent = "Reservar mi café"; return; }
    if(PRE.call){ $("#quickMsg").textContent = "Te llamaremos para fijar el día y la hora."; lbl.textContent = "Pedir que me llaméis"; return; }
    $("#quickMsg").innerHTML = `Has elegido el <b>${esc(PRE.txt)}</b>${esc(localHint(days[PRE.d], PRE.t))}.`;
    lbl.textContent = `Reservar mi café · ${lab(days[PRE.d])}, ${PRE.t}`;
  };
  const draw = () => {
    const chips = days.slice(0,3).map((d,i) => { const ts = slotsFor(d), t = ts[Math.min(ts.length-1, Math.floor(i*ts.length/3))]; return `<button type="button" class="qs" aria-pressed="${isSel(i,t)}" data-qd="${i}" data-qt="${t}"><small>${esc(lab(d))}</small><b>${t}</b></button>`; }).join("");
    let html = `<div class="quick-slots">${chips}<button type="button" class="qs qs-more" id="qsMore" aria-expanded="${more}">${more ? "Ocultar días" : "Ver más huecos"}</button></div>`;
    if(more){
      const d = days[selDay];
      html += `<div class="more-pick"><div class="days" role="radiogroup" aria-label="Día">${days.map((x,i)=>`<button type="button" class="day" role="radio" aria-checked="${i===selDay}" data-pd="${i}" aria-label="${esc(dFmt.format(x.date))}"><small>${esc(wFmt.format(x.date).replace(".",""))}</small><b>${x.d}</b><small>${esc(mFmt.format(x.date).replace(".",""))}</small></button>`).join("")}</div>
        <div class="times" role="radiogroup" aria-label="Hora del ${esc(dFmt.format(d.date))}">${slotsFor(d).map(t=>`<button type="button" class="tm" role="radio" aria-checked="${isSel(selDay,t)}" data-qd="${selDay}" data-qt="${t}">${t}</button>`).join("")}</div></div>`;
    }
    html += `<button type="button" class="txtbtn qs-call" id="qsCall" aria-pressed="${!!(PRE && PRE.call)}">${PRE && PRE.call ? "Mejor elijo un hueco" : "Prefiero que me llaméis"}</button>`;
    $("#quickSlots").innerHTML = html; msg();
  };
  $("#quickSlots").addEventListener("click", e => {
    if(e.target.closest("#qsMore")){ more = !more; if(more && PRE && !PRE.call) selDay = PRE.d; draw(); return; }
    if(e.target.closest("#qsCall")){ PRE = (PRE && PRE.call) ? null : { call:true }; draw(); return; }
    const pd = e.target.closest("[data-pd]"); if(pd){ selDay = +pd.dataset.pd; draw(); return; }
    const b = e.target.closest("[data-qd]"); if(!b) return;
    const di = +b.dataset.qd, t = b.dataset.qt;
    PRE = { d:di, t, txt:`${dFmt.format(days[di].date)} a las ${t}` };
    track("booking_slot"); draw();
    const again = $(`#quickSlots [data-qd="${di}"][data-qt="${t}"]`); if(again) again.focus();
  });
  q._days = days;
  q._select = (di, t) => { PRE = { d:di, t, txt:`${dFmt.format(days[di].date)} a las ${t}` }; more = false; draw(); };
  draw();
}
function renderNextSlot(){
  const q = $("#quick"); if(!q || !q._days || !q._days.length) return;
  const d = q._days[0], t = slotsFor(d)[0]; if(!t) return;
  const lab = `${wFmt.format(d.date).replace(".","")} ${d.d} ${mFmt.format(d.date).replace(".","")}, ${t}`;
  const hero = $("#heroSlot"), bar = $("#mctaSlot");
  hero.innerHTML = `<span class="pulse" aria-hidden="true"></span>Próximo hueco libre: <b>${esc(lab)}</b>`;
  bar.innerHTML = `Próximo hueco: <b>${esc(lab)}</b>`;
  hero.hidden = false; bar.hidden = false;
  [$("#heroCta"), bar].forEach(a => a.addEventListener("click", () => { q._select(0, t); }));
}
function openBooking(){
  const box = $("#booking"), B = CONFIG.booking, first = esc(LEAD.nombre.split(" ")[0]);
  $("#leadForm").hidden = true; box.hidden = false; setStep(2); track("booking_open");
  document.body.classList.add("booking-open");
  if(B.url){
    const ad = LEAD.autodiagnostico && LEAD.autodiagnostico.id;
    box.innerHTML = bkHead() + `<div class="form-state ok"><p><b>${LEAD._noEnviado ? "Último paso" : "Datos recibidos"}, ${first}.</b> Ahora elige el día y la hora aquí abajo, en la agenda de Jose. Solo verás huecos libres.</p></div>
      <ul class="bk-tips"><li>Usa el mismo correo${LEAD.email ? ` (<b>${esc(LEAD.email)}</b>)` : ""} para que juntemos tu reserva con tus datos.</li>${ad ? `<li>En «Código del autodiagnóstico» escribe <b style="user-select:all">${esc(ad)}</b>.</li>` : ""}</ul>
      <div class="bk-embed"><iframe src="${esc(B.url + (B.url.includes("?") ? "&" : "?") + "gv=true")}" title="Agenda de Jose Rodríguez Horrillo para reservar el café" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
      <p class="micro bk-ext">La agenda es de Google Calendar y puede usar sus propias cookies. ¿No se ve bien? <a href="${esc(B.url)}" target="_blank" rel="noopener" data-track="booking_external">Ábrela en una pestaña nueva</a>.</p>
      ${LEAD._noEnviado ? `<p class="micro">No hemos podido guardar tus datos desde la web, pero puedes reservar igualmente; los pediremos en la agenda.</p>` : ""}
      <div class="bk-alt"><button type="button" class="txtbtn" id="bkBack">Volver a mis datos</button></div>`;
  } else {
    const days = bookingDays().filter(d => slotsFor(d).length);
    let selDay = 0, selTime = null;
    if(PRE && days[PRE.d] && slotsFor(days[PRE.d]).includes(PRE.t)){ selDay = PRE.d; selTime = PRE.t; }
    const render = () => {
      const day = days[selDay], times = slotsFor(day);
      box.innerHTML = bkHead() + `<p>Gracias, ${first}. Elige el día y la hora que mejor te vengan. Las horas son de la península; en Canarias, una hora menos.</p>
        <div style="display:grid;gap:10px"><span class="bk-label" id="lblDay">Día</span>
          <div class="days" role="radiogroup" aria-labelledby="lblDay">${days.map((d,i)=>`<button type="button" class="day" role="radio" aria-checked="${i===selDay}" data-day="${i}" aria-label="${esc(dFmt.format(d.date))}"><small>${esc(wFmt.format(d.date).replace(".",""))}</small><b>${d.d}</b><small>${esc(mFmt.format(d.date).replace(".",""))}</small></button>`).join("")}</div></div>
        <div style="display:grid;gap:10px"><span class="bk-label" id="lblTime">Hora · ${esc(dFmt.format(day.date))}</span>
          <div class="times" role="radiogroup" aria-labelledby="lblTime">${times.map(t=>`<button type="button" class="tm" role="radio" aria-checked="${t===selTime}" data-time="${t}">${t}</button>`).join("")}</div></div>
        <div class="bk-sum"><p id="bkSel">${selTime ? `Has elegido el <b>${esc(dFmt.format(day.date))}</b> a las <b>${selTime}</b>${esc(localHint(day, selTime))}.` : "Selecciona una hora para continuar."}</p>
          <button type="button" class="btn" id="bkConfirm" ${selTime?"":"disabled"}>Reservar mi café <span class="arr" aria-hidden="true">→</span></button></div>
        <div class="bk-alt"><button type="button" class="txtbtn" id="bkCall">Prefiero que me llaméis</button><button type="button" class="txtbtn" id="bkBack">Volver a mis datos</button></div>`;
    };
    render();
    box.onclick = e => {
      const d = e.target.closest("[data-day]"), t = e.target.closest("[data-time]");
      if(d){ selDay = +d.dataset.day; selTime = null; render(); box.querySelector(`[data-day="${selDay}"]`).focus(); return; }
      if(t){ selTime = t.dataset.time; track("booking_slot"); render(); box.querySelector(`[data-time="${selTime}"]`).focus(); return; }
      if(e.target.closest("#bkConfirm") && selTime){ finishBooking(`${dFmt.format(days[selDay].date)} a las ${selTime}`, days[selDay], selTime); return; }
      if(e.target.closest("#bkCall")){ finishBooking(null); return; }
    };
  }
  box.addEventListener("click", e => { if(e.target.closest("#bkBack")){ box.hidden = true; $("#leadForm").hidden = false; if(!CONFIG.booking.url && $("#quick")._days) $("#quick").hidden = false; setStep(1); $("#l_name").focus(); } });
  box.focus({preventScroll:true});
  box.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth", block:"start"});
}
function showResult(){ $("#leadForm").hidden = true; $("#quick").hidden = true; const box = $("#booking"); box.hidden = false; box.focus({preventScroll:true}); }
document.addEventListener("click", e => { if(e.target.closest("#booking #bkBack") && !CONFIG.booking.url){ $("#booking").hidden = true; $("#leadForm").hidden = false; $("#quick").hidden = false; $("#l_name").focus(); } });
async function finishBooking(citaTxt, day, time){
  const box = $("#booking"), C = CONFIG.contacto, first = esc(LEAD.nombre.split(" ")[0]);
  let iso = null; if(day){ const [hh,mm] = time.split(":").map(Number); iso = wallToDate(day.y,day.m,day.d,hh,mm,CONFIG.booking.tz).toISOString(); }
  track("booking_confirm",{tipo: citaTxt ? "cita" : "llamada"});
  if(CONFIG.form.endpoint){
    box.innerHTML = bkHead() + `<div class="form-state"><p><b>Enviando tu reserva…</b></p></div>`;
    try{
      await post({tipo: citaTxt ? "cita" : "llamada", ...LEAD, cita: citaTxt, citaISO: iso, zona: CONFIG.booking.tz, duracionMin: CONFIG.booking.duracionMin});
      track("form_success"); setStep(3);
      box.innerHTML = bkHead() + `<div class="form-state ok"><p><b>${citaTxt ? `Solicitud enviada: ${esc(citaTxt)}.` : "Solicitud enviada."}</b></p><p>Gracias, ${first}. ${citaTxt ? "Te confirmaremos la cita y te enviaremos el enlace de la videollamada en menos de 24 horas laborables." : "Te llamaremos en menos de 24 horas laborables para fijar el día y la hora."}</p>${LEAD.autodiagnostico ? `<p>Tu autodiagnóstico va con la solicitud: lo revisaremos antes del café.</p>` : ""}</div>`;
      return;
    }catch(err){ track("form_error"); /* si el envío falla, pasamos al envío manual: la solicitud no se pierde */ }
  }
  const msg = compose(LEAD, citaTxt);
  setStep(3);
  box.innerHTML = bkHead() + `<div class="form-state ok"><p><b>${citaTxt ? `Ya casi está: ${esc(citaTxt)}.` : "Ya casi está."}</b> Para confirmar ${citaTxt ? "tu café" : "que te llamemos"}, envíanos este mensaje a <b style="user-select:all">${esc(C.email)}</b> o llámanos al <b style="user-select:all">${esc(C.telefono)}</b>.</p>
    <pre>${esc(msg)}</pre>${fallbackChannels(msg)}</div>
    <div class="bk-alt"><button type="button" class="txtbtn" id="bkBack">Volver a mis datos</button></div>`;
}

/* ===================== diálogos (vídeo y legales) ===================== */
function openVideo(id){
  const v = CONFIG.media.videos[id]; if(!v || !v.src) return; const d = $("#dlgVideo");
  $("#dv-t").textContent = v.titulo;
  $("#dv-body").innerHTML = `<video controls playsinline preload="metadata" ${v.poster?`poster="${esc(v.poster)}"`:""} style="width:100%;border-radius:var(--r)"><source src="${esc(v.src)}"></video>`;
  d.showModal(); track("video_open",{id});
}
document.addEventListener("click", e => {
  const pv = e.target.closest("[data-video]"); if(pv){ openVideo(pv.dataset.video); return; }
  const od = e.target.closest("[data-dialog]"); if(od){ $("#"+od.dataset.dialog).showModal(); return; }
  const cl = e.target.closest("[data-close]"); if(cl){ const d = cl.closest("dialog"); d.querySelectorAll("video").forEach(v=>v.pause()); d.close(); return; }
  if(e.target.tagName==="DIALOG"){ e.target.querySelectorAll("video").forEach(v=>v.pause()); e.target.close(); }
});

/* ===================== navegación, tema, sticky ===================== */
function initNav(){
  const btn = $("#menuBtn"), mm = $("#mobileMenu");
  const set = open => { mm.hidden = !open; btn.setAttribute("aria-expanded", open); btn.setAttribute("aria-label", open?"Cerrar menú":"Abrir menú"); };
  btn.addEventListener("click", () => set(mm.hidden));
  mm.addEventListener("click", e => { if(e.target.closest("a")) set(false); });
  document.addEventListener("keydown", e => { if(e.key==="Escape" && !mm.hidden){ set(false); btn.focus(); } });
  const header = $("header.top");
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, {passive:true}); onScroll();
  if("IntersectionObserver" in window){
    const links = $$(".nav ul a");
    const io = new IntersectionObserver(es => es.forEach(en => { if(en.isIntersecting){ const id = en.target.id; links.forEach(a => a.setAttribute("aria-current", /(^|\/)#/.test(a.getAttribute("href")||"") && a.getAttribute("href").endsWith("#"+id) ? "true":"false")); } }), {rootMargin:"-45% 0px -50% 0px"});
    ["servicios"].forEach(id => { const el = document.getElementById(id); if(el) io.observe(el); });
    const m = $("#mcta"); let pastHero = false, atContact = false;
    const upd = () => m.classList.toggle("on", pastHero && !atContact);
    /* En la portada, la barra aparece al pasar el hero; en las demás páginas, al pasar la cabecera de la página. */
    const heroEl = $("#home:not([hidden]) #inicio") || $(".page:not([hidden]) .page-head") || $("#inicio");
    if(heroEl) new IntersectionObserver(([en]) => { pastHero = !en.isIntersecting; upd(); }).observe(heroEl);
    if($("#contacto")) new IntersectionObserver(([en]) => { atContact = en.isIntersecting; upd(); }, {rootMargin:"0px 0px -20% 0px"}).observe($("#contacto"));
  }
}
function initTheme(){
  const root = document.documentElement, b = $("#themeBtn");
  if(!b){ try{ localStorage.removeItem("dex-theme"); }catch(e){} return; }  /* sin selector: la web sigue el tema del sistema */
  const label = () => b.textContent = { light:"Tema: claro", dark:"Tema: oscuro" }[root.dataset.theme] || "Tema: sistema";
  const saved = store.get("dex-theme"); if(saved==="light"||saved==="dark") root.dataset.theme = saved;
  b.addEventListener("click", () => {
    const next = root.dataset.theme==="light" ? "dark" : root.dataset.theme==="dark" ? "" : "light";
    if(next) root.dataset.theme = next; else delete root.dataset.theme;
    store.set("dex-theme", next||"system"); label();
  });
  label();
}


/* ===================== páginas de apoyo (Método, Inversión, Preguntas) ===================== */
function initMiniCalc(){
  const inp = $("#mini_sal"); if(!inp) return;
  inp.value = NUM.format(CONFIG.calc.salario);
  const upd = () => {
    let n = parseFloat(String(inp.value).replace(/[\s€]/g,"").replace(/\./g,"").replace(",", ".")); if(!isFinite(n) || n < 0) n = 0;
    const d = CONFIG.calc; const r = compute({salario:n, cotizaciones:d.cotizaciones, variable:d.variable, otros:d.otros, incorporacion:d.incorporacion, dex:0, dexOtros:0, implantacion:0});
    $("#mini_out").textContent = f(r.hireY1); return n;
  };
  inp.addEventListener("input", () => { upd(); if(!calcTracked){ calcTracked = true; track("calculator_used",{tipo:"mini"}); } });
  inp.addEventListener("blur", () => { const n = upd(); inp.value = n ? NUM.format(n) : ""; });
  $("#miniMore").addEventListener("click", () => { const n = upd(); if(n){ $("#c_sal").value = NUM.format(n); updateCalc(); } });
  upd();
}
/* Rutas: en la web publicada cada página tiene su URL (/metodo/, /blog/…); en la vista previa se usan anclas (#metodo). */
const REAL_PATHS = /^https?:$/.test(location.protocol) && !/claude\.ai|claudeusercontent/.test(location.hostname);
function route(){
  const hash = decodeURIComponent(location.hash.slice(1));
  const path = location.pathname.replace(/^\/+|\/+$/g, "");
  const pages = $$("[data-page]"), ALL = window.DEX_PAGES || pages.map(pg => pg.dataset.page), isPage = k => ALL.includes(k);
  if(REAL_PATHS && hash && isPage(hash)){ location.replace("/" + hash + "/"); return; }   /* enlaces antiguos /#metodo → /metodo/ */
  const h = isPage(hash) ? hash : path, page = pages.find(pg => pg.dataset.page === h);
  pages.forEach(pg => pg.hidden = pg !== page);
  $("#home").hidden = !!page;
  $$(".nav ul a, .mobile-menu a").forEach(a => { const href = a.getAttribute("href"); a.setAttribute("aria-current", page && (href === "#"+h || href === "/"+h+"/") ? "true" : "false"); });
  if(page){ if(!hash || isPage(hash)) scrollTo(0,0); track("page_view",{page:h}); return; }
  if(hash){ const el = document.getElementById(hash); if(el) requestAnimationFrame(() => el.scrollIntoView()); }
}
addEventListener("hashchange", route);

/* ¿Te pasa esto? */
function initPains(){
  const box = $("#pains"); if(!box) return;
  const res = $("#painResult");
  box.addEventListener("change", () => {
    const n = $$(".pain-cb:checked", box).length;
    $$(".pain", box).forEach(l => l.classList.toggle("on", l.querySelector("input").checked));
    const show = n >= 2; if(show && res.hidden) track("pains_match",{n});
    res.hidden = !show;
  });
}

/* ===================== autodiagnóstico ===================== */
let DIAG = null;
function initDiag(){
  const root = $("#diag"), map = $("#diagMap"); if(!root) return;
  const Q = CONFIG.diagnostico, ans = []; let i = 0, done = false;
  const L = ["A","B","C","D"];
  const status = v => v <= 1 ? ["Prioridad","st-imp"] : v === 2 ? ["Mejorable","st-est"] : ["En buen camino","st-ok"];
  const drawMap = () => {
    map.innerHTML = Q.map((q,k) => { const st = done ? status(ans[k]) : null; const cls = done ? "done" : k===i ? "cur" : ans[k]!==undefined ? "done" : "";
      return `<li class="${cls}"><button type="button" data-go="${k}" ${(!done && ans[k]===undefined && k!==i) ? "disabled" : ""}><span class="dm-n">${k+1}</span><span class="dm-a">${esc(q.area)}</span>${st?`<em class="${st[1]}">${st[0]}</em>`:""}</button></li>`; }).join("");
  };
  const ask = focus => {
    done = false; const q = Q[i];
    root.innerHTML = `<div class="dq-top"><span>Pregunta ${i+1} de ${Q.length}</span><span>${esc(q.area)}</span></div>
      <div class="dq-bar" aria-hidden="true"><i style="width:${i/Q.length*100}%"></i></div>
      <h2 class="dq-q" tabindex="-1">${esc(q.q)}</h2>
      <div class="dq-ops" role="group" aria-label="Respuestas">${q.ops.map((o,k)=>`<button type="button" class="dq-op${ans[i]===k?" on":""}" data-k="${k}"><span class="dq-k">${L[k]}</span><span>${esc(o)}</span></button>`).join("")}</div>
      <div class="dq-nav">${i>0?`<button type="button" class="txtbtn" id="dqBack">← Anterior</button>`:"<span></span>"}<span class="dq-hint">Elige la que más se parece a tu clínica hoy · teclas A–D</span></div>`;
    drawMap(); if(focus) root.querySelector(".dq-q").focus({preventScroll:true});
  };
  const nextSlotTxt = () => { const q = $("#quick"); if(!q || !q._days || !q._days.length) return null; const d = q._days[0], t = slotsFor(d)[0]; return t ? { t, lab:`${wFmt.format(d.date).replace(".","")} ${d.d} ${mFmt.format(d.date).replace(".","")}, ${t}` } : null; };
  const result = () => {
    done = true;
    const sum = ans.reduce((a,b)=>a+b,0), score = Math.round(sum/(Q.length*3)*100);
    const lvl = score < 40 ? "Dirección a base de urgencias" : score < 70 ? "Una base con mucho recorrido" : "Una clínica bien encaminada";
    const lvlTxt = score < 40 ? "Hay mucho margen, y eso es una buena noticia: las primeras mejoras se notan pronto." : score < 70 ? "Tienes cimientos. Ordenando dos o tres áreas, la clínica puede dar un salto claro." : "Vas por delante de muchas clínicas. El reto es sostenerlo y medirlo cada mes.";
    const order = Q.map((q,k)=>({q, v:ans[k]})).sort((a,b)=>a.v-b.v);
    let pri = order.filter(x=>x.v<=1).slice(0,3); if(!pri.length) pri = order.slice(0,2);
    DIAG = { id: "AD-"+Date.now().toString(36).toUpperCase(), fecha: new Date().toISOString(), score, nivel: lvl, prioridades: pri.map(x=>x.q.area),
      areas: Q.map((q,k)=>({ area:q.area, pregunta:q.q, respuesta:q.ops[ans[k]], valor:ans[k], estado:status(ans[k])[0] })),
      respuestas: Q.map((q,k)=>`${q.area}: ${q.ops[ans[k]]} (${status(ans[k])[0]})`) };
    saveDiag(); renderDiagAttach();
    track("diag_done",{score});
    const C = 2*Math.PI*52, ns = nextSlotTxt();
    root.innerHTML = `<div class="dr-head"><div class="dr-ring"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" fill="none" stroke="var(--paper-2)" stroke-width="10"/><circle cx="60" cy="60" r="52" fill="none" stroke="var(--brass)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C*score/100} ${C}" transform="rotate(-90 60 60)"/></svg><div><b>${score}</b><span>de 100</span></div></div>
        <div><p class="eyebrow">Tu resultado orientativo</p><h2 tabindex="-1">${esc(lvl)}</h2><p class="dr-sub">${esc(lvlTxt)}</p></div></div>
      <div class="dr-areas">${Q.map((q,k)=>{ const [t,c] = status(ans[k]); return `<div class="dr-row"><span class="dr-name">${esc(q.area)}</span><span class="dr-track" aria-hidden="true"><i style="width:${(ans[k]+1)/4*100}%"></i></span><em class="${c}">${t}</em></div>`; }).join("")}</div>
      <div class="dr-pri"><p class="eyebrow">Por dónde empezaríamos</p><ol>${pri.map(x=>{ const r = CONFIG.lecturas[x.q.area]; return `<li><b>${esc(x.q.area)}.</b> ${esc(x.q.gana)}${r ? ` <a class="link dr-read" href="${REAL_PATHS ? "/" + r[0] + "/" : "#" + r[0]}" data-track="diag_read">Lee: ${esc(r[1])} →</a>` : ""}</li>`; }).join("")}</ol></div>
      <div class="dr-cta"><a class="btn btn-2l" id="dqBook" href="/#contacto" data-track="cta_diag_result"><span class="b-main">Revisarlo en un café de 30 min <span class="arr" aria-hidden="true">→</span></span>${ns?`<span class="b-sub"><span class="pulse" aria-hidden="true"></span>Próximo hueco libre: <b>${esc(ns.lab)}</b></span>`:""}</a>
        <button type="button" class="txtbtn" id="dqAgain">Repetir el autodiagnóstico</button></div>
      <form class="dr-send" id="drSend" novalidate>
        <div class="ds-txt"><p class="ds-t">¿Aún no quieres llamar? Recibe tu informe completo por correo.</p><p class="ds-s">Tu puntuación, tus prioridades, qué hacer este mes en cada una y qué leer para empezar.</p></div>
        <div class="ds-row"><label class="sr" for="ds_email">Tu correo electrónico</label><input id="ds_email" type="email" autocomplete="email" placeholder="nombre@clinica.es" required><button class="btn" type="submit">Enviármelo</button></div>
        <label class="check ds-check" for="ds_priv"><input id="ds_priv" type="checkbox" required><span>Acepto la <button type="button" class="inline-link" data-dialog="dlgPrivacy">política de privacidad</button>.</span></label>
        <label class="check ds-check ds-check2" for="ds_news"><input id="ds_news" type="checkbox"><span>Además, quiero recibir dos correos de seguimiento sobre mis prioridades y un artículo práctico al mes. Puedo darme de baja con un clic.</span></label>
        <p class="err" id="ds_err" role="alert"></p>
      </form>
      <p class="micro">Si reservas, puedes adjuntar tus respuestas a la solicitud para preparar el café. Guardamos el resultado solo en este navegador durante ${DIAG_DIAS} días. <button type="button" class="inline-link" id="dqForget">Borrarlo</button></p>`;
    drawMap(); root.querySelector("h2").focus({preventScroll:true});
    root.scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth", block:"start"});
    initDiagSend(score, lvl, pri);
    const bk = $("#dqBook"); if(bk && ns) bk.addEventListener("click", () => { const q = $("#quick"); if(q && q._select) q._select(0, ns.t); });
  };
  const choose = k => { ans[i] = k; if(i===0) track("diag_start"); if(i < Q.length-1){ i++; ask(true); } else result(); };
  root.addEventListener("click", e => {
    const op = e.target.closest(".dq-op"); if(op){ choose(+op.dataset.k); return; }
    if(e.target.closest("#dqBack")){ i = Math.max(0,i-1); ask(true); return; }
    if(e.target.closest("#dqForget")){ DIAG = null; saveDiag(); renderDiagAttach(); e.target.closest("p").textContent = "Resultado borrado de este navegador."; return; }
    if(e.target.closest("#dqAgain")){ ans.length = 0; i = 0; DIAG = null; saveDiag(); renderDiagAttach(); ask(true); }
  });
  map.addEventListener("click", e => { const b = e.target.closest("[data-go]"); if(!b || b.disabled) return; i = +b.dataset.go; ask(true); });
  document.addEventListener("keydown", e => {
    if(root.closest("[data-page]").hidden || done || e.target.closest("input,textarea,select") || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = "abcd".indexOf(e.key.toLowerCase()); const n = "1234".indexOf(e.key); const idx = k>=0 ? k : n;
    if(idx>=0 && idx < Q[i].ops.length){ e.preventDefault(); choose(idx); }
  });
  ask(false);
}

/* ===================== lo que se escapa ===================== */
let FUGA = null;
function initLeak(){
  const form = $("#leakForm"); if(!form) return;
  const F = CONFIG.fuga, ids = {lk_h:F.huecosSemana, lk_v:F.valorHora, lk_p:F.presupuestosMes, lk_i:F.importeMedio};
  const num = id => { const n = parseFloat(String($("#"+id).value).replace(/[\s€]/g,"").replace(/\./g,"").replace(",", ".")); return isFinite(n) && n > 0 ? n : 0; };
  Object.entries(ids).forEach(([id,v]) => $("#"+id).value = NUM.format(v));
  let last = 0, used = false;
  const upd = () => {
    const h = num("lk_h")*num("lk_v")*F.semanasAnio, pr = num("lk_p")*num("lk_i")*12, tot = h + pr;
    tween($("#lk_total"), last, tot); last = tot;
    $("#lk_th").textContent = f(h); $("#lk_tp").textContent = f(pr);
    $("#lk_bh").style.width = tot ? (h/tot*100)+"%" : "0"; $("#lk_bp").style.width = tot ? (pr/tot*100)+"%" : "0";
    $("#lk_rec").innerHTML = tot ? `Recuperando solo un ${F.recuperable} %, serían <b>${f(tot*F.recuperable/100)}</b> más al año.` : "Introduce tus datos para ver la estimación.";
    FUGA = tot ? f(tot) + " al año (huecos " + f(h) + ", presupuestos " + f(pr) + ")" : null;
  };
  form.addEventListener("input", () => { if(!used){ used = true; track("leak_used"); } upd(); });
  form.addEventListener("focusout", e => { if(e.target.matches("input")){ const n = num(e.target.id); e.target.value = n ? NUM.format(n) : ""; } });
  form.addEventListener("submit", e => e.preventDefault());
  upd();
}

function diagReport(score, lvl, pri){
  const Q = CONFIG.diagnostico;
  return `Tu autodiagnóstico DEX\n\nPuntuación orientativa: ${score}/100 · ${lvl}\n\nPor dónde empezaríamos:\n${pri.map((x,k)=>`${k+1}. ${x.q.area}: ${x.q.gana}`).join("\n")}\n\nTus respuestas:\n${DIAG.respuestas.map(r=>"· "+r).join("\n")}\n\nResultado orientativo basado solo en tus respuestas. Si quieres revisarlo con nosotros, reserva un café de 30 minutos, sin compromiso.\n\nDEX · Dirección externa para clínicas dentales\n${CONFIG.contacto.email} · ${CONFIG.contacto.telefono}`;
}
function initDiagSend(score, lvl, pri){
  const form = $("#drSend"); if(!form) return;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const em = $("#ds_email").value.trim(), err = $("#ds_err");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){ err.textContent = "Escribe un correo válido, por ejemplo nombre@clinica.es."; $("#ds_email").focus(); return; }
    if(!$("#ds_priv").checked){ err.textContent = "Acepta la política de privacidad para enviarte el resultado."; return; }
    err.textContent = "";
    const news = !!($("#ds_news") && $("#ds_news").checked);
    DIAG.email = em; saveDiag();
    const lc = $("#l_contact"); if(lc && !lc.value) lc.value = em;
    track("diag_email");
    const body = diagReport(score, lvl, pri);
    if(CONFIG.form.endpoint) post({tipo:"autodiagnostico", autodiagnosticoId:DIAG.id, email:em, areas:DIAG.areas, puntuacion:score, nivel:lvl, prioridades:DIAG.prioridades, respuestas:DIAG.respuestas, novedades:news, origen:"web-dex", fecha:new Date().toISOString()}).catch(() => {});
    form.innerHTML = `<div class="ds-ok">${CONFIG.form.informeAuto ? `<p><b>Te lo hemos enviado a ${esc(em)}.</b> Si no lo ves en unos minutos, mira en la carpeta de spam o de promociones. También puedes copiarlo aquí:</p>` : `<p><b>Tu resultado está listo.</b> Ábrelo en tu correo para guardarlo en <b>${esc(em)}</b>, o cópialo.</p>`}
      <pre>${esc(body)}</pre>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><a class="copy" style="text-decoration:none" href="mailto:${esc(em)}?subject=${encodeURIComponent("Tu autodiagnóstico DEX · "+score+"/100")}&body=${encodeURIComponent(body)}">Abrir en mi correo</a><button type="button" class="copy" data-copy="${esc(body)}">Copiar resultado</button></div></div>`;
  });
}

function initAreaGroups(){
  $$(".ag-toggle").forEach(b => b.addEventListener("click", () => { const g = b.closest(".agroup"), open = !g.classList.contains("open"); g.classList.toggle("open", open); b.setAttribute("aria-expanded", open); b.textContent = open ? "Ocultar áreas" : "Ver áreas"; }));
}
document.documentElement.lang = "es";

/* ===================== autodiagnóstico adjunto a la solicitud ===================== */
const DIAG_KEY = "dex_autodiagnostico", DIAG_DIAS = 60;
let DIAG_ON = true;
function saveDiag(){ try{ if(DIAG) localStorage.setItem(DIAG_KEY, JSON.stringify(DIAG)); else localStorage.removeItem(DIAG_KEY); }catch(e){} }
function loadDiag(){
  try{ const d = JSON.parse(localStorage.getItem(DIAG_KEY)||"null");
    if(d && d.areas && (Date.now()-Date.parse(d.fecha))/864e5 < DIAG_DIAS) DIAG = d; else localStorage.removeItem(DIAG_KEY);
  }catch(e){}
}
function painsChecked(){ return $$(".pain-cb:checked").map(cb => cb.closest(".pain").querySelector(".pain-h").textContent.trim()); }
const NEED_MAP = { "Diagnóstico y datos":"Ordenar la dirección y los objetivos", "Objetivos y cuadro de mando":"Ordenar la dirección y los objetivos",
  "Equipo y organización":"Organizar el equipo y los protocolos", "Protocolos por puesto":"Organizar el equipo y los protocolos",
  "Primeras visitas y presupuestos":"Mejorar la conversión de presupuestos", "Experiencia del paciente":"Experiencia del paciente",
  "Costes, caja y herramientas":"Controlar costes y rentabilidad" };
function syncDiagForm(){
  /* El autodiagnóstico personaliza la reserva: qué revisaremos en el café y la necesidad principal (si no la ha elegido). */
  const li = $("#cafeFirst"), need = $("#l_need"), on = DIAG && DIAG_ON;
  if(li) li.innerHTML = on ? `Revisamos tu autodiagnóstico (<b>${DIAG.score}/100</b>) y tus prioridades: ${esc(DIAG.prioridades.join(", "))}.` : "Nos cuentas cómo funciona hoy tu clínica.";
  if(need){
    if(on && (!need.value || need.dataset.auto)){ const v = DIAG.prioridades.map(a => NEED_MAP[a]).find(Boolean); if(v){ need.value = v; need.dataset.auto = "1"; } }
    else if(!on && need.dataset.auto){ need.value = ""; delete need.dataset.auto; }
  }
}
function renderDiagAttach(){
  const box = $("#diagAttach"); if(!box) return;
  syncDiagForm();
  if(!DIAG){ box.hidden = true; box.innerHTML = ""; return; }
  box.hidden = false;
  const fecha = new Date(DIAG.fecha).toLocaleDateString("es-ES",{day:"numeric",month:"long"});
  box.innerHTML = `<label class="da-top"><input type="checkbox" id="daOn" ${DIAG_ON?"checked":""}><span class="da-txt"><b>Adjuntar mi autodiagnóstico</b><span>${DIAG.score}/100 · ${esc(DIAG.nivel)} · hecho el ${esc(fecha)}</span></span></label>
    <details class="da-more"><summary>Ver lo que se envía</summary>
      <ul>${DIAG.areas.map(a=>`<li><span>${esc(a.area)}</span><em class="${a.valor<=1?"st-imp":a.valor===2?"st-est":"st-ok"}">${esc(a.estado)}</em></li>`).join("")}</ul>
      <p>Lo usamos para preparar el café con la foto de partida de tu clínica.</p></details>`;
  box.classList.toggle("off", !DIAG_ON);
  $("#daOn").addEventListener("change", e => { DIAG_ON = e.target.checked; box.classList.toggle("off", !DIAG_ON); syncDiagForm(); track("diag_attach",{on:DIAG_ON}); });
}

/* ===================== textos legales ===================== */
/* Todo sale de CONFIG.empresa, CONFIG.contacto y CONFIG.legal. Lo que falte se muestra como [pendiente] resaltado. */
const PD = (v, lab) => v ? esc(v) : `<span class="pend">[${esc(lab)}]</span>`;
function legalData(){
  const E = CONFIG.empresa, C = CONFIG.contacto, L = CONFIG.legal;
  return { E, C, L,
    titular: esc(E.razonSocial),
    nif: PD(E.nif, "NIF pendiente"),
    dom: PD(E.domicilio, "domicilio social pendiente"),
    reg: PD(E.registro, "datos del Registro Mercantil pendientes"),
    web: PD(L.dominio, "dominio pendiente"),
    mailPriv: esc(L.emailPrivacidad || C.email),
    fecha: esc(L.actualizado) };
}
function idTable(d, conTelefono = true){
  return `<div class="post-table lg-id" role="region" aria-label="Datos del titular" tabindex="0"><table><tbody>
    <tr><th scope="row">Titular</th><td>${d.titular}</td></tr>
    <tr><th scope="row">NIF</th><td>${d.nif}</td></tr>
    <tr><th scope="row">Domicilio social</th><td>${d.dom}</td></tr>
    <tr><th scope="row">Registro</th><td>${d.reg}</td></tr>
    <tr><th scope="row">Correo</th><td><a href="mailto:${esc(d.C.email)}">${esc(d.C.email)}</a></td></tr>
    ${conTelefono ? `<tr><th scope="row">Teléfono</th><td>${esc(d.C.telefono)}</td></tr>` : ""}
    <tr><th scope="row">Sitio web</th><td>${d.web}</td></tr>
  </tbody></table></div>`;
}
function avisoLegalHTML(){
  const d = legalData(), L = d.L;
  return `<p class="post-lead">Este aviso legal regula el acceso y el uso de este sitio web. Al navegar por él aceptas estas condiciones.</p>
  <h3>1. Datos identificativos</h3>
  <p>En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), estos son los datos del titular del sitio web:</p>
  ${idTable(d, false)}
  <p>Actividad: servicios de dirección y gestión externa para clínicas dentales.</p>
  <h3>2. Objeto y condiciones de uso</h3>
  <p>Este sitio web informa sobre los servicios de ${d.titular} (en adelante, DEX) y permite reservar una videollamada, hacer un autodiagnóstico orientativo y contactar con nosotros. Te comprometes a usarlo de forma lícita, a no dañar su funcionamiento y a facilitar datos veraces en los formularios. Eres responsable de la información que nos envías.</p>
  <h3>3. Información, simulaciones y precios</h3>
  <ul>
    <li>El autodiagnóstico, la calculadora de costes y el resto de simulaciones son <b>orientativos</b>. Se basan solo en los datos que introduces y en supuestos generales, y no sustituyen un análisis de tu clínica.</li>
    <li>Los precios publicados son cuotas mensuales en euros <b>sin IVA</b>, salvo que se indique otra cosa, y pueden cambiar sin previo aviso.</li>
    <li>Nada de lo publicado constituye una oferta vinculante. La contratación de los servicios de DEX se formaliza siempre mediante un contrato o propuesta firmada por ambas partes, que es la que fija las condiciones.</li>
    <li>Los artículos del blog son divulgativos. Recogen buenas prácticas generales de gestión y no constituyen asesoramiento profesional para un caso concreto.</li>
  </ul>
  <h3>4. Propiedad intelectual e industrial</h3>
  <p>Los textos, el diseño, la marca y el logotipo DEX, el método de trabajo descrito, los informes de ejemplo y el resto de contenidos de esta web pertenecen a DEX o a terceros que han autorizado su uso${L.marcaOEPM ? ` (marca registrada en la Oficina Española de Patentes y Marcas con el número ${esc(L.marcaOEPM)})` : ""}. Puedes consultarlos para tu uso personal. No está permitido reproducirlos, distribuirlos, transformarlos ni comunicarlos públicamente, total o parcialmente, sin autorización escrita de DEX.</p>
  <h3>5. Enlaces</h3>
  <p>Esta web puede incluir enlaces a sitios de terceros. DEX no controla esos sitios y no responde de sus contenidos ni de sus políticas. Si quieres enlazar a esta web, el enlace debe llevar a la página principal o a una página concreta, sin reproducir su contenido ni sugerir una relación con DEX que no exista.</p>
  <h3>6. Responsabilidad</h3>
  <p>DEX procura que la información de esta web sea correcta y esté actualizada, pero no garantiza la ausencia de errores ni la disponibilidad continua del sitio. DEX no responde de los daños derivados de interrupciones técnicas, virus o del uso de la información sin el asesoramiento correspondiente, salvo en los casos en que la ley no permita limitar la responsabilidad.</p>
  <h3>7. Protección de datos y cookies</h3>
  <p>El tratamiento de tus datos personales se explica en la <a href="/privacidad/">política de privacidad</a>, y el uso de cookies y almacenamiento en el navegador, en la <a href="/cookies/">política de cookies</a>.</p>
  <h3>8. Modificaciones</h3>
  <p>DEX puede modificar en cualquier momento los contenidos de la web y este aviso legal. La versión vigente es la publicada en cada momento.</p>
  <h3>9. Legislación aplicable y jurisdicción</h3>
  <p>Este aviso legal se rige por la legislación española. Para cualquier controversia con usuarios que actúen como empresarios o profesionales, las partes se someten a los juzgados y tribunales de ${PD(L.jurisdiccion, "ciudad del domicilio social pendiente")}. Si actúas como consumidor, serán competentes los juzgados que correspondan según la normativa de consumidores.</p>
  <p class="lg-date">Última actualización: ${d.fecha}.</p>`;
}
function privacidadHTML(){
  const d = legalData(), L = d.L;
  const A = CONFIG.analytics.enabled;
  const prov = L.proveedores.concat(A ? [{ servicio:"Analítica de visitas sin cookies", nombre:"Umami Software, Inc. (Umami Cloud)", ubicacion: L.ubicacionUmami }] : []).map(p => `<tr><td><b>${esc(p.servicio)}</b></td><td>${PD(p.nombre, "proveedor pendiente")}</td><td>${PD(p.ubicacion, "pendiente")}</td></tr>`).join("");
  return `<p class="post-lead">En DEX solo pedimos los datos que necesitamos para atender tu solicitud y preparar bien la conversación. Aquí te explicamos qué hacemos con ellos, de forma clara.</p>
  <h3>1. Responsable del tratamiento</h3>
  ${idTable(d)}
  <p>Para cualquier asunto de privacidad, escríbenos a <a href="mailto:${d.mailPriv}">${d.mailPriv}</a>. ${L.dpd ? `Delegado de protección de datos: ${esc(L.dpd)}.` : "DEX no está obligada a designar un delegado de protección de datos."}</p>
  <h3>2. Qué datos tratamos</h3>
  <ul>
    <li><b>Al reservar el café:</b> nombre y apellidos, nombre de la clínica, teléfono o correo y el día y la hora que eliges. Si quieres, también cargo, número de gabinetes, principal necesidad, provincia, un mensaje y el nivel de servicio que te interesa.</li>
    <li><b>Si adjuntas tu autodiagnóstico:</b> tus respuestas a las 8 preguntas, la puntuación orientativa, las áreas prioritarias y las casillas que hayas marcado en «¿Te pasa esto?». Puedes desmarcar la casilla «Adjuntar mi autodiagnóstico» antes de enviar.</li>
    <li><b>Si pides el informe del autodiagnóstico por correo:</b> tu correo electrónico, tus respuestas y el resultado. Si además marcas la casilla de artículos mensuales, guardamos tu correo para enviártelos.</li>
    <li><b>Si nos escribes o nos llamas</b> por correo, teléfono${CONFIG.contacto.whatsapp ? " o WhatsApp" : ""}: los datos de contacto y lo que nos cuentes.</li>
    <li><b>Si contratas:</b> los datos de la clínica y de sus responsables necesarios para el contrato y la facturación.</li>
  </ul>
  <p class="lg-note"><b>Importante:</b> no incluyas datos de pacientes ni datos de salud en los formularios ni en los mensajes. No los necesitamos para preparar el café.</p>
  <h3>3. Para qué los usamos y con qué base legal</h3>
  <div class="post-table" role="region" aria-label="Finalidades y bases legales" tabindex="0"><table>
    <thead><tr><th>Finalidad</th><th>Base legal</th></tr></thead>
    <tbody>
      <tr><td>Gestionar tu reserva o tu petición de llamada, confirmarte la cita y preparar la reunión.</td><td>Aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD).</td></tr>
      <tr><td>Usar tu autodiagnóstico adjunto y los datos opcionales para conocer la situación de partida de tu clínica.</td><td>Tu consentimiento (art. 6.1.a RGPD), que das al adjuntarlos y puedes retirar cuando quieras.</td></tr>
      <tr><td>Enviarte el informe del autodiagnóstico a tu correo.</td><td>Tu consentimiento (art. 6.1.a RGPD).</td></tr>
      <tr><td>Si lo marcas, enviarte dos correos de seguimiento sobre las prioridades de tu informe (a los 2 y a los 6 días) y un artículo práctico al mes sobre la gestión de clínicas dentales.</td><td>Tu consentimiento expreso (art. 6.1.a RGPD y art. 21 LSSI-CE). Puedes darte de baja en cualquier momento con el enlace que va en cada correo o escribiéndonos.</td></tr>
      ${A ? `<tr><td>Medir de forma agregada cuántas visitas recibe la web y qué páginas y botones se usan, para mejorarla. No te identifica.</td><td>Nuestro interés legítimo en mejorar la web (art. 6.1.f RGPD).</td></tr>` : ""}
      <tr><td>Responder a tus consultas por correo${CONFIG.contacto.whatsapp ? ", teléfono o WhatsApp" : " o teléfono"}.</td><td>Tu consentimiento y, si preguntas por nuestros servicios, medidas precontractuales (art. 6.1.a y 6.1.b RGPD).</td></tr>
      <tr><td>Si contratas: prestar el servicio, facturar y cumplir nuestras obligaciones fiscales y mercantiles.</td><td>Ejecución del contrato y cumplimiento de obligaciones legales (art. 6.1.b y 6.1.c RGPD).</td></tr>
    </tbody></table></div>
  <p><b>No te enviaremos comunicaciones comerciales</b> (boletines, ofertas o campañas) salvo que nos des tu consentimiento expreso para ello por separado, como exige el artículo 21 de la LSSI-CE: por ejemplo, marcando la casilla de artículos mensuales.</p>
  <h3>4. Datos obligatorios</h3>
  <p>En los formularios, los datos obligatorios son los que no llevan la indicación «opcional». Sin ellos no podemos gestionar tu solicitud. El resto los facilitas solo si quieres.</p>
  <h3>5. Cuánto tiempo los conservamos</h3>
  <ul>
    <li><b>Reservas, consultas y autodiagnósticos</b> que no terminan en contratación: ${esc(String(L.conservacionMeses))} meses desde el último contacto.</li>
    <li><b>Correos de seguimiento y artículos mensuales:</b> hasta que te des de baja.</li>
    <li><b>Clientes:</b> mientras dure el contrato y, después, durante los plazos legales: seis años para la documentación mercantil (art. 30 del Código de Comercio) y cuatro años para la tributaria (Ley General Tributaria).</li>
    <li>Pasados esos plazos, los datos se suprimen o se bloquean durante el tiempo en que puedan exigirse responsabilidades.</li>
  </ul>
  <h3>6. A quién se comunican</h3>
  <p>No vendemos ni cedemos tus datos a terceros, salvo obligación legal (por ejemplo, a la Agencia Tributaria o a jueces y tribunales). Para funcionar, DEX se apoya en proveedores que actúan como encargados del tratamiento, con contrato y solo siguiendo nuestras instrucciones:</p>
  <div class="post-table" role="region" aria-label="Encargados del tratamiento" tabindex="0"><table>
    <thead><tr><th>Servicio</th><th>Proveedor</th><th>Ubicación de los datos</th></tr></thead>
    <tbody>${prov}</tbody></table></div>
  ${CONFIG.contacto.whatsapp ? "<p>Si nos contactas por WhatsApp, Meta trata también esos datos según sus propias condiciones.</p>" : ""}
  <h3>7. Transferencias internacionales</h3>
  <p>Damos prioridad a proveedores que alojan los datos en la Unión Europea. Si alguno los trata fuera del Espacio Económico Europeo, solo lo hacemos con las garantías del RGPD: una decisión de adecuación de la Comisión Europea (como el Marco de Privacidad de Datos UE-EE. UU.) o cláusulas contractuales tipo.</p>
  <h3>8. El autodiagnóstico no toma decisiones por ti</h3>
  <p>El autodiagnóstico calcula una puntuación orientativa a partir de tus respuestas. No es una decisión automatizada con efectos jurídicos ni significativos sobre ti: sirve para orientar la conversación, y cualquier valoración sobre tu clínica la hace una persona.</p>
  <h3>9. Tus derechos</h3>
  <p>Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, y retirar los consentimientos que nos hayas dado, sin que eso afecte a lo tratado antes. Escríbenos a <a href="mailto:${d.mailPriv}">${d.mailPriv}</a> o por correo postal a ${d.dom}, indicando qué derecho quieres ejercer. Solo te pediremos un documento que acredite tu identidad si tenemos dudas razonables sobre ella.</p>
  <p>Si crees que no hemos tratado bien tus datos, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener">www.aepd.es</a>, C/ Jorge Juan 6, 28001 Madrid). Te agradeceremos que antes nos lo cuentes para intentar resolverlo.</p>
  <h3>10. Menores de edad</h3>
  <p>Esta web está dirigida a propietarios y profesionales de clínicas dentales. No recogemos de forma consciente datos de menores de 14 años.</p>
  <h3>11. Seguridad</h3>
  <p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a pérdidas, accesos no autorizados o alteraciones, incluida la conexión cifrada de la web.</p>
  <h3>12. Cambios en esta política</h3>
  <p>Si cambiamos esta política de forma relevante, lo indicaremos en esta página y, cuando haga falta, te pediremos de nuevo el consentimiento.</p>
  <p class="lg-date">Última actualización: ${d.fecha}.</p>`;
}
function cookiesHTML(){
  const d = legalData(), L = d.L, A = CONFIG.analytics.enabled;
  return `<p class="post-lead">Esta web <b>no usa cookies de publicidad ni de seguimiento</b>${A ? " ni de analítica: para contar las visitas usamos Umami, una herramienta que no usa cookies ni guarda nada en tu navegador" : " ni de analítica"}. Solo guarda en tu navegador lo imprescindible para que funcionen las opciones que tú eliges.</p>
  <h3>1. Qué son las cookies y el almacenamiento local</h3>
  <p>Las cookies y el almacenamiento local (<i>localStorage</i>) son pequeños archivos o datos que una web guarda en tu navegador. La ley (artículo 22.2 de la LSSI-CE) los trata igual, y exige tu consentimiento salvo que sean necesarios para un servicio que tú has pedido.</p>
  <h3>2. Qué guarda esta web</h3>
  <div class="post-table" role="region" aria-label="Datos guardados en tu navegador" tabindex="0"><table>
    <thead><tr><th>Nombre</th><th>Para qué</th><th>Tipo</th><th>Duración</th></tr></thead>
    <tbody>
      <tr><td><code>dex_autodiagnostico</code></td><td>Guardar el resultado de tu autodiagnóstico para que puedas adjuntarlo si reservas otro día. No sale de tu navegador salvo que lo adjuntes a una reserva.</td><td>Propia · funcional, solo si haces el autodiagnóstico</td><td>${esc(String(DIAG_DIAS))} días</td></tr>
    </tbody></table></div>
  <p>Ninguno de estos datos se usa para hacer un perfil de tu navegación ni se comparte con terceros.</p>
  <h3>3. Servicios de terceros</h3>
  <ul>
    ${L.fuentesPropias ? "" : `<li><b>Google Fonts</b> (Google Ireland Ltd.): carga las tipografías de la web. No instala cookies, pero tu navegador se conecta a sus servidores y les comunica tu dirección IP.</li>`}
    ${A ? `<li><b>Umami</b> (analítica de visitas): cuenta de forma agregada las páginas vistas y los clics en los botones principales, sin cookies, sin guardar nada en tu navegador y sin identificarte. Respeta la opción «No rastrear» de tu navegador.</li>` : ""}
    ${L.terceros.map(t => `<li><b>${esc(t.nombre)}</b>: ${esc(t.uso)}</li>`).join("")}
  </ul>
  <h3>4. Cómo borrarlos o gestionarlos</h3>
  <p>Puedes borrar ahora mismo todo lo que esta web guarda en tu navegador:</p>
  <p><button type="button" class="btn btn-ghost" id="lgClear">Borrar mis datos guardados en este navegador</button> <span class="lg-cleared" id="lgCleared" role="status"></span></p>
  <p>También puedes borrarlos o bloquearlos desde la configuración de tu navegador: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Chrome</a>, <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Safari</a>, <a href="https://support.mozilla.org/es/kb/Borrar%20cookies" target="_blank" rel="noopener">Firefox</a> o <a href="https://support.microsoft.com/es-es/microsoft-edge" target="_blank" rel="noopener">Edge</a>.</p>
  <h3>5. Cambios</h3>
  <p>Si en el futuro incorporamos ${A ? "" : "analítica con cookies o "}vídeos de otras plataformas, actualizaremos esta política y te pediremos el consentimiento antes de usar cualquier cookie que lo necesite, con la opción de rechazarla tan fácil como aceptarla.</p>
  <p>Más información sobre el tratamiento de tus datos en la <a href="/privacidad/">política de privacidad</a>.</p>
  <p class="lg-date">Última actualización: ${d.fecha}.</p>`;
}
function privacidadBasica(){
  const d = legalData();
  return `<p class="lg-first">Información básica sobre protección de datos</p>
  <div class="post-table" role="region" aria-label="Información básica" tabindex="0"><table><tbody>
    <tr><th scope="row">Responsable</th><td>${d.titular}</td></tr>
    <tr><th scope="row">Finalidad</th><td>Gestionar tu reserva o consulta y preparar la reunión. Si lo adjuntas, usar tu autodiagnóstico para conocer la situación de tu clínica.</td></tr>
    <tr><th scope="row">Legitimación</th><td>Medidas precontractuales a petición tuya y tu consentimiento.</td></tr>
    <tr><th scope="row">Destinatarios</th><td>No se ceden datos, salvo obligación legal. Proveedores que actúan como encargados del tratamiento.</td></tr>
    <tr><th scope="row">Derechos</th><td>Acceso, rectificación, supresión, oposición, limitación y portabilidad en ${d.mailPriv}.</td></tr>
  </tbody></table></div>
  <p><a class="link" href="/privacidad/" data-close>Leer la política de privacidad completa →</a></p>`;
}
function legalTexts(){
  const set = (id, html) => { const el = $(id); if(el) el.innerHTML = html; };
  set("#lg-aviso", avisoLegalHTML());
  set("#lg-privacidad", privacidadHTML());
  set("#lg-cookies", cookiesHTML());
  set("#dp-body", privacidadBasica());
  const b = $("#lgClear"); if(b) b.addEventListener("click", () => {
    try{ ["dex-theme", "dex-consent", DIAG_KEY].forEach(k => localStorage.removeItem(k)); }catch(e){}
    DIAG = null; renderDiagAttach(); delete document.documentElement.dataset.theme;
    $("#lgCleared").textContent = "Hecho. Esta web ya no guarda nada en tu navegador.";
  });
}
/* ===================== arranque ===================== */
/* Cada página publicada solo contiene sus propias secciones: si una función no encuentra la suya, se salta y el resto sigue. */
[renderIcons, renderCafeNotes, renderCalendar, renderPacks, initFAQ, renderTestimonials, renderMedia, renderContact, renderCostStack, renderCmpCards,
 initCalc, initMiniCalc, loadDiag, initForm, renderDiagAttach, renderQuickSlots, renderNextSlot, initPains, initDiag, initAreaGroups, legalTexts, initNav, initTheme, initWhatsApp, initAnalytics, route]
  .forEach(fn => { try{ fn(); }catch(e){ if(window.console) console.debug("DEX:", fn.name, e.message); } });
