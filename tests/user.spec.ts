// 僅能 mock CSR request，若要測試，需將 pages/index.vue callOnce 改為 onBeforeMount

import { test as testBase, expect } from '@nuxt/test-utils/playwright'
import { createNetworkFixture, type NetworkFixture } from '@msw/playwright'
import { config } from 'dotenv'
import { http, HttpResponse } from 'msw'

config()

interface Fixtures {
  network: NetworkFixture
}
const test = testBase.extend<Fixtures>({
  network: createNetworkFixture({
    initialHandlers: [],
  }),
})

function apiURL(path: string) {
  return process.env.NUXT_PUBLIC_API_BASE_URL + path
}

test('取得用戶資料', async ({ page, goto, network }) => {
  const data = [
    {
      id: 1,
      name: '林建智',
      age: 16,
    },
    {
      id: 2,
      name: '吳政貞',
      age: 19,
    },
  ]
  network.use(
    http.get(
      apiURL('/user'),
      ({ request }) => {
        return HttpResponse.json({
          code: 200,
          data,
          message: '',
        })
      },
      { once: true }
    )
  )
  await goto('/')

  await expect(page.getByText('林建智', { exact: true })).toBeVisible()
  await expect(page.getByText('19', { exact: true })).toBeVisible()
})

test('新增 - 確認', async ({ page, goto, network }) => {
  const data = <{ id: number; name: string; age: number }[]>[]
  network.use(
    http.get(
      apiURL('/user'),
      () => {
        return HttpResponse.json({
          code: 200,
          data,
          message: '',
        })
      },
      { once: true }
    )
  )
  network.use(
    http.post(
      apiURL('/user'),
      async ({ request }) => {
        const id = 1
        const { name, age } = (await request.json()) as { name: string; age: number }
        if (typeof name !== 'string') throw Error()
        if (name.trim().length === 0) throw Error()
        if (typeof age !== 'number') throw Error()
        if (parseInt(age.toString(), 10) !== age) throw Error()
        if (age < 0) throw Error()

        data.push({ id, name, age })
        return HttpResponse.json({
          code: 200,
          data: { id },
          message: '',
        })
      },
      { once: true }
    )
  )
  await goto('/')

  await page.getByLabel('Name').fill('林建智')
  await page.getByLabel('Age').fill('16')
  await page.getByText('Create').click()
  await page.getByText('Confirm').click()

  await expect(page.getByLabel('Name')).toHaveValue('')
  await expect(page.getByLabel('Age')).toHaveValue('')
  await expect(page.getByText('1', { exact: true })).toBeVisible()
  await expect(page.getByText('林建智', { exact: true })).toBeVisible()
  await expect(page.getByText('16', { exact: true })).toBeVisible()
})

test('新增 - 名字必填', async ({ page, goto, network }) => {
  const data = <{ id: number; name: string; age: number }[]>[]
  network.use(
    http.get(
      apiURL('/user'),
      () => {
        return HttpResponse.json({
          code: 200,
          data,
          message: '',
        })
      },
      { once: true }
    )
  )
  await goto('/')

  await page.getByLabel('Age').fill('0')
  await page.getByText('Create').click()

  await expect(page.getByText('Required', { exact: true })).toBeVisible()
})

test('新增 - 年齡必填', async ({ page, goto, network }) => {
  const data = <{ id: number; name: string; age: number }[]>[]
  network.use(
    http.get(
      apiURL('/user'),
      () => {
        return HttpResponse.json({
          code: 200,
          data,
          message: '',
        })
      },
      { once: true }
    )
  )
  await goto('/')

  await page.getByLabel('Name').fill('林建智')
  await page.getByText('Create').click()

  await expect(page.getByText('Required', { exact: true })).toBeVisible()
})

test('新增 - 年齡須為整數', async ({ page, goto, network }) => {
  const data = <{ id: number; name: string; age: number }[]>[]
  network.use(
    http.get(
      apiURL('/user'),
      () => {
        return HttpResponse.json({
          code: 200,
          data,
          message: '',
        })
      },
      { once: true }
    )
  )
  await goto('/')

  await page.getByLabel('Name').fill('林建智')
  await page.getByLabel('Age').fill('qwe')
  await page.getByText('Create').click()

  await expect(page.getByText('Should be integer', { exact: true })).toBeVisible()
})

test('新增 - 年齡需大於等於0', async ({ page, goto, network }) => {
  const data = <{ id: number; name: string; age: number }[]>[]
  network.use(
    http.get(
      apiURL('/user'),
      () => {
        return HttpResponse.json({
          code: 200,
          data,
          message: '',
        })
      },
      { once: true }
    )
  )
  await goto('/')

  await page.getByLabel('Name').fill('林建智')
  await page.getByLabel('Age').fill('-1')
  await page.getByText('Create').click()

  await expect(page.getByText('Should be larger than or equal to 0', { exact: true })).toBeVisible()
})

test('新增 - 取消', async ({ page, goto, network }) => {
  const data = <{ id: number; name: string; age: number }[]>[]
  network.use(
    http.get(
      apiURL('/user'),
      () => {
        return HttpResponse.json({
          code: 200,
          data,
          message: '',
        })
      },
      { once: true }
    )
  )
  await goto('/')

  await page.getByLabel('Name').fill('林建智')
  await page.getByLabel('Age').fill('16')
  await page.getByText('Create').click()
  await page.getByText('Cancel').click()
})

test('修改 - 確認', async ({ page, goto, network }) => {
  const data = [
    {
      id: 1,
      name: '林建智',
      age: 16,
    },
  ]
  network.use(
    http.get(
      apiURL('/user'),
      () => {
        return HttpResponse.json({
          code: 200,
          data,
          message: '',
        })
      },
      { once: true }
    )
  )
  network.use(
    http.put(
      apiURL('/user'),
      async ({ request }) => {
        const { id, name, age } = (await request.json()) as {
          id: number
          name: string
          age: number
        }
        if (typeof id !== 'number') throw Error()
        if (data.some((datum) => datum.id === id) === false) throw Error()
        if (typeof name !== 'string') throw Error()
        if (name.trim().length === 0) throw Error()
        if (typeof age !== 'number') throw Error()
        if (parseInt(age.toString(), 10) !== age) throw Error()
        if (age < 0) throw Error()

        data[0] = { id, name, age }
        return HttpResponse.json({
          code: 200,
          data: '',
          message: '',
        })
      },
      { once: true }
    )
  )
  await goto('/')

  await page.getByText('Edit').last().click()
  await expect(page.getByLabel('Name')).toHaveValue('林建智')
  await expect(page.getByLabel('Age')).toHaveValue('16')

  await page.getByLabel('Name').fill('吳政貞')
  await page.getByLabel('Age').fill('19')
  await page.getByText('Edit').first().click()
  await page.getByText('Confirm').click()

  await expect(page.getByLabel('Name')).toHaveValue('')
  await expect(page.getByLabel('Age')).toHaveValue('')
  await expect(page.getByText('1', { exact: true })).toBeVisible()
  await expect(page.getByText('吳政貞', { exact: true })).toBeVisible()
  await expect(page.getByText('19', { exact: true })).toBeVisible()
})

test('修改 - 驗證失敗', async ({ page, goto, network }) => {
  const data = [
    {
      id: 1,
      name: '林建智',
      age: 16,
    },
  ]
  network.use(
    http.get(
      apiURL('/user'),
      () => {
        return HttpResponse.json({
          code: 200,
          data,
          message: '',
        })
      },
      { once: true }
    )
  )
  await goto('/')

  await page.getByText('Edit').last().click()
  await page.getByLabel('Age').fill('-1')
  await page.getByText('Edit').first().click()

  await expect(page.getByText('Should be larger than or equal to 0', { exact: true })).toBeVisible()
})

test('修改 - 取消', async ({ page, goto, network }) => {
  const data = [
    {
      id: 1,
      name: '林建智',
      age: 16,
    },
  ]
  network.use(
    http.get(
      apiURL('/user'),
      () => {
        return HttpResponse.json({
          code: 200,
          data,
          message: '',
        })
      },
      { once: true }
    )
  )
  await goto('/')

  await page.getByText('Edit').last().click()
  await page.getByLabel('Name').fill('吳政貞')
  await page.getByLabel('Age').fill('19')
  await page.getByText('Edit').first().click()
  await page.getByText('Cancel').last().click()
})

test('刪除 - 確認', async ({ page, goto, network }) => {
  const data = [
    {
      id: 1,
      name: '林建智',
      age: 16,
    },
    {
      id: 2,
      name: '吳政貞',
      age: 19,
    },
  ]

  network.use(
    http.get(
      apiURL('/user'),
      () => {
        return HttpResponse.json({
          code: 200,
          data,
          message: '',
        })
      },
      { once: true }
    )
  )
  network.use(
    http.delete(
      apiURL('/user'),
      ({ request }) => {
        data.pop()
        return HttpResponse.json({
          code: 200,
          data: '',
          message: '',
        })
      },
      { once: true }
    )
  )
  await goto('/')

  await page.getByText('Delete').last().click()
  await page.getByText('Confirm').click()

  await expect(page.getByText('1', { exact: true })).toBeVisible()
  await expect(page.getByText('2')).not.toBeVisible()
})

test('刪除 - 取消', async ({ page, goto, network }) => {
  const data = [
    {
      id: 1,
      name: '林建智',
      age: 16,
    },
    {
      id: 2,
      name: '吳政貞',
      age: 19,
    },
  ]
  network.use(
    http.get(
      apiURL('/user'),
      () => {
        return HttpResponse.json({
          code: 200,
          data,
          message: '',
        })
      },
      { once: true }
    )
  )
  network.use(
    http.delete(
      apiURL('/user'),
      () => {
        throw Error()
      },
      { once: true }
    )
  )
  await goto('/')

  await page.getByText('Delete').last().click()
  await page.getByText('Cancel').click()
})
