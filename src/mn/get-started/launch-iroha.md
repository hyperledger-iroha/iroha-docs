---
translation_locale: mn
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Эхлүүлэх Iroha 3 {#launch-iroha-3}

Энэ хуудас нь Iroha 3 хувьд дээд түвшний агуулахын анхны ажлын орчны нөөцүүдийг ашиглан одоогийн орон нутгийн сүлжээний урсгалыг тайлбарлаж өгдөг.

## 1. Орон нутгийн олон хамтрагчтай сүлжээ үүсгэх {#_1-generate-a-local-multi-peer-network}

Одоогийн Kagami кодоос дөрвөн түнштэй localnet үүсгээрэй:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Гаралтын директорид тохирсон сүлжээний түншийн тохиргоо болох `genesis.json`, `genesis.signed.nrt`, `client.toml` болон туслах скриптүүд агуулагдаж байна.

Улсын уугуул тест хийхийн тулд үүсгэсэн сүлжээний түншүүдийг шууд эхлүүлээрэй:

```bash
./localnet/start.sh
```

Контейнерт ажиллуулахын тулд ижил localnet директороос Compose-г үүсгээрэй:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

Өгөгдмөл үүсгэсэн стек нь дараахыг ил гаргана:

- сүлжээний хөрш P2P портууд `1337` - `1340`
- Torii HTTP портуудыг `8080`-аас `8083` хүртэл
- `./localnet/client.toml` дээр бэлэн үйлчлүүлэгчийн тохиргоо

## 2. Сүлжээ ажиллаж байгааг шалгах {#_2-verify-that-the-network-is-up}

Эхний зангилааны төлөвийн төгсгөлийн цэгийг шалгана:

```bash
curl http://127.0.0.1:8080/status
```

Өгөгдөлд заасан эрүүл мэндийн шалгалтууд мөн дараах зүйлийг ашиглана:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Та CLI-ийг багцлагдсан клиент тохиргоонд шууд зааж болно:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Хувийн мэдээлэл {#_3-nexus-profile}

Энэхүү сан нь мөн `defaults/nexus/` дор SORA Nexus-т чиглэсэн тохиргооны профайлыг агуулдаг.

Nexus профайлаар дотоод сүлжээний холбоотныг ажиллуулахын тулд:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

Тэр профайлд нэвтрэхийн тулд `defaults/nexus/client.toml`-ийг CLI ашиглаарай.

## 4. Орон нутгийн сүлжээг зогсоох {#_4-stop-the-local-network}

Уламжлалт үүсгэсэн локалнетийн хувьд:

```bash
./localnet/stop.sh
```

Үүсгэсэн Compose багцын хувьд:

```bash
docker compose -f ./docker-compose.yml down
```

Сүлжээ ажиллаж эхэлсний дараа [Iroha 3 -г CLI ашиглан ажиллуулна](/mn/get-started/operate-iroha-via-cli.md)-г үргэлжлүүлнэ үү.
