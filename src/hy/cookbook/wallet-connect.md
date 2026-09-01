---
translation_locale: hy
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Wallet Connect- ը. հաստատեք ակտիվների փոխանցումը {#wallet-connect-approve-an-asset-transfer}

## Արդյունքը {#outcome}

Ստեղծեք Iroha Connect նստաշրջանը զննարկիչում, ստացեք կրիպտոգրաֆիկ հաստատություն մեկ I105 դրամապանակի ինքնության համար, խնդրեք այդ դրամապանակը ստորագրել Torii- ի ակտիվների փոխանցման ճշգրիտ սանդղակը, ներկայացրեք առանձնացված ստորագրությունը եւ սպասեք կիրառված վերջնականացման:

## Նախադրյալներ {#prerequisites}

- Բրաուզերային հավելված, որն օգտագործում է `@iroha/iroha-js` եւ HTTPS:
- Գանձար, որը իրականացնում է Iroha Connect v1 եւ վերահսկում է Ed25519 I105 հաշիվը մեկ բանալինով:
- Ներկայիս Taira շղթան ID եւ շղթայի տարբերակիչ, դրամապանակի գրանցված փոքր տառերով Ed25519 հանրային բանալին hex-ը, սեփականատերական փոխանցելի ակտիվը եւ կանոնիկ I105 նպատակակետ:
- Հաշվարկային ակտիվը ID, որը վերադարձվել է ընթացիկ Taira faucet պատասխանով: Օրինակն ստուգում է կենդանի փոխհատուցման գինը այդ ID- ի համեմատ. Այն երբեք չի ներմուծում կոպեացված ակտիվի նույնականացման համար:
- Կապակցումը պետք է ակտիվացվի ընտրված Torii վրա: Նախքան ցույց տալը ստուգեք QR կամ խորը հղում.

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Եթե Taira հաղորդում է Connect-ը անջատել կամ վերադարձնում է `404`/`503`, օգտագործեք ստեղծված տեղական ցանց, որի միջոցով կարողացվում է Connect- ը: Մի շարք ակտիվների փոխանցումը նաեւ պահանջում է, որ դրամապանակը ունենա բավարար փոխանցելի քանակություն եւ վճարային մնացորդ:

## Քայլեր {#steps}

### 1. Ստեղծեք մեկ դրամապանակի գործարկման վերահսկողություն {#_1-provide-one-wallet-launch-control}

Ստորեւ բերված JavaScript կետը դիմումի էջում ակնկալում է այս տարրը.

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Մեկ այլ սարքի դրամապանակի համար նույն URI կոդը տիրապետեք QR: URI- ը պահում է դրամապանակը, այնպես որ այն մի տեղադրեք վերլուծության, օրագրերի, հղումների կամ խափանման զեկույցների մեջ:

### 2. Ստեղծեք, հաստատեք, ստորագրեք եւ ներկայացրեք: {#_2-create-approve-sign-and-submit}

Այս բրաուզերային մոդուլը ընդունում է կոնկրետ արժեքներ ձեր հավելվածի վիճակից: Առաջին `POST /v1/assets/transfer`- ը բացառում է ստորագրման դաշտերը եւ վերադարձնում է վճարի գնառաջարկ, տարբերակավորված գործարքների սանդղակը: Երկրորդը ավելացնում է միայն դրամապանակի հանրային բանալին եւ առանձին ստորագրությունը նույն փոխանցման խնդրանքին.

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

`connect_app` եւ `connect_wallet` պահեստների օրինակները պրոտոկոլի թեստային ռեսուրսներ են. նրանք օգտագործում են դետերմինիստիկ տրանսպորտային բանալիներ, արտադրանքի մեջ բացահայտում են զննարկիչները, իսկ դրամապանակի թեստային ռեսուրսը վերադարձնում է կեղծ ստորագրություն: Օգտագործեք դրանք միայն շրջանակների ուսումնասիրման համար, երբեք որպես Taira դրամապանակը իրականացնելը:

## Փորձարկել {#verify}

Պահպանեք վերադարձված շիշը եւ հաստատեք նպատակակետի հետագա վիճակը հանրային տիրապետիչների վերջնական կետով.

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

Վավերացումը հաջողվում է միայն այն դեպքում, երբ JavaScript սպասավորը դիտարկում է `Applied` ներկայացված գործարքի համար եւ նպատակակետային բաժնետոմսերը արտացոլում են փոխանցումը: Միայն HTTP ընդունումը կամ դրամապանակի հավանությունը չեն հանդիսանում գրառման վերջնականություն:

## Խնդիրների լուծում {#troubleshooting}

- `404`, `503` կամ `enabled: false` Connect կարգավիճակից նշանակում է, որ այդ հանգույցում չի կարող ստեղծվել ռելեյի նստաշրջան: Փոխանցեք ակտիվացված տեղական ցանցին. Մի վերադառնացեք ծրագրի կամ կառավարման տոքեր տեղափոխելու վրա:
- `USER_DENIED` դրամապանակի որոշում է: Պահպանեք այն որպես վերջնական օգտագործողի արդյունք, փոխարենը բացել կրկնվող հավանության հրահանգներ.
- Հաստատման հաշիվի անհամապատասխանությունը կամ անվավեր հաստատման ստորագրությունը պետք է փակել նստաշրջանը: Երբեք մի խնդրեք դրամապանակին ստորագրել այն բանից հետո, երբ ինքնության կապը ձախողվում է:
- `public_key_hex does not control authority` նշանակում է գրանցման տվյալներ եւ հաստատված I105 նույնականության անհամաձայնություն: Այս ոլորտում չի կարող օգտագործվել փոշակի դրամապանակի տրանսպորտի բանալին:
- Գործակալության կամ սանդղակի մերժումը սովորաբար նշանակում է պահանջի դաշտը կամ կենդանի վճարային առաջարկը, որը փոխվում է նախապատրաստելու եւ ներկայացնելու միջեւ: Կառուցեք նոր դիմում. Երբեք չտեղափոխեք հին ստորագրությունը:
- Արդեն ընդունված ստորագրված հարցման ճշգրիտ կրկնությունը իդեմպոտենտ է։ Նախքան ժամանակի սպառումը նորից սկսելու պատճառ համարելը՝ կատարեք հարցում վերադարձված գործարքի հեշը։

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Browser Connect- ի իրականացումը փակված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [Browser Connect թեստերը փակված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust հավելվածի շրջանակի օրինակ փաթեթավորված commit-ում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust դրամապանակի շրջանակի օրինակ փակված կոմիտեում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs):
- [Պինված Torii OpenAPI սխեման](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus ծառայություններ](/hy/blockchain/sora-nexus-services.md)
- [Գործունակ ակտիվներ](./fungible-assets.md)
- [Գործարքների ներկայացում եւ ստուգում](./submit-and-verify-transactions.md)
