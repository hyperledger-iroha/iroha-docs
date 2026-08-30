---
translation_locale: ba
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Сетьте урынлаштырыу өсөн асҡыстар {#keys-for-network-deployment}

Һәр селтәр өсөн клиенттар, тиңдәштәре, генез ҡултамғаһы һәм, NPoS йәки Nexus профилдәре өсөн, BLS раҫлаусы идентификаторҙар өсөн айырым төп материалдар кәрәк.

## Ҡайҙа асҡыстар ҡулланыла {#where-keys-are-used}

- Клиенттың ҡултамғалау асҡыстары `client.toml` аҫтында `[account]` һаҡлана.
- Тиҫтерҙәр менән танышыу өсөн асҡыстар һәр тиҫтерҙә һаҡлана `config.toml` тип `public_key` һәм `private_key`.
- Peer Discovery `trusted_peers`-ла һәр бер peer-тың асыҡ асҡысын ҡуллана.
- BLS раҫлаусы НПОС профилдәре өсөн милек иҫәбе `trusted_peers_pop` ҡатында һаҡланған.
- Яратылыш ҡултамғаһы манифестҡа ҡул ҡуйғанда `[genesis].public_key` тигеҙ конфигурацияһында һәм тейешле шәхси асҡыс менән ҡулланыла.

Урындағы йәки һынау урынлаштырыу өсөн, Kagami был файлдарҙың бөтәһен дә бергә барлыҡҡа килтерергә тейеш:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Булған селтәр йәки профиль өсөн, етәкселек итеүсе ағымды ҡулланығыҙ:

```bash
cargo run --bin kagami -- wizard
```

## Бәхетле асҡыс парҙарын булдырыу {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## Тиҫтерҙәр араһындағы берҙәмлек {#peer-consistency}

Барлыҡ валидаторҙар бер үк генез транзакцияһы, топологияһы, ышаныслы йәмәғәт асҡыстары һәм валидаторы PoPs тураһында килешергә тейеш. Берҙән-бер юғалған йәки тап килмәгән тиҫтер асҡысы селтәрҙең башланғанын йә консенсусҡа өлгәшеүен ҡамасаулай ала.

Минималь Византия хатаһын түҙемлек менән файҙаланыу өсөн, кәм тигәндә дүрт тиңдәш ҡулланығыҙ. Һәр тиңдәштең үҙ шәхси асҡысы булырға тейеш.

## Клиенттар иҫәбтәре {#client-accounts}

`client.toml` клиент иҫәбенең инде сылбырҙа булыуы мотлаҡ. Ул генез манифестаһы йәки һуңыраҡ транзакция менән теркәлергә мөмкин. Генез ҡултамғалау идентификацияһын оҙаҡҡа һуҙылған ғариза иҫәбенә ҡулланыуҙан һаҡлан; генезис өҫтөнлөктәр бары тик генезис раунды ваҡытында ғына ҡулланыла, һәм производство клиенттары үҙ иҫәптәрен һәм ролдәрен файҙаланырға тейеш.
