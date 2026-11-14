---
translation_locale: ba
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Клиенттарҙың конфигурацияһы {#client-configuration}

Iroha CLI һәм SDK клиенттары TOML конфигурацияһын ҡуллана. Репозиторий ағымдағы дефолтты `defaults/client.toml` адресына ебәрә; генерацияланған урындағы селтәрҙәр шулай уҡ сығыу каталогына тап килә торған `client.toml` яҙып ҡуя.

::: details Клиенттарҙың конфигурацияһы өлгөһө

<<< @/snippets/client.template.toml

:::

## Төп өлкәләр {#core-fields}

Клиент конфигурацияһы кәм тигәндә сылбырҙы, уның селтәр идентификаторын, Torii нөктәһен, иҫәптең селтәр контекстын һәм ҡул ҡуйыу асҡысын билдәләй:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` тапшырылған операцияларҙың үҙ эсенә алған селтәрҙе һайлай.
- `network_id` — genesis-тан алынған һәм һәр ҡул ҡуйылған һорау бәйләнгән селтәр идентификаторы. `network_id` йәки `network_id_file`-дың теүәл береһен генә көйләгеҙ; төйөн был ҡиммәтте `GET /v1/accounts/capabilities` нөктәһендә иғлан итә.
- `torii_url` тигеҙлектәге мәрәйҙәр Torii HTTP API.
- `[account].chain_discriminant` селтәрҙең I105 иҫәп префиксын һайлай. Асыҡ селтәрҙәр уның урынына `[account].profile = "taira"` йәки `"minamoto"` ҡуллана ала. Икеһенең береһе талап ителә, ә каноник `AccountId` үҙе доменһыҙ.
- `[account].public_key` һәм `[account].private_key` транзакцияларға ҡул ҡуйыу өсөн ҡулланыла; `private_key_file` `private_key`-ты алмаштыра ала.

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

`iroha` CLI шулай уҡ урындағы сират торошо өсөн өҫтәмә `[connect]` бүлеген уҡый. Ҡабат ҡулланыла торған SDK конфигурацияһы уны ҡабул итмәй:

```toml
[connect]
queue_root = "./queue"
```

Эш ағымына клиент яғында сиратты ышаныслы һаҡлау кәрәк булғанда быны ҡулланығыҙ. `connect.queue_root`-тың ғәҙәттәге ҡиммәте — `~/.iroha/connect`, ә сағыштырма юл клиент TOML файлы булған каталогтан иҫәпләнә.

## Конфигурациялар булдырыу {#generating-configurations}

Бер тапҡыр ҡулланылған урындағы селтәрҙәр өсөн Kagami өҫтөнлөк бирә, сөнки ул Iroha 3 конфигурацияһын, генезисын, сценарийҙарҙы һәм README менән тура килә:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Яратҡан `./localnet/client.toml` менән CLI ҡулланыу:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
