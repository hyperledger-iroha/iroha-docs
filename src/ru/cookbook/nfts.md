---
translation_locale: ru
translation_source: /cookbook/nfts.md
translation_source_hash: 5eb6a349b815afbac9717f7b44c499adc78b1280625388656015ff4b133b9085
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## Результат {#outcome}

Проверка Taira NFT запись, обновление, передача и запрос уникального NFT Рабочий поток использует полностью квалифицированный `name$domain.dataspace` NFT ID и канонические I105 владелец IDs.

## Предварительные условия {#prerequisites}

- `curl`, `jq`, Python 3.11 или позже, и тока `iroha` CLI.
- Доступ только для чтения Taira.
- Для писем генерируется локальная сеть с [Запуск Iroha](/ru/get-started/launch-iroha.md), с `./localnet/client.toml` и Torii на `http://127.0.0.1:8080`.

## Шаги {#steps}

### 1. Инспектировать общественную коллекцию Taira {#_1-inspect-the-public-taira-collection}

Пустая страница является успешным прочтением: это означает, что на запрашиваемой странице нет видимых NFTs.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs - это уникальные записи, а не числовые балансы. У них есть ID, один владелец и компактная карта метаданных `content`.

### Подготовить местного владельца IDs {#_2-prepare-local-owner-ids}

В примере написания используется зарегистрированный домен `wonderland.universal`. Извлечь конфигурированный орган, не раскрывая его частный ключ. затем выберите другой зарегистрированный счет в качестве пункта назначения перевода.

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

Разделитель `$` относится к текстовой форме NFT. Сохраняйте полный домен и суфикс пространства данных `wonderland.universal`.

### 3. Зарегистрировать NFT с начальным содержанием {#_3-register-the-nft-with-initial-content}

CLI читает исходный объект JSON из стандартного ввода. Нынешний орган становится владельцем.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Обновление карты содержания {#_4-update-the-content-map}

Значения метаданных составляют JSON. Установка клавиши вставляет или заменяет этот один вход; он не заменяет всю запись NFT.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Передача собственности {#_5-transfer-ownership}

Доставка как канонических I105 счета IDs. Прежде чем использовать псевдоним, его необходимо разрешить. `--from` или `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Ограничение разрешения

На Taira, каждое запись также нуждается в `--metadata ./taira.tx-metadata.json` и явный плательщик сборов. Регистрация, передача, удаление и обновления метаданных проверяются активным временем выполнения (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` и `CanModifyNftMetadata` в поверхности разрешений по умолчанию).

:::

Для рабочих потоков, принадлежащих контрактным лицам, Kotodama выявленные в типе NFT Следующая запись - точная фиксация жизненного цикла, составленная и выполняемая закрепленным IVM испытание документации:

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

Два фиксированных значения I105 представляют собой испытательные приборы вверх по течению; ремень регистрирует место назначения до выполнения. Они не являются `CURRENT_OWNER` и `NEW_OWNER` от прохождения через CLI. Для заявки на контракт предоставьте его фактические канонические учетные записи, затем составить, проверить, развернуть и вызвать его через [Умные контракты](./smart-contracts.md). Не отправляйте непересмотренный байт-код в Taira, и помните, что выполнение контракта все еще проходит разрешение за время исполнения.

## Проверка {#verify}

Прочитайте NFT непосредственно и подтвердите, что его владелец изменился, пока содержание оставалось прикрепленным к нему:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Если CLI Завершает запись в выходном конверте, проверяет JSON однажды и применить утверждение к содержащимся NFT Авторитетные инварианты: `id`, `owned_by`, и `content`.

## Устранение неполадок {#troubleshooting}

- `name$domain` может устанавливаться по умолчанию в универсальном пространстве данных в некоторых парассерах, но кулинарная книга и приложение IDs должны использовать форму `name$domain.dataspace`.
- Повторная регистрация одного и того же NFT ID отклоняется. Используйте свежую локальную сеть или выберите стабильную новую ID для отдельной записи.
- Вход метаданных должен быть действительным JSON при стандартном входе. Шелковый ряд без цитирования JSON не является значением метаданных.
- Перевод, подписанный счетом, отличным от текущего владельца, требует точного разрешения; изменение `--from` не меняет подписавшегося.
- После передачи, первоначальному клиенту больше не разрешается мутировать NFT. Используйте подписи нового владельца или уполномоченного контролера.
- Taira может вернуть пустую коллекцию NFT. Не рассматривайте `items: []` как доказательство того, что инструкции NFT недоступны.

## Источник и связанные с ним документы {#source-and-related-docs}

- [Тесты интеграции NFT на закрепленном commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT испытания хостингового вызова на финированном commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Точно. Kotodama NFT фиксация жизненного цикла при закрепленном обязательстве](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/ru/blockchain/nfts.md)
- [Метаданные](/ru/blockchain/metadata.md)
- [Инструкция](/ru/blockchain/instructions.md)
- [Токены разрешения](/ru/reference/permissions.md)
