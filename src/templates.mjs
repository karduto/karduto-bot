// templates.mjs — plantillas de historia (1080x1920) y post (1080x1350) con datos reales.
// Los colores salen del tema (src/themes.mjs) vía variables CSS: x.theme = clave del tema.
import { THEMES, themeCSS } from "./themes.mjs";

const f = (n, d = 0, max = d) => n.toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: max });
const themeOf = (x) => THEMES[x.theme] || THEMES.clasico;

export const CORRIDORS = {
  BS: { from: "CLP", to: "BS", unit: "Bs", label: "Chile → Venezuela", short: "Venezuela", base: 1, flag: "VE" },
  PE: { from: "CLP", to: "PEN", unit: "PEN", label: "Chile → Perú", short: "Perú", base: 1000, flag: "PE" },
  CO: { from: "CLP", to: "COP", unit: "COP", label: "Chile → Colombia", short: "Colombia", base: 1, flag: "CO" },
};

// ---------- banderas circulares (vectoriales, nítidas a cualquier tamaño) ----------
// Cada bandera se dibuja en un cuadro 150x100 y se centra dentro del círculo (clip fijo, sin mover el clip).
let _fid = 0;
const star = (cx, cy, R, r, fill) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (-90 + i * 36) * (Math.PI / 180), rad = i % 2 ? r : R;
    return `${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return `<polygon points="${pts}" fill="${fill}"/>`;
};
const FLAGS = {
  CL: { dx: 0, svg: `<rect width="150" height="50" fill="#fff"/><rect y="50" width="150" height="50" fill="#D52B1E"/><rect width="50" height="50" fill="#0039A6"/>${star(25, 25, 14, 5.6, "#fff")}` },
  VE: { dx: -25, svg: `<rect width="150" height="33.4" fill="#FFCC00"/><rect y="33.4" width="150" height="33.3" fill="#00247D"/><rect y="66.7" width="150" height="33.3" fill="#CF142B"/>${Array.from({ length: 8 }, (_, i) => { const a = (-155 + i * (130 / 7)) * (Math.PI / 180); return star(75 + 28 * Math.cos(a), 72 + 28 * Math.sin(a), 3.6, 1.5, "#fff"); }).join("")}` },
  PE: { dx: -25, svg: `<rect width="50" height="100" fill="#D91023"/><rect x="50" width="50" height="100" fill="#fff"/><rect x="100" width="50" height="100" fill="#D91023"/>` },
  CO: { dx: -25, svg: `<rect width="150" height="50" fill="#FCD116"/><rect y="50" width="150" height="25" fill="#003893"/><rect y="75" width="150" height="25" fill="#CE1126"/>` },
};
export const flag = (code, size) => {
  const id = "fc" + _fid++, fl = FLAGS[code];
  // el recorte (clip) va en un <g> exterior sin transformar; el desplazamiento va en un <g> interior
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" style="display:block;filter:drop-shadow(0 4px 8px rgba(0,0,0,.35))"><defs><clipPath id="${id}"><circle cx="50" cy="50" r="50"/></clipPath></defs><g clip-path="url(#${id})"><g transform="translate(${fl.dx},0)">${fl.svg}</g></g><circle cx="50" cy="50" r="48.5" fill="none" stroke="#fff" stroke-width="3.5"/></svg>`;
};
const flagsRow = (c, size) =>
  `<span style="display:inline-flex;align-items:center;gap:${Math.round(size * 0.22)}px;vertical-align:middle">${flag("CL", size)}<svg viewBox="0 0 24 24" width="${Math.round(size * 0.5)}" height="${Math.round(size * 0.5)}"><path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>${flag(c.flag, size)}</span>`;

// la tasa se muestra tal como la entrega la API (hasta 6 decimales), sin redondear de más
const rateFmt = (c, v) => (c.base === 1000 ? f(v * 1000, 2, 5) : f(v, 4, 6));
const unitRate = (c, cur) => (c.base === 1000 ? `1.000 CLP = ${f(cur * 1000, 2, 5)} ${c.unit}` : `1 CLP = ${f(cur, 4, 6)} ${c.unit}`);

const K = (logo, cls, style) => `<div class="${cls}" style="${style}"><img src="assets/logos/${logo}.png" alt=""></div>`;
const dot = `<span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#3CE07A;box-shadow:0 0 0 6px rgba(60,224,122,.25);margin-right:14px;vertical-align:middle"></span>`;
const arrow = `<svg viewBox="0 0 24 24" fill="currentColor" style="width:36px;height:36px"><path d="M8 4l10 8-10 8z"/></svg>`;
const cta = (t) => `<span class="s-cta">${t} ${arrow}</span>`;
const badgeHTML = (badge, extra = "") =>
  badge
    ? `<div style="display:inline-block;background:rgba(60,224,122,.18);border:3px solid #3CE07A;font-weight:700;font-size:30px;padding:12px 28px;border-radius:999px;${extra}">${badge}</div>`
    : "";
const decorHTML = (T) => (T.decor ? `<div style="position:absolute;inset:0;overflow:hidden;">${T.decor}</div>` : "");

function chart(x, w, h, { dotR = 14, stroke = 8, labels = true, line: lineC = "var(--line)", grid: gridC = "var(--grid)", ink = "var(--gInk)" } = {}) {
  const { rates, mx, mn, cor } = x;
  const padT = 34, padB = 34, padX = 22;
  const span = mx - mn || mx * 0.001;
  const lo = mn - span * 0.12, hi = mx + span * 0.12;
  const X = (i) => padX + (i * (w - 2 * padX)) / (rates.length - 1);
  const Y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (h - padT - padB);
  const pts = rates.map((v, i) => [X(i), Y(v)]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L${pts[pts.length - 1][0].toFixed(1)} ${h - padB} L${pts[0][0].toFixed(1)} ${h - padB} Z`;
  const [lx, ly] = pts[pts.length - 1];
  const iMax = rates.indexOf(mx);
  const gridL = [0.25, 0.5, 0.75].map((t) => { const y = (padT + t * (h - padT - padB)).toFixed(1); return `<line x1="${padX}" x2="${w - padX}" y1="${y}" y2="${y}" style="stroke:${gridC}" stroke-width="2" stroke-dasharray="6 10"/>`; }).join("");
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block;overflow:visible">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:${lineC}" stop-opacity=".55"/><stop offset="1" style="stop-color:${lineC}" stop-opacity="0"/></linearGradient></defs>
    ${gridL}<path d="${area}" fill="url(#g)"/>
    <path d="${line}" fill="none" style="stroke:${lineC}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>
    ${labels ? `<circle cx="${pts[iMax][0].toFixed(1)}" cy="${pts[iMax][1].toFixed(1)}" r="9" style="fill:${ink}"/><text x="${Math.min(Math.max(pts[iMax][0], 150), w - 150).toFixed(1)}" y="${(pts[iMax][1] - 22).toFixed(1)}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="30" style="fill:${ink}">máx ${rateFmt(cor, mx)}</text>` : ""}
    <circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="${dotR * 2}" style="fill:${lineC}" opacity=".25"/>
    <circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="${dotR}" style="fill:${lineC}" stroke="#fff" stroke-width="5"/>
  </svg>`;
}

// bloque inferior: dato + horario + aviso de tasa (obligatorio en toda pieza con tasa)
// modo: "p" = sobre el panel, "bg" = sobre el fondo del tema, "h" = sobre foto con velo oscuro
const bottom = (x, mode = "p") => {
  const [acc, ink, dim] = { p: ["var(--pAcc)", "var(--pInk)", "var(--pDim)"], bg: ["var(--acc)", "var(--ink)", "var(--dim)"], h: ["var(--hAcc)", "#fff", "rgba(255,255,255,.78)"] }[mode];
  return `
  <div style="position:absolute;left:70px;right:70px;bottom:118px;text-align:center;">
    <div style="font-weight:700;font-size:30px;line-height:1.28;color:${acc};">Dato: ${x.tip}</div>
    <div style="font-weight:600;font-size:28px;color:${ink};margin-top:10px;">${x.note}</div>
    <div style="font-weight:500;font-size:23px;line-height:1.35;color:${dim};margin-top:12px;">${x.disclaimer}</div>
  </div>
  <div class="s-foot" style="bottom:46px;color:${dim};"><span>@karduto</span><span>karduto.com</span></div>`;
};

const conv = (x, clp) => f(clp * x.cur, 2);

// ---------- T1: foto sorpresa + sticker ----------
function t1(x) {
  const c = x.cor;
  return `
  <div style="position:absolute;inset:0;background:var(--bg);"></div>
  <img src="assets/photos/${x.photo}" style="position:absolute;left:0;top:0;width:1080px;height:980px;object-fit:cover;object-position:50% 6%;">
  ${K("app-navy", "s-k app", "left:70px;top:80px;height:96px;")}
  <div style="position:absolute;right:60px;top:110px;transform:rotate(5deg);background:var(--stk);color:var(--stkInk);font-weight:800;font-size:46px;padding:20px 34px;border-radius:26px;box-shadow:0 14px 34px rgba(0,0,0,.3);">¡Mira la tasa!</div>
  <div style="position:absolute;left:0;right:0;top:880px;bottom:0;background:var(--panel);border-radius:80px 80px 0 0;box-shadow:0 -24px 70px rgba(0,0,0,.4);"></div>
  <div style="position:absolute;left:50%;top:800px;transform:translateX(-50%) rotate(-3deg);background:var(--chip);color:var(--chipInk);font-weight:800;font-size:58px;padding:22px 46px;border-radius:999px;white-space:nowrap;box-shadow:0 16px 40px rgba(0,0,0,.35);">${unitRate(c, x.cur)}</div>
  <div class="m-p" style="position:absolute;left:70px;right:70px;top:940px;text-align:center;color:var(--pInk);">
    <div style="margin-bottom:12px;">${flagsRow(c, 64)}</div>
    <div class="s-kicker" style="font-size:28px;">${dot}Tasa de las ${x.hh} · ${c.label}</div>
    <div class="s-lead" style="margin-top:20px;font-weight:600;font-size:40px;">Si envías <b>10.000 CLP</b>, tu contacto recibe</div>
    <div class="big" style="font-weight:800;font-size:110px;letter-spacing:-.02em;line-height:1.1;margin-top:4px;">${conv(x, 10000)} ${c.unit}</div>
    <div style="margin-top:18px;color:var(--pInk);">${badgeHTML(x.badge)}</div>
  </div>
  <div class="m-p" style="position:absolute;left:70px;right:70px;top:1370px;text-align:center;">${cta("COTIZAR AHORA")}</div>
  ${bottom(x, "p")}`;
}

// ---------- T2: tendencia 24 h ----------
function t2(x) {
  const c = x.cor, T = themeOf(x);
  const chips = [["Mín.", rateFmt(c, x.mn), "var(--statBg)", "var(--statInk)"], ["Ahora", rateFmt(c, x.cur), "var(--statHiBg)", "var(--statHiInk)"], ["Máx.", rateFmt(c, x.mx), "var(--statBg)", "var(--statInk)"]];
  return `
  <div style="position:absolute;inset:0;background:var(--bg);"></div>${decorHTML(T)}<div class="s-dots"></div>
  ${K(T.logo, "s-k", "left:70px;top:96px;height:78px;")}
  <img src="assets/photos/${x.photo}" style="position:absolute;right:64px;top:90px;width:340px;height:430px;object-fit:cover;object-position:50% 25%;border-radius:40px;border:9px solid #fff;transform:rotate(4deg);box-shadow:0 20px 50px rgba(0,0,0,.4);">
  <div style="position:absolute;left:70px;top:300px;width:560px;color:var(--ink);">
    <div style="display:flex;align-items:center;gap:18px;">${flagsRow(c, 54)}<span class="s-kicker" style="font-size:26px;">Tasa de las ${x.hh}</span></div>
    <div class="s-h1" style="margin-top:20px;">Así va<br><span class="hl">la tasa hoy</span></div>
  </div>
  <div style="position:absolute;left:56px;right:56px;top:600px;background:var(--glass);color:var(--gInk);border-radius:44px;padding:30px 36px 24px;box-shadow:0 24px 60px rgba(0,0,0,.28);">
    <div class="s-tiny" style="margin-bottom:4px;color:var(--gDim);">${c.label} · últimas 24 horas · variación de ${f(((x.mx - x.mn) / x.mn) * 100, 1)} %</div>
    ${chart(x, 920, 380)}
    <div style="display:flex;justify-content:space-between;margin-top:6px;color:var(--gDim);" class="s-tiny"><span>hace 24 h</span><span>ahora</span></div>
  </div>
  <div style="position:absolute;left:56px;right:56px;top:1150px;display:flex;gap:18px;">
    ${chips.map(([l, v, bg, col]) => `<div style="flex:1;background:${bg};color:${col};border-radius:30px;padding:18px 10px;text-align:center;"><div style="font-weight:600;font-size:24px;opacity:.8;">${l}${c.base === 1000 ? " (x1.000)" : ""}</div><div style="font-weight:800;font-size:42px;">${v}</div></div>`).join("")}
  </div>
  <div style="position:absolute;left:70px;right:70px;top:1302px;text-align:center;color:var(--ink);">
    ${x.badge ? badgeHTML(x.badge, "font-size:28px;") : `<div class="s-lead" style="font-weight:600;font-size:38px;">Hoy <b>10.000 CLP</b> → <b class="big">${conv(x, 10000)} ${c.unit}</b></div>`}
  </div>
  <div style="position:absolute;left:70px;right:70px;top:1400px;text-align:center;">${cta("COTIZA EN KARDUTO.COM")}</div>
  ${bottom(x, "bg")}`;
}

// ---------- tabla de montos sobre retrato (T3 y corredores) ----------
function tableStory(x, { tag, line1, line2, ctaText, tip }) {
  const c = x.cor, T = themeOf(x);
  const rows = [10000, 50000, 100000];
  return `
  <img src="assets/photos/${x.photo}" style="position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover;object-position:50% 20%;">
  <div style="position:absolute;inset:0;background:var(--scrim);"></div>
  ${K("iso-white", "s-k", "top:96px;left:50%;transform:translateX(-50%);height:78px;")}
  <div class="m-h" style="color:#fff">
    <div style="position:absolute;top:230px;left:70px;right:70px;text-align:center;"><span class="s-tag" style="display:inline-flex;align-items:center;gap:16px;padding:10px 28px 10px 14px;font-size:26px;">${flagsRow(c, 48)}<span>${tag}</span></span></div>
    <div style="position:absolute;top:380px;left:70px;right:70px;text-align:center;"><div class="s-h1">${line1}<br>${line2}</div></div>
  </div>
  <div style="position:absolute;left:60px;right:60px;top:890px;background:var(--card);border-radius:44px;padding:14px 44px;box-shadow:0 24px 60px rgba(0,0,0,.4);">
    ${rows.map((m, i) => `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:10px 0;${i < 2 ? "border-bottom:3px solid rgba(3,3,87,.12);" : ""}"><span style="font-weight:600;font-size:40px;color:var(--cardInk);">${f(m)} CLP</span><span style="font-weight:800;font-size:50px;color:var(--cardNum);">${conv(x, m)} ${c.unit}</span></div>`).join("")}
  </div>
  <div class="m-h" style="color:#fff">
    <div style="position:absolute;top:1232px;left:70px;right:70px;text-align:center;">
      <div class="s-lead" style="font-weight:700;font-size:40px;">${unitRate(c, x.cur)}</div>
      <div style="margin-top:12px;">${badgeHTML(x.badge, "font-size:26px;")}</div>
    </div>
    <div style="position:absolute;top:1395px;left:70px;right:70px;text-align:center;">${cta(ctaText)}</div>
  </div>
  ${bottom({ ...x, tip: tip || x.tip }, "h")}`;
}
const t3 = (x) => tableStory(x, { tag: `Tasa de las ${x.hh} · ${x.cor.label}`, line1: "Mira cuánto", line2: `recibe <span class="hl">tu gente</span>`, ctaText: "ENVIAR AHORA" });
const c1 = (x) =>
  tableStory(x, {
    tag: `Tasa de las ${x.hh} · ${x.cor.label}`,
    line1: `¿Tu familia está`,
    line2: `en <span class="hl">${x.cor.short}</span>?`,
    ctaText: `COTIZA CHILE → ${x.cor.short.toUpperCase()}`,
    tip: x.cor.tipFixed,
  });

const wrapStory = (inner, T) => `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080,height=1920">
<link rel="stylesheet" href="kit-story.css">
<style>.s-h1,.s-h2,.s-kicker,.s-cta,.s-tag{font-family:"Poppins","Arial",sans-serif}${themeCSS(T)}</style></head>
<body><div id="root">${inner}</div></body></html>`;

export const STORY_TEMPLATES = { t1, t2, t3, c1 };
export const buildStory = (key, x) => wrapStory(STORY_TEMPLATES[key](x), themeOf(x));

// ---------- Post de feed 1080x1350 (tasa de las 9:00) ----------
export function buildFeed(x) {
  const c = x.cor, T = themeOf(x);
  const inner = `
  <div style="position:absolute;inset:0;background:var(--bg);"></div>${decorHTML(T)}
  <img src="assets/photos/${x.photoFeed}" style="position:absolute;left:0;top:0;width:1080px;height:640px;object-fit:cover;object-position:50% 8%;">
  ${K("app-navy", "k-iso app", "top:56px;left:64px;height:92px;")}
  <div style="position:absolute;right:60px;top:84px;transform:rotate(5deg);background:var(--stk);color:var(--stkInk);font-weight:800;font-size:42px;padding:18px 30px;border-radius:24px;box-shadow:0 14px 34px rgba(0,0,0,.3);">Tasa de las ${x.hh}</div>
  <div style="position:absolute;left:0;right:0;top:560px;bottom:0;background:var(--panel);border-radius:70px 70px 0 0;box-shadow:0 -20px 60px rgba(0,0,0,.3);"></div>
  <div style="position:absolute;left:50%;top:500px;transform:translateX(-50%) rotate(-3deg);background:var(--chip);color:var(--chipInk);font-weight:800;font-size:54px;padding:18px 40px;border-radius:999px;white-space:nowrap;box-shadow:0 14px 36px rgba(0,0,0,.35);">${unitRate(c, x.cur)}</div>
  <div class="m-p" style="position:absolute;left:80px;right:80px;top:648px;color:var(--pInk);">
    <div style="display:flex;align-items:center;gap:18px;">${flagsRow(c, 56)}<span class="kicker" style="font-size:26px;">${c.label} · se actualiza cada hora</span></div>
    <div class="lead" style="margin-top:10px;font-weight:600;font-size:38px;">Si envías <b>10.000 CLP</b>, tu contacto recibe</div>
    <div class="big" style="font-weight:800;font-size:100px;letter-spacing:-.02em;line-height:1.1;">${conv(x, 10000)} ${c.unit}</div>
    <div style="margin-top:12px;">${chart(x, 920, 165, { dotR: 10, stroke: 6, labels: false, line: "var(--pAcc)", grid: "rgba(128,128,150,.3)" })}</div>
    <div class="tiny" style="margin-top:2px;">Últimas 24 horas · variación de ${f(((x.mx - x.mn) / x.mn) * 100, 1)} %</div>
    <div style="margin-top:10px;">${badgeHTML(x.badge, "font-size:26px;")}</div>
    <div class="tiny" style="font-weight:500;font-size:23px;line-height:1.35;margin-top:12px;letter-spacing:0;">${x.disclaimer}</div>
  </div>
  <div class="foot" style="position:absolute;left:80px;right:80px;bottom:26px;display:flex;justify-content:space-between;font-weight:600;font-size:24px;color:var(--pDim);"><span>@karduto</span><span>Ejemplo · cotiza en karduto.com</span></div>`;
  return `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080,height=1350">
<link rel="stylesheet" href="kit.css"><style>.kicker,.lead,.tiny,.big{font-family:"Poppins","Arial",sans-serif}.kicker{font-weight:700;letter-spacing:.1em;text-transform:uppercase}.s-cta{font-family:"Poppins"}${themeCSS(T)}</style></head>
<body><div id="root">${inner}</div></body></html>`;
}

export function feedCaption(x) {
  const c = x.cor;
  return `Así está la tasa ${c.label} a las ${x.hh}. 📈
${x.badge ? x.badge.replace("▲ ", "") + ".\n" : ""}
Con 10.000 CLP, tu contacto recibe ${conv(x, 10000)} ${c.unit} (ejemplo con la tasa de este momento).

La tasa se actualiza automáticamente en tiempo real: la verdadera es la que ves en karduto.com. Esta es la del momento de publicación (${x.hh}).

Dato: ${x.tip}
${x.note}.

Cotiza en karduto.com (link en la bio).

#Karduto #Remesas #EnviarDinero #RemesasAVenezuela #VenezolanosEnChile #TasaDelDía`;
}
