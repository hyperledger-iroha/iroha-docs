---
translation_locale: kk
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Домендер {#domains}

Домендер `World` деректерінде тіркелген атау кеңістіктер болып табылады. Қазіргі Iroha 3 дерек үлгісінде домен өзінің аналық деректер кеңістігі арқылы белгіленеді, сондықтан каноникалық сәйкестендіруші:

```text
domain.dataspace
```

Мысалы, `payments.universal` атаулары `payments` домен ішінде `universal` деректер кеңістігі.

## Құрылымы {#structure}

Тіркелген `Domain` құрамында:

- `id`: деректер кеңістігі бойынша білікті `DomainId`
- `logo`: ерікті `SoraFS` URI домен логотипі үшін
- `metadata`: кездейсоқ кілт-бағалы метамәліметтер
- `owned_by`: доменге иелік ететін шот, әдетте оны тіркеген шот

Доменді материализациялау үшін қолданылатын ботстрап пайдалы жүктемесі: `NewDomain`. Ол `id`, параметрлері `logo`, және бастапқы `metadata`. Жүру уақыты толтырады `owned_by` Әдеттегі клиенттер бұл жүктемені тікелей ұсынбайды.

## Тіркеу {#registration}

Әдеттегі доменді құру декларативті псевдонимді орнату ағынын пайдаланады. SNS жалға беру, меншік иесінің мүмкіндіктері, цитатаны қорғау және бір атомдағы домен тізімі `EnsureAlias` транзакция. `Register::Domain` тұқымдық / ботстрап беті болып қала береді, және `ledger domain` командасы жоқ `register` Жоғарғы команда.

Жасырынсыз жасаңыз `AliasSetupPlanRequestV1` мақсатпен SDK немесе бордталу қызметі, содан кейін CLI Оны тірі күйге қарсы жоспарлаңыз және дәл осы жоспарды ұсын:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Мақсат анықталады `payments.universal`, оның сандық деректер кеңістігі, каноникалық I105 иесі, жалға алу мерзімін және ағымдағы саясат/төлем бағасын сақтау. `POST /v1/aliases/setup/plan`; оның қайтару жоспары тізбекті, билік, мемлекет және мерзімге байланысты. [`Unregister`](/kk/blockchain/instructions.md#un-register).

Доменді құру немесе алып тастау үшін активті жұмыс уақытын растаушы бойынша тиісті домендерді басқару рұқсаты қажет. [`SetKeyValue` және `RemoveKeyValue`](/kk/blockchain/instructions.md#setkeyvalue-removekeyvalue) егер билік осы доменді өзгертуге рұқсат алған болса.

## Taira арқылы сынап көріңіз. {#try-it-on-taira}

Қоғамдық Taira тестілеу желісінде қазіргі уақытта көрінетін домендерді келтіріңіз:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Қоғамдық жол каталогын деректер кеңістігінің аты-жөніне көшіру:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Қолданба доменнің бар-жоғын тексеру үшін бірінші команданы пайдаланыңыз. Деректер кеңістігінің қоғамдық, шектелген немесе негізгі жолдың артында қалғандығын растау үшін жолақ каталогын қолданыңыз.

Доменді орнату - ақы төлейтін жазба. Taira, кранның көмекшісін [Тестнет-ті алу XOR бойынша Taira](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ретінде `taira_faucet_claim.py`, Қолтаңбалаушыны мемлекеттік құбыр арқылы қаржыландырып, алымның метамәдени деректерін қоса беру:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Бірнеше рет тестілеу желісі арқылы бірегей домен атауының мақсатын орнату және Taira ағымдағы саясаты мен алым активтерінің қортындысын қолдану. Localnet немесе Minamoto үшін жасалған жоспарды қайта қолданбаңыз.

## Басқа субъектілермен қарым-қатынас {#relationship-to-other-entities}

Домендер топтамасы объектілерді тіркейді және домен ауқымындағы деректер үшін атау кеңістігін ұсынады. Әрістік анықтамалары домендік сәйкестендіргіштерді пайдаланады, ал сұраулар домендерді тізбектей алады немесе доменге арналған нысандарды таба алады. Тіркелгілердің өздері қазіргі деректер үлгісінде доменсіз, бірақ шоттар домендерге ие бола алады және олардың анықтамасы домендердің астында өмір сүретін активтерді ұстай алады.

Сондай-ақ қараңыз:

- [Әлем](/kk/blockchain/world.md)
- [Активтер](/kk/blockchain/assets.md)
- [Метамәліметтер](/kk/blockchain/metadata.md)
- [Атау беру қағидалары](/kk/reference/naming.md)
