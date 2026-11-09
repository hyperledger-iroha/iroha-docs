---
translation_locale: ja
translation_source: /get-started/launch-iroha.md
translation_source_hash: 2be7788e2aaf422b34739028ee64a127cad67ac0293b32d93f0be959c94aea87
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3 を起動する {#launch-iroha-3}

Linux 仮想マシン（VM）1 台で Iroha 3 のバリデータを 4 台起動し、非公開の環境でシステム連携をテストします。署名済みトランザクションを送信した後、バリデータを 1 台停止し、残りの 3 台で別のトランザクションを確定できることを確認します。ここで構築するのは、参加者を制限した独立の台帳です。ガバナンスの対象となるデータスペースとして SORA Nexus に接続するには、別途設定が必要です。

## VM を準備する {#prepare-the-vm}

x86_64 版 Linux に Docker Engine、Buildx、Compose v2、Python 3.8 以降、`unzip` を用意します。作業用アカウントには Docker を実行する権限が必要です。初回のビルドでは、GitHub、Docker Hub、Debian のパッケージミラー、crates.io への HTTPS 接続が必要です。

このキットは、6 vCPU、メモリ 32 GiB RAM の VM でビルドし、少数の模擬トランザクションで動作を確認しました。ストレージは想定する負荷とデータの保存期間に応じて確保してください。Docker Engine のインスタンスごとにキットを 1 組だけ使用し、ループバックインターフェースのポート 18080～18083 を空けておきます。

[4 台構成のバリデータキットをダウンロード](/downloads/iroha-trade-poc.zip)します。キットには起動スクリプト、バージョンを固定した依存パッケージ一覧、バリデータとクライアントを同じ Iroha リビジョンからビルドするためのパッチが含まれています。ダウンロード先のディレクトリでチェックサムを確認し、アーカイブを展開します。

```sh
echo 'b12d450f9f15c0126dfe5eca83cdfad8bc420c779a78f916d374f433a2b3da0e  iroha-trade-poc.zip' | sha256sum --check
unzip iroha-trade-poc.zip
cd iroha-trade-poc
```

## バリデータ 4 台を起動して検証する {#start-and-verify-all-four-validators}

```sh
python3 poc.py up
python3 poc.py verify
```

初回起動時に Docker イメージがビルドされ、VM 上でチェーン ID、鍵、署名済みのジェネシスブロックが生成されます。各バリデータは専用の永続ボリュームを使用します。検証スクリプトはテスト用トランザクションに署名し、4 台すべてが接続先のピア数を 3 と報告し、新しいブロックのハッシュ値が 4 台で一致するまで待ちます。ジェネシスブロックにはサンプルアカウントが含まれるため、テスト用データを使用し、APIs はループバックインターフェースでのみ公開してください。

VM から 1 台目のバリデータの状態を取得するには、応答形式に JSON を明示します。

```sh
curl -fsS -H 'Accept: application/json' http://127.0.0.1:18080/status
```

## バリデータ 1 台の停止をテストする {#test-a-validator-failure}

```sh
python3 poc.py failover
```

テストではバリデータを 1 台停止し、新しいトランザクションを送信して、残りの 3 台で確定したブロックのハッシュ値を確認します。その後、4 台目を再起動して同じブロックに追いつくまで待ちます。VM 自体が停止すると 4 台とも停止します。物理ホスト 1 台の障害を検証するには、独立した 4 台のホストにバリデータを 1 台ずつ配置してください。

## 停止と再開 {#stop-and-resume}

```sh
python3 poc.py down
python3 poc.py up
```

両方のコマンドを、キットを展開した同じディレクトリで実行します。再起動後も同じ台帳を開けるように、`state/` ディレクトリと 4 つの Docker ボリュームをセットで保持してください。起動が進まない場合は、そのディレクトリで `python3 poc.py logs` を実行します。

## 公開エンドポイントを試す {#try-the-public-endpoint}

アプリケーションは、台帳用の VM を用意しなくても、Taira 上で SORA Nexus のユニバーサルデータスペースを参照できます。`curl` と `jq` が使える端末から、次の読み取り専用リクエストをテストネットに送信します。

```sh
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

応答には、問い合わせ先のノードに接続しているピア数、確定したブロック数、承認済みトランザクション数、キュー内のトランザクション数が含まれます。構成を検討する際は、[ネットワークのデプロイ](/ja/guide/best-practices/network-deployment.md)を参照してください。
