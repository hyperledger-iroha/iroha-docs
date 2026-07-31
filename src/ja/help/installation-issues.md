---
translation_locale: ja
translation_source: /help/installation-issues.md
translation_source_hash: 5dc09ae199ec2ec268dba53af9ebf43927a5e0254c5bb2e0fb908e0624b66661
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 設置問題解決 {#troubleshooting-installation-issues}

このセクションでは, Iroha 3 のインストールに関するトラブルシューティングのヒントを提供しています.あなたが経験している問題はここで説明されていない場合は, [テレグラム](https://t.me/hyperledgeriroha) を介して連絡してください.

## 迅速なチェック {#quick-checks}

装置の故障は4つの場所から発生します

- Rust ツールチェーンは,上流作業空間で固定されたバージョンよりも古い.
- `cargo` または `rustc` 異なる装置に解決する `rustup`
- 欠けているシステム構築ツールであるCコンパイラ, `pkg-config`,またはCMake
- 源修正変更後,古い生成されたスニペットまたはローカルビルドアーテファクト

Iroha ソースのチェックアウトから,次のことを開始します:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

`cargo metadata` が失敗した場合,現在のデータモデルスキーマを生成するためにリフレッシュが Kagami を呼び出すことができるため, `pnpm refresh:iroha --source /path/to/iroha` を実行する前にローカルツールチェーンを修正してください.

## トラブルシューティング Rust ツールチェーン {#troubleshooting-rust-toolchain}

時々,計画通りには行かないシステムに `rust` があったがアップグレードしていない場合 特に似たような問題は Python: XKCD これはよく知られている例です

<div class="flex justify-center">

![Python 環境のトラブルシューティングコミック](/img/install-troubles.png)

</div>

### Rust バージョンをチェックする {#check-rust-version}

`cargo` の正しいバージョンと `rustc` の適切なバージョンを組み合わせて,あなたの健康と私たちの健全性を保つため,当時の上流作業空間は `rust-version = "1.92"` を宣言し,ツールチェーンのチャンネルを `rust-toolchain.toml` にピンします.バージョンを示するには,

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

そして...

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

もっと高いバージョンなら大丈夫です低いバージョンがあるなら更新するには次のコマンドを実行できます.

```bash
$ rustup toolchain update stable
```

### 設置場所を確認する {#check-installation-location}

ツールチェーンの更新がうまくいきませんでした. それは一般的な問題ですが,共通の解決方法はありません.

まず,使いたいバージョンがどこにインストールされているか確認する必要があります.

```bash
$ rustup which rustc
$ rustup which cargo
```

ツールチェーンのユーザインストールは通常, `~/.rustup/toolchains/stable-*/bin/` であります.

```bash
$ rustup toolchain update stable
```

そしてそれはあなたの問題を解決する

### デフォルトバージョン Rust を確認する {#check-the-default-rust-version}

別のオプションは,最新の `stable` ツールチェーンが設定されていることですが,デフォルトでは設定されていません.実行:

```bash
$ rustup default stable
```

`nightly` バージョンをインストールしたり,特定の Rust バージョンが設定されても,それをアンセットするのを忘れてしまった場合,このことが起こり得る.

### Rust の他のバージョンがあるかどうかを確認する {#check-if-there-are-other-rust-versions}

イルカ穴のトラブルシューティングを続けるなら シェル・アライスもできるわ

```bash
$ type rustc
$ type cargo
```

`rustup which *` を実行する際に見た場所以外の場所を指している場合は,問題があります.このようなニックネームを追加することは十分ではありません:

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

内部の論理は 解消されることもあります シェル・アライズの仕方に関係なく

最も簡単な解決策は,使用していないバージョンを削除することです

rustup の インストール さ れ て いる すべて の バージョン を 追跡 する こと が でき ます.通常,その は 2 つ だけ です:このチュートリアルの初めにコマンドを実行したときに,ホームフォルダの標準位置にインストールされたシステムパッケージマネージャーバージョンと.前者については,あなたの (Linux) ディストリビューションs マニュアル (`apt remove rust` を参照してください.後者の場合は実行:

```bash
$ rustup toolchain list
```

そして,すべての `<toolchain>` に対して (もちろん角括弧を除く)

```bash
$ rustup remove <toolchain>
```

その後,確認してください

```bash
$ cargo --help
```

Rust ツールチェーンがインストールされていないというコマンドが見つからないエラーが発生します.

```bash
$ rustup toolchain install stable
```

## Python ツールチェーンのトラブルシューティング {#troubleshooting-python-toolchain}

[Python クライアント設定](/ja/guide/tutorials/python.md)中に pip を使用した Python 휠パッケージをインストールすると, "iroha_python-*.whl はこのプラットフォームでサポートされている車輪ではない"のようなエラーが発生する可能性があります.

このエラーは, pip が時代遅れであることを意味し,更新する必要がある. OS 更新やシステムアップグレードを行う.

`pip` をユーザーディレクトリで更新してみてください.

`python -m pip install --upgrade pip`

確認してください `pip` 家庭のディレクトリにインストールされている. `whereis pip` チェックする `/home/username/.local/bin/pip` もしそうでないなら シェルの更新 `PATH` 変数

問題が続ければ, [ に連絡して](/ja/help/) の出荷を報告してください.

```
python --version
python3 --version
pip --version
pip3 --version
```
