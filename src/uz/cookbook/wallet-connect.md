---
translation_locale: uz
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Wallet Connect: aktiv o‘tkazishni tasdiqlash {#wallet-connect-approve-an-asset-transfer}

## Natija {#outcome}

Brauzerda Iroha Connect seansini yarating, I105 hamyon identifikatori uchun kriptografik tasdiq oling, o‘sha hamyondan Torii tayyorlagan aniq aktiv o‘tkazish karkasini imzolashni so‘rang, ajratilgan imzoni yuboring va `Applied` yakuniyligini kuting.

## Oldindan shartlar {#prerequisites}

- `@iroha/iroha-js` va HTTPS dan foydalanadigan brauzer ilovasi.
- Bitta kalitli Ed25519 I105 hisobini boshqaradigan va Iroha Connect v1 ni amalga oshiradigan hamyon.
- Joriy Taira zanjir identifikatori va zanjir farqlovchisi, hamyonning ro‘yxatdan o‘tgan kichik harfli Ed25519 ochiq kaliti hex ko‘rinishida, egalik qilinadigan o‘tkaziluvchi aktiv hamda kanonik I105 manzili.
- Joriy Taira krani javtargan to‘lov aktivi identifikatori. Misol jonli to‘lov narxini shu identifikator bilan tekshiradi; ko‘chirilgan aktiv identifikatorini hech qachon kiritmaydi.
- Tanlangan Torii’da Connect yoqilgan bo‘lishi kerak. QR kod yoki chuqur havolani ko‘rsatishdan oldin buni tekshiring:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Taira Connect o‘chirilganini xabar qilsa yoki `404`/`503` qaytarsa, Connect yoqilgan yaratilgan mahalliy tarmoqdan foydalaning. Oddiy aktiv o‘tkazishda ham hamyonda yetarli o‘tkaziluvchi miqdor va to‘lov qoldig‘i bo‘lishi kerak.

## Qadamlar {#steps}

### 1. Hamyonni ochish uchun bitta boshqaruv elementi berish {#_1-provide-one-wallet-launch-control}

Quyidagi JavaScript ushbu elementni ilova sahifasida kutmoqda:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Boshqa qurilmadagi hamyon uchun ayni URI ni QR kod sifatida ko‘rsating. URI hamyonga tegishli uzatish tokenini o‘z ichiga oladi, shuning uchun uni tahlil tizimlari, jurnallar, referrerlar yoki xato hisobotlariga kiritmang.

### 2. Yaratish, tasdiqlash, imzolash va yuborish {#_2-create-approve-sign-and-submit}

Bu brauzer moduli ilovangiz holatidan aniq qiymatlarni oladi. Birinchi `POST /v1/assets/transfer` imzo maydonlarini bermaydi va jonli to‘lov narxi bilan versiyalangan tranzaksiya karkasini qaytaradi. Ikkinchi so‘rov xuddi shu o‘tkazish so‘roviga faqat hamyonning ochiq kaliti va ajratilgan imzosini qo‘shadi.

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

`token_app`, `token_management` va `token_relay` ni ilova xotirasida saqlang. Hamyonni ochishda unga faqat URI/token o‘tadi. Connect tasdig‘i hisob identifikatori bilan imzolanadi; tasdiqdagi X25519 `walletPublicKey` vaqtinchalik transport kaliti bo‘lib, hisobning Ed25519 imzolash kaliti emas.

### 3. Hamyon amalga oshirishida Rust freym turlaridan foydalanish {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust protokol qatlami imzoni faqat hamyon so‘ralgan tranzaksiyani dekodlagach, uning aniq maqsadini ko‘rsatgach, siyosatni qo‘llagach va tasdiqlangan hisob kaliti bilan imzolagach muhrlashi mumkin. Bu yordamchi tekshirilgan imzoni oladi; uni o‘zi yaratmaydi:

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

Repozitoriydagi `connect_app` va `connect_wallet` misollari protokol sinov artefaktlaridir: ular deterministik transport kalitlaridan foydalanadi, tokenlarni chiqishda oshkor qiladi va hamyon sinov namunasi soxta imzo qaytaradi. Ulardan faqat freymlarni o‘rganish uchun foydalaning, hech qachon Taira hamyonini amalga oshirish sifatida ishlatmang.

## Tekshirish {#verify}

Qaytarilgan tranzaksiya xeshini saqlang va manzilning amaldan keyingi holatini ochiq egalar API yakuniy nuqtasi orqali tasdiqlang:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

Tekshiruv faqat JavaScript kutuvchisi yuborilgan tranzaksiya xeshi uchun `Applied` ni va manzil hisobidagi o‘zgarishni kuzatganda muvaffaqiyatli bo‘ladi. HTTP orqali qabul qilinish yoki hamyon tasdig‘ining o‘zi reyestr yakuniyligini anglatmaydi.

## Muammolarni bartaraf etish {#troubleshooting}

- Connect holatidagi `404`, `503` yoki `enabled: false` shu tugunda uzatish seansini yaratib bo‘lmasligini anglatadi. Connect yoqilgan mahalliy tarmoqqa o‘ting; transport, ilova yoki boshqaruv tokenlarini o‘zingiz o‘ylab topmang.
- `USER_DENIED` bu hamyon qaroridir. Uni takroriy tasdiqlash oynalarini ochish o‘rniga terminal foydalanuvchisi natijasi sifatida saqlang.
- Tasdiq va hisob mos kelmasa yoki tasdiq imzosi yaroqsiz bo‘lsa, seans yopilishi kerak. Shaxsni bog‘lash muvaffaqiyatsiz tugagach hamyondan hech qachon imzo so‘ramang.
- `public_key_hex does not control authority` ro‘yxatga olish ma’lumotlari bilan tasdiqlangan I105 identifikatori mos emasligini anglatadi. Bu maydonda vaqtinchalik hamyon transport kalitini ishlatib bo‘lmaydi.
- Imzo yoki karkas rad etilishi odatda so‘rov maydoni yoxud jonli to‘lov narxi tayyorlash bilan yuborish orasida o‘zgarganini bildiradi. Yangi so‘rov tuzing; eski imzoni hech qachon ko‘chirmang.
- Oldin qabul qilingan imzolangan so‘rovning aynan takrorlanishi idempotentdir. Taymautni qayta boshlash sababi deb qabul qilishdan oldin qaytarilgan tranzaksiya xeshini so‘rang.

## Manba va tegishli hujjatlar {#source-and-related-docs}

- [Mahkamlangan commitdagi Browser Connect amalga oshirishi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [Mahkamlangan commitdagi Browser Connect sinovlari](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Mahkamlangan commitdagi Rust ilova freymi namunasi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Mahkamlangan commitdagi Rust hamyon freymi namunasi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Mahkamlangan Torii OpenAPI sxemasi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus xizmatlari](/uz/blockchain/sora-nexus-services.md)
- [Almashtiriladigan aktivlar](./fungible-assets.md)
- [Tranzaksiyalarni yuborish va tasdiqlash](./submit-and-verify-transactions.md)
