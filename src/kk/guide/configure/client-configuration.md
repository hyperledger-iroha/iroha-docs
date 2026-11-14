---
translation_locale: kk
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Клиент конфигурациясы {#client-configuration}

Iroha, CLI және SDK клиенттері TOML конфигурациясын қолданады. Репозиторий ағымдағы әдепкі мәнді `defaults/client.toml` мекенжайы бойынша жеткізеді; жасалған локалды желілер де шыққан қалтасына сәйкес `client.toml` жазады.

::: details Клиент конфигурациясы үшін шаблон

<<< @/snippets/client.template.toml

:::

## Негізгі өрістер {#core-fields}

Клиент конфигурациясы кем дегенде тізбекті, оның желілік сәйкестігін, Torii соңғы нүктесін, есептік жазбаның желілік контекстін және қол қою кілтін анықтайды:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` жіберілген транзакциялардың қай тізбекке жататынын таңдайды.
- `network_id` — әр қол қойылған сұрау байланатын, генезистен туындайтын желілік сәйкестік. `network_id` не `network_id_file` параметрінің дәл біреуін баптаңыз; түйін мәнді `GET /v1/accounts/capabilities` арқылы жариялайды.
- `torii_url` желідегі әріптес Torii HTTP API көрсетеді.
- `[account].chain_discriminant` желінің I105 есептік жазба префиксін таңдайды. Ашық желілер оның орнына `[account].profile = "taira"` не `"minamoto"` пайдалана алады. Осы екі тәсілдің бірі міндетті; канондық `AccountId` өзі доменсіз.
- `[account].public_key` және `[account].private_key` транзакцияларға қол қоюға қолданылады; `private_key_file` параметрі `private_key` орнына беріле алады.

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

`iroha` CLI жергілікті кезек күйіне арналған міндетті емес `[connect]` бөлімін де оқиды. Қайта пайдаланылатын SDK конфигурациясы оны қабылдамайды:

```toml
[connect]
queue_root = "./queue"
```

Үдеріс клиент жағында кезекті тұрақты сақтауды қажет етсе, осыны пайдаланыңыз. `connect.queue_root` әдепкіде `~/.iroha/connect` болады; салыстырмалы жол клиенттің TOML файлы орналасқан каталогқа қатысты шешіледі.

## Конфигурацияларды жасау {#generating-configurations}

Уақытша жергілікті желілер үшін Kagami-ті таңдаңыз, себебі ол сәйкес Iroha 3 конфигурацияларын, блокчейн бастауларын, скрипттерді және README жазады:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Жасалған `./localnet/client.toml`-ты CLI-мен пайдаланыңыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
