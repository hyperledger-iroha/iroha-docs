---
translation_locale: ba
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Һөҙөмтәлә Iroha NFT - бер хужаһы булған уникаль иҫәп-хисап объекты. NFTs документҡа үҙенең шәхесе, метамәғлүмәттәре, йәшәү циклы ваҡиғалары һәм милек хоҡуғын тапшырыу семантикаһы кәрәк булһа ла, һан балансы кәрәкмәй.

Санлы һандан айырмалы рәүештә [актив](/ba/blockchain/assets.md), а) NFT дөрөҫлөгөнә, өлгөрөүсәнлегенә һәм иҫәп буйынса күләмдәренә эйә түгел. NFT теркәлгән бер объект булараҡ бар, һәм милекселек был объектта туранан-тура күҙәтелә.

## Структураһы {#structure}

Теркәлгән `Nft` составында:

- `id`: бер `NftId`
- `content`: NFT миҡдары тураһында метамәғлүмәттәр.
- `owned_by`: NFT иҫәбенә эйә булған иҫәп

Ҡоролтай `content` яланы - `Metadata` карта. уны компактлы һаҡлағыҙ: тасуирлау яландарын һаҡлау, тотороҡло референциялар, хештар, URIs, йәки SoraFS ҙур документтар, киң мәғлүмәт саралары, йәки юғары кимәлдәге ҡушымталар ҡағиҙәләрен ҡулланма сылбырҙан тыш һаҡларға һәм тикшереү мөмкин булған шиғырын ғына һаҡлау NFT.

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

Бер буш `items` массив - асыҡ тест селтәрендә ғәмәлдә яуап. NFTs хәҙерге битендә, был түгел NFT күрһәтмәләре юҡ.

## NFT IDs {#nft-ids}

`NftId` был текст формаһын ҡуллана:

```text
name$domain
name$domain.dataspace
```

Мәҫәлән, `badge$docs.universal` билдәләй `badge` NFT ҡаҙнаһында `docs.universal` Әгәр мәғлүмәттәр арауығы ситтә ҡалһа, ағымдағы анализлаусы `universal` мәғлүмәт киңлеге, шуға күрә `badge$docs` хәл итә `badge$docs.universal`.

Урынлы исемдәр ҡулланыу NFT IDs. Ҡоролтай ID инструкциялар, һорауҙар, рөхсәттәре, ваҡиғалар фильтрҙары һәм ҡушымта шиғырҙары менән ҡулланылған объект идентификацияһы.

## Ғүмер циклы {#lifecycle}

NFT ғүмере циклы операциялары ҡулланыу Iroha Махсус инструкциялар:

- [`Register`](/ba/blockchain/instructions.md#un-register) барлыҡҡа килтерә NFT башланғыс менән `content`.
- [`Unregister`](/ba/blockchain/instructions.md#un-register) NFT файлын алып ташлай.
- [`Transfer`](/ba/blockchain/instructions.md#transfer) үҙгәрештәр `owned_by`.
- [`SetKeyValue` һәм `RemoveKeyValue`](/ba/blockchain/instructions.md#setkeyvalue-removekeyvalue) яңыртыу NFT метамәғлүмәт.

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

Факультатив күсереү NFT. Ҡулланыу `ledger nft get` Хәҙерге хужаны уҡырға `owned_by`, һәм ҡулланыу `ledger account list all` тәғәйенләнештәге иҫәпте табыу ID.

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

Ҡулланыу [`FindNfts`](/ba/reference/queries.md#assets-nfts-and-rwas) исемлеккә индерергә NFTs һәм [`FindNftsByAccountId`](/ba/reference/queries.md#assets-nfts-and-rwas) исемлеккә индерергә NFTs иҫәбенә эйә.

NFT теркәү, юйыу, күсереү һәм метамәғлүмәт яңыртыуҙар NFT мәғлүмәт ваҡиғалары. `Nft` мәғлүмәттәр ваҡиғалар фильтр теркәлгәндә иҫәп-хисап үҙгәртеүҙәр йәки төҙөүгә реакция тоҡандырғыс NFT тормош циклы ваҡиғалары.

## Разрешениелар {#permissions}

NFT-ҡа хас билдәләр булған рөхсәт өҫкө йөҙө:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Ирекләүҙәр тикшереүҙәре актив үтәү ваҡытын раҫлаусы менән башҡарыла, шуға күрә селтәр башҡарҙыусыны яңыртып, рөхсәт итеүҙе көйләй ала. [Рөхсәт биреү билдәләре](/ba/reference/permissions.md) ғәмәлдәге билдәләр исемлеге өсөн.

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
