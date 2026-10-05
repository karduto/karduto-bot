// demos.mjs — genera demos de plantillas con distintos temas de la paleta (no publica nada)
import { getSeries } from "./data.mjs";
import { hoursNote, tipFor, COLOMBIA_TIP, disclaimer } from "./info.mjs";
import { CORRIDORS, buildStory, buildFeed } from "./templates.mjs";
import { renderPage, closeBrowser } from "./render.mjs";

const LIST = [
  ["03", "t3", "BS", "violeta-electrico", "tasa_hombre_alegre.jpg"],
  ["04", "c1", "PE", "fresa-pop", "tasa_peru.jpg"],
  ["08", "c1", "CO", "azul-calabaza", "tasa_colombia.jpg"],
];
const series = {};
const now = new Date(); const wd = now.getDay();
for (const [n, tpl, code, theme, photo] of LIST) {
  const cor = { ...CORRIDORS[code], tipFixed: code === "CO" ? COLOMBIA_TIP : undefined };
  series[code] ??= await getSeries(cor.from, cor.to);
  const x = { ...series[code], cor, theme, photo, photoFeed: photo, tip: tipFor(280, 2), note: hoursNote(1, 9), disclaimer: disclaimer(series[code].hh) };
  const out = `demos/v3_${n}_${tpl}_${code}_${theme}.jpg`;
  if (tpl === "feed") await renderPage(buildFeed(x), { width: 1080, height: 1350, out });
  else await renderPage(buildStory(tpl, x), { width: 1080, height: 1920, out });
  console.log(out);
}
await closeBrowser();
