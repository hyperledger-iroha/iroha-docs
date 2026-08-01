---
translation_locale: kk
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 арқылы CLI {#operate-iroha-3-via-cli}

`iroha` бинар - бұл Iroha 3 команда жолы клиенті. Оны бас кітапшасының жай-күйін сұрауға, транзакцияларды беруге және оператордың соңғы нүктелерін тексеруге қолданыңыз.

## 1. Алдын ала талаптар {#_1-prerequisites}

Біріншіден жергілікті желіді бастаңыз:

- [Ұшыру Iroha 3](./launch-iroha.md)

Төменде келтірілген мысалдар [Launch Iroha 3](./launch-iroha.md)-да құрылған локальдік желіден пайда болған клиент конфигурациясын болжайды:

```bash
./localnet/client.toml
```

## 2. Негізгі CLI орнату {#_2-basic-cli-setup}

Ең жоғары деңгейдегі көмек көрсету:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI осы жоғары деңгейдегі командалық топтарға ұйымдастырылған:

- `account` шотқа бағдарланған қысқартулар үшін
- `tx` операциялық деңгейдегі көмекшілер үшін
- `ledger` бухгалтерлік есептің оқу-жазуы үшін
- `ops` операторлардың диагностикасы үшін
- `app` қосымшаға API көмекшілер үшін
- `contract` келісімшартты іске қосу және шақыру үшін
- `tools` диагностикалық және әзірлеушілік құралдар үшін
- `taira` үшін Taira және Nexus-бағдарланған жұмыс жүрістері

`ledger` тобында сондай-ақ `ledger transaction` сияқты доменге тән транзакция көмекшілері бар.

Адамға оқуға болатын оператордың шығысы үшін `--output-format text` және қатаң автоматтандыру режимі үшін `--machine` пайдалану.

## 3. Қоғамдық Taira тест желісін сынап көріңіз {#_3-try-the-public-taira-testnet}

Жергілікті теңгерімді орындау немесе қолтаңбалаушы құрудан бұрын сіз тек оқуға арналған Taira тексерістерін сынап көре аласыз. Бұл командалар қоғамдық Torii JSON бағыттарын пайдаланады және тест-нет XOR жұмсамайды.

Taira денсаулығын тексеру:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` деректер кеңістігіндегі мемлекеттік домендерді тізбектеңіз:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Бірнеше активтердің анықтамаларын және олардың ағымдағы ұсыныстарын келтіріңіз:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Егер сізде ағымдағы `iroha` бинар болса, Taira диагностикалық көмекшісін орындаңыз:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Жарату `taira.client.toml` Тек қолтаңбаланған командаларды сынауға дайын болған кезде ғана. [Қосылу SORA Nexus Деректер базасы](/kk/get-started/sora-nexus-dataspaces.md) конфигурация, кран және канар ағыны үшін. Taira банктік есепшоттың қаржыландырылуы үшін.

Барлық ақы төлеу үшін Taira CLI мысалы, кранның көмекшісін [Тестнет-ті алу XOR бойынша Taira](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ретінде `taira_faucet_claim.py`, содан кейін талап ету сынақ желісі XOR Біріншісі:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Егер кранның жұмбағы немесе талап ету бағыты `502` қайтарса, күтіңіз және қайталап көріңіз. Бұл ашық тесттік желілердің қолжетімділігі мәселесі болып табылады, бұл шоттың кілттерін қалпына келтіру сигналы емес.

Баланс көрінетіннен кейін, алым активінің метамәдени деректерін қоса отырып, былай деп жазады:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Негізгі кітапша командалары {#_4-basic-ledger-commands}

Барлық домендерді келтіріңіз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Әдеттегі доменді құру декларативтік псевдонистік жоспарлаушыны пайдаланады; `ledger domain` командасы жоқ `register` Бас командир, құпиясыз жасақ дайындаңыз. `AliasSetupPlanRequestV1` мақсат `docs.universal` Сіздің SDK немесе борттық қызмет көрсету, содан кейін оны жоспарлап және қолдану:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Мақсат піндер деректер кеңістігі ID, каноникалық меншік иесі тіркелгісі, жалға беру мерзімі және ағымдағы цитатаны қорғау. Жоспарлаушы тірі күйін тексереді және тапсыру үшін нақты атомдық `EnsureAlias` жоспарды қайтарады. Басқа желіден сақтайтын мәндерді қолмен көшірмелеңіз.

Жөнөкөй транзакцияны жіберіңіз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Соңғы блокты оқыңыз немесе блок оқиғаларына жазылыңыз:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Операторлық командалар {#_5-operator-commands}

Консенсус жағдайы:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

Бөлшектегі ұзақылық кескіндері:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

Қолжетімділік, жинақшы, RBC артта қалу және VRF шұғыл сурет:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

Желідегі консенсус параметрлері:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. Келесі жолы қайда? {#_6-where-to-go-next}

- [SDK оқулықтары](/kk/guide/tutorials/)
- [Torii аяқтық нүктелері](/kk/reference/torii-endpoints.md)
- [Iroha бинарларымен жұмыс істеу](/kk/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Бастапқы кассадан толық "Markdown" көмегін түсіру үшін мынаны орындаңыз:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
