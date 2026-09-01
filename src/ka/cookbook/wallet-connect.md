---
translation_locale: ka
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# საფულე Connect: დაამტკიცეთ აქტივების გადაცემა {#wallet-connect-approve-an-asset-transfer}

## შედეგები {#outcome}

შეიქმნას Iroha Connect სესია ბრაუზერში, მიიღოს კრიპტოგრაფიული დამტკიცება ერთი I105 საფულის იდენტობა, მოითხოვოს რომ საფულე ხელმოწერა ზუსტი აქტივების გადაცემა-გენერირებული საწყისი სტრუქტურა Torii , წარადგინოს განშორებული ხელმოწერა, და ველოდოთ Applied საბოლოო.

## წინაპირობები {#prerequisites}

- ბრაუზერის აპლიკაცია, რომელიც იყენებს `@iroha/iroha-js` და HTTPS;
- საფულე, რომელიც ახორციელებს Iroha Connect v1 და აკონტროლებს Ed25519 I105 ერთმნიშვნელოვან ანგარიშს.
- ამჟამინდელი Taira ჯაჭვის ID და ჯაჭვური დისკრიმინანტი, საფულის რეგისტრირებული მცირე ასოებით Ed25519 საჯარო გასაღები hex, საკუთრებაში არსებული გადაცემადი აქტივი და კანონიკური I105 მიმართულება.
- საფასური აქტივის ID, რომელიც დაბრუნებულია მიმდინარე Taira ტესტური მონეტების გამცემის პასუხით. მაგალითი ადასტურებს ცოცხალი საფასურის ფასის შეფასებას ამ ID- სთან შედარებით; ის არასოდეს ჩასმენს ასახული აქტივის იდენტიფიკატორის.
- გაერთიანება უნდა იყოს ჩართული შერჩეული Torii. შეამოწმეთ, სანამ გამოჩნდება QR ან ღრმა ბმული:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

თუ Taira აცხადებს, რომ Connect გათიშულია ან ბრუნდება `404`/`503`, გამოიყენეთ გენერირებული ლოკალური ქსელი, სადაც Connect არის ჩართული. ჩვეულებრივი აქტივების გადაცემა ასევე მოითხოვს ფულის მფლობელობას საკმარისი გადასატანი რაოდენობის და საფასურის ბალანსი.

## ნაბიჯები {#steps}

### 1. უზრუნველყოს ერთი საფულე გაშვების კონტროლი {#_1-provide-one-wallet-launch-control}

JavaScript ქვემოთ მოცემული ელემენტი მოითხოვს განაცხადის გვერდზე:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

დააბრუნეთ იგივე URI კოდი, რაც QR ქაღალდისთვის სხვა მოწყობილობაზე. URI -ში ინახება საფულე-სკოპირებული რელე ტოქნი, ამიტომ არ დააყენოთ ის ანალიტიკაში, ლოგებში, რეფერერებში ან ავარიული შეტყობინებებში.

### 2. შექმნა, დამტკიცება, ხელმოწერა და წარდგენა {#_2-create-approve-sign-and-submit}

ეს ბრაუზერის მოდული იღებს კონკრეტულ ღირებულებებს თქვენი აპლიკაციის მდგომარეობისგან. პირველი `POST /v1/assets/transfer` გამორიცხავს ხელმოწერის ველები და უბრუნებს ვერსიურ ტრანზაქციის სტარტერთა სტრუქტურას საფასურის შეფასებით. მეორე მხოლოდ ამავე გადაცემის მოთხოვნაზე დაამატებს კაპიკის საჯარო გასაღების და განშორებული ხელმოწერა.

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

შენარჩუნება `token_app`, `token_management`, და `token_relay` აპლიკაციების მეხსიერებაში. მხოლოდ საფულე გაშვება URI/ტოკენი გადადის საფულეზე. Connect-ის დამტკიცებას ხელს აწერს ანგარიშის იდენტობა; X25519 `walletPublicKey` ნებართვაში არის დროებითი სატრანსპორტო გასაღები, და არა ანგარიშის Ed25519 ხელმოწერის გასაღები.

### 3. გამოიყენეთ Rust ჩარჩო ტიპები საფულეების განხორციელებაში {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust პროტოკოლის ზედაპირს ხელმოწერის გაფორმება შეუძლია მხოლოდ მას შემდეგ, რაც ქაღალდმა მოითხოვა ტრანზაქციის დეკოდირება, აჩვენა მისი ზუსტი განზრახვა, გამოყენებული პოლიტიკა და ხელი მოაწერა დამტკიცებული ანგარიშის გასაღებით. ეს დამხმარე იღებს ამ ვალიდირებულ ხელმოწერას; იგი არ ქმნის:

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

საცავის `connect_app` და `connect_wallet` მაგალითები არის პროტოკოლური ტესტის არტეფაქტები: ისინი იყენებენ დეტერმინისტურ ტრანსპორტულ საკიდებს, გამოყოფენ სიმბოლოებს გამოსავალში, ხოლო ქაღალდის კვლევის არტეფაკტი იბრუნებს ნამუშევრის ხელმოწერას. გამოიყენეთ ისინი მხოლოდ ჩარჩოების შესასწავლად, არასდროს როგორც Taira ქაღალდი განხორციელება.

## შემოწმება {#verify}

შეინახეთ დაბრუნებული კრიპტოგრაფიული ჰეში და დაადასტურეთ მიმართულების შემდგომ მდგომარეობა საჯარო მფლობელების API საბოლოო წერტილით:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

შემოწმება წარმატებული ხდება მხოლოდ მაშინ, როდესაც JavaScript-ის მოთამაშე შეამოწმებს `Applied` წარდგენილი ტრანზაქციის კრიპტოგრაფიული ჰეშისთვის და მიზნობრივი სათავსო ასახავს გადაცემას. HTTP მიღება ან ქაღალდის დამტკიცება მარტო არ არის ბლოკჩეინის რეესტრის საბოლოო მნიშვნელობა.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `404`, `503` ან `enabled: false` Connect სტატუსიდან ნიშნავს, რომ ამ კვანძზე ვერანაირი რელე სესიის შექმნა არ შეიძლება. გადადით ჩართულ ლოკალურ ქსელში; ნუ დაუბრუნდებით აპლიკაციის ტრანსპორტირებას ან მართვის ტოქენებს თავად.
- `USER_DENIED` არის ქაღალდის გადაწყვეტილება. შეინახეთ იგი როგორც ტერმინალური მომხმარებლის შედეგები ნაცვლად გახსნის განმეორებითი დამტკიცების მოთხოვნები.
- დამტკიცების ანგარიშის შეუსაბამობა ან არაკეთილსინდისიერი დამტკიცების ხელმოწერა უნდა დახუროს სესია. არასდროს მოითხოვოთ საფულეზე ხელმოწერას მას შემდეგ, რაც იდენტობის დამაკავშირებლობა ჩავარდება.
- `public_key_hex does not control authority` ნიშნავს რეგისტრაციის მონაცემებს და დამტკიცებული I105 იდენტობის უთანხმოებას. ამ სფეროში არ შეიძლება გამოყენებულ იქნას ფანჯრის ტრანსპორტის ღილაკი.
- ხელმოწერა ან გენერირებული სტარტერი სტრუქტურის უარყოფა, როგორც წესი, ნიშნავს მოთხოვნის ველს ან ცოცხალი საფასურის ფასის შეფასებას, რომელიც შეიცვლება მომზადებისა და წარდგენის პერიოდში. შეიქმნას ახალი მოთხოვნა; არასოდეს გადაიტანოს ძველი ხელმოწერა.
- უკვე მიღებული ხელმოწერილი მოთხოვნის ზუსტი გამოთქმა არის idempotent. შეკითხვა მისი დაბრუნებული ტრანზაქციის კრიპტოგრაფიული ჰეში, სანამ განიხილავს ვადაგზა როგორც მიზეზი დაიწყოს თავიდან.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [ბრაუზერი Connect დანერგვა დამაგრებული წყარო კოდის რევიზიით](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [ბრაუზერი Connect ტესტები დამაგრებული წყარო კოდის რევიზიის](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust აპლიკაციის ჩარჩოს მაგალითი დამაგრებული წყარო კოდის რევიზიით](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust საფულე ჩარჩოს მაგალითი დამაგრებული წყარო კოდის რევიზიით](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [დახურული Torii OpenAPI სქემა](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus მომსახურება](/ka/blockchain/sora-nexus-services.md)
- [ფუნქციური აქტივები](./fungible-assets.md)
- [ტრანზაქციების წარდგენა და შემოწმება](./submit-and-verify-transactions.md)
