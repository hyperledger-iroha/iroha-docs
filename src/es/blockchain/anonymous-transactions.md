---
translation_locale: es
translation_source: /blockchain/anonymous-transactions.md
translation_source_hash: c5f10d1395e0b7704d29f4a535dd317b2cabe9c838208f76b7b776dd029089c0
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Transacciones anónimas {#anonymous-transactions}

Las transacciones anónimas en Iroha se construyen a partir de operaciones de activos confidenciales. En lugar de registrar transferencias públicas de cuenta a cuenta con montos públicos, una cartera mueve valor a un libro de contabilidad protegido en la blockchain y luego gasta notas opacas con pruebas de cero conocimiento.

El libro mayor público de la blockchain todavía registra que ocurrió una operación confidencial. Registra compromisos, aniquiladores, hashes criptográficos de prueba y eventos, pero no registra el propietario de la nota, el destinatario ni la cantidad para el movimiento de protegido a protegido. El contenedor de datos de transacción normal aún puede revelar la cuenta que envía, por lo que "anónimo" aquí significa movimiento de activos anónimo, no anonimato automático a nivel de red o de cuenta.

## Bloques de construcción {#building-blocks}

|Concepto|representación del libro mayor de blockchain|
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
|Nota protegida|Un registro de cartera privada que contiene un activo, cantidad, datos del propietario y aleatoriedad.|
|Compromiso|Un valor público de 32 bytes que se compromete con una nota sin revelar sus campos.|
|Anulador|Un valor público de 32 bytes derivado cuando se gasta una nota. Iroha rechaza los anularores repetidos para prevenir el doble gasto.|
|Raíz de Merkle|Una raíz reciente del árbol de compromisos del activo. Las pruebas la utilizan para mostrar que existen notas gastadas.|
|Adjunto de prueba|Un `ProofAttachment` que contiene bytes de prueba más una referencia de clave de verificación o una clave de verificación en línea.|
|Evento confidencial|Un evento de registro en la blockchain como `ConfidentialEvent::Shielded`, `Transferred` o `Unshielded`.|

Las instrucciones principales son:

- `RegisterZkAsset`: registra un activo como compatible con ZK y vincula las claves de verificación de transferencia, protección y desprotección.
- `Shield`: debita un saldo público y agrega un compromiso de nota protegida.
- `ZkTransfer`: gasta notas protegidas en nuevos compromisos de notas protegidas.
- `Unshield`: gasta notas protegidas y acredita un saldo de cuenta pública.
- `ScheduleConfidentialPolicyTransition` y `CancelConfidentialPolicyTransition`: cambiar la política de confidencialidad de un activo a través de la gobernanza.

Una definición de activo también conlleva un [`AssetConfidentialPolicy`](/es/reference/data-model-schema.md). El modo de política controla qué flujos son válidos:

|Modo|Significado|
| ----------------- | ---------------------------------------------------------------- |
| `TransparentOnly` |Solo se aceptan saldos y transferencias públicas normales.|
| `Convertible`     |Los usuarios pueden mover valor entre saldos públicos y notas protegidas.|
| `ShieldedOnly`    |La emisión y transferencia de activos debe permanecer en el libro mayor en cadena protegido.|

## Cómo usarlos {#how-to-use-them}

1. Habilitar soporte confidencial en los nodos validadores. Los validadores deben acordar sobre el backend del verificador, las claves de verificación activas, los IDs de parámetros Poseidon/Pedersen y la versión de las reglas confidenciales. Los nodos rechazan a los pares de red o bloques con resúmenes criptográficos de funciones confidenciales que no coincidan.
2. Publique o registre las claves de verificación y los conjuntos de parámetros utilizados por los circuitos. Las billeteras y los operadores deben referirse a las claves como `VerifyingKeyId`, por ejemplo `halo2/ipa:vk_transfer`.
3. Registre el activo como compatible con ZK con `RegisterZkAsset`, o realice una transición de política de `TransparentOnly` a `Convertible` o `ShieldedOnly`.
4. Protege los fondos públicos con `Shield`. La billetera crea un compromiso de nota y una carga útil encriptada para el destinatario antes de enviar la transacción.
5. Transfiere de forma privada con `ZkTransfer`. La cartera construye una prueba de que posee las notas de entrada, que los valores de entrada y salida están equilibrados, y que cada nota gastada está anclada en un árbol de compromisos reciente.
6. Desproteja solo cuando la política del activo lo permita. `Unshield` revela la cantidad pública y la cuenta del receptor, gasta el anulado de la nota privada y puede crear salidas de cambio privadas.
7. Auditar leyendo eventos confidenciales, registros de prueba, estado de nulificador y registros de custodia anónima a través de consultas escritas y los endpoints Torii API.

## CLI Ejemplos {#cli-examples}

Los comandos ZK CLI están destinados a flujos de operador y de prueba. Las carteras de producción deben generar compromisos, cargas útiles cifradas y pruebas con una biblioteca de cartera/probador antes de enviar las instrucciones resultantes.

Registrar un activo capaz de ZK híbrido:

```bash
iroha app zk register-asset \
  --asset <asset-definition-id> \
  --allow-shield true \
  --allow-unshield true \
  --vk-transfer halo2/ipa:vk_transfer \
  --vk-unshield halo2/ipa:vk_unshield \
  --vk-shield halo2/ipa:vk_shield
```

Construya un contenedor de datos de carga útil cifrada versionado para la nota protegida:

```bash
iroha app zk envelope \
  --ephemeral-pubkey 0101010101010101010101010101010101010101010101010101010101010101 \
  --nonce-hex 020202020202020202020202020202020202020202020202 \
  --ciphertext-b64 AQIDBA== \
  --print-json \
  --output note-envelope.bin
```

El CLI prepara la política de activos, verificando referencias clave y el contenedor de datos de notas encriptadas. No expone los subcomandos de transacción `shield` o `unshield`. Construya esas instrucciones con un SDK y envíelas como una transacción ordinaria con comisión cotizada y firmada.

Un adjunto de prueba sin protección tiene esta forma:

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
```

## SDK Ejemplo {#sdk-example}

Los bytes de prueba exactos provienen del backend de prueba configurado. La carga útil de la transacción solo necesita las entradas públicas y el adjunto de la prueba:

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

## Custodia de Activos Anónima {#anonymous-asset-escrow}

El depósito en custodia de activos anónimos utiliza la misma maquinaria de transferencia protegida para el valor en custodia. Las partes y el estado del depósito en custodia todavía se registran en el registro de custodia, pero las fases de financiamiento, liberación, cancelación y resolución usan anuladores protegidos y compromisos de salida.

Para un comportamiento detallado del depósito en garantía ISI y ejemplos, vea [Custodia de Activos Nativos](/es/blockchain/escrow.md#anonymous-escrow).

El ciclo de vida es:

1. `OpenAnonymousAssetEscrow` gasta notas de financiamiento protegidas y crea un compromiso de depósito en garantía.
2. `AcceptAnonymousAssetEscrow` registra al comprador.
3. `MarkAnonymousEscrowPaymentSent` registra que el comprador envió el pago fuera de la cadena.
4. `ReleaseAnonymousAssetEscrow` gasta el compromiso de depósito en garantía para los compromisos de salida del comprador.
5. `CancelAnonymousAssetEscrow` devuelve el compromiso de depósito en garantía a los compromisos de salida del vendedor cuando el pago no ha sido marcado.
6. `OpenAnonymousEscrowDispute` y `ResolveAnonymousEscrowDispute` manejan depósitos en disputa con pruebas de hashes criptográficos y una división controlada por el resolutor.

Utilice las consultas de depósito en garantía anónimas listadas en [Consultas](/es/reference/queries.md#escrow-and-proof-records) para inspeccionar los registros y estados del depósito en garantía.

## Matemáticas {#math}

La notación a continuación describe el flujo de activos confidenciales. Las implementaciones utilizan el circuito activo y los ID de parámetros de la política de activos y del registro de verificadores, por lo que los clientes deben tratar los compromisos, los anuladores y los bytes de prueba como salidas opacas del monedero/probador.

Una nota protegida puede describirse como:

$$
n = (\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

donde `owner` se deriva del material visualizado o gastado por el receptor y `rho` es nota aleatoriedad.

El compromiso del pagaré es un compromiso oculto:

$$
C = \mathsf{Commit}(\mathsf{asset}, \mathsf{amount}, \mathsf{owner}, \rho)
$$

Para los circuitos de transferencia confidencial actuales, las entradas públicas incluyen compromisos de notas, anuladores, una raíz de Merkle, una etiqueta de activo y una etiqueta de cadena. El circuito aplica una relación de compromiso de esta forma:

$$
C = H_c(\mathsf{amount}, \rho, \mathsf{owner\_tag}, \mathsf{asset\_tag})
$$

Cuando se gasta una nota, la cartera deriva un aniquilador:

$$
N = H_n(\mathsf{spend\_key}, \rho, \mathsf{asset\_tag}, \mathsf{chain\_tag})
$$

`N` es público. No revela la nota, pero es estable para esa nota y cadena, por lo que Iroha puede rechazar un segundo gasto con el mismo anulado.

El árbol de compromisos demuestra la existencia de la nota. Si una billetera gasta el compromiso `C_i`, la prueba incluye un camino de Merkle privado desde `C_i` hasta una raíz pública reciente:

$$
\mathsf{MerkleRoot}(C_i, \mathsf{path}) = R
$$

Para una transferencia de cubierta a cubierta, la prueba también garantiza la conservación del valor:

$$
\sum \mathsf{inputs} = \sum \mathsf{outputs}
$$

Para un sin escudo, se incluye la cantidad pública:

$$
\sum \mathsf{inputs} = \mathsf{public\_amount} + \sum \mathsf{private\_change}
$$

La prueba presentada puede resumirse de la siguiente manera:

$$
\mathsf{Verify}(\mathsf{vk}, \mathsf{public\_inputs}, \pi) = \mathsf{true}
$$

donde `public_inputs` están los compromisos, nulificadores, raíz, etiqueta de activo, etiqueta de cadena y cualquier cantidad pública sin proteger. El testigo contiene las cantidades de las notas, aleatoriedad, gastar material y rutas de Merkle. Los validadores verifican la prueba y luego modifican el estado del registro blockchain añadiendo compromisos de salida y marcando los anuladores de entrada como gastados.

## Qué es público {#what-is-public}

Las transacciones anónimas no hacen que todos los hechos observables sean privados. Los siguientes datos aún pueden ser públicos:

- el hash criptográfico de la transacción, la altura del bloque y el orden
- el principal de autorización de transacción que envía a menos que la aplicación use un punto de entrada privado o un patrón de retransmisor
- la definición del activo que se está utilizando
- anuladores y compromisos de salida
- hashes criptográficos de prueba, referencias de clave de verificación y hashes criptográficos de contenedor de datos opcionales
- monto público y cuenta del destinatario para `Unshield`
- vendedor en depósito anónimo, comprador, estado, marcas de tiempo y hashes criptográficos de evidencia

Diseñe aplicaciones de manera que estos metadatos públicos no revelen la relación comercial que está tratando de proteger.

## Referencia relacionada {#related-reference}

- [`AssetConfidentialPolicy`](/es/reference/data-model-schema.md)
- [`ConfidentialEvent`](/es/reference/data-model-schema.md)
- [`ProofAttachment`](/es/reference/data-model-schema.md)
- [`SignedTransaction.attachments`](/es/reference/data-model-schema.md)
- [Consultas sobre depósito en garantía y pruebas](/es/reference/queries.md#escrow-and-proof-records)
