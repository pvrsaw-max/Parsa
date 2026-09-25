import { test, expect } from '@playwright/test';

async function openMode(page, name) {
  await page.goto('./');
  await page.getByRole('button', { name: /بازی‌های جانبی/ }).click();
  await page.getByRole('button', { name: new RegExp(name) }).click();
}

async function setupPlayers(page, names, rounds = 1) {
  const input = page.getByPlaceholder('مثلاً علی');
  for (const name of names) {
    await input.fill(name);
    await page.getByRole('button', { name: 'افزودن بازیکن' }).click();
    await expect(page.getByText(name, { exact: true })).toBeVisible();
  }
  await page.getByRole('button', { name: /1\s*سریع/ }).click();
  await expect(page.getByRole('button', { name: /بزن بریم/ })).toBeEnabled();
  await page.getByRole('button', { name: /بزن بریم/ }).click();
}

test.describe('Parsayan side games - real browser actions', () => {
  test('رگبار: setup, score action, timer, next player, champion', async ({ page }) => {
    await page.clock.install();
    await openMode(page, 'رگبار');
    await setupPlayers(page, ['علی', 'سارا']);
    await expect(page.getByRole('button', { name: 'درست ✓' })).toBeVisible();
    await page.getByRole('button', { name: 'درست ✓' }).click();
    await page.clock.fastForward(46000);
    await expect(page.getByText('نوبت تمام شد')).toBeVisible();
    await page.getByRole('button', { name: /بریم نفر بعدی/ }).click();
    await page.clock.fastForward(46000);
    await page.getByRole('button', { name: /نتیجه نهایی/ }).click();
    await expect(page.getByText(/قهرمان رگبار|تساوی/)).toBeVisible();
  });

  test('زنجیره: valid/invalid actions advance turns and finish', async ({ page }) => {
    await openMode(page, 'زنجیره');
    await setupPlayers(page, ['علی', 'سارا']);
    await expect(page.getByRole('button', { name: /وصل شد/ })).toBeVisible();
    await page.getByRole('button', { name: /وصل شد/ }).click();
    await page.waitForTimeout(150);
    await page.getByRole('button', { name: /نامعتبر/ }).click();
    await expect(page.getByText(/قهرمان زنجیره|تساوی/)).toBeVisible();
  });

  test('یک کلمه: actions work, timer closes turns, champion renders', async ({ page }) => {
    await page.clock.install();
    await openMode(page, 'یک کلمه، بیشتر نه');
    await setupPlayers(page, ['علی', 'سارا']);
    await expect(page.getByRole('button', { name: /حدس زد/ })).toBeVisible();
    await page.getByRole('button', { name: /حدس زد/ }).click();
    await page.clock.fastForward(46000);
    await expect(page.getByText(/نوبت تمام شد|امتیاز این نوبت/)).toBeVisible();
    await page.getByRole('button', { name: /بریم نفر بعدی/ }).click();
    await page.clock.fastForward(46000);
    await page.getByRole('button', { name: /نتیجه نهایی/ }).click();
    await expect(page.getByText(/قهرمان یک کلمه|تساوی/)).toBeVisible();
  });

  test('کارگردان: setup, prep, cut/judge actions and scoring path', async ({ page }) => {
    await page.clock.install();
    await openMode(page, 'کارگردان');
    await setupPlayers(page, ['علی', 'سارا']);
    await expect(page.getByText(/آماده‌سازی/)).toBeVisible();
    await page.clock.fastForward(6000);
    await expect(page.getByRole('button', { name: /کات زودتر/ })).toBeVisible();
    await page.getByRole('button', { name: /کات زودتر/ }).click();
    await page.getByRole('button', { name: /گرفتیم!/ }).click();
    await page.clock.fastForward(6000);
    await page.getByRole('button', { name: /کات زودتر/ }).click();
    await page.getByRole('button', { name: /کات!/ }).click();
    await expect(page.getByText(/ستاره کارگردان|تساوی/)).toBeVisible();
  });

  test('سه‌ثانیه: timer starts only after button and both verdicts work', async ({ page }) => {
    await page.clock.install();
    await openMode(page, 'سه‌ثانیه');
    await setupPlayers(page, ['علی', 'سارا']);
    const fire = page.getByRole('button', { name: /حالا/ });
    await expect(fire).toBeVisible();
    await fire.click();
    await page.clock.fastForward(3500);
    await expect(page.getByText(/وقت تموم شد/)).toBeVisible();
    await page.getByRole('button', { name: /گرفت/ }).click();
    await page.getByRole('button', { name: /حالا/ }).click();
    await page.clock.fastForward(3500);
    await page.getByRole('button', { name: /سوخت/ }).click();
    await expect(page.getByText(/قهرمان سه‌ثانیه|تساوی/)).toBeVisible();
  });

  test('کی اینو گفت: 3-player setup, private answers, guess, reveal, full round', async ({ page }) => {
    await openMode(page, 'کی اینو گفت');
    await setupPlayers(page, ['علی', 'سارا', 'رضا']);
    const textarea = page.locator('textarea');
    for (const answer of ['جواب اول', 'جواب دوم', 'جواب سوم']) {
      await textarea.fill(answer);
      await page.getByRole('button', { name: /ثبت/ }).click();
      await page.waitForTimeout(150);
    }
    await expect(page.getByRole('button', { name: /شروع ۱۵ ثانیه/ })).toBeVisible();
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /شروع ۱۵ ثانیه/ }).click();
      const choices = page.locator('.quoteChoices button');
      await expect(choices.first()).toBeEnabled();
      await choices.first().click();
      await page.getByRole('button', { name: /قفل شد؛ اسم رو کن/ }).click();
      await page.getByRole('button', { name: /حدس‌زن بعدی|نتیجه نهایی/ }).click();
    }
    await expect(page.getByText(/کارآگاه برتر|تساوی/)).toBeVisible();
  });
});
