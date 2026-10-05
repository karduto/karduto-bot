// templates.mjs — plantillas de historia (1080x1920) y post (1080x1350) con datos reales
const f = (n, d = 0) => n.toLocaleString("es-CL", { minimumFractionDigits: d, maximumFractionDigits: d });

export const CORRIDORS = {
  BS: { from: "CLP", to: "BS", unit: "Bs", label: "Chile → Venezuela", short: "Venezuela", base: 1 },
  PE: { from: "CLP", to: "PEN", unit: "PEN", label: "Chile → Perú", short: "Perú", base: 1000 },
  CO: { from: "CLP", to: "COP", unit: "COP", label: "Chile → Colombia", short: "Colombia", base: 1 },
};

const rateFmt = (c, v) => (c.base === 1000 ? f(v * 1000, 2) : f(v, 4));
const unitRate = (c, cur) => (c.base === 1000 ? `1.000 CLP = ${f(cur * 1000, 2)} ${c.unit}` : `1 CLP = ${f(cur, 4)} ${c.unit}`);

const K = (logo, cls, style) => `<div class="${cls}" style="${style}"><img src="assets/logos/${logo}.png" alt=""></div>`;
const dot = `<span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:#3CE07A;box-shadow:0 0 0 6px rgba(60,224,122,.25);margin-right:14px;vertical-align:middle"></span>`;
const arrow = `<svg viewBox="0 0 24 24" fill="#030357" style="width:36px;height:36px"><path d="M8 4l10 8-10 8z"/></svg>`;
const cta = (t) => `<span class="s-cta">${t} ${arrow}</span>`;
const badgeHTML = (badge, extra = "") =>
  badge
    ? `<div style="display:inline-block;background:rgba(60,224,122,.18);border:3px solid #3CE07A;color:#fff;font-weight:700;font-size:30px;padding:12px 28px;border-radius:999px;${extra}">${badge}</div>`
    : "";

function chart(x, w, h, { dotR = 14, stroke = 8, labels = true } = {}) {
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
  const grid = [0.25, 0.5, 0.75].map((t) => { const y = (padT + t * (h - padT - padB)).toFixed(1); return `<line x1="${padX}" x2="${w - padX}" y1="${y}" y2="${y}" stroke="rgba(255,255,255,.12)" stroke-width="2" stroke-dasharray="6 10"/>`; }).join("");
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block;overflow:visible">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FDBB4A" stop-opacity=".55"/><stop offset="1" stop-color="#FDBB4A" stop-opacity="0"/></linearGradient></defs>
    ${grid}<path d="${area}" fill="url(#g)"/>
    <path d="${line}" fill="none" stroke="#FDBB4A" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>
    ${labels ? `<circle cx="${pts[iMax][0].toFixed(1)}" cy="${pts[iMax][1].toFixed(1)}" r="9" fill="#fff"/><text x="${Math.min(Math.max(pts[iMax][0], 150), w - 150).toFixed(1)}" y="${(pts[iMax][1] - 22).toFixed(1)}" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="30" fill="#fff">máx ${rateFmt(cor, mx)}</text>` : ""}
    <circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="${dotR * 2}" fill="#FDBB4A" opacity=".25"/>
    <circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="${dotR}" fill="#FDBB4A" stroke="#fff" stroke-width="5"/>
  </svg>`;
}

// bloque inferior: dato + horario + aviso de tasa (obligatorio en toda pieza con tasa)
const bottom = (x) => `
  <div style="position:absolute;left:70px;right:70px;bottom:118px;text-align:center;">
    <div style="font-weight:700;font-size:30px;line-height:1.28;color:#FDBB4A;">Dato: ${x.tip}</div>
    <div style="font-weight:600;font-size:28px;color:rgba(255,255,255,.9);margin-top:10px;">${x.note}</div>
    <div style="font-weight:500;font-size:23px;line-height:1.35;color:rgba(255,255,255,.72);margin-top:12px;">${x.disclaimer}</div>
  </div>
  <div class="s-foot" style="bottom:46px;"><span>@karduto</span><span>karduto.com</span></div>`;

const conv = (x, clp) => f(clp * x.cur, 2);

// ---------- T1: foto sorpresa + sticker ----------
function t1(x) {
  const c = x.cor;
  return `
  <div class="s-bg-azul"></div>
  <img src="assets/photos/${x.photo}" style="position:absolute;left:0;top:0;width:1080px;height:980px;object-fit:cover;object-position:50% 6%;">
  ${K("app-navy", "s-k app", "left:70px;top:80px;height:96px;")}
  <div style="position:absolute;right:60px;top:110px;transform:rotate(5deg);background:#030357;color:#FDBB4A;font-weight:800;font-size:46px;padding:20px 34px;border-radius:26px;box-shadow:0 14px 34px rgba(0,0,0,.3);">¡Mira la tasa!</div>
  <div style="position:absolute;left:0;right:0;top:880px;bottom:0;background:linear-gradient(180deg,#1a14b8,#030357 55%);border-radius:80px 80px 0 0;box-shadow:0 -24px 70px rgba(0,0,0,.4);"></div>
  <div style="position:absolute;left:50%;top:800px;transform:translateX(-50%) rotate(-3deg);background:#FDBB4A;color:#030357;font-weight:800;font-size:58px;padding:22px 46px;border-radius:999px;white-space:nowrap;box-shadow:0 16px 40px rgba(0,0,0,.35);">${unitRate(c, x.cur)}</div>
  <div style="position:absolute;left:70px;right:70px;top:960px;text-align:center;">
    <div class="s-kicker" style="font-size:28px;">${dot}Tasa de las ${x.hh} · ${c.label}</div>
    <div class="s-lead" style="margin-top:20px;color:#fff;font-weight:600;font-size:40px;">Si envías <b>10.000 CLP</b>, tu contacto recibe</div>
    <div style="font-weight:800;font-size:110px;color:var(--mango);letter-spacing:-.02em;line-height:1.1;margin-top:4px;">${conv(x, 10000)} ${c.unit}</div>
    <div style="margin-top:18px;">${badgeHTML(x.badge)}</div>
  </div>
  <div style="position:absolute;left:70px;right:70px;top:1370px;text-align:center;">${cta("COTIZAR AHORA")}</div>
  ${bottom(x)}`;
}

// ---------- T2: tendencia 24 h ----------
function t2(x) {
  const c = x.cor;
  const chips = [["Mín.", rateFmt(c, x.mn), "rgba(255,255,255,.14)", "#fff"], ["Ahora", rateFmt(c, x.cur), "#FDBB4A", "#030357"], ["Máx.", rateFmt(c, x.mx), "rgba(255,255,255,.14)", "#fff"]];
  return `
  <div class="s-bg-grad"></div><div class="s-dots"></div>
  ${K("iso-white", "s-k", "left:70px;top:96px;height:78px;")}
  <img src="assets/photos/${x.photo}" style="position:absolute;right:64px;top:90px;width:340px;height:430px;object-fit:cover;object-position:50% 25%;border-radius:40px;border:9px solid #fff;transform:rotate(4deg);box-shadow:0 20px 50px rgba(0,0,0,.4);">
  <div style="position:absolute;left:70px;top:300px;width:560px;">
    <div class="s-kicker" style="font-size:26px;">${dot}Tasa de las ${x.hh}</div>
    <div class="s-h1" style="margin-top:20px;">Así va<br><span class="hl">la tasa hoy</span></div>
  </div>
  <div style="position:absolute;left:56px;right:56px;top:600px;background:rgba(3,3,87,.62);border-radius:44px;padding:30px 36px 24px;box-shadow:0 24px 60px rgba(0,0,0,.35);">
    <div class="s-tiny" style="margin-bottom:4px;">${c.label} · últimas 24 horas · variación de ${f(((x.mx - x.mn) / x.mn) * 100, 1)} %</div>
    ${chart(x, 920, 380)}
    <div style="display:flex;justify-content:space-between;margin-top:6px;" class="s-tiny"><span>hace 24 h</span><span>ahora</span></div>
  </div>
  <div style="position:absolute;left:56px;right:56px;top:1150px;display:flex;gap:18px;">
    ${chips.map(([l, v, bg, col]) => `<div style="flex:1;background:${bg};color:${col};border-radius:30px;padding:18px 10px;text-align:center;"><div style="font-weight:600;font-size:24px;opacity:.8;">${l}${c.base === 1000 ? " (x1.000)" : ""}</div><div style="font-weight:800;font-size:42px;">${v}</div></div>`).join("")}
  </div>
  <div style="position:absolute;left:70px;right:70px;top:1302px;text-align:center;">
    ${x.badge ? badgeHTML(x.badge, "font-size:28px;") : `<div class="s-lead" style="color:#fff;font-weight:600;font-size:38px;">Hoy <b>10.000 CLP</b> → <b style="color:var(--mango)">${conv(x, 10000)} ${c.unit}</b></div>`}
  </div>
  <div style="position:absolute;left:70px;right:70px;top:1400px;text-align:center;">${cta("COTIZA EN KARDUTO.COM")}</div>
  ${bottom(x)}`;
}

// ---------- tabla de montos sobre retrato (T3 y corredores) ----------
function tableStory(x, { tag, line1, line2, ctaText, tip }) {
  const c = x.cor;
  const rows = [10000, 50000, 100000];
  return `
  <img src="assets/photos/${x.photo}" style="position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover;object-position:50% 20%;">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(74,55,254,.32),rgba(3,3,87,.5) 40%,rgba(3,3,87,.97) 76%);"></div>
  ${K("iso-white", "s-k", "top:96px;left:50%;transform:translateX(-50%);height:78px;")}
  <div style="position:absolute;top:230px;left:70px;right:70px;text-align:center;"><span class="s-tag">${tag}</span></div>
  <div style="position:absolute;top:380px;left:70px;right:70px;text-align:center;"><div class="s-h1">${line1}<br>${line2}</div></div>
  <div style="position:absolute;left:60px;right:60px;top:890px;background:rgba(255,255,255,.96);border-radius:44px;padding:14px 44px;box-shadow:0 24px 60px rgba(0,0,0,.4);">
    ${rows.map((m, i) => `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:10px 0;${i < 2 ? "border-bottom:3px solid #E7E1DC;" : ""}"><span style="font-weight:600;font-size:40px;color:#030357;">${f(m)} CLP</span><span style="font-weight:800;font-size:50px;color:#4A37FE;">${conv(x, m)} ${c.unit}</span></div>`).join("")}
  </div>
  <div style="position:absolute;top:1232px;left:70px;right:70px;text-align:center;">
    <div class="s-lead" style="color:#fff;font-weight:700;font-size:40px;">${unitRate(c, x.cur)}</div>
    <div style="margin-top:12px;">${badgeHTML(x.badge, "font-size:26px;")}</div>
  </div>
  <div style="position:absolute;top:1395px;left:70px;right:70px;text-align:center;">${cta(ctaText)}</div>
  ${bottom({ ...x, tip: tip || x.tip })}`;
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

const wrapStory = (inner) => `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080,height=1920">
<link rel="stylesheet" href="kit-story.css">
<style>.s-h1,.s-h2,.s-kicker,.s-cta,.s-tag{font-family:"Poppins","Arial",sans-serif}</style></head>
<body><div id="root">${inner}</div></body></html>`;

export const STORY_TEMPLATES = { t1, t2, t3, c1 };
export const buildStory = (key, x) => wrapStory(STORY_TEMPLATES[key](x));

// ---------- Post de feed 1080x1350 (tasa de las 9:00) ----------
export function buildFeed(x) {
  const c = x.cor;
  const inner = `
  <div style="position:absolute;inset:0;background:#030357;"></div>
  <img src="assets/photos/${x.photoFeed}" style="position:absolute;left:0;top:0;width:1080px;height:640px;object-fit:cover;object-position:50% 8%;">
  ${K("app-navy", "k-iso app", "top:56px;left:64px;height:92px;")}
  <div style="position:absolute;right:60px;top:84px;transform:rotate(5deg);background:#030357;color:#FDBB4A;font-weight:800;font-size:42px;padding:18px 30px;border-radius:24px;box-shadow:0 14px 34px rgba(0,0,0,.3);">Tasa de las ${x.hh}</div>
  <div style="position:absolute;left:0;right:0;top:560px;bottom:0;background:linear-gradient(180deg,#1a14b8,#030357 50%);border-radius:70px 70px 0 0;"></div>
  <div style="position:absolute;left:50%;top:500px;transform:translateX(-50%) rotate(-3deg);background:#FDBB4A;color:#030357;font-weight:800;font-size:54px;padding:18px 40px;border-radius:999px;white-space:nowrap;box-shadow:0 14px 36px rgba(0,0,0,.35);">${unitRate(c, x.cur)}</div>
  <div style="position:absolute;left:80px;right:80px;top:664px;">
    <div class="kicker" style="font-size:26px;">${dot}${c.label} · se actualiza cada hora</div>
    <div class="lead" style="margin-top:10px;color:#fff;font-weight:600;font-size:38px;">Si envías <b>10.000 CLP</b>, tu contacto recibe</div>
    <div style="font-weight:800;font-size:100px;color:var(--mango);letter-spacing:-.02em;line-height:1.1;">${conv(x, 10000)} ${c.unit}</div>
    <div style="margin-top:12px;">${chart(x, 920, 190, { dotR: 10, stroke: 6, labels: false })}</div>
    <div class="tiny" style="margin-top:2px;">Últimas 24 horas · variación de ${f(((x.mx - x.mn) / x.mn) * 100, 1)} %</div>
    <div style="margin-top:10px;">${badgeHTML(x.badge, "font-size:26px;")}</div>
    <div style="font-weight:500;font-size:23px;line-height:1.35;color:rgba(255,255,255,.75);margin-top:12px;">${x.disclaimer}</div>
  </div>
  <div class="foot" style="bottom:36px;"><span>@karduto</span><span>Ejemplo · cotiza en karduto.com</span></div>`;
  return `<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=1080,height=1350">
<link rel="stylesheet" href="kit.css"><style>.kicker{font-family:"Poppins","Arial",sans-serif}</style></head>
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
