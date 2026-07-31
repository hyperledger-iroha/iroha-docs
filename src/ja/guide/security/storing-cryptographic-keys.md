---
translation_locale: ja
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: a420551345570c4f6b6c0288bc78041665b199727b177eb0aee1f6495850fae6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 暗号鍵を保存する {#storing-cryptographic-keys}

暗号鍵を保護するために <abbr title="Operational Security">OPSEC</abbr>の慣行を採用した場合にのみ,あなたの敏感なデータはプライバシーのままです.権威のある人物として身を置く人があなたを操作し,プライベート暗号鍵を与えようとするとするソーシャルエンジニアリングの脅威は現実的です.密钥は信頼される人だけに留められるように扱ってください.

<abbr title="Operational Security">OPSEC</abbr>とそのベストプラクティスの詳細については, [オペレーションセキュリティ](./operational-security)を参照してください.

## 暗号鍵をデジタルに保存する {#storing-cryptographic-keys-digitally}

暗号鍵をデジタルで保護する際には,主に2つの方法しか利用できない. [SSH](https://www.ssh.com/)[GPG](https://www.gnupg.org/).これらの方法は,暗号鍵への不正アクセスを防ぐためのセキュリティの層を提供します.

Iroha の多くの建築決定は,Secure Shell (`SSH`) プロトコルの原則によって影響を受けており,このセクションでは主に `SSH` アプローチに焦点を当てています.Iroha エコシステム内で暗号鍵を保存するためのプロトコルを効果的に実装する方法に関する指示を提供すること.

### SSH と SSH エージェントを使用する {#using-ssh-and-ssh-agent}

Secure Shell Protocol (`SSH`) は,仮想ゲートウェイとして機能する暗号ネットワークプロトコルで, SSH キーアクセス認証を使用して潜在的にそれほど安全なネットワークを通じて遠隔マシンへのセキュアアクセスを可能にします.`SSH`は物理的な存在を必要とせず,システムとのリモートインタラクションを効率的に行う.この文脈では,従来のパスワードベースのアプローチとより安全な公私鍵ペア方法である2つの主要な認証メカニズムを提供しています.

詳細については, `SSH`, 参照 [関連性 SSH アカデミー テーマ](https://www.ssh.com/academy/ssh).

ログインプロセスを簡素化し,繰り返し入力する必要性を回避するために, `SSH` キーをセッション期間中にあなたの `SSH` キーおよび/またはパスワードを記憶するアシスタントプログラム (`ssh-agent`) との SSH エージェントと組み合わせることができます.このセットアップにより, `SSH`ゲートウェイは他のマシンに接続するたびに鍵を簡単にアクセスすることができる.

ここでのワークフローは次のとおりです: 公開鍵をリモートシステムに保存し,プライベート鍵を安全に保管します. リモートシステムにアクセスしたいときはいつでも `ssh-agent` が介入して,公開鍵をアクセスされたシステムに伝達します.リモートシステムは [challenge](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication)を返信し,あなたのプライベートキーだけが適切に対応できる.あなたの `ssh-agent`はあなたのプライベートキーを利用してこのチャレンジを処理し,正しい応答をリモートシステムに返します.対応がシステムに期待されたものと一致すれば アクセスを許可します

`ssh-agent`の美しさは セッション中にあなたのプライベートキーを保持していることです ですから リモートシステムに接続するたびに パスワードやプライベートキーパスワードを入力する必要はありません

詳細については, `ssh-agent`, 参照 [関連性 SSH アカデミー テーマ](https://www.ssh.com/academy/ssh/agent).

::: info 注記

`SSH`プロトコルと `ssh-agent`ツールについての詳細な概要については,次の[SSH アカデミー](https://www.ssh.com/academy)のテーマを参照してください.

  - [何が? SSH (シューチャーシェル)](https://www.ssh.com/academy/ssh)
  - [ssh-agent: ssh- agent, agent forwarding, & agent protokol](https://www.ssh.com/academy/ssh/agent)を設定する方法

:::

### パスワード管理プログラムを追加する {#adding-a-password-manager-program}

`SSH` 鍵のセキュリティを高め,パスワードで保護することが推奨され,これはあなたの敏感な情報を入手することを目的とする悪意のある当事者へのさらなる障害として機能します.

パスワードマネージャーは,ユーザーパスワードと `SSH` キーを一時的に保存するために使用できます.明確性のために, [KeePass](https://keepass.info/)は,特にLinuxベースのオペレーティングシステムで実行される [KeePassXC](https://keepassxc.org/) ポートとして使用されます.

KeePassXC を設定する方法に関する指示については,下記の[Configuring KeePassXC](#configuring-keepassxc)のセクションを参照してください.

![KeePassXC: `Main`スクリーン UI](../../../img/KeePassXC.png)

KeePassXC はセキュリティ,柔軟性,制御を強化しています.パスワードだけでなく `SSH` キーも保存します.鍵のストレージに使用された場合,このパスワードマネージャーは `ssh-agent` に保存された鍵を提供します.KeePassXC ウィンドウが閉ざされた後,そのメモリから迅速に削除されます.

::: トップ

理論的には, KeePass 港口 [公式サイトに掲載されている](https://keepass.info/download.html) 主要な貯蔵目的のために使用できます.以下のいずれかをお勧めします: [KeePassX](https://www.keepassx.org/) または [KeePassXC](https://keepassxc.org/).

:::

#### KeePassXC を構成する {#configuring-keepassxc}

KeePassXC を構成するには,次の手順を実行する.

1. KeePassXC を起動し,ツール>設定へ移動するか,上部の UI パネルからギアボタンを選択します.

2. 出現するアプリケーション設定タブで,左のメニューから SSH エージェントを選択し,その後,エージェント統合を有効にする SSH チェックボックスを選択します.

   ::: info 参照画面を表示する

   ![KeePassXC `SSH Agent`タブ: SSH エージェント](../../../img/keepassxc_ssh_agent.png)を有効にする

   :::

3. 新しい KeePassXC データベースを作成する.指示については, [KeePassXC ユーザーガイド > あなたの最初のデータベース](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database) を作成してください.

4. 作成した KeePassXC データベースに保存したいすべてのキーについては,次の手順を実行してください.

   - データベースに新しいエントリを追加する.指示については, [KeePassXC ユーザーガイド > あなたの最初のデータベースを作成する](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database) を参照してください.

   - 新しいエントリを追加する際,次の手順でキーを含むファイルを添付します. 左のメニューから先端を選択し,添加項目を選択し,表示されるファイルを選択するウィンドウで必要なファイルを選択します.

   - 新しいエントリを追加する際,左メニューから SSH エージェントを選択し,私钥部分の添付メニューから追加したキーファイルを選択し,次のチェックボックスを選択します:

      - データベースが開かれ/ロック解除されたとき,エージェントに鍵を追加する

      - データベースが閉鎖/ロックされたとき,エージェントからキーを削除する

      - このキーを使用するときにユーザー確認を要求します

   - 必要に応じて,エントリに他の変更を加える.

   - OK を選択して,入力を保存する.

   ::: details 参照スクリーンショットを表示する

   ![KeePassXC `Advanced`タブ: プライベートキー添付](../../../img/keepassxc_private_key.png)を追加する

   ![KeePassXC `SSH Agent`タブ: プライベートキー添付](../../../img/keepassxc_pk_agent.png)を追加する

   :::

##### 期待 さ れ た 結果 {#expected-results}

- KeePassXC データベースに暗号化および `shh` キーが入力として保存され, KeePassXC ウィンドウが開いている間にアクセスできます.

- 保存された暗号および `ssh` 鍵は,許可のために必要なときにいつでも使用できます.

- 保存された暗号化および `ssh` 鍵は, `ssh-agent` 一旦 KeePassXC 窓が閉まってる

::: info 注記

`ssh-agent` は,このキーを使用する際のユーザー確認を要求するオプションを有効にしない限り,キーを提供したプロセスを監視することができません. パスワードマネージャーのプロセスはマルウェアまたはシステムサービスによって `SIGKILL` 信号を通じて終了した場合,鍵は `ssh-agent` に留まる可能性が高い,Unixシステムプログラムが `SIGKILL` を傍受できない.

:::

## 暗号鍵を物理的に保存する {#storing-cryptographic-keys-physically}

オフラインセキュリティの最高水準を求めている人にとって,暗号鍵を保存するオプションは デジタルネットワークから完全に切り離されていることを物理的に保証し,不正アクセスリスクを最小限に抑える.物理的な選択肢を認めることは,様々なセキュリティニーズに対応する我々のコミットメントを強調します.

### ハードウェア キー を 使う {#using-a-hardware-key}

ハードウェア・キーは USB ポートで接続するコンパクトなデバイスであり,典型的なフラッシュドライブのサイズである. 機械に接続されたときにのみセキュリティ関連のイベントを処理します.セキュリティ侵害が発生した場合,デバイスを簡単に切り離したり,必要に応じて別のマシンに再接続することもできます.

しかし ハードウェア・キーのブランドは多くあり,それぞれ独自の APIs キーがあるため,あなたのニーズに最も適合するキーを探すために市場を調査することが重要です.

これまでのところ,当社のチームは [YubiKey 5C](https://www.yubico.com/il/product/yubikey-5c/) ハードウェアキーを内部でテストし,汎用な API 機能を含む多くのポジティブな機能を備えていることが証明されました.

[HMAC 課題応答認証](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) を実装し,対応するプライベートキーを保存することで脆弱性が生じる可能性がある.YubiKey 5Cのメモリ内に保存されている情報について知的な推測を犯すため,攻撃者は不意に5Cのメモリの内蔵情報について知覚的に推測することができる.

YubiKey 5C を利用する代替方法を採用することでこの脆弱性を軽減できる.アイデアは,暗号化および `SSH` キーを保存する KeePassXC データベースに安全にアクセスするために YubiKey 5C を使用することです.KeePassXC データベースが漏洩した場合,悪意のある当事者があなたのハードウェアキーを持っていることが必要になるため,この方法は有益であるとさえ考えられます.

::: 情報

上記方法については, KeePassXC 開発者[ジャネック・ベヴェンドーフ](https://github.com/phoerious)以下に StackExchange 質問:

[合理的な使用は KeePassXC と YubiKey?](https://security.stackexchange.com/questions/201345/is-it-reasonable-to-use-keepassxc-with-yubikey/258414#258414)

:::

### ミネモニック 表現 を 用い て {#using-a-mnemonic-phrase}

また,私密鍵は"mnemonic phrase"として知られる一連の単語として記憶することができます.多くの財布で使用されるこの方法は25の特定の言葉を覚える必要があります.前述した KeePassXC を含むほとんどのパスワードマネージャーは,mnemonic passwordphrase生成を提供します.
