---
translation_locale: kk
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Клиенттің баптаулары {#client-configuration}

Iroha CLI және SDK клиенттер пайдаланады TOML конфигурация. сақтау қоймасы ағымдағы әдеттегі `defaults/client.toml`; генериру жергілікті желілер , сондай-ақ сәйкесті жазу `client.toml` олардың шығыс каталогына.

::: details Клиенттің баптау үлгісі

<<< @/snippets/client.template.toml

:::

## Негізгі өрістер {#core-fields}

Клиенттің конфигурациясы тізбекті, Torii аяқтық нүктесін және қолтаңбалау шотын анықтайды:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` ұсынылған мәмілелер кіретін тізбекті таңдайды.
- `torii_url` теңестірілген нүктелер Torii HTTP API.
- `[account].domain` пайдаланылады CLI қысқартулар және мекенжай таңбалаушы кодтау; каноникалық `AccountId` өзінен-өзі доменсіз.
- `[account].public_key` және `[account].private_key` сауда-саттыққа қол қою.

Тіркелгі желіде болуы керек. Әдеттегі жергілікті желі үшін бұл жиынтықталған генез манифесті арқылы қарастырылады.

::: info Қиындықтың сезімталдығы

Iroha атаулар қаноникалық талдаудан кейін жағдайға сезімтал. Мысалы, `wonderland.universal`, `Wonderland.universal`, және `looking_glass.universal` әртүрлі домендік сөз тіркестері.

:::

## Негізгі аутентификация {#basic-authentication}

Функционалды `[basic_auth]` бөлімінде қосымша HTTP `Authorization` Клиенттің өтініштерінің тақырыбы. Iroha әріптестері осы сенімхаттарды тікелей түсінбейді; оларды пайдалану кезінде Torii Nginx сияқты кері проксидің артында тұр.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Транзакция параметрлері {#transaction-settings}

Транзакциялық мінез-құлқы `[transaction]` бөлімімен баптау:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` - милисекундтардағы транзакцияның өмір сүру мерзімі.
- `status_timeout_ms` клиенттің транзакция жағдайына қанша уақыт күтетінін бақылайды.
- `nonce = true` клиенттен қайталанатын транзакциялар әртүрлі шешелерді шығарады деп өтінген.

## Кезек параметрлерін қосу {#connect-queue-settings}

Ағымдағы Iroha клиенттері жергілікті кезек күйі үшін ерікті `[connect]` бөлімін пайдалана алады:

```toml
[connect]
queue_root = "./queue"
```

Жұмыс барысы клиент жағында тұрақты кезек сақтауды қажет ететін кезде осыны қолданыңыз.

## Конфигурацияларды құру {#generating-configurations}

Біржолғы жергілікті желілер үшін Kagami Себебі ол сәйкес келеді деп жазады Iroha 3 конфигурация, генез, сценарийлер және README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Пайдаланылатын `./localnet/client.toml` CLI мен бірге:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
