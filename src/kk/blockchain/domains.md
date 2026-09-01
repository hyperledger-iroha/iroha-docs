---
translation_locale: kk
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Домендер {#domains}

Домендер `World` жүйесінде тіркелген аталған ат кеңістіктері болып табылады. Қазіргі Iroha 3 мәліметтер моделінде домен өз ата-аналық мәлімет кеңістігі арқылы анықталады, сондықтан бір ғана протокол-стандартты идентификатор бар:

```text
domain.dataspace
```

Мысалы, `payments.universal` `universal` деректер кеңістігіндегі `payments` доменін атайды.

## Құрылым {#structure}

Тіркелген `Domain` мыналарды қамтиды:

- `id`: мәліметтер кеңістігімен анықталған `DomainId`
- `logo`: домен логотипі үшін міндетті емес `SoraFS` URI
- `metadata`: кездейсоқ кілт-бағалы метадеректер
- `owned_by`: доменді иеленетін есептік жазба, әдетте оны тіркеген есептік жазба

Доменді материалдандыру үшін қолданылатын bootstrap жүктемесі `NewDomain`. Ол `id`, таңдамалы `logo` және бастапқы `metadata` қамтиды. Бағдарламалық қамтамасыз ету орындау ортасы `owned_by` рұқсат беру негізгісінен толтырады. Қарапайым клиенттер бұл жүктемені тікелей жібермейді.

## Тіркелу {#registration}

Қарапайым домен жасау декларативті ауысым аты (alias) орнату процесін пайдаланады. Бұл SNS жалдау, иесінің мүмкіндіктері, ақы-құны тексеру қорғаны, және домен жолын бір атомдық `EnsureAlias` транзакцияда сақтайды. `Register::Domain` әлі де бастаушы/bootstrap беті болып табылады, және `ledger domain` командасының ешқандай `register` қосымша командасы жоқ.

Құпиясыз `AliasSetupPlanRequestV1` ниетін SDK немесе тіркелу қызметімен жасаңыз, содан кейін CLI оны нақты күйге қарсы жоспарлап, сол жоспарды дәл ұсыныңыз:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Мақсатты анықтайды `payments.universal`, оның сандық деректер кеңістігі, бір протокол-стандарт I105 иесі, жалға алу мерзімін алу, және ағымдағы саясат/төлем ақысының бағасын тексеру қоры. Жоспарлаушы API соңғы нүкте `POST /v1/aliases/setup/plan`; оның қайтарылған жоспары тізбекке байланысты, транзакцияны растау тұлға, блокчейн есеп журналының жағдайы және мерзім. Доменді жою әлі де пайдаланады [`Unregister`](/kk/blockchain/instructions.md#un-register).

Доменді құру немесе жою үшін тиісті доменді басқару рұқсаты қажет белсенді бағдарламалық қамтамасыз ету орындалу ортасын тексеруші. Домен метадеректерін жаңартуға болады [`SetKeyValue` және `RemoveKeyValue`](/kk/blockchain/instructions.md#setkeyvalue-removekeyvalue) уәкілетті субъектіде сол доменді өзгертуге рұқсаты бар кезде.

## Осы жұмыс ағынын Taira бойынша іске қосыңыз {#try-it-on-taira}

Қоғамдық Taira тест желісінде қазіргі уақытта көрінетін домендерді тізіңіз:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Қоғамдық атқару жолының каталогын деректер алаңының жарнамаларына қайта салыстырыңыз:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Қолданба доменнің бар-жоғын тексеруі қажет болғанда бірінші команданы пайдаланыңыз. Деректер кеңістігінің жалпыға қолжетімді, шектеулі немесе негізгі орындалу жолынан артта қалғанын тексеру қажет болғанда орындалу жолы каталогын пайдаланыңыз.

Доменді орнату – бұл ақы төленетін жазба. Оны Taira үстінде сынамас бұрын, тесттік желідегі қаржыландыру қызметінің көмегін [Taira сайтынан XOR тест желісін алыңыз](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) арқылы `taira_faucet_claim.py` ретінде сақтаңыз, криптографиялық қол қойғышты қоғамдық тесттік желі қаржыландыру қызметі арқылы қаржыландырыңыз және ақы метадеректерін тіркеңіз:

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

Қайталаған тестнет жүргізулерінде бірегей домендік атауға арналған ниетті жасаңыз және Taira-ның қазіргі саясаты мен төлем-құн активін төлем бағасын тексеру қорғауын пайдаланыңыз. Локалнет немесе Minamoto үшін жасалған жоспарды қайта пайдаланбаңыз.

## Басқа субъекттермен қатынасы {#relationship-to-other-entities}

Домендер блокчейн тіркеу объектілерін топтастырады және доменге бағытталған деректер үшін ат кеңістігін береді. Активтер анықтамалары доменге қатысты идентификаторларды пайдаланады, ал сұраулар домендерді тізімдей алады немесе доменге жататын объектілерді табу. Қазіргі деректер моделінде есептік жазбалар өздері доменсіз, бірақ есептік жазбалар домендерді иемденіп, домендер аясында анықталған активтерді ұстай алады.

Сондай-ақ қараңыз:

- [Әлем](/kk/blockchain/world.md)
- [Активтер](/kk/blockchain/assets.md)
- [Метадеректер](/kk/blockchain/metadata.md)
- [Атау ережелері](/kk/reference/naming.md)
