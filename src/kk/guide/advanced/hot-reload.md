---
translation_locale: kk
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 6edc0185196ab8e77ef8552723e05bf37cca1a088da86e2a43d441d58e779c11
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

Ағымдағы желі серіктесінің конфигурациясы — TOML. Kagami әр валидатор үшін `genesis.signed.nrt`, `genesis.public_key` және `genesis.expected_hash` мәндері бар бір `peerN.toml` жазады; `kagami docker` жасаған Compose файлы оларды контейнерге тіркейді. Файлдарды қолмен көшірудің орнына оны қайта жасаңыз, содан кейін желі серіктесін қайта іске қосыңыз. Жасалған файлдарды бірге сақтаңыз; әртүрлі Kagami іске қосуларынан алынған файлдарды араластыру десериализация немесе консенсус қателіктерін тудыруы мүмкін.
