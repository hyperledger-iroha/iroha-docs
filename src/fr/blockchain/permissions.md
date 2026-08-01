---
translation_locale: fr
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Autorisations {#permissions}

Les comptes ont besoin de jetons d'autorisation pour diverses actions sur une chaîne de blocs, par exemple pour fabriquer des pièces ou brûler des biens.

Il y a une différence entre une blockchain publique et une blockchain privée en termes d'autorisations accordées aux utilisateurs. Dans une blockchain privée, la plupart des comptes sont présumés incapables de faire quoi que ce soit en dehors de l'autorité qui leur a été accordée à moins d'avoir explicitement obtenu l'autorisation pertinente.

Avoir une autorisation pour faire quelque chose signifie que le compte a la correspondante `Permission`. Les permis peuvent être accordés directement ou par l'intermédiaire d'un [`Role`](#permission-groups-roles), Les autorisations sont octroyées par l'intermédiaire de `Grant` Les autorisations et les rôles ne expirent pas; retirez-les `Revoke` les instructions.

## Les jetons d'autorisation {#permission-tokens}

Les jetons d'autorisation sont des objets typés définis par l'exécuteur actif. Certains jetons sont globaux, tels que `CanManagePeers`, et d'autres sont portés à un objet de registre spécifique, tel qu'un compte, un actif, une définition d'actif, un domaine, NFT, un rôle ou un déclencheur.

Voici quelques exemples de paramètres utilisés pour les différents jetons d'autorisation:

- Un jeton qui accorde l'autorisation de modifier les métadonnées pour un compte spécifique contient un champ `account`:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- Un jeton qui accorde l'autorisation de transférer des actifs pour une définition d'actif spécifique porte un champ `asset_definition`:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- Un jeton mondial tel que `CanManagePeers` n'a pas de champs:

  ```json
  {}
  ```

### Les jetons d'autorisation préconfigurés {#pre-configured-permission-tokens}

Vous pouvez trouver la liste des jetons d'autorisation préconfigurés dans le chapitre [Reference](/fr/reference/permissions).

## Les groupes d'autorisation (rôles) {#permission-groups-roles}

Un ensemble d'autorisations est appelé un rôle. De même que les jetons d'autoriété, des rôles peuvent être accordés en utilisant l'instruction `Grant` et révoqués en utilisant le `Revoke` instructions.

Avant d'attribuer un rôle à un compte, le rôle doit d'abord être enregistré.

Les rôles sont utiles lorsque plusieurs comptes doivent recevoir le même ensemble d'autorisations: enregistrer le rôle une fois, accorder des autorisations au rôle, puis accorder ou révoquer le rôle pour les comptes individuels.

### Enregistrer un nouveau rôle {#register-a-new-role}

Regroupons un nouveau rôle qui, lorsqu'il sera accordé, permettra à un autre compte d'accéder au [métadonnées](/fr/blockchain/metadata.md) Dans le compte de Mouse:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### Accordez un rôle {#grant-a-role}

Après l'enregistrement du rôle, la souris peut le donner à Alice:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## Validateurs d'autorisation {#permission-validators}

Les autorisations existent de sorte que seuls les comptes avec le jeton d'autorisation requis peuvent effectuer une action protégée. L'exécuteur par défaut vérifie les autorisations lors de l'exécution des instructions, des requêtes et des expressions.

La surface de validateur par défaut est regroupée selon la zone du registre:

- gestion par les pairs
- domaines et comptes
- les actifs, NFTs, et les garanties
- déclencheurs
- rôles et autorisations
- l'exécuteur/temps d'exécution, les preuves, les ponts et les modules SORA/Nexus

La liste exacte des jetons est soutenue par la source dans la référence [Permission Tokens ](/fr/reference/permissions.md).

### Vérificateurs de temps d'exécution {#runtime-validators}

L'exécuteur par défaut fournit les validateurs d'autorisation et les définitions de jetons intégrés, et un réseau peut modifier la politique en mettant à jour l'exécutateur qu'il utilise.

Les validateurs rendent un verdict de validation. Un validateur peut autoriser une opération, la refuser avec une raison ou la sauter si l'opération est en dehors du champ d'application de ce validateur. Le juge sélectionné combine ces verdicts pour décider si l'instruction, la requête ou l'expression peuvent continuer.

## Demande soutenue {#supported-queries}

Les jetons d'autorisation et les rôles peuvent être consultés.

Questions sur les rôles:

- [`FindRoles`](/fr/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/fr/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/fr/reference/queries.md#accounts-and-permissions)

Les requêtes pour les jetons d'autorisation:

- [`FindPermissionsByAccountId`](/fr/reference/queries.md#accounts-and-permissions)
