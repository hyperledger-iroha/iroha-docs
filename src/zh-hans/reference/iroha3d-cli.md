---
translation_locale: zh-hans
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: nllb-200-ct2
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

运营商必须在使用前呈现规范的 Taira 配置文件. 已注册的模板有示例设置. 操作员必须取代每一个示例设置. 在与 Taira 进行测试时,不要使用通用 Nexus 或生产 SoraFS 设置.

## `--config` {#arg-config}

- 类型:文件路径
- 姓名: `-c`

进入 [对等节点配置的路径](/zh-hans/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- 类型:文件路径

选择性创世表 JSON 用于共识验证.

## `--check-config` {#arg-check-config}

验证已解决的配置和可用的创世材料,然后无需绑定网络插座退出.

## 卡盖穆沙资格章 {#kagemusha-qualification-seals}

这些文件路径选项需要 `--check-config` 并在写定章之前完成完整的Kagemusha资格:

- `--write-kagemusha-catalog-qualification-seal <PATH>` 符合目录的要求.
- `--write-kagemusha-validator-qualification-seal <PATH>`使本地验证者符合配置签署的促销预订条件.

两种密封选项相互冲突.

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

启用Sora Nexus 配置文件. 该配置文件设置 SoraFS,SoraNet 握手,以及多行道共识. 总是用这个旗调用 Taira 启动器

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

上面的选项摘要已根据当前的 `iroha3d` 参数定义进行验证。检入仓库的已生成帮助快照在其来源状态仍待确认时不会呈现。要查看与当前源码检出完全一致的帮助，请运行：

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
