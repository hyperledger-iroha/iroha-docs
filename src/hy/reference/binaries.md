---
translation_locale: hy
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha բինարների հետ աշխատելը {#working-with-iroha-binaries}

Iroha 3 օպերատորի աշխատանքային հոսքը պտտվում է երեք հիմնական բինարների շուրջ.

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) զուգընկերային դեյմոնի գործարկման համար
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli)՝ CLI եւ օպերատորի հրամանների համար
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) բանալիների, գենեզիզի, տեղական ցանցերի եւ պրոֆիլների համար:

## Կառուցեք աղբյուրից {#build-from-source}

Upstream աշխատատեղի արմատից.

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Դրանից հետո բինարների թողարկումը հասանելի է `target/release/`.

Հրամանատարի մակերեսը ստուգելու համար.

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Գործարկել ուղղակիորեն պահեստից {#run-directly-from-the-repository}

Եթե դուք չեք ցանկանում տեղադրել որեւէ բան գլոբալ մակարդակով, օգտագործեք `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Պատկերը {#docker-image}

Upstream աշխատանքային տարածքը օգտագործում է `kagami localnet` եւ `kagami docker` ՝ ստեղծելու համար Docker Compose ֆայլեր, որոնք համապատասխանում են ստուգված կոդին: `hyperledger/iroha:dev` պատկերը կարող է օգտագործվել այդ ստեղծված ֆայլերի հետ:

Գործարկեք CLI կոնտեյներում.

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Գործարկել Kagami կոնտեյներում.

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Համանախագահների մեկնարկի համար առաջադրեք localnet եւ նախ կազմեք ֆայլը.

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## Ո՞ր երկկողմը պետք է օգտագործեմ: {#which-binary-should-i-use}

- Օգտագործեք `irohad`, երբ սկսում եք գործել զուգընկերների հետ:
- Օգտագործեք `iroha` այն ժամանակ, երբ պետք է հարցաքննեք գլխավոր գրասենյակը, ներկայացնեք գործարքներ կամ ստուգեք օպերատորի վերջային կետերը:
- Օգտագործեք `kagami` այն ժամանակ, երբ ձեզ անհրաժեշտ է բանալիներ, գենեզիզային մանիֆեսներ, պրոֆիլների փաթեթներ կամ տեղական ցանցի ակտիվներ:
