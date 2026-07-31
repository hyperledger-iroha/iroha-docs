---
translation_locale: ba
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Башланмыш китабынан өҙөктәр {#genesis-reference}

Хәҙерге Iroha 3 эш ағымында, `genesis.json` манифеста беренсе транзакциялар һәм селтәр башланғанда ҡулланыласаҡ параметрҙар һүрәтләнә.

Яҡташтарына таратылған ҡул ҡуйылған артефакт Norito кодланған `.nrt` файлы булып тора, уны `kagami genesis sign` етештергән.

## Төп өлкәләр {#main-fields}

Генезис манифесты билдәләй ала:

- `chain` өсөн сылбыр идентификаторы
- `executor` өсөн факультатив үтәүсе яңыртыу байткод юлы
- `ivm_dir` өсөн IVM китапханалары триггерҙар һәм яңыртыуҙар менән ҡулланыла
- `consensus_mode` манифеста иғлан ителгән тәүге режим өсөн
- `transactions` тәртиптәге параметрҙар яңыртыуҙары, инструкциялар, ҡуҙғатыуҙар һәм топология өсөн
- `crypto` тәүге крипто фотоһүрәт өсөн

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
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` манифесттан генезис асыҡ асҡысын уҡый һәм ебәрелгән шәхси асҡысты, орлоҡто һәм алгоритмды ҡулланып ҡуйылтылырға мөмкин булған ҡул ҡуйылған блок сығара.

## `irohad` конфигурацияһы {#configure-irohad}

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

Генераторҙы ғәмәлгә ашырыу һәм команда мәғлүмәттәре өсөн [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md) ҡарағыҙ.
