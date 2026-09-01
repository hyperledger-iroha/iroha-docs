---
translation_locale: kk
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3 бағдарламасын CLI арқылы іске қосыңыз {#operate-iroha-3-via-cli}

`iroha` бинарлы файлы — бұл Iroha 3 үшін командалық жол клиенті. Оны блокчейн жазбаларының күйін сұрау, транзакцияларды жіберу және оператор API ендіктерін тексеру үшін қолданыңыз.

## 1. Алдын ала талаптар {#_1-prerequisites}

Алдымен жергілікті желіні бастаңыз:

- [Жіберу Iroha 3](./launch-iroha.md)

Төмендегі мысалдар [Жіберу Iroha 3](./launch-iroha.md)-де құрылған localnet-тен шығарылған клиент конфигурациясын алатыны болжанады:

```bash
./localnet/client.toml
```

## 2. Негізгі CLI Орнату {#_2-basic-cli-setup}

Жоғарғы деңгейдегі көмек көрсетіңіз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI келесі жоғарғы деңгейдегі командалық топтарға ұйымдастырылған:

- `account` есеп шотына бағытталған тіркемелер үшін
- `tx` транзакция деңгейіндегі көмекшілер үшін
- `ledger` блокчейн тіркемесінде оқу және жазу үшін
- `ops` операторлық диагностикалау үшін
- `app` қосымшаға API көмекшілер
- `contract` келісімшартты орналастыру және техникалық шақырулар үшін
- `tools` диагностикалық және әзірлеуші құралдар үшін
- `taira` үшін Taira және Nexus-бағдарланған жұмыс процестері

`ledger` тобы сондай-ақ `ledger transaction` сияқты доменге тән транзакция көмегін қамтиды.

Адамға оқылатын оператор шығу үшін `--output-format text` қолданыңыз және қатал автоматтандыру режимі үшін `--machine` пайдаланыңыз.

## 3. Қоғамдық Taira Testnet-ті сынап көріңіз {#_3-try-the-public-taira-testnet}

Сіз жергілікті желі серігіне қосылмас бұрын немесе криптографиялық қолтаңба жасаудан бұрын тек оқу үшін Taira тексерулерін байқап көруге болады. Бұл командалар ашық Torii JSON маршруттарын қолданады және тесттік желі XOR жұмсамайды.

Taira мәртебесін тексеріңіз:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` деректер кеңістігінде қоғамдық домендерді тізімде:

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

`taira.client.toml`-ді тек қол қойылған командаларды тексеруге дайын болғанда жасаңыз. Конфигурация, тесттік желі қаржыландыру қызметі және канареевлік ағын үшін [SORA Nexus Деректер кеңістіктеріне қосылу](/kk/get-started/sora-nexus-dataspaces.md)-ды қараңыз. Тесттік желі қаржыландыру қызметінің төлем активімен есептік жазба толтырылғанша Taira-ге жазу командаларын орындамаңыз.

Кез келген төлем төленетін Taira CLI мысал үшін, [Taira сайтынан XOR тест желісін алыңыз](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) бастап тестнет қаржыландыру қызметінің көмегін `taira_faucet_claim.py` ретінде сақтаңыз, содан кейін тестнет XOR бірінші болып талап етіңіз:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Егер тестнет қаржыландыру қызметінің пәлсапалық немесе талап жолы `502` қайтаратын болса, күтіп, қайта әрекет жасаңыз. Бұл аккаунт кілттерін қайта жасау сигнал емес, ашық тестнеттің қолжетімділік мәселесі.

Шот теңгерімі көрінгеннен кейін, жазбаларға төлем активінің метадеректерін қосыңыз:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Базалық блокчейн тіркеу командалары {#_4-basic-ledger-commands}

Барлық домендерді тізімде:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Қарапайым доменді жасау декларативті алиас жоспарлаушысын қолданады; `ledger domain` командасының `register` ішкі командасы жоқ. SDK немесе қосылу қызметіңізбен `docs.universal` үшін құпиясыз `AliasSetupPlanRequestV1` ниетті дайындап, содан кейін оны жоспарлап қолданыңыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Ниет деректер кеңістігінің идентификаторын, бір протоколдық стандарттағы иесі бар есепшотты, жалға алу мерзімін және ағымдағы төлем-бақылау қорғанысын бекітеді. Жоспарлаушы тірі күйді тексереді және жіберуге арналған нақты атомдық `EnsureAlias` жоспарын қайтарады. Басқа желіден қорғаныс мәндерін қолмен көшіруге болмайды.

Қарапайым пинг транзакциясын жіберіңіз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Жақындағы блокты оқыңыз немесе блок оқиғаларына жазылыңыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Оператор командалары {#_5-operator-commands}

Консенсус операторының командалары рұқсат етілген тізімде тұрған бағдарламалық қамтамасыз ету орындау ортасының кілтін қажет етеді. Оны `client.toml` ішінде ұстаңыз және тек иесіне арналған файлды нақты көрсетіңіз:

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

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

Ең жоғары және құлыпталған консенсус кворумы сертификаттары:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
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
- [Torii API соңғы нүктелері](/kk/reference/torii-endpoints.md)
- [Iroha бинарларымен жұмыс істеу](/kk/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

Дереккөз кодының жұмыс көшірмесінен толық Markdown көмек нүктелік уақытта деректер көрінісін қалпына келтіру үшін келесі команданы орындаңыз:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
