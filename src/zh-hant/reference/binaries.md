---
translation_locale: zh-hant
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# 與...一起工作 Iroha 二進位檔案 {#working-with-iroha-binaries}

這 Iroha 3 操作員工作流程圍繞著三個主要二進位檔案：

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) 用於運行對等守護進程
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) 為了 CLI 和操作員命令
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) 用於金鑰、創世、本地網路和設定文件

## 從原始碼構建 {#build-from-source}

從上游工作區根目錄：

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

然後可以使用發布二進位文件 `target/release/`.

要檢查命令表面：

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## 直接從儲存庫運行 {#run-directly-from-the-repository}

如果您不想全域安裝任何東西，請使用 `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker 影像 {#docker-image}

上游工作區使用 `kagami localnet` 和 `kagami docker` 產生
Docker Compose 與簽出程式碼相符的檔案。這 `hyperledger/iroha:dev`
圖像可以與這些生成的文件一起使用。

運行 CLI 在容器中：

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

跑步 Kagami 在容器中：

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

對於對等啟動，首先產生 localnet 和 Compose 檔案：

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## 我應該使用哪個二進位檔案？ {#which-binary-should-i-use}

- 使用 `irohad` 當你開始或經營同行時。
- 使用 `iroha` 當您需要查詢帳本、提交交易或檢查操作員端點時。
- 使用 `kagami` 當您需要金鑰、創世清單、設定檔包或本地網路資產時。

## 影武者發布、發布和推出 {#kagemusha-release-publication-and-rollout}

影武者 V4 發布和啟動跨越單獨的受保護邊界：

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` 是
  僅限 macOS、僅限 root 的發布者。它驗證固定的 Kagami 二進制和
  確切的十六檔候選人，公佈缺席
  `promotion-record-v4.norito` 無需更換，僅報告成功
  在確切的十七個文件升級版本驗證之後。
- `iroha offline kagemusha rollout-v4 create-expectations` 驗證簽名的
  預訂，四個訂購的驗證者資格印章，準確
  已經授權的交易電匯，以及先前可信的最終錨定
  出版簽署期望無需更換。
- `iroha offline kagemusha rollout-v4 submit` 需要明確的
  `--write-authorized` 同意。它持久地記錄並重新驗證確切的
  網路寫入或重試之前的期望。一個 `Applied` 狀態不是
  足夠了：該命令還驗證已提交的區塊、最終性後繼者
  鏈，以及完整的授權交易線路。
- `iroha offline kagemusha rollout-v4 finalize-receipt` 僅在精確的提交日誌
  重新驗證後，收集相同的證明錨定證據，由獨立收據發行者簽署，並在不替換
  現有檔案的情況下發布規範收據。

簽入的 Kagemusha 生產準備工作流程僅用於驗證。
它不會呼叫經過認證的發布者，發布驗證者資格
密封、提交啟動或建立最終收據。成功的工作流程
因此，run 既不能證明促銷，也不能證明即時部署。

這些命令是本地原語，不能取代現場證據。一個
如果沒有真正的實體應用證明，生產部署仍然受阻
候選工件、所有四個受保護的主機密封、運行時治理和
簽名輸入、即時四驗證者提交和最終性證據，以及
規範有效構型投影。保留私鑰，
受保護的身份驗證資料和促銷特定識別符
運行時託管；不要將它們複製到原始碼控製文件中或
操作員票。
