---
translation_locale: es
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuración de Iroha {#configuring-iroha}

La configuración de pares local se establece en los archivos TOML. Esto es diferente a la configuración en cadena cambiada a través de las instrucciones [`SetParameter`](/es/blockchain/instructions.md#setparameter). El comportamiento de producción debe ser representado en un archivo de configuración o un parámetro en cadena; las variables ambientales no son puertas de características.

Utilice el argumento [`--config`](../irohad-cli#arg-config) CLI para especificar la ruta al archivo de configuración.

## Modelo {#template}

Para obtener una descripción detallada de cada parámetro, consulte la referencia [Parámetros ](./params.md).

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Componer archivos de configuración {#composing-configuration-files}

Los archivos de configuración TOML tienen un campo adicional `extends`, que apunta a otros archivos TOML (s). Puede ser un solo camino o múltiples caminos:

::: grupo de códigos

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha leerá de forma recurrente todos los archivos especificados en `extends` y los compondrá en capas, donde estas últimas sobrescribirán las anteriores a nivel de parámetro. Por ejemplo, si se lee `config.toml`:

::: grupo de códigos

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

El resultado de la configuración será `chain` de `a.toml`, `max_content_len` de `b.toml`, y `torii.address` de `config.toml` (sobreescritura) `b.toml`).

## Solución de problemas {#troubleshooting}

Pasar la bandera [`--trace-config`](../irohad-cli#arg-trace-config) CLI para ver un rastro de cómo se lee y analiza la configuración.
