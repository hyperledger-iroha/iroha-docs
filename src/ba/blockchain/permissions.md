---
translation_locale: ba
translation_source: /blockchain/permissions.md
translation_source_hash: 7993d14839218fd3394d52dbcce264bffea32394f54e25dd261cd060c54f1fe1
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-supplemental-naming-link+reviewed-delta
---
# Разрешениелар {#permissions}

Хисапҡа блокчейн буйынса төрлө эштәр өсөн рөхсәт билдәләре кәрәк, мәҫәлән, активтарҙы йәшереү йәки яндырыу өсөн.

Йәмәғәт һәм шәхси blockchain-дар ҡулланыусыларға бирелгән рөхсәттәр буйынса айырыла. Йәмәғәт blockchain-да күпселек account-тарҙың permissions йыйылмаһы бер үк. Шәхси blockchain-да тейешле permission асыҡтан-асыҡ бирелмәһә, күпселек account-тар үҙҙәренә бирелгән authority сиктәренән тыш бер нәмә лә эшләй алмай тип иҫәпләнә.

Берәй эште башҡарыуға рөхсәт булыуы аккаунтта тейешле `Permission` барлығын аңлата. Рөхсәттәр туранан-тура йәки рөхсәттәр йыйылмаһын берләштергән [`Role`](#permission-groups-roles) аша бирелә ала. Рөхсәттәр `Grant` instruction менән бирелә. Рөхсәттәрҙең һәм roles-тың ваҡыты бөтмәй; уларҙы `Revoke` instruction менән алып ташлағыҙ.

## Рөхсәт биреү билдәләре {#permission-tokens}

Разрешение токендары - актив башҡарыусы билдәләгән типтағы объекттар. Ҡайһы бер токендар глобаль, мәҫәлән `CanManagePeers`, ә башҡалары иҫәп-хисап ҡаҙнаһы объектына, мәҫәлән, иҫәбкә, активҡа, активтың билдәләмәһенә, доменға, NFT роленә йәки ҡуҙғытыусыға арналған.

Бында төрлө рөхсәт билдәләре өсөн ҡулланылған параметрҙарҙың бер нисә миҫалы:

- Билдәле бер иҫәптең метамәғлүмәттәрен үҙгәртергә рөхсәт биргән токен `account` яланын йөрөтә:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- Билдәле бер актив билдәләмәһенең активтарын күсерергә рөхсәт биргән токен `asset_definition` яланын йөрөтә:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- `CanManagePeers` кеүек глобаль символда ер юҡ:

  ```json
  {}
  ```

### Алдан конфигурацияланған рөхсәт билдәләре {#pre-configured-permission-tokens}

[Reference](/ba/reference/permissions) бүлегендә алдан конфигурацияланған рөхсәт билдәләре исемлеген табырға мөмкин.

## Ирекле төркөмдәр (ойоштороу) {#permission-groups-roles}

Рөхсәт йыйылмаһы роль тип атала. Рөхсәт билдәләренә оҡшаш рәүештә, ролдәр `Grant` инструкцияһы ярҙамында бирелә һәм `Revoke` инструкцияһы ярҙамында кире ҡағыла ала.

Хисапҡа рол биреүҙән алда, роль тәүҙә теркәлергә тейеш.

Бер нисә аккаунт бер үк рөхсәт йыйылмаһын алһа, ролдәр файҙалы. Рольде бер тапҡыр теркәгеҙ, уға рөхсәт бирегеҙ, һуңынан айырым иҫәп-хисап өсөн ролде бирегеҙ йәки кире ҡағығыҙ.

### Яңы ролде теркәгеҙ {#register-a-new-role}

Әйҙәгеҙ, яңы ролде теркәп барайыҡ. Әгәр уға рөхсәт ителһә, ул Mouse иҫәбендәге [ метамәғлүмәткә ](/ba/blockchain/metadata.md) икенсе аккаунтҡа инеү мөмкинлегенә эйә буласаҡ:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### Роль бирегеҙ {#grant-a-role}

Роль теркәлгәндән һуң, Mouse уны Alice-ға бирә ала:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
// `network_id` is the target network's `NetworkId`; the fee intent is bound
// into the signature (use the intent returned by a fee quote).
let grant_role_tx = TransactionBuilder::new(
    network_id,
    mouse_id,
    FeePaymentIntent::authority(Vec::new(), None),
)
.with_instructions([grant_role])
.sign(&mouse_private_key);
```

## Рөхсәтте раҫлаусылар {#permission-validators}

Рөхсәттәр кәрәкле рөхсәт билдәһе булған иҫәптәр генә һаҡланған ғәмәлде башҡара алһын өсөн бар. Ғәҙәттәге башҡарыусы рөхсәттәрҙе транзакцияларҙы һәм инструкцияларҙы башҡарғанда һәм һорауҙарҙы тикшергәндә тикшерә.

Проверкалаусының алдан билдәләнгән өҫкө йөҙө иҫәп-хисап зонаһы буйынса төркөмләнә:

- пирҙар менән идара итеү
- домендар һәм иҫәптәр
- активтар, NFTs, һәм гарантиялар
- триггерҙар
- роле һәм рөхсәттәре
- башҡарыусы/башҡарыу мөхите, иҫбатлауҙар, күперҙәр һәм SORA Nexus модулдәре

Тулы билдәләр исемлеге сығанаҡ менән тәьмин ителгән [Permission Tokens шиғырында](/ba/reference/permissions.md).

### Эшләү ваҡытын раҫлаусы аппараттар {#runtime-validators}

Рөхсәтте тикшереүҙе актив башҡарыусы үтәй. Башланғыс башҡарыусы индерелгән рөхсәт раҫлаусыларҙы һәм токен билдәләрен бирә, ә селтәр ҡулланылған башҡарыусыны яңыртып, сәйәсәтте үҙгәртә ала.

Башҡарыусы операцияны йә рөхсәт итә, йә уны `ValidationFail` сәбәбе менән кире ҡаға. Кире ҡағылған инструкция бөтә транзакцияның кире ҡағылыуына килтерә, ә кире ҡағылған һорау хатаны саҡырыусыға ҡайтара.

## Яҡшы һорауҙар {#supported-queries}

Разрешение билдәләрен һәм ролдәрен һорарға мөмкин.

Рольдәр өсөн һорауҙар:

- [`FindRoles`](/ba/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/ba/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/ba/reference/queries.md#accounts-and-permissions)

Рөхсәт билдәләре өсөн һорауҙар:

- [`FindPermissionsByAccountId`](/ba/reference/queries.md#accounts-and-permissions)
