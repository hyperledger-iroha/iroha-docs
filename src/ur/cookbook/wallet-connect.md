---
translation_locale: ur
translation_source: /cookbook/wallet-connect.md
translation_source_hash: ab5b6c560ed8b0a208666e5854306ba6adce7af1210fc3c94b9c560d8e6eb686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Wallet Connect: اثاثہ جات کی منتقلی کو منظور کریں {#wallet-connect-approve-an-asset-transfer}

## نتیجہ {#outcome}

براؤزر میں Iroha کنیکٹ سیشن بنائیں ، ایک I105 بٹوے کی شناخت کے لئے کریپٹوگرافک منظوری حاصل کریں ، اس بٹوے سے درخواست کریں کہ وہ Torii کے عین مطابق اثاثہ جات کی منتقلی کی بنیاد پر دستخط کرے ، علیحدہ دستخط جمع کروائیں ، اور قابل اطلاق حتمی ہونے کا انتظار کریں۔

## لازمی شرائط {#prerequisites}

- ایک براؤزر ایپلی کیشن جو `@iroha/iroha-js` اور HTTPS کا استعمال کرتی ہے۔
- ایک بٹوے جو Iroha کنیکٹ v1 کو نافذ کرتا ہے اور ایک واحد کلید Ed25519 I105 اکاؤنٹ کو کنٹرول کرتا ہے۔
- موجودہ Taira چین ID اور سلسلہ امتیاز، بٹوے کے رجسٹرڈ چھوٹے حرف Ed25519 عوامی کلید hex، ایک ملکیت قابل منتقلی اثاثہ، اور کینیکل I105 منزل.
- فیس اثاثہ ID موجودہ Taira نل کے جواب کی طرف سے واپس کیا گیا ہے۔ مثال اس ID کے مقابلے میں براہ راست فیس کوٹیشن کی تصدیق کرتی ہے؛ یہ کبھی بھی ایک کاپی شدہ اثاثہ شناخت نہیں کرتا ہے.
- کنکشن کو منتخب کردہ Torii پر فعال کیا جانا چاہئے۔ ایک QR یا گہری لنک دکھانے سے پہلے چیک کریں:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

اگر Taira رپورٹ کرتا ہے کہ کنیکٹ غیر فعال ہے یا `404`/`503` واپس کرتا ہے تو ، کنیکٹ کے اہل ہونے والے مقامی نیٹ ورک کا استعمال کریں۔ ایک عام اثاثہ کی منتقلی کے لئے بھی پرس کو کافی قابل منتقلی مقدار اور فیس بیلنس رکھنے کی ضرورت ہوتی ہے۔

## قدم {#steps}

### 1۔ ایک والیٹ لانچ کنٹرول فراہم کریں۔ {#_1-provide-one-wallet-launch-control}

مندرجہ ذیل JavaScript درخواست کے صفحے میں اس عنصر کی توقع کرتا ہے:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

کسی اور ڈیوائس پر والیٹ کے لئے QR کوڈ کے طور پر ایک ہی URI ریڈر کریں۔ URI میں بٹوے سے متعلق ریلے ٹوکن موجود ہے ، لہذا اسے تجزیات ، لاگس ، حوالہ جات یا خرابی کی رپورٹوں میں شامل نہ کریں.

### 2۔ تخلیق، منظوری، دستخط اور جمع کروائیں {#_2-create-approve-sign-and-submit}

یہ براؤزر ماڈیول آپ کی ایپلیکیشن اسٹیٹ سے ٹھوس اقدار کو قبول کرتا ہے۔ پہلا `POST /v1/assets/transfer` دستخط کرنے والے فیلڈز کو چھوڑ دیتا ہے اور ایک قیمت درج کردہ ، ورژن شدہ ٹرانزیکشن اسٹافلڈ واپس کرتا ہے۔ دوسرا صرف اسی منتقلی کی درخواست میں بٹوے کی عوامی کلید اور علیحدہ دستخط شامل کرتا ہے۔

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

ایپلی کیشن میموری میں `token_app` ، `token_management`، اور `token_relay` رکھیں۔ صرف پرس لانچنگ URI / ٹوکن بٹوے سے عبور ہوتا ہے۔ کنیکٹ منظوری اکاؤنٹ کی شناخت کے ذریعہ دستخط کی جاتی ہے؛ منظوری میں X25519 `walletPublicKey` ایک عارضی ٹرانسپورٹ کلید ہے ، نہ کہ اکاؤنٹ کی Ed25519 دستخط کی کلید۔

### بٹوے پر عمل درآمد میں Rust فریم کی اقسام کا استعمال کریں {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust پروٹوکول کی سطح صرف اس وقت دستخط کو مہر لگا سکتی ہے جب پرس نے مطلوبہ لین دین کو ڈیکوڈ کیا ہو ، اس کا عین مقصد ظاہر کیا ہو ، پالیسی لاگو کی ہو اور منظور شدہ اکاؤنٹ کلید کے ساتھ دستخط کیے ہوں۔ یہ مددگار اس تصدیق شدہ دستخط کو قبول کرتا ہے۔ یہ ایک نہیں بناتا ہے:

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

مخزن کی `connect_app` اور `connect_wallet` کی مثالیں پروٹوکول فکسچر ہیں: وہ تعیناتی ٹرانسپورٹ چابیاں استعمال کرتے ہیں ، آؤٹ پٹ میں ٹوکن کو بے نقاب کرتے ہیں ، اور پرس فکسچر ایک ڈمی دستخط واپس کرتا ہے۔ ان کا استعمال صرف فریموں کا مطالعہ کرنے کے لئے کریں ، کبھی بھی بطور Taira پرس لاگو نہیں ہوتا۔

## تصدیق کریں {#verify}

واپس کی گئی ہیش کو برقرار رکھیں اور پبلک ہولڈرز اینڈپوائنٹ کے ذریعہ منزل کی پوسٹ اسٹیٹ کی تصدیق کریں:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

توثیق صرف اس صورت میں کامیاب ہوتی ہے جب JavaScript ویٹر `Applied` کو پیش کردہ ٹرانزیکشن ہیش کے لئے دیکھتا ہے اور منزل کی ہولڈنگ منتقلی کی عکاسی کرتی ہے۔ HTTP قبولیت یا پرس کی منظوری اکیلے ہی لیجر فائنلٹی نہیں ہے۔

## خرابی کا سراغ لگانا {#troubleshooting}

- `404` ، `503`، یا `enabled: false` کنیکٹ کی حیثیت سے اس نوڈ پر کوئی ریلے سیشن نہیں بنایا جاسکتا ہے۔ ایک فعال لوکل نیٹ ورک پر سوئچ کریں؛ خود ایپ یا مینجمنٹ ٹوکن منتقل کرنے میں واپس نہ آئیں۔
- `USER_DENIED` ایک بٹوے کا فیصلہ ہے. اسے دوبارہ منظوری کے اشارے کھولنے کی بجائے ٹرمینل صارف کے نتائج کے طور پر محفوظ کریں.
- منظوری کے اکاؤنٹ سے عدم مطابقت یا غلط منظوری کی دستخط سیشن کو بند کرنا چاہئے۔ شناخت پابند کرنے میں ناکامی کے بعد کبھی بھی پرس سے دستخط کرنے کا مطالبہ نہ کریں۔
- `public_key_hex does not control authority` رجسٹریشن کے اعداد و شمار اور منظور شدہ I105 شناختی اختلافات سے مراد ہے۔ اس فیلڈ میں فوری پرس ٹرانسپورٹ کلید کا استعمال نہیں کیا جا سکتا۔
- دستخط یا سکفولڈ رد عام طور پر ایک درخواست فیلڈ یا براہ راست فیس کی قیمت کو تیار کرنے اور جمع کرانے کے درمیان تبدیل کرتا ہے. نئی درخواست بنائیں؛ کبھی بھی پرانا دستخط منتقل نہ کریں.
- پہلے سے ہی قبول شدہ دستخط شدہ درخواست کی ایک عین مطابق نقل ناممکن ہے۔ ٹائم آؤٹ کو دوبارہ شروع کرنے کی وجہ کے طور پر علاج کرنے سے پہلے اس کی واپسی کی ٹرانزیکشن ہیش کو استفسار کریں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [پنڈ commit پر براؤزر کنیکٹ لاگو کرنا](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/src/connect.browser.js)
- [براؤزر کنیکٹ ٹیسٹ پنڈ commit پر](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust ایپ فریم کی مثال پر پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust pined commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_wallet.rs) پر پرس فریم کی مثال۔
- [پنڈ Torii OpenAPI اسکیم](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/artifacts/openapi/torii.json)
- [SORA Nexus خدمات](/ur/blockchain/sora-nexus-services.md)
- [فنگبل اثاثے](./fungible-assets.md)
- [ٹرانزیکشنز جمع کروانا اور ان کی تصدیق کرنا ](./submit-and-verify-transactions.md)
