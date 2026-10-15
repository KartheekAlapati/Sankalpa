import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

// Run against the local production preview; screenshots contain only the empty state.
const output = fileURLToPath(new URL('../../../docs/previews/', import.meta.url))
await mkdir(output, { recursive: true })
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
  const response = await page.goto('http://127.0.0.1:4188/today')
  if (response.status() !== 200) throw new Error('Preview did not return HTTP 200')
  await page.getByRole('heading', { name: 'A little clarity for today.' }).waitFor()
  await page.screenshot({ path: `${output}/phase1-desktop.png`, fullPage: true, animations: 'disabled' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: `${output}/phase1-mobile.png`, fullPage: true, animations: 'disabled' })
  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  await page.screenshot({ path: `${output}/phase1-dark.png`, fullPage: true, animations: 'disabled' })
  console.log('Production preview HTTP 200; desktop, mobile and dark-mode screenshots captured.')
} finally { await browser.close() }
