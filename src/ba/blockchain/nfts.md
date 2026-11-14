---
translation_locale: ba
translation_source: /blockchain/nfts.md
translation_source_hash: 216f59f1cebd73001dab75dcf235306082fb1c0759437f65ce34ec9e1ed51d4f
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# NFTs {#nfts}

Iroha NFT - бер хужаһы булған уникаль иҫәп-хисап объекты. Файҙаланырға кәрәк саҡта NFTs ҡулланығыҙ, әгәр яҙма үҙ идентификацияһына, метамәғлүмәттәренә, йәшәү циклы ваҡиғаларына һәм милек хоҡуғын тапшырыу семантикаһына мохтаж булһа, әммә һан балансы кәрәкмәй.

[Һанлы активтан](/ba/blockchain/assets.md) айырмалы рәүештә, NFT-ның аныҡлығы, сығарылыу мөмкинлеге йәки иҫәптәр буйынса һаны юҡ. NFT бер теркәлгән объект булараҡ йәшәй, һәм милекселек туранан-тура шул объектта күҙәтелә.

## Структураһы {#structure}

Теркәлгән `Nft` составында:

- `id`: бер `NftId`
- `content`: NFT миҡдары тураһында метамәғлүмәттәр.
- `owned_by`: NFT иҫәбенә эйә булған иҫәп

`content` яланы — `Metadata` асҡыс-ҡиммәт картаһы. Унда ҡыҫҡа тасуирламаларҙы, тотороҡло һылтанмаларҙы, хештарҙы, URIs йәки SoraFS юлдарын һаҡлағыҙ. Ҙур документтарҙы, медиафайлдарҙы һәм ҡушымтаның йыш үҙгәргән хәлен сылбырҙан тыш һаҡлағыҙ; NFT эсендә тикшереп булған һылтанма ғына ҡалһын.

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

Буш `items` массивы асыҡ тест селтәрендә дөрөҫ яуап булып тора. Был NFT күрһәтмәләре мөмкин түгеллеген түгел, ә хәҙерге биттә NFTs юҡлығын аңлата.

## NFT IDs {#nft-ids}

`NftId` был текст формаһын ҡуллана:

```text
name$domain
name$domain.dataspace
```

Мәҫәлән, `badge$docs.universal` — `docs.universal` доменындағы `badge` NFT-һының идентификаторы. Мәғлүмәт киңлеге күрһәтелмәһә, ағымдағы анализатор `universal` мәғлүмәт киңлеген ҡуллана, шуға күрә `badge$docs` ҡиммәте `badge$docs.universal` итеп асыҡлана.

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
export NFT_DOMAIN='<OWNED_DOMAIN>.universal'
export NFT_ID="badge_intro\$$NFT_DOMAIN"
```

Булдырылған урындағы селтәр үҙ клиенты өсөн ҡушымта доменын теркәмәй. `NFT_DOMAIN` ҡиммәтен ҡул ҡуйыусы иҫәпкә ҡараған йәки шул иҫәп `CanRegisterNft` рөхсәтенә эйә булған доменға ҡуйығыҙ. Домен булдырыу өсөн [Домендар](/ba/blockchain/domains.md#registration) бүлегендә тасуирланған декларатив `app alias setup plan` һәм `app alias setup apply` эш ағымын ҡулланығыҙ.

NFT теркәлеү стандарт кертеүҙән башланғыс йөкмәтке JSON уҡый:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft register --id "$NFT_ID"
```

NFT туранан-тура тикшерегеҙ, һуңынан бөтә NFTs исемлеген тулы баҫмалар менән яҙығыҙ:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list --all
```

Метамәғлүмәт асҡысын өҫтәп, NFT ҡабаттан уҡығыҙ:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Метамәғлүмәттәр асҡысын алып ташлау:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Теләк буйынса NFT-ны күсерегеҙ. Ағымдағы хужаны `owned_by` яланынан уҡыу өсөн `ledger nft get`, ә алыусы иҫәп идентификаторын табыу өсөн `account list --all` ҡулланығыҙ.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  account list --all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

NFT өлгөһөн күсереүҙән һуң алып ҡалдырығыҙ. Әгәр күсергән булһағыҙ, уны кире күсерегеҙ йәки әлеге хужаның иҫәп яҙмаһы конфигурацияһы менән теркәүҙән баш тартыу командаһын тапшырығыҙ.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
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

Рөхсәт тикшереүҙәре актив үтәү ваҡыты менән раҫлаусы тарафынан үтәлә, шуға күрә селтәрендә үтәүсене яңыртып, рөхсәт итеүҙе көйләй ала. [Рөхсәт биреү билдәләре](/ba/reference/permissions.md) ғәмәлдәге билдәләр исемлеге өсөн.

## NFTs һайлау {#choosing-nfts}

Үҙенсәлек һәм милек әһәмиәтенә эйә булған яҙмалар өсөн NFT ҡулланығыҙ:

- сертификаттар, билдәләр, лицензиялар һәм танытмалар
- ағзалыҡ йәки инеү хоҡуғы яҙмалары
- Идентификация менән бәйләнгән йәки иҫәпкә алынған ғаризалар тураһында яҙмалар
- Сылтанмалар, документтар йәки манифестар

Функциональ баланстар өсөн һанлы активты ҡулланығыҙ, һәм мәғлүмәттәр бары тик ғәмәлдәге иҫәп-хисап объектының компакт атрибуты булған осраҡта ябай [ метамәғлүмәт](/ba/blockchain/metadata.md) ҡулланығыҙ.

Шулай уҡ ҡарағыҙ:

- [Активтар](/ba/blockchain/assets.md)
- [Метамәғлүмәттәре](/ba/blockchain/metadata.md)
- [Инструкциялар](/ba/blockchain/instructions.md)
- [Һорауҙар](/ba/blockchain/queries.md)
