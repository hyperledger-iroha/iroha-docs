---
translation_locale: es
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Configuración de Iroha {#configuring-iroha}

La configuración de pares local se establece en los archivos TOML. Esto es diferente a la configuración en cadena cambiada a través de las instrucciones [`SetParameter`](/es/blockchain/instructions.md#setparameter). El comportamiento de producción debe ser representado en un archivo de configuración o un parámetro en cadena; las variables ambientales no son puertas de características.

Utilice el argumento [`--config`](../iroha3d-cli#arg-config) CLI para especificar la ruta al archivo de configuración.

## Modelo {#template}

Para obtener una descripción detallada de cada parámetro, consulte la referencia [Parámetros ](./params.md).

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## Componer archivos de configuración {#composing-configuration-files}

Los archivos de configuración TOML tienen un campo adicional `extends`, que apunta a otros archivos TOML (s). Puede ser un solo camino o múltiples caminos:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha leerá de forma recurrente todos los archivos especificados en `extends` y los compondrá en capas, donde estas últimas sobrescribirán las anteriores a nivel de parámetro. Por ejemplo, si se lee `config.toml`:

::: code-group

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

Pasar la bandera [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI para ver un rastro de cómo se lee y analiza la configuración.
