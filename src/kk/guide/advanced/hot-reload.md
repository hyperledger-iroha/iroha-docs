---
translation_locale: kk
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ыстық қайта жүктеу Iroha Docker контейнерінде {#hot-reload-iroha-in-a-docker-container}

Жедел қайта жүктеуді тек жергілікті жөндеу үшін қолданыңыз. Docker ішінде бір нұсқадан жиналған екілік файлдармен төрт валидаторды құрып, іске қосу үшін [Iroha 3 іске қосу](/kk/get-started/launch-iroha.md) нұсқаулығын қараңыз.

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

Контейнерді табу үшін `docker ps` пәрменін пайдаланыңыз. Демонды алмастырмас бұрын оның бейнедегі жолын тексеріңіз.

## Бір реттік желідегі блокчейннің генезисін қайта орындау {#recommit-genesis-in-a-disposable-network}

Жаңа генезис блогы үшін түйін қоймасы бос болуы керек. Сол желіні қайта іске қосу үшін алдымен `python3 poc.py down`, содан кейін `python3 poc.py up` пәрменін орындаңыз. `state/` каталогын желінің төрт Docker томымен бірге сақтаңыз.

## Теңшелген баптауларды пайдалану {#use-custom-configuration}

Ағымдағы желі серіктесінің конфигурациясы TOML. Жаратылған `config.toml`, `genesis.signed.nrt` және байланысты кілт файлдарын контейнер күтілетін жолдарға байлау немесе көшіру сурет, содан кейін желі әріптесін қайта жүктеңіз. Жасалған файлдарды бірге сақтаңыз; әртүрлі Kagami іске қосулардан алынған файлдарды араластыру десериализация немесе консенсус қателіктерін тудыруы мүмкін.
