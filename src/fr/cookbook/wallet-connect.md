---
translation_locale: fr
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 38283321d51ddbb528272bb4429906eb41545ed3933ae695fb05a24675bff9c8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Connexion de portefeuille: approuver le transfert d'actifs {#wallet-connect-approve-an-asset-transfer}

## Le résultat {#outcome}

Créer une session de connexion Iroha dans un navigateur, obtenir l'approbation cryptographique pour une identité de portefeuille I105, demander à ce portefeuille de signer l'échafaudage exact du transfert d'actifs Torii, soumettre la signature détachée et attendre la finalisation appliquée.

## Conditions préalables {#prerequisites}

- Une application de navigateur utilisant `@iroha/iroha-js` et HTTPS.
- Un portefeuille qui met en œuvre Iroha Connect v1 et contrôle un compte Ed25519 I105 à clé unique.
- La chaîne Taira actuelle ID et le distinguant de la chaîne, l'hex public-key en minuscules enregistré Ed25519 du portefeuille, un actif transférable détenu et une destination canonique I105.
- L'actif de redevance ID renvoyé par la réponse du robinet Taira en cours. L'exemple vérifie la cotation des redevances en direct par rapport à celle de ID; il n'inclut jamais un identifiant d'actif copié.
- La connexion doit être activée sur le Torii sélectionné. Vérifiez avant d'afficher un QR ou un lien profond:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Si Taira rapporte Connect désactivé ou retourne `404`/`503`, utilisez un réseau local généré avec Connect activé. Un transfert d'actifs ordinaire exige également que le portefeuille possède suffisamment de quantité et de solde des frais transférables.

## Les étapes {#steps}

### 1. Fournir un contrôle de lancement du portefeuille {#_1-provide-one-wallet-launch-control}

Le JavaScript ci-dessous s'attend à ce que cet élément apparaisse sur la page de demande:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Render le même URI que le code QR pour un portefeuille sur un autre appareil. Le URI contient le jeton de relais scanné par portefeuille, alors ne le mettez pas dans les analyses, les journaux, les références ou les rapports d'accidents.

### 2. Créer, approuver, signer et soumettre. {#_2-create-approve-sign-and-submit}

Ce module de navigateur accepte des valeurs concrètes de votre état d'application. Le premier `POST /v1/assets/transfer` omet les champs de signature et renvoie un échafaudage de transaction cité, versionné. Le second ajoute seulement la clé publique du portefeuille et la signature détachée à la même demande de transfert.

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

Gardez `token_app`, `token_management` et `token_relay` dans la mémoire de l'application. Seul le lancement du portefeuille URI/le jeton croise sur le portefeuille. L'approbation Connect est signée par l'identité du compte; le X25519 `walletPublicKey` dans l'approvisionnement est une clé de transport éphémère, pas la clé de signature Ed25519 du compte.

### 3. Utilisez les types de cadres Rust dans une mise en œuvre de portefeuille {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

La surface du protocole Rust ne peut sceller une signature qu'après que le portefeuille a décodé la transaction demandée, affiché son intention exacte, sa politique appliquée et signé avec la clé de compte approuvée. Cet assistant accepte cette signature validée; il n'en fabrique pas:

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

Le référentiel `connect_app` et `connect_wallet` Par exemple, les fixations de protocole: elles utilisent des clés de transport déterministiques, exposent des jetons en sortie, et l'appareil de portefeuille retourne une signature fausse. Utilisez-les pour étudier les cadres seulement, jamais comme un Taira mise en œuvre du portefeuille.

## Vérifiez {#verify}

Conserver le hash retourné et confirmer l'état post-détermination de la destination par l'intermédiaire du point d'extrémité public:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

La vérification ne s'effectue que lorsque le JavaScript le serveur observe `Applied` pour le hachage de la transaction présentée et l'exploitation de destination reflète le transfert. HTTP L'acceptation ou l'approbation du portefeuille ne sont pas les seules finalités du registre.

## Résolution des problèmes {#troubleshooting}

- `404`, `503`, ou `enabled: false` depuis le statut Connect signifie qu'aucune session de relais ne peut être créée sur ce nœud. Passez à un localnet activé; ne recommencez pas à transporter vous-même les jetons d'application ou de gestion.
- `USER_DENIED` est une décision de portefeuille. Conservez-la comme un résultat utilisateur terminal au lieu d'ouvrir des demandes d'approbation répétées.
- Un défaut de correspondance entre le compte d'approbation ou une signature d'approvisionnement invalide doit mettre fin à la session.
- `public_key_hex does not control authority` désigne les données d'inscription et le désaccord sur l'identité approuvé de I105. La clé de transport éphémère du portefeuille ne peut pas être utilisée dans ce domaine.
- Un refus de signature ou d'échafaudage signifie généralement un champ de demande ou une cotation en direct modifiée entre la préparation et le dépôt.
- Une répétition exacte d'une demande signée déjà acceptée est idempotente. Demandez son hash de transaction retournée avant de traiter un délai comme une raison de recommencer.

## Sources et documents connexes {#source-and-related-docs}

- [Implémentation de connexion du navigateur à l'engagement fixé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [Tests de connexion du navigateur sur le commit fixé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Exemple de cadre d'application Rust dans le commit fixé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust exemple de cadre de portefeuille à l'adresse fixée](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Pinned Torii OpenAPI schéma](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [Les services SORA Nexus ](/fr/blockchain/sora-nexus-services.md)
- [Les actifs fonciers](./fungible-assets.md)
- [Présentation et vérification des opérations ](./submit-and-verify-transactions.md)
