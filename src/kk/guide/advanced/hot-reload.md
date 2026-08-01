---
translation_locale: kk
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Docker контейнердегі ыстық қайта жүктеу Iroha {#hot-reload-iroha-in-a-docker-container}

Тек жергілікті дебэглеу үшін ыстық қайта жүктеуді қолданыңыз. Әдеттегі жергілікті даму үшін суретті қайта құруды немесе жаңа Kagami топтамасынан шығарылған Docker Compose ұяшығын қалпына келтіруді таңдаңыз.

## Бір-бірімен қос параметрлерді алмастыру {#replace-the-peer-binary}

Жоғарыдағы жұмыс кеңістігінен Linux-қа үйлесімді дәймонды бинарлық құру:

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

Оны жұмыс істеп тұрған теңгерім контейнеріне көшіріп, содан кейін контейнерді қайта бастаңыз:

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

Контейнердің атауын растау үшін `docker ps` қолданыңыз. Жаратылған ұяда теңгермелі контейнерлер `./localnet/docker-compose.yml` деп анықталады.

## Жаратылыс тармағын бір жолға шығаратын желіде қайта қосу {#recommit-genesis-in-a-disposable-network}

Пайдаланушы тек оның сақтау орны бос болған кезде ғана генезиске кіріседі. Біржолғы Docker желісі үшін, тізімді тоқтатып, пайдаланған күйін алып тастаңыз, қол қойылған генезистік топтаманы қалпына келтіріңіз немесе ауыстырыңыз және қайта бастаңыз:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

Тұрақтылығы сақталуға тиіс желідегі туындыны алмастыруға болмайды.

## Әдеттегі конфигурацияны қолдану {#use-custom-configuration}

Қазiргi замандас конфигурациясы TOML. Жаратылған `config.toml`, `genesis.signed.nrt` және байланысты кілттер файлдарын суретте күтiлетiн контейнер жолдарына байлаңыз немесе көшіріп алыңыз, содан кейін допты қайта іске қосыңыз. Жаратылған файлдарды біріктіру; әртүрлі Kagami орындарынан файлдарды араластыру десеряландыру немесе консенсус қателерін туғыза алады.
