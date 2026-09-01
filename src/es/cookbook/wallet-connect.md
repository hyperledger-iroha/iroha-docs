---
translation_locale: es
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 81b370bdc73a40ff2dbb8df0f91547ab4c279ed94600bdd6df367f29a949ec71
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Wallet Connect: Aprobar una transferencia de activos {#wallet-connect-approve-an-asset-transfer}

## Resultado {#outcome}

Crea una sesión de Iroha Connect en un navegador, obtén la aprobación criptográfica para una identidad de billetera I105, solicita que esa billetera firme la estructura inicial generada de transferencia de activos exacta de Torii, envía la firma separada y espera la finalización aplicada.

## Requisitos previos {#prerequisites}

- Una aplicación de navegador que usa `@iroha/iroha-js` y HTTPS.
- Una cartera que implementa Iroha Connect v1 y controla una cuenta I105 Ed25519 de clave única.
- El ID de cadena Taira actual y el discriminante de la cadena, la clave pública Ed25519 en minúsculas inscrita de la billetera en hexadecimal, un activo transferible propiedad y un destino canónico I105.
- El ID de activo de tarifa devuelto por la respuesta del servicio de financiación de testnet actual Taira. El ejemplo verifica la estimación del precio de la tarifa en vivo contra ese ID; nunca incrusta un identificador de activo copiado.
- Connect debe estar habilitado en el Torii seleccionado. Verifique antes de mostrar un QR o enlace profundo:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Si Taira informa que Connect está desactivado o devuelve `404`/`503`, use una red local generada con Connect habilitado. Una transferencia de activos ordinaria también requiere que la billetera tenga suficiente cantidad transferible y saldo para tarifas.

## Pasos {#steps}

### 1. Proporcionar un control de lanzamiento de billetera {#_1-provide-one-wallet-launch-control}

El JavaScript a continuación espera este elemento en la página de la aplicación:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Genera el mismo URI como un código QR para una billetera en otro dispositivo. El URI contiene el token de retransmisión con alcance de billetera, por lo que no lo pongas en análisis, registros, referidos o informes de fallos.

### 2. Crear, aprobar, firmar y enviar {#_2-create-approve-sign-and-submit}

Este módulo del navegador acepta valores concretos de su estado de aplicación. El primero `POST /v1/assets/transfer` omite los campos de firma y devuelve una estructura inicial de transacción generada entre comillas y con versión. El segundo solo añade la clave pública de la cartera y la firma separada a la misma solicitud de transferencia.

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

Mantenga `token_app`, `token_management` y `token_relay` en la memoria de la aplicación. Solo el lanzamiento de la billetera URI/token se transfiere a la billetera. La aprobación de Connect es firmada por la identidad de la cuenta; la X25519 `walletPublicKey` en la aprobación es una clave de transporte efímera, no la clave de firma Ed25519 de la cuenta.

### 3. Use los tipos de marco Rust en una implementación de cartera {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

La superficie del protocolo Rust puede sellar una firma solo después de que la billetera haya decodificado la transacción solicitada, mostrado su intención exacta, aplicado la política y firmado con la clave de cuenta aprobada. Este asistente acepta esa firma validada; no fabrica una:

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

Los ejemplos `connect_app` y `connect_wallet` del repositorio son artefactos de prueba del protocolo: utilizan claves de transporte deterministas, muestran tokens en la salida, y el artefacto de prueba de la billetera devuelve una firma ficticia. Úselos solo para estudiar marcos, nunca como una implementación de billetera Taira.

## Verificar {#verify}

Mantenga el hash criptográfico devuelto y confirme el estado posterior del destino a través del endpoint de titulares públicos API:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

La verificación tiene éxito solo cuando el camarero JavaScript observa `Applied` para el hash criptográfico de la transacción enviada y el destino refleja la transferencia. La aceptación de HTTP o la aprobación de la billetera por sí sola no constituye la finalización del libro mayor de la blockchain.

## Solución de problemas {#troubleshooting}

- `404`, `503` o `enabled: false` desde el estado Conectado significa que no se puede crear una sesión de retransmisión en ese nodo. Cambie a una red local habilitada; no intente transportar tokens de aplicación o de gestión por su cuenta.
- `USER_DENIED` es una decisión de cartera. Consérvala como un resultado del usuario terminal en lugar de abrir repetidamente solicitudes de aprobación.
- Un desajuste entre la cuenta de aprobación o una firma de aprobación no válida debe cerrar la sesión. Nunca pidas a la billetera que firme después de que falle la vinculación de identidad.
- `public_key_hex does not control authority` significa que los datos de inscripción y la identidad aprobada I105 no coinciden. La clave de transporte de la billetera efímera no se puede usar en este campo.
- Un rechazo de firma o de estructura inicial generada generalmente significa que un campo de solicitud o la estimación de tarifa en vivo cambiaron entre la preparación y el envío. Construya una nueva solicitud; nunca trasplante la firma antigua.
- Una repetición exacta de una solicitud firmada ya aceptada es idempotente. Consulte su hash criptográfico de transacción devuelto antes de considerar un tiempo de espera como motivo para empezar de nuevo.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Implementación de Browser Connect en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/src/connect.browser.js)
- [Pruebas de Browser Connect en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust ejemplo de marco de aplicación en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust ejemplo de marco de billetera en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Esquema fijado Torii OpenAPI](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/artifacts/openapi/torii.json)
- [SORA Nexus servicios](/es/blockchain/sora-nexus-services.md)
- [Activos fungibles](./fungible-assets.md)
- [Enviar y verificar transacciones](./submit-and-verify-transactions.md)
