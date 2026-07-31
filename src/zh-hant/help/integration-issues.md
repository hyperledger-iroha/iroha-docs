---
translation_locale: zh-hant
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解決整合問題 {#troubleshooting-integration-issues}

這部分提供解決問題的建議. Iroha 3 如果問題是:
你所經歷的情況並沒有被描述,
透過網路聯絡我們 [電子郵件](https://t.me/hyperledgeriroha).

## 客戶端無法連接 {#client-cannot-connect}

檢查客戶配置指向同行的 Torii 年 月 日

```toml
torii_url = "http://127.0.0.1:8080/"
```

於 CLI 檢查,明顯通過相同檔案:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

如果同行走進, Docker 或使用主機或服務地址,
在客戶過程中可達到. `127.0.0.1` 在容器內沒有
接待機的機體.

供公眾使用 Taira 檢測,從未簽名的終點探測器開始:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

如果這些命令失敗, `502`, TLS, DNS, 或時間內錯誤,
在預測帳戶之前,必須等待公開的測試網端點
關鍵或交易用量.

## 交易被拒絕 {#transactions-are-rejected}

大部分交易失败是由身份或授權不一致造成的:

- 客戶配置中的帳戶公钥不符合私密鍵
  使用於簽名
- 帳戶沒有註冊於創世記或之前的交易
- 這個帳戶缺乏執行時間所需的許可令牌或角色
  核准器
- 域名 ID 沒有其數據空間資格,
  `domain.dataspace`

使用 `--output-format text` 在檢查情況下 CLI 命令讓錯誤更容易
閱讀:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## 查詢返回空白結果 {#queries-return-empty-results}

沒有查詢結果,並不代表查詢失敗.

- 該產品的交易已發生
- 查詢域名,資產定義或帳戶 ID 是法典的
- 頁面化或過濾器不排除預期的行列
- 客戶端與預期的網路連接,而不是其他本地網絡

請從最廣泛的查詢開始:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 事件或阻礙流程早已停止 {#event-or-block-streams-stop-early}

區塊和事件流的例子依賴 Torii 檢查使用者數量
這樣的測試仍在進行,

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

於 HTTP 整合,與電流相比.
[Torii 終點參考](/zh-hant/reference/torii-endpoints.md).
