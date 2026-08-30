---
translation_locale: zh-hant
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d`是標準的 Iroha 3 同行妖怪.貨物包名爲 `irohad`,所以從源支付中調用二進制:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

對於公衆 Taira 測試網,釋放圖片使用`iroha3d_taira`. 它接受相同的 CLI. 此外,它還執行了常規的 Taira 鏈,驗證器組,存儲設置和運行時簽名密鑰. 驗證一個 Taira 配置,不開啓運行時間憑證如下:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

運營商必須在使用前呈現正規的 Taira 配置文件. 已註冊的模板有示例設置. 操作員必須取代每一個示例設置. 在與 Taira 進行測試時,不要使用通用 Nexus 或生產 SoraFS 設置.

## `--config` {#arg-config}

- 類型:文件路徑
- 姓名: `-c`

進入 [同行配置的路徑](/zh-hant/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- 類型:文件路徑

選擇性基因表 JSON 用於共識驗證.

## `--check-config` {#arg-check-config}

驗證已解決的配置和可用的基因材料,然後無需綁定網絡插座退出.

## 卡蓋穆沙資格章 {#kagemusha-qualification-seals}

這些文件路徑選項需要 `--check-config` 並在寫定章之前完成完整的Kagemusha資格:

- `--write-kagemusha-catalog-qualification-seal <PATH>` 符合目錄的要求.
- `--write-kagemusha-validator-qualification-seal <PATH>`使本地驗證者符合配置簽署的促銷預訂條件.

兩種密封選項相互衝突.

## `--trace-config` {#arg-trace-config}

- 類型:旗
- 環境: `TRACE_CONFIG`

在配置層被讀取和解析時,啓用追蹤日誌.

## `--config-blake3` {#arg-config-blake3}

- 類型:64位的六位數消化器 BLAKE3
- 要求: `--config`

要求配置文件字節匹配所提供的消化. 一個完整性綁定的文件必須是平坦的;它不能包含 `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- 類型:布爾式,通過 `--terminal-colors=true`或 `--terminal-colors=false`
- 默認:終端能力檢測
- 環境: `TERMINAL_COLORS`

控制 ANSI 顏色輸出.

## `--language` {#arg-language}

- 類型:串

刪除用於魔鬼消息的系統語言.

## `--sora` {#arg-sora}

- 類型:旗
- 環境: `IROHA_SORA_PROFILE`

啓用Sora Nexus 配置文件. 該配置文件設置 SoraFS,SoraNet 握手,以及多行道共識. 總是用這個旗調用 Taira 發射器

## FastPQ 覆蓋範圍 {#fastpq-overrides}

`--fastpq-execution-mode <MODE>`和 `--fastpq-poseidon-mode <MODE>`只接受`cpu`或 `gpu`.其餘的選項取消了遠程測量標籤:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

例如:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## 產生的幫助 {#generated-help}

下面的完整輸出來自固定 Iroha 源提交.

<<< @/snippets/iroha3d-help.md
