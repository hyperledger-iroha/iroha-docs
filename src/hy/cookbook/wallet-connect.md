---
translation_locale: hy
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Wallet Connect- ը. հաստատեք ակտիվների փոխանցումը {#wallet-connect-approve-an-asset-transfer}

## Արդյունքը {#outcome}

Զննարկիչում ստեղծեք Iroha Connect սեսիա, ստացեք կրիպտոգրաֆիկ հաստատում մեկ I105 դրամապանակի ինքնության համար, խնդրեք այդ դրամապանակին ստորագրել Torii-ի ճշգրիտ, չստորագրված ակտիվի փոխանցման օգտակար բեռը, ներկայացրեք անջատված ստորագրությունը և սպասեք Applied վերջնականությանը։

## Նախադրյալներ {#prerequisites}

- Բրաուզերային հավելված, որն օգտագործում է `@iroha/iroha-js` եւ HTTPS:
- Դրամապանակ, որն իրականացնում է Iroha Connect v1, կառավարում է մեկ բանալիով Ed25519 I105 հաշիվ և տրամադրում է `sign_transaction` և `sign_raw` մեթոդները։
- Taira-ի ընթացիկ ցանցի ID-ն, դրամապանակի գրանցված Ed25519 հանրային բանալու hex-ը փոքրատառերով, սեփական փոխանցելի ակտիվ և կանոնիկ I105 նպատակակետ։
- Վճարային ակտիվի ID-ն, որը հրապարակում է Taira-ի faucet-ի ընթացիկ քաղաքականությունը։ Օրինակն ընթացիկ վճարային առաջարկը ստուգում է այդ ID-ի համեմատ; այն երբեք չի ներդնում ակտիվի պատճենված նույնացուցիչ։
- Connect-ը պետք է միացված լինի ընտրված Torii-ում։ Մինչև QR կամ խորը հղում ցուցադրելը կարդացեք ցանցի ID-ն հաշվի հանրային հնարավորություններից:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii-ն Connect-ի անանուն կարգավիճակ չի հրապարակում: `GET /v1/connect/status`-ը մեկ սեսիայի կարգավիճակը հաղորդում է միայն դրա կառավարման տոկենով, իսկ ամփոփ կարգավիճակը պահանջում է օպերատորի ստորագրություն։ Երբ հանգույցն անջատում է Connect-ը, `registerConnectSession`-ը ձախողվում է HTTP `503`-ով և `connect_disabled` կոդով (`404`, եթե կառուցման մեջ Connect-ը ներառված չէ), և օրինակը չի ցուցադրում ոչ QR կոդ, ոչ խորը հղում; օգտագործեք ստեղծված տեղական ցանց՝ միացված Connect-ով։ Սովորական ակտիվի փոխանցման համար անհրաժեշտ է նաև, որ դրամապանակն ունենա բավարար փոխանցելի քանակ և վճարի մնացորդ։

## Քայլեր {#steps}

### 1. Ստեղծեք մեկ դրամապանակի գործարկման վերահսկողություն {#_1-provide-one-wallet-launch-control}

Ստորեւ բերված JavaScript կետը դիմումի էջում ակնկալում է այս տարրը.

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Մեկ այլ սարքի դրամապանակի համար նույն URI կոդը տիրապետեք QR: URI- ը պահում է դրամապանակը, այնպես որ այն մի տեղադրեք վերլուծության, օրագրերի, հղումների կամ խափանման զեկույցների մեջ:

### 2. Ստեղծեք, հաստատեք, ստորագրեք եւ ներկայացրեք: {#_2-create-approve-sign-and-submit}

Այս զննարկչային մոդուլն ընդունում է կոնկրետ արժեքներ ձեր հավելվածի վիճակից։ Առաջին `POST /v1/assets/transfer`-ը բաց է թողնում ստորագրման դաշտերը և վերադարձնում է առաջարկված վճարի մտադրությունը և չստորագրված գործարքի օգտակար բեռը։ Երկրորդը նույն փոխանցման հարցմանն ավելացնում է միայն դրամապանակի հանրային բանալին և անջատված ստորագրությունը։ Torii-ն երկու հարցումների վրա էլ պահանջում է կանոնիկ հաշվի ստորագրություն, ուստի մոդուլը դրանք ստորագրել է տալիս դրամապանակին `createConnectCanonicalRequestAuth`-ի միջոցով։

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

Պահպանեք `token_app`, `token_management`, եւ `token_relay` հավելվածի հիշողության մեջ: Միայն դրամապանակի գործարկման URI-ն/token-ը է փոխանցվում դրամապանակին։ Connect հաստատումը ստորագրվում է հաշիվի նույնականությամբ, X25519 `walletPublicKey` հավանության մեջ կա կարճաժամկետ տրանսպորտային բանալին, եւ ոչ թե հաշիվի Ed25519 ստորագրման բանալին:

### 3. Կապույտի իրականացման համար օգտագործեք Rust շրջանակի տեսակները: {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust պրոտոկոլային մակերեսը կարող է կնքել ստորագրություն միայն այն բանից հետո, երբ թղթադրամը բացատրել է պահանջված գործարքը, ցուցադրել իր ճշգրիտ մտադրությունը, կիրառել քաղաքականությունը եւ ստորագրել հաստատված հաշիվի բանալինով: Այս օգնականը ընդունում է այդ հավաստված ստորագրությունը. նա չի ստեղծում որեւէ մեկը.

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

Պահոցի `connect_app` և `connect_wallet` օրինակները պրոտոկոլի ցուցադրություններ են: հավելվածը դրամապանակի URI-ն, ներառյալ դրա տոկենը, տպում է ստանդարտ ելքում, իսկ դրամապանակն իր տոկենները ստանում է որպես հրամանի տողի արգումենտներ և ստորագրում է պահանջված բայթերը՝ առանց դրանք ապակոդավորելու կամ ցուցադրելու։ Օգտագործեք դրանք միայն կադրերն ուսումնասիրելու համար, երբեք՝ որպես Taira դրամապանակի իրականացում։

## Փորձարկել {#verify}

Պահպանեք վերադարձված շիշը եւ հաստատեք նպատակակետի հետագա վիճակը հանրային տիրապետիչների վերջնական կետով.

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

Վավերացումը հաջողվում է միայն այն դեպքում, երբ JavaScript սպասավորը դիտարկում է `Applied` ներկայացված գործարքի համար եւ նպատակակետային բաժնետոմսերը արտացոլում են փոխանցումը: Միայն HTTP ընդունումը կամ դրամապանակի հավանությունը չեն հանդիսանում գրառման վերջնականություն:

## Խնդիրների լուծում {#troubleshooting}

- `registerConnectSession`-ից `connect_disabled` կոդով `503`-ը կամ `404`-ը նշանակում է, որ այդ հանգույցում ռելեյի սեսիա հնարավոր չէ ստեղծել։ Անցեք Connect-ը միացված տեղական ցանցի; մի՛ անցեք հավելվածի կամ կառավարման տոկենները ինքնուրույն փոխանցելուն։
- `USER_DENIED` դրամապանակի որոշում է: Պահպանեք այն որպես վերջնական օգտագործողի արդյունք, փոխարենը բացել կրկնվող հավանության հրահանգներ.
- Հաստատման հաշիվի անհամապատասխանությունը կամ անվավեր հաստատման ստորագրությունը պետք է փակել նստաշրջանը: Երբեք մի խնդրեք դրամապանակին ստորագրել այն բանից հետո, երբ ինքնության կապը ձախողվում է:
- `public_key_hex does not control authority` նշանակում է գրանցման տվյալներ եւ հաստատված I105 նույնականության անհամաձայնություն: Այս ոլորտում չի կարող օգտագործվել փոշակի դրամապանակի տրանսպորտի բանալին:
- Մերժված անջատված ստորագրությունը սովորաբար նշանակում է, որ պատրաստման և ներկայացման միջև փոխվել է հարցման դաշտը կամ ընթացիկ վճարային առաջարկը։ Կառուցեք նոր հարցում; երբեք մի՛ տեղափոխեք հին ստորագրությունը։
- Արդեն ընդունված ստորագրված հարցման ճշգրիտ կրկնությունը իդեմպոտենտ է։ Նախքան ժամանակի սպառումը նորից սկսելու պատճառ համարելը՝ կատարեք հարցում վերադարձված գործարքի հեշը։

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Browser Connect- ի իրականացումը փակված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [Browser Connect թեստերը փակված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust հավելվածի շրջանակի օրինակ փաթեթավորված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust դրամապանակի շրջանակի օրինակ փակված կոմիտեում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs):
- [Պինված Torii OpenAPI սխեման](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus ծառայություններ](/hy/blockchain/sora-nexus-services.md)
- [Գործունակ ակտիվներ](./fungible-assets.md)
- [Գործարքների ներկայացում եւ ստուգում](./submit-and-verify-transactions.md)
