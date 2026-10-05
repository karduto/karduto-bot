// run.mjs — orquestador. Lo ejecuta GitHub Actions cada hora (y tú a mano para probar).
// Flags: --dry (solo genera la imagen)  --preview (genera todas las plantillas a preview/)
//        --check (prueba el token de Metricool: crea un borrador y lo borra)  --hour=9 --date=2026-10-05 (forzar)
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { getSeries, ageMinutes } from "./data.mjs";
import { hoursNote, tipFor, COLOMBIA_TIP, disclaimer } from "./info.mjs";
import { CORRIDORS, buildStory, buildFeed, feedCaption } from "./templates.mjs";
import { renderPage, closeBrowser } from "./render.mjs";
import { createPost, deletePost } from "./metricool.mjs";

const cfg = JSON.parse(fs.readFileSync("config.json", "utf8"));
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const DRY = !!args.dry || process.env.DRY_RUN === "true";
const FORCE_HOUR = args.hour ?? (process.env.FORCE_HOUR || undefined);
const FORCE_DATE = args.date ?? (process.env.FORCE_DATE || undefined);
const forced = FORCE_HOUR !== undefined || FORCE_DATE !== undefined;
const TZ = cfg.timezone;

function nowLocal(ms = Date.now()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short" }).formatToParts(new Date(ms));
  const o = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return { y: +o.year, mo: +o.month, d: +o.day, h: +o.hour, mi: +o.minute, s: +o.second, date: `${o.year}-${o.month}-${o.day}`, ms: Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour, +o.minute, +o.second) };
}
const pad = (n) => String(n).padStart(2, "0");
const stamp = (t) => `${t.date}T${pad(t.h)}:${pad(t.mi)}:${pad(t.s)}`;

let now = nowLocal();
if (FORCE_DATE) { const [y, m, d] = FORCE_DATE.split("-").map(Number); now = { ...now, y, mo: m, d, date: FORCE_DATE, ms: Date.UTC(y, m - 1, d, now.h, now.mi, now.s) }; }
if (FORCE_HOUR !== undefined) now = { ...now, h: Number(FORCE_HOUR), mi: 5 };
const weekday = new Date(Date.UTC(now.y, now.mo - 1, now.d)).getUTCDay();
const dayOfYear = Math.floor((Date.UTC(now.y, now.mo - 1, now.d) - Date.UTC(now.y, 0, 0)) / 86400000);

const PHOTOS = {
  t1: ["tasa_sorpresa_amarillo.jpg", "tasa_mujer_celular.jpg"],
  t2: ["tasa_mujer_celular.jpg", "tasa_sorpresa_amarillo.jpg"],
  t3: ["tasa_hombre_alegre.jpg"],
  c1: { PE: ["tasa_peru.jpg"], CO: ["tasa_colombia.jpg"] },
};
const pick = (arr, n) => arr[n % arr.length];

async function buildContext(slot, slotIndex) {
  const code = slot.corridor;
  const cor = { ...CORRIDORS[code], tipFixed: code === "CO" ? COLOMBIA_TIP : undefined };
  const data = await getSeries(cor.from, cor.to);
  if (!forced) {
    const age = ageMinutes(data.fecha, now.ms);
    if (age > cfg.maxRateAgeMinutes) throw new Error(`La tasa ${cor.label} tiene ${Math.round(age)} min de antigüedad (límite ${cfg.maxRateAgeMinutes}). No publico para no mostrar una tasa vieja.`);
  }
  const photos = slot.template === "c1" ? PHOTOS.c1[code] : PHOTOS[slot.template];
  return {
    ...data, cor,
    photo: pick(photos, dayOfYear + slotIndex),
    photoFeed: pick(PHOTOS.t1, dayOfYear),
    tip: tipFor(dayOfYear, slotIndex),
    note: hoursNote(weekday, slot.hour),
    disclaimer: disclaimer(data.hh),
  };
}

const sh = (c) => execSync(c, { stdio: "inherit" });
function gitPush(message) {
  sh("git add -A out state");
  try { execSync("git diff --cached --quiet"); return false; } catch { /* hay cambios */ }
  sh(`git commit -m "${message}"`);
  for (let i = 0; i < 3; i++) {
    try { sh("git pull --rebase --autostash"); sh("git push"); return true; } catch (e) { if (i === 2) throw e; }
  }
}

async function waitPublic(url) {
  for (let i = 0; i < 18; i++) {
    const r = await fetch(url, { method: "HEAD", cache: "no-store" }).catch(() => null);
    if (r && r.ok) return;
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error("La imagen no quedó pública a tiempo: " + url);
}
const rawUrl = (file) => `https://raw.githubusercontent.com/${process.env.GITHUB_REPOSITORY}/${process.env.GITHUB_REF_NAME || "main"}/out/${file}`;

function prune() {
  const limit = Date.UTC(now.y, now.mo - 1, now.d) - cfg.keepDays * 86400000;
  for (const f of fs.existsSync("out") ? fs.readdirSync("out") : []) {
    const m = f.match(/^(\d{4})-(\d{2})-(\d{2})_/);
    if (m && Date.UTC(+m[1], +m[2] - 1, +m[3]) < limit) fs.unlinkSync(path.join("out", f));
  }
}

async function main() {
  if (args.check) {
    const when = stamp(nowLocal(Date.now() + 86400000 * 2));
    const url = `https://raw.githubusercontent.com/${process.env.GITHUB_REPOSITORY}/${process.env.GITHUB_REF_NAME || "main"}/assets/logos/app-navy.png`;
    const p = await createPost({ imageUrl: url, type: "STORY", when, timezone: TZ, draft: true });
    console.log("Borrador de prueba creado, id:", p.id);
    if (p.id) { await deletePost(p.id); console.log("Borrador de prueba borrado. El token de Metricool funciona."); }
    return;
  }

  if (args.preview) {
    fs.mkdirSync("preview", { recursive: true });
    for (const [i, slot] of cfg.slots.entries()) {
      const x = await buildContext(slot, i);
      const name = `preview/${pad(slot.hour)}_${slot.corridor}_${slot.template}`;
      await renderPage(buildStory(slot.template, x), { width: 1080, height: 1920, out: `${name}_story.jpg` });
      if (slot.alsoFeed) await renderPage(buildFeed(x), { width: 1080, height: 1350, out: `${name}_feed.jpg` });
      console.log("preview", name);
    }
    return;
  }

  const slotIndex = cfg.slots.findIndex((s) => s.hour === now.h);
  if (slotIndex < 0) { console.log(`Hora local ${now.h}: no hay publicación programada para esta hora.`); return; }
  if (!forced && now.mi > cfg.maxLateMinutes) { console.log(`Llegué tarde (minuto ${now.mi}). Salto esta hora para no desordenar.`); return; }
  const slot = cfg.slots[slotIndex];
  if (!DRY && !process.env.METRICOOL_TOKEN) { console.log("Aún no hay METRICOOL_TOKEN configurado: el bot está en pausa (no genera ni publica nada)."); return; }
  const key = `${now.date}_${pad(slot.hour)}`;
  const statePath = "state/published.json";
  const state = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, "utf8")) : {};
  if (state[key] && !DRY) { console.log("Ya publicado:", key); return; }

  const x = await buildContext(slot, slotIndex);
  const storyFile = `${key}_${slot.corridor}_story.jpg`;
  await renderPage(buildStory(slot.template, x), { width: 1080, height: 1920, out: path.join("out", storyFile) });
  const files = [{ kind: "STORY", file: storyFile }];
  if (slot.alsoFeed) {
    const feedFile = `${key}_${slot.corridor}_feed.jpg`;
    await renderPage(buildFeed(x), { width: 1080, height: 1350, out: path.join("out", feedFile) });
    files.push({ kind: "POST", file: feedFile, text: feedCaption(x) });
  }
  console.log("Generado:", files.map((f) => f.file).join(", "), "· tasa", x.cur, "de las", x.hh);
  if (DRY) { console.log("Modo prueba (--dry): no publico nada."); return; }

  gitPush(`imágenes ${key}`);
  const when = stamp(nowLocal(Date.now() + cfg.publishDelayMinutes * 60000));
  const result = {};
  for (const f of files) {
    const url = rawUrl(f.file);
    await waitPublic(url);
    const p = await createPost({ imageUrl: url, type: f.kind, when, timezone: TZ, text: f.text || "" });
    result[f.kind.toLowerCase()] = p.id ?? "ok";
    console.log(`Programado ${f.kind} para ${when}:`, p.id);
  }
  state[key] = { ...result, at: new Date().toISOString() };
  fs.mkdirSync("state", { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  prune();
  gitPush(`estado ${key}`);
}

try { await main(); } catch (e) { console.error("ERROR:", e.message); process.exitCode = 1; } finally { await closeBrowser(); }
