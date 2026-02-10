import { expect, test } from '@playwright/test';

test('home to classic guess submit', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: '开始经典模式' }).click();
  await expect(page.getByText('经典模式')).toBeVisible();
  await page.getByRole('button', { name: '快速猜测(0,0)' }).click();
  await page.getByRole('button', { name: '提交猜测' }).click();
  await expect(page.getByText(/距离:/)).toBeVisible();
});
