// should-run.mjs — decide en 1 segundo si esta ejecución tiene algo que hacer (para no instalar nada en vano).
// Escribe go=true|false en $GITHUB_OUTPUT. Misma lógica de franja/atraso/estado que run.mjs.
import fs from "node:fs";
const cfg = JSON.parse(fs.readFileSync("config.json", "utf8"));
const manual = process.env.EVENT === "workflow_dispatch";
const parts = new Intl.DateTimeFormat("en-CA", { timeZone: cfg.timezone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(new Date());
const o = Object.fromEntries(parts.map((p) => [p.type, p.value]));
const h = +o.hour, mi = +o.minute, date = `${o.year}-${o.month}-${o.day}`;
const slot = cfg.slots.find((s) => s.hour === h);
const key = `${date}_${String(h).padStart(2, "0")}`;
const state = fs.existsSync("state/published.json") ? JSON.parse(fs.readFileSync("state/published.json", "utf8")) : {};
let go = true, why = "";
if (!manual) {
  if (!slot) { go = false; why = `no hay publicación a las ${h}:00`; }
  else if (mi > cfg.maxLateMinutes) { go = false; why = `llegué tarde (minuto ${mi})`; }
  else if (state[key]) { go = false; why = `${key} ya estaba publicada`; }
  else if (!process.env.METRICOOL_TOKEN) { go = false; why = "falta METRICOOL_TOKEN (bot en pausa)"; }
}
const msg = go ? `▶️ Hay trabajo: ${date} ${h}:${String(mi).padStart(2, "0")} (Chile)` : `⏭️ Nada que hacer (${why}). Hora de Chile ${date} ${h}:${String(mi).padStart(2, "0")}`;
console.log(msg);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, msg + "\n\n");
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `go=${go}\n`);
