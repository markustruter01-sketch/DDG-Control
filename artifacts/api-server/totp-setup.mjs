// One-time Google Authenticator setup for the DDG Control login.
// Run in the Replit Shell:  node artifacts/api-server/totp-setup.mjs you@example.com
// It prints a QR code to scan and the secret to save as DDG_TOTP_SECRET.
// Nothing is saved anywhere by this script.
import { randomBytes } from "node:crypto";
import qrcode from "qrcode-terminal";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
let bits = 0, value = 0, secret = "";
for (const byte of randomBytes(20)) {
  value = (value << 8) | byte;
  bits += 8;
  while (bits >= 5) { secret += ALPHABET[(value >>> (bits - 5)) & 31]; bits -= 5; }
}

const account = process.argv[2] ?? "owner";
const url = `otpauth://totp/DDG%20Control:${encodeURIComponent(account)}?secret=${secret}&issuer=DDG%20Control&digits=6&period=30`;

console.log("\n1) Scan this with Google Authenticator (+  → Scan a QR code):\n");
qrcode.generate(url, { small: true });
console.log("\n2) Add this to Replit Secrets as DDG_TOTP_SECRET:\n");
console.log(`   ${secret}\n`);
console.log("3) Clear this Shell afterwards (type: clear). Never share the DDG_TOTP_SECRET.\n");
