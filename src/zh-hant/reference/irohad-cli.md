---
translation_locale: zh-hant
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad`開始一個 Iroha 3 同行妖怪.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- 類型:文件路徑
- 姓名: `-c`

到 [配置文件](/zh-hant/reference/peer-config/index.md)的路徑.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- 類型:文件路徑

選擇通路到一個創始表格文件 JSON.使用此方法,當部署驗證啓動時與由 Kagami 生成的表格相比.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

可以追蹤配置讀取和解析的日誌.可能是用於配置故障解決.

- 類型:旗
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- 類型:玻璃, `--terminal-colors=false` 或 `--terminal-colors=true`
- 默認:自動檢測終端支持
- ENV: `TERMINAL_COLORS`

是否啓動 ANSI 顏色輸出.

默認情況下, Iroha 確定終端是否支持彩色輸出.

爲了明確禁用顏色:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- 類型:弦

刪除用於魔鬼消息的系統語言.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- 類型:旗

啓用 SoraFS 的 Sora Nexus 功能配置文件,SoraNet 的握手和多行道共識流.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- 類型: `auto`, `cpu`,或`gpu`

過關 FASTPQ 檢測器執行模式.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- 類型: `auto`, `cpu`,或`gpu`

覆蓋 FASTPQ 波西頓管道模式.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- 類型:弦

取消 FASTPQ 遠程測量設備類標籤.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- 類型:弦

覆蓋 FASTPQ 遠程測量芯片家族標籤.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- 類型:弦

覆蓋 FASTPQ 遠程測量 GPU- 這種標籤.

```shell
irohad --fastpq-gpu-kind integrated
```
