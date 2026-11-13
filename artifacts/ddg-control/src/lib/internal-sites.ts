// Control-only links (never imported by the public website: company.ts is, so these stay here).
// DDG Finance's dashboard is a private Replit deployment; Hypest is its published app.
export const INTERNAL_SITES: Record<string, string> = {
  finance: 'https://quant-financial-engineer.replit.app',
  fitness: 'https://ddg-hypest.replit.app',
};

// Admin pages behind each business's own login (checked 12 Nov 2026: the shop's admin is /admin.html;
// /admin shows the storefront). Hypest's admin needs the ADMIN_EMAILS secret.
export const INTERNAL_ADMIN: Record<string, string> = {
  coffee: 'https://cattledogcoffee.com.au/admin.html',
  fitness: 'https://ddg-hypest.replit.app/admin',
};
