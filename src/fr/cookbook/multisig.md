---
translation_locale: fr
translation_source: /cookbook/multisig.md
translation_source_hash: e1b57e1c4310dd0db8be8d9f5a15e1d4f693abb90b634772857eb4b1e86e4baf
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Multisig pondéré {#weighted-multisig}

## Résultat {#outcome}

Enregistrez un compte multisig pondéré à trois membres sur Taira, proposez une instruction de métadonnées, approuvez-la avec suffisamment de poids pour atteindre le quorum, et vérifiez l'exécution à partir de l'état du compte multisig.

## Prérequis {#prerequisites}

- Trois identifiants de signataires canoniques I105 dans `SIGNER_A`, `SIGNER_B` et `SIGNER_C`.
- Configurations Taira financées pour les signataires cryptographiques A et C. Le proposant et chaque approbateur paient leur propre transaction.
- `taira.tx-metadata.json` construit à partir de la réponse du service de financement du testnet actuel, jamais à partir d'un ID d'actif de frais copié.
- Un projet client Rust épinglé à la même révision source Iroha que Taira pour l'étape d'enregistrement. Les étapes ultérieures de proposition et d'approbation utilisent le CLI.
- La fonctionnalité multisig de l'exécuteur actuel est activée. L'inscription est disponible pour les comptes ordinaires dans l'environnement d'exécution logiciel par défaut Iroha 3, bien que la politique et les frais d'admission Taira s'appliquent toujours ; utilisez localnet si le déploiement public les refuse.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Étapes {#steps}

### 1. Enregistrer une politique pondérée {#_1-register-a-weighted-policy}

Le signataire cryptographique C a un poids de 2 ; A et B ont chacun un poids de 1. Un quorum de 3 nécessite donc C plus soit A, soit B. Dérivez le compte canonique à partir de cette politique exacte avant l'enregistrement, puis transmettez la même valeur à `MultisigRegister::with_account` :

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

Enregistrez la valeur imprimée pour les étapes CLI :

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

Au commit épinglé, la commande d'enregistrement CLI imprime sa graine temporaire avant que le logiciel d'exécution ne la recalcule. Ne réutilisez pas cette graine en tant que contrôleur. Il n'y a pas de clé privée du contrôleur : le principe d'autorisation multisignature vient uniquement des propositions approuvées.

### 2. Construisez une instruction sans la soumettre {#_2-build-one-instruction-without-submitting-it}

Le commutateur global `-o` sérialise un tableau d'instructions vers la sortie standard. Il ne soumet pas de transaction et ne engage donc aucun frais.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Proposer comme signataire cryptographique A {#_3-propose-as-signer-a}

Le proposant contribue automatiquement avec son propre poids. Capturez le hachage cryptographique exact de l'instruction imprimé par le CLI ; les approbations se lient à ce hachage cryptographique.

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

Listez la proposition encore en attente avec un sélecteur fini explicite :

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Approuver en tant que signataire cryptographique C {#_4-approve-as-signer-c}

Le poids 1 de A plus le poids 2 de C atteint le quorum 3 et exécute l'instruction proposée en tant que compte multisig.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Le client Rust peut continuer avec le même compte dérivé de la politique et les deux instructions de cycle de vie utilisées ci-dessus :

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

## Vérifier {#verify}

Lisez l'état postérieur et confirmez que la proposition n'est plus en attente :

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

La valeur des métadonnées doit être `"approved"`, le hachage cryptographique de l'instruction capturée ne doit plus apparaître comme en attente, et le contrôleur inspecté doit afficher les poids `1, 1, 2` avec un quorum `3`.

## Dépannage {#troubleshooting}

- `signatory is not part of multisig` signifie que le client proposant ou approuvant ne correspond pas à l'un des identifiants I105 enregistrés dans la police.
- Une approbation finale peut être rejetée lorsque le compte multisig n'a pas la permission d'exécuter les instructions proposées. Accordez le principal d'autorisation au compte multisig, pas seulement à ses signataires cryptographiques individuels, puis laissez un signataire cryptographique restant réessayer.
- Une proposition en attente manquante peut signifier que le quorum a déjà été atteint, que le TTL a expiré, ou que le mauvais hachage d'instruction/sélecteur de compte a été utilisé. Interrogez l'état postérieur avant de proposer à nouveau.
- Les approbations en double n'ajoutent pas de poids. Chaque signataire enregistré contribue à son poids configuré au maximum une fois.
- Il est interdit de signer directement une transaction normale en tant que contrôleur. Utilisez toujours `MultisigPropose` et `MultisigApprove`.
- Si les commandes ultérieures ne peuvent pas trouver le compte imprimé lors de l'enregistrement CLI, vous avez capturé la graine temporaire. Dérivez le compte canonique à partir de la politique ordonnée et inscrivez-le avec cette valeur comme indiqué ci-dessus.

## Source et documents connexes {#source-and-related-docs}

- [Tests d'intégration multisignature au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/multisig.rs)
- [Modèle de données multisignature au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI implémentation multisig au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Transactions](/fr/blockchain/transactions.md)
- [Autorisations et rôles](./permissions-and-roles.md)
