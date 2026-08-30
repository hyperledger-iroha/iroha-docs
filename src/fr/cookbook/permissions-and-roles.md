---
translation_locale: fr
translation_source: /cookbook/permissions-and-roles.md
translation_source_hash: 7ee18275d25837da53f533f5e9205906ccaa71b48afd9b11ffad79b599da7f21
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les autorisations et les rôles {#permissions-and-roles}

## Le résultat {#outcome}

Créez un rôle qui donne à un compte l'autorisation de mettre à jour les métadonnées d'un compte spécifique, attribuez-les à un délégué, prouvez l'écriture déléguée et affichez les instructions correspondantes typées Rust.

## Conditions préalables {#prerequisites}

- Une clientèle financée Taira et des métadonnées de frais provenant de [Connectez-vous à Taira](./connect-to-taira.md).
- `TARGET_ACCOUNT` et `DELEGATE_ACCOUNT` sont définis sur le compte canonique I105 IDs.
- Le compte de signature doit être autorisé à gérer les autorisations cibles et les rôles. sur Taira, il s'agit d'une opération administrative avec un permis; obtenir `CanManageRoles` et l'autorité nécessaire pour accorder l'autorisation visée, ou exécuter la recette sur un réseau local généré.

```bash
CONFIG=./taira.client.toml
FEE_METADATA=./taira.tx-metadata.json
ROLE_ID=cookbook_metadata_editors
test -n "$TARGET_ACCOUNT"
test -n "$DELEGATE_ACCOUNT"
```

Utilisez une deuxième configuration client pour le délégué lors de la vérification de l'écriture:

```bash
DELEGATE_CONFIG=./taira.delegate.toml
```

## Les étapes {#steps}

### 1. Inscrire un rôle vide {#_1-register-an-empty-role}

Chaque commande de changement d'état CLI nomme explicitement le payeur des frais. Le fichier de métadonnées contient l'actif actuel Taira des frais dérivé de la réponse du robinet.

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger role register --id "$ROLE_ID"
```

### 2. Ajouter une autorisation dans le cadre du compte cible {#_2-add-a-permission-scoped-to-the-target-account}

Les jetons d'autorisation sont typés JSON objets. Gardez le compte à l'intérieur de `payload` comme un I105 ID; un alias n'est pas valide dans ce champ strict.

```bash
jq -cn --arg account "$TARGET_ACCOUNT" \
  '{name:"CanModifyAccountMetadata",payload:{account:$account}}' |
  iroha --config "$CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger role permission grant --id "$ROLE_ID"
```

### 3. Assigner le rôle au délégué {#_3-assign-the-role-to-the-delegate}

```bash
iroha --config "$CONFIG" \
  --fee-payer authority \
  --metadata "$FEE_METADATA" \
  ledger account role grant \
  --id "$DELEGATE_ACCOUNT" \
  --role "$ROLE_ID"
```

Les rôles et leurs subventions n'expirent pas; les révoquer explicitement lorsque l'accès ne sera plus nécessaire.

### 4. Exercez la permission déléguée {#_4-exercise-the-delegated-permission}

Utilisez la signature du délégué et le solde des honoraires pour l'écriture. JSON Les valeurs sont lues à partir de l'entrée standard.

```bash
printf '"delegated"\n' |
  iroha --config "$DELEGATE_CONFIG" \
    --fee-payer authority \
    --metadata "$FEE_METADATA" \
    ledger account meta set \
    --id "$TARGET_ACCOUNT" \
    --key cookbook_access
```

Le même modèle est disponible pour les clients Rust. Ici, `client` signale comme `registrar_account`, qui devient le propriétaire initial du rôle tout comme il le fait dans le flux CLI. Les trois variables de compte sont déjà analysées les valeurs `AccountId`:

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

## Vérifiez {#verify}

Faites une liste des deux côtés de la tâche, puis lisez la valeur exacte écrite par le délégué:

```bash
iroha --config "$CONFIG" ledger role permission list --id "$ROLE_ID"
iroha --config "$CONFIG" ledger account role list --id "$DELEGATE_ACCOUNT"

iroha --config "$CONFIG" ledger account meta get \
  --id "$TARGET_ACCOUNT" \
  --key cookbook_access
```

La liste des autorisations doit contenir `CanModifyAccountMetadata` à l'étendue de `TARGET_ACCOUNT`, la liste des rôles du délégué doit contenir`ROLE_ID` et les métadonnées lues doivent retourner `"delegated"`.

## Résolution des problèmes {#troubleshooting}

- `Not permitted` lors de l'enregistrement, de la modification ou de l'attribution du rôle signifie que le signataire ne dispose pas de l'autorité requise Taira. Ne remplacez pas le jeton visé par un jeton global; demandez la subvention exacte ou utilisez localnet
- Une erreur d'analyse de la charge utile signifie généralement que `account` a été placé à côté de `payload`, qu'un alias a été fourni à la place d'un I105 ID ou que la valeur JSON a été citée deux fois.
- Un refus de frais appartient au signataire qui soumet cette étape. Financer le gestionnaire et déléguer indépendamment et conserver les métadonnées des actifs de redevances dérivées du robinet.
- Une attribution de rôle réussie n'empêche pas la portée codée dans ses jetons. Ce rôle ne peut modifier que le compte nommé dans la charge utile des permissions.
- Pour nettoyer, exécuter `ledger account role revoke`, puis `ledger role permission revoke` et enfin `ledger role unregister`; chacun est un écrit séparé et doit inclure `--fee-payer authority` et les métadonnées de frais.

## Sources et documents connexes {#source-and-related-docs}

- [Tests d'intégration des rôles sur le commit fixé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/roles.rs)
- [Tests d'intégration des autorisations au niveau de l'engagement fixé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/permissions.rs)
- [Modèle de données d'autorisation intégré à l'accord fixé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_executor_data_model/src/permission.rs)
- [Autorisations et rôles ](/fr/blockchain/permissions.md)
- [Références de jetons d'autorisation ](/fr/reference/permissions.md)
- [Metadonnées ](./metadata.md)
