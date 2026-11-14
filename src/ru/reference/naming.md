---
translation_locale: ru
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Соглашения об именовании {#naming-conventions}

Когда вы присваиваете имена аккаунтам, доменам или активам, необходимо учитывать следующие соглашения, используемые в Iroha:

1. Существует ряд зарезервированных разделителей, которые используются для определенных типов конструкций:

   - `@` зарезервировано для псевдонимов учетных записей и форм учетной записи/публичного ключа с ограничением
   - `#` зарезервировано для псевдонимов определения активов и литералов баланса активов
   - `::` зарезервировано для псевдонимов контрактов
   - `.` зарезервировано для квалификации домена и пространства данных
   - `$` зарезервировано для идентификаторов NFT, таких как `name$domain.dataspace`

2. Имя должно быть непустым, в форме Unicode NFC, длиной не более 255 байт UTF-8 и не должно содержать пробельных и управляющих символов, а также символов управления направлением текста.

## Запустите этот рабочий процесс на Taira {#try-it-on-taira}

Преобразовать публичный псевдоним актива в его канонический идентификатор определения актива:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

Сравните это с перечнем определения активов:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

Символ `#` отделяет псевдоним актива от контекста домена. Не включайте его в обычные имена, если вы намеренно не пишете псевдоним актива или литерал баланса актива.
