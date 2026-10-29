/**
 * One key per Grok bot, so every push and message is signed by the bot that sent it:
 *   DDG_BOT_KEYS = "freya:<key>,tyr:<key>,heimdall:<key>"
 *   DDG_BOT_KEY  = Claude's own key (signed as "claude")
 */
export function botKeys(): Array<{ bot: string; key: string }> {
  const keys = (process.env.DDG_BOT_KEYS ?? '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const at = entry.indexOf(':');
      return { bot: entry.slice(0, at).trim().toLowerCase(), key: entry.slice(at + 1).trim() };
    })
    .filter((k) => /^[a-z]{2,20}$/.test(k.bot) && k.key.length >= 24);
  const claude = process.env.DDG_BOT_KEY?.trim();
  if (claude && claude.length >= 24) keys.push({ bot: 'claude', key: claude });
  return keys;
}
