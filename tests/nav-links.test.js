// Scans every top-level HTML page for internal links (href="something.html")
// and checks the linked file actually exists. External links (http/https)
// and placeholder links (href="#") are skipped, since they aren't pages in
// this repository.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');

const htmlFiles = fs
  .readdirSync(ROOT)
  .filter((file) => file.endsWith('.html'));

const hrefPattern = /href=["']([^"']+)["']/g;

for (const file of htmlFiles) {
  test(`internal links in ${file} point to existing files`, () => {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const matches = [...content.matchAll(hrefPattern)].map((m) => m[1]);

    const internalLinks = matches.filter(
      (href) =>
        href.endsWith('.html') &&
        !href.startsWith('http://') &&
        !href.startsWith('https://')
    );

    for (const link of internalLinks) {
      const targetPath = path.join(ROOT, link);
      assert.ok(
        fs.existsSync(targetPath),
        `${file} links to "${link}", but that file does not exist`
      );
    }
  });
}