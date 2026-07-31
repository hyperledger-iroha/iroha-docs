---
translation_locale: es
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Los fragmentos de código {#code-snippets}

Los fragmentos generados mantienen ejemplos vinculados a código, configuración y esquemas de la revisión Iroha que los produjo.

## Artículos refrescantes Iroha {#refreshing-iroha-artifacts}

Los fragmentos derivados de Iroha se comprueban en las edificaciones ordinarias del sitio que no requieren acceso a la red o un repositorio hermano.

```bash
pnpm refresh:iroha --source /path/to/iroha
```

El registrado . [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) flujo de trabajo verifica el control de fuente limpia en relación con `provenance/iroha.json`, Regeneración `/src/snippets` y el Torii OpenAPI Instantánea y actualizaciones SHA-256 hashes. revisar los cambios de contenido y procedencia juntos. instalación normal de dependencia y VitePress las construcciones consumen los archivos registrados sin conseguir una rama mutable.

## Incluidos los fragmentos {#including-snippets}

Utilice la sintaxis de fragmentos de código [VitePress ](https://vitepress.dev/guide/markdown#import-code-snippets) para incluir fuente generada o local:

```md
<<< @/snippets/client.template.toml
```

Se puede incluir una región de código denominada añadiendo su nombre de región:

```md
<<< @/example_code/lorem.rs#ipsum
```

Mantenga los ejemplos escritos a mano pequeños. Prefiere artefactos de fuente actualizados para interfaces públicas, plantillas de configuración, esquemas generados y salida de comandos.
