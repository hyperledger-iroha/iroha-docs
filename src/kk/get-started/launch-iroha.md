---
translation_locale: kk
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ұшыру Iroha 3 {#launch-iroha-3}

Бұл бетте Iroha 3 үшін ағымдағы жергілікті желі ағындарының үстіндегі қоймадан әдеттегі жұмыс кеңістігі активтерін пайдалана отырып өтуі тиіс.

## 1. Жергiлiктi көп теңгершiлiк желiс құру {#_1-generate-a-local-multi-peer-network}

Ағымдағы Kagami кодынан төрт жұптық локальдік желіні құру:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Шығу каталогында сәйкес келетін теңгерімдік конфигурациялар, `genesis.json`, `genesis.signed.nrt`, `client.toml` және көмекші скрипттер бар.

Жергiлiктi түтiк сынағы үшiн өндiрiлген теңгершiлердi тiкелей бастаңыз:

```bash
./localnet/start.sh
```

Контейнерлік орындалу үшін Localnet каталогынан Compose генерациялаңыз:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

Әдетті пайдаланған ұяшықта:

- P2P порты `1337` - `1340`
- Torii HTTP порттары `8080` - `8083`
- дайын клиент конфигурациясы `./localnet/client.toml`

## 2. Желідің жұмыс істеп жатқанын тексеріңіз {#_2-verify-that-the-network-is-up}

Бірінші теңгерімдегі жай-күйін тексеру:

```bash
curl http://127.0.0.1:8080/status
```

Әдеттегі денсаулық тексерулерінде сондай-ақ:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Сіз бірден CLI топталған клиент конфигурациясына бағыттауыңыз мүмкін:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Профиль {#_3-nexus-profile}

Сондай-ақ, депозитарий SORA Nexus-қа бағдарланған конфигурациялық профильді `defaults/nexus/` бойынша жібереді.

Nexus профилі бар түпкiлiктi теңгершiн жүргiзу үшiн:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

Осы профильге CLI қатынау үшін `defaults/nexus/client.toml` қолданылсын.

## 4. Жергілікті желілерді тоқтату {#_4-stop-the-local-network}

Жергілікті желі үшін:

```bash
./localnet/stop.sh
```

Жаратылған Compose ұяшығы үшін:

```bash
docker compose -f ./docker-compose.yml down
```

Желі жұмыс істегеннен кейін [мен жалғастырыңыз Iroha 3 арқылы CLI](/kk/get-started/operate-iroha-via-cli.md) арқылы әрекет ету.
