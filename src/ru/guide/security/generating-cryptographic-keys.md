---
translation_locale: ru
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Создание криптографических ключей {#generating-cryptographic-keys}

Использование `kagami keys` для создания ключевого материала клиента, однородника и валидатора для
Iroha 3.

## Основное использование {#basic-usage}

От: Iroha исходная касса:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

JSON Выход обычно легче всего скопировать в TOML или автоматизация:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Командование печатает публичный ключ и открытый частный ключ.
ключи в качестве секретного материала; не обязать генерируемые производственные ключи.

## Алгоритмы {#algorithms}

Общими алгоритмами являются:

- `ed25519` для учетных записей клиентов, потоковых идентификаций и большинства разработок
  сети.
- `secp256k1` когда вам нужна идентификация счета SECP256K1.
- `bls_normal` для ключей консенсуса проверщика, когда настройка позволяет BLS Поддержка.

Проверьте точные алгоритмы , поддерживаемые вашей конструкцией с помощью:

```bash
cargo run --bin kagami -- keys --help
```

## Ключи детерминистического развития {#deterministic-development-keys}

Для воспроизводимых устройств подать семя:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

Семена - частный ключ, используйте их только для местной разработки и испытаний.

## BLS Доказательства владения {#bls-proofs-of-possession}

NPOS и Nexus Профили валидаторов требуют BLS ключи проверки и PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

Сборник JSON включает `pop_hex` когда `--pop` Используйте это значение с
генерируемая топология или `trusted_peers_pop` записи, требуемые профилем.

## Форматы выхода {#output-formats}

Используйте стандартную выпускную запись для осмотра терминала. `--json` для автоматизации и
`--compact` когда другой сценарий требует четких линейных значений:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Для полного производства Kagami помощь:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
