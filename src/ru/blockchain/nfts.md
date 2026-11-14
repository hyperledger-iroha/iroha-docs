---
translation_locale: ru
translation_source: /blockchain/nfts.md
translation_source_hash: 216f59f1cebd73001dab75dcf235306082fb1c0759437f65ce34ec9e1ed51d4f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# NFTs {#nfts}

Объект Iroha NFT является уникальным распределённым реестровым объектом блокчейна с одним владельцем. Используйте NFTs, когда записи требуется собственная идентификация, метаданные, события жизненного цикла и семантика передачи прав собственности, но ей не нужен числовой баланс.

В отличие от числового [актив](/ru/blockchain/assets.md), NFT не имеет точности, политики выпуска активов или количеств по каждому аккаунту. NFT существует как один зарегистрированный объект, и владение отслеживается непосредственно на этом объекте.

## Структура {#structure}

Зарегистрированный `Nft` содержит:

- `id`: an `NftId`
- `content`: метаданные, которые описывают NFT
- `owned_by`: аккаунт, которому принадлежит NFT

Поле `content` является картой `Metadata`. Делайте его компактным: храните там описательные поля, стабильные ссылки, криптографические хэши, URIs или SoraFS пути. Храните большие документы, медиа или часто изменяющееся состояние приложения вне цепочки и сохраняйте только проверяемую ссылку на NFT.

## Запустите этот рабочий процесс на Taira {#try-it-on-taira}

Проверьте, есть ли в публичной Taira тестовой сети текущие записи NFT:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Проверьте актуальный документ OpenAPI на предмет маршрутов NFT, открытых узлом:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Пустой массив `items` является допустимым ответом в публичной тестовой сети. Это означает, что на текущей странице нет NFTs, а не то, что инструкции NFT недоступны.

## NFT Идентификаторы {#nft-ids}

`NftId` использует эту форму текста:

```text
name$domain
name$domain.dataspace
```

Например, `badge$docs.universal` обозначает NFT `badge` в домене `docs.universal`. Если пространство данных не указано, текущий парсер использует `universal`, поэтому `badge$docs` разрешается в `badge$docs.universal`.

Используйте стабильные имена для идентификаторов NFT. Идентификатор является идентичностью объекта, используемой инструкциями, запросами, разрешениями, фильтрами событий и ссылками на приложения.

## Жизненный цикл {#lifecycle}

NFT операции жизненного цикла используют Iroha операции инструкции:

- [`Register`](/ru/blockchain/instructions.md#un-register) создаёт NFT с инициалами `content`.
- [`Unregister`](/ru/blockchain/instructions.md#un-register) удаляет NFT.
- [`Transfer`](/ru/blockchain/instructions.md#transfer) изменения `owned_by`.
- [`SetKeyValue` и `RemoveKeyValue`](/ru/blockchain/instructions.md#setkeyvalue-removekeyvalue) обновить NFT метаданные.

## Попробуйте это локально {#try-it-locally}

Эти примеры предполагают, что вы запустили локальную сеть и у вас есть сгенерированная конфигурация клиента от [CLI руководство](/ru/get-started/operate-iroha-via-cli.md):

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN='<OWNED_DOMAIN>.universal'
export NFT_ID="badge_intro\$$NFT_DOMAIN"
```

Сгенерированная локальная сеть не регистрирует домен приложения для своего клиента. Задайте в `NFT_DOMAIN` домен, принадлежащий учётной записи подписанта, либо домен, для которого у неё есть разрешение `CanRegisterNft`. Для создания домена используйте декларативную процедуру `app alias setup plan` и `app alias setup apply`, описанную в разделе [Домены](/ru/blockchain/domains.md#registration).

Зарегистрируйте NFT. Регистрация считывает исходное содержимое JSON из стандартного ввода:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft register --id "$NFT_ID"
```

Осмотрите NFT напрямую, а затем перечислите все NFTs с полными записями:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list --all
```

Добавьте ключ метаданных и снова прочитайте NFT:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Удалите ключ метаданных:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

При необходимости передайте NFT. Команда `ledger nft get` позволяет прочитать текущего владельца из `owned_by`, а `account list --all` — найти идентификатор учётной записи получателя.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  account list --all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Удалите пример NFT после пошагового руководства. Если вы его перенесли, либо перенесите обратно, либо отправьте команду отмены регистрации с конфигурацией учетной записи текущего владельца.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft unregister --id "$NFT_ID"
```

## Запросы и события {#queries-and-events}

Использовать [`FindNfts`](/ru/reference/queries.md#assets-nfts-and-rwas) перечислить NFTs и [`FindNftsByAccountId`](/ru/reference/queries.md#assets-nfts-and-rwas) перечислить NFTs принадлежащий аккаунту.

NFT регистрация, удаление, передача и обновления метаданных генерируют NFT события данных. Используйте фильтр событий данных `Nft` при подписке на изменения распределенного блокчейн-реестра или при создании триггеров, которые реагируют на события жизненного цикла NFT.

## Разрешения {#permissions}

Поверхность разрешений по умолчанию включает токены, специфичные для NFT:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Проверки разрешений выполняются активным проверяющим программного обеспечения во время выполнения, поэтому сеть может настраивать авторизацию, обновляя исполнитель. См. [Токены разрешений](/ru/reference/permissions.md) для текущего списка токенов по умолчанию.

## Выбор NFTs {#choosing-nfts}

Используйте NFT для записей, где важны уникальность и принадлежность:

- сертификаты, значки, лицензии и аттестации
- записи о членстве или доступе
- записи приложений, привязанных к идентичности или принадлежащих учетной записи
- ссылки на внецепочечные медиа, документы или технические манифесты

Используйте числовой актив для взаимозаменяемых балансов, а используйте простой [метаданные](/ru/blockchain/metadata.md), когда данные являются лишь компактным атрибутом существующего объекта реестра распределенной блокчейн-сети.

См. также:

- [Активы](/ru/blockchain/assets.md)
- [Метаданные](/ru/blockchain/metadata.md)
- [Инструкции](/ru/blockchain/instructions.md)
- [Запросы](/ru/blockchain/queries.md)
