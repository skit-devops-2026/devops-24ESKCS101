// Verifies that the login and register forms contain the fields the rest of
// the app depends on. If one of these fields were accidentally removed or
// its id changed, auth.js would silently stop working — this catches that.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');

function loadPage(fileName) {
  const html = fs.readFileSync(path.join(ROOT, fileName), 'utf8');
  return new JSDOM(html).window.document;
}

test('login.html has required email and password fields', () => {
  const doc = loadPage('login.html');

  const email = doc.getElementById('login-email');
  const password = doc.getElementById('login-password');

  assert.ok(email, 'login-email field should exist');
  assert.equal(email.getAttribute('required'), '', 'login-email should be required');

  assert.ok(password, 'login-password field should exist');
  assert.equal(password.getAttribute('required'), '', 'login-password should be required');
});

test('register.html has required name, email, password and confirm-password fields', () => {
  const doc = loadPage('register.html');

  const fields = ['register-name', 'register-email', 'register-password', 'confirm-password'];

  for (const id of fields) {
    const field = doc.getElementById(id);
    assert.ok(field, `${id} field should exist`);
    assert.equal(field.getAttribute('required'), '', `${id} should be required`);
  }
});