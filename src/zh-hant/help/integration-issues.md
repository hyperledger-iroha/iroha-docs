---
translation_locale: zh-hant
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解決整合問題 {#troubleshooting-integration-issues}

這個節目提供瞭解決問題的建議 Iroha 3 如果您所遇到的問題不詳細介紹,請透過 [電報](https://t.me/hyperledgeriroha).

## 客戶端無法連線 {#client-cannot-connect}

檢查客戶端配置是否指向對等節點的 Torii 地址:

```toml
torii_url = "http://127.0.0.1:8080/"
```

對於 CLI 檢查,明確傳遞相同的檔案:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

如果對等節點走進 Docker 或Kubernetes,使用客戶端程序可訪問的主機或服務地址. `127.0.0.1` 在容器內,不是主機.

對於公共測試 Taira,開始使用未簽名的端點探測器:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

如果這些命令失敗於 `502`, TLS,DNS 或截止時間錯誤,請修復網路可訪問性或等待公共測試網端點才能調整帳戶金鑰或交易有效負載.

## 交易被拒絕 {#transactions-are-rejected}

大多數交易失敗是由身份或授權不匹配造成的:

- 客戶端配置中的帳戶公鑰不匹配簽名所使用的私鑰
- 帳戶沒有在創世或之前的交易中註冊
- 帳戶缺乏執行階段驗證器所要求的許可令牌或角色
- 一個域名 ID 缺乏其資料空間資格,例如 `domain.dataspace`

使用 `--output-format text` 在除錯 CLI 命令時,以便更容易讀取錯誤:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## 查詢返回空結果 {#queries-return-empty-results}

查詢結果並不總是意味著查詢失敗.

- 應建立物件的交易已發生
- 查詢所用的網域、資產定義或帳戶 ID 符合規範。
- 頁面化或過濾器不排除預期行
- 客戶端連線到預期網路,而不是另一個本地網

對於域名檢查,請從最廣泛的查詢開始:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 事件或區塊流早點停止 {#event-or-block-streams-stop-early}

區塊和事件流的示例依賴於 Torii 流媒體端點. 檢查對等節點仍然執行,然後使用時間限測試:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

對於 HTTP 整合,將端點路徑與當前的 [Torii 端點引用](/zh-hant/reference/torii-endpoints.md)進行比較.
