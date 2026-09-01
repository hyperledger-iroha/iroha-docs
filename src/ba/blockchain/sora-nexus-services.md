---
translation_locale: ba
translation_source: /blockchain/sora-nexus-services.md
translation_source_hash: 9fa38abe42ede1b40d92b79dfc7fb6fe8eae7375275a7a3e2bf22e05713026c7
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# SORA Nexus Хеҙмәттәре {#sora-nexus-services}

SORA Nexus Iroha 3 тирәләй ҡушымталарға тәғәйенләнгән сервис кимәлдәрен өҫтәй. Был хеҙмәттәр айырым реестрҙар түгел. Улар Iroha донъя торошо, Norito манифесттары, идара итеү яҙмалары һәм Torii маршрут ғаиләләре менән нығытыла.

Ҡулланыуы узел төҙөлөшөнә һәм селтәр профиленә бәйле. [`/openapi.json`](/ba/reference/torii-endpoints.md#app-and-sora-route-families) ҡулланыу маҡсатлы узелда генерацияланған ҡушымта-API маршруттарын асыҡлау өсөн. Йәмәғәт урындағы SoraFS CID һәм билдәле маршруттар был документтан ситтә ҡуйылған, шуға күрә ул маршруттарҙы тикшергәндә туранан-тура тикшереү.

## Компоненттар картаһы {#component-map}

|Компонент |Роль |Төп өҫкө йөҙҙәр |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
|Soracloud |Ҡушымталарҙы урынлаштырыу, хостинг хеҙмәттәре, шәхси модель/эшләү ваҡыты торошо һәм сервис ғүмер циклын контролдә тотоу. |`/v1/soracloud/*`, `/api/*`, `iroha soracloud service ...` |
|Inrou|Тере HTTP кимәле кәрәк булған сервис ревизиялары өсөн Soracloud хостингындағы HTTP runtime.|Soracloud runtime конфигурацияһы, хост мөмкинлектәре тураһында иғландар, реплика runtime торошо|
|SoraNet |Конфиденциаллыҡ һәм транспорт схемалары, эстафета трафикаһы, VPN, тоташтырыу сессиялары һәм трансляция маршруттары өсөн өҫтәмә. |`/v1/connect/*`, `/v1/vpn/*`, SoraNet маршруты метамәғлүмәттәре |
|Мәғлүмәттең булыуы (DA) |Nexus трассалары, SoraFS манифестациялары һәм иҫбатлау ағымдары менән һылтанған файҙалы йөкләмәләр өсөн ҡулланыу мөмкинлеген раҫлау, йөкләмәне үтәү һәм маҡсатлы пласт. |`/v1/da/*`, `FindDaPinIntent*`, `[nexus.da]` |
|SoraFS |Манифестар, CAR файҙалы йөкләмәләр өсөн контент адресы буйынса һаҡлау туҡымаһы, ҡуйылған контент, ҡапҡанан алыу һәм иҫбатлау мөмкинлеген ҡайтарыу ағымы. |`/v1/sorafs/*`, `/sorafs/*`, `FindSorafsProviderOwner` |
|SoraDNS |SORA хостинг хеҙмәттәр һәм йөкмәтке өсөн детерминистик атамалау һәм хәл итеүсе-аттестация ҡатламы. |`/v1/soradns/*`, `/soradns/*`, хәл итеүсе каталогы ваҡиғалар |
|Атай |Ҡулланма кимәлендәге фиат һәм активтар менән иҫәп-хисап итеү коридоры, уны айырым иҫәп-хикәйәт түгел, ә урындағы депозит иҫәбе ярҙамында тәьмин итәләр. |`OpenAssetEscrow`, `FindAssetEscrow*`, `EscrowEventFilter`, Kotodama `escrow_*` биналар |

```mermaid
flowchart LR
    app["Application or user"] --> dns["SoraDNS name resolution"]
    app --> aitai["Aitai escrow app"]
    dns --> route["Soracloud route"]
    dns --> content["SoraFS content gateway"]
    route --> ivm["Deterministic IVM service"]
    route --> inrou["Inrou hosted HTTP service"]
    aitai --> escrow["Native escrow records"]
    content --> da["DA pin intents and commitments"]
    da --> storage["SoraFS providers"]
    app --> net["SoraNet private route"]
    net --> content
    net --> route
    ledger["Iroha world state and governance"] --> dns
    ledger --> route
    ledger --> content
    ledger --> da
    escrow --> ledger
```

## Ғәҙәттән тыш хәл {#common-flows}

### Хостингтағы бүленгән ҡушымта {#hosted-split-application}

Типик ҡатнаш кимәлле ҡушымта бөтә өлөштәрҙе бергә ҡуллана:

1. Статик фронт-энд активтары SoraFS аша йыйып ҡуйыла һәм тығыҙлана.
2. Мәҫәлән, йәмәғәт хужаһы `<app>.sora`, SoraDNS аша теркәлгән.
3. Soracloud маршруттары `/api/v1/search` йәки `/api/v1/stream` Inrou HTTP хеҙмәткә.
4. Soracloud маршруттар `/api/auth` һәм `/api/v1/user` детерминистик IVM идарасылары.
5. Хосусилыҡ кәрәк булған клиенттар шул уҡ йөкмәткегә йәки API маршрутына SoraNet схемаһы аша барып етә ала.

|Юл|Ярҙәмсе кимәл|Ни өсөн?|
| ----------------- | --------------------- | ------------------------------------------------- |
| `/`               |SoraFS статик йөкмәткеһе |Репродукциялы йөкмәтке тамыр һәм шлюз кешинг |
|`/assets/*` |SoraFS статик йөкмәткеһе |Мәғлүмәт буйынса адресланған активтар һәм асыҡ иҫбатлау |
|`/api/auth*` |Soracloud IVM |Ҡабат уйнау хәүефһеҙ автор һәм аҡса янсығы проблемаһы |
|`/api/v1/user*` |Soracloud IVM |идара итеүгә һиҙгер дәүләт мутациялары |
|`/api/v1/search*` |Soracloud Инру |Тере HTTP хеҙмәт, кеш, SSE йәки коллектор дәүләт |

### Контент баҫмаһы {#content-publication}

Исем уларға күрһәтер алдынан, SoraFS publication durable artifacts булдыра:

1. Яҡшы йөкләмә йәки каталог төҙөгөҙ.
2. Уны CAR архивына һәм өлөшлө планына һалып ҡуйығыҙ.
3. Пин сәйәсәте һәм идара итеү мәғлүмәттәре менән Norito манифест төҙөй.
4. Torii адресы буйынса манифест тапшырыу.
5. DA тырнағы ниәте йәки ҡулланыу мөмкинлеге буйынса йөкләмәне яҙығыҙ, әгәр маҡсатлы профиль асыҡ иҫбатлау талап итә икән.
6. Манифесты SoraDNS исеме йәки Soracloud статик фронт-энд маршруты менән бәйләргә.

### Шәхси юлдар менән йөрөү {#private-fetch-or-streaming-route}

SoraNet SoraFS йәки Soracloud алдында ултырырға мөмкин:

1. Клиент исемде йәки манифестты хәл итә.
2. Һаҡсылар каталогы йәки маршрут манифесында инеү һәм сығыу релейы һайлана.
3. Юл хәрәкәте тултырыла һәм SoraNet схемаһы аша ебәрелә.
4. Сығыш эстафетаһы SoraFS ҡапҡаһына, Torii ағымына йәки Soracloud маршрутына етә.

## Атай {#aitai}

Aitai - SORA баҙар стилендәге иҫәп-хисап өсөн ҡушымта коридоры, унда һатып алыусы һәм һатыусы селтәрҙән тыш түләүҙе координациялай, ә Iroha яңы һанлы активтар һаҡланыу ағымы өсөн контрактҡа ҡараған депозит иҫәбенә түгел, ә урындағы эскроу инструкция ғаиләһен ҡулланырға тейеш.

Төп escrow һаҡлауҙы реестрҙа тота. Һатыусы `OpenAssetEscrow` менән тәҡдим аса, һатып алыусы `AcceptAssetEscrow` һәм `MarkEscrowPaymentSent` менән сикләнгән түләүҙе ҡабул итә һәм билдәләй. һәм һатыусы `ReleaseAssetEscrow` менән иреккә сығара йәки түләү билдәләнгәнгә тиклем юҡҡа сығара. Әгәр һатып алыусы менән һатыусы ризалашмаһа, ике яҡ та бәхәс асырға мөмкин, ә `CanResolveEscrowDispute` менән хәл итеүсе бикләнгән сумманы бүлергә мөмкин.

Бөтөн ғүмер циклы, дөйөм актив бикләүҙәре, аноним эскроу, һорауҙар, ваҡиғалар һәм Rust миҫалдары өсөн [протоколға индерелгән актив эскроуын](/ba/blockchain/escrow.md) ҡарағыҙ.

|Атай йөҙө |Уны  өсөн ҡулланығыҙ|
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
|`OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow` |Транспарентлы һанлы активтар тәҡдимдәре, шул иҫәптән XOR номиналында иҫәп-хисап ағымдары. |
|`OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow` |Һаҡланған тәҡдимдәр финанслау һәм ябыу хәрәкәттәре өсөн иҫбатлама ҡушымталары ҡулланырға. |
|`OpenEscrowDispute`, `ResolveEscrowDispute`, `OpenAnonymousEscrowDispute`, `ResolveAnonymousEscrowDispute` |Низағтарға инеү һәм суд стилендә ҡарар сығарыу. |
|`FindAssetEscrowById`, `FindAssetEscrowsBySeller`, `FindAssetEscrowsByBuyer`, `FindAssetEscrowsByStatus` |Ҡушымталар статусы биттәрен, яраҡлаштырыу эштәрен һәм ярҙам инструменттарын. |
|`EscrowEventFilter` |Тормош транспарентлы эскроу яҙылыуҙар эскроү ID, һатыусы, һатып алыусы, статусы йәки ваҡиға төрө буйынса. |
| Kotodama `escrow_open_offer`, `escrow_accept`, `escrow_mark_payment_sent`, `escrow_release`, `escrow_cancel`, `escrow_open_dispute`, `escrow_resolve_dispute` |Kotodama контракт саҡырыуҙары V1 депозит системаһы ярҙамында. |

Йәмәғәт өсөн Taira йәки Minamoto ҡулланыу өсөн, өҫтәмә түләү рельсыһын һәм һәр ярҙам йәки суд эш аҙымын ғариза сәйәсәте тип ҡарағыҙ. Iroha һаҡланыу торошон, йәшәү циклы ваҡиғаларын, иҫбатлау хештарын һәм һуңғы активтар хәрәкәтен теркәп бара; ул фиат иҫәп-хисапты үҙенән-үҙе тикшереп булмай.

## Маҡсатлы узелды тикшереү {#check-a-target-node}

Был биттән миҫалдар ҡулланыр алдынан, маршрут ғаиләһе һеҙ маҡсатҡа ҡуйған узелда булыуын раҫлағыҙ:

```bash
export TORII_URL=https://taira.sora.org

curl -fsS "$TORII_URL/openapi.json" \
  | jq '.paths | keys[] | select(test("^/v1/(soracloud|sorafs|soradns|connect|vpn|da)/"))'

curl -fsS -H 'Accept: application/json' "$TORII_URL/status" | jq .
```

`/openapi.json` - каноник OpenAPI һуңғы нөктәһе. маршруттың теүәл булыуы төҙөлөш үҙенсәлектәренә һәм селтәр конфигурацияһына бәйле. Документта асыҡ урындағы SoraFS CID һәм билдәле маршруттарҙы иҫәпкә алмайҙар; был һуңғы нөкмәттәрҙе түбәндә һүрәтләнгәнсә туранан-тура тикшерегеҙ.

### Taira Уҡыу өсөн генә тәмәке тикшереүҙәре {#taira-read-only-smoke-checks}

Йәмәғәт Taira endpoint-ы read-side checks өсөн файҙалы. Уны mutating examples өсөн authorized account менән эшләгән һәм public testnet state-ты үҙгәртергә ниәтләгән осраҡта ғына ҡулланығыҙ.

```bash
export TORII_URL=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TORII_URL/status" \
  | jq '{version: .build.version, peers, blocks, lanes: (.teu_lane_commit | length)}'

curl -fsS "$TORII_URL/v1/vpn/profile" \
  | jq '{available, relay_endpoint, supported_exit_classes}'

curl -fsS "$TORII_URL/v1/sorafs/storage/peers?limit=4" \
  | jq '{gateway_base_url, pin_torii_urls}'

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/soracloud/status" \
  | jq '.control_plane | {service_count, services: [.services[] | {service_name, current_version}]}'
```

Taira OpenAPI маршрут картаһында күрһәтелмәгән deployment-specific control-plane маршруттарын аса ала. `/openapi.json` файлын унда булған маршруттар өсөн генерацияланған контракт тип ҡарағыҙ; deployment-specific маршруттарҙы һәм йәмәғәт урындағы SoraFS маршруттарын ҡулланыла тип документлаштырыр алдынан уларҙы туранан-тура тикшерегеҙ.

## Soracloud {#soracloud}

Soracloud — SORA ҡушымталарының идара итеү кимәле. Ул урынлаштырыу пакеттарын, хеҙмәтте үҙгәртеүҙәрҙе, маршрутлауҙы, файҙаланыу торошон, авторитетлы конфигурация яҙмаларын, шифрланған сервис серҙәрен, модель реестры яҙмаларын, шәхси һығымта яһау сессияларын һәм ғәмәлгә ашырыу ваҡыты квитанцияларын күҙәтә.

Soracloud ике үтәү кимәлен ҡуллана:

|Үтәү кимәле|Runtime|Түбәндәгеләр өсөн ҡулланығыҙ|
| ---------------------- | ------- | -------------------------------------------------------------------------------------------- |
|`DeterministicService` |`Ivm` |Автор, көмбәҙ һаҡлағысы торошо, сертификатлы уҡыуҙар, почта йәшниктәрен тәртипкә килтереүселәр, идара итеүгә йоғонтоһо булған мутациялар |
|`HttpService` |`Inrou` |Тере HTTP APIs, коллекторҙар менән ауыр эш, кеш ярҙамында хеҙмәтләндереүҙәр, SSE, браузер ярҙамында ағымдар |

Идара итеү кимәле — абруйлы сығанаҡ. Үҙгә индереү, яңыртыу, кире ҡайтыу, конфигурация, йәшеренлек, модель һәм статус командалары Torii аша тапшырыла һәм донъя торошон уҡый; улар айырым CLI-урындағы көҙгөгә таяна алмай. Йәмәғәт маршруты иң оҙон префиксҡа нигеҙләнә, шуға күрә бер теркәлгән хост трафикты HTTP һәм API маршруттары араһында бүлергә мөмкин.

### Бәхетле ҡушымтаны баҫтырығыҙ {#scaffold-a-split-app}

Бөлөк ҡушымталар шаблоны статик фронт-энд өҫтәп бер хостинг тере API һәм бер детерминистик совхоз/API хеҙмәте булдыра:

```bash
iroha soracloud app init \
  --template split-app \
  --app-name solswap_indexer \
  --app-version 0.1.0 \
  --public-host solswap-indexer.sora \
  --output-dir ./apps/solswap-indexer

iroha soracloud app plan \
  --manifest ./apps/solswap-indexer/app_manifest.json

iroha soracloud app doctor \
  --manifest ./apps/solswap-indexer/app_manifest.json
```

`plan` маршрут бүленеше, балалар хеҙмәте манифесттары, эш урыны сценарий юлдары һәм көтөлә фронт-энд баҫтырыу режимы баҫыла. `doctor` һеҙ ҡатнашҡанға тиклем урындағы сығарыу килешеүен раҫлай Torii.

### Ҡушымтаны урынлаштырыу һәм тикшереү {#deploy-and-inspect-app-state}

Киләсәктә бер SoraFS һаҡланыу эпохаһын сығарыуҙың һәр ҡабаттан һынауы өсөн яңынан ҡулланығыҙ. Сплит-эшкәртеү өлгөһөндә Inrou хеҙмәте булғанға күрә, онлайн мутация алдынан һайланған офлайн провайдер магазиндарында уның аныҡ артефактын билдәләгеҙ:

```bash
export SORACLOUD_TORII_URL=https://<soracloud-enabled-torii>
export SORAFS_RETENTION_EPOCH=<future-unix-seconds>

iroha soracloud app preseed \
  --manifest ./apps/solswap-indexer/app_manifest.json \
  --sorafs-retention-epoch "$SORAFS_RETENTION_EPOCH" \
  --inrou-preseed-target <validator-account,peer-id,absolute-store-path> \
  --inrou-preseed-max-capacity-bytes <bytes> \
  --inrou-preseed-helper /absolute/path/to/sorafs-node \
  --inrou-preseed-helper-sha256 <lowercase-sha256> \
  --receipt-out /absolute/path/to/solswap-inrou-preseed.json

iroha soracloud app release \
  --manifest ./apps/solswap-indexer/app_manifest.json \
  --sorafs-retention-epoch "$SORAFS_RETENTION_EPOCH" \
  --inrou-preseed-receipt /absolute/path/to/solswap-inrou-preseed.json \
  --torii-url "$SORACLOUD_TORII_URL"

iroha soracloud app status \
  --manifest ./apps/solswap-indexer/app_manifest.json \
  --torii-url "$SORACLOUD_TORII_URL"
```

Deployment policy талап иткән һәр provider store өсөн `--inrou-preseed-target`-ты ҡабатлағыҙ. `release` manifest-тарҙы төҙөй һәм синхронлаштыра, app doctor-ҙы эшләтә, бер canonical app-infrastructure mutation ебәрә, authoritative status менән reconciliation яһай һәм иғлан ителгән live target-тарҙы тикшерә. App эсендә Inrou artifact-тары булһа, preseed receipt мотлаҡ.

Инде урынлаштырылған хеҙмәт өсөн, сервис масштабы буйынса командалар ҡулланығыҙ:

```bash
iroha soracloud service status \
  --service-name solswap_indexer_live \
  --torii-url "$SORACLOUD_TORII_URL"

iroha soracloud service rollback \
  --service-name solswap_indexer_live \
  --target-version 0.1.0 \
  --torii-url "$SORACLOUD_TORII_URL"
```

### Серле һәм йәшерен материал {#config-and-secret-material}

Soracloud configuration һәм secret entry-ҙар authoritative deployment state-тың бер өлөшө. Кәрәкле configuration йәки secret binding-тар булмаһа йә active manifest-тарға тап килмәһә, deploy, upgrade һәм rollback fail closed эшләй.

```bash
iroha soracloud service config-set \
  --service-name solswap_indexer_live \
  --config-name indexer/public_config \
  --value-file ./config/public-config.json \
  --torii-url "$SORACLOUD_TORII_URL"

iroha soracloud service secret-set \
  --service-name solswap_indexer_live \
  --secret-name indexer/api_key \
  --secret-file ./secrets/api-key.envelope.json \
  --torii-url "$SORACLOUD_TORII_URL"
```

CLI ярҙамсыһын ҡулланып, профилегеҙ өсөн кәрәкле таныҡлыҡ билдәләрен табығыҙ:

```bash
iroha soracloud service config-set --help
iroha soracloud service secret-set --help
```

## Интроу {#inrou}

Inrou - HTTP хостинг эшләй ваҡытта ҡулланылған Soracloud. Iroha узелы менән встроенный Soracloud эшләй ваҡытта проекттары ҡабул ителгән Soracloud дәүләт урындағы материализация планы, билдәләнгән хостинг-хеҙмәт репликаларын loopback хеҙмәттәре булараҡ башлай һәм репликалар идара итеү ваҡыты дәүләтенә кире авторитетлы модельгә.

HTTP өҫкө йөҙө кәрәк булған эш йөкләмәләре өсөн Inrou ҡулланығыҙ, мәҫәлән, коллектор-ауыр APIs, SSE ағымдары, кеш менән тәьмин ителгән ҡулланмалар йәки браузер ярҙамында хеҙмәтләндереүҙәр.

### Эш ваҡыты талаптары {#runtime-requirements}

- Контейнер манифест Runtime `Inrou` булырға тейеш.
- Сервис манифесының үтәү кимәле `HttpService` булырға тейеш.
- `HttpService + Inrou` тейешенсә бер `PersistentRootLeaseVolume` ҡуйылған `/`.
- Inrou-ның ҡабатланған хеҙмәттәренә шулай уҡ уртаҡ хеҙмәт йәки серле лизинг һаҡлау кәрәк, әгәр улар үҙгәреүсән уртаҡ дәүләт һаҡлай.
- Продукция хостинг узелдар тик прокси сифатында ғына эшләмәйенсә, реаль Inrou ҡеүәтен иғлан итергә тейеш.

### Манифест өҙөгө {#manifest-fragment}

Түбәндәге миҫал ике манифесттың формаһын күрһәтә. Был фрагмент түгел, ә тулыһынса урынлаштырылған пакет.

```jsonc
// container_manifest.json
{
  "schema_version": 1,
  "runtime": { "runtime": "Inrou", "value": null },
  "bundle_path": "/bundles/solswap-indexer.inrou",
  "entrypoint": "/app/bin/launch-indexer.sh",
  "args": [],
  "env": {
    "RUST_LOG": "info",
  },
  "inrou": {
    "schema_version": 1,
    "guest_os": { "guest_os": "DebianSlim", "value": null },
    "guest_images": {
      "x86_64": {
        "kernel_image_path": "/inrou/x86_64/vmlinux",
        "rootfs_image_path": "/inrou/x86_64/rootfs.ext4",
        "initrd_image_path": null,
      },
      "aarch64": {
        "kernel_image_path": "/inrou/aarch64/vmlinux",
        "rootfs_image_path": "/inrou/aarch64/rootfs.ext4",
        "initrd_image_path": null,
      },
    },
  },
  "lifecycle": {
    "start_grace_secs": 60,
    "stop_grace_secs": 30,
    "healthcheck_path": "/api/indexer/v1/health",
  },
}
```

```jsonc
// service_manifest.json
{
  "schema_version": 1,
  "service_name": "solswap_indexer_live",
  "service_version": "0.1.0",
  "execution_plane": { "execution_plane": "HttpService", "value": null },
  "replicas": 2,
  "route": {
    "host": "solswap-indexer.sora",
    "path_prefix": "/api/v1/search",
    "service_port": 8080,
    "visibility": { "visibility": "Public", "value": null },
    "tls_mode": { "tls": "Required", "value": null },
  },
  "lease_volumes": [
    {
      "volume_name": "root_disk",
      "kind": {
        "lease_volume": "PersistentRootLeaseVolume",
        "value": null,
      },
      "storage_class": { "storage_class": "Warm", "value": null },
      "mount_path": "/",
      "max_total_bytes": 8589934592,
    },
    {
      "volume_name": "index_state",
      "kind": { "lease_volume": "ServiceLeaseVolume", "value": null },
      "storage_class": { "storage_class": "Warm", "value": null },
      "mount_path": "/var/lib/solswap-indexer",
      "max_total_bytes": 1073741824,
    },
  ],
}
```

Йүгереү ваҡытында, һәр урынлаштырылған ҡуртым күләме күләменән алынған тирә-яҡ мөхит үҙгәреүсәндәре аша асыҡлана:

```text
SORACLOUD_LEASE_VOLUME_ROOT_DISK_DIR
SORACLOUD_LEASE_VOLUME_ROOT_DISK_MOUNT_PATH
SORACLOUD_LEASE_VOLUME_INDEX_STATE_DIR
SORACLOUD_LEASE_VOLUME_INDEX_STATE_MOUNT_PATH
```

## SoraNet {#soranet}

SoraNet - был конфиденциал һәм транспорт ҡатламы. Ул трафик өсөн эстафетаға нигеҙләнгән маршруттарҙы тәьмин итә, улар туранан-тура маҡсатлы ҡапҡа йәки хеҙмәт менән тоташырға тейеш түгел. Транспорт конструкцияһы инеү, урта һәм сығыу эстафетаһы ролдәрен, QUIC транспортты, тауыш нигеҙендә гибрид ҡул ҡыҫырыҡлауҙы, мөмкинлектәр менән һөйләшеүҙәрҙе, эстафеталағы каталог метамәғлүмәттәрҙе һәм ҡуйы ҙурлыҡтағы ҡаплаған күҙәнәктәрҙе ҡуллана.

Эсендәге Nexus развертывания, SoraNet контент йыйыу, шлюз трафигы алып бара ала, VPN йәки "Контакт" сессиялары, һәм Norito трансляция маршруттары. каталог яҙмалары ярҙам итеүсе релеларҙы билдәләй ала `norito-stream`, был клиенттар өсөн уңайлы маршруттар өҫтөнлөк бирә Torii RPC йәки трафик ағымы.

### Стриминг конфигурацияһы {#streaming-configuration}

Nexus профиле SoraNet өсөн трансляция маршруттарын тәьмин итеү мөмкинлеген бирә:

```toml
[streaming]
feature_bits = 0b11

[streaming.soranet]
enabled = true
exit_multiaddr = "/dns/torii/udp/9443/quic"
padding_budget_ms = 25
access_kind = "authenticated"
provision_spool_dir = "./storage/streaming/soranet_routes"
provision_spool_max_bytes = 0
provision_window_segments = 4
provision_queue_capacity = 256
```

`access_kind = "read-only"` ҡулланыу йөкмәтке маршруттары өсөн, унда тамашасы аутентификацияһын талап итмәй. `authenticated` ҡулланғанда сығыу эстафетаһы билеттарҙы йәки тамашасы шәхесен Torii йәки хостинг хеҙмәте менән күпер алдынан ҡәнәғәтләндерергә тейеш була.

### SoraNet-Аңлашығыҙ, SoraFS {#soranet-aware-sorafs-fetch}

Ҡоролтай SoraFS йыйыу CLI урындағы прокси манифест һәм spool сығара ала SoraNet браузер киңәйтеүҙәре өсөн маршрут метамәғлүмәттәре йәки SDK адаптерҙар. оркестр JSON билдәләргә тейеш `local_proxy` менән `"emit_browser_manifest": true`, һәм CLI һалынған булырға тейеш `local-quic-proxy` Поддержка. Taira, рөхсәт ителгән провайдерҙар каталогын асыҡ тест селтәре тамырҙа тикшерергә; Унан һуң был провайдер өсөн бирелгән һаҡланған провайдер туплын тултырырға:

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'

: "${TAIRA_SORAFS_PROVIDER_ID:?set the admitted provider ID from Taira discovery}"
: "${TAIRA_SORAFS_GATEWAY_KEY:?set the provider gateway key}"
: "${TAIRA_SORAFS_PROVIDER_URL:?set the advertised provider base URL}"
: "${TAIRA_SORAFS_STREAM_TOKEN_FILE:?set the issued stream-token file}"

cargo run -p sorafs_orchestrator --features=local-quic-proxy --bin=sorafs_cli -- \
  fetch \
  --plan=artifacts/payload_plan.json \
  --manifest-id=<manifest-digest-hex> \
  --orchestrator-config=artifacts/orchestrator.json \
  --provider=name=taira,provider-id="$TAIRA_SORAFS_PROVIDER_ID",gateway-key="$TAIRA_SORAFS_GATEWAY_KEY",base-url="$TAIRA_SORAFS_PROVIDER_URL",stream-token="$(cat "$TAIRA_SORAFS_STREAM_TOKEN_FILE")" \
  --output=artifacts/payload.bin \
  --json-out=artifacts/fetch_summary.json \
  --local-proxy-manifest-out=artifacts/proxy_manifest.json \
  --local-proxy-mode=bridge \
  --local-proxy-norito-spool=storage/streaming/soranet_routes \
  --local-proxy-kaigi-spool=storage/streaming/soranet_routes \
  --local-proxy-kaigi-policy=authenticated \
  --max-peers=2 \
  --retry-budget=4
```

Йәмғеһе мәғлүмәт биреүсе отчеттар, күләмле квитанциялар, урындағы прокси метамәғлүмәттәре һәм алып барыу өсөн ҡулланылған маршруттың һөҙөмтәле көйләүҙәре.

### Реле стимул тикшереүсе исемлеге {#relay-incentive-verifier-roster}

Реле стимул ингредиенты уңышһыҙ рәүештә ябыла. `incentives.enable` дөрөҫөрәге, `incentives.trusted_verifier_ids` кәмендә бер канон иҫәбен алырға тейеш ID. Иғтибарыбыҙҙың иҫәбенә 64 кеше индерергә ярамай, хатта стимулдар эшләмәһә лә. Йүгереү ваҡыты уны детерминистик тәртипле йыйылма булараҡ һаҡлай һәм эстафета старты ваҡытында ғәмәлдән сыҡмаған рестр геометрияһын кире ҡаға.

Һәр `RelayBandwidthProofV1` fixed framing/allocation budget буйынса decode ителә һәм frame-ды тулыһынса ҡулланырға тейеш. Proof-тың verifier account-ы configured roster-ҙа булырға һәм relay window ябылыр йәки throughput accumulator үҙгәрер алдынан `RelayBandwidthProofV1::verify_signature()` уңышлы булырға тейеш. Untrusted signer йәки invalid/tampered signature булған proof measurement индермәй һәм incentive snapshot булдыра алмай.

## Мәғлүмәттәрҙең булыуы (DA) {#data-availability-da}

DA - был бик ҙур файҙалы йөкләмәләр өсөн ҡулланыу мөмкинлеген иҫбатлау ҡатламы, артыҡ шәхси йә хеҙмәтләндереүгә бәйле тип иҫәпләнә һәм улар туранан-тура донъя торошонда урынлаштырыла. Унда детерминистик йөкләмәләр һәм алыу бурыстары теркәлә, шуға күрә раҫлаусылар, шлюздар һәм клиенттар ниндәй байттар вәғәҙә ителгән, ниндәй сәйәсәт ҡулланылған һәм ниндәй иҫбатлауҙар күҙәтелгән икәнлеге тураһында килешеү төҙөй алалар.

DA Kura йәки SoraFS урынын алмаштырмай:

- Kura тамамланған блок ағымы һәм консенсус тергеҙеү мәғлүмәттәрен һаҡлай.
- SoraFS контент адресы менән байттарҙы, CAR файҙалы йөкләмәләрҙе һәм манифестарҙы һаҡлай һәм хеҙмәтләндерә.
- DA йөкләмәләр, иҫбатлау сәйәсәттәре, иҫбатлама асыуҙар һәм был байттарҙы планлаштырыу, аудит итеү һәм иҫәп-хисап яҙмаһы торошо менән бәйләнешкә индереү өсөн пин ниәттәрен теркәп бара.

Ҡулланыу DA заявление йәки Nexus Lane-ға иҫәп яҙмаһына күреүсән вәғәҙә кәрәк, ул селтәрҙән тыш мәғлүмәттәрҙе кире ҡайтарырға мөмкин. Ҡайһы бер миҫалдар буйынса, иҫәп-хисап ағымдары өсөн юлды файҙалы йөкләмәләр. SoraFS баҫылған йөкмәтке өсөн пин-интенттар, һуңғараҡ тикшереү өсөн һаҡланырға тейешле иҫбатлау тупланмалары, һәм ҡулланыу артефакттары, уларҙың дәүләт хәле тулы йөк түгел, ә эшкәртеү булырға тейеш.

### Ғүмер циклы {#lifecycle}

|Этап |Нимә яҙылды ?|
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
|Ниәт |Билет, яңғыраған һылтанма, псевдоним, юл/эпоха/секвенция һылтанмаһы, һаҡланыу сәйәсәте йәки репликация маҡсаты. |
|Вазифалар |Манифест, юл йөкләмәһе, иҫбатлау тупланмаһы йәки контент тамырын иҫәп-хисап китабы менән бәйләгән материалды эшкәртеү. |
|Дәлилдәр |Доступлылыҡ тауыштары, иҫбатлау асыҡлыҡтары, провайдерҙар аттестацияһы йәки маҡсатлы селтәр тарафынан ҡабул ителгән башҡа профилле мәғлүмәттәр. |
|Һорау |`FindDaPinIntentByTicket`, `FindDaPinIntentByManifest`, `FindDaPinIntentByAlias` йәки `FindDaPinIntentByLaneEpochSequence` аша шырпы эҙләүҙәр. |

DA менән тәьмин ителгән баҫма ағымы тип түбәндәгеләр һанала:

1. WSV тыштан файҙалы йөкләмәне төҙөү йәки ҡабул итеү, мәҫәлән, SoraFS CAR файлы йәки Nexus һуҡмаҡҡа файҙалы йөкләнеш.
2. Norito манифеста йәки маршрутҡа ярашлы йөкләмә тураһында яҙыу һәм йөкләмәне һүрәтләү.
3. `/v1/da/*` аша манифест, пин ниәте йәки йөкләмәне тапшырыу, әгәр был маршрут ғаиләһе булдырылған булһа, йәки селтәрҙең ҡул ҡуйылған транзакция юлы аша.
4. Валидаторҙар йәки доступность менән тәьмин итеүселәр актив иҫбатлау сәйәсәте буйынса талап ителгән мәғлүмәттәрҙе йыйырға тейеш.
5. Аҡса йөкләнешенә бәйле исем-шәриф, иҫәпләү иҫбатламаһы йәки шлюз маршруты менән таныштырылыр алдынан был билдәнең ниәте һәм йөкләмәһе тураһында һорағыҙ.

### Алгоритм моделе {#algorithmic-model}

DA файҙалы йөкләмәгә ҡул ҡуйылған, ҡабаттан уйнатыуҙан һаҡланған, блок индексы буйынса бирелгән йөкләмәгә әйләнә. Мөһим алгоритмдар детерминистик, шуға күрә валидаторҙар һәм шлюздар бер үк байттарҙан бер үк дигесте ҡабат иҫәпләй ала.

1. Ҡабул ителгән файҙалы йөкләмәне канонлаштырыу. Torii ҡабул итә инеү үтенесе менән `(lane_id, epoch, sequence)`, файҙалы йөкләнеш байт, компрессия метамәғлүмәттәре, өлөш ҙурлығы, һүндереү профиле, һаҡланыу сәйәсәте һәм ебәреүсе ҡултамғаһы. Нод талап ителгән ваҡытта gzip, deflate йәки Zstandard файҙалы йөкләмәләрен декомпрессиялай, һуңынан кананик байт оҙонлоғо `total_size` менән тигеҙ булыуын тикшерә.
2. Nexus трассалар каталогында булырға тейеш. `chunk_size` ике, кәм тигәндә ике байтлы нуль булмаған ҡеүәткә эйә булырға тейеш. һәм конфигурацияланған максималь күләмдән ҙурыраҡ булмаҫҡа тейеш. Һүндереү профилендә мәғлүмәттәр киҫәктәре һәм, кәм тигәндә, ике парлыҡ киҫәклеге булырға тейеш. Юлдар каталогы иҫбатлау схемаһын һайлай, йә `merkle_sha256` йәки `kzg_bls12_381`.
3. Сеть сәйәсәтен ҡулланыу. Блоб класы өсөн конфигурацияланған репликация һәм һаҡланыу базаһын узел үтәй. Йәмәғәт метамәғлүмәттәре ябай текст булып ҡалырға тейеш; идара итеүсе генә метамәғлимәттәр манифестҡа яҙылыуҙан алда узелдың конфигурациялы идара итеүсе метамәғлүмдәр асҡысы менән шифрлана.
4. **Chunk-тарға бүлегеҙ һәм commitment-тар булдырығыҙ.** Каноник payload `chunk_size`-тан алынған даими ҙурлыҡтағы профиль буйынса chunk-тарға бүленә. Torii payload digest-ын, proof-of-retrievability tree root-ын һәм һәр chunk өсөн commitment-тарҙы иҫәпләй. Data chunk-тары үҙ байттары өсөн BLAKE3 commitment-тарын йөрөтә.
5. Һүндереү йөкләмәләрен өҫтәгеҙ. киҫәктәр `data_shards` һыҙыҡтарына төркөмләнә. Һуңғы һыҙатта булмаған күҙәнәктәр парлыҡ иҫәпләү өсөн нуль менән ҡапланған. RS(16) Парлыҡ барлыҡҡа килтерә рәт / глобаль паритет киҫәктәре; факультатив `row_parity_stripes` матрица буйлап бағана рәүешендәге һыҙыҡтарҙың парлығын өҫтәй. Паритет киҫәгенең йөкләмәләре - BLAKE3 ҙур булмаған `u16` символдарҙың дигестары.
6. Манифест төҙөй. `DaManifestV1` трассаны, эпохаһын, блоб класын, кодекты, файҙалы йөкләмәне эшкәртеүҙе, киҫәк тамырҙы, киҫектең ҙурлығын, һүндереү профилен, һаҡлап ҡалыу сәйәсәтен, ҡуртымға түләүҙе, киҫәктәргә йөкләмәләрҙе, факультатив IPA йөкләмәләрен, метамәғлүмәттәрҙе һәм сығарыу ваҡытын теркәп тора. Һаҡлау билеты детерминистик: узел тәүҙә буш билет менән манифест өлгөһөн хэшлай, һуңынан был бармаҡ эҙен һуңғы `storage_ticket` итеп яҙа.
7. Ҡабатлау конфликттарын кире ҡаҡ. Ҡабатлау төймәһе `(lane_id, epoch, sequence, manifest_fingerprint)`. Бер үк fingerprint-лы duplicate idempotent була. Иҫкергән тәртип йәки башҡа бармаҡ эҙҙәре менән бер үк тәртип кире ҡағыла.
8. Torii ҡул ҡуйылған артефакттарҙы сығара. PDP йөкләмәһен иҫәпләй, `DaIngestReceipt`ға ҡул ҡуя, `DaCommitmentRecord` төҙөй һәм манифестҡа скруп артефакттарын яҙа. PDP йөкләмә, йөкләмә рекорды, йөкләмә графигы, пин ниәте, квитанция файлы һәм квитанциялар журналы. Квитанция курсоры `(lane_id, epoch)` буйынса монотон рәүештә алға бара.

Блоктарҙа йөкләмәләр тураһында яҙмалар бар.

- юл, эпоха һәм эҙемтә
- ID һәм каноник манифест хэшиғы
- юл һыҙығы иҫбатлау схемаһы
- киҫәк тамыр
- KZG полосалары өсөн факультатив йөкләмә KZG
- PDP / иҫбатлау дайджест
- һаҡланыу класы һәм һаҡлау билеты
- Torii DA раҫлау имзаһы

Блокҡа DA яҙмаларын индерер алдынан, блок йыйылмаһы юлы бәйләнеште раҫлай:

- `(lane_id, epoch, sequence)` берҙән-бер булырға тейеш.
- Манифест-хашс һандары нуль булмаған һәм тупланма эсендә үҙенсәлекле булырға тейеш.
- Ҡатнашыуҙы иҫбатлау схемаһы конфигурацияланған полоса сәйәсәтенә тап килергә тейеш.
- Merkle юлдар KZG йөкләмәләрҙе кире ҡаға; KZG юлдар KZG йөкләмәһенән башҡа йөкләмәне талап итә.
- Пин ниәттәре каноникализациялана, сортировкалана һәм юлды, манифест хэшигы, һаҡлау билеты, хужа иҫәбенә һәм ҡушамат менән бәрелеш ҡағиҙәләре буйынса фильтрациялана.

Блок башлығы DA иҫбатлау сәйәсәттәре, йөкләмәләр һәм пин-интенттар өсөн хештарҙы һаҡлай. Norito-кодланған `DaCommitmentRecord` ҡиммәттәренең хештары. Ата-әсә узелдары һул һәм уң балаларҙың конкаценацияһын хаш итә; бер нисә япраҡ үҙгәрешһеҙ киләһе ҡатламға күсерелә.

### Дәлилдәрҙе тикшереү {#proof-verification}

`/v1/da/commitments/prove` блокта бер йөкләмә өсөн иҫбатлау сығара ала. иҫбатлауҙа йөкләмә, блок бейеклеге, бандла индекс, бандл хэш, бандль оҙонлоғо, Меркл тамыры һәм һеңле юлы бар.

1. Дәлилдәр бандел хеш блок башлыҡтың DA йөкләмәһе хэш менән тап килә.
2. Дәлилдәр блогы бейеклеге һылтанған блок башлыҡ менән тап килә.
3. Индекс сикләүҙәрҙә һәм йөкләмә шул индекстың тупланма иҫәбенә тигеҙ.
4. Юл хәрәкәтенә ҡаршы сәйәсәт йөкләмәне ҡабул итә.
5. Ойоштороу япрағынан туғандаш юлды бүлеү тәьмин ителгән тамырҙы реконструкциялай.
6. Реконструкцияланған тамыр бандлы тамырға тигеҙ.

Был, билдәле бер блок йөкләмәһе менән бәйле, билдәле бер тәьмин итеү йөкләмәһенең индерелеүен иҫбатлай; был һәр репликаның әлеге ваҡытта онлайн булыуы тураһында иҫбат итмәй. Йәшәү мөмкинлеген SoraFS провайдерҙарҙан алыныу, PDP/PoTR тикшереүҙәр йәки профилгә ярашлы доступность иҫбатлауҙары ярҙамында айырым тикшерелә.

### Консенсуслы үҙ-ара эш итеү {#consensus-interaction}

Консенсус файҙалы йөк менән тәьмин итеү мотлаҡ, әммә был икенсе законлылыҡ протоколы түгел. `PayloadManifest` тулыһынса `3f + 1` комитеты. беренсе орган һәм RS16 Бүлмәле ваҡиғалар өсөн маҡсат А төркөмө, `2f + 1` ағзалары лидер һәм прокси ҡойроҡ инә. сикләнгән шул уҡ ҡараш ретрансляция киңәйтә тән һәм өлөшлө хеҙмәт бөтә комитеты.

Manifest йәки өлөшләтә shard йыйылмаһы тауыш биреү өсөн етмәй. Prepare алдынан һәр validator chunk-тарҙы authenticate итергә, тулы canonical body-ҙы яңынан төҙөргә, уның оҙонлоғон, chunk root-ын һәм body hash-ын тикшерергә, body-ҙы һаҡларға һәм deterministic block validation-ды тамамларға тейеш. Validator шул теүәл body-ҙы CommitQC ҡулланылғанға йәки certified recovery тамамланғанға тиклем һаҡлай.

Peer body-ға эйә булмайынса certificate тураһында белһә, тәүҙә certificate signer-ҙарынан authenticated chunk-тарҙы йәки canonical body-ҙы һорай, шунан recovery-ҙы frozen committee-ға киңәйтә. Һәр response теүәл height context, proposal round, manifest һәм body subject-ҡа бәйле ҡала. Block урында яңынан төҙөлгән body certificate-ҡа тап килгәндән һуң ғына ҡулланыла.

### Оператор билдәләре {#operator-notes}

Iroha 3 consensus profile-дары һәр саҡ signed manifest һәм RS16 payload dissemination, Prepare алдынан full-body validation, DA bundle validation һәм bounded recovery telemetry-ны үҙ эсенә ала. Layout һәм protocol bound-тары signed height context эсендә туңдырылған; уларҙы һүндерә йәки яңынан билдәләй алған local switch йәки timeout profile юҡ. Node-local block һәм queue bound-тары deployment-тың signed layout-ына һәм workload-ына һаман да һыйырға тейеш.

Маршрут асыу өсөн, узелдың OpenAPI документы менән башларға:

```bash
curl -fsS "$TORII_URL/openapi.json" \
  | jq '.paths | keys[] | select(startswith("/v1/da/"))'
```

Хәҙерге DA һорау исемдәре өсөн [ һорауға һылтанма](/ba/reference/queries.md#nexus-data-availability-and-packages) һәм ҡушымта кимәлендәге `[nexus.da]` инеү, өлгө алыу, аудит һәм тергеҙеү сиктәре менән бергә урындағы Sumeragi блок һәм сират сиктәре өсөн [ пир конфигурацияһы өлгөһө](/ba/reference/peer-config/) ҡулланығыҙ.

## SoraFS {#sorafs}

SoraFS - үҙәкләштерелгән контент адресы менән һаҡланған туҡыма. Ул байттарҙы детерминистик киҫәктәргә, CAR архивтарға һәм Norito контент тамырҙарын бәйләүсе манифесттарға бүлеп ҡуя. Һаҡлау провайдерҙары йөкмәтке ҡеүәтен һәм ҡулланыу мөмкинлеген иғлан итә, ә шлюздар контент күрһәткәнсе манифестарҙы һәм йөкләмәләрҙе тикшерә.

SoraFS типик ҡулланыуҙары: статик ҡушымта активтары, документация ҡоролмалары, зона тупланмалары, модель йәки артефакт һылтанмалар һәм идара итеү иҫбатлау тупланмаһы. Iroha мәғлүмәттәр моделе SoraFS шлюз ваҡиғаларын һәм провайдер хужалығын хәл итеү өсөн [ `FindSorafsProviderOwner`](/ba/reference/queries.md#nexus-data-availability-and-packages) һорауҙы аса.

### Taira һынау селтәре профиле {#taira-testnet-profile}

Taira — каноник асыҡ SoraFS һынау селтәре. Уның репозиторийға теркәлгән валидатор профиле `fc56984b-2be7-431d-840e-21514d1883f0` сылбырын һәм `369` сылбыр дискриминаторын ҡуллана. Түбәндәге `NetworkId` — хәҙерге беркетелгән Taira genesis-ының теүәл идентификаторы. Taira-ны ҡабат көйләү сылбыр тамғаһын һаҡлап, был хэшты үҙгәртә ала; шуға күрә уны хәҙерге ҡул ҡуйылған урынлаштырыу профиленән яңыртығыҙ һәм бер ҡасан да сылбыр UUID-һынан сығармағыҙ. Taira-ның ғәмәлдәге SoraFS көйләүҙәре:

- селтәре ID: `hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94`
- Gateway base URL: `https://taira.sora.org`
- ссылка Torii URLs: `https://taira-validator-1.sora.org` аша `https://taira-validator-4.sora.org`
- асыҡлау һәләттәре: `torii_gateway`, `chunk_range_fetch`, һәм `potr_mldsa`
- Изоляциялы йөкмәтке килеп сығышы: `https://{cid}.sorafs.taira.sora.org/{path}`
- асыҡ пин-политикаһы: рөхсәтһеҙ һәм түләүле, `require_council_signatures = false` менән

```toml
[sorafs.storage]
enabled = false
max_capacity_bytes = 13743895347

[sorafs.discovery]
discovery_enabled = true
known_capabilities = ["torii_gateway", "chunk_range_fetch", "potr_mldsa"]

[sorafs.discovery.admission]
envelopes_dir = "configs/soranexus/taira/sorafs_admission"
trusted_council_keys = ["REPLACE_WITH_TAIRA_SORAFS_COUNCIL_PUBLIC_KEY"]
signature_threshold = "REPLACE_WITH_TAIRA_SORAFS_COUNCIL_SIGNATURE_THRESHOLD"

[sorafs.discovery.publish]
gateway_base_url = "https://taira.sora.org"
pin_torii_urls = [
  "https://taira-validator-1.sora.org",
  "https://taira-validator-2.sora.org",
  "https://taira-validator-3.sora.org",
  "https://taira-validator-4.sora.org",
]

[sorafs.gateway]
require_manifest_envelope = true
enforce_admission = true
enforce_capabilities = true

[sorafs.gateway.untrusted_hosting]
enabled = true
path_gateway_redirect = true
redirect_html_only = true

[sorafs.gateway.untrusted_hosting.cid_host_suffixes]
live = "sorafs.sora.org"
taira = "sorafs.taira.sora.org"

[sorafs.repair]
enabled = false
claim_ttl_secs = 900
heartbeat_interval_secs = 60
max_attempts = 3
worker_concurrency = 4

[sorafs.gc]
enabled = false
interval_secs = 900
max_deletions_per_run = 500
retention_grace_secs = 86400

[gov.sorafs_pin_policy]
require_council_signatures = false
```

Өс иң юғары кимәлдәге шлюз ҡиммәттәренә эйә булған default fail-closed; өҙөктәге бөтә башҡа ҡиммәттәр ҙә асыҡтан-асыҡ Taira теркәлгән профилендә. Оператор табыу-ҡабул итеү урыны хужаларын ҡул ҡуйылған урынлаштырыу материалы менән алмаштырырға тейеш. Һәр тапшырылған үтенесе асыҡ конверт йөрөтөргә, провайдерҙы ҡабул итергә һәм иғлан ителгән мөмкинлектәрҙе ҡулланырға тейеш.

Taira validator-ҙарында embedded SoraFS storage, repair һәм garbage collection һүндерелгән. Уларҙың configured capacity-һы validator disk-budget check-тың өлөшө булып ҡала; был validator storage provider тигәнде аңлатмай. Һынау алдынан хәҙер configured gateway һәм pin destination-дарҙы уҡыу өсөн `GET /v1/sorafs/storage/peers?limit=4` ҡулланығыҙ.

Taira схема конфигурацияһы `live` һәм `taira` CID хостинг суффикс асҡыстарын ҡабул итә. Йәмәғәт тест селтәрҙәре манифестарында, килеп сығыу тикшереүҙәрендә һәм браузер һынауҙарында `sorafs.taira.sora.org` ҡулланылырға тейеш, шуға күрә уларҙың килеп сығышы асыҡтан-асыҡ [Taira менән бәйле; ҡабул ителгән `live` асҡысын производствоға ҡараған сығыш аҫтында тест селтәре йөкмәткеһен баҫтырып сығарыу өсөн тәҡдим тип иҫәпләмәй. Башҡа урынлаштырыуҙар үҙ селтәр идентификацияһын, идаралыҡ асҡыстарын, провайдерҙарҙы ҡабул итеү материалын, пин-оҙаҡ пункттарын һәм ҡеүәт/төҙөү сәйәсәтен ҡулланырға тейеш.

### Йәмәғәт урындары CID һәм сайтҡа инеү юлы {#public-local-cid-and-site-gateways}

SoraFS менән тәьмин ителгән һәр Torii узелы был аноним асыҡ маршруттарҙы тоташтыра, хатта факультатив ҡушымта API төҙөлмәгәндә лә:

|Метод һәм маҡсат |Маҡсат |
| ---------------------------------- | -------------------------------------------------------------------- |
|`GET /.well-known/sorafs/manifest` |Каноник һорауҙы ҡабул итеүсе тарафынан һайланған манифестты кире ҡайтарыу |
|`GET /v1/sorafs/cid/{cid}` |Бер CID өсөн сикләнгән урындағы манифест метамәғлүмәттәрен һәм файл яҙмаларын кире ҡайтарығыҙ. |
|`GET /sorafs/cid/{cid}` |Бер урындағы йөкмәтке адресы буйынса сайтҡа төп документты хеҙмәтләндереү |
|`GET /sorafs/cid/{cid}/{*path}` |Был CID аҫтында бер нормалаштырылған юлды, йәки сикләнгән байт диапазонын хеҙмәтләндереү. |

Был маршруттар `x-sorafs-stream-token` йәки `x-sorafs-token-id`-ны бер ҡасан да ҡабул итмәй. Был башлыҡтарҙың береһе булһа ла, request насар тип һанала. Node-тың authoritative local store-ында булған canonical manifest — public read capability; cache miss remote-provider hydration-ды рөхсәт итмәй. Protected provider CAR һәм chunk маршруттары айырым authenticated protocol surface булып ҡала.

Байттарҙы уҡыр алдынан, Torii урындағы манифесттың каноник кодировкаһын, семантик сикләүҙәрҙе, дайджестты һәм тамырҙы раҫлай CID. Унан һуң ул танылған урындағы провайдер шәхесен, идара итеүҙе ҡабул итеүҙе һәм манифестҡа буйһондороуҙы талап итә. CID, һәм провайдер. Gateway ставкаһы / тыйыу сәйәсәте клиенттың ғәмәлдәге адресын ҡуллана, ебәрелгән адрестарҙы конфигурацияланған ышаныслы проксилар аша ғына хөрмәт итеү. Сәйәсәт, compliance, identity йәки admission state етмәһә, система fail closed эшләй.

Һәр һорау асыҡ шлюзға баштан аҙаҡҡа тиклем бер рөхсәтте биләй; бөтә процесс өсөн бер үк ваҡытта иң күбе 64 уҡыу рөхсәт ителә, ә артыҡ һорауҙар `503 Service Unavailable` һәм `Retry-After: 1` яуаптарын ала. Манифест яуабы 16 MiB менән сикләнә, файл исемлеге ғәҙәттә 50 яҙманан тора һәм иң күбе 500 яҙма ҡайтара, ә тулы файл йәки бер байт диапазоны 8 MiB-тан артмай. Һорау параметрҙарын тикшереү йыйылышҡа бәйле. Таратылған `app_api` йыйылышы декодланған тамғаһыҙ 32-битлы `limit` ҡиммәтен ҡабул итә, башҡа һорау асҡыстарын иҫәпкә алмай, ҡабатланған `limit` ҡиммәттәренең һуңғыһын һайлай һәм уны `1..=500` арауығына сикләй. `app_api` функцияһы булмаған минималь йыйылыш бер генә каноник `limit=1..500` парына рөхсәт итә һәм билдәһеҙ, ҡабатланған, процентлап кодланған йәки каноник булмаған формаларҙы кире ҡаға. Йыйылыштар араһында бер төрлө эшләү өсөн тап бер `limit=<1..500>` парын ебәрегеҙ. CIDs-ҙар, хосттар, юлдар һәм диапазон башлыҡтары ике йыйылышта ла каноник һәм бер ҡиммәтле булып ҡала. Әүҙем HTML, CSS, JavaScript, SVG, XML, PDF йәки Wasm йөкмәткеһе көйләнгән, CID-ҙан алынған айырым сығанаҡтан ғына бирелә йәки шунда йүнәлтелә; был уртаҡ юллы шлюз сығанағында ышанысһыҙ йөкмәткенең башҡарылыуына юл ҡуймай.

### Баҫып ҡуйығыҙ, төҙөгөҙ һәм тапшырығыҙ {#pack-build-and-submit}

Түбәндәге үҙгәртеү миҫалы Taira-ның хәҙер беркетелгән `NetworkId` ҡиммәтен, беркетеү ос нөктәһен, күсермәләрҙең минималь һанын һәм идара итеү сәйәсәтен ҡуллана. Финансланған һынау селтәре иҫәбен һәм тик хужа уҡый алған, бер тапҡыр ҡулланыла торған асҡыс файлын файҙаланығыҙ. Taira совет ҡултамғаһы булмаған ирекле беркетеүҙәрҙе ҡабул итә, әммә идара итеү менән билдәләнгән түләүҙе барыбер ала.

```bash
cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  car pack \
  --input=./dist \
  --car-out=artifacts/site.car \
  --plan-out=artifacts/site.chunk-plan.json \
  --summary-out=artifacts/site.car-summary.json

: "${TAIRA_AUTHORITY:?set a funded Taira I105 account}"
export TAIRA_NETWORK_ID='hash:82531CE8EAE8BFF6BEECA4698BFD13A3BC8BEC5F0EE0D23D428C97FC17AB0F3B#3E94'
export TAIRA_PIN_TORII_URL=https://taira-validator-1.sora.org
export TAIRA_PRIVATE_KEY_FILE="${TAIRA_PRIVATE_KEY_FILE:-./secrets/taira-authority.ed25519}"
export TAIRA_RETENTION_EPOCH=$(( $(date -u +%s) + 86400 ))

cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  manifest build \
  --summary=artifacts/site.car-summary.json \
  --manifest-out=artifacts/site.manifest.to \
  --manifest-json-out=artifacts/site.manifest.json \
  --pin-min-replicas=1 \
  --pin-storage-class=warm \
  --pin-retention-epoch="$TAIRA_RETENTION_EPOCH"

cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  manifest submit \
  --manifest=artifacts/site.manifest.to \
  --chunk-plan=artifacts/site.chunk-plan.json \
  --torii-url="$TAIRA_PIN_TORII_URL" \
  --network-id="$TAIRA_NETWORK_ID" \
  --authority="$TAIRA_AUTHORITY" \
  --private-key-file="$TAIRA_PRIVATE_KEY_FILE" \
  --summary-out=artifacts/site.manifest.submit.json \
  --response-out=artifacts/site.manifest.submit.body
```

`manifest submit` талап итә `/v1/sorafs/pin/register`. Әгәр маҡсатлы узел уны йүнәлтмәһә, команда юҡҡа сыға; беренсе тапҡыр сығарылған CLI дөйөм `/transaction` һуңғы нөктәһенә кире ҡайтмаясаҡ.

### Тикшерегеҙ һәм килтерегеҙ {#verify-and-fetch}

Һаҡланған ташыу туплы провайдер-специфик. уның провайдерын алырға ID һәм рекламаланған база URL от Taira провайдер каталогы, һәм шул провайдер инеү ағымы аша ҡапҡа асҡысы һәм ағым токен алыу. Был ҡиммәттәр раҫлаусы-ҡурсаулыҡ көйләмәләре түгел. Taira Валидаторҙар эске һаҡлағысты һүндергән, шуға күрә валидаторҙы алмаштырмағыҙ. URL тәьмин итеүсе өсөн URL.

```bash
export TAIRA_ROOT=https://taira.sora.org
curl -fsS "$TAIRA_ROOT/v1/sorafs/providers?limit=20" | jq '.providers'

: "${TAIRA_SORAFS_PROVIDER_ID:?set the admitted provider ID from Taira discovery}"
: "${TAIRA_SORAFS_GATEWAY_KEY:?set the provider gateway key}"
: "${TAIRA_SORAFS_PROVIDER_URL:?set the advertised provider base URL}"
: "${TAIRA_SORAFS_STREAM_TOKEN_FILE:?set the issued stream-token file}"

cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  proof verify \
  --manifest=artifacts/site.manifest.to \
  --car=artifacts/site.car \
  --chunk-plan=artifacts/site.chunk-plan.json \
  --summary-out=artifacts/site.verify.json

cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  fetch \
  --plan=artifacts/site.chunk-plan.json \
  --manifest-id=<manifest-digest-hex> \
  --provider=name=taira,provider-id="$TAIRA_SORAFS_PROVIDER_ID",gateway-key="$TAIRA_SORAFS_GATEWAY_KEY",base-url="$TAIRA_SORAFS_PROVIDER_URL",stream-token="$(cat "$TAIRA_SORAFS_STREAM_TOKEN_FILE")" \
  --output=artifacts/site.fetch.tar \
  --json-out=artifacts/site.fetch.json
```

### Иҫәп алыу мөмкинлеген иҫбатлау өсөн тикшереүҙәр {#proof-of-retrievability-checks}

Операторҙар иҫбатлау һөҙөмтәләрен тикшерә, экспортлай һәм хәбәр итә ала.Һөжүмдәр селтәрҙең иҫбатлау pipeline буйынса билдәләнә; CLI уларҙың һөҙөмтәләрен яҙа.

```bash
cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  por status \
  --torii-url="$TAIRA_PIN_TORII_URL" \
  --manifest=<manifest-digest-hex> \
  --status=failed \
  --limit=20

cargo run -p sorafs_orchestrator --bin sorafs_cli -- \
  por report \
  --torii-url="$TAIRA_PIN_TORII_URL" \
  --week=<YYYY-Www> \
  --format=json
```

## SoraDNS {#soradns}

SoraDNS - SORA хеҙмәттәренең һәм йөкмәткеһенең детерминистик атамалау ҡатламы. Ул исемдәрҙе нормализациялай, резульвер каталогы яңыртыуҙарын Iroha һәм SoraFS аша ҡул ҡуйылған зона йәки резульвер тупланмаларын тарата. Резульверҙар һәм шлюздар табыу метамәғлүмәтенә ышаныр алдынан резульвер раҫлау документтарын тикшерә.

Браузерға инеү өсөн SoraDNS Gateway хосттарҙы теркәлгән FQDN исемлегенән ала. Теркәлгән бушлыҡ хосты каноник ҡулланыу сығанағы булып ҡала, ә индерелгән Gateway профилдәрендә был сығанаҡ өсөн браузер һәм Torii кире ҡайтыу маршруттары асыҡлана.

### Ҡунаҡлаусы формалары {#host-forms}

|Форма |Миҫал |Маҡсат |
| ---------------------- | ---------------------------------------------- | --------------------------------------------------------- |
|Бәхетһеҙлек килеп сығышы |`https://<fqdn>/<path>` |Манифестарҙа һәм сығарыу белешмәләрендә теркәлгән URL Canonical app |
|Taira браузер Gateway |`https://<fqdn>.mon.taira.sora.net/<path>` |Актив ҡушамат өсөн асыҡ браузер ҡапҡаһы |
|Torii кире ҡайтыу юлы |`https://taira.sora.org/soradns/<fqdn>/<path>` |Torii Дебаг һәм кире ҡайтыу маршруты өсөн әүҙем ҡушамат |
|Canonical hash gateway |`<base32(blake3(name))>.gw.sora.id` |Детерминистик инеү юлы идентификацияһы һәм GAR тикшереү |

`/soradns/<alias>/...` фалб-бак өҫтөнлөклө асыҡ түгел URL. Ҡулланмалар, ҡушымта манифесттары һәм фронт-энд конфигурацияһы бушлыҡ хостинг үҙе өҫтөнлөк бирергә тейеш. Әгәр ҡушамат Taira өҫтөндә әүҙем түгел икән, браузер шлюзы йәки кире ҡайтыу юлы ҡушымта маршрутизацияһы башланыр алдынан `404` кире ҡайтарырға йәки TLS уңышһыҙлыҡҡа осратырға мөмкин.

### Деривный шлюз хостингтары {#derive-gateway-hosts}

```ts
import {
  deriveSoradnsGatewayHosts,
  hostPatternsCoverDerivedHosts,
} from '@iroha/iroha-js'

const derived = deriveSoradnsGatewayHosts('docs.sora')
console.log(derived.canonicalHost)
console.log(derived.prettyHost)

const taira = deriveSoradnsGatewayHosts('solswap-indexer.sora', {
  prettySuffix: 'mon.taira.sora.net',
})
console.log(taira.prettyHost)

const patterns = [
  derived.canonicalHost,
  derived.canonicalWildcard,
  derived.prettyHost,
]
console.log(hostPatternsCoverDerivedHosts(patterns, derived))
```

GAR файҙалы йөкләмәләр каноник хэш хост, каноник wildcard, һәм һайлап алынған матур хост ҡапларға тейеш.

### Резольвер каталогы снапшоттарын килтерегеҙ {#fetch-a-resolver-directory-snapshot}

```bash
curl -i "$TORII_URL/v1/soradns/directory/latest"

soradns_resolver directory fetch \
  --record-url "$TORII_URL/v1/soradns/directory/latest" \
  --directory-url https://gateway.example.org/soradns/directory/latest.car \
  --output ./state/soradns-directory

soradns_resolver rad verify \
  --rad ./state/soradns-directory/rad/resolver-a.norito
```

Gateways-тар резюсер раҫлау документын юғалтҡан, ваҡыты бөткән, ҡултамғаланмаған йәки Merkle тамыры тип аталған һуңғы каталогта нығытылмаған резюзерҙарҙы кире ҡағырға тейеш. Резюсер каталогы әлегә баҫылған булмаған селтәрҙә маршрут эшләһә лә `/v1/soradns/directory/latest` `404` версияһын бирә ала.

### Халыҡ-ара DNS Делегация {#public-dns-delegation}

SoraDNS хост сығарылышы даими интернет DNS делегацияһы алмаштырмай. Әгәр йәмәғәт DNS исеме SoraDNS ҡапҡаһына йүнәлтергә тейеш булһа:

- субдомендар өсөн, һайлап алынған матур хостҡа CNAME баҫтырырға
- Апекс исемдәре өсөн ALIAS/ANAME йәки A/AAAA яҙмаларын IPs ниндәй ҙә булһа катталған ҡапҡаға ҡулланығыҙ.
- GAR тикшереүҙәр өсөн SoraDNS шлюз домены аҫтында каноник хэш хостинг һаҡлай

## FHE һәм UAID {#fhe-and-uaid}

FHE менән бәйле өҫкө йөҙҙәр Nexus хеҙмәттәрендә ҡулланылған:

- `iroha_crypto::fhe_bfv` скаляр шифрлы текстты баһалау өсөн детерминистик BFV ярҙамын ғәмәлгә ашыра. Идентификатор резолюцияһы `BfvIdentifierPublicParameters` һәм `BfvIdentifierCiphertext` ҡуллана, унда 0 слот инеү байты оҙонлоғон һаҡлай, ә һуңыраҡ слоттар һәр береһендә бер шифрланған байт һаҡлай.
- Soracloud дәүләт һәм эш схемалары моделе FHE шифрлы текст эш йөкләмәләре менән идаралыҡ-идара параметрҙар йыйылмаһы, үтәү сәйәсәттәре, шифрлы текстың йөкләмәләре, һорау конверттары һәм асыу өсөн ғариза.

BFV идентификаторы юлы шәхси хоҡуҡтарҙы һаҡлап ҡалыу өсөн ҡулланыла. Клиент шифрланған идентификаторҙы Torii резюсерға тапшыра ала. Резюсер баһалай ул актив идентификатор сәйәсәте буйынса `OpaqueAccountId` алып сыға һәм квитанция бирә. `ClaimIdentifier` был квитанцияны һуңынан маҡсатлы иҫәпкә ҡушылған UAID менән бәйләй.

UAID — был ағым өсөн шәхес һәм мөмкинлек якоры. Мәғлүмәт моделендә `UniversalAccountId` hash-ҡа нигеҙләнә һәм `uaid:<hash>` рәүешендә күрһәтелә. Парсерҙар `uaid:<hash>` формаһын да, 64 hex символдан торған raw digest-ты ла ҡабул итә. `Account` һәм `NewAccount` факультатив `uaid` һәм `opaque_ids` ҡырҙарын үҙ эсенә ала. Runtime теркәүе UAID менән иҫәп араһында бер-бергә индекс булдыра, ҡабатланған йәки бәрелешкән opaque identifier-ҙарҙы, шулай уҡ UAID-һыҙ opaque identifier-ҙарҙы кире ҡаға. UAID–account бәйләнеше үҙгәргән һайын, runtime ошо UAID өсөн Space Directory dataspace бәйләнештәрен яңынан төҙөй.

Space Directory manifests ҡушымтаға ҡушыу мөмкинлектәрен UAID. Һөҙөмтәлә `AssetPermissionManifest` исемдәре UAID, мәғлүмәт киңлеге, активация һәм факультатив тамамланыу ваҡыты, шулай уҡ рөхсәт/ҡурҡма иҫәбенә тапшырылған мәғлүмәттәр киңлеге, программаһы, ысулы, актив, һәм AMX роль. баһалау - кире ҡаға-уңыштар: беренсе тап килеү кире ҡаҡҡан үтенесе кире ҡағыла, Юғиһә, һуңғы тап килеү рөхсәт кандидаты ниндәй ҙә булһа сумма лимитына ҡаршы тикшерелә. Был манифестарҙы баҫтырып сығарыу, уларҙың ваҡыты бөтөү һәм кире ҡағыу тураһында `CanPublishSpaceDirectoryManifest`.

Soracloud FHE дәүләте өсөн ғәмәлгә ашырылған схемалар:

|Схема |Ул нимә менән идара итә ?|
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
|`SoraStateBindingV1` менән `FheCiphertext` |Дәүләт клавишаһы префиксы аҫтындағы ҡиммәттәр FHE шифрлы текстар тип белдерә. |
|`FheParamSetV1` |Схеманың исемдәре, артҡы яғы, модуль сылбыры, полиномия дәрәжәһе, слот һаны, хәүефһеҙлек маҡсаты, йәшәү циклы һәм параметрҙар дайджест. |
|`FheExecutionPolicyV1` |Шифрлы текст күләмен, ябай текстың ҙурлығын, инеү/һатыу һанын, ҡабатлау тәрәнлеген, әйләнештәрҙе, старт-страптарҙы һәм түңәрәкләү режимын сикләй. |
|`FheGovernanceBundleV1` |Бер параметрҙы бер үтәү сәйәсәте менән ҡуйып, ҡабул итеүҙе раҫлау өсөн. |
|`FheJobSpecV1` |Детерминистик `Add`, `Multiply`, `RotateLeft` йәки `Bootstrap` шифрлы текст дәүләт асҡыстары һәм йөкләмәләре өҫтөндә эште һүрәтләй. |
|`CiphertextQuerySpecV1` |Һорауҙар шифрлы тексты ғына хеҙмәт, бәйләү, клавиша префиксы, һөҙөмтә сиктәре, метамәғлүмәт кимәле һәм факультатив индереү иҫбатламаһы буйынса билдәләнә. |
|`DecryptionRequestV1` |Шифрлау-авторитет сәйәсәте буйынса бер шифрлы текст йөкләмәһе өсөн асылыуҙы һорай. |

`FheJobSpecV1::validate_for_execution` эш, үтәү сәйәсәте һәм параметр йыйылмаһының ҡабул итеүҙән алда килешеүен тикшерә. Ул шулай уҡ операцияға ҡағылышлы ҡағиҙәләрҙе бойомға ашыра: өҫтәү һәм ҡабатлау кәмендә ике инеү кәрәк, әйләнеү һәм стартҡа сығыу өсөн тап бер инеү кәрәк, һәм һоралған тәрәнлек, ротация һанын, стартҡа алыу һанын, инеү һанын, файҙалы йөкләмә байттарын һәм детерминистик сығарыу күләмен сәйәсәт сиктәрендә һаҡларға тейеш. Шифр тексты һорауҙары һөҙөмтәләре ябай текст һыҙыҡтарын кире ҡайтарырға тейеш түгел .

UAID шифрлы текст түгел һәм FHE сәйәсәте үҙе лә түгел. Ул хисапты, үтә күренмәле идентификатор талаптарын һәм сервис йәки мәғлүмәттәр арауығы ағымын раҫлаған Space Directory бәйләнештәрен табыу өсөн ҡулланылған тотороҡло аккаунт мөмкинлектәре якоряһы. FHE схемалары параметрҙар йыйылмаһы, үтәү сәйәсәте, шифрлы текст йөкләмәләре һәм шифрлау хоҡуғы сәйәсәттәре аша шифрланған файҙалы йөк тапшырыуҙы ҡабул итеүҙе һәм башҡарыуҙы айырым көйләй.

Torii өҫкө йөҙҙәренә түбәндәгеләр инә:

- `/v1/identifier-policies`
- `/v1/identifiers/resolve`
- `/v1/accounts/{account_id}/identifiers/claim-receipt`
- `/v1/identifiers/receipts/{receipt_hash}`
- `/v1/accounts/{uaid}/portfolio`
- `/v1/space-directory/uaids/{uaid}`
- `/v1/space-directory/uaids/{uaid}/manifests`
- `/v1/soracloud/fhe/job/run`
- `/v1/soracloud/ciphertext/query`
- `/v1/soracloud/decrypt/request`

Йәмәғәт метамәғлүмәттәре сиктәре схемаларҙа асыҡтан-асыҡ: UAID бәйләнештәр, үтә күренмәгән идентификатор яҙмалары, манифест ғүмер циклы, торош асҡысы дайджестары, шифр тексты күләме, шифр текст йөкләмәләре, сәйәсәт исемдәре, параметрҙар йыйылмаһы версиялары, эш операциялары, сығарыу торошо асҡыстары һәм асыу үтенесе метамәғлүмәттәре күренеп тора ала. Идентификаторҙың ябай тексы, шифрланған торош, модель инеүҙәре һәм сығыуҙары, шулай уҡ FHE серле асҡыстары был асыҡ һорау яҙмаларынан ситтә ҡала.

## Операция контроле исемлеге {#operational-checklist}

- Torii узелында `/openapi.json` барлыҡҡа килгән хеҙмәт ғаиләләрен раҫлау һәм асыҡ урындағы SoraFS CID һәм билдәле маршруттарҙы туранан-тура тикшереү.
- Ауырыу Soracloud күсереү манифестаһы, SoraFS манифесттар, SoraDNS resolver каталогы яҙмалары, SoraNet эстафеталар исемлеге яҙмалары, һәм DA идара итеүгә һиҙгер артефакттар булараҡ маҡсат йәки йөкмәткелелек йөкләмәләре.
- Шул уҡ SORA Nexus профилен бер селтәрҙәге валидаторҙар араһында эҙмә-эҙлекле ҡулланығыҙ.
- Inrou тамыр һәм уртаҡ лизинг күләмен манифестаттарҙа һаҡларға, ә махсус узел-локаль юлдары нигеҙендә түгел.
- SoraFS иҫбатлау тикшереүе ҡулланыу йөкмәтке ҡушаматтар менән таныштырыу алдынан.
- Мониторинг SoraNet ҡул ҡысҡырыуҙа уңышһыҙлыҡтар, Sumeragi кәүҙә торошо һәм юғалған файҙалы йөк менән тәьмин итеү, SoraFS ҡапҡанан кире ҡағыуҙар, SoraDNS RAD яңылыҡ, һәм Soracloud һаулыҡ һаҡлау.
- Йәмәғәт тест селтәрен ҡулланыу өсөн Taira профилен ҡулланып, [ менән башларға SORA Nexus мәғлүмәттәр базаһына тоташтырыу](/ba/get-started/sora-nexus-dataspaces.md).

Шулай уҡ ҡарағыҙ:

- [Torii сикләү пункттары](/ba/reference/torii-endpoints.md)
- [Мәғлүмәт ваҡиғалары фильтрҙары](/ba/blockchain/filters.md#data-event-filters)
- [Һорау буйынса һылтанма](/ba/reference/queries.md#nexus-data-availability-and-packages)
- [Ҡанунлы Taira validator конфигурацияһы ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/configs/soranexus/taira/config.toml)
