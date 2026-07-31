---
translation_locale: kk
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Қара металлмен жұмыс істеу {#running-iroha-on-bare-metal}

Осы жұмыс ағынын Docker Compose арқылы емес, хосттарда тікелей әріптестерді орындауды қалаған кезде қолданыңыз. Ағымдағы бастапқы ағаш сәйкес келетін генезисті, теңгерімдік конфигурацияны, клиент конфигурациясын және бастау / тоқтату скрипттерін жазатын Kagami генераторларды береді.

## 1. Қиындықтарды құру {#_1-build-the-binaries}

Iroha жоғары ағыстағы жұмыс кеңістігінен:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Бұл:

- `target/release/irohad` жасөспірім дэймон үшін
- `target/release/iroha` үшін CLI
- `target/release/kagami` кілттер, генездер және локальдік желілерді өндіру үшін

## 2. Жергілікті желі құру {#_2-generate-a-local-network}

Төрт жұпты Iroha 3 жергілікті желісін құру:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Шығыс каталогында `genesis.json`, `genesis.signed.nrt`, `config.toml` файлдар, `client.toml`, көмекші скрипттер және осы топтамаға арналған нақты командалар бар `README.md` генерацияланған каталогтар болады.

## 3. Жастармен араласуды бастаңыз {#_3-start-peers}

Жаратылған біржолғы локалнет үшін пайдаланған скриптті қолданыңыз:

```bash
./localnet/start.sh
```

Егер сіз әрбір теңгерімді systemd сияқты процес менеджеріне қосуыңыз керек болса, әр теңгерім үшін `./localnet/README.md` дегенде жазылған іске қосу командасын қолданыңыз. Әр теңгерімнің `config.toml` жеке кілті, сақтау каталогы және порттарын бөлек сақтаңыз.

## 4. Желіді басқару {#_4-operate-the-network}

Келтірілген клиент конфигурациясын пайдаланыңыз:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Жаратылған локальді желіні тоқтату:

```bash
./localnet/stop.sh
```

## 5. Өндірістік жазбалар {#_5-production-notes}

- Өндіріске арналған жаңа жеке кілттерді жасау және оларды қоймадан тыс сақтау.
- Барлық теңгерімшелерді бірдей қол қойылған генезис транзакциясы, топологиясы, сенімді теңгерімшілері және растаушы PoPs туралы келісуге шақыр.
- Тыңдаушыларды басқа машиналардан қол жеткізуге болмайтын жағдайда ғана хост-мекемендік интерфейстерге байланыстыру адрестері.
- Torii экспозициясы, негізгі auth, TLS және жылдамдықты шектеу үшін кері прокси немесе өрт қабырғасын қолданыңыз.
- Жаратылыс немесе консенсус топологиясына өзгерістерді біріктірілген көші-қон ретінде қараңыз, тек бір қатарлы файлдарды өзгерту емес.

Контейнерленген жергілікті даму үшін [Launch Iroha 3](../../get-started/launch-iroha.md) Docker Compose жұмыс барысы қолданылсын.
