# DDG website + Control — where things are

> From the claude.ai Project doc `claude/ddg-website.md` (30 Oct 2026), updated 11 Nov 2026.

- Public website: https://ddg.limited (also ddg-control.replit.app). Pages: home (businesses, live followers, charity box with RSPCA Queensland donate link, DDG Build), /creative, /start (enquiry form).
- DDG Control: a secret path on the same domain (set once in `vite.config.ts` as CONTROL_DIR and matched in `.replit-artifact/artifact.toml`), email + password + Google Authenticator. Not linked anywhere on the website; the website bundle does not contain the path.
- Same Replit app (DDG-Control). One build, two entry pages.
- Website words: `artifacts/ddg-control/site/content.ts`. Public links: `src/lib/public-info.ts`.
- Public data endpoint: `/api/public/summary` — followers per platform, Coffee charity and bags, DDG Build opening state. Cached 5 min.
- Bots use https://ddg-control.replit.app/api (works the same on ddg.limited/api). Bot instructions: claude.ai Project doc `claude/grok-bot-push-card.md`.
- Not on the site yet (as of 30 Oct): Facebook and TikTok links, company email. Check `public-info.ts` for the current state.
