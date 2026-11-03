---
translation_locale: dz
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: human-reviewed+claude-opus-5-5
---
# དངུལ་ཁུག་མཐུད་: རྒྱུ་དངོས་སྤོ་བཤུད་ཅིག་ཆ་འཇོག་འབད། {#wallet-connect-approve-an-asset-transfer}

## གྲུབ་འབྲས་ {#outcome}

བལྟ་བཤལ་པ་ནང་ Iroha Connect ལཱ་ཡུན་ཅིག་ གསར་བསྐྲུན་འབད་ཞིནམ་ལས་ I105 དངུལ་ཁུག་ངོ་རྟགས་གཅིག་གི་དོན་ལུ་ གསང་བཟོའི་ཆ་འཇོག་ ལེན། དེ་ལས་ དངུལ་ཁུག་དེ་ལུ་ Torii གི་ མིང་རྟགས་མ་བཀོད་པའི་ རྒྱུ་དངོས་སྤོ་བཤུད་ཀྱི་ ནང་དོན་གནད་སྡུད་ངེས་བདེན་འདི་ལུ་ མིང་རྟགས་བཀོད་དགོ་ཟེར་ ཞུ། སོ་སོར་ཕྱེ་ཡོད་པའི་ མིང་རྟགས་འདི་ ཕུལ་ཞིནམ་ལས་ Applied མཐར་ཐུག་གནས་སྟངས་ལུ་ ལྷོདཔ་ཚུན་ སྒུག།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `@iroha/iroha-js` དང་ HTTPS ལག་ལེན་འཐབ་མི་ བརྡ་འཚོལ་གློག་རིམ།
- Iroha Connect v1 ལག་བསྟར་འབད་མི་ ལྡེ་མིག་རྐྱང་པའི་ Ed25519 I105 རྩིས་ཐོ་ཅིག་ ཚད་འཛིན་འབད་མི་ དེ་ལས་ `sign_transaction` དང་ `sign_raw` ཐབས་ལམ་ཚུ་ གནང་བ་བྱིན་མི་ དངུལ་ཁུག་ཅིག།
- ད་ལྟོའི་ Taira དྲ་རྒྱ་ ID དང་ དངུལ་ཁུག་གིས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ ཡིག་ཆུང་ Ed25519 མི་མང་ལྡེ་མིག་གི་ བཅུ་དྲུག་གྲངས་ཅན་ (hex) ཡིག་རྒྱུན་ བདག་དབང་ཡོད་པའི་ སྤོ་བཤུད་འབད་བཏུབ་པའི་ རྒྱུ་དངོས་ཅིག་ དེ་ལས་ ཚད་ལྡན་ I105 འགྲོ་ཡུལ་ཅིག།
- ད་ལྟོའི་ Taira བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག་གི་སྲིད་བྱུས་ཀྱིས་ བཀྲམ་སྤེལ་འབད་མི་ འཐུས་རྒྱུ་དངོས་ ID། དཔེ་འདི་གིས་ ད་ལྟོའི་འཐུས་ཀྱི་གོང་ཚད་བཀོད་པ་འདི་ ID དེ་དང་ ག་བསྡུར་འབད་དེ་ བདེན་དཔྱད་འབདཝ་ཨིན། དེ་གིས་ འདྲ་བཤུས་རྐྱབ་ཡོད་པའི་ རྒྱུ་དངོས་ཀྱི་ངོས་འཛིན་ ནམ་ཡང་ ནང་བཙུགས་མི་འབད།
- སེལ་འཐུ་འབད་ཡོད་པའི་ Torii གུ་ Connect ལྕོགས་ཅན་བཟོ་དགོ། QR ཡང་ན་ གཏིང་ཟབ་འབྲེལ་ལམ་ མ་སྟོན་པའི་ཧེ་མ་ མི་མང་རྩིས་ཐོ་གི་ ལྕོགས་གྲུབ་ཚུ་ལས་ དྲ་རྒྱ་ ID ལྷག་:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii གིས་ མིང་མ་བཀོད་པའི་ Connect གནས་ཚད་ ག་ནི་ཡང་ བཀྲམ་སྤེལ་མི་འབད། `GET /v1/connect/status` གིས་ ལཱ་ཡུན་གཅིག་གི་གནས་ཚད་ དེ་གི་ འཛིན་སྐྱོང་རྟགས་མཚན་ལུ་ སྙན་ཞུ་འབདཝ་ཨིནམ་དང་ ཡོངས་བསྡོམས་གནས་ཚད་ལུ་ ལས་འཛིན་གྱི་མིང་རྟགས་ དགོཔ་ཨིན། མཐུད་མཚམས་ཅིག་གིས་ Connect ལྕོགས་མིན་བཟོ་བ་ཅིན་ `registerConnectSession` འདི་ HTTP `503` དང་ `connect_disabled` ཨང་རྟགས་ཀྱིས་ (བཟོ་བསྐྲུན་ནང་ Connect མེད་པ་ཅིན་ `404` གིས་) འཐུས་ཤོར་འབྱུངམ་ཨིན། དེ་ལས་ དཔེ་འདི་གིས་ QR ཀོཌ་ ཡང་ན་ གཏིང་ཟབ་འབྲེལ་ལམ་ ག་ནི་ཡང་ མི་སྟོན། Connect ལྕོགས་ཅན་བཟོ་ཡོད་པའི་ བཟོ་བཏོན་འབད་ཡོད་པའི་ ས་གནས་དྲ་རྒྱ་ཅིག་ ལག་ལེན་འཐབ། སྤྱིར་བཏང་གི་ རྒྱུ་དངོས་སྤོ་བཤུད་ཅིག་ལུ་ཡང་ དངུལ་ཁུག་ལུ་ སྤོ་བཤུད་འབད་བཏུབ་པའི་ འབོར་ཚད་དང་ འཐུས་ཀྱི་ལྷག་ལུས་ ལངམ་སྦེ་ བདག་དབང་ཡོད་དགོ།

## རིམ་པ་ཚུ་ {#steps}

### ༡ དངུལ་ཁུག་གཅིག་ འགོ་འདྲེན་འཐབ་ནིའི་ལམ་སྟོན་བྱིན་ནི། {#_1-provide-one-wallet-launch-control}

འོག་གི་ JavaScript གིས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ཤོག་ལེབ་ནང་ལུ་ འ་ནི་ལས་ཀ་འདི་གིས་ རེ་བ་བསྐྱེད་དོ་ཡོདཔ་ཨིན།

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

ལག་ཆས་གཞན་གྱི་དངུལ་ཁུག་གི་དོན་ལུ་ URI འདི་བཟུམ་སྦེ་ QR ཀོ་ཌ་ཅིག་རང་ བཏོན་གཏང་། URI འདི་ནང་ དངུལ་ཁུག་གི་ཐོ་བཀོད་འབད་ཡོད་པའི་ འབྲེལ་མཐུད་རྟགས་དེ་ཡོདཔ་ལས་ དེ་ཚུ་ རྩིས་ཞིབ་དང་ ཐོ་བཀོད་ཀྱི་ཐོ་ཡིག་ དེ་ལས་ འགྲེམ་སྟོན་ ཡང་ན་ རྐྱེན་ངན་ཚུ་གི་ སྙན་ཞུ་ནང་ལུ་མ་བཙུགས་པར་སྡོད་དགོ།

### 2. བཟོ་སྐྲུན་འབད་ནི་དང་ ངོས་ལེན་འབད་ནི་ རྟགས་མཚན་བཙུགས་ནི་ དེ་ལས་ བཏང་ནི། {#_2-create-approve-sign-and-submit}

བལྟ་བཤལ་པའི་ ལས་རིམ་ཆ་ཤས་འདི་གིས་ ཁྱོད་ཀྱི་ གློག་རིམ་གནས་སྟངས་ལས་ ངེས་གཏན་གནས་གོང་ཚུ་ ངོས་ལེན་འབདཝ་ཨིན། འགོ་དང་པའི་ `POST /v1/assets/transfer` གིས་ མིང་རྟགས་ཀྱི་ས་སྒོ་ཚུ་ བཏོན་བཞག་སྟེ་ གོང་ཚད་བཀོད་ཡོད་པའི་ འཐུས་ཀྱི་དམིགས་དོན་དང་ མིང་རྟགས་མ་བཀོད་པའི་ ཚོང་འབྲེལ་གྱི་ནང་དོན་གནད་སྡུད་ ལོག་བྱིནམ་ཨིན། གཉིས་པ་གིས་ སྤོ་བཤུད་ཞུ་བ་གཅིག་པ་དེ་ལུ་ དངུལ་ཁུག་གི་ མི་མང་ལྡེ་མིག་དང་ སོ་སོར་ཕྱེ་ཡོད་པའི་ མིང་རྟགས་རྐྱངམ་ཅིག་ ཁ་སྐོང་བརྐྱབཔ་ཨིན། Torii གིས་ ཞུ་བ་གཉིས་ཆ་རའི་གུ་ ཚད་ལྡན་རྩིས་ཐོ་གི་ མིང་རྟགས་ དགོཔ་ཨིནམ་ལས་ ལས་རིམ་ཆ་ཤས་འདི་གིས་ དངུལ་ཁུག་ལུ་ `createConnectCanonicalRequestAuth` བརྒྱུད་དེ་ དེ་ཚུ་ལུ་ མིང་རྟགས་བཀོད་བཅུགཔ་ཨིན།

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

`token_app` དང་ `token_management` དེ་ལས་ `token_relay` ཚུ་ གློག་རིམ་དྲན་ཚད་ནང་བཞག། དངུལ་ཁུག་འགོ་བཙུགས་ URI/ཊོ་ཀེན་རྐྱངམ་ཅིག་གིས་ དངུལ་ཁུག་ལུ་བརྒལཝ་ཨིན། མཐུད་ལམ་ཆ་འཇོག་འདི་རྩིས་ཐོའི་ངོ་རྟགས་ཀྱིས་མིང་རྟགས་བཀོད་ཡོདཔ་ཨིན། ཆ་འཇོག་ནང་ལུ་ X25519 `walletPublicKey` འདི་ རྩིས་ཐོའི་ Ed25519 མཚན་རྟགས་ལྡེ་མིག་མེན་པར་ དུས་ཐུང་སྐྱེལ་འདྲེན་ལྡེ་མིག་ཨིན།

### ༣.དངུལ་ཁུག་ལག་ལེན་ནང་ལུ་ Rust གཟུགས་ཀྱི་དབྱེ་བ་ཚུ་ ལག་ལེན་འཐབ་དགོ། {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust སྲིད་བྱུས་ཀྱི་ཐོ་བཀོད་འདི་ ལག་ལེན་ཡིག་ཆའི་རྟགས་མཚན་ཅིག་ལུ་ ཐོ་བཀོད་འབད་ཚུགསཔ་ད་ ཌེ་ཀོཌ་གི་དངུལ་ཁུག་གིས་ བརྒྱུད་འཕྲིན་ལག་ལེན་དེ་ གསལ་བཀོད་འབད་ཚར་ཞིནམ་ལས་ ཡི་གུ་ཅིག་གུ་ ཐོ་བཀོད་ཀྱི་དོན་གནད་ཚུ་གསལ་སྟོན་འབད་ཡོདཔ་མ་ཚད་ ལག་ལེན་གྱི་ལམ་ལུགས་ཡང་ བཏོན་ཏེ་ ཆ་འཇོག་གྲུབ་ཡོད་པའི་རྩིས་ཐོ་ལྡེ་མིག་དང་གཅིག་ཁར་ ངོས་འཛིན་འབད་ཡོདཔ་ཨིན། ཨ་ནི་ལག་ལེན་པ་འདི་གིས་ ལག་ལེན་ཡིག་ཆ་འདི་ ཆ་འཇོག་གྲུབ་མི་བཏུབ་ཨིན།

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

མཛོད་ཁང་གི་ `connect_app` དང་ `connect_wallet` དཔེ་ཚུ་ ལམ་ལུགས་ཀྱི་ དཔེ་སྟོན་ཚུ་ཨིན། གློག་རིམ་གྱིས་ དངུལ་ཁུག་ URI འདི་ དེ་གི་རྟགས་མཚན་དང་བཅས་ ཚད་ལྡན་ཐོན་འབྲས་ནང་ གསལ་སྟོནམ་ཨིན། དངུལ་ཁུག་གིས་ དེ་གི་རྟགས་མཚན་ཚུ་ བཀའ་རྒྱའི་གྲལ་ཐིག་གི་ ཚད་བཟུང་སྦེ་ ལེན་ཞིནམ་ལས་ ཞུ་ཡོད་པའི་ བཱའིཊི་ཚུ་ ཌི་ཀོཌ་ ཡང་ན་ གསལ་སྟོན་ མ་འབད་བར་ མིང་རྟགས་བཀོདཔ་ཨིན། དེ་ཚུ་ གཞི་ཁྲམ་ཚུ་ སློབ་སྦྱོང་འབད་ནི་ལུ་རྐྱངམ་ཅིག་ ལག་ལེན་འཐབ། Taira དངུལ་ཁུག་གི་ ལག་བསྟར་སྦེ་ ནམ་ཡང་ ལག་ལེན་མ་འཐབ།

## བརྟག་དཔྱད་འབད་ {#verify}

ལོག་སྤྲོད་ཡོད་པའི་ཧེཤ་འདི་བཞག་སྟེ་ མི་མང་བདག་དབང་མཐའ་མཚམས་བརྒྱུད་དེ་ འགྲོ་ཡུལ་གྱི་ ཤུལ་མའི་གནས་སྟངས་འདི་ ངེས་གཏན་བཟོ།

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

བདེན་དཔྱད་འདི་ JavaScript བཞེས་སྒོ་འབད་མི་གིས་ བཙུགས་ཡོད་པའི་ཚོང་འབྲེལ་གསང་ཡིག་ཧ་ཤི་གི་དོན་ལུ་ `Applied` བལྟ་རྟོགས་འབད་བའི་སྐབས་རྐྱངམ་ཅིག་ མཐར་འཁྱོལ་འབྱུང་ཡོདཔ་དང་ འགྲོ་ཡུལ་འཛིན་བཟུང་གིས་ སྤོ་བཤུད་འདི་ བསྟན་ཡོདཔ་ཨིན། HTTP ངོས་ལེན་ཡང་ན་དངུལ་ཁུག་ཆ་འཇོག་ཁོ་ན་བཀག་སྡོམ་གྱི་རྩིས་ཐོའི་མཐའ་མའི་མིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `registerConnectSession` ལས་ `connect_disabled` ཨང་རྟགས་དང་གཅིག་ཁར་ `503` ཡང་ན་ `404` ཐོབ་པ་ཅིན་ མཐུད་མཚམས་དེ་གུ་ བར་བརྒྱུད་ལཱ་ཡུན་ ག་ནི་ཡང་ གསར་བསྐྲུན་འབད་མི་ཚུགསཔ་སྦེ་ སྟོནམ་ཨིན། ལྕོགས་ཅན་བཟོ་ཡོད་པའི་ ས་གནས་དྲ་རྒྱ་ཅིག་ལུ་ སོར། གློག་རིམ་ ཡང་ན་ འཛིན་སྐྱོང་རྟགས་མཚན་ཚུ་ ཁྱོད་རང་གིས་ སྐྱེལ་འདྲེན་འབད་ནི་ལུ་ ཚབ་ཐབས་སྦེ་ མ་འགྱོ།
- `USER_DENIED` འདི་དངུལ་ཁུག་གི་ གྲོས་ཐག་འདི་ཨིན། འཕྲུལ་ཆས་ལག་ལེན་འཐབ་མི་གིས་ ལོག་སྟེ་ར་ ངོས་ལེན་གྱི་བརྡ་སྟོན་ཚུ་ཕྱེ་བའི་ཚབ་ལུ་ མཐའ་མཇུག་གི་ཐོན་ཁུངས་སྦེ་བཞག་དགོ།
- ཆ་འཇོག་-རྩིས་ཐོ་མ་མཐུན་མི་དང་ ཡང་ན་ ཆ་འཇོག་མཚན་རྟགས་ནུས་མེད་ཅིག་གིས་ ལཱ་ཡུན་འདི་ཁ་བསྡམ་དགོ། ངོ་རྟགས་བསྡམ་བཞག་མ་ཚུགས་པའི་ཤུལ་ལས་ དངུལ་ཁུག་ལུ་ མཚན་རྟགས་བཀོད་དགོཔ་སྦེ་ ནམ་ཡང་མ་སླབ།
- `public_key_hex does not control authority` ཟེར་མི་འདི་ ཐོ་བཀོད་གནས་སྡུད་དང་ ཆ་འཇོག་འབད་ཡོད་པའི་ I105 ངོ་རྟགས་འདི་ ངོས་ལེན་མེདཔ་ཨིན། དུས་ཐུང་དངུལ་ཁུག་སྐྱེལ་འདྲེན་ལྡེ་མིག་འདི་ ས་སྒོ་འདི་ནང་ལག་ལེན་འཐབ་མི་བཏུབ།
- སོ་སོར་ཕྱེ་ཡོད་པའི་ མིང་རྟགས་ཅིག་ བཀག་ཆ་འབད་བ་ཅིན་ སྤྱིར་བཏང་ གྲ་སྒྲིག་དང་ ཕུལ་བའི་བར་ན་ ཞུ་བའི་ས་སྒོ་ཅིག་ ཡང་ན་ ད་ལྟོའི་ འཐུས་ཀྱི་གོང་ཚད་བཀོད་པ་འདི་ འགྱུར་བ་འོང་ཡོདཔ་སྦེ་ སྟོནམ་ཨིན། ཞུ་བ་གསརཔ་ཅིག་ བཟོ། མིང་རྟགས་རྙིངམ་འདི་ ནམ་ཡང་ སྤོ་སྟེ་ མ་བཙུགས།
- ཧེ་མ་ལས་ངོས་ལེན་འབད་ཡོད་པའི་མིང་རྟགས་བཀོད་ཡོད་པའི་ཞུ་བ་ཅིག་གི་ བསྐྱར་གཏང་གཏན་གཏན་འདི་ ནུས་པ་མེདཔ་ཨིན། དུས་ཚོད་མཇུག་བསྡུ་མི་འདི་ ལོག་འགོ་བཙུགས་ནིའི་དོན་ལུ་ རྒྱུ་མཚན་ཅིག་སྦེ་ མ་བརྩི་བའི་ཧེ་མ་ དེ་གི་སླར་ལོག་འབད་ཡོད་པའི་ཚོང་འབྲེལ་གྱི་ཧེཤ་འདི་འདྲི་དཔྱད་འབད།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [བརྡ་འཚོལ་མཐུད་པའི་ལག་བསྟར་འདི་ པིན་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [བརྡ་འཚོལ་མཐུད་པའི་བརྟག་དཔྱད་ཚུ་ པིན་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js) ལུ་ཡོདཔ་ཨིན།
- [Rust གློག་རིམ གཞི་སྒྲོམ དཔེ་འདི་ གཏན་སྦྱར་ཡོད་པའི Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs) ལུ་འབདཝ་ཨིན།
- [Rust བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)ནང་ལུ་ དངུལ་ཁུག གཞི་སྒྲོམ དཔེ་སྟོན་འབདཝ་ཨིན།
- [Torii OpenAPI བཟོ་བཀོད་འབད་ཐངས་ ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus ཞབས་ཏོག་ཚུ་](/dz/blockchain/sora-nexus-services.md)
- [དངུལ་རྐྱང་གི་རྒྱུ་དངོས་ཚུ་](./fungible-assets.md)
- [ཚོང་འབྲེལ་ཚུ་ བཏང་ནི་དང་ བདེན་དཔྱད་འབད་ནི་](./submit-and-verify-transactions.md)
