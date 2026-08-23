---
translation_locale: ru
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Внедрение Rust находится в основном рабочем пространстве и остается самым прямым способом работы с базой кодов Iroha 3.

## Что вы получаете {#what-you-get}

В настоящее время в подпотовом хранилище раскрываются:

- ящик заказчика `iroha` Rust
- `iroha` CLI как наиболее полный клиент-справочник
- разделенная модель данных, крипто и ящики Norito, используемые слоем SDK

## Рекомендуемая точка начала {#recommended-starting-point}

Для текущего состояния проекта начните с указания CLI и самого рабочего пространства:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Запустить референтный клиент с проверенной конфигурацией клиента по умолчанию:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Попробуйте Taira Читайте только {#try-taira-read-only}

С того же рабочего места попробуйте помощника по диагностике общественности Taira:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Для проверки на уровне маршрута используйте Torii JSON API непосредственно:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

После создания `taira.client.toml`, тот же двоичный файл может запускать подписанные канарные команды против Taira. Держите их отдельно от обычных единичных тестов, потому что они требуют учетной записи, финансируемой краном и доступности тестовой сети в режиме реального времени.

## Использование Rust клиентского ящика {#using-the-rust-client-crate}

Закрепить пересмотр Git Iroha используемый вашей сетью:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Если вам нужны наиболее полные примеры того, как на практике используются поверхности Rust, проверить:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Для работных процессов управляемого бухгалтерским учетом, см. [Native Asset Escrow](/ru/blockchain/escrow.md#rust-sdk). Данная модель Rust в настоящее время имеет наиболее полное типовое покрытие для рыночных депозитов, общих блокировки активов, анонимных депозитов, запросов и событий.

Вы можете восстановить местный CLI помощник с помощью:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Примечания {#notes}

- В настоящее время CLI обеспечивает лучшее покрытие, чем самостоятельные коробки документации.
- Для потоков типа оператора документация CLI является наиболее актуальным источником.
