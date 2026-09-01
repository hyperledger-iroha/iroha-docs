---
translation_locale: az
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Cüzdan Bağlantısı: Aktiv Transferini Təsdiqləyin {#wallet-connect-approve-an-asset-transfer}

## Nəticə {#outcome}

Brauzerdə Iroha Connect sessiyası yaradın, bir I105 cib pul kisəsi identifikasiyası üçün kriptoqrafik təsdiq əldə edin, həmin cib pul kisəsindən Torii-in dəqiq aktiv-transfer yaradılmış başlanğıc strukturunu imzalamağı xahiş edin, ayrılmış imzanı göndərin və Tətbiq edilmiş sonluğu gözləyin.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- Bir veb brauzer tətbiqi `@iroha/iroha-js` və HTTPS istifadə edir.
- Iroha Connect v1-i tətbiq edən və tək açarlı Ed25519 I105 hesabını idarə edən bir pul kisəsi.
- Cari Taira zəncir ID və zəncir fərqləndiricisi, cüzdanın qeydiyyatdan keçmiş kiçik hərfli Ed25519 ictimai açar hex-i, sahib olunan ötürülə bilən aktiv və tək bir protokol-standart I105 təyinatı.
- Cari Taira testnet maliyyələşdirmə xidməti cavabında qaytarılan ödəniş aktivinin ID-si. Nümunə canlı ödəniş qiymət təxminini həmin ID ilə yoxlayır; heç vaxt kopyalanmış aktiv identifikatorunu daxil etmir.
- Seçilmiş Torii üzərində Qoşulma aktiv olmalıdır. QR və ya dərin əlaqəni göstərmədən əvvəl yoxlayın:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Əgər Taira Connect bağlanmış olduğunu bildirirsə və ya `404`/`503` qaytarırsa, Connect aktivləşdirilmiş yaradılmış yerli şəbəkədən istifadə edin. Adi aktiv köçürməsi üçün də cüzdanın kifayət qədər köçürülə bilən miqdara və ödəniş balansına sahib olması tələb olunur.

## Addımlar {#steps}

### 1. Bir pulqabı işə salma nəzarəti təmin edin {#_1-provide-one-wallet-launch-control}

Aşağıdakı JavaScript bu elementi tətbiq səhifəsində gözləyir:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Eyni URI-ı başqa bir cihazdakı cüzdan üçün QR kodu kimi təqdim edin. URI cüzdan səviyyəli relay tokeni saxlayır, buna görə onu analizlərdə, qeydlərdə, istinadçılarda və ya qəza hesabatlarında yerləşdirməyin.

### 2. Yaratmaq, təsdiqləmək, imzalamaq və təqdim etmək {#_2-create-approve-sign-and-submit}

Bu brauzer modulu tətbiq vəziyyətinizdən konkret dəyərləri qəbul edir. Birinci `POST /v1/assets/transfer` imzalama sahələrini kənarlaşdırır və ödəniş qiymət təxminli versiyalı əməliyyat başlatma strukturunu qaytarır. İkinci isə eyni köçürmə sorğusuna yalnız cüzdanın açıq açarını və ayrılmış imzasını əlavə edir.

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

Anbarın `connect_app` və `connect_wallet` nümunələri protokol test artefaktlarıdır: onlar deterministik daşınma açarlarından istifadə edir, çıxışda tokenləri göstərir və cüzdan test artefaktı saxta imza qaytarır. Onlardan yalnız çərçivələri öyrənmək üçün istifadə edin, heç vaxt Taira cüzdan implementasiyası kimi istifadə etməyin.

## Yoxla {#verify}

Qaytarılan kriptoqrafik xəşi saxlayın və təyinatın son vəziyyətini ictimai sahiblər API son nöqtəsi vasitəsilə təsdiqləyin:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

Təsdiq yalnız JavaScript ofisiant `Applied`-i təqdim edilmiş əməliyyat kriptoqrafik hash üçün müşahidə etdikdə və təyinat hesabında köçürmə əks olunduqda uğurla baş verir. HTTP qəbul edilməsi və ya cüzdan təsdiqi blockhain dəftər sonluğu hesab olunmur.

## Problemlərin aradan qaldırılması {#troubleshooting}

- `404`, `503` və ya `enabled: false` Bağlanış statusu bu nodda heç bir relə sessiyasının yaradılmayacağı deməkdir. Aktiv edilmiş bir localnet-ə keçin; tətbiq və ya idarəetmə tokenlərini özünüz daşıma halına düşməyin.
- `USER_DENIED` bir pul kisəsi qərarıdır. Təkrar təsdiq pəncərələrini açmaq əvəzinə bunu terminal istifadəçi nəticəsi kimi qoruyun.
- Təsdiq və hesab uyğunsuzluğu və ya etibarsız təsdiq imzası sessiyanı bağlamalıdır. Kimliyin bağlanması uğursuz olduqdan sonra heç vaxt cüzdanı imzalamağa çağırmayın.
- `public_key_hex does not control authority` qeydiyyat məlumatlarını və təsdiqlənmiş I105 şəxsiyyətini uyğunsuz göstərir. Müvəqqəti cüzdan ötürmə açarından bu sahədə istifadə etmək olmaz.
- İmzalanmış və ya yaradılmış başlanğıc strukturunun rədd edilməsi adətən sorğu sahəsinin və ya canlı ödəniş qiymətinin hazırlanma və göndərilmə mərhələləri arasında dəyişdiyini göstərir. Yeni bir sorğu yaradın; köhnə imzanı heç vaxt köçürməyin.
- Artıq qəbul edilmiş imzalı sorğunun dəqiq təkrarı idempotentdir. Yenidən başlama səbəbi kimi vaxt bitməsini qəbul etməzdən əvvəl qaytarılan əməliyyatın kriptoqrafik xəşini sorğu edin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Sabitlənmiş mənbə kodu revisiyasında Brauzer Bağlantısı tətbiqi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [Brauzer Connect pinlənmiş mənbə kodu versiyasında testlər aparır](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust pinlənmiş mənbə kodu redaksiyasında tətbiq çərçivəsi nümunəsi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust pinlənmiş mənbə kodu redaksiyasında pulqabı çərçivəsi nümunəsi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Sabitləşdirilmiş Torii OpenAPI sxem](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus xidmətləri](/az/blockchain/sora-nexus-services.md)
- [Mübadilə edilə bilən aktivlər](./fungible-assets.md)
- [Əməliyyatları göndərin və təsdiqləyin](./submit-and-verify-transactions.md)
