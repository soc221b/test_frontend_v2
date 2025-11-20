# 前端面試測試

## 執行方式

```sh
echo "NUXT_PUBLIC_API_BASE_URL=<string>" > .env
pnpm i --frozen-lockfile
pnpm run dev
```

## 測試方式

因為沒有 mock server side request，請先將 callOne 改為 onBeforeMount

```ts
// await callOnce('load-users', appStore.load)
onBeforeMount(() => {
  appStore.load()
})
```

```sh
echo "NUXT_PUBLIC_API_BASE_URL=" > .env
pnpm i --frozen-lockfile
pnpm run test
```

**嚴格禁止往本倉庫發送PR**

更新日期 2025/11/11

## API

- `baseUrl` 將由面試官提供
- 文檔網址 `${baseUrl}/swagger/index.html`

---

## 測試題目

1. 請先將題目 fork 到自己的倉庫，完成後請提交整個 git 連結
2. 使用 `typescript` 語法完成
3. 使用 `axios` 完成對資料的 增刪改查
4. `新增`、`刪除`、`修改`等操作，發送請求前需與用戶進行確認
5. 資料需於前端校驗完畢後才可提交
6. 與用戶進行確認的畫面，請使用 `dialog` 標籤完成
7. 用戶資料使用 `pinia` 保存
8. 取得用戶資料只允許在 `SSR` 階段完成
9. 配置 `vue-i18n`，繁體中文、英文
10. 封裝 `按鈕`、`輸入框` 組件
11. 請根據基礎設計稿，刻劃畫面，並依據需求自行新增元素
12. `vue-tsc` 檢查必須通過
13. 配置RWD，螢幕最小支持 320px (注意UX)

---

## 組件

### 按鈕 ([EBtn.vue](components/EBtn.vue))

- hover、active 需發生樣式改變

### 輸入框 ([ETextField.vue](components/ETextField.vue))

- 需能使用 v-model:value 進行雙向綁定
- 不使用 `defineModel` 且使用 `computed` 加分

---

## 設計稿(基礎)

![test.jpg](public/test.jpg)

---

## 額外內容

- 使用 `@openapitools/openapi-generator-cli` 生成 api 文件
- 請將您的專案透過自動化構建方式部屬 如(cloudflare pages、github pages、netlify、vercel 等)

## 使用

```shell
    pnpm install
    pnpm dev
```
