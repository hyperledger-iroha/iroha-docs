---
translation_locale: dz
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: human-reviewed
---
# དངུལ་ཁུག་མཐུད་: རྒྱུ་དངོས་སྤོ་བཤུད་ཅིག་ཆ་འཇོག་འབད། {#wallet-connect-approve-an-asset-transfer}

## གྲུབ་འབྲས་ {#outcome}

བལྟ་བཤལཔ་ནང་ལུ་ Iroha འབྲེལ་མཐུད་ཚོགས་ཐེངས་ཅིག་བཟོ། I105 ཤོག་སྒྲོམ་གི་ངོ་རྟགས་གཅིག་གི་དོན་ལུ་ ཀི་པོཊོ་རིག་པའི་ ངོས་ལེན་ཐོབ་ནི་ དེ་ལས་ Torii ཤོག་སྒྲིལ་གྱི་དངོས་རྫས་བགོ་བཀྲམ་འབད་ནིའི་ཡིག་གཟུགས་དེ་གུ་ མཚན་རྟགས་བཀོད་དགོཔ་སྦེ་ཞུ་ཞིནམ་ལས་ ཐོ་བཀོད་མཇུག་བསྡུ་བའི་བར་སྒུག་སྡོད་དགོ།

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- `@iroha/iroha-js` དང་ HTTPS ལག་ལེན་འཐབ་མི་ བརྡ་འཚོལ་གློག་རིམ།
-  Iroha ལག་ལེན་འཐབ་མི་ དངུལ་ཁུག་ཅིག v1 མཐུད་དེ་ ལྡེ་མིག་རྐྱང་པའི་ Ed25519 I105 རྩིས་ཐོ་ཚད་འཛིན་འབདཝ་ཨིན།
- ད་ལྟོའི་ Taira ལྕགས་ཐག་ ID དང་ ལྕགས་རྟགས་དབྱེ་བ་ཕྱེ་མི་ དེ་ལས་དངུལ་ཁུག་གི་མིང་ཐོ་ནང་ཡོད་པའི་ ཨེཌི་༢༥༥༡༩ ཅན་མའི་ མི་མང-ལྡེ་མིག བཅུ་དྲུག་རྟེན, རང་དབང་ལུ་གནས་གཏུགས་འབད་ཚུགས་པའི་ རྒྱུ་དངོས་དང་ ཀ་ནོ་ཀཱན་གྱི་ I105 དམིགས་ཡུལ་ཚུ་ཡོདཔ་ཨིན།
- རྩིས་ཐོ་གི་རྒྱུ་དངོས་ ID འདི་ ད་ལྟོའི་ Taira བརྟག་དཔྱད་ཊོ་ཀེན་ཞབས་ཏོག ལན་དུད་ཀྱིས་ལོག་གཏོགསཔ་ཨིན། དཔེ་སྟོན་འདི་གིས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ཁྲལ་གྱི་གནས་གོང་འདི་ ID དང་ཕྱདཔ་ད་ བརྟག་ཞིབ་འབདཝ་ཨིན། འདི་རྩ་ལས་རང་ ཨེབ་གཏང་མི་ རྒྱུ་དངོས་ངོ་རྟགས་མ་བཙུགས་མེད།
- སེལ་འཐུ་འབད་ཡོད་པའི་ Torii གུ་མཐུད་ལམ་འདི་ལྕོགས་ཅན་བཟོ་དགོ། QR ཡང་ན་ འབྲེལ་ལམ་གཏིང་ཟབ་ཅིག་མ་སྟོན་པའི་ཧེ་མ་ ཞིབ་དཔྱད་འབད།

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Taira གིས་ མཐུད་ལམ་ལྕོགས་མིན་བཟོ་ཡོདཔ་སྦེ་སྙན་ཞུ་འབད་བ་ཅིན་ ཡང་ན་ `404`/`503` སླར་ལོག་འབད་བ་ཅིན་ མཐུད་ལམ་ལྕོགས་ཅན་བཟོ་ཡོད་པའི་ བཟོ་བཏོན་འབད་ཡོད་པའི་ཉེ་གནས་ཡོངས་འབྲེལ་ཅིག་ལག་ལེན་འཐབ། སྤྱིར་བཏང་རྒྱུ་དངོས་སྤོ་བཤུད་འབད་བའི་སྐབས་ལུ་ཡང་ སྤོ་བཤུད་འབད་བཏུབ་པའི་འབོར་ཚད་དང་ འཐུས་ལྷག་ལུས་ཚུ་ ལངམ་སྦེ་ཡོད་པའི་ དངུལ་ཁུག་འདི་ བདག་དབང་འབད་དགོཔ་ཨིན།

## རིམ་པ་ཚུ་ {#steps}

### ༡ དངུལ་ཁུག་གཅིག་ འགོ་འདྲེན་འཐབ་ནིའི་ལམ་སྟོན་བྱིན་ནི། {#_1-provide-one-wallet-launch-control}

འོག་གི་ JavaScript གིས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ཤོག་ལེབ་ནང་ལུ་ འ་ནི་ལས་ཀ་འདི་གིས་ རེ་བ་བསྐྱེད་དོ་ཡོདཔ་ཨིན།

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

ལག་ཆས་གཞན་གྱི་དངུལ་ཁུག་གི་དོན་ལུ་ URI འདི་བཟུམ་སྦེ་ QR ཀོ་ཌ་ཅིག་རང་ བཏོན་གཏང་། URI འདི་ནང་ དངུལ་ཁུག་གི་ཐོ་བཀོད་འབད་ཡོད་པའི་ འབྲེལ་མཐུད་རྟགས་དེ་ཡོདཔ་ལས་ དེ་ཚུ་ རྩིས་ཞིབ་དང་ ཐོ་བཀོད་ཀྱི་ཐོ་ཡིག་ དེ་ལས་ འགྲེམ་སྟོན་ ཡང་ན་ རྐྱེན་ངན་ཚུ་གི་ སྙན་ཞུ་ནང་ལུ་མ་བཙུགས་པར་སྡོད་དགོ།

### 2. བཟོ་སྐྲུན་འབད་ནི་དང་ ངོས་ལེན་འབད་ནི་ རྟགས་མཚན་བཙུགས་ནི་ དེ་ལས་ བཏང་ནི། {#_2-create-approve-sign-and-submit}

བརྡ་འཚོལ་ཚད་གཞི་འདི་གིས་ ཁྱོད་ཀྱི་གློག་རིམ་གནས་སྟངས་ལས་ ངེས་གཏན་གནས་གོང་ཚུ་ངོས་ལེན་འབདཝ་ཨིན། དང་པ་ `POST /v1/assets/transfer` གིས་ མིང་རྟགས་བཀོད་ནིའི་ས་སྒོ་ཚུ་བཏོན་བཏང་ཞིནམ་ལས་ ལུང་འདྲེན་འབད་ཡོད་པའི་ ཐོན་རིམ་བཟོ་ཡོད་པའི་ཚོང་འབྲེལ་གྱི་ སྟེགས་བུ་ཅིག་སླར་ལོག་འབདཝ་ཨིན། གཉིས་པ་འདི་གིས་ སྤོ་བཤུད་ཞུ་བ་གཅིག་མཚུངས་ལུ་ དངུལ་ཁུག་གི་མི་མང་ལྡེ་མིག་དང་ བཏོན་བཏང་ཡོད་པའི་མིང་རྟགས་རྐྱངམ་ཅིག་ཁ་སྐོང་བརྐྱབ་ཨིན།

```js
import { AccountAddress } from '@iroha/iroha-js/address'
import {
  createConnectAppSession,
  createConnectSessionPreview,
  deleteConnectSession,
  registerConnectSession,
} from '@iroha/iroha-js/connect-browser'

const baseUrl = 'https://taira.sora.org'
const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

const decodeBase64 = (value) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
const encodeBase64 = (bytes) =>
  btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''))

async function postJson(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
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
  chainId,
  chainDiscriminant,
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
  const derivedAuthority = AccountAddress.fromAccount({
    publicKey: publicKeyHex,
    algorithm: 'ed25519',
  }).toI105(chainDiscriminant)
  if (derivedAuthority !== authority) {
    throw new Error('enrolled public key does not control authority')
  }

  const preview = createConnectSessionPreview({
    chainId,
    node: baseUrl,
  })
  const relay = await registerConnectSession(
    baseUrl,
    preview.sidBase64Url,
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
      permissions: {
        methods: ['sign_transaction'],
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

    const transfer = {
      authority,
      asset_definition_id: assetDefinitionId,
      asset_balance_scope: 'global',
      amount,
      destination,
      fee_payment: {
        payer: 'authority',
        value: { charge_limits: [] },
      },
      creation_time_ms: Date.now(),
      transaction_ttl_ms: 120_000,
      memo: 'iroha-cookbook-wallet-connect',
    }

    const prepared = await postJson('/v1/assets/transfer', transfer)
    if (!prepared.ok || prepared.submitted) {
      throw new Error('Torii did not return a pending-signature scaffold')
    }
    const limits = prepared.intent.fee_payment.value.charge_limits
    if (
      limits.some(
        (limit) =>
          limit.asset_definition_id !== faucetFeeAssetDefinitionId,
      )
    ) {
      throw new Error(
        'live fee quote uses an asset other than the faucet response',
      )
    }

    const signature = await connect.signTransaction(
      decodeBase64(prepared.transaction_scaffold_base64),
    )
    if (signature.length !== 64) {
      throw new Error('wallet returned a non-Ed25519 signature length')
    }

    const submitted = await postJson('/v1/assets/transfer', {
      ...transfer,
      public_key_hex: publicKeyHex,
      signature_base64: encodeBase64(signature),
    })
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

ཟུར་བཞག་ཁང་གི་དཔེ་ `connect_app` དང་ `connect_wallet` འདི་ བྱ་རིམ་གྱི་བརྟག་དཔྱད་ཐོན་ཁུངས་ཚུ་ཨིན། ཁོང་ནང་ གཏན་འབེབས་རིང་ལུགས སྐྱེལ་འདྲེན་ལྡེ་མིག་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ལས་ ཕྱིར་ཐོན་ནང་ལུ་ ཊོ་ཀེན་ཚུ གསལ་སྟོན་འབདཝ་ཨིན་ དེ་ལས་ དངུལ༌ཁུག གི་བརྟག་དཔྱད་ཐོན་ཁུངས གིས་ ཚབ་མཚོན མིང་རྟགས སླར་ལོག་འབདཝ་ཨིན། དེ་དག་གིས་ གཟུགས་བརྙན་ཚུ་རྐྱངམ་གཅིག་ ཞིབ་འཚོལ་འབད་ནིའི་དོན་ལུ་ ལག་ལེན་འཐབ་དོ་ཡོདཔ་མ་གཏོགས་ Taira དངུལ༌ཁུག ལག་བསྟརསྦེ་མ་ལག་ལེན་འཐབ་པར་ཡོདཔ་ཨིན།

## བརྟག་དཔྱད་འབད་ {#verify}

ལོག་སྤྲོད་ཡོད་པའི་ཧེཤ་འདི་བཞག་སྟེ་ མི་མང་བདག་དབང་མཐའ་མཚམས་བརྒྱུད་དེ་ འགྲོ་ཡུལ་གྱི་ ཤུལ་མའི་གནས་སྟངས་འདི་ ངེས་གཏན་བཟོ།

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

བདེན་དཔྱད་འདི་ JavaScript བཞེས་སྒོ་འབད་མི་གིས་ བཙུགས་ཡོད་པའི་ཚོང་འབྲེལ་གསང་ཡིག་ཧ་ཤི་གི་དོན་ལུ་ `Applied` བལྟ་རྟོགས་འབད་བའི་སྐབས་རྐྱངམ་ཅིག་ མཐར་འཁྱོལ་འབྱུང་ཡོདཔ་དང་ འགྲོ་ཡུལ་འཛིན་བཟུང་གིས་ སྤོ་བཤུད་འདི་ བསྟན་ཡོདཔ་ཨིན། HTTP ངོས་ལེན་ཡང་ན་དངུལ་ཁུག་ཆ་འཇོག་ཁོ་ན་བཀག་སྡོམ་གྱི་རྩིས་ཐོའི་མཐའ་མའི་མིན།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `404`, `503`, ཡང་ན་ `enabled: false` མཐུད་གནས་ལས་ མཐུད་མཚམས་དེ་གུ་ རི་ལེ་ལཱ་ཡུན་ཅིག་ཡང་གསར་བསྐྲུན་འབད་མི་བཏུབ། ལྕོགས་ཅན་བཟོ་ཡོད་པའི་ལོ་ཀཱལ་ནེཊི་ལུ་སོར་བསྒྱུར་འབད། ཁྱོད་ར་གིས་ གློག་རིམ་ཡང་ན་ འཛིན་སྐྱོང་རྟགས་མཚན་ཚུ་ སྐྱེལ་འདྲེན་འབད་ནི་ལུ་ ལོག་སྟེ་མ་འགྱོ།
- `USER_DENIED` འདི་དངུལ་ཁུག་གི་ གྲོས་ཐག་འདི་ཨིན། འཕྲུལ་ཆས་ལག་ལེན་འཐབ་མི་གིས་ ལོག་སྟེ་ར་ ངོས་ལེན་གྱི་བརྡ་སྟོན་ཚུ་ཕྱེ་བའི་ཚབ་ལུ་ མཐའ་མཇུག་གི་ཐོན་ཁུངས་སྦེ་བཞག་དགོ།
- ཆ་འཇོག་-རྩིས་ཐོ་མ་མཐུན་མི་དང་ ཡང་ན་ ཆ་འཇོག་མཚན་རྟགས་ནུས་མེད་ཅིག་གིས་ ལཱ་ཡུན་འདི་ཁ་བསྡམ་དགོ། ངོ་རྟགས་བསྡམ་བཞག་མ་ཚུགས་པའི་ཤུལ་ལས་ དངུལ་ཁུག་ལུ་ མཚན་རྟགས་བཀོད་དགོཔ་སྦེ་ ནམ་ཡང་མ་སླབ།
- `public_key_hex does not control authority` ཟེར་མི་འདི་ ཐོ་བཀོད་གནས་སྡུད་དང་ ཆ་འཇོག་འབད་ཡོད་པའི་ I105 ངོ་རྟགས་འདི་ ངོས་ལེན་མེདཔ་ཨིན། དུས་ཐུང་དངུལ་ཁུག་སྐྱེལ་འདྲེན་ལྡེ་མིག་འདི་ ས་སྒོ་འདི་ནང་ལག་ལེན་འཐབ་མི་བཏུབ།
- མིང་རྟགས་ཡང་ན་ གྱང་ཁོག་བཀག་ཆ་ཟེར་མི་འདི་ སྤྱིར་བཏང་ལུ་ ཞུ་བ་ས་སྒོ་ཡང་ན་ གྲ་སྒྲིག་དང་ཕུལ་ནིའི་བར་ན་ འགྱུར་བཅོས་འབད་ཡོད་པའི་ འཚོ་བའི་འཐུས་ཀྱི་ ཚིག་བརྗོད་ལུ་གོཝ་ཨིན། ཞུ་བ་གསརཔ་ཅིག་བཟོ་བསྐྲུན་འབད། མིང་རྟགས་རྙིངམ་འདི་ནམ་ཡང་མ་བཙུགས།
- ཧེ་མ་ལས་ངོས་ལེན་འབད་ཡོད་པའི་མིང་རྟགས་བཀོད་ཡོད་པའི་ཞུ་བ་ཅིག་གི་ བསྐྱར་གཏང་གཏན་གཏན་འདི་ ནུས་པ་མེདཔ་ཨིན། དུས་ཚོད་མཇུག་བསྡུ་མི་འདི་ ལོག་འགོ་བཙུགས་ནིའི་དོན་ལུ་ རྒྱུ་མཚན་ཅིག་སྦེ་ མ་བརྩི་བའི་ཧེ་མ་ དེ་གི་སླར་ལོག་འབད་ཡོད་པའི་ཚོང་འབྲེལ་གྱི་ཧེཤ་འདི་འདྲི་དཔྱད་འབད།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [བརྡ་འཚོལ་མཐུད་པའི་ལག་བསྟར་འདི་ པིན་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [བརྡ་འཚོལ་མཐུད་པའི་བརྟག་དཔྱད་ཚུ་ པིན་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js) ལུ་ཡོདཔ་ཨིན།
- [Rust གློག་རིམ གཞི་སྒྲོམ དཔེ་འདི་ གཏན་སྦྱར་ཡོད་པའི Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs) ལུ་འབདཝ་ཨིན།
- [Rust བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ Git commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)ནང་ལུ་ དངུལ་ཁུག གཞི་སྒྲོམ དཔེ་སྟོན་འབདཝ་ཨིན།
- [Torii OpenAPI བཟོ་བཀོད་འབད་ཐངས་ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus ཞབས་ཏོག་ཚུ་](/dz/blockchain/sora-nexus-services.md)
- [དངུལ་རྐྱང་གི་རྒྱུ་དངོས་ཚུ་](./fungible-assets.md)
- [ཚོང་འབྲེལ་ཚུ་ བཏང་ནི་དང་ བདེན་དཔྱད་འབད་ནི་](./submit-and-verify-transactions.md)
