---
translation_locale: zh-hans
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解决安装问题 {#troubleshooting-installation-issues}

本节提供了解决问题建议 Iroha 3 设置.
您正在经历的问题没有在这里描述,
通过 [电报](https://t.me/hyperledgeriroha).

## 快速检查 {#quick-checks}

大多数安装故障来自四个地方之一:

- 一个 Rust 比上游工作空间固定的版本更老的工具链
- `cargo` 或 `rustc` 解决一个不同于 `rustup`
- 缺少系统构建工具,如C编译器, `pkg-config`, 或 CMake
- 经过变更的来源后,生成过时的截图或本地构建文物
  修订

通过 Iroha 来源清算,从以下开始:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

如果 `cargo metadata` 如果失败,在运行前修复本地工具链
`pnpm refresh:iroha --source /path/to/iroha`, 因为更新可以调用
Kagami 为生成当前的数据模型方案.

## 解决问题 Rust 工具链 {#troubleshooting-rust-toolchain}

有时,事情不如计划. `rust` 在你的
一段时间前,但没有升级.
Python: XKCD 这里有一个著名的例子:

<div class="flex justify-center">

![Python 环境故障解决漫画](/img/install-troubles.png)

</div>

### 检查 Rust 版本 {#check-rust-version}

为了维护你和我们的智力,
有正确的版本 `cargo` 与正确的版本相对 `rustc`.
目前的上游工作空间声明 `rust-version = "1.92"` 和子
工具链通道 `rust-toolchain.toml`. 为了显示版本,

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

然后,

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

如果你有更高的版本,你就很好.如果你有较低的版本,
可以运行下列命令来更新它:

```bash
$ rustup toolchain update stable
```

### 检查安装地点 {#check-installation-location}

如果你得到较低的版本号码 **并且** 你更新了工具链,
没有工作...让我们说这是一个常见的问题,但它没有一个问题.
共同解决方案.

首先,你应该确定你想要使用的版本是
安装:

```bash
$ rustup which rustc
$ rustup which cargo
```

工具链的用户安装是 _通常_ 在
`~/.rustup/toolchains/stable-*/bin/`. 如果是这样的话,你应该
能够运行

```bash
$ rustup toolchain update stable
```

这应该解决你的问题.

### 检查默认 Rust 版本 {#check-the-default-rust-version}

另一个选择是,你有最新的 `stable` 工具链,但它
没有设置为默认.

```bash
$ rustup default stable
```

如果您安装了 `nightly` 版本,或设置特定的
Rust 版本,但忘了打开设置.

### 检查是否有其他 Rust 版本 {#check-if-there-are-other-rust-versions}

继续解决问题子洞,我们可能会有炮弹
姓名:

```bash
$ type rustc
$ type cargo
```

如果这些指向其他地方,
`rustup which *`, 您需要注意的是,
只是

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

因为有一个内部的逻辑可以被打破,
重新安排你的形姓名.

最简单的解决方案是删除你不使用的版本.

这更容易. _他说_ 超过 _完成_, 然而,由于它涉及跟踪所有
的版本 rustup 通常,只能使用
第二,系统包管理版本和安装在
当您运行命令时,在主文件中的标准位置
对于前者,请参阅你的 (Linux)
配送手册 (`apt remove rust`对于后者,运行:

```bash
$ rustup toolchain list
```

然后,每一个 `<toolchain>` (当然没有角括号):

```bash
$ rustup remove <toolchain>
```

在此之后,确保

```bash
$ cargo --help
```

导致命令未找到错误,即您没有活跃的 Rust
然后运行:

```bash
$ rustup toolchain install stable
```

## 解决问题 Python 工具链 {#troubleshooting-python-toolchain}

在安装时, Python 轮子包装使用管 during [Python 客户端设置](/zh-hans/guide/tutorials/python.md), 你可能会遇到这样的错误:
"伊罗哈_鱼.*.在这个平台上,它不是支持的轮子.

这种错误意味着 pip 已经过时了,所以你需要更新它.
首先,建议检查您的 OS 进行更新和系统升级.

如果这不起作用,你可以尝试更新 `pip` 对于您的用户目录.

`python -m pip install --upgrade pip`

确保 `pip` 在您的家庭目录中安装. `whereis pip` 检查是否 `/home/username/.local/bin/pip` 如果没有,请更新你的. `PATH` 变量

如果问题持续,请 [联系我们](/zh-hans/help/) 报告结果.

```
python --version
python3 --version
pip --version
pip3 --version
```
