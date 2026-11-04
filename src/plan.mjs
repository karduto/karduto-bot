// plan.mjs — decide qué hay que publicar AHORA. Lo usan should-run.mjs (salida rápida) y run.mjs (publicador),
// así los dos siempre opinan lo mismo.
//
// Reglas:
//  · Historia de tasa: se publica si llegamos hasta `storyMaxLateMinutes` (30) después de la hora de su franja.
//    Si no, esa historia se salta (una tasa "de las 09:00" no se muestra a las 10:20).
//  · Post de feed (y TikTok): no tiene tope; si se perdió, se publica en la primera ejecución que llegue ese mismo día.
//  · Cada pieza tiene su propia entrada en state/published.json, para saber qué falta:
//      "AAAA-MM-DD_HH"       → la historia      "AAAA-MM-DD_HH_feed" → el post de feed
//    Una entrada con `claimed` y sin `at` es un "reclamo": alguien ya la está publicando (o murió a medias).
//    Mientras el reclamo sea reciente se respeta (evita duplicados aunque falle el guardado final);
//    pasados STALE_MS se considera abandonado y se reintenta.

export const STALE_MS = 40 * 60000;
export const pad = (n) => String(n).padStart(2, "0");

export function nowLocal(tz, ms = Date.now()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short" }).formatToParts(new Date(ms));
  const o = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return { y: +o.year, mo: +o.month, d: +o.day, h: +o.hour, mi: +o.minute, s: +o.second, date: `${o.year}-${o.month}-${o.day}`, ms: Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour, +o.minute, +o.second) };
}

// "none" = nadie la hizo · "working" = reclamada hace poco · "stale" = reclamo abandonado · "done" = publicada
export function entryStatus(entry, nowMs = Date.now()) {
  if (!entry) return "none";
  if (entry.at) return "done";
  const t = Date.parse(entry.claimed);
  return Number.isFinite(t) && nowMs - t < STALE_MS ? "working" : "stale";
}
export const storyStatus = (state, key, nowMs) => entryStatus(state[key], nowMs);
export function feedStatus(state, key, nowMs) {
  if (state[key]?.post_instagram !== undefined) return "done"; // formato anterior: historia y post en la misma entrada
  return entryStatus(state[key + "_feed"], nowMs);
}
export const isOpen = (s) => s === "none" || s === "stale";

// Franjas con algo pendiente a la hora `now` (hora de Chile). Ordenadas de la más antigua a la más nueva.
export function pendingWork(cfg, state, now, nowMs = Date.now()) {
  const out = [];
  cfg.slots.forEach((slot, slotIndex) => {
    if (slot.hour > now.h) return;
    const key = `${now.date}_${pad(slot.hour)}`;
    const late = (now.h - slot.hour) * 60 + now.mi; // minutos desde el inicio de la franja
    const story = late <= cfg.storyMaxLateMinutes && isOpen(storyStatus(state, key, nowMs));
    const feed = !!slot.alsoFeed && isOpen(feedStatus(state, key, nowMs));
    if (story || feed) out.push({ slotIndex, slot, key, story, feed, late });
  });
  return out;
}

export const describe = (w) => `${pad(w.slot.hour)}:00 ${[w.story && "historia", w.feed && "post"].filter(Boolean).join(" + ")}`;
