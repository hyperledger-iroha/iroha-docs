---
translation_locale: he
translation_source: /cookbook/wallet-connect.md
translation_source_hash: ab5b6c560ed8b0a208666e5854306ba6adce7af1210fc3c94b9c560d8e6eb686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Wallet Connect: אישור העברה של נכסים {#wallet-connect-approve-an-asset-transfer}

## התוצאה {#outcome}

ליצור פגישה Iroha Connect בדפדפן, לקבל אישור קריפטוגרפי עבור זהות ארנק אחת I105, לבקש מהארנק הזה לחתום על הסדרון המדויק של העברה של נכסים Torii, להגיש את החתימה המפרדת ולחכות לסיום יישום.

## תנאים מוקדמים {#prerequisites}

- יישום דפדפן באמצעות `@iroha/iroha-js` ו- HTTPS.
- ארנק שמפעיל Iroha Connect v1 ופיקוח על חשבון Ed25519 I105 בעל מפתח אחד.
- שרשרת Taira הנוכחית ID ומבחן שרשרת, ארנק הארנק רשום בתווים קטנים Ed25519 שמן מפתח ציבורי, נכס מוחלף בבעלותו, וביעד קנוני I105.
- נכס העלות ID הוחזר על ידי תגובת המברר הנוכחית Taira. הדוגמה מאשרת את ציטוט העלות חי נגד זה ID; הוא אף פעם לא מכיל מזהד נכס נכתב.
- קישור חייב להיות פעיל על Torii הנבחר. בדוק לפני הצגת קישור QR או קישור עמוק:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

אם Taira מדווח ש"Connect disabled" או מחזיר `404`/`503`, השתמשו ברשת מקומית שנוצרה עם "Connect" פעילה. העברת נכסים רגילה דורשת גם כי הארנק יהיה בעל כמות ניתנת להעברה מספקת והשלם של סכום.

## צעדים {#steps}

### 1. לספק שליטה אחת לשיגור הארנק {#_1-provide-one-wallet-launch-control}

JavaScript בהמשך מצפה לרכיב הזה בדף הבקשה:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

הוצא את אותו URI כמו קוד QR עבור ארנק במכשיר אחר. URI מחזיק בטוקן המשקף של הארנק, ולכן אל תשים אותו באנליטיקה, בלגים, מועברים או דו"חות תאונות.

### 2. ליצור, לאשר, לחתום ולהגיש {#_2-create-approve-sign-and-submit}

מודול הדפדפן הזה מקבל ערכים קונקרטיים מהמדינה של היישום שלך. הראשון `POST /v1/assets/transfer` מבטל את שדות החתימה ומחזיר מסדרת עסקאות מצטט, גרסה. השני מוסיף רק את המפתח הציבורי של הארנק ואת חתימת פרטית לאותו בקשה להעברה.

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

שמרו `token_app`, `token_management`, ו `token_relay` זיכרון יישום. רק ההשקה של הארנק URI אישור Connect חתום על ידי זהות החשבון; X25519 `walletPublicKey` האישור מכיל מפתח תחבורה זמני, לא מפתח החתימה של החשבון Ed25519.

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

דוגמאות של המחסן `connect_app` ו `connect_wallet` הן תקיני פרוטוקול: הם משתמשים במפתחות תחבורה דטרמיסטיות, חושפים סימנים בהוצאת, ותקן הארנק חוזר על חתימה מטופשת. השתמש בהם רק כדי ללמוד מסגרת, אף פעם לא כיישום ארנק Taira.

## לאמת {#verify}

שמרו על ה-hash שהחזרו ותוכיחו את מצב המוקדמת של היעד באמצעות נקודת הסיום של בעלי הציבור:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

אימות מוצלח רק כאשר JavaScript המלצר צופה. `Applied` עבור ה-hash של העסקה שהוגשה והחזקת היעד משקפת את ההעברות. HTTP קבלה או אישור ארנק בלבד אינם סופיים של ספרים.

## פתרון בעיות {#troubleshooting}

- `404`, `503`, או `enabled: false` ממצב Connect אומר כי לא ניתן ליצור פגישה רלוונטית על הערך הזה. לעבור לרשת מקומית פעילה; אל תחזרו לתחבורה של אפליקציות או סימני ניהול בעצמכם.
- `USER_DENIED` הוא החלטה של הארנק. שמרו אותו כתוצאה של משתמש סגור במקום לפתוח בקשות אישור חוזרות ונשנות.
- אי התאמה בין חשבון ההסכמה או חתימת אישור לא חוקית חייבת לסגור את הפגישה. לעולם אל תבקשו מהמטבע לחתום לאחר שחיבור זהות נכשל.
- `public_key_hex does not control authority` פירושו נתוני ההרשמה והסכמה בין זהות I105 המאושרת. המפתח לזמן קצר לתחבורה של הארנק לא ניתן להשתמש בשדה זה.
- סירוב חתימה או מסדרון פירושו בדרך כלל שדה בקשה או ציטוט תשלום חי שנשנה בין הכנת ושלוח. תבנה בקשה חדשה; לעולם אל תשליחי את החתימה הישנה.
- שיחזור מדויק של בקשה חתומה שכבר קיבלה הוא idempotent. שאל את ה- hash העסקה חזרה לפני מתייחסים זמן כמו סיבה להתחיל מחדש.

## מקור ומסמכים קשורים {#source-and-related-docs}

- [יישום Browser Connect ב-pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/src/connect.browser.js)
- [בדיקות מחברת הדפדפן בקביט ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust דוגמא של מסגרת אפליקציה ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust דוגמה של מסגרת הארנק ב-Pinned commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [תבנית Torii OpenAPI](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/artifacts/openapi/torii.json)
- [SORA Nexus שירותים](/he/blockchain/sora-nexus-services.md)
- [נכסים פונגביים](./fungible-assets.md)
- [הגשת והבחינה של עסקאות ](./submit-and-verify-transactions.md)
