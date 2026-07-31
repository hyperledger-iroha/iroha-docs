---
translation_locale: ba
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Деployment проблемаларын хәл итеү {#troubleshooting-deployment-issues}

Был бүлектә Iroha 3 урынлаштырыуҙар өсөн проблемаларҙы хәл итеү буйынса кәңәштәр бирелә. Әгәр һеҙ кисергән мәсьәлә бында һүрәтләнмәгән икән, беҙгә [Telegram](https://t.me/hyperledgeriroha) аша мөрәжәғәт итегеҙ.

## Булдырылған артефакттар менән башлағыҙ {#start-with-generated-artifacts}

Урындағы һәм һынау эштәрен башҡарыу өсөн Kagami тарафынан сығарылған артефакттарҙы ҡулдан яҙылған файлдар урынына өҫтөнлөк бирегеҙ:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Булдырылған каталогта тиңдәш конфигурациялары, генез материалы, старт скрипттары һәм README өсөн Iroha 3 төҙөлөш һыҙығы бар.

## Тиҫтерҙәр башланмай {#peer-does-not-start}

Тәүҙә был әйберҙәрҙе тикшерегеҙ:

- `irohad --config <path>` пункттары үҙ файлында TOML.
- `public_key` һәм `private_key` тиңдәш конфигурацияһында бер үк асҡыс парына ҡарай.
- `genesis.public_key` генез операцияһына ҡул ҡуйыу өсөн ҡулланылған асҡыс менән тап килә.
- validator peer identities use BLS-Normal keys, and `trusted_peers_pop` contains proof of ownership entries for the local key and trusted peers.
- Torii һәм P2P порттары башҡа процесс менән бәйле түгел.
- Kura магазиндар каталогы бер үк сылбырға ҡарай һәм башҡа селтәр профиленән күсерелмәгән.

TOML ҡатламынан күберәк уҡығанда конфигурация эҙләүҙе ҡулланыу:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker һәм Композиция {#docker-and-compose}

Генерациялау Хәҙерге Kagami локаль селтәр сығымынан яҙыу, шуға күрә команда һыҙығы аргументтары һәм конфигурация файлдар иҫкәртелгән кодҡа тап килә:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

Әгәр комплектты урынлаштырыу башлана һәм һуңынан туҡтап ҡалһа, демондар журналдарын тикшереп ҡарағыҙ:

- `chain`
- башҡа генез транзакцияһы йәки манифест ҡулланған бер тиңдәше
- P2P адрестары рекламалана, улар контейнерҙар селтәрендә генә эшләй
- урындағы күләмде регенерацияланған генездан һуң ҡабаттан ҡулланыу

Яңы генезисты тикшергәндә, стаканы яңынан башлар алдынан иҫке Kura томдарҙы алып ташларға кәрәк.

## Кубернеттар {#kubernetes}

Kubernetes өсөн, һәр validator дәүләт инфраструктураһы тип ҡарау:

- һәр бер яҡташтарына тотороҡло идентификация асҡысы һәм тотороҡһоҙ даими күләме биреү
- P2P адрестарын асыҡларға, уларҙы башҡа хеҙмәттәштәре кластер эсендә хәл итә ала.
- монтаж конфигурация һәм генез файлдар булараҡ үҙгәрешһеҙ конфигурацияһы өсөн развертывание
- Бөтә генез йәки топология үҙгәрештәрен автоматлаштырылған конфигурация картаһын яңыртыу рәүешендә түгел, ә аңлы рәүештә файҙаланырға

Әгәр модуль ҡат-ҡат яңынан эшләй башлаһа, модулдә күрһәтелгән конфигурацияны көтөлгән [`peer.template.toml`](/ba/reference/peer-config/index.md#template) менән сағыштырығыҙ һәм Peer иҫке Kura мәғлүмәтте ҡабатлаймы икәнлеген тикшерегеҙ.

## Сора профиле {#sora-profile}

Iroha 3, Nexus, SoraFS йәки күп юллы ағымдарҙы ҡулланған урынлаштырыуҙарҙа "Сора" профиле менән демоны ҡуҙғатырға кәрәк.

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

Бер үк селтәрҙәге валидаторҙар араһында бер үк профилде ҡулланыу.
