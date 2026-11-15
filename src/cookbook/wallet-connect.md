# Wallet Connect: Approve an Asset Transfer

## Outcome

Create an Iroha Connect session in a browser, obtain cryptographic approval
for one I105 wallet identity, ask that wallet to sign Torii's exact unsigned
asset-transfer payload, submit the detached signature, and wait for
Applied finality.

## Prerequisites

- A browser application using `@iroha/iroha-js` and HTTPS.
- A wallet that implements Iroha Connect v1, controls a single-key Ed25519
  I105 account, and grants the `sign_transaction` and `sign_raw` methods.
- The current Taira network ID, the wallet's enrolled lower-case Ed25519
  public-key hex, an owned transferable asset, and a canonical I105
  destination.
- The fee asset ID published by the current Taira faucet policy. The
  example verifies the live fee quote against that ID; it never embeds a
  copied asset identifier.
- Connect must be enabled on the selected Torii. Read the network ID from
  the public account capabilities before showing a QR or deep link:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii publishes no anonymous Connect status: `GET /v1/connect/status`
reports one session to its management token, and the aggregate status
requires an operator signature. When a node disables Connect,
`registerConnectSession` fails with HTTP `503` and code `connect_disabled`
(`404` when the build omits Connect), and the example shows no QR code or
deep link; use a generated local network with Connect enabled. An ordinary
asset transfer also requires the wallet to own enough transferable quantity
and fee balance.

## Steps

### 1. Provide one wallet launch control

The JavaScript below expects this element in the application page:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Render the same URI as a QR code for a wallet on another device. The URI
holds the wallet-scoped relay token, so do not put it in analytics, logs,
referrers, or crash reports.

### 2. Create, approve, sign, and submit

This browser module accepts concrete values from your application state.
The first `POST /v1/assets/transfer` omits signing fields and returns the
quoted fee intent and the unsigned transaction payload. The second adds only
the wallet's public key and detached signature to the same transfer request.
Torii requires a canonical account signature on both requests, so the module
has the wallet sign them through `createConnectCanonicalRequestAuth`.

```js
import { buildCanonicalJsonRequest } from '@iroha/iroha-js/canonical-request'
import {
  NetworkId,
  createConnectAppSession,
  createConnectCanonicalRequestAuth,
  createConnectSessionPreview,
  deleteConnectSession,
  registerConnectSession,
  toHex,
} from '@iroha/iroha-js/connect-browser'
import { ToriiBrowserClient } from '@iroha/iroha-js/torii-browser'

const baseUrl = 'https://taira.sora.org'
const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

const decodeBase64 = (value) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
const encodeBase64 = (bytes) =>
  btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''))

async function postSignedJson(path, body, auth, networkId) {
  const request = await buildCanonicalJsonRequest({
    nativeIdentity: auth.nativeIdentity,
    accountId: auth.authAccountId,
    networkId,
    method: 'POST',
    path,
    baseUrl,
    body,
    sign: auth.sign,
  })
  const response = await fetch(`${baseUrl}${path}`, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })
  if (!response.ok) {
    throw new Error(
      `${path}: HTTP ${response.status}: ${await response.text()}`,
    )
  }
  return response.json()
}

async function waitForApplied(transactionHash) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const url = new URL('/v1/pipeline/transactions/status', baseUrl)
    url.searchParams.set('hash', transactionHash)
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    })
    if (response.status === 404) {
      await wait(1_000)
      continue
    }
    if (!response.ok) {
      throw new Error(`pipeline status: HTTP ${response.status}`)
    }
    const status = await response.json()
    const kind = status.status?.kind
    if (kind === 'Applied') return status
    if (kind === 'Rejected' || kind === 'Expired') {
      throw new Error(`${kind}: ${JSON.stringify(status.status)}`)
    }
    await wait(1_000)
  }
  throw new Error('transaction did not reach Applied within 60 seconds')
}

export async function transferWithWallet({
  networkIdLiteral,
  authority,
  publicKeyHex,
  assetDefinitionId,
  destination,
  amount,
  faucetFeeAssetDefinitionId,
}) {
  if (!/^[0-9a-f]{64}$/.test(publicKeyHex)) {
    throw new Error('publicKeyHex must be 32-byte lower-case Ed25519 hex')
  }
  const networkId = NetworkId.parse(networkIdLiteral)
  const torii = new ToriiBrowserClient(baseUrl, { networkId })

  const preview = createConnectSessionPreview({
    networkId,
    node: baseUrl,
  })
  const relay = await registerConnectSession(
    baseUrl,
    preview,
    {
      node: baseUrl,
    },
  )
  let connect

  try {
    connect = createConnectAppSession({
      baseUrl,
      preview,
      session: relay,
      inspectAccountIdentity: (accountId, options) =>
        torii.inspectAccountIdentity(accountId, options),
      permissions: {
        methods: ['sign_transaction', 'sign_raw'],
        resources: [assetDefinitionId],
      },
      appMeta: { name: 'Iroha cookbook transfer' },
    })

    const launch = document.querySelector('#wallet-connect')
    if (!(launch instanceof HTMLAnchorElement)) {
      throw new Error('missing #wallet-connect anchor')
    }
    launch.href = relay.wallet_uri
    launch.hidden = false

    const approval = await connect.waitForApproval()
    if (approval.accountId !== authority) {
      throw new Error('wallet approved a different I105 account')
    }
    if (toHex(approval.signingPublicKey) !== publicKeyHex) {
      throw new Error('enrolled public key does not control authority')
    }
    const auth = await createConnectCanonicalRequestAuth(connect)

    const transfer = {
      authority,
      asset_definition_id: assetDefinitionId,
      asset_balance_scope: 'global',
      amount,
      destination,
      fee_payment: {
        payer: 'authority',
        value: { charge_limits: [], gas_limit: null },
      },
      creation_time_ms: Date.now(),
      transaction_ttl_ms: 120_000,
      memo: 'iroha-cookbook-wallet-connect',
    }

    const prepared = await postSignedJson(
      '/v1/assets/transfer',
      transfer,
      auth,
      networkId,
    )
    if (!prepared.ok || prepared.submitted) {
      throw new Error('Torii did not return an unsigned transaction payload')
    }
    const limits = prepared.intent.fee_payment.value.charge_limits
    if (
      limits.some(
        (limit) =>
          limit.asset_definition_id !== faucetFeeAssetDefinitionId,
      )
    ) {
      throw new Error(
        'live fee quote uses an asset other than the faucet policy asset',
      )
    }

    const signature = await connect.signTransaction(
      decodeBase64(prepared.transaction_payload_b64),
    )
    if (signature.length !== 64) {
      throw new Error('wallet returned a non-Ed25519 signature length')
    }

    const submitted = await postSignedJson(
      '/v1/assets/transfer',
      {
        ...transfer,
        public_key_hex: publicKeyHex,
        signature_base64: encodeBase64(signature),
      },
      auth,
      networkId,
    )
    if (!submitted.ok || !submitted.submitted) {
      throw new Error('signed transfer was not accepted')
    }

    return {
      transactionHash: submitted.transaction_hash_hex,
      pipelineStatus: await waitForApplied(submitted.transaction_hash_hex),
    }
  } finally {
    connect?.close('application finished request')
    await deleteConnectSession(baseUrl, relay.sid, {
      tokenManagement: relay.token_management,
    })
  }
}
```

Keep `token_app`, `token_management`, and `token_relay` in application
memory. Only the wallet launch URI/token crosses to the wallet. The Connect
approval is signed by the account identity; the X25519 `walletPublicKey` in
the approval is an ephemeral transport key, not the account's Ed25519
signing key.

### 3. Use the Rust frame types in a wallet implementation

The Rust protocol surface can seal a signature only after the wallet has
decoded the requested transaction, displayed its exact intent, applied
policy, and signed with the approved account key. This helper accepts that
validated signature; it does not fabricate one:

```rust
use iroha_crypto::{Algorithm, Signature};
use iroha_torii_shared::{connect as proto, connect_sdk as sdk};

fn seal_wallet_signature(
    wallet_direction_key: &[u8; 32],
    sid: &[u8; 32],
    sequence: u64,
    validated_signature: Signature,
) -> proto::ConnectFrameV1 {
    let payload = proto::ConnectPayloadV1::SignResultOk {
        signature: proto::WalletSignatureV1::new(
            Algorithm::Ed25519,
            validated_signature,
        ),
    };
    sdk::seal_envelope_current(
        wallet_direction_key,
        sid,
        proto::Dir::WalletToApp,
        sequence,
        payload,
    )
}
```

The repository's `connect_app` and `connect_wallet` examples are protocol
demonstrations: the app prints the wallet URI, including its token, to
standard output, and the wallet takes its tokens as command-line arguments
and signs the requested bytes without decoding or displaying them. Use them
to study frames only, never as a Taira wallet implementation.

## Verify

Keep the returned hash and confirm the destination's post-state through the
public holders endpoint:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

Verification succeeds only when the JavaScript waiter observes `Applied`
for the submitted transaction hash and the destination holding reflects the
transfer. HTTP acceptance or wallet approval alone is not ledger finality.

## Troubleshooting

- `503` with code `connect_disabled`, or `404`, from
  `registerConnectSession` means no relay session can be created on that
  node. Switch to an enabled localnet; do not fall back to transporting app
  or management tokens yourself.
- `USER_DENIED` is a wallet decision. Preserve it as a terminal user
  outcome instead of opening repeated approval prompts.
- An approval-account mismatch or invalid approval signature must close the
  session. Never ask the wallet to sign after identity binding fails.
- `public_key_hex does not control authority` means enrollment data and the
  approved I105 identity disagree. The ephemeral wallet transport key
  cannot be used in this field.
- A rejected detached signature usually means a request field or the live
  fee quote changed between prepare and submit. Build a new request; never
  transplant the old signature.
- An exact replay of an already accepted signed request is idempotent.
  Query its returned transaction hash before treating a timeout as a reason
  to start over.

## Source and related docs

- [Browser Connect implementation at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [Browser Connect tests at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust app frame example at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust wallet frame example at the pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Pinned Torii OpenAPI schema](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus services](/blockchain/sora-nexus-services.md)
- [Fungible assets](./fungible-assets.md)
- [Submit and verify transactions](./submit-and-verify-transactions.md)
