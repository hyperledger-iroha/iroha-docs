---
translation_locale: kk
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Салмақталған мультисиг {#weighted-multisig}

## Нәтиже {#outcome}

Taira жерде үш мүшелі салмақталған мультисиг аккаунтты тіркеп, метадеректер нұсқауын ұсыныңыз, оны кворумға жететін салмақпен бекітіп, мультисиг аккаунттың күйінен орындалуын тексеріңіз.

## Алдын ала шарттар {#prerequisites}

- Үш бірегей хаттама-стандарт I105 қол қоюшы идентификаторы `SIGNER_A`, `SIGNER_B` және `SIGNER_C` мекенжайларында.
- A және C криптографиялық қолтаңба берушілері үшін Taira конфигурациялары қаржыландырылды. Ұсынған адам мен әрбір бекітуші өздерінің транзакциясы үшін төлейді.
- CLI арқылы жазу операциялары `--fee-payer authority` пайдаланады; CLI қол қоюдан бұрын Taira ақы активіндегі нақты ақы бағасын алады.
- Тіркеу қадамы үшін `iroha` және `iroha_model_base` пакеттеріне тәуелді, Taira-мен бірдей Iroha бастапқы код нұсқасына бекітілген Rust клиент жобасы. Кейінгі ұсыныс және мақұлдау қадамдары CLI-ды пайдаланады.
- Ағымдағы орындаушының мультисиг функциясы қосылған. Тіркеу әдепкі Iroha 3 бағдарламалық орындау ортасында қарапайым есептік жазбаларға қолжетімді, дегенмен Taira саясаты мен төлем төлеу талаптары әлі де қолданылады; егер қоғамдық орналастыру оны қабылдамаса, localnet қолданыңыз.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Қадамдар {#steps}

### 1. Салмақталған саясатты тіркеу {#_1-register-a-weighted-policy}

C қол қоюшысының салмағы 2; A мен B-ның әрқайсысының салмағы 1. Сондықтан 3 кворумы үшін C және A немесе B қажет. Мұнда `registrar` — `iroha::blocking::Client`, оның `submit` әдісі Applied түпкілікті күйін күтеді. Тіркеуден бұрын канондық есептік жазбаны дәл осы саясаттан шығарып алыңыз, содан кейін сол мәнді `MultisigRegister::with_account` әдісіне беріңіз:

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

CLI қадамдары үшін басылған мәнді сақтаңыз:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

Бекітілген бастапқы код нұсқасында CLI тіркеу командасы орындау ортасы оның кілтін ауыстырмай тұрып, өзінің уақытша seed мәнін басып шығарады. Бұл seed мәнін контроллер ретінде қайта пайдаланбаңыз. Контроллердің жеке кілті жоқ: мультиқолтаңба өкілеттігі тек мақұлданған ұсыныстардан келеді. Оның орнына CLI арқылы тіркеу үшін саясаттан шығарылған мәнді `ledger multisig register --account` командасына беріңіз.

### 2. Оны жіберместен бір нұсқаулық жасаңыз {#_2-build-one-instruction-without-submitting-it}

Жаһандық `--emit-instructions` қосқышы нұсқаулар массивін жіберудің орнына стандартты шығысқа басып шығарады, сондықтан ешқандай ақы жұмсалмайды.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Криптографиялық қолтаңба беруші ретінде A ұсыныңыз {#_3-propose-as-signer-a}

Ұсыныс жасаушы өз салмағын автоматты түрде қосады. Жаңа ұсыныс nonce мәнін жасап, оны кез келген қайталау үшін сақтаңыз. CLI басып шығарған ұсыныс ID-ін және нұсқау хэшін жазып алыңыз; мақұлдаулар екеуіне де байланады.

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

Ашық айқын таңдау құрылғысы бар әлі қаралуда тұрған ұсыныстар тізімін көрсетіңіз:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Криптографиялық қолтаңба беруші C ретінде мақұлдау {#_4-approve-as-signer-c}

A-ның салмағы 1 және C-нің салмағы 2 көпшілік 3-ке жетеді және көпқауіпті шот ретінде ұсынылған нұсқауды орындайды.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust клиенті саясаттан шығарылған сол есептік жазбамен және жоғарыда қолданылған өмірлік циклдің екі нұсқауымен жалғастыра алады. Әр қол қоюшы клиенті — `iroha::blocking::Client`; ұсыныс ID-і клиенттің желісінен, мультиқолтаңбалы есептік жазбадан және жаңа nonce мәнінен шығарылады:

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

## Растау {#verify}

Өткізілген күйді оқып, ұсыныстың енді күтуде еместігін растаңыз:

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

Метадеректер мәні `"approved"` болуы керек, жазып алынған ұсыныс ID-і мен нұсқау хэші бұдан былай күтудегі ретінде көрінбеуі тиіс, ал тексерілген контроллер `threshold` `3`, `total_weight` `4` және мүшелердің 1, 1 және 2 салмақтарын көрсетуі керек; мүшелер ашық кілттер ретімен тізіледі.

## Ақауларды жою {#troubleshooting}

- `not qualified to propose multisig` немесе `not qualified to approve multisig` ұсыныс жасайтын немесе мақұлдайтын клиент саясатта тіркелген I105 ID-лерінің ешқайсысына сәйкес келмейтінін білдіреді.
- Соңғы мақұлдауды мультиқолтаңбалы есептік жазба ұсынылған нұсқауларды орындау құқығы жоқ болғанда қайтаруға болады. Рұқсат беру уәкілетті субъектіні тек жеке криптографиялық қолтаңбаларға емес, мультиқолтаңбалы есептік жазбаға беріңіз, содан кейін қалған криптографиялық қолтаңбашыға қайта әрекет етуге рұқсат етіңіз.
- Күтудегі ұсыныстың болмауы кворумға әлдеқашан жеткенін, TTL мерзімі өткенін немесе қате ұсыныс ID-і, нұсқау хэші не есептік жазба селекторы пайдаланылғанын білдіруі мүмкін. Жаңа nonce мәнімен қайта ұсыныс жасамас бұрын кейінгі күйді сұрау арқылы тексеріңіз.
- Қайталаған мақұлдаулар салмақ қоспайды. Әр тіркелген қол қойған адам өзінің бапталған салмағын ең көп бір рет қана қосады.
- Басқарушы ретінде қарапайым транзакцияны тікелей қол қою тыйым салынады. Әрқашан `MultisigPropose` және `MultisigApprove` пайдаланыңыз.
- Егер кейінгі командалар CLI тіркеу кезінде басылып шыққан аккаунтты таба алмаса, сіз уақытша тұқымды ұстадыңыз. Тапсырыс бойынша саясаттан бір протоколға сай аккаунтты шығарып, жоғарыда көрсетілген мәнмен тіркеңіз.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Бірнеше қолтаңба интеграциясы тесттері бекітілген бастапқы код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [Бекітілген көз-код нұсқасындағы Multisig деректер моделі](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI байланған бастапқы код нұсқасында көпқолды (multisig) жүзеге асыру](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Келісім-шарттар](/kk/blockchain/transactions.md)
- [Рұқсаттар мен рөлдер](./permissions-and-roles.md)
