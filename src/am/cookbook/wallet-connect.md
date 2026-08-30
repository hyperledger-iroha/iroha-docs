---
translation_locale: am
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 38283321d51ddbb528272bb4429906eb41545ed3933ae695fb05a24675bff9c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Wallet Connect: የንብረት ማስተላለፍን ማጽደቅ {#wallet-connect-approve-an-asset-transfer}

## ውጤቱ {#outcome}

አንድ ይፍጠሩ Iroha በአሳሽ ውስጥ የውይይት ክፍለ ጊዜን ያገናኙ, ለአንድ የክሪፕቶግራፊ ማጽደቅን ያግኙ I105 የኪስ ቦርሳ ማንነት፣ ያንን ኪስ እንዲፈርም ጠይቅ Torii የንብረት ማስተላለፍ ትክክለኛውን መሰኪያ ፣ የተለዩ ፊርማዎችን ያቅርቡ እና ለተተገበረው የመጨረሻነት ይጠብቁ ።

## ቅድመ ሁኔታዎች {#prerequisites}

- `@iroha/iroha-js` እና HTTPS የሚጠቀም አሳሽ መተግበሪያ።
- Iroha Connect v1 የሚተገበርና የአንድ ቁልፍ Ed25519 I105 መለያ የሚቆጣጠር የኪስ ቦርሳ።
- የአሁኑ Taira ሰንሰለት ID እና ሰንሰለት ልዩነት ፣ የኪስ ቦርሳው የተመዘገበ አነስተኛ ፊደላት Ed25519 የህዝብ ቁልፍ hex ፣ ባለቤትነት ያለው ተንቀሳቃሽ ንብረት እና ቀኖናዊ I105 መድረሻ።
- የአሁኑ Taira faucet ምላሽ የተመለሰው የክፍያ ንብረቱ ID። ምሳሌው የቀጥታ ክፍያ ዋጋን ከ ID ጋር ያረጋግጣል; እሱ በጭራሽ የተገለጸ የንብረት መታወቂያ አያካትትም.
- በተመረጠው Torii ላይ ማገናኘት መቻል አለበት። አንድ QR ወይም ጥልቅ አገናኝ ከማሳየትዎ በፊት ያረጋግጡ

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Taira የግንኙነት ማሰናከል ወይም `404`/`503` ሪፖርቶችን የሚያመለክት ከሆነ, Connect የተፈጠረውን አካባቢያዊ አውታረመረብ ይጠቀሙ. መደበኛ የንብረት ማስተላለፍ ደግሞ ቦርሳው በቂ የማስተላለፊያ መጠን እና ክፍያ ሚዛን እንዲይዝ ይጠይቃል.

## እርምጃዎች {#steps}

### 1. አንድ የኪስ ቦርሳ ማስጀመሪያ መቆጣጠሪያ ያቅርቡ {#_1-provide-one-wallet-launch-control}

ከታች ያለው JavaScript ይህ ንጥረ ነገር በማመልከቻው ገጽ ላይ ይጠበቃል-

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

ተመሳሳይ ያድርጉ URI እንደ አንድ QR በሌላ መሣሪያ ላይ ላለው የኪስ ቦርሳ ኮድ። URI የኪስ ቦርሳ-ተኮር ሪሌይ ምልክት ይዟል, ስለዚህ ትንታኔዎች ውስጥ ማስቀመጥ አይደለም, መዝገቦች, አመልካቾች, ወይም የአደጋ ሪፖርቶች.

### 2. ይፍጠሩ፣ ያፀድቁ፣ ይፈርሙ እና ያቅርቡ {#_2-create-approve-sign-and-submit}

ይህ የአሳሽ ሞጁል ከመተግበሪያዎ ሁኔታ የተወሰኑ እሴቶችን ይቀበላል ። የመጀመሪያው `POST /v1/assets/transfer` የፊርማ መስኮችን ያስወግዳል እና የተጠቀሰ ፣ ስሪት ያለው የትራንስክሽን መሰንጠቂያ ይመልሳል ። ሁለተኛው በተመሳሳይ የማስተላለፊያ ጥያቄ ላይ የኪስ ቦርሳውን የህዝብ ቁልፍ እና ገለልተኛ ፊርማ ብቻ ይጨምራል።

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

ይቀጥሉ `token_app`, `token_management`, እና `token_relay` በመተግበሪያው ማህደረ ትውስታ ውስጥ። URI/token ወደ ቦርሳው ይሻገራል። የ Connect ማጽደቅ በመለያ መታወቂያ የተፈረመ ነው; X25519 `walletPublicKey` በመፈቃደሪያው ውስጥ ጊዜያዊ የትራንስፖርት ቁልፍ ነው እንጂ የሂሳቡ ኤድ 25519 ፊርማ ቁልፍ አይደለም ።

### 3. በኪስ ቦርሳ ትግበራ ውስጥ የ Rust ክፈፍ አይነቶችን ይጠቀሙ {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

የ Rust ፕሮቶኮል ወለል ፊርማውን መዘጋት የሚችለው የኪስ ቦርሳው የተጠየቀውን ግብይት ከገለጸ በኋላ ብቻ ነው ፣ ትክክለኛ ዓላማውን ያሳያል ፣ ፖሊሲውን ተግባራዊ ያደርጋል ፣ እና ከተፈቀደለት የመለያ ቁልፍ ጋር ይፈርማል ። ይህ ረዳት ያንን የተረጋገጠ ፊርማ ይቀበላል ፤ አንድን አይሠራም-

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

የመረጃ ቋቱ `connect_app` እና `connect_wallet` ምሳሌዎች የፕሮቶኮል ማያዣዎች ናቸው-የምርጫ ትራንስፖርት ቁልፎችን ይጠቀማሉ ፣ በውጤት ውስጥ ቶከኖችን ያጋልጣሉ ፣ እናም የኪስ ቦርሳ ማያዣው የእንቆቅልሽ ፊርማ ይመልሳል ። ፍሬሞችን ለማጥናት ብቻ ይጠቀሙባቸው ፣ በጭራሽ እንደ Taira Wallet ትግበራ አይጠቀሙም ።

## ያረጋግጡ {#verify}

የተመለሰውን ሃሽ ያስቀምጡ እና በሕዝብ ባለቤቶች መጨረሻ ነጥብ በኩል የመድረሻውን የወደፊት ሁኔታ ያረጋግጡ።

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

ማረጋገጫ የሚሳካው JavaScript አገልጋይ ለተቀረበው የግብይት ሃሽ `Applied` ሲመለከት እና የመድረሻ ባለቤትነት ዝውውሩን በሚያንፀባርቅበት ጊዜ ብቻ ነው። HTTP ተቀባይነት ወይም የኪስ ቦርሳ ማጽደቅ ብቻውን መቁጠሪያ የመጨረሻነት አይደለም.

## ችግሮችን መፍታት {#troubleshooting}

- `404`, `503`, ወይም `enabled: false` ከግንኙነት ሁኔታ ማለት በዚያ አንጓ ላይ ምንም ተለጣፊ ክፍለ ጊዜ ሊፈጠር አይችልም. ወደ ተቀባይነት ያለው አካባቢያዊ አውታረመረብ ይቀይሩ; መተግበሪያዎችን ወይም የማኔጅመንት ቶኮኖችን በራስዎ ለማስተላለፍ አይመለሱ ።
- `USER_DENIED` አንድ የኪስ ቦርሳ ውሳኔ ነው. በተደጋጋሚ ማጽደቂያ ትዕዛዞች ከመክፈት ይልቅ እንደ ተርሚናል ተጠቃሚ ውጤት ይጠብቁ.
- የማረጋገጫ-ሂሳብ አለመመሳሰል ወይም ልክ ያልሆነ የምስክርነት ፊርማ ክፍለ ጊዜውን ያቆማል ። መታወቂያ ማያያዝ ከከሸፈ በኋላ የኪስ ቦርሳው እንዲፈርም በጭራሽ አይጠይቁ።
- `public_key_hex does not control authority` ማለት የምዝገባ መረጃ እና የተረጋገጠ I105 መታወቂያ አለመግባባት ነው.
- አንድ ፊርማ ወይም መሰኪያ ውድቅ አብዛኛውን ጊዜ ጥያቄ መስክ ወይም በቀጥታ ክፍያ ዋጋ በመዘጋጀት እና በማቅረብ መካከል ተለውጧል ማለት ነው. አዲስ ጥያቄ ይገንቡ; አሮጌውን ፊርማ በጭራሽ አትተክሉ.
- ቀደም ሲል ተቀባይነት ያገኘውን የተፈረመ ጥያቄ ትክክለኛ መልሶ ማጫወት የማይቻል ነው። የጊዜ ገደቡን እንደ አዲስ ለመጀመር ምክንያት ከማድረግዎ በፊት የተመለሰውን ግብይት ሃሽ መጠየቅ ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [በፒን የተቀመጠው ተልእኮ ላይ የአሳሽ አገናኝ ትግበራ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [የአሳሽ አገናኝ ሙከራዎች በተሰቀለበት ተልእኮ ላይ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust በተሰቀለ ኮሚቴ ላይ የመተግበሪያ ክፈፍ ምሳሌ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust የኪስ ቦርሳ ክፈፍ ምሳሌ በፒን የተቀመጠ ኮሚት](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs) ላይ
- [የተጣራ Torii OpenAPI መርሃግብር](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus አገልግሎቶች](/am/blockchain/sora-nexus-services.md)
- [ተንቀሳቃሽ ሀብቶች](./fungible-assets.md)
- [ግብይቶችን ማስገባት እና ማረጋገጥ ](./submit-and-verify-transactions.md)
