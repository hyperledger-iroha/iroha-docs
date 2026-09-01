---
translation_locale: fr
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Wallet Connect : Approuver un transfert d'actifs {#wallet-connect-approve-an-asset-transfer}

## Résultat {#outcome}

Créez une session Iroha Connect dans un navigateur, obtenez l'approbation cryptographique pour une identité de portefeuille I105, demandez à ce portefeuille de signer la structure de démarrage générée pour le transfert d'actifs exact de Torii, soumettez la signature détachée et attendez la finalité appliquée.

## Prérequis {#prerequisites}

- Une application de navigateur utilisant `@iroha/iroha-js` et HTTPS.
- Un portefeuille qui implémente Iroha Connect v1 et contrôle un compte I105 Ed25519 à clé unique.
- L'ID de chaîne Taira actuel et le discriminant de chaîne, la clé publique Ed25519 en minuscules du portefeuille inscrite en hexadécimal, un actif transférable possédé, et une destination canonique I105.
- L'ID de l'actif de frais retourné par la réponse du service de financement du testnet actuel Taira. L'exemple vérifie l'estimation du prix des frais en direct par rapport à cet ID ; il n'intègre jamais un identifiant d'actif copié.
- La connexion doit être activée sur le Torii sélectionné. Vérifiez avant d'afficher un QR ou un lien profond :

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Si Taira signale que Connect est désactivé ou renvoie `404`/`503`, utilisez un réseau local généré avec Connect activé. Un transfert d'actifs ordinaire nécessite également que le portefeuille possède suffisamment de quantité transférable et de solde pour les frais.

## Étapes {#steps}

### 1. Fournir un contrôle de lancement de portefeuille {#_1-provide-one-wallet-launch-control}

L'JavaScript ci-dessous attend cet élément dans la page de l'application :

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Rendez le même URI qu'un code QR pour un portefeuille sur un autre appareil. Le URI contient le jeton de relais limité au portefeuille, donc ne le mettez pas dans les analyses, les journaux, les référents ou les rapports de plantage.

### 2. Créer, approuver, signer et soumettre {#_2-create-approve-sign-and-submit}

Ce module de navigateur accepte des valeurs concrètes provenant de l'état de votre application. Le premier `POST /v1/assets/transfer` omet les champs de signature et renvoie une structure de démarrage de transaction citée et versionnée. Le second ajoute uniquement la clé publique du portefeuille et la signature détachée à la même demande de transfert.

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

Conservez `token_app`, `token_management` et `token_relay` dans la mémoire de l'application. Seul le lancement du portefeuille URI/le jeton passe au portefeuille. L'approbation Connect est signée par l'identité du compte ; le X25519 `walletPublicKey` dans l'approbation est une clé de transport éphémère, et non la clé de signature Ed25519 du compte.

### 3. Utilisez les types de trame Rust dans une implémentation de portefeuille {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

La surface du protocole Rust ne peut sceller une signature qu'après que le portefeuille a décodé la transaction demandée, affiché son intention exacte, appliqué la politique et signé avec la clé de compte approuvée. Cet assistant accepte cette signature validée ; il n'en fabrique pas :

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

Les exemples `connect_app` et `connect_wallet` du dépôt sont des artefacts de test de protocole : ils utilisent des clés de transport déterministes, exposent des jetons dans la sortie, et l’artefact de test de portefeuille renvoie une signature fictive. Utilisez-les uniquement pour étudier les trames, jamais comme une implémentation de portefeuille Taira.

## Vérifier {#verify}

Conservez le hachage cryptographique retourné et confirmez l'état postérieur de la destination via le point de terminaison des détenteurs publics API :

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

La vérification ne réussit que lorsque le serveur JavaScript observe `Applied` pour le hash cryptographique de la transaction soumise et que le portefeuille de destination reflète le transfert. L'acceptation de HTTP ou l'approbation du portefeuille seule ne constitue pas la finalité du registre blockchain.

## Dépannage {#troubleshooting}

- `404`, `503` ou `enabled: false` depuis le statut Connect signifie qu'aucune session de relais ne peut être créée sur ce nœud. Passez à un localnet activé ; ne revenez pas à transporter vous-même des jetons d'application ou de gestion.
- `USER_DENIED` est une décision de portefeuille. Conservez-la comme un résultat utilisateur final au lieu d'ouvrir des invites d'approbation répétées.
- Un désaccord entre le compte et l'approbation ou une signature d'approbation invalide doit fermer la session. Ne jamais demander au portefeuille de signer après un échec de liaison d'identité.
- `public_key_hex does not control authority` signifie que les données d'inscription et l'identité I105 approuvée sont en désaccord. La clé de transport du portefeuille éphémère ne peut pas être utilisée dans ce domaine.
- Un rejet de signature ou de structure de démarrage générée signifie généralement qu'un champ de demande ou une estimation du tarif en direct a changé entre la préparation et la soumission. Créez une nouvelle demande ; ne transposez jamais l'ancienne signature.
- Une répétition exacte d’une demande signée déjà acceptée est idempotente. Interrogez son hash cryptographique de transaction retourné avant de considérer un délai d’attente comme une raison de recommencer.

## Source et documents connexes {#source-and-related-docs}

- [Implémentation de Browser Connect au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [Tests de connexion du navigateur au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust exemple de cadre d'application à l'engagement épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust exemple de cadre de portefeuille au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Schema épinglé Torii OpenAPI](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [Services de SORA Nexus](/fr/blockchain/sora-nexus-services.md)
- [Actifs fongibles](./fungible-assets.md)
- [Soumettre et vérifier les transactions](./submit-and-verify-transactions.md)
