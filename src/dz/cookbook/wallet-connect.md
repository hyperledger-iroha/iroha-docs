---
translation_locale: dz
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 38283321d51ddbb528272bb4429906eb41545ed3933ae695fb05a24675bff9c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Wallet Connect: རྒྱུ་དངོས་ཚུ་ བསྒྱུར་བཅོས་འབད་ནིའི་དོན་ལས་ ངོས་ལེན་འབདཝ་ཨིན། {#wallet-connect-approve-an-asset-transfer}

## གྲུབ་འབྲས་ {#outcome}

བལྟ་བཤལཔ་ནང་ལུ་ Iroha འབྲེལ་མཐུད་ཚོགས་ཐེངས་ཅིག་བཟོ། I105 ཤོག་སྒྲོམ་གི་ངོ་རྟགས་གཅིག་གི་དོན་ལུ་ ཀི་པོཊོ་རིག་པའི་ ངོས་ལེན་ཐོབ་ནི་ དེ་ལས་ Torii ཤོག་སྒྲིལ་གྱི་དངོས་རྫས་བགོ་བཀྲམ་འབད་ནིའི་ཡིག་གཟུགས་དེ་གུ་ མཚན་རྟགས་བཀོད་དགོཔ་སྦེ་ཞུ་ཞིནམ་ལས་ ཐོ་བཀོད་མཇུག་བསྡུ་བའི་བར་སྒུག་སྡོད་ပါ။

## དགོས་མཁོ་ཚུ་ {#prerequisites}

- ཁྱོད་ཀྱིས་ `@iroha/iroha-js` དང་ HTTPS ལག་ལེན་འཐབ་མི་ བརྒྱུད་འཕྲིན་ལག་ལེན་འདི་ཨིན།
- Iroha Connect v1 ལག་ལེན་འཐབ་ནི་དང་ ཨེབ་ལྡེ་མིག་གཅིག་ཡོད་པའི་ Ed25519 I105 རྩིས་ཁྲ་འཛིན་སྐྱོང་འབད་ནིའི་དངུལ་ཁུག་ཨིན།
- ད་ལྟོའི་ Taira ལྕགས་ཐག་ ID དང་ ལྕགས་རྟགས་དབྱེ་བ་ཕྱེ་མི་ དེ་ལས་དངུལ་ཁུག་གི་མིང་ཐོ་ནང་ཡོད་པའི་ ཨེཌི་༢༥༥༡༩ ཅན་མའི་ public-key hex, རང་དབང་ལུ་གནས་གཏུགས་འབད་ཚུགས་པའི་ རྒྱུ་དངོས་དང་ ཀ་ནོ་ཀཱན་གྱི་ I105 དམིགས་ཡུལ་ཚུ་ཡོདཔ་ཨིན།
- རྩིས་ཁྲ་གི་རྒྱུ་དངོས་ ID འདི་ ད་ལྟོའི་ Taira faucet ལན་དུད་ཀྱིས་ལོག་གཏོགསཔ་ཨིན། དཔེ་སྟོན་འདི་གིས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ཁྲལ་གྱི་གནས་གོང་འདི་ ID དང་ཕྱདཔ་ད་ བརྟག་ཞིབ་འབདཝ་ཨིན། འདི་རྩ་ལས་རང་ ཨེབ་གཏང་མི་ རྒྱུ་དངོས་ངོ་རྟགས་མ་བཙུགས་ပါဘူး။
- མཐུད་སྦྲེལ་འབད་ནི་འདི་ གདམ་ཁ་རྐྱབ་མི་ Torii ལུ་ རྩ་སྒྲིག་འབད་དགོཔ་ཨིན། ཁྱོད་ཀྱིས་ QR ཡང་ན་ deep link སྟོན་མ་ཚར་བའི་ཧེ་མ་ བརྟག་ཞིབ་འབད་:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

གལ་སྲིད་ Taira གིས་ Connect མཚམས་འཇོག་འབད་ཡོད་པའི་ སྙན་ཞུ་ ཡང་ན་ `404`/`503` སླར་ལོག་འབདཝ་ཨིན། ཁྱོད་ཀྱིས་ Connect གཞི་བཙུགས་འབད་ཡོད་པའི་ ས་གནས་ཁ་ཐུག་གི་ མཐུན་རྐྱེན་ལག་ལེན་འཐབ་དགོ། རྒྱུ་དངོས་རྒྱུན་འགྲུལ་གྱི་དོན་ལུ་ བརྒྱུད་འཕྲིན་དེ་ནང་ གནས་ཚད་དང་འཐུས་ཀྱི་ལྷག་ལུས་ཚུ་ འབོར་ཆེ་དྲགས་སྦེ་ཡོད་དགོཔ་ཨིན།

## རིམ་པ་ཚུ་ {#steps}

### ༡ དངུལ་ཁུག་གཅིག་ འགོ་འདྲེན་འཐབ་ནིའི་ལམ་སྟོན་བྱིན་ནི། {#_1-provide-one-wallet-launch-control}

འོག་གི་ JavaScript གིས་ ཐོ་བཀོད་འབད་ཡོད་པའི་ཤོག་ལེབ་ནང་ལུ་ འ་ནི་ལས་ཀ་འདི་གིས་ རེ་བ་བསྐྱེད་དོ་ཡོདཔ་ཨིན།

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

ལག་ཆས་གཞན་གྱི་དངུལ་ཁུག་གི་དོན་ལུ་ URI འདི་བཟུམ་སྦེ་ QR ཀོ་ཌ་ཅིག་རང་ བཏོན་གཏང་། URI འདི་ནང་ དངུལ་ཁུག་གི་ཐོ་བཀོད་འབད་ཡོད་པའི་ འབྲེལ་མཐུད་རྟགས་དེ་ཡོདཔ་ལས་ དེ་ཚུ་ རྩིས་ཞིབ་དང་ ཐོ་བཀོད་ཀྱི་ཐོ་ཡིག་ དེ་ལས་ འགྲེམ་སྟོན་ ཡང་ན་ རྐྱེན་ངན་ཚུ་གི་ སྙན་ཞུ་ནང་ལུ་མ་བཙུགས་པར་སྡོད་དགོ།

### 2. བཟོ་སྐྲུན་འབད་ནི་དང་ ངོས་ལེན་འབད་ནི་ རྟགས་མཚན་བཙུགས་ནི་ དེ་ལས་ བཏང་ནི། {#_2-create-approve-sign-and-submit}

འ་ནི་ བལྟ་བཤལཔ་འདི་ ཁྱོད་ཀྱིས་ལག་ལེན་གྱི་གནས་སྟངས་ནང་ལས་ གྱོང་གུད་ཅན་གྱི་ གནས་གོང་ཚུ་ ངོས་ལེན་འབདཝ་ཨིན། དང་པ་དེ་ `POST /v1/assets/transfer` གིས་ མཚམས་འཇོག་འབད་སའི་ ས་ཁོངས་ཚུ་སེལ་འཐུ་འབད་ཞིནམ་ལས་ ཨེབ་གཏང་འབད་ཡོད་པའི་ ཌའི་ལོག་གི་འགྱུར་ལྡེ་མིག་ཅིག་སླར་ལོག་འབདཝ་ཨིན། གཉིས་པ་འདི་གིས་ བརྒྱུད་འཕྲིན་ཨེབ་གཏང་དགོ་པའི་ ཞུ་བ་ལུ་ དངུལ་ཁུག་གི་སྒོ་ཕྱེ་དང་ ཐོ་བཀོད་མ་བཏུབ་པའི་མིང་ཐོ་བཀོད་རྐྱངམ་གཅིག་ལུ་ མཐུད་འབད།

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

ཁྱོད་ཀྱིས་ `token_app`, `token_management` དང་ `token_relay` འདི་ལག་ལེན་གྱི་ དྲན་ཐོའི་ནང་བཞག་དགོ། བརྒྱུད་འཕྲིན་ཨེབ་གཏང་འབད་ནི་དེ་རྐྱངམ་ཅིག་ URI/ལྡེ་མིག་ཨིན། Connect ངོས་ལེན་འདི་རྩིས་ཁྲ་གི་ངོ་རྟགས་ཀྱིས་བཙུགས་ཏེ་ཡི་གུ་བཟོ་ཡོདཔ་ཨིན། ངོས་ལེན་ནང་ལུ་ X25519 `walletPublicKey` འདི་གློག་འཕྲོད་ཅན་གྱི་སྐྱེལ་འདྲེན་ལྡེ་མིག་ཨིན་ དེ་ལས་རྩིས་ཁྲ་ཀྱི་ Ed25519 མཚམས་འཇོག་ལྡེ་མིག་མེན།

### ༣.དངུལ་ཁུག་ལག་ལེན་ནང་ལུ་ Rust གཟུགས་ཀྱི་དབྱེ་བ་ཚུ་ ལག་ལེན་འཐབ་དགོ། {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust སྲིད་བྱུས་ཀྱི་ཐོ་བཀོད་འདི་ ལག་ལེན་ཡིག་ཆའི་རྟགས་མཚན་ཅིག་ལུ་ ཐོ་བཀོད་འབད་ཚུགསཔ་ད་ ཌེ་ཀོཌ་གི་དངུལ་ཁུག་གིས་ བརྒྱུད་འཕྲིན་ལག་ལེན་དེ་ གསལ་བཀོད་འབད་ཚར་ཞིནམ་ལས་ ཡི་གུ་ཅིག་གུ་ ཐོ་བཀོད་ཀྱི་དོན་གནད་ཚུ་གསལ་སྟོན་འབད་ཡོདཔ་མ་ཚད་ ལག་ལེན་གྱི་ལམ་ལུགས་ཡང་ བཏོན་ཏེ་ ཆ་འཇོག་གྲུབ་ཡོད་པའི་རྩིས་ཁྲ་ལྡེ་མིག་དང་གཅིག་ཁར་ ངོས་འཛིན་འབད་ཡོདཔ་ཨིན། ཨ་ནི་ལག་ལེན་པ་འདི་གིས་ ལག་ལེན་ཡིག་ཆ་འདི་ ཆ་འཇོག་གྲུབ་མི་བཏུབ་ཨིན།

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

ཟུར་བཞག་ཁང་གི་དཔེ་ `connect_app` དང་ `connect_wallet` འདི་ བྱ་རིམ་སྒྲིག་གཞི་ཚུ་ཨིན། ཁོང་ནང་ deterministic སྐྱེལ་འདྲེན་ལྡེ་མིག་ལག་ལེན་འཐབ་དོ་ཡོདཔ་ལས་ ཕྱིར་ཐོན་ནང་ལུ་ tokens གསལ་སྟོན་འབདཝ་ཨིན་ དེ་ལས་ wallet fixture གིས་ dummy signature སླར་ལོག་འབདཝ་ཨིན། དེ་དག་གིས་ གཟུགས་བརྙན་ཚུ་རྐྱངམ་གཅིག་ ཞིབ་འཚོལ་འབད་ནིའི་དོན་ལུ་ ལག་ལེན་འཐབ་དོ་ཡོདཔ་མ་གཏོགས་ Taira wallet implementationསྦེ་མ་ལག་ལེན་འཐབ་པར་ཡོདཔ་ཨིན།

## བརྟག་དཔྱད་འབད་ {#verify}

སླར་ལོག་འབད་ཡོད་པའི་ཧེཤ་འདི་བཞག་ཞིནམ་ལས་ མི་སེར་གྱི་ལག་ལེན་ཅན་གྱི་ཐོ་བཀོད་མཐའ་མཇུག་གི་ཐོག་ལས་ འོང་སའི་ས་ཁོངས་ཀྱི་ གནས་གོང་ཚུ་ བཏོན་གཏང་ནི།

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

བརྟག་ཞིབ་འདི་ JavaScript ཝེ་ཊར་གྱིས་ `Applied` ཕྱིར་བཏོན་འབད་ཡོད་པའི་ལག་ལེན་གྱི་ཧེཤ་གི་དོན་ལུ་ མཐོང་པ་ཅིན་རྐྱངམ་གཅིག་ གྲུབ་འབྲས་ཐོན་ཚུགས་ནི་ཨིནམ་དང་ བཀྲམ་སྤེལ་འབད་སའི་ཚོང་ཁང་གིས་ སྤོ་བཤུད་དེ་ གསལ་སྟོན་འབདཝ་ཨིན། HTTP ངོས་ལེན་འབད་ནི་དང་ ཡང་ན་ དངུལ་རྐྱང་གི་དངུལ་ཁུག་ཚུ་ ཆ་འཇོག་འབད་ནི་རྐྱངམ་གཅིག་གིས་ ཡོངས་འབྲེལ་རྩིས་དེབ་ཀྱི་མཇུག་སྒྲིལ་སྦེ་བརྩི་མི་ཚུགས་འོང་།

## དཀའ་ངལ་སེལ་ཐབས། {#troubleshooting}

- `404`, `503` ཡང་ན་ `enabled: false` འབྲེལ་མཐུད་འབད་ཡོད་པའི་གནས་སྟངས་ལས་འདི་གིས་དོན་འདི་ཨིན་ཌི་ལུ་ བརྒྱུད་འཕྲིན་ཚོགས་སྟོན་ཅིག་ཡང་བཟོ་མི་ཚུགས་ཟེར་ཨིན་མས། ས་གནས་ཀྱི་ཁ་ཐུག་ལུ་སྤོ་བཤུད་འབད། རང་གིས་རང་ ལག་ལེན་དང་ འཛིན་སྐྱོང་གི་རྟགས་མཚན་ཚུ་སྐྱེལ་འདྲེན་འབད་ནི་ལུ་མ་འགྱོ།
- `USER_DENIED` འདི་དངུལ་ཁུག་གི་ གྲོས་ཐག་འདི་ཨིན། འཕྲུལ་ཆས་ལག་ལེན་འཐབ་མི་གིས་ ལོག་སྟེ་ར་ ངོས་ལེན་གྱི་བརྡ་སྟོན་ཚུ་ཕྱེ་བའི་ཚབ་ལུ་ མཐའ་མཇུག་གི་ཐོན་ཁུངས་སྦེ་བཞག་དགོ།
- ངོས་ལེན་རྩིས་ཁྲ་དང་མ་མཐུནམ་ ཡང་ན་ ཆ་མེད་གཏང་མི་ ངོས་ལེན་གྱི་རྟགས་མཚན་གྱིས་ དུས་རྒྱུན་དེ་ མཚམས་འཇོག་འབད་དགོཔ་ཨིན། ངོ་རྐྱང་གི་བཅའ་ཡིག་མ་བཙུགས་པའི་ཤུལ་ལུ་ གཏན་འཇགས་ཀྱི་དངུལ་ཁུག་ནང་ ཐོ་བཀོད་འབད་དགོ་།
- `public_key_hex does not control authority` ཟེར་མི་འདི་ ཐོ་བཀོད་དང་ ངོས་འཛིན་ཅན་གྱི་ I105 ངོ་རྟགས་མ་མཐུན་པའི་ གནད་དོན་ཚུ་ཨིན། འ་ནི་ས་ཆ་འདི་ནང་ལུ་ དུས་ཡུན་ཐུང་ཀུ་ཅིག་ཨིན་མི་ Wallet Transport Key འདི་ལག་ལེན་འཐབ་མི་ཚུགས།
- ལག་ལེན་གྱི་མིང་རྟགས་ ཡང་ན་ ཨེཀ་ཕཱོལ་ཌ་གི་ཁ་བྱང་འདི་ མང་ཤོས་ར་ དགོས་མཁོ་ཅན་གྱི་ ས་ཁོངས་ ཡང་ན་ གྲ་སྒྲིག་འབད་ཞིནམ་ལས་ བཏབ་པའི་བར་ན་ གྱངས་ཁ་བསྒྱུར་བཅོས་འབད་ཡོདཔ་ཨིན། དགོས་མདམ་གསརཔ་བཟོ་དགོ། རྟག་བུ་རང་ ལག་ལེན་རྙིངམ་བཙུགས་ནི་མི་འོང་།
- ཧེ་མ་ལས་ ངོས་ལེན་འབད་ཡོད་པའི་ ཡིག་ཐོག་གི་ཞུ་ཡིག་འདི་ ཡང་བསྐྱར་སྦེ་ བསྐྱར་ཞིབ་འབད་ནི་དེ་ ཆ་མེད་བཏང་ཡོདཔ་ཨིན། དུས་ཡུན་འགོར་བའི་ཧེ་མ་ ལོག་སྟེ་ལོག་འོང་མི་ཅ་ཆས་ཀྱི་ཧེཤ་ལུ་ དྲི་བཀོད་འབད་ཞིནམ་ལས་ ལོག་འགོ་བཙུགས་ནིའི་རྒྱུ་མཚན་ཅིག་སྦེ་ ལག་ལེན་འཐབ་ཨིན།

## གཞི་རྟེན་དང་འབྲེལ་བའི་ཡིག་ཆ་ཚུ་ {#source-and-related-docs}

- [ཕབ་ལེན་འབད་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js) ལུ་ Browser Connect ལག་ལེན་འཐབ་ནི་
- [Browser Connect གྱི་བརྟག་དཔྱད་ཚུ་ པིན་ཌི་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js) ལུ་འབདཝ་ཨིན།
- [Rust app framework དཔེ་འདི་ pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs) ལུ་འབདཝ་ཨིན།
- [Rust བསྡུ་སྒྲིག་འབད་ཡོད་པའི་ commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)ནང་ལུ་ wallet framework དཔེ་སྟོན་འབདཝ་ཨིན།
- [Torii OpenAPI བཟོ་བཀོད་འབད་ཐངས་ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus ཞབས་ཏོག་ཚུ་](/dz/blockchain/sora-nexus-services.md)
- [དངུལ་རྐྱང་གི་རྒྱུ་དངོས་ཚུ་](./fungible-assets.md)
- [ཚོང་འབྲེལ་ཚུ་ བཏང་ནི་དང་ བདེན་དཔྱད་འབད་ནི་](./submit-and-verify-transactions.md)
