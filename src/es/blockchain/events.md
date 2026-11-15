---
translation_locale: es
translation_source: /blockchain/events.md
translation_source_hash: 2777cbe4e72a50c4790e50b59c3e695feb5814314cc9afccdfd994f6409c195e
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Eventos {#events}

Se emiten eventos cuando ocurren ciertas cosas dentro de la blockchain, por ejemplo, se crea una nueva cuenta o se confirma un bloque. Hay diferentes tipos de eventos:

- eventos de la canalización de procesamiento
- eventos de datos
- eventos de tiempo
- desencadenar eventos de ejecución

## Eventos de la canalización de procesamiento {#pipeline-events}

Los eventos del canal de procesamiento se emiten a medida que las transacciones y los bloques avanzan por el canal de procesamiento. Un evento de transacción contiene el hash de la transacción, la altura del bloque, los IDs del carril y del espacio de datos, y un estado: `Queued`, `Expired`, `Approved` o `Rejected` con la razón del rechazo. Un evento de bloque contiene el encabezado del bloque y un estado: `Created`, `Approved`, `Rejected` con la razón, `Committed` o `Applied`.

### Pruébalo en Taira {#try-it-on-taira}

Verifique que el flujo de eventos del pipeline de procesamiento público esté montado:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Para una vista de datos en un momento específico que puede inspeccionar sin mantener un flujo abierto, lea las transacciones recientes del explorador:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?limit=5' \
  | jq '{next_cursor, txs: [.items[] | {hash, block, status, executable}]}'
```

Abre la ruta SSE en una terminal cuando necesites eventos en vivo:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Si no se envían transacciones mientras el flujo está abierto, el comando puede permanecer en silencio aunque la ruta esté saludable.

## Eventos de Datos {#data-events}

Se emiten eventos de datos cuando hay un cambio relacionado con los datos del libro mayor de la blockchain, como los pares de la red, dominios, cuentas, activos, definiciones de activos, NFTs, desencadenadores, roles, configuración en cadena, estado del ejecutor, pruebas, activos confidenciales, puentes, u objetos específicos de SORA Nexus. Este tipo de eventos se utilizan en [filtros de eventos de datos](./filters.md#data-event-filters).

## Eventos de tiempo {#time-events}

Los eventos de tiempo se emiten cuando la vista del estado del mundo está lista para manejar [disparadores de tiempo](./triggers.md#time-triggers).

## Eventos de ejecución de disparadores {#trigger-execution-events}

Los eventos de ejecución del disparador se emiten cuando el [`ExecuteTrigger`](./instructions.md#executetrigger) La instrucción se ejecuta. Los eventos de finalización del disparador se emiten después de que una acción de disparador termina.
