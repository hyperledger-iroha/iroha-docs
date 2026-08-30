---
translation_locale: kk
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Клиенттің баптаулары {#client-configuration}

Iroha CLI және SDK клиенттері TOML конфигурациясын пайдаланады. Капитулятор ағымдағы әдеттілікті `defaults/client.toml` дегенге жібереді; генериленген жергілікті желілер өздерінің шығыс каталогына сәйкес келетін `client.toml` жазуы да мүмкін.

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
- `[account].domain` CLI қысқартулар мен мекенжай таңбалаушы кодтау арқылы қолданылады; каноникалық `AccountId` өзіндік доменсіз.
- `[account].public_key` және `[account].private_key` сауда-саттыққа қол қою.

Тіркелгі желіде болуы керек. Әдеттегі жергілікті желі үшін бұл жиынтықталған генез манифесті арқылы қарастырылады.

::: info Қиындықтың сезімталдығы

Iroha атаулары каноникалық талдаудан кейін жағдайға сезімтал. Мысалы, `wonderland.universal`, `Wonderland.universal` және `looking_glass.universal` - бөлек домендік сөздіктер.

:::

## Негізгі аутентификация {#basic-authentication}

`[basic_auth]` бөлімінде клиенттің сұрақтарына HTTP `Authorization` тақырыбы қосылады. Iroha әріптестері осы сенімхаттарды тікелей түсінбейді; оларды Torii Nginx сияқты кері проксидің артында тұрған кезде қолданыңыз.

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

Біржолғы жергілікті желілер үшін Kagami артықшылығын қойыңыз, өйткені ол Iroha 3 конфигурациясын, генезін, скриптілерін және README сәйкес келетінін жазады:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Пайдаланылатын `./localnet/client.toml` CLI мен бірге:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
