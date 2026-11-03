---
translation_locale: kk
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Wallet Connect: Активтерді аударуды мақұлдау {#wallet-connect-approve-an-asset-transfer}

## Нәтиже {#outcome}

Браузерде Iroha Connect сеансын жасаңыз, бір I105 әмиян сәйкестігі үшін криптографиялық мақұлдау алыңыз, сол әмияннан Torii-дің нақты, қол қойылмаған актив аудару пайдалы жүктемесіне қол қоюды сұраңыз, бөлек қолтаңбаны жіберіңіз және Applied түпкілікті күйін күтіңіз.

## Алдын ала шарттар {#prerequisites}

- Браузерлік қосымша `@iroha/iroha-js` және HTTPS пайдаланатын.
- Iroha Connect v1-ді жүзеге асыратын, бір кілтті Ed25519 I105 есептік жазбасын басқаратын және `sign_transaction` мен `sign_raw` әдістеріне рұқсат беретін әмиян.
- Ағымдағы Taira желі ID-і, әмиянның тіркелген кіші әріптермен жазылған Ed25519 ашық кілтінің hex мәні, иеліктегі аударуға болатын актив және канондық I105 мақсаты.
- Ағымдағы Taira faucet саясаты жариялайтын ақы активінің ID-і. Мысал ағымдағы ақы бағасын осы ID бойынша тексереді; ол ешқашан көшірілген актив идентификаторын кодқа енгізбейді.
- Таңдалған Torii-де Connect қосулы болуы керек. QR немесе терең сілтемені көрсетпес бұрын желі ID-ін жалпыға ашық есептік жазба мүмкіндіктерінен оқыңыз:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii анонимді Connect күйін жарияламайды: `GET /v1/connect/status` бір сеанстың күйін тек оның басқару токені бойынша хабарлайды, ал жиынтық күй оператор қолтаңбасын талап етеді. Түйінде Connect өшірілгенде `registerConnectSession` HTTP `503` және `connect_disabled` кодымен сәтсіз аяқталады (жинақта Connect болмаса, `404`), ал мысал QR кодты да, терең сілтемені де көрсетпейді; Connect қосулы жасалған жергілікті желіні пайдаланыңыз. Кәдімгі актив аударымы үшін әмиянда жеткілікті аударылатын мөлшер мен ақы балансы болуы да қажет.

## Қадамдар {#steps}

### 1. Бір әмиян іске қосу басқаруын қамтамасыз етіңіз {#_1-provide-one-wallet-launch-control}

Төмендегі JavaScript бұл элементті қолданба бетінде күтеді:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Басқа құрылғыдағы әмиян үшін QR код ретінде сол URI көрсету. URI әмиянға арналған делдал белгіні ұстайды, сондықтан оны аналитикаға, журналдарға, сілтемелерге немесе апат туралы есептерге қоймаңыз.

### 2. Жасау, мақұлдау, қол қою және ұсыну {#_2-create-approve-sign-and-submit}

Бұл браузер модулі қолданбаңыздың күйінен нақты мәндерді қабылдайды. Бірінші `POST /v1/assets/transfer` қол қою өрістерін қалдырып кетеді және бағаланған ақы ниетін және қол қойылмаған транзакцияның пайдалы жүктемесін қайтарады. Екіншісі сол аудару сұрауына тек әмиянның ашық кілтін және бөлек қолтаңбаны қосады. Torii екі сұрауда да канондық есептік жазба қолтаңбасын талап етеді, сондықтан модуль оларға әмиянға `createConnectCanonicalRequestAuth` арқылы қол қойғызады.

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

Репозиторийдегі `connect_app` және `connect_wallet` мысалдары — протокол көрсетілімдері: қолданба әмиян URI-ін, оның токенімен қоса, стандартты шығысқа басып шығарады, ал әмиян өз токендерін командалық жол аргументтері ретінде алып, сұралған байттарды декодтамай және көрсетпей қол қояды. Оларды тек кадрларды зерттеу үшін пайдаланыңыз, ешқашан Taira әмиянын жүзеге асыру ретінде қолданбаңыз.

## Растау {#verify}

Қайтарылған криптографиялық хешті сақтаңыз және мақсаттың соңғы күйін қоғамдық ұстаушылар API нүктесі арқылы растаңыз:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

Тексеру тек қана кезде сәтті болады JavaScript өртеуші бақылап отыр `Applied` жіберілген транзакцияның криптографиялық хэш-функциясы және мақсатты есеп айырысу трансферді көрсетеді. HTTP тек қабылдау немесе әмиян мақұлдауы блокчейн есептік жазбасының соңғы мәртебесі емес.

## Ақауларды жою {#troubleshooting}

- `registerConnectSession` қайтарған `connect_disabled` кодты `503` немесе `404` сол түйінде ешбір ретранслятор сеансын жасау мүмкін еместігін білдіреді. Connect қосылған жергілікті желіге ауысыңыз; қолданба немесе басқару токендерін өзіңіз тасымалдауға көшпеңіз.
- `USER_DENIED` — бұл әмиян шешімі. Оны қайта-қайта мақұлдау сұрауларын ашудың орнына соңғы пайдаланушы нәтижесі ретінде сақтаңыз.
- Рұқсат пен шоттың сәйкессіздігі немесе жарамсыз рұқсат қолтаңбасы сессияны жабуы керек. Жеке деректерді байланыстыру сәтсіз болғаннан кейін әмияннан қол қоюды сұрамаңыз.
- `public_key_hex does not control authority` дегеніміз тіркеу деректері және бекітілген I105 жеке тұлға сәйкеспейді. Уақытша әмиян тасымалдау кілтін осы өрісте қолдануға болмайды.
- Қабылданбаған бөлек қолтаңба әдетте дайындау мен жіберу арасында сұрау өрісі немесе ағымдағы ақы бағасы өзгергенін білдіреді. Жаңа сұрау құрастырыңыз; ескі қолтаңбаны ешқашан көшірмеңіз.
- Бұрын қабылданған қол қойылған өтінімнің дәл қайталануы идемпотентті болып табылады. Уақыт аяқталуын қайтадан бастау себебі ретінде қарастырмас бұрын оның қайтарылған транзакция криптографиялық хэшін сұраңыз.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Тиылған бастапқы код нұсқасындағы Browser Connect іске асыруы](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [Браузер Connect бекітілген бастапқы код нұсқасында тестілейді](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust бекітілген бастапқы код ревизиясындағы қосымша құрылымы мысалы](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust қалта құрылымы мысалы бекітілген бастапқы код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Бекітілген Torii OpenAPI схема](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus қызметтер](/kk/blockchain/sora-nexus-services.md)
- [Ауыстырылатын мүлік](./fungible-assets.md)
- [Транзакцияларды жіберу және тексеру](./submit-and-verify-transactions.md)
