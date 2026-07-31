---
translation_locale: fr
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 270e6705186d74efad6a8d2e6eeb432ab1b12649b66d4b11309e7da1e07b384f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Frais de parrainage pour un espace de données privé {#sponsor-fees-for-a-private-dataspace}

Le parrainage des frais permet aux utilisateurs de soumettre des transactions dans un espace de données privé sans
exploitation XOR. L'utilisateur signe toujours la transaction.
les points sur un compte du commanditaire et le débit de la période d'exécution XOR équilibre
pour les frais de réseau.

L'intégration comporte trois parties mobiles:

1. le nœud autorise le parrainage des frais
2. le compte parrain existe et a XOR
3. chaque utilisateur a `CanUseFeeSponsor` pour ce commanditaire

Après cela, chaque transaction utilisateur sponsorisée n'a besoin que de ces métadonnées:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Cette page montre deux modèles communs:

- **L'utilisateur écrit gratuitement**: le parrain paie XOR et l'utilisateur ne paie rien.
- **Tarifs des jetons locaux**: l'utilisateur paie le sponsor dans un jeton d'application, et
  le sponsor paie le réseau en XOR.

Utilisation Taira Un nouvel espace de données privé est un
changement d'opérateur et de gouvernance; il n'est pas créé par la configuration du client.

## Les valeurs d'exemple {#example-values}

Les commandes ci-dessous utilisent ces placeholders:

```bash
export DATASPACE="team"
export USER="<USER_ACCOUNT_I105>"
export SPONSOR="<SPONSOR_ACCOUNT_I105>"
export TREASURY="<TREASURY_ACCOUNT_I105>"
export XOR_ASSET="xor#universal"
export BILLING_DOMAIN="billing.team"
export LOCAL_FEE_ASSET="usage#billing.team"
export LOCAL_FEE_ASSET_ID="<LOCAL_FEE_ASSET_DEFINITION_BASE58>"
export USER_ALIAS="alice@team"
export PHONE_POLICY="phone#team"
export EMAIL_POLICY="email#team"
export POLICY_OWNER="<IDENTIFIER_POLICY_OWNER_ACCOUNT_I105>"
```

Utilisation canonique I105 compte IDs à moins que votre déploiement ait un compte actif
des pseudonymes pour les mêmes comptes.

## 1. Préparer l'espace de données {#_1-prepare-the-dataspace}

Commencez à partir du catalogue de l'espace de données privé et des travaux de routage décrits dans
[Connectez-vous SORA Nexus Les bases de données](/fr/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace).
Un fragment tourné vers l'opérateur ressemble à ceci:

```toml
[[nexus.lane_catalog]]
index = 5
alias = "team-private"
description = "Private team lane"
dataspace = "team"
visibility = "private"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "team"
id = 42
description = "Private team dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "team"
[nexus.routing_policy.rules.matcher]
account_prefix = "team."
description = "Route team domains to the private dataspace"
```

Avant de passer aux transactions utilisateur, vérifiez que:

- la voie privée apparaît dans le nœud `/status` réaction
- Les comptes utilisateurs sont admis par votre flux d'intégration privée
- le compte du sponsor existe
- le XOR l'actif de redevance et le compte d'élimination des redevances sont valables sur le réseau

## 2. Enregistrer les actifs dans l'espace de données {#_2-register-assets-in-the-dataspace}

Enregistrer les définitions d'actifs que les utilisateurs déteniront à l'intérieur du privé
l'espace de données avant de les brancher dans la logique de l'application.
modèle, le tutoriel utilise `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

D'abord, définissez le domaine et SNS Le contrat de location qui détient l'espace nommé des actifs.
sans secret `AliasSetupPlanRequestV1` l'intention `$BILLING_DOMAIN`, y compris
le chiffre `team` espace de données ID, propriétaire canonique, terme de location et cotation courante
Garde:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Ensuite, enregistrer la définition de l'actif. `--id` est le niveau de réseau
définition des actifs ID. L'alias est ce que les développeurs et les utilisateurs finaux devraient utiliser dans
code du espace de données:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

Mente ou transfert du jeton local à un utilisateur lors de l'intégration:

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Vérifiez le solde de l'utilisateur:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Utilisez le même schéma pour les actifs d'application dans l'espace de données.
définition de l'actif par jeton, donner à chacun un alias espace de données, et se référer à la
alias de SDK code au lieu de définition d'actif canonique en code dur IDs.

## 3. Enregistrer les prénoms d'utilisateur {#_3-register-user-aliases}

Les comptes sont toujours canoniques I105 compte IDs. Les noms d'utilisateur sont des comptes
les prénoms, et les prénomés doivent être des poignées non sensibles telles que `alice@team` ou
`alice@members.team`. N'utilisez pas de numéros de téléphone ou d'adresses électroniques comme alias.
Ils appartiennent au flux d'identifiants privés dans la section suivante.

L'alias configuration utilise le même planificateur déclaratif que la configuration de domaine. SDK ou
le service d'embarquement créer un secret libre `AliasSetupPlanRequestV1` dont l'intention
cibles d'entrée sous forme de compte `$USER`, sélectionne le rôle principal, pince le numérique
espace de données ID, et porte la garde actuelle de l'offre de location.
en tant que transaction atomique unique:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Si l'utilisateur ne doit pas payer XOR, Utiliser l'embarquement approuvé par le sponsor
service pour la construction et le dépôt de l'opération d'installation.
acquisition et alias liant à des opérations d'application indépendantes.

Une fois que le pseudonyme est lié, vérifiez-le à partir du CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Pour la création de nouveaux comptes, préférer un service d'intégration qui construit
`NewAccount` avec une étagère `uaid` et, le cas échéant, une `label`. Les
simple `ledger account register --id` Le commandement n'enregistre que le canonique
compte ID.

## 4. Enregistrer le téléphone et l'e-mail en privé auprès de FHE {#_4-register-phone-and-email-privately-with-fhe}

Utilisez les numéros de téléphone et les adresses e-mail comme revendications d'identifiants privés, pas publiques
Les prénoms. FHE- le flux de sauvegarde empêche les identifiants bruts d'utiliser des pseudonymes de compte,
les métadonnées de transaction et l'état mondial:

1. l'exploitant enregistre une
   [RAM-LFE/FHE politique du programme](/fr/blockchain/ram-lfe.md) pour téléphone et courrier électronique
2. l'exploitant enregistre des politiques d'identification active telles que `phone#team` et
   `email#team`
3. le portefeuille normalise le téléphone ou l'e-mail localement
4. le portefeuille envoie la valeur cryptée au résolveur
5. le résolveur renvoie un `IdentifierResolutionReceipt`
6. l'utilisateur soumet `ClaimIdentifier` avec le reçu
7. la chaîne stocke un identifiant opaque et un hash de reçu, pas le téléphone brut ou
   valeur de courrier électronique

L'établissement des politiques de l'opérateur est un SDK ou une tâche de service.
ces paires d'instructions pour chaque type d'identifiant:

```text
RegisterRamLfeProgramPolicy(
  program_id = "phone_team",
  owner = "$POLICY_OWNER",
  backend = "bfv-programmed-sha3-256-v1",
  verification_mode = "signed",
  commitment = "<HIDDEN_PROGRAM_POLICY_COMMITMENT>",
  resolver_public_key = "<RESOLVER_PUBLIC_KEY>"
)
ActivateRamLfeProgramPolicy(program_id = "phone_team")

RegisterIdentifierPolicy(
  id = "$PHONE_POLICY",
  owner = "$POLICY_OWNER",
  normalization = "PhoneE164",
  program_id = "phone_team",
  note = "Private phone registration for team dataspace"
)
ActivateIdentifierPolicy(policy_id = "$PHONE_POLICY")
```

Répétez pour l' e-mail avec:

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Lors de l'intégration, le portefeuille ou l'arrière-plan doit se normaliser localement:

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

Après la création du fichier de métadonnées par le sponsor à l'étape 8, soumettez une signature utilisateur
instruction de réclamation avec ces métadonnées:

```text
ClaimIdentifier(
  account = "$USER",
  receipt = IdentifierResolutionReceipt {
    payload: {
      policy_id: "$PHONE_POLICY",
      opaque_id: "<OPAQUE_ACCOUNT_ID>",
      uaid: "<USER_UAID>",
      account_id: "$USER",
      ...
    },
    attestation: "<RESOLVER_SIGNATURE_OR_PROOF>"
  }
)
```

Le courant CLI n'expose pas les commandes typées pour ces identités
générer des instructions sérialisées `InstructionBox` les valeurs avec SDK et
les soumettre `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Gardez ces barreaux dans le service d' embarquement:

- Les pseudonymes de compte sont uniquement lisibles par l'homme
- les valeurs de téléphone et d'e-mail brutes ne sont jamais affichées dans des aliases, des métadonnées, des journaux ou
  charges utiles des transactions
- le compte a un `uaid` avant de réclamer des identifiants privés
- les reçus sont liés `policy_id`, `opaque_id`, `uaid`, `account_id`, et expiration
- Les clés de résolution et les engagements cachés du programme sont contrôlés par la gouvernance

## 5. Activer le parrainage sur le nœud {#_5-enable-sponsorship-on-the-node}

Le parrainage des frais est une politique de nœud/temps d'exécution. Nexus configuration des frais:

```toml
[nexus.fees]
fee_asset_id = "xor#universal"
fee_sink_account_id = "<FEE_SINK_ACCOUNT_I105_OR_ALIAS>"
base_fee = "0"
per_byte_fee = "0"
per_instruction_fee = "0.001"
per_gas_unit_fee = "0.00005"
sponsorship_enabled = true
sponsor_max_fee = "0"
```

`fee_asset_id` est l'actif des frais de réseau. SORA Nexus C' est ça . XOR. Utilisez le
actif XOR alias ou canoniques XOR définition des actifs ID exposé par votre réseau.

`sponsor_max_fee = "0"` signifie qu'il n'y a pas de plafond pour le sponsor par transaction.
la production, définissez un plafond non-zéro après avoir connu la taille normale et le profil du gaz
de vos transactions dans votre espace de données.

Réinitialisez ou roulez cette configuration à travers votre processus d'opérateur normal.

## 6. Créer et financer le commanditaire {#_6-create-and-fund-the-sponsor}

Générer une paire de clés sponsors si nécessaire:

```bash
kagami keys --algorithm ed25519 --json
```

Convertir la clé publique au format de compte pour votre réseau:

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Inscrivez le compte du sponsor via votre flux privé d'intégration:

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Financer le commanditaire avec XOR à partir d'un trésor, d'un compte de créances ou d'un autre fonds
compte:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Pour Taira les répétitions, sauf l'aide au robinet de
[Prenez le testnet XOR sur le Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
comme `taira_faucet_claim.py`, puis financer le parrain avec le robinet public
au lieu d'un transfert de trésorerie:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Vérifiez le sponsor. XOR équilibre:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Accorder à un utilisateur l'accès au commanditaire {#_7-grant-a-user-access-to-the-sponsor}

Le commanditaire doit accorder à chaque utilisateur la permission de lui facturer des frais.
ce qui empêche les utilisateurs de nommer des comptes sponsors arbitraires.

Exécutez ceci comme le compte sponsor, ou comme un compte opérationnel autorisé par votre
Politique en matière de temps d'exécution

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission grant --id "$USER"
```

Pour les services d'intégration, faites de cette étape une disposition normale du compte et enregistrer:

- compte utilisateur
- compte du commanditaire
- espace de données ou application
- billet d'approbation ou décision de gouvernance

Pour inspecter les subventions d'un utilisateur:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Ajouter les métadonnées du commanditaire {#_8-attach-sponsor-metadata}

Créer un fichier de métadonnées réutilisable:

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Tout écrit présenté avec ces métadonnées est facturé au commanditaire:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

Pour SDKs, joindre le même objet de métadonnées de transaction à la signature
l'utilisateur signe la transaction avec sa clé.
ne signe pas chaque transaction utilisateur parce que le précédent `CanUseFeeSponsor`
La subvention est l'autorisation.

## Modèle 1: Les utilisateurs ne paient pas de frais {#pattern-1-users-pay-no-fees}

Utilisez-le lorsque l'application ou l'opérateur absorbe tous les frais de réseau.

Liste des développeurs:

1. Gardez la charge utile normale des transactions de l'utilisateur inchangée.
2. Ajouter des métadonnées de transaction avec `fee_sponsor`.
3. Signez comme utilisateur.
4. S'il vous plaît soumettre par la route privée de l'espace.

Le compte utilisateur n'a pas besoin d'un XOR Le compte du commanditaire doit conserver
suffisamment XOR pour couvrir le configuré Nexus les frais.

## Modèle 2: Les utilisateurs paient un jeton local {#pattern-2-users-pay-a-local-token}

Utilisez ceci lorsque les utilisateurs ne doivent pas tenir XOR, mais l'espace de données veut toujours un
frais d'application internes, dépenses de crédit ou jetons de quota.

Dans ce modèle, le jeton local est un paiement d'application.
Le parrain paie toujours la redevance de réseau en XOR.

Par exemple, utilisez un jeton local dans l'espace de données privé:

```text
usage#billing.team
```

Les utilisateurs de fonds `usage#billing.team` lors de l'intégration, du renouvellement des abonnements;
ou l'allocation de quotas.

1. transférer des jetons locaux de l'utilisateur au sponsor
2. effectuer l'opération d'application demandée
3. inclure `fee_sponsor` les métadonnées afin que le sponsor paie XOR

Un minimum CLI Le test de fumée est juste le transfert local-token parrainé par XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Pour une application réelle, ne soumettez pas le paiement par jeton local en tant que séparé
Une transaction signée contenant les deux
le paiement et l'instruction commerciale, ou exposer un point d'entrée de contrat qui
collecte le jeton local avant d'appliquer l'opération commerciale.

Conservez la politique de conversion dans votre application ou contrat:

- quelle opération coûte combien d'unités de jetons locales
- comment les cartes d'afflux de jetons locaux à sponsorer XOR Remplissement
- ce qui se passe lorsque l'équilibre de l'utilisateur est trop faible
- ce qui se passe lorsque le sponsor XOR l'équilibre est trop bas

::: warning

Ne pas utiliser `gas_asset_id` pour le modèle "compte de jeton local", sauf si vous voulez
Dans la période de fonctionnement actuelle, le bénéficiaire doit également être facturé dans cet actif.
`fee_sponsor` fait également du commanditaire le payeur des gaz de pipeline configurés
Pour les frais d'utilisateur de jetons locaux, récupérer le jeton explicitement avec un
une règle de transfert ou de contrat.

:::

## Débogage des transactions sponsorisées ratées {#debug-failed-sponsored-transactions}

Les raisons courantes de rejet indiquent généralement une étape d'installation manquante:

| Texte d'erreur | Que vérifier |
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` est toujours `false` sur le nœud. |
| `fee sponsor is not authorized` | L'utilisateur n'a pas `CanUseFeeSponsor` Pour ce sponsor. |
| `fee asset ... is missing` | Le commanditaire ne détient pas le XOR actif des frais. |
| `fee balance ... is insufficient` | Remplissez le portefeuille du commanditaire. XOR équilibre. |
| `fee exceeds sponsor_max_fee` | Réservation `sponsor_max_fee` ou réduire la taille/le gaz de la transaction. |
| `invalid nexus fee asset id` | Réparation `nexus.fees.fee_asset_id` ou le XOR sous le pseudonyme d'actif. |

Lors de la débogage du modèle 2, vérifiez les deux équilibres:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"

iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

## Faites fonctionner le commanditaire {#operate-the-sponsor}

Traiter le commanditaire comme un compte de trésorerie:

- conserver des clés sponsors distinctes pour le réseau de test, la mise en scène et le réseau principal
- mise en garde devant le commanditaire XOR l'équilibre atteint le plancher d'entrée
- définir un non-zéro `sponsor_max_fee` cap une fois le trafic caractérisé
- écrites sponsorisées dans votre demande ou gateway
- révocation `CanUseFeeSponsor` lorsque les utilisateurs quittent l' espace de données
- réconcilier les hashes de transaction utilisateur, les paiements par jetons locaux et le sponsor XOR
  débits

Révoquer le parrainage pour un utilisateur:

```bash
printf '{
  "name": "CanUseFeeSponsor",
  "payload": {
    "sponsor": "%s"
  }
}\n' "$SPONSOR" |
  iroha --config ./sponsor.client.toml \
    ledger account permission revoke --id "$USER"
```

## Pages connexes {#related-pages}

- [Connectez-vous SORA Nexus Les bases de données](/fr/get-started/sora-nexus-dataspaces.md)
- [Opérer Iroha 3 par le biais CLI](/fr/get-started/operate-iroha-via-cli.md)
- [Les actifs](/fr/blockchain/assets.md)
- [Autorisations](/fr/blockchain/permissions.md)
- [Les jetons d'autorisation](/fr/reference/permissions.md)
