---
translation_locale: kk
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Активтер {#assets}

Iroha актив - бұл шотта ұсталатын сандық баланс. Әрбір нақты баланс `AssetDefinition` дегенге сілтейді, ал анықтама осы активтің қалай аталуы, қайтарылуы, көрсетілуі және бөлінуі мүмкін екенін сипаттайды.

## Активтер анықтамасы {#asset-definition}

`AssetDefinition` құрамында:

- `id`: каноникалық активтерді айқындау адресі
- `name`: адам оқуға болатын дисплей атауы
- `description`: ерікті түрде адам оқитын сипаттама
- `alias`: `<name>#<domain>.<dataspace>` немесе `<name>#<dataspace>` нысандағы ерікті аты-жөндер
- `spec`: тепе-теңдікке арналған сандық дәлдік пен шектеулер
- `mintable`: ментуалдық саясаты
- `logo`: ерікті `SoraFS` URI
- `metadata`: кездейсоқ кілт-бағалы метамәліметтер
- `balance_scope_policy`: баланстардың жалпы немесе деректер кеңістігі шектеулі екендігі
- `owned_by`: анықтаманы тіркеген немесе оған ие болған есепшот
- `total_quantity`: шығарылған жалпы мөлшері
- `confidential_policy`: қорғалған активтер бойынша операциялар саясаты

Мүлік анықтамасы IDs - каноникалық мөлдір емес мекенжайлар. Дефиниция домен мен атаудан құрылған кезде, Iroha осы домен/атау проекциясын UX және сұрау салулар үшін сақтай алады, бірақ каноникалық мәтін нысаны пайдаланған мекенжайы болып табылады.

## Активтердің балансы {#asset-balance}

`Asset` құрамында:

- `id`: активтердің анықтамасы, ұстаушының шоты және таңдаулы баланстың қолданылуы бар `AssetId`;
- `value`: `Numeric` балансы

Алушының шоты каноникалық және доменсіз. Активтің анықтамасы, мысалы `payments.universal` деген деректер кеңістігі бойынша білікті доменнің астында болжануы мүмкін.

## Қалыптылығы {#mintability}

Активтің анықтамалары мына mintability режимдерін қолдады:

|Режим|Мағынасы |
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |Еластикалық қамтамасыз ету. Мүлікті қайта-қайта терістеп, өртеуге болады. |
|`Once` |Тұрақты жеткізу белгісі. Оны бір рет жасатып, содан кейін күйдіруге болады. |
|`Not` |Тұрақты өнім белгісі, оны жандырып тастауға болады, бірақ қайтадан қайтарылмайды.|
|`Limited(n)` |Осы саясатта жаңа активтердің бірліктері шектеулі мөлшерде қосымша операциялар кезінде шығарылуы мүмкін. |

Пайдалану `Infinitely` қалыпты эластикалық активтер үшін және `Once` немесе `Limited(n)` тұрақты немесе шектелген өнімге арналған активтер үшін `Not` бастапқы саясаты ретінде, егер активтердің ұсынысы бұрыннан анықталмаған болса.

## Баланс шегі {#balance-scope}

`balance_scope_policy` теңгерімдердің қалай бөгетленетінін бақылайды:

- `Global`: әрбір шотқа және активтерді анықтауға арналған бір баланс тетігі
- `DataspaceRestricted`: теңгерімдер деректер кеңістігінің контексті бойынша бөлінеді

Деректер кеңістігі бойынша шектелген баланстар, егер бірнеше Nexus дереккөздерде бірдей активтің анықтамасы қолданылса, пайдалы болады, бірақ баланстар оқшауланған болып қалуы тиіс.

## Taira арқылы сынап көріңіз. {#try-it-on-taira}

Бұл тек оқуға арналған шақырулар Taira мемлекеттік тест-нетінде нақты активтердің анықтамаларын көрсетеді:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Ағымдағы Taira XOR алым активінің анықтамасын табу:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Метадеректерді қамтитын анықтамаларды іздеңіз:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Барлық үш мысал да оқылады. Taira-де активтерді қаптау, жағу немесе аудару үшін краннан қаржыландырылған шотты және [де сақталған ағынды пайдалану SORA Nexus деректер қорына қосылу](/kk/get-started/sora-nexus-dataspaces.md).

Төлемақы төлеу үшін Taira активтің мысалы, кранның көмекшісін [Тестнет-ті алу XOR туралы Taira](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ретінде `taira_faucet_claim.py`, одан кейін ең алдымен кран активін талап етіп, оны транзакциялық газ активінде пайдалану:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Содан кейін `ledger asset mint`, `ledger asset burn` және `ledger asset transfer` командаларына `--metadata ./taira.tx-metadata.json` кіргізілсін.

## Нұсқаулар {#instructions}

Активтер Iroha арнайы нұсқаулықпен тіркелуі, қайтарылуы, күйдіруі және аударылуы мүмкін:

- [`Register` және `Unregister`](/kk/blockchain/instructions.md#un-register)
- [`Mint` және `Burn`](/kk/blockchain/instructions.md#mint-burn)
- [`Transfer`](/kk/blockchain/instructions.md#transfer)
- [`SetKeyValue` және `RemoveKeyValue`](/kk/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Сондай-ақ қараңыз:

- [CLI нұсқаулығы](/kk/get-started/operate-iroha-via-cli.md)
- [Rust оқу құралы](/kk/guide/tutorials/rust.md)
- [Python оқу құралы](/kk/guide/tutorials/python.md)
- [JavaScript/TypeScript нұсқаулық](/kk/guide/tutorials/javascript.md)
- [Мәлімет үлгісі](/kk/blockchain/data-model.md)
- [NFTs](/kk/blockchain/nfts.md)
