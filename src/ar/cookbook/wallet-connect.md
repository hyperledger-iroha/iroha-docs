---
translation_locale: ar
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# محفظة الاتصال: الموافقة على نقل الأصول {#wallet-connect-approve-an-asset-transfer}

## نتيجة {#outcome}

قم بإنشاء جلسة Connect Iroha في متصفح، واحصل على الموافقة التشفيرية لهوية محفظة واحدة I105، واطلب من تلك المحفظة توقيع الهيكل الابتدائي المحدد لنقل الأصول الخاص بـ Torii، قدّم التوقيع المفصول، وانتظر الحل النهائي المطبق.

## المتطلبات الأساسية {#prerequisites}

- تطبيق متصفح يستخدم `@iroha/iroha-js` و HTTPS.
- محفظة تنفذ Iroha Connect الإصدار 1 وتتحكم في حساب I105 بمفتاح واحد Ed25519.
- معرّف السلسلة الحالي Taira والتمييز الخاص بالسلسلة، ومفتاح المحفظة العمومي Ed25519 المسجل بالحروف الصغيرة بصيغة هيكس، وأصل قابل للنقل مملوك، ووجهة واحدة طبقًا لمعيار البروتوكول I105.
- معرّف أصل الرسوم الذي تم إرجاعه بواسطة استجابة خدمة تمويل شبكة الاختبار الحالية Taira. يتحقق المثال من تقدير سعر الرسوم المباشر مقابل هذا المعرّف؛ فهو لا يضمّن أبدًا معرّف أصل منسوخ.
- يجب تمكين الاتصال على Torii المحدد. تحقق قبل عرض QR أو الرابط العميق:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

إذا أبلغ Taira أن الاتصال معطّل أو أعاد `404`/`503`، استخدم شبكة محلية تم إنشاؤها مع تمكين الاتصال. كما أن نقل الأصول العادي يتطلب أيضًا أن يمتلك المحفظة كمية قابلة للنقل ورصيد رسوم كافٍ.

## خطوات {#steps}

### 1. قدم وحدة تحكم إطلاق محفظة واحدة {#_1-provide-one-wallet-launch-control}

يتوقع JavaScript أدناه هذا العنصر في صفحة التطبيق:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

اعرض نفس URI كرمز QR لمحفظة على جهاز آخر. يحتوي URI على رمز الترحيل الخاص بالمحفظة، لذا لا تضعه في التحليلات أو السجلات أو المُحيلين أو تقارير الأعطال.

### ٢. إنشاء، الموافقة، التوقيع، والتقديم {#_2-create-approve-sign-and-submit}

يقبل هذا الموديل في المتصفح القيم الملموسة من حالة تطبيقك. الأول `POST /v1/assets/transfer` يتجاوز حقول التوقيع ويعيد بنية بدء المعاملة ذات الإصدار مع تقدير سعر الرسوم. الثاني يضيف فقط المفتاح العام للمحفظة والتوقيع المنفصل إلى نفس طلب النقل.

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

أمثلة المستودع `connect_app` و`connect_wallet` هي عناصر اختبار البروتوكول: تستخدم مفاتيح نقل حتمية، تكشف الرموز في المخرجات، وعنصر اختبار المحفظة يرجع توقيعًا تجريبيًا. استخدمها لدراسة الإطارات فقط، ولا تستخدمها أبدًا كتنفيذ لمحفظة Taira.

## تحقق {#verify}

احتفظ بالهاش التشفيري المُعاد وتأكد من حالة المرسل إليها بعد العملية من خلال نقطة نهاية الحاملين العموميين API:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

يتم التحقق بنجاح فقط عندما يلاحظ النادل JavaScript `Applied` لهاش التشفير للمعاملة المرسلة وتعكس الحافظة الوجهة النقل. قبول HTTP أو موافقة المحفظة بمفردها ليسا نهاية السجل في بلوكتشين.

## استكشاف الأخطاء وإصلاحها {#troubleshooting}

- `404`، `503`، أو `enabled: false` من حالة الاتصال يعني أنه لا يمكن إنشاء جلسة تتابع على ذلك العقدة. قم بالتبديل إلى شبكة محلية ممكنة؛ لا تعود لنقل رموز التطبيق أو الإدارة بنفسك.
- `USER_DENIED` هو قرار محفظة. احتفظ به كنتيجة لمستخدم نهائي بدلاً من فتح مطالبات الموافقة المتكررة.
- يجب أن يؤدي عدم تطابق الحساب المعتمد أو توقيع الموافقة غير الصالح إلى إغلاق الجلسة. لا تطلب أبدًا من المحفظة التوقيع بعد فشل ربط الهوية.
- `public_key_hex does not control authority` يعني أن بيانات التسجيل وهوية I105 المعتمدة غير متطابقة. لا يمكن استخدام مفتاح النقل المؤقت للمحفظة في هذا الحقل.
- عادةً ما يعني رفض التوقيع أو هيكل البداية الناتج أن حقل الطلب أو تقدير سعر الرسوم المباشر تغير بين التحضير والإرسال. قم بإنشاء طلب جديد؛ لا تنقل التوقيع القديم أبدًا.
- إعادة تشغيل دقيقة لطلب موقع ومقبول بالفعل تعتبر متكافئة. استعلم عن تجزئة المعاملة المشفرة التي تم إرجاعها قبل اعتبار انتهاء المهلة سببًا للبدء من جديد.

## المصدر والمستندات ذات الصلة {#source-and-related-docs}

- [تنفيذ متصفح Connect عند إصدار الشيفرة المصدرية المثبت](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [تختبر متصفحات Connect عند نسخة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust مثال على إطار التطبيق في مراجعة الشيفرة المصدرية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust مثال على إطار المحفظة في نسخة التعليمات البرمجية المثبتة](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [المخطط المثبت Torii OpenAPI](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus الخدمات](/ar/blockchain/sora-nexus-services.md)
- [الأصول القابلة للاستبدال](./fungible-assets.md)
- [إرسال والتحقق من المعاملات](./submit-and-verify-transactions.md)
