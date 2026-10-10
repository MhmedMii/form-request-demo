import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { identityForProfile, findDemoProfile } from '../lib/demo-profiles.js';
import { validateIdentity, validateRequestDetails } from '../lib/validate-request.js';
import { buildQuestionFlow, firstIncompleteIndex } from '../lib/question-flow.js';
import { buildRequestPayload } from '../lib/build-request-payload.js';
import { sendToAppsScript } from '../lib/apps-script-gateway.js';
import { samplePdfContent } from '../lib/demo-document.js';
import { t } from '../lib/i18n.js';
import { todayISO } from '../lib/today.js';
const valid = () => ({
  ...identityForProfile('profile-01'),
  type: 'late',
  details: 'late-01',
  pdfFile: '',
  fromDate: '',
  toDate: '',
});
test('identities must match the predefined fictional catalog', () => {
  assert.deepEqual(validateIdentity(valid(), 'en'), {});
  assert.ok(validateIdentity({ ...valid(), workEmail: 'person@example.org' }, 'en').profile);
  assert.ok(validateIdentity({ ...valid(), employeeName: 'Another Person' }, 'en').profile);
  assert.equal(findDemoProfile('unknown'), null);
});
test('ordinary, leave, and medical paths include only their required conditional step', () => {
  const base = buildQuestionFlow(valid(), t('en'));
  assert.deepEqual(
    base.map((s) => s.id),
    ['profile', 'type', 'details', 'review'],
  );
  assert.ok(
    buildQuestionFlow({ ...valid(), type: 'leave' }, t('en')).some((s) => s.id === 'dates'),
  );
  assert.ok(!buildQuestionFlow({ ...valid(), type: 'leave' }, t('en')).some((s) => s.id === 'pdf'));
  assert.ok(buildQuestionFlow({ ...valid(), type: 'sick' }, t('en')).some((s) => s.id === 'pdf'));
});
test('reasons must match the selected request type', () => {
  assert.ok(validateRequestDetails({ ...valid(), details: 'leave-01' }, 'en').details);
  assert.deepEqual(validateRequestDetails(valid(), 'en'), {});
  assert.equal(firstIncompleteIndex(buildQuestionFlow(valid(), t('en')), valid(), 'en'), -1);
});
test('leave dates are required, ordered, and not in the past', () => {
  const leave = { ...valid(), type: 'leave', details: 'leave-01' };
  assert.ok(validateRequestDetails(leave, 'en').dates);
  assert.ok(
    validateRequestDetails({ ...leave, fromDate: '2000-01-01', toDate: '2000-01-02' }, 'en').dates,
  );
  assert.ok(
    validateRequestDetails({ ...leave, fromDate: todayISO(), toDate: '2000-01-01' }, 'en').dates,
  );
  assert.deepEqual(
    validateRequestDetails({ ...leave, fromDate: todayISO(), toDate: todayISO() }, 'en'),
    {},
  );
});
test('medical requests require the generated sample, not real file content', () => {
  const request = { ...valid(), type: 'sick', details: 'sick-01' };
  assert.ok(validateRequestDetails(request, 'en').pdf);
  assert.ok(validateRequestDetails({ ...request, pdfFile: 'arbitrary-file-data' }, 'en').pdf);
  assert.deepEqual(
    validateRequestDetails({ ...request, pdfFile: 'generated-demo-document' }, 'en'),
    {},
  );
});
test('payload construction uses canonical identities and strips unrelated details', () => {
  const payload = buildRequestPayload({
    ...valid(),
    employeeName: 'Edited Name',
    phone: 'anything',
    pdfFile: 'arbitrary-file',
  });
  assert.equal(payload.employeeName, 'Leena Moss');
  assert.equal(payload.phone, 'DEMO-001');
  assert.equal(payload.workEmail, 'leena.moss@example.com');
  assert.equal(payload.attachment, '');
  assert.equal(payload.demo, true);
});
test('external gateway cannot send requests even with a URL and payload', async () => {
  let called = false;
  const original = globalThis.fetch;
  globalThis.fetch = () => {
    called = true;
    throw new Error('Network called');
  };
  try {
    await assert.rejects(sendToAppsScript('https://example.com', valid()), /disabled/);
  } finally {
    globalThis.fetch = original;
  }
  assert.equal(called, false);
});
test('PDF generation produces a fictional PDF with no personal record', () => {
  const content = samplePdfContent();
  assert.ok(content.startsWith('%PDF-1.4'));
  assert.ok(content.includes('DEMO - FICTIONAL DOCUMENT'));
  assert.ok(content.endsWith('%%EOF'));
});
test('Apps Script entry points and setup do not call Google services', () => {
  const context = {
    jsonResponse: (value) => value,
    SpreadsheetApp: new Proxy(
      {},
      {
        get() {
          throw new Error('Unexpected Google call');
        },
      },
    ),
  };
  vm.createContext(context);
  vm.runInContext(
    readFileSync('apps-script/main.gs', 'utf8') + readFileSync('apps-script/setup.gs', 'utf8'),
    context,
  );
  assert.equal(context.doPost({}).error, 'demo_only');
  assert.equal(context.doGet({}).externalServices, false);
  assert.equal(context.setupScript().externalServices, false);
});
