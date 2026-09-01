---
translation_locale: mn
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Wallet Connect: Хөрөнгийн шилжүүлгийг зөвшөөрөх {#wallet-connect-approve-an-asset-transfer}

## Үр дүн {#outcome}

Браузерт Iroha Connect сессийг үүсгэж, нэг I105 түрийвчийн таних тэмдэгтэд зориулсан криптографын баталгааг ав, тэр түрийвчээс Torii-ийн яг үнэн хөрөнгийг шилжүүлэх үүсгэсэн эхлэлийн бүтэц дээр гарын үсэг зуруулахыг хүс, тусад нь гарын үсгийг илгээж, Applied эцсийн баталгааг хүлээ.

## Өмнөх шаардлагууд {#prerequisites}

- `@iroha/iroha-js` ба HTTPS ашигласан вэб хөтчийн аппликейшн.
- Iroha Connect v1-ийг хэрэгжүүлсэн, ганц түлхүүртэй Ed25519 I105 дансыг удирддаг түрийвч.
- Одоогийн Taira гинжийн ID ба гинжийн ялгагч, түрийвчний бүртгүүлсэн жижиг үсгийн Ed25519 олон нийтийн түлхүүрийн hex, өмчлөж болох шилжүүлж болох хөрөнгөнд болон нэг протоколын стандарт I105 чиглэл.
- Одоогийн Taira тестнет санхүүжүүлэх үйлчилгээний хариултаар буруу өгсөн төлбөрийн хөрөнгийн ID. Жишээ нь амьд төлбөрийн үнэ цэнийг энэ ID-д харьцуулах бөгөөд ямар ч хуулбарласан хөрөнгийн толь бичгийг оруулахгүй.
- Сонгогдсон Torii дээр Connect идэвхжсэн байх ёстой. QR эсвэл гүн холбоосыг үзүүлэхээс өмнө шалгана уу:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Хэрэв Taira Connect-ийг идэвхгүй гэж мэдээлж эсвэл `404`/`503` буцаавал, Connect идэвхтэй үүсгэсэн локал сүлжээг ашиглана уу. Ердийн хөрөнгийн шилжүүлэг нь мөн түр шилжүүлж болох хэмжээ болон шимтгэлийн үлдэлттэй байхыг түрийвчид шаардана.

## Алхамууд {#steps}

### 1. Нэг хэтэвчийн эхлүүлэх удирдлагыг ханга {#_1-provide-one-wallet-launch-control}

Доорх JavaScript нь энэ элементийг програмын хуудсан дээр хүлээж байна:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Өөр төхөөрөмжийн түрийвчэнд QR код болгон ижил URI-ийг дүрслэн гарга. URI нь түрийвчтэй хамааралтай дамжуулах токенийг хадгалдаг тул үүнийг аналитик, бүртгэл, илгээсэн холбоос, алдааны тайланд бүү оруул.

### 2. Бий болгох, батлах, гарын үсэг зурах, болон илгээх {#_2-create-approve-sign-and-submit}

Энэ хөтчийн модуль таны програмын төлөвөөс тодорхой утгуудыг хүлээн авдаг. Эхний `POST /v1/assets/transfer` гарын үсгийн талбаруудыг орхиж, төлбөрийн үнийн үнэлгээ бүхий хувилбарлагдсан гүйлгээ эхлүүлэгч бүтэцийг буцаадаг. Хоёр дахь нь зөвхөн түрийвчийн олон нийтийн түлхүүр болон салангид гарын үсгийг ижил шилжүүлгийн хүсэлтэнд нэмдэг.

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

Программын санах ойд `token_app`, `token_management`, болон `token_relay`-г хадгал. Зөвхөн түрийвч нээх URI/токен түрийвч рүү шилжинэ. Холболтын зөвшөөрлийг акаунтын таних хаяг гарын үсэг зурсан; зөвшөөрөлд буй X25519 `walletPublicKey` нь түр зуурын дамжуулах түлхүүр бөгөөд акаунтын Ed25519 гарын үсгийн түлхүүр биш.

### 3. Түрийвчинд хэрэгжүүлэлтийн үед Rust хүрээний төрлийг ашигла {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust протоколын интерфэйс зөвхөн түргэн авахыг хүссэн гүйлгээг хэтэвч тайлсан, түүний яг зорилгыг харуулсан, бодлогыг хэрэгжүүлсэн, зөвшөөрөгдсөн дансны түлхүүрээр гарын үсэг зурсан тохиолдолд гарын үсгийг битүүмжилж чадна. Энэ туслах баталгаажсан гарын үсгийг хүлээж авдаг; үүнийг үүсгэхгүй:

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

Агуулагчийн `connect_app` ба `connect_wallet` жишээнүүд нь протоколын туршилтын материалууд юм: тэд тодорхой тээвэрлэлийн түлхүүр ашигладаг, гаралтад токен ил болгодог, мөн түргэн хэрэгцээний хөрөнгийн материал нь хуурамч гарын үсэг буцаадаг. Зөвхөн фреймүүдийг судлахад ашиглаж, Taira түргэн хэрэгцээний хөрөнгийн хэрэгжүүлэлт болгон ашиглахаас зайлсхий.

## Баталгаажуулах {#verify}

Буцааж авсан криптографийн хэшийг хадгалж, очих газрын дараахь төлөвийг олон нийтийн эзэмшигчдийн API эцсийн цэгээр баталгаажуулна уу:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

Баталгаажуулалт нь зөвхөн JavaScript зөөгч нь илгээсэн гүйлгээний криптографийн хашийг `Applied`-д ажиглаж, зориулалтын хадгалалт нь шилжүүлгийг тусгаж байхад амжилттай болдог. Зөвхөн HTTP хүлээн зөвшөөрөх эсвэл түрийвчний баталгаажуулалт нь блокчейн дэвтэрийн эцсийн шийдэл биш юм.

## Алдааг олох болон засах {#troubleshooting}

- `404`, `503`, эсвэл `enabled: false` нь Холболтын статус хэвтэж байгааг илтгэж байгаа бөгөөд энэ тохиолдолд тухайн нод дээр ямар ч дамжуулах сесс үүсгэж чадахгүй гэсэн үг юм. Идэвхжсэн localnet рүү шилжиж, үүнийг өөрөө app эсвэл management токен дамжуулах замаар нөхөж болохгүй.
- `USER_DENIED` нь түрийвчийн шийдвэр юм. Үүнийг давтагдсан баталгаажуулах мэдэгдлүүдийг нээхийн оронд хэрэглэгчийн эцсийн үр дүн болгон хадгал.
- Зөвшөөрөл ба дансны нийцэл таарахгүй байх эсвэл буруу зөвшөөрлийн гарын үсэг сеансыг хаах ёстой. Иргэний байдлыг баталгаажуулахад бүтэлгүйтсэн тохиолдолд түрийвчинд гарын үсэг зурахыг бүү хүс.
- `public_key_hex does not control authority` нь бүртгэлийн мэдээлэл болон батлагдсан I105 таних өнөөдрийн байдлаар зөрчилдөж байна. Түр зуурын хэвлэлийн түрийлгийн түлхүүрийг энэ талбарт ашиглаж болохгүй.
- Гарын үсэг эсвэл үүсгэсэн эхлэл бүтэц татгалзах нь ихэвчлэн бэлтгэх ба илгээх хооронд хүсэлтийн талбар эсвэл амьд төлбөрийн үнийн тооцоо өөрчлөгдсөн гэсэн үг юм. Шинэ хүсэлт үүсгээрэй; хуучин гарын үсгийг хуулбарлаж бүү шилжүүл.
- Өмнө нь хүлээн зөвшөөрөгдсөн гарын үсэгтэй хүсэлтийг яг адилхан дахин илгээх нь идемпотент байдаг. Цаг хэтрэхийг дахин эхлүүлэх шалтгаан гэж үзэхээсээ өмнө буцаасан гүйлгээний криптографийн хэшийг нь лавла.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Хөтөч холболтыг тогтсон эх кодын шинэчлэл дээр хэрэгжүүлнэ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [Хөтөчийн Холболт бэхлэгдсэн эх кодын хувилбараар туршина](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust програмын хүрээний жишээ хадгалагдсан эх кодны хувилбарт](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust түрхсэн эх кодын засвар дээр түрхсэн түрийвчний загварын жишээ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Багцалсан Torii OpenAPI схем](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus үйлчилгээ](/mn/blockchain/sora-nexus-services.md)
- [Ширээний хөрөнгө](./fungible-assets.md)
- [Гүйлгээг илгээж шалгах](./submit-and-verify-transactions.md)
