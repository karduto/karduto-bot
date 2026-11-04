// net.mjs — fetch con reintentos y con el motivo real del fallo (Node solo dice "fetch failed").
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const reason = (e) => e?.cause?.code || e?.cause?.message || e?.message || String(e);

export async function fetchRetry(url, opts = {}, { tries = 5, waitMs = 3000, timeoutMs = 20000 } = {}) {
  let last;
  for (let i = 1; i <= tries; i++) {
    try {
      const r = await fetch(url, { ...opts, signal: AbortSignal.timeout(timeoutMs) });
      if (r.status < 500) return r;
      last = new Error(`HTTP ${r.status}`);
    } catch (e) { last = e; }
    console.warn(`⚠️ intento ${i}/${tries} falló: ${url} → ${reason(last)}`);
    if (i < tries) await sleep(waitMs * i);
  }
  throw new Error(`Sin respuesta de ${url} tras ${tries} intentos (${reason(last)})`);
}
