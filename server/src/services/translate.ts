// Auto-translation for admin-entered package content. Backed by a self-hosted LibreTranslate
// instance (see /docker/umrahcompanion/docker-compose.yml, service "translate") so the admin
// only has to type English — Hindi and Urdu are filled in automatically unless the admin has
// already typed something into those fields themselves.
//
// TRANSLATE_API_URL is unset in local dev by default; when it's missing (or the service is
// unreachable/slow) auto-translation is skipped and the English text is copied across instead —
// a save should never fail, and a field should never end up blank, just because the translator
// is down.

const TRANSLATE_API_URL = process.env.TRANSLATE_API_URL; // e.g. http://translate:5000/translate
const TRANSLATE_TIMEOUT_MS = 8000;

async function translateOne(text: string, target: 'hi' | 'ur'): Promise<string | null> {
  if (!TRANSLATE_API_URL || !text.trim()) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TRANSLATE_TIMEOUT_MS);
  try {
    const res = await fetch(TRANSLATE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'en', target, format: 'text' }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { translatedText?: string };
    return data.translatedText?.trim() || null;
  } catch (err) {
    console.error(`Auto-translate to "${target}" failed:`, err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Translates English text into Hindi and Urdu. Falls back to the English text itself for
 * whichever language fails, so a translator outage never blocks a save or leaves a field blank. */
export async function autoTranslate(en: string): Promise<{ hi: string; ur: string }> {
  const [hi, ur] = await Promise.all([translateOne(en, 'hi'), translateOne(en, 'ur')]);
  return { hi: hi ?? en, ur: ur ?? en };
}

/**
 * Mutates `fields` in place: for every `${base}En` present, fills `${base}Hi` / `${base}Ur`
 * with an auto-translation whenever the admin left them blank. A Hi/Ur value the admin typed
 * themselves is never overwritten.
 */
export async function autoFillTranslations(fields: Record<string, unknown>, bases: string[]): Promise<void> {
  await Promise.all(
    bases.map(async (base) => {
      const en = fields[`${base}En`];
      if (typeof en !== 'string' || !en.trim()) return;
      const hi = fields[`${base}Hi`];
      const ur = fields[`${base}Ur`];
      const needsHi = typeof hi !== 'string' || !hi.trim();
      const needsUr = typeof ur !== 'string' || !ur.trim();
      if (!needsHi && !needsUr) return;
      const translated = await autoTranslate(en);
      if (needsHi) fields[`${base}Hi`] = translated.hi;
      if (needsUr) fields[`${base}Ur`] = translated.ur;
    }),
  );
}
