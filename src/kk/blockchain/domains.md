---
translation_locale: kk
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Домендер {#domains}

Домендер — `World` ішінде тіркелген атаулы кеңістіктер. Қазіргі Iroha 3 деректер моделінде домен өзінің ата-аналық деректер кеңістігімен нақтыланады, сондықтан канондық идентификаторы мынадай:

```text
domain.dataspace
```

Мысалы, `payments.universal` атауы `universal` деректер кеңістігіндегі `payments` доменін білдіреді.

## Құрылым {#structure}

Тіркелген `Domain` мыналарды қамтиды:

- `id`: деректер кеңістігімен нақтыланған `DomainId`
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

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

Ниет `payments.universal` атауын, оның сандық деректер кеңістігін, канондық I105 иесін, жалға алу мерзімін және ағымдағы саясат/төлем бағасының тексеру шартын анықтайды. Жоспарлаушының соңғы нүктесі — `POST /v1/aliases/setup/plan`; қайтарылған жоспар тізбекке, өкілетті субъектіге, күйге және соңғы мерзімге байланған. Доменді жою үшін [`Unregister`](/kk/blockchain/instructions.md#un-register) қолданылады.

Доменді құру немесе жою үшін тиісті доменді басқару рұқсаты қажет белсенді бағдарламалық қамтамасыз ету орындалу ортасын тексеруші. Домен метадеректерін жаңартуға болады [`SetKeyValue` және `RemoveKeyValue`](/kk/blockchain/instructions.md#setkeyvalue-removekeyvalue) уәкілетті субъектіде сол доменді өзгертуге рұқсаты бар кезде.

## Осы жұмыс ағынын Taira бойынша іске қосыңыз {#try-it-on-taira}

Қоғамдық Taira тест желісінде қазіргі уақытта көрінетін домендерді тізіңіз:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Ашық орындау арнасының каталогын деректер кеңістігінің бүркеншік аттарымен сәйкестендіріңіз:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Қолданбаға доменнің бар-жоғын тексеру қажет болса, бірінші пәрменді пайдаланыңыз. Арна каталогы арқылы деректер кеңістігімен байланысты арналарды, соның ішінде әр арнаның ашық не шектеулі көрінуін және негізгі арнаға қатысты синхрондау күйін тексеріңіз.

Доменді баптау — комиссия төленетін жазу операциясы. Оны Taira желісінде сынамас бұрын [Taira желісінде тестілік XOR алу](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) бөліміндегі дайындау қадамы бар токен беру үдерісі арқылы қол қоюшыны қаржыландырыңыз, содан кейін жоспарды нақты комиссия төлеушімен қолданыңыз. CLI қол қою алдында нақты комиссия бағасын береді:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
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
