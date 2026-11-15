---
translation_locale: zh-hans
translation_source: /reference/iroha3d-cli.md
translation_source_hash: 846370e45fe0e0d605016d6722b1d50c39981f954c7d9040b87fc385eb12ac68
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# `iroha3d` CLI {#iroha3d-cli}

`iroha3d`是标准的 Iroha 3 对等节点守护进程.Cargo 软件包名为 `irohad`,所以从源支付中调用二进制:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

对于公众 Taira 测试网,释放图片使用`iroha3d_taira`. 它接受相同的 CLI. 此外,它还执行了规范的 Taira 链,验证器组,存储设置和运行时签名密钥. 验证一个 Taira 配置,不开启运行时凭证如下:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

请使用由运维人员填充完成的规范 Taira 配置；仓库中的模板仍包含部署占位符。在 Taira 上测试时，不要替换为通用 SORA Nexus 配置或生产 SoraFS 设置。

## `--config` {#arg-config}

- 类型:文件路径
- 姓名: `-c`

进入 [对等节点配置的路径](/zh-hans/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- 类型:文件路径

选择性创世表 JSON 用于共识验证.

## `--check-config` {#arg-check-config}

验证已解决的配置和可用的创世材料,然后无需绑定网络插座退出.

## `--json` {#arg-json}

- **类型：**开关选项
- **要求：** `--check-config`

将此构建和配置的兼容性值作为一个 Norito JSON 对象打印，而不是 `Ready` 或 `Pending` 行。

## `--check-storage` {#arg-check-storage}

- **类型：**开关选项
- **冲突项：** `--check-config`

使用本构建的解码器，以只读方式检查已停止节点的 Kura 存储及最新快照，将结果打印为一个 Norito JSON 对象，并在失败时以非零状态退出。检查会获取 Kura 存储根锁，因此拒绝由运行中节点占用的存储。它不会修改存储，也不会打开仅供运行时使用的秘密。

## `--check-replay` {#arg-check-replay}

- **类型：**开关选项
- **冲突项：** `--check-config`、`--check-storage`

使用本构建重放已停止节点的存储副本，并将结果打印为一个 Norito JSON 对象。命令将区块复制到临时目录，在其中恢复最新快照或重新执行已签名创世配置，然后重新执行后续每个区块。若区块无法重现其认证结果，或缺少所需区块体，则以非零状态退出；它不会写入原存储，也不会打开仅供运行时使用的秘密。

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **类型：**账户 ID
- **要求：** `--check-config`

离线验证时，要求该已注册账户在执行指定的已签名创世配置后仍保留 SoraCloud 部署权限。

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **类型：**开关选项

仅对本次启动声明节点的共识密钥从未为该链签名。Sumeragi 为每个密钥保存安全记录；缺少记录时，在取得该记录并未丢失的证明之前不会签署任何内容。仅在新密钥首次启动时传入该选项一次，数据丢失后绝不可使用。

## `--trace-config` {#arg-trace-config}

- 类型:旗
- 环境: `TRACE_CONFIG`

在配置层被读取和解析时,启用追踪日志.

## `--config-blake3` {#arg-config-blake3}

- 类型:64位的六位数摘要 BLAKE3
- 要求: `--config`

要求配置文件字节匹配所提供的摘要. 一个完整性绑定的文件必须是平坦的;它不能包含 `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- 类型:布尔式,通过 `--terminal-colors=true`或 `--terminal-colors=false`
- 默认:终端能力检测
- 环境: `TERMINAL_COLORS`

控制 ANSI 颜色输出.

## `--language` {#arg-language}

- 类型:串

覆盖守护进程消息所使用的系统语言。

## `--sora` {#arg-sora}

- 类型:旗
- 环境: `IROHA_SORA_PROFILE`

启用 SoraFS、SoraNet 握手和多执行通道共识所用的 SORA Nexus 配置。Taira 启动器始终带此选项调用。

## FastPQ 覆盖范围 {#fastpq-overrides}

`--fastpq-execution-mode <MODE>`和 `--fastpq-poseidon-mode <MODE>`只接受`cpu`或 `gpu`.其余的选项取消了远程测量标签:

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

## 产生的帮助 {#generated-help}

上述选项摘要依据固定 Iroha commit 中的 `iroha3d` 参数定义。要查看当前源码工作副本的准确帮助，请运行：

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
