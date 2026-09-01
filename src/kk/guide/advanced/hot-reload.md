---
translation_locale: kk
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ыстық қайта жүктеу Iroha Docker контейнерінде {#hot-reload-iroha-in-a-docker-container}

Жергілікті отладка үшін ғана жылдам қайта жүктеуді пайдаланыңыз. Қалыпты жергілікті даму үшін кескінді қайта жасауға немесе жаңадан жасалған Kagami бандлынан пайда болған Docker Compose стекті қайта қосуға артықшылық беріңіз.

## Желідегі әріптес Binary-ді ауыстыру {#replace-the-peer-binary}

Үстіңгі жұмыс кеңістігінен Linux-пен сәйкес келетін демондық бинарлық файл жасаңыз:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Оны жұмыс істеп тұрған желі әріптес контейнеріне көшіріп, содан кейін сол контейнерді қайта іске қосыңыз:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

`docker ps` контейнердің атын растау үшін қолданыңыз. Жасалған стекде желідегі әріптес контейнерлер `./docker-compose.yml` арқылы анықталады.

## Бір реттік желідегі блокчейннің генезисін қайта орындау {#recommit-genesis-in-a-disposable-network}

Желілік түйін блокчейннің бастамасын тек оның сақтау орны бос болған кезде аяқтайды. Бір реттік Docker желі үшін стек өзгертпей тұрып тоқтатыңыз, жасалған күйді жойыңыз, қол қойылған блокчейн бастамасының пакетін қайта жасаңыз немесе ауыстырыңыз, және қайтадан іске қосыңыз:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Жалпы жағдайын сақтау қажет желіде блокчейнгенезисті алмастырмаңыз.

## Теңшелген баптауларды пайдалану {#use-custom-configuration}

Ағымдағы желі серіктесінің конфигурациясы TOML. Жаратылған `config.toml`, `genesis.signed.nrt` және байланысты кілт файлдарын контейнер күтілетін жолдарға байлау немесе көшіру сурет, содан кейін желі әріптесін қайта жүктеңіз. Жасалған файлдарды бірге сақтаңыз; әртүрлі Kagami іске қосулардан алынған файлдарды араластыру десериализация немесе консенсус қателіктерін тудыруы мүмкін.
