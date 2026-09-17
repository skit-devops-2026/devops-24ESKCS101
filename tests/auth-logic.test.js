// Loads register.html and the real js/auth.js into a simulated browser (jsdom),
// then submits the actual form to test the real password-confirmation logic
// that ships in auth.js — not a re-implementation of it.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');

function setupRegisterPage() {
  const html = fs.readFileSync(path.join(ROOT, 'register.html'), 'utf8');
  const dom = new JSDOM(html, { runScripts: 'outside-only' });

  // Stub alert, since jsdom does not implement it, and we want to check
  // whether auth.js called it.
  const alertCalls = [];
  dom.window.alert = (msg) => alertCalls.push(msg);

  const authJs = fs.readFileSync(path.join(ROOT, 'js', 'auth.js'), 'utf8');
  dom.window.eval(authJs);

  return { dom, alertCalls };
}

function submitRegisterForm(dom, password, confirmPassword) {
  const doc = dom.window.document;
  doc.getElementById('register-password').value = password;
  doc.getElementById('confirm-password').value = confirmPassword;

  const form = doc.getElementById('register-form');
  const event = new dom.window.Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(event);
}

test('mismatched passwords trigger an alert and leave the message unset', () => {
  const { dom, alertCalls } = setupRegisterPage();

  submitRegisterForm(dom, 'password123', 'differentPassword');

  assert.equal(alertCalls.length, 1, 'alert should be called exactly once');
  assert.equal(alertCalls[0], 'Passwords do not match.');

  const message = dom.window.document.getElementById('register-message');
  assert.equal(message.textContent, '', 'message should remain empty when passwords do not match');
});

test('matching passwords set the success message and do not alert', () => {
  const { dom, alertCalls } = setupRegisterPage();

  submitRegisterForm(dom, 'password123', 'password123');

  assert.equal(alertCalls.length, 0, 'alert should not be called when passwords match');

  const message = dom.window.document.getElementById('register-message');
  assert.equal(message.textContent, 'Registration details are valid.');
});