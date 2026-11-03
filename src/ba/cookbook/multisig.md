---
translation_locale: ba
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Ваҡланған мультисиг {#weighted-multisig}

## Һөҙөмтә {#outcome}

Taira иҫәбендә өс кешенән торған күп һанлы иҫәпте теркәгеҙ, метамәғлүмәт инструкцияһын тәҡдим итегеҙ, уны кворумға етерлек ауырлыҡ менән раҫлағыҙ һәм күп һанлы иҫәбенең ғәмәлгә ашырылыуы тураһында мәғлүмәтте тикшерегеҙ.

## Шарттар {#prerequisites}

- Өс каноник I105 ҡултамғалаусы IDs үҙ эсенә `SIGNER_A`, `SIGNER_B`, һәм `SIGNER_C`.
- A һәм C ҡултамғасылары өсөн финансланған Taira конфигурациялар. Тәҡдим итеүсе һәм һәр раҫлаусы үҙ транзакцияһы өсөн түләй.
- CLI аша яҙыуҙар `--fee-payer authority` ҡуллана; CLI ҡул ҡуйыр алдынан теүәл комиссияны Taira-ның түләү активында иҫәпләп күрһәтә.
- Теркәү аҙымы өсөн `iroha` һәм `iroha_model_base` пакеттарына бәйле, Taira менән бер үк Iroha сығанаҡ ревизияһына беркетелгән Rust клиент проекты. Һуңғыраҡ тәҡдим һәм раҫлау аҙымдары CLI ҡуллана.
- Хәҙерге башҡарыусының күп миҡдарлы функцияһы булдырылған. Регистрация ябай иҫәптәр өсөн алдан билдәләнгән ваҡытта Iroha 3 эшләй, әммә Taira сәйәсәте һәм түләү ҡабул итеүе һаман да ғәмәлдә; әгәр йәмәғәт ҡулланыу уны инҡар итһә, localnet ҡулланығыҙ.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Аҙымдар {#steps}

### 1. Күләмле сәйәсәт яҙыу {#_1-register-a-weighted-policy}

C ҡул ҡуйыусыһының ауырлығы 2; A һәм B-ның һәр береһенең ауырлығы 1. Шуға күрә 3 кворумы өсөн C һәм A йәки B кәрәк. Бында `registrar` — `iroha::blocking::Client`, уның `submit` методы Applied һуңғы торошона етеүен көтә. Теркәүгә тиклем каноник иҫәпте нәҡ шул сәйәсәттән сығарып алығыҙ, һуңынан шул уҡ ҡиммәтте `MultisigRegister::with_account`-ҡа бирегеҙ:

```rust
use std::{collections::BTreeMap, num::{NonZeroU16, NonZeroU64}};
use iroha::{
    data_model::{
        account::{MultisigMember, MultisigPolicy},
        prelude::*,
        transaction::FeePaymentIntent,
    },
    executor_data_model::isi::multisig::{
        MultisigApprove, MultisigProposalId, MultisigProposalNonce,
        MultisigPropose, MultisigRegister, MultisigSpec,
    },
};
use iroha_model_base::domain::DomainId;

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

registrar.submit::<InstructionBox>(
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

Ҡуйылған commit-та CLI теркәү командаһы ваҡытлыса орлоғон башҡарыу мөхите асҡысты яңыһына алыштырғансы баҫтырып сығара. Был орлоҡто контроллер итеп ҡабат ҡулланмағыҙ. Контроллерҙың шәхси асҡысы юҡ: multisig вәкәләте тик раҫланған тәҡдимдәрҙән генә килә. Уның урынына CLI аша теркәү өсөн сәйәсәттән сығарылған ҡиммәтте `ledger multisig register --account`-ҡа бирегеҙ.

### 2. Берәр күрһәтмәне тапшырмайынса төҙөгөҙ. {#_2-build-one-instruction-without-submitting-it}

Глобаль `--emit-instructions` флагы инструкциялар массивын тапшырыу урынына стандарт сығарылышҡа баҫтыра, шуға күрә ул комиссия түләмәй.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. "А" тип тәҡдим итегеҙ. {#_3-propose-as-signer-a}

Тәҡдим итеүсе үҙ ауырлығын автоматик рәүештә индерә. Тәҡдим өсөн яңы бер тапҡырлыҡ һан (nonce) булдырығыҙ һәм уны теләһә ниндәй ҡабатлау өсөн һаҡлағыҙ. CLI баҫтырған тәҡдим ID-һын һәм инструкция хешын яҙып алығыҙ; раҫлауҙар уларҙың икеһенә лә бәйләнә.

```bash
PROPOSAL_NONCE="$(openssl rand -hex 32)"
PROPOSE_OUTPUT="$({
  iroha --config "$SIGNER_A_CONFIG" \
    --output-format text \
    --fee-payer authority \
    ledger multisig propose \
    --proposal-nonce "$PROPOSAL_NONCE" \
    --account "$MULTISIG_ACCOUNT" \
    < multisig-instructions.json
})"
printf '%s\n' "$PROPOSE_OUTPUT"

PROPOSAL_ID="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^proposal_id: //p' |
    head -n 1
})"
INSTRUCTIONS_HASH="$({
  printf '%s\n' "$PROPOSE_OUTPUT" |
    sed -n 's/^instructions_hash: //p' |
    head -n 1
})"
test -n "$PROPOSAL_ID"
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
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust клиенты сәйәсәттән сығарылған шул уҡ иҫәп һәм юғарыла ҡулланылған ике тормош циклы инструкцияһы менән дауам итә ала. Һәр ҡул ҡуйыусы клиент — `iroha::blocking::Client`; тәҡдим ID-һы клиенттың селтәренән, multisig иҫәбенән һәм яңы бер тапҡырлыҡ һандан (nonce) сығарыла:

```rust
let instructions = vec![SetKeyValue::account(
    multisig_account.clone(),
    "cookbook_quorum".parse()?,
    Json::from("approved"),
).into()];
let instructions_hash = HashOf::new(&instructions);
// A fresh nonzero nonce, for example from `openssl rand -hex 32`.
let proposal_nonce: MultisigProposalNonce = "<FRESH_64_HEX_NONCE>".parse()?;
let proposal_id = MultisigProposalId::derive(
    signer_a_client.client().network_id(),
    &multisig_account,
    &proposal_nonce,
);
signer_a_client.submit::<InstructionBox>(
    MultisigPropose::new(
        multisig_account.clone(),
        proposal_nonce,
        instructions,
        None,
    )
    .into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
signer_c_client.submit::<InstructionBox>(
    MultisigApprove::new(multisig_account, proposal_id, instructions_hash)
        .into(),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Тикшереү {#verify}

Артабанғы мәғлүмәтте уҡығыҙ һәм тәҡдимдең башҡаса тикшерелмәгәнен раҫлағыҙ:

```bash
iroha --config "$SIGNER_A_CONFIG" account meta get \
  --id "$MULTISIG_ACCOUNT" \
  --key cookbook_quorum

iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"

iroha --config "$SIGNER_A_CONFIG" ledger multisig inspect \
  --account "$MULTISIG_ACCOUNT" \
  --json |
  jq .
```

Метамәғлүмәт ҡиммәте `"approved"` булырға тейеш, яҙып алынған тәҡдим ID-һы һәм инструкция хешы көтөүҙәге тәҡдимдәр араһында башҡа күренмәҫкә тейеш, ә тикшерелгән контроллер `threshold` `3`, `total_weight` `4` һәм ағзаларҙың 1, 1 һәм 2 ауырлыҡтарын күрһәтергә тейеш; ағзалар асыҡ асҡыстар тәртибендә һанала.

## Проблемаларҙы хәл итеү {#troubleshooting}

- `not qualified to propose multisig` йәки `not qualified to approve multisig` хатаһы тәҡдим итеүсе йәки раҫлаусы клиенттың сәйәсәттә теркәлгән I105 ID-ларының береһенә лә тап килмәүен аңлата.
- Күп миҡдарлы иҫәпкә тәҡдим ителгән күрһәтмәләрҙе башҡарыу өсөн рөхсәт булмағанда, һуңғы раҫлау кире ҡағыла ала. Күп ҡултамғалы иҫәпкә генә түгел, ә ҡалған ҡултамғалаусыларға рөхсәт итегеҙ.
- Көтөүҙәге тәҡдимдең булмауы кворумға инде өлгәшелгәнен, TTL ваҡыты үткәнен йәки дөрөҫ булмаған тәҡдим ID-һы, инструкция хешы йәки иҫәп һайлағысы ҡулланылғанын аңлатырға мөмкин. Яңы бер тапҡырлыҡ һан (nonce) менән ҡабат тәҡдим итер алдынан һуңғы торошто һорап алығыҙ.
- Икеләтә раҫлауҙар ауырлыҡ өҫтәмәй. Һәр теркәлгән ҡул ҡуйған кеше үҙенең конфигурацияланған ауырлығын бер тапҡыр ғына индерә.
- Тура транзакцияға ҡул ҡуйыу контролер булараҡ тыйыла. Һәр ваҡыт `MultisigPropose` һәм `MultisigApprove` ҡулланығыҙ.
- Әгәр һуңғараҡ командалар CLI теркәү ваҡытында баҫылған иҫәпте таба алмаһа, һеҙ ваҡытлыса орлоҡто алғанһығыҙ. Каноник иҫәбен ҡушҡан сәйәсәттән сығарығыҙ һәм юғарыла күрһәтелгәнсә шул ҡиммәт менән теркәлегеҙ.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [Пинк commit-та Multisig интеграция һынауҙары](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [Пинк commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs) буйынса Multisig мәғлүмәт моделе
- [CLI ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs) буйынса multisig тормошҡа ашырыу
- [Транзакциялар](/ba/blockchain/transactions.md)
- [Рөхсәт һәм ролдәр](./permissions-and-roles.md)
