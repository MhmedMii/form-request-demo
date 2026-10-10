import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const screenshotDir = fileURLToPath(new URL('../docs/screenshots/', import.meta.url));
async function chooseProfile(page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Leena Moss/ }).click();
  await expect(page.getByRole('heading', { name: 'What kind of request is it?' })).toBeVisible();
}
test('ordinary request, review, receipt, and reset', async ({ page }) => {
  await chooseProfile(page);
  await page.getByRole('button', { name: /Late arrival/ }).click();
  await page.getByRole('button', { name: /fictional morning appointment/ }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByText('leena.moss@example.com')).toBeVisible();
  await page.getByRole('button', { name: 'Submit demo request' }).click();
  await expect(page.getByRole('heading', { name: 'All set. One clear next step.' })).toBeVisible();
  const receipt = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download demo receipt' }).click();
  expect((await receipt).suggestedFilename()).toMatch(/^DEMO-/);
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Who would you like to try this as?' }),
  ).toBeVisible();
});
test('leave branch validates dates', async ({ page }) => {
  await chooseProfile(page);
  await page.getByRole('button', { name: /Time off/ }).click();
  await page.getByRole('button', { name: /fictional annual-leave/ }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByText('Choose both dates.', { exact: true })).toBeVisible();
  const today = await page.evaluate(() => {
    const d = new Date();
    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0')
    );
  });
  await page.locator('input[name=fromDate]').fill(today);
  await page.locator('input[name=toDate]').fill(today);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Does everything look right?' })).toBeVisible();
});
test('medical branch accepts only a generated sample document', async ({ page }) => {
  await chooseProfile(page);
  await page.getByRole('button', { name: /Medical absence/ }).click();
  await page.getByRole('button', { name: /fictional one-day absence/ }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.locator('input[type=file]')).toHaveCount(0);
  const sample = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Preview sample' }).click();
  expect((await sample).suggestedFilename()).toBe('DEMO-fictional-supporting-document.pdf');
  await page.getByRole('button', { name: 'Attach sample PDF' }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Submit demo request' }).click();
  await expect(page.getByRole('heading', { name: 'All set. One clear next step.' })).toBeVisible();
});
test('drafts, Arabic, dark mode, and mobile layout', async ({ page }) => {
  await chooseProfile(page);
  await page.getByRole('button', { name: /Late arrival/ }).click();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Let’s give it a little context.' }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Switch to Arabic' }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('button', { name: 'الوضع الداكن' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});
test('no personal inputs or outbound submission and server boundary disabled', async ({
  page,
  request,
  baseURL,
}) => {
  const outbound = [];
  page.on('request', (req) => {
    const url = new URL(req.url());
    if (url.origin !== new URL(baseURL).origin) outbound.push(url.origin);
  });
  await chooseProfile(page);
  expect(outbound).toEqual([]);
  await expect(
    page.locator('input[type=email], input[type=tel], textarea, input[type=file]'),
  ).toHaveCount(0);
  expect(
    (await request.post('/api/submit-request', { data: { arbitrary: 'ignored' } })).status(),
  ).toBe(410);
  expect(await (await request.get('/api/health')).json()).toMatchObject({
    externalServices: false,
  });
});
test('capture fictional design screenshots', async ({ page }) => {
  await mkdir(screenshotDir, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Who would you like to try this as?' }),
  ).toBeVisible();
  await page.screenshot({ path: screenshotDir + 'form-desktop.png', fullPage: true });
  await page.getByRole('button', { name: /Leena Moss/ }).click();
  await page.screenshot({ path: screenshotDir + 'form-request-types.png', fullPage: true });
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await page.screenshot({ path: screenshotDir + 'form-dark.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: screenshotDir + 'form-mobile.png', fullPage: true });
});
