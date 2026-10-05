# karduto-bot

Publica solo, cada hora, las historias de tasa de Karduto (y el post de las 9:00) con la tasa **real** de `api.karduto.com`, a través de Metricool.

- `config.json` → qué se publica a qué hora (hora de Chile) y de qué corredor.
- `src/templates.mjs` → los diseños. `src/info.mjs` → horarios y datos rotativos.
- `.github/workflows/tasa.yml` → el temporizador (GitHub Actions).
- `out/` → imágenes generadas (se limpian solas a los 3 días). `state/published.json` → qué ya se publicó.

Todo lo de tasa lleva el aviso: *tasa del momento de publicación; se actualiza automáticamente en tiempo real; la real es la de karduto.com*.

Secretos necesarios (GitHub → Settings → Secrets and variables → Actions): `METRICOOL_TOKEN`, `METRICOOL_USER_ID`, `METRICOOL_BLOG_ID`.

Pruebas en tu PC: `npm install` · `npx playwright install chromium` · `npm run preview` (deja las imágenes en `preview/`).
