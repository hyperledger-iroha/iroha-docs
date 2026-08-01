---
translation_locale: uz
translation_source: /cookbook/wallet-connect.md
translation_source_hash: ab5b6c560ed8b0a208666e5854306ba6adce7af1210fc3c94b9c560d8e6eb686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Wallet Connect: Assetlarni oʻtkazish uchun ruxsat berish {#wallet-connect-approve-an-asset-transfer}

## Natija {#outcome}

Brauzerda Iroha Connect seansini yaratish, bitta I105 hamyonasi uchun kriptografik ruxsat olish, ushbu hamyonani Torii ning to'g'ri aktivlarni o'tkazish asbob-uskunalarini imzolashni so'rash, ajratilgan imzoni taqdim etish va qo'llaniladigan yakunni kutish.

## Oldingi shartlar {#prerequisites}

- `@iroha/iroha-js` va HTTPS foydalangan brauzer ilovalari.
- Iroha Connect v1-ni amalga oshiradigan va bitta kalitli Ed25519 I105 hisobini nazorat qiladigan hamyoz.
- Joriy Taira zanjir ID va zanjirni farqlovchi, pulmonaning ro'yxatdan o'tgan kichik harfli Ed25519 ommaviy kalit hexasi, mulkdagi o'tkazilishi mumkin bo'lgan aktiv va kanonik I105 yo'nalishi.
- To'lov aktivini ID joriy Taira faucet javob bilan qaytaradi. Misol uchun, jonli to'lov narxini ushbu ID bilan taqqoslaydi; u hech qachon nusxa ko'chirilgan aktiv identifikatorini o'rnatmaydi.
- Tanlangan Torii da ulanish qo'llanilishi kerak. QR yoki chuqur bog'lamani ko'rsatishdan oldin tekshirib ko'ring:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Agar Taira Connect-ni o'chirib qo'ygan yoki `404`/`503`-ni qaytargan bo'lsa, Connect-ni qo'llab-quvvatlagan holda yaratilgan mahalliy tarmoqdan foydalaning. Oddiy aktivlarni o'tkazish ham pulpukaga etarlicha o'tkazilishi mumkin bo'lgan miqdor va to'lov balansini egalik qilish kerak.

## qadamlar {#steps}

### 1. Bir martalik portfelni ishga tushirish nazoratini taqdim etish {#_1-provide-one-wallet-launch-control}

Quyidagi JavaScript talabnoma sahifasida ushbu elementni kutadi:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Boshqa qurilmada pulka uchun QR kodidan o'xshash URI kodni bering. URI pulka ko'rsatilgan relay tokenini ushlab turadi, shuning uchun uni analitika, jurnallar, ma'lumotnomalar yoki crash hisobotlariga qo'ymang.

### 2. Yaratish, tasdiqlash, imzolash va taqdim etish {#_2-create-approve-sign-and-submit}

Ushbu brauzer moduli sizning dasturingiz holatidan aniq qiymatlarni qabul qiladi. Birinchi `POST /v1/assets/transfer` imzolash maydonlarini qoldiradi va ko'rsatilgan, versiyalangan tranzaksiya asbob-uskunalarini qaytarib beradi. Ikkinchisi faqat walletning ochiq kalitini va alohida imzosini bir xil o'tkazish so'roviga qo'shadi.

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

saqlab qoling `token_app`, `token_management`, va `token_relay` dastur xotirasida. Faqat pulka ishga tushirish URI/token portfeli bilan o'tadi. Connect-ning tasdiqlanishi hisob raqami kimligi bilan imzolangan; X25519 `walletPublicKey` to'lovda ko'p vaqtli transport kaliti mavjud, hisobning Ed25519 imzo kalitini emas.

### 3. Pulka implementatsiyasida Rust ramka turlaridan foydalaning {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust protokol yuzasida imzo faqat pulka so'ragan operatsiyani dekodlaganidan, aniq niyatini ko'rsatganidan, qo'llaniladigan siyosatni ko'rsatgandan va tasdiqlangan hisob kalit bilan imzolanganidan keyin muhrlanishi mumkin. Ushbu yordamchi ushbu tasdiqlangan imzonani qabul qiladi; u hech qandayni yaratmaydi:

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

Repozitoriyaning `connect_app` va `connect_wallet` namunalari protokol o'rnatishlaridan iborat: ular deterministik transport kalitlaridan foydalanadi, chiqishda belgini oshkor qiladilar va hamyofasiz imzo qaytaradi. ularni faqat ramkalarni o'rganish uchun ishlating, hech qachon Taira hamyofadan amalga oshirish sifatida ishlatmang.

## Tekshirish {#verify}

Qaytarib berilgan hashni saqlab qoling va destinatsiyaning keyingi holatini ommaviy egalarning oxirgi nuqtasi orqali tasdiqlang:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

Tekshirish faqat JavaScript xizmatkor kuzatadi `Applied` taqdim etilgan tranzaksiya uchun hash va yo'nalish xo'jaligi o'tkazilishni aks ettiradi. HTTP Faqatgina qabul qilish yoki qopqoqning ma'qullanishi katta qog'ozlarning yakuniyligi emas.

## Muammolarni hal qilish {#troubleshooting}

- `404`, `503` yoki `enabled: false` Connect holatidan bu nodda relay seanslari yaratilmasligi mumkinligini anglatadi. O'rnatilgan lokal tarmoqga o'ting; dasturni yoki boshqaruv tokenlarini o'zingiz transport qilishga qaytmang.
- `USER_DENIED` pulparastlik qaroridir. Uni qayta-qayta ruxsat berishdan ko'ra, terminal foydalanuvchisi natijasi sifatida saqlang.
- To'g'ri yo'ldan o'tmagan yoki haqiqiy bo'lmagan ruxsatnoma imzosi majlisni tugatishi kerak. Kimlik bog'lash muvaffaqiyatsizlikka uchraganidan so'ng pulparastdan imzolashni hech qachon so'ramang.
- `public_key_hex does not control authority` - ro'yxatdan o'tish ma'lumotlari va tasdiqlangan I105 kimlik kelishmovchiligi; bu sohada vaqtinchalik hamyon transport kalitidan foydalanish mumkin emas.
- Imzo yoki asfaltni rad etish odatda tayyorlanish va taqdim etish o'rtasida o'zgartirilgan so'rov maydoni yoki haqiqiy to'lov taklifini anglatadi. Yangi so'rovni yaratish; hech qachon eski imzani transplantatsiya qilmang.
- Oldindan qabul qilingan imzolangan so'rovning aniq takrorlanishi idempotent hisoblanadi. Vaqtni qayta boshlash uchun sabab sifatida ko'rib chiqishdan oldin qaytarib berilgan muomala hashini so'rang.

## Manba va u bilan bog'liq hujjatlar {#source-and-related-docs}

- [Browser Connect-ni o'rnatilgan commit-da amalga oshirish ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/src/connect.browser.js)
- [Browser Connect testlari pinlangan commitda](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust qo'llanma ramka namunasida pinning commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust bog'langan commit-dagi portfeli ramka namunasi](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Pinned Torii OpenAPI sxema](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/artifacts/openapi/torii.json)
- [SORA Nexus xizmatlari](/uz/blockchain/sora-nexus-services.md)
- [O'zgaruvchan aktivlar](./fungible-assets.md)
- [Transaksiyalarni taqdim etish va tekshirish ](./submit-and-verify-transactions.md)
