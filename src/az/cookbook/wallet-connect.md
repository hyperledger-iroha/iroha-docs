---
translation_locale: az
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Cüzdan Bağlantısı: Aktiv Transferini Təsdiqləyin {#wallet-connect-approve-an-asset-transfer}

## Nəticə {#outcome}

Brauzerdə Iroha Connect sessiyası yaradın, bir I105 cüzdan identikliyi üçün kriptoqrafik təsdiq alın, həmin cüzdandan Torii-nin dəqiq, imzasız aktiv köçürməsi faydalı yükünü imzalamasını xahiş edin, ayrılmış imzanı təqdim edin və Applied yekunluğunu gözləyin.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- Bir veb brauzer tətbiqi `@iroha/iroha-js` və HTTPS istifadə edir.
- Iroha Connect v1-i həyata keçirən, tək açarlı Ed25519 I105 hesabını idarə edən və `sign_transaction` və `sign_raw` metodlarına icazə verən cüzdan.
- Cari Taira şəbəkə ID-si, cüzdanın qeydiyyatdan keçmiş kiçik hərfli Ed25519 ictimai açar hex dəyəri, sahib olunan köçürülə bilən aktiv və kanonik I105 təyinatı.
- Cari Taira testnet maliyyələşdirmə xidməti siyasətinin dərc etdiyi ödəniş aktivi ID-si. Nümunə canlı ödəniş qiyməti təxminini həmin ID ilə yoxlayır; o, heç vaxt kopyalanmış aktiv identifikatorunu koda daxil etmir.
- Seçilmiş Torii-də Connect aktiv olmalıdır. QR və ya dərin keçidi göstərməzdən əvvəl şəbəkə ID-sini ictimai hesab imkanlarından oxuyun:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii anonim Connect statusu dərc etmir: `GET /v1/connect/status` bir sessiyanın statusunu yalnız onun idarəetmə tokeni ilə bildirir, ümumi status isə operator imzası tələb edir. Qovşaqda Connect söndürüldükdə `registerConnectSession` HTTP `503` və `connect_disabled` kodu ilə uğursuz olur (proqram yığımında Connect olmadıqda `404`), nümunə isə nə QR kod, nə də dərin keçid göstərir; Connect aktiv olan yaradılmış lokal şəbəkədən istifadə edin. Adi aktiv köçürməsi üçün həmçinin cüzdanın kifayət qədər köçürülə bilən miqdara və ödəniş balansına sahib olması tələb olunur.

## Addımlar {#steps}

### 1. Bir pulqabı işə salma nəzarəti təmin edin {#_1-provide-one-wallet-launch-control}

Aşağıdakı JavaScript bu elementi tətbiq səhifəsində gözləyir:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Eyni URI-ı başqa bir cihazdakı cüzdan üçün QR kodu kimi təqdim edin. URI cüzdan səviyyəli relay tokeni saxlayır, buna görə onu analizlərdə, qeydlərdə, istinadçılarda və ya qəza hesabatlarında yerləşdirməyin.

### 2. Yaratmaq, təsdiqləmək, imzalamaq və təqdim etmək {#_2-create-approve-sign-and-submit}

Bu brauzer modulu tətbiqinizin vəziyyətindən konkret dəyərləri qəbul edir. Birinci `POST /v1/assets/transfer` imzalama sahələrini buraxır və təxmin edilmiş ödəniş niyyətini və imzasız əməliyyatın faydalı yükünü qaytarır. İkincisi eyni köçürmə sorğusuna yalnız cüzdanın ictimai açarını və ayrılmış imzanı əlavə edir. Torii hər iki sorğuda kanonik hesab imzası tələb edir, buna görə modul onları cüzdana `createConnectCanonicalRequestAuth` vasitəsilə imzalatdırır.

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

Tətbiq yaddaşında `token_app`, `token_management` və `token_relay` saxlayın. Yalnız cüzdanın işə salınması URI/token cüzdana keçir. Connect təsdiqi hesab şəxsiyyəti tərəfindən imzalanır; təsdiqdəki X25519 `walletPublicKey` müvəqqəti ötürmə açarıdır, hesabın Ed25519 imza açarı deyil.

### 3. Pul kisəsi tətbiqində Rust çərçivə növlərindən istifadə edin {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust protokol səthi imzanı yalnız cüzdan tələb olunan əməliyyatı deşifr etdikdən, onun dəqiq məqsədini göstərdikdən, siyasəti tətbiq etdikdən və təsdiqlənmiş hesab açarı ilə imzaladıqdan sonra möhürləyə bilər. Bu köməkçi təsdiqlənmiş imzanı qəbul edir; onu saxtalaşdırmır:

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

Repozitoriyadakı `connect_app` və `connect_wallet` nümunələri protokol nümayişləridir: tətbiq cüzdan URI-sini, onun tokeni ilə birlikdə, standart çıxışa çap edir, cüzdan isə tokenlərini əmr sətri arqumentləri kimi qəbul edir və tələb olunan baytları dekodlaşdırmadan və ya göstərmədən imzalayır. Onlardan yalnız çərçivələri öyrənmək üçün istifadə edin, heç vaxt Taira cüzdan implementasiyası kimi yox.

## Yoxla {#verify}

Qaytarılan kriptoqrafik xəşi saxlayın və təyinatın son vəziyyətini ictimai sahiblər API son nöqtəsi vasitəsilə təsdiqləyin:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

Təsdiq yalnız JavaScript ofisiant `Applied`-i təqdim edilmiş əməliyyat kriptoqrafik hash üçün müşahidə etdikdə və təyinat hesabında köçürmə əks olunduqda uğurla baş verir. HTTP qəbul edilməsi və ya cüzdan təsdiqi blockhain dəftər sonluğu hesab olunmur.

## Problemlərin aradan qaldırılması {#troubleshooting}

- `registerConnectSession` cavabında `connect_disabled` kodlu `503` və ya `404` həmin qovşaqda heç bir ötürmə sessiyasının yaradıla bilməyəcəyini bildirir. Connect aktiv olan lokal şəbəkəyə keçin; tətbiq və ya idarəetmə tokenlərini özünüz ötürməyə keçməyin.
- `USER_DENIED` bir pul kisəsi qərarıdır. Təkrar təsdiq pəncərələrini açmaq əvəzinə bunu terminal istifadəçi nəticəsi kimi qoruyun.
- Təsdiq və hesab uyğunsuzluğu və ya etibarsız təsdiq imzası sessiyanı bağlamalıdır. Kimliyin bağlanması uğursuz olduqdan sonra heç vaxt cüzdanı imzalamağa çağırmayın.
- `public_key_hex does not control authority` qeydiyyat məlumatlarını və təsdiqlənmiş I105 şəxsiyyətini uyğunsuz göstərir. Müvəqqəti cüzdan ötürmə açarından bu sahədə istifadə etmək olmaz.
- Rədd edilmiş ayrılmış imza adətən hazırlıq və təqdimat arasında sorğu sahəsinin və ya canlı ödəniş qiyməti təxmininin dəyişdiyini bildirir. Yeni sorğu qurun; köhnə imzanı heç vaxt köçürməyin.
- Artıq qəbul edilmiş imzalı sorğunun dəqiq təkrarı idempotentdir. Yenidən başlama səbəbi kimi vaxt bitməsini qəbul etməzdən əvvəl qaytarılan əməliyyatın kriptoqrafik xəşini sorğu edin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Sabitlənmiş mənbə kodu revisiyasında Brauzer Bağlantısı tətbiqi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [Brauzer Connect pinlənmiş mənbə kodu versiyasında testlər aparır](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust pinlənmiş mənbə kodu redaksiyasında tətbiq çərçivəsi nümunəsi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust pinlənmiş mənbə kodu redaksiyasında pulqabı çərçivəsi nümunəsi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Sabitləşdirilmiş Torii OpenAPI sxem](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus xidmətləri](/az/blockchain/sora-nexus-services.md)
- [Mübadilə edilə bilən aktivlər](./fungible-assets.md)
- [Əməliyyatları göndərin və təsdiqləyin](./submit-and-verify-transactions.md)
