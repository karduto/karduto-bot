// kardito.mjs — historias de tasa con Kardito (1080x1920), páginas completas con su propio estilo.
//  kd = tasa con curva de 24 h (Kardito reacciona a la posición de la tasa)   kc = captación por corredor (Perú, Colombia)
// Usa solo datos reales del bot (x.cur, x.mx, x.avg, x.rates, x.hh) y mantiene el aviso de tasa y el horario obligatorios.
import { flag } from "./templates.mjs";

const f = (n, d = 2) => n.toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d });
const pick = (arr, n) => arr[Math.abs(n) % arr.length];
const IMG = (n) => `assets/kardito/${n}.webp`;
const FONTS = [[500, "Poppins-Medium"], [600, "Poppins-SemiBold"], [700, "Poppins-Bold"], [800, "Poppins-ExtraBold"]]
  .map(([w, n]) => `@font-face{font-family:"Poppins";font-weight:${w};src:url("assets/fonts/${n}.ttf")}`).join("");
const CSS = `${FONTS}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1920px;font-family:"Poppins","Arial",sans-serif;color:#fff;overflow:hidden;position:relative}
.bg{position:absolute;inset:0;background:radial-gradient(1000px 760px at 88% 6%,#7d5fff 0%,rgba(125,95,255,0) 62%),linear-gradient(162deg,#4A37FE 0%,#2b20c4 36%,#030357 100%)}
.dots{position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.085) 2.2px,transparent 2.8px);background-size:46px 46px;-webkit-mask-image:linear-gradient(180deg,#000,transparent 75%)}
.abs{position:absolute}.h{font-weight:800;letter-spacing:-.02em;line-height:1.03}.hl{color:#FDBB4A}
.mascot{position:absolute;filter:drop-shadow(0 30px 40px rgba(3,3,87,.5))}
.btn{display:inline-block;background:#FDBB4A;color:#030357;font-weight:800;border-radius:999px;white-space:nowrap}
.card{background:rgba(255,255,255,.11);border:2px solid rgba(255,255,255,.2);border-radius:48px}
.pill{display:inline-flex;align-items:center;gap:14px;background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.22);border-radius:999px;font-weight:700}
.live{width:16px;height:16px;border-radius:50%;background:#FDBB4A;box-shadow:0 0 0 7px rgba(253,187,74,.3)}
.foot{font-weight:600;color:rgba(255,255,255,.78)}`;
const page = (body) => `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080,height=1920"><style>${CSS}</style></head><body><div class="bg"></div><div class="dots"></div>${body}</body></html>`;
const logo = `<img class="abs" src="assets/logos/iso-white.png" style="top:236px;left:64px;height:88px">`;

const spark = (rates, w, h) => {
  const mn = Math.min(...rates), mx = Math.max(...rates), r = mx - mn || 1;
  const pts = rates.map((v, i) => `${(i / (rates.length - 1)) * w},${h - 14 - ((v - mn) / r) * (h - 28)}`);
  const last = pts[pts.length - 1].split(",");
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${pts.join(" ")}" fill="none" stroke="#FDBB4A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${last[0]}" cy="${last[1]}" r="12" fill="#fff" stroke="#FDBB4A" stroke-width="6"/></svg>`;
};

// Poses por situación; rotan por día y franja para que no se repita siempre la misma
// Las "variantes/…" salen de las hojas de Lovart (assets/kardito/variantes): 03-4 copa = «la más alta de 24 h», 03-5 lupa y 03-6 calculadora = tasa normal, 05-3 y 05-4 = bandera del corredor
const V = (n) => `variantes/${n}`;
// Las variantes traen objetos (bandera, copa, calculadora) que sobresalen del cuerpo: se ponen dentro del borde y no cortadas como las poses antiguas
const RX = (pose, dflt) => (pose.startsWith("variantes/") ? 24 : dflt);
const MOOD = { high: ["pose-vuelo", V("03-4-la-mas-alta-de-24-horas"), "vuelo-mensajero"], above: ["pose-saludo", "pose-aprobacion"], neutral: ["pose-celular", V("03-6-calculando"), "pose-senalando", V("03-5-comparando")] };
const POSES_CORR = { PE: [V("05-3-peru"), "viajero", "pose-sobre"], CO: [V("05-4-colombia"), "vuelo-mensajero", "pose-sobre"] };
// Ancho por pose (px): así ninguna pose invade la columna de texto de la izquierda (x < 500)
const W = { "pose-vuelo": 600, "vuelo-mensajero": 520, "pose-saludo": 600, "pose-aprobacion": 600, "pose-celular": 540, "pose-senalando": 600, viajero: 500, "pose-sobre": 600,
  [V("03-4-la-mas-alta-de-24-horas")]: 540, [V("03-6-calculando")]: 540, [V("03-5-comparando")]: 540, [V("05-3-peru")]: 540, [V("05-4-colombia")]: 540 };

// kd rota entre 3 diseños (abajo-derecha, centro, apoyado en la tarjeta) para probar cuál retiene mejor. El diseño se calcula con x.rot, o sea con el día y la franja:
// (rot + floor(rot/3)) % 3 → 0 = abajo-derecha, 1 = centro, 2 = apoyado. Así se puede saber después qué diseño salió cada día sin guardarlo.
export const kdLayout = (rot = 0) => ["abajo", "centro", "apoyado"][(Math.abs(rot) + Math.floor(Math.abs(rot) / 3)) % 3];

export function kd(x) {
  const c = x.cor, got = f(x.cur * 10000);
  const high = x.cur >= x.mx - 1e-12, above = x.cur > x.avg;
  const pose = pick(MOOD[high ? "high" : above ? "above" : "neutral"], x.rot ?? 0);
  const note = high ? "▲ La tasa más alta de las últimas 24 h" : above ? "▲ Sobre el promedio de las últimas 24 h" : "";
  const lay = kdLayout(x.rot ?? 0);
  const noteHtml = (top) => (note ? `<div class="abs" style="left:64px;top:${top}px"><span class="pill" style="padding:14px 28px;font-size:30px;background:rgba(253,187,74,.2);border-color:#FDBB4A;color:#FDBB4A">${note}</span></div>` : "");
  const route = `<div class="abs" style="left:64px;top:372px;display:flex;align-items:center;gap:22px">${flag(c.flag, 76)}<span style="font-size:44px;font-weight:700">${c.label}</span></div>`;
  const pillTop = `<div class="abs pill" style="right:64px;top:252px;padding:16px 30px;font-size:30px;letter-spacing:.1em"><span class="live"></span>TASA DEL DÍA</div>`;
  const card = (top, h) => `<div class="abs card" style="left:64px;right:64px;top:${top}px;height:${h}px;padding:52px 56px">
      <div style="font-size:38px;font-weight:600;opacity:.9">Si envías</div>
      <div class="h hl" style="font-size:96px;margin-top:2px">10.000 CLP</div>
      <div style="font-size:38px;font-weight:600;opacity:.9;margin-top:20px">tu contacto recibe</div>
      <div class="h" style="font-size:${got.length > 9 ? 112 : 128}px;margin-top:2px">${got} <span style="font-size:60px">${c.unit}</span></div>
      <div style="margin-top:26px">${spark(x.rates, 900, 110)}</div></div>`;
  const cta = (left, top) => `<div class="abs" style="left:${left}px;top:${top}px"><span class="btn" style="font-size:38px;padding:26px 46px">COTIZAR AHORA</span></div>`;
  const foot = (left, top, w, align = "left") => `<div class="abs foot" style="left:${left}px;top:${top}px;width:${w}px;font-size:28px;text-align:${align}">@karduto · karduto.com</div>`;
  const disc = (left, top, w, align = "left") => `<div class="abs foot" style="left:${left}px;top:${top}px;width:${w}px;font-size:22px;line-height:1.4;text-align:${align}">${x.disclaimer}<br><br><span style="font-size:26px;color:#fff">${x.note}</span></div>`;

  if (lay === "centro") {
    return page(`
      ${logo}${pillTop}${route}
      <img class="mascot" src="${IMG(pose)}" style="left:220px;top:440px;width:640px">
      <div class="abs card" style="left:64px;right:64px;top:1190px;padding:34px 48px;display:flex;align-items:center;justify-content:space-between;gap:20px">
        <div><div style="font-size:30px;font-weight:600;opacity:.9">Si envías</div><div class="h hl" style="font-size:62px;margin-top:2px">10.000 CLP</div></div>
        <div style="font-size:60px;font-weight:800;color:#FDBB4A">→</div>
        <div style="text-align:right"><div style="font-size:30px;font-weight:600;opacity:.9">tu contacto recibe</div><div class="h" style="font-size:${got.length > 9 ? 56 : 72}px;margin-top:2px">${got} <span style="font-size:36px">${c.unit}</span></div></div></div>
      ${note ? `<div class="abs" style="left:0;right:0;top:1118px;text-align:center"><span class="pill" style="padding:12px 26px;font-size:28px;background:rgba(253,187,74,.2);border-color:#FDBB4A;color:#FDBB4A">${note}</span></div>` : ""}
      ${cta(300, 1480)}${disc(90, 1630, 900, "center")}${foot(90, 1800, 900, "center")}`);
  }
  if (lay === "apoyado") {
    return page(`
      ${logo}${route}
      <div class="abs pill" style="left:64px;top:480px;padding:16px 30px;font-size:30px;letter-spacing:.1em"><span class="live"></span>TASA DEL DÍA</div>
      <img class="mascot" src="${IMG(pose)}" style="right:20px;top:350px;width:440px">
      ${card(800, 600)}${noteHtml(1425)}${cta(64, 1540)}${disc(560, 1530, 460)}${foot(64, 1790, 600)}`);
  }
  return page(`
    ${logo}${pillTop}${route}${card(490, 600)}${noteHtml(1116)}
    <img class="mascot" src="${IMG(pose)}" style="right:${RX(pose, -30)}px;bottom:120px;width:${W[pose]}px">
    ${cta(64, 1260)}
    <div class="abs foot" style="left:64px;top:1400px;font-size:22px;line-height:1.4;width:430px">${x.disclaimer}</div>
    <div class="abs foot" style="left:64px;top:1560px;font-size:26px;line-height:1.35;width:430px;color:#fff">${x.note}</div>
    <div class="abs foot" style="left:64px;top:1700px;font-size:28px">@karduto · karduto.com</div>`);
}

export function kc(x) {
  const c = x.cor, got = f(x.cur * 10000);
  const sub = x.cor.tipFixed ? x.cor.tipFixed.charAt(0).toUpperCase() + x.cor.tipFixed.slice(1) : `Envía a ${c.short} desde tu celular.`;
  const pose = pick(POSES_CORR[c.flag] ?? POSES_CORR.PE, x.rot ?? 0);
  return page(`
    ${logo}
    <div class="abs" style="right:64px;top:240px">${flag(c.flag, 120)}</div>
    <div class="abs" style="left:64px;right:64px;top:420px"><div class="h" style="font-size:96px">¿TU FAMILIA</div><div class="h hl" style="font-size:96px;margin-top:4px">ESTÁ EN ${c.short.toUpperCase()}?</div>
    <div style="font-size:42px;font-weight:600;margin-top:34px;line-height:1.3;width:800px">${sub}</div></div>
    <img class="mascot" src="${IMG(pose)}" style="right:${RX(pose, -50)}px;bottom:150px;width:${W[pose]}px">
    <div class="abs card" style="left:64px;top:1010px;width:430px;padding:28px 32px"><div style="font-size:25px;font-weight:600;opacity:.9">Con la tasa de las ${x.hh}</div><div class="h hl" style="font-size:40px;margin-top:10px">10.000 CLP</div><div class="h" style="font-size:44px;margin-top:4px">→ ${got} ${c.unit}</div></div>
    <div class="abs" style="left:64px;top:1330px"><span class="btn" style="font-size:38px;padding:26px 46px">COTIZAR AHORA</span></div>
    <div class="abs foot" style="left:64px;top:1470px;font-size:22px;line-height:1.4;width:430px">${x.disclaimer}</div>
    <div class="abs foot" style="left:64px;top:1650px;font-size:26px;line-height:1.35;width:430px;color:#fff">${x.note}</div>
    <div class="abs foot" style="left:64px;top:1770px;font-size:28px">@karduto · karduto.com</div>`);
}

export const KARDITO_TEMPLATES = { kd, kc };
