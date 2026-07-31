---
translation_locale: zh-hant
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 解決安裝問題 {#troubleshooting-installation-issues}

這部分提供解決問題的建議. Iroha 3 如果該設備
您所遇到的問題並沒有在這裡描述,
透過網路聯絡我們 [電子郵件](https://t.me/hyperledgeriroha).

## 快速檢查 {#quick-checks}

裝置故障的原因主要是:

- 其他 Rust 工具链比上游工作空間固定的版本更老
- `cargo` 或是 `rustc` 在其他設備上, `rustup`
- 缺少系統建構工具,例如C編輯器, `pkg-config`, 或是 CMake
- 在改變源頭後,已舊產生的截圖或本地建構文物
  修改

來自: Iroha 開始於:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

如果 `cargo metadata` 在運行前,修復本地工具連鎖
`pnpm refresh:iroha --source /path/to/iroha`, 因為更新可以呼籲
Kagami 生成目前的數據模型方案.

## 解決問題 Rust 工具鎖 {#troubleshooting-rust-toolchain}

有時事情會不如你預定的. `rust` 在您的
但並沒有升級.
Python: XKCD 這樣可能會是什麼樣的例子:

<div class="flex justify-center">

![Python 環境問題解決漫畫](/img/install-troubles.png)

</div>

### 檢查 Rust 的版本 {#check-rust-version}

確保您的健康和我們的健康,
有正確的版本 `cargo` 配合了正确的版本 `rustc`.
目前的上游工作空間表示 `rust-version = "1.92"` 著這些
在工具链中 `rust-toolchain.toml`. 顯示這些版本,

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

接著,

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

如果您有更高版本,就很好.
可以執行下列命令更新它:

```bash
$ rustup toolchain update stable
```

### 檢查安裝位置 {#check-installation-location}

如果您獲得更低版本數字 **及其他** 你更新了工具連鎖,
沒有效果... 只是說這是一個常見的問題,
共同的解決方案.

首先,你必須確定你想要使用的版本是
裝置:

```bash
$ rustup which rustc
$ rustup which cargo
```

工具連鎖的使用者安裝是 _通常_ 在
`~/.rustup/toolchains/stable-*/bin/`. 如果是這樣,
能夠跑步

```bash
$ rustup toolchain update stable
```

這應該解決你的問題.

### 檢查預設情況 Rust 的版本 {#check-the-default-rust-version}

其他選擇是, `stable` 這種工具連鎖,
沒有設定為預設.

```bash
$ rustup default stable
```

如果您安裝了 `nightly` 或設定特定的版本
Rust 但卻忘了開啟它.

### 檢查是否有其他 Rust 的版本 {#check-if-there-are-other-rust-versions}

繼續解決問題的子洞, 我們可能會有貝
姓名:

```bash
$ type rustc
$ type cargo
```

如果這些指向其他地方,
`rustup which *`, 請注意,
只是一個

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

因為我們有內在的逻辑,
請重新編排您的外名.

您不使用的版本是最簡單的解決方案.

這更容易. _沒有人說_ 超過 _完成_, 但因為它需要追蹤所有
其他版本 rustup 通常只能提供其他功能,
系統包裝管理器版本和安裝在
當您執行命令時, 在主文件中的標準位置
請參考您的 (Linux)
該區域的分佈手冊 (`apt remove rust`) 對於後者來說,

```bash
$ rustup toolchain list
```

接著,每次 `<toolchain>` 沒有角括號,

```bash
$ rustup remove <toolchain>
```

在此之後,

```bash
$ cargo --help
```

導致命令未找到錯誤,即您沒有任何活跃的 Rust
請執行:

```bash
$ rustup toolchain install stable
```

## 解決問題 Python 工具链 {#troubleshooting-python-toolchain}

在安裝後, Python 在使用管道的車輪包裝中 [Python 客戶端設定](/zh-hant/guide/tutorials/python.md), 您可能會遇到如下錯誤:
沒有任何問題_魚類*.這台不是支持的車輪".

這項錯誤意味著 pip已過期,
首先,我們建議檢查您的 OS 進行更新和系統升級.

如果這不起作用, 你可以嘗試更新 `pip` 在您的使用者目錄中.

`python -m pip install --upgrade pip`

請確保 `pip` 請將它安裝在您的家庭目錄中. `whereis pip` 並檢查是否 `/home/username/.local/bin/pip` 如果沒有,請更新你的貝. `PATH` 這種變量

如果問題持續, [聯絡我們](/zh-hant/help/) 並報告出口.

```
python --version
python3 --version
pip --version
pip3 --version
```
