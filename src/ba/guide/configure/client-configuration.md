---
translation_locale: ba
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Клиенттарҙың конфигурацияһы {#client-configuration}

Iroha CLI һәм SDK клиенттары TOML конфигурацияһын ҡуллана. Репозиторий ағымдағы дефолтты `defaults/client.toml` адресына ебәрә; генерацияланған урындағы селтәрҙәр шулай уҡ сығыу каталогына тап килә торған `client.toml` яҙып ҡуя.

::: details Клиенттарҙың конфигурацияһы өлгөһө

<<< @/snippets/client.template.toml

:::

## Төп өлкәләр {#core-fields}

Минималь клиент конфигурацияһы сылбырҙы, Torii һуңғы нөктәне һәм ҡул ҡуйыу иҫәбен билдәләй:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` тапшырылған операцияларҙың үҙ эсенә алған селтәрҙе һайлай.
- `torii_url` тигеҙлектәге мәрәйҙәр Torii HTTP API.
- `[account].domain` CLI ҡыҫҡа юлдар һәм адрес-селектор кодировкаһы менән ҡулланыла; каноник `AccountId` үҙе доменһыҙ була.
- `[account].public_key` һәм `[account].private_key` килешеүҙәренә ҡул ҡуйыу.

Хисап индерештең селтәрендә булыуы мотлаҡ. Тулай булмаған урындағы селтәр өсөн был тупланған генез манифесты менән эшләнә.

::: info Киҫәктең һиҙгерлеге

Iroha исемдәре каноник анализдан һуң осраҡҡа ҡарата һиҙгер. Мәҫәлән, `wonderland.universal`, `Wonderland.universal` һәм `looking_glass.universal` айырым домен һүҙбәйләнештәре булып тора.

:::

## Төп идентификация {#basic-authentication}

Һайлаулы `[basic_auth]` бүлеге клиенттарҙың һорауҙарына HTTP `Authorization` башлыҡ өҫтәй. Iroha пирҙары был таныҡлыҡ документтарын туранан-тура аңлатмай; уларҙы Torii Нгинкс кеүек кире прокси артында булғанда ҡулланалар.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Транзакция параметрҙары {#transaction-settings}

Транзакция тәртибе `[transaction]` бүлеге менән конфигурациялана:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` - миллисекундтарҙа транзакция ваҡыты.
- `status_timeout_ms` клиенттың транзакция торошон күпме көткәнен контролдә тота.
- `nonce = true` клиенттан ҡабатланмаған транзакцияларҙың төрлө хештар тыуҙырыуын һораған.

## Кәрәкле сират көйләмәләрен тоташтырыу {#connect-queue-settings}

Хәҙерге Iroha клиенттары урындағы сират торошо өсөн `[connect]` бүлеген дә ҡуллана ала:

```toml
[connect]
queue_root = "./queue"
```

Эш ағымы клиент яғында оҙаҡҡа һуҙылған сират һаҡлауға мохтаж булғанда, уны ҡулланығыҙ.

## Конфигурациялар булдырыу {#generating-configurations}

Бер тапҡыр ҡулланылған урындағы селтәрҙәр өсөн Kagami өҫтөнлөк бирә, сөнки ул Iroha 3 конфигурацияһын, генезисын, сценарийҙарҙы һәм README менән тура килә:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Яратҡан `./localnet/client.toml` менән CLI ҡулланыу:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
