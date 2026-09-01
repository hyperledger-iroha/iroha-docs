---
translation_locale: ba
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Шәхси мәғлүмәттәр биҫтәһе өсөн спонсорлыҡ түләүҙәре {#sponsor-fees-for-a-private-dataspace}

Файлы спонсорлыҡ ҡулланыусыларға XOR тотоп тормайынса шәхси мәғлүмәттәр киңлегендә транзакциялар тапшырырға мөмкинлек бирә. Ҡулланыусы транзакцияны һаман да ҡул ҡуя. Транзакция метамәғлүмәттәре спонсор иҫәбенә йүнәлтелә, һәм үтәү ваҡыты спонсорҙың XOR балансын селтәр өсөн түләүгә түләй.

Интеграцияның өс хәрәкәтсән өлөшө бар:

1. узел түләүҙәр буйынса спонсорлыҡҡа рөхсәт итә
2. спонсор иҫәбенең бар һәм уның XOR
3. һәр ҡулланыусы өсөн был спонсор өсөн `CanUseFeeSponsor`

Бынан һуң, һәр спонсорлаштырылған ҡулланыусы транзакцияһы бары тик был метамәғлүмәт кәрәк:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Был биттең ике дөйөм өлгөһө бар:

- Ирекле файҙаланыусы былай тип яҙа: спонсор XOR түләй, ә ҡулланыусы бер нәмә лә түләмәй.
- Урындағы билдәләр өсөн түләүҙәр: ҡулланыусы спонсорҙы ҡушымта токендары менән түләй, ә спонсор селтәрҙе XOR күләмендә түләй.

Тәүҙә Taira йәки шәхси тест селтәрен ҡулланығыҙ. Яңы шәхси мәғлүмәт киңлеге оператор һәм идара итеү үҙгәреше; ул клиент конфигурацияһы буйынса барлыҡҡа килмәй.

## Миҫал ҡиммәттәр {#example-values}

Артабанғы командаларҙа урындарҙы үҙләштереүселәр ҡулланыла:

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

I105 аккаунты IDs ҡулланығыҙ, әгәр һеҙҙә шул уҡ аккаунттар өсөн актив аккаунт атамалары булмаһа.

## 1. Мәғлүмәт киңлеген әҙерләгеҙ {#_1-prepare-the-dataspace}

[дә һүрәтләнгән шәхси мәғлүмәттәр киңлеге каталогынан һәм маршрутлау эшенән башлана. SORA Nexus Мәғлүмәт киңлектәре менән тоташтырыу](/ba/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Операторға ҡараған фрагмент былай күренә:

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

Ҡулланыусы транзакцияларға күсер алдынан, тикшерегеҙ:

- `/status` селтәрендә шәхси юл күрһәтелә.
- файҙаланыусылар иҫәбенә һеҙҙең шәхси инеү ағым менән ҡабул ителә
- спонсор иҫәбенең булыуы
- XOR түләү активы һәм түләүҙе һүтеү иҫәбенең селтәрҙә ғәмәлдә булыуы

## 2. Мәғлүмәт арауығында активтарҙы теркәү {#_2-register-assets-in-the-dataspace}

Ҡулланыусыларҙың шәхси мәғлүмәттәр киңлегендә һаҡланасаҡ актив билдәләмәләрен теркәгеҙ, уларҙы ҡушымта логикаһына күсерер алдынан. Үҙәк-токен түләү моделе өсөн, инструкция ҡуллана `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Тәүҙә доменды һәм SNS лизингын булдырығыҙ, улар активтың исемдәр киңлегенә эйә. `$BILLING_DOMAIN` өсөн йәшерен булмаған `AliasSetupPlanRequestV1` ниәтен булдырыу, шул иҫәптән һанлы `team` мәғлүмәт киңлеге ID, каноник хужаһы, ҡуртым срогы һәм ағымдағы комиссия иҫәбе һаҡсыһы:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Шунан активтың билдәләмәһен теркәгеҙ. `--id` - селтәр кимәлендәге активтар билдәләмәһе ID. Исеме - был программа төҙөүселәр һәм һуңғы файҙаланыусылар өсөн ҡулланырға тейеш булған мәғлүмәт киңлеге коды:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

Минтлау йәки ҡулланыусыға урындағы токенде күсереүҙә:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Ҡулланыусының балансын тикшерегеҙ:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Мәғлүмәт киңлегендә ҡушымта активтары өсөн шул уҡ схеманы ҡулланығыҙ. Токенға бер актив билдәләмәһен теркәгеҙ, һәр береһенә мәғлүмәт киңлегенең алфавитын бирегеҙ һәм ҡаты кодлы каноник актив билдәләмәһе IDs урынына SDK кодынан алынған алфавитҡа һылтанғыҙ.

## 3. Ҡулланыусылар исемдәрен теркәгеҙ {#_3-register-user-aliases}

Хисаптар һаман да каноник I105 хисабы IDs. Ҡулланыусыларға ҡараған исемдәр - иҫәбкә ҡушамат, ә ҡушаматтар `alice@team` йәки `alice@members.team` кеүек һиҙгер булмаған ҡулланмалар булырға тейеш. Телефон номерҙарын һәм электрон почта адрестарын ҡушамат итеп файҙаланмағыҙ.

Alias булдырыу шул уҡ декларатив планер менән ҡулланыла домен булдырыу. SDK йәки бортҡа инеү хеҙмәте булдырыу йәшерен бушлай `AliasSetupPlanRequestV1` ниәте, уның иҫәбенә инеү маҡсаттары `$USER`, төп ролде һайлай, һанлы мәғлүмәттәр арауығын пинлар ID, һәм ғәмәлдәге ҡуртым ставкаһы һаҡсыһын алып бара.

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Әгәр файҙаланыусы XOR түләмәһә , конструирование төҙөү һәм тапшырыу өсөн раҫланған спонсор-аңлы инеү хеҙмәте менән ҡулланығыҙ операцияһы. Лизинг һатып алыу һәм бәйләнешле ҡушаматтарҙы үҙаллы заявка менән килешеүҙәргә бүлеп ҡуймағыҙ.

CLI ҡушаматы бәйләнгәндән һуң, уны тикшерегеҙ:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Яңы аккаунт булдырыу өсөн, өҫтөнлөк биреүсе инеү хеҙмәте төҙөү `NewAccount` һабаҡ менән `uaid` һәм, әгәр кәрәк булһа, башланғыс `label`. Ябай `ledger account register --id` командование тик каноник иҫәбен генә теркәй . ID.

## 4. FHE менән шәхси рәүештә телефон һәм электрон почтаға теркәлергә. {#_4-register-phone-and-email-privately-with-fhe}

Телефон номерҙарын һәм электрон почта адрестарын асыҡ ҡушаматтар түгел, ә шәхси идентификатор талаптары итеп ҡулланығыҙ. FHE ярҙамында иҫәб ҡушаматтарынан, транзакция метамәғлүмәттәре һәм донъя торошонан сей идентификаторҙар һаҡлана:

1. оператор телефон һәм электрон почта өсөн [RAM-LFE/FHE программаһы сәйәсәте](/ba/blockchain/ram-lfe.md) теркәй
2. Оператор `phone#team` һәм `email#team` кеүек актив идентификация сәйәсәтен теркәй.
3. аҡса янсығы телефонын йәки электрон почтаны урындағы нормализациялай
4. аҡса янсығы шифрланған ҡиммәтте резюсерға ебәрә .
5. хәл итеүсе `IdentifierResolutionReceipt`
6. ҡулланыусы квитанция менән бергә `ClaimIdentifier` тапшыра
7. Сылбырҙа асыҡ булмаған идентификатор һәм квитанция хэшиһы һаҡлана, ә сисмә телефон йәки электрон почта хаҡы түгел.

Оператор яғында сәйәсәт булдырыу SDK йәки хеҙмәтләндереү бурысы. төҙөү һәм тапшырыу был инструкция парҙары өсөн һәр идентификатор типтары:

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

Уны электрон почта өсөн ҡабатлағыҙ:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Онбординг ваҡытында, аҡса янсығы йәки артҡы пластинка урындағы нормализация булырға тейеш:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

8 этапта спонсорҙың метамәғлүмәт файлы барлыҡҡа килгәндән һуң, шул метамәғlüматтар менән ҡулланыусы ҡултамғаһы ҡуйылған заявка инструкцияһын тапшырырға кәрәк:

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

Хәҙерге CLI был идентификация күрһәтмәләре өсөн типланған бойороҡтарҙы асыҡламай. SDK менән сериялы `InstructionBox` ҡиммәттәрен генерациялау һәм уларҙы `ledger transaction stdin` аша тапшырыу:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Был һаҡсы рельстарҙы бортҡа ултыртыу хеҙмәтендә ҡалдырығыҙ:

- иҫәп-хисап исемдәре - кеше уҡый торған ҡултыҡтар ғына
- эшкәртелмәгән телефон һәм электрон почта ҡиммәттәре alias-тарҙа, метамәғлүмәттәрҙә, журналдарҙа йәки транзакция payload-тарында бер ҡасан да күренмәй
- иҫәбенә `uaid` бар, сөнки ул шәхси идентификаторҙарҙы талап итә
- Квитанциялар `policy_id`, `opaque_id`, `uaid`, `account_id` менән бәйләнгән һәм ваҡыты бөткән.
- resolver асҡыстары һәм йәшерен программа йөкләмәләре идара итеү менән контролгә алына .

## 5. Нодта спонсорлыҡты булдырыу. {#_5-enable-sponsorship-on-the-node}

Түләүҙәр спонсорлыҡ - узел/оҙон ваҡыт сәйәсәте. уны Nexus түләүҙәр конфигурацияһында булдырырға:

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

`fee_asset_id` - селтәр өсөн түләүле актив. SORA Nexus өсөн был XOR. Актив XOR ҡушамаһын йәки кананик XOR актив билдәләмәһен ҡулланығыҙ ID һеҙҙең селтәрегеҙ асыҡланған.

`sponsor_max_fee = "0"` тигәнде аңлата бер транзакция өсөн спонсор липик юҡ. етештереү өсөн, һеҙҙең мәғлүмәт зонаһы транзакциялары нормаль ҙурлыҡ һәм газ профиле белгәндән һуң, нуль булмаған липик ҡуйырға.

Был конфигурацияны һеҙҙең ғәҙәти оператор процесы аша яңынан башларға йәки ҡуҙғатырға.

## 6. Яҡлаусыны булдырығыҙ һәм уға аҡса бүлегеҙ {#_6-create-and-fund-the-sponsor}

Әгәр кәрәк булһа , спонсор асҡысы парын булдырыу:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

Йәмәғәт асҡысын селтәрегеҙ өсөн аккаунт форматына үҙгәртегеҙ:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Спикер иҫәбенә шәхси инеү ағымы аша теркәлергә:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

XOR ярҙамында спонсорҙы ҡаҙнанан, кредиттар иҫәбенән йәки башҡа финансланған иҫәбтән аҡсалата тәьмин итеү:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Taira репетициялары өсөн [Taira-ла Testnet XOR алыу](/ba/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) бүлегендәге `taira_faucet_claim.py` faucet ярҙамсыһын ҡулланығыҙ, һуңынан спонсорҙы асыҡ faucet-тан финанслағыҙ:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Проверяйте спонсорҙың XOR балансын:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Ҡулланыусыға Спонсор менән танышырға рөхсәт итегеҙ {#_7-grant-a-user-access-to-the-sponsor}

Спонсор һәр ҡулланыусыға уны түләү өсөн рөхсәт бирергә тейеш. Был рөхсәт ҡулланыусыларҙы ирекле спонсор иҫәбенә исем ҡушыуҙан туҡтата.

Быны спонсор иҫәбенә, йәки оператив иҫәбенә файҙаланырға рөхсәт ителә.

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

Onboarding хеҙмәттәре өсөн, был нормаль иҫәп-хисап тәьмин итеү аҙым һәм теркәлгән:

- ҡулланыусы иҫәбенә
- спонсор иҫәбенә
- мәғлүмәт майҙансығы йәки ҡушымта
- хуплау билеты йәки идара итеү тураһында ҡарар

Ҡулланыусының рөхсәтен тикшереү өсөн:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Спонсорҙың метамәғлүмәттәре менән бәйләгеҙ {#_8-attach-sponsor-metadata}

Күп тапҡыр ҡулланыла торған метамәғлүмәт файлын булдырыу:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Был метамәғлүмәт менән ебәрелгән һәр яҙыу спонсорҙан алына:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

SDKs өсөн, ҡул ҡуйылған транзакцияға бер үк транзакция метамәғлүмәт объектын ҡуйығыҙ. Ҡулланыусы транзакцияны үҙ асҡысы менән ҡул ҡуя. Спонсор һәр ҡулланыусы транзакцияһына ҡул ҡуймай, сөнки алдан бирелгән `CanUseFeeSponsor` рөхсәте — авторизация.

## Беренсе өлгө: ҡулланыусылар түләүһеҙ түләй {#pattern-1-users-pay-no-fees}

Был ҡушымта йәки оператор бөтә селтәр түләүҙәрен үҙ эсенә алғанда ҡулланыла.

Эшҡыуарҙар контроле исемлеге:

1. Ҡулланыусының ғәҙәти транзакция йөкләмәһе үҙгәрешһеҙ һаҡлана.
2. Транзакция метамәғлүмәттәре `fee_sponsor` менән өҫтәлә.
3. Ҡулланыусы булараҡ ҡул ҡуйығыҙ.
4. Хосуси мәғлүмәттәр биләмәһе маршруты аша тапшырығыҙ.

файҙаланыусы иҫәбенә кәрәк түгел XOR баланс. спонсор иҫәбенә етерлек һаҡланырға тейеш XOR конфигурацияланған Nexus түләүҙәр.

## 2-се өлгө: ҡулланыусылар урындағы символды түләй {#pattern-2-users-pay-a-local-token}

Ҡулланыусылар XOR тотмаҫҡа тейеш булғанда ҡулланығыҙ, әммә мәғлүмәттәр киңлеге барыбер эске ҡушымта түләүен, кредит сығымдарын йәки квота токенды теләй.

Был өлгөлә, урындағы токен - заявка түләү. ул селтәр хаҡы актив түгел. спонсор һаман да селтәр хаҡы түләй XOR.

Мәҫәлән, шәхси мәғлүмәттәр киңлегендә локаль билдә ҡулланығыҙ:

```text
usage#billing.team
```

Фонд ҡулланыусылары `usage#billing.team` бортҡа инеү, яҙылыу яңыртыу йәки квота бүлеү ваҡытында. Унан һуң ҡулланыусы транзакция атомлаштырыу:

1. локаль токендарҙы ҡулланыусынан спонсорға күсереү
2. һоралған ҡушымта операцияһын башҡарыу
3. `fee_sponsor` метамәғлүмәттәрен үҙ эсенә ала, шуға күрә спонсор XOR түләй.

Минималь CLI smoke testы - был бары тик XOR тарафынан спонсорлаштырылған урындағы билдәләр күсереү генә:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Ысын ҡушымта өсөн, урындағы токен түләүҙе айырым иң яҡшы тырышлыҡ транзакцияһы итеп тапшырмағыҙ. Бер ҡул ҡуйылған транзакция төҙөгөҙ, унда түләү һәм бизнес-инструкция бар, йәки бизнес-операцияны ҡулланыр алдынан урындағы токонды йыя торған контракт инеү пунктын асығыҙ.

Ҡушымтағыҙҙа йәки контрактта конверсия сәйәсәтен һаҡлағыҙ:

- ниндәй операция күпме урындағы токен берәмектәре тора
- XOR тулыландырыуҙарҙы яҡлау өсөн урындағы токен инеү карталары нисек
- ҡулланыусының балансы бик түбән булғанда нимә була
- спонсорҙың XOR балансы бик түбән булғас, нимә була?

::: warning

Ҡулланырға ярамай `gas_asset_id` "Урындағы билдәләр өсөн түләү" моделе өсөн, әгәр һеҙ теләмәйһегеҙ спонсорҙы был газ активта ла түләргә. `fee_sponsor` шулай уҡ ҡуртымсыны конфигурацияланған газ үткәргестәре активтары өсөн түләүсе итеп ҡуя. Урынлы-токен ҡулланыусы түләүҙәр өсөн, күсермә йәки килешеү ҡағиҙәһе менән асыҡтан-асыҡ токен йыйырға.

:::

## Файҙаланылмаған спонсорлаштырылған транзакцияларҙы дебюгалау {#debug-failed-sponsored-transactions}

Ғәҙәттән тыш хәлгә ҡағылышлы сәбәптәр, ғәҙәттә, бер баҫҡысҡа иғтибар итә:

|Хата тексы |Нимә тикшерергә ?|
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` әле лә `false` узелында. |
|`fee sponsor is not authorized` |Ҡулланыусы өсөн был спонсор өсөн `CanUseFeeSponsor` юҡ. |
|`fee asset ... is missing` |Спонсор конфигурацияланған XOR түләү активын тотмай. |
|`fee balance ... is insufficient` |Спонсорҙың XOR балансын арттырыу. |
|`fee exceeds sponsor_max_fee` |`sponsor_max_fee` арттырыу йәки транзакция күләмен/газын кәметеү. |
|`invalid nexus fee asset id` |`nexus.fees.fee_asset_id` йәки XOR активтар исемдәре. |

2-се паттернды дебгажлағанда ике балансты ла тикшерегеҙ:

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

## Спонсорҙы файҙаланығыҙ {#operate-the-sponsor}

Спонсорҙы казначейлыҡ иҫәбенә һалыу:

- һынау селтәре, этаплаштырыу һәм төп селтәр өсөн айырым спонсор асҡыстарын һаҡлай.
- XOR балансы ҡабул итеү кимәленә еткәнсе иҫкәртеү
- Юл хәрәкәте билдәләнгәндән һуң, `sponsor_max_fee` сикләүен ҡуйыу
- ставка-лимит менән тәьмин ителгән яҙмалар һеҙҙең заявка йәки шлюз
- `CanUseFeeSponsor` ҡулланыусылар мәғлүмәттәр арауығын ҡалдырған саҡта кире ҡағыла
- ҡулланыусылар транзакцияһы хештарын, локаль билдәләр менән түләүҙәрҙе һәм спонсор XOR дебиттарын көйләү

Ҡулланыусы өсөн спонсорлыҡты юҡҡа сығарыу:

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

## Төрлө биттәр {#related-pages}

- [SORA Nexus Dataspaces](/ba/get-started/sora-nexus-dataspaces.md) менән тоташтырыу
- [Iroha 3 аша хәрәкәт итеү CLI ](/ba/get-started/operate-iroha-via-cli.md)
- [Активтар](/ba/blockchain/assets.md)
- [Разрешениелар](/ba/blockchain/permissions.md)
- [Разрешение токендары](/ba/reference/permissions.md)
