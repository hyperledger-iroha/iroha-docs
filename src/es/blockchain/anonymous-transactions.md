---
translation_locale: es
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: aabeb00dd0e94278177707c50e0a73e6e3c0ca47ef5005d9c79ee0dc892cc47e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Las transacciones anónimas {#anonymous-transactions}

Las transacciones anónimas en Iroha se construyen a partir de operaciones confidenciales de activos. En lugar de escribir transferencias entre cuentas públicas con cantidades públicas, una billetera traslada el valor a un libro mayor protegido y luego gasta notas opacas con pruebas de conocimiento cero.

El libro mayor público todavía registra que una operación confidencial ocurrió. Registra compromisos, anulaciones, hashes de prueba y eventos, pero no registra el propietario del billete, el destinatario o la cantidad para el movimiento protegido a protegido. El envase normal de la transacción aún puede revelar la cuenta facilitadora, por lo que "anónimo" aquí significa movimiento anónimo de activos y no el anonimato automático a nivel de red o de cuenta.

## Bloques de construcción {#building-blocks}

|Concepto .|Representación del libro mayor |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|Nota protegida |Un registro de cartera privada que contiene un activo, cantidad, datos del propietario y aleatoriedad. |
|Compromiso |Un valor público de 32 bytes que compromete a una nota sin revelar sus campos. |
|Nullador |Un valor público de 32 bytes derivado cuando se gasta una nota. Iroha rechaza los anuladores repetidos para evitar el gasto doble. |
|Raíz de Merkle |Una raíz reciente del árbol de compromiso del activo. La prueba lo utiliza para demostrar que existen notas gastadas. |
|Enlace de prueba |Una `ProofAttachment` que contiene bytes de prueba más una referencia de clave de verificación o llave de verificación en línea. |
|Un evento confidencial .|Un evento en el libro mayor como `ConfidentialEvent::Shielded`, `Transferred` o `Unshielded`. |

Las instrucciones principales son:

- `RegisterZkAsset`: registra un activo como ZK-capable y vincula las claves de verificación de transferencia, escudo y no escudo.
- `Shield`: débite un saldo público y añade un compromiso de billete protegido.
- `ZkTransfer`: gasta billetes protegidos en nuevos compromisos de billete protegido.
- `Unshield`: gasta billetes protegidos y acredita un saldo de la cuenta pública.
- `ScheduleConfidentialPolicyTransition` y `CancelConfidentialPolicyTransition`: modificación de la política de confidencialidad de un activo a través de la gestión.

Una definición de activo también contiene un [`AssetConfidentialPolicy`](/es/reference/data-model-schema.md). Los controles en el modo de política que controlan los flujos son válidos:

|El modo |El significado .|
| ----------------- | ---------------------------------------------------------------- |
|`TransparentOnly` |Sólo se aceptan saldos y transferencias públicas normales. |
|`Convertible` |Los usuarios pueden mover el valor entre los saldos públicos y los billetes protegidos. |
|`ShieldedOnly` |La emisión de activos y las transferencias deben permanecer en el libro mayor protegido. |

## Cómo usarlas {#how-to-use-them}

1. Habilitar el soporte confidencial en los nodos de validador. Los validadores deben acordar sobre el backend del verificador, las claves activas de verificación, el parámetro Poseidon/Pedersen IDs, y la versión de reglas confidenciales. Los nodos rechazan pares o bloques con desajustes de características confidenciales
2. Publicar o registrar las claves de verificación y los conjuntos de parámetros utilizados por los circuitos. Las billeteras y los operadores deben hacer referencia a las claves en `VerifyingKeyId`, por ejemplo, `halo2/ipa:vk_transfer`.
3. Registrar el activo como ZK-capable con `RegisterZkAsset`, o realizar una transición de la política desde `TransparentOnly` a `Convertible` o `ShieldedOnly`.
4. Proteja los fondos públicos con `Shield`. La billetera crea un compromiso de nota y carga útil cifrada para el destinatario antes de presentar la transacción.
5. Transferir en privado con `ZkTransfer`. La billetera construye una prueba de que posee las notas de entrada, que los valores de entrada y salida se equilibran, y que cada nota gastada está anclada en un árbol de compromiso reciente.
6. Unshield sólo cuando la política de activos lo permita. `Unshield` revela el importe público y cuenta del destinatario, gasta el anulador de billetes privados y puede crear resultados de cambio privados.
7. Auditoría mediante la lectura de eventos confidenciales, registros de prueba, estado del anulador y registros anónimos de garantías a través de consultas tipografadas y puntos finales Torii.

## CLI Ejemplos {#cli-examples}

Los comandos ZK CLI están destinados al operador y a los flujos de prueba. Las carteras de producción deben generar compromisos, cargas útiles cifradas y pruebas con una biblioteca de carteras/prueba antes de enviar las instrucciones resultantes.

Registro de un activo híbrido con capacidad ZK:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

Construir un envase de carga útil cifrado con versión para la nota protegida:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

Los fondos públicos incluidos en el libro mayor protegido del activo:

```bash
iroha app zk shield \
  --asset <asset-definition-id> \
  --from <account-id> \
  --amount 1000 \
  --note-commitment ABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABABAB \
  --enc-payload note-envelope.bin
```

Desbloqueado con un accesorio de prueba JSON:

```bash
cat > unshield-proof.json <<'JSON'
{
  "backend": "halo2/ipa",
  "proof_b64": "BASE64_PROOF_BYTES",
  "vk_ref": {
    "backend": "halo2/ipa",
    "name": "vk_unshield"
  }
}
JSON

iroha app zk unshield \
  --asset <asset-definition-id> \
  --to <account-id> \
  --amount 1000 \
  --inputs DEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF \
  --proof-json unshield-proof.json
```

## SDK Ejemplo {#sdk-example}

Los bytes de prueba exactos provienen del backend de prueba configurado. La carga útil de la transacción sólo necesita las entradas públicas y el anexo de prueba:

```rust
use iroha_data_model::{
    isi::zk::{Unshield, ZkTransfer},
    prelude::{AccountId, AssetDefinitionId, InstructionBox},
    proof::{ProofAttachment, ProofBox, VerifyingKeyId},
};

fn transfer_instruction(
    asset: AssetDefinitionId,
    input_nullifier: [u8; 32],
    output_commitment: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_transfer");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    ZkTransfer::new(
        asset,
        vec![input_nullifier],
        vec![output_commitment],
        attachment,
        Some(anchor_root),
    )
    .into()
}

fn unshield_instruction(
    asset: AssetDefinitionId,
    recipient: AccountId,
    amount: u128,
    input_nullifier: [u8; 32],
    anchor_root: [u8; 32],
    proof_bytes: Vec<u8>,
) -> InstructionBox {
    let backend = "halo2/ipa".into();
    let proof = ProofBox::new(backend, proof_bytes);
    let vk = VerifyingKeyId::new("halo2/ipa", "vk_unshield");
    let attachment = ProofAttachment::new_ref("halo2/ipa".into(), proof, vk);

    Unshield::new(
        asset,
        recipient,
        amount,
        vec![input_nullifier],
        attachment,
        Some(anchor_root),
    )
    .into()
}
```

## Escrow de activos anónimos {#anonymous-asset-escrow}

El escrow de activos anónimos utiliza la misma maquinaria de transferencia protegida para el valor garantizado. Las partes y el estado del escrow todavía se registran en el registro de garantía, pero las piernas de financiación, liberación, cancelación y resolución utilizan anuladores protegidos y compromisos de salida.

Para obtener más detalles sobre el comportamiento y ejemplos de los activos fiduciarios ISI, véase [El activo fiduciario nativo ](/es/blockchain/escrow.md#anonymous-escrow).

El ciclo de vida es:

1. `OpenAnonymousAssetEscrow` gasta notas de financiamiento protegidas y crea un compromiso de garantía.
2. `AcceptAnonymousAssetEscrow` registra al comprador.
3. `MarkAnonymousEscrowPaymentSent` registra que el comprador envió el pago fuera de la cadena.
4. `ReleaseAnonymousAssetEscrow` gasta el compromiso de garantía a los compromisos de salida del comprador.
5. `CancelAnonymousAssetEscrow` gasta el compromiso de garantía a los compromisos de salida del vendedor cuando no se haya marcado el pago.
6. `OpenAnonymousEscrowDispute` y `ResolveAnonymousEscrowDispute` manejan las garantías en disputa con hashes de pruebas y una división controlada por el resolver.

Utilice las consultas anónimas de garantía que figuran en [Questions](/es/reference/queries.md#escrow-and-proof-records) para inspeccionar los registros y estados de garantía.

## Las matemáticas {#math}

La notación a continuación describe el flujo de activos confidenciales. Las implementaciones utilizan el circuito activo y parámetro IDs de la política de activos y del registro de verificadores, por lo que los clientes deben tratar los compromisos, anuladores y bytes de prueba como salidas opacas de la billetera/provedor.

Un billete protegido puede describirse como:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

donde `owner` se deriva del material de visualización o gasto del destinatario y `rho` es la aleatoriedad.

El compromiso de la nota es un compromiso oculto:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

Para los circuitos de transferencia confidencial actuales, las entradas públicas incluyen compromisos de notas, anuladores, una raíz Merkle, una etiqueta de activo y una etiqueta en cadena.

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

Cuando se gasta una nota, la billetera obtiene un anulador:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` es público. No revela la nota, pero es estable para esa nota y cadena, por lo que Iroha puede rechazar un segundo gasto con el mismo anulador.

El árbol de compromiso prueba la existencia de notas. Si una billetera gasta el compromiso `C_i`, la prueba incluye un camino Merkle privado desde `C_i` a una raíz pública reciente:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

Para una transferencia de escudo a escudo, la prueba impone también la conservación del valor:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

En el caso de una indemnización sin escudo, se incluye la cantidad pública:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

La prueba presentada se puede resumir como:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

donde `public_inputs` son los compromisos, anuladores, raíz, etiqueta de activos, etiqueta en cadena y cualquier cantidad pública sin escudo. El testigo contiene las cantidades de notas, la aleatoriedad, el material de gasto y los caminos Merkle. Los validadores verifican la prueba y luego mutan el estado del libro mayor añadiendo compromisos de salida y marcando los anuladores de entrada como gastados.

## Lo que es público {#what-is-public}

Las transacciones anónimas no hacen privados todos los hechos observables. Los datos siguientes pueden seguir siendo públicos:

- el hash de la transacción, la altura del bloque y el pedido
- la autoridad de transacción facilitadora, a menos que la solicitud utilice un modelo privado de punto de entrada o de recaída
- la definición de activo utilizada
- anuladores y compromisos de salida
- los hashes de prueba, las referencias de clave de verificación y los hashes opcionales del sobre
- el importe público y la cuenta del beneficiario de `Unshield`
- Vendedor anónimo, comprador, estado, sellos de tiempo y hashes de evidencia.

Diseñe aplicaciones para que estos metadatos públicos no revelen la relación de negocios que está tratando de proteger.

## Referencia relacionada {#related-reference}

- [`AssetConfidentialPolicy`](/es/reference/data-model-schema.md)
- [`ConfidentialEvent`](/es/reference/data-model-schema.md)
- [`ProofAttachment`](/es/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/es/reference/data-model-schema.md)
- [Las consultas de garantía y prueba ](/es/reference/queries.md#escrow-and-proof-records)
