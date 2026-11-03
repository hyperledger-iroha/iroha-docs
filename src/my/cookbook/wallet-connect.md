---
translation_locale: my
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Wallet Connect: အရင်းအမြစ်လွှဲပြောင်းမှုကို ခွင့်ပြုပါ {#wallet-connect-approve-an-asset-transfer}

## ရလဒ် {#outcome}

browser တစ်ခုတွင် Iroha Connect session တစ်ခုကို ဖန်တီးပါ၊ I105 wallet အထောက်အထားတစ်ခုအတွက် cryptographic အတည်ပြုချက်ကို ရယူပါ၊ ထို wallet အား Torii ၏ လက်မှတ်မထိုးရသေးသော တိကျသည့် asset-transfer payload ကို လက်မှတ်ထိုးရန် တောင်းဆိုပါ၊ သီးခြားခွဲထားသော လက်မှတ်ကို တင်သွင်းပြီး Applied finality ကို စောင့်ပါ။

## လိုအပ်ချက်များ {#prerequisites}

- `@iroha/iroha-js` နှင့် HTTPS ကို အသုံးပြုသော ရှာဖွေရေးစနစ်။
- Iroha Connect v1 ကို အကောင်အထည်ဖော်ထားပြီး သော့တစ်ခုတည်းသုံး Ed25519 I105 အကောင့်တစ်ခုကို ထိန်းချုပ်ကာ `sign_transaction` နှင့် `sign_raw` method များကို ခွင့်ပြုပေးသော wallet တစ်ခု။
- လက်ရှိ Taira network ID၊ wallet ၏ စာရင်းသွင်းထားသော စာလုံးအသေးဖြင့်ရေးထားသည့် Ed25519 အများသုံးသော့ hex၊ ပိုင်ဆိုင်ထားသော လွှဲပြောင်းနိုင်သည့် အရင်းအမြစ်တစ်ခုနှင့် canonical I105 ဦးတည်ရာ။
- လက်ရှိ Taira faucet မူဝါဒက ထုတ်ပြန်ထားသော အခွန်အရင်းအမြစ် ID။ ဥပမာသည် live အခွန်စျေးနှုန်းခန့်မှန်းချက်ကို ထို ID နှင့် တိုက်ဆိုင်စစ်ဆေးသည်။ ၎င်းသည် ကူးယူထားသော အရင်းအမြစ် identifier ကို ဘယ်သောအခါမျှ ထည့်သွင်းမထားပါ။
- ရွေးချယ်ထားသော Torii တွင် Connect ကို ဖွင့်ထားရမည်။ QR သို့မဟုတ် deep link ကို မပြသမီ အများသုံး account capabilities မှ network ID ကို ဖတ်ပါ:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii သည် အမည်မသိသူများအတွက် Connect status ကို ထုတ်ပြန်မထားပါ- `GET /v1/connect/status` သည် session တစ်ခု၏ status ကို ၎င်း၏ management token ကိုင်ဆောင်သူထံသာ အစီရင်ခံပြီး စုစုပေါင်း status အတွက် operator လက်မှတ် လိုအပ်သည်။ node တစ်ခုက Connect ကို ပိတ်ထားသောအခါ `registerConnectSession` သည် HTTP `503` နှင့် ကုဒ် `connect_disabled` ဖြင့် မအောင်မြင်ဘဲ (build တွင် Connect မပါဝင်ပါက `404`)၊ ဥပမာသည် QR ကုဒ် သို့မဟုတ် deep link ကို မပြသပါ။ Connect ကို ဖွင့်ထားသော ဖန်တီးထားသည့် ဒေသတွင်းကွန်ရက်တစ်ခုကို အသုံးပြုပါ။ သာမန် အရင်းအမြစ်လွှဲပြောင်းမှုတစ်ခုအတွက်လည်း wallet တွင် လွှဲပြောင်းနိုင်သော ပမာဏနှင့် အခွန်လက်ကျန် လုံလောက်စွာ ရှိရန် လိုအပ်သည်။

## ခြေလှမ်း {#steps}

### (၁) Wallet launch control တစ်ခုကို ပေးပါ။ {#_1-provide-one-wallet-launch-control}

အောက်ပါ JavaScript သည် လျှောက်လွှာစာမျက်နှာတွင် ဤအချက်ကို မျှော်မှန်းသည်-

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

QR ကို အခြားကိရိယာတစ်ခုပေါ်က ငွေကြေးအိတ်အတွက် ထပ်တူသော URI ကုဒ်ကို ပေးပါ။ URI သည် ငွေကြေးစကင်လုပ်ထားသည့် Relay Token ကို ထိန်းထားသည်၊ ထို့ကြောင့် Analytics, logs, referrers သို့မဟုတ် crash အစီရင်ခံစာများတွင်မထည့်ပါနဲ့။

### (၂) ဖန်တီးခြင်း၊ အတည်ပြုခြင်း၊ လက်မှတ်ရေးထိုးခြင်းနှင့် တင်ပြခြင်း၊ {#_2-create-approve-sign-and-submit}

ဤ browser module သည် သင့် application state မှ တိကျသော တန်ဖိုးများကို လက်ခံသည်။ ပထမ `POST /v1/assets/transfer` သည် လက်မှတ်ထိုးခြင်းဆိုင်ရာ field များကို ချန်လှပ်ထားပြီး ခန့်မှန်းတွက်ချက်ထားသော အခွန် intent နှင့် လက်မှတ်မထိုးရသေးသော transaction payload ကို ပြန်ပေးသည်။ ဒုတိယ request သည် တူညီသော transfer request ထဲသို့ wallet ၏ အများသုံးသော့နှင့် သီးခြားခွဲထားသော လက်မှတ်ကိုသာ ထည့်သွင်းသည်။ Torii သည် request နှစ်ခုစလုံးတွင် canonical အကောင့်လက်မှတ် လိုအပ်သောကြောင့် module သည် wallet အား `createConnectCanonicalRequestAuth` မှတစ်ဆင့် ၎င်းတို့ကို လက်မှတ်ထိုးစေသည်။

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

repository ၏ `connect_app` နှင့် `connect_wallet` ဥပမာများသည် protocol သရုပ်ပြချက်များ ဖြစ်သည်- app သည် wallet URI ကို ၎င်း၏ token အပါအဝင် standard output သို့ ထုတ်ပြပြီး wallet သည် ၎င်း၏ token များကို command-line argument များအဖြစ် ယူကာ တောင်းဆိုထားသော byte များကို decode မလုပ်ဘဲ၊ မပြသဘဲ လက်မှတ်ထိုးသည်။ ၎င်းတို့ကို frame များကို လေ့လာရန်အတွက်သာ အသုံးပြုပါ၊ Taira wallet implementation အဖြစ် ဘယ်သောအခါမျှ မသုံးပါနှင့်။

## စစ်ဆေးပါ {#verify}

ပြန်ပို့သော cryptographic hash ကိုထိန်းသိမ်းပြီး အများပြည်သူပိုင်ရှင်များ API အဆုံးမှတ်မှတစ်ဆင့် ရည်ရွယ်ချက်၏ post-state ကိုအတည်ပြုပါ။

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

စစ်ဆေးမှုက JavaScript စားပွဲထိုးက တင်သွင်းထားတဲ့ ငွေကြေးဆိုင်ရာ cryptographic hash အတွက် `Applied` ကို စောင့်ကြည့်ပြီး ရည်မှန်းချက် holding က လွှဲပြောင်းမှုကို ထင်ဟပ်တဲ့အခါသာ အောင်မြင်ပါတယ်။ HTTP လက်ခံခြင်း (သို့မဟုတ်) Wallet ခွင့်ပြုချက်တစ်ခုတည်းဟာ blockchain ledger ရဲ့ အဆုံးသတ်မှု မဟုတ်ဘူး။

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `registerConnectSession` မှ ကုဒ် `connect_disabled` ပါသော `503` သို့မဟုတ် `404` ဆိုသည်မှာ ထို node ပေါ်တွင် relay session ကို ဖန်တီး၍ မရနိုင်ကြောင်း ဆိုလိုသည်။ Connect ဖွင့်ထားသော localnet သို့ ပြောင်းပါ။ app သို့မဟုတ် management token များကို သင်ကိုယ်တိုင် သယ်ဆောင်ပို့ဆောင်ခြင်းသို့ ပြန်မလှည့်ပါနှင့်။
- `USER_DENIED` ဟာ ငွေကြေးအစီအစဉ်ပါ။ ထပ်တလဲလဲ ခွင့်ပြုချက် အချက်ပြမှုတွေကို ဖွင့်မယ့်အစား terminal user ရလဒ်အဖြစ် ထိန်းသိမ်းပါ။
- ခွင့်ပြုချက်စာရင်းနဲ့ မလိုက်ဖက်မှု (သို့) လက်မှတ်လက်မှတ်အမှားက အစည်းအဝေးကို ပိတ်ပစ်ရပါမယ်။ လက္ခဏာ ချည်နှောင်မှု ကျရှုံးသွားပြီးနောက် ငွေကြေးဝယ်သူထံ လက်မှတ်ထိုးဖို့ ဘယ်တော့မှ မေတ္တာရပ်ခံပါ။
- `public_key_hex does not control authority` ဆိုသည်မှာ မှတ်ပုံတင် အချက်အလက်များနှင့် ခွင့်ပြုထားသော I105 ကိုယ်စားလှယ်လက္ခဏာ သဘောမတူခြင်း ဖြစ်သည်။
- သီးခြားခွဲထားသော လက်မှတ် ငြင်းပယ်ခံရခြင်းသည် များသောအားဖြင့် request field တစ်ခု သို့မဟုတ် live အခွန်စျေးနှုန်းခန့်မှန်းချက်သည် ပြင်ဆင်ခြင်းနှင့် တင်သွင်းခြင်းကြားတွင် ပြောင်းလဲသွားကြောင်း ဆိုလိုသည်။ request အသစ်တစ်ခုကို တည်ဆောက်ပါ။ လက်မှတ်အဟောင်းကို ဘယ်သောအခါမျှ ပြောင်းရွှေ့အသုံးမပြုပါနှင့်။
- လက်မှတ်ထိုးပြီးသား တောင်းဆိုချက်တစ်ခုရဲ့ တိကျတဲ့ ပြန်လည်ဖြည့်စွက်မှုက idempotent ပါ။ အချိန်ကာလကို အသစ်စဖို့ အကြောင်းပြချက်အဖြစ် မယူဆခင်ပြန်လာတဲ့ ငွေချေးမှုအတွက် cryptographic hash ကိုမေးပါ။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှုမှာ Browser Connect အကောင်အထည်ဖော်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [Browser Connect ကို ပိတ်ထားသော Source-code ပြင်ဆင်မှုတွင် စမ်းသပ်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust app frame နမူနာကို pinned source code revision ကို](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust ပိုက်ဆံအိတ်ဖောင်ဒေးရှင်း နမူနာမှာပိတ်ထားတဲ့ source code ပြန်လည်ဆန်းစစ်ခြင်း](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Pinned Torii OpenAPI အစီအစဉ်](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus ဝန်ဆောင်မှု](/my/blockchain/sora-nexus-services.md)
- [ငွေကြေးအထောက်အပံ့များ](./fungible-assets.md)
- [ငွေပေးချေမှုများကို တင်ပြခြင်း၊ စစ်ဆေးခြင်း](./submit-and-verify-transactions.md)
