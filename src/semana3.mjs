// semana3.mjs — calendario 19–25 oct 2026 (días 15 a 21). Primarios protagonistas, secundarios de acento.
import { K, ph, pill, feedPage, coverPhoto, checkSlide, applyTheme, sApertura, sUtilidad, sCierre } from "./content.mjs";

const label = (t, c = "#FDBB4A") => `<div style="font-weight:800;font-size:26px;letter-spacing:.12em;text-transform:uppercase;color:${c};">${t}</div>`;

// ---------- día 16 · mar 20 oct 10:00 · estático · comprobante bien vs mal ----------
const receipt = (bad) => `<div style="background:#fff;border-radius:28px;padding:26px 26px 22px;box-shadow:0 18px 44px rgba(0,0,0,.35);width:100%;height:560px;overflow:hidden;position:relative;">
  <img src="assets/logos/bancoestado.png" style="height:34px;display:block;">
  <div style="font-weight:600;font-size:20px;color:#6b6b8a;margin-top:2px;">Comprobante de transferencia</div>
  <div style="height:3px;background:#E7E1DC;margin:14px 0;"></div>
  ${[["Monto", "$100.000"], ["Fecha", "06/10/2026 10:42"], ["Destino", "Cuenta ****1234"], ["N° operación", "00123456"]].map(([a, b], i) => `<div style="display:flex;justify-content:space-between;padding:9px 0;font-size:23px;${bad && i < 2 ? "filter:blur(7px);opacity:.7;" : ""}"><span style="color:#6b6b8a;font-weight:600;">${a}</span><span style="color:#030357;font-weight:800;">${b}</span></div>`).join("")}
  ${bad ? `<div style="position:absolute;left:0;right:0;bottom:0;height:150px;background:linear-gradient(180deg,rgba(255,255,255,0),#fff 70%);"></div><div style="position:absolute;left:-10px;right:-10px;top:236px;height:60px;background:#e9e3de;transform:rotate(-3deg);"></div>` : `<div style="margin-top:12px;display:inline-block;background:#3CE07A;color:#030357;font-weight:800;font-size:21px;padding:8px 18px;border-radius:999px;">Transferencia exitosa</div>`}
</div>`;
const D16 = applyTheme(feedPage(`
  <div class="bg-azul"></div><div class="dots"></div>
  ${K("iso-white", "k-iso", "top:56px;left:70px;height:84px;")}
  <div style="position:absolute;right:50px;top:40px;width:230px;height:230px;border-radius:50%;background:#fff;border:8px solid #fff;box-shadow:0 14px 34px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;"><img src="assets/logos/bancoestado.png" style="width:190px;height:auto;"></div>
  <div style="position:absolute;left:70px;right:300px;top:170px;"><div class="kicker" style="font-size:24px;">Antes de subirlo</div><div class="h2" style="font-size:54px;margin-top:10px;">Así se ve un comprobante que <span class="hl">pasa a la primera</span></div></div>
  <div style="position:absolute;left:50px;right:50px;top:420px;display:flex;gap:30px;">
    <div style="flex:1;">${receipt(false)}<div style="margin-top:22px;display:flex;align-items:center;gap:14px;"><div style="width:56px;height:56px;border-radius:50%;background:#3CE07A;color:#030357;font-weight:800;font-size:36px;display:flex;align-items:center;justify-content:center;">✓</div><div style="font-weight:800;font-size:30px;color:#fff;">Completo y legible</div></div></div>
    <div style="flex:1;">${receipt(true)}<div style="margin-top:22px;display:flex;align-items:center;gap:14px;"><div style="width:56px;height:56px;border-radius:50%;background:#F92257;color:#fff;font-weight:800;font-size:36px;display:flex;align-items:center;justify-content:center;">✕</div><div style="font-weight:800;font-size:30px;color:#fff;">Recortado o borroso</div></div></div>
  </div>
  <div style="position:absolute;left:70px;right:70px;bottom:120px;">${pill("Monto, fecha y destino a la vista", "#FDBB4A", "#030357", "font-size:32px;")}<div class="tiny" style="margin-top:12px;font-size:22px;">Comprobantes de ejemplo con datos ficticios.</div></div>
  <div class="foot"><span>@karduto</span><span>karduto.com</span></div>`), "celeste");

// ---------- día 17 · mié 21 oct 18:00 · carrusel 7 · qué hacemos con tu dinero ----------
const tl = (cur, total = 5) => `<div style="display:flex;align-items:center;gap:0;">${Array.from({ length: total }, (_, i) => `<div style="width:60px;height:60px;border-radius:50%;background:${i + 1 <= cur ? "#AE25FD" : "rgba(255,255,255,.18)"};color:#fff;font-weight:800;font-size:30px;display:flex;align-items:center;justify-content:center;${i + 1 === cur ? "box-shadow:0 0 0 8px rgba(86,203,255,.55);" : ""}">${i + 1}</div>${i < total - 1 ? `<div style="flex:1;height:6px;background:${i + 1 < cur ? "#AE25FD" : "rgba(255,255,255,.18)"};"></div>` : ""}`).join("")}</div>`;
const stepTl = ({ n, total, cur, title, text, icon = "", bg = "bg-grad" }) => feedPage(`
  <div class="${bg}"></div><div class="dots"></div>${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;right:96px;top:150px;">${tl(cur)}</div>
  <div style="position:absolute;left:96px;right:96px;top:380px;">
    <div class="kicker" style="font-size:28px;">Paso ${cur}</div>
    <div class="h1" style="font-size:84px;margin-top:20px;">${title}</div>
    <div class="lead" style="margin-top:32px;font-size:40px;">${text}</div>
  </div>
  <div style="position:absolute;left:0;right:0;top:880px;text-align:center;font-size:230px;line-height:1;filter:drop-shadow(0 22px 34px rgba(0,0,0,.4));">${icon}</div>
  <div class="foot"><span>${n} de ${total}</span><span>karduto.com</span></div>`);
const D17 = (() => {
  const T = 7;
  return [
    coverPhoto({ photo: "f_revisa_documentos.jpg", pos: "50% 30%", chipText: "TU ENVÍO, POR DENTRO", h1: `Qué hacemos con tu dinero <span class="hl">desde que transfieres</span> hasta que llega`, lead: "El proceso de control, paso a paso." }),
    stepTl({ n: 1, total: T, cur: 1, icon: "🧾", title: `Tú transfieres y <span class="hl">subes tu comprobante</span>`, text: "Haces la transferencia por el monto de tu solicitud y subes el comprobante completo." }),
    stepTl({ n: 2, total: T, cur: 2, icon: "🤖", bg: "bg-azul", title: `El sistema <span class="hl">verifica tu depósito</span>`, text: "De manera automática, el sistema comprueba que tu pago coincida con tu solicitud." }),
    stepTl({ n: 3, total: T, cur: 3, icon: "✅", title: `Si todo está ok, <span class="hl">se aprueba</span>`, text: "Si el sistema detecta que todo está correcto, aprueba tu envío y pasa a la siguiente etapa." }),
    stepTl({ n: 4, total: T, cur: 4, icon: "📩", bg: "bg-azul", title: `Te avisamos <span class="hl">por email</span> en cada cambio`, text: "Inicio, En proceso y Finalizado: cada cambio de estado llega a tu correo." }),
    stepTl({ n: 5, total: T, cur: 5, icon: "🛠️", title: `Si algo no cuadra, <span class="hl">te avisamos</span>`, text: "Te escribimos para que lo corrijas, y tu envío sigue su camino." }),
    feedPage(`
  <div class="bg-azul"></div><div class="dots"></div>${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;right:96px;top:230px;">
    <div class="kicker" style="font-size:28px;">Cuando dice Finalizado</div>
    <div class="h1" style="font-size:80px;margin-top:20px;">Esto es lo que <span class="hl">recibes</span></div>
    <div style="margin-top:44px;display:flex;flex-direction:column;gap:20px;">
      ${["La notificación de éxito", "La boleta", "El comprobante bancario"].map((t) => `<div style="display:flex;align-items:center;gap:22px;background:rgba(255,255,255,.14);border-radius:30px;padding:24px 32px;"><div style="width:60px;height:60px;border-radius:50%;background:#AE25FD;color:#fff;font-weight:800;font-size:34px;display:flex;align-items:center;justify-content:center;">✓</div><div style="font-weight:700;font-size:40px;color:#fff;">${t}</div></div>`).join("")}
    </div>
    <div style="margin-top:50px;">${pill("Guárdalo y cotiza en karduto.com", "#AE25FD", "#FFFFFF", "font-size:34px;")}<div class="tiny" style="margin-top:14px;">Link en la bio</div></div>
  </div><div class="foot"><span>7 de ${T}</span><span>karduto.com</span></div>`),
  ].map((h) => applyTheme(h, "violeta"));
})();

// ---------- día 19 · vie 23 oct 10:00 · estático · cierre ----------
const D19 = applyTheme(feedPage(`
  <div class="bg-azul"></div><div class="dots"></div>
  ${K("iso-white", "k-iso", "top:56px;left:70px;height:84px;")}
  <img src="${ph("f_hombre_reloj.jpg")}" style="position:absolute;right:-40px;top:-30px;width:520px;height:520px;object-fit:cover;object-position:50% 40%;border-radius:50%;border:12px solid #FDBB4A;box-shadow:0 24px 60px rgba(0,0,0,.45);">
  <div style="position:absolute;left:70px;top:210px;width:520px;"><div class="kicker" style="font-size:26px;">Horario de cierre</div><div class="h1" style="font-size:78px;margin-top:14px;">Envía antes <span class="hl">del cierre</span></div></div>
  <div style="position:absolute;left:70px;right:70px;top:600px;display:flex;flex-direction:column;gap:22px;">
    <div style="display:flex;align-items:center;justify-content:space-between;background:#FDBB4A;border-radius:34px;padding:26px 40px;"><span style="font-weight:800;font-size:44px;color:#030357;">Viernes</span><span style="font-weight:800;font-size:60px;color:#030357;">hasta 20:00</span></div>
    <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.14);border-radius:34px;padding:26px 40px;"><span style="font-weight:800;font-size:44px;color:#fff;">Sábado</span><span style="font-weight:800;font-size:60px;color:#fff;">hasta 16:00</span></div>
    <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(3,3,87,.6);border:3px solid rgba(255,255,255,.3);border-radius:34px;padding:22px 40px;"><span style="font-weight:800;font-size:40px;color:#fff;">Domingo</span><span style="font-weight:700;font-size:44px;color:#fff;">cerrado</span></div>
  </div>
  <div style="position:absolute;left:70px;right:70px;top:1040px;"><div class="lead" style="font-size:28px;">Fuera de horario: se procesa el siguiente día operativo.</div></div>
  <div style="position:absolute;left:70px;bottom:150px;">${pill("Envía hoy · karduto.com", "#FDBB4A", "#030357", "font-size:34px;")}</div>
  <div class="foot"><span>@karduto</span><span>Link en la bio</span></div>`), "mango");

// ---------- día 20 · sáb 24 oct 10:00 · carrusel · 3 mitos ----------
const mito = ({ n, total, num, mito: m, real }) => feedPage(`
  <div class="bg-grad"></div><div class="dots"></div>${K("iso-white", "k-iso", "top:64px;right:70px;height:100px;")}
  <div style="position:absolute;left:96px;top:130px;"><div class="numbadge">${num}</div></div>
  <div style="position:absolute;left:80px;right:80px;top:330px;">
    <div style="background:rgba(3,3,87,.55);border-radius:36px;padding:32px 38px;border:4px solid #F92257;">
      ${label("Mito", "#F92257")}
      <div style="font-weight:800;font-size:56px;line-height:1.15;color:#fff;margin-top:12px;text-decoration:line-through;text-decoration-color:#F92257;text-decoration-thickness:6px;">${m}</div>
    </div>
    <div style="background:#fff;border-radius:36px;padding:34px 38px;margin-top:34px;box-shadow:0 18px 44px rgba(0,0,0,.3);">
      ${label("Realidad", "#4A37FE")}
      <div style="font-weight:700;font-size:46px;line-height:1.25;color:#4A37FE;margin-top:12px;">${real}</div>
    </div>
  </div>
  <div class="foot"><span>${n} de ${total}</span><span>karduto.com</span></div>`);
const D20 = (() => {
  const T = 5;
  return [
    coverPhoto({ photo: "f_hombre_esceptico.jpg", pos: "50% 25%", chipText: "MITO O REALIDAD", h1: `3 mitos que te frenan para enviar por una <span class="hl">plataforma web</span>`, lead: "Y lo que pasa de verdad." }),
    mito({ n: 1, total: T, num: 1, mito: "Es complicado", real: "Son pocos pasos y todo se puede hacer desde tu teléfono: cotizas, transfieres y subes tu comprobante." }),
    mito({ n: 2, total: T, num: 2, mito: "No voy a saber dónde está mi plata", real: "Ves el estado de tu envío: Inicio, En proceso y Finalizado." }),
    mito({ n: 3, total: T, num: 3, mito: "Si me equivoco, pierdo el envío", real: "Si algo se puede corregir, te llega un correo y lo corriges." }),
    checkSlide({ photo: "", kicker: "Ahora sí", title: `Pruébalo <span class="hl">tú mismo</span>`, items: ["Cotiza y ve el monto antes de pagar", "Sigue el estado de tu envío", "Corrige si hace falta"], cta: "Cotiza en karduto.com", ctaSub: "Link en la bio · guárdalo", n: 5, total: 5 }),
  ].map((h) => applyTheme(h, "celeste"));
})();

export const FEED = [
  { date: "2026-10-20", at: "10:00", id: "d16", type: "estatico", slides: [D16] },
  { date: "2026-10-21", at: "18:00", id: "d17", type: "carrusel", slides: D17 },
  { date: "2026-10-23", at: "10:00", id: "d19", type: "estatico", slides: [D19] },
  { date: "2026-10-24", at: "10:00", id: "d20", type: "carrusel", slides: D20 },
];

// ---------- historias regulares 19–25 oct ----------
const ap = (date, th, o) => ({ date, at: "08:35", id: "ap", html: applyTheme(sApertura(o), th) });
const ut = (date, at, th, o) => ({ date, at, id: "ut", html: applyTheme(sUtilidad(o), th) });
const ci = (date, at, th, o) => ({ date, at, id: "ci", html: applyTheme(sCierre(o), th) });
const REC = { kicker: "Recordatorio", big: "20:00", h: `Atendemos hasta las 20:00`, sub: "Lo que ingreses después pasa al siguiente día operativo, desde las 8:30." };
export const STORIES = [
  ap("2026-10-19", "celeste", { photo: "s_mujer_chaqueta_blanca.jpg", pos: "50% 20%", kicker: "Lunes · ya estamos atendiendo", h: `¿Tu familia está <span class="hl">en Colombia</span>?`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-10-19", "15:00", "celeste", { kicker: "Chile → Colombia", h: `Así recibe <span class="hl">tu familia</span>`, icon: "📲", items: ["Por Nequi", "O por transferencia a cualquier banco", "Mira el monto antes de pagar"], cta: "COTIZAR CHILE → COLOMBIA" }),
  ci("2026-10-19", "19:00", "celeste", REC),
  ap("2026-10-20", "mango", { photo: "s_hombre_camisa_floral.jpg", pos: "50% 22%", kicker: "Martes · ya estamos atendiendo", h: `Un comprobante completo <span class="hl">pasa a la primera</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-10-20", "15:00", "mango", { kicker: "Tu comprobante", h: `Que se vea <span class="hl">todo</span>`, bg: "s-bg-morado", icon: "🧾", items: ["El monto", "La fecha", "El destino"], cta: "HACER UN ENVÍO" }),
  ci("2026-10-20", "19:00", "mango", { kicker: "Recordatorio", big: "20:00", h: `Hoy atendemos hasta las 20:00`, sub: "Cotiza en karduto.com cuando quieras.", cta: "IR A KARDUTO.COM" }),
  ap("2026-10-21", "calabaza", { photo: "s_mujer_blanco.jpg", pos: "50% 18%", kicker: "Miércoles · ya estamos atendiendo", h: `Un sistema <span class="hl">verifica tu envío</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-10-21", "15:00", "calabaza", { kicker: "Tu envío por dentro", h: `Qué pasa <span class="hl">con tu envío</span>`, icon: "🔎", items: ["El sistema verifica tu depósito de forma automática", "Si todo está ok, se aprueba y pasa a la siguiente etapa", "Te avisamos por email en cada cambio"], cta: "HACER UN ENVÍO" }),
  ci("2026-10-21", "19:00", "calabaza", REC),
  ap("2026-10-22", "celeste", { photo: "s_hombre_caminando.jpg", pos: "50% 30%", kicker: "Jueves · ya estamos atendiendo", h: `Tu envío es como <span class="hl">una encomienda</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-10-22", "15:00", "celeste", { kicker: "Sigue tu envío", h: `Revisa el <span class="hl">estado</span> en la web`, icon: "📦", items: ["Inicio: creaste la solicitud", "En proceso: el sistema verifica", "Finalizado: listo"], cta: "SEGUIR MI ENVÍO" }),
  ci("2026-10-22", "19:00", "celeste", { kicker: "Recordatorio", big: "20:00", h: `Hoy atendemos hasta las 20:00`, sub: "Cotiza en karduto.com cuando quieras.", cta: "IR A KARDUTO.COM" }),
  ap("2026-10-23", "mango", { photo: "s_mujer_blazer.jpg", pos: "50% 20%", kicker: "Viernes · ya estamos atendiendo", h: `Envía antes <span class="hl">del cierre</span>`, sub: "Hoy atendemos hasta las 20:00." }),
  ut("2026-10-23", "15:00", "mango", { kicker: "Horario de cierre", h: `Esto es lo que <span class="hl">tienes que saber</span>`, bg: "s-bg-morado", icon: "⏰", items: ["Hoy, hasta las 20:00", "Sábado, hasta las 16:00", "Domingo, cerrado"], cta: "ENVIAR HOY" }),
  ci("2026-10-23", "19:00", "mango", { kicker: "Fin de semana", emoji: "📅", h: `Mañana sábado atendemos hasta las 16:00`, sub: "El domingo no operamos. El lunes volvemos desde las 8:30." }),
  ap("2026-10-24", "calabaza", { photo: "s_mujer_cafe.jpg", pos: "50% 22%", kicker: "Sábado · ya estamos atendiendo", h: `Sábado de envíos, <span class="hl">hasta las 16:00</span>`, sub: "Hoy atendemos de 8:30 a 16:00." }),
  ut("2026-10-24", "12:30", "calabaza", { kicker: "Mitos y realidades", h: `Enviar por la web <span class="hl">no es complicado</span>`, icon: "💡", items: ["Son pocos pasos", "Todo se puede hacer desde tu teléfono", "Ves el estado de tu envío"], cta: "COTIZAR AHORA" }),
  ci("2026-10-24", "15:00", "calabaza", { kicker: "Última hora", big: "16:00", h: `Hoy atendemos hasta las 16:00`, sub: "Lo que ingreses después pasa al siguiente día operativo.", emoji: "⏳" }),
  { date: "2026-10-25", at: "10:00", id: "dom", html: applyTheme(sCierre({ kicker: "Domingo", emoji: "🌙", h: `Hoy no operamos`, sub: "Mañana lunes volvemos desde las 8:30." }), "celeste") },
];
