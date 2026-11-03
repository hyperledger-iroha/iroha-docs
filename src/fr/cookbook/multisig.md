---
translation_locale: fr
translation_source: /cookbook/multisig.md
translation_source_hash: 7fca7feca0c27d41a14d1c38497c23aa9f1afe37c5ac19cd8e79c487dc35cc5e
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Multisig pondéré {#weighted-multisig}

## Résultat {#outcome}

Enregistrez un compte multisig pondéré à trois membres sur Taira, proposez une instruction de métadonnées, approuvez-la avec suffisamment de poids pour atteindre le quorum, et vérifiez l'exécution à partir de l'état du compte multisig.

## Prérequis {#prerequisites}

- Trois identifiants de signataires canoniques I105 dans `SIGNER_A`, `SIGNER_B` et `SIGNER_C`.
- Configurations Taira financées pour les signataires cryptographiques A et C. Le proposant et chaque approbateur paient leur propre transaction.
- Les écritures du CLI utilisent `--fee-payer authority` ; le CLI établit le devis exact des frais, dans l'actif de frais de Taira, avant de signer.
- Un projet client Rust qui dépend de `iroha` et `iroha_model_base`, épinglé à la même révision source Iroha que Taira, pour l'étape d'enregistrement. Les étapes ultérieures de proposition et d'approbation utilisent le CLI.
- La fonctionnalité multisig de l'exécuteur actuel est activée. L'inscription est disponible pour les comptes ordinaires dans l'environnement d'exécution logiciel par défaut Iroha 3, bien que la politique et les frais d'admission Taira s'appliquent toujours ; utilisez localnet si le déploiement public les refuse.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Étapes {#steps}

### 1. Enregistrer une politique pondérée {#_1-register-a-weighted-policy}

Le signataire cryptographique C a un poids de 2 ; A et B ont chacun un poids de 1. Un quorum de 3 nécessite donc C plus soit A, soit B. Ici, `registrar` est un `iroha::blocking::Client`, dont `submit` attend la finalité appliquée. Dérivez le compte canonique à partir de cette politique exacte avant l'enregistrement, puis transmettez la même valeur à `MultisigRegister::with_account` :

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

Enregistrez la valeur imprimée pour les étapes CLI :

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

Au commit épinglé, la commande d'enregistrement CLI imprime sa graine temporaire avant que l'environnement d'exécution ne change sa clé. Ne réutilisez pas cette graine en tant que contrôleur. Il n'y a pas de clé privée du contrôleur : l'autorité multisig provient uniquement des propositions approuvées. Pour enregistrer plutôt depuis le CLI, transmettez la valeur dérivée de la politique à `ledger multisig register --account`.

### 2. Construisez une instruction sans la soumettre {#_2-build-one-instruction-without-submitting-it}

Le commutateur global `--emit-instructions` imprime le tableau d'instructions sur la sortie standard au lieu de le soumettre ; il n'entraîne donc pas de frais.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" --emit-instructions \
    account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Proposer comme signataire cryptographique A {#_3-propose-as-signer-a}

Le proposant contribue automatiquement avec son propre poids. Générez un nouveau nonce de proposition et conservez-le pour toute nouvelle tentative. Capturez l'ID de la proposition et le hachage cryptographique de l'instruction imprimés par le CLI ; les approbations se lient aux deux.

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
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --proposal-id "$PROPOSAL_ID" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Le client Rust peut continuer avec le même compte dérivé de la politique et les deux instructions de cycle de vie utilisées ci-dessus. Chaque client signataire est un `iroha::blocking::Client` ; l'ID de la proposition est dérivé du réseau du client, du compte multisig et d'un nouveau nonce :

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

## Vérifier {#verify}

Lisez l'état postérieur et confirmez que la proposition n'est plus en attente :

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

La valeur des métadonnées doit être `"approved"`, l'ID de proposition et le hachage cryptographique de l'instruction capturés ne doivent plus apparaître comme en attente, et le contrôleur inspecté doit afficher `threshold` `3`, `total_weight` `4` et des poids de membres de 1, 1 et 2 ; les membres sont listés dans l'ordre de leurs clés publiques.

## Dépannage {#troubleshooting}

- `not qualified to propose multisig` ou `not qualified to approve multisig` signifie que le client proposant ou approuvant ne correspond pas à l'un des identifiants I105 enregistrés dans la politique.
- Une approbation finale peut être rejetée lorsque le compte multisig n'a pas la permission d'exécuter les instructions proposées. Accordez le principal d'autorisation au compte multisig, pas seulement à ses signataires cryptographiques individuels, puis laissez un signataire cryptographique restant réessayer.
- Une proposition en attente manquante peut signifier que le quorum a déjà été atteint, que le TTL a expiré, ou qu'un mauvais ID de proposition, hachage d'instruction ou sélecteur de compte a été utilisé. Interrogez l'état postérieur avant de proposer à nouveau avec un nouveau nonce.
- Les approbations en double n'ajoutent pas de poids. Chaque signataire enregistré contribue à son poids configuré au maximum une fois.
- Il est interdit de signer directement une transaction normale en tant que contrôleur. Utilisez toujours `MultisigPropose` et `MultisigApprove`.
- Si les commandes ultérieures ne peuvent pas trouver le compte imprimé lors de l'enregistrement CLI, vous avez capturé la graine temporaire. Dérivez le compte canonique à partir de la politique ordonnée et inscrivez-le avec cette valeur comme indiqué ci-dessus.

## Source et documents connexes {#source-and-related-docs}

- [Tests d'intégration multisignature au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/multisig.rs)
- [Modèle de données multisignature au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/isi.rs)
- [CLI implémentation multisig au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Transactions](/fr/blockchain/transactions.md)
- [Autorisations et rôles](./permissions-and-roles.md)
