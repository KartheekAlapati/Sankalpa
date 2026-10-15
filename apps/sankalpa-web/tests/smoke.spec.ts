import { test, expect } from '@playwright/test'

const routes = {
  '/today': 'A little clarity for today.', '/life': 'A life is more than a list.',
  '/knowledge': 'Give your thinking a home.', '/growth': 'Progress, without the pressure.',
  '/inbox': 'A lighter mind starts here.', '/calendar': 'See the shape of your day.',
  '/focus': 'One thing at a time.', '/settings': 'A space that feels like yours.', '/search': 'Find your thread.',
}
for (const [route, heading] of Object.entries(routes)) {
  test(`route ${route} renders without runtime errors`, async ({ page }) => {
    const errors: string[] = []; page.on('pageerror', e => errors.push(e.message))
    await page.goto(route)
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible()
    await expect(page.getByText(/Cloud sync is not connected/)).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
}
test('capture, categorize, search and reload privacy', async ({ page }) => {
  await page.goto('/today')
  await page.getByRole('button', { name: 'Quick capture' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByLabel('What is on your mind?').fill('Read hashing chapter')
  await page.getByRole('button', { name: 'Save capture' }).click()
  await page.getByRole('link', { name: 'Open your inbox' }).click()
  await page.getByLabel('Categorize Read hashing chapter').selectOption('task')
  await expect(page.getByText('Read hashing chapter')).toHaveCount(0)
  await page.getByRole('link', { name: 'Search', exact: true }).click()
  await page.getByLabel('Search your space').fill('hashing')
  await expect(page.getByText('Read hashing chapter')).toBeVisible()
  await page.reload()
  await page.getByLabel('Search your space').fill('hashing')
  await expect(page.getByText('No matching captures.')).toBeVisible()
})
test('three-priority limit, completion and recovery', async ({ page }, testInfo) => {
  await page.goto('/today')
  for (const title of ['Learn C++', 'Walk outside', 'Read one page']) {
    await page.getByRole('button', { name: 'Add a priority' }).click()
    await page.getByLabel('Priority', { exact: true }).fill(title)
    await page.getByRole('button', { name: 'Save capture' }).click()
  }
  await expect(page.getByRole('button', { name: 'Add a priority' })).toBeDisabled()
  await page.getByRole('button', { name: 'Later', exact: true }).first().click()
  await expect(page.getByText('2 / 3 planned')).toBeVisible()
  await page.getByRole('button', { name: 'Complete Walk outside' }).click()
  await expect(page.getByText('1 / 3 planned')).toBeVisible()
  if (testInfo.project.name === 'mobile') await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Life', exact: true }).click()
  else await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'My Life', exact: true }).click()
  await expect(page.getByText('Learn C++', { exact: true })).toBeVisible()
})
test('dialog keyboard, theme and unknown route', async ({ page }) => {
  await page.goto('/today')
  await page.getByRole('button', { name: 'Quick capture' }).click()
  await expect(page.getByLabel('What is on your mind?')).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('button', { name: 'Close dialog' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('button', { name: 'Save capture' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Quick capture' })).toBeFocused()
  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.goto('/missing')
  await expect(page.getByRole('heading', { name: 'This page is not here.' })).toBeVisible()
})
test('focus is task-linked and records real elapsed time', async ({ page }) => {
  await page.goto('/today')
  await page.getByRole('button', { name: 'Add a priority' }).click()
  await page.getByLabel('Priority', { exact: true }).fill('Study maps')
  await page.getByRole('button', { name: 'Save capture' }).click()
  await page.getByRole('link', { name: 'Choose a task & focus' }).click()
  await expect(page.getByRole('button', { name: 'Start focus', exact: true })).toBeDisabled()
  await page.getByLabel('Task or study topic').selectOption({ label: 'Study maps' })
  await page.getByRole('button', { name: 'Start focus', exact: true }).click()
  await expect(page.getByRole('timer')).toHaveText('24:58', { timeout: 5000 })
  await page.getByRole('button', { name: 'Pause', exact: true }).click()
  await page.getByRole('button', { name: 'Save session', exact: true }).click()
  await expect(page.getByText('Session recorded. Take a moment before beginning again.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Save session', exact: true })).toBeDisabled()
})
test('PWA resources load and no personal cache is created', async ({ page }) => {
  await page.goto('/today')
  const manifest = await (await page.request.get('/manifest.webmanifest')).json()
  expect(manifest.name).toBe('SANKALPA')
  for (const icon of manifest.icons) {
    const dimensions = await page.evaluate(async (src: string) => {
      const img = new Image(); img.src = src; await img.decode()
      return `${img.naturalWidth}x${img.naturalHeight}`
    }, icon.src)
    expect(dimensions).toBe(icon.sizes)
  }
  await page.evaluate(() => navigator.serviceWorker.ready)
  expect(await page.evaluate(() => caches.keys())).toEqual([])
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(['sankalpa-theme'])
})
test('four spaces and supporting tools are reachable through navigation', async ({ page }, testInfo) => {
  await page.goto('/today')
  const mobile = testInfo.project.name === 'mobile'
  const nav = page.getByRole('navigation', { name: mobile ? 'Mobile navigation' : 'Main navigation', exact: true })
  for (const [name, route] of [['Life', '/life'], ['Knowledge', '/knowledge'], ['Growth', '/growth'], ['Today', '/today']]) {
    await nav.getByRole('link', { name: mobile || name === 'Today' ? name : `My ${name}`, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`${route}$`))
  }
  if (mobile) {
    for (const name of ['Inbox', 'Calendar', 'Focus', 'Settings']) {
      await page.getByRole('navigation', { name: 'Mobile tools', exact: true }).getByRole('link', { name, exact: true }).click()
      await expect(page).toHaveURL(new RegExp(`/${name.toLowerCase()}$`))
    }
  }
})
