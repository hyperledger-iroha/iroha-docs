---
translation_locale: ba
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Клиенттарҙың конфигурацияһы {#client-configuration}

Iroha CLI һәм SDK клиенттар ҡуллана TOML конфигурация. репозиторий хәҙерге дефолт адресын `defaults/client.toml`; генерацияланған урындағы селтәрҙәр шулай уҡ тап килә яҙыу `client.toml` сығарыу каталогына индерелгән.

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
- `[account].domain` ҡулланыла CLI ҡыҫҡа юлдар һәм адрес-селектор кодировкаһы; каноник `AccountId` үҙенән-үҙе доменһыҙ.
- `[account].public_key` һәм `[account].private_key` килешеүҙәренә ҡул ҡуйыу.

Хисап индерештең селтәрендә булыуы мотлаҡ. Тулай булмаған урындағы селтәр өсөн был тупланған генез манифесты менән эшләнә.

::: info Киҫәктең һиҙгерлеге

Iroha исемдәр каноник анализдан һуң осраҡҡа һиҙгер. Мәҫәлән, `wonderland.universal`, `Wonderland.universal`, һәм `looking_glass.universal` айырым доменлы һүҙбәйләнештәр булып тора.

:::

## Төп идентификация {#basic-authentication}

Факультатив `[basic_auth]` бүлеге өҫтәмә HTTP `Authorization` клиенттарҙың үтенестәренә башлыҡ. Iroha тиҫтерҙәре был таныҡлыҡ документтарын туранан-тура аңлатмай; уларҙы ҡулланғанда Torii Нгинкс кеүек кире прокси артында тора.

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
- `nonce = true` клиенттан ҡабатланмаған транзакцияларҙың төрлө хэштегтар тыуҙырыуын һораған.

## Кәрәкле сират көйләмәләрен тоташтырыу {#connect-queue-settings}

Хәҙерге Iroha клиенттары урындағы сират торошо өсөн `[connect]` бүлеген дә ҡуллана ала:

```toml
[connect]
queue_root = "./queue"
```

Эш ағымы клиент яғында оҙаҡҡа һуҙылған сират һаҡлауға мохтаж булғанда, уны ҡулланығыҙ.

## Конфигурациялар булдырыу {#generating-configurations}

Бер тапҡыр ҡулланыла торған урындағы селтәрҙәр өсөн Kagami сөнки ул тап килә тип яҙа Iroha 3 конфигурация, генезис, сценарийҙар һәм README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Яратҡан `./localnet/client.toml` менән CLI ҡулланыу:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
