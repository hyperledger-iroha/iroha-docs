---
translation_locale: zh-hant
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` 開始一個 Iroha 3 這樣的情況會發生.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- **種類:** 文件的路徑
- **其他名稱:** `-c`

導致的道路 [配置方式](/zh-hant/reference/peer-config/index.md) 這樣的文件.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- **種類:** 文件的路徑

選擇性通路到基因表 JSON 使用這個在部署
核准啟動與由 Kagami.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

允許檢查配置閱讀和解析的日志.

- **種類:** 旗
- **ENV:** `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- **種類:** 這種方式, `--terminal-colors=false` 或是
  `--terminal-colors=true`
- **預設:** 自動檢測終端支持
- **ENV:** `TERMINAL_COLORS`

能否使 ANSI- 還是沒有彩色輸出.

預設, Iroha 決定終端是否支持彩色輸出
或是沒有.

顯示不使用顏色:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- **種類:** 串子

取消使用於惡魔訊息的系統語言.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- **種類:** 旗

啟動索拉 Nexus 該類型的特色 SoraFS, 這項政策 SoraNet 握手,以及
兩岸的共識流量.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- **種類:** `auto`, `cpu`, 或是 `gpu`

超過時間 FASTPQ 檢測執行模式.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- **種類:** `auto`, `cpu`, 或是 `gpu`

超過時間 FASTPQ 這裡是"波西頓管道模式".

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- **種類:** 串子

取消使用 FASTPQ 遠隔測量儀器類標籤.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- **種類:** 串子

取消使用 FASTPQ 遠隔測量芯片家族標籤.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- **種類:** 串子

取消使用 FASTPQ 遠程測量 GPU- 這種標籤.

```shell
irohad --fastpq-gpu-kind integrated
```
