---
translation_locale: ba
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Ваҡланған мультисиг {#weighted-multisig}

## Һөҙөмтә {#outcome}

Taira иҫәбендә өс кешенән торған күп һанлы иҫәпте теркәгеҙ, метамәғлүмәт инструкцияһын тәҡдим итегеҙ, уны кворумға етерлек ауырлыҡ менән раҫлағыҙ һәм күп һанлы иҫәбенең ғәмәлгә ашырылыуы тураһында мәғлүмәтте тикшерегеҙ.

## Шарттар {#prerequisites}

- Өс каноник I105 ҡултамғалаусы IDs үҙ эсенә `SIGNER_A`, `SIGNER_B`, һәм `SIGNER_C`.
- A һәм C ҡултамғасылары өсөн финансланған Taira конфигурациялар. Тәҡдим итеүсе һәм һәр раҫлаусы үҙ транзакцияһы өсөн түләй.
- `taira.tx-metadata.json` хәҙерге faucet яуаптан яһалған, бер ҡасан да күсергән түләү активтан ID.
- А Rust клиент проекты шул уҡ Iroha сығанаҡ ревизияһы Taira һуңғараҡ тәҡдим һәм раҫлау этаптарында ҡулланыу CLI.
- Хәҙерге башҡарыусының күп миҡдарлы функцияһы булдырылған. Регистрация ябай иҫәптәр өсөн алдан билдәләнгән ваҡытта Iroha 3 эшләй, әммә Taira сәйәсәте һәм түләү ҡабул итеүе һаман да ғәмәлдә; әгәр йәмәғәт ҡулланыу уны инҡар итһә, localnet ҡулланығыҙ.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Аҙымдар {#steps}

### 1. Күләмле сәйәсәт яҙыу {#_1-register-a-weighted-policy}

C-ның ауырлығы 2; A һәм B-ҙың һәр береһенең ауырлығы 1. Шуға күрә 3-тән торған кворум өсөн C плюс A йәки B талап ителә. Теркәлгәнгә тиклем шул уҡ сәйәсәттән каноник иҫәпте сығарығыҙ, һуңынан шул уҡ баһаны `MultisigRegister::with_account`ҡа күсерегеҙ:

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigPropose, MultisigRegister, MultisigSpec,
    },
};

let spec = MultisigSpec::new(
    BTreeMap::from([
        (signer_a.clone(), 1),
        (signer_b.clone(), 1),
        (signer_c.clone(), 2),
    ]),
    NonZeroU16::new(3).unwrap(),
    NonZeroU64::new(3_600_000).unwrap(),
);
let members = spec
    .signatories
    .iter()
    .map(|(account, weight)| {
        let key = account
            .controller()
            .single_signatory()
            .expect("multisig members must be single-key accounts");
        MultisigMember::new(key.clone(), u16::from(*weight))
            .expect("weights are nonzero")
    })
    .collect();
let policy = MultisigPolicy::new(spec.quorum.get(), members)?;
let multisig_account = AccountId::new_multisig(policy);
let register = MultisigRegister::with_account(
    multisig_account.clone(),
    None::<DomainId>,
    spec,
);

registrar.submit_blocking::<InstructionBox>(
    register.into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
println!("{}", multisig_account.canonical_i105()?);
```

CLI этаптары өсөн баҫтырылған ҡиммәтте һаҡлағыҙ:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

CLI теркәлеү командаһы, ҡағыҙланған commit-та, уның ваҡытлыса орлоғон яҙҙыра. был орлоҡто контроллер сифатында ҡабаттан файҙаланмағыҙ. контроллерҙың шәхси асҡысы юҡ: multisig власы тик раҫланған тәҡдимдәрҙән килә.

### 2. Берәр күрһәтмәне тапшырмайынса төҙөгөҙ. {#_2-build-one-instruction-without-submitting-it}

Глобаль `-o` коммутатор инструкциялар массивын стандарт сығарылышҡа сериаллаштыра. Ул бер транзакцияны ла индермәй һәм шуның өсөн түләү түләмәй.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. "А" тип тәҡдим итегеҙ. {#_3-propose-as-signer-a}

Тәҡдим итеүсе үҙенән-үҙе үҙенең ауырлығын индерә. CLI тарафынан баҫтырылған теүәл инструкция хешын ҡуллана; хуплауҙар шул хешҡа бәйләнә.

```bash
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger multisig propose \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
test -n "$INSTRUCTIONS_HASH"
```

Әле асыла торған тәҡдимде асыҡ сикләнгән һайлаусы менән исемлеккә индер:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. ҡултамға ҡуйыусы C тип раҫлау. {#_4-approve-as-signer-c}

A-ның 1 ауырлығы менән C-ның 2 ауырлығы quorum 3-кә етә һәм тәҡдим ителгән instruction-ды multisig account исеменән үтәй.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust клиенты шул уҡ сәйәсәт иҫәбенә һәм юғарыла ҡулланылған ике йәшәү циклы күрһәтмәләре менән дауам итә ала:

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
signer_a_client.submit_blocking::<InstructionBox>(
    MultisigPropose::new(multisig_account.clone(), instructions, None).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit_blocking::<InstructionBox>(
    MultisigApprove::new(multisig_account, instructions_hash).into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Тикшереү {#verify}

Артабанғы мәғлүмәтте уҡығыҙ һәм тәҡдимдең башҡаса тикшерелмәгәнен раҫлағыҙ:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

Метамәғлүмәттәрҙең ҡиммәте `"approved"` булырға тейеш, ҡулланған инструкция хэшиғы башҡаса күреүсән булып күренергә тейеш түгел һәм тикшерелгән контроллер ауырлыҡтарҙы `1, 1, 2` кворум менән күрһәтергә тейеш `3`.

## Проблемаларҙы хәл итеү {#troubleshooting}

- `signatory is not part of multisig` - тәҡдим итеүсе йәки раҫлаусы клиент полиста теркәлгән I105 IDs клиенттарының береһенә тап килмәй.
- Күп миҡдарлы иҫәпкә тәҡдим ителгән күрһәтмәләрҙе башҡарыу өсөн рөхсәт булмағанда, һуңғы раҫлау кире ҡағыла ала. Күп ҡултамғалы иҫәпкә генә түгел, ә ҡалған ҡултамғалаусыларға рөхсәт итегеҙ.
- Ҡатнашыла торған тәҡдим булмаһа, кворумға өлгәшелгән булыуы ихтимал. TTL тамамланды, йәки яңылыш инструкция хэш / иҫәп һайлаусыһы ҡулланылды. Тағы бер тапҡыр тәҡдим итер алдынан, дәүләт имтиханын һорағыҙ.
- Икеләтә раҫлауҙар ауырлыҡ өҫтәмәй. Һәр теркәлгән ҡул ҡуйған кеше үҙенең конфигурацияланған ауырлығын бер тапҡыр ғына индерә.
- Тура транзакцияға ҡул ҡуйыу контролер булараҡ тыйыла. Һәр ваҡыт `MultisigPropose` һәм `MultisigApprove` ҡулланығыҙ.
- Әгәр һуңғараҡ командалар CLI теркәү ваҡытында баҫылған иҫәпте таба алмаһа, һеҙ ваҡытлыса орлоҡто алғанһығыҙ. Каноник иҫәбен ҡушҡан сәйәсәттән сығарығыҙ һәм юғарыла күрһәтелгәнсә шул ҡиммәт менән теркәлегеҙ.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Пинк commit-та Multisig интеграция һынауҙары](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Пинк commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs) буйынса Multisig мәғлүмәт моделе
- [CLI ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs) буйынса multisig тормошҡа ашырыу
- [Транзакциялар](/ba/blockchain/transactions.md)
- [Рөхсәт һәм ролдәр](./permissions-and-roles.md)
