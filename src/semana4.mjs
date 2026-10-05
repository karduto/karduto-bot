// semana4.mjs — calendario 26 oct – 3 nov 2026 (días 22 a 30). Primarios protagonistas, secundarios de acento.
// Pendientes del usuario (no se diseñan aquí): d29 carrusel "5 preguntas" (necesita preguntas reales), reels d24, d27 y d30.
import { K, ph, pill, feedPage, coverPhoto, infoSlide, checkSlide, applyTheme, sApertura, sUtilidad, sCierre } from "./content.mjs";
import { flag } from "./templates.mjs";

const label = (t, c = "#FDBB4A") => `<div style="font-weight:800;font-size:26px;letter-spacing:.12em;text-transform:uppercase;color:${c};">${t}</div>`;

// ---------- día 22 · lun 26 oct 10:00 · estático · ¿cuál eres tú? ----------
const col = (ltr, bg, ink, emoji, text) => `<div style="flex:1;background:${bg};border-radius:40px;padding:34px 22px 30px;text-align:center;box-shadow:0 18px 44px rgba(0,0,0,.35);">
  <div style="width:84px;height:84px;margin:0 auto;border-radius:50%;background:#fff;color:#030357;font-weight:800;font-size:50px;display:flex;align-items:center;justify-content:center;">${ltr}</div>
  <div style="font-size:120px;line-height:1.1;margin-top:20px;">${emoji}</div>
  <div style="font-weight:800;font-size:34px;line-height:1.2;color:${ink};margin-top:16px;">${text}</div></div>`;
const D22 = applyTheme(feedPage(`
  <div class="bg-azul"></div><div class="dots"></div>
  ${K("iso-white", "k-iso", "top:56px;left:70px;height:84px;")}
  <img src="${ph("f_amigas_celular.jpg")}" style="position:absolute;right:-30px;top:-30px;width:470px;height:470px;object-fit:cover;object-position:50% 30%;border-radius:50%;border:12px solid #56CBFF;box-shadow:0 24px 60px rgba(0,0,0,.45);">
  <div style="position:absolute;left:70px;top:190px;width:560px;"><div class="kicker" style="font-size:26px;">Elige tu perfil</div><div class="h1" style="font-size:70px;margin-top:14px;">¿Cuál eres tú cuando <span class="hl">envías plata</span>?</div></div>
  <div style="position:absolute;left:50px;right:50px;top:530px;display:flex;gap:22px;">
    ${col("A", "#56CBFF", "#030357", "📣", "El que avisa al grupo antes de transferir")}
    ${col("B", "#F66220", "#FFFFFF", "🙈", "El que espera que le pregunten")}
    ${col("C", "#AE25FD", "#FFFFFF", "📸", "El que manda captura de cada paso")}
  </div>
  <div style="position:absolute;left:70px;bottom:140px;">${pill("Etiqueta a tu C 👇", "#FDBB4A", "#030357", "font-size:36px;")}</div>
  <div class="foot"><span>@karduto</span><span>karduto.com</span></div>`), "celeste");

// ---------- día 23 · mar 27 oct 10:00 · carrusel 6 · el envío del mes en 4 pasos ----------
const phone = (inner, extra = "") => `<div style="zoom:1.3;width:480px;margin:0 auto;background:#030357;border:10px solid #0f0f7a;border-radius:60px;padding:36px 30px 30px;box-shadow:0 30px 70px rgba(0,0,0,.45);${extra}">${inner}</div>`;
const mock = {
  cotizar: phone(`<div style="display:flex;align-items:center;gap:12px;">${flag("CL", 54)}<span style="color:#fff;font-weight:800;font-size:34px;">→</span>${flag("VE", 54)}</div>
    <div style="color:rgba(255,255,255,.7);font-weight:600;font-size:22px;margin-top:22px;">Tú envías</div><div style="background:rgba(255,255,255,.12);border-radius:20px;padding:14px 18px;color:#fff;font-weight:800;font-size:38px;margin-top:6px;">100.000 CLP</div>
    <div style="color:rgba(255,255,255,.7);font-weight:600;font-size:22px;margin-top:20px;">Tu familia recibe</div><div style="background:#FDBB4A;border-radius:20px;padding:14px 18px;color:#030357;font-weight:800;font-size:34px;margin-top:6px;">El monto, a la vista</div>
    <div style="margin-top:22px;background:#4A37FE;color:#fff;font-weight:800;font-size:26px;text-align:center;padding:16px;border-radius:999px;">Continuar</div>`),
  transferir: phone(`<div style="color:#FDBB4A;font-weight:800;font-size:22px;letter-spacing:.1em;text-transform:uppercase;">Datos para transferir</div>
    ${[["Banco", "<img src=\"assets/logos/bancoestado.png\" style=\"height:32px;display:block;background:#fff;border-radius:8px;padding:5px 8px;\">"], ["Cuenta", "****1234"], ["Monto exacto", "$100.000"]].map(([a, b]) => `<div style="display:flex;justify-content:space-between;padding:16px 0;border-bottom:2px solid rgba(255,255,255,.14);font-size:27px;"><span style="color:rgba(255,255,255,.7);font-weight:600;">${a}</span><span style="color:#fff;font-weight:800;">${b}</span></div>`).join("")}
    <div style="margin-top:22px;color:rgba(255,255,255,.65);font-weight:500;font-size:20px;">Datos de ejemplo.</div>`),
  comprobante: phone(`<div style="color:#FDBB4A;font-weight:800;font-size:22px;letter-spacing:.1em;text-transform:uppercase;">Sube tus comprobantes</div>
    <div style="margin-top:18px;border:4px dashed rgba(255,255,255,.4);border-radius:28px;padding:30px 20px;text-align:center;color:#fff;font-weight:700;font-size:26px;">Arrastra o toca aquí</div>
    <div style="margin-top:12px;text-align:center;color:rgba(255,255,255,.75);font-weight:700;font-size:22px;">Formatos: JPG · JPEG · PDF</div>
    ${["comprobante-1.jpg", "comprobante-2.pdf"].map((f) => `<div style="margin-top:14px;display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.12);border-radius:20px;padding:14px 18px;"><div style="width:40px;height:40px;border-radius:50%;background:#3CE07A;color:#030357;font-weight:800;font-size:26px;display:flex;align-items:center;justify-content:center;">✓</div><div style="color:#fff;font-weight:700;font-size:24px;">${f}</div></div>`).join("")}`),
  estado: phone(`<div style="color:#FDBB4A;font-weight:800;font-size:22px;letter-spacing:.1em;text-transform:uppercase;">Estado de tu envío</div>
    ${[["Inicio", true], ["En proceso", true], ["Finalizado", false]].map(([a, on], i) => `<div style="display:flex;align-items:center;gap:16px;margin-top:20px;"><div style="width:48px;height:48px;border-radius:50%;background:${on ? (i === 1 ? "#FDBB4A" : "#3CE07A") : "rgba(255,255,255,.18)"};color:#030357;font-weight:800;font-size:28px;display:flex;align-items:center;justify-content:center;">${on ? "✓" : ""}</div><div style="font-weight:${on ? 800 : 600};font-size:30px;color:${on ? "#fff" : "rgba(255,255,255,.55)"};">${a}</div></div>`).join("")}`),
};
const stepPhone = ({ n, total, step, title, text, screen }) => feedPage(`
  <div class="bg-grad"></div><div class="dots"></div>${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;top:130px;"><div class="numbadge">${step}</div></div>
  <div style="position:absolute;left:96px;right:96px;top:262px;"><div class="h2" style="font-size:62px;">${title}</div><div class="lead" style="margin-top:14px;font-size:34px;">${text}</div></div>
  <div style="position:absolute;left:0;right:0;top:610px;">${screen}</div>
  <div class="foot"><span>${n} de ${total}</span><span>Capturas de ejemplo</span></div>`);
const CN = {"CL,VE":"Chile → Venezuela","CL,PE":"Chile → Perú","CL,CO":"Chile → Colombia","PE,VE":"Perú → Venezuela","CO,VE":"Colombia → Venezuela"};
const corr = (a, b) => `<div style="display:flex;align-items:center;gap:22px;background:rgba(255,255,255,.14);border-radius:30px;padding:18px 26px;"><div style="display:flex;align-items:center;gap:10px;">${flag(a, 62)}<span style="color:#fff;font-weight:800;font-size:34px;">→</span>${flag(b, 62)}</div><div style="font-weight:800;font-size:38px;color:#fff;">${CN[a + "," + b]}</div></div>`;
const D23 = (() => {
  const T = 6;
  return [
    coverPhoto({ photo: "f_mujer_sueldo.jpg", pos: "50% 25%", chipText: "LLEGÓ EL SUELDO", h1: `Tu envío del mes <span class="hl">en 4 pasos</span>`, lead: "Cotizar, transferir, subir el comprobante y seguir el estado." }),
    stepPhone({ n: 1, total: T, step: 1, title: `<span class="hl">Cotiza</span>`, text: "Elige el corredor, escribe el monto y mira cuánto recibe tu familia.", screen: mock.cotizar }),
    stepPhone({ n: 2, total: T, step: 2, title: `<span class="hl">Transfiere</span>`, text: "Haz la transferencia por el monto exacto de tu solicitud.", screen: mock.transferir }),
    stepPhone({ n: 3, total: T, step: 3, title: `Sube tu <span class="hl">comprobante</span>`, text: "Puedes subir varios comprobantes. Aceptamos imágenes JPG, JPEG y archivos PDF.", screen: mock.comprobante }),
    stepPhone({ n: 4, total: T, step: 4, title: `Sigue el <span class="hl">estado</span>`, text: "Inicio, En proceso y Finalizado, siempre a la vista.", screen: mock.estado }),
    feedPage(`
  <div class="bg-azul"></div><div class="dots"></div>${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;right:96px;top:170px;"><div class="kicker" style="font-size:28px;">Corredores disponibles</div><div class="h2" style="font-size:62px;margin-top:14px;">Elige el tuyo y <span class="hl">cotiza</span></div><div class="lead" style="font-size:30px;margin-top:12px;">¡Y tenemos más corredores! Revisa nuestra página web.</div></div>
  <div style="position:absolute;left:96px;right:96px;top:440px;display:flex;flex-direction:column;gap:10px;">${corr("CL", "VE")}${corr("CL", "PE")}${corr("CL", "CO")}${corr("PE", "VE")}${corr("CO", "VE")}<div style="text-align:center;font-weight:800;font-size:34px;color:#FDBB4A;margin-top:6px;">+ más corredores en karduto.com</div></div>
  <div style="position:absolute;left:96px;bottom:120px;">${pill("Cotiza en karduto.com", "#FDBB4A", "#030357", "font-size:34px;")}<div class="tiny" style="margin-top:14px;">Link en la bio</div></div>
  <div class="foot"><span>6 de ${T}</span><span>karduto.com</span></div>`),
  ].map((h) => applyTheme(h, "mango"));
})();

// ---------- día 25 · jue 29 oct 10:00 · estático · calendario fin de semana largo ----------
const day = (d, n, open, hrs, note, hl) => `<div style="flex:1;background:${open ? (hl ? "#FDBB4A" : "rgba(255,255,255,.14)") : "rgba(3,3,87,.6)"};${open ? "" : "border:3px solid rgba(255,255,255,.3);"}border-radius:34px;padding:28px 14px;text-align:center;">
  <div style="font-weight:800;font-size:28px;letter-spacing:.1em;text-transform:uppercase;color:${hl ? "#030357" : "#FDBB4A"};">${d}</div>
  <div style="font-weight:800;font-size:78px;line-height:1.05;color:${hl ? "#030357" : "#fff"};">${n}</div>
  <div style="margin:14px auto 0;width:58px;height:58px;border-radius:50%;background:${open ? (hl ? "#030357" : "#FDBB4A") : "#F92257"};color:${open ? (hl ? "#FDBB4A" : "#030357") : "#fff"};font-weight:800;font-size:36px;display:flex;align-items:center;justify-content:center;">${open ? "✓" : "✕"}</div>
  <div style="font-weight:800;font-size:26px;line-height:1.2;color:${hl ? "#030357" : "#fff"};margin-top:14px;">${hrs}</div>
  <div style="font-weight:600;font-size:21px;line-height:1.2;color:${hl ? "#030357" : "rgba(255,255,255,.8)"};margin-top:8px;min-height:50px;">${note}</div></div>`;
const D25 = applyTheme(feedPage(`
  <div class="bg-grad"></div><div class="dots"></div>
  ${K("iso-white", "k-iso", "top:56px;left:70px;height:84px;")}
  <img src="${ph("f_mujer_mayor_celular.jpg")}" style="position:absolute;right:64px;top:50px;width:230px;height:230px;object-fit:cover;object-position:50% 25%;border-radius:50%;border:8px solid #fff;box-shadow:0 14px 34px rgba(0,0,0,.4);">
  <div style="position:absolute;left:70px;right:330px;top:170px;"><div class="kicker" style="font-size:24px;">30 oct al 2 nov</div><div class="h1" style="font-size:58px;margin-top:10px;">Fin de semana largo: <span class="hl">atendemos el sábado 31</span></div></div>
  <div style="position:absolute;left:46px;right:46px;top:450px;display:flex;gap:14px;">
    ${day("Vie", "30", true, "8:30 – 20:00", "")}${day("Sáb", "31", true, "8:30 – 16:00", "Feriado: abierto", true)}${day("Dom", "1", false, "Cerrado", "Como todo domingo")}${day("Lun", "2", true, "8:30 – 20:00", "Festivo en Colombia: abierto")}
  </div>
  <div style="position:absolute;left:70px;right:70px;top:1010px;"><div class="lead" style="font-size:32px;">Lo ingresado fuera de horario se procesa el siguiente día operativo.</div></div>
  <div style="position:absolute;left:70px;bottom:150px;">${pill("Cotiza en karduto.com", "#FDBB4A", "#030357", "font-size:34px;")}</div>
  <div class="foot"><span>@karduto</span><span>Link en la bio</span></div>`), "mango");

// ---------- día 26 · vie 30 oct 10:00 · carrusel 5 · checklist ----------
const rev = (a, b) => [
  { l: "Revisa", t: a, bg: "rgba(255,255,255,.14)", label: "#FDBB4A", ink: "#fff" },
  { l: "Por qué importa", t: b, bg: "#fff", label: "#4A37FE", ink: "#030357" },
];
const D26 = (() => {
  const T = 5;
  return [
    coverPhoto({ photo: "f_mujer_cafe_checklist.jpg", pos: "50% 25%", chipText: "FIN DE SEMANA LARGO", h1: `Checklist antes del finde largo: <span class="hl">envía hoy sin sorpresas</span>`, lead: "4 chequeos y listo." }),
    infoSlide({ n: 1, total: T, title: `Monto <span class="hl">exacto</span>`, cards: rev("Que el monto transferido sea el de tu solicitud.", "Un monto distinto detiene el envío.") }),
    infoSlide({ n: 2, total: T, title: `Datos del <span class="hl">destinatario</span>`, color: "azul", cards: rev("Cuenta o teléfono y cédula, dígito por dígito.", "Un número mal escrito hace que el pago vuelva.") }),
    infoSlide({ n: 3, total: T, title: `Comprobante <span class="hl">completo</span>`, cards: rev("Monto, fecha y destino visibles. Puedes subir varios comprobantes.", "Un comprobante recortado o duplicado se rechaza.") }),
    checkSlide({ photo: "", kicker: "Antes del cierre", title: `Tu check <span class="hl">de hoy</span>`, items: ["Monto exacto", "Datos del destinatario", "Comprobante completo", "Horario de hoy: hasta las 20:00"], cta: "Envía antes del cierre", ctaSub: "Cotiza en karduto.com · link en la bio", n: 5, total: T }),
  ].map((h) => applyTheme(h, "mango"));
})();

// ---------- día 28 · dom 1 nov 10:00 · estático emocional ----------
const D28 = applyTheme(feedPage(`
  <img class="photo" src="${ph("f_madre_hija_mercado.jpg")}" style="object-position:50% 40%;">
  <div class="photo-tint"></div><div class="photo-scrim"></div>
  ${K("iso-white", "k-iso", "top:56px;left:70px;height:84px;")}
  <div style="position:absolute;left:80px;right:80px;bottom:250px;">
    <div class="h1" style="font-size:76px;">Lo que mandas <span class="hl">no es plata</span>.</div>
    <div class="lead" style="margin-top:24px;color:#fff;font-size:40px;">Es el mercado de la semana, la matrícula, el remedio.</div>
  </div>
  <div style="position:absolute;left:80px;bottom:140px;">${pill("Envía confianza. Recibe tranquilidad.", "#FDBB4A", "#030357", "font-size:32px;")}</div>
  <div class="foot"><span>@karduto</span><span>Foto: Pixabay</span></div>`), "mango");

export const FEED = [
  { date: "2026-10-26", at: "10:00", id: "d22", type: "estatico", slides: [D22] },
  { date: "2026-10-27", at: "10:00", id: "d23", type: "carrusel", slides: D23 },
  { date: "2026-10-29", at: "10:00", id: "d25", type: "estatico", slides: [D25] },
  { date: "2026-10-30", at: "10:00", id: "d26", type: "carrusel", slides: D26 },
  { date: "2026-11-01", at: "10:00", id: "d28", type: "estatico", slides: [D28] },
];

// ---------- historias regulares 26 oct – 3 nov ----------
const ap = (date, th, o) => ({ date, at: "08:35", id: "ap", html: applyTheme(sApertura(o), th) });
const ut = (date, at, th, o) => ({ date, at, id: "ut", html: applyTheme(sUtilidad(o), th) });
const ci = (date, at, th, o) => ({ date, at, id: "ci", html: applyTheme(sCierre(o), th) });
const REC = { kicker: "Recordatorio", big: "20:00", h: `Atendemos hasta las 20:00`, sub: "Lo que ingreses después pasa al siguiente día operativo, desde las 8:30." };
const REC2 = { kicker: "Recordatorio", big: "20:00", h: `Hoy atendemos hasta las 20:00`, sub: "Cotiza en karduto.com cuando quieras.", cta: "IR A KARDUTO.COM" };
export const STORIES = [
  // lun 26
  ap("2026-10-26", "celeste", { photo: "s_mujer_rizos_rie.jpg", pos: "50% 22%", kicker: "Lunes · ya estamos atendiendo", h: `Semana de más envíos: <span class="hl">planifica</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-10-26", "15:00", "celeste", { kicker: "Antes de enviar", h: `Envía <span class="hl">con calma</span>`, icon: "🧘", items: ["Revisa el monto exacto", "Revisa los datos del destinatario", "Ten listo tu comprobante"], cta: "COTIZAR AHORA" }),
  ci("2026-10-26", "19:00", "celeste", REC),
  // mar 27
  ap("2026-10-27", "mango", { photo: "s_mujer_rizos_lentes.jpg", pos: "50% 22%", kicker: "Martes · ya estamos atendiendo", h: `Llegó el sueldo: <span class="hl">tu envío del mes</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-10-27", "15:00", "mango", { kicker: "Tu envío del mes", h: `En <span class="hl">4 pasos</span>`, bg: "s-bg-morado", icon: "💸", items: ["Cotiza y mira cuánto recibe tu familia", "Transfiere el monto exacto", "Sube tu comprobante y sigue el estado"], cta: "HACER UN ENVÍO" }),
  ci("2026-10-27", "19:00", "mango", REC2),
  // mié 28
  ap("2026-10-28", "calabaza", { photo: "s_hombre_sueter_rojo.jpg", pos: "50% 25%", kicker: "Miércoles · ya estamos atendiendo", h: `¿Te rechazaron un envío? <span class="hl">Respira</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-10-28", "15:00", "calabaza", { kicker: "Si te rechazan un envío", h: `Esto es lo que <span class="hl">pasa ahora</span>`, icon: "🛠️", items: ["Te llega un correo con lo que corregir", "Entras a tus transacciones y corriges", "Vuelve a Inicio y sigue su camino"], cta: "REVISAR MI ENVÍO" }),
  ci("2026-10-28", "19:00", "calabaza", REC),
  // jue 29
  ap("2026-10-29", "celeste", { photo: "s_hombre_rizos_lentes.jpg", pos: "50% 25%", kicker: "Jueves · ya estamos atendiendo", h: `Fin de semana largo: <span class="hl">atendemos el sábado</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-10-29", "15:00", "celeste", { kicker: "30 oct al 2 nov", h: `Así atendemos <span class="hl">el finde largo</span>`, icon: "🗓️", items: ["Vie 30: 8:30 a 20:00", "Sáb 31 (feriado): 8:30 a 16:00", "Dom 1: cerrado · Lun 2: abierto"], cta: "COTIZAR AHORA" }),
  ci("2026-10-29", "19:00", "celeste", REC),
  // vie 30
  ap("2026-10-30", "mango", { photo: "s_mujer_cafe_cel.jpg", pos: "50% 22%", kicker: "Viernes · ya estamos atendiendo", h: `Envía hoy <span class="hl">sin sorpresas</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-10-30", "15:00", "mango", { kicker: "Checklist", h: `Antes del <span class="hl">fin de semana largo</span>`, bg: "s-bg-morado", icon: "✅", items: ["Monto exacto", "Datos del destinatario", "Comprobante completo"], cta: "ENVIAR HOY" }),
  ci("2026-10-30", "19:00", "mango", { kicker: "Fin de semana largo", emoji: "📅", h: `Mañana sábado 31, feriado, atendemos hasta las 16:00`, sub: "El domingo no operamos. El lunes 2 abrimos desde las 8:30." }),
  // sáb 31
  ap("2026-10-31", "calabaza", { photo: "s_mujer_mesa_sonrie.jpg", pos: "50% 25%", kicker: "Sábado feriado · ya estamos atendiendo", h: `Feriado y <span class="hl">atendemos hasta las 16:00</span>`, sub: "Hoy atendemos de 8:30 a 16:00." }),
  ut("2026-10-31", "12:30", "calabaza", { kicker: "Feliz Halloween", h: `Que el único susto <span class="hl">sea el disfraz</span>`, icon: "🎃", items: ["Revisa el monto exacto", "Revisa los datos del destinatario", "Sube un comprobante legible"], cta: "COTIZAR AHORA" }),
  ci("2026-10-31", "15:00", "calabaza", { kicker: "Última hora", big: "16:00", h: `Hoy atendemos hasta las 16:00`, sub: "Lo que ingreses después pasa al siguiente día operativo.", emoji: "⏳" }),
  // dom 1 nov
  { date: "2026-11-01", at: "10:00", id: "dom", html: applyTheme(sCierre({ kicker: "Domingo", emoji: "🌙", h: `Hoy no operamos`, sub: "Mañana lunes 2 volvemos desde las 8:30." }), "celeste") },
  // lun 2 nov
  ap("2026-11-02", "mango", { photo: "s_hombre_boleta.jpg", pos: "50% 22%", kicker: "Lunes · ya estamos atendiendo", h: `Lunes 2: <span class="hl">atendemos con normalidad</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-11-02", "15:00", "mango", { kicker: "Tus dudas, resueltas", h: `Lo que más <span class="hl">nos preguntan</span>`, bg: "s-bg-morado", icon: "❓", items: ["Estados: Inicio, En proceso y Finalizado", "Horario: lun a vie 8:30 a 20:00", "Si hay rechazo, te avisamos por correo"], cta: "IR A KARDUTO.COM" }),
  ci("2026-11-02", "19:00", "mango", REC),
  // mar 3 nov
  ap("2026-11-03", "celeste", { photo: "s_mujer_abrigo.jpg", pos: "50% 22%", kicker: "Martes · ya estamos atendiendo", h: `3 razones para <span class="hl">probar Karduto</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-11-03", "15:00", "celeste", { kicker: "Pruébalo este mes", h: `Tres razones <span class="hl">para enviar</span>`, icon: "👍", items: ["Ves el monto antes de pagar", "Ves el estado de tu envío", "Un sistema automático verifica tu envío"], cta: "COTIZAR AHORA" }),
  ci("2026-11-03", "19:00", "celeste", REC2),
];
