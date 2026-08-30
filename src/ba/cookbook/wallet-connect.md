---
translation_locale: ba
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 38283321d51ddbb528272bb4429906eb41545ed3933ae695fb05a24675bff9c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Wallet Connect: активтарҙы күсереүгә рөхсәт бирегеҙ {#wallet-connect-approve-an-asset-transfer}

## Һөҙөмтә {#outcome}

Браузерҙа Iroha Connect сеансын булдырыу, бер I105 аҡса янсығы идентификацияһы өсөн криптографик раҫлау алыу, был аҡса янсығына Torii мөлкәт күсереүенең теүәл асфальтҡа ҡул ҡуйыуын һорау, айырым имза тапшырыу һәм ҡулланылған тамамланыуға тиклем көтөр.

## Шарттар {#prerequisites}

- `@iroha/iroha-js` һәм HTTPS менән браузер ҡушымтаһы.
- Iroha Connect v1 программаһын тормошҡа ашырған һәм Ed25519 I105 аккаунтын яңғыҙ асҡыс менән контролдә тота торған аҡса янсығы.
- Хәҙерге Taira сылбыр ID һәм сылбыр айырмасыһы, букмекерҙың теркәлгән бәләкәй хәрефле Ed25519 асыҡ асҡыслы алты йөҙө, үҙ милкендәге күсергә мөмкин булған актив һәм каноник I105 тәғәйенләнеше.
- Һалым активы ID хәҙерге Taira кран яуап менән кире ҡайтарыла. Миҫал туранан-тура түләү цитатаһын раҫлай шул ID; ул бер ҡасан да күсергән актив идентификаторы индереп булмай.
- Һайланған Torii менән бәйләнеш булдырылырға тейеш. QR йәки тәрән һылтанма күрһәткәнсе тикшерегеҙ:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Әгәр Taira хәбәр итһә Connect һүндерелгән йәки кире ҡайтарһа `404`/`503`, Connect ҡеүәтләнгән булдырылған локаль селтәрҙән файҙаланығыҙ. Ғәҙәти активтарҙы күсереү өсөн аҡса янсығының күсергә мөмкин булған күләме һәм түләүҙәр балансы етерлек булырға тейеш.

## Аҙымдар {#steps}

### 1. Бер аҡса янсығы менән идара итеүҙе тәьмин итегеҙ. {#_1-provide-one-wallet-launch-control}

JavaScript түбәндәге элемент заявка битендә ошо элементты көтә:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

QR кодын икенсе ҡоролмала булған аҡса янсығы өсөн бер үк URI кодын тапшырығыҙ. URI аҡса янсыгы буйынса күсә торған релей токенды тота, шуға күрә уны аналитикаға, журналдарға, йүнәлтеүҙәргә йәки авариялар тураһында отчеттарға индермәгеҙ.

### 2. төҙөү, раҫлау, ҡул ҡуйыу һәм тапшырыу {#_2-create-approve-sign-and-submit}

Был браузер модуле ҡушымта торошонан конкрет ҡиммәттәрҙе ҡабул итә. беренсе `POST /v1/assets/transfer` ҡултамға баҫыуҙарын ситләтә һәм цитаталанған, версиялы транзакция баҫҡысын кире ҡайтара. Икенсеһе шул уҡ күсереү һорауына аҡса янсығының асыҡ асҡысын һәм айырым ҡултамғаһын ғына өҫтәй.

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

Репозиториеның `connect_app` һәм `connect_wallet` миҫалдары - протокол ҡушымталары: улар детерминистик транспорт асҡыстарын ҡуллана, сығанаҡта токендарҙы аса, ә аҡса янсығы ҡушымтаһы ялған имзаны кире ҡайтара. Уларҙы фәҡәт кадрҙарҙы өйрәнеү өсөн генә ҡулланығыҙ, бер ҡасан да Taira аҡса янсығын тормошҡа ашырыу сифатында ҡулланырға ярамай.

## Тикшереү {#verify}

кире ҡайтарылған хэш һаҡлағыҙ һәм киләсәктең һуңғы торошон асыҡ хужалар йомғаҡлау пункты аша раҫлағыҙ:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

Тикшереү бары тик JavaScript официант тапшырылған транзакция хэшиғы өсөн `Applied` күҙәткәндә генә уңышлы була, ә тәғәйенләнешендәге хужалыҡ күсереүҙе сағылдыра. HTTP ҡабул итеү йәки аҡса янсығын раҫлау ғына иҫәп-хисап яҙмаһының тамамланыуы түгел.

## Проблемаларҙы хәл итеү {#troubleshooting}

- `404`, `503` йәки `enabled: false` Connect статусынан был узелда эстафета сессияһы булдырылмай тигәнде аңлата. localnet-ҡа күсерегеҙ; ҡушымталарҙы йәки менеджмент токендарын үҙегеҙҙе күсереп йөрөтмәгеҙ.
- `USER_DENIED` - букмекер ҡарар. уны терминал файҙаланыусыһы һөҙөмтәһе булараҡ һаҡлап ҡалыу урынына ҡабатланма раҫлау саҡырыуҙарын асыу.
- Белешмә менән иҫәптең тап килмәүе йәки раҫлауҙың ғәмәлһеҙ ҡултамғаһы сессияны тамамларға тейеш. Идентификация бәйләнештәре боҙолғандан һуң, аҡса янсығына ҡул ҡуйыуын бер ҡасан да һорамағыҙ.
- `public_key_hex does not control authority` - теркәлеү мәғлүмәттәре һәм раҫланған I105 таныҡлыҡ килешмәүе. был өлкәлә эфемер портфель транспорт асҡысын ҡуллана алмай.
- Ҡул ҡуйыу йәки баҫҡыс кире ҡағыу, ғәҙәттә, әҙерләү һәм тапшырыу араһында үҙгәртелгән заявка яланы йәки туранан-тура түләү ставкаһын аңлата. Яңы заявка төҙөй; иҫке ҡултамғаны бер ҡасан да күсереп ҡуйма.
- Быға тиклем ҡабул ителгән ҡул ҡуйылған үтенестәрҙең теүәл ҡабатланыуы мөмкин түгел. Яңынан башлау өсөн ваҡыт үтеүҙе сәбәп итеп ҡабул итер алдынан кире ҡайтарылған транзакцияның хэшенә һорау бирергә кәрәк.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Браузеры тоташтырыуҙы ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js) буйынса тормошҡа ашырыу
- [Браузеры тоташтырыу һынауҙары ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust ҡушымта рамкаһы өлгөһө ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust портфель рамкаһы миҫалы ҡуйылған commit-та](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Torii OpenAPI схемаһы](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus хеҙмәттәр](/ba/blockchain/sora-nexus-services.md)
- [Функциональ активтар](./fungible-assets.md)
- [Транзакцияларҙы тапшырыу һәм тикшереү](./submit-and-verify-transactions.md)
