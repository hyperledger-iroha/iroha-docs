---
translation_locale: kk
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Транзакцияларды жіберу және тексеру {#submit-and-verify-transactions}

## Нәтиже {#outcome}

Taira транзакциясын алдын ала тексеріңіз, нақты комиссия бағасын қабылдаңыз, қол қойып жіберіңіз, Қолданылған соңғы мәртебені күтіңіз және криптографиялық хеш арқылы аяқталған транзакцияны тексеріңіз.

## Алдын ала шарттар {#prerequisites}

- Қаржыландырылған `taira.client.toml`, `taira.tx-metadata.json` және `TAIRA_ACCOUNT_ID`, [Taira құрылғысына қосылу](./connect-to-taira.md) шығарған.
- Ағымдағы `iroha` CLI және `jq`.
- Бір рет қолданылатын Taira криптографиялық қолтаңба. Оның кілтін немесе осы жазу командаларын Minamoto қайта қолданбаңыз.

## Қадамдар {#steps}

### 1. API соңғы нүктесін, авторизация басшысын және төлем балансын алдын ала тексеру {#_1-preflight-the-endpoint-authority-and-fee-balance}

Алдымен кезек нүктелік уақыт деректер көрінісін оқып шығыңыз, содан кейін рұқсаты бар тұлғаның төлем қалдығы көрінетінін дәлелдеңіз. Қосылу рецепті арқылы жасалған метадеректерден Base58 активтерін анықтау идентификаторын оқыңыз.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Егер есепшот немесе төлем балансы жоқ болса, тоқтаңыз. Рұқсат етілген негізгі тұлға төлемді төлей алмайтын кезде жарамды нұсқау төлем қабылдаудан өте алмайды.

### 2. Бағаны шығарып, қол қойып, бір рет жіберу {#_2-quote-sign-and-submit-once}

CLI төлем бағасын болжау үшін дәл қол қойылмаған жүктемені жібереді, қабылданған төлем ниетін транзакцияға байланыстырады, қол қояды және жібереді. JSON режимі транзакцияның криптографиялық хэшін, қол қойылған транзакцияны және қабылданған ұсынысты бірге қайтарады.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

Бұл рецептте `--no-wait` пайдаланбаңыз. Команда сәтті протокол нәтижесі жазбас бұрын растауды күтеді.

### 3. Терминал бағдарламалық жасақтама жұмыс ағымының жағдайының өңделуін күтіңіз {#_3-wait-for-terminal-pipeline-state}

Сәттілікті HTTP қабылдау немесе кезекке қосу арқылы болжаудың орнына терілген күй көмекшісін пайдаланыңыз. `--wait` көмегімен қауіпсіз бағыттау ауқымы автоматты түрде таңдалады және әдепкі мақсат Қолданылған аяқталу болып табылады.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` және `Expired` қайта әрекет етуге болатын сәттіліктің күйі емес, соңғы сәтсіздіктер болып табылады. Транзакцияны өзгертемес бұрын немесе қайта жасамас бұрын олардың себебін жазып алыңыз.

### 4. Сақталған транзакцияны оқу {#_4-read-the-stored-transaction}

Бағдарламалық қамтамасыз етуді өңдеу жұмыс процесінің күйі өңдеудің аяқталғанын білдіреді. Транзакцияны сұрау қабылданған транзакцияның сол криптографиялық хэш бойынша сақталғанын тексереді.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Шолушы — бұл екінші, тек оқу үшін арналған бақылау беті. Ол бағдарламалық жасақтама өңдеу жұмыс процесінің соңынан сәл кешігуі мүмкін.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Мемлекетті өзгертетін нұсқа үшін, өзгертілген объектіні сұраумен аяқтаңыз. [Метадеректер](./metadata.md), [Ауыстырылатын мүлік](./fungible-assets.md) және [NFTs](./nfts.md) рецепттері осындай соңғы күйді оқуыларды қамтиды.

## Растау {#verify}

Барлық үш жазба бір криптографиялық хэшке сәйкес екенін және шолушының енді күтілуде деп көрсетпейтінін тексеріңіз:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Жіберу протоколының нәтижесі мен соңғы күйін тестілеу дәлелі ретінде сақтаңыз. Олар қол қойылған кілтті емес, қоғамдық транзакциялық материалдарды қамтиды.

## Ақауларды жою {#troubleshooting}

- HTTP `202` немесе кезекте тұрған күй тек қана қабылданғанын дәлелдейді. Қолданылған, Бас тартылған, Уақыты өткен немесе шектелген тайм-аутқа дейін терілген күйді бақылауды жалғастырыңыз.
- Егер тапсырманы жіберу криптографиялық хэшті қайтарғаннан кейін уақытынан кешіктірілсе, жаңа транзакция құрудан бұрын сол криптографиялық хэшті сұраңыз. Көрпей қайта жіберу жаңа ұсынылған және қол қойылған жүктемені жасайды.
- Төлем бағасын алдын ала баға беру қол қою алдында қабылданбауы мүмкін. `--fee-payer authority`, `gas_asset_id`, авторизация ұсынушының балансы және желі тізбегі идентификаторын тексеріңіз.
- `Rejected` әдетте нұсқаулықты тексеру, рұқсаттар, төлемдер немесе уақытша ескірген күйді білдіреді. Бұл сәтсіз орындалудың нақты дәлелі болып табылады және оны тасымалдауды қайта қайталау ретінде қайта жіктеу қажет емес.
- Шолушы `404` қолданылғаннан кейін дереу индекстену кешігуі болуы мүмкін. Оқуды қайтадан орындаңыз; транзакцияны қайта жібермеңіз.
- Егер артықшылықты нұсқау генерацияланған localnet-та жұмыс істесе, бірақ Taira оны қабылдамаса, дәл Taira рұқсатты немесе басқарылатын namespace тағайындауын алыңыз. Жергілікті нәтиже қоғамдық блокчейн желісінің уәкілетті субъектіні бермейді.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Транзакцияны жіберу және ақы-шақыртуын бекітілген бастапқы код нұсқасында іске асыру](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Транзакцияны растауды іске асыру және бекітілген бастапқы код нұсқасындағы тесттер](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [Келісім-шарттар](/kk/blockchain/transactions.md)
- [CLI нұсқаулық](/kk/get-started/operate-iroha-via-cli.md)
- [Torii API соңғы нүктелері](/kk/reference/torii-endpoints.md)
