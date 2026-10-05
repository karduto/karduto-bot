// metricool.mjs — publica en Instagram vía la API REST de Metricool
// Auth (según la doc oficial): header X-Mc-Auth = userToken, y query params userId y blogId.
const BASE = "https://app.metricool.com/api";

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta el secreto ${name} (GitHub → Settings → Secrets and variables → Actions)`);
  return v;
}

async function mc(pathname, { method = "GET", query = {}, body } = {}) {
  const q = new URLSearchParams({ userId: env("METRICOOL_USER_ID"), blogId: env("METRICOOL_BLOG_ID"), ...query });
  const res = await fetch(`${BASE}${pathname}?${q}`, {
    method,
    headers: { "X-Mc-Auth": env("METRICOOL_TOKEN"), "Content-Type": "application/json", Accept: "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(60000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Metricool ${method} ${pathname} → HTTP ${res.status}: ${text.slice(0, 500)}`);
  try { return JSON.parse(text); } catch { return text; }
}

// Metricool valida que la URL sea pública y la copia a su propio repositorio
export async function normalizeImage(url) {
  try {
    const r = await mc("/actions/normalize/image/url", { query: { url } });
    if (typeof r === "string" && r.startsWith("http")) return r;
    const found = r && typeof r === "object" ? Object.values(r).find((v) => typeof v === "string" && v.startsWith("http")) : null;
    return found || url;
  } catch (e) {
    console.warn("normalize falló, uso la URL directa:", e.message);
    return url;
  }
}

export async function createPost({ imageUrl, type, when, timezone, text = "", draft = false }) {
  const media = await normalizeImage(imageUrl);
  const body = {
    publicationDate: { dateTime: when, timezone },
    text,
    firstCommentText: "",
    providers: [{ network: "instagram" }],
    media: [media],
    mediaAltText: [],
    autoPublish: !draft,
    draft,
    shortener: false,
    saveExternalMediaFiles: false,
    instagramData: { type, autoPublish: !draft, showReelOnFeed: true, isAiGenerated: false },
  };
  const r = await mc("/v2/scheduler/posts", { method: "POST", body });
  const post = r?.data ?? r;
  return { id: post?.id, uuid: post?.uuid, raw: post };
}

export async function deletePost(id) {
  return mc(`/v2/scheduler/posts/${id}`, { method: "DELETE" });
}
