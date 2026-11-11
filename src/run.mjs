// run.mjs — orquestador. Lo ejecuta GitHub Actions cada hora (y tú a mano para probar).
// Flags: --dry (solo genera la imagen)  --preview (genera todas las plantillas a preview/)
//        --check (prueba el token de Metricool: crea un borrador y lo borra)  --hour=9 --date=2026-10-05 (forzar)
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { getSeries, ageMinutes } from "./data.mjs";
import { hoursNote, tipFor, COLOMBIA_TIP, disclaimer } from "./info.mjs";
import { CORRIDORS, buildStory, buildFeed, feedCaption } from "./templates.mjs";
import { KARDITO_TEMPLATES } from "./kardito.mjs";
// plantillas con Kardito (kd, kc) o las de siempre (t1, t2, t3, c1)
const storyHtml = (key, x) => (KARDITO_TEMPLATES[key] ? KARDITO_TEMPLATES[key](x) : buildStory(key, x));
import { renderPage, closeBrowser } from "./render.mjs";
import { createPost, deletePost } from "./metricool.mjs";
import { nowLocal as nowIn, pad, pendingWork, describe, isOpen, storyStatus, feedStatus } from "./plan.mjs";
import { reason } from "./net.mjs";

const cfg = JSON.parse(fs.readFileSync("config.json", "utf8"));
const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? true]; }));
const DRY = !!args.dry || process.env.DRY_RUN === "true";
const FORCE_HOUR = args.hour ?? (process.env.FORCE_HOUR || undefined);
const FORCE_DATE = args.date ?? (process.env.FORCE_DATE || undefined);
const forced = FORCE_HOUR !== undefined || FORCE_DATE !== undefined;
const TZ = cfg.timezone;

const nowLocal = (ms = Date.now()) => nowIn(TZ, ms);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// escribe en el log y también en la pantalla "Summary" de la ejecución en GitHub
const summary = (msg) => { console.log(msg); if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, msg + "\n\n"); };
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
  const photos = (slot.template === "c1" ? PHOTOS.c1[code] : PHOTOS[slot.template]) ?? [""];
  return {
    ...data, cor,
    theme: pick(cfg.themes?.[slot.template] ?? ["clasico"], dayOfYear + slotIndex),
    themeFeed: pick(cfg.themes?.feed ?? ["clasico"], dayOfYear),
    photo: pick(photos, dayOfYear + slotIndex),
    rot: dayOfYear + slotIndex,
    photoFeed: pick(PHOTOS.t1, dayOfYear),
    tip: tipFor(dayOfYear, slotIndex),
    note: hoursNote(weekday, slot.hour),
    disclaimer: disclaimer(data.hh),
  };
}

const sh = (c) => execSync(c, { stdio: "inherit" });
// GitHub a veces responde "Internal Server Error" al push (pasó el 4 nov): se reintenta con esperas crecientes (~100 s en total)
const PUSH_WAITS = [0, 3, 8, 15, 30, 45];
async function gitPush(message) {
  sh("git add -A out state");
  try { execSync("git diff --cached --quiet"); return false; } catch { /* hay cambios */ }
  sh(`git commit -m "${message}"`);
  for (let i = 0; i < PUSH_WAITS.length; i++) {
    if (PUSH_WAITS[i]) await sleep(PUSH_WAITS[i] * 1000);
    try { sh("git pull --rebase --autostash"); sh("git push"); return true; }
    catch (e) { console.warn(`⚠️ git push: intento ${i + 1}/${PUSH_WAITS.length} falló`); if (i === PUSH_WAITS.length - 1) throw e; }
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
    if (p.id) { await deletePost(p.id); summary("✅ CHECK OK: el token de Metricool funciona (se creó un borrador de prueba y se borró)."); }
    else summary("⚠️ CHECK: Metricool respondió pero no devolvió el id del borrador: " + JSON.stringify(p.raw).slice(0, 300));
    return;
  }

  if (args.preview) {
    fs.mkdirSync("preview", { recursive: true });
    for (const [i, slot] of cfg.slots.entries()) {
      const x = await buildContext(slot, i);
      const name = `preview/${pad(slot.hour)}_${slot.corridor}_${slot.template}`;
      await renderPage(storyHtml(slot.template, x), { width: 1080, height: 1920, out: `${name}_story.jpg` });
      if (slot.alsoFeed) await renderPage(buildFeed({ ...x, theme: x.themeFeed }), { width: 1080, height: 1350, out: `${name}_feed.jpg` });
      console.log("preview", name);
    }
    return;
  }

  if (!DRY && !process.env.METRICOOL_TOKEN) { summary("⏸️ Aún no hay METRICOOL_TOKEN configurado: el bot está en pausa (no genera ni publica nada)."); return; }
  const statePath = "state/published.json";
  const state = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, "utf8")) : {};
  const writeState = () => { fs.mkdirSync("state", { recursive: true }); fs.writeFileSync(statePath, JSON.stringify(state, null, 2)); };

  // Qué toca: normal = lo que dicta plan.mjs (historias con tope de atraso, post sin tope) · forzado/--dry = la franja de la hora indicada
  let todo;
  if (DRY || forced) {
    const slotIndex = cfg.slots.findIndex((s) => s.hour === now.h);
    if (slotIndex < 0) { summary(`ℹ️ Hora de Chile ${now.date} ${pad(now.h)}:${pad(now.mi)}: no hay publicación programada para esta hora. No se hizo nada.`); return; }
    const slot = cfg.slots[slotIndex], key = `${now.date}_${pad(slot.hour)}`;
    const w = { slotIndex, slot, key, story: true, feed: !!slot.alsoFeed };
    if (!DRY) { w.story = isOpen(storyStatus(state, key, Date.now())); w.feed = w.feed && isOpen(feedStatus(state, key, Date.now())); }
    todo = w.story || w.feed ? [w] : [];
  } else todo = pendingWork(cfg, state, now);
  if (!todo.length) { summary(`ℹ️ Hora de Chile ${now.date} ${pad(now.h)}:${pad(now.mi)}: nada pendiente.`); return; }
  summary(`▶️ Pendiente: ${todo.map(describe).join(", ")}`);

  // 1) Generar las imágenes. Un fallo en una franja (p. ej. la API de tasas caída) no frena a las demás.
  const failures = [], ready = [];
  for (const w of todo) {
    try {
      const x = await buildContext(w.slot, w.slotIndex);
      const files = [];
      if (w.story) {
        const file = `${w.key}_${w.slot.corridor}_story.jpg`;
        await renderPage(storyHtml(w.slot.template, x), { width: 1080, height: 1920, out: path.join("out", file) });
        files.push({ kind: "STORY", file, stateKey: w.key });
      }
      if (w.feed) {
        const file = `${w.key}_${w.slot.corridor}_feed.jpg`;
        await renderPage(buildFeed({ ...x, theme: x.themeFeed }), { width: 1080, height: 1350, out: path.join("out", file) });
        files.push({ kind: "POST", file, text: feedCaption(x), stateKey: `${w.key}_feed` });
      }
      console.log("Generado:", files.map((f) => f.file).join(", "), "· tasa", x.cur, "de las", x.hh);
      ready.push({ w, x, files });
    } catch (e) { failures.push(`${describe(w)}: ${e.message}`); console.error(`❌ ${describe(w)}: ${e.message}`); }
  }
  if (DRY) { console.log("Modo prueba (--dry): no publico nada."); if (failures.length) throw new Error(failures.join(" || ")); return; }

  if (ready.length) {
    // 2) RECLAMAR antes de publicar: el reclamo viaja en el mismo push que las imágenes. Si ese push falla, no se publica nada
    //    (se reintenta en la próxima ejecución). Si más adelante falla el guardado final, el reclamo evita que otra ejecución duplique.
    const claimed = new Date().toISOString();
    for (const r of ready) for (const f of r.files) state[f.stateKey] = { claimed };
    writeState();
    await gitPush(`imágenes ${ready.map((r) => r.w.key).join(" ")}`);

    // 3) Programar en Metricool
    const when = stamp(nowLocal(Date.now() + cfg.publishDelayMinutes * 60000));
    for (const { w, x, files } of ready) for (const f of files) {
      const result = {};
      try {
        const url = rawUrl(f.file);
        await waitPublic(url);
        // Instagram es lo esencial; Facebook y TikTok se intentan aparte para que un fallo no bloquee a Instagram
        const nets = (cfg.networks?.[f.kind === "STORY" ? "story" : "post"] ?? ["instagram"]);
        for (const network of nets) {
          try {
            const p = await createPost({ imageUrl: url, type: f.kind, when, timezone: TZ, text: f.text || "", network });
            result[`${f.kind.toLowerCase()}_${network}`] = p.id ?? "ok";
            summary(`✅ Programado ${f.kind} en ${network} (${w.slot.corridor}, tasa de las ${x.hh}: ${x.cur}) para ${when} · id Metricool ${p.id}`);
          } catch (e) {
            if (network === "instagram") throw e;
            summary(`⚠️ ${f.kind} en ${network} no se pudo programar: ${e.message.slice(0, 300)}`);
          }
        }
        state[f.stateKey] = { ...result, at: new Date().toISOString() };
      } catch (e) {
        // Instagram va primero: si falló, no quedó nada programado y se libera el reclamo para reintentar
        if (Object.keys(result).length) state[f.stateKey] = { ...result, at: new Date().toISOString() }; else delete state[f.stateKey];
        failures.push(`${describe(w)} (${f.kind}): ${e.message}`);
        console.error(`❌ ${describe(w)} ${f.kind}: ${e.message}`);
      }
    }

    // 4) Guardar el estado (con reintentos largos)
    writeState();
    prune();
    try { await gitPush(`estado ${ready.map((r) => r.w.key).join(" ")}`); }
    catch (e) { failures.push(`no pude guardar el estado en GitHub (lo publicado queda protegido por el reclamo): ${reason(e)}`); }
  }
  if (failures.length) throw new Error(failures.join(" || "));
}

try { await main(); } catch (e) { console.error("ERROR:", e.message); process.exitCode = 1; } finally { await closeBrowser(); }
