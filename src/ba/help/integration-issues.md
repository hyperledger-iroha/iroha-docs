---
translation_locale: ba
translation_source: /help/integration-issues.md
translation_source_hash: 2146a236adb3a3b3b896a1992daeecf6713988183ca53e4412f9b616ed2e9085
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Интеграцияға бәйле проблемаларҙы хәл итеү {#troubleshooting-integration-issues}

Был бүлектә Iroha 3 интеграцияһы өсөн проблемаларҙы хәл итеү буйынса кәңәштәр бирелә. Әгәр һеҙ кисергән мәсьәлә бында һүрәтләнмәгән икән, беҙгә [Telegram](https://t.me/hyperledgeriroha) аша мөрәжәғәт итегеҙ.

## Клиент тоташтыра алмай {#client-cannot-connect}

Клиенттың конфигурацияһы Torii адресына йүнәлтелгәнлеген тикшерегеҙ:

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI тикшереүҙәр өсөн, шул уҡ файлды асыҡтан-асыҡ тапшырығыҙ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

Әгәр пирҙар килеп инһә Docker йәки Kubernetes, клиент процесы менән барып етә торған хост йәки сервис адресын ҡулланырға. `127.0.0.1` контейнер эсендә - хост машина түгел.

Taira асыҡ һынауҙар өсөн, ҡултамғаланмаған һуңғы һыҙат менән башларға кәрәк:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Әгәр был командалар `502`, TLS, DNS йәки ваҡыт үтеү ҡағиҙәләре боҙолһа, селтәргә барып етеү мөмкинлеген төҙәтегеҙ йәки иҫәп-хисап асҡыстарын йәки транзакция йөкләмәләрен дебгургар алдынан асыҡ тест селтәре һуңғы нөктәһен көтөргә кәрәк.

## Транзакциялар кире ҡағыла . {#transactions-are-rejected}

Транзакцияларҙың күпселек уңышһыҙлыҡтары идентификация йәки авторизацияның тап килмәүе арҡаһында була:

- клиент конфигурацияһындағы иҫәп-хисап асыҡ асҡысы ҡулланма өсөн ҡулланылған шәхси асҡыс менән тап килмәй.
- иҫәп яҙмаһы генезиста йәки элекке транзакция менән теркәлмәгән
- аккаунтҡа идара итеү ваҡытын раҫлаусы талап ителгән рөхсәт билдәһе йәки роле юҡ
- домен идентификаторында, мәҫәлән, `domain.dataspace` формаһындағы мәғлүмәт киңлеге аныҡлауы етмәй

`--output-format text` ҡағиҙәләрен дебэглағанда CLI ҡушымтаһын ҡулланығыҙ, шуға күрә хаталарҙы уҡыу еңелерәк:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority --output-format text tx ping --msg "hello"
```

## Һорауҙар буш һөҙөмтәләр бирә {#queries-return-empty-results}

Буш һорау һөҙөмтәләре һәр саҡ һорауға уңышһыҙлыҡ килтермәй.

- объектты барлыҡҡа килтерергә тейешле операция башҡарылған
- Һорауланған домен, активтар билдәләмәһе йәки иҫәп-хисап ID каноник
- ҡағыҙлау йәки фильтрҙар көтөлгән сиратты ситләтмәй
- клиент тәғәйенләнгән селтәр менән тоташтырылған, башҡа локаль селтәр түгел

Домен тикшереүҙәр өсөн иң киң һорау менән башларға кәрәк:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

## Ваҡиғалар йәки блоктар ағымдары иртәрәк туҡтай {#event-or-block-streams-stop-early}

Блок һәм ваҡиға ағымдары миҫалдары Torii-ның ағым нөктәләренә таяна. Тиңдәштең әле лә эшләүен тикшерегеҙ, һуңынан ваҡыт сиге ҡуйып һынағыҙ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP интеграциялары өсөн һуңғы нөктә юлдары менән ағымдағы [Torii һуңғы нөккә йүнәлеше](/ba/reference/torii-endpoints.md) сағыштырығыҙ.
