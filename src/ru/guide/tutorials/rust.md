---
translation_locale: ru
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rust {#rust}

Реализация Rust находится в основной рабочей области и остается самым прямым способом работы с кодовой базой Iroha 3.

## Что вы получаете {#what-you-get}

Верхнеуровневый репозиторий в настоящее время предоставляет:

- пакет клиентского программного обеспечения `iroha` Rust
- CLI `iroha` — наиболее полный эталонный клиент
- общая модель данных, крипто и программные пакеты Norito, используемые слоем SDK

## Рекомендуемая отправная точка {#recommended-starting-point}

Для текущего состояния проекта начните с ссылки CLI и самого рабочего пространства:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Запустите эталонный клиент с проверенной конфигурацией клиента по умолчанию:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Попробуйте Taira Только для чтения {#try-taira-read-only}

Из той же рабочей области попробуйте воспользоваться общедоступным помощником диагностики Taira:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Для проверок на уровне маршрута используйте Torii JSON API напрямую:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

После того как вы создадите `taira.client.toml`, тот же бинарный файл может выполнять подписанные команды «канареек» против Taira. Держите их отдельно от обычных модульных тестов, так как они требуют аккаунта с финансированием в тестовой сети и наличия рабочей тестовой сети.

## Использование программного пакета клиента Rust {#using-the-rust-client-crate}

Закрепите используемую вашей сетью версию Git Iroha:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Если вам нужны самые полные примеры того, как поверхности Rust используются на практике, ознакомьтесь с:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Для управления рабочими процессами эскроу с помощью распределённого реестра блокчейн см. [Эскроу для родных активов](/ru/blockchain/escrow.md#rust-sdk). Модель данных Rust в настоящее время имеет самое полное типизированное покрытие для эскроу на рынке, блокировок универсальных активов, анонимного эскроу, запросов и событий.

Вы можете повторно создать локальный снимок справочных данных CLI с помощью:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Заметки {#notes}

- В настоящее время CLI обеспечивает лучшее покрытие, чем отдельный пакет программного обеспечения с документацией.
- Для потоков с операторским стилем документация CLI является наиболее актуальным источником.
