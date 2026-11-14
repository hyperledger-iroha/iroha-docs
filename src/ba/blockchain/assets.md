---
translation_locale: ba
translation_source: /blockchain/assets.md
translation_source_hash: f5f0eb99e76287db695cc21b8580fd2a9b4dc2a989237c1a1d3d7333c14561ce
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Активтар {#assets}

Iroha актив - иҫәптә тотолған һанлы баланс. Һәр конкрет баланс `AssetDefinition` иҫәбенә йүнәлтелә, һәм билдәләмә был активтың нисек аталыуы, һуғылыуы, күрһәтелеүе һәм бүленеүе мөмкинлеген һүрәтләй.

## Активтар билдәләмәһе {#asset-definition}

`AssetDefinition` түбәндәгеләрҙе үҙ эсенә ала:

- `id`: конфиденциаль активтарҙы билдәләү адресы
- `name`: кеше уҡый торған дисплей исеме
- `description`: кеше уҡырға мөмкин булған факультатив һүрәтләмә
- `alias`: `<name>#<domain>.<dataspace>` йәки `<name>#<dataspace>` формаһындағы факультатив исемдәр.
- `spec`: баланстар өсөн һанлы аныҡлыҡ һәм сикләүҙәр
- `mintable`: минтабильлек сәйәсәте
- `logo`: факультатив `SoraFS` URI
- `metadata`: үҙаллы төп мәғәнәле метамәғлүмәт
- `balance_scope_policy`: баланстарҙың глобаль йә мәғлүмәт киңлеге менән сикләнгән булыуын билдәләй
- `owning_domain`: доменға ҡараған билдәләмәнең эйәһе булған домен; туранан-тура мәғлүмәт киңлегендә теркәлгән билдәләмәләрҙә булмай
- `owned_by`: билдәләмәне теркәгән йәки уға эйә булған иҫәп
- `total_quantity`: дөйөм сығарылған күләм
- `confidential_policy`: һаҡланған активтар операциялары өсөн сәйәсәт

Ассит билдәләмәһе IDs - каноник үтә күренмәле адрестар. Ҡасан билдәләмә домендан һәм исемдән төҙөлә, Iroha шул домен/исем проекцияһын UX һәм һорауҙар өсөн һаҡлай ала, әммә каноник текст формаһы барлыҡҡа килгән адрес булып тора.

## Активтар балансы {#asset-balance}

`Asset` түбәндәгеләрҙе үҙ эсенә ала:

- `id`: `AssetId`, ул активтарҙы билдәләүҙе, хужаның иҫәбен һәм факультатив баланс күләмен берләштерә.
- `value`: `Quantity` балансы

Эйә иҫәбе каноник һәм доменһыҙ. Актив билдәләмәһе мәғлүмәт киңлеге менән аныҡланған домен аҫтында күрһәтелә ала, мәҫәлән, `payments.universal`.

## Ҡулланырлыҡ {#mintability}

Активтар билдәләмәләре был mintability режимдарын хуплай:

|Режим |Мәғәнәһе |
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |Эластик тәьминәт. Активты ҡат-ҡат һуғып яндырырға мөмкин. |
|`Once` |Уны бер тапҡыр һуғып, һуңынан яндырырға мөмкин.|
|`Not` |Төп тәьминәт символы яндырылырға мөмкин, әммә ҡабаттан һуғылмай. |
|`Limited(n)` |Был сәйәсәт яңы активтар берәмектәрен сикләнгән һанда өҫтәмә операцияларҙа сығарырға мөмкинлек бирә. |

Ғәҙәти elastic assets өсөн `Infinitely`, ә fixed-supply йәки bounded-supply assets өсөн `Once` йәки `Limited(n)` ҡулланығыҙ. Asset supply алдан булдырылмаған булһа, `Not`-ты initial policy итеп ҡулланмағыҙ.

## Баланс күләме {#balance-scope}

`balance_scope_policy` баланстарҙың нисек һалыныуын контролдә тота:

- `Global`: бер иҫәп һәм активтар билдәләмәһе буйынса баланс һауыты
- `DataspaceRestricted`: баланстар мәғлүмәт киңлеге контексы буйынса бүленә

Бер үк актив билдәләмәһе бер нисә SORA Nexus мәғлүмәт киңлегендә ҡулланылып, баланстар айырым ҡалырға тейеш булғанда, мәғлүмәт киңлеге менән сикләнгән баланстар файҙалы.

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

Өс миҫал да уҡыу ғәмәлдәре булып тора. Taira-ла активтар сығарыу, яндырыу йәки күсереү өсөн һынау аҡсаһы биреү хеҙмәте аша аҡсаландырылған иҫәпте һәм [Taira һәм Minamoto ярҙамында SORA Nexus өсөн ҡушымта эшләү](/ba/get-started/sora-nexus-dataspaces.md) бүлегендәге һаҡланған эш ағымын ҡулланығыҙ.

Taira-ла комиссия түләнә торған актив миҫалы өсөн башта [Taira-ла һынау селтәре өсөн XOR алыу](/ba/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) бүлегендәге әҙер һынау аҡсаһы биреү хеҙмәте ағымы аша ҡул ҡуйыусының иҫәбен аҡсаландырығыҙ. Һуңынан `ledger asset mint`, `ledger asset burn` һәм `ledger asset transfer` командаларына `--fee-payer authority` параметрын бирегеҙ; CLI ҡул ҡуйыр алдынан Taira комиссия активында теүәл комиссияны күрһәтә:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "<ASSET_DEFINITION_BASE58>" \
  --account "<TAIRA_I105_ACCOUNT_ID>" \
  --to "<RECIPIENT_I105_ACCOUNT_ID>" \
  --quantity 1
```

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
- [JavaScript/TypeScript дәреслек](/ba/guide/tutorials/javascript.md)
- [Мәғлүмәт моделе](/ba/blockchain/data-model.md)
- [NFTs](/ba/blockchain/nfts.md)
