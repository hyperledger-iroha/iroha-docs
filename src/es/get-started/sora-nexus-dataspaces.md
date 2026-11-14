---
translation_locale: es
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 3d2285e5a27819897b6dcc6d165c468baead29d2922420728fcfbe2433d36fdd
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Desarrollar sobre SORA Nexus: Taira y Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA Nexus ofrece entornos de despliegue públicos basados en Iroha 3. Desarrolle y ensaye primero en Taira; después, utilice la misma estructura de cliente en Minamoto solo cuando disponga de claves separadas para la mainnet, XOR real para las comisiones y aprobación de producción.

Este tutorial muestra cómo configurar un cliente de Iroha para las redes públicas de SORA Nexus:

- Taira red de prueba en `https://taira.sora.org`
- Minamoto red principal en `https://minamoto.sora.org`

Use Taira para pruebas de integración, canarios de escritura financiados por testnet y ensayos de despliegue. Use Minamoto solo para actividad lista para producción en mainnet. Ambas redes cobran tarifas en XOR:

- Taira utiliza la testnet XOR del servicio público de financiación de testnet.
- Minamoto utiliza XOR real. No existe un servicio de financiación de testnet Minamoto.

## Ruta del Constructor {#builder-path}

|Paso| Taira Red de prueba                                                | Minamoto Red principal |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Comenzar a leer el estado de la red|Consulta `/status` sin claves|Consulta `/status` sin claves|
| Elegir un espacio de datos | Utilice el espacio público `universal`, salvo que su aplicación necesite un carril sujeto a gobernanza | Utilice el mismo espacio de datos solo después de obtener la aprobación para la mainnet |
|Obtener activo de tarifa|Utilice el servicio público de financiamiento de testnet Taira|Recibir XOR de una cuenta Minamoto financiada o un flujo de tesorería aprobado|
|Prueba escribe|Usa la prueba financiada por la testnet XOR|No utilice herramientas de prueba; escribe gastos reales XOR|
|Promocionar|Mantener la lógica de reintento, la monitorización y la gestión del firmante criptográfico|Usa claves, financiamiento y controles de liberación separados|

El flujo práctico es:

1. Desarrolle el cliente para Taira y utilice el espacio de datos público `universal`.
2. Agrega un firmante criptográfico y fíndalo con el servicio de financiamiento de testnet Taira.
3. Ejercita la lógica de tu aplicación contra Taira hasta que los fallos sean aburridos y observables.
4. Crea un firmante criptográfico separado Minamoto, súmele fondos con XOR reales y mueve solo las mismas operaciones comprobadas a la red principal.

## Continuar con el libro de cocina {#continue-with-the-cookbook}

Utilice esta guía para elegir una red, configurar un firmante criptográfico y financiar las tarifas. Luego continúe con la receta que coincida con el comportamiento de la aplicación que desea construir:

|Meta|Receta|
| --- | --- |
|Revisar Taira y configurar un cliente| [Conectar a Taira](/es/cookbook/connect-to-taira.md) |
|Envía una primera escritura y verifica su resultado| [Enviar y Verificar Transacciones](/es/cookbook/submit-and-verify-transactions.md) |
|Registrar, emitir y mover valor| [Activos fungibles](/es/cookbook/fungible-assets.md) |
|Leer estado de la aplicación filtrado| [Consultar el estado del libro mayor de blockchain](/es/cookbook/query-ledger-state.md) |
|Reaccionar a los cambios confirmados| [Eventos de transmisión](/es/cookbook/stream-events.md) |

El libro de cocina mantiene cada flujo de trabajo enfocado y vuelve aquí cuando necesita financiamiento Taira o contexto de red SORA Nexus.

## 1. Comprende lo que estás configurando {#_1-understand-what-you-are-setting-up}

En SORA Nexus, el catálogo de espacios de datos define los espacios de datos. El catálogo de carriles define los carriles por separado: cada carril referencia un espacio de datos, y un espacio de datos puede tener varios carriles. Un cliente no crea un nuevo espacio de datos público simplemente cambiando `client.toml`. La configuración del cliente hace dos cosas:

1. dirige el cliente al punto de acceso correcto de Torii
2. selecciona el contexto de red y la clave de firma de su cuenta canónica

`AccountId` siempre es canónico y carece de dominio, y `client.toml` no tiene un ajuste de dominio: `[account].profile` solo selecciona el prefijo I105 de la red. El contexto de dominio pertenece a los alias y a los objetos que son propiedad del dominio. Para la mayoría de las aplicaciones, comience con el espacio de datos público `universal`. El contexto de dominio utiliza la forma `domain.dataspace`, por ejemplo:

```text
wonderland.universal
```

Si necesita un nuevo espacio de datos para una organización, prepare una propuesta de catálogo y enrutamiento en lugar de intentar registrarlo desde una cuenta de cliente ordinaria. Consulte [Crear un nuevo espacio de datos](#_8-provision-a-new-data-space) más adelante.

## 2. Comprobar el punto de acceso público de Torii {#_2-check-the-public-torii-endpoint}

Compruebe que el punto de acceso de destino esté disponible antes de configurar un firmante.

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

Inspeccione la vista de espacios de datos y carriles que expone el nodo:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Usa el mismo comando con `https://minamoto.sora.org/status` para la red principal.

## Taira MCP para Agentes {#taira-mcp-for-agents}

Taira también expone un puente de Protocolo de Contexto de Modelo (MCP) nativo de Torii para entornos de ejecución de software de agentes. Úselo cuando un agente necesite lecturas en la testnet en vivo, diagnósticos scriptados o ensayos de escritura revisados minuciosamente sin construir primero un cliente Torii personalizado.

|Configuración|Valor|
| --- | --- |
| Punto de acceso MCP | `https://taira.sora.org/v1/mcp` |
|Raíz de red| `https://taira.sora.org` |
|Uso previsto|Taira lecturas en testnet y ensayos de escritura financiados por testnet|
| Equivalente de producción | No dirija esta entrada a Minamoto a menos que se hayan aprobado explícitamente un punto de acceso MCP de la mainnet y los controles de lanzamiento |

El puente solo acepta solicitudes `POST` de JSON-RPC sin estado. Compruebe sus metadatos de descubrimiento antes de añadir material de firma:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
```

Configure la URL como un servidor MCP local del usuario en el entorno de ejecución del agente. No incluya en commits de este repositorio de documentación ni de un repositorio de aplicaciones la configuración MCP del agente, tokens de API, encabezados de autenticación reenviados ni valores de `authority` o `private_key`.

Reglas de indicaciones para agentes que funcionan bien con Taira:

- Descubra herramientas del servidor MCP antes de llamarlas; redescúbralas si el servidor informa `listChanged`.
- Prefiere las herramientas `iroha.*` seleccionadas sobre las herramientas `torii.*` en bruto.
- Comenzar en solo lectura: inspeccionar el estado, las cuentas, los activos, los alias, los bloques, el estado de gobernanza y el estado de las transacciones antes de proponer escrituras.
- Requiere una instrucción humana explícita antes de las mutaciones en el testnet en vivo. Para contenedores de datos de transacciones pre-firmadas, usa `iroha.transactions.submit_and_wait` para que el agente espere el resultado en lugar de solo enviar.
- Resuma los hashes criptográficos de la transacción, el estado final y los errores de validación del servidor en la respuesta del agente.

### Flujo de trabajo de desarrollo con agentes {#development-workflow-with-agents}

Utilice agentes como ayudantes de desarrollo para clientes Iroha, constructores de transacciones, scripts de diagnóstico y manuales de ejecución en testnet. Mantenga el principio de autorización del agente limitado: puede inspeccionar el código, leer el estado de Taira, proponer cambios y ejecutar pruebas locales, pero no debe modificar una red en vivo hasta que un humano apruebe la operación exacta.

Un flujo de trabajo práctico es:

1. Pide al agente que inspeccione los documentos relevantes, el código SDK, el comando CLI o el esquema de la herramienta MCP antes de que escriba código.
2. Haga que el agente escriba primero la ruta de cliente más pequeña: verificación de estado, búsqueda de cuenta, resolución de alias o consulta de saldo.
3. Agrega el código de construcción de transacciones solo después de que las llamadas de solo lectura funcionen contra Taira.
4. Mantenga las pruebas en red en vivo como opcionales, por ejemplo detrás de `TAIRA_LIVE=1`, para que una ejecución normal de pruebas unitarias nunca gaste fondos de la red de prueba ni dependa de la disponibilidad de la red.
5. Requiere que el agente informe la raíz de la red, la cadena, la cuenta principal de autorización, el resumen de instrucciones, el activo de tarifa y el cambio de estado esperado antes de enviar cualquier transacción.
6. Revise el código generado para el manejo de secretos, el comportamiento de reintento, la idempotencia y el manejo de rechazos antes de promoverlo a CI o a los flujos de trabajo de mainnet.

Las herramientas útiles de solo lectura MCP para el desarrollo incluyen búsquedas de activos de cuenta, resolución de alias, búsqueda de bloques, búsqueda de transacciones, listas de transacciones y comprobaciones del estado del proceso de la canalización. Úselas para generar confianza antes de enviar cualquier carga útil firmada.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Flujo de transacciones a través de agentes {#transaction-workflow-through-agents}

El puente MCP puede enviar una transacción Iroha firmada, pero no elimina los requisitos normales de la transacción. Una transacción aún necesita un principal de autorización correcto, permisos, financiamiento de tarifas, ID de cadena, metadatos y firma.

Para las transacciones Iroha sin procesar, construya y firme primero el sobre de la transacción con un SDK o la CLI. Entregue al agente únicamente los bytes canónicos de la transacción firmada, codificados como `body_base64`. El agente puede enviar el sobre con `iroha.transactions.submit_and_wait` o usar `iroha.transactions.submit` y consultar el estado con `iroha.transactions.wait`.

No pegue claves privadas en la petición de un agente. Si el agente necesita construir una transacción, indíquele código local que cargue los secretos desde el entorno de ejecución del usuario, el llavero, un firmante de hardware o un archivo ignorado de configuración de la red de pruebas. El agente nunca debe escribir las claves en Markdown, artefactos de prueba, registros ni commits.

Antes de enviar una transacción, haga que el agente produzca un breve plan de transacción:

- `network`: raíz de la red de pruebas Taira e ID de cadena
- `authority`: cuenta que firma y paga las tarifas
- `instructions`: registrar, emitir, quemar, transferir, metadatos, permiso o resumen de llamada de contrato
- `fee asset`: activo que se cargará en Taira
- `preflight reads`: cuenta, saldo de activos, permisos, alias o verificaciones de bloqueo ya realizadas
- `expected result`: el estado que debería ser visible después de la confirmación
- `idempotency`: ¿qué sucede si se vuelve a intentar la misma solicitud?

Después de la presentación, haga que el agente espere un estado terminal, luego verifique el cambio de estado con una consulta de lectura. Un informe de finalización útil incluye:

- hash criptográfico de transacción
- estado del terminal como `Committed`, `Applied`, `Rejected` o `Expired`
- detalle del bloque o del explorador cuando esté disponible
- verificación de resultados de lectura
- mensaje de rechazo y si el fallo parece relacionado con permisos, comisiones, validación, estado obsoleto o disponibilidad del punto de acceso

Ejemplo de instrucción protegida:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Cuando el contenedor de datos firmado ya está preparado:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Trata Taira MCP como una superficie de control de testnet pública. Las claves Taira, XOR de testnet, las cuentas de servicio de financiamiento de testnet y los firmantes criptográficos canarios son desechables y deben mantenerse separados de las claves Minamoto y de los flujos de trabajo de lanzamiento en producción.

## Ejemplos de juguetes que puedes probar ahora {#toy-examples-you-can-try-now}

Estos ejemplos son de solo lectura a menos que se indique lo contrario. Funcionan antes de que generes claves y son seguros para ejecutar en redes públicas.

Comparar la salud de la testnet Taira y la mainnet Minamoto:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Enumere los carriles de los espacios de datos públicos que expone Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Ejecute el mismo comando contra Minamoto cuando necesite la vista de la mainnet:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Construye una pequeña sonda de estado Node.js para un panel, bot o verificación de despliegue:

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

El primer juguete del lado de escritura debería ser un reclamo de servicio de financiamiento en testnet Taira. Utiliza XOR de testnet y nunca debería apuntar a Minamoto.

## 3. Crear una Configuración de Cliente Taira {#_3-create-a-taira-client-config}

Genera un par de claves si aún no tienes uno:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

Crear `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

El campo `chain` de nivel superior es el ID exacto de cadena para las transacciones de Taira, y `network_id` es la identidad de red exacta a la que se vincula cada firma. Configure exactamente uno de los campos `network_id` o `network_id_file`. El ajuste `[account].profile = "taira"` selecciona de forma independiente el discriminante de cadena I105 de Taira. El ID de cadena no selecciona el perfil de la cuenta.

Ejecute una verificación de solo lectura:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Ejecute los diagnósticos públicos Taira antes de las pruebas de escritura:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Proporcione fondos a la cuenta de Taira mediante el servicio de fondos de prueba antes de realizar operaciones de escritura que paguen comisiones. El flujo preparado se describe en [Obtener XOR de testnet en Taira](#_4-get-testnet-xor-on-taira).

Una vez que la cuenta tenga fondos, una instrucción de registro firmada sirve como prueba básica opcional de escritura. Cada transacción enviada indica quién paga sus comisiones, y la CLI calcula e indica la comisión exacta antes de firmar:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

El comando espera la confirmación. Taira es una testnet pública, por lo que la saturación de la cola puede hacer que falle el ping aunque el servicio de fondos de prueba funcione. Si `taira doctor` informa de una cola saturada o el ping devuelve `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, espere y vuelva a intentarlo antes de considerarlo un error de configuración del cliente.

Para las pruebas básicas desatendidas, ejecute el ping dentro de un bucle con un número limitado de reintentos:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

Deja de reintentar si `iroha taira doctor` muestra fallos graves. La saturación de la cola y los rechazos por admisión de tarifas son condiciones transitorias de la red de prueba pública; los diagnósticos DNS, TLS o `status = "fail"` no lo son.

## Generar un ID de cuenta SORA Nexus {#generate-a-sora-nexus-account-id}

Un ID de cuenta de SORA Nexus es una dirección I105 canónica derivada de la clave pública de la cuenta y del prefijo de la red de destino. Una misma clave pública se codifica como IDs distintos en Taira y Minamoto, y los usuarios de producción deben generar un par de claves separado para Minamoto.

Genera o carga el par de claves Ed25519 que controlará la cuenta:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

Convierte la clave pública en un ID de cuenta Taira:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Convierte una clave pública Minamoto con el prefijo de la red principal:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Utilice el ID de cuenta resultante siempre que una API de SORA Nexus o un comando de la CLI solicite un ID de cuenta canónico, por ejemplo en consultas de saldo, campos estrictos de cuenta o vinculaciones de alias. Conserve la clave privada correspondiente en la configuración del cliente y seleccione la misma red pública mediante `[account].profile = "taira"` o `[account].profile = "minamoto"`.

Generar el ID no crea por sí mismo una cuenta financiada en la cadena. En Taira, el servicio de financiamiento de la testnet puede crear y financiar la cuenta para escrituras en la testnet. En Minamoto, use un flujo aprobado de incorporación o tesorería en la mainnet.

### Almacenamiento y Copia de Seguridad de Claves {#key-storage-and-backup}

El ID de la cuenta y la clave pública pueden compartirse. La clave privada correspondiente, la frase de contraseña, la semilla y el material de recuperación deben tratarse como secretos.

Utilice estas prácticas para las cuentas SORA Nexus:

- Almacene las claves privadas en un gestor de contraseñas encriptado, un almacén de claves respaldado por hardware o un servicio de firma dedicado. No cometa las claves en el control de versiones ni deje claves de producción en el historial de la terminal, registros, chat, tickets o copias de seguridad sin encriptar.
- Utilice una frase de paso única de alta entropía para cada bóveda o firmante criptográfico de producción. Almacene las frases de paso en un gestor de contraseñas o en un proceso de custodia dividida, no en el mismo archivo o paquete de respaldo que la clave privada encriptada.
- Mantenga las claves Taira y Minamoto separadas. Trate las claves Taira como material desechable de testnet y las claves Minamoto como principal de autorización de fondos de producción.
- Respaldar la clave privada, la clave pública, el ID de la cuenta, el perfil de la cuenta y cualquier nota de recuperación o custodia de la cuenta necesaria para restaurar el firmante criptográfico. Una clave privada sin el contexto de la red es fácil de usar incorrectamente durante la recuperación.
- Mantenga al menos una copia de seguridad cifrada fuera de línea y una copia de seguridad cifrada geográficamente separada para los firmantes criptográficos de producción. Pruebe la recuperación con una operación pequeña de solo lectura antes de depender de la copia de seguridad.
- Rote o reemplace un firmante criptográfico si la clave privada, la frase de contraseña, el medio de respaldo o el host de firma pueden haber sido expuestos.

Para más detalles, consulte [Almacenamiento de Claves Criptográficas](/es/guide/security/storing-cryptographic-keys.md) y [Seguridad de la contraseña](/es/guide/security/password-security.md).

## 4. Obtén Testnet XOR en Taira {#_4-get-testnet-xor-on-taira}

Solicite XOR de testnet mediante el flujo preparado del servicio de fondos de prueba de la CLI. El servicio proporciona fondos a la cuenta configurada en `taira.client.toml` y la registra primero si aún no existe. El flujo es el siguiente:

1. Lea la política pública del servicio de fondos de prueba: su autoridad, el activo de comisiones y el importe.
2. Prepare la solicitud. La CLI resuelve la prueba de trabajo, verifica la transacción exacta que Torii prepara y firma, y la guarda en un directorio privado de diario sin enviarla.
3. Envíe una sola vez la transacción guardada.
4. Espere a que el saldo del activo sea visible antes de enviar operaciones de escritura que paguen comisiones.

Lea la política:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

La respuesta tiene esta forma:

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

La política contiene datos de descubrimiento sin firmar. Las automatizaciones deben fijar la autoridad, la definición de activo y el importe esperados, en lugar de confiar en cada respuesta. `prepare` rechaza una transacción preparada que difiera de los valores que se le proporcionen.

Prepare y envíe la solicitud:

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` crea el directorio del diario con acceso privado y se niega a sustituir uno existente, por lo que debe utilizar un directorio nuevo para cada solicitud. El servicio de fondos de prueba es un servicio de la testnet pública. Si `submit` informa de `Pending`, agota el tiempo de espera o recibe un `502`, ejecute `taira account faucet resume` con la misma configuración y el mismo diario, en lugar de preparar otra solicitud. Un ancla obsoleta de prueba de trabajo hace fallar `prepare`; prepare la solicitud de nuevo en otro directorio de diario.

Luego consulta el activo financiado antes de enviar tus propias transacciones pagando tarifas:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Si la solicitud se aplicó pero el activo aún no es visible, espere y vuelva a consultar antes de enviar operaciones de escritura.

El dispensador solo proporciona fondos para la red de pruebas Taira. No use XOR de prueba, cuentas del dispensador ni firmantes canarios de Taira en flujos de Minamoto.

## 5. Crear una Configuración de Cliente Minamoto {#_5-create-a-minamoto-client-config}

Usa un par de claves separado para Minamoto. No reutilices las claves de Taira para la red principal.

Crear `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

El campo `chain` de nivel superior es el ID actual de cadena de la mainnet de SORA Nexus, y `network_id` es la identidad de red exacta de Minamoto; obténgala de la ruta de capacidades antes de la primera operación firmada. `[account].profile = "minamoto"` selecciona el discriminante de cadena I105 de Minamoto; ni el nombre de host del punto de acceso ni el ID de cadena lo seleccionan implícitamente.

Convierte una clave pública Minamoto en su ID de cuenta canónica I105 con el prefijo de mainnet:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Ejecute solo verificaciones del lado de lectura hasta que la cuenta esté aprovisionada y financiada a través del flujo de incorporación a la mainnet o de gobernanza:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

No ejecute contra Minamoto los comandos del servicio de fondos de prueba ni las pruebas básicas de Taira.

## 6. Financiar una cuenta Minamoto con XOR {#_6-fund-a-minamoto-account-with-xor}

Las tarifas Minamoto se pagan con la producción XOR, y Minamoto no tiene servicio público de financiamiento de testnet. Financia la cuenta configurada a través de una incorporación aprobada en la mainnet o una transferencia del tesoro, o recibe XOR de una cuenta Minamoto existente ya financiada.

Verifique la identificación de la cuenta canónica y la financiación con verificaciones de solo lectura antes de enviar una escritura. Trate Minamoto XOR como fondos de producción: ensaye la misma operación primero en Taira, mantenga claves de producción separadas y no asuma que una transacción en mainnet se puede restablecer.

El XOR de Taira no puede pagar las tarifas de Minamoto. Los saldos y las solicitudes de fondos de la red de pruebas no se transfieren a Minamoto.

## 7. Trabajar dentro de un espacio de datos existente {#_7-work-inside-an-existing-data-space}

Utilice nombres de dominio completamente calificados para los objetos del libro mayor que residan en un espacio de datos. Por ejemplo, un dominio de proyecto en el espacio de datos público debe utilizar:

```text
apps.universal
```

Después de que tu cuenta tenga los permisos requeridos, crea una intención `AliasSetupPlanRequestV1` sin secretos para el dominio y utiliza el planificador declarativo:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Para Minamoto, genere y apruebe una intención y plan de mainnet separados. Los planes están vinculados a su cadena, principal de autorización, ancla de estado en vivo y fecha límite, por lo que un plan Taira no puede ser promovido ni reproducido:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Los alias de cuenta usan el mismo sufijo de espacio de datos:

```text
alice@apps.universal
alice@universal
```

Los campos de cuenta estrictos todavía utilizan IDs de cuenta canónicas I105. Trate los alias como vinculaciones legibles por humanos que se resuelven en IDs de cuenta canónicas.

## 8. Crear un nuevo espacio de datos {#_8-provision-a-new-data-space}

Un nuevo espacio de datos requiere un cambio de operación y gobernanza. El punto de acceso público de Torii puede enrutar tráfico a los espacios de datos configurados, pero rechazará los alias de espacios de datos desconocidos.

Antes de preparar un cambio, captura el catálogo activo actual:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Para una cuenta de operador, también verifique la postura técnica del manifiesto del carril de ejecución:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

No habilite un nuevo alias hasta que se hayan revisado conjuntamente el ID del carril, el ID del espacio de datos, el conjunto de validadores, la tolerancia a fallos, el manifiesto, las reglas de enrutamiento y el responsable operativo. Una cuenta de usuario normal con los permisos necesarios puede adquirir un dominio y su arrendamiento SNS dentro de un espacio de datos existente mediante el planificador de alias; no puede añadir de forma segura un nuevo espacio de datos público.

Para un espacio de datos privado u organizacional, prepare un cambio de catálogo con:

- un alias único del espacio de datos y un `id` numérico
- una entrada de carril de ejecución coincidente o una asignación de carril de ejecución existente
- el valor de `fault_tolerance` del espacio de datos
- reglas de enrutamiento para las instrucciones o ámbitos de cuenta que deberían llegar allí
- un manifiesto del directorio de espacios o evidencia equivalente de despliegue, si el espacio de datos expone capacidades UAID
- aprobación de la gobernanza para la política de validadores, cumplimiento, liquidación y monitoreo

Un fragmento de configuración que se puede revisar se ve así:

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
instruction = "transfer::asset"
description = "Route asset transfers to the payments dataspace"
```

La aceptación por parte del operador debería incluir estas etapas:

- `iroha3d --sora --config <config.toml> --trace-config` transmite la configuración del nodo resuelta
- El manifiesto técnico generado o revisado se archiva con hashes y firmas criptográficas
- las pruebas de humo pasan en Taira antes de cualquier promoción Minamoto
- el catálogo de `/status` posterior al cambio muestra el carril y el espacio de datos previstos
- `iroha app nexus lane-report --summary` no informa la falta de manifiestos técnicos requeridos

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Lleve el mismo espacio de datos a Minamoto solo cuando se hayan completado el despliegue en Taira, las pruebas básicas, la supervisión y la evidencia de gobernanza.

## Páginas relacionadas {#related-pages}

- [Instalar Iroha 3](/es/get-started/install-iroha.md)
- [Operar Iroha 3 a través de CLI](/es/get-started/operate-iroha-via-cli.md)
- [Patrocinar comisiones de un espacio de datos privado](/es/get-started/private-dataspace-fee-sponsor.md)
- [Puntos de acceso de Torii](/es/reference/torii-endpoints.md)
- [referencia de génesis de blockchain](/es/reference/genesis.md)
