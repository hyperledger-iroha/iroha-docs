---
translation_locale: ba
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Домендар {#domains}

Домендар — `World` эсендә теркәлгән исемле исемдәр киңлектәре. Хәҙерге Iroha 3 мәғлүмәт моделендә домен уны үҙ эсенә алған мәғлүмәт киңлеге менән аныҡлана, шуға күрә каноник идентификатор түбәндәгесә:

```text
domain.dataspace
```

Мәҫәлән, `payments.universal` — `universal` мәғлүмәт киңлегендәге `payments` доменының исеме.

## Структураһы {#structure}

`Domain` теркәлгән исемлектә:

- `id`: мәғлүмәт киңлеге менән аныҡланған `DomainId`
- `logo`: домен логотибы өсөн факультатив `SoraFS` URI
- `metadata`: үҙаллы төп мәғәнәле метамәғлүмәт
- `owned_by`: доменға хужа булған иҫәп, ғәҙәттә уны теркәгән иҫәп

Бутстрап файҙалы йөкләмәһе ҡулланылған материализация домен `NewDomain`. Ул ташый `id`, факультатив `logo`, һәм башланғыс `metadata`. Йүгереү ваҡыты тулы `owned_by` ябай клиенттар был файҙалы йөкләмәне туранан-тура тапшыра алмай.

## Регистрация {#registration}

Ғәҙәти домен булдырыу декларатив ҡушамат ҡоролошо ағымын ҡуллана. Был SNS лизинг килешеүен, хужа мөмкинлектәрен, комиссия иҫәбе һаҡсыһын һәм домен рәтен бер атом `EnsureAlias` транзакцияһында тота. `Register::Domain` генез/bootstrap өҫкө йөҙө булып ҡала, ә `ledger domain` командаһының `register` аҫты командаһы юҡ.

SDK йәки инеү сервисы менән йәшерен булмаған `AliasSetupPlanRequestV1` ниәтен булдырығыҙ, һуңынан CLI уны тере торошҡа ҡаршы планлаштырығыҙ һәм шул уҡ планын тапшырығыҙ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

Ниәт `payments.universal` доменын, уның мәғлүмәт киңлегенең һанлы идентификаторын, каноник I105 хужаһын, ҡуртымға алыу ваҡытын һәм ағымдағы сәйәсәт менән түләү тәҡдимен тикшереү шартын билдәләй. Планлаштырыу нөктәһе — `POST /v1/aliases/setup/plan`; ул ҡайтарған план сылбырға, вәкәләтле иҫәпкә, торошҡа һәм һуңғы ваҡытҡа бәйләнгән. Доменды юйыу өсөн әле лә [`Unregister`](/ba/blockchain/instructions.md#un-register) ҡулланыла.

Доменды булдырыу йәки алып ташлау өсөн домен менән идара итеүгә тейешле рөхсәт кәрәк. Домен метамәғлүмәттәре [`SetKeyValue` һәм `RemoveKeyValue`](/ba/blockchain/instructions.md#setkeyvalue-removekeyvalue) менән яңыртыла ала, әгәр хакимиәт был доменды үҙгәртергә рөхсәткә эйә булһа.

## Taira менән һынап ҡарағыҙ. {#try-it-on-taira}

Хәҙерге ваҡытта асыҡ Taira тест селтәрендә күренә торған домендар исемлеген яҙығыҙ:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Асыҡ һыҙаттар каталогын мәғлүмәт киңлектәре псевдонимдары менән сағыштырығыҙ:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Ҡушымтаға домендың барлығын тикшерергә кәрәк булғанда беренсе команданы ҡулланығыҙ. Мәғлүмәт киңлеге менән бәйләнгән һыҙаттарҙы, шул иҫәптән һәр һыҙаттың асыҡ йә сикләнгән күренеүен һәм төп һыҙатҡа ҡарата синхронлаштырыу торошон ҡарау өсөн һыҙаттар каталогын ҡулланығыҙ.

Доменды көйләү — комиссия түләнә торған яҙыу ғәмәле. Уны Taira-ла һынап ҡарар алдынан [Taira-ла һынау селтәре өсөн XOR алыу](/ba/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) бүлегендәге әҙер һынау аҡсаһы биреү хеҙмәте ағымы аша ҡул ҡуйыусының иҫәбен аҡсаландырығыҙ, һуңынан комиссия түләүсене аныҡ күрһәтеп планды ҡулланығыҙ. CLI ҡул ҡуйыр алдынан теүәл комиссияны күрһәтә:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Ҡабатланған testnet эшләтеүҙәрендә уникаль домен исеме өсөн intent төҙөгөҙ һәм Taira-ның ғәмәлдәге policy һәм fee-asset quote guard-ын ҡулланығыҙ. localnet йәки Minamoto өсөн төҙөлгән plan-ды ҡабат ҡулланмағыҙ.

## Башҡа субъекттар менән мөнәсәбәттәр {#relationship-to-other-entities}

Домендар төркөмө башлыҡ объекттары һәм домен масштабланған мәғлүмәттәр өсөн исемдәр киңлек бирә. активтар билдәләмәләре домен-ҡвалификациялы идентификаторҙарҙы ҡуллана, ә һорауҙар домендарҙы исемлеккә индерә йәки таба ала. Доменға сикләнгән объекттар. Хәҙерге мәғлүмәттәр моделендә иҫәптәрҙең үҙендә домен юҡ, әммә иҫәптәр домендарға эйә була һәм уларҙың билдәләмәләре домендар аҫтында йәшәй торған активтарҙы һаҡлай ала.

Шулай уҡ ҡарағыҙ:

- [Донъя](/ba/blockchain/world.md)
- [Активтар](/ba/blockchain/assets.md)
- [Метамәғлүмәттәре](/ba/blockchain/metadata.md)
- [Исем йөрөтөү ҡағиҙәләре](/ba/reference/naming.md)
