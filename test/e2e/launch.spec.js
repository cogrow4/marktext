const { expect, test } = require('@playwright/test')
const { launchElectron } = require('./helpers')

test.describe('Check Launch NovelCraft', async () => {
  let app = null
  let page = null

  test.beforeAll(async () => {
    const { app: electronApp, page: firstPage } = await launchElectron()
    app = electronApp
    page = firstPage
  })

  test.afterAll(async () => {
    await app.close()
  })

  test('Empty NovelCraft', async () => {
    const title = await page.title()
    expect(/^NovelCraft|Untitled-1 - NovelCraft$/.test(title)).toBeTruthy()
  })
})
