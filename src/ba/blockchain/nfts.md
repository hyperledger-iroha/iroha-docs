---
translation_locale: ba
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT - бер хужаһы булған уникаль иҫәп-хисап объекты. Файҙаланырға кәрәк саҡта NFTs ҡулланығыҙ, әгәр яҙма үҙ идентификацияһына, метамәғлүмәттәренә, йәшәү циклы ваҡиғаларына һәм милек хоҡуғын тапшырыу семантикаһына мохтаж булһа, әммә һан балансы кәрәкмәй.

](/ba/blockchain/assets.md) һанлы [ активтан айырмалы рәүештә, NFT -ҙың иҫәбе буйынса аныҡлығы, өлгөрөүсәнлеге һәм күләмдәре юҡ. NFT бер теркәлгән объект булараҡ бар, һәм милекселек был объектта туранан-тура күҙәтелә.

## Структураһы {#structure}

Теркәлгән `Nft` составында:

- `id`: бер `NftId`
- `content`: NFT миҡдары тураһында метамәғлүмәттәр.
- `owned_by`: NFT иҫәбенә эйә булған иҫәп

`content` яланы - `Metadata` картаһы. Уны компактлы һаҡлағыҙ: унда тасуирлау майҙансыҡтарын, тотороҡло белешмәләрҙе, хештарҙы, URIs йәки SoraFS юлдарын һаҡлау. Ҙур документтар, медиа йә юғары килемле ҡушымталар дәүләтен ситтә һаҡлағыҙ һәм бары тик тикшереү мөмкин булған белешмәне генә һаҡлағыҙ NFT.

## Taira менән һынап ҡарағыҙ. {#try-it-on-taira}

Йәмәғәт Taira тест селтәрендә әлеге ваҡытта NFT яҙмалары бармы-юҡмы икәнен тикшерегеҙ:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

NFT маршруттары өсөн тере OpenAPI документын тикшереп ҡарағыҙ:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Буш `items` массивы - асыҡ тест селтәрендә ғәмәлдә булған яуап. Был ағымдағы биттә NFTs юҡ тигәнде аңлатмай, ә NFT күрһәтмәләре юҡ.

## NFT IDs {#nft-ids}

`NftId` был текст формаһын ҡуллана:

```text
name$domain
name$domain.dataspace
```

Мәҫәлән, `badge$docs.universal` билдәләй `badge` NFT ҡаҙнаһында `docs.universal` Әгәр мәғлүмәттәр арауығы ситтә ҡалһа, ағымдағы анализлаусы `universal` мәғлүмәт киңлеге, шуға күрә `badge$docs` хәл итә `badge$docs.universal`.

NFT IDs өсөн даими исемдәр ҡулланығыҙ. ID - инструкциялар, һорауҙар, рөхсәттәр, ваҡиға фильтрҙары һәм ҡушымта һылтанмалары менән ҡулланылған объект идентификацияһы.

## Ғүмер циклы {#lifecycle}

NFT ғүмере циклы операциялары ҡулланыу Iroha Махсус инструкциялар:

- [`Register`](/ba/blockchain/instructions.md#un-register) башланғыс `content` менән NFT барлыҡҡа килтерә.
- [`Unregister`](/ba/blockchain/instructions.md#un-register) NFT файлын алып ташлай.
- [`Transfer`](/ba/blockchain/instructions.md#transfer) үҙгәрештәр `owned_by`.
- [`SetKeyValue` һәм `RemoveKeyValue`](/ba/blockchain/instructions.md#setkeyvalue-removekeyvalue) яңыртыу NFT метамәғлүмәттәре.

## Урындағы ерҙәрҙә эшләп ҡарағыҙ {#try-it-locally}

Был миҫалдар һеҙ урындағы селтәрҙе башҡарғанһығыҙ тип һанай һәм [CLI күрһәтмәһенән](/ba/get-started/operate-iroha-via-cli.md) клиент конфигурацияһы барлыҡҡа килгән:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Булдырылған локаль селтәр инде ҡуйыла `wonderland.universal` һәм уның SNS аренда. башҡа доменды ҡулланыу өсөн, тәүҙә уны декларатив менән `app alias setup plan` һәм `app alias setup apply` эш процесы [Домендар](/ba/blockchain/domains.md#registration).

NFT теркәлеү стандарт кертеүҙән башланғыс йөкмәтке JSON уҡый:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

NFT туранан-тура тикшерегеҙ, һуңынан бөтә NFTs исемлеген тулы баҫмалар менән яҙығыҙ:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Метамәғлүмәт асҡысын өҫтәп, NFT ҡабаттан уҡығыҙ:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Метамәғлүмәттәр асҡысын алып ташлау:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

NFT вариантын күсереү. `ledger nft get` ҡулланып, ағымдағы хужаны `owned_by`нан уҡырға һәм `ledger account list all` менән тәғәйенләнештәге иҫәпте ID табырға.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Әгәр ҙә һеҙ күсергән NFT, был команданы ғәмәлдәге хужаның иҫәп-хисап конфигурацияһы менән башҡарыу йәки күсереү NFT Тәүҙә кире ҡайтығыҙ.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Һорауҙар һәм ваҡиғалар {#queries-and-events}

[`FindNfts`](/ba/reference/queries.md#assets-nfts-and-rwas) иҫәбенә NFTs һәм [`FindNftsByAccountId`](/ba/reference/queries.md#assets-nfts-and-rwas) иҫәбенә иҫәпкә эйә булған NFTs иҫәбенә ҡулланығыҙ.

NFT теркәлеү, юҡҡа сығарыу, күсереү һәм метамәғлүмәт яңыртыуҙары NFT мәғлүмәт ваҡиғаларын сығара. `Nft` мәғлүмәт ваҡиғалары фильтрын ҡулланып, иҫәп яҙмаһына үҙгәрештәр индергәндә йәки NFT тормош циклы ваҡиғаларына реакция яһаусы ҡуҙғытыусыларҙы төҙөгәндә.

## Разрешениелар {#permissions}

NFT-ҡа хас билдәләр булған рөхсәт өҫкө йөҙө:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Рөхсәт тикшереүҙәре актив үтәү ваҡыты раҫлаусы тарафынан тормошҡа ашырыла, шуға күрә селтәр рөхсәт көйләү башҡармаһы. [Рөхсәт биреү билдәләре](/ba/reference/permissions.md) ғәмәлдәге билдәләр исемлеге өсөн.

## NFTs һайлау {#choosing-nfts}

Үҙенсәлек һәм милек әһәмиәтенә эйә булған яҙмалар өсөн NFT ҡулланығыҙ:

- сертификаттар, билдәләр, лицензиялар һәм танытмалар
- ағзалыҡ йәки инеү яҙмалары
- Идентификация менән бәйләнгән йәки иҫәпкә алынған ғаризалар тураһында яҙмалар
- Сылтанмалар, документтар йәки манифестар

Функциональ баланстар өсөн һанлы активты ҡулланығыҙ, һәм мәғлүмәттәр бары тик ғәмәлдәге иҫәп-хисап объектының компакт атрибуты булған осраҡта ябай [ метамәғлүмәт](/ba/blockchain/metadata.md) ҡулланығыҙ.

Шулай уҡ ҡарағыҙ:

- [Активтар](/ba/blockchain/assets.md)
- [Метамәғлүмәттәре](/ba/blockchain/metadata.md)
- [Инструкциялар](/ba/blockchain/instructions.md)
- [Һорауҙар](/ba/blockchain/queries.md)
