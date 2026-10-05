// content.mjs — piezas del calendario (feed 1080x1350 e historias regulares 1080x1920) → JPG en content/
// Uso: node src/content.mjs semana1     (renderiza todo lo de esa semana)
import path from "node:path";
import { flag } from "./templates.mjs";
import { renderPage, closeBrowser } from "./render.mjs";

const K = (logo, cls, style) => `<div class="${cls}" style="${style}"><img src="assets/logos/${logo}.png" alt=""></div>`;
const ph = (f) => `assets/photos/${f}`;
const swipe = `<div class="swipe">Desliza <svg viewBox="0 0 24 24"><path d="M8 4l10 8-10 8z"/></svg></div>`;
const pill = (t, bg = "#FDBB4A", c = "#030357", extra = "") => `<span style="display:inline-block;background:${bg};color:${c};font-weight:800;font-size:36px;padding:18px 38px;border-radius:999px;${extra}">${t}</span>`;
// Temas: los primarios (morado/azul) siempre mandan; el secundario solo pinta acentos (texto resaltado, botones, números).
export const THEMES = {
  mango: { hl: "#FDBB4A", btn: "#FDBB4A", btnInk: "#030357" },
  celeste: { hl: "#56CBFF", btn: "#56CBFF", btnInk: "#030357" },
  calabaza: { hl: "#F66220", btn: "#F66220", btnInk: "#FFFFFF" },
  violeta: { hl: "#56CBFF", btn: "#AE25FD", btnInk: "#FFFFFF" },
};
export function applyTheme(html, key = "mango") {
  const t = THEMES[key];
  if (!t || key === "mango") return html;
  let h = html.split("background:#FDBB4A;color:#030357").join(`background:${t.btn};color:${t.btnInk}`)
    .split("color:#FDBB4A").join(`color:${t.hl}`).split("background:#FDBB4A").join(`background:${t.btn}`).split("#FDBB4A").join(t.hl);
  const css = `<style>:root{--mango:${t.hl}}.numbadge{background:${t.btn}!important;color:${t.btnInk}!important}.s-cta{background:${t.btn};color:${t.btnInk}}.hl{color:${t.hl}}</style>`;
  return h.replace("</head>", css + "</head>");
}
const FONT = `.kicker,.chip,.h1,.h2,.lead,.body,.tiny,.numbadge{font-family:"Poppins","Arial",sans-serif}`;

function feedPage(inner, extraCss = "") {
  return `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080,height=1350">
<link rel="stylesheet" href="kit.css"><style>${FONT}${extraCss}</style></head><body><div id="root">${inner}</div></body></html>`;
}
function storyPage(inner, extraCss = "") {
  return `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080,height=1920">
<link rel="stylesheet" href="kit-story.css"><style>.s-h1,.s-h2,.s-kicker,.s-cta,.s-tag,.s-lead,.s-body,.s-tiny{font-family:"Poppins","Arial",sans-serif}${extraCss}</style></head><body><div id="root">${inner}</div></body></html>`;
}
const foot = (l = "@karduto", r = "karduto.com") => `<div class="foot"><span>${l}</span><span>${r}</span></div>`;

// ---------------- bloques de feed ----------------
// portada de carrusel con foto a sangre
function coverPhoto({ photo, pos = "50% 20%", chipText, h1, lead, logo = "iso-white" }) {
  return feedPage(`
  <img class="photo" src="${ph(photo)}" style="object-position:${pos};">
  <div class="photo-tint"></div><div class="photo-scrim"></div>
  ${K(logo, "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;top:96px;"><span class="chip" style="font-size:44px;padding:22px 38px 24px;">${chipText}</span></div>
  <div style="position:absolute;left:96px;right:96px;bottom:200px;">
    <div class="h1" style="font-size:84px;">${h1}</div>
    <div class="lead" style="margin-top:22px;color:#fff;">${lead}</div>
  </div>
  ${swipe}${foot("@karduto", "")}`);
}
// lámina de error/dato con tarjetas
function infoSlide({ n, total, title, cards, color = "grad" }) {
  const bg = color === "azul" ? "bg-azul" : "bg-grad";
  return feedPage(`
  <div class="${bg}"></div><div class="dots"></div>
  ${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;top:130px;"><div class="numbadge">${n}</div></div>
  <div style="position:absolute;left:96px;right:96px;top:272px;"><div class="h2" style="font-size:68px;">${title}</div></div>
  <div style="position:absolute;left:96px;right:96px;top:520px;display:flex;flex-direction:column;gap:26px;">
    ${cards.map((c) => `<div style="background:${c.bg};border-radius:36px;padding:30px 38px;box-shadow:0 14px 36px rgba(0,0,0,.25);">
      <div style="font-weight:800;font-size:26px;letter-spacing:.12em;text-transform:uppercase;color:${c.label};">${c.l}</div>
      <div style="font-weight:600;font-size:38px;line-height:1.3;color:${c.ink};margin-top:10px;">${c.t}</div></div>`).join("")}
  </div>
  <div class="foot"><span>${n} de ${total}</span><span>karduto.com</span></div>`);
}
const errCards = (tipico, evitar) => [
  { l: "El error típico", t: tipico, bg: "rgba(255,255,255,.14)", label: "#FDBB4A", ink: "#fff" },
  { l: "Cómo evitarlo", t: evitar, bg: "#fff", label: "#4A37FE", ink: "#030357" },
];
// lámina checklist
function checkSlide({ photo, pos = "50% 20%", kicker, title, items, cta, ctaSub, total, n }) {
  return feedPage(`
  <div class="bg-grad"></div><div class="dots"></div>
  ${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  ${photo ? `<img src="${ph(photo)}" style="position:absolute;right:70px;top:150px;width:290px;height:350px;object-fit:cover;object-position:${pos};border-radius:40px;border:8px solid #fff;transform:rotate(4deg);box-shadow:0 20px 50px rgba(0,0,0,.45);">` : ""}
  <div style="position:absolute;left:96px;top:150px;width:600px;"><div class="kicker" style="font-size:26px;">${kicker}</div><div class="h2" style="margin-top:14px;font-size:68px;">${title}</div></div>
  <div style="position:absolute;left:96px;right:96px;top:540px;display:flex;flex-direction:column;gap:14px;">
    ${items.map((t) => `<div style="display:flex;align-items:center;gap:26px;background:rgba(255,255,255,.12);border-radius:30px;padding:18px 30px;"><div style="width:64px;height:64px;min-width:64px;border-radius:18px;background:#FDBB4A;color:#030357;font-weight:800;font-size:44px;display:flex;align-items:center;justify-content:center;">✓</div><div style="font-weight:600;font-size:38px;color:#fff;line-height:1.2;">${t}</div></div>`).join("")}
  </div>
  <div style="position:absolute;left:96px;right:96px;top:${540 + items.length * 114 + 34}px;">${pill(cta)}<div class="tiny" style="margin-top:16px;">${ctaSub}</div></div>
  <div class="foot"><span>${n} de ${total}</span><span>karduto.com</span></div>`);
}

// ---------------- piezas de feed de la semana 1 ----------------
export const D02 = (() => {
  const T = 6;
  return [
    coverPhoto({ photo: "f_preocupada_celular.jpg", pos: "50% 30%", chipText: "ANTES DE TRANSFERIR", h1: `4 razones por las que un envío <span class="hl">se detiene</span>`, lead: "Las 4 se evitan antes de transferir." }),
    infoSlide({ n: 1, total: T, title: `Monto que <span class="hl">no coincide</span>`, cards: errCards("Transferir un monto distinto al que indica tu solicitud.", "Revisa que el monto transferido sea exactamente el de tu solicitud.") }),
    infoSlide({ n: 2, total: T, title: `Depósito <span class="hl">no encontrado</span>`, color: "azul", cards: errCards("El pago no aparece en la cuenta de Karduto: transferencia incompleta o hecha a otra cuenta.", "Transfiere a la cuenta que muestra tu solicitud y confirma que tu banco la dejó completada.") }),
    infoSlide({ n: 3, total: T, title: `Comprobante <span class="hl">duplicado</span>`, cards: errCards("Subir el mismo comprobante en más de una solicitud.", "No repitas el mismo comprobante en dos envíos. Puedes subir varios.") }),
    infoSlide({ n: 4, total: T, title: `Comprobante <span class="hl">no encontrado</span>`, color: "azul", cards: errCards("El archivo no se ve completo o no se puede leer.", "Sube el comprobante completo y legible, en la solicitud que corresponde.") }),
    checkSlide({ photo: "f_hombre_texteando.jpg", pos: "50% 30%", kicker: "Checklist", title: `Antes de <span class="hl">transferir</span>`, items: ["Monto exacto de la solicitud", "Cuenta correcta", "Sin repetir comprobantes entre envíos", "Comprobante completo y legible"], cta: "Guárdalo para tu próximo envío", ctaSub: "Cotiza en karduto.com · link en la bio", n: 6, total: 6 }),
  ];
})();

const D05 = (() => {
  const T = 5;
  return [
    coverPhoto({ photo: "f_hombre_error_frente.jpg", pos: "50% 18%", chipText: "REVISA ESTO", h1: `Un número mal escrito y <span class="hl">el pago vuelve</span>`, lead: "Revisa los datos de tu destinatario antes de enviar." , logo: "app-navy"}),
    infoSlide({ n: 1, total: T, title: `Cuenta o <span class="hl">teléfono</span>`, cards: errCards("Un dígito de más, de menos o cambiado.", "Revisa el número completo, dígito por dígito, antes de confirmar.") }),
    infoSlide({ n: 2, total: T, title: `La <span class="hl">cédula</span>`, color: "azul", cards: errCards("Escribirla con un número equivocado o de otra persona.", "Debe ser la del titular de la cuenta que recibe. Compárala con el documento.") }),
    infoSlide({ n: 3, total: T, title: `Límite en cuentas de <span class="hl">ahorro</span>`, cards: errCards("Enviar un monto mayor al límite de abono de la cuenta de ahorro.", "Si el monto es alto, consulta el límite con el banco de destino antes de enviar.") }),
    checkSlide({ photo: "f_mujer_rizos_celular.jpg", pos: "50% 22%", kicker: "Regla de 3 pasos", title: `Completa, revisa, <span class="hl">envía</span>`, items: ["Completa todos los datos", "Revisa cuenta o teléfono y cédula", "Envía con calma"], cta: "Guárdalo antes de tu próximo envío", ctaSub: "Cotiza en karduto.com · link en la bio", n: 5, total: 5 }),
  ];
})();

// estático día 4: cotizador (ejemplo ilustrativo)
const D04 = feedPage(`
  <div class="bg-morado"></div><div class="dots"></div>
  ${K("iso-white", "k-iso", "top:64px;left:80px;height:84px;")}
  <div style="position:absolute;left:80px;top:190px;width:470px;">
    <div class="kicker" style="font-size:26px;color:#FDBB4A;">Chile → Venezuela</div>
    <div class="h2" style="margin-top:16px;font-size:50px;line-height:1.1;">¿Mandas de Chile a Venezuela? Mira cuánto <span class="hl">recibe tu familia</span> antes de transferir.</div>
  </div>
  <img src="${ph("f_mujer_sonrie_celular.jpg")}" style="position:absolute;left:70px;top:700px;width:300px;height:370px;object-fit:cover;object-position:50% 25%;border-radius:40px;border:8px solid #fff;transform:rotate(-5deg);box-shadow:0 20px 50px rgba(0,0,0,.4);">
  <div style="position:absolute;right:70px;top:150px;width:430px;height:900px;border-radius:64px;background:#030357;border:10px solid #0f0f7a;box-shadow:0 30px 70px rgba(0,0,0,.45);transform:rotate(4deg);padding:44px 30px;">
    <div style="display:flex;align-items:center;gap:12px;">${flag("CL", 56)}<span style="color:#fff;font-weight:800;font-size:36px;">→</span>${flag("VE", 56)}</div>
    <div style="color:rgba(255,255,255,.7);font-weight:600;font-size:24px;margin-top:30px;">Tú envías</div>
    <div style="background:rgba(255,255,255,.12);border-radius:22px;padding:16px 20px;color:#fff;font-weight:800;font-size:40px;margin-top:8px;">100.000 CLP</div>
    <div style="color:rgba(255,255,255,.7);font-weight:600;font-size:24px;margin-top:28px;">Tu familia recibe</div>
    <div style="background:#FDBB4A;border-radius:22px;padding:16px 20px;color:#030357;font-weight:800;font-size:44px;margin-top:8px;">89.000 Bs</div>
    <div style="margin-top:30px;background:#4A37FE;color:#fff;font-weight:800;font-size:28px;text-align:center;padding:20px;border-radius:999px;">Continuar</div>
    <div style="color:rgba(255,255,255,.6);font-weight:500;font-size:20px;margin-top:26px;line-height:1.35;">Ejemplo ilustrativo. La tasa real y actualizada está en karduto.com.</div>
  </div>
  <div style="position:absolute;left:80px;bottom:110px;">${pill("Cotiza en karduto.com", "#FDBB4A", "#030357", "font-size:32px;")}<div class="tiny" style="margin-top:12px;">Link en la bio</div></div>
  <div class="foot"><span>@karduto</span><span>El monto se ve antes de pagar</span></div>`);

// estático día 7: pregunta de comunidad
const D07 = feedPage(`
  <div class="bg-azul"></div><div class="dots"></div>
  ${K("iso-white", "k-iso", "top:64px;left:80px;height:84px;")}
  <img src="${ph("c_mesa_comida.jpg")}" style="position:absolute;right:-60px;top:-40px;width:560px;height:560px;object-fit:cover;border-radius:50%;border:12px solid #FDBB4A;box-shadow:0 24px 60px rgba(0,0,0,.45);">
  <div style="position:absolute;left:80px;top:230px;width:540px;"><div class="kicker" style="font-size:26px;color:#56CBFF;">Pregunta de domingo</div></div>
  <div style="position:absolute;left:80px;right:80px;top:530px;">
    <div class="h1" style="font-size:80px;">Completa la frase:</div>
    <div class="h1" style="font-size:66px;margin-top:20px;line-height:1.12;">lo primero que como cuando vuelvo a mi país es <span style="color:#FDBB4A;">_____</span></div>
  </div>
  <div style="position:absolute;left:80px;top:1010px;display:flex;gap:22px;align-items:center;">${flag("VE", 100)}${flag("PE", 100)}${flag("CO", 100)}${flag("CL", 100)}</div>
  <div style="position:absolute;left:80px;bottom:120px;">${pill("Cuéntanos en los comentarios 👇", "#56CBFF", "#030357", "font-size:34px;")}</div>
  <div class="foot"><span>@karduto</span><span>Foto: Mitchell Hartley / Unsplash</span></div>`);

// ---------------- historias regulares ----------------
const SBAR = (n, t) => `<div class="s-progress">${Array.from({ length: t }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("")}</div>`;
const sFoot = `<div class="s-foot" style="bottom:70px;"><span>@karduto</span><span>karduto.com</span></div>`;
const sCta = (t, bg = "#FDBB4A", c = "#030357") => `<span class="s-cta" style="background:${bg};color:${c};">${t}</span>`;

// apertura: foto a sangre + mensaje del día
function sApertura({ photo, pos = "50% 20%", kicker, h, sub }) {
  return storyPage(`
  <img class="s-photo" src="${ph(photo)}" style="object-position:${pos};"><div class="s-photo-tint"></div><div class="s-photo-scrim-b"></div>
  ${K("iso-white", "s-k", "top:96px;left:50%;transform:translateX(-50%);height:78px;")}
  <div style="position:absolute;left:80px;right:80px;bottom:270px;">
    <div class="s-kicker" style="font-size:28px;"><span class="s-dot-live"></span>${kicker}</div>
    <div class="s-h1" style="margin-top:22px;font-size:96px;">${h}</div>
    <div class="s-lead" style="margin-top:22px;color:#fff;">${sub}</div>
  </div>${sFoot}`);
}
// utilidad: tarjeta con pasos/idea sobre degradado
function sUtilidad({ kicker, h, items, cta, bg = "s-bg-grad", icon = "💡" }) {
  return storyPage(`
  <div class="${bg}"></div><div class="s-dots"></div>
  ${K("iso-white", "s-k", "top:96px;left:80px;height:78px;")}
  <div style="position:absolute;right:80px;top:84px;font-size:120px;line-height:1;filter:drop-shadow(0 14px 24px rgba(0,0,0,.35));">${icon}</div>
  <div style="position:absolute;left:80px;right:80px;top:330px;">
    <div class="s-kicker" style="font-size:28px;">${kicker}</div>
    <div class="s-h1" style="margin-top:20px;font-size:88px;">${h}</div>
  </div>
  <div style="position:absolute;left:70px;right:70px;top:780px;display:flex;flex-direction:column;gap:26px;">
    ${items.map((t, i) => `<div style="display:flex;align-items:center;gap:26px;background:rgba(255,255,255,.96);border-radius:40px;padding:28px 36px;box-shadow:0 16px 40px rgba(0,0,0,.28);"><div style="width:76px;height:76px;min-width:76px;border-radius:50%;background:#4A37FE;color:#fff;font-weight:800;font-size:40px;display:flex;align-items:center;justify-content:center;">${i + 1}</div><div style="font-weight:700;font-size:40px;line-height:1.2;color:#030357;">${t}</div></div>`).join("")}
  </div>
  <div style="position:absolute;left:0;right:0;top:1470px;text-align:center;">${sCta(cta)}</div>${sFoot}`);
}
// cierre / aviso: fondo azul, reloj grande
function sCierre({ kicker, big, h, sub, emoji = "🕗", cta }) {
  return storyPage(`
  <div class="s-bg-azul"></div><div class="s-arc"></div><div class="s-dots"></div>
  ${K("circle-morado", "s-k", "top:110px;left:50%;transform:translateX(-50%);height:240px;")}
  <div style="position:absolute;left:80px;right:80px;top:540px;text-align:center;">
    <div style="font-size:150px;line-height:1;filter:drop-shadow(0 18px 30px rgba(0,0,0,.35));">${emoji}</div>
    <div class="s-kicker" style="font-size:28px;margin-top:30px;justify-content:center;width:100%;">${kicker}</div>
    <div style="font-weight:800;font-size:${big ? 150 : 0}px;color:#FDBB4A;line-height:1.05;margin-top:12px;display:${big ? "block" : "none"};">${big || ""}</div>
    <div class="s-h1" style="margin-top:18px;font-size:84px;">${h}</div>
    <div class="s-lead" style="margin-top:26px;color:rgba(255,255,255,.9);">${sub}</div>
    ${cta ? `<div style="margin-top:56px;">${sCta(cta)}</div>` : ""}
  </div>${sFoot}`);
}

// ---------------- calendario de historias de la semana 1 (hora de Chile) ----------------
// día de la semana calculado por código (nunca a mano)
const wd = (iso) => new Date(iso + "T12:00:00Z").getUTCDay();
const STORIES_W1 = [
  // lunes 5
  { date: "2026-10-05", at: "08:35", id: "ap", html: sApertura({ photo: "tasa_mujer_celular.jpg", pos: "50% 25%", kicker: "Lunes · ya estamos atendiendo", h: `Empieza la semana <span class="hl">con tu envío listo</span>`, sub: "Hoy atendemos hasta las 20:00." }) },
  { date: "2026-10-05", at: "15:00", id: "ut", html: sUtilidad({ kicker: "Sigue tu envío", h: `Así se ve tu envío <span class="hl">paso a paso</span>`, icon: "🧭", items: ["Inicio: creaste la solicitud", "En proceso: el sistema confirmó que todo está ok", "Finalizado: te llega la boleta y la notificación"], cta: "HACER UN ENVÍO" }) },
  { date: "2026-10-05", at: "19:00", id: "ci", html: sCierre({ kicker: "Recordatorio", big: "20:00", h: `Atendemos hasta las 20:00`, sub: "Lo que ingreses después se procesa el siguiente día operativo desde las 8:30." }) },
  // martes 6
  { date: "2026-10-06", at: "08:35", id: "ap", html: sApertura({ photo: "tasa_sorpresa_amarillo.jpg", pos: "50% 10%", kicker: "Martes · ya estamos atendiendo", h: `Buen día. <span class="hl">Aquí estamos</span>`, sub: "Atendemos hasta las 20:00." }) },
  { date: "2026-10-06", at: "15:00", id: "ut", html: sUtilidad({ kicker: "Antes de transferir", h: `Revisa esto <span class="hl">antes de pagar</span>`, icon: "✅", items: ["El monto es exactamente el de tu solicitud", "Transfiere a la cuenta que muestra tu solicitud", "Sube tu comprobante (puedes subir varios)"], cta: "COTIZAR AHORA" }) },
  { date: "2026-10-06", at: "19:00", id: "ci", html: sCierre({ kicker: "Recordatorio", big: "20:00", h: `Hoy atendemos hasta las 20:00`, sub: "Cotiza en karduto.com cuando quieras.", cta: "IR A KARDUTO.COM" }) },
  // miércoles 7
  { date: "2026-10-07", at: "08:35", id: "ap", html: sApertura({ photo: "tasa_hombre_alegre.jpg", pos: "60% 30%", kicker: "Miércoles · ya estamos atendiendo", h: `Mitad de semana, <span class="hl">tu familia en mente</span>`, sub: "Hoy atendemos hasta las 20:00." }) },
  { date: "2026-10-07", at: "15:00", id: "ut", html: sUtilidad({ kicker: "Cotiza antes de enviar", h: `Ve cuánto recibe <span class="hl">tu familia</span>`, bg: "s-bg-morado", icon: "🧮", items: ["Entra a karduto.com", "Elige el corredor y el monto", "Mira cuánto llega antes de pagar"], cta: "CONSULTAR TASA" }) },
  { date: "2026-10-07", at: "19:00", id: "ci", html: sCierre({ kicker: "Recordatorio", big: "20:00", h: `Atendemos hasta las 20:00`, sub: "Lo que ingreses después se procesa el siguiente día operativo desde las 8:30." }) },
  // jueves 8
  { date: "2026-10-08", at: "08:35", id: "ap", html: sApertura({ photo: "c_mujer_pared.jpg", pos: "50% 25%", kicker: "Jueves · ya estamos atendiendo", h: `Un envío bien hecho <span class="hl">empieza hoy</span>`, sub: "Atendemos hasta las 20:00." }) },
  { date: "2026-10-08", at: "15:00", id: "ut", html: sUtilidad({ kicker: "Datos del destinatario", h: `Revisa los datos <span class="hl">de quien recibe</span>`, icon: "🔎", items: ["Cuenta o teléfono, dígito por dígito", "Cédula del titular de la cuenta", "Límite de abono en cuentas de ahorro"], cta: "HACER UN ENVÍO" }) },
  { date: "2026-10-08", at: "19:00", id: "ci", html: sCierre({ kicker: "Recordatorio", big: "20:00", h: `Hoy atendemos hasta las 20:00`, sub: "Cotiza en karduto.com cuando quieras.", cta: "IR A KARDUTO.COM" }) },
  // viernes 9
  { date: "2026-10-09", at: "08:35", id: "ap", html: sApertura({ photo: "tasa_mujer_celular.jpg", pos: "50% 25%", kicker: "Viernes · ya estamos atendiendo", h: `Viernes de envíos <span class="hl">con tiempo</span>`, sub: "Hoy atendemos hasta las 20:00." }) },
  { date: "2026-10-09", at: "15:00", id: "ut", html: sUtilidad({ kicker: "Tu comprobante", h: `Sube tu comprobante <span class="hl">completo y legible</span>`, bg: "s-bg-morado", icon: "🧾", items: ["Que se vean todos los datos", "Puedes subir varios: JPG, JPEG o PDF", "En la solicitud que corresponde"], cta: "HACER UN ENVÍO" }) },
  { date: "2026-10-09", at: "19:00", id: "ci", html: sCierre({ kicker: "Fin de semana", emoji: "📅", h: `Mañana sábado atendemos hasta las 16:00`, sub: "El domingo no operamos. El lunes 12, feriado, también atendemos." }) },
  // sábado 10
  { date: "2026-10-10", at: "08:35", id: "ap", html: sApertura({ photo: "tasa_hombre_alegre.jpg", pos: "60% 30%", kicker: "Sábado · ya estamos atendiendo", h: `Sábado de envíos, <span class="hl">hasta las 16:00</span>`, sub: "Hoy atendemos de 8:30 a 16:00." }) },
  { date: "2026-10-10", at: "12:30", id: "ut", html: sUtilidad({ kicker: "Hoy cerramos a las 16:00", h: `¿Vas a enviar <span class="hl">hoy</span>?`, icon: "⏰", items: ["Cotiza en karduto.com", "Haz tu transferencia y sube el comprobante", "Hazlo antes de las 16:00 para que se procese hoy"], cta: "COTIZAR AHORA" }) },
  { date: "2026-10-10", at: "15:00", id: "ci", html: sCierre({ kicker: "Última hora", big: "16:00", h: `Hoy atendemos hasta las 16:00`, sub: "Lo que ingreses después se procesa el siguiente día operativo.", emoji: "⏳" }) },
  // domingo 11
  { date: "2026-10-11", at: "10:00", id: "dom", html: sCierre({ kicker: "Domingo", emoji: "🌙", h: `Hoy no operamos`, sub: "Mañana lunes 12, feriado, atendemos. Te esperamos desde las 8:30." }) },
  { date: "2026-10-11", at: "19:00", id: "dom2", html: sCierre({ kicker: "Aviso de feriado", emoji: "🗓️", h: `El lunes 12 trabajamos con normalidad`, sub: "Aunque sea feriado, atendemos como cualquier lunes. Te esperamos desde las 8:30.", cta: "IR A KARDUTO.COM" }) },
];

const FEED_W1 = [
  { date: "2026-10-06", at: "10:00", id: "d02", type: "carrusel", slides: D02 },
  { date: "2026-10-08", at: "10:00", id: "d04", type: "estatico", slides: [D04] },
  { date: "2026-10-09", at: "10:00", id: "d05", type: "carrusel", slides: D05 },
  { date: "2026-10-11", at: "10:00", id: "d07", type: "estatico", slides: [D07] },
];

export { K, ph, pill, swipe, feedPage, storyPage, foot, coverPhoto, infoSlide, checkSlide, errCards, sApertura, sUtilidad, sCierre, sCta, sFoot };

async function main() {
  const wanted = process.argv[2] || "semana1";
  const mod = wanted === "semana1" ? { FEED: FEED_W1, STORIES: STORIES_W1 } : await import(`./${wanted}.mjs`);
  for (const p of mod.FEED) {
    for (const [i, html] of p.slides.entries()) {
      const name = p.slides.length > 1 ? `${p.date}_${p.id}_${p.type}_s${String(i + 1).padStart(2, "0")}.jpg` : `${p.date}_${p.id}_${p.type}.jpg`;
      await renderPage(html, { width: 1080, height: 1350, out: path.join("content", name) });
      console.log(name);
    }
  }
  for (const s of mod.STORIES) {
    const name = `${s.date}_${s.at.replace(":", "")}_story_${s.id}.jpg`;
    await renderPage(s.html, { width: 1080, height: 1920, out: path.join("content", "stories", name) });
    console.log(name, "(" + ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"][wd(s.date)] + ")");
  }
  await closeBrowser();
}
if (process.argv[1] && process.argv[1].endsWith("content.mjs")) main();
