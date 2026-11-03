---
translation_locale: ur
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Wallet Connect: اثاثہ جات کی منتقلی کو منظور کریں {#wallet-connect-approve-an-asset-transfer}

## نتیجہ {#outcome}

براؤزر میں Iroha کنیکٹ سیشن بنائیں، ایک I105 بٹوے کی شناخت کے لئے کریپٹوگرافک منظوری حاصل کریں، اس بٹوے سے درخواست کریں کہ وہ Torii کے عین غیر دستخط شدہ اثاثہ منتقلی پے لوڈ پر دستخط کرے، علیحدہ دستخط جمع کروائیں، اور Applied حتمیت کا انتظار کریں۔

## لازمی شرائط {#prerequisites}

- ایک براؤزر ایپلی کیشن جو `@iroha/iroha-js` اور HTTPS کا استعمال کرتی ہے۔
- ایک بٹوا جو Iroha کنیکٹ v1 کو نافذ کرتا ہو، ایک واحد کلید والے Ed25519 I105 اکاؤنٹ کو کنٹرول کرتا ہو، اور `sign_transaction` اور `sign_raw` طریقوں کی اجازت دیتا ہو۔
- موجودہ Taira نیٹ ورک ID، بٹوے کی اندراج شدہ چھوٹے حروف والی Ed25519 عوامی کلید hex، ایک ملکیتی قابل منتقلی اثاثہ، اور ایک کینونیکل I105 منزل۔
- موجودہ Taira فوسیٹ پالیسی کی طرف سے شائع کردہ فیس اثاثہ ID۔ مثال اس ID کے مقابلے میں براہ راست فیس کوٹیشن کی تصدیق کرتی ہے؛ اس میں کبھی بھی کوئی کاپی شدہ اثاثہ شناخت کنندہ شامل نہیں کیا جاتا۔
- منتخب کردہ Torii پر کنیکٹ فعال ہونا چاہئے۔ QR یا ڈیپ لنک دکھانے سے پہلے عوامی اکاؤنٹ صلاحیتوں سے نیٹ ورک ID پڑھیں:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii کوئی گمنام کنیکٹ حیثیت شائع نہیں کرتا: `GET /v1/connect/status` ایک سیشن کی حیثیت اس کے مینجمنٹ ٹوکن کو بتاتا ہے، اور مجموعی حیثیت کے لیے آپریٹر کا دستخط درکار ہوتا ہے۔ جب کوئی نوڈ کنیکٹ کو غیر فعال کرتا ہے تو `registerConnectSession` HTTP `503` اور کوڈ `connect_disabled` کے ساتھ ناکام ہو جاتا ہے (جب بلڈ میں کنیکٹ شامل نہ ہو تو `404`)، اور مثال کوئی QR کوڈ یا ڈیپ لنک نہیں دکھاتی؛ کنیکٹ فعال والا پیدا کردہ مقامی نیٹ ورک استعمال کریں۔ ایک عام اثاثہ کی منتقلی کے لئے بھی پرس کو کافی قابل منتقلی مقدار اور فیس بیلنس رکھنے کی ضرورت ہوتی ہے۔

## قدم {#steps}

### 1۔ ایک والیٹ لانچ کنٹرول فراہم کریں۔ {#_1-provide-one-wallet-launch-control}

مندرجہ ذیل JavaScript درخواست کے صفحے میں اس عنصر کی توقع کرتا ہے:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

کسی اور ڈیوائس پر والیٹ کے لئے QR کوڈ کے طور پر ایک ہی URI ریڈر کریں۔ URI میں بٹوے سے متعلق ریلے ٹوکن موجود ہے ، لہذا اسے تجزیات ، لاگس ، حوالہ جات یا خرابی کی رپورٹوں میں شامل نہ کریں.

### 2۔ تخلیق، منظوری، دستخط اور جمع کروائیں {#_2-create-approve-sign-and-submit}

یہ براؤزر ماڈیول آپ کی ایپلیکیشن اسٹیٹ سے ٹھوس اقدار کو قبول کرتا ہے۔ پہلا `POST /v1/assets/transfer` دستخطی فیلڈز کو چھوڑ دیتا ہے اور کوٹیشن شدہ فیس ارادہ اور غیر دستخط شدہ ٹرانزیکشن پے لوڈ واپس کرتا ہے۔ دوسرا صرف اسی منتقلی کی درخواست میں بٹوے کی عوامی کلید اور علیحدہ دستخط شامل کرتا ہے۔ Torii دونوں درخواستوں پر کینونیکل اکاؤنٹ دستخط کا تقاضا کرتا ہے، اس لیے ماڈیول بٹوے سے `createConnectCanonicalRequestAuth` کے ذریعے ان پر دستخط کرواتا ہے۔

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

مخزن کی `connect_app` اور `connect_wallet` مثالیں پروٹوکول کے مظاہرے ہیں: ایپ بٹوے کا URI، اس کے ٹوکن سمیت، معیاری آؤٹ پٹ پر پرنٹ کرتی ہے، اور بٹوا اپنے ٹوکن کمانڈ لائن آرگومنٹس کے طور پر لیتا ہے اور درخواست کردہ بائٹس کو ڈیکوڈ یا ظاہر کیے بغیر ان پر دستخط کرتا ہے۔ ان کا استعمال صرف فریموں کا مطالعہ کرنے کے لئے کریں، کبھی بھی Taira پرس کے نفاذ کے طور پر نہیں۔

## تصدیق کریں {#verify}

واپس کی گئی ہیش کو برقرار رکھیں اور پبلک ہولڈرز اینڈپوائنٹ کے ذریعہ منزل کی پوسٹ اسٹیٹ کی تصدیق کریں:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

توثیق صرف اس صورت میں کامیاب ہوتی ہے جب JavaScript ویٹ ہیلپر `Applied` کو پیش کردہ ٹرانزیکشن ہیش کے لئے دیکھتا ہے اور منزل کی ہولڈنگ منتقلی کی عکاسی کرتی ہے۔ HTTP قبولیت یا پرس کی منظوری اکیلے ہی لیجر فائنلٹی نہیں ہے۔

## خرابی کا سراغ لگانا {#troubleshooting}

- `registerConnectSession` سے کوڈ `connect_disabled` کے ساتھ `503`، یا `404`، کا مطلب ہے کہ اس نوڈ پر کوئی ریلے سیشن نہیں بنایا جا سکتا۔ ایک فعال لوکل نیٹ ورک پر سوئچ کریں؛ متبادل کے طور پر خود ایپ یا مینجمنٹ ٹوکن منتقل کرنے کا راستہ اختیار نہ کریں۔
- `USER_DENIED` ایک بٹوے کا فیصلہ ہے. اسے دوبارہ منظوری کے اشارے کھولنے کی بجائے ٹرمینل صارف کے نتائج کے طور پر محفوظ کریں.
- منظوری کے اکاؤنٹ سے عدم مطابقت یا غلط منظوری کی دستخط سیشن کو بند کرنا چاہئے۔ شناخت پابند کرنے میں ناکامی کے بعد کبھی بھی پرس سے دستخط کرنے کا مطالبہ نہ کریں۔
- `public_key_hex does not control authority` رجسٹریشن کے اعداد و شمار اور منظور شدہ I105 شناختی اختلافات سے مراد ہے۔ اس فیلڈ میں فوری پرس ٹرانسپورٹ کلید کا استعمال نہیں کیا جا سکتا۔
- مسترد شدہ علیحدہ دستخط کا عام طور پر مطلب ہے کہ تیاری اور جمع کرانے کے درمیان کوئی درخواست فیلڈ یا براہ راست فیس کوٹیشن بدل گئی۔ نئی درخواست بنائیں؛ کبھی بھی پرانا دستخط منتقل نہ کریں۔
- پہلے سے قبول شدہ signed request کا عین replay idempotent ہے۔ ٹائم آؤٹ کو دوبارہ شروع کرنے کی وجہ کے طور پر علاج کرنے سے پہلے اس کی واپسی کی ٹرانزیکشن ہیش کو استفسار کریں۔

## ماخذ اور متعلقہ دستاویزات {#source-and-related-docs}

- [پنڈ commit پر براؤزر کنیکٹ لاگو کرنا](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [براؤزر کنیکٹ ٹیسٹ پنڈ commit پر](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust ایپ فریم کی مثال پر پنڈ commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust pined commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs) پر پرس فریم کی مثال۔
- [پنڈ Torii OpenAPI اسکیم](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus خدمات](/ur/blockchain/sora-nexus-services.md)
- [فنگبل اثاثے](./fungible-assets.md)
- [ٹرانزیکشنز جمع کروانا اور ان کی تصدیق کرنا ](./submit-and-verify-transactions.md)
