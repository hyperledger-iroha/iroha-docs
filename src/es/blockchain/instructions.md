---
translation_locale: es
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha Operaciones de instrucción {#iroha-special-instructions}

Cuando hablamos sobre [cómo funciona Iroha](/es/blockchain/iroha-explained), dijimos que las operaciones de instrucción Iroha son la única manera de modificar el estado del mundo. Entonces, ¿qué tipo de instrucción ¿Qué operaciones tenemos? Si has leído las guías específicas del lenguaje en este tutorial, ya has visto un par de instrucciones: `Register<Account>` y `Mint<Numeric>`.

Aquí está la lista completa de operaciones de instrucción Iroha:

|Instrucción|Descripciones|
| --------------------------------------------------------- | ------------------------------------------------ |
| [Registrar/Deseleccionar](#un-register)                       |Asigna un ID a una nueva entidad en la blockchain.|
| [Mint/Burn](#mint-burn)                                   |Emitir/quema de activos numéricos o activar repeticiones.|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Actualizar metadatos del objeto de blockchain.|
| [SetParameter](#setparameter)                             |Establecer un parámetro a nivel de cadena.|
| [Grant/Revoke](#grant-revoke)                             |Dar o quitar permisos y roles.|
| [Transferir](#transfer)                                     |Transferir la propiedad o el valor del activo.|
| [Depósito en garantía nativo y bloqueos de activos](#native-escrow-and-asset-locks) |Bloquear activos numéricos en la custodia del protocolo.|
| [Acuerdo privado atómico](#atomic-private-settlement)   |Gobernar grupos confidenciales y paquetes atómicos.|
| [ExecuteTrigger](#executetrigger)                         |Ejecutar desencadenadores.|
| [Log/Custom/Upgrade](#other-instructions)                 |Registrar, ampliar o actualizar el comportamiento del entorno de ejecución.|

Comencemos con un resumen de las operaciones de instrucción Iroha; qué objetos puede solicitar cada instrucción y qué instrucciones están disponibles para cada objeto.

## Resumen {#summary}

Para cada instrucción, hay una lista de objetos sobre los que se puede ejecutar esta instrucción. Por ejemplo, la transferencia de variantes abarca objetos de libro mayor blockchain propiedad de alguien y activos numéricos, mientras que la emisión abarca activos numéricos y repeticiones de disparadores.

Algunas instrucciones requieren que se especifique un destino. Por ejemplo, si transfieres activos, siempre necesitas especificar a qué cuenta los estás transfiriendo. Por otro lado, cuando estás registrando algo, todo lo que necesitas es el objeto que quieres registrar.

|Instrucción|Objetos|Destino|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               |configuración de dominio ordinario, alias de espacio de datos y alias de cuenta|                      |
| [Registrar/Deseleccionar](#un-register)                       |cuentas, definiciones de activos, NFTs, roles, activadores, pares de red; eliminación de dominio|                      |
| [Mint/Burn](#mint-burn)                                   |activos numéricos, desencadenar repeticiones|cuentas o desencadenantes|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |objetos que tienen [metadatos](./metadata.md): dominios, cuentas, definiciones de activos, NFTs, RWAs, desencadenadores|                      |
| [SetParameter](#setparameter)                             |parámetros de la cadena|                      |
| [Grant/Revoke](#grant-revoke)                             | [roles, tokens de permiso](/es/blockchain/permissions.md)                                                  |cuentas o roles|
| [Transferir](#transfer)                                     |dominios, definiciones de activos, activos numéricos, NFTs|cuentas|
| [Depósitos en garantía nativos y bloqueos de activos](#native-escrow-and-asset-locks) |depósitos de garantía de activos numéricos, bloqueos de activos, compromisos de depósito de garantía anónimos|compradores, destinos o divisiones de disputas|
| [Acuerdo privado atómico](#atomic-private-settlement)   |conjuntos confidenciales limitados a la ruta, rotaciones de políticas, paquetes finalizados y marcadores de aborto|                      |
| [ExecuteTrigger](#executetrigger)                         |desencadena|                      |
| [Log/Custom/Upgrade](#other-instructions)                 |registros, cargas específicas del ejecutor, actualizaciones del ejecutor|                      |

También hay otra forma de ver ISI, en términos del objeto del libro mayor de la blockchain con el que interactúan:

|Objetivo|Instrucciones|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Cuenta|registrar/dar de baja cuentas, recibir activos, actualizar metadatos de cuentas, otorgar/revocar permisos y roles|
|Dominio|asegurar la configuración del dominio, cancelar el registro de dominios, transferir la propiedad del dominio, actualizar los metadatos del dominio|
|Definición de activo|registrar/desregistrar definiciones, transferir propiedad, actualizar metadatos|
|Activo|acuñar/quema cantidad numérica, transferir cantidad numérica|
|Depósito en garantía|abrir, aceptar, marcar el pago como enviado, liberar, cancelar, disputar, resolver, retirar o expirar registros de custodia nativos|
| NFT              |registrar/darse de baja NFTs, transferir propiedad, actualizar metadatos|
| RWA              |registrar lotes, transferir cantidad, retener/liberar, congelar/descongelar, canjear, fusionar, actualizar metadatos y controles|
|Disparador|registrar/dar de baja, acuñar/quemar repeticiones de disparadores, ejecutar disparador, actualizar metadatos del disparador|
|Mundo|registrar/desregistrar pares y roles de red, configurar parámetros, actualizar el ejecutor|

## CLI Ejemplos {#cli-examples}

Los ejemplos en esta página asumen que estás ejecutando comandos desde el espacio de trabajo ascendente Iroha contra la configuración de cliente local predeterminada:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Si instalaste el binario `iroha`, usa `iroha --config ./defaults/client.toml` en su lugar. Sustituye los marcadores de posición a continuación con valores de tu red:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Al apuntar a la testnet pública Taira, use una configuración de cliente Taira. Antes de ejecutar ejemplos que requieren pago de tarifas, guarde el asistente de servicio de financiamiento de testnet de [Obtener Testnet XOR en Taira](/es/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) como `taira_faucet_claim.py`, luego reclame XOR de testnet del servicio de financiamiento de testnet:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Cuando aparezca el activo financiado por el dispensador, añada a las transacciones de escritura los metadatos exigidos del activo de gas:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` es la ruta ordinaria de primera publicación para crear dominios y sus SNS arrendamientos. Vincula de manera declarativa el espacio de datos exacto, el propietario, el plazo del arrendamiento, y la protección de cotización, luego crea o repara todo el estado requerido de manera atómica. Use el endpoint autenticado `POST /v1/aliases/setup/plan` API o el flujo de trabajo correspondiente CLI:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

La intención y el plan son libres de secretos, pero el paso de aplicar firma y envía una transacción ordinaria con la cuenta configurada. Un plan está vinculado a su cadena, al principal de autorización, al ancla de estado en vivo y al plazo; nunca reutilices uno en otra red.

## (Des)Registrar {#un-register}

Registrar y cancelar el registro son las instrucciones utilizadas para asignar un ID a una nueva entidad en la cadena de bloques.

Todo lo que puede ser registrado es tanto `Registrable` como `Identifiable`, pero no todo lo que es `Identifiable` es `Registrable`. La mayoría de las cosas se registran directamente, pero en algunos casos la representación en la blockchain tiene considerablemente más datos. Por razones de seguridad y rendimiento, usamos generadores para tales estructuras de datos (por ejemplo, `NewAccount`), y el registro de pares en la red tiene una instrucción dedicada de prueba de posesión. Como regla, todo lo que puede ser registrado también puede ser dado de baja, pero eso no es una regla absoluta.

Puede registrar cuentas, definiciones de activos, NFTs, pares de red, roles y desencadenadores. La configuración del dominio utiliza `EnsureAlias`; la carga útil sin procesar `Register::Domain` está reservada para genesis/bootstrap. El registro de pares de la red utiliza `RegisterPeerWithPop`, que contiene una prueba de posesión de la clave del par de la red. Consulta nuestro [convenciones de nomenclatura](/es/reference/naming.md) para aprender sobre las restricciones impuestas a los nombres de entidades.

RWA los lotes se crean mediante la instrucción dedicada `RegisterRwa`. El código actual no expone una instrucción `UnregisterRwa`; use `RedeemRwa` para dar de baja la cantidad representada.

::: info

Tenga en cuenta que, dependiendo de cómo decida configurar su [bloque génesis de blockchain](/es/guide/configure/genesis.md) en `genesis.json` (específicamente, si incluye o no el registro de tokens de permiso), el proceso para registrar una cuenta puede ser muy diferente. En general, podemos resumirlo así:

- En una blockchain pública, cualquiera debería poder registrar una cuenta.
- En una blockchain privada, puede haber un proceso único para registrar cuentas. En una blockchain privada típica, es decir, una blockchain sin ningún proceso único para registrar cuentas, necesitas una cuenta para registrar otra cuenta.

Discutimos estas diferencias en gran detalle cuando nosotros [comparar blockchain privadas y públicas](/es/guide/configure/modes.md).

:::

::: info

Registrar un par de red es actualmente la única manera de agregar pares de red que no formaban parte del conjunto original de pares de red confiables a la red.

:::

Utilice una guía específica del idioma para registrar objetos de blockchain:

|Idioma|Guía|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   |Utilice el [Iroha CLI](/es/get-started/operate-iroha-via-cli.md) para configurar dominios y registrar cuentas y activos.|
| Rust                  |Usa el [tutorial de Rust](/es/guide/tutorials/rust.md).|
| Kotlin/Java           |Usa el [Kotlin/Java](/es/guide/tutorials/kotlin-java.md).|
| Python                |Usa el [tutorial de Python](/es/guide/tutorials/python.md).|
| JavaScript/TypeScript |Usa el [JavaScript/TypeScript](/es/guide/tutorials/javascript.md).|

Planifique y aplique la configuración de dominio ordinaria, luego desregistre el dominio cuando ya no sea necesario:

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

Registrar y cancelar el registro de cuentas:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Registrar y anular el registro de definiciones de activos:

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

Registrar y anular el registro de NFTs. La registración de NFT lee su contenido JSON desde la entrada estándar:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Registrar y anular el registro de roles:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Registrar y anular el registro de disparadores. El registro de disparadores necesita ya sea bytecode compilado IVM o una lista de instrucciones serializada. Este ejemplo construye una instrucción `Log` con el CLI y la envía al registro del disparador:

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

Registre y elimine el registro de pares de red. Genere la clave BLS y PoP con `kagami` si aún no las tiene:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Crear/Quemar {#mint-burn}

La emisión y quema pueden referirse a activos numéricos y disparadores con un número limitado de repeticiones. Algunos activos pueden declararse como no acuñables, lo que significa que solo se pueden emitir una vez después del registro.

Los activos se emiten a una cuenta específica, generalmente la que registró el activo en primer lugar. Las cantidades de activos no son negativas, por lo que nunca puedes tener `$-1.0` de un activo o quemar una cantidad negativa y obtener una emisión.

Utilice una guía específica del idioma para emitir activos de blockchain:

- [CLI](/es/get-started/operate-iroha-via-cli.md)
- [Rust](/es/guide/tutorials/rust.md)
- [Kotlin/Java](/es/guide/tutorials/kotlin-java.md)
- [Python](/es/guide/tutorials/python.md)
- [JavaScript/TypeScript](/es/guide/tutorials/javascript.md)

Aquí hay ejemplos de activos quemados:

- [CLI](/es/get-started/operate-iroha-via-cli.md)
- [Rust](/es/guide/tutorials/rust.md)

emitir y quemar activos numéricos:

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

emitir y quemar repeticiones de disparo:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Transferir {#transfer}

Las transferencias mueven la propiedad o el valor entre cuentas. Las variantes genéricas de transferencia cubren dominios, definiciones de activos, activos numéricos y NFTs. El movimiento de cantidad de RWA utiliza las instrucciones dedicadas `TransferRwa` y `ForceTransferRwa` descritas en [Activos del mundo real](/es/blockchain/rwas.md).

Para hacer esto, una cuenta debe recibir el [permiso para transferir activos](/es/reference/permissions.md). Consulte un ejemplo sobre cómo transferir activos con [CLI](/es/get-started/operate-iroha-via-cli.md) o [Rust](/es/guide/tutorials/rust.md).

Transferir activos numéricos:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Transferir la propiedad del dominio, la definición del activo y NFT:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Depósitos en garantía nativos y bloqueos de activos {#native-escrow-and-asset-locks}

Las instrucciones de fideicomiso nativas bloquean activos numéricos bajo la custodia del protocolo gestionado por el libro mayor. Se utilizan para la liquidación al estilo de mercado, bloqueos de activos genéricos y flujos de fideicomiso anónimos protegidos.

El depósito en garantía del mercado utiliza `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute` y `ResolveEscrowDispute`. Los bloqueos de activos genéricos utilizan `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock` y `ExpireAssetLock`. La custodia anónima refleja el ciclo de vida del mercado con `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute` y `ResolveAnonymousEscrowDispute`.

Estos ISIs actualmente no tienen comandos CLI de primera clase. Utilice constructores SDK tipados o cargas de instrucciones serializadas, y consulte [Custodia de Activos Nativos](/es/blockchain/escrow.md) para detalles del ciclo de vida, permisos, consultas, eventos y ejemplos de Rust.

## Acuerdo Privado Atómico {#atomic-private-settlement}

La familia de instrucciones de liquidación privada atómica gobernada está separada de Native transparente AMX. `ActivatePrivateSettlementPoolV1` establece un conjunto confidencial de alcance de ruta a partir de una proyección de gobernanza redactada y compromisos de origen canónico. `FinalizeAtomicPrivateSettlementV1` aplica un paquete certificado por el comité de manera atómica, mientras que `AbortAtomicPrivateSettlementV1` publica solo el marcador terminal público autorizado por el patrocinador.

`RotatePrivateSettlementPoolPolicyV1` está restringido a la gobernanza de privacidad. Requiere el valor exacto del digest criptográfico de gobernanza actual, conserva la ruta, el grupo, el compromiso de vinculación de activos, la frontera del estado, los conjuntos de repetición y los registros de resultados del protocolo finalizados, y avanza la revisión pública en uno, y utiliza una nueva época de clave de auditor. La rotación se activa en su altura de inclusión y no puede compartir esa altura con un registro de resultado del protocolo para la misma ruta/pool. La línea de revisión pública mantiene los registros de resultados del protocolo finalizados antes del reinicio de la rotación: válidos y reproducibles de manera idempotente; los paquetes de políticas antiguas en curso fallan cerrados. Los operadores deben conservar las claves de descifrado antiguas para las cápsulas almacenadas o gobernar y probar el reempaquetado de cápsulas antes de destruirlas.

La ruta permanece desactivada por defecto y no está calificada para producción. Consulte [Ejecutar Liquidación Atómica Privada entre Espacios de Datos](/es/get-started/atomic-private-settlement) para los requisitos de configuración, principal de autorización, auditoría, recuperación y liberación.

## Conceder/Revocar {#grant-revoke}

Las instrucciones de concesión y revocación se utilizan para la cuenta [permisos y roles](permissions.md).

`Grant` se utiliza para otorgar permanentemente a un usuario ya sea un único permiso o un grupo de permisos (un "rol"). Los roles y permisos otorgados solo pueden eliminarse mediante la instrucción `Revoke`. Por lo tanto, estas instrucciones deben usarse con cuidado.

Conceder y revocar un rol en una cuenta:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Conceder y revocar tokens de permiso. Los comandos de permiso leen un objeto de permiso desde la entrada estándar:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Conceder y revocar permisos en un rol:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Estas instrucciones actualizan el objeto [metadatos](/es/blockchain/metadata.md). Use `SetKeyValue` para insertar o reemplazar una entrada de metadatos y `RemoveKeyValue` para eliminar una.

Metadatos `set` comandos leen el valor JSON de la entrada estándar:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

El mismo patrón está disponible para cuentas, definiciones de activos, NFTs, RWAs y disparadores:

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

`SetParameter` cambia los parámetros a nivel de cadena expuestos por el modelo de datos activo y el ejecutor.

Establezca un parámetro pasando un objeto de parámetro único JSON en la entrada estándar:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Esta instrucción se utiliza para ejecutar [desencadenantes](./triggers.md).

El CLI puede registrar disparadores y suscribirse a eventos de ejecución de disparadores directamente. No proporciona un comando `execute trigger` tipado, por lo que para enviar un manual `ExecuteTrigger` instrucción, genere un `InstructionBox` serializado con una herramienta SDK o ejecutor y pase la matriz resultante JSON a través de `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Otras instrucciones {#other-instructions}

Iroha también expone instrucciones de nivel inferior para la integración del tiempo de ejecución de software y del ejecutor:

- `Log`: emitir una entrada de registro durante la ejecución
- `CustomInstruction`: transportar cargas útiles JSON específicas del ejecutor
- `Upgrade`: activar una mejora de ejecutor

Envía una instrucción `Log` con el asistente de ping:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Envíe una instrucción de ejecutor personalizada como un `InstructionBox` serializado. La forma de la carga útil es específica del ejecutor, por lo que genere la instrucción con el SDK correspondiente o las herramientas del ejecutor:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Actualiza el ejecutor desde un archivo de bytecode compilado IVM:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
