---
translation_locale: ar
translation_source: /cookbook/wallet-connect.md
translation_source_hash: ab5b6c560ed8b0a208666e5854306ba6adce7af1210fc3c94b9c560d8e6eb686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# محفظة الاتصال: موافقة نقل الأصول {#wallet-connect-approve-an-asset-transfer}

## النتيجة {#outcome}

قم بإنشاء جلسة Iroha Connect في المتصفح ، والحصول على موافقة تشفيرية لتحديد هوية محفظة I105 واحدة ، وطلب من تلك المحفظة التوقيع على منصة نقل الأصول الدقيقة لـ Torii ، وإرسال توقيع منفصل ، وانتظار النهاية التطبيقية.

## الشروط المسبقة {#prerequisites}

- تطبيق متصفح يستخدم `@iroha/iroha-js` و HTTPS.
- محفظة تنفيذ Iroha Connect v1 وتتحكم في حساب Ed25519 I105 بمفتاح واحد.
- السلسلة الحالية Taira ID وتمييز سلسلة، ورقة محفظة مسجلة من الأحرف الصغيرة Ed25519 مفتاح عام، وأصول قابلة للتحويل مملوكة لها، ومركز طائفي I105.
- الأصول الرسومية ID التي أعادتها استجابة النوافذ الحالية Taira. يتحقق المثال من اقتباسات الرسوم الحية مقابل تلك ID؛ فإنه لا يضمن أبدًا معرف الأصول المنسخة.
- يجب تمكين الاتصال على Torii المحدد. تحقق قبل عرض QR أو وصلة عميقة:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

إذا أبلغ Taira عن تعطيل Connect أو أعاد `404`/`503` ، فاستخدم شبكة محلية تم إنشاؤها مع تمكين Connect. يحتاج نقل الأصول العادي أيضًا إلى امتلاك المحفظة كميات كافية للتحويل وميزانية الرسوم.

## الخطوات {#steps}

### 1. توفير جهاز التحكم في إطلاق محفظة واحدة {#_1-provide-one-wallet-launch-control}

JavaScript أدناه يتوقع هذا العنصر في صفحة الطلب:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

قم بإعطاء نفس URI كرمز QR للحفظة على جهاز آخر. تحتوي URI على رموز إرسال المحفظة ، لذلك لا تضعها في التحليلات أو السجلات أو الإحالات أو تقارير الحوادث .

### 2- إنشاء الموافقة على التوقيع وتقديمها {#_2-create-approve-sign-and-submit}

يتقبل هذا الوحدة المتصفحية قيمًا ملموسة من حالة تطبيقك. أول `POST /v1/assets/transfer` يغيب عن حقل التوقيع ويرجع إلى منصة المعاملات المذكورة ، والإصدار الثاني يضيف فقط مفتاح المحفظة العامة والتوقيع المنفصل لنفس طلب التحويل.

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

أبقيه `token_app`, `token_management`, و `token_relay` في ذاكرة التطبيقات فقط إطلاق المحفظة URI يتم عبور الـ /token إلى المحفظة. يتم توقيع موافقة Connect من خلال هوية الحساب؛ X25519 `walletPublicKey` في الموافقة مفتاح نقل مؤقت، وليس مفتاح التوقيع على الحساب Ed25519

### استخدام أنواع الإطار Rust في تنفيذ المحفظة {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

يمكن أن يختم سطح بروتوكول Rust توقيعًا فقط بعد أن قام المحفظة بتشفير المعاملة المطلوبة وعرضت نيته الدقيقة وسياستها التطبيقية وتوقيعها بمفتاح الحساب المعتمد. يقبل هذا المساعد ذلك التوقيع المصرح به ؛ فإنه لا يصنع أي:

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

أمثلة مخزن `connect_app` و `connect_wallet` هي أدوات البروتوكول: تستخدم مفاتيح النقل المحددة ، وتعرض الرموز في الخروج ، وتعيد أدوات المحفظة توقيعًا مزيفًا. استخدمها لدراسة الإطارات فقط ، أبداً كتنفيذ محفظة Taira.

## التحقق {#verify}

الحفاظ على الهاشة المعودة وتأكيد حالة ما بعد الوجهة من خلال نقطة النهاية العامة:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

النجاح في التحقق هو فقط عندما JavaScript النادل يلاحظ `Applied` لتحويل المعاملة المقدمة والاحتياطي الوارد يعكس التحويل. HTTP القبول أو الموافقة على المحفظة وحدها ليست نهائية في دفتر التسجيل.

## حل المشاكل {#troubleshooting}

- `404` ، `503` ، أو `enabled: false` من حالة Connect يعني أنه لا يمكن إنشاء جلسة إرسالية على تلك العقدة. الانتقال إلى شبكة محلية فعالة ؛ لا تعود إلى نقل تطبيقات أو رموز إدارة بنفسك.
- `USER_DENIED` هو قرار محفظة الحفاظ عليه كنتيجة للمستخدم النهائي بدلاً من فتح طلبات الموافقة المتكررة.
- يجب إغلاق الجلسة بعد عدم مطابقة حساب الموافقة أو توقيع موافقة غير صالح. لا تطلب من المحفظة التوقيع بعد فشل الالتزام بالهوية.
- `public_key_hex does not control authority` تعني بيانات التسجيل وخلاف الهوية المعتمدة I105. لا يمكن استخدام مفتاح نقل محفظة مؤقتة في هذا المجال.
- رفض التوقيع أو الرفع عادة ما يعني حقل طلب أو اقتباس رسوم مباشر يتم تغييره بين الإعداد والإرسال. قم ببناء طلب جديد؛ لا زرع أبداً التوقيع القديم.
- إن إعادة عرض دقيقة لطلب وقّع قبوله بالفعل غير قادرة. استبيان هاشة المعاملة المرجعة قبل التعامل مع وقف الوقت كسبب للبدء من جديد.

## المصدر والوثائق ذات الصلة {#source-and-related-docs}

- [تنفيذ متصفح Connect في المشاركة المحمولة ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/src/connect.browser.js)
- [اختبارات متصفح الاتصال في الالتزام المثبت ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust مثال على إطار التطبيق في الإجراءات المثبتة](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust مثال على إطار محفظة في الإجراءات المثبتة](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [المضخة Torii OpenAPI المخطط](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/artifacts/openapi/torii.json)
- [SORA Nexus خدمات ](/ar/blockchain/sora-nexus-services.md)
- [الأصول المثقلة ](./fungible-assets.md)
- [تقديم وتحقق من المعاملات ](./submit-and-verify-transactions.md)
