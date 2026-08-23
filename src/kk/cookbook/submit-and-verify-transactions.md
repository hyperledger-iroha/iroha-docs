---
translation_locale: kk
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: e07cc42a3fd5579db312bfbfbb8010f473062edebe0141eb9bb8c2a0e7faa4da
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Транзакцияны тапсыру және тексеру {#submit-and-verify-transactions}

## Нәтижесі {#outcome}

Taira транзакциясын алдын ала орындау, нақты алымды қабылдау, оған қол қою және тапсыру, Қолданылған аяқталуды күту және жасалған транзакцияны хэш арқылы тексеру.

## Алдын ала талаптар {#prerequisites}

- `taira.tx-metadata.json` және `TAIRA_ACCOUNT_ID` қаржыландырылған `taira.client.toml`, [мен байланысқан Taira](./connect-to-taira.md).
- Ағымдағы `iroha` CLI және `jq`.
- Біржолғы Taira қолтаңбалаушы. оның кілтін немесе осы бұйрықтарды Minamoto жазуға қайта қолданбаңыз.

## Қадамдар {#steps}

### 1. Мақсатты, билікті және ақы балансын алдын ала анықтау {#_1-preflight-the-endpoint-authority-and-fee-balance}

Алдымен кезек кескінін оқыңыз, содан кейін уәкілетті органның алым балансының көрінетіндігін дәлелдеңіз. Байланыс рецепті арқылы туылған метамәліметтерден Base58 активтің анықтамасы ID оқыңыз.

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

Егер шоттың немесе алымның қалтасы жоқ болса, тоқтаңыз. Дұрыс нұсқау ақысын төлей алмайтын болса, ол алымды тапсыра алмайды.

### 2. Бір рет цитата, қол қойыңыз және тапсырыңыз {#_2-quote-sign-and-submit-once}

CLI нақты қолтаңбаланбаған пайдалы жүктемені комиссиялық цитата үшін жібереді, қабылданған төлем ниетімен транзакцияға байланыстырады, қол қояды және тапсырады. JSON режимі транзакция хэшін, қол қойылған транзакцияны және қабылданған цитатты біріктіреді.

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

Бұл рецептте `--no-wait` қолданбаңыз. Команда сәтті квитанция жазудан бұрын растауды күтеді.

### 3. Терминалдық құбырдың жай-күйін күту {#_3-wait-for-terminal-pipeline-state}

HTTP қабылдауынан немесе кезек кіруінен табысты қорытындылаудың орнына түрленген мәртебе көмекшісін пайдаланыңыз. `--wait` көмегімен қауіпсіз бағыт беру ауқымы автоматты түрде таңдалады және әдеттегі мақсат - Қолданылған аяқталу.

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

`Rejected` және `Expired` терминалдық сәтсіздік болып табылады, қайта қалпына келтірілетін табыс жағдайлары емес. Транзакцияны өзгерту немесе қайта құрудан бұрын олардың себебін жаз.

### 4. сақтаулы транзакцияны оқыңыз. {#_4-read-the-stored-transaction}

Құбырдың жай-күйі өңдеудің аяқталғанына жауап береді. Транзакция сұранысы рұқсат етілген транзакцияның бір хош астында сақталғандығын растайды.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Эксплуатор - екінші, тек оқуға арналған бақылау беті. Ол құбырдың түпкіліктілігінен біраз артта қалуы мүмкін.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Мемлекетті өзгерту нұсқаулығы үшін, өзгертілген объекті туралы сұрау салумен аяқтаңыз. [ Метадеректер](./metadata.md), [Шұқырлы активтер](./fungible-assets.md) және [NFTs](./nfts.md) рецепттері осы мемлекетті оқуларды қамтиды.

## Тексеру {#verify}

Үш жазбаның да бір-біріне сәйкес келе жатқанын тексеріңіз және зерттеуші кезек күттірмейтін жағдайды баяндайды:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Қолтаңбалау кілті емес, мемлекеттік транзакция материалдарын қамтитын тапсырыстың квитанциясы мен түпкілікті жағдайы сынақ дәлелі ретінде сақталсын.

## Қиындықтарды шешу {#troubleshooting}

- HTTP `202` немесе кезектелген мәртебе тек қабылдауды дәлелдейді. Қолданылған, бас тартылған, мерзімі өткен немесе шектелген уақыт аралығы жеткенше түрленген мәртебеге сайлауды жалғастырыңыз.
- Егер hash-ті қайтарғаннан кейін тапсыру мерзімі аяқталса, басқа транзакцияны жасаудан бұрын осы хештан сұраңыз. Көзсіз қайта тапсыру жаңа цитаталанған және қол қойылған пайдалы жүктемені пайда етеді.
- Төлемақы ұсынысын қолтаңбалаудан бұрын бас тартуға болады. `--fee-payer authority`, `gas_asset_id`, органның балансы және желі тізбекін тексеру ID.
- `Rejected` әдетте нұсқаулықтарды бекітуді, рұқсаттарды, алымдарды немесе бос күйді көрсетеді. Бұл орындау сәтсіздігіне дәлел болып табылады және тасымалдаудың қайта сыналуы ретінде қайта жіктелуі керек емес.
- Қолданылғаннан кейін бірден іздеуші `404` индексациялау кешіктірілуі мүмкін. Оқылуды қайталап көріңіз; транзакцияны қайта ұсынбаңыз.
- Егер артықшылықты нұсқаулық құрылған локальдық желіде жұмыс істесе, бірақ Taira оны бас тартса, нақты Taira рұқсатын немесе басқарулы атау кеңістігін беруді алыңыз.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [Транзакцияны тапсыру және бекітілген міндеттеме бойынша алым квотасын іске асыру ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Транзакцияны растау тестілеулері түймеленген міндеттемеде](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/tests/tx_confirmation.rs)
- [Транзакциялар](/kk/blockchain/transactions.md)
- [CLI нұсқаулығы](/kk/get-started/operate-iroha-via-cli.md)
- [Torii аяқтық нүктелері](/kk/reference/torii-endpoints.md)
