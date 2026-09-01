---
translation_locale: ru
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

## Результат {#outcome}

Проверьте состояние Taira NFT, затем зарегистрируйте, обновите, передайте и выполните запрос уникального NFT в сгенерированной локальной сети. Рабочий процесс использует полностью квалифицированный `name$domain.dataspace` NFT идентификатор и канонические I105 идентификаторы владельцев.

## Предварительные требования {#prerequisites}

- `curl`, `jq`, Python 3.11 или более поздняя версия, и текущий `iroha` CLI.
- Доступ только для чтения Taira.
- Для записи используется сгенерированная локальная сеть из [Запуск Iroha](/ru/get-started/launch-iroha.md), с `./localnet/client.toml` и Torii на `http://127.0.0.1:8080`.

## Шаги {#steps}

### 1. Проверьте публичную коллекцию Taira {#_1-inspect-the-public-taira-collection}

Пустая страница — это успешное чтение: это означает, что на запрашиваемой странице нет видимых NFTs.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs — это уникальные записи, а не числовые балансы. У них есть идентификатор, один владелец и компактная карта метаданных `content`.

### 2. Подготовьте локальные идентификаторы владельцев {#_2-prepare-local-owner-ids}

Пример записи использует зарегистрированный домен `wonderland.universal`. Выведите настроенный полномочный субъект без раскрытия его приватного ключа, затем выберите другой зарегистрированный аккаунт в качестве пункта назначения для передачи.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

Разделитель `$` принадлежит текстовой форме NFT. Сохраняйте полный домен `wonderland.universal` и суффикс пространства данных.

### 3. Зарегистрируйте NFT с начальным содержимым {#_3-register-the-nft-with-initial-content}

Файл CLI считывает начальный объект JSON из стандартного ввода. Текущий полномочный субъект становится владельцем.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Обновите карту содержания {#_4-update-the-content-map}

Значения метаданных — JSON. Установка ключа вставляет или заменяет эту одну запись; она не заменяет всю запись NFT.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Передать право собственности {#_5-transfer-ownership}

Укажите оба канонических идентификатора учетной записи I105. Псевдоним должен быть разрешен, прежде чем он будет использоваться как `--from` или `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Граница разрешений

На Taira для каждой записи также нужны `--metadata ./taira.tx-metadata.json` и явно указанный плательщик комиссии. Регистрацию, передачу, удаление и обновление метаданных проверяет активная среда выполнения (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` и `CanModifyNftMetadata` в стандартном наборе разрешений). Используйте домен, назначенный вашему приложению, либо выполняйте это руководство только в localnet.

:::

Для рабочих процессов, принадлежащих контракту, Kotodama предоставляет типизированные вызовы хост-функций NFT. Ниже приведен точный артефакт теста жизненного цикла, скомпилированный и выполненный с помощью закрепленного теста документации IVM:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

Два фиксированных значения I105 являются артефактами тестирования на стороне сервера; тестовый исполнитель регистрирует назначение до выполнения. Они не являются `CURRENT_OWNER` и `NEW_OWNER` из пошагового руководства CLI. Для контракта приложения предоставьте его актуальные канонические аккаунты, затем скомпилируйте, протестируйте, задеплойте и вызовите его через [Умные контракты](./smart-contracts.md). Не отправляйте непроверенный байт-код в Taira, и помните, что выполнение контракта все равно проходит проверку авторизации программного времени выполнения.

## Проверить {#verify}

Прочитайте NFT напрямую и убедитесь, что его владелец изменился, а содержимое осталось прикрепленным:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Если CLI оборачивает запись в контейнер данных для вывода, проверьте JSON один раз и примените утверждение к содержащемуся объекту NFT. Авторитетными инвариантами являются `id`, `owned_by` и `content`.

## Устранение неполадок {#troubleshooting}

- `name$domain` может по умолчанию использовать универсальное пространство данных в некоторых парсерах, но идентификаторы рецептов и приложений должны использовать явную форму `name$domain.dataspace`.
- Повторная регистрация того же ID NFT отклоняется. Используйте новую локальную сеть или выберите стабильный новый ID для отдельной записи.
- Входные метаданные должны быть допустимыми JSON на стандартном вводе. Строка оболочки без кавычек JSON не является значением метаданных.
- Перевод, подписанный счетом, отличным от текущего владельца, требует точного разрешения; изменение `--from` не изменяет криптографического подписанта.
- После передачи исходному клиенту может быть запрещено изменять или отменять регистрацию NFT. Используйте криптографическую подпись нового владельца или уполномоченного контролера.
- Taira может возвращать пустую коллекцию NFT. Не рассматривайте `items: []` как доказательство того, что инструкции NFT недоступны.

## Исходные и связанные документы {#source-and-related-docs}

- [NFT интеграционные тесты на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT тесты технического вызова хоста на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Точный артефакт теста жизненного цикла Kotodama NFT на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/ru/blockchain/nfts.md)
- [Метаданные](/ru/blockchain/metadata.md)
- [Инструкции](/ru/blockchain/instructions.md)
- [Токены разрешений](/ru/reference/permissions.md)
