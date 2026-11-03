---
translation_locale: ru
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# NFTs {#nfts}

## Результат {#outcome}

Проверьте состояние Taira NFT, затем зарегистрируйте, обновите, передайте и выполните запрос уникального NFT в сгенерированной локальной сети. Рабочий процесс использует полностью квалифицированный `name$domain.dataspace` NFT идентификатор и канонические I105 идентификаторы владельцев.

## Предварительные требования {#prerequisites}

- `curl`, `jq`, Python 3.11 или более поздняя версия, и текущий `iroha` CLI.
- Доступ только для чтения Taira.
- Для записи — локальная сеть, созданная командой `kagami localnet generate --peers 4 --out-dir ./localnet`, как в [Запуск Iroha](/ru/get-started/launch-iroha.md), с `./localnet/client.toml` и Torii на `http://127.0.0.1:8080`, а также домен NFT, которым владеет её подписант (см. шаг 2).

## Шаги {#steps}

### 1. Проверьте публичную коллекцию Taira {#_1-inspect-the-public-taira-collection}

Пустая страница — это успешное чтение: это означает, что на запрашиваемой странице нет видимых NFTs.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs — это уникальные записи, а не числовые балансы. У них есть идентификатор, один владелец и компактная карта содержимого, которую строки коллекции Torii возвращают как `metadata`, а `ledger nft get` — как `content`.

### 2. Подготовьте локальные идентификаторы владельцев {#_2-prepare-local-owner-ids}

Для примера записи нужен домен, которым владеет подписывающий аккаунт, или предоставленное для него разрешение `CanRegisterNft`. Сгенерированная локальная сеть не регистрирует для своего клиента никакого домена приложения, а прямая регистрация доменов зарезервирована за генезисом, поэтому задайте в `NFT_DOMAIN` домен `name.dataspace`, который контролирует ваш подписант. Выведите настроенный полномочный субъект без раскрытия его приватного ключа, затем выберите другой зарегистрированный аккаунт в качестве пункта назначения для передачи.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

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

Разделитель `$` принадлежит текстовой форме NFT. Сохраняйте полный домен `name.dataspace` в идентификаторе.

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

На Taira каждая запись использует `--fee-payer authority`; CLI получает точную котировку комиссии в активе комиссии Taira до подписания. Регистрацию, передачу, удаление и обновление метаданных проверяет активная среда выполнения (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` и `CanModifyNftMetadata` в стандартном наборе разрешений). Используйте домен, которым владеет ваш аккаунт, или домен, для которого у него есть эти разрешения.

:::

Для рабочих процессов, принадлежащих контракту, Kotodama предоставляет типизированные вызовы хост-функций NFT. Ниже приведен точный артефакт теста жизненного цикла, скомпилированный и выполненный с помощью закрепленного теста документации IVM:

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
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

CLI выводит саму запись NFT. Авторитетными инвариантами являются `id`, `owned_by` и `content`.

## Устранение неполадок {#troubleshooting}

- `name$domain` может по умолчанию использовать универсальное пространство данных в некоторых парсерах, но идентификаторы рецептов и приложений должны использовать явную форму `name$domain.dataspace`.
- Повторная регистрация того же ID NFT отклоняется. Используйте новую локальную сеть или выберите стабильный новый ID для отдельной записи.
- Входные метаданные должны быть допустимыми JSON на стандартном вводе. Строка оболочки без кавычек JSON не является значением метаданных.
- Перевод, подписанный аккаунтом, отличным от текущего владельца, требует владения доменом NFT или точного разрешения `CanTransferNft`; изменение `--from` не изменяет криптографического подписанта.
- Передача изменяет только `owned_by`. Обновление метаданных и отмена регистрации остаются за владельцем домена или аккаунтом, имеющим `CanModifyNftMetadata` или `CanUnregisterNft` для этого NFT; новый владелец может передать его дальше.
- Taira может возвращать пустую коллекцию NFT. Не рассматривайте `items: []` как доказательство того, что инструкции NFT недоступны.

## Исходные и связанные документы {#source-and-related-docs}

- [NFT интеграционные тесты на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT тесты технического вызова хоста на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Точный артефакт теста жизненного цикла Kotodama NFT на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [Тесты примеров документации Kotodama на закрепленной версии исходного кода](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/ru/blockchain/nfts.md)
- [Метаданные](/ru/blockchain/metadata.md)
- [Инструкции](/ru/blockchain/instructions.md)
- [Токены разрешений](/ru/reference/permissions.md)
