---
translation_locale: mn
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Wallet Connect: Хөрөнгийн шилжүүлгийг зөвшөөрөх {#wallet-connect-approve-an-asset-transfer}

## Үр дүн {#outcome}

Хөтөч дээр Iroha Connect сесс үүсгэж, нэг I105 түрийвчийн таних тэмдэгт криптографийн батламж аваад, тэр түрийвчээр Torii-ийн гаргасан яг тэр гарын үсэггүй хөрөнгийн шилжүүлгийн ачаалалд гарын үсэг зуруулж, салангид гарын үсгийг илгээгээд, Applied эцсийн байдлыг хүлээ.

## Өмнөх шаардлагууд {#prerequisites}

- `@iroha/iroha-js` ба HTTPS ашигласан вэб хөтчийн аппликейшн.
- Iroha Connect v1-ийг хэрэгжүүлсэн, ганц түлхүүртэй Ed25519 I105 дансыг удирддаг бөгөөд `sign_transaction` болон `sign_raw` аргуудыг зөвшөөрдөг түрийвч.
- Одоогийн Taira сүлжээний ID, түрийвчийн бүртгүүлсэн жижиг үсгээр бичсэн Ed25519 нийтийн түлхүүрийн hex, эзэмшдэг шилжүүлж болох хөрөнгө болон каноник I105 хүлээн авагч.
- Taira-ийн faucet-ийн одоогийн бодлогын нийтэлсэн төлбөрийн хөрөнгийн ID. Жишээ нь бодит цагийн төлбөрийн үнийн саналыг тэр ID-тай тулгаж шалгадаг; хуулбарласан хөрөнгийн танигчийг хэзээ ч шигтгэдэггүй.
- Сонгосон Torii дээр Connect идэвхжсэн байх ёстой. QR эсвэл гүн холбоос харуулахаас өмнө сүлжээний ID-г нийтийн дансны чадамжийн мэдээллээс унш:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii нэргүй хэрэглэгчид Connect-ийн төлөвийг нийтэлдэггүй: `GET /v1/connect/status` нь нэг сессийн төлөвийг зөвхөн түүний удирдлагын токены эзэмшигчид мэдээлдэг бөгөөд нэгдсэн төлөвийг авахад операторын гарын үсэг шаардлагатай. Зангилаа Connect-ийг идэвхгүй болгосон үед `registerConnectSession` нь HTTP `503` болон `connect_disabled` кодоор (бүтээлтэд Connect ороогүй бол `404`-өөр) амжилтгүй болж, жишээ QR код эсвэл гүн холбоос харуулахгүй; Connect идэвхжсэн, үүсгэсэн локал сүлжээг ашигла. Ердийн хөрөнгийн шилжүүлэгт мөн түрийвч хангалттай шилжүүлэх боломжтой тоо хэмжээ болон төлбөрийн үлдэгдэлтэй байх шаардлагатай.

## Алхамууд {#steps}

### 1. Нэг хэтэвчийн эхлүүлэх удирдлагыг ханга {#_1-provide-one-wallet-launch-control}

Доорх JavaScript нь энэ элементийг програмын хуудсан дээр хүлээж байна:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Өөр төхөөрөмжийн түрийвчэнд QR код болгон ижил URI-ийг дүрслэн гарга. URI нь түрийвчтэй хамааралтай дамжуулах токенийг хадгалдаг тул үүнийг аналитик, бүртгэл, илгээсэн холбоос, алдааны тайланд бүү оруул.

### 2. Бий болгох, батлах, гарын үсэг зурах, болон илгээх {#_2-create-approve-sign-and-submit}

Энэ хөтчийн модуль таны аппликейшны төлөвөөс тодорхой утгуудыг хүлээн авдаг. Эхний `POST /v1/assets/transfer` гарын үсгийн талбаруудыг орхиж, үнийн саналтай төлбөрийн зорилго болон гарын үсэггүй гүйлгээний ачааллыг буцаадаг. Хоёр дахь нь ижил шилжүүлгийн хүсэлтэд зөвхөн түрийвчийн нийтийн түлхүүр болон салангид гарын үсгийг нэмдэг. Torii хоёр хүсэлтэд хоёуланд нь дансны каноник гарын үсэг шаарддаг тул модуль `createConnectCanonicalRequestAuth`-ээр дамжуулан түрийвчээр тэдгээрт гарын үсэг зуруулдаг.

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

Репозиторийн `connect_app` болон `connect_wallet` жишээнүүд нь протоколын үзүүлэн юм: апп нь түрийвчийн URI-г токентой нь хамт стандарт гаралт руу хэвлэдэг бөгөөд түрийвч токенуудаа тушаалын мөрийн аргумент болгон авч, хүссэн байтуудыг тайлж уншилгүй, харуулалгүйгээр тэдгээрт гарын үсэг зурдаг. Тэдгээрийг зөвхөн фреймүүдийг судлахад ашигла, хэзээ ч Taira түрийвчийн хэрэгжүүлэлт болгон бүү ашигла.

## Баталгаажуулах {#verify}

Буцааж авсан криптографийн хэшийг хадгалж, очих газрын дараахь төлөвийг олон нийтийн эзэмшигчдийн API эцсийн цэгээр баталгаажуулна уу:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

Баталгаажуулалт нь зөвхөн JavaScript зөөгч нь илгээсэн гүйлгээний криптографийн хашийг `Applied`-д ажиглаж, зориулалтын хадгалалт нь шилжүүлгийг тусгаж байхад амжилттай болдог. Зөвхөн HTTP хүлээн зөвшөөрөх эсвэл түрийвчний баталгаажуулалт нь блокчейн дэвтэрийн эцсийн шийдэл биш юм.

## Алдааг олох болон засах {#troubleshooting}

- `registerConnectSession`-ээс ирсэн `connect_disabled` кодтой `503`, эсвэл `404` нь тухайн зангилаа дээр дамжуулах сесс үүсгэх боломжгүй гэсэн үг. Connect идэвхжсэн localnet руу шилж; нөөц арга болгон апп эсвэл удирдлагын токенуудыг өөрөө бүү дамжуул.
- `USER_DENIED` нь түрийвчийн шийдвэр юм. Үүнийг давтагдсан баталгаажуулах мэдэгдлүүдийг нээхийн оронд хэрэглэгчийн эцсийн үр дүн болгон хадгал.
- Зөвшөөрөл ба дансны нийцэл таарахгүй байх эсвэл буруу зөвшөөрлийн гарын үсэг сеансыг хаах ёстой. Иргэний байдлыг баталгаажуулахад бүтэлгүйтсэн тохиолдолд түрийвчинд гарын үсэг зурахыг бүү хүс.
- `public_key_hex does not control authority` нь бүртгэлийн мэдээлэл болон батлагдсан I105 таних өнөөдрийн байдлаар зөрчилдөж байна. Түр зуурын хэвлэлийн түрийлгийн түлхүүрийг энэ талбарт ашиглаж болохгүй.
- Салангид гарын үсэг татгалзагдсан бол ихэвчлэн бэлтгэх болон илгээх хооронд хүсэлтийн талбар эсвэл бодит цагийн төлбөрийн үнийн санал өөрчлөгдсөн гэсэн үг. Шинэ хүсэлт үүсгэ; хуучин гарын үсгийг хэзээ ч шилжүүлж бүү ашигла.
- Өмнө нь хүлээн зөвшөөрөгдсөн гарын үсэгтэй хүсэлтийг яг адилхан дахин илгээх нь идемпотент байдаг. Цаг хэтрэхийг дахин эхлүүлэх шалтгаан гэж үзэхээсээ өмнө буцаасан гүйлгээний криптографийн хэшийг нь лавла.

## Эх сурвалж ба холбогдох баримт бичгүүд {#source-and-related-docs}

- [Хөтөч холболтыг тогтсон эх кодын шинэчлэл дээр хэрэгжүүлнэ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [Хөтөчийн Холболт бэхлэгдсэн эх кодын хувилбараар туршина](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust програмын хүрээний жишээ хадгалагдсан эх кодны хувилбарт](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust түрхсэн эх кодын засвар дээр түрхсэн түрийвчний загварын жишээ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Багцалсан Torii OpenAPI схем](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus үйлчилгээ](/mn/blockchain/sora-nexus-services.md)
- [Ширээний хөрөнгө](./fungible-assets.md)
- [Гүйлгээг илгээж шалгах](./submit-and-verify-transactions.md)
