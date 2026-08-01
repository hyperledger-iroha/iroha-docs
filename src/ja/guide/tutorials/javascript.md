---
translation_locale: ja
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript と TypeScript {#javascript-and-typescript}

現在の JavaScript SDK は, Iroha ソースツリー内の `@iroha/iroha-js` パッケージである. Node.js-最初の SDK の Torii, Norito 構築者,署名,ページ化,接続プレビュー,カゲムシャコマンド輸送のためのものです.

## 源 から 建設 する {#build-from-source}

パッケージは,現時点では公開 npm レジストリから利用できません. ターゲットにしたノードと同じ固定された Iroha ソース修正から作成します:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

本来のビルドは `cargo build -p iroha_js_host` を巻き込み, SDK の起動で使用されたプラットフォーム特別のチェックサムを記録します.ソースビルドは, `native/` でホストを確認した場所です.`IROHA_JS_NATIVE_DIR` を設定するのは,別々に構築されたチェックサムで確認されたホストを意図的に供給する場合にのみ.パッケージは ESM のみ; CommonJS から,ダイナミック `import()` を使用します.

## スピードスタート {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Taira 試聴する {#try-taira-read-only}

Node.js 24 に内蔵された `fetch` を使用して,署名と Norito 取引コードを追加する前に, Taira を探す.

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

`taira-readonly.mjs`として保存し,実行する:

```bash
node taira-readonly.mjs
```

署名に移動する SDK 読み込みのみのチェックが効いた後だけ通話します Taira 臨時的に飽和したキューまたはゲートウェイエラーを返却することができますので,ライブネットワークテストのオプトインを保持してください CI.

便利なサブパス輸入:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

ブラウザーのみの Connect ブートストラップでは,ノードファースト `ToriiClient` 表面を輸入する代わりに `@iroha/iroha-js/connect-browser` を使用します.

## 国産エスクロー {#native-escrow}

JavaScript および TypeScript アプリケーションは, Kotodama 契約を通じてネイティブ・エスクローを利用できます. `@iroha/iroha-js/kotodama-compiler` でエスクローホストの呼び出しをまとめます.トランザクション構築者は現在 JavaScript SDK によって暴露されていない. エスクローホスト呼び出しの例については, [ネイティブアセットエスクロー](/ja/blockchain/escrow.md#javascript-and-typescript-kotodama)を参照してください.

## 現在 の 対象 {#current-coverage}

SDK は,以下に重点を置く.

- Torii HTTP と WebSocket の助手
- Norito トランザクション・インストラクションビルダー
- Kotodama コンパイル,エスクローホスト・コールビルドを含む
- Ed25519 署名と鍵生成
- 頁面化および再試助手
- ブラウザのブートストラップヘルパーを接続
- カゲムシャの準備,補充,償還,運行状態の輸送補助人

## 上流参照 {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
