---
translation_locale: es
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Fragmentos de código {#code-snippets}

Los fragmentos generados mantienen los ejemplos asociados con el código, la configuración y los esquemas de la revisión Iroha que los produjo.

## Actualizando Iroha Artefactos {#refreshing-iroha-artifacts}

Los fragmentos derivados de Iroha se registran, por lo que las compilaciones normales del sitio no requieren acceso a la red ni un repositorio hermano. Actualícelos explícitamente:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

El flujo de trabajo `etc/refresh-iroha.ts` registrado verifica la extracción limpia de la fuente contra `provenance/iroha.json`, regenera `/src/snippets` y la vista de datos en un momento determinado Torii OpenAPI, y actualiza los hashes criptográficos SHA-256. Revisa juntos los cambios de contenido y de procedencia. La instalación normal de dependencias y las compilaciones VitePress consumen los archivos registrados sin obtener una rama mutable.

## Incluyendo fragmentos {#including-snippets}

Use el [Sintaxis de fragmento de código VitePress](https://vitepress.dev/guide/markdown#import-code-snippets) para incluir la fuente generada o local:

```md
<<< @/snippets/client.template.toml
```

Se puede incluir una región de código con nombre agregando su nombre de región:

```md
<<< @/example_code/lorem.rs#ipsum
```

Mantenga pequeños los ejemplos escritos a mano. Prefiera los artefactos de origen actualizados para interfaces públicas, plantillas de configuración, esquemas generados y salida de comandos.
