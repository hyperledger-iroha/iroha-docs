---
translation_locale: mn
translation_source: /get-started/install-iroha.md
translation_source_hash: 49e1a29243151fec1ada2729c315378455a8502811e1ae124e5917a88d59b55d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Нэвтрүүлэг Iroha 3 {#install-iroha-3}

Энэ хуудас нь одоогийн монтаж ажлын урсгалыг Iroha 3 хэрэгслийн сүлжээ
болон урсгалын өмнөд хэсгийг ашиглаж буй хошуу `hyperledger-iroha/iroha` Ажлын газар.

## 1.Төрийн шаардлага {#_1-prerequisites}

Хамгийн түрүүнд тэдгээрийг тавиарай:

- [rustup](https://www.rust-lang.org/tools/install), Тиймээс
  `rust-toolchain.toml` хэрэгслийн сүлжээ (`1.93.1`) нь автоматжуулалтад оршино
- `git`
- сонголттайгаар, Docker болон Docker Compose орон нутгийн олон түвшний хурдны шуурхай

## 2. Ажлын байрны клоныг хий {#_2-clone-the-workspace}

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
```

## 3. Үйл ажиллагааны газар байгуулаарай {#_3-build-the-workspace}

Бүх зүйлийг бүтээн байгуулах:

```bash
cargo build --workspace
```

Тодруулбал, томоохон бинардыг:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Үүнээс үүдэлтэй бинар нь: `target/debug/` эсвэл `target/release/`.

## 4. Нэвтрүүлсэн хэрэгслийг шалгаарай {#_4-verify-the-installed-tools}

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

Та ихэвчлэн ашигладаг гурван бинар нь:

- `irohad` Эрдэнэт даймон
- `iroha` . CLI нэвтрэх Torii үйл ажиллагаа эрхлэгчдийн төгсгөлийн
- `kagami` түлхүүр, генезисийн тэмдэгт болон локаль сүлжээний хувилбар

## 5. Орон нутгийн сүлжээ болон Docker Зам {#_5-optional-localnet-and-docker-path}

Одоогийн эх үүсвэрээр дэмжлэг үзүүлж буй локаль сүлжээний урсгал нь Kagami. Энэ нь ижил төстэй бичиг
Config, Genesis артефакт, клиент конфигурац, туслах скрипт болон сонголттой
Тавигдсан кодтой нийцсэн файлыг бичнэ:

- `kagami localnet` орон нутгийн ижил хүйстүүний зохиолд зориулсан
- `kagami docker` . Docker Compose Localnet захиалгаас үүссэн

Цаашид [Нэвтрүүлэг Iroha 3](/mn/get-started/launch-iroha.md).
