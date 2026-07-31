---
translation_locale: ba
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Активтар {#assets}

Iroha актив - иҫәптә тотолған һанлы баланс. Һәр конкрет баланс `AssetDefinition` иҫәбенә йүнәлтелә, һәм билдәләмә был активтың нисек аталыуы, һуғылыуы, күрһәтелеүе һәм бүленеүе мөмкинлеген һүрәтләй.

## Активтар билдәләмәһе {#asset-definition}

`AssetDefinition` түбәндәгеләрҙе үҙ эсенә ала:

- `id`: конфиденциаль активтарҙы билдәләү адресы
- `name`: кеше уҡый торған дисплей исеме
- `description`: кеше уҡырға мөмкин булған факультатив һүрәтләмә
- `alias`: факультатив ҡушаматтар `<name>#<domain>.<dataspace>` йәки `<name>#<dataspace>` формаһы
- `spec`: баланстар өсөн һанлы аныҡлыҡ һәм сикләүҙәр
- `mintable`: минтабильлек сәйәсәте
- `logo`: факультатив `SoraFS` URI
- `metadata`: үҙаллы төп мәғәнәле метамәғлүмәт
- `balance_scope_policy`: баланстар глобаль йәки мәғлүмәт киңлеге менән сикләнгәнме?
- `owned_by`: билдәләмәне теркәгән йәки уға эйә булған иҫәп
- `total_quantity`: дөйөм сығарылған күләм
- `confidential_policy`: һаҡланған активтар операциялары өсөн сәйәсәт

Активтар билдәләмәһе IDs Ҡағиҙәләр исем һәм домендан төҙөлгәндә, Iroha шул домен/исем проекцияһын һаҡлай ала UX һәм һорауҙар, әммә кананик текст формаһы генерацияланған адрес булып тора.

## Активтар балансы {#asset-balance}

`Asset` түбәндәгеләрҙе үҙ эсенә ала:

- `id`: `AssetId`, ул активтарҙы билдәләүҙе, хужаның иҫәбен һәм факультатив баланс күләмен берләштерә.
- `value`: `Numeric` балансы

Хәүеф тотоусы иҫәбенең каноник һәм доменһыҙ булыуы мөмкин. Аҡса билдәләмәһе, мәҫәлән, `payments.universal` мәғлүмәт киңлеге буйынса квалификациялы домен аҫтында күҙаллана ала.

## Ҡулланырлыҡ {#mintability}

Активтар билдәләмәләре был mintability режимдарын хуплай:

|Режим |Мәғәнәһе |
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |Эластик тәьминәт. Активты ҡат-ҡат һуғып яндырырға мөмкин. |
|`Once` |Уны бер тапҡыр һуғып, һуңынан яндырырға мөмкин.|
|`Not` |Төп тәьминәт символы яндырылырға мөмкин, әммә ҡабаттан һуғылмай. |
|`Limited(n)` |Өҫтәмә операциялар өсөн минет эшләү рөхсәт ителә. |

Ҡулланыу `Infinitely` ғәҙәти һығылмалы активтар өсөн һәм `Once` йәки `Limited(n)` даими йәки сикләнгән тәьминәт активтары өсөн. `Not` башланғыс сәйәсәт булараҡ, әгәр активтар менән тәьмин итеү инде билдәләнмәгән булһа.

## Баланс күләме {#balance-scope}

`balance_scope_policy` баланстарҙың нисек һалыныуын контролдә тота:

- `Global`: бер иҫәп һәм активтар билдәләмәһе буйынса баланс һауыты
- `DataspaceRestricted`: баланстар мәғлүмәт майҙансығы контексты буйынса бүленә

Мәғлүмәт киңлеге менән сикләнгән баланстар бер үк актив билдәләмәһе Nexus мәғлүмәт киңлектәрендә ҡулланылған осраҡта файҙалы була, әммә баланстар айырым һаҡланырға тейеш.

## Taira менән һынап ҡарағыҙ. {#try-it-on-taira}

Был уҡырға ғына саҡырыуҙар асыҡ Taira тест селтәрендә реаль активтар билдәләмәләрен күрһәтә:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Хәҙерге Taira XOR түләү активтары билдәләмәһен табығыҙ:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Метамәғлүмәттәрҙе йөрөткән билдәләмәләрҙе эҙләгеҙ:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Өс өлгөһө лә уҡыла. Taira, ҡулланыу кран-финансланған иҫәбенә һәм һаҡланған ағымы [Ҡатнашыу SORA Nexus Мәғлүмәт базалары](/ba/get-started/sora-nexus-dataspaces.md).

Түләү өсөн түләү Taira актив өлгөһө, кран ярҙамсыһын һаҡларға [Testnet-ты алығыҙ XOR тураһында Taira](/ba/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) тип `taira_faucet_claim.py`, һуңынан иң тәүҙә кран активын талап итеп, уны транзакция газ активы булараҡ ҡулланырға:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Шунан индерегеҙ `--metadata ./taira.tx-metadata.json` тураһында `ledger asset mint`, `ledger asset burn`, һәм `ledger asset transfer` бойороҡтар.

## Инструкциялар {#instructions}

Активтарҙы Iroha махсус күрһәтмәләре буйынса теркәп була, һуғырға, яндырырға һәм күсерергә мөмкин:

- [`Register` һәм `Unregister`](/ba/blockchain/instructions.md#un-register)
- [`Mint` һәм `Burn`](/ba/blockchain/instructions.md#mint-burn)
- [`Transfer`](/ba/blockchain/instructions.md#transfer)
- [`SetKeyValue` һәм `RemoveKeyValue`](/ba/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Шулай уҡ ҡарағыҙ:

- [CLI күрһәтмәһе](/ba/get-started/operate-iroha-via-cli.md)
- [Rust дәреслеге](/ba/guide/tutorials/rust.md)
- [Python дәреслеге](/ba/guide/tutorials/python.md)
- [JavaScript/TypeScript дәреслеге](/ba/guide/tutorials/javascript.md)
- [Мәғлүмәт моделе](/ba/blockchain/data-model.md)
- [NFTs](/ba/blockchain/nfts.md)
