---
translation_locale: fr
translation_source: /blockchain/permissions.md
translation_source_hash: 1a12b47fa14bb011c9a916e70a1a8b5c083061880e1564a0be861c13cf562a77
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Autorisations {#permissions}

Les comptes ont besoin de jetons d'autorisation pour diverses actions sur une blockchain, par exemple.
à la mise en pièces ou à la combustion d'actifs.

Il y a une différence entre une blockchain publique et privée en termes de
Dans une blockchain publique, la plupart des comptes ont
Dans une blockchain privée, la plupart des comptes sont
supposés ne pouvoir faire rien en dehors de l'autorité qui leur a été accordée
à moins que l'autorisation pertinente ne soit explicitement accordée.

Avoir une autorisation pour faire quelque chose signifie que le compte a
correspondant `Permission`. Les autorisations peuvent être accordées directement ou par l'intermédiaire d'un
[`Role`](#permission-groups-roles), qui regroupe un ensemble d'autorisations.
Les autorisations sont accordées par le `Grant` Les autorisations et les rôles
ne pas expirer; les retirer avec le `Revoke` l'instruction

## Les jetons d'accès {#permission-tokens}

Les jetons d'autorisation sont des objets typés définis par l'exécuteur actif.
les jetons sont globaux, tels que `CanManagePeers`, et d'autres sont visés à un
objet spécifique du registre, tel qu'un compte, un actif, une définition d'actif, un domaine,
NFT, rôle ou déclencheur.

Voici quelques exemples de paramètres utilisés pour différents jetons d'autorisation:

- Un jeton qui donne l'autorisation de modifier les métadonnées d'un compte spécifique
  porte une `account` champ:

  ```json
  {
    "account": "<AccountId>"
  }
  ```

- Un jeton qui autorise le transfert d'actifs pour un actif spécifique
  La définition comporte un `asset_definition` champ:

  ```json
  {
    "asset_definition": "<AssetDefinitionId>"
  }
  ```

- Un symbole mondial tel que `CanManagePeers` n'a pas de champs:

  ```json
  {}
  ```

### Les jetons d'autorisation préconfigurés {#pre-configured-permission-tokens}

Vous pouvez trouver la liste des jetons d' autorisation préconfigurés dans le [Références](/fr/reference/permissions) Le chapitre.

## Groupe d'autorisation (rôles) {#permission-groups-roles}

Un ensemble d'autorisations est appelé un **rôle**. De même pour les jetons de permission,
Les rôles peuvent être attribués en utilisant les `Grant` instruction et révoqué en utilisant le
`Revoke` l'instruction

Avant d'attribuer un rôle à un compte, il convient d'enregistrer le rôle en premier lieu.

Les rôles sont utiles lorsque plusieurs comptes doivent recevoir la même autorisation
enregistrer le rôle une fois, accorder des autorisations au rôle, puis accorder ou
révoquer le rôle des comptes individuels.

### Enregistrer un nouveau rôle {#register-a-new-role}

Regroupons un nouveau rôle qui, lorsqu'il sera accordé, permettra à un autre compte
accès aux [métadonnées](/fr/blockchain/metadata.md) Dans le compte de Mouse:

```rust
let role_id = RoleId::from_str("ACCESS_TO_MOUSE_METADATA")?;
let role = iroha_data_model::role::Role::new(role_id.clone(), mouse_id.clone())
    .add_permission(CanModifyAccountMetadata {
        account: mouse_id.clone(),
    });
let register_role = Register::role(role);
```

### Accorde un rôle {#grant-a-role}

Une fois le rôle enregistré, la souris peut l'accorder à Alice:

```rust
let grant_role = Grant::account_role(role_id, alice_id);
let grant_role_tx = TransactionBuilder::new(chain_id, mouse_id)
    .with_instructions([grant_role])
    .sign(mouse_private_key);
```

## Validateurs d'autorisation {#permission-validators}

Les autorisations existent de sorte que seuls les comptes avec le jeton d'autorisation requis
L'exécuteur par défaut vérifie les autorisations
lors de l'exécution des instructions, des requêtes et des expressions.

La surface par défaut du validateur est regroupée par zone de registre:

- gestion par les pairs
- domaines et comptes
- les actifs, NFTs, et les garanties
- déclencheurs
- rôles et autorisations
- l'exécuteur/temps de fonctionnement, les preuves, les ponts et SORA/Nexus modules

La liste exacte des jetons est soutenue par la source dans le
[Références de jetons d'autorisation](/fr/reference/permissions.md).

### Validateurs de temps d'exécution {#runtime-validators}

Les contrôles d'autorisation sont effectués par l'exécuteur actif.
l'exécuteur fournit les validateurs d'autorisation et les définitions de jetons intégrés,
et un réseau peut modifier la politique en mettant à jour l'exécuteur qu'il utilise.

Les validateurs retournent un **jugement de validation**. Un validateur peut permettre une
l'opération, la nier avec une raison ou sauter si l'opération est en dehors de
Le juge sélectionné combine ces verdicts en
décider si l'instruction, la requête ou l'expression peuvent continuer.

## Les demandes de renseignements {#supported-queries}

Les jetons d'autorisation et les rôles peuvent être consultés.

Questions pour les rôles:

- [`FindRoles`](/fr/reference/queries.md#accounts-and-permissions)
- [`FindRoleIds`](/fr/reference/queries.md#accounts-and-permissions)
- [`FindRolesByAccountId`](/fr/reference/queries.md#accounts-and-permissions)

Les requêtes pour les jetons d'autorisation:

- [`FindPermissionsByAccountId`](/fr/reference/queries.md#accounts-and-permissions)
