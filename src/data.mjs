// data.mjs — lee la API pública de tasas de karduto.com y calcula estadísticas de las últimas 24 h
export async function getSeries(from, to) {
  const base = `https://api.karduto.com/api/tasa/listaiden/${from}/${to}`;
  const pages = await Promise.all(
    [1, 2].map(async (p) => {
      const r = await fetch(`${base}?page=${p}`, { signal: AbortSignal.timeout(20000) });
      if (!r.ok) throw new Error(`API de tasas ${from}/${to} página ${p}: HTTP ${r.status}`);
      return r.json();
    })
  );
  const rows = pages
    .flatMap((p) => p.data)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-24);
  if (rows.length < 12) throw new Error(`API de tasas ${from}/${to}: solo ${rows.length} registros`);
  const rates = rows.map((r) => Number(r.monto));
  const cur = rates[rates.length - 1];
  const mx = Math.max(...rates);
  const mn = Math.min(...rates);
  const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
  const last = rows[rows.length - 1];
  const hh = last.fecha.slice(11, 13) + ":" + last.fecha.slice(14, 16);
  // El badge solo aparece si es verdad con los datos reales
  const badge =
    cur >= mx - 1e-12 ? "▲ La tasa más alta de las últimas 24 h" : cur > avg ? "▲ Sobre el promedio de las últimas 24 h" : "";
  return { rows, rates, cur, mx, mn, avg, hh, fecha: last.fecha, badge };
}

// minutos entre el último registro (hora de Chile) y "ahora" (hora de Chile, como números)
export function ageMinutes(fecha, nowLocalMs) {
  const [d, t] = fecha.split(" ");
  const [Y, M, D] = d.split("-").map(Number);
  const [h, m, s] = t.split(":").map(Number);
  return (nowLocalMs - Date.UTC(Y, M - 1, D, h, m, s)) / 60000;
}
