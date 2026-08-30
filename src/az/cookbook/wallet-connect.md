---
translation_locale: az
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 38283321d51ddbb528272bb4429906eb41545ed3933ae695fb05a24675bff9c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Cüzdan Connect: Mülk köçürməsini təsdiqləyin {#wallet-connect-approve-an-asset-transfer}

## Nəticə {#outcome}

Bir brauzerdə Iroha Connect sessiyası yaratın, bir I105 cüzdanı kimliyi üçün kriptografik təsdiq əldə edin, bu cüzdanın Torii-nin tam aktiv köçürülməsi planşetini imzalamasını xahiş edin, ayrılmış imzanı təqdim edin və tətbiq olunmuş yekunlaşmanı gözləyin.

## Əvvəlki şərtlər {#prerequisites}

- `@iroha/iroha-js` və HTTPS istifadə edən bir brauzer tətbiqi.
- Iroha Connect v1-i tətbiq edən və bir açarlı Ed25519 I105 hesabını idarə edən cüzdan.
- Mövcud Taira zəncir ID və zəncir ayırdçısı, cüzdanın qeydiyyatda olan kiçik əlifba Ed25519 ictimai açarlı hex, mülkiyyətdə olan köçürülə bilən aktiv və kanonik I105 istiqaməti.
- İndiki Taira faucet cavabı ilə geri qaytarılan ödəniş aktivini ID. nümunə canlı ödəniş qiymətinin bu ID ilə müqayisədə təsdiqlənməsini təmin edir; heç vaxt kopyalanmış bir aktiv identifikatoru daxil etmir.
- Bağlantı seçilmiş Torii üzərində aktivləşdirilməlidir. QR və ya dərin bağlantı göstərmədən əvvəl yoxlayın:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Taira Connect-i məhdudlaşdırdığını bildirirsə və ya `404`/`503` -ni qaytarırsa, Connect aktivləşdirilmiş yerli şəbəkədən istifadə edin. Adi bir aktiv köçürülməsi həmçinin cüzdanın kifayət qədər köçürülə bilən miqdar və ödəniş balansına sahib olmasını tələb edir.

## Dərslər {#steps}

### 1. Bir cüzdanın buraxılış nəzarətini təmin edin {#_1-provide-one-wallet-launch-control}

Aşağıdakı JavaScript bu elementin müraciət səhifəsində olmasını gözləyir:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Başqa bir cihazdakı cüzdan üçün eyni URI kodunu QR verin. URI cüzdan ölçülmüş relay tokenini saxlayır, buna görə onu analitiklərə, jurnallara, istinadçılara və ya qəza hesabatlarına qoymayın.

### 2. Yaradın, təsdiqləyin, imzalayın və təqdim edin {#_2-create-approve-sign-and-submit}

Bu brauzer modulu tətbiqinizin vəziyyətindən konkret dəyərləri qəbul edir. Birinci `POST /v1/assets/transfer` imzalanma sahələrini buraxır və qeyd edilmiş, versiyalaşdırılmış bir əməliyyat planşetini qaytarır. İkincisi yalnız cüzdanın ictimai açarı və ayrı imzaları eyni köçürmə tələbinə əlavə edir.

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

Qalan. `token_app`, `token_management`, və `token_relay` Yalnız cüzdanın açılması üçün URI Connect təsdiqinin hesab kimliyi ilə imzalanması; X25519 `walletPublicKey` Rəsmiləşdirmədə hesabın Ed25519 imza açarı yox, müvəqqəti bir nəqliyyat açarı yerləşir.

### 3. Cüzdan tətbiqində Rust çərçivə növlərindən istifadə edin. {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

Rust protokol səthində imzalanma yalnız cüzdanın tələb olunan əməliyyatı dekodladıqdan sonra möhürlənə bilər, dəqiq niyyətini göstərir, tətbiq edilən siyasəti göstərir və təsdiq edilmiş hesab açarı ilə imzalayır. Bu köməkçi bu təsdiqlənmiş imzanı qəbul edir; heç birini düzəltmir:

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

Repozitoriyin `connect_app` və `connect_wallet` nümunələri protokol qurğularıdır: onlar deterministik nəqliyyat açarlarından istifadə edir, çıxışı tokenləri ortaya qoyur və cüzdan qurğusu saxta imza qaytarır. Onları yalnız çərçivələri öyrənmək üçün istifadə edin, heç vaxt Taira cüzdan tətbiqi kimi.

## Tətbiq edin {#verify}

Geri qaytarılan hash saxlayın və ictimai sahiblərin son nöqtəsi vasitəsilə istiqamət post-dövlətini təsdiqləyin:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

Verifikasiya yalnız JavaScript garsonunun təqdim edilmiş əməliyyat həşi üçün `Applied` nəzərə aldığı və istiqamət saxlama transferi əks etdirdiyi zaman uğurla həyata keçirilir. HTTP qəbulu və ya cüzdanın təsdiqlənməsi təkcə kitabxana nizamnaməsi deyil.

## Problemlərin həlli {#troubleshooting}

- `404`, `503` və ya `enabled: false` Connect statusundan bu düyündə heç bir relay seansı yaradıla bilməz deməkdir. Mümkün olan lokal şəbəkəyə keçin; tətbiqləri və ya idarəetmə nömrələrini özünüz daşınmağa qayıtmayın.
- `USER_DENIED` bir cüzdan qərarıdır. Dəfələrlə təsdiqləmə istintaqlarını açmaq əvəzinə terminal istifadəçinin nəticəsi olaraq saxlayın.
- Təsdiqləmə hesabının uyğunsuzluğu və ya etibarsız təsdiq imzası seansı bağlamalıdır. Kimlik bağlanmasının pozulmasından sonra heç vaxt cüzdanın imzalanmasını istəməyin.
- `public_key_hex does not control authority` qeydiyyat məlumatları və təsdiq edilmiş I105 şəxsiyyət anlaşmazlığı deməkdir. Bu sahədə müvəffəqiyyətli cüzdan nəqliyyat açarı istifadə edilə bilməz.
- İmzalanma və ya qurğunun rədd edilməsi adətən hazırlamaq və təqdim etmək arasında dəyişdirilən tələb sahəsi və ya canlı ödəniş qiyməti deməkdir. Yeni bir müraciət edin; heç vaxt köhnə imzanı transplant etməyin.
- Artıq qəbul edilmiş imzalanmış bir xahişin dəqiq təkrarlanması idempotentdir. Yenidən başlamaq üçün bir səbəb olaraq vaxt məhdudlaşmasını müalicə etmədən əvvəl geri qaytarılmış əməliyyat hashini soruşun.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Browser Connect tətbiqi sabitləşdirilmiş komitdə ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [Browser Connect testləri bağlanmış commit-də](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust tətbiq çərçivəsi nümunəsi bağlanmış komitdə](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust cüzdan çərçivəsi nümunəsi bağlanmış komitdə](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Torii OpenAPI sxeması ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus xidmətləri](/az/blockchain/sora-nexus-services.md)
- [Fungible assets](./fungible-assets.md)
- [Əməliyyatların təqdim edilməsi və yoxlanılması](./submit-and-verify-transactions.md)
