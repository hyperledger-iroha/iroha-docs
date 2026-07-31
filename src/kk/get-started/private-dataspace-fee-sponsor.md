---
translation_locale: kk
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Жеке деректер кеңістігі үшін спонсорлық алымдар {#sponsor-fees-for-a-private-dataspace}

Файлдық спонсорлық пайдаланушыларға XOR иеленбестен жеке деректер кеңістігі бойынша транзакцияларды беруге мүмкіндік береді. Пайдаланушы әлі күнге дейін транзакцияны қол қояды. Транзакцияның метамәліметтері спонсорлық шотқа сілтейді, ал орындау уақыты желілік алым үшін спонсордың XOR қалдығын бере алады.

Интеграцияның үш жылжымалы бөлігі бар:

1. түйін төлемді қолдауды рұқсат етеді
2. спонсорлық есепшот бар және XOR
3. әрбір пайдаланушының осы бағыт беруші үшін `CanUseFeeSponsor`

Содан кейін, әрбір спонсорланған пайдаланушы транзакциясына тек осы метамәліметтер қажет:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Бұл парақ екі жалпы үлгілерді көрсетеді:

- Еркін пайдаланушы былай дейді: спонсор XOR төлейді, ал пайдаланушы ештеңе төлей алмайды.
- Жергiлiктi белгілер бойынша алымдар: пайдаланушы спонсорға қолданбалық токмен, ал спонсор желіге XOR төлейді.

Алдымен Taira немесе жеке тест желісін пайдаланыңыз. Жаңа жеке деректер кеңістігі оператор мен басқарушылық өзгерісі болып табылады; ол клиент конфигурациясы бойынша құрылмайды.

## Үлгілік құндылықтар {#example-values}

Төмендегі командалар осы орынды ұстаушыларды қолданады:

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

I105 тіркелгісі IDs қолданылсын, егер сіздің орналасуыңызда сол шоттар үшін белсенді есептік аты-жөндер болмаса.

## 1. Деректер кеңістігін дайындау. {#_1-prepare-the-dataspace}

Жеке деректер кеңістігінің каталогынан бастаңыз және [де сипатталған бағыт-бағдар жұмысынан бастаңыз SORA Nexus Деректер кеңістіктеріне қосылыңыз](/kk/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Операторға қарасты фрагмент былай көрінеді:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

Пайдаланушы транзакциясына ауысудан бұрын мыналарды тексеріңіз:

- Жеке жол `/status` түйінде көрсетіледі.
- пайдаланушы тіркелгілері жеке қосылу ағындары арқылы қабылданады
- спонсорлық есепшот бар
- XOR төлемақы активтері және төлемақыны жою есебі желіде жарамды

## 2. Деректер кеңістігінде активтерді тіркеу {#_2-register-assets-in-the-dataspace}

Пайдаланушылар жеке деректер кеңістігінде сақтайтын активтердің анықтамаларын тіркеңіз, оларды қолданба логикасына енгізбестен бұрын. Жергілікті токендер бойынша алым үлгісі үшін оқу құралы `usage#billing.team` пайдаланады:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Алдымен активтердің атау кеңістігін иеленуші доменді және SNS жалға беруді орнатыңыз. `$BILLING_DOMAIN` үшін құпиясыз `AliasSetupPlanRequestV1` ниеті жасаңыз, оның ішінде сандық `team` деректер кеңістігі ID, каноникалық меншік иесі, жалға алу мерзімі және ағымдағы цитатаны қорғаушы:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Содан кейін активтің анықтамасын тіркеңіз. Каноникалық `--id` - бұл желі деңгейіндегі активтердің анықтамасы ID. Алмасушасы әзірлеушілер мен соңғы пайдаланушылар деректер кеңістігінің кодында қолдануы керек:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

Минет немесе жергiлiктi токендi пайдаланушыға онбординг кезiнде беру:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Пайдаланушының тепе-теңдігін тексеру:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Деректер кеңістігіндегі қолданба активтері үшін бірдей үлгіді пайдаланыңыз. Токенге бір актив анықтамасын тіркеңіз, әрқайсысына деректер кеңістігінің аты-жөнін беріңіз және қатты кодталатын каноникалық актив анықтамасы IDs орнына SDK кодынан алынған ата-жаныңызға сілтеме жасаңыз.

## 3. Пайдаланушының аты-жөнін тіркеу {#_3-register-user-aliases}

Есептер әлі де каноникалық I105 есеп IDs. Пайдаланушы атаулары тіркелгілердің аты-жөні болып табылады, ал аты-жөндері сезімтал емес қолдары болуы тиіс `alice@team` немесе `alice@members.team`. Телефон нөмірлері мен электрондық пошта адрестерін қолданбаңыз. Олар келесі бөлімдегі жеке идентификатор ағынына жатады.

Alias орнату доменді орнату сияқты декларативтік жоспарлаушыны пайдаланады. SDK немесе кірісу қызметі құпиясыз құру `AliasSetupPlanRequestV1` есептік жазбаға кіру мақсаттары `$USER`, негізгі рөлді таңдайды, сандық деректер кеңістігін пин етеді ID, Сосын оны бір атомдық транзакция ретінде жоспарлап, қолдану:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Егер пайдаланушы XOR төлемеуі керек болса, орнату операцияларын жасау және тапсыру үшін бекітілген спонсор-білімді жүгіну қызметін пайдаланыңыз. Жалға алуды және алянспен байланыстыруды тәуелсіз өтінімдер транзакцияларына бөлемеңіз.

CLI белгісі бекітілгеннен кейін, оны тексеру:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Жаңа тіркелгі құру үшін `NewAccount` тұрақты `uaid` және, қажет болған жағдайда, бастапқы `label` қосылу қызметін таңдаңыз. Қарапайым `ledger account register --id` командасы тек каноникалық тіркелгі ID тіркеледі.

## Телефон және электрондық поштаны FHE арқылы жеке тіркеңіз. {#_4-register-phone-and-email-privately-with-fhe}

Телефон нөмірлері мен электрондық пошта адрестерін жеке сәйкестендіруді талап ету ретінде қолдану, қоғамдық емес. FHE қолданатын ағым бастапқы идентификаторларды шоттың атауларынан, транзакциялық метамәліметтерден және әлемдегі жағдайдан сақтайды:

1. оператор телефон және электрондық пошта үшін [RAM-LFE/FHE бағдарламасының саясатын ](/kk/blockchain/ram-lfe.md) тіркейді.
2. оператор `phone#team` және `email#team` сияқты белсенді идентификатор саясатын тіркейді.
3. қапшығы телефонды немесе электрондық поштаны жергілікті түрде қалыпқа келтіреді
4. кошелек шифрланған мәнді шешушіге жібереді .
5. шешуші `IdentifierResolutionReceipt` қайтарады.
6. пайдаланушы квитанциямен бірге `ClaimIdentifier` береді
7. тізбек ашық емес идентификаторды және квитанция хэшін сақтайды, шұғыл телефон немесе электрондық пошта мәнін емес.

Оператор тарапынан саясатты орнату SDK немесе қызмет көрсету тапсырмасы болып табылады. Әрбір идентификаторлық тип үшін осы нұсқаулар жұптарын құру және тапсыру:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

Электрондық пошта үшін қайталаңыз:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Қапшықты орнату кезінде қапшық немесе артқы түзілім жергілікті түрде қалыпқа келтіруі тиіс:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

8. қадамда спонсорлық метамәліметтер файлы құрылғаннан кейін, осы метамәлімен бірге пайдаланушы қол қойған талап ету нұсқаулығын тапсырыңыз:

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

Ағымдағы CLI осы сәйкестік нұсқаулары үшін түрленген командаларды ашпайды. SDK арқылы сериялы `InstructionBox` мәндерін генерациялаңыз және оларды `ledger transaction stdin` арқылы тапсырыңыз:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Осы қорғаншыларды борттық қызметте сақтаңыз:

- тіркелгі аты-жөні тек адам оқитын қолғаптар
- Жарам телефон және электрондық пошта мәндері қолданбалы атауларда, метамәліметтерде, журналдарында немесе транзакция жүктемелерінде ешқашан көрсетілмейді.
- шотта `uaid` бар, ол жеке идентификаторларды талап етеді
- түсімдер `policy_id`, `opaque_id`, `uaid`, `account_id` және мерзімі аяқталады;
- шешуші кілттері мен жасырын бағдарламаның міндеттемелері басқарумен бақыланады

## 5. Нодта спонсорлық қызметті рұқсат ету {#_5-enable-sponsorship-on-the-node}

Төлемақыларды спонсорлау - түйін / жұмыс уақыты саясаты. Nexus төлемақы конфигурациясында рұқсат етілсін:

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` - желілік алым активтері. SORA Nexus Бұл ... XOR. Белсенді пайдалану XOR псевдоним немесе каноникалық XOR активтер анықтамасы ID Сіздердің желілеріңізден хабар алды.

`sponsor_max_fee = "0"` дегеніміз бір транзакция бойынша демшік шегі жоқ. Өндіріс үшін деректер кеңістігінің операцияларының қалыпты көлемі мен газ профилін білгеннен кейін нөлден тыс шегін белгілеңіз.

Бұл конфигурацияны қалыпты оператор процесіңіз арқылы қайта бастаңыз немесе айналдырыңыз.

## 6. Қорғаушыны құру және қаржыландыру {#_6-create-and-fund-the-sponsor}

Қажет болған жағдайда спонсордың кілті жұптарын құру:

```bash
kagami keys --algorithm ed25519 --json
```

Қоғамдық кілтті желіңіздің тіркелгі форматына аудару:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Спонсорлық тіркелгіңізді жеке қосылу ағындары арқылы тіркеу:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

XOR қаражатын қазынашылық, талапкерлік немесе басқа да қаржыландырылатын шоттан спонсорға төлейді:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

үшін Taira репетициялар, құбыр көмекшісін сақтау [Тестнет-ті алу XOR туралы Taira](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ретінде `taira_faucet_claim.py`, содан кейін спонсорды қазыналық аударымның орнына мемлекеттік банктің көмегімен қаржыландыру:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Спонсордың XOR балансын тексеріңіз:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Пайдаланушыға демеушіге қол жеткізуді рұқсат ету {#_7-grant-a-user-access-to-the-sponsor}

Спонсор әрбір пайдаланушыға оған ақы төлеуге рұқсат беруі тиіс.

Мұны спонсорлық шот ретінде немесе сіздің жұмыс уақытының саясатымен рұқсат етілген операциялық шот ретінде орындаңыз:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

Тіркелгілік қызметтер үшін бұл есептік жазбаны қамтамасыз етудің қалыпты қадамы болып табылады:

- пайдаланушы тіркелгісі
- спонсорлық есепшот
- деректер кеңістігі немесе қолданба
- бекіту билеті немесе басқару туралы шешім

Пайдаланушының гранттарын тексеру үшін:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Спонсордың метамәдени деректерін қосады {#_8-attach-sponsor-metadata}

Қайтадан пайдалануға болатын метамәдени файл құру:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Осы метамәліметтермен ұсынылған кез келген хаттар спонсордан алынады:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs үшін қол қойылған транзакцияға бірдей транзакция метамәліметтері объектісін қосады. Пайдаланушы транзакцияны пайдаланушының кілтімен қол қояды. Спонсор әрбір пайдаланушы транзакциясына қол қоймайды, өйткені алдыңғы `CanUseFeeSponsor` грант рұқсат болып табылады .

## 1 үлгі: Пайдаланушылар ақы төлейді {#pattern-1-users-pay-no-fees}

Қолданба немесе оператор барлық желілік алымдарды қабылдағанда осыны қолдану.

Әзірлеушілердің тексеру тізімі:

1. Пайдаланушының әдеттегі транзакциялық жүктемесін өзгертпеу.
2. `fee_sponsor` арқылы транзакцияның метамәдени деректерін қосу.
3. Пайдаланушы ретінде қол қойыңыз.
4. Жеке деректер орнының жолы арқылы тапсырыңыз.

Пайдаланушы тіркелгісіне XOR қалтасы қажет емес, спонсорлық тіркелгі конфигурацияланған Nexus алымдарды жабуға жеткілікті мөлшерде XOR сақтауы тиіс.

## 2- үлгі: Пайдаланушылар жергілікті таңбасын төлейді {#pattern-2-users-pay-a-local-token}

Пайдаланушылар XOR иеленуі тиіс емес, бірақ деректер кеңістігі әлі де ішкі қосымша ақысын, несие шығынын немесе квота белгісін қалайды.

Бұл үлгіде жергілікті токен өтінімді төлеу болып табылады. Ол желілік алым активтері емес. Спонсор әлі күнге дейін XOR арқылы желілік алымды төлейді.

Мысалы, жеке деректер кеңістігінде жергілікті токенді қолданыңыз:

```text
usage#billing.team
```

`usage#billing.team` қосылу, абонентті жаңарту немесе квота бөлу кезінде пайдаланушыларды қордандыру. Содан кейін пайдаланушы транзакциясын атомдық:

1. жергілікті токендерді пайдаланушыдан спонсорға беру
2. сұралған қосымшаны орындау
3. `fee_sponsor` метамәдени деректерін қамтиды, сондықтан демөөрші XOR төлейді.

Ең төменгі CLI түтін сынағы тек XOR қолдаған жергілікті белгілерді беру болып табылады:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Шынайы қолданба үшін жергілікті белгімен төлемді жеке ең тиімді операция ретінде ұсынбаңыз. Төлемді және бизнес нұсқаулықты қамтитын бір қол қойылған транзакцияны жасаңыз немесе бизнес операциясын қолданудан бұрын жергілікті белгілерді жинаған келісімшарт кіру нүктесін көрсетуіңіз керек.

Қолданбаңызда немесе келісімшартыңызда конверсия саясатын сақтаңыз:

- қандай операцияға қанша жергілікті токен бірлігі жұмсалады
- жергiлiктi кiрiс карталарының XOR толықтырмаларды спонсорлауды қалай жүзеге асыруы
- пайдаланушының тепе-теңдігі тым төмен болған кезде не болады
- sponsor XOR балансы тым төмен болған кезде не болады?

::: ескерту

`gas_asset_id` "жергілікті белгі ақысы" үлгісі үшін пайдаланбаңыз, егер сіз демшіге осы газ активінде де айыппұл салуды қаламасаңыз. Қазіргі жұмыс уақытында `fee_sponsor` демшікті конфигурацияланған құбыр-газ активтерінің берешегі үшін төлеуші етеді. Жергiлiктi кiрiстiк тiркемелердi пайдалану ақылары үшiн кiргiстiктi трансферт немесе шарт ережесiмен айрықша жинаңыз.

:::

## Жауапсыз sponsored транзакцияларды түзету {#debug-failed-sponsored-transactions}

Көп тараған бас тарту себептері әдетте бір орнату сатысы жоққа шығады:

|Қате мәтіні |Нені тексеру керек ?|
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` әлі де түйіндіде `false`. |
|`fee sponsor is not authorized` |Пайдаланушының `CanUseFeeSponsor` осы бағыт беруші үшін жоқ. |
|`fee asset ... is missing` |Спонсордың конфигурацияланған XOR алым активтері жоқ. |
|`fee balance ... is insufficient` |Қорғаушының XOR балансын толтыру. |
|`fee exceeds sponsor_max_fee` |`sponsor_max_fee` мөлшерін көбейту немесе азайту. |
|`invalid nexus fee asset id` |`nexus.fees.fee_asset_id` немесе XOR активтер аты-жөндері. |

2 үлгіні ақаусыздағанда екі теңгерімді тексеріңіз:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## Қорғаушыны басқару {#operate-the-sponsor}

Спонсорды қазыналық шот ретінде қараңыз:

- тестілеу желісі, сахналау және негізгі желі үшін бөлек спонсорлық кілттерді сақтау
- қолдаушының XOR қалтасы қабылдау деңгейіне жеткенге дейін ескерту
- Жол қозғалысы сипатталғаннан кейін `sponsor_max_fee` шегін белгілеңіз.
- Сіздің өтінішіңізге немесе кіреберісіңізге тарифтік-лимитпен қамтылған хаттар
- пайдаланушылар деректер кеңістігін тастаған кезде `CanUseFeeSponsor` күшін жою;
- пайдаланушы транзакциясының хэшесін, жергілікті токендермен төлемдерді және спонсорлық XOR дебеттерді үйлестіру;

Пайдаланушы үшін спонсорлық қызметті тоқтату:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## Қосылған беттер {#related-pages}

- [SORA Nexus деректер қорына қосылыңыз](/kk/get-started/sora-nexus-dataspaces.md)
- [Iroha 3 арқылы CLI](/kk/get-started/operate-iroha-via-cli.md) пайдалану
- [Активтер](/kk/blockchain/assets.md)
- [Рұқсаттар](/kk/blockchain/permissions.md)
- [Рұқсат белгілері](/kk/reference/permissions.md)
