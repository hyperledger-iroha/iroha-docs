---
translation_locale: ru
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Сборник Rust реализация в основном рабочем пространстве и остается наиболее прямым
способ работы с Iroha 3 кодовой базис.

## Что вы получаете {#what-you-get}

В настоящее время запасные ресурсы раскрывают:

- в) `iroha` Rust ящик заказчика
- в) `iroha` CLI как наиболее полный справочный клиент
- совместная модель данных, крипто, и Norito коробки, используемые SDK слой

## Рекомендуемая точка начала {#recommended-starting-point}

Для текущего состояния проекта начните с ссылки CLI и
само рабочее пространство:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Запустить справочный клиент с проверенной конфигурацией клиента по умолчанию:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Попробуйте . Taira Читать только {#try-taira-read-only}

Из того же рабочего места, попробуйте общественность Taira помощник диагностики:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Для проверки на уровне маршрута используйте Torii Я ... JSON API прямо:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

После того, как ты создаешь `taira.client.toml`, один и тот же бинар может запускать подписанный канар
приказы против Taira. Держите их отдельно от обычных единичных испытаний, потому что
они требуют учетной записи, финансируемой из крана, и доступности живой тестовой сети.

## Используя Rust Клиентская коробка {#using-the-rust-client-crate}

Запиши Iroha Ревизия Git , используемая вашей сетью:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Если вам нужны наиболее полные примеры того, как Rust поверхности используются в
практика, инспекция:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Для работных потоков, управляемых бухгалтерским учетом, см.
[Осуществление сбережений на собственные активы](/ru/blockchain/escrow.md#rust-sdk). Сборник Rust модель данных
в настоящее время имеет наиболее полное типовое покрытие для рынка сбережений, общей
блокировки активов, анонимные поручительства, запросы и события.

Вы можете восстановить местный CLI помощь в получении мгновенной информации:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Примечания {#notes}

- Сборник CLI в настоящее время обеспечивает лучшее покрытие, чем самостоятельные коробки документов.
- Для потоков типа оператора CLI документация является наиболее актуальным источником.
