// themes.mjs — combinaciones de la paleta oficial de Karduto
// Primarios: Morado Avanza #4A37FE · Azul profundo #030357 · Blanco #FFFFFF
// Secundarios: Celeste #56CBFF · Violeta #AE25FD · Fresa #F92257 · Mango #FDBB4A · Calabaza #F66220 · Perla #E7E1DC
export const C = { morado: "#4A37FE", azul: "#030357", blanco: "#FFFFFF", celeste: "#56CBFF", violeta: "#AE25FD", fresa: "#F92257", mango: "#FDBB4A", calabaza: "#F66220", perla: "#E7E1DC" };

// valores por defecto = tema oscuro clásico (morado → azul, acento mango)
const base = {
  bg: `linear-gradient(160deg,${C.morado} 0%,#2a1fc9 45%,${C.azul} 100%)`,
  decor: "",
  panel: `linear-gradient(180deg,#1a14b8,${C.azul} 55%)`,
  scrim: `linear-gradient(180deg,rgba(74,55,254,.32),rgba(3,3,87,.5) 40%,rgba(3,3,87,.97) 76%)`,
  ink: "#fff", ink2: "rgba(255,255,255,.88)", dim: "rgba(255,255,255,.72)",
  acc: C.mango, accInk: C.azul,
  chip: C.mango, chipInk: C.azul, stk: C.azul, stkInk: C.mango,
  cta: C.mango, ctaInk: C.azul,
  card: "rgba(255,255,255,.96)", cardInk: C.azul, cardNum: C.morado,
  glass: "rgba(3,3,87,.62)", gInk: "#fff", gDim: "rgba(255,255,255,.72)", line: C.mango, grid: "rgba(255,255,255,.12)",
  statBg: "rgba(255,255,255,.14)", statInk: "#fff", statHiBg: C.mango, statHiInk: C.azul,
  tagBg: "rgba(255,255,255,.14)", tagInk: "#fff",
  badgeBg: "rgba(86,203,255,.16)", badgeBd: C.celeste, badgeInk: "#fff",
  dots: 0.09, logo: "iso-white", hAcc: C.mango, hCta: C.mango, hCtaInk: C.azul,
};
function theme(name, over) {
  const t = { name, ...base, ...over };
  // en zonas oscuras (panel inferior / fotos con velo) se usan los tokens "p*"
  t.pInk ??= "#fff"; t.pInk2 ??= "rgba(255,255,255,.88)"; t.pDim ??= "rgba(255,255,255,.72)";
  t.pAcc ??= t.acc; t.pCta ??= t.cta; t.pCtaInk ??= t.ctaInk;
  return t;
}

const tint = (rgb) => `linear-gradient(180deg,rgba(${rgb},.42),rgba(3,3,87,.5) 40%,rgba(3,3,87,.97) 76%)`;
const blob = (color, x, y, s, o = 1) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s}px;border-radius:50%;background:${color};opacity:${o};"></div>`;

export const THEMES = {
  "clasico": theme("Clásico · morado + mango", {}),
  "mango-solar": theme("Mango solar · mango + azul + morado", {
    bg: C.mango, decor: blob(C.morado, 640, -180, 620, 0.9) + blob(C.celeste, -200, -250, 360, 0.9),
    panel: `linear-gradient(180deg,#14127f,${C.azul} 60%)`,
    ink: C.azul, ink2: "rgba(3,3,87,.85)", dim: "rgba(3,3,87,.72)", acc: C.morado, accInk: "#fff",
    chip: C.morado, chipInk: "#fff", stk: C.azul, stkInk: C.mango, cta: C.azul, ctaInk: C.mango,
    pAcc: C.mango, pCta: C.mango, pCtaInk: C.azul,
    glass: "rgba(3,3,87,.92)", line: C.mango, statBg: "rgba(3,3,87,.12)", statInk: C.azul, statHiBg: C.azul, statHiInk: C.mango,
    tagBg: "rgba(3,3,87,.12)", tagInk: C.azul, badgeBg: "rgba(3,3,87,.1)", badgeBd: C.azul, badgeInk: C.azul, dots: 0, logo: "iso-color",
  }),
  "noche-celeste": theme("Noche celeste · azul + celeste + violeta", {
    bg: `radial-gradient(circle at 88% 6%,rgba(174,37,253,.6),transparent 46%),radial-gradient(circle at 5% 70%,rgba(86,203,255,.18),transparent 50%),linear-gradient(170deg,${C.azul} 0%,#0a0a7c 70%,#1a14b8 130%)`,
    panel: `linear-gradient(180deg,#0e0d92,${C.azul} 60%)`,
    scrim: `linear-gradient(180deg,rgba(174,37,253,.4),rgba(3,3,87,.55) 40%,rgba(3,3,87,.97) 76%)`,
    acc: C.celeste, accInk: C.azul, hAcc: C.celeste, hCta: C.celeste, hCtaInk: C.azul, chip: C.celeste, chipInk: C.azul, stk: C.celeste, stkInk: C.azul, cta: C.celeste, ctaInk: C.azul,
    line: C.celeste, glass: "rgba(86,203,255,.1)", statHiBg: C.celeste, statHiInk: C.azul, tagBg: "rgba(86,203,255,.2)",
    badgeBd: C.celeste,
  }),
  "violeta-electrico": theme("Violeta eléctrico · violeta + morado + mango", {
    bg: `linear-gradient(160deg,${C.violeta} 0%,${C.morado} 55%,${C.azul} 125%)`,
    panel: `linear-gradient(180deg,#7a2bf0,#1a0f9c 50%,${C.azul})`,
    scrim: `linear-gradient(180deg,rgba(174,37,253,.5),rgba(74,55,254,.45) 40%,rgba(3,3,87,.97) 78%)`,
    glass: "rgba(3,3,87,.55)", tagBg: "rgba(255,255,255,.18)",
  }),
  "fresa-pop": theme("Fresa pop · azul + fresa + blanco", {
    bg: `radial-gradient(circle at 12% 8%,rgba(249,34,87,.6),transparent 46%),radial-gradient(circle at 95% 55%,rgba(74,55,254,.5),transparent 50%),linear-gradient(170deg,${C.azul},#0a0a6e)`,
    panel: `linear-gradient(180deg,#16147f,${C.azul} 60%)`,
    scrim: `linear-gradient(180deg,rgba(249,34,87,.32),rgba(3,3,87,.55) 40%,rgba(3,3,87,.97) 78%)`,
    acc: "#fff", accInk: C.fresa, chip: C.fresa, chipInk: "#fff", stk: C.fresa, stkInk: "#fff", cta: C.fresa, ctaInk: "#fff",
    pAcc: C.mango, pCta: C.fresa, pCtaInk: "#fff", hAcc: C.mango, hCta: C.fresa, hCtaInk: "#fff", line: C.fresa, glass: "rgba(255,255,255,.07)",
    statHiBg: C.fresa, statHiInk: "#fff", tagBg: "rgba(249,34,87,.28)", badgeBd: C.mango,
  }),
  "calabaza-fuego": theme("Calabaza fuego · calabaza + fresa + azul", {
    bg: `linear-gradient(160deg,${C.calabaza} 0%,${C.fresa} 130%)`,
    panel: `linear-gradient(180deg,#e04a1f,#b3123f 60%)`,
    scrim: `linear-gradient(180deg,rgba(246,98,32,.5),rgba(3,3,87,.55) 45%,rgba(3,3,87,.97) 78%)`,
    ink: "#fff", ink2: "rgba(255,255,255,.95)", dim: "rgba(255,255,255,.85)", acc: C.azul, accInk: "#fff",
    chip: C.azul, chipInk: C.mango, stk: C.azul, stkInk: C.mango, cta: C.azul, ctaInk: "#fff",
    pAcc: C.mango, pCta: C.mango, pCtaInk: C.azul, line: C.mango, glass: "rgba(3,3,87,.9)",
    statBg: "rgba(3,3,87,.25)", statInk: "#fff", statHiBg: C.azul, statHiInk: C.mango, tagBg: "rgba(3,3,87,.35)",
    badgeBg: "rgba(3,3,87,.35)", badgeBd: C.mango, dots: 0.12,
  }),
  "azul-calabaza": theme("Azul profundo + calabaza (acento)", {
    bg: `radial-gradient(circle at 90% 8%,rgba(246,98,32,.45),transparent 42%),linear-gradient(170deg,${C.azul} 0%,#0b0a86 75%,${C.morado} 140%)`,
    panel: `linear-gradient(180deg,#14127f,${C.azul} 60%)`,
    acc: C.calabaza, accInk: "#fff", hAcc: C.calabaza, pAcc: C.calabaza, chip: C.calabaza, chipInk: "#fff", stk: C.calabaza, stkInk: "#fff",
    cta: C.calabaza, ctaInk: "#fff", pCta: C.calabaza, pCtaInk: "#fff", hCta: C.calabaza, hCtaInk: "#fff", line: C.calabaza,
    glass: "rgba(255,255,255,.07)", statHiBg: C.calabaza, statHiInk: "#fff", tagBg: "rgba(246,98,32,.28)",
  }),
  "perla-editorial": theme("Perla editorial · perla + morado + calabaza", {
    bg: C.perla, decor: blob(C.mango, 700, -140, 520, 0.95) + blob(C.calabaza, -200, -250, 360, 0.95),
    panel: C.perla, scrim: tint("246,98,32"), hAcc: C.mango, hCta: C.morado, hCtaInk: "#fff",
    ink: C.azul, ink2: "rgba(3,3,87,.85)", dim: "rgba(3,3,87,.65)", acc: C.morado, accInk: "#fff",
    chip: C.morado, chipInk: "#fff", stk: C.morado, stkInk: "#fff", cta: C.morado, ctaInk: "#fff",
    pInk: C.azul, pInk2: "rgba(3,3,87,.85)", pDim: "rgba(3,3,87,.65)", pAcc: C.morado, pCta: C.morado, pCtaInk: "#fff",
    card: "#fff", cardInk: C.azul, cardNum: C.morado,
    glass: "#fff", gInk: C.azul, gDim: "rgba(3,3,87,.6)", line: C.morado, grid: "rgba(3,3,87,.12)",
    statBg: "rgba(3,3,87,.08)", statInk: C.azul, statHiBg: C.morado, statHiInk: "#fff",
    tagBg: "rgba(3,3,87,.08)", tagInk: C.azul, badgeBg: "rgba(74,55,254,.1)", badgeBd: C.morado, badgeInk: C.azul, dots: 0, logo: "iso-color",
  }),
  "celeste-cielo": theme("Celeste cielo · celeste + azul + morado", {
    bg: `linear-gradient(170deg,${C.celeste} 0%,#8fdcff 100%)`, decor: blob("#fff", 600, -200, 640, 0.35) + blob(C.morado, -200, 1400, 560, 0.18),
    panel: `linear-gradient(180deg,${C.morado},#2a1fc9 70%)`, scrim: tint("86,203,255"), hAcc: C.celeste, hCta: C.celeste, hCtaInk: C.azul,
    ink: C.azul, ink2: "rgba(3,3,87,.88)", dim: "rgba(3,3,87,.7)", acc: C.morado, accInk: "#fff",
    chip: C.celeste, chipInk: C.azul, stk: C.azul, stkInk: "#fff", cta: C.azul, ctaInk: "#fff",
    pAcc: C.mango, pCta: C.mango, pCtaInk: C.azul,
    glass: "#fff", gInk: C.azul, gDim: "rgba(3,3,87,.6)", line: C.morado, grid: "rgba(3,3,87,.12)",
    statBg: "rgba(3,3,87,.1)", statInk: C.azul, statHiBg: C.morado, statHiInk: "#fff", tagBg: "rgba(3,3,87,.12)", tagInk: C.azul,
    badgeBg: "rgba(255,255,255,.55)", badgeBd: C.morado, badgeInk: C.azul, dots: 0, logo: "iso-color",
  }),
  "blanco-limpio": theme("Blanco limpio · blanco + morado + celeste/mango", {
    bg: "#fff", decor: blob(C.celeste, 640, -190, 600, 0.55) + blob(C.mango, -200, -250, 360, 0.7),
    panel: "#fff", scrim: tint("174,37,253"), hAcc: C.celeste, hCta: C.violeta, hCtaInk: "#fff", ink: C.azul, ink2: "rgba(3,3,87,.85)", dim: "rgba(3,3,87,.62)", acc: C.morado, accInk: "#fff",
    chip: C.violeta, chipInk: "#fff", stk: C.morado, stkInk: "#fff", cta: C.morado, ctaInk: "#fff",
    pInk: C.azul, pInk2: "rgba(3,3,87,.85)", pDim: "rgba(3,3,87,.62)", pAcc: C.morado, pCta: C.morado, pCtaInk: "#fff",
    card: C.perla, cardInk: C.azul, cardNum: C.morado,
    glass: C.perla, gInk: C.azul, gDim: "rgba(3,3,87,.6)", line: C.morado, grid: "rgba(3,3,87,.14)",
    statBg: "rgba(3,3,87,.07)", statInk: C.azul, statHiBg: C.morado, statHiInk: "#fff", tagBg: "rgba(3,3,87,.07)", tagInk: C.azul,
    badgeBg: "rgba(86,203,255,.25)", badgeBd: C.celeste, badgeInk: C.azul, dots: 0, logo: "iso-color",
  }),
};

export function themeCSS(t) {
  const vars = Object.entries(t).filter(([k, v]) => !["name", "decor", "logo"].includes(k) && (typeof v === "string" || typeof v === "number")).map(([k, v]) => `--${k}:${v};`).join("");
  const mode = (p, ink, ink2, dim, acc, cta, ctaInk, tagBg, tagInk) => `
${p} .s-h1,${p} .s-h2{color:${ink}} ${p} .hl,${p} .big{color:${acc}!important} ${p} .s-kicker,${p} .kicker{color:${acc}}
${p} .s-lead,${p} .lead{color:${ink2}} ${p} .s-tiny,${p} .tiny{color:${dim}} ${p} .s-cta{background:${cta};color:${ctaInk}} ${p} .s-tag{background:${tagBg};color:${tagInk}}`;
  return `:root{${vars}}` +
    mode("body", "var(--ink)", "var(--ink2)", "var(--dim)", "var(--acc)", "var(--cta)", "var(--ctaInk)", "var(--tagBg)", "var(--tagInk)") +
    mode(".m-p", "var(--pInk)", "var(--pInk2)", "var(--pDim)", "var(--pAcc)", "var(--pCta)", "var(--pCtaInk)", "var(--tagBg)", "var(--tagInk)") +
    mode(".m-h", "#fff", "#fff", "rgba(255,255,255,.78)", "var(--hAcc)", "var(--hCta)", "var(--hCtaInk)", "rgba(255,255,255,.16)", "#fff") +
    `.s-dots{opacity:var(--dots)}`;
}
