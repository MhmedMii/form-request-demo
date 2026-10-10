import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { createHash } from 'node:crypto';
const bannedHashes = new Set([
  '6370280f32ecbd96572e78c226c5f613f60ad0a1019551b08397f731a7be2d87',
  '5f1734b93238f4588c6d5e14790deee0c626e6316dca6a07c313b74f56c2b0c4',
  '8c27d5f68eafc2dc4ef92d8d8f15f7fcf03670cd5c1d18596c3a76015d98e5de',
  '1e826b03843f97f20aa6a7eadebbdb46e056030d17b0c32566d5e96275bd621a',
  'dc2807d7c8836aa2af214d9bf02c22e19203aa574c3bd6f309e627dc0916660a',
  '22d07ccfa184e7d11b8b8058c102da4570df071cc81f5019d92aeeb087de09da',
]);
const excluded = new Set([
  'node_modules',
  '.next',
  '.git',
  '.vercel',
  'coverage',
  'test-results',
  'playwright-report',
]);
const failures = [];
let count = 0;
function scan(root) {
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const path = join(root, entry.name);
    if (entry.isSymbolicLink()) {
      failures.push(path + ': symlink');
      continue;
    }
    if (entry.isDirectory()) {
      scan(path);
      continue;
    }
    if (entry.name.startsWith('.env') && entry.name !== '.env.example')
      failures.push(path + ': environment file');
    if (/\.(csv|xlsx|dump|db|sqlite|log|zip)$/.test(entry.name))
      failures.push(path + ': data artifact');
    if (
      !['.js', '.jsx', '.mjs', '.json', '.md', '.css', '.gs'].includes(extname(path)) ||
      entry.name === 'package-lock.json'
    )
      continue;
    const text = readFileSync(path, 'utf8');
    count++;
    const words =
      text
        .normalize('NFKC')
        .toLowerCase()
        .match(/\p{L}+/gu) || [];
    let branded = false;
    for (let i = 0; i < words.length && !branded; i++) {
      for (let n = 1; n <= 3; n++) {
        const phrase = words.slice(i, i + n).join('');
        if (bannedHashes.has(createHash('sha256').update(phrase).digest('hex'))) {
          branded = true;
          break;
        }
      }
    }
    if (branded) failures.push(path + ': original company branding');
    const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    if (emails.some((value) => !/@(?:[a-z0-9-]+\.)?example\.(com|org|net)$/i.test(value)))
      failures.push(path + ': non-example address');
    if (
      /gh[pousr]_[A-Za-z0-9]{30,}|AKIA[A-Z0-9]{16}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(
        text,
      )
    )
      failures.push(path + ': possible credential');
  }
}
scan('.');
if (failures.length) {
  console.error('Demo privacy check failed (values redacted):\n' + failures.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    'Demo privacy check passed: ' +
      count +
      ' source files inspected. No original branding, environment files, data exports, non-example emails, or selected credential formats.',
  );
