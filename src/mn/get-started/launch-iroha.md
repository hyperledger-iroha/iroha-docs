---
translation_locale: mn
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Нэвтрүүлэг Iroha 3 {#launch-iroha-3}

Энэ хуудас нь одоогийн орон нутгийн сүлжээний урсгалыг Iroha 3 .
Ажлын байрны урьдчилсан санхүүжилт

## 1. Орон нутгийн олон үеийн сүлжээг бий болгох {#_1-generate-a-local-multi-peer-network}

Одоогийн цахилгаан хэрэгсэлээс дөрвөн дутагдалтай локаль сүлжээг бий болгох Kagami код:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Гадаад нурууны товчоо нь ижил төстэй дундаж хувилбарыг эзэлдэг, `genesis.json`,
`genesis.signed.nrt`, `client.toml`, Бас туслах зохиол.

Орон нутгийн цахилгаан согтууруулах бодисын туршилт хийхэд, үүсгэн бүтээсэн өрсөлдөгчүүдийг шууд эхлүүлэх:

```bash
./localnet/start.sh
```

Контейнериздсэн гүйлгээний тулд Localnet-ийн мөн захиалгаас Compose-ийг үүсгэн уу:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

Үндсэн хуулийн дагуу үүсгэсэн түлхүүр:

- өрсөлдөгч P2P боомтууд `1337` . `1340`
- Torii HTTP боомтууд `8080` . `8083`
- хэрэглэгчийн бэлэн конфигурац `./localnet/client.toml`

## 2. Сүлжээний үйл ажиллагааг сануул {#_2-verify-that-the-network-is-up}

Эхний давхаргын төгсгөл хэсгийг шалгаарай:

```bash
curl http://127.0.0.1:8080/status
```

Дашрамдсан эрүүл мэндийн шалгалтад:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Та шууд CLI "Bundled client" конфигурацынд:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Профиль {#_3-nexus-profile}

Мөн хадгаламж нь SORA Nexus- чиглэгдсэн конфигурацийн хувилбар
`defaults/nexus/`.

Нүүдэлчдийн хамтын ажиллагааг явуулах Nexus хувилбар:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

Хэрэглээ `defaults/nexus/client.toml` . CLI Энэ хувилбарыг олж авах боломжтой.

## 4. Орон нутгийн сүлжээг зогсоох {#_4-stop-the-local-network}

Тухайн орон нутгийн сүлжээ:

```bash
./localnet/stop.sh
```

Тулгарсан Compose-ийн багт:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

Сүлжээ ашиглалтад орсны дараа
[Хөдөлмөр Iroha 3 дамжуулан CLI](/mn/get-started/operate-iroha-via-cli.md).
