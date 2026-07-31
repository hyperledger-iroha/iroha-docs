---
translation_locale: ru
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Создание криптографических ключей {#generating-cryptographic-keys}

Используйте `kagami keys` для генерирования ключевого материала клиента, однородника и валидатора для Iroha 3.

## Основное использование {#basic-usage}

Из расчета источника Iroha:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

Выход JSON обычно легче всего скопировать в TOML или автоматизировать:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

В команде печатается публичный ключ и открытый частный ключ.

## Алгоритмы {#algorithms}

Общими алгоритмами являются:

- `ed25519` для учетных записей клиентов, потоковых идентификаторов и большинства сетей разработки.
- `secp256k1` когда вам нужен идентификатор счета SECP256K1.
- `bls_normal` для ключей консенсуса валидатора, когда встроенность позволяет поддержку BLS.

Проверьте точные алгоритмы , поддерживаемые вашей конструкцией с помощью:

```bash
cargo run --bin kagami -- keys --help
```

## Ключи к определённому развитию {#deterministic-development-keys}

Для воспроизводимых приборов, подать семя:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

Семена - это частный ключ, используйте их только для местной разработки и испытаний.

## BLS Доказательства владения {#bls-proofs-of-possession}

Профили валидатора NPoS и Nexus требуют ключей валидателя BLS и PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

JSON включает в себя `pop_hex`, когда используется `--pop`. Используйте это значение с генерируемой топологией или записями `trusted_peers_pop`, требующими профиля.

## Форматы выхода {#output-formats}

Используйте исходные параметры по умолчанию для проверки терминала, `--json` для автоматизации и `--compact`, когда другой сценарий требует четко ориентированных на линию значения:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Для полного производства Kagami помощи:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
