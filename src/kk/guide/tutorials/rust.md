---
translation_locale: kk
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

Rust іске асыру негізгі жұмыс кеңістігінде өмір сүреді және Iroha 3 код базасымен жұмыс істеудің ең тікелей жолы болып табылады.

## Неге ие боласың ? {#what-you-get}

Қазіргі уақытта жоғары ағыстағы депозитарий:

- `iroha` Rust клиент коробкасы
- `iroha` CLI ең толық анықтама клиенті ретінде
- SDK қабаты пайдаланатын ортақ деректер моделі, криптовалюта және Norito сандығы

## Ұсынылатын бастау нүктесі {#recommended-starting-point}

Жобаның қазіргі жай-күйі үшін CLI және жұмыс орнының өзі туралы анықтамадан бастаңыз:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Келтірілген әдеттегі клиент конфигурациясы бар анықтамалық клиентті орындау:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Taira Тек оқуға тырыс {#try-taira-read-only}

Сол жұмыс орнының кассасынан Taira қоғамдық диагностика көмекшісін тексеріңіз:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Маршрут деңгейіндегі тексерулер үшін пайдалану Torii Ол ... JSON API тікелей:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml` құрылғаннан кейін, сол бинарлық қолтаңбаланған канарлық командаларды Taira қарсы орындай алады. Оларды әдеттегі бірлік тестілерден бөлек ұстаңыз, өйткені олар кран-қаржыландырылған шотты және терезе тест желісін қажет етеді.

## Rust Клиенттің қапшығын пайдалану {#using-the-rust-client-crate}

Желіңізде қолданылатын Iroha Git редакциясын тіркейді:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Егер Rust беттерінің іс жүзінде қалай пайдаланылғанына қатысты ең толық мысалдар қажет болса, мыналарды тексеру:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Кітаптық басқарудағы кепілдік беру жұмыс барысы үшін [Туған активтердің кепілдендірілуі](/kk/blockchain/escrow.md#rust-sdk) қараңыз. Rust деректер моделі қазіргі уақытта нарықтағы кепілдендіру, жалпы активтерді бекіту, анонимді кепілдендіру, сұраулар және оқиғалар бойынша ең толық типті қамтылысқа ие.

Жергілікті CLI көмегімен кескінді қалпына келтіруге болады:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Ескертулер {#notes}

- CLI қазіргі уақытта дербес коробкалық құжаттарға қарағанда жақсы қамтуды қамтамасыз етеді.
- Оператор стилі бойынша ағымдар үшін CLI құжаттамасы ең өзекті көз болып табылады.
