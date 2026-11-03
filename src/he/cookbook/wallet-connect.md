---
translation_locale: he
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Wallet Connect: אישור העברה של נכסים {#wallet-connect-approve-an-asset-transfer}

## התוצאה {#outcome}

צרו סשן של Iroha Connect בדפדפן, קבלו אישור קריפטוגרפי עבור זהות ארנק I105 אחת, בקשו מהארנק הזה לחתום על מטען העברת הנכס הלא חתום המדויק של Torii, הגישו את החתימה המנותקת והמתינו לסופיות Applied.

## תנאים מוקדמים {#prerequisites}

- יישום דפדפן באמצעות `@iroha/iroha-js` ו- HTTPS.
- ארנק שמממש את Iroha Connect v1, שולט בחשבון I105 מסוג Ed25519 בעל מפתח יחיד, ומעניק את המתודות `sign_transaction` ו־`sign_raw`.
- מזהה הרשת הנוכחי של Taira, ייצוג ה־hex באותיות קטנות של המפתח הציבורי מסוג Ed25519 שהארנק רשם, נכס בבעלותו שניתן להעברה, ויעד I105 קנוני.
- ה־ID של נכס העמלה שמדיניות ה־faucet הנוכחית של Taira מפרסמת. הדוגמה מאמתת את הצעת העמלה החיה מול ה־ID הזה; היא לעולם אינה מטמיעה מזהה נכס שהועתק.
- יש להפעיל את Connect ב־Torii שנבחר. קראו את מזהה הרשת מיכולות החשבון הציבוריות לפני הצגת QR או קישור עמוק:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii אינו מפרסם סטטוס Connect אנונימי: `GET /v1/connect/status` מדווח על סשן אחד לאסימון הניהול שלו, והסטטוס המצרפי דורש חתימת מפעיל. כאשר צומת משבית את Connect, `registerConnectSession` נכשל עם HTTP `503` והקוד `connect_disabled` (`404` כאשר הבנייה אינה כוללת את Connect), והדוגמה אינה מציגה קוד QR או קישור עמוק; השתמשו ברשת מקומית שנוצרה עם Connect מופעל. העברת נכס רגילה דורשת גם שבארנק תהיה כמות מספקת הניתנת להעברה ויתרת עמלה מספקת.

## צעדים {#steps}

### 1. לספק שליטה אחת לשיגור הארנק {#_1-provide-one-wallet-launch-control}

JavaScript בהמשך מצפה לרכיב הזה בדף הבקשה:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

הציגו את אותו URI כקוד QR עבור ארנק במכשיר אחר. ה־URI מכיל אסימון ממסר המוגבל לארנק, ולכן אל תכתבו אותו בנתוני ניתוח, ביומנים, בכותרות מפנה או בדוחות קריסה.

### 2. ליצור, לאשר, לחתום ולהגיש {#_2-create-approve-sign-and-submit}

מודול דפדפן זה מקבל ערכים ממשיים ממצב היישום שלכם. הקריאה הראשונה אל `POST /v1/assets/transfer` משמיטה את שדות החתימה ומחזירה את כוונת העמלה המתומחרת ואת מטען העסקה הלא חתום. הקריאה השנייה מוסיפה לאותה בקשת העברה רק את המפתח הציבורי של הארנק ואת החתימה המנותקת. Torii דורש חתימת חשבון קנונית על שתי הבקשות, ולכן המודול מבקש מהארנק לחתום עליהן באמצעות `createConnectCanonicalRequestAuth`.

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

שמרו את `token_app`, `token_management` ו-`token_relay` בזיכרון האפליקציה. רק URI/token ההפעלה שבתחום הארנק עובר לארנק. אישור Connect נחתם בידי זהות החשבון; ה-`walletPublicKey` מסוג X25519 שבאישור הוא מפתח תעבורה זמני, לא מפתח החתימה Ed25519 של החשבון.

### 3. השתמש בסוגים של מסגרת Rust בפעילות הארנק. {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

פני ה- Rust פרוטוקול יכול לחותם חתימה רק לאחר הארנק פיתח את העסקה הנדרשת, הראה את כוונתו המדויקת, מדיניות יישום, וחתום עם מפתח החשבון המאושר. עוזר זה מקבל את החתימה המאושרת; הוא לא יוצר אחת:

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

הדוגמאות `connect_app` ו־`connect_wallet` שבמאגר הן הדגמות של הפרוטוקול: האפליקציה מדפיסה לפלט הסטנדרטי את ה־URI של הארנק, כולל האסימון שלו, והארנק מקבל את האסימונים שלו כארגומנטים בשורת הפקודה וחותם על הבתים המבוקשים בלי לפענח או להציג אותם. השתמשו בהן רק ללימוד מסגרות, ולעולם לא כמימוש של ארנק Taira.

## לאמת {#verify}

שמרו על ה-hash שהחזרו ותוכיחו את מצב המוקדמת של היעד באמצעות נקודת הסיום של בעלי הציבור:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

האימות מצליח רק כאשר עזר ההמתנה של JavaScript מבחין ב־`Applied` עבור גיבוב העסקה שהוגשה, והיתרה ביעד משקפת את ההעברה. קבלת HTTP או אישור הארנק לבדם אינם סופיות בספר החשבונות.

## פתרון בעיות {#troubleshooting}

- `503` עם הקוד `connect_disabled`, או `404`, מ־`registerConnectSession` פירושו שלא ניתן ליצור סשן ממסר בצומת הזה. עברו ל־localnet שבו Connect מופעל; אל תפנו כחלופה להעברה עצמית של אסימוני האפליקציה או הניהול.
- `USER_DENIED` הוא החלטה של הארנק. שמרו אותו כתוצאה של משתמש סגור במקום לפתוח בקשות אישור חוזרות ונשנות.
- אי התאמה בין חשבון ההסכמה או חתימת אישור לא חוקית חייבת לסגור את הפגישה. לעולם אל תבקשו מהמטבע לחתום לאחר שחיבור זהות נכשל.
- `public_key_hex does not control authority` פירושו נתוני ההרשמה והסכמה בין זהות I105 המאושרת. המפתח לזמן קצר לתחבורה של הארנק לא ניתן להשתמש בשדה זה.
- חתימה מנותקת שנדחתה פירושה בדרך כלל ששדה בבקשה או הצעת העמלה החיה השתנו בין ההכנה להגשה. בנו בקשה חדשה; לעולם אל תשתילו את החתימה הישנה.
- replay מדויק של בקשה חתומה שכבר התקבלה הוא idempotent. בצעו שאילתה על hash העסקה שהוחזר לפני שתתייחסו לפסק זמן כסיבה להתחיל מחדש.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [יישום Browser Connect ב-pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [בדיקות מחברת הדפדפן בקביט ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust דוגמא של מסגרת אפליקציה ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust דוגמה של מסגרת הארנק ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [תבנית Torii OpenAPI](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus שירותים](/he/blockchain/sora-nexus-services.md)
- [נכסים פונגביים](./fungible-assets.md)
- [הגשת והבחינה של עסקאות ](./submit-and-verify-transactions.md)
