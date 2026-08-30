---
translation_locale: mn
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 хөдлөх {#launch-iroha-3}

Энэ хуудас нь Iroha 3 -ийн тухайн үеийн орон нутгийн сүлжээний урсгалыг ашиглаж, хориотой ажлын байрны хөрөнгийг аваргын хадгаламжаас ашиглаж байна.

## 1. Орон нутгийн олон өрсөлдөгчдийн сүлжээ бий болгох {#_1-generate-a-local-multi-peer-network}

Одоогийн Kagami кодтоос дөрвөн түвшний локалийн сүлжээг бий болгох:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Гадаад өгөгдлийн сүлжээнд `genesis.json`, `genesis.signed.nrt`, `client.toml` болон туслах скриптийн тохиромжтой дундаг хувилбар байдаг.

Орон нутгийн цахилгаан согтууруулах бодисын шинжилгээ хийхэд, үүсгэн бүтээсэн өрсөлдөгчүүдийг шууд эхлүүлэх:

```bash
./localnet/start.sh
```

Containerized run-ын тулд Localnet-ийн мөн захиалгаас Compose-ийг үүсгэх:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

Үндсэн хуулийн дагуу үүсгэсэн түлхүүр нь:

- P2P хоолой `1337` ба `1340` хоолой
- Torii HTTP галт тэрэгний `8080` ба `8083` галт тэргүүдэд
- `./localnet/client.toml` хэмээх бэлэн үйлчлүүлэгчийн конфигурац

## 2. Сүлжээний үйл ажиллагааг сануулъя {#_2-verify-that-the-network-is-up}

Эхний дундад байрлалын төгсгөл хэсгийг шалгах:

```bash
curl http://127.0.0.1:8080/status
```

Дашрамдсан эрүүл мэндийн шалгалтууд нь:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Та CLI -ийг аль хэдийн нэгдсэн үйлчлүүлэгчийн конфигурац руу зааж өгөх боломжтой:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Профиль {#_3-nexus-profile}

Мөн SORA Nexus чиглэсэн конфигурацийн хувилбарыг `defaults/nexus/` дэргэд нь илгээдэг.

Nexus хувилбарыг ашиглан эх орондоо оршин тогтнож байх:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

Энэ хувилбарыг CLI-д хангахын тулд `defaults/nexus/client.toml` ашиглах.

## 4. Орон нутгийн сүлжээг зогсоох {#_4-stop-the-local-network}

Тухайн орон нутгийн сүлжээний хувьд:

```bash
./localnet/stop.sh
```

Тулгарсан Compose Stack:

```bash
docker compose -f ./docker-compose.yml down
```

Тээврийн хэрэгслийг ашигласны дараа [Хөдөлмөрийг Iroha 3-ээр дамжуулан CLI](/mn/get-started/operate-iroha-via-cli.md)-ээр үргэлжлүүлээрэй.
