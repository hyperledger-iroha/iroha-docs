---
translation_locale: ru
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Сборник Iroha NFT является уникальным объектом учетной записи с одним владельцем. NFTs когда запись нуждается в собственной идентичности, метаданных, событиях жизненного цикла и семантике передачи права собственности, но не требует цифрового баланса.

В отличие от цифр [активы](/ru/blockchain/assets.md), в) NFT не имеет точности, возможности изготовления или количеств на счет. NFT существует как один зарегистрированный объект, и собственность отслеживается непосредственно на этом объекте.

## Структура {#structure}

Регистрированный `Nft` содержит:

- `id`: `NftId`
- `content`: метаданные, описывающие NFT
- `owned_by`: счет, на который принадлежит NFT

В настоящее время `content` поле является `Metadata` Карта. Держите ее компактной: хранить описательные поля, стабильные ссылки, хэши, URIs, или SoraFS Сохранить большие документы, средства массовой информации или высокопроизводительные приложения из-за цепочки и хранить только проверяемую ссылку на NFT.

## Попробуй на Taira {#try-it-on-taira}

Проверьте, есть ли в общественной Taira тестовой сети в настоящее время записи NFT:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Проверьте документ OpenAPI в режиме прямого действия для маршрутов NFT, выявленных узлом:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Пустое . `items` массив - это действительный ответ на публичной тестовой сети. NFTs на текущей странице, не что NFT инструкции недоступны.

## NFT IDs {#nft-ids}

`NftId` использует следующую форму текста:

```text
name$domain
name$domain.dataspace
```

Например, `badge$docs.universal` определяет `badge` NFT в `docs.universal` Если пространство данных выпущено, текущий анализатор использует: `universal` пространство данных, так что `badge$docs` решает: `badge$docs.universal`.

Используйте стабильные имена для NFT IDs. В настоящее время ID является идентификацией объекта, используемой инструкциями, запросами, разрешениями, фильтрами событий и ссылками на приложение.

## жизненный цикл {#lifecycle}

NFT эксплуатация жизненного цикла использование Iroha Специальные инструкции:

- [`Register`](/ru/blockchain/instructions.md#un-register) создает NFT с первоначальным `content`.
- [`Unregister`](/ru/blockchain/instructions.md#un-register) удаляет NFT.
- [`Transfer`](/ru/blockchain/instructions.md#transfer) изменения в `owned_by`.
- [`SetKeyValue` и `RemoveKeyValue`](/ru/blockchain/instructions.md#setkeyvalue-removekeyvalue) обновление NFT метаданные.

## Попробуйте на местном уровне {#try-it-locally}

Эти примеры предполагают, что вы запустили локальную сеть и получаете конфигурацию клиента из руководства [CLI](/ru/get-started/operate-iroha-via-cli.md):

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Уже создана локальная сеть `wonderland.universal` и его SNS Для использования другого домена, сначала создать его с помощью декларативной `app alias setup plan` и `app alias setup apply` рабочий процесс, описанный в [Домены](/ru/blockchain/domains.md#registration).

Зарегистрировать NFT.Зарегистрация читает начальное содержание JSON из стандартного ввода:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

Проверьте NFT непосредственно, а затем перечислите все NFTs с полными записями:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Добавьте ключ метаданных и прочтите NFT снова:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Удалить ключ метаданных:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Факультативное перечисление NFT. Использование `ledger nft get` для чтения текущего владельца из `owned_by`, и использование `ledger account list all` найти учетную запись назначения ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Если вы перенесли NFT, запустите это команду с конфигурацией аккаунта текущего владельца или перенесем NFT обратно.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Вопросы и события {#queries-and-events}

Использование [`FindNfts`](/ru/reference/queries.md#assets-nfts-and-rwas) перечислить NFTs и [`FindNftsByAccountId`](/ru/reference/queries.md#assets-nfts-and-rwas) перечислить NFTs в собственности счета.

NFT Регистрация, удаление, передача и обновление метаданных NFT Данные событий. `Nft` фильтр событий данных при подписке изменений в регистре или создании триггеров, которые реагируют на: NFT события жизненного цикла.

## Разрешения {#permissions}

Поверхность разрешений по умолчанию включает в себя токены, специфические для NFT:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Проверка разрешений осуществляется активным валидатором времени выполнения, поэтому сеть может настроить авторизацию путем обновления исполнителя. [Токены разрешения](/ru/reference/permissions.md) для текущего списка дефолтных токенов.

## Выбор NFTs {#choosing-nfts}

Используйте NFT для записей, в которых имеет значение уникальность и владение:

- сертификаты, значки, лицензии и удостоверения
- запись о членстве или доступе
- записи заявлений, связанных с идентичностью или имеющиеся на учете
- ссылки на СМИ, документы или манифесты вне цепи;

Используйте числовые активы для функциональных балансов и используйте простые [ метаданные](/ru/blockchain/metadata.md), когда данные являются только компактным атрибутом существующего объекта учетной записи.

См. также:

- [Активы](/ru/blockchain/assets.md)
- [Метаданные](/ru/blockchain/metadata.md)
- [Инструкция](/ru/blockchain/instructions.md)
- [Запросы](/ru/blockchain/queries.md)
