---
translation_locale: kk
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Wallet Connect: Активтерді аударуды мақұлдау {#wallet-connect-approve-an-asset-transfer}

## Нәтиже {#outcome}

Браузерде Iroha Connect сеансын құрыңыз, бір I105 әмиян идентификациясы үшін криптографиялық мақұлдау алыңыз, сол әмияннан Torii-нің нақты актив аударуына арналған бастапқы құрылымын қол қоюды сұраңыз, ажыратылған қолтаңбаны жіберіңіз және Қолданылған финалдылыққа дейін күтіңіз.

## Алдын ала шарттар {#prerequisites}

- Браузерлік қосымша `@iroha/iroha-js` және HTTPS пайдаланатын.
- Бір кілтті Ed25519 I105 есепшотын басқаратын және Iroha Connect v1-ді жүзеге асыратын әмиян.
- Қазіргі Taira тізбек идентификаторы және тізбек дискриминанты, әмиянға тіркелген кіші әріппен жазылған Ed25519 ашық кілтінің хекс коды, меншіктелген аударылатын актив және бір протокол-стандартты I105 тағайындау.
- Қазіргі Taira тесттік желі қаржыландыру қызметінің жауабымен қайтарылған төлем активінің идентификаторы. Мысал сол идентификаторға қарсы нақты төлем бағасының бағалауын тексереді; ол ешқашан көшірілген актив идентификаторын енгізбейді.
- Таңдалған Torii үшін Қосу қосулы болуы керек. QR немесе терең сілтемені көрсету алдында тексеріңіз:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Taira егер Connect өшірілген деп хабарласа немесе `404`/`503` қайтаратын болса, Connect қосылған генерацияланған жергілікті желіні пайдаланыңыз. Кәдімгі активті аударым үшін де әмиянның жеткілікті мөлшерде аударылатын саны мен төлем балансын иемденуі қажет.

## Қадамдар {#steps}

### 1. Бір әмиян іске қосу басқаруын қамтамасыз етіңіз {#_1-provide-one-wallet-launch-control}

Төмендегі JavaScript бұл элементті қолданба бетінде күтеді:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Басқа құрылғыдағы әмиян үшін QR код ретінде сол URI көрсету. URI әмиянға арналған делдал белгіні ұстайды, сондықтан оны аналитикаға, журналдарға, сілтемелерге немесе апат туралы есептерге қоймаңыз.

### 2. Жасау, мақұлдау, қол қою және ұсыну {#_2-create-approve-sign-and-submit}

Бұл браузер модулі қосымша күйіңізден нақты мәндерді қабылдайды. Бірінші `POST /v1/assets/transfer` қол қою өрістерін қалдырып, төлем бағасын бағалаумен нұсқаланған транзакция бастамасының құрылымын қайтарады. Екінші тек әмиянның ашық кілтін және бөлінген қолтаңбаны сол аударым сұрауына қосады.

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

`token_app`, `token_management` және `token_relay` бағдарламаның жадында сақтаңыз. Тек әмиян іске қосылған URI/токен әмиянға өтеді. Қосылуды растау есептік жазба идентификаторы арқылы қол қойылады; растаудағы X25519 `walletPublicKey` уақытша тасымалдау кілті болып табылады, есептік жазбаның Ed25519 қол қою кілті емес.

### 3. Әмиянды жүзеге асыруда Rust жақтау түрлерін пайдаланыңыз {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust протокол беті тек қана әмиян сұралған транзакцияны дешифрлағаннан, оның нақты ниетін көрсеткеннен, саясатты қолданғаннан және мақұлданған аккаунт кілтімен қол қойғаннан кейін ғана қолтаңбаны бекіте алады. Бұл көмекші тек тексерілген қолтаңбаны қабылдайды; оны жасамайды:

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

Репозиторийдің `connect_app` және `connect_wallet` мысалдары протокол сынағының артефактілері: олар детерминистикалық тасымалдау кілттерін пайдаланады, шығысқа токендерді көрсетеді, ал әмиян сынағының артефакті жалған қолтаңбаны қайтарады. Оларды тек кадрларды зерттеу үшін пайдаланыңыз, ешқашан Taira әмиянды жүзеге асыру ретінде қолданбаңыз.

## Растау {#verify}

Қайтарылған криптографиялық хешті сақтаңыз және мақсаттың соңғы күйін қоғамдық ұстаушылар API нүктесі арқылы растаңыз:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

Тексеру тек қана кезде сәтті болады JavaScript өртеуші бақылап отыр `Applied` жіберілген транзакцияның криптографиялық хэш-функциясы және мақсатты есеп айырысу трансферді көрсетеді. HTTP тек қабылдау немесе әмиян мақұлдауы блокчейн есептік жазбасының соңғы мәртебесі емес.

## Ақауларды жою {#troubleshooting}

- `404`, `503` немесе `enabled: false` Connect күйінен сол түйінде қосқыш сессиясын жасау мүмкін еместігін білдіреді. Қолданылған жергілікті желіге ауысыңыз; қолданбалы немесе басқару токендерін өзіңіз тасымалдауға қайта оралмаңыз.
- `USER_DENIED` — бұл әмиян шешімі. Оны қайта-қайта мақұлдау сұрауларын ашудың орнына соңғы пайдаланушы нәтижесі ретінде сақтаңыз.
- Рұқсат пен шоттың сәйкессіздігі немесе жарамсыз рұқсат қолтаңбасы сессияны жабуы керек. Жеке деректерді байланыстыру сәтсіз болғаннан кейін әмияннан қол қоюды сұрамаңыз.
- `public_key_hex does not control authority` дегеніміз тіркеу деректері және бекітілген I105 жеке тұлға сәйкеспейді. Уақытша әмиян тасымалдау кілтін осы өрісте қолдануға болмайды.
- Қолтаңба немесе жасалған бастапқы құрылымның қабылданбауы әдетте сұрау өрісінде немесе тірі төлем бағасы бағалауында даярлау мен жіберу арасындағы өзгерістерді білдіреді. Жаңа сұрау жасаңыз; ескі қолтаңбаны ешқашан көшірумен қолданбаңыз.
- Бұрын қабылданған қол қойылған өтінімнің дәл қайталануы идемпотентті болып табылады. Уақыт аяқталуын қайтадан бастау себебі ретінде қарастырмас бұрын оның қайтарылған транзакция криптографиялық хэшін сұраңыз.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Тиылған бастапқы код нұсқасындағы Browser Connect іске асыруы](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [Браузер Connect бекітілген бастапқы код нұсқасында тестілейді](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust бекітілген бастапқы код ревизиясындағы қосымша құрылымы мысалы](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust қалта құрылымы мысалы бекітілген бастапқы код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Бекітілген Torii OpenAPI схема](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus қызметтер](/kk/blockchain/sora-nexus-services.md)
- [Ауыстырылатын мүлік](./fungible-assets.md)
- [Транзакцияларды жіберу және тексеру](./submit-and-verify-transactions.md)
