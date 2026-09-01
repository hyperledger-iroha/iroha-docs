---
translation_locale: kk
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Таза темірде Iroha іске қосу {#running-iroha-on-bare-metal}

Бұл жұмыс үрдісін сіз желілік түйіндерді Docker Compose арқылы емес, тікелей хосттарда іске қосқыңыз келгенде пайдаланыңыз. Ағымдағы қайнар код ағашы сәйкес блокчейн бастамасын, желілік түйін конфигурацияларын, клиент конфигурациясын және бастау/тоқтату скрипттерін жазатын Kagami генераторларын қамтамасыз етеді.

## 1. Бинарлық файлдарды құру {#_1-build-the-binaries}

Жоғары ағыннан Iroha жұмыс кеңістігі:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Бұл қамтамасыз етеді:

- `target/release/iroha3d` желілік пир демон үшін
- `target/release/iroha` үшін CLI
- `target/release/kagami` перне, блокчейннің басталуы және локалнет генерациясы үшін

## 2. Жергілікті желіні жасау {#_2-generate-a-local-network}

Төрт түйінді Iroha 3 localnet жасаңыз:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

Шығыс каталогында жасалған `genesis.json`, `genesis.signed.nrt`, желілік әріптес `config.toml` файлдары, `client.toml`, көмекші скрипттер және сол топтамаға арналған нақты командалары бар жасалған `README.md` бар.

## 3. Желідегі әріптестерді бастау {#_3-start-peers}

Жасалған уақытша локальдық желі үшін жасалған скриптті қолданңыз:

```bash
./localnet/start.sh
```

Егер сізге әр желі әріптесін systemd сияқты процесс менеджеріне байлау қажет болса, әр желі әріпшісі үшін `./localnet/README.md`-де жазылған іске қосу командаларын пайдаланыңыз. Әр желі әріпшісінің `config.toml`-ін, жеке кілтін, сақтау каталогын және порттарын бөлек ұстаңыз.

## 4. Желіні басқару {#_4-operate-the-network}

Жасалған клиент конфигурациясын пайдаланыңыз:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Жергілікті желіні тоқтату үшін:

```bash
./localnet/stop.sh
```

## 5. Өндіріс туралы ескертпелер {#_5-production-notes}

- Өндіріс үшін жаңа жеке кілттер жасап, оларды репозиторийден тыс жерде сақтаңыз.
- Әрбір желі қатысушысы бірдей қол қойылған блокчейннің алғашқы транзакциясына, топологияға, сенімді желі қатысушыларына және валидаторға PoPs келіссін.
- Желі әріптесі басқа машиналардан қолжетімсіз болуы керек жағдайда тыңдаушы мекенжайларды тек жергілікті хост интерфейстеріне байлаңыз.
- Torii ашылуына, негізгі аутентификацияға, TLS және жылдамдықты шектеуге арналған кері прокси немесе брандмауэрді қолданыңыз.
- Генезис немесе консенсус топологиясы өзгерістерін бір желі түйініндегі файлды түзету емес, үйлестірілген көшіру ретінде қарастырыңыз.

Контейнерленген жергілікті дамыту үшін [Жіберу Iroha 3](../../get-started/launch-iroha.md) Docker Compose жұмыс үрдісін қолданыңыз.
