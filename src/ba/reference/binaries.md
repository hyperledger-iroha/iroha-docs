---
translation_locale: ba
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# менән эшләү. Iroha Бинарлыҡ {#working-with-iroha-binaries}

был Iroha 3 оператор эш ағымы өс төп бинар тирәләй әйләнә:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) тиңдәш демонды эшләтеү өсөн
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) өсөн CLI һәм оператор командалары
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) асҡыстар, генезис, локаль селтәрҙәр һәм профилдәр өсөн

## Сығанаҡтан төҙөү {#build-from-source}

Өҫкө ағымдағы эш майҙаны тамырынан:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Һуңынан релиз бинарҙары 2018 йылда була. `target/release/`.

Команда өҫтөн тикшерергә:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Һаҡлағыстан туранан-тура эшләү {#run-directly-from-the-repository}

Әгәр һеҙ теләмәйһегеҙ, бер нәмә лә ҡуйырға глобаль, ҡулланыу . `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Һүрәт {#docker-image}

Өҫкө ағымдағы эш майҙаны ҡуллана `kagami localnet` һәм `kagami docker` генерациялау
Docker Compose файлдар, улар тура килә тикшерелгән-код.был `hyperledger/iroha:dev`
һүрәтен шул генерацияланған файлдар менән ҡулланырға мөмкин.

Йүгертеү CLI һауытта:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Йүгерергә Kagami һауытта:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Тиңдәштәр өсөн стартап, генерациялау локаль селтәре һәм Compose файлы тәүҙә:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Ниндәй бинар ҡулланырға кәрәк? {#which-binary-should-i-use}

- Файҙаланыу `irohad` ҡасан һеҙ башлай йәки операция тиҫтерҙәре.
- Файҙаланыу `iroha` ҡасан һеҙгә кәрәк, тип эҙләү баш китабы, транзакциялар тапшырыу, йәки оператор ос нөктәләрен тикшерергә.
- Файҙаланыу `kagami` ҡасан һеҙгә асҡыстар кәрәк, генезис манифесттары, профиль пакеттары, йәки localnet активтары.

## Кагемуша баҫма һәм таратыу сығарыу {#kagemusha-release-publication-and-rollout}

Кагемуша V4 баҫтырып сығарыу һәм әүҙемләштереү айырым һаҡланған сиктәрҙе үтә:

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` был
  macOS-тик, root-тик нәшерсе.Ул аутентификациялай прикрепленный Kagami бинар һәм
  теүәл ун алты файл кандидат, юҡ баҫтырып сығара
  `promotion-record-v4.norito` алмаштырыуһыҙ, һәм уңыш тураһында ғына хәбәр итә
  һуң теүәл ун ете-файл пропагандаланған релиз раҫлай.
- `iroha offline kagemusha rollout-v4 create-expectations` ҡул ҡуйылғанды ​​раҫлай
  бронирование, дүрт заказ валидатор квалификация мөһөрҙәре, теүәл
  инде-рөхсәт ителгән транзакция сым, һәм ышаныслы финаллаштырылған якорь алдынан
  ҡул ҡуйылған өмөттәрҙе алмаштырмайынса баҫтырып сығарыу.
- `iroha offline kagemusha rollout-v4 submit` асыҡтан-асыҡ талап итә
  `--write-authorized` ризалыҡ.Ул ныҡлы журналдар һәм яңынан тикшерә теүәл
  селтәр яҙыу йәки ҡабаттан тырышыу алдынан көтөүҙәр.Ан `Applied` статусы юҡ
  етерлек: команда шулай уҡ тикшерә үтәлгән блок, финал вариҫы
  сылбыр, һәм тулы рөхсәт-несущий транзакция сым.
- `iroha offline kagemusha rollout-v4 finalize-receipt` шул уҡ иҫбатлау менән
  нығытылған дәлилдәрҙе теүәл ебәреү журналы ҡабаттан тикшерелгәндән һуң ғына йыя,
  уларға бойондороҡһоҙ квитанция сығарыусы менән ҡул ҡуя һәм канон квитанцияһын
  алмаштырмайынса баҫтырып сығара.

Тикшерелгән-Кагемуша етештереү-әҙерлек эш ағымы тикшерелгән-тик.
Ул аутентификацияланған нәшерсе тип атамай, баҫтырып сығарыу валидатор квалификацияһы .
мөһөрҙәр, активация тапшырырға, йәки финаль квитанция булдырыу.Уңышлы эш ағымы
йүгерергә, шуға күрә иҫбатлай, ни промоушен, ни йәшәй ролл-аут.

Был командалар урындағы примитивтар, тере дәлилдәрҙе алмаштырыусы түгел.А
етештереү ролл-аут ысын физик App Attest һәм блокировкаһыҙ ҡала.
кандидат артефакттар, бөтә дүрт һаҡланған хост мөһөрҙәре, йөрөү ваҡытында идара итеү һәм
ҡул ҡуйыу индереүҙәр, йәшәй дүрт-валидатор тапшырыу һәм финал дәлилдәр, һәм
канон эффектив-конфигурация проекцияһы.Шәхси асҡыстар һаҡлағыҙ,
аутентификация материалы, һәм промоушен-конкрет идентификаторҙар һаҡланған
эшләү ваҡытында һаҡлау;уларҙы сығанаҡ менән контролдә тотолған документацияға күсермәгеҙ йәки
оператор билеттары.
