---
translation_locale: kk
translation_source: /cookbook/multisig.md
translation_source_hash: 7090228c4fea7321c93fe0d2c67ef6de842de95bc3befa11d83c12b9f15b4752
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Салмақты мультисиг {#weighted-multisig}

## Нәтижесі {#outcome}

Taira сайтында үш адамнан тұратын салмақталған көпбелгілі шотты тіркеңіз, метамәдени нұсқауды ұсынңыз, кворумға жету үшін жеткілікті салмақты бекітіңіз және көпбелгілік шоттың күйінен орындауды тексеріңіз.

## Алдын ала талаптар {#prerequisites}

- I105 және `SIGNER_C` `SIGNER_A`, `SIGNER_B`, IDs деген үш каноникалық қолтаңбалаушы бар.
- Қолтаңбалаушылар A және C үшін қаржыландырылған Taira конфигурациялар. Ұсыныс беруші мен әрбір мақұлдаушы өздерінің операциялары үшін ақы төлейді.
- `taira.tx-metadata.json` ағымдағы кранды жауаптан жасалған, ешқашан көшірілген алым активінен жасалмаған ID.
- Rust клиент жобасы тіркелу сатысында Taira сияқты Iroha бастапқы нұсқасына бекітілді. Кейінгі ұсыныс және бекіту кезеңдері CLI
- Ағымдағы орындаушының көпбелгілік функциясы рұқсат етілді. Тіркеу әдеттегі Iroha 3 жұмыс уақытында қарапайым шоттарға қол жетімді, бірақ Taira саясаты мен алым қабылдау әлі де қолданылады; егер қоғамдық іске асыру оны жоққа шығарса, localnet-ті қолданыңыз.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Қадамдар {#steps}

### 1. Бағалы саясатты тіркеу {#_1-register-a-weighted-policy}

C қолтаңбалаушының салмағы 2; A және B әрқайсысының салмағы 1. Сондықтан 3 кворумға C қосымша немесе A немесе B қажет. Тіркеуден бұрын осы нақты саясатты алып, содан кейін бірдей мәнді `MultisigRegister::with_account` -ге көшіріңіз:

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

CLI қадамдары үшін басып шығарылған мәнді сақтау:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

CLI тіркеу командасы тіркелу уақытын қайта жүктеу алдында уақытша тұқымдарын басып шығарады. Бұл тұқымдарды бақылаушы ретінде қайта қолданбаңыз. Бақылаушының жеке кілті жоқ: көп белгілік билік тек бекітілген ұсыныстардан келеді.

### 2. Тапсырма бермей-ақ бір нұсқауды жасаңыз {#_2-build-one-instruction-without-submitting-it}

Глобальді `-o` коммутаторы нұсқаулар массивін стандартты шығысқа сериализациялайды. Ол транзакцияны ұсынбайды және сондықтан ешқандай алым төлейді.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Қолтаңбалаушы ретінде ұсыныс жасаңыз {#_3-propose-as-signer-a}

Ұсыныс беруші өз салмағын автоматты түрде береді. CLI басып шығарылған нақты нұсқаулар хэшін түсіріңіз; бекітулер осы хешқа байланысты болады.

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

Таңдалып жатқан ұсынысты айқын шекті селектормен тізбелдеңіз:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Қолтаңбалаушы C ретінде бекітілсін {#_4-approve-as-signer-c}

A-ның салмағы 1 және C-нің салмағы 2 кворум 3-ке жетеді және ұсынылған нұсқауды көпбелгілі есеп ретінде орындайды.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Rust клиенті жоғарыда пайдаланылған екі өмірлік цикл нұсқаулықтарымен бірдей саясаттан алынған шотты жалғастыра алады:

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

## Тексеру {#verify}

Хатты оқып, ұсыныстың енді қолданылмай жатқанын растаңыз:

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

Метамәліметтердің мәні `"approved"`, түсірілген нұсқаулар хэшігі әлі күнге дейін көрсетілмеуі және тексерілген бақылаушы салмақтарды `1, 1, 2` кворуммен `3` көрсетуі тиіс.

## Қиындықтарды шешу {#troubleshooting}

- `signatory is not part of multisig` - ұсыныс білдіретін немесе мақұлдаған тапсырыс беруші саясатта тіркелген I105 IDs клиенттерінің біріне сәйкес келмейтінін білдіреді.
- Қорытынды мақұлдауға multisig тіркелгісі ұсынылған нұсқауларды орындау үшін рұқсатсыз болған жағдайда бас тарту мүмкін. Көп қолтаңбалы тіркелгіге ғана емес, жеке қолтаңбалаушыларға да билік беру. Содан кейін қалған қолтаңбаланушыны қайталап көріңіз.
- Жоғалған күтуде тұрған ұсыныс бұрын-соңды кворумқа қол жеткізілгендіктен, TTL мерзімі өткендіктен немесе қате нұсқаулар хэш/есеп таңбалаушысы пайдаланылғандығынан туындауы мүмкін.
- Қайталайтын мақұлданулар салмақ қосымайды. Әрбір тіркелген қолтаңбалаушы өзінің конфигурацияланған салмағын ең көп бір рет береді.
- Әдеттегі транзакцияны бақылаушы ретінде тікелей қол қоюға тыйым салынады. Әрқашан `MultisigPropose` және `MultisigApprove` қолданыңыз.
- Егер CLI тіркелу кезінде басып шығарылған шотты кейінгі командалар таба алмаса, онда сіз уақытша тұқымды ұстап алдыңыз. Қасиетті есепті тапсырылған саясаттан алып, жоғарыда көрсетілгендей осы мәнмен тіркеңіз.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [Тіркелген commit-де Multisig интеграциялық сынақтар](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/multisig.rs)
- [Тіркелген commit-де Multisig дерек үлгісі](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI көпбелгілі тапсырманы тіркейді](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Транзакциялар](/kk/blockchain/transactions.md)
- [Рұқсаттар және рөлдер](./permissions-and-roles.md)
