---
translation_locale: kk
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 38283321d51ddbb528272bb4429906eb41545ed3933ae695fb05a24675bff9c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# "Wallet Connect": активтерді ауыстыруды мақұлдаңыз {#wallet-connect-approve-an-asset-transfer}

## Нәтижесі {#outcome}

Браузерде Iroha қосылу сеансын жасаңыз, бір I105 қапсық идентификаторы үшін криптографиялық рұқсат алыңыз, осы қапсыққа Torii активтерді аударудың нақты бағанасына қол қоюын сұраңыз, бөлек қолтаңбаны тапсырыңыз және Қолданылған аяқталуды күтіңіз.

## Алдын ала талаптар {#prerequisites}

- `@iroha/iroha-js` және HTTPS пайдаланушы браузерлік қолданба.
- Iroha Connect v1 бағдарламасын іске асыратын және Ed25519 I105 бір кілтілік тіркелгісін бақылайтын қоршау.
- Қазіргі Taira тізбегі ID және тізбектік айырмашылық, қапшықтың тіркелген кіші әріпті Ed25519 қоғамдық кілт шешесі, меншікті аударылатын актив және каноникалық I105 бағыт.
- Ағымдағы Taira кранды жауаппен қайтарылған алым активі ID. Мысал ID-ге қарағанда нақты алым бағасын тексереді; ол ешқашан көшірілген актив идентификаторын енгізбейді.
- Тіркелу Torii таңдалғанда рұқсат етілуі тиіс. QR немесе терең сілтеме көрсетуден бұрын тексеріңіз:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Егер Taira Connect рұқсат етілмеген деп есептейді немесе `404`/`503` қайтарса, Connect қосылған жергiлiктi желiн пайдаланыңыз. Әдеттегi активтердiң ауысуы сондай-ақ қапшықтың жеткілікті аударылатын мөлшерге ие болуын және алымның балансын қажет етеді.

## Қадамдар {#steps}

### 1.Бір қапшықты іске қосу бақылауын қамтамасыз ету. {#_1-provide-one-wallet-launch-control}

Төмендегі JavaScript осы элементті өтінім беттерінде күтеді:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Басқа құрылғыдағы қоршау үшін QR кодымен бірдей URI қайтарып беріңіз. URI қоршаудың масштабталған релей токенін ұстайды, сондықтан оны аналитикаға, журналдарына, сілтемелерге немесе авариялық есептерге енгізбеңіз.

### 2. Жазу, бекіту, қол қою және тапсыру {#_2-create-approve-sign-and-submit}

Бұл браузер модулі сіздің қолданбаңыздың күйінен нақты мәндерді қабылдайды. Біріншісі `POST /v1/assets/transfer` қолтаңбалау өрістерін қалдырады және цитаталанған, нұсқалы транзакция қойындысын қайтарады. Екіншісі бірден-бір көшіру өтінішіне қапшықтың қоғамдық кілті мен бөлек қолтаңбаны ғана қосады.

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

`token_app`, `token_management` және `token_relay` қолданбалық жадында сақтаңыз. Қапшықты іске қосу URI/токені ғана қолма-қол ақшаға кесіледі. Connect рұқсатына тіркелгі сәйкестігі қол қояды; бекітілудегі X25519 `walletPublicKey` - бұл эфемерлік тасымалдау кілті, емес, шоттың Ed25519 қол қою кілтісі.

### 3. Портфельді іске асыруда Rust кадр түрлерін қолдану {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust протокол беті қолтаңбаны тек қапсық сұралған транзакцияны шифрландырғаннан кейін ғана бекіте алады, оның нақты ниеті, қолданылған саясаты көрсетілді және бекітілген шот кілтімен қол қойылды. Бұл көмекші осы расталған қолтаңбаны қабылдайды; ол бірде жасамайды:

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

Репозиторийдің `connect_app` және `connect_wallet` мысалдары протоколдық фиксаторлар: олар детерминистік тасымалдау кілттерін пайдаланады, шығыстағы токендерді ашады, ал қапшықтың фиксаторы қалталы қолтаңбаны қайтарады. Оларды тек кадрларды зерттеу үшін ғана қолданыңыз, ешқашан Taira қапшықты іске асыру ретінде емес.

## Тексеру {#verify}

Қайта қайтарылған хешты сақтаңыз және мемлекеттік иеленушілердің соңғы нүктесі арқылы бағыттың кейінгі жағдайын растаңыз:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

Тек JavaScript официанты тапсырылған транзакция хэшінде `Applied` байқаған кезде ғана тексеру сәтті болады, ал мақсаттағы холдинг көшірмені көрсетеді. HTTP қабылдау немесе қоршауды бекіту тек бухгалтерлік кітаптың түпкіліктілігі болып табылмайды.

## Қиындықтарды шешу {#troubleshooting}

- `404`, `503` немесе `enabled: false` қосылу күйінен бұл түйінде релей сессиясы құрылмауы мүмкін дегенді білдіреді. Белгіленген локальдік желіге ауысу; қолданбаларды немесе басқару токендерін өзіңіз тасымалдауға қайта оралмаңыз.
- `USER_DENIED` - бұл қоршау шешімі. Қайта-қайта мақұлдану сұрауларын ашудың орнына, оны терминал пайдаланушысының нәтижесі ретінде сақтаңыз.
- Бөлiмдi бекiту есебiнiң сәйкес келмеуi немесе жарамсыз бекiту қолтаңбасы сессияны аяқтауы тиiс. Адамның жеке басын тіркеу сәтсіз болғаннан кейін ақшаны қолтаңбалауды сұрамаңыз.
- `public_key_hex does not control authority` - тіркеу деректері мен бекітілген I105 сәйкестік келіспеушілігін білдіреді. Бұл салада эфемерлік әмиян тасымалдау кілті қолданылмайды.
- Қолтаңба немесе бас тарту, әдетте, дайындық пен тапсыру аралығында өзгертілген сұраныс өрісі немесе нақты алымды білдіреді. Жаңа сұраныс жасаңыз; ескі қолтаңбаны ешқашан алмастыруға болмайды.
- Қол қойылған өтiнiштiң нақты қайта ойнауы мүлдем мүмкiндiк бермейдi. Қайтадан бастау үшін уақыт үзілуін себеп ретінде қарамас бұрын, оның қайтарылған транзакция хэшiне сұрау салу.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [Пайдаланушы қосылымын орнатылған commit-те іске асыру](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [Браузерлік қосылым сынақтары тіркелген commit-те](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust pinned commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)дегі қолданба кадр мысалы
- [Rust қапшықталған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)дегі қоршау үлгісі
- [Torii OpenAPI схемасы](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json) тігілген
- [SORA Nexus қызметтері](/kk/blockchain/sora-nexus-services.md)
- [Қатты активтер](./fungible-assets.md)
- [Транзакцияларды тапсыру және тексеру](./submit-and-verify-transactions.md)
