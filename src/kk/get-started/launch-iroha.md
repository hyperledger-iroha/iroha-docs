---
translation_locale: kk
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Жіберу Iroha 3 {#launch-iroha-3}

Бұл бет Iroha 3 үшін ағымдағы жергілікті желі ағынын тізбектеп көрсетеді, используя жоғарғы репозиторийден алынған әдепкі жұмыс кеңістігі активтерін.

## 1. Жергілікті көпсерверлі желіні жасаңыз {#_1-generate-a-local-multi-peer-network}

Ағымдағы Kagami кодынан төрт түйінді локальді желіні жасаңыз:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Шығару каталогында сәйкес желілік әріптес конфигурациялары, `genesis.json`, `genesis.signed.nrt`, `client.toml` және көмекші скрипттер бар.

Жергілікті тірі түтін тесті үшін, жасалған желі түйіндерін тікелей іске қосыңыз:

```bash
./localnet/start.sh
```

Контейнерленген іске қосу үшін бірдей localnet директориясынан Compose жасаңыз:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

Әдепкіде жасалған стек келесілерді көрсетеді:

- желі әріптесі P2P порттары `1337` дейін `1340`
- Torii HTTP порттары `8080` дейін `8083`
- `./localnet/client.toml` мекенжайында дайын клиент конфигурациясы

## 2. Желінің жұмыс істеп тұрғанын тексеріңіз {#_2-verify-that-the-network-is-up}

Бірінші желі түйініндегі API соңғы нүктенің күйін тексеріңіз:

```bash
curl http://127.0.0.1:8080/status
```

Әдепкі денсаулық тексерулері сондай-ақ келесі әдістерді пайдаланады:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Сіз тіркелген клиенттік конфигурацияға CLI-ді бірден бағыттай аласыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Профиль {#_3-nexus-profile}

Репозиторий сонымен қатар `defaults/nexus/` астында SORA Nexus-бағытталған конфигурациялық профильді жеткізеді.

Nexus профилімен жергілікті желі серіктесін іске қосу үшін:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

Ол профильге қол жеткізу үшін `defaults/nexus/client.toml` пайдаланыңыз CLI.

## 4. Жергілікті желіні тоқтату {#_4-stop-the-local-network}

Туған жерінде жасалған жергілікті желі үшін:

```bash
./localnet/stop.sh
```

Жасалған Compose стегі үшін:

```bash
docker compose -f ./docker-compose.yml down
```

Желінің жұмыс істеуін бастағаннан кейін, [CLI арқылы Iroha 3 жұмыс істеңіз](/kk/get-started/operate-iroha-via-cli.md) жалғастырыңыз.
