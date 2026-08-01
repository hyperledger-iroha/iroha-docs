---
translation_locale: fr
translation_source: /cookbook/multisig.md
translation_source_hash: 7090228c4fea7321c93fe0d2c67ef6de842de95bc3befa11d83c12b9f15b4752
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Multisig pondéré {#weighted-multisig}

## Le résultat {#outcome}

Enregistrer un compte multisig pondéré de trois membres sur Taira, proposer une instruction en matière de métadonnées, l'approuver avec suffisamment de poids pour satisfaire au quorum et vérifier l'exécution à partir de l'état du compte multisig.

## Conditions préalables {#prerequisites}

- Trois canoniques I105 signataire IDs dans `SIGNER_A`, `SIGNER_B`, et `SIGNER_C`.
- Configurations Taira financées pour les signataires A et C. Le proposant et chaque approuvé paient leur propre transaction.
- `taira.tx-metadata.json` construit à partir de la réponse du robinet actuel, jamais à partir d'un actif de redevance copié ID.
- Une Rust projet client fixé à la même Iroha révision de la source comme Taira Les étapes ultérieures de la proposition et de l'approbation utilisent le CLI.
- La fonctionnalité multisig de l'exécuteur actuel est activée. L'enregistrement est disponible pour les comptes ordinaires en temps d'exécution par défaut Iroha 3, bien que la politique et l'admission des frais Taira soient toujours applicables; utilisez localnet si le déploiement public le nie.

```bash
SIGNER_A_CONFIG=./taira.signer-a.toml
SIGNER_C_CONFIG=./taira.signer-c.toml
FEE_METADATA=./taira.tx-metadata.json
test -n "$SIGNER_A"
test -n "$SIGNER_B"
test -n "$SIGNER_C"
```

## Les étapes {#steps}

### 1. Enregistrer une politique pondérée {#_1-register-a-weighted-policy}

Le signe C a un poids 2; A et B ont chacun un poids. Un quorum de 3 nécessite donc C plus A ou B. Dériver le compte canonique à partir de cette politique exacte avant l'enregistrement, puis passer la même valeur à `MultisigRegister::with_account`:

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

Gardez la valeur imprimée pour les étapes CLI:

```bash
MULTISIG_ACCOUNT='<POLICY_DERIVED_I105_ACCOUNT_ID>'
test -n "$MULTISIG_ACCOUNT"
```

Lors de l'envoi fixé, la commande d'enregistrement CLI imprime sa semence temporaire avant que le temps d'exécution ne l'enregistre. Ne réutilisez pas ce grain comme contrôleur. Il n'y a pas de clé privée du contrôleur: l'autorité multisigne ne provient que des propositions approuvées.

### 2. Construire une instruction sans la soumettre. {#_2-build-one-instruction-without-submitting-it}

L'interrupteur global `-o` sérialise un tableau d'instructions à la sortie standard. Il ne soumet pas de transaction et ne dépense donc aucun frais.

```bash
printf '"approved"\n' |
  iroha --config "$SIGNER_A_CONFIG" -o \
    ledger account meta set \
    --id "$MULTISIG_ACCOUNT" \
    --key cookbook_quorum \
  > multisig-instructions.json

jq . multisig-instructions.json
```

### 3. Proposez comme signe A {#_3-propose-as-signer-a}

Le proposant contribue automatiquement à son propre poids. Capturez le hash exact de l'instruction imprimé par le CLI; les approbations se lient à ce hash.

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

Liste de la proposition en attente avec un sélecteur fin explicite:

```bash
iroha --config "$SIGNER_A_CONFIG" ledger multisig list all \
  --multisig-selector "$MULTISIG_ACCOUNT"
```

### 4. Approuver comme signataire C {#_4-approve-as-signer-c}

Le poids de A 1 plus le poids de C 2 atteint le quorum 3 et exécute l'instruction proposée en tant que compte multisig.

```bash
iroha --config "$SIGNER_C_CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger multisig approve \
  --account "$MULTISIG_ACCOUNT" \
  --instructions-hash "$INSTRUCTIONS_HASH"
```

Le client Rust peut continuer avec le même compte dérivé de la politique et les deux instructions du cycle de vie utilisées ci-dessus:

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

## Vérifiez {#verify}

Lisez l'état d'urgence et confirmez que la proposition n'est plus en attente:

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

La valeur des métadonnées doit être `"approved"`, le hash de l'instruction capturé ne doit plus apparaître en attente et le contrôleur inspecté doit afficher les poids `1, 1, 2` avec quorum `3`.

## Résolution des problèmes {#troubleshooting}

- `signatory is not part of multisig` signifie que le client proposant ou approuvant ne correspond pas à l'un des I105 IDs inscrits dans la police.
- Une approbation finale peut être refusée lorsque le compte multisig ne dispose pas d'une autorisation pour exécuter les instructions proposées. Accordez l'autorisation au compte multisig, pas seulement à ses signataires individuels, puis laissez le signataire restant essayer de nouveau.
- Une proposition en attente manquante peut signifier qu'un quorum a déjà été atteint, que le TTL a expiré ou que l'instruction hash/selecteur de compte a été utilisée incorrectement.
- Les doubles approbations n'ajoutent pas de poids; chaque signataire enregistré contribue au plus une fois à son poids configuré.
- La signature directe d'une transaction normale étant interdite par le contrôleur. `MultisigPropose` à la fois `MultisigApprove`.
- Si les commandes ultérieures ne peuvent pas trouver le compte imprimé pendant l'enregistrement CLI, vous avez capturé la graine temporaire. Dérivez le compte canonique de la politique commandée et inscrivez-vous avec cette valeur comme indiqué ci-dessus.

## Sources et documents connexes {#source-and-related-docs}

- [Des essais d'intégration multisig sur le commit fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/multisig.rs)
- [Modèle de données multisig à l'accord fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_executor_data_model/src/isi.rs)
- [CLI mise en œuvre de plusieurs signes sur l'acte fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Les opérations ](/fr/blockchain/transactions.md)
- [Autorisations et rôles ](./permissions-and-roles.md)
