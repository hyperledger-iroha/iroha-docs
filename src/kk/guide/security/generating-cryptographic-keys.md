---
translation_locale: kk
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Криптографиялық кілттерді жасау {#generating-cryptographic-keys}

Iroha 3 үшін клиент, теңгерім және растаушы кілті материалдарын құру үшін `kagami keys` қолданылсын.

## Негізгі пайдалану {#basic-usage}

Iroha көзін тексеруден:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON шығысын TOML немесе автоматтандыруға көшіру әдетте ең оңай:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Бұйрық ашық кілтті және жеке кілтті басып шығарады.

## Алгоритмдер {#algorithms}

Әдеттегі алгоритмдер:

- `ed25519` клиенттер тіркелгілері, стримингтік идентификациялар және даму желілерінің көпшілігі үшін.
- `secp256k1` егер сізге SECP256K1 тіркелгісінің жеке басын көрсету қажет болса.
- `bls_normal` қосылымы BLS қолдауын қамтамасыз еткен жағдайда, растаушы консенсус кілттеріне арналған.

Құрылымыңызда қолданатын алгоритмдерді тексеріңіз:

```bash
cargo run --bin kagami -- keys --help
```

## Детерминистік дамудың кілттері {#deterministic-development-keys}

Өмірлендірілетін құрылғылар үшін тұқымдар:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

Тұқымдар - жеке кілт материалдары, оларды тек жергілікті даму және сынақтар үшін ғана қолданыңыз.

## BLS Иесінің дәлелдемесі {#bls-proofs-of-possession}

NPoS және Nexus растаушы профильдері үшін BLS растаушының кілттері және PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

JSON құрамына `pop_hex` кіреді, егер `--pop` қолданылса. Бұл мәнді пайдаланған топологиямен немесе профиль талап ететін `trusted_peers_pop` жазулармен бірге қолданыңыз.

## Шығу форматтары {#output-formats}

Терминалды тексеру үшін әдеттегі шығыс, `--json` автоматтандыру үшін және `--compact` басқа сценарийге қарапайым сызық-бағдарланған мәндер қажет болған кезде қолданылсын:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Толық шығарылған Kagami көмек үшін:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
