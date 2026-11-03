---
translation_locale: ba
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Wallet Connect: активтарҙы күсереүгә рөхсәт бирегеҙ {#wallet-connect-approve-an-asset-transfer}

## Һөҙөмтә {#outcome}

Браузерҙа Iroha Connect сеансын булдырығыҙ, бер I105 аҡса янсығы идентификацияһы өсөн криптографик раҫлау алығыҙ, был аҡса янсығынан Torii-ҙың теүәл, ҡул ҡуйылмаған актив күсереү файҙалы йөгөнә ҡул ҡуйыуын һорағыҙ, айырым ҡултамғаны тапшырығыҙ һәм Applied һуңғы торошон көтөгөҙ.

## Шарттар {#prerequisites}

- `@iroha/iroha-js` һәм HTTPS менән браузер ҡушымтаһы.
- Iroha Connect v1-ҙы тормошҡа ашырған, бер асҡыслы Ed25519 I105 иҫәбен идара иткән һәм `sign_transaction` менән `sign_raw` методтарын рөхсәт иткән аҡса янсығы.
- Taira-ның хәҙерге селтәр ID-һы, аҡса янсығының теркәлгән, бәләкәй хәрефле уналтылыҡ рәүештәге Ed25519 асыҡ асҡысы, үҙегеҙгә ҡараған күсерелә торған актив һәм каноник I105 тәғәйенләнеш.
- Хәҙерге Taira faucet сәйәсәте баҫтырған түләү активы ID-һы. Миҫал ағымдағы комиссия иҫәбен шул ID менән тикшерә; ул бер ҡасан да күсерелгән актив идентификаторын индермәй.
- Һайланған Torii-ҙа Connect ҡабыҙылған булырға тейеш. QR йәки тәрән һылтанма күрһәткәнсе селтәр ID-һын асыҡ иҫәп мөмкинлектәренән уҡығыҙ:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii Connect статусын аноним рәүештә баҫтырмай: `GET /v1/connect/status` бер сеанс тураһында уның идара итеү токенына ғына хәбәр итә, ә дөйөм статус өсөн оператор ҡултамғаһы кәрәк. Узел Connect-ты һүндергәндә `registerConnectSession` HTTP `503` һәм `connect_disabled` коды менән уңышһыҙлыҡҡа осрай (йыйылышта Connect булмаһа — `404`), һәм миҫал QR код та, тәрән һылтанма ла күрһәтмәй; Connect ҡабыҙылған генерацияланған локаль селтәрҙе ҡулланығыҙ. Ғәҙәти актив күсереү өсөн шулай уҡ аҡса янсығында етерлек күсерелә торған күләм һәм комиссия өсөн баланс булырға тейеш.

## Аҙымдар {#steps}

### 1. Бер аҡса янсығы менән идара итеүҙе тәьмин итегеҙ. {#_1-provide-one-wallet-launch-control}

JavaScript түбәндәге элемент заявка битендә ошо элементты көтә:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

QR кодын икенсе ҡоролмала булған аҡса янсығы өсөн бер үк URI кодын тапшырығыҙ. URI аҡса янсыгы буйынса күсә торған релей токенды тота, шуға күрә уны аналитикаға, журналдарға, йүнәлтеүҙәргә йәки авариялар тураһында отчеттарға индермәгеҙ.

### 2. төҙөү, раҫлау, ҡул ҡуйыу һәм тапшырыу {#_2-create-approve-sign-and-submit}

Был браузер модуле ҡушымтағыҙ торошонан конкрет ҡиммәттәрҙе ҡабул итә. Беренсе `POST /v1/assets/transfer` ҡул ҡуйыу яландарын төшөрөп ҡалдыра һәм иҫәпләнгән комиссия ниәтен һәм ҡул ҡуйылмаған транзакция файҙалы йөгөн ҡайтара. Икенсеһе шул уҡ күсереү һорауына аҡса янсығының асыҡ асҡысын һәм айырым ҡултамғаһын ғына өҫтәй. Torii ике һорауҙа ла каноник иҫәп ҡултамғаһын талап итә, шуға күрә модуль аҡса янсығына уларға `createConnectCanonicalRequestAuth` аша ҡул ҡуйҙыра.

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

Һаҡлағыҙ `token_app`, `token_management`, һәм `token_relay` ҡушымталар хәтерендә. бары аҡса янсығы старт URI/token wallet менән күсә. Connect хуплау иҫәбенең идентификаторы менән ҡул ҡуйыла; X25519 `walletPublicKey` раҫлауҙа транспорт асҡысы, ә иҫәбенең Ed25519 ҡултамғалы асҡысы түгел.

### 3. Портфель тормошҡа ашырыуҙа Rust рамка типтарын ҡулланыу {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust протокол өҫтөндә ҡултамғаны портфель һоралған транзакцияны декодлағандан һуң, уның аныҡ ниәтен күрһәткәндән, ғәмәлгә ашырылған сәйәсәтен күрһәткәндән һәм раҫланған иҫәп-хисап асҡысы менән имза ҡуйғандан һуң ғына мөһөрләй ала. Был ярҙамсы был раҫланған ҡултамғаһын ҡабул итә; ул бер ҡасан да яһамай:

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

Репозиторийҙағы `connect_app` һәм `connect_wallet` миҫалдары — протокол демонстрациялары: ҡушымта аҡса янсығының URI-ын, токенын да ҡушып, стандарт сығарылышҡа баҫтыра, ә аҡса янсығы токендарын командалар юлы аргументтары итеп ала һәм һоралған байттарҙы декодламайынса һәм күрһәтмәйенсә уларға ҡул ҡуя. Уларҙы тик кадрҙарҙы өйрәнеү өсөн генә ҡулланығыҙ, бер ҡасан да Taira аҡса янсығын тормошҡа ашырыу итеп ҡулланмағыҙ.

## Тикшереү {#verify}

кире ҡайтарылған хэш һаҡлағыҙ һәм киләсәктең һуңғы торошон асыҡ хужалар йомғаҡлау пункты аша раҫлағыҙ:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

Тикшереү бары тик JavaScript көтөү ярҙамсыһы тапшырылған транзакция хэшиғы өсөн `Applied` күҙәткәндә генә уңышлы була, ә тәғәйенләнешендәге хужалыҡ күсереүҙе сағылдыра. HTTP ҡабул итеү йәки аҡса янсығын раҫлау ғына иҫәп-хисап яҙмаһының тамамланыуы түгел.

## Проблемаларҙы хәл итеү {#troubleshooting}

- `registerConnectSession`-дан `connect_disabled` коды менән `503` йәки `404` яуабы был узелда ретранслятор сеансын булдырып булмауын аңлата. Connect ҡабыҙылған локаль селтәргә күсегеҙ; запас юл итеп ҡушымта йәки идара итеү токендарын үҙегеҙ ташымағыҙ.
- `USER_DENIED` - букмекер ҡарар. уны терминал файҙаланыусыһы һөҙөмтәһе булараҡ һаҡлап ҡалыу урынына ҡабатланма раҫлау саҡырыуҙарын асыу.
- Белешмә менән иҫәптең тап килмәүе йәки раҫлауҙың ғәмәлһеҙ ҡултамғаһы сессияны тамамларға тейеш. Идентификация бәйләнештәре боҙолғандан һуң, аҡса янсығына ҡул ҡуйыуын бер ҡасан да һорамағыҙ.
- `public_key_hex does not control authority` - теркәлеү мәғлүмәттәре һәм раҫланған I105 таныҡлыҡ килешмәүе. был өлкәлә эфемер портфель транспорт асҡысын ҡуллана алмай.
- Кире ҡағылған айырым ҡултамға, ғәҙәттә, әҙерләү менән тапшырыу араһында һорау яланы йәки ағымдағы комиссия иҫәбе үҙгәргәнен аңлата. Яңы һорау төҙөгөҙ; иҫке ҡултамғаны бер ҡасан да күсереп ҡуймағыҙ.
- Алдан ҡабул ителгән signed request-тың теүәл replay-ы idempotent була. Яңынан башлау өсөн ваҡыт үтеүҙе сәбәп итеп ҡабул итер алдынан кире ҡайтарылған транзакцияның хэшенә һорау бирергә кәрәк.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Браузеры тоташтырыуҙы ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js) буйынса тормошҡа ашырыу
- [Браузеры тоташтырыу һынауҙары ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust ҡушымта рамкаһы өлгөһө ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust портфель рамкаһы миҫалы ҡуйылған commit-та](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Torii OpenAPI схемаһы](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus хеҙмәттәр](/ba/blockchain/sora-nexus-services.md)
- [Функциональ активтар](./fungible-assets.md)
- [Транзакцияларҙы тапшырыу һәм тикшереү](./submit-and-verify-transactions.md)
