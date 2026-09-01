---
translation_locale: kk
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Салмақталған мультисиг {#weighted-multisig}

## Нәтиже {#outcome}

Taira жерде үш мүшелі салмақталған мультисиг аккаунтты тіркеп, метадеректер нұсқауын ұсыныңыз, оны кворумға жететін салмақпен бекітіп, мультисиг аккаунттың күйінен орындалуын тексеріңіз.

## Алдын ала шарттар {#prerequisites}

- Үш бірегей хаттама-стандарт I105 қол қоюшы идентификаторы `SIGNER_A`, `SIGNER_B` және `SIGNER_C` мекенжайларында.
- A және C криптографиялық қолтаңба берушілері үшін Taira конфигурациялары қаржыландырылды. Ұсынған адам мен әрбір бекітуші өздерінің транзакциясы үшін төлейді.
- `taira.tx-metadata.json` ағымдағы тестнет қаржыландыру қызметінің жауабынан жасалған, ешқашан көшірілген төлем активінің идентификаторынан емес.
- Тіркелу қадамы үшін Taira сияқты Iroha бастапқы нұсқасына бекітілген Rust клиент жобасы. Кейінгі ұсыныс және мақұлдау қадамдары CLI қолданады.
- Ағымдағы орындаушының мультисиг функциясы қосылған. Тіркеу әдепкі Iroha 3 бағдарламалық орындау ортасында қарапайым есептік жазбаларға қолжетімді, дегенмен Taira саясаты мен төлем төлеу талаптары әлі де қолданылады; егер қоғамдық орналастыру оны қабылдамаса, localnet қолданыңыз.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Қадамдар {#steps}

### 1. Салмақталған саясатты тіркеу {#_1-register-a-weighted-policy}

криптографиялық қолтаңба беруші C салмағы 2; A және B әрқайсысы 1 салмаққа ие. Сондықтан 3 кворумға C мен A немесе B қажет. Тіркеуден бұрын дәл осы саясат бойынша бір протокол-стандартты есептік жазбаны шығарыңыз, содан кейін сол мәнді `MultisigRegister::with_account` мекенжайына жіберіңіз:

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

CLI қадамдары үшін басылған мәнді сақтаңыз:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

Бекітілген дереккөз кодтың нұсқасында, CLI тіркеу командасы бағдарламаны орындау ортасы оны қайта кілттеуден бұрын оның уақытша тұқымын шығарады. Сол тұқымды контроллер ретінде қайта пайдаланбаңыз. Контроллердің жеке кілті жоқ: көп қолтаңбалы уәкілетті субъект тек мақұлданған ұсыныстардан алынған.

### 2. Оны жіберместен бір нұсқаулық жасаңыз {#_2-build-one-instruction-without-submitting-it}

Жаһандық `-o` қосқыш нұсқаулар массивін стандартты шығысқа сериализациялайды. Ол транзакцияны жібермейді және сондықтан ешқандай төлем жұмсамайды.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Криптографиялық қолтаңба беруші ретінде A ұсыныңыз {#_3-propose-as-signer-a}

Ұсыныс жасаушы өз салмағын автоматты түрде қосады. CLI арқылы басып шығарылған дәл нұсқауды криптографиялық хэшті алыңыз; мақұлдаулар сол криптографиялық хэшке байлалады.

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
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust клиент жоғарыда қолданылған екі өмірлік цикл нұсқауларымен бірге сол саясатқа негізделген есепшот арқылы жалғастыруы мүмкін:

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

## Растау {#verify}

Өткізілген күйді оқып, ұсыныстың енді күтуде еместігін растаңыз:

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

Мета деректер мәні `"approved"` болуы керек, алынған нұсқаулық криптографиялық хеші енді күтіп тұрған ретінде көрінбеуі керек және тексерілген контроллерде салмақтар `1, 1, 2` кворуммен `3` көрсетілуі керек.

## Ақауларды жою {#troubleshooting}

- `signatory is not part of multisig` дегеніміз ұсынысты беруші немесе мақұлдаушы клиент саясатта тіркелген I105 ID-лардың біріне сәйкес келмейтінін білдіреді.
- Соңғы мақұлдауды мультиқолтаңбалы есептік жазба ұсынылған нұсқауларды орындау құқығы жоқ болғанда қайтаруға болады. Рұқсат беру уәкілетті субъектіні тек жеке криптографиялық қолтаңбаларға емес, мультиқолтаңбалы есептік жазбаға беріңіз, содан кейін қалған криптографиялық қолтаңбашыға қайта әрекет етуге рұқсат етіңіз.
- Жоғалған күтіп тұрған ұсыныс бұл кворумның 이미 жеткенін, TTL мерзімінің аяқталғанын немесе қате нұсқаулық хэш/есептік жазба селекторын қолданғанын білдіруі мүмкін. Қайта ұсынар алдында соңғы күйді сұраңыз.
- Қайталаған мақұлдаулар салмақ қоспайды. Әр тіркелген қол қойған адам өзінің бапталған салмағын ең көп бір рет қана қосады.
- Басқарушы ретінде қарапайым транзакцияны тікелей қол қою тыйым салынады. Әрқашан `MultisigPropose` және `MultisigApprove` пайдаланыңыз.
- Егер кейінгі командалар CLI тіркеу кезінде басылып шыққан аккаунтты таба алмаса, сіз уақытша тұқымды ұстадыңыз. Тапсырыс бойынша саясаттан бір протоколға сай аккаунтты шығарып, жоғарыда көрсетілген мәнмен тіркеңіз.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Бірнеше қолтаңба интеграциясы тесттері бекітілген бастапқы код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Бекітілген көз-код нұсқасындағы Multisig деректер моделі](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI байланған бастапқы код нұсқасында көпқолды (multisig) жүзеге асыру](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Келісім-шарттар](/kk/blockchain/transactions.md)
- [Рұқсаттар мен рөлдер](./permissions-and-roles.md)
