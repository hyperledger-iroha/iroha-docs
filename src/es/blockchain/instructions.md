---
translation_locale: es
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Instrucciones especiales {#iroha-special-instructions}

Cuando hablamos de [¿Cómo Iroha que opera](/es/blockchain/iroha-explained), Nosotros lo decimos. Iroha Las instrucciones especiales son la única manera de modificar el estado mundial. ¿Qué tipo de instrucciones especiales tenemos? Si han leído las guías específicas del idioma en este tutorial, Usted ya ha visto un par de instrucciones: `Register<Account>` y `Mint<Numeric>`.

La siguiente es la lista completa de las instrucciones especiales Iroha:

|Instrucciones |Descripciones |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Registro/desregistro ](#un-register) |Dar un ID a una nueva entidad en la cadena de bloques. |
| [Mint/Burn](#mint-burn) |Activos numéricos de moneda/combustión o repeticiones desencadenantes. |
| [SetKeyValue/RemoveKeyValue ](#setkeyvalue-removekeyvalue) |Actualizar los metadatos de objetos blockchain. |
| [SetParameter](#setparameter) |Establezca un parámetro de toda la cadena.|
| [Subvención/Revocación](#grant-revoke) |Dar o eliminar permisos y roles. |
| [Transferencia ](#transfer) |Transferencia de propiedad o valor del activo. |
| [Escrow y bloqueo de activos nativos ](#native-escrow-and-asset-locks) |Bloquea los activos numéricos en custodia de protocolo. |
| [ExecuteTrigger](#executetrigger) |Ejecutar los gatillo. |
| [Log/Custom/Upgrade ](#other-instructions) |Registre, extienda o actualice el comportamiento del tiempo de ejecución. |

Comencemos con un resumen de Iroha Instrucciones especiales; qué objetos cada instrucción puede ser llamada para y qué instrucciones están disponibles para cada objeto.

## Resumen {#summary}

Para cada instrucción, hay una lista de objetos en los que se puede ejecutar esta instrucción. Por ejemplo, las variantes de transferencia cubren objetos del libro mayor y activos numéricos, mientras que la acuñación cubre activos numéticos y desencadena repeticiones.

Algunas instrucciones requieren que se especifique un destino. Por ejemplo, si usted transfiere activos, siempre debe especificar a qué cuenta los está transfiriendo.

|Instrucciones |Objetos |El destino |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |dominio ordinario, alias de espacio de datos y alias de cuentas |                      |
| [Registro/desregistro ](#un-register) |Cuentas, definiciones de activos, NFTs, roles, factores desencadenantes, pares; eliminación del dominio |                      |
| [Mint/Burn](#mint-burn) |activos numéricos, repeticiones desencadenantes |cuentas o factores desencadenantes |
| [SetKeyValue/RemoveKeyValue ](#setkeyvalue-removekeyvalue) |Objetos que tienen [metadatos](./metadata.md): dominios, cuentas, definiciones de activos, NFTs, RWAs, desencadenantes |                      |
| [SetParameter](#setparameter) |Parámetros de la cadena |                      |
| [Subvención/Revocación](#grant-revoke) | [funciones, tokens de permiso ](/es/blockchain/permissions.md) |cuentas o funciones |
| [Transferencia ](#transfer) |dominios, definiciones de activos, activos numéricos, NFTs |cuentas |
| [Escrow y bloqueo de activos nativos ](#native-escrow-and-asset-locks) |garantías numéricas de activos, bloqueos de activos, compromisos anónimos en garantía |los compradores, los destinos o las divisiones de la disputa |
| [ExecuteTrigger](#executetrigger) |desencadenantes .|                      |
| [Log/Custom/Upgrade ](#other-instructions) |registros, cargas útiles específicas de los ejecutores, actualizaciones del ejecutor |                      |

También hay otra manera de ver ISI, en términos del objeto del libro mayor que tocan:

|Objetivo .|Instrucciones |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Cuenta |Registro de cuentas/desregistro, activos recibidos, metadatos actualizados de cuentas, permisos y funciones de concesión/revocación |
|Dominio |garantizar la configuración del dominio, no registrar dominios, transferir la propiedad del dominio, actualizar los metadatos del dominio |
|Definición de activos |las definiciones de registro/no registro, transferencia de propiedad, actualización de metadatos |
|Activos |cantidad numérica de menta/combustión, transferencia de cantidad numérica |
|Escrow |abrir, aceptar, marcar el pago enviado, liberar, cancelar, disputar, resolver, retirar o caducar los registros de custodia nativos.|
|NFT |Registro/desregistro NFTs, transferencia de propiedad, actualización de metadatos |
|RWA |registro de lotes, cantidad transferida, retención/liberación, congelación/descongelación, canje, fusión, actualización de metadatos y controles |
|Trigger .|registrar/desinscrir, repeticiones del gatillo de la moneda/quema, ejecutar el gatillo, actualizar los metadatos del gatillo |
|El mundo |registrar/desregistrar pares y roles, establecer parámetros, actualizar el ejecutor |

## CLI Ejemplos {#cli-examples}

Los ejemplos de esta página suponen que está ejecutando comandos desde el espacio de trabajo upstream Iroha contra la configuración local predeterminada del cliente:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Si ha instalado el binario `iroha`, utilice `iroha --config ./defaults/client.toml` en su lugar.

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Cuando se dirige al público Taira la red de prueba, utilizar un Taira Configuración del cliente. Antes de ejecutar ejemplos de pago, guarde el ayudante del grifo de [Obtenga el Testnet XOR en el Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, luego reclamar la red de prueba XOR del grifo:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Después de que el activo financiado por el grifo sea visible, adjunta los metadatos requeridos sobre los activos de gas para escribir las transacciones:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` es el camino ordinario de primera liberación para la creación de dominios y sus contratos de arrendamiento SNS. Utilice el punto final `POST /v1/aliases/setup/plan` autenticado o el flujo de trabajo correspondiente CLI:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

La intención y el plan son libres de secretos, pero se aplican señales de paso y se presenta una transacción ordinaria con la cuenta configurada.

## (Un) Registro {#un-register}

El registro y el no registro son las instrucciones utilizadas para otorgar una ID a una nueva entidad en la cadena de bloques.

Todo lo que se puede registrar es tanto `Registrable` como `Identifiable`, pero no todo lo que es `Identifiable` es`Registrable`. La mayoría de las cosas se registran directamente, pero en algunos casos la representación en el blockchain tiene considerablemente más datos. Por razones de seguridad y rendimiento, utilizamos constructores para dichas estructuras de datos (por ejemplo `NewAccount`), y el registro entre pares tiene una instrucción dedicada de prueba de posesión.

Usted puede registrar cuentas, definiciones de activos, NFTs, los pares, roles y desencadenantes. `EnsureAlias`; el crudo `Register::Domain` la carga útil está reservada para genesis/bootstrap. `RegisterPeerWithPop`, que lleva una prueba de posesión para la llave de pares. [nombramiento de convenciones](/es/reference/naming.md) para conocer las restricciones impuestas a los nombres de entidades.

Los lotes RWA se crean a través de la instrucción `RegisterRwa` dedicada. El código actual no expone una instrucción `UnregisterRwa`; utilice `RedeemRwa` para retirar la cantidad representada.

::: Información

Tenga en cuenta que dependiendo de cómo decida configurar su bloque genético [](/es/guide/configure/genesis.md) en `genesis.json` (específicamente, si incluye o no el registro de tokens de permiso), el proceso para registrar una cuenta puede ser muy diferente.

- En una cadena de bloques pública, cualquier persona debería poder registrar una cuenta.
- En una cadena de bloques privada, puede haber un proceso único para registrar cuentas. En una blockchain privada típica, es decir, una cadena debloques sin procesos únicos para el registro de cuentas, necesita una cuenta para registrar otra cuenta.

En este sentido, la Comisión ha adoptado una propuesta de directiva relativa a los [comparación entre cadenas de bloques privadas y públicas](/es/guide/configure/modes.md).

:::

::: Información

El registro de un igual es actualmente la única manera de agregar pares que no formaban parte del primer grupo de confianza establecido en la red.

:::

Consulte una de las guías específicas del idioma para que lo guien a través del proceso de registro de objetos en un blockchain:

|El lenguaje |Guía |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |Utilice el [Iroha CLI](/es/get-started/operate-iroha-via-cli.md) para configurar dominios y registrar cuentas y activos. |
|Rust |Usar el tutorial [Rust ](/es/guide/tutorials/rust.md). |
|Kotlin/Java |Utilice el tutorial [Kotlin/Java ](/es/guide/tutorials/kotlin-java.md). |
|Python |Usar el tutorial [Python ](/es/guide/tutorials/python.md). |
|JavaScript/TypeScript |Use el tutorial [JavaScript/TypeScript ](/es/guide/tutorials/javascript.md). |

Planifique y aplique la configuración de dominio ordinario, luego deje de registrar el dominio cuando ya no sea necesario:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

Cuentas registradas y no registradas:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Las definiciones de activos registradas y no registradas:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

Registro y no registro NFTs. El registro NFT lee su contenido JSON a partir de la entrada estándar:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Funciones de registro y no registro:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Registro y desregistro de los disparadores. El registro del desencadenante necesita un código IVM compilado o una lista de instrucciones serializada. Este ejemplo construye una instrucción `Log` con el CLI y la envía al registrador del activador:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

Registro y desregistro de pares. Generar la clave BLS y PoP con `kagami` si ya no las tiene:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## La menta y el bronceado {#mint-burn}

La acuñación y la quema se pueden referir a activos numéricos y desencadenan con un número limitado de repeticiones.

Los activos se acuñan en una cuenta específica, generalmente la que registró el activo en primer lugar. Las cantidades de activos no son negativas, por lo que nunca puede tener `$-1.0` de un activo o quemar una cantidad negativa y obtener una moneda.

Consulte una de las guías específicas del idioma para guiarle a través del proceso de extracción de activos en un blockchain:

- [CLI](/es/get-started/operate-iroha-via-cli.md)
- [Rust](/es/guide/tutorials/rust.md)
- [Kotlin/Java](/es/guide/tutorials/kotlin-java.md)
- [Python](/es/guide/tutorials/python.md)
- [JavaScript/TypeScript ](/es/guide/tutorials/javascript.md)

He aquí algunos ejemplos de activos en llamas:

- [CLI](/es/get-started/operate-iroha-via-cli.md)
- [Rust](/es/guide/tutorials/rust.md)

Activos numéricos de hortalizas y quemadores:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

Repeticiones de la menta y el gatillo:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Transferencia {#transfer}

Las transferencias mueven la propiedad o el valor entre cuentas. Las variantes genéricas de transferencia cubren dominios, definiciones de activos, activos numéricos y NFTs. El movimiento de cantidades RWA utiliza las instrucciones dedicadas `TransferRwa` y `ForceTransferRwa` descritas en [Real-World Assets ](/es/blockchain/rwas.md).

Para ello, se debe conceder una cuenta a los [Permiso para transferir activos](/es/reference/permissions.md). Se refiere a un ejemplo de cómo transferir activos con [CLI](/es/get-started/operate-iroha-via-cli.md) o [Rust](/es/guide/tutorials/rust.md).

Transferencia de activos numéricos:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

El dominio de transferencia, la definición del activo y la propiedad NFT:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Los escudos y los activos nativos {#native-escrow-and-asset-locks}

Las instrucciones de custodia nativa bloquean los activos numéricos en la custodia del protocolo administrado por un libro mayor. Se utilizan para el liquidación al estilo de mercado, bloqueos genéricos de activos y flujos anónimos de custodia protegidos.

Utilizaciones de la fianza en el mercado `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, y `ResolveEscrowDispute`. Uso de bloqueos genéricos de activos `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, y `ExpireAssetLock`. El escrow anónimo refleja el ciclo de vida del mercado con `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, y `ResolveAnonymousEscrowDispute`.

Estos ISIs no tienen actualmente los comandos de primera clase CLI. Utilice constructores de tipo SDK o cargas útiles de instrucciones serializadas, y vea [Native Asset Escrow](/es/blockchain/escrow.md) para obtener detalles del ciclo de vida, permisos, consultas, eventos y ejemplos de Rust.

## Grants/Revocaciones {#grant-revoke}

Las instrucciones de concesión y revocación se utilizan para los permisos y funciones de cuenta [ ](permissions.md).

`Grant` Se utiliza para otorgar permanentemente a un usuario un solo permiso o un grupo de permisos (un "rollo"). Las funciones y permisos otorgados sólo pueden ser eliminados a través de la `Revoke` Como tal, estas instrucciones deben ser utilizadas con cuidado.

Concesión y revocación de un papel en una cuenta:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Conceder y revocar tokens de permisos. Los comandos de permisos leen un objeto de permiso desde la entrada estándar:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Conceder y revocar los permisos de un papel:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Estas instrucciones actualizan el objeto [metadatos](/es/blockchain/metadata.md). Utilice `SetKeyValue` para insertar o reemplazar una entrada de metadatos y `RemoveKeyValue` para eliminarla.

Los comandos de metadatos `set` leen el valor de JSON desde la entrada estándar:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

El mismo patrón está disponible para las cuentas, las definiciones de activos NFTs, RWAs y los desencadenantes:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` cambia los parámetros de toda la cadena expuestos por el modelo de datos activo y el ejecutor.

Establezca un parámetro mediante el paso de un único parámetro JSON en la entrada estándar:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Esta instrucción se utiliza para ejecutar los desencadenantes [ ](./triggers.md).

El CLI puede registrar los desencadenantes y suscribirse directamente a los eventos de ejecución del desencadenante. No proporciona un comando `execute trigger`, por lo que debe enviar una instrucción manual `ExecuteTrigger`, generar una serie `InstructionBox` con una herramienta SDK o ejecutor y pasar la matriz JSON resultante a través de `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Otras instrucciones {#other-instructions}

Iroha expone también las instrucciones de nivel inferior para la integración del tiempo de ejecución y el ejecutor:

- `Log`: emitir una entrada en el registro durante la ejecución
- `CustomInstruction`: llevar cargas útiles específicas del ejecutor JSON
- `Upgrade`: activar la actualización del ejecutor

Presentar una instrucción `Log` con el asistente de ping:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Envía una instrucción de ejecutor personalizada como una serie `InstructionBox`. La forma de la carga útil es específica para el ejecutor, así que genera la instrucción con la combinación SDK o herramienta del ejecutor:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Actualizar el ejecutor a partir de un archivo compilado IVM de código byte:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
