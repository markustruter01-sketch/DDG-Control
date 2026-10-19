export function formatFinanceCents(value: number): string {
  return formatCurrencyCents(value, 'AUD');
}

export function formatCurrentDisplayName(value: string): string {
  return value
    .replace(/\bOllie\b/g, 'Heimdall')
    .replace(/\bOLLIE\b/g, 'HEIMDALL');
}

export function dollarsToCents(value: string): number {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    throw new Error('Enter an amount like 12.34');
  }
  const [whole, fraction = ''] = value.split('.');
  const cents = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, '0') || '0');
  if (cents > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('Enter an amount like 12.34');
  }
  return Number(cents);
}

export function centsToDollarInput(value: number): string {
  const digits = String(value);
  return digits.length < 3
    ? `0.${digits.padStart(2, '0')}`
    : `${digits.slice(0, -2)}.${digits.slice(-2)}`;
}

export function currentBrisbaneDate(): string {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Brisbane',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === 'year')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  return `${year}-${month}-${day}`;
}

export function formatDueDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = Number(match[2]);
  if (month < 1 || month > 12) return value;
  return `${Number(match[3])} ${months[month - 1]} ${match[1]}`;
}

const completedDateFormatter = new Intl.DateTimeFormat('en-AU', {
  timeZone: 'Australia/Brisbane',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const brisbaneDateTimeFormatter = new Intl.DateTimeFormat('en-AU', {
  timeZone: 'Australia/Brisbane',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function formatCompletedDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : completedDateFormatter.format(date);
}

export function formatBrisbaneDateTime(value: string | null): string {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : brisbaneDateTimeFormatter.format(date);
}

export function formatCurrencyCents(value: number, currency: 'AUD' | 'USD'): string {
  const absoluteValue = Math.abs(value) / 100;
  const formatted = currency === 'AUD'
    ? new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absoluteValue)
    : `US$${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(absoluteValue)}`;
  return value < 0 ? `−${formatted}` : formatted;
}

export function formatFigure(value: number, unit: string): string {
  if (unit === 'aud_cents') return formatCurrencyCents(value, 'AUD');
  if (unit === 'usd_cents') return formatCurrencyCents(value, 'USD');
  return new Intl.NumberFormat('en-AU', { maximumFractionDigits: 0 }).format(value);
}

export function formatAgo(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === 0) return 'time unknown';
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return 'time unknown';
  const minutes = Math.max(0, Math.floor((Date.now() - time) / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours} h ago`;
  return `${Math.floor(hours / 24)} days ago`;
}
