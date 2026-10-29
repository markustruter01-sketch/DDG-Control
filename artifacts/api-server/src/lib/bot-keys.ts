/**
 * One key per Grok bot, so every push and message is signed by the bot that sent it.
 * Each bot's key is a Replit secret named after the bot: FREYA, TYR, HEIMDALL, PLUTUS, ...
 * DDG_BOT_KEY is Claude's own key (signed as "claude").
 */
const BOTS = ['heimdall', 'freya', 'tyr', 'plutus', 'hermes', 'harald', 'mimir', 'njord', 'daedalus'] as const;
const MIN_KEY_LENGTH = 24;

export function botKeys(): Array<{ bot: string; key: string }> {
  const keys: Array<{ bot: string; key: string }> = BOTS.map((bot) => ({ bot, key: process.env[bot.toUpperCase()]?.trim() ?? '' }));
  keys.push({ bot: 'claude', key: process.env.DDG_BOT_KEY?.trim() ?? '' });
  return keys.filter((k) => k.key.length >= MIN_KEY_LENGTH);
}
