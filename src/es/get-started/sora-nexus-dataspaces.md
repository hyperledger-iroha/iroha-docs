---
translation_locale: es
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 8cc510f79468efa58732b806c254155d4d7225c0876272bd8126ea07e8607888
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Construir en SORA 3: Taira y Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 es la pista de despliegue pública orientada a la aplicación construida en Iroha 3 y SORA Nexus. Construir y ensayar primero en Taira, luego mover la misma forma del cliente a Minamoto solo cuando tenga llaves mainnet separadas, reales XOR por tarifas y aprobación de producción.

Esta guía muestra cómo configurar un cliente Iroha para las redes públicas SORA 3:

- Red de ensayo Taira en `https://taira.sora.org`
- Minamoto red principal en `https://minamoto.sora.org`

Utilización Taira para las pruebas de integración, los canales de escritura financiados por grifos y los ensayos de despliegue. Minamoto En el caso de las redes de transporte, los servicios de transporte y de telecomunicaciones se aplican únicamente a las actividades de la red principal preparadas para su producción. XOR:

- El Taira utiliza la red de prueba XOR del grifo público.
- Minamoto utiliza real XOR. No hay grifo Minamoto.

## Camino de los constructores {#builder-path}

|Paso a paso .|Taira Red de pruebas |Minamoto Mainnet |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Comienza a leer el estado de la red |Encuesta `/status` sin llaves |Encuesta `/status` sin llaves |
|Elige un espacio de datos .|Utilice público `universal` a menos que su aplicación necesite un carril regulado |Usar el mismo espacio de datos sólo después de la aprobación de la red principal |
|Obtenga el activo de los honorarios .|Utilice el grifo público Taira |Recibir XOR de una cuenta financiada Minamoto o un flujo del Tesoro aprobado |
|Test escribe |Utilizar el ensayo financiado con grifo XOR |No use herramientas de prueba; escribe gastar real XOR |
|Promover |Mantenga la lógica, el monitoreo y el manejo de los firmas.|Utilice llaves separadas, fondos y controles de liberación |

El flujo práctico es:

1. Construir el cliente contra Taira y utilizar el espacio de datos público `universal`.
2. Añadir un firmante y financiarlo con el grifo Taira.
3. Exercita la lógica de tu aplicación contra Taira hasta que los fallos sean aburridos y observables.
4. Crear un firmante separado Minamoto, financiar con real XOR, y mover sólo las mismas operaciones probadas a la red principal.

## Sigue con el libro de cocina {#continue-with-the-cookbook}

Utilice esta guía para elegir una red, configurar un signatario y pagar las tarifas. Luego continúe con la receta que coincida con el comportamiento de la aplicación que desea construir:

|Objetivo .|La receta |
| --- | --- |
|Verificar Taira y configurar un cliente | [Conectarse a Taira](/es/cookbook/connect-to-taira.md) |
|Envía una primera escritura y verifique su resultado | [Enviar y verificar las transacciones ](/es/cookbook/submit-and-verify-transactions.md) |
|Registro, moneda y movimiento de valor | [Activos Fungibles ](/es/cookbook/fungible-assets.md) |
|Lea el estado de la aplicación filtrada | [Query Ledger Estado ](/es/cookbook/query-ledger-state.md) |
|Reaccionar a los cambios comprometidos | [Eventos de flujo](/es/cookbook/stream-events.md) |

El libro de cocina mantiene cada flujo de trabajo centrado y se enlaza aquí cuando necesita financiación Taira o contexto de red SORA Nexus.

## 1. Comprende lo que estás preparando {#_1-understand-what-you-are-setting-up}

En SORA Nexus, un espacio de datos es parte del catálogo de vía de red y enrutamiento. Un cliente no crea un nuevo espacio de datos público simplemente cambiando `client.toml`. La configuración del cliente hace dos cosas:

1. señalar al cliente en el punto final derecho Torii
2. selecciona el contexto de enrutamiento del dominio y espacio de datos para su cuenta canónica

`AccountId` Es siempre canónico y sin dominios. `[account].domain` el valor en `client.toml` proporciona un contexto de enrutamiento y alias; no se convierte en parte de la identidad de la cuenta. Para la mayoría de las aplicaciones, comience con el público `universal` espacio de datos. Uso del contexto del dominio `domain.dataspace` forma, por ejemplo:

```text
wonderland.universal
```

Si necesita un nuevo espacio de datos organizacional, prepare un catálogo y una propuesta de enrutamiento en lugar de intentar registrarlo desde una cuenta de cliente ordinaria. Ver [Provision a New Dataspace](#_8-provision-a-new-dataspace) abajo.

## 2. Compruebe el punto final público Torii {#_2-check-the-public-torii-endpoint}

Compruebe que el punto final objetivo está en vivo antes de configurar un firmador.

Para Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Para Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Inspeccionar el espacio de datos y la vista del carril expuestos por el nodo:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Utilice el mismo comando con `https://minamoto.sora.org/status` para la red principal.

## Taira MCP para los agentes {#taira-mcp-for-agents}

Taira También expone una Torii- Protocolo de contexto modelo nativo (MCP Usalo cuando un agente necesita testnet en vivo. el diagnóstico scripted, o los ensayos de escritura estrictamente revisados sin construir una costumbre Torii El cliente primero.

|Configuración .|El valor |
| --- | --- |
|MCP punto final |`https://taira.sora.org/v1/mcp` |
|Raíz de red |`https://taira.sora.org` |
|Uso previsto |Taira testnet lecturas y ensayos de escritura financiados por el grifo |
|Producción equivalente |No señale esta entrada en Minamoto a menos que se apruebe explícitamente un punto final de la red principal MCP y los controles de liberación |

Verifique los metadatos del puente antes de agregar el material de firma:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

Configurar el URL como un usuario local MCP servidor en el tiempo de ejecución del agente. No comprometa al agente MCP config, API fichas, encabezados de autores enviados, `authority`, o `private_key` los valores en este repo de documentos o en un repo de aplicaciones.

Reglas urgentes para agentes que funcionan bien con Taira:

- Descubra las herramientas del servidor MCP antes de llamarlas; vuelva a descubrir si el servidor informa `listChanged`.
- Las herramientas `iroha.` seleccionadas son preferibles a las herramientas en bruto `torii.`.
- Comienza con sólo lectura: inspeccione el estado, cuentas, activos, alias, bloques, estado de gobierno y estado de transacción antes de proponer escritos.
- Requerir una instrucción humana explícita antes de las mutaciones en vivo de la red de prueba. Para los sobres de transacciones prefirmados, utilice `iroha.transactions.submit_and_wait` para que el agente espere al resultado en lugar de sólo enviarlo.
- Resume los hashes de transacción, el estado final y los errores de validación del servidor en la respuesta del agente.

### Flujo de trabajo de desarrollo con agentes {#development-workflow-with-agents}

Usar agentes como ayudantes de desarrollo para clientes Iroha, constructores de transacciones, scripts de diagnóstico y libretas de pruebas. Mantenga la autoridad del agente limitada: Puede inspeccionar el código, leer el estado Taira, proponer cambios y ejecutar pruebas locales, pero no debe mutar una red en vivo hasta que un humano apruebe la operación exacta.

Un flujo de trabajo práctico es:

1. Pídale al agente que inspeccione los documentos pertinentes, el código SDK, el comando CLI o el esquema de herramientas MCP antes de escribir el código.
2. Que el agente escriba primero la ruta más pequeña del cliente: verificación de estado, búsqueda de cuenta, resolución alias o búsqueda del balance.
3. Añadir el código de construcción de transacciones sólo después de que las llamadas solo para lectura funcionen contra Taira.
4. Mantenga opt-in a los ensayos de red en vivo, por ejemplo detrás de `TAIRA_LIVE=1`, para que una prueba de unidad normal nunca gasta fondos de la red de pruebas o dependa de la disponibilidad de la red.
5. Requerir al agente que informe la raíz de red, cadena, cuenta de autoridad, resumen de instrucciones, activo de tarifas y cambio esperado en el estado antes de presentar cualquier transacción.
6. Revise el código generado para la manipulación secreta, el comportamiento de retentaje, la idempotencia y el manejo del rechazo antes de promocionarlo a CI o flujos de trabajo de la red.

Las herramientas útiles MCP para el desarrollo incluyen búsquedas de activos de cuentas, resolución de alias, búsqueda de bloqueo, búsquedo de transacciones, listas de transacciones y verificaciones del estado de la tubería. Utilice estas para construir confianza antes de enviar cualquier carga útil firmada.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Flujo de trabajo de las transacciones a través de agentes {#transaction-workflow-through-agents}

El Consejo MCP puente puede presentar una firma Iroha la transacción, pero no elimina los requisitos normales de la transacción. Una transacción todavía necesita una autoridad correcta, permisos, financiación de tarifas, cadena ID, Metadatos, y firma.

Para productos crudos Iroha las transacciones, elaborar y firmar el envase de la transacción con una SDK o CLI Primero, luego dar al agente sólo los bytes de transacción canónica firmada codificada como `body_base64`. El agente puede presentar el sobre con `iroha.transactions.submit_and_wait`, o presentar con `iroha.transactions.submit` y la encuesta con `iroha.transactions.wait`.

No pongan las claves privadas en una solicitud de agente. Si un agente necesita construir una transacción, apunta a un código local que cargue secretos de el entorno de ejecución del usuario, la cadena de llaves, el firmador de hardware o el archivo de configuración de testnet ignorado El agente nunca debe escribir el material clave en Markdown, fichas, registros, o compromisos.

Antes de presentar una transacción, haga que el agente elabore un breve plan de transacción:

- `network`: Taira raíz y cadena de la red de ensayo ID
- `authority`: cuenta que firma y paga tarifas
- `instructions`: registro, acuña, quemadura, transferencia, metadatos, permiso o resumen de la convocatoria del contrato
- `fee asset`: activo que se cobrará en Taira
- `preflight reads`: cuentas, saldo de activos, permisos, alias o controles de bloques ya realizados
- `expected result`: el estado que debe ser visible después de la confirmación
- `idempotency`: qué ocurre si se retoma la misma solicitud

Después de la presentación, haga que el agente espere un estado terminal y luego verifique el cambio de estado con una consulta de lectura.

- hash de las transacciones
- el estado de terminal como `Committed`, `Applied`, `Rejected` o `Expired`;
- detalle del bloque o explorador, cuando esté disponible
- resultados de las lecturas de verificación
- mensaje de rechazo y si el fallo se parece a permisos, tarifas, validación, estado obsoleto o disponibilidad del punto final.

Ejemplo de guardia rápida:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Cuando el sobre firmado ya esté preparado:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Tratar Taira MCP como una superficie de control pública de la red de ensayo. Las teclas Taira, las redes de ensayo XOR, las cuentas del grifo y los marcadores canarios son desechables y deben mantenerse separadas de las teclas Minamoto y de los flujos de trabajo de liberación de producción.

## Ejemplos de juguetes que puedes probar ahora {#toy-examples-you-can-try-now}

Estos ejemplos son sólo para lectura, a menos que se indique. Funcionan antes de generar claves y son seguros para correr contra ambas redes públicas.

Comparar la salud de la red de ensayo Taira con la de la red principal Minamoto:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Lista de las vías del espacio público de datos expuestas por Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Ejecutar el mismo comando contra Minamoto cuando se necesita la vista de red:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Construir una pequeña sonda de estado Node.js para un panel de control, bot o verificación de implementación:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
EOF
```

El primer juguete de escritura debe ser una reclamación del grifo Taira. Utiliza la red de prueba XOR y nunca debe apuntar a Minamoto.

## 3. Crear una configuración de cliente Taira {#_3-create-a-taira-client-config}

Generar un par de teclas si aún no tienes uno:

```bash
kagami keys --algorithm ed25519 --json
```

Creación de `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

El nivel más alto `chain` es el exacto Taira cadena de transacciones ID. El Consejo `[account].profile = "taira"` el ajuste selecciona de forma independiente la Taira I105 Discriminante de la cadena. ID no selecciona el perfil de la cuenta.

Ejecutar un cheque de sólo lectura:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Ejecutar el diagnóstico público Taira antes de escribir pruebas:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Financia la cuenta Taira a través del grifo antes de ejecutar los escritos de pago. El flujo directo del grifo se encuentra en [Obtener Testnet XOR en Taira](#_4-get-testnet-xor-on-taira).

Después de que se acepte la solicitud del grifo y la cuenta sea financiada, el canario Taira es una prueba opcional de humo de escritura:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

El canario envía un ping firmado, espera la confirmación, y escribe la configuración de firma del tiempo de ejecución cuando `--write-config` se proporcionará. Taira es una red de prueba pública, por lo que la saturación de la cola puede hacer que el ping firmado falle incluso cuando el propio grifo funciona. `taira doctor` se informa de una cola saturada o los resultados del canario `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, Esperar y volver a intentar antes de tratarlo como un error de configuración del cliente.

Para los ensayos de humo sin supervisión, envuelva el canario en un bucle de ensayo restringido:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

Dejar de volver a probar si `iroha taira doctor` muestra fallas severas. La saturación en la cola y el rechazo de la admisión de tarifas son condiciones transitorias de la red pública de pruebas; los diagnósticos DNS, TLS o `status = "fail"` no lo son.

## Generar una cuenta SORA Nexus ID {#generate-a-sora-nexus-account-id}

Una cuenta SORA Nexus ID es una dirección canónica I105 derivada de la clave pública de la cuenta y del prefijo de red objetivo. No es el valor `[account].domain` en cliente TOML. La misma clave pública codifica a diferentes IDs en Taira y Minamoto, y los usuarios de producción deben generar un par de teclas separado para Minamoto.

Generar o cargar el par de teclas Ed25519 que controlará la cuenta:

```bash
kagami keys --algorithm ed25519 --json
```

Convertir la clave pública en una cuenta Taira ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Convertir una clave pública Minamoto con el prefijo de la red principal:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Utilice la cuenta resultante ID donde un Nexus API o CLI El comando pide un relato canónico. ID, Por ejemplo, el Taira el grifo `account_id`, Las consultas de balance, los campos estrictos de cuentas o las obligaciones de alias. clave privada en su configuración de cliente, y seleccione la misma red pública con `[account].profile = "taira"` o `[account].profile = "minamoto"`.

La generación del ID no crea por sí mismo una cuenta en cadena financiada. Taira, el grifo puede crear y financiar la cuenta de testnet escribe. Minamoto, utilizar una conexión a la red principal o un flujo de tesorería aprobada.

### Almacenamiento de llaves y respaldo {#key-storage-and-backup}

La cuenta ID y la clave pública pueden ser compartidas. La clave privada correspondiente, la frase de acceso, la semilla y el material de recuperación deben ser tratados como secreto.

Utilice estas prácticas para las cuentas SORA Nexus:

- Guarde las claves privadas en un administrador de contraseñas cifrado, keystore respaldado por hardware o servicio dedicado de firma. No comprometa las claves al control de origen ni deje las llaves de producción en el historial del shell, registros, chat, boletos o copias de seguridad no cifradas.
- Usar una contraseña única de alta entropía para cada bóveda o firma de producción. Almacenar las contraseñas en un administrador de contraseñas o proceso de custodia dividido, no en el mismo archivo o paquete de copia de seguridad que la clave privada cifrada.
- Mantenga Taira y Minamoto Las llaves separadas. Taira llaves como material desechable de la red de ensayo y Minamoto las claves como autoridad de fondos de producción.
- Copia de seguridad de la clave privada, llave pública, cuenta ID, perfil de cuenta y cualquier recuperación de cuenta o notas de custodia necesarias para restaurar el firmante. Una clave privada sin contexto de red es fácil de usar mal durante la recuperación.
- Mantenga al menos una copia de seguridad encriptada fuera de línea y una copia de copia de seguridad cifrada geográficamente separada para firmas de producción. Prueba de recuperación con una pequeña operación de sólo lectura antes de depender de la copia de seguridad.
- Rotar o reemplazar un firmador si la clave privada, frase de contraseña, soporte de copia de seguridad o el host de firma pueden haber sido expuestos.

Para más detalles, véase [El almacenamiento de las claves criptográficas](/es/guide/security/storing-cryptographic-keys.md) y [Seguridad de contraseñas](/es/guide/security/password-security.md).

## Envía Testnet a XOR en Taira {#_4-get-testnet-xor-on-taira}

Utilice directamente el grifo público.

1. Generar o cargar una firma y calcular su cuenta canónica Taira ID.
2. Traiga el rompecabezas del grifo actual.
3. Resolver el rompecabezas si el `difficulty_bits` es mayor que el `0`.
4. Presenta la solicitud del grifo.
5. Esperar a que el saldo de la cuenta o los activos se vuelvan visibles antes de enviar escritos de pago.

Convertir una llave pública en la cuenta Taira I105 ID que espera el grifo:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Trae el rompecabezas:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

El grifo es un servicio de testnet público. Si el rompecabezas o el punto final de la reclamación devuelve `502`, un tiempo de espera u otro error a nivel de pasarela, espere y vuelva a intentar antes de cambiar sus claves o configuración del cliente.

La respuesta tiene la siguiente forma:

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

Cuando `difficulty_bits` sea `0`, presente únicamente la cuenta ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

Cuando `difficulty_bits` sea mayor que `0`, resuelva el rompecabezas e incluya la altura del anclaje más la noción:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

El algoritmo del rompecabezas es:

1. Construir el desafío como SHA-256 sobre:
   - los bytes de `iroha:accounts:faucet:pow:v2`
   - la cuenta UTF-8 ID
   - `anchor_height` como el gran indio `u64`
   - `anchor_block_hash_hex` decodificado en bytes
   - `challenge_salt_hex` descifrado en bytes, cuando esté presente
2. Pruebe `u64` noces codificados como valores de 8 bytes big-endian.
3. Para cada nonce, ejecuta scrypt con:
   - contraseña: el nonce de 8 bits
   - Sal: el desafío de 32 bits
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - longitud de salida: 32 bytes
4. El nonce ganador es el primer digesto con al menos `difficulty_bits` que conduce a cero bits.

La respuesta del grifo incluye el activo financiado y el hash de la transacción en cola:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

La respuesta se devuelve actualmente con HTTP `202 Accepted`. Su `asset_definition_id` es el activo de cuota actual Taira financiado por el grifo público; derivarlo de la respuesta en lugar de copiar un ejemplo ID. El grifo ha aceptado la solicitud cuando devuelve `tx_hash_hex` y `status: "QUEUED"`.

Luego, sondee el activo financiado antes de presentar sus propias transacciones de pago de cuotas:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Si la reclamación del grifo fue aceptada, pero la cuenta o el activo aún no es visible, la transacción todavía está detrás del procesamiento público de la cola en testnet.

Para un cheque directo API listo para su ejecución, guarde esto como `taira_faucet_claim.py` y envíe la cuenta Taira I105 ID:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

El grifo es solo para los fondos de la red de prueba Taira. No utilice la red de pruebas XOR, las cuentas del grifo o los indicadores canarios Taira en los flujos Minamoto.

## 5. Cree una configuración de cliente Minamoto {#_5-create-a-minamoto-client-config}

Utilice un par de teclas separado para Minamoto. No vuelva a utilizar las teclas Taira para la red principal.

Crear `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

El nivel más alto `chain` es la corriente Nexus cadena de red principal ID. `[account].profile = "minamoto"` selecciona el Minamoto I105 Discriminante de cadena; el nombre de anfitrión del punto final y la cadena ID no lo seleccionen implícitamente.

Convertir una llave pública Minamoto en su cuenta canónica I105 ID con el prefijo de la red principal:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Ejecutar solo controles de lado leído hasta que la cuenta sea provista y financiada a través del flujo de incorporación o gobernanza de la red principal:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

No utilice el grifo Taira o el auxiliar de escritura canario contra el Minamoto.

## 6. Financiar una cuenta Minamoto con XOR {#_6-fund-a-minamoto-account-with-xor}

Las tasas Minamoto se pagan con la producción XOR, y Minamoto no tiene grifo público. Financia la cuenta configurada mediante una incorporación a la red principal aprobada o transferencia de tesorería, o recibe XOR desde una cuenta Minamoto existente financiada.

Verifique la cuenta canónica ID y el financiamiento con cheques de sólo lectura antes de presentar una escritura. Trate a Minamoto XOR como fondos de producción: enséña primero la misma operación en Taira, mantenga las llaves de producción separadas y no asuma que se puede restablecer una transacción de la red principal.

Taira XOR no puede pagar las tarifas de Minamoto. Los saldos de la red de pruebas y los créditos del grifo no se transfieren a Minamoto.

## 7. Trabajar dentro de un espacio de datos existente {#_7-work-inside-an-existing-dataspace}

Utilizar nombres de dominio completamente calificados para objetos del libro mayor que viven dentro de un espacio de datos. Por ejemplo, un dominio de proyecto en el espacio de datos público debe utilizar:

```text
apps.universal
```

Una vez que su cuenta tenga los permisos requeridos, cree una intención libre de secretos `AliasSetupPlanRequestV1` para el dominio y use el planificador declarativo:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Para Minamoto, generar y aprobar una intención y un plan de la red principal separados. Los planes están vinculados a su cadena, autoridad, anclaje del estado en vivo y fecha límite, por lo que no se puede promover o reproducir un plan Taira:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Los alias de cuentas utilizan el mismo sufijo del espacio de datos:

```text
alice@apps.universal
alice@universal
```

Los campos de cuentas estrictas todavía utilizan la cuenta canónica I105 IDs. Trate a los alias como vínculos legibles para el ser humano que se resuelven a la cuenta canónica IDs.

## 8. Proporcionar un nuevo espacio de datos {#_8-provision-a-new-dataspace}

Un nuevo espacio de datos es un operador y cambio en la gobernanza. El punto final público Torii puede dirigir el tráfico a los espacios de datos configurados, pero rechazará alias desconocidos del espacio de datos.

Antes de preparar un cambio, captura el catálogo en vivo actual:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Para una cuenta de operador, compruebe también la postura del manifiesto de carril:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

No promocione un nuevo alias a menos que se hayan revisado conjuntamente el carril ID, el espacio de datos ID, el conjunto de validadores, la tolerancia a fallas, el manifiesto, las reglas de enrutamiento y el propietario operativo. Una cuenta de usuario normal con los permisos requeridos puede adquirir un dominio y su arrendamiento SNS dentro de un espacio de datos existente a través del planificador alias; no puede agregar de forma segura un nuevo espacio de datos público.

Para un espacio de datos privado o organizacional, prepare un cambio de catálogo con:

- un alias de espacio de datos único y numérico `id`
- una entrada de carril correspondiente o una asignación de carril existente
- el espacio de datos `fault_tolerance`
- Reglas de enrutamiento para las instrucciones o los ámbitos de cuenta que deben aterrizar allí
- un manifiesto del Directorio Espacial o evidencia de implementación equivalente, cuando el espacio de datos exponga las capacidades UAID
- aprobación de gobernanza para la política de validador, cumplimiento, liquidación y seguimiento.

Un fragmento de configuración revisable se parece a esto:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

La aceptación del operador debe incluir las siguientes puertas:

- `irohad --sora --config <config.toml> --trace-config` pasa a la configuración del nodo resuelto
- El manifiesto generado o revisado se archivará con hashes y firmas
- Los ensayos de humo pasan en Taira antes de cualquier promoción Minamoto
- el catálogo `/status` posterior al cambio muestra el carril previsto y el espacio de datos
- `iroha app nexus lane-report --summary` no informa de que faltan los manifestos requeridos

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Promover el mismo espacio de datos a Minamoto sólo después de que se complete la implementación, las pruebas de humo, el monitoreo y la evidencia de gobernanza de Taira.

## Páginas relacionadas {#related-pages}

- [Instalar Iroha 3](/es/get-started/install-iroha.md)
- [Operar en Iroha 3 a través de CLI ](/es/get-started/operate-iroha-via-cli.md)
- [Tarifas de patrocinio para un espacio privado de datos](/es/get-started/private-dataspace-fee-sponsor.md)
- [Puntos finales Torii](/es/reference/torii-endpoints.md)
- [Referencia de Génesis](/es/reference/genesis.md)
