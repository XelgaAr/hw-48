import { test, expect } from '@playwright/test';

async function selectSection(page, name) {
  const menu = page.getByRole('button', { name: 'Открыть меню' });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('navigation', { name: 'Разделы курсов' }).getByRole('button', { name: new RegExp(name) }).click();
}

test('course CRUD, progress, favorites, storage and undo', async ({ page }) => {
  const errors = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await page.getByRole('button', { name: 'Добавить курс' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Название курса').fill('Тестовый курс');
  await dialog.getByLabel('Всего уроков').fill('2');
  await dialog.getByRole('button', { name: 'Сохранить курс' }).click();
  const card = page.getByRole('article', { name: 'Тестовый курс', exact: true });
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: 'Следующий урок' }).click();
  await expect(card.getByText('1 / 2 уроков')).toBeVisible();
  await card.getByRole('button', { name: 'Избранное: Тестовый курс', exact: true }).click();
  await expect(card.getByRole('button', { name: 'Избранное: Тестовый курс', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.reload(); await expect(card.getByText('1 / 2 уроков')).toBeVisible();
  await selectSection(page, 'Избранное'); await expect(card).toBeVisible();
  await card.getByRole('button', { name: 'Редактировать: Тестовый курс', exact: true }).click();
  await page.getByRole('dialog').getByLabel('Название курса').fill('Обновлённый курс');
  await page.getByRole('dialog').getByRole('button', { name: 'Сохранить курс' }).click();
  const updated = page.getByRole('article', { name: 'Обновлённый курс', exact: true });
  await updated.getByRole('button', { name: 'Следующий урок' }).click();
  await expect(updated.getByRole('button', { name: 'Курс завершён' })).toBeDisabled();
  await updated.getByRole('button', { name: 'Удалить: Обновлённый курс', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Удалить курс' }).click();
  await expect(updated).toHaveCount(0);
  await page.getByRole('button', { name: 'Восстановить' }).click();
  await expect(updated).toBeVisible();
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('form errors, theme persistence and empty search', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Включить тёмную тему' }).click();
  await page.reload(); await expect(page.getByRole('button', { name: 'Включить светлую тему' })).toBeVisible();
  await page.getByRole('button', { name: 'Добавить курс' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Пройдено уроков').fill('500');
  await dialog.getByRole('button', { name: 'Сохранить курс' }).click();
  await expect(dialog.getByText('Название должно содержать от 3 до 80 символов.')).toBeVisible();
  await expect(dialog.getByText('Введите целое число от 0 до количества уроков.')).toBeVisible();
  await dialog.getByRole('button', { name: 'Отмена' }).click();
  await page.getByLabel('Найти курс').fill('неттакогокурса');
  await expect(page.getByRole('heading', { name: 'Курсы не найдены' })).toBeVisible();
  await page.getByRole('button', { name: 'Сбросить фильтры' }).click();
  await expect(page.getByRole('article')).toHaveCount(6);
});

test('completed section and direction filter work independently', async ({ page }) => {
  await page.goto('./');
  await selectSection(page, 'Завершённые');
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article', { name: 'Git: уверенная работа в команде' })).toBeVisible();
  await selectSection(page, 'Все курсы');
  await page.getByRole('combobox', { name: 'Направление', exact: true }).click();
  await page.getByRole('option', { name: 'Backend', exact: true }).click();
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article', { name: 'Node.js и работа с API' })).toBeVisible();
});
