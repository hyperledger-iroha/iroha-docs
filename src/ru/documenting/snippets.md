---
translation_locale: ru
translation_source: /documenting/snippets.md
translation_source_hash: 48d6670f100c7c6368fa03f163c9ff9e0322d36e51c22f89562b23b0e2ee2a2f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Фрагменты кода {#code-snippets}

Сгенерированные фрагменты сохраняют примеры, связанные с кодом, конфигурацией и схемами из ревизии Iroha, которая их создала.

## Обновление Iroha артефактов {#refreshing-iroha-artifacts}

Фрагменты, полученные из Iroha, проверяются, поэтому обычные сборки сайта не требуют доступа к сети или сопутствующего репозитория. Обновляйте их явно:

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Проверенный рабочий процесс `etc/refresh-iroha.ts` проверяет чистую выгрузку исходного кода на соответствие с `provenance/iroha.json`, регенерирует `/src/snippets` и снимок данных Torii OpenAPI, и обновляет SHA-256 криптографические хэши. Рассмотрите изменения содержания и происхождения вместе. Обычная установка зависимостей и сборки VitePress используют зафиксированные файлы без получения изменяемой ветки.

## Включая фрагменты {#including-snippets}

Используйте [VitePress синтаксис фрагмента кода](https://vitepress.dev/guide/markdown#import-code-snippets), чтобы включить сгенерированный или локальный источник:

```md
<<< @/snippets/client.template.toml
```

Названный участок кода можно включить, добавив имя его региона:

```md
<<< @/example_code/lorem.rs#ipsum
```

Держите примеры, написанные от руки, небольшими. Предпочитайте обновленные исходные артефакты для публичных интерфейсов, шаблонов конфигурации, сгенерированных схем и вывода команд.
