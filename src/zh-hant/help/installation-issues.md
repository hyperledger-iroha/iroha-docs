---
translation_locale: zh-hant
translation_source: /help/installation-issues.md
translation_source_hash: 1a2519123edc5224e720e23ef3e2bc2a7b4dba38ef87af49216c31c054c85a2a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解決安裝問題 {#troubleshooting-installation-issues}

本節提供 Iroha 3 安裝的故障解決技巧. 如果您遇到的問題沒有在這裏描述,請通過 [電報](https://t.me/hyperledgeriroha)聯繫我們.

## 快速檢查 {#quick-checks}

最多的安裝故障來自四個地方之一:

- 一個 Rust 工具鏈比上游工作空間固定的版本更老
- `cargo`或`rustc`分離到一個不同於 `rustup`的裝置
- 缺失的系統構建工具,如C編譯器, `pkg-config`,或CMake
- 經過變更源改後生成過時的摘錄或本地構建文物

從 Iroha 來源清算中,開始:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

如果 `cargo metadata` 失敗,在運行 `pnpm refresh:iroha --source /path/to/iroha`之前修複本地工具鏈,因爲更新可以調用 Kagami 來生成當前的數據模型方案.

## 解決問題 Rust 工具鏈 {#troubleshooting-rust-toolchain}

有時,事情不會按計劃進行.特別是如果你有 `rust` 在你的系統上一段時間前,但沒有升級.類似的問題可以發生在 Python: XKCD 有一個著名的例子,它可能看起來像:

<div class="flex justify-center">

![Python 環境故障解決漫畫](/img/install-troubles.png)

</div>

### 檢查 Rust 版本 {#check-rust-version}

爲了維護您和我們的智力,請確保您擁有正確的版本 `cargo`與正確的版 `rustc`.目前上游的工作空間聲明 `rust-version = "1.92"`並將工具鏈道插入`rust-toolchain.toml`.

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

然後,

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

如果你有更高的版本,你沒事.如果你有較低的版本,你可以運行下列命令更新它:

```bash
$ rustup toolchain update stable
```

### 檢查安裝地點 {#check-installation-location}

如果你得到較低的版本號碼,並且更新了工具鏈並沒有工作... 讓我們說這是一個常見的問題,但它沒有共同解決方案.

首先,您應該確定您想要使用的版本安裝在哪裏:

```bash
$ rustup which rustc
$ rustup which cargo
```

工具鏈的用戶安裝通常在 `~/.rustup/toolchains/stable-*/bin/`.如果是這樣,你應該能夠運行

```bash
$ rustup toolchain update stable
```

這應該解決你的問題.

### 檢查默認版本 Rust {#check-the-default-rust-version}

另一個選項是,你有更新的 `stable`工具鏈,但它不是默認設置.運行:

```bash
$ rustup default stable
```

如果安裝 `nightly` 版本或設置特定的 Rust 版本,然後不調整,則可能會導致此問題.

### 檢查是否有其他版本 Rust {#check-if-there-are-other-rust-versions}

繼續解決問題子洞,我們可能會有子的姓氏:

```bash
$ type rustc
$ type cargo
```

如果這些指向您在運行 `rustup which *`時看到的位置以外的地方,那麼您就有問題了.請注意,添加類似於此類別的號不夠:

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

不管你如何安排你的外名,內部邏輯仍然可以破裂.

最簡單的解決方案是刪除你不使用的版本.

然而,這比做起來更容易,因爲它需要跟蹤所有版本的 rustup 通常,只有兩個:系統包管理器版本和安裝的版本在您的家庭文件中的標準位置中,當您運行命令時對於前者,請參閱您的 (Linux) 分佈指南.`apt remove rust`) 對於後者,運行:

```bash
$ rustup toolchain list
```

然後,每一個 `<toolchain>` (當然沒有角括號):

```bash
$ rustup remove <toolchain>
```

在移除工具鏈後,該命令應該報告一個未找到的命令錯誤:

```bash
$ cargo --help
```

該錯誤確認沒有安裝活躍的 Rust 工具鏈.然後運行:

```bash
$ rustup toolchain install stable
```

## 解決故障的工具鏈 Python {#troubleshooting-python-toolchain}

當您在 [Python 客戶端設置](/zh-hant/guide/tutorials/python.md)期間安裝使用 pip 的 Python 輪包時,可能會遇到這樣的錯誤: "iroha_python-*.whl 不是這個平臺上的支持式輪".

此錯誤意味着 pip 已經過時,因此您需要更新它.首先,建議檢查您的 OS 是否有更新並進行系統升級.

如果這不起作用,你可以嘗試更新用戶目錄的 `pip`.

`python -m pip install --upgrade pip`

確保在您的家庭目錄中安裝了 `pip`.要做到這一點,運行`whereis pip`並檢查是否有 `/home/username/.local/bin/pip` 在路徑中.如果沒有,請更新 shell 的 `PATH`變量.

如果問題持續下去,請聯繫我們 [ ](/zh-hant/help/)並報告輸出.

```
python --version
python3 --version
pip --version
pip3 --version
```
