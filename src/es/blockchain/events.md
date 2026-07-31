---
translation_locale: es
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Los acontecimientos {#events}

Los eventos se emiten cuando ciertas cosas ocurren dentro de la cadena de bloques, por ejemplo, una nueva cuenta se crea o un bloque se compromete. Hay diferentes tipos de eventos:

- acontecimientos de la tubería
- eventos de datos
- acontecimientos del tiempo
- desencadenar eventos de ejecución

## Eventos de la tubería {#pipeline-events}

Los eventos de pipeline se emiten cuando las transacciones son enviadas, ejecutadas o comprometidas a un bloque. Un evento de pipeline contiene la siguiente información: el tipo de entidad que causó un evento (transacción o bloque), su hash y estado. El estado puede ser `Validating` (validación en curso), `Rejected` o `Committed`. Si una entidad ha sido rechazada, se indicará la razón del rechazo.

### Pruébalo en Taira {#try-it-on-taira}

Compruebe que el flujo de eventos del pipeline público está montado:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Para una instantánea que pueda inspeccionar sin mantener un flujo abierto, lea las transacciones recientes del explorador:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Abrir la ruta SSE en una terminal cuando necesite eventos en vivo:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Si no se envían transacciones mientras la corriente está abierta, el comando puede permanecer en silencio a pesar de que la ruta es sana.

## Eventos de datos {#data-events}

Los eventos de datos se emiten cuando hay un cambio relacionado con los datos del libro mayor, como pares, dominios, cuentas, activos, definiciones de activos, NFTs, desencadenantes, roles, configuración en cadena, estado de ejecución, pruebas, activos confidenciales, puentes o objetos específicos de SORA/Nexus. Estos tipos de eventos se utilizan en los filtros de eventos de datos [ ](./filters.md#data-event-filters).

## Los acontecimientos del tiempo {#time-events}

Los eventos temporales se emiten cuando la vista del estado mundial está lista para manejar los desencadenantes de tiempo [ ](./triggers.md#time-triggers).

## Eventos de ejecución desencadenante {#trigger-execution-events}

Los eventos de ejecución del desencadenante se emiten cuando se ejecuta la instrucción [`ExecuteTrigger`](./instructions.md#executetrigger). Los eventos de terminación del gatillo se emitirán después de que finalice una acción del gatillo.
