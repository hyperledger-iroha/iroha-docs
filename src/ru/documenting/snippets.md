---
translation_locale: ru
translation_source: /documenting/snippets.md
translation_source_hash: e188082e05db85d5e514b782f93648fb402a09740840c9201e47db353f2192f5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Снипты кода {#code-snippets}

Выделенные фрагменты хранят примеры, связанные с кодом, конфигурацией и схемами из
в) Iroha пересмотр, который их создал.

## Восстановление Iroha Артефакты {#refreshing-iroha-artifacts}

Iroha-выделенные фрагменты проверяются, так что обычные конструкции сайта не требуют
доступ к сети или братецский репозиторий.

```bash
pnpm refresh:iroha --source /path/to/iroha
```

Зарегистрированный
[`etc/refresh-iroha.ts`](https://github.com/hyperledger-iroha/iroha-docs/blob/main/etc/refresh-iroha.ts)
рабочий процесс проверяет чистый источник счета по сравнению `provenance/iroha.json`,
регенерирует `/src/snippets` и Torii OpenAPI мгновенный снимок и обновления SHA-256
hashes. Просмотреть содержимое и происхождение изменения вместе.
установка и VitePress Builds потребляют зарегистрированные файлы без
и принесут изменяемую ветку.

## Включая Сниппеты {#including-snippets}

Используйте
[VitePress синтаксис сделок кода](https://vitepress.dev/guide/markdown#import-code-snippets)
включать генерируемый или локальный источник:

```md
<<< @/snippets/client.template.toml
```

Регион кода может быть включен путем добавления названия региона:

```md
<<< @/example_code/lorem.rs#ipsum
```

Сохраняйте небольшие рукописные примеры.
интерфейсы, шаблоны конфигурации, генерируемые схемы и выходные команды.
