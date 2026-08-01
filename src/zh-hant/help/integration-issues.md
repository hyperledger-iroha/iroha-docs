---
translation_locale: zh-hant
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解決整合問題 {#troubleshooting-integration-issues}

這個節目提供瞭解決問題的建議 Iroha 3 如果您所遇到的問題不詳細介紹,請通過 [電報](https://t.me/hyperledgeriroha).

## 客戶端無法連接 {#client-cannot-connect}

檢查客戶端配置是否指向同行的 Torii 地址:

```toml
torii_url = "http://127.0.0.1:8080/"
```

對於 CLI 檢查,明確傳遞相同的文件:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

如果同行走進 Docker 或Kubernetes,使用客戶端進程可訪問的主機或服務地址. `127.0.0.1` 在容器內,不是主機.

對於公共測試 Taira,開始使用未簽名的終點探測器:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

如果這些命令失敗於 `502`, TLS,DNS 或截止時間錯誤,請修復網絡可訪問性或等待公共測試網端點才能調整帳戶密鑰或交易有效負載.

## 交易被拒絕 {#transactions-are-rejected}

大多數交易失敗是由身份或授權不匹配造成的:

- 客戶端配置中的帳戶公鑰不匹配簽名所使用的私鑰
- 賬戶沒有在創始或之前的交易中註冊
- 賬戶缺乏運行時間驗證器所要求的許可令牌或角色
- 一個域名 ID 缺乏其數據空間資格,例如 `domain.dataspace`

使用 `--output-format text` 在調試 CLI 命令時,以便更容易讀取錯誤:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## 查詢返回空結果 {#queries-return-empty-results}

查詢結果並不總是意味着查詢失敗.

- 應創建對象的交易已發生
- 被查詢的域名,資產定義或賬戶 ID 是法定.
- 頁面化或過器不排除預期行
- 客戶端連接到預期網絡,而不是另一個本地網

對於域名檢查,請從最廣泛的查詢開始:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 事件或區塊流早點停止 {#event-or-block-streams-stop-early}

區塊和事件流的示例依賴於 Torii 流媒體終端點. 檢查同行仍然運行,然後使用時間限測試:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

對於 HTTP 集成,將端點路徑與當前的 [Torii 端點引用](/zh-hant/reference/torii-endpoints.md)進行比較.
