---
translation_locale: ba
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Башланмыш китабынан өҙөктәр {#genesis-reference}

Хәҙерге Iroha 3 эш ағымында, `genesis.json` манифеста беренсе транзакциялар һәм селтәр башланғанда ҡулланыласаҡ параметрҙар һүрәтләнә.

Яҡташтарына таратылған ҡул ҡуйылған артефакт Norito кодланған `.nrt` файлы булып тора, уны `kagami genesis sign` етештергән.

## Төп өлкәләр {#main-fields}

Генезис манифесты билдәләй ала:

- `chain` өсөн сылбыр идентификаторы
- `executor` өсөн факультатив үтәүсе яңыртыу байтек коды юлы
- `ivm_dir` өсөн IVM китапханалары триггерҙар һәм яңыртыуҙар менән ҡулланыла
- `consensus_mode` манифеста иғлан ителгән тәүге режим өсөн
- `transactions` тәртиптәге параметрҙар яңыртыуҙары, инструкциялар, ҡуҙғатыуҙар һәм топология өсөн
- `crypto` тәүге crypto snapshot өсөн

`transactions` эсендә топологияға индереүҙәр бер-береһенә тиң идентификаторҙар һәм PoPs менән бергә:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Манифест яһағыҙ {#generate-a-manifest}

Шаблон булдырыу өсөн Kagami ҡулланығыҙ:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Йәмәғәт SORA Nexus мәғлүмәт киңлеге өсөн, `npos` - күҙалланған консенсус режимы. башҡа Iroha 3 урынлаштырыуҙар маҡсатлы профилгә ҡарап рөхсәт ителгән йәки NPoS ҡулланырға мөмкин.

## Манифестҡа ҡул ҡуйығыҙ {#sign-the-manifest}

JSON-ны мөхәррирләгәндән һәм раҫлағандан һуң, уны ҡулланыла торған `.nrt` блогына яҙығыҙ:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` манифесттан генезис асыҡ асҡысын уҡый һәм ҡулланыу мөмкин булған ҡул ҡуйылған блокты булдырыу өсөн хужаһы ҡараған, бер сылтамалы даими файлдың шәхси асҡысын ҡуллана. Файлда бер каноник шәхси асҡыслы мультихаш булырға тейеш, уның артынан яңы линия килә; Kagami символик бәйләнештәрҙе һәм `0600` булмаған режимдарҙы кире ҡаға. Сей шәхси асҡыстар команда юлында ҡабул ителмәй. Һөҙөмтәлә алынған файлға пирҙар үҙ конфигурацияларынан һылтанырға тейеш.

## `iroha3d` конфигурацияһы {#configure-iroha3d}

Демонды ҡул ҡуйылған генез блогына йүнәлтегеҙ:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Төрлө инструменттар {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Генераторҙы ғәмәлгә ашырыу һәм команда мәғлүмәттәре өсөн [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md) ҡарағыҙ.
