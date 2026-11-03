---
translation_locale: ar
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# محفظة الاتصال: الموافقة على نقل الأصول {#wallet-connect-approve-an-asset-transfer}

## نتيجة {#outcome}

قم بإنشاء جلسة Iroha Connect في متصفح، واحصل على الموافقة التشفيرية لهوية محفظة واحدة I105، واطلب من تلك المحفظة توقيع حمولة نقل الأصول غير الموقعة الدقيقة الخاصة بـ Torii، وقدّم التوقيع المنفصل، وانتظر الوصول إلى نهائية Applied.

## المتطلبات الأساسية {#prerequisites}

- تطبيق متصفح يستخدم `@iroha/iroha-js` و HTTPS.
- محفظة تنفذ Iroha Connect الإصدار 1، وتتحكم في حساب I105 بمفتاح Ed25519 واحد، وتمنح الطريقتين `sign_transaction` و`sign_raw`.
- معرّف شبكة Taira الحالي، ومفتاح المحفظة العمومي Ed25519 المسجل بالحروف الصغيرة بصيغة هيكس، وأصل قابل للنقل مملوك، ووجهة واحدة طبقًا لمعيار البروتوكول I105.
- معرّف أصل الرسوم الذي تنشره سياسة خدمة تمويل الشبكة التجريبية الحالية في Taira. يتحقق المثال من تقدير سعر الرسوم المباشر مقابل هذا المعرّف؛ فهو لا يضمّن أبدًا معرّف أصل منسوخ.
- يجب تمكين Connect على Torii المحدد. اقرأ معرّف الشبكة من قدرات الحساب العامة قبل عرض QR أو الرابط العميق:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

لا ينشر Torii أي حالة Connect مجهولة الهوية: يُبلغ `GET /v1/connect/status` عن جلسة واحدة لحامل رمز الإدارة الخاص بها، وتتطلب الحالة الإجمالية توقيع المشغّل. عندما تعطّل عقدةٌ Connect، يفشل `registerConnectSession` مع HTTP `503` والرمز `connect_disabled` (`404` عندما يُسقط البناء Connect)، ولا يعرض المثال رمز QR أو رابطًا عميقًا؛ استخدم شبكة محلية مُولَّدة مع تمكين Connect. كما أن نقل الأصول العادي يتطلب أيضًا أن تمتلك المحفظة كمية قابلة للنقل ورصيد رسوم كافيين.

## خطوات {#steps}

### 1. قدم وحدة تحكم إطلاق محفظة واحدة {#_1-provide-one-wallet-launch-control}

يتوقع JavaScript أدناه هذا العنصر في صفحة التطبيق:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

اعرض نفس URI كرمز QR لمحفظة على جهاز آخر. يحتوي URI على رمز الترحيل الخاص بالمحفظة، لذا لا تضعه في التحليلات أو السجلات أو المُحيلين أو تقارير الأعطال.

### ٢. إنشاء، الموافقة، التوقيع، والتقديم {#_2-create-approve-sign-and-submit}

يقبل هذا الموديل في المتصفح القيم الملموسة من حالة تطبيقك. الأول `POST /v1/assets/transfer` يتجاوز حقول التوقيع ويعيد نية الرسوم المُسعَّرة وحمولة المعاملة غير الموقعة. الثاني يضيف فقط المفتاح العام للمحفظة والتوقيع المنفصل إلى نفس طلب النقل. يشترط Torii توقيع حساب قياسيًا على كلا الطلبين، لذا يجعل الموديل المحفظة توقّعهما عبر `createConnectCanonicalRequestAuth`.

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

احتفظ بـ `token_app` و`token_management` و`token_relay` في ذاكرة التطبيق. فقط إطلاق المحفظة URI/الرمز المميز يمر إلى المحفظة. يتم توقيع موافقة الاتصال بواسطة هوية الحساب؛ X25519 `walletPublicKey` في الموافقة هو مفتاح نقل مؤقت، وليس مفتاح توقيع Ed25519 الخاص بالحساب.

### 3. استخدم أنواع الإطارات Rust في تنفيذ المحفظة {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

يمكن لبروتوكول Rust تأمين التوقيع فقط بعد أن يقوم المحفظة بفك تشفير المعاملة المطلوبة، وعرض نيتها الدقيقة، وتطبيق السياسات، والتوقيع باستخدام مفتاح الحساب المعتمد. هذا المساعد يقبل هذا التوقيع الذي تم التحقق منه؛ ولا يقوم بتزوير واحد:

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

أمثلة المستودع `connect_app` و`connect_wallet` هي عروض توضيحية للبروتوكول: يطبع التطبيق URI المحفظة، بما في ذلك رمزه المميز، إلى المخرجات القياسية، وتأخذ المحفظة رموزها المميزة كوسيطات سطر أوامر وتوقّع البايتات المطلوبة دون فك ترميزها أو عرضها. استخدمها لدراسة الإطارات فقط، ولا تستخدمها أبدًا كتنفيذ لمحفظة Taira.

## تحقق {#verify}

احتفظ بالهاش التشفيري المُعاد وتأكد من حالة المرسل إليها بعد العملية من خلال نقطة نهاية الحاملين العموميين API:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

يتم التحقق بنجاح فقط عندما يلاحظ النادل JavaScript `Applied` لهاش التشفير للمعاملة المرسلة وتعكس الحافظة الوجهة النقل. قبول HTTP أو موافقة المحفظة بمفردها ليسا نهاية السجل في بلوكتشين.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- `503` مع الرمز `connect_disabled`، أو `404`، من `registerConnectSession` يعني أنه لا يمكن إنشاء جلسة ترحيل على تلك العقدة. انتقل إلى شبكة محلية مُفعَّل فيها Connect؛ ولا تلجأ بدلًا من ذلك إلى نقل رموز التطبيق أو الإدارة بنفسك.
- `USER_DENIED` هو قرار محفظة. احتفظ به كنتيجة لمستخدم نهائي بدلاً من فتح مطالبات الموافقة المتكررة.
- يجب أن يؤدي عدم تطابق الحساب المعتمد أو توقيع الموافقة غير الصالح إلى إغلاق الجلسة. لا تطلب أبدًا من المحفظة التوقيع بعد فشل ربط الهوية.
- `public_key_hex does not control authority` يعني أن بيانات التسجيل وهوية I105 المعتمدة غير متطابقة. لا يمكن استخدام مفتاح النقل المؤقت للمحفظة في هذا الحقل.
- عادةً ما يعني رفض التوقيع المنفصل أن حقلًا في الطلب أو تقدير سعر الرسوم المباشر قد تغيّر بين التحضير والإرسال. قم بإنشاء طلب جديد؛ لا تنقل التوقيع القديم أبدًا.
- إعادة تشغيل دقيقة لطلب موقع ومقبول بالفعل تعتبر متكافئة. استعلم عن تجزئة المعاملة المشفرة التي تم إرجاعها قبل اعتبار انتهاء المهلة سببًا للبدء من جديد.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [تنفيذ متصفح Connect عند إصدار الشيفرة المصدرية المثبت](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [تختبر متصفحات Connect عند نسخة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust مثال على إطار التطبيق في مراجعة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust مثال على إطار المحفظة في نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [المخطط المثبت Torii OpenAPI](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus الخدمات](/ar/blockchain/sora-nexus-services.md)
- [الأصول القابلة للاستبدال](./fungible-assets.md)
- [إرسال والتحقق من المعاملات](./submit-and-verify-transactions.md)
