#!/usr/bin/env node
// Turn an admin password into the hash that goes in the environment.
//
//   npm run admin:hash -- 'the password you chose'
//
// Prints the two lines to paste into .env.local, and the same two go into the
// Vercel project settings. The password itself is never written anywhere: not
// to a file, not to the repository, and not into this script.
//
// Choose the password somewhere private. A shell records its history, so on a
// shared machine prefer piping it in:
//
//   printf '%s' 'the password' | npm run admin:hash --

import { randomBytes, scryptSync } from 'node:crypto';
import process from 'node:process';

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

// Dots rather than the conventional dollars: a dollar in an environment value
// gets expanded by the shell on export and interpolated by several .env
// parsers, so the hash arrives as the bare word "scrypt" and every login fails
// with nothing in the logs to say why. Both halves are hex; a dot is safe.
function hash(password) {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, SCRYPT.keylen, SCRYPT);
  return `scrypt.${salt.toString('hex')}.${key.toString('hex')}`;
}

async function readStdin() {
  if (process.stdin.isTTY) return '';
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8').replace(/\r?\n$/, '');
}

const password = process.argv[2] ?? (await readStdin());

if (!password) {
  console.error("Usage: npm run admin:hash -- 'your password'");
  process.exit(2);
}
if (password.length < 12) {
  console.error(`That password is ${password.length} characters. Use at least 12.`);
  process.exit(2);
}

console.log('\nPaste these into .env.local and into the Vercel project settings:\n');
console.log('ADMIN_EMAIL=cyril.drouin@beyondbordergroup.com');
console.log(`ADMIN_PASSWORD_HASH=${hash(password)}`);
console.log(`ADMIN_SECRET=${randomBytes(32).toString('base64url')}`);
// Prefixed, so the three lines above are the only ones matching ^ADMIN_ and
// the output can be piped straight into an env file.
console.log(
  '\n# The secret signs the session cookie. Changing it signs everybody out,\n' +
    '# which is how you revoke a session you no longer want.\n',
);
