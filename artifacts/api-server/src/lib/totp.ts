import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// Google Authenticator codes (TOTP, RFC 6238: SHA-1, 6 digits, 30-second steps).
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const STEP_SECONDS = 30;

export function base32Decode(input: string): Buffer {
  const clean = input.replace(/[\s=-]/g, "").toUpperCase();
  let bits = 0, value = 0;
  const out: number[] = [];
  for (const char of clean) {
    const index = ALPHABET.indexOf(char);
    if (index < 0) throw new Error("invalid base32");
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) { out.push((value >>> (bits - 8)) & 0xff); bits -= 8; }
  }
  return Buffer.from(out);
}

export function base32Encode(bytes: Buffer): string {
  let bits = 0, value = 0, out = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) { out += ALPHABET[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

export function codeAt(secret: Buffer, step: number): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const mac = createHmac("sha1", secret).update(counter).digest();
  const offset = mac[mac.length - 1]! & 0x0f;
  const number = (mac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return String(number).padStart(6, "0");
}

let lastUsedStep = -1; // a code works once: stops someone replaying a code they saw

/** True if the code matches now, 30 s ago or 30 s ahead (phone clocks drift). */
export function verifyCode(secretBase32: string, code: string, nowMs = Date.now()): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  const secret = base32Decode(secretBase32);
  const now = Math.floor(nowMs / 1000 / STEP_SECONDS);
  for (const step of [now - 1, now, now + 1]) {
    if (step <= lastUsedStep) continue;
    if (timingSafeEqual(Buffer.from(codeAt(secret, step)), Buffer.from(code))) {
      lastUsedStep = step;
      return true;
    }
  }
  return false;
}

export function newSecret(): string {
  return base32Encode(randomBytes(20));
}

export function resetReplayGuardForTests(): void {
  lastUsedStep = -1;
}
