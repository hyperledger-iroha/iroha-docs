---
translation_locale: fr
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 8d6fd7101094ba21cfc2c5fb9a89d2acd7e67f13ff47b9f8c8e01bbbd7bf2836
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Autorisations et rôles {#permissions-and-roles}

## Résultat {#outcome}

Créez un rôle qui accorde à un compte la permission de mettre à jour les métadonnées d'un compte spécifique, assignez-le à un délégué, prouvez l'écriture déléguée et montrez les instructions typées correspondantes Rust.

## Prérequis {#prerequisites}

- Un client financé Taira et des métadonnées de frais provenant de [Connectez-vous à Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` et `DELEGATE_ACCOUNT` définis sur les identifiants de compte canoniques I105.
- Le compte signataire doit être autorisé à gérer la permission et les rôles cibles. Sur Taira, il s'agit d'une opération administrative soumise à autorisation ; obtenez `CanManageRoles` et le principal d'autorisation nécessaire pour accorder la permission limitée, ou exécutez la recette sur un réseau local généré.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Utilisez une deuxième configuration client pour le délégué lors de la validation de l'écriture :

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Étapes {#steps}

### 1. Enregistrer un rôle vide {#_1-register-an-empty-role}

Chaque commande CLI qui change l'état nomme explicitement le payeur des frais. Le fichier de métadonnées contient l'actif de frais Taira actuel dérivé de la réponse du service de financement du testnet.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Ajouter une autorisation limitée au compte cible {#_2-add-a-permission-scoped-to-the-target-account}

Les jetons de permission sont des objets typés JSON. Conservez le compte à l'intérieur de `payload` en tant qu'ID I105 ; un alias n'est pas valide dans ce champ strict.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Assignez le rôle au délégué {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Les rôles et leurs attributions n'expirent pas. Révoquez-les explicitement lorsque l'accès n'est plus nécessaire.

### 4. Exercer l'autorisation déléguée {#_4-exercise-the-delegated-permission}

Utilisez le signataire cryptographique et le solde des frais du délégué pour l'écriture. Les valeurs JSON sont lues à partir de l'entrée standard.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Le même modèle est disponible pour les clients Rust. Ici, `client` signe en tant que `registrar_account`, ce qui devient le propriétaire initial du rôle tout comme dans le flux CLI. Les trois variables de compte sont déjà analysées en valeurs `AccountId` :

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all_blocking::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Vérifier {#verify}

Listez les deux côtés de l'affectation, puis lisez la valeur exacte écrite par le délégué :

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

La liste des autorisations doit contenir `CanModifyAccountMetadata` limitée à `TARGET_ACCOUNT`, la liste des rôles du délégué doit contenir `ROLE_ID`, et la lecture des métadonnées doit renvoyer `"delegated"`.

## Dépannage {#troubleshooting}

- `Not permitted` lors de l’enregistrement, de l’édition ou de l’attribution du rôle, le signataire cryptographique ne possède pas le principe d’autorisation Taira requis. Ne remplacez pas le jeton avec portée par un jeton global ; demandez la concession exacte ou utilisez LocalNet.
- Une erreur d'analyse de charge utile signifie généralement que `account` a été placé à côté de `payload`, qu'un alias a été fourni à la place d'un ID I105, ou que la valeur JSON a été citée deux fois.
- Un rejet de frais appartient au signataire cryptographique soumettant cette étape. Financez le gestionnaire et déléguez indépendamment et conservez les métadonnées des actifs de frais dérivés du robinet.
- Un octroi de rôle réussi ne remplace pas la portée codée dans ses jetons. Ce rôle ne peut modifier que le compte nommé dans la charge utile de la permission.
- Pour nettoyer, exécutez `ledger account role revoke`, puis `ledger role permission revoke`, et enfin `ledger role unregister` ; chacun est une écriture séparée et doit inclure `--fee-payer authority` et les métadonnées de frais.

## Source et documents connexes {#source-and-related-docs}

- [Tester l'intégration des rôles au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Tests d'intégration des permissions au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Modèle de données de permission intégré au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [Autorisations et rôles](/fr/blockchain/permissions.md)
- [Référence du jeton d'autorisation](/fr/reference/permissions.md)
- [Métadonnées](./metadata.md)
