---
translation_locale: ja
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# JavaScript と TypeScript {#javascript-and-typescript}

現在の JavaScript SDK は、Iroha ソースツリーの`@iroha/iroha-js`パッケージです。これは Node.js-最初の SDK で、Torii、Norito ビルダー、署名、ページ分割、Connectプレビュー、およびKagemushaコマンド転送向けです。

## ソースからビルド {#build-from-source}

このパッケージは現在、公開されている npm レジストリでは利用できません。ターゲットにするノードと同じ固定された Iroha ソースリビジョンからビルドしてください:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

ネイティブビルドは `cargo build -p iroha_js_host` をラップし、SDK の起動時に使用されるプラットフォーム固有のチェックサムを記録します。ソースビルドは、その検証済みホストを `native/` に配置します。別途構築され、チェックサムで検証されたホストを意図的に供給する場合にのみ `IROHA_JS_NATIVE_DIR` を設定します。パッケージは ESM のみです。CommonJS からは、動的な `import()` を使用してください。

## クイックスタート {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## 試す Taira 読み取り専用 {#try-taira-read-only}

Node.js 24で組み込みの`fetch`を使用して、署名と Norito トランザクションコードを追加する前に Taira をプローブします:

```js
const root = "https://taira.sora.org";

const status = await fetch(`${root}/status`, {
  headers: { Accept: "application/json" },
}).then((res) => res.json());
console.log({
  blocks: status.blocks,
  queueSize: status.queue_size,
  peers: status.peers,
});

const domains = await fetch(`${root}/v1/domains?limit=5`).then((res) =>
  res.json(),
);
console.log(domains.items.map((domain) => domain.id));

const assets = await fetch(`${root}/v1/assets/definitions?limit=5`).then((res) =>
  res.json(),
);
for (const asset of assets.items) {
  console.log(asset.id, asset.name, asset.total_quantity);
}
```

`taira-readonly.mjs`として保存し、次に実行してください:

```bash
node taira-readonly.mjs
```

これらの読み取り専用チェックが機能するようになった後に、署名された SDK の技術的呼び出しに移行してください。パブリック Taira は一時的に飽和したキューやゲートウェイエラーを返す可能性があるため、ライブネットワークのテストは CI でオプトインのままにしてください。

便利なサブパスインポート:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

ブラウザ専用の Connect ブートストラップの場合、Node 最優先の `ToriiClient` サーフェスをインポートする代わりに `@iroha/iroha-js/connect-browser` を使用してください。

## ネイティブエスクロー {#native-escrow}

JavaScript と TypeScript のアプリケーションは、Kotodama コントラクトを通じてネイティブエスクローを使用できます。エスクローホスト関数の呼び出しを `@iroha/iroha-js/kotodama-compiler` でコンパイルしてください。直接ネイティブのエスクロー取引ビルダーは、現在 JavaScript SDK では公開されていません。エスクロー ホストの技術的な呼び出し例については [ネイティブ資産エスクロー](/ja/blockchain/escrow.md#javascript-and-typescript-kotodama) を参照してください。

## 現在のカバレッジ {#current-coverage}

その SDK 焦点を当てる:

- Torii、HTTP、および WebSocket の補助者
- Norito トランザクションおよびインストラクションビルダー
- Kotodama コンパイル、エスクロー ホスト技術呼び出し組み込み関数を含む
- Ed25519 の署名と鍵生成
- ページネーションおよび再試行ヘルパー
- ブラウザブートストラップヘルパーを接続する
- 影武者の準備、補充、償還、および稼働状況の輸送ヘルパー

## 上流参照 {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
