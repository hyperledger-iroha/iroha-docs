---
translation_locale: ka
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# საფულე Connect: დაამტკიცეთ აქტივების გადაცემა {#wallet-connect-approve-an-asset-transfer}

## შედეგები {#outcome}

ბრაუზერში შექმენით Iroha Connect სესია, მიიღეთ კრიპტოგრაფიული დამტკიცება ერთი I105 საფულის იდენტობისთვის, სთხოვეთ ამ საფულეს ხელი მოაწეროს Torii-ის მიერ მომზადებულ ზუსტ, ხელმოუწერელ აქტივის გადაცემის სასარგებლო დატვირთვას, წარადგინეთ განცალკევებული ხელმოწერა და დაელოდეთ Applied საბოლოობას.

## წინაპირობები {#prerequisites}

- ბრაუზერის აპლიკაცია, რომელიც იყენებს `@iroha/iroha-js` და HTTPS;
- საფულე, რომელიც ახორციელებს Iroha Connect v1-ს, მართავს ერთგასაღებიან Ed25519 I105 ანგარიშს და ანიჭებს `sign_transaction` და `sign_raw` მეთოდებს.
- Taira-ს მიმდინარე ქსელის ID, საფულის რეგისტრირებული Ed25519 საჯარო გასაღების hex ქვედა რეგისტრით, საკუთრებაში არსებული გადაცემადი აქტივი და კანონიკური I105 დანიშნულება.
- საფასურის აქტივის ID, რომელსაც Taira-ს გამცემის მიმდინარე პოლიტიკა აქვეყნებს. მაგალითი საფასურის მიმდინარე შეფასებას ამ ID-ით ამოწმებს; ის კოდში არასოდეს ჩასვამს აქტივის კოპირებულ იდენტიფიკატორს.
- Connect ჩართული უნდა იყოს არჩეულ Torii-ზე. QR კოდის ან ღრმა ბმულის ჩვენებამდე წაიკითხეთ ქსელის ID ანგარიშის საჯარო შესაძლებლობებიდან:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii Connect-ის ანონიმურ სტატუსს არ აქვეყნებს: `GET /v1/connect/status` ერთი სესიის სტატუსს მხოლოდ მისი მართვის ტოკენით აცნობებს, ხოლო აგრეგირებული სტატუსი ოპერატორის ხელმოწერას მოითხოვს. როდესაც კვანძზე Connect გამორთულია, `registerConnectSession` მარცხდება HTTP `503`-ით და კოდით `connect_disabled` (`404`, როდესაც აგებაში Connect არ შედის), და მაგალითი არც QR კოდს აჩვენებს და არც ღრმა ბმულს; გამოიყენეთ გენერირებული ლოკალური ქსელი ჩართული Connect-ით. ჩვეულებრივი აქტივის გადაცემისთვის ასევე საჭიროა, რომ საფულეს ჰქონდეს საკმარისი გადაცემადი რაოდენობა და საფასურის ბალანსი.

## ნაბიჯები {#steps}

### 1. უზრუნველყოს ერთი საფულე გაშვების კონტროლი {#_1-provide-one-wallet-launch-control}

JavaScript ქვემოთ მოცემული ელემენტი მოითხოვს განაცხადის გვერდზე:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

დააბრუნეთ იგივე URI კოდი, რაც QR ქაღალდისთვის სხვა მოწყობილობაზე. URI -ში ინახება საფულე-სკოპირებული რელე ტოქნი, ამიტომ არ დააყენოთ ის ანალიტიკაში, ლოგებში, რეფერერებში ან ავარიული შეტყობინებებში.

### 2. შექმნა, დამტკიცება, ხელმოწერა და წარდგენა {#_2-create-approve-sign-and-submit}

ეს ბრაუზერის მოდული კონკრეტულ მნიშვნელობებს თქვენი აპლიკაციის მდგომარეობიდან იღებს. პირველი `POST /v1/assets/transfer` ხელმოწერის ველებს გამოტოვებს და აბრუნებს შეფასებული საფასურის განზრახვას და ხელმოუწერელი ტრანზაქციის სასარგებლო დატვირთვას. მეორე იმავე გადაცემის მოთხოვნას მხოლოდ საფულის საჯარო გასაღებს და განცალკევებულ ხელმოწერას უმატებს. Torii ორივე მოთხოვნაზე კანონიკური ანგარიშის ხელმოწერას მოითხოვს, ამიტომ მოდული საფულეს მათ `createConnectCanonicalRequestAuth`-ის მეშვეობით აწერინებს ხელს.

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

რეპოზიტორიის `connect_app` და `connect_wallet` მაგალითები პროტოკოლის დემონსტრაციებია: აპლიკაცია საფულის URI-ს, მის ტოკენთან ერთად, სტანდარტულ გამოსავალში ბეჭდავს, ხოლო საფულე თავის ტოკენებს ბრძანების ხაზის არგუმენტებად იღებს და მოთხოვნილ ბაიტებს მათი დეკოდირებისა და ჩვენების გარეშე აწერს ხელს. გამოიყენეთ ისინი მხოლოდ ფრეიმების შესასწავლად და არასოდეს — როგორც Taira საფულის იმპლემენტაცია.

## შემოწმება {#verify}

შეინახეთ დაბრუნებული კრიპტოგრაფიული ჰეში და დაადასტურეთ მიმართულების შემდგომ მდგომარეობა საჯარო მფლობელების API საბოლოო წერტილით:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

შემოწმება წარმატებული ხდება მხოლოდ მაშინ, როდესაც JavaScript-ის მოთამაშე შეამოწმებს `Applied` წარდგენილი ტრანზაქციის კრიპტოგრაფიული ჰეშისთვის და მიზნობრივი სათავსო ასახავს გადაცემას. HTTP მიღება ან ქაღალდის დამტკიცება მარტო არ არის ბლოკჩეინის რეესტრის საბოლოო მნიშვნელობა.

## პრობლემების აღმოფხვრა {#troubleshooting}

- `registerConnectSession`-იდან `503` კოდით `connect_disabled` ან `404` ნიშნავს, რომ ამ კვანძზე რელე სესიის შექმნა შეუძლებელია. გადადით Connect-ჩართულ ლოკალურ ქსელზე; ნუ გადახვალთ აპლიკაციის ან მართვის ტოკენების თავად გადატანაზე.
- `USER_DENIED` არის ქაღალდის გადაწყვეტილება. შეინახეთ იგი როგორც ტერმინალური მომხმარებლის შედეგები ნაცვლად გახსნის განმეორებითი დამტკიცების მოთხოვნები.
- დამტკიცების ანგარიშის შეუსაბამობა ან არაკეთილსინდისიერი დამტკიცების ხელმოწერა უნდა დახუროს სესია. არასდროს მოითხოვოთ საფულეზე ხელმოწერას მას შემდეგ, რაც იდენტობის დამაკავშირებლობა ჩავარდება.
- `public_key_hex does not control authority` ნიშნავს რეგისტრაციის მონაცემებს და დამტკიცებული I105 იდენტობის უთანხმოებას. ამ სფეროში არ შეიძლება გამოყენებულ იქნას ფანჯრის ტრანსპორტის ღილაკი.
- უარყოფილი განცალკევებული ხელმოწერა, როგორც წესი, ნიშნავს, რომ მომზადებასა და წარდგენას შორის შეიცვალა მოთხოვნის ველი ან საფასურის მიმდინარე შეფასება. შექმენით ახალი მოთხოვნა; ძველი ხელმოწერა არასოდეს გადაიტანოთ.
- უკვე მიღებული ხელმოწერილი მოთხოვნის ზუსტი გამოთქმა არის idempotent. შეკითხვა მისი დაბრუნებული ტრანზაქციის კრიპტოგრაფიული ჰეში, სანამ განიხილავს ვადაგზა როგორც მიზეზი დაიწყოს თავიდან.

## წყარო და შესაბამისი დოკუმენტები {#source-and-related-docs}

- [ბრაუზერი Connect დანერგვა დამაგრებული წყარო კოდის რევიზიით](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [ბრაუზერი Connect ტესტები დამაგრებული წყარო კოდის რევიზიის](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust აპლიკაციის ჩარჩოს მაგალითი დამაგრებული წყარო კოდის რევიზიით](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust საფულე ჩარჩოს მაგალითი დამაგრებული წყარო კოდის რევიზიით](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [დახურული Torii OpenAPI სქემა](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus მომსახურება](/ka/blockchain/sora-nexus-services.md)
- [ფუნქციური აქტივები](./fungible-assets.md)
- [ტრანზაქციების წარდგენა და შემოწმება](./submit-and-verify-transactions.md)
