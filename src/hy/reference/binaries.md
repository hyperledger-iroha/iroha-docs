---
translation_locale: hy
translation_source: /reference/binaries.md
translation_source_hash: 1bf3f4697e44b3c8ef571eb9e5c0e301a1acbf76aa1c0666b3cd86e108bba6bf
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

Docker-ում նույն վերանայման գործարկվող ֆայլերով չորս վավերացնող հանգույց կառուցելու և գործարկելու համար հետևեք [Լանչում Iroha 3](/hy/get-started/launch-iroha.md) ուղեցույցին։

## Ո՞ր երկկողմը պետք է օգտագործեմ: {#which-binary-should-i-use}

- Օգտագործեք `iroha3d`, երբ սկսում եք գործարկել կամ գործում եք հանգույցները հանրային Taira վավերացողի թողարկմանից դուրս:
- Օգտագործեք `iroha3d_taira --sora` միայն քանոնիկ Taira հավաստիացնողի տեղակայման համար: Այն պարտադրում է Taira շղթայի, պահեստավորման եւ վազքի ժամանակի ստորագրող պրոֆիլը.
- Օգտագործեք `iroha` այն ժամանակ, երբ պետք է կատարեք հարցում գլխավոր գրասենյակը, ներկայացնեք գործարքներ կամ ստուգեք օպերատորի վերջային կետերը:
- Օգտագործեք `kagami` այն ժամանակ, երբ ձեզ անհրաժեշտ է բանալիներ, գենեզիզային մանիֆեսներ, պրոֆիլների փաթեթներ կամ տեղական ցանցի ակտիվներ:
