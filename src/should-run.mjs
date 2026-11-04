// should-run.mjs — decide en 1 segundo si esta ejecución tiene algo que hacer (para no instalar nada en vano).
// Escribe go=true|false en $GITHUB_OUTPUT. Usa la misma lógica que run.mjs (plan.mjs).
import fs from "node:fs";
import { nowLocal, pad, pendingWork, describe } from "./plan.mjs";
const cfg = JSON.parse(fs.readFileSync("config.json", "utf8"));
// Un disparo externo (modo=publicar, sin hora ni fecha forzadas) se trata como uno programado: sale rápido si no hay nada pendiente.
// Solo es "manual" (se salta la revisión) si alguien pidió vista previa, check o forzó hora/fecha.
const manual = process.env.EVENT === "workflow_dispatch" && !(process.env.MODO === "publicar" && !process.env.FORCE_HOUR && !process.env.FORCE_DATE);
const now = nowLocal(cfg.timezone);
const state = fs.existsSync("state/published.json") ? JSON.parse(fs.readFileSync("state/published.json", "utf8")) : {};
let go = true, why = "", todo = "";
if (!manual) {
  if (!process.env.METRICOOL_TOKEN) { go = false; why = "falta METRICOOL_TOKEN (bot en pausa)"; }
  else {
    const work = pendingWork(cfg, state, now);
    if (!work.length) { go = false; why = `nada pendiente: las historias se publican hasta ${cfg.storyMaxLateMinutes} min después de su hora y el post del día se recupera si falta`; }
    else todo = work.map(describe).join(", ");
  }
}
const at = `${now.date} ${now.h}:${pad(now.mi)}`;
const msg = go ? `▶️ Hay trabajo: ${at} (Chile)${todo ? " → " + todo : ""}` : `⏭️ Nada que hacer (${why}). Hora de Chile ${at}`;
console.log(msg);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, msg + "\n\n");
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `go=${go}\n`);
