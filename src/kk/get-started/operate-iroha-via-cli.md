---
translation_locale: kk
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 40714a6cd124d4b0342b0f6ecf321f286e714c0e236afd6fd7834c0cf0ad1165
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Iroha 3 бағдарламасын CLI арқылы іске қосыңыз {#operate-iroha-3-via-cli}

`iroha` бинарлық файлы — Iroha 3 пәрмен жолы клиенті. Оны тізілім күйін сұрау, транзакция жіберу және оператор соңғы нүктелерін тексеру үшін пайдаланыңыз.

## 1. Алдын ала талаптар {#_1-prerequisites}

Құжатталған бастапқы код ревизиясындағы Iroha көшірмесінен төрт торапты жергілікті желіні жасап, іске қосыңыз:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
./localnet/start.sh
```

Төмендегі мысалдар оның жасалған клиент конфигурациясын, `./localnet/client.toml` файлын пайдаланады.

## 2. Негізгі CLI Орнату {#_2-basic-cli-setup}

Жоғарғы деңгейдегі көмек көрсетіңіз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI келесі жоғарғы деңгейдегі командалық топтарға ұйымдастырылған:

- есептік жазбаларды оқу және өзгерту үшін `account`
- ортақ сүзгілері мен беттеуі бар шолғыш дерек ағындары үшін `explorer`
- транзакция күйі және көмекші әрекеттері үшін `tx`
- `ledger` блокчейн тіркемесінде оқу және жазу үшін
- триггерлерді оқу, жазу және орындау үшін `trigger`
- `ops` операторлық диагностикалау үшін
- `app` қосымшаға API көмекшілер
- келісімшарт шақырулары, көріністері және жергілікті жөндеу үшін `contract`; орналастыру үшін `kagami contract deploy` не `musubi deploy`
- `tools` диагностикалық және әзірлеуші құралдар үшін
- деректер кеңістігінің анықтамасын жоспарлау, қолдану және тексеру үшін `dataspace`
- Taira диагностикасы және есептік жазбаны жүйеге қосу үшін `taira`
- офлайн кодтағыштар, есептер және диагностика үшін `offline`
- Soracloud қолданба платформасының көмекші құралдары үшін `soracloud`
- SORA тізбекаралық хаттамасының оқу, аудару және дәлел әрекеттері үшін `sccp`

Транзакция жіберетін әр пәрменге `--fee-payer authority` сияқты айқын комиссия төлеуші қажет; CLI қол қою алдында нақты комиссия бағасын береді.

Адамға оқылатын оператор шығу үшін `--output-format text` қолданыңыз және қатал автоматтандыру режимі үшін `--machine` пайдаланыңыз.

## 3. Қоғамдық Taira Testnet-ті сынап көріңіз {#_3-try-the-public-taira-testnet}

Сіз жергілікті желі серігіне қосылмас бұрын немесе криптографиялық қолтаңба жасаудан бұрын тек оқу үшін Taira тексерулерін байқап көруге болады. Бұл командалар ашық Torii JSON маршруттарын қолданады және тесттік желі XOR жұмсамайды.

Taira мәртебесін тексеріңіз:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Аутентификацияланбаған оқырманға көрінетін домендерді тізімдеңіз:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Кейбір активтердің анықтамаларын және олардың ағымдағы жабдықталуын тізіп шығыңыз:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Егер сізде ағымдағы `iroha` бинарлық файл болса, Taira диагностикалық көмекшісін іске қосыңыз:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

`taira.client.toml` файлын қол қойылатын пәрмендерді сынауға дайын болғанда ғана жасаңыз. Конфигурация, тест токендерін беру және бастапқы тексеру үдерісі үшін [SORA Nexus деректер кеңістіктеріне қосылу](/kk/get-started/sora-nexus-dataspaces.md) бөлімін қараңыз. Есептік жазба токен беру қызметінен комиссия активін алғанша Taira желісінде жазу пәрмендерін орындамаңыз.

Комиссия төленетін кез келген Taira CLI мысалы үшін [Taira желісінде тестілік XOR алу](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) бөліміндегі дайындау қадамы бар токен беру үдерісімен қол қоюшыны қаржыландырып, кейін балансын тексеріңіз:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Тест токендерін беру маршруты `502` қайтарса, күтіп, қайталап көріңіз. Бұл — ашық тест желісінің қолжетімділік мәселесі, есептік жазба кілттерін қайта жасауға себеп емес.

Баланс көрінген соң жазуларды `--fee-payer authority` арқылы жіберіңіз. CLI қол қою алдында нақты комиссияны Taira комиссия активімен бағалайды:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. Базалық блокчейн тіркеу командалары {#_4-basic-ledger-commands}

Барлық домендерді тізімде:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

Қарапайым доменді жасау декларативті алиас жоспарлаушысын қолданады; `ledger domain` командасының `register` ішкі командасы жоқ. SDK немесе қосылу қызметіңізбен `docs.universal` үшін құпиясыз `AliasSetupPlanRequestV1` ниетті дайындап, содан кейін оны жоспарлап қолданыңыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Ниет деректер кеңістігінің ID-ін, канондық иеленуші есептік жазбаны, жалдау мерзімін және ағымдағы баға тексеру шартын бекітеді. Жоспарлаушы тірі күйді тексеріп, жіберілетін дәл атомдық `EnsureAlias` жоспарын қайтарады. Тексеру шарттарының мәндерін басқа желіден қолмен көшірмеңіз.

Қарапайым пинг транзакциясын жіберіңіз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

Жақындағы блокты оқыңыз немесе блок оқиғаларына жазылыңыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Оператор командалары {#_5-operator-commands}

Консенсус операторының пәрмендері рұқсат тізіміне енгізілген, тек орындау кезінде қолданылатын кілтті талап етеді. Оны `client.toml` ішінде сақтамаңыз; тек иесіне қолжетімді файлды абсолютті жолымен беріңіз:

```bash
# The generated localnet writes its allow-listed operator key here.
: "${OPERATOR_KEY_FILE:=$PWD/localnet/runtime/operator-signer.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

Биліксіз кезек, бағдарламалық процесс ағыны, сайлау және орындау жолының диагностикасы:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

Бекітілген консенсус арналары және осы түйін данасының күйі:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

Чейн ішіндегі келісім параметрлері:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. Келесі қайда бару керек {#_6-where-to-go-next}

- [SDK оқулықтар](/kk/guide/tutorials/)
- [Torii соңғы нүктелері](/kk/reference/torii-endpoints.md)
- [Iroha бинарларымен жұмыс істеу](/kk/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

Бастапқы кодтың жұмыс көшірмесінен толық Markdown анықтамасын шығару үшін орындаңыз:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
