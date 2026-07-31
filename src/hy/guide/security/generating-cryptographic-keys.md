---
translation_locale: hy
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Քրիպտոգրաֆիկ բանալիներ ստեղծելը {#generating-cryptographic-keys}

Օգտագործեք `kagami keys` ՝ Iroha 3 համար հաճախորդի, զուգընկերների եւ հավաստիացնողի հիմնական նյութերի ստեղծման համար:

## Հիմնական օգտագործումը {#basic-usage}

Iroha աղբյուրի ստուգումից՝

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON արտադրանքը սովորաբար ամենահեշտը կրկնօրինակվում է TOML կամ ավտոմատացված:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Հրամանը տպագրում է հանրային բանալին եւ բացահայտված մասնավոր բանալին: Բարեկամացեք մասնավոր բանալի հետ որպես գաղտնի նյութ, մի պարտադրեք ստեղծված արտադրական բանալիներ:

## Ալգորիթմներ {#algorithms}

Սովորական ալգորիթմները հետեւյալն են.

- `ed25519` հաճախորդների հաշիվների, հեռարձակման նույնականությունների եւ զարգացման ցանցերի մեծ մասի համար:
- `secp256k1` երբ ձեզ պետք է secp256k1 հաշիվի ինքնությունը:
- `bls_normal` վավերացողի համաձայնության բանալիների համար, երբ կառուցվածքը հնարավորություն է տալիս աջակցել BLS:

Ստուգեք ձեր կառուցվածքի կողմից աջակցվող ճշգրիտ ալգորիթմները ՝ օգտագործելով

```bash
cargo run --bin kagami -- keys --help
```

## Դետերմինիստական զարգացման բանալիները {#deterministic-development-keys}

Վերարտադրելի սարքավորումների համար անցեք սերմ:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

Սերմերը գաղտնի նյութ են, օգտագործեք դրանք միայն տեղական մշակման եւ փորձարկումների համար:

## BLS Գույքի ապացույցներ {#bls-proofs-of-possession}

NPoS եւ Nexus վավերացնող պրոֆիլները պահանջում են BLS վավերացնողի բանալիներ եւ PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

JSON-ը ներառում է `pop_hex`, երբ օգտագործվում է `--pop`: Օգտագործեք այդ արժեքը ստեղծված տոպոլոգիայի կամ `trusted_peers_pop` մուտքերի հետ, որոնք պահանջվում են պրոֆիլից:

## Արտադրանքի ձեւաչափեր {#output-formats}

Օգտագործեք թերմինալների ստուգման համար նախնական արտադրանքը, `--json` ավտոմատացման համար եւ `--compact`, երբ մեկ այլ սցենարը պահանջում է պարզ գծային ուղղված արժեքներ.

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Ամբողջական արտադրվող Kagami օգնության համար'

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
