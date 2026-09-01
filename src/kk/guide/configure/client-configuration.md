---
translation_locale: kk
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Клиент конфигурациясы {#client-configuration}

Iroha, CLI және SDK клиенттері TOML конфигурациясын қолданады. Репозиторий ағымдағы әдепкі мәнді `defaults/client.toml` мекенжайы бойынша жеткізеді; жасалған локалды желілер де шыққан қалтасына сәйкес `client.toml` жазады.

::: details Клиент конфигурациясы үшін шаблон

<<< @/snippets/client.template.toml

:::

## Негізгі өрістер {#core-fields}

Кем дегенде, клиент конфигурациясы тізбекті, Torii API соңғы нүктені және қол қою есепшотын анықтайды:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` жіберілген транзакциялардың қай тізбекке жататынын таңдайды.
- `torii_url` желідегі әріптес Torii HTTP API көрсетеді.
- `[account].domain` CLI қысқартулары мен мекен-жай таңдамасын кодтау үшін қолданылады; бір ғана протокол-стандарт `AccountId` өзі доменсіз болып табылады.
- `[account].public_key` және `[account].private_key` транзакцияларды қол қояды.

Аккаунт қазірдің өзінде блокчейнде болуы керек. Әдепкі жергілікті желі үшін бұл жинақталған блокчейн генезисінің техникалық манифесті арқылы жүзеге асырылады.

::: info Үлкен және кіші әріптер сезімталдығы

Iroha атаулары бір протокол-стандартын бір рет талдағаннан кейін регистрге сезімтал болады. Мысалы, `wonderland.universal`, `Wonderland.universal`, және `looking_glass.universal` бөлек домендік литералдар болып табылады.

:::

## Негізгі аутентификация {#basic-authentication}

Қалаулы `[basic_auth]` бөлім клиент сұрауларына HTTP `Authorization` тақырыбын қосады. Iroha желі әріптестері осы куәліктерді тікелей өңдемейді; оларды Torii Nginx сияқты кері прокси артында болғанда пайдаланыңыз.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Транзакция параметрлері {#transaction-settings}

Өткізу әрекеті `[transaction]` бөлімі арқылы бапталады:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` - транзакцияның өмір сүру ұзақтығы миллисекундпен.
- `status_timeout_ms` клиенттің транзакция статусын күту уақытының ұзақтығын басқарады.
- `nonce = true` клиенттен қайталанатын транзакциялар әр түрлі криптографиялық хэштер тудырсын деп криптографиялық nonce мәнін қосуды сұрайды.

## Кезекке қосу параметрлері {#connect-queue-settings}

Ағымдағы Iroha клиенттері жергілікті кезек күйі үшін міндетті емес `[connect]` бөлімін де пайдалана алады:

```toml
[connect]
queue_root = "./queue"
```

Бұл жергілікті клиент жағының тұрақты кезек сақтау қажет болғанда қолданылады.

## Конфигурацияларды жасау {#generating-configurations}

Уақытша жергілікті желілер үшін Kagami-ті таңдаңыз, себебі ол сәйкес Iroha 3 конфигурацияларын, блокчейн бастауларын, скрипттерді және README жазады:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Жасалған `./localnet/client.toml`-ты CLI-мен пайдаланыңыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
