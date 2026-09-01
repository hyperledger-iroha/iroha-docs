---
translation_locale: fr
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Autorisations {#permissions}

Les comptes ont besoin de jetons d'autorisation pour diverses actions sur une blockchain, par exemple pour émettre ou brûler des actifs.

Il y a une différence entre une blockchain publique et une blockchain privée en termes d'autorisations accordées aux utilisateurs. Dans une blockchain publique, la plupart des comptes ont le même ensemble d'autorisations. Dans une blockchain privée, on suppose que la plupart des comptes ne peuvent rien faire en dehors du principe d'autorisation qui leur est accordé, sauf s'ils se voient explicitement accorder la permission pertinente.

Avoir l'autorisation de faire quelque chose signifie que le compte dispose de la correspondante `Permission`. Les permissions peuvent être accordées directement ou par le biais d'un [`Role`](#permission-groups-roles), qui regroupe un ensemble d'autorisations. Les autorisations sont accordées avec le `Grant` instruction. Les permissions et les rôles n'expirent pas ; supprimez-les avec le `Revoke` instruction.

## Jetons de permission {#permission-tokens}

Les jetons de permission sont des objets typés définis par l'exécuteur actif. Certains jetons sont globaux, tels que `CanManagePeers`, et d'autres sont limités à un objet spécifique du grand livre blockchain, tel qu'un compte, un actif, une définition d'actif, un domaine, NFT, un rôle ou un déclencheur.

Voici quelques exemples de paramètres utilisés pour différents jetons de permission :

- Un jeton qui accorde la permission de modifier les métadonnées d'un compte spécifique comporte un champ `account` :

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- Un jeton qui accorde la permission de transférer des actifs pour une définition d'actif spécifique comporte un champ `asset_definition` :

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- Un jeton global tel que `CanManagePeers` n'a pas de champs :

  ```json
  {}
  ```

### Jetons de permission préconfigurés {#pre-configured-permission-tokens}

Vous pouvez trouver la liste des jetons d'autorisation préconfigurés dans le chapitre [Référence](/fr/reference/permissions).

## Groupes de permissions (Rôles) {#permission-groups-roles}

Un ensemble d'autorisations est appelé un rôle. De même que les jetons d'autorisation, les rôles peuvent être accordés en utilisant l'instruction `Grant` et révoqués en utilisant l'instruction `Revoke`.

Avant d'accorder un rôle à un compte, le rôle doit d'abord être enregistré.

Les rôles sont utiles lorsque plusieurs comptes doivent recevoir le même ensemble d'autorisations. Enregistrez le rôle une fois, attribuez des autorisations au rôle, puis accordez ou révoquez le rôle pour des comptes individuels.

### Enregistrer un nouveau rôle {#register-a-new-role}

Enregistrons un nouveau rôle qui, lorsqu'il est accordé, permettra à un autre compte d'accéder à [métadonnées](/fr/blockchain/metadata.md) dans le compte de Mouse :

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### Accorder un rôle {#grant-a-role}

Après que le rôle est enregistré, Mouse peut le attribuer à Alice :

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## Validateurs de permission {#permission-validators}

Les autorisations existent afin que seuls les comptes disposant du jeton d'autorisation requis puissent effectuer une action protégée. L'exécuteur par défaut vérifie les autorisations lors de l'exécution des instructions, des requêtes et des expressions.

La surface de validation par défaut est regroupée par zone du registre de la blockchain :

- gestion des pairs réseau
- domaines et comptes
- actifs, NFTs, et séquestres
- déclencheurs
- rôles et autorisations
- exécuteur et environnement d’exécution, preuves, passerelles et modules SORA/Nexus

La liste exacte des jetons est soutenue par la source dans le [Référence des jetons d'autorisation](/fr/reference/permissions.md).

### Validateurs d'exécution de logiciel {#runtime-validators}

Les contrôles d'autorisation sont appliqués par l'exécuteur actif. L'exécuteur par défaut fournit les validateurs de permission intégrés et les définitions de jetons, et un réseau peut modifier la politique en mettant à jour l'exécuteur qu'il utilise.

Les validateurs renvoient un verdict de validation. Un validateur peut autoriser une opération, la refuser avec une raison, ou l'ignorer si l'opération est en dehors de son domaine de compétence. Le juge sélectionné combine ces verdicts pour décider si l'instruction, la requête ou l'expression peut continuer.

## Requêtes prises en charge {#supported-queries}

Les jetons et rôles de permission peuvent être interrogés.

Requêtes pour les rôles :

- [`FindRoles`](/fr/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/fr/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/fr/reference/queries.md#accounts-and-permissions)

Requêtes pour les jetons d'autorisation :

- [`FindPermissionsByAccountId`](/fr/reference/queries.md#accounts-and-permissions)
