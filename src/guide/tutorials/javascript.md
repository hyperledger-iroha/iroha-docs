# JavaScript and TypeScript

The current JavaScript SDK is the `@iroha/iroha-js` package in the Iroha
source tree. It is the Node.js-first SDK for Torii, Norito builders, signing,
pagination, Connect previews, and Kagemusha command transport.

## Build From Source

The package is not currently available from the public npm registry. Build it
from the same pinned Iroha source revision as the node you target:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

The native build wraps `cargo build -p iroha_js_host` and records the
platform-specific checksum used at SDK startup. The source build places that
verified host in `native/`. Set `IROHA_JS_NATIVE_DIR` only when intentionally
supplying a separately built, checksum-verified host. The package is ESM-only;
from CommonJS, use dynamic `import()`.

## Quickstart

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## Try Taira Read-Only

Use built-in `fetch` in Node.js 24 to probe Taira before adding signing and
Norito transaction code:

```js
const root = "https://taira.sora.org";

const status = await fetch(`${root}/status`).then((res) => res.json());
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

Save it as `taira-readonly.mjs`, then run it:

```bash
node taira-readonly.mjs
```

Move to signed SDK calls only after these read-only checks work. Public Taira
can temporarily return a saturated queue or gateway error, so keep live-network
tests opt-in in CI.

Useful subpath imports:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

For browser-only Connect bootstrap, use `@iroha/iroha-js/connect-browser`
instead of importing the Node-first `ToriiClient` surface.

## Native Escrow

JavaScript and TypeScript applications can use native escrow through Kotodama
contracts. Compile escrow host calls with
`@iroha/iroha-js/kotodama-compiler`; direct native escrow transaction builders
are not currently exposed by the JavaScript SDK. See
[Native Asset Escrow](/blockchain/escrow.md#javascript-and-typescript-kotodama)
for the escrow host-call example.

## Current Coverage

The SDK focuses on:

- Torii HTTP and WebSocket helpers
- Norito transaction and instruction builders
- Kotodama compilation, including escrow host-call builtins
- Ed25519 signing and key generation
- pagination and retry helpers
- Connect browser bootstrap helpers
- Kagemusha readiness, top-up, redemption, and operation-status transport
  helpers

## Upstream References

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
