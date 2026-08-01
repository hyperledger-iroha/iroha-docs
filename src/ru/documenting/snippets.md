---
translation_locale: ru
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Снипты кода {#code-snippets}

Создаваемые фрагменты сохраняют примеры, связанные с кодом, конфигурацией и схемами из пересмотра Iroha, который создал их.

## Артефакты для освежения Iroha {#refreshing-iroha-artifacts}

Снипты, полученные из Iroha, проверяются таким образом, чтобы обычные конструкции сайта не требовали доступа к сети или братьев хранилища.

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Зарегистрированный [`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts) рабочий поток проверяет чистый источник счета против `provenance/iroha.json`, регенерирует `/src/snippets` и Torii OpenAPI мгновенный снимок и обновления SHA-256 hashes. Обзор изменений содержания и происхождения вместе. VitePress Builds потребляют зарегистрированные файлы без получения изменяющейся ветви.

## Включая фрагменты {#including-snippets}

Используйте [VitePress синтаксис сделок кода](https://vitepress.dev/guide/markdown#import-code-snippets) для включения генерируемого или локального исходного текста:

```md
<<< @/snippets/client.template.toml
```

Регион кода может быть включен путем добавления названия региона:

```md
<<< @/example_code/lorem.rs#ipsum
```

Сохраняйте небольшие рукописные примеры. Предпочтительно использовать обновленные источники для публичных интерфейсов, шаблонов конфигурации, генерируемых схем и выпуска команд.
