import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const screenshotDir = fileURLToPath(new URL('../docs/screenshots/', import.meta.url));
async function chooseProfile(page) {
  await page.goto('/');
  await page.getByRole('button', { name: /Leena Moss/ }).click();
  await expect(
    page.getByRole('heading', { name: 'What would you like to request?' }),
  ).toBeVisible();
}
test('ordinary request, review, receipt, and reset', async ({ page }) => {
  await chooseProfile(page);
  await page.getByRole('button', { name: /Late arrival/ }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
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
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
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
test('request selection stays visible, updates context, and works with a keyboard', async ({
  page,
}) => {
  await chooseProfile(page);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByText('Choose a request type.', { exact: true })).toBeVisible();
  const leave = page.getByRole('button', { name: /Time off/ });
  await leave.focus();
  await page.keyboard.press('Enter');
  await expect(leave).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.request-context h2')).toHaveText('Time off');
  await expect(
    page.getByRole('heading', { name: 'What would you like to request?' }),
  ).toBeVisible();
  await page.getByRole('button', { name: /Late arrival/ }).click();
  await expect(leave).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.request-context h2')).toHaveText('Late arrival');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: /fictional morning appointment/ }).click();
  await page.getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByRole('button', { name: /Late arrival/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: /Time off/ }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('button', { pressed: true })).toHaveCount(0);
});
test('editorial layout fits small laptops and Arabic mobile screens', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await chooseProfile(page);
  await expect(page.getByRole('button', { name: 'Continue', exact: true })).toBeInViewport({
    ratio: 1,
  });
  for (const locale of ['en', 'ar']) {
    if (locale === 'ar') await page.getByRole('button', { name: 'Switch to Arabic' }).click();
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  }
});
test('text and controls retain readable contrast in both themes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await chooseProfile(page);
  await page.getByRole('button', { name: /Time off/ }).click();
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await page.waitForFunction(() =>
      document.getAnimations().every((animation) => animation.playState !== 'running'),
    );
    const contrast = await page.evaluate(() => {
      const selectors = [
        '.project-title',
        '.chip-btn',
        '.reset-btn',
        '.question-title',
        '.type-copy strong',
        '.type-copy small',
        '.btn-primary',
        '.btn-ghost',
        '.context-heading p',
        '.context-profile-row strong',
        '.foot-note',
      ];
      const luminance = (color) => {
        const channels = color
          .match(/[\d.]+/g)
          .slice(0, 3)
          .map(Number)
          .map((value) => value / 255)
          .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
      };
      return selectors.flatMap((selector) =>
        Array.from(document.querySelectorAll(selector)).map((element) => {
          let ancestor = element;
          while (
            ancestor.parentElement &&
            getComputedStyle(ancestor).backgroundColor === 'rgba(0, 0, 0, 0)'
          )
            ancestor = ancestor.parentElement;
          const foreground = luminance(getComputedStyle(element).color);
          const background = luminance(getComputedStyle(ancestor).backgroundColor);
          return {
            selector,
            ratio:
              (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05),
          };
        }),
      );
    });
    for (const sample of contrast)
      expect(sample.ratio, theme + ': ' + sample.selector).toBeGreaterThanOrEqual(4.5);
  }
});
test('medical branch accepts only a generated sample document', async ({ page }) => {
  await chooseProfile(page);
  await page.getByRole('button', { name: /Medical absence/ }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
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
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
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
  async function settle() {
    await page.waitForFunction(() =>
      document.getAnimations().every((animation) => animation.playState !== 'running'),
    );
  }
  await mkdir(screenshotDir, { recursive: true });
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Who would you like to try this as?' }),
  ).toBeVisible();
  await settle();
  await page.screenshot({ path: screenshotDir + 'form-desktop.png', fullPage: true });
  await page.getByRole('button', { name: /Leena Moss/ }).click();
  await page.getByRole('button', { name: /Time off/ }).click();
  await settle();
  await page.screenshot({ path: screenshotDir + 'form-request-types.png', fullPage: true });
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await settle();
  await page.screenshot({ path: screenshotDir + 'form-dark.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await settle();
  await page.screenshot({ path: screenshotDir + 'form-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Switch to Arabic' }).click();
  await settle();
  await page.screenshot({ path: screenshotDir + 'form-arabic.png', fullPage: true });
});
