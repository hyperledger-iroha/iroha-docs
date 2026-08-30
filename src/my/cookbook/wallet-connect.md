---
translation_locale: my
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 38283321d51ddbb528272bb4429906eb41545ed3933ae695fb05a24675bff9c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Wallet Connect: အရင်းအမြစ်လွှဲပြောင်းမှုကို ခွင့်ပြုပါ {#wallet-connect-approve-an-asset-transfer}

## ရလဒ် {#outcome}

Iroha Connect session ကို browser ထဲမှာဖန်တီးပြီး I105 wallet ID တစ်ခုအတွက် cryptographic approval ကိုရယူပါ၊ အဲဒီ wallet ကို Torii ရဲ့ တိကျတဲ့ asset transfer scaffold ကို လက်မှတ်ထိုးဖို့ တောင်းဆို၊ သီးခြားလက်မှတ်ကိုတင်ပြီး Applied finality ကိုစောင့်ပါ။

## လိုအပ်ချက်များ {#prerequisites}

- `@iroha/iroha-js` နှင့် HTTPS ကို အသုံးပြုသော ရှာဖွေရေးစနစ်။
- Iroha Connect v1 ကို အကောင်အထည်ဖော်ပြီး Ed25519 I105 account တစ်ခုတည်းသောဖုန်းကို ထိန်းချုပ်တဲ့ ပိုက်ဆံအိတ်တစ်ခု။
- လက်ရှိ Taira ကွင်းဆက် ID နှင့် ကွင်းဆက်ခွဲခြားချက်၊ ပိုက်ဆံအိတ်၏ မှတ်ပုံတင်ထားသော စာလုံးငယ် Ed25519 အများသုံး သော့ဝဲ hex, ပိုင်ဆိုင်သည့် လွှဲပြောင်းနိုင်သော အရင်းအမြစ်တစ်ခုနှင့် တရားဝင် I105 ရည်မှန်းချက်ဖြစ်သည်။
- လက်ရှိ Taira faucet တုံ့ပြန်မှုဖြင့်ပြန်လည်ပေးပို့ထားသော အခွန်လက်မှတ် ID။ ဥပမာသည် ID နှင့်သက်ဆိုင်သည့် တိုက်ရိုက်ခွန် quote ကိုစစ်ဆေးသည်။ ၎င်းသည်တစ်ခါမှ ကူးယူထားသော အရင်းအမြစ်အသိကို မပါ ၀ င်ပါ။
- Connect ကိုရွေးချယ်ထားသော Torii တွင်ဖွင့်နိုင်ရမည်။ QR သို့မဟုတ် နက်ရှိုင်းသော link ကိုပြရန်မတိုင်မီ စစ်ဆေးပါ။

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Taira သည် Connect ကိုပိတ်ထားသည်သို့မဟုတ် `404`/`503` ကိုပြန်ပို့ပါက, Connect ကိုဖွင့်ထားသော Local Network တစ်ခုကိုအသုံးပြုပါ။ သာမန်အရင်းအမြစ်လွှဲပြောင်းမှုတစ်ခုမှာ Wallet က လွှဲပြောင်းနိုင်သည့် အရေအတွက်နှင့် အခွန်စာရင်းများ လုံလောက်စွာပိုင်ဆိုင်ရန်လိုအပ်သည်။

## ခြေလှမ်း {#steps}

### (၁) Wallet launch control တစ်ခုကို ပေးပါ။ {#_1-provide-one-wallet-launch-control}

အောက်ပါ JavaScript သည် လျှောက်လွှာစာမျက်နှာတွင် ဤအချက်ကို မျှော်မှန်းသည်-

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

QR ကို အခြားကိရိယာတစ်ခုပေါ်က ငွေကြေးအိတ်အတွက် ထပ်တူသော URI ကုဒ်ကို ပေးပါ။ URI သည် ငွေကြေးစကင်လုပ်ထားသည့် Relay Token ကို ထိန်းထားသည်၊ ထို့ကြောင့် Analytics, logs, referrers သို့မဟုတ် crash အစီရင်ခံစာများတွင်မထည့်ပါနဲ့။

### (၂) ဖန်တီးခြင်း၊ အတည်ပြုခြင်း၊ လက်မှတ်ရေးထိုးခြင်းနှင့် တင်ပြခြင်း၊ {#_2-create-approve-sign-and-submit}

ဤ browser module သည်သင်၏ application state မှအဓိကတန်ဖိုးများကိုလက်ခံသည်။ ပထမ `POST /v1/assets/transfer` သည် လက်မှတ်ရေးထိုးမှု ကွင်းများကိုဖယ်ရှားပြီး ကိုးကားထားသော၊ ဗားရှင်းထုတ်လုပ်ထားသော ငွေပေးချေမှု စင်္ကြံကိုပြန်ပို့သည်။ ဒုတိယသည်တူညီသော transfer request သို့ wallet ၏ အများသုံးပုန်းနှင့် သီးခြားလက်မှတ်ကိုသာထည့်သွင်းသည်။

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

`token_app`, `token_management` နှင့် `token_relay` တို့ကို application memory တွင် သိမ်းထားပါ။ Wallet launch URI/token ကိုသာ wallet သို့ဖြတ်သန်းသည်။ Connect ခွင့်ပြုချက်သည် အကောင့်အမှတ်အသားဖြင့် လက်မှတ်ထိုးခြင်းခံထားရပြီး ခွင့်ပြုမှုအတွင်းရှိ X25519 `walletPublicKey` သည် ယာယီ သယ်ယူပို့ဆောင်ရေးသော့တစ်ခုဖြစ်ပြီး အကောင့်၏ Ed25519 လက်မှတ်ထိုးသော သော့မဟုတ်ပေ။

### (၃) Wallet implementation မှာ Rust frame အမျိုးအစားတွေကို အသုံးပြုပါ။ {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust ပရိုတိုကော် မျက်နှာပြင်သည် လက်မှတ်ကို ချိတ်ဆက်နိုင်သည်မှာ ငွေကြေးစက္ကူသည် တောင်းဆိုသော ငွေလွှဲပြောင်းမှုကို ဖေါ်ထုတ်ပြီးနောက်၊ ၎င်း၏ တိကျသော ရည်ရွယ်ချက်၊ အသုံးချသည့် မူဝါဒများကို ပြသပြီး ခွင့်ပြုထားသော အကောင့်ခလုတ်ဖြင့် လက်မှတ်ထိုးပြီးနောက်သာဖြစ်သည်။ ဤအကူအညီသည် သက်ဆိုင်ရာလက်မှတ်ကို လက်ခံသည်။ ၎င်းသည် တစ်ခုကို မဖန်တီးပါ။

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

`connect_app` နှင့် `connect_wallet` ၏ဥပမာများမှာ ပရိုတိုကောဖစ်ချ်များဖြစ်သည်- ၎င်းတို့သည် deterministic transport key များကိုအသုံးပြုပြီး output တွင် tokens များကို ဖော်ပြကာ wallet fixtures သည် dummy လက်မှတ်တစ်ခု ပြန်လည်ပေးသည်။ ၎င်းတို့ကို ဖေ့ခ်များသာ လေ့လာရန် အသုံးပြု၍ ဘယ်တော့မှ Taira wallet အကောင်အထည်ဖော်မှုအဖြစ်မသုံးပါ။

## စစ်ဆေးပါ {#verify}

ပြန်ပို့တဲ့ hash ကို သိမ်းထားပြီး အများပြည်သူ ပိုင်ရှင်များအဆုံးမှတ်မှတစ်ဆင့် ရည်ရွယ်ချက်ရဲ့ post-state ကို အတည်ပြုပါ။

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

စစ်ဆေးမှုဟာ JavaScript ဝန်ထမ်းက တင်ပြထားတဲ့ ငွေပေးချေမှု ဟက်ရှ်အတွက် `Applied` ကို သတိထားမိပြီး ရည်ရွယ်ချက်ပိုင်ဆိုင်မှုက လွှဲပြောင်းမှုကို ထင်ဟပ်တဲ့အခါသာ အောင်မြင်ပါတယ်။ HTTP လက်ခံခြင်း (သို့) ပိုက်ဆံအိတ် ခွင့်ပြုချက်တစ်ခုတည်းဟာ စာရင်းအင်းရဲ့ အပြီးသတ်မှုမဟုတ်ဘူး။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `404`, `503`, (သို့) `enabled: false` ကနေ Connect status မှဆိုသည်မှာ ထို node တွင် relay session ကိုမဖန်တီးနိုင်ပါ။ localnet သို့ပြောင်းပါ; app သို့မဟုတ် စီမံခန့်ခွဲမှု tokens များကိုကိုယ်သင်သယ်ဆောင်ခြင်းသို့ ပြန်မသွားပါနဲ့။
- `USER_DENIED` ဟာ ငွေကြေးအစီအစဉ်ပါ။ ထပ်တလဲလဲ ခွင့်ပြုချက် အချက်ပြမှုတွေကို ဖွင့်မယ့်အစား terminal user ရလဒ်အဖြစ် ထိန်းသိမ်းပါ။
- ခွင့်ပြုချက်စာရင်းနဲ့ မလိုက်ဖက်မှု (သို့) လက်မှတ်လက်မှတ်အမှားက အစည်းအဝေးကို ပိတ်ပစ်ရပါမယ်။ လက္ခဏာ ချည်နှောင်မှု ကျရှုံးသွားပြီးနောက် ငွေကြေးဝယ်သူထံ လက်မှတ်ထိုးဖို့ ဘယ်တော့မှ မေတ္တာရပ်ခံပါ။
- `public_key_hex does not control authority` ဆိုသည်မှာ မှတ်ပုံတင် အချက်အလက်များနှင့် ခွင့်ပြုထားသော I105 ကိုယ်စားလှယ်လက္ခဏာ သဘောမတူခြင်း ဖြစ်သည်။
- လက်မှတ် (သို့) စကဖော့ဒ် ပယ်ချခြင်းဆိုသည်မှာ ပြင်ဆင်ပြီး တင်ပြမှုအကြား ပြောင်းလဲသော request field သို့မဟုတ် live fee quote ကို ဆိုလိုသည်။ တောင်းဆိုချက်အသစ်တစ်ခု တည်ဆောက်ပါ။ လက်မှတ်ဟောင်းကို ဘယ်တော့မှ အစားထိုးမလုပ်ပါ။
- လက်မှတ်ထိုးပြီးသား တောင်းဆိုချက်ရဲ့ တိကျတဲ့ ပြန်လည်ရိုက်ကူးမှုက idempotent ပါ။ အချိန်ကာလကို စဖို့ အကြောင်းပြချက်အဖြစ် မသုံးခင် ပြန်လာတဲ့ ငွေပေးချေမှု hash ကို မေးမြန်းပါ။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ပိတ်ထားသော commit တွင် Browser Connect အကောင်အထည်ဖော်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [ပိတ်ထားသော commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js) တွင် Browser Connect စမ်းသပ်မှုများ
- [Rust app frame နမူနာကို pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs) တွင်
- [Rust ချိတ်ဆက်ထားသော commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs) မှာ wallet frame နမူနာ
- [ပိတ်ထားခြင်း Torii OpenAPI အစီအစဉ်](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus ဝန်ဆောင်မှုများ](/my/blockchain/sora-nexus-services.md)
- [ငွေကြေးအထောက်အပံ့များ ](./fungible-assets.md)
- [ငွေပေးချေမှုများကို တင်ပြခြင်း၊ စစ်ဆေးခြင်း](./submit-and-verify-transactions.md)
