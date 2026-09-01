---
translation_locale: zh-hans
translation_source: /help/installation-issues.md
translation_source_hash: 1a2519123edc5224e720e23ef3e2bc2a7b4dba38ef87af49216c31c054c85a2a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解决安装问题 {#troubleshooting-installation-issues}

本节提供 Iroha 3 安装的故障解决技巧. 如果您遇到的问题没有在这里描述,请通过 [电报](https://t.me/hyperledgeriroha)联系我们.

## 快速检查 {#quick-checks}

最多的安装故障来自四个地方之一:

- 一个 Rust 工具链比上游工作空间固定的版本更老
- `cargo`或`rustc`分离到一个不同于 `rustup`的装置
- 缺失的系统构建工具,如C编译器, `pkg-config`,或CMake
- 经过变更源改后生成过时的摘录或本地构建构件

从 Iroha 来源清算中,开始:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

如果 `cargo metadata` 失败,在运行 `pnpm refresh:iroha --source /path/to/iroha`之前修复本地工具链,因为更新可以调用 Kagami 来生成当前的数据模型方案.

## 解决问题 Rust 工具链 {#troubleshooting-rust-toolchain}

有时,事情不会按计划进行.特别是如果你有 `rust` 在你的系统上一段时间前,但没有升级.类似的问题可以发生在 Python: XKCD 有一个著名的例子,它可能看起来像:

<div class="flex justify-center">

![Python 环境故障解决漫画](/img/install-troubles.png)

</div>

### 检查 Rust 版本 {#check-rust-version}

为避免彼此困扰，请确认正确版本的 `cargo` 与正确版本的 `rustc` 配对使用。当前的上游 workspace 声明 `rust-version = "1.92"`，并在 `rust-toolchain.toml` 中锁定 toolchain channel。若要显示版本，请执行：

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

然后,

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

如果你有更高的版本,你没事.如果你有较低的版本,你可以运行下列命令更新它:

```bash
$ rustup toolchain update stable
```

### 检查安装地点 {#check-installation-location}

如果你得到较低的版本号码,并且更新了工具链并没有工作... 让我们说这是一个常见的问题,但它没有共同解决方案.

首先,您应该确定您想要使用的版本安装在哪里:

```bash
$ rustup which rustc
$ rustup which cargo
```

工具链的用户安装通常在 `~/.rustup/toolchains/stable-*/bin/`.如果是这样,你应该能够运行

```bash
$ rustup toolchain update stable
```

这应该解决你的问题.

### 检查默认版本 Rust {#check-the-default-rust-version}

另一个选项是,你有更新的 `stable`工具链,但它不是默认设置.运行:

```bash
$ rustup default stable
```

如果安装 `nightly` 版本或设置特定的 Rust 版本,然后不调整,则可能会导致此问题.

### 检查是否有其他版本 Rust {#check-if-there-are-other-rust-versions}

继续解决问题子洞,我们可能会有子的别名:

```bash
$ type rustc
$ type cargo
```

如果这些指向您在运行 `rustup which *`时看到的位置以外的地方,那么您就有问题了.请注意,添加类似于此类别的号不够:

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

不管你如何安排你的外名,内部逻辑仍然可以破裂.

最简单的解决方案是删除你不使用的版本.

然而,这比做起来更容易,因为它需要跟踪所有版本的 rustup 通常,只有两个:系统包管理器版本和安装的版本在您的家庭文件中的标准位置中,当您运行命令时对于前者,请参阅您的 (Linux) 分布指南.`apt remove rust`) 对于后者,运行:

```bash
$ rustup toolchain list
```

然后,每一个 `<toolchain>` (当然没有角括号):

```bash
$ rustup remove <toolchain>
```

在移除工具链后,该命令应该报告一个未找到的命令错误:

```bash
$ cargo --help
```

该错误确认没有安装活跃的 Rust 工具链.然后运行:

```bash
$ rustup toolchain install stable
```

## 解决故障的工具链 Python {#troubleshooting-python-toolchain}

当您在 [Python 客户端设置](/zh-hans/guide/tutorials/python.md)期间安装使用 pip 的 Python 轮包时,可能会遇到这样的错误: "iroha_python-*.whl 不是这个平台上的支持式轮".

此错误意味着 pip 已经过时,因此您需要更新它.首先,建议检查您的 OS 是否有更新并进行系统升级.

如果这不起作用,你可以尝试更新用户目录的 `pip`.

`python -m pip install --upgrade pip`

确保在您的家庭目录中安装了 `pip`.要做到这一点,运行`whereis pip`并检查是否有 `/home/username/.local/bin/pip` 在路径中.如果没有,请更新 shell 的 `PATH`变量.

如果问题持续下去,请联系我们 [ ](/zh-hans/help/)并报告输出.

```
python --version
python3 --version
pip --version
pip3 --version
```
