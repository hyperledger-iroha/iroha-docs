---
translation_locale: am
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Wallet ግንኙነት የንብረት ማስተላለፍን ያጽድቁ {#wallet-connect-approve-an-asset-transfer}

## ውጤት {#outcome}

በአሳሽ ውስጥ የ Iroha የግንኙነት ክፍለ ጊዜ ይፍጠሩ፣ ለአንድ I105 የኪስ ቦርሳ ማንነት ምስጠራ ፍቃድ ያግኙ፣ ያ የኪስ ቦርሳ የ Torii ትክክለኛ የንብረት ማስተላለፍ የመነጨ ጀማሪ መዋቅር እንዲፈርም ይጠይቁ፣ የተነጠለውን ፊርማ ያስገቡ እና የተተገበረውን የመጨረሻነት ይጠብቁ።

## ቅድመ ሁኔታዎች {#prerequisites}

- `@iroha/iroha-js` እና HTTPS የሚጠቀም የአሳሽ መተግበሪያ።
- Iroha v1ን ያገናኙ እና ባለ አንድ ቁልፍ Ed25519 I105 መለያን የሚቆጣጠር የኪስ ቦርሳ።
- የአሁኑ Taira ሰንሰለት መታወቂያ እና ሰንሰለት መለያ፣ የኪስ ቦርሳው የተመዘገበው ትንሽ ሆሄያት Ed25519 የህዝብ ቁልፍ ሄክስ፣ በባለቤትነት ሊተላለፍ የሚችል ንብረት እና ነጠላ ፕሮቶኮል-ደረጃ I105 መድረሻ።
- አሁን ባለው Taira የቴስትኔት የገንዘብ ድጋፍ አገልግሎት ምላሽ የተመለሰው የክፍያ ንብረት መታወቂያ። ምሳሌው የቀጥታ ክፍያ ዋጋ ግምት በዚያ መታወቂያ ላይ ያረጋግጣል; የተቀዳ የንብረት መለያን በጭራሽ አያካትትም።
- ግንኙነት በተመረጠው Torii ላይ መንቃት አለበት። QR ወይም ጥልቅ አገናኝ ከማሳየትዎ በፊት ያረጋግጡ -

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Taira ማገናኘት ተሰናክሏል ወይም `404`/`503` ከመለሰ፣ ኮኔክሽን የነቃ የመነጨ የአካባቢ አውታረ መረብ ይጠቀሙ። ተራ የንብረት ማስተላለፍ የኪስ ቦርሳው በቂ የሚተላለፍ መጠን እና የክፍያ ቀሪ ሂሳብ እንዲኖረው ይጠይቃል።

## እርምጃዎች {#steps}

### 1. አንድ የኪስ ቦርሳ ማስጀመሪያ መቆጣጠሪያ ያቅርቡ {#_1-provide-one-wallet-launch-control}

ከታች ያለው JavaScript ይህንን አካል በማመልከቻው ገጽ ላይ ይጠብቃል -

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

በሌላ መሳሪያ ላይ ላለው የኪስ ቦርሳ ከ QR ኮድ ጋር ተመሳሳይ URI ይስጡ። URI በኪስ ቦርሳ ወሰን ያለው የማስተላለፊያ ቶከን ቶከን ይይዛል፣ ስለዚህ በመተንተን፣ ምዝግብ ማስታወሻዎች፣ ማጣቀሻዎች ወይም የብልሽት ሪፖርቶች ውስጥ አያስቀምጡት።

### 2. ይፍጠሩ፣ ያጽድቁ፣ ይፈርሙ እና ያስገቡ {#_2-create-approve-sign-and-submit}

ይህ የአሳሽ ሞጁል ከማመልከቻ ሁኔታዎ ተጨባጭ እሴቶችን ይቀበላል። የመጀመሪያው `POST /v1/assets/transfer` የመፈረም መስኮችን ትቶ የተስተካከለ የግብይት ማስጀመሪያ መዋቅር ከክፍያ ዋጋ ግምት ጋር ይመልሳል። ሁለተኛው ለተመሳሳይ የዝውውር ጥያቄ የኪስ ቦርሳውን የህዝብ ቁልፍ እና የተነጠለ ፊርማ ብቻ ይጨምራል።

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

`token_app`፣ `token_management` እና `token_relay`ን በመተግበሪያ ማህደረ ትውስታ ውስጥ ያስቀምጡ። የኪስ ቦርሳው ማስጀመሪያ URI/ቶከን ብቻ ወደ ቦርሳው ይሻገራል። የግንኙነት ማጽደቁ በመለያው ማንነት የተፈረመ ነው; በማጽደቁ ውስጥ ያለው X25519 `walletPublicKey` ጊዜያዊ የመጓጓዣ ቁልፍ እንጂ የመለያው Ed25519 ፊርማ ቁልፍ አይደለም።

### 3. በኪስ ቦርሳ ትግበራ ውስጥ የ Rust የፍሬም ዓይነቶችን ይጠቀሙ {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

የ Rust ፕሮቶኮል ወለል ፊርማ ማተም የሚችለው የኪስ ቦርሳው የተጠየቀውን ግብይት ዲኮድ ካደረገ፣ ትክክለኛውን አላማ ካሳየ፣ ፖሊሲውን ከተተገበረ እና በተፈቀደው የመለያ ቁልፍ ከተፈረመ በኋላ ብቻ ነው። ይህ ረዳት ያንን የተረጋገጠ ፊርማ ይቀበላል; አንዱን አይፈጥርም -

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

የማከማቻው `connect_app` እና `connect_wallet` ምሳሌዎች የፕሮቶኮል የሙከራ አብነቶች ናቸው ዲተርሚኒስቲክ የመጓጓዣ ቁልፎችን ይጠቀማሉ፣ በውፅዓት ውስጥ ቶከኖችን ያጋልጣሉ፣ እና የኪስ ቦርሳ የሙከራ አብነት የዱሚ ፊርማ ይመልሳል። ክፈፎችን ብቻ ለማጥናት ይጠቀሙባቸው፣ በጭራሽ እንደ Taira የኪስ ቦርሳ ትግበራ።

## አረጋግጥ {#verify}

የተመለሰውን ምስጠራ ሃሽ ያስቀምጡ እና የመድረሻውን ድህረ-ሁኔታ በሕዝብ ባለቤቶች API የመጨረሻ ነጥብ ያረጋግጡ -

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

ማረጋገጫው የሚሳካው JavaScript አስተናጋጁ ለቀረበው ግብይት ምስጠራ ሃሽ `Applied` ሲመለከት እና የመድረሻ መያዣው ዝውውሩን ሲያንፀባርቅ ብቻ ነው። HTTP መቀበል ወይም የኪስ ቦርሳ ማፅደቅ ብቻውን የብሎክቼይን መዝገብ ፍጻሜ አይደለም።.

## መላ ፍለጋ {#troubleshooting}

- `404`፣ `503` ወይም `enabled: false` በግንኙነት ሁኔታ ውስጥ በዚያ ኖድ ላይ ምንም የማስተላለፊያ ክፍለ ጊዜ ሊፈጠር አይችልም ማለት ነው። ወደ ነቃ localnet ቀይር; መተግበሪያን ወይም የአስተዳደር ቶከኖችን እራስዎ ለማጓጓዝ አይመለሱ።
- `USER_DENIED` የኪስ ቦርሳ ውሳኔ ነው።. ተደጋጋሚ የማጽደቅ ጥያቄዎችን ከመቀስቀስ ይልቅ እንደ የመጨረሻ ተጠቃሚ ውጤት ያቆዩት።
- የማጽደቅ-መለያ አለመመጣጠን ወይም ልክ ያልሆነ የማጽደቅ ፊርማ ክፍለ-ጊዜውን መዝጋት አለበት። የማንነት ማሰር ካልተሳካ በኋላ የኪስ ቦርሳው እንዲፈርም በጭራሽ አይጠይቁ።
- `public_key_hex does not control authority` ማለት የምዝገባ ውሂብ እና የጸደቀው I105 ማንነት አይዛመዱም ማለት ነው። ጊዜያዊ የኪስ ቦርሳ ማጓጓዣ ቁልፍ በዚህ መስክ መጠቀም አይቻልም።
- ፊርማ ወይም የመነጨ የጀማሪ መዋቅር አለመቀበል ማለት ብዙውን ጊዜ የጥያቄ መስክ ወይም የቀጥታ ክፍያ ዋጋ ግምት በማዘጋጀት እና በማስገባት መካከል ተቀይሯል። አዲስ ጥያቄ ይገንቡ; የድሮውን ፊርማ በጭራሽ አይተክሉ።
- ቀደም ሲል ተቀባይነት ያለው የተፈረመ ጥያቄ ትክክለኛ ድጋሚ ማጫወት አይደምፖተንት ነው። የጊዜ ማብቂያውን እንደገና ለመጀመር እንደ ምክንያት ከመያዝዎ በፊት የተመለሰውን የግብይት ምስጠራ ሃሽ ይጠይቁ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የአሳሽ አገናኝ ትግበራ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የአሳሽ አገናኝ ሙከራዎችን](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust የመተግበሪያ ፍሬም ምሳሌ በተሰካው የምንጭ-ኮድ ክለሳ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust የኪስ ቦርሳ ፍሬም ምሳሌ በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [ተሰክቷል Torii OpenAPI እቅድ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus አገልግሎቶች](/am/blockchain/sora-nexus-services.md)
- [ፈንገስ ሊሆኑ የሚችሉ ንብረቶች](./fungible-assets.md)
- [ግብይቶችን ያስገቡ እና ያረጋግጡ](./submit-and-verify-transactions.md)
