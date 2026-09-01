---
translation_locale: hy
translation_source: /reference/binaries.md
translation_source_hash: 3d1cddb466092770376bcb150963d5df29a6ebc5cf6e670baa3a5c277082fdab
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha բինարների հետ աշխատելը {#working-with-iroha-binaries}

Iroha 3 օպերատորի աշխատանքային հոսքը պտտվում է չորս հիմնական բինարների շուրջ.

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) հանգույցային դեյմոնի գործարկման համար
- `iroha3d_taira` քանոնիկ Taira վավերացնող արձակիչի համար
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli)՝ CLI եւ օպերատորի հրամանների համար
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) բանալիների, գենեզիզի, տեղական ցանցերի եւ պրոֆիլների համար:

## Կառուցեք աղբյուրից {#build-from-source}

Upstream աշխատատեղի արմատից.

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Դրանից հետո բինարների թողարկումը հասանելի է `target/release/`.

Հրամանատարի մակերեսը ստուգելու համար.

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## Գործարկել ուղղակիորեն պահեստից {#run-directly-from-the-repository}

Եթե դուք չեք ցանկանում տեղադրել որեւէ բան գլոբալ մակարդակով, օգտագործեք `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
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
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## Ո՞ր երկկողմը պետք է օգտագործեմ: {#which-binary-should-i-use}

- Օգտագործեք `iroha3d`, երբ սկսում եք գործարկել կամ գործում եք հանգույցները հանրային Taira վավերացողի թողարկմանից դուրս:
- Օգտագործեք `iroha3d_taira --sora` միայն քանոնիկ Taira հավաստիացնողի տեղակայման համար: Այն պարտադրում է Taira շղթայի, պահեստավորման եւ վազքի ժամանակի ստորագրող պրոֆիլը.
- Օգտագործեք `iroha` այն ժամանակ, երբ պետք է կատարեք հարցում գլխավոր գրասենյակը, ներկայացնեք գործարքներ կամ ստուգեք օպերատորի վերջային կետերը:
- Օգտագործեք `kagami` այն ժամանակ, երբ ձեզ անհրաժեշտ է բանալիներ, գենեզիզային մանիֆեսներ, պրոֆիլների փաթեթներ կամ տեղական ցանցի ակտիվներ:
