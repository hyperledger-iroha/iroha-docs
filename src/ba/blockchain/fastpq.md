---
translation_locale: ba
translation_source: /blockchain/fastpq.md
translation_source_hash: 8f0684c96205d4cbc6a4f913ac57a7ff1aa6fec944e28d70def2663a56fb2ab7
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# FastPQ {#fastpq}

FastPQ булып тора Iroha Ул - STARK һайлап алынған үтәү эффекттары өсөн иҫбатлау юлы. Ул ғәҙәти транзакция үтәлеше йәки консенсус алмаштыра алмай. Транзакциялар һаман да үтә ISI, IVM, һәм Sumeragi ғәҙәттәгесә; FastPQ детерминистик үтәү шаһиты ҡулланыу һәм тәьмин ителгән эффекттар иҫбатлау партияларына әйләндереү.

Хәҙерге хост интеграцияһында ике төп юл бар:

- Блоктарҙы үтәү ваҡытында теркәлгән һанлы активтар күсерелеүе
- `fastpq_binding` ҡиммәте FastPQ бәйләнешен йөрөткән SORA Nexus AXT иҫбат ҡапламалары

## Шаһиттарҙы күсергә {#transfer-witness-path}

Прозрачные числовые переводы создают структурированный транскрипт передачи, когда инструкция мутирует балансы.

- сығанаҡ иҫәбе, маҡсат иҫәбенә, актив билдәләмәһе һәм сумма
- ебәреүсе менән ҡабул итеүсенең балансы тапшырыу алдынан һәм унан һуң
- транзакцияға инеү нөктәһе хэшиғы партияһы хэшигы булараҡ ҡулланыла
- тапшырыу иҫәбенән алынған хоҡуҡ сығанағы
- бер дельталы транскрипттар өсөн Poseidon дигесты

Партия күсереүҙәрендә бер транскрипт һәм күп кенә дельталар ҡулланыла. Ундай осраҡта бер дельталы Посейдон дайджесты юҡ.

Блокты тамамлағанда, Iroha был транскрипттарҙы инеү нөктәһе хэш буйынса төркөмләй. Эксплуатация шаһиты артабан төп транскрипт тупланмаларын һәм провер өсөн әҙерләнгән FastPQ күсеү партияларын алып бара.

Һәр күсереү дельтаһы ике күсеү рәтенә әүерелә:

|Ҡалып |Төп формаһы |Предварительная стоимость |Артабанғы баһа |
| --------------- | ------------------------------------------------ | ----------------------- | ---------------------- |
| Ебәреүсенән сығым | `asset/<asset-definition>/<source-account>` | үҙгәрешкә тиклем ебәреүсенең балансы | үҙгәрештән һуң ебәреүсенең балансы |
| Ҡабул итеүсе иҫәбенә инеү | `asset/<asset-definition>/<destination-account>` | үҙгәрешкә тиклем ҡабул итеүсенең балансы | үҙгәрештән һуң ҡабул итеүсенең балансы |

Санлы ҡиммәттәр тулы һанлы шаһиттар берәмектәренә нормализациялана. Һайланма өсөн FastPQ ҡиммәт кире ҡағыла, әгәр ул һайланған декамал үлсәмдә кире булмаған `u64` тип күрһәтелмәй икән.

## Йәмәғәт иғәнәләре {#public-inputs}

Һәр FastPQ күсеү партияһы иҫбатлауҙы блок һәм башҡарыу контексына бәйләүсе йәмәғәт инештәрен йөрөтә:

|Ҡалыптар |Мәғәнәһе |
| ------------- | --------------------------------------------------------------- |
| `dsid`        | Бәләкәй разрядтары тәүҙә килгән байттар итеп кодланған мәғлүмәт киңлеге идентификаторы             |
|`slot` |Блоктарҙы төҙөү ваҡыты наносекундтарға үҙгәртелә |
| `old_root` | Үтәлеш шаһитынан алынған алдағы хәлдең тамыр хешы |
|`new_root` |Башҡарыу шаһитынан сығарылған башҡарыуҙан һуңғы торош тамыры |
|`perm_root` |Посейдондың актив роль өсөн рөхсәт биреүенә бәйле йөкләмәһе |
|`tx_set_hash` |Һәҙерләнгән транзакция һәм ваҡыт-тикшереү инеү нөктәһе хештары өҫтөндә хеш |

Хост был партиялар өсөн беренсе релизда берҙән-бер булған `fastpq-state-transition-stark-v1` параметрҙар йыйылмаһын ҡуллана.

## Иҫбатлау протоколы {#proof-protocol}

Каноник күсереү артефакттары — Goldilocks ҡыры өҫтөндә 4-се дәрәжәле киңәйтеү менән төҙөлгән маскаланған DEEP иҫбатлауҙары. Уларҙың теүәл мөнәсәбәте, транскрибы һәм һорау геометрияһы билдәләнгән версиялағы [FastPQ DEEP протокол контракты](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/fastpq_deep_protocol_contract.md) документында билдәләнгән.

## Ғәйбәтселәр нимә тикшерә {#what-the-prover-checks}

Эҙҙе төҙөү алдынан FastPQ prover пакет тәртибен күсеү асҡысы, операция рангы һәм өҫтәү тәртибе буйынса канонлаштыра. Күсеү юлдары өсөн transcript metadata ла талап ителә. Күсеү юлдары булған, әммә күсеү transcript-тары булмаған пакет яраҡһыҙ.

Трансфер транскрипттары өсөн, провер-бәйләнештәге тикшереүҙәр түбәндәгеләрҙе үҙ эсенә ала:

- ебәреүсенең балансы нулдән түбән төшмәҫкә, йәғни underflow булмаҫҡа тейеш
- `sender_after` менән тигеҙ булырға тейеш `sender_before - amount`
- `receiver_after` менән тигеҙ булырға тейеш `receiver_before + amount`
- транскрипт партиялағы һәр күсереү рәтенә ҡағылырға тейеш
- бер дельталы Посейдон дайджест, әгәр бар булһа, транскрипт преобразы менән тап килергә тейеш.
- Бер аҙ-Меркл иҫбатлауҙар версия 1 тип декодланырға тейеш; юғалған юлдары детерминистик синтетик иҫбатламалар менән тултырыла

Трейсҡа күсереү, минтлау, яндырыу, роль биреү, ролде юҡҡа сығарыу, метамәғлүмәттәр йыйылмаһы һәм рөхсәт эҙләү рәттәре өсөн һайлап алыу бағаналары инә. Официальный сайт Санлы операциялар рәттәре шулай уҡ ҡул ҡуйылған дельталар, актив буйынса дельталар һәм тәьмин итеү счетсылары алып бара.

## Проверка Лейн {#prover-lane}

`iroha3d` башланғыс ваҡытта FastPQ провер лентаһын башлай, әгәр провер бэкэндаһы инициациялана алһа. Лен - сикләнгән сиратлы фон эше. Блок башҡарғандан һуң бойондороҡлау юлы провер эшен тапшыра, унда блок хэш, бейеклек, ҡарау һәм шаһит бар.

Юл эшләмәһә йәки сират тулһа, был эш төшөрөлөп ҡалдырыла, ә блоктар ғәҙәти тәртиптә эшкәртелә. Фонда иҫбат төҙөү юлы транзакцияны ҡабул итеү йәки консенсус өсөн шарт булып тормай. Ул инде үтәлгән операциялар һөҙөмтәһендә алынған хәл өсөн иҫбат төҙөй.

Юл проверкаһын төҙөй:

```text
parameter = "fastpq-state-transition-stark-v1"
execution_mode = cpu | gpu
poseidon_mode = cpu | gpu
```

Ике көйләүҙең дә ғәҙәти ҡиммәте — `cpu`. `gpu` һайлау асыҡтан-асыҡ, хатала ябыҡ ҡала торған талап булып тора: GPU ярҙамы компиляцияланмаһа йәки һоралған GPU бэкенды алданғы тикшереүҙе үтмәһә, иҫбатлау һыҙаты һүндерелгән килеш ҡала. Беренсе сығарылышта `auto` ҡиммәте юҡ һәм һоралған GPU режимынан CPU-ға автоматик күсеү башҡарылмай.

## Тикшереү {#verification}

FastPQ иҫбатлау верификацияһы каноник партия йөкләмәһен ҡайтанан төҙөй һәм асыҡ транскриптты ҡабатлай. Verifier протокол версияһын, параметрҙар ҡуйылған версияны, ҡабаттан уйнатыу сикләүҙәрен, эҙләнеү йөкләмәләрен, йәмәғәт инештәрен, өлгөләтелгән Merkle киңлектәрен, AIR киңлектәрен һәм FRI һорауҙар сылбырын тикшерә.

Үҙенсәлекле ҡабаттан уйнатыу сиктәре:

|Сикләү |Дефолт |
| ------------------ | ------: |
|Переход рәттәре |     256 |
|Партияның файҙалы йөк күләме |256 KiB |
|FRI ҡатламдар |      16 |
|Һорауҙар |     128 |

## SORA Nexus AXT иҫбат ҡапламалары {#sora-nexus-axt-proof-envelopes}

SORA Nexus AXT иҫбат ҡапламалары `AxtFastpqBinding`-ты үҙ эсенә ала ала. AXT ҡапламаларын блок кимәлендә тикшереү, IVM хостының AXT ҡапламаһы тикшереүҙәре һәм `RegisterVerifiedFeeSponsorVaultAllocation` ҡапламаның `fastpq_binding` ҡиммәтен талап итә, уны көтөлгән раҫлау менән сағыштыра һәм ҡаплама менән уның эсендәге иҫбатлау өсөн FastPQ тикшереүсеһен саҡыра. Бәйләнеш булмаһа йәки тикшереү уңышһыҙ тамамланһа, операция кире ҡағыла.

### AXT Математика бәйләүсе {#axt-binding-math}

SORA Nexus AXT ҡапламалары өсөн `AxtFastpqBinding` иҫбатты ҡабаттан башҡарыу алдынан каноник формаға килтерелә. Буш `parameter`, `verifier_id` йәки `verifier_version` ҡиммәттәре кире ҡағыла; тикшереүсе идентификаторы `fastpq`, ә версияһы `v1` булырға тейеш, һәм хеҙмәтләндерелгән AXT ағымдары `fastpq-state-transition-stark-v1` ҡуллана. Раҫлау төрөнөң ситке бушлыҡтары алына һәм хәрефтәре бәләкәйгә күсерелә.

AXT FastPQ асыҡ инеүҙәр - детерминистик байт хэштәре:

$$
\operatorname{dsid}=\operatorname{dsid\_bytes}(\operatorname{source\_dsid})
$$

$$
\operatorname{slot}=\operatorname{le64}(\operatorname{source\_tx\_commitment}[0..8])
$$

$$
\operatorname{old\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:old\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{policy\_commitment}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{new\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:new\_root}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{effect\_type}
)
$$

$$
\operatorname{perm\_root} =
\operatorname{Hash}(
\texttt{fastpq-json:perm\_root}\|
\operatorname{policy\_commitment}\|
\operatorname{verifier\_id}\|
\operatorname{verifier\_version}
)
$$

$$
\operatorname{tx\_set\_hash} =
\operatorname{Hash}(
\texttt{fastpq-json:tx\_set\_hash}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}\|
\operatorname{witness\_commitment}
)
$$

AXT күсеү асҡыстары:

$$
\operatorname{key}(\operatorname{prefix},x,y)=
\operatorname{prefix}\|\texttt{/}\|x\|\texttt{/}\|y
$$

`authorization` заявкаһында "Ролль бирелгән рөхсәт" рәтенә индерелгән:

$$
\operatorname{role\_id}=\operatorname{claim\_digest}
$$

$$
\operatorname{permission\_id}=\operatorname{witness\_commitment}
$$

$$
\operatorname{epoch}=
\operatorname{le64}(\operatorname{policy\_commitment}[0..8])
$$

һәм рөхсәт сәйәсәтен бәйләгән метамәғлүмәт юлы. `compliance` раҫлауы ике метамәғлүмәт юлын өҫтәй: береһе — сәйәсәт өсөн, икенсеһе — маҡсатлы мәғлүмәт киңлектәре өсөн.

`tx_predicate` һәм `value_conservation` өсөн, бәйләнеш ыңғай сығанаҡ йәки маҡсатлы күләмгә эйә булған осраҡта, асыҡ эффект күләме ҡулланыла. Юғиһә код сикләнгән детерминистик күләмде ала.

$$
\operatorname{bounded}(d,\min,\operatorname{span})
=
\min + (\operatorname{le64}(d[0..8])\bmod\max(\operatorname{span},1))
$$

Унан һуң бер үк күсереү тигеҙләмәләре ҡулланыла:

$$
\operatorname{sender\_after}=\operatorname{sender\_before}-a
$$

$$
\operatorname{receiver\_after}=\operatorname{receiver\_before}+a
$$

Синтетик ебәреүсе һәм ҡабул итеүсе иҫәбенең идентификаторҙары төп орлоҡтарҙан барлыҡҡа килә:

$$
\operatorname{seed}=
\operatorname{Hash}(\operatorname{label}\|\operatorname{entropy})[0..32]
$$

Трансфер партияһы хэшиғы:

$$
\operatorname{batch\_hash} =
\operatorname{Hash}(
\operatorname{label}\|
\operatorname{corridor}\|
\operatorname{source\_tx\_commitment}\|
\operatorname{claim\_digest}
)
$$

AXT партияһы манифестаты SHA-256 каноник бәйләнештең Norito кодировкаһы өҫтөндә:

$$
\operatorname{manifest\_digest} =
\operatorname{SHA256}(E(\operatorname{canonical\_binding}))
$$

## Параметрҙар йыйылмаһы {#parameter-sets}

Беренсе релизда теүәл бер каноник параметрҙар йыйылмаһы бар — `fastpq-state-transition-stark-v1`. Ул 4-се дәрәжәле киңәйтеүле (`X^4 - 7`) Goldilocks ҡыры өҫтөндә 128 битлыҡ хәүефһеҙлеккә йүнәлтелгән һәм түбәндәгеләрҙе ҡуллана: трасса ҙурлығы `2^16`, LDE ҙурлығы `2^19`, FRI тармаҡланыу дәрәжәһе 2, киңәйтеү коэффициенты 8, иң күбе 17 редукция һәм 136 һорау.

## Конфигурация {#configuration}

FastPQ конфигурацияһы `zk.fastpq` аҫтында ҡуйылған.

```toml
[zk.fastpq]
execution_mode = "cpu"
poseidon_mode = "cpu"

# Optional telemetry labels.
device_class = "apple-m4"
chip_family = "m4"
gpu_kind = "integrated"

# Optional Metal backend tuning.
metal_queue_fanout = 3
metal_queue_column_threshold = 24
metal_max_in_flight = 5
metal_threadgroup_width = 128
metal_trace = false
metal_debug_enum = false
```

Шул уҡ үтәү һәм телеметрия этикеттарын `iroha3d` аша кире ҡағырға мөмкин:

```shell
iroha3d --fastpq-execution-mode gpu
iroha3d --fastpq-poseidon-mode cpu
iroha3d --fastpq-device-class apple-m4
iroha3d --fastpq-chip-family m4
iroha3d --fastpq-gpu-kind integrated
```

Конфигурация майҙансыҡтары өсөн тирә-яҡ мөхит үҙгәреүсәндәре лә ярҙам ителә. FastPQ‐ҡа ярашлы үҙгәреүсәндәр:

- `FASTPQ_EXECUTION_MODE`
- `FASTPQ_POSEIDON_MODE`
- `FASTPQ_DEVICE_CLASS`
- `FASTPQ_CHIP_FAMILY`
- `FASTPQ_GPU_KIND`
- `FASTPQ_METAL_QUEUE_FANOUT`
- `FASTPQ_METAL_COLUMN_THRESHOLD`
- `FASTPQ_METAL_MAX_IN_FLIGHT`
- `FASTPQ_METAL_THREADGROUP`
- `FASTPQ_METAL_TRACE`
- `FASTPQ_DEBUG_METAL_ENUM`

## Статистика {#metrics}

Телеметрия булдырылған саҡта, FastPQ Backend һайлап алыу өсөн метрикалар экспорты һәм Металл йүгереү тәртибе:

|Метрик |Мәғәнәһе |
| --------------------------------- | --------------------------------------------------------------------------- |
|`fastpq_execution_mode_total` |Заказ ителгән һәм хәл ителгән башҡарыу режимы арттағы һәм ҡулайлама этикеткалары буйынса |
|`fastpq_poseidon_pipeline_total` |Посейдон pipeline юлы буйынса һоралған һәм хәл ителгән |
|`fastpq_metal_queue_depth` |Metal сираты сиге, бер үк ваҡытта башҡарылған операцияларҙың максималь һаны, ебәреүҙәр һаны һәм өлгө алыу тәҙрәһе|
|`fastpq_metal_queue_ratio` |Металл сираттағы мәшғүллек һәм ҡапма-ҡаршылыҡ нисбәттәре |
|`fastpq_zero_fill_duration_ms` |Металл йүгереүҙәр өсөн тулыландырыу ваҡыты |
|`fastpq_zero_fill_bandwidth_gbps` |Асылған нуль тултырыу диапазоны |

Дөйөм күрһәткестәргә ҡарап, уларҙы [ Эшмәкәрлек һәм үлсәүҙәр](/ba/guide/advanced/metrics.md) бүлегендә күрһәтелгән консенсус һәм сират сигналдары менән ҡулланығыҙ.

## Үзара бәйләнешле һылтанма {#related-reference}

- Node-authoritative type snapshot өсөн [Мәғлүмәт моделе схемаһы](/ba/reference/data-model-schema.md)
- `FastpqTransitionBatch`
- `FastpqPublicInputs`
- `TransferTranscript`
- `AxtFastpqBinding`
- [`iroha3d` FastPQ варианттары](/ba/reference/iroha3d-cli.md#fastpq-overrides)
