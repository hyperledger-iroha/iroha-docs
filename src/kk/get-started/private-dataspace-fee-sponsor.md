---
translation_locale: kk
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Жеке деректер кеңістігіне демеуші төлемдері {#sponsor-fees-for-a-private-dataspace}

Төлемдік демеушілік пайдаланушыларға жеке деректер кеңістігі транзакцияларын XOR ұстаусыз жіберуге мүмкіндік береді. Пайдаланушы әлі де транзакцияны қол қояды. Транзакция метадеректері демеуші есепшотқа нұсқайды, ал бағдарламалық қамтамасыз ету орындау ортасы желілік төлем үшін демеушінің XOR балансын шегереді.

Интеграцияның үш қозғалмалы бөлігі бар:

1. түйін төлемді демеуге мүмкіндік береді
2. демеуші есептік жазба бар және оның XOR бар
3. әрбір қолданушыда сол демеушіге `CanUseFeeSponsor` бар

Содан кейін, әрбір демеуші қолданушының транзакциясына тек осы метадеректер қажет:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Бұл бет екі жалпы үлгіні көрсетеді:

- Тегін пайдаланушы жазды: демеуші XOR төлейді, ал пайдаланушы ештеңе тіземейді.
- Жергілікті токен ақысы: пайдаланушы қосымша токенінде демеушіге төлейді, ал демеуші желіге XOR төлейді.

Taira немесе жеке тест желісін алдымен қолданыңыз. Жаңа жеке деректер кеңістігі – бұл оператор және басқару өзгерісі; оны клиент конфигурациясы арқылы жасауға болмайды.

## Мысал мәндер {#example-values}

Төмендегі командалар осы орынбасарларды қолданады:

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

Белсенді есептік жазба лақап аттары бірдей есептік жазбалар үшін қолжетімді болмаса, бір протокол-стандарт I105 есептік жазба идентификаторларын пайдаланыңыз.

## 1. Деректер кеңістігін дайындау {#_1-prepare-the-dataspace}

Жекеменшік деректер кеңістігі каталогы мен бағыттау жұмысы [SORA Nexus Деректер кеңістіктеріне қосылу](/kk/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace) құжатында сипатталғаннан басталады. Операторға арналған фрагмент мынадай көрінеді:

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

Пайдаланушы транзакцияларына көшпес бұрын, мыны тексеріңіз:

- жеке орындау жолы `/status` түйінінің жауап бетінде пайда болады
- пайдаланушы есептік жазбалары сіздің жеке тіркелу ағыныңыз арқылы қабылданады
- көмекші шот бар
- XOR төлем активі және төлем сорғы шоты желіде жарамды

## 2. Деректер кеңістігінде активтерді тіркеу {#_2-register-assets-in-the-dataspace}

Пайдаланушылар жеке деректер кеңістігінде ұстайтын актив анықтамаларын оларды қосымша логикасына енгізбестен бұрын тіркеңіз. Жергілікті-токендік комиссия үлгісі үшін оқу құралында `usage#billing.team` қолданылады:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Біріншіден, доменді және актив атау кеңістігін иеленетін SNS жалға алуды орнатыңыз. `$BILLING_DOMAIN` үшін құпиясыз `AliasSetupPlanRequestV1` ниетті жасаңыз, оның ішінде сандық `team` деректер кеңістігі идентификаторы, бір протоколдық стандарттағы иесі, жалға алу мерзімі және ағымдағы баға қақпақты қосыңыз:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Содан кейін актив анықтамасын тіркеңіз. Жалғыз протокол стандартты `--id` желі деңгейіндегі актив анықтамасының идентификаторы болып табылады. Лақап ат - бұл әзірлеушілер мен соңғы пайдаланушылар деректер кеңістігі кодында қолдануы керек нәрсе:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

пайдаланушыны тіркеу кезінде жергілікті токенді шығару немесе беру:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Пайдаланушының балансын тексеру:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Деректер кеңістігінде қосымша активтері үшін дәл сол үлгіні пайдаланыңыз. Әр токен үшін бір актив анықтамасын тіркеңіз, әрқайсына деректер кеңістігі лақап атын беріңіз және бір протокол стандартты актив анықтамасы ID-ін қатты кодтаудың орнына кодтан SDK лақап атына сілтеме жасаңыз.

## 3. Пайдаланушы лақап аттарын тіркеу {#_3-register-user-aliases}

Есепшоттар әлі де бір протоколдық стандарттағы I105 есепшот идентификаторлары болып табылады. Пайдаланушыға көрінетін аттар – есепшот алиастар, ал алиастар сезімтал емес аттар болуы керек мысалы, `alice@team` немесе `alice@members.team`. Телефон нөмірлері немесе электрондық пошталарды лақап ат ретінде қолданбаңыз. Олар келесі бөлімдегі жеке идентификатор ағымында болуы керек.

Алиас орнату доменді орнатумен бірдей декларативті жоспарлаушыны пайдаланады. SDK немесе onboarding қызметіне есептік жазба алиасы жазбасы нысаналы болатын құпиясыз `AliasSetupPlanRequestV1` мақсатты жасауын қамтамасыз етіңіз `$USER`, негізгі рөлді таңдайды, сандық мәліметтер кеңістігінің идентификаторын бекітеді және ағымдағы жалдау ақысы–баға тексеру қорғасын алып жүреді. Содан кейін оны бір атомдық транзакция ретінде жоспарлап, қолданады:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Егер қолданушы XOR төлемесе, орнату транзакциясын жасау және жіберу үшін мақұлданған демеуші санасатын кіріктіру қызметін пайдаланыңыз. Жалдау алу мен псевдонимді байлауды жеке қолданба транзакцияларына бөлмеңіз.

Лақап ат байланғаннан кейін, оны CLI арқылы тексеріңіз:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Жаңа есептік жазбаны жасау үшін тұрақты `uaid` бар `NewAccount` жасайтын және қажет болса бастапқы `label` беретін енгізу қызметін таңдаңыз. Қарапайым `ledger account register --id` командасы тек бір протокол стандартының есептік жазба идентификаторын тіркейді.

## 4. Телефон мен электрондық поштаны FHE арқылы жеке тіркеу {#_4-register-phone-and-email-privately-with-fhe}

Телефон нөмірлері мен электрондық пошта мекенжайларын қоғамдық лақап аттарды емес, жеке идентификатор талаптары ретінде қолданыңыз. FHE-пен қолдау көрсетілетін ағын шоттың лақап аттарына, транзакция метадеректеріне және әлемдік күйге шикі идентификаторлардың кіруін болдырмайды:

1. оператор телефон және электрондық пошта үшін [RAM-LFE/FHE бағдарлама саясаты](/kk/blockchain/ram-lfe.md) тіркейді
2. оператор `phone#team` және `email#team` сияқты белсенді идентификатор саясаттарын тіркейді
3. әмешік телефон немесе электрондық поштаны жергілікті деңгейде қалыпқа келтіреді
4.  әмиян шифрланған мәнді шешушіге жібереді
5. резолвер `IdentifierResolutionReceipt` қайтарады
6. пайдаланушы протокол нәтижесі жазбасымен `ClaimIdentifier` жібереді
7. тізбек ащық емес идентификатор мен протокол нәтижесінің жазбасының криптографиялық хэшін сақтайды, нақты телефон немесе электрондық пошта мәнін емес

Операторлық жақтағы саясатты баптау SDK немесе қызмет тапсырмасы болып табылады. Әр идентификатор түрі үшін осы нұсқаулық жұптарын жасаңыз және жіберіңіз:

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

Оны электрондық пошта үшін қайталаңыз:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Оқыту кезінде әмиян немесе сервер жағы жергілікті түрде қалыпқа келтіруі керек:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

8-қадамда демеуші метадеректері файлы жасалғаннан кейін, сол метадеректермен пайдаланушы қол қойған талап нұсқауын жіберіңіз:

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

Ағымдағы CLI осы сәйкестендіру нұсқаулықтары үшін типтелген командаларды ұсынбайды. SDK көмегімен сериализацияланған `InstructionBox` мәндерін жасап, оларды `ledger transaction stdin` арқылы жіберіңіз:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Осы сақтық шараларын onboarding қызметінде ұстаңыз:

- шоттың ауыспалы аттары тек адам оқи алатын қолтаңбалар болып табылады
- шикі телефон және электрондық пошта мәндері ешқашан лақап аттарда, метадеректерде, журналдарда немесе транзакция деректерінде көрсетілмейді
- есепте жеке идентификаторларды талап етуге дейін `uaid` бар
- протокол нәтижелері жазбаларын байланыстыру `policy_id`, `opaque_id`, `uaid`, `account_id` және мерзімі
- шешуші кілттер мен жасырын бағдарлама криптографиялық міндеттеме мәндері басқару арқылы бақыланады

## 5. Түйінде демеушілікті қосу {#_5-enable-sponsorship-on-the-node}

Ақылы демеушілік – түйін/жүру уақыты саясаты. Оны Nexus ақы баптауында қосыңыз:

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

`fee_asset_id` - желілік төлем активі. SORA Nexus үшін бұл XOR. Желіде көрсетілген белсенді XOR лұқпа немесе бір протокол-стандартты XOR актив анықтамасы идентификаторын пайдаланыңыз.

`sponsor_max_fee = "0"` дегеніміз транзакция бойынша демеушілік шегі жоқ екенін білдіреді. Өндірісте, деректер кеңістігі транзакцияларыңыздың қалыпты мөлшері мен транзакцияны орындау құны профилін білетіннен кейін нөлден өзгеше шекті қойыңыз.

Осы конфигурацияны қалыпты операторлық процестеріңіз арқылы қайта іске қосыңыз немесе жүргізіңіз.

## 6. Демеушіні құру және қаржыландыру {#_6-create-and-fund-the-sponsor}

Қажет болса, демеуші кілт жұбын жасаңыз:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

Желідегі аккаунт форматына ашық кілтті түрлендіріңіз:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Жеке тіркелу процесі арқылы демеуші шотын тіркеңіз:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Кассадан, есепшоттан немесе басқа қаржыландырылған есепшоттан демеушіні XOR қаржыландырыңыз:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Taira репетициялары үшін [Taira сайтынан XOR тест желісін алыңыз](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) тест желісін қаржыландыру қызметінің көмекшісін `taira_faucet_claim.py` ретінде сақтап, кейін демеушіні қазына аударымының орнына ашық тест желісін қаржыландыру қызметімен қаржыландырыңыз:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Көмекшінің XOR балансын тексеріңіз:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Қолданушыға демеушіге қол жеткізу құқығын беру {#_7-grant-a-user-access-to-the-sponsor}

Мекеме әр қолданушыға оған төлем төлей алу рұқсатын беруі керек. Міне, сол рұқсат қолданушылардың қалаусыз мекеме аккаунттарын атауын болдырмайды.

Моны демеуші есептік жазба ретінде немесе бағдарламаны орындау ортасы саясатына сәйкес рұқсат етілген операциялық есептік жазба ретінде іске қосыңыз:

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

Қызметтерді қосу кезінде бұл процесс қалыпты есептік жазбаны беру қадамы болсын және жазып алыңыз:

- қолданушы есептік жазба
- демеуші есептік жазба
- деректер кеңістігі немесе қосымша
- бекіту билеті немесе басқару шешімі

Пайдаланушының рұқсаттарын тексеру үшін:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Демеуші метадеректерін қосу {#_8-attach-sponsor-metadata}

Қайта қолдануға болатын метадеректер файлын жасаңыз:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Бұл метадеректермен ұсынылған кез келген жазба демеушінің есебінен төленеді:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs үшін сол транзакцияның метадеректер объектісін қол қойылған транзакцияға тіркеу. Пайдаланушы транзакцияны пайдаланушының кілтімен қол қояды. Демеуші әрбір пайдаланушы транзакциясына қол қоймайды, себебі алдыңғы `CanUseFeeSponsor` грант рұқсат болып табылады.

## Үлгі 1: Пайдаланушылар ешқандай ақы төлемейді {#pattern-1-users-pay-no-fees}

Қолданбаның немесе оператордың барлық желі төлемдерін өз мойнына алған кезде оны пайдаланыңыз.

Дамытушының тексеру тізімі:

1. Пайдаланушының қалыпты транзакциялық жүктемесін өзгеріссіз сақтаңыз.
2. `fee_sponsor` арқылы транзакция метадеректерін қосыңыз.
3. Пайдаланушы ретінде қол қойыңыз.
4. Жеке деректер кеңістігі арқылы жіберіңіз.

Пайдаланушының аккаунтына XOR балансын сақтау қажет емес. Демеуші аккаунтта орнатылған Nexus төлемдерін жабу үшін жеткілікті XOR болуы керек.

## Үлгі 2: Пайдаланушылар жергілікті токенге төлейді {#pattern-2-users-pay-a-local-token}

Пайдаланушылар XOR ұстамауы керек болғанда, бірақ деректер кеңістігі әлі де ішкі қосымша ақы, несие шығыны немесе квота белгісін қаласа, мұны қолданыңыз.

Бұл үлгіде жергілікті токен қосымша төлем болып табылады. Ол желі ақысы активі емес. Демеуші әлі де желі ақысын XOR түрінде төлейді.

Мысалы, жеке деректер кеңістігінде жергілікті токенді пайдаланыңыз:

```text
usage#billing.team
```

Пайдаланушылардың тіркелу кезінде, жазылымды жаңарту кезінде немесе квота бөлінгенде `usage#billing.team` сомасын қаражатпен қамтамасыз етіңіз. Содан кейін пайдаланушының транзакциясын атомарлы етіңіз:

1. пайдаланушыдан демеушіге жергілікті токендерді аудару
2. сұралған қосымша операциясын орындау
3. `fee_sponsor` метадеректерін қосыңыз, сонда демеуші XOR төлейді

Минималды CLI түтіндік тест тек жергілікті токенді XOR демеушілік еткен тасымалдауды қамтиды:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Шынайы қосымша үшін жергілікті токен төлемін бөлек ең жақсы талпыныс транзакциясы ретінде жібермеңіз. Төлем мен бизнес нұсқауын қамтитын бір қол қойылған транзакция құрыңыз немесе бизнес операциясын қолданудан бұрын жергілікті токенді жинайтын келісімшарт кіріс нүктесін ашыңыз.

Өз қолданбаңызда немесе келісімшартыңызда конверсия саясатын сақтаңыз:

- қай операция қанша жергілікті токен бірлігіне тұрады
- жергілікті токен ағымы демеуші XOR толықтыруларына қалай сәйкес келеді
- пайдаланушының балансы тым төмен болғанда не болады
- жеке демеуші XOR балансы тым төмен болса не болады

::: warning

Демеушіден осы газ активімен де ақы алынсын демесеңіз, «жергілікті токен төлемі» үлгісінде `gas_asset_id` қолданбаңыз. Ағымдағы орындау ортасында `fee_sponsor` демеушіні бапталған өңдеу ағынының газ активінен шегерімдер үшін де төлеуші етеді. Пайдаланушыдан жергілікті токенмен ақы алу үшін токенді аударым немесе келісімшарт ережесі арқылы тікелей жинаңыз.

:::

## Қате жіберілген демеуші транзакциялар {#debug-failed-sponsored-transactions}

Жиі кездесетін бас тарту себептері әдетте бір қадамның орындалмағанына нұсқайды:

|Қате мәтін|Не тексеру керек|
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` әлі де түйінде `false` болып тұр. |
| `fee sponsor is not authorized` |Пайдаланушыда осы демеушіге `CanUseFeeSponsor` жоқ.|
| `fee asset ... is missing` |Спонсор конфигурацияланған XOR төлем активіне ие емес.|
| `fee balance ... is insufficient` |Демеушінің XOR балансын толықтырыңыз.|
| `fee exceeds sponsor_max_fee` |`sponsor_max_fee` көтеріңіз немесе транзакция мөлшерін/газды азайтыңыз.|
| `invalid nexus fee asset id` |`nexus.fees.fee_asset_id` немесе XOR активтің жарғысын түзетіңіз.|

Паттерн 2-ні түзету кезінде екі балансқа да көз жеткізіңіз:

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

## Демеушіні басқару {#operate-the-sponsor}

Сәламаттықты қазынашылық тіркелім ретінде қарастырыңыз:

- тест желісі, сынақ нұсқасы және негізгі желі үшін демеуші кілттерді бөлек сақтаңыз
- қабылдау шегіне жеткенге дейін демеуші XOR балансын ескерту
- трафик сипатталғаннан кейін нөлге тең емес `sponsor_max_fee` шегін орнатыңыз
- қосымшаңызда немесе шлюзде жазуларды жылдамдыққа шектеу қойыңыз
- пайдаланушылар деректер кеңістігін тастағанда `CanUseFeeSponsor`-ны қайтарыңыз
- пайдаланушы транзакцияларының криптографиялық хэштерін, локальды токен төлемдерін және демеуші XOR дебеттерін үйлестіру

Пайдаланушының демеушілігін болдырмау:

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

## Қатысты беттер {#related-pages}

- [SORA Nexus Деректер кеңістіктеріне қосылу](/kk/get-started/sora-nexus-dataspaces.md)
- [CLI арқылы Iroha 3 жұмыс істеңіз](/kk/get-started/operate-iroha-via-cli.md)
- [Активтер](/kk/blockchain/assets.md)
- [Рұқсаттар](/kk/blockchain/permissions.md)
- [Рұқсат белгішелері](/kk/reference/permissions.md)
