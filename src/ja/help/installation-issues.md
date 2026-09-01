---
translation_locale: ja
translation_source: /help/installation-issues.md
translation_source_hash: 1a2519123edc5224e720e23ef3e2bc2a7b4dba38ef87af49216c31c054c85a2a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# インストールの問題のトラブルシューティング {#troubleshooting-installation-issues}

このセクションでは、Iroha 3 のインストールに関するトラブルシューティングのヒントを提供します。ここに記載されていない問題が発生した場合は、[テレグラム](https://t.me/hyperledgeriroha) を通じてお問い合わせください。

## 迅速な確認 {#quick-checks}

ほとんどのインストールの失敗は、次の4つのうちの1つの原因です：

- 上流ワークスペースによって指定されたバージョンより古い Rust ツールチェーン
- `cargo` または `rustc` が `rustup` とは異なるインストール先に解決される
- Cコンパイラ、`pkg-config`、またはCMakeのようなシステムビルドツールが不足しています
- ソースのリビジョンを変更した後の古くなった生成スニペットやローカルビルド成果物

Iroha ソースコードの作業コピーから、次のものを開始してください:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

もし `cargo metadata` が失敗した場合は、`pnpm refresh:iroha --source /path/to/iroha` を実行する前にローカルのツールチェーンを修正してください。リフレッシュによって現在のデータモデルスキーマを生成するために Kagami が呼び出される可能性があるからです。

## トラブルシューティング Rust ツールチェーン {#troubleshooting-rust-toolchain}

時には、物事は計画通りに進まないことがあります。特に、しばらく前にシステムに`rust`を入れたことがあるが、アップグレードしていなかった場合はなおさらです。Python でも同様の問題が発生する可能性があります：XKCD には、それがどのようなものかの有名な例があります。

<div class="flex justify-center">

![Python 環境トラブルシューティング漫画](/img/install-troubles.png)

</div>

### Rust のバージョンを確認してください {#check-rust-version}

あなたと私たちの両方の正気を保つために、`cargo`の適切なバージョンが`rustc`の適切なバージョンと組み合わされていることを確認してください。現在の上流ワークスペースでは`rust-version = "1.92"`が宣言され、`rust-toolchain.toml`でツールチェーンチャネルが固定されています。バージョンを表示するには、次を実行してください

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

そしてそれから

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

もしより新しいバージョンを持っていれば問題ありません。もしより古いバージョンを持っている場合は、以下のコマンドを実行して更新できます:

```bash
$ rustup toolchain update stable
```

### インストール場所を確認 {#check-installation-location}

もしより低いバージョン番号が出て、ツールチェーンを更新してもうまくいかなかった場合…これはよくある問題だと言えますが、一般的な解決策はありません。

まず、使用したいバージョンがどこにインストールされているかを確認する必要があります。

```bash
$ rustup which rustc
$ rustup which cargo
```

ツールチェーンのユーザーインストールは通常 `~/.rustup/toolchains/stable-*/bin/` にあります。その場合は、実行できるはずです

```bash
$ rustup toolchain update stable
```

そしてそれであなたの問題は解決するはずです。

### デフォルトの Rust バージョンを確認してください {#check-the-default-rust-version}

もう一つの選択肢として、最新の `stable` ツールチェーンを持っているが、デフォルトとして設定されていない場合があります。次を実行してください:

```bash
$ rustup default stable
```

`nightly` バージョンをインストールするか、特定の Rust バージョンを設定した後にそれを解除しないままにすると、この問題が発生する可能性があります。

### 他の Rust バージョンがあるか確認してください {#check-if-there-are-other-rust-versions}

トラブルシューティングの迷路をさらに進めると、シェルエイリアスがあるかもしれません:

```bash
$ type rustc
$ type cargo
```

これらが、`rustup which *` を実行したときに見た場所とは異なる場所を指している場合、問題があります。次のようなエイリアスを追加するだけでは不十分であることに注意してください:

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

シェルのエイリアスをどのように配置しても、内部ロジックは依然として壊れる可能性があります。

最も簡単な解決策は、使用していないバージョンを削除することです。

しかし、インストールされて利用可能なすべての rustup のバージョンを追跡することを伴うため、言うは易く行うは難しいです。通常、バージョンは2つだけです：システムのパッケージマネージャーのバージョンと、このチュートリアルの最初にコマンドを実行したときにホームフォルダの標準の場所にインストールされたバージョン。前者については、（Linux）ディストリビューションのマニュアルを参照してください、(`apt remove rust`)。後者については、次を実行してください:

```bash
$ rustup toolchain list
```

そして、その後、すべての `<toolchain>` に対して（もちろん角括弧は付けずに）:

```bash
$ rustup remove <toolchain>
```

ツールチェーンを削除した後、このコマンドはコマンドが見つからないというエラーを報告するはずです:

```bash
$ cargo --help
```

そのエラーは、アクティブな Rust ツールチェーンがインストールされていないことを確認します。その後、次を実行してください:

```bash
$ rustup toolchain install stable
```

## トラブルシューティング Python ツールチェーン {#troubleshooting-python-toolchain}

[Python クライアント設定](/ja/guide/tutorials/python.md)の間にpipを使用して Python Wheelパッケージをインストールすると、次のようなエラーが発生することがあります: "iroha_python-*.whlはこのプラットフォームではサポートされていないホイールです"。

このエラーは、pipが古くなっていることを意味するので、更新する必要があります。まず最初に、OS の更新を確認し、システムのアップグレードを行うことが推奨されます。

もしこれがうまくいかない場合は、ユーザーディレクトリのために `pip` を更新してみることができます。

`python -m pip install --upgrade pip`

自分のホームディレクトリに `pip` がインストールされていることを確認してください。そのためには、`whereis pip` を実行し、パスの中に `/home/username/.local/bin/pip` があるか確認してください。もしなければ、シェルの `PATH` 変数を更新してください。

問題が続く場合は、[お問い合わせ](/ja/help/) を実行して結果を報告してください。

```
python --version
python3 --version
pip --version
pip3 --version
```
