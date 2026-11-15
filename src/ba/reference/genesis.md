---
translation_locale: ba
translation_source: /reference/genesis.md
translation_source_hash: dda17468f39573a1fcf43474351bd01c4fea38e8b603fd4d8b21780b273c8649
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Башланмыш китабынан өҙөктәр {#genesis-reference}

Хәҙерге Iroha 3 эш ағымында, `genesis.json` манифеста беренсе транзакциялар һәм селтәр башланғанда ҡулланыласаҡ параметрҙар һүрәтләнә.

Яҡташтарына таратылған ҡул ҡуйылған артефакт Norito кодланған `.nrt` файлы булып тора, уны `kagami genesis sign` етештергән.

## Төп өлкәләр {#main-fields}

Генезис манифесты билдәләй ала:

- `chain` өсөн сылбыр идентификаторы
- `chain_discriminant` — манифесттағы иҫәп литералдарын кодлауҙа ҡулланылған I105 селтәр префиксы өсөн
- `executor` өсөн факультатив үтәүсе яңыртыу байтек коды юлы
- `ivm_dir` өсөн IVM китапханалары триггерҙар һәм яңыртыуҙар менән ҡулланыла
- `consensus_mode` манифеста иғлан ителгән тәүге режим өсөн
- `wire_protocol_version` — беренсе релиздағы консенсус хәбәрҙәрен тапшырыу протоколы версияһы өсөн
- `consensus_fingerprint` — консенсус параметрҙарының факультатив типлы контроль эҙе өсөн; JSON манифестары уны асыҡ күрһәтә
- `transactions` тәртиптәге параметрҙар яңыртыуҙары, инструкциялар, ҡуҙғатыуҙар һәм топология өсөн
- `sumeragi_context` — ҡул ҡуйылған Sumeragi бейеклек контексы параметрҙары өсөн
- `crypto_admission_policy` — сылбыр ҡабул иткән һәм `allowed_algorithms` исемлегендә күрһәтелгән теүәл ҡул ҡуйыу һәм контроллер алгоритмдары өсөн

`transactions` эсендә топологияға индереүҙәр бер-береһенә тиң идентификаторҙар һәм PoPs менән бергә:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Манифест яһағыҙ {#generate-a-manifest}

Шаблон булдырыу өсөн Kagami ҡулланығыҙ. Һәр ҡабул ителгән алгоритм өсөн `--allowed-signing`-ды каноник үҫеү тәртибендә ҡабатлағыҙ; Kagami төшөрөп ҡалдырылған алгоритмдарҙы өҫтәмәй:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --chain-id <CHAIN_ID> \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 \
  --allowed-signing bls_normal > genesis.json
```

Асыҡ SORA Nexus мәғлүмәт киңлеге өсөн көтөлгән консенсус режимы — `npos`. Башҡа Iroha 3 урынлаштырыуҙары маҡсатлы профилгә ҡарап рөхсәттәргә нигеҙләнгән режимды йә NPoS ҡуллана ала.

## Манифестҡа ҡул ҡуйығыҙ {#sign-the-manifest}

JSON-ны мөхәррирләгәндән һәм раҫлағандан һуң, уны ҡулланыла торған `.nrt` блогына яҙығыҙ:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt \
  --expected-hash-out genesis.expected_hash
```

`kagami genesis sign` урынлаштырыуға әҙер ҡул ҡуйылған блокты булдырыу өсөн генезис асҡыстар парын эйәһе тотҡан, бер генә һылтанмалы ғәҙәти файлдағы шәхси асҡыстан сығара. Уның баҫтырылған генезис асыҡ асҡысына тап килеүен талап итеү өсөн `--expected-public-key` бирегеҙ. Файлда бер каноник шәхси асҡыс мультихешы һәм уның артынан яңы юл билдәһе булырға тейеш; Kagami символик һылтанмаларҙы һәм `0600`-ҙән башҡа режимдарҙы кире ҡаға. Сей шәхси асҡыстар команда юлында ҡабул ителмәй. Һөҙөмтәлә алынған файлға тиңдәштәр үҙ конфигурацияларынан һылтанырға тейеш.

## `iroha3d` конфигурацияһы {#configure-iroha3d}

Демонға ҡул ҡуйылған genesis блогын һәм уның көтөлгән хэшын беркеткән файлды күрһәтегеҙ. `kagami genesis sign --expected-hash-out` ошо файлды яҙа, һәм төйөн уны тәүге эшләтеүҙә лә, яңынан эшләтеүҙә лә талап итә:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## Төрлө инструменттар {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

Генераторҙы ғәмәлгә ашырыу һәм команда мәғлүмәттәре өсөн [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md) ҡарағыҙ.
