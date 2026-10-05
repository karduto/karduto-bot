// semana2.mjs — calendario 12–18 oct 2026 (días 8 a 14). Reglas: primarios protagonistas, secundarios solo de acento.
import { K, ph, pill, swipe, feedPage, foot, coverPhoto, checkSlide, errCards, infoSlide, applyTheme, sApertura, sUtilidad, sCierre } from "./content.mjs";

const card = (inner, extra = "") => `<div style="background:#fff;border-radius:36px;padding:30px 38px;box-shadow:0 14px 36px rgba(0,0,0,.25);${extra}">${inner}</div>`;
const glass = (inner, extra = "") => `<div style="background:rgba(255,255,255,.14);border-radius:36px;padding:30px 38px;${extra}">${inner}</div>`;
const label = (t, c = "#FDBB4A") => `<div style="font-weight:800;font-size:26px;letter-spacing:.12em;text-transform:uppercase;color:${c};">${t}</div>`;

// lámina con una cifra/horario grande
function bigSlide({ n, total, kicker, big, title, text, bg = "bg-grad" }) {
  return feedPage(`
  <div class="${bg}"></div><div class="dots"></div>
  ${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;top:300px;right:96px;">
    <div class="kicker" style="font-size:28px;">${kicker}</div>
    <div style="font-weight:800;font-size:116px;letter-spacing:-.03em;line-height:1.02;color:#fff;margin-top:20px;white-space:nowrap;">${big}</div>
    <div class="h2" style="margin-top:30px;font-size:64px;">${title}</div>
    <div class="lead" style="margin-top:24px;">${text}</div>
  </div>
  <div class="foot"><span>${n} de ${total}</span><span>karduto.com</span></div>`);
}

// lámina de dos tarjetas comparadas (dentro / fuera de horario)
function duoSlide({ n, total, title, a, b, bg = "bg-azul" }) {
  return feedPage(`
  <div class="${bg}"></div><div class="dots"></div>
  ${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;top:130px;"><div class="numbadge">${n}</div></div>
  <div style="position:absolute;left:96px;right:96px;top:272px;"><div class="h2" style="font-size:68px;">${title}</div></div>
  <div style="position:absolute;left:96px;right:96px;top:560px;display:flex;flex-direction:column;gap:30px;">
    ${glass(`${label(a.l)}<div style="font-weight:600;font-size:40px;line-height:1.3;color:#fff;margin-top:10px;">${a.t}</div>`)}
    ${card(`${label(b.l, "#4A37FE")}<div style="font-weight:700;font-size:40px;line-height:1.3;color:#030357;margin-top:10px;">${b.t}</div>`)}
  </div>
  <div class="foot"><span>${n} de ${total}</span><span>karduto.com</span></div>`);
}

// calendario de la semana (abierto / cerrado)
function weekSlide({ n, total, title, rows }) {
  return feedPage(`
  <div class="bg-grad"></div><div class="dots"></div>
  ${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;top:130px;"><div class="numbadge">${n}</div></div>
  <div style="position:absolute;left:96px;right:96px;top:272px;"><div class="h2" style="font-size:64px;">${title}</div></div>
  <div style="position:absolute;left:80px;right:80px;top:470px;display:flex;flex-direction:column;gap:12px;">
    ${rows.map((r) => `<div style="display:flex;align-items:center;gap:22px;background:${r.open ? "rgba(255,255,255,.14)" : "rgba(3,3,87,.55)"};border-radius:26px;padding:14px 26px;${r.hl ? "border:4px solid #FDBB4A;" : ""}">
      <div style="width:150px;font-weight:800;font-size:34px;color:#fff;">${r.d}</div>
      <div style="width:52px;height:52px;min-width:52px;border-radius:50%;background:${r.open ? "#FDBB4A" : "#F92257"};color:${r.open ? "#030357" : "#fff"};font-weight:800;font-size:32px;display:flex;align-items:center;justify-content:center;">${r.open ? "✓" : "✕"}</div>
      <div style="font-weight:700;font-size:34px;color:#fff;">${r.h}</div>
      ${r.note ? `<div style="margin-left:auto;font-weight:600;font-size:24px;color:#FDBB4A;">${r.note}</div>` : ""}</div>`).join("")}
  </div>
  <div class="foot"><span>${n} de ${total}</span><span>karduto.com</span></div>`);
}

// cierre con foto grande redonda + frase + botón
function closePhoto({ photo, pos = "50% 25%", n, total, kicker, h, cta, sub }) {
  return feedPage(`
  <div class="bg-grad"></div><div class="dots"></div>
  ${K("iso-white", "k-iso", "top:64px;left:80px;height:90px;")}
  <img src="${ph(photo)}" style="position:absolute;left:50%;top:190px;transform:translateX(-50%);width:640px;height:640px;object-fit:cover;object-position:${pos};border-radius:50%;border:12px solid #FDBB4A;box-shadow:0 24px 60px rgba(0,0,0,.45);">
  <div style="position:absolute;left:90px;right:90px;top:880px;text-align:center;">
    <div class="kicker" style="font-size:26px;">${kicker}</div>
    <div class="h2" style="margin-top:14px;font-size:62px;">${h}</div>
    <div style="margin-top:34px;">${pill(cta, "#FDBB4A", "#030357", "font-size:34px;")}</div>
    <div class="tiny" style="margin-top:14px;">${sub}</div>
  </div>
  <div class="foot"><span>${n} de ${total}</span><span>karduto.com</span></div>`);
}

// ---------- día 8 · lun 12 oct 09:00 · carrusel · feriado ----------
const D08 = (() => {
  const T = 5;
  return [
    coverPhoto({ photo: "f_hombre_casa_feriado.jpg", pos: "50% 70%", chipText: "FERIADO · 12 DE OCTUBRE", h1: `Hoy es feriado en Chile y Colombia. <span class="hl">Karduto está operando</span>`, lead: "Atendemos hoy con normalidad." }),
    bigSlide({ n: 1, total: T, kicker: "Horario de hoy · lunes 12", big: "08:30 – 20:00", title: `Atendemos <span class="hl">aunque sea feriado</span>`, text: "Cotiza, envía y sube tu comprobante como cualquier lunes." }),
    duoSlide({ n: 2, total: T, title: `¿Y si ingreso mi envío <span class="hl">fuera de horario</span>?`, a: { l: "Dentro del horario", t: "Tu envío se revisa en el día, durante nuestro horario de atención." }, b: { l: "Fuera del horario", t: "Queda ingresado y pasa al siguiente día operativo, desde las 8:30." } }),
    weekSlide({ n: 3, total: T, title: `Tu semana, <span class="hl">de un vistazo</span>`, rows: [
      { d: "Lun 12", open: true, h: "8:30 – 20:00", note: "feriado", hl: true },
      { d: "Mar 13", open: true, h: "8:30 – 20:00" }, { d: "Mié 14", open: true, h: "8:30 – 20:00" }, { d: "Jue 15", open: true, h: "8:30 – 20:00" },
      { d: "Vie 16", open: true, h: "8:30 – 20:00" }, { d: "Sáb 17", open: true, h: "8:30 – 16:00" }, { d: "Dom 18", open: false, h: "Cerrado" } ] }),
    closePhoto({ photo: "f_abuelas_videollamada.jpg", pos: "50% 30%", n: 5, total: T, kicker: "Tu familia cuenta contigo", h: `También en feriado`, cta: "Cotiza en karduto.com", sub: "Link en la bio · guarda este calendario" }),
  ].map((h) => applyTheme(h, "celeste"));
})();

// ---------- día 11 · jue 15 oct 18:00 · carrusel · tasa vs monto final ----------
const rowCard = (a, b, c) => `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:12px 0;border-bottom:3px solid rgba(3,3,87,.12);"><span style="font-weight:600;font-size:32px;color:#030357;">${a}</span><span style="font-weight:800;font-size:34px;color:${c || "#030357"};">${b}</span></div>`;
const optionCol = (name, tasa, com, llega, win) => `<div style="flex:1;background:${win ? "#fff" : "rgba(255,255,255,.14)"};border-radius:36px;padding:26px 28px;${win ? "box-shadow:0 0 0 6px #56CBFF,0 20px 50px rgba(0,0,0,.35);" : ""}">
  <div style="font-weight:800;font-size:30px;letter-spacing:.1em;text-transform:uppercase;color:${win ? "#4A37FE" : "#FDBB4A"};">${name}</div>
  <div style="margin-top:14px;font-weight:600;font-size:28px;color:${win ? "#030357" : "#fff"};">Tasa <b>${tasa}</b></div>
  <div style="margin-top:6px;font-weight:600;font-size:28px;color:${win ? "#030357" : "#fff"};">Comisión <b>${com}</b></div>
  <div style="margin-top:22px;font-weight:600;font-size:24px;color:${win ? "#030357" : "rgba(255,255,255,.8)"};">Llegan</div>
  <div style="font-weight:800;font-size:50px;line-height:1.05;color:${win ? "#4A37FE" : "#fff"};">${llega}</div></div>`;
const D11 = (() => {
  const T = 6;
  return [
    coverPhoto({ photo: "f_mujer_revisa_cuentas.jpg", pos: "50% 30%", chipText: "OJO CON LA TASA", h1: `La tasa más alta no siempre es <span class="hl">la que más le llega</span> a tu familia`, lead: "Compara por cuánto llega, no por la tasa sola." }),
    feedPage(`
  <div class="bg-grad"></div><div class="dots"></div>${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;top:130px;"><div class="numbadge">1</div></div>
  <div style="position:absolute;left:96px;right:96px;top:272px;"><div class="h2" style="font-size:68px;">Son <span class="hl">tres números</span>, no uno</div></div>
  <div style="position:absolute;left:96px;right:96px;top:520px;display:flex;flex-direction:column;gap:24px;">
    ${glass(`${label("Tasa")}<div style="font-weight:600;font-size:36px;color:#fff;margin-top:8px;line-height:1.3;">Cuántos Bs recibe tu familia por cada peso.</div>`, "padding:26px 38px;")}
    ${glass(`${label("Comisión")}<div style="font-weight:600;font-size:36px;color:#fff;margin-top:8px;line-height:1.3;">Lo que cuesta hacer el envío.</div>`, "padding:26px 38px;")}
    ${card(`${label("Monto final", "#4A37FE")}<div style="font-weight:700;font-size:36px;color:#030357;margin-top:8px;line-height:1.3;">Lo que realmente llega. Es el que importa.</div>`, "padding:26px 38px;")}
  </div><div class="foot"><span>1 de ${T}</span><span>karduto.com</span></div>`),
    feedPage(`
  <div class="bg-azul"></div><div class="dots"></div>${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;top:130px;"><div class="numbadge">2</div></div>
  <div style="position:absolute;left:96px;right:96px;top:272px;"><div class="h2" style="font-size:62px;">Mismo envío, <span class="hl">distinto resultado</span></div></div>
  <div style="position:absolute;left:70px;right:70px;top:540px;display:flex;gap:26px;">
    ${optionCol("Opción A", "0,92", "9.000 CLP", "83.720 Bs", false)}${optionCol("Opción B", "0,90", "3.000 CLP", "87.300 Bs", true)}
  </div>
  <div style="position:absolute;left:96px;right:96px;top:1010px;"><div class="lead" style="font-size:36px;">La opción con <b style="color:#fff">menor tasa</b> deja <b style="color:#56CBFF">más plata</b> en destino.</div></div>
  <div style="position:absolute;left:96px;right:96px;bottom:150px;"><div class="tiny" style="font-size:24px;">Ejemplo ilustrativo con cifras ficticias, enviando 100.000 CLP.</div></div>
  <div class="foot"><span>2 de ${T}</span><span>karduto.com</span></div>`),
    feedPage(`
  <div class="bg-grad"></div><div class="dots"></div>${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;top:130px;"><div class="numbadge">3</div></div>
  <div style="position:absolute;left:96px;right:96px;top:330px;"><div class="kicker" style="font-size:28px;">La regla</div>
    <div class="h1" style="font-size:96px;margin-top:20px;">Mira <span class="hl">cuánto llega</span>,<br>no solo la tasa.</div>
    <div class="lead" style="margin-top:34px;">Antes de enviar, pregúntate cuánto recibe tu familia al final. Esa es la cifra para comparar.</div></div>
  <div class="foot"><span>3 de ${T}</span><span>karduto.com</span></div>`),
    feedPage(`
  <div class="bg-azul"></div><div class="dots"></div>${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;top:130px;"><div class="numbadge">4</div></div>
  <div style="position:absolute;left:96px;right:96px;top:272px;"><div class="h2" style="font-size:64px;">En Karduto lo ves <span class="hl">antes de pagar</span></div></div>
  <div style="position:absolute;left:96px;right:96px;top:520px;">${card(`${label("Tú envías", "#4A37FE")}<div style="font-weight:800;font-size:56px;color:#030357;">100.000 CLP</div>
    <div style="height:3px;background:rgba(3,3,87,.12);margin:18px 0;"></div>${label("Tu familia recibe", "#4A37FE")}<div style="font-weight:800;font-size:56px;color:#4A37FE;">El monto final, a la vista</div>`, "padding:36px 44px;")}</div>
  <div style="position:absolute;left:96px;right:96px;top:1000px;"><div class="lead" style="font-size:36px;">Cotiza en karduto.com y compara por lo que llega.</div></div>
  <div class="foot"><span>4 de ${T}</span><span>Ejemplo ilustrativo</span></div>`),
    checkSlide({ photo: "", kicker: "Antes de enviar, pregúntate", title: `Tu mini <span class="hl">checklist</span>`, items: ["¿Cuánto llega en total?", "¿Cuánto cuesta enviar?", "¿Veo el monto antes de pagar?"], cta: "Guárdalo para comparar", ctaSub: "Cotiza en karduto.com · link en la bio", n: 5, total: 5 }),
  ].map((h) => applyTheme(h, "mango"));
})();

// ---------- día 14 · dom 18 oct 10:00 · carrusel · planificador mensual ----------
const miniCal = (hi) => {
  const cells = Array.from({ length: 28 }, (_, i) => i + 1);
  return `<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:10px;">${["L", "M", "M", "J", "V", "S", "D"].map((d) => `<div style="text-align:center;font-weight:800;font-size:26px;color:#F66220;">${d}</div>`).join("")}${cells.map((c) => `<div style="text-align:center;padding:14px 0;border-radius:18px;font-weight:700;font-size:30px;${c === hi ? "background:#F66220;color:#fff;box-shadow:0 8px 20px rgba(0,0,0,.3);" : "background:rgba(255,255,255,.12);color:#fff;"}">${c}</div>`).join("")}</div>`;
};
const stepSlide = ({ n, total, step, title, text, visual, bg = "bg-grad" }) => feedPage(`
  <div class="${bg}"></div><div class="dots"></div>${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;top:130px;"><div class="numbadge">${step}</div></div>
  <div style="position:absolute;left:96px;right:96px;top:272px;"><div class="h2" style="font-size:66px;">${title}</div><div class="lead" style="margin-top:20px;">${text}</div></div>
  <div style="position:absolute;left:96px;right:96px;top:690px;">${visual}</div>
  <div class="foot"><span>${n} de ${total}</span><span>karduto.com</span></div>`);
const D14 = (() => {
  const T = 5;
  return [
    coverPhoto({ photo: "f_mujer_planificador.jpg", pos: "50% 40%", chipText: "PLANIFICA TU MES", h1: `Si envías todos los meses, <span class="hl">planifica así</span>`, lead: "4 pasos para no improvisar tu envío." }),
    stepSlide({ n: 1, total: T, step: 1, title: `Fija <span class="hl">una fecha</span>`, text: "Elige un día del mes, por ejemplo cuando recibes tu sueldo, y márcalo en tu calendario.", visual: miniCal(27) }),
    stepSlide({ n: 2, total: T, step: 2, bg: "bg-azul", title: `Envía <span class="hl">dentro del horario</span>`, text: "Así tu envío entra a revisión el mismo día.", visual: `<div style="display:flex;flex-direction:column;gap:18px;">
      ${[["Lun a vie", "8:30 – 20:00", true], ["Sábado", "8:30 – 16:00", true], ["Domingo", "Cerrado", false]].map(([d, h, o]) => `<div style="display:flex;align-items:center;gap:22px;background:rgba(255,255,255,.14);border-radius:30px;padding:24px 32px;"><div style="width:56px;height:56px;border-radius:50%;background:${o ? "#F66220" : "#F92257"};color:#fff;font-weight:800;font-size:34px;display:flex;align-items:center;justify-content:center;">${o ? "✓" : "✕"}</div><div style="font-weight:800;font-size:40px;color:#fff;width:240px;">${d}</div><div style="font-weight:700;font-size:40px;color:#fff;">${h}</div></div>`).join("")}</div>` }),
    stepSlide({ n: 3, total: T, step: 3, title: `Guarda los datos de <span class="hl">tu destinatario</span>`, text: "Cuenta o teléfono y cédula en un lugar seguro, para completarlos sin errores.", visual: `<div style="display:flex;flex-direction:column;gap:18px;">${["Cuenta o teléfono", "Cédula del titular", "País y banco de destino"].map((t) => `<div style="background:#fff;border-radius:28px;padding:26px 34px;font-weight:700;font-size:38px;color:#030357;display:flex;align-items:center;gap:20px;"><span style="width:44px;height:44px;border-radius:12px;background:#F66220;color:#fff;font-weight:800;font-size:30px;display:flex;align-items:center;justify-content:center;">✓</span>${t}</div>`).join("")}</div>` }),
    checkSlide({ photo: "", kicker: "Tu planificador del mes", title: `Cada mes, <span class="hl">el mismo orden</span>`, items: ["Fija la fecha", "Envía en horario de atención", "Ten a mano los datos de tu destinatario", "Sube el comprobante completo"], cta: "Guárdalo y úsalo cada mes", ctaSub: "Cotiza en karduto.com · link en la bio", n: 5, total: 5 }),
  ].map((h) => applyTheme(h, "calabaza"));
})();

export const FEED = [
  { date: "2026-10-12", at: "09:00", id: "d08", type: "carrusel", slides: D08 },
  { date: "2026-10-15", at: "18:00", id: "d11", type: "carrusel", slides: D11 },
  { date: "2026-10-18", at: "10:00", id: "d14", type: "carrusel", slides: D14 },
];

// ---------- historias regulares 12–18 oct ----------
const ap = (date, th, o) => ({ date, at: "08:35", id: "ap", html: applyTheme(sApertura(o), th) });
const ut = (date, at, th, o) => ({ date, at, id: "ut", html: applyTheme(sUtilidad(o), th) });
const ci = (date, at, th, o, id = "ci") => ({ date, at, id, html: applyTheme(sCierre(o), th) });
export const STORIES = [
  // lun 12 · feriado
  ap("2026-10-12", "celeste", { photo: "s_mujer_blusa_roja.jpg", pos: "50% 20%", kicker: "Lunes feriado · ya estamos atendiendo", h: `Hoy es feriado y <span class="hl">atendemos con normalidad</span>`, sub: "Estamos desde las 8:30 hasta las 20:00." }),
  ut("2026-10-12", "15:00", "celeste", { kicker: "Cómo enviar", h: `Tu envío en <span class="hl">3 pasos</span>`, icon: "🚀", items: ["Cotiza en karduto.com", "Transfiere el monto exacto de tu solicitud", "Sube tu comprobante y sigue el estado"], cta: "HACER UN ENVÍO" }),
  ci("2026-10-12", "19:00", "celeste", { kicker: "Feriado incluido", big: "20:00", h: `Atendemos hasta las 20:00`, sub: "Lo que ingreses después pasa al siguiente día operativo, desde las 8:30." }),
  // mar 13 · reel tutorial
  ap("2026-10-13", "mango", { photo: "s_hombre_lentes.jpg", pos: "50% 25%", kicker: "Martes · ya estamos atendiendo", h: `Tu primer envío, <span class="hl">paso a paso</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-10-13", "15:00", "mango", { kicker: "Primer envío", h: `¿Primera vez? <span class="hl">Así se hace</span>`, bg: "s-bg-morado", icon: "🧭", items: ["Crea tu cuenta y cotiza", "Transfiere y sube tu comprobante", "Sigue el estado: Inicio, En proceso, Finalizado"], cta: "HACER MI PRIMER ENVÍO" }),
  ci("2026-10-13", "19:00", "mango", { kicker: "Recordatorio", big: "20:00", h: `Hoy atendemos hasta las 20:00`, sub: "Cotiza en karduto.com cuando quieras.", cta: "IR A KARDUTO.COM" }),
  // mié 14
  ap("2026-10-14", "calabaza", { photo: "s_mujer_trenzas_naranja.jpg", pos: "50% 25%", kicker: "Miércoles · ya estamos atendiendo", h: `Mitad de semana, <span class="hl">mitad de camino</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-10-14", "15:00", "calabaza", { kicker: "Lee tu cotización", h: `Tasa, comisión y <span class="hl">monto final</span>`, icon: "🧮", items: ["Tasa: lo que recibe tu familia por cada peso", "Comisión: lo que cuesta enviar", "Monto final: lo que realmente llega"], cta: "CONSULTAR TASA" }),
  ci("2026-10-14", "19:00", "calabaza", { kicker: "Recordatorio", big: "20:00", h: `Atendemos hasta las 20:00`, sub: "Lo que ingreses después pasa al siguiente día operativo, desde las 8:30." }),
  // jue 15
  ap("2026-10-15", "celeste", { photo: "s_hombre_rie_parque.jpg", pos: "50% 25%", kicker: "Jueves · ya estamos atendiendo", h: `Compara por <span class="hl">cuánto llega</span>`, sub: "Atendemos hasta las 20:00." }),
  ut("2026-10-15", "15:00", "celeste", { kicker: "Antes de enviar", h: `Tu mini <span class="hl">checklist</span>`, icon: "✅", items: ["¿Cuánto llega en total?", "¿Cuánto cuesta enviar?", "¿Veo el monto antes de pagar?"], cta: "COTIZAR AHORA" }),
  ci("2026-10-15", "19:00", "celeste", { kicker: "Recordatorio", big: "20:00", h: `Hoy atendemos hasta las 20:00`, sub: "Cotiza en karduto.com cuando quieras.", cta: "IR A KARDUTO.COM" }),
  // vie 16
  ap("2026-10-16", "mango", { photo: "s_mujer_lentes_cardigan.jpg", pos: "50% 22%", kicker: "Viernes · ya estamos atendiendo", h: `Viernes: envía <span class="hl">con calma</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-10-16", "15:00", "mango", { kicker: "Tu comprobante", h: `Comprobante <span class="hl">completo y legible</span>`, bg: "s-bg-morado", icon: "🧾", items: ["Monto, fecha y destino visibles", "Puedes subir varios: JPG, JPEG o PDF", "Súbelo en la solicitud correcta"], cta: "HACER UN ENVÍO" }),
  ci("2026-10-16", "19:00", "mango", { kicker: "Fin de semana", emoji: "📅", h: `Mañana sábado atendemos hasta las 16:00`, sub: "El domingo no operamos. El lunes volvemos desde las 8:30." }),
  // sáb 17
  ap("2026-10-17", "calabaza", { photo: "s_mujer_rizos_sonrie.jpg", pos: "50% 22%", kicker: "Sábado · ya estamos atendiendo", h: `Sábado de envíos, <span class="hl">hasta las 16:00</span>`, sub: "Hoy atendemos de 8:30 a 16:00." }),
  ut("2026-10-17", "12:30", "calabaza", { kicker: "Hoy cerramos a las 16:00", h: `¿Envías <span class="hl">este mes</span>?`, icon: "🗓️", items: ["Fija tu fecha de envío del mes", "Envía dentro del horario", "Ten a mano los datos de tu destinatario"], cta: "COTIZAR AHORA" }),
  ci("2026-10-17", "15:00", "calabaza", { kicker: "Última hora", big: "16:00", h: `Hoy atendemos hasta las 16:00`, sub: "Lo que ingreses después pasa al siguiente día operativo.", emoji: "⏳" }),
  // dom 18
  { date: "2026-10-18", at: "10:00", id: "dom", html: applyTheme(sCierre({ kicker: "Domingo", emoji: "🌙", h: `Hoy no operamos`, sub: "Mañana lunes volvemos desde las 8:30." }), "celeste") },
];
