---
translation_locale: kk
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: de608ef52ad3a999c0e253e6683e454f8f66f399a690dce4c2185c79d02334cd
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Транзакцияларды жіберу және тексеру {#submit-and-verify-transactions}

## Нәтиже {#outcome}

Taira транзакциясын алдын ала тексеріңіз, нақты комиссия бағасын қабылдаңыз, қол қойып жіберіңіз, Қолданылған соңғы мәртебені күтіңіз және криптографиялық хеш арқылы аяқталған транзакцияны тексеріңіз.

## Алдын ала шарттар {#prerequisites}

- [Taira-ға қосылу](./connect-to-taira.md) нұсқаулығы жасаған қаржыландырылған `taira.client.toml`, `taira-faucet-policy.json` және `TAIRA_ACCOUNT_ID`. Жазу операциялары `--fee-payer authority` пайдаланады; CLI қол қоюдан бұрын Taira ақы активіндегі нақты ақы бағасын алады.
- Ағымдағы `iroha` CLI және `jq`.
- Бір рет қолданылатын Taira криптографиялық қолтаңба. Оның кілтін немесе осы жазу командаларын Minamoto қайта қолданбаңыз.

## Қадамдар {#steps}

### 1. API соңғы нүктесін, авторизация басшысын және төлем балансын алдын ала тексеру {#_1-preflight-the-endpoint-authority-and-fee-balance}

Алдымен кезектің күй кескінін оқыңыз, содан кейін уәкілетті субъектінің ақы балансы көрінетінін дәлелдеңіз. Base58 актив анықтамасының ID-ін қосылу рецепті сақтаған faucet саясатынан оқыңыз.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet-policy.json)"

iroha --config ./taira.client.toml account get \
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
  tx ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

Бұл рецептте `--no-wait` пайдаланбаңыз. Команда сәтті протокол нәтижесі жазбас бұрын растауды күтеді.

### 3. Терминал бағдарламалық жасақтама жұмыс ағымының жағдайының өңделуін күтіңіз {#_3-wait-for-terminal-pipeline-state}

Сәттілікті HTTP қабылдауынан немесе кезекке қабылдаудан шығарудың орнына типтелген мәртебе көмекшісін пайдаланыңыз. `--wait` арқылы CLI нақты жаһандық мәртебені мезгіл-мезгіл сұрап отырады және тек тізілім күйімен расталған `Applied` түпкілікті күйінде ғана сәтті аяқталады.

```bash
iroha --config ./taira.client.toml \
  --machine \
  tx status \
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
  tx get --hash "$TAIRA_TX_HASH" \
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

Үш жазбаның барлығы бір хэш бойынша сәйкес келетінін және блок шолушысы `Rejected` емес, `Committed` деп хабарлайтынын тексеріңіз:

```bash
jq -e --arg hash "$TAIRA_TX_HASH" \
  '.hash == $hash and .terminal_kind == "Applied"' taira-final-status.json

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '(.hash | ascii_downcase | ltrimstr("hash:") | split("#")[0]) == $hash
      and .status == "Committed"'
```

Жіберу протоколының нәтижесі мен соңғы күйін тестілеу дәлелі ретінде сақтаңыз. Олар қол қойылған кілтті емес, қоғамдық транзакциялық материалдарды қамтиды.

## Ақауларды жою {#troubleshooting}

- HTTP `202` немесе кезекте тұрған күй тек қана қабылданғанын дәлелдейді. Қолданылған, Бас тартылған, Уақыты өткен немесе шектелген тайм-аутқа дейін терілген күйді бақылауды жалғастырыңыз.
- Егер тапсырманы жіберу криптографиялық хэшті қайтарғаннан кейін уақытынан кешіктірілсе, жаңа транзакция құрудан бұрын сол криптографиялық хэшті сұраңыз. Көрпей қайта жіберу жаңа ұсынылған және қол қойылған жүктемені жасайды.
- Ақы бағасы қол қоюдан бұрын қабылданбауы мүмкін. `--fee-payer authority` параметрін, уәкілетті субъектінің балансын, бапталған `chain` пен `network_id` мәндерін және `--metadata` ішінде `gas_asset_id` сияқты ақы кілті жоқ екенін тексеріңіз.
- `Rejected` әдетте нұсқаулықты тексеру, рұқсаттар, төлемдер немесе уақытша ескірген күйді білдіреді. Бұл сәтсіз орындалудың нақты дәлелі болып табылады және оны тасымалдауды қайта қайталау ретінде қайта жіктеу қажет емес.
- Шолушы `404` қолданылғаннан кейін дереу индекстену кешігуі болуы мүмкін. Оқуды қайтадан орындаңыз; транзакцияны қайта жібермеңіз.
- Егер артықшылықты нұсқау генерацияланған localnet-та жұмыс істесе, бірақ Taira оны қабылдамаса, дәл Taira рұқсатты немесе басқарылатын namespace тағайындауын алыңыз. Жергілікті нәтиже қоғамдық блокчейн желісінің уәкілетті субъектіні бермейді.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Транзакцияны жіберу және ақы-шақыртуын бекітілген бастапқы код нұсқасында іске асыру](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Транзакцияны растауды іске асыру және бекітілген бастапқы код нұсқасындағы тесттер](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/client.rs)
- [Келісім-шарттар](/kk/blockchain/transactions.md)
- [CLI нұсқаулық](/kk/get-started/operate-iroha-via-cli.md)
- [Torii API соңғы нүктелері](/kk/reference/torii-endpoints.md)
