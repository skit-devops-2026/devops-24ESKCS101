const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
 
const ROOT = path.join(__dirname, '..');
 
const requiredPages = [
  'index.html',
  'home.html',
  'login.html',
  'register.html',
  'sell.html',
  'listing.html',
  'bought.html',
  'sold.html',
  'wishlist.html',
];
 
for (const page of requiredPages) {
  test(`${page} exists`, () => {
    const fullPath = path.join(ROOT, page);
    assert.ok(fs.existsSync(fullPath), `${page} should exist at project root`);
  });
}
 