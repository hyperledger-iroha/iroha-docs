---
translation_locale: zh-hans
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad`开始一个 Iroha 3 同行妖怪.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- 类型:文件路径
- 姓名: `-c`

到 [配置文件](/zh-hans/reference/peer-config/index.md)的路径.

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- 类型:文件路径

选择通路到一个创始表格文件 JSON.使用此方法,当部署验证启动时与由 Kagami 生成的表格相比.

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

可以追踪配置读取和解析的日志.可能是用于配置故障解决.

- 类型:旗
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- 类型:玻璃, `--terminal-colors=false` 或 `--terminal-colors=true`
- 默认:自动检测终端支持
- ENV: `TERMINAL_COLORS`

是否启动 ANSI 颜色输出.

默认情况下, Iroha 确定终端是否支持彩色输出.

为了明确禁用颜色:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- 类型:弦

删除用于魔鬼消息的系统语言.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- 类型:旗

启用 SoraFS 的 Sora Nexus 功能配置文件,SoraNet 的握手和多行道共识流.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- 类型: `auto`, `cpu`,或`gpu`

过关 FASTPQ 检测器执行模式.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- 类型: `auto`, `cpu`,或`gpu`

覆盖 FASTPQ 波西顿管道模式.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- 类型:弦

取消 FASTPQ 远程测量设备类标签.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- 类型:弦

覆盖 FASTPQ 远程测量芯片家族标签.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- 类型:弦

覆盖 FASTPQ 远程测量 GPU- 这种标签.

```shell
irohad --fastpq-gpu-kind integrated
```
