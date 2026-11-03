---
translation_locale: fr
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 40fe8b19344d8eff66b178dc8576e2e049fef50bd3212fbddc5c0d5f7f37fa03
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Autorisations et rôles {#permissions-and-roles}

## Résultat {#outcome}

Créez un rôle qui accorde à un compte la permission de mettre à jour les métadonnées d'un compte spécifique, assignez-le à un délégué, prouvez l'écriture déléguée et montrez les instructions typées correspondantes Rust.

## Prérequis {#prerequisites}

- Un client Taira financé provenant de [Connectez-vous à Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` et `DELEGATE_ACCOUNT` définis sur les identifiants de compte canoniques I105.
- Le compte signataire doit détenir `CanManageRoles` et doit pouvoir déléguer la permission limitée : il s'agit de `TARGET_ACCOUNT` lui-même, ou il détient déjà `CanModifyAccountMetadata` pour ce compte. Sur Taira, il s'agit d'une opération administrative soumise à autorisation. Le client d'un réseau local généré ne détient pas `CanManageRoles` ; la recette nécessite donc un réseau dont la genèse l'accorde.

```bash
CONFIG=./taira.client.toml
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

Chaque commande CLI qui change l'état nomme explicitement le payeur des frais. Le CLI établit le devis exact des frais, dans l'actif de frais de Taira, avant de signer.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  ledger role register --id "$ROLE_ID"
```

### 2. Ajouter une autorisation limitée au compte cible {#_2-add-a-permission-scoped-to-the-target-account}

Les jetons de permission sont des objets typés JSON. Conservez le compte à l'intérieur de `payload` en tant qu'ID I105 ; un alias n'est pas valide dans ce champ strict.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Assignez le rôle au délégué {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  account role grant \
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
    account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Le même modèle est disponible pour les clients Rust. Ici, `client` est un `iroha::blocking::Client` qui signe en tant que `registrar_account`, lequel devient le propriétaire initial du rôle, comme dans le flux CLI. Les trois variables de compte sont déjà des valeurs `AccountId` analysées :

```rust
use iroha::data_model::{prelude::*, transaction::FeePaymentIntent};
use iroha_executor_data_model::permission::account::CanModifyAccountMetadata;

let role_id: RoleId = "cookbook_metadata_editors".parse()?;
let role = Role::new(role_id.clone(), registrar_account).add_permission(
    CanModifyAccountMetadata {
        account: target_account.clone(),
    },
);

client.submit_all::<InstructionBox>(
    [
        Register::role(role).into(),
        Grant::account_role(role_id, delegate_account).into(),
    ],
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

## Vérifier {#verify}

Lisez les autorisations effectives du délégué, qui incluent les octrois de rôles, puis lisez la valeur exacte écrite par le délégué :

```bash
iroha --config "$CONFIG" --machine account permission list \
  --id "$DELEGATE_ACCOUNT" --all \
  | jq -e --arg account "$TARGET_ACCOUNT" \
    '.items | any(.name == "CanModifyAccountMetadata"
      and .payload.account == $account)'

iroha --config "$CONFIG" account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

Les autorisations effectives du délégué doivent contenir `CanModifyAccountMetadata` limitée à `TARGET_ACCOUNT`, et la lecture des métadonnées doit renvoyer `"delegated"`. Torii refuse les listes de rôles via des requêtes signées ; la liste des autorisations effectives sert donc de vérification de l'attribution.

## Dépannage {#troubleshooting}

- `Not permitted` lors de l’enregistrement, de l’édition ou de l’attribution du rôle signifie que le signataire cryptographique ne possède pas l’autorité Taira requise. Ne remplacez pas le jeton avec portée par un jeton global ; demandez l’octroi exact.
- Une erreur d'analyse de charge utile signifie généralement que `account` a été placé à côté de `payload`, qu'un alias a été fourni à la place d'un ID I105, ou que la valeur JSON a été citée deux fois.
- Un rejet de frais appartient au signataire cryptographique soumettant cette étape. Financez le gestionnaire et le délégué indépendamment dans l'actif de frais indiqué par chaque devis de frais.
- Un octroi de rôle réussi ne remplace pas la portée codée dans ses jetons. Ce rôle ne peut modifier que le compte nommé dans la charge utile de la permission.
- Pour nettoyer, exécutez `account role revoke`, puis `ledger role permission revoke`, et enfin `ledger role unregister` ; chacune est une écriture séparée et doit inclure `--fee-payer authority`.

## Source et documents connexes {#source-and-related-docs}

- [Tester l'intégration des rôles au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/roles.rs)
- [Tests d'intégration des permissions au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/permissions.rs)
- [Modèle de données de permission intégré au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_executor_data_model/src/permission.rs)
- [Autorisations et rôles](/fr/blockchain/permissions.md)
- [Référence du jeton d'autorisation](/fr/reference/permissions.md)
- [Métadonnées](./metadata.md)
