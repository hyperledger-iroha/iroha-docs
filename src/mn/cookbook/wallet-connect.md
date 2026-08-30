---
translation_locale: mn
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 38283321d51ddbb528272bb4429906eb41545ed3933ae695fb05a24675bff9c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Wallet Connect: Ашигт малтмалын шилжүүлэн суулгах зөвшөөрөл {#wallet-connect-approve-an-asset-transfer}

## Үр дүн {#outcome}

Бrowser дээр Iroha Connect цуврал үүсгэн байгуулж, нэг I105 хөрөнгийн тодруулгын криптографийн зөвшөөрөл аваад, тэр хөрөнгийн шилжүүлэн суулгах Torii-ийн тод санг гарын үсэг зурахыг хүсээд, тусгаарлан гарын үсгийн бичгийг хүргүүлснээс хойш хэрэглээний эцсийн хугацааг хүлээх болно.

## Урьдчилсан шаардлага {#prerequisites}

- `@iroha/iroha-js` болон HTTPS-ийг ашиглаж буй хөтөч хэрэглээ.
- Iroha Connect v1-ийг хэрэгжүүлж, Ed25519 I105 нэг түлхүүртэй дансны хяналт тавих хөрөнгийг ашигладаг.
- Одоогийн Taira сүлжээ ID болон сүлжээний ялгарагч, хөрөнгийн сангийн бүртгэлтэй жижиг үсэгт Ed25519 олон нийтийн ач холбогдолтой зургаан тэмдэг, эзэмшдэг шилжүүлэн суулгах хөрөнгө, хууль ёсны I105 чиглэлийн .
- Үнийн төлбөрийн актив ID нь өнөөгийн Taira кран хариугаар буцаагджээ. Тухайн жишээ нь тухайн ID-тэй харьцуулахад амьд төлбөрийн үнэлгээг баталгаажуулдаг; энэ нь хэзээ ч нунтагласан хөрөнгийн тодруулгыг бүрдүүлдэггүй байна.
- Холбоолуулгыг сонгогдсон Torii дээр ашиглах боломжтой. QR эсвэл гүн холболт илрүүлэхээс өмнө шалгаарай:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Хэрэв Taira нь Connect-ийг хүчингүй болгосон эсвэл `404`/`503`-г буцааж байгаа бол Connect-ийн үйл ажиллагааг ханган үүсгэсэн орон нутгийн сүлжээ ашиглах хэрэгтэй. Байгалийн энгийн шилжүүлэн суулгах нь мөн хөрөнгийн санхүүжилтийн хэмжээ болон төлбөрийн үлдэгдэл хангалттай байх шаардлагатай.

## Хадгалт {#steps}

### 1. Нэг гарцыг ашиглах хяналт тавих системтэй {#_1-provide-one-wallet-launch-control}

Доорх JavaScript нь энэ элементийг хүсэлт гаргах хуудсанд хүлээж байна:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Өөр төхөөрөмж дээр байгаа хөрөнгийн QR кодтай ижил URI нэгийг өгөөч. URI нь хөрөнгийн хэмжээнд дамжуулах токенг эзэмшдэг тул үүнийг шинжилгээ, тэмдэглэл, дуудлага эсвэл аварга шалгаруулалтад оруулахгүй байх хэрэгтэй.

### 2. Хувьцаа, батлах, гарын үсэг зурах, өргөн мэдүүлэх {#_2-create-approve-sign-and-submit}

Энэхүү хөтөч модуль нь таны аппликейшн байдлаас тодорхой үнэт зүйлсийг хүлээн авдаг. Эхний `POST /v1/assets/transfer` нь гарын үсэг зурах талбайдыг устгаж, дурдсан, хувилбартай гүйлгээний тайзгийг буцааж өгдөг. Хоёр дахь нь мөн адил шилжүүлэн суулгах хүсэлтэд зөвхөн хөрөнгийн олон нийтийн түлхүү болон тусгаар тогтносон гарын үсгийг нэмнэ.

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

`token_app`, `token_management`, `token_relay`-ийг аппликейшнгийн дурсгалд хадгалах. Зөвхөн хөрөнгийг эхлүүлэх URI/токен нь хөрөнэгтэд ордог. Connect-ийн зөвшөөрлийг дансны тодруулгын тэмдэгээр гарын үсэг зурдаг; зөвшөөрлийн X25519 `walletPublicKey` нь дансны Ed25519 гарын үсгийн ач холбогдол биш, мөрийн тээврийн нууц юм.

### 3. Номын сангийн хэрэгжилтэд Rust төхөөрөмжийн хэлбэрийг ашиглана {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust протоколын хавсралт нь гарын үсэг зурах боломжтой бол зөвхөн хөрөнгийн мөнгөн тэмдэг нь хүссэн гүйлгээг шийдэгдэж, түүний тодорхой зорилго, хэрэглэсэн бодлогыг харуулж, зөвшөөрөлтэй дансны түлхүүрээр гарын үсгийн дараа. Энэ туслах энэ баталгаажуулсан гарын үсийг хүлээн авдаг; энэ нь нэг ч бүтээхгүй:

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

Тус хадгаламжийн `connect_app` болон `connect_wallet` үлгэр жишээ нь протоколын тоног төхөөрөмжүүд юм: тэдгээр нь тодорхойлох тээврийн түлхүүр ашигладаг, гарааны токенүүдийг илрүүлэх, мөн хөрөнгийн тоног төхийг дуулгасан гарын үсэг буцаадаг. Тэднийг зөвхөн зургуудыг судлахын тулд хэрэглэж болно, хэзээ ч Taira хөрөнгийн хэрэгжилтийн хувьд ашигладаггүй.

## Бүртгэнэ {#verify}

Буцаасан хэшиг хадгалах, нээлт газрын дараагийн байдлын баталгаажуулах нь олон нийтийн эзэмшигчийн төгсгөлийн цэгээр:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

JavaScript үйлчлүүлэгчид ирүүлсэн гүйлгээний хэшийн хувьд `Applied` ажиглаж, нутаг дэвсгэрийн эзэмших газар нь шилжүүлэн суулгах үйл ажиллагааг тусгасан тохиолдолд л шалгалт амжилттай болно. HTTP хүлээн зөвшөөрөл эсвэл хөрөнгийн батламж нь зөвхөн томоохон бүртгэлийн эцэслэл биш юм.

## Ашигтвортой байдлын асуудал {#troubleshooting}

- `404`, `503`, эсвэл `enabled: false` Connect-ийн байдал нь тухайн түймэр дээр ямар ч ээлжит суудал үүсгэх боломжгүй гэсэн үг юм. Орон нутгийн сүлжээнд шилжүүлээрэй; програм хэрэгсэл эсвэл удирдлагын токенүүдийг өөрөө тээвэрлэхэд бүү тат.
- `USER_DENIED` бол мөнгөн тэмдэгтийн шийдвэр юм. Энэ нь дахин дахин зөвшөөрлийн илтгэлийг нээхийн оронд эцсийн хэрэглэгчийн үр дүнд хадгалах болно.
- Хууль батлах бүртгэлийн зөрчил эсвэл хүчингүй зөвшөөрлийн гарын үсэг нь хуралдаан дуусгавар байх ёстой. Хууль бүртгэлийг байгуулж чадахгүй бол хэзээ ч мөнгөн тэмдэгтээс гарын үсгийныг хүсэхгүй байна
- `public_key_hex does not control authority` нь бүртгэлийн мэдээлэл болон батлагдсан I105 тодрууллын зөрүү гэсэн үг. Энэ талбайд мөрийн сангийн тээврийн товчлогыг ашиглаж болохгүй.
- Тус гарын үсэг эсвэл тавилгаар татгалзсан нь ихэвчлэн бэлтгэл болон өргөн мэдүүлэх хооронд өөрчилсөн хүсэлтийн талбай эсвэл амьд төлбөрийн санал гэсэн үг юм. Шинэ хүсэлт бүтээх; хуучны гарын үсийг хэзээ ч шилжүүлэхгүй.
- Урьд нь хүлээн зөвшөөрөгдсөн гарын үсэг зурсан хүсэлтийг дагаж мөрдөх боломжтой. Цаг хугацааг дахин эхлүүлэх шалтгаан гэж үзэхээс өмнө буцаасан гүйлгээний хэшийг сураарай.

## Эх сурвалж, холбогдох баримт бичгүүд {#source-and-related-docs}

- [Бrowser Connect-ийн хэрэгжилт pinned commit-д ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [Browser Connect-ийн шинжилгээний үйл ажиллагаа нь ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust програм хангамжийн хүрээний жишээ нь pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust гарын үсэгт хэсгээс суурь хуудасны жишээ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Torii OpenAPI схема](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json) нь гулгарсан
- [SORA Nexus үйлчилгээ](/mn/blockchain/sora-nexus-services.md)
- [Ашигт малтмалын хөрөнгө](./fungible-assets.md)
- [Арилжааны танилцуулалт, шалгалт ](./submit-and-verify-transactions.md)
