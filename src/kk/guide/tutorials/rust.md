---
translation_locale: kk
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rust {#rust}

Rust жүзеге асыру негізгі жұмыс аймағында орналасқан және Iroha 3 код базасымен жұмыс істеудің ең тікелей тәсілі болып қала береді.

## Сіз не аласыз {#what-you-get}

Жоғарғы репозиторий қазіргі уақытта мыны көрсетеді:

- `iroha` Rust клиенттік бағдарламалық пакет
- `iroha` CLI ең толық сілтеме клиенті ретінде
- ортақ деректер моделі, крипто және Norito бағдарламалық пакеттер SDK қабаты қолданған

## Ұсынылатын Бастау Нүктесі {#recommended-starting-point}

Жобаның ағымдағы жағдайы үшін CLI сілтемесінен және жұмыс кеңістігінен бастау:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Тексерілген әдепкі клиент конфигурациясымен сілтеме клиентін іске қосыңыз:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Сынап көріңіз Taira Тек оқу үшін {#try-taira-read-only}

Сол жұмыс кеңістігінен шығу кезінде, қоғамдық Taira диагностика көмекшісін қолданып көріңіз:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Жол деңгейіндегі тексерулер үшін Torii компаниясының JSON API тікелей пайдаланыңыз:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml` жасағаннан кейін бірдей бинарлық файл Taira қарсы қол қойылған канарий командаларын орындай алады. Бұларды қарапайым бірлік тесттерінен бөлек сақтаңыз, өйткені олар тестнетке қаржыландырылған есептік жазбаны және тірі тестнеттің қолжетімділігін қажет етеді.

## Rust Клиенттік бағдарламалық жасақтама пакетін пайдалану {#using-the-rust-client-crate}

Желіңізде қолданылатын Iroha Git нұсқасын бекітіңіз:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Егер сізге Rust беттері практикада қалай қолданылатынына ең толық мысалдар қажет болса, мына жерді қараңыз:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Блокчейн тізілімімен басқарылатын кепілдік жұмыс ағындары үшін қараңыз [Туынды активтерді сенімхатта сақтау](/kk/blockchain/escrow.md#rust-sdk). Қазіргі уақытта Rust деректер моделі нарықтағы кеплдіктерге, жалпы активтерді жабуға, анонимді кеплдіктерге, сұраныстарға және оқиғаларға ең толық типтелген қамтуды қамтамасыз етеді.

Сіз жергілікті CLI көмек уақыттық нүкте деректер көрінісін келесі арқылы қайта жасай аласыз:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Ескертпелер {#notes}

- CLI қазіргі уақытта жеке бағдарламалық қамтамасыз ету пакетінің құжаттарынан жақсырақ қамту ұсынады.
- Операторлық стильдегі ағындар үшін CLI құжаттамасы ең қазіргі дерек көзі болып табылады.
