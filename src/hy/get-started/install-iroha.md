---
translation_locale: hy
translation_source: /get-started/install-iroha.md
translation_source_hash: 613e81510c9de1bf341e545521fc27fa6a5e145ea3bbaab41664e95199ffbf35
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# տեղադրել Iroha 3 {#install-iroha-3}

Այս էջը ներառում է Iroha 3 գործիքների շղթայի եւ բինարների ներկա տեղադրման աշխատանքային հոսքը ՝ օգտագործելով վերեւում գտնվող `hyperledger-iroha/iroha` աշխատատեղը:

## 1. Նախապայմաններ {#_1-prerequisites}

Նախ տեղադրեք հետեւյալը.

- [rustup](https://www.rust-lang.org/tools/install), այնպես որ փակված `rust-toolchain.toml` գործիքային շղթան (`1.93.1`) տեղադրվում է ավտոմատ կերպով:
- `git`
- optionally, Docker եւ Docker Compose տեղական բազմակողմանի արագ մեկնարկի համար:

## 2. Կլոնիր աշխատանքային տարածքը {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Կառուցեք աշխատանքային տարածքը {#_3-build-the-workspace}

Կառուցեք ամեն ինչ.

```bash
cargo build --workspace
```

Ավելի փոքր օպերատորների վրա կենտրոնացած կառուցվածքի համար կազմեք միայն հիմնական բինարները.

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Բինարները գրվում են `target/debug/` կամ `target/release/` հասցեով:

## 4. Ստուգեք տեղադրված գործիքները {#_4-verify-the-installed-tools}

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Այն չորս բինարները, որոնք դուք սովորաբար օգտագործում եք հետեւյալն են.

- `iroha3d` ստանդարտ հանգույցային դեյմոնի համար
- `iroha3d_taira` քանոնիկ Taira վավերացնող գործարկիչի համար
- `iroha` ՝ CLI մուտքի համար Torii եւ օպերատորի վերջային կետերի:
- `kagami` բանալիների, գեներիզային գրքերի եւ տեղական ցանցի պրոֆիլների համար:

## 5. Ընտրովի տեղային ցանցի և Docker-ի ուղին {#_5-optional-localnet-and-docker-path}

Ներկայիս աղբյուրի աջակցությամբ տեղական ցանցային հոսքը ստեղծվում է Kagami: Այն գրում է հանգույցների կոնֆիգներ, գենեզիզ արվեստախաղեր, հաճախորդների կոնֆիդ, օգնական սցենարներ եւ ընտրանքային Compose ֆայլ, որը համապատասխանում է ստուգված կոդին.

- `kagami localnet` ներկառուցված տեղական հանգույցային գրքերի համար
- `kagami docker` Docker Compose համար, որը ստեղծվել է տեղական ցանցի ցուցակից

Շարունակեք [Բեռնելը Iroha 3](/hy/get-started/launch-iroha.md):
