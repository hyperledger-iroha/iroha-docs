---
translation_locale: fr
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Frais de parrainage pour un espace de données privé {#sponsor-fees-for-a-private-dataspace}

Le parrainage des frais permet aux utilisateurs de soumettre des transactions dans un espace de données privé sans détenir XOR. L'utilisateur signe toujours la transaction. Les métadonnées de la transaction pointent vers un compte sponsor, et l'environnement d'exécution du logiciel débite le solde XOR du sponsor pour les frais du réseau.

L'intégration comporte trois parties mobiles :

1. le nœud permet le parrainage de frais
2. le compte du sponsor existe et a XOR
3. chaque utilisateur a `CanUseFeeSponsor` pour ce sponsor

Après cela, chaque transaction d'utilisateur sponsorisé n'a besoin que de ces métadonnées :

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Cette page montre deux modèles courants :

- L'utilisateur gratuit écrit : le sponsor paie XOR et l'utilisateur ne paie rien.
- Frais en jetons locaux : l'utilisateur paie le sponsor en jeton de l'application, et le sponsor paie le réseau en XOR.

Utilisez d'abord Taira ou un réseau de test privé. Un nouvel espace de données privé constitue un changement d'opérateur et de gouvernance ; il n'est pas créé par la configuration du client.

## Exemples de valeurs {#example-values}

Les commandes ci-dessous utilisent ces espaces réservés :

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

Utilisez les identifiants de compte canoniques I105 à moins que votre déploiement n’ait des alias de compte actifs pour les mêmes comptes.

## 1. Préparer l'espace de données {#_1-prepare-the-dataspace}

Commencez par le catalogue de l’espace de données privé et le travail de routage décrits dans [Connecter aux espaces de données SORA Nexus](/fr/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Un fragment destiné à l’opérateur ressemble à ceci :

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

Avant de passer aux transactions utilisateur, vérifiez que :

- la voie d'exécution privée apparaît dans la réponse du nœud `/status`
- les comptes utilisateurs sont acceptés par votre processus d'intégration privé
- le compte du sponsor existe
- l'actif de frais XOR et le compte de destination des frais sont valides sur le réseau

## 2. Enregistrer les actifs dans l'espace de données {#_2-register-assets-in-the-dataspace}

Enregistrez les définitions d'actifs que les utilisateurs détiendront à l'intérieur de l'espace de données privé avant de les intégrer dans la logique de l'application. Pour le modèle de frais basé sur le jeton local, le tutoriel utilise `usage#billing.team` :

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Commencez par configurer le domaine et le bail SNS qui possède l'espace de noms de l'actif. Créez une intention `AliasSetupPlanRequestV1` sans secret pour `$BILLING_DOMAIN`, incluant l'ID numérique `team` de l'espace de données, le propriétaire canonique, la durée du bail et le gardien de devis actuel :

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Ensuite, enregistrez la définition de l'actif. Le `--id` canonique est l'ID de définition de l'actif au niveau du réseau. L'alias est ce que les développeurs et les utilisateurs finaux doivent utiliser dans le code de l'espace de données :

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

délivrer ou transférer le jeton local à un utilisateur lors de l'intégration :

```bash
iroha --config ./operator.client.toml \
  ledger asset mint \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --quantity 100
```

Vérifiez le solde de l'utilisateur :

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER"
```

Utilisez le même modèle pour les actifs d'application dans l'espace de données. Enregistrez une définition d'actif par jeton, donnez à chacun un alias d'espace de données et référez-vous à l'alias depuis le code SDK au lieu de coder en dur les ID de définition d'actif canonique.

## 3. Enregistrer les alias des utilisateurs {#_3-register-user-aliases}

Les comptes sont toujours des identifiants de compte canoniques I105. Les noms visibles par l'utilisateur sont des alias de compte, et les alias doivent être des identifiants non sensibles tels que `alice@team` ou `alice@members.team`. N'utilisez pas de numéros de téléphone ou d'adresses e-mail comme alias. Ceux-ci appartiennent au flux d'identifiant privé dans la section suivante.

La configuration des alias utilise le même planificateur déclaratif que la configuration du domaine. Demandez au service SDK ou d'intégration de créer une intention `AliasSetupPlanRequestV1` sans secret dont l'entrée account-alias cible `$USER`, sélectionne le rôle principal, épingle l'identifiant de l'espace de données numérique et maintient la protection du devis de location en cours. Ensuite, planifiez et appliquez-le comme une transaction atomique unique :

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Si l'utilisateur ne doit pas payer XOR, utilisez le service d'intégration approuvé et conscient des sponsors pour créer et soumettre la transaction de configuration. Ne divisez pas l'acquisition de bail et l'attribution d'alias en transactions d'application indépendantes.

Après que l'alias est lié, vérifiez-le à partir de CLI :

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Pour la création d'un nouveau compte, préférez un service d'intégration qui construit `NewAccount` avec un `uaid` stable et, si nécessaire, un `label` initial. La simple commande `ledger account register --id` enregistre uniquement l'ID de compte canonique.

## 4. Enregistrer le téléphone et l'e-mail de manière privée avec FHE {#_4-register-phone-and-email-privately-with-fhe}

Utilisez les numéros de téléphone et les adresses e-mail comme revendications d'identifiants privés, et non comme alias publics. Le flux soutenu par FHE empêche les identifiants bruts d'apparaître dans les alias de compte, les métadonnées de transaction et l'état mondial :

1. l'opérateur enregistre un [RAM-LFE/FHE politique du programme](/fr/blockchain/ram-lfe.md) pour le téléphone et l'email
2. l'opérateur enregistre des politiques d'identificateur actif telles que `phone#team` et `email#team`
3. le portefeuille normalise le téléphone ou l'email localement
4. le portefeuille envoie la valeur chiffrée au résolveur
5. le résolveur renvoie un `IdentifierResolutionReceipt`
6. l'utilisateur soumet `ClaimIdentifier` avec l'enregistrement du résultat du protocole
7. la chaîne stocke un identifiant opaque et le hachage du reçu, et non le numéro de téléphone ou l’adresse e-mail en clair

La configuration de la politique côté opérateur est une tâche SDK ou de service. Créez et soumettez ces paires d'instructions pour chaque type d'identifiant :

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

Répétez-le pour le courriel avec :

```text
program_id = "email_team"
policy_id = "$EMAIL_POLICY"
normalization = "EmailAddress"
```

Lors de l'intégration, le portefeuille ou le backend devrait normaliser localement :

```text
PhoneE164: "+15551234567"
EmailAddress: "alice@example.com"
```

Après que le fichier de métadonnées du sponsor est créé à l'étape 8, soumettez une instruction de réclamation signée par l'utilisateur avec ces métadonnées :

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

Le CLI actuel n'expose pas de commandes typées pour ces instructions d'identité. Générez des valeurs `InstructionBox` sérialisées avec le SDK et soumettez-les via `ledger transaction stdin` :

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Respectez ces garde-fous dans le service d'intégration :

- les alias de compte sont uniquement des identifiants lisibles par l'homme
- les numéros de téléphone et adresses e-mail bruts n’apparaissent jamais dans les alias, métadonnées, journaux ou charges de transactions
- le compte a un `uaid` avant de réclamer des identifiants privés
- protocoler les résultats, enregistrer lier `policy_id`, `opaque_id`, `uaid`, `account_id`, et expiration
- les clés de résolution et les engagements des programmes cachés sont contrôlés par la gouvernance

## 5. Activer le parrainage sur le nœud {#_5-enable-sponsorship-on-the-node}

Le nœud et l’environnement d’exécution régissent le parrainage des frais. Activez-le dans la configuration des frais Nexus :

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

`fee_asset_id` est l'actif des frais de réseau. Pour SORA Nexus, c'est XOR. Utilisez l'alias actif XOR ou l'ID de définition de l'actif canonique XOR exposé par votre réseau.

`sponsor_max_fee = "0"` signifie qu'il n'y a pas de plafond par transaction pour le sponsor. Pour la production, fixez un plafond non nul après avoir connu la taille normale et le profil de coût d'exécution des transactions de votre espace de données.

Redémarrez ou appliquez cette configuration via votre processus opérateur normal.

## 6. Créer et financer le sponsor {#_6-create-and-fund-the-sponsor}

Générez une paire de clés de parrain si nécessaire :

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
```

Convertissez la clé publique au format de compte pour votre réseau :

```bash
iroha tools address convert \
  --network-prefix <CHAIN_DISCRIMINANT> \
  <SPONSOR_ED25519_PUBLIC_KEY_HEX>
```

Enregistrez le compte sponsor via votre processus d'intégration privé :

```bash
iroha --config ./operator.client.toml \
  ledger account register --id "$SPONSOR"
```

Approvisionnez le sponsor avec XOR à partir d’un trésor, d’un compte de réclamation ou d’un autre compte approvisionné :

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Pour les répétitions de Taira, sauvegardez l'assistant de service de financement testnet de [Obtenir le Testnet XOR sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) sous `taira_faucet_claim.py`, puis financez le sponsor avec le service de financement testnet public au lieu d'un transfert de trésorerie :

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Vérifiez le solde du sponsor XOR :

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Accorder à un utilisateur l'accès au sponsor {#_7-grant-a-user-access-to-the-sponsor}

Le sponsor doit accorder à chaque utilisateur l'autorisation de lui facturer des frais. L'octroi est ce qui empêche les utilisateurs de désigner des comptes sponsor arbitraires.

Exécutez ceci en tant que compte sponsor ou en tant que compte opérationnel autorisé par votre politique d'exécution logicielle :

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

Pour les services d'intégration, faites de ceci une étape normale de fourniture de compte et enregistrez :

- compte utilisateur
- compte sponsor
- espace de données ou application
- billet d'approbation ou décision de gouvernance

Pour inspecter les droits d'un utilisateur :

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. Joindre les métadonnées du sponsor {#_8-attach-sponsor-metadata}

Créer un fichier de métadonnées réutilisable :

```bash
printf '{
  "fee_sponsor": "%s"
}\n' "$SPONSOR" > sponsored-fee.json
```

Toute écriture soumise avec ces métadonnées est facturée au sponsor :

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger transaction ping --msg "sponsored private-dataspace write"
```

Pour SDKs, joignez le même objet de métadonnées de transaction à la transaction signée. L'utilisateur signe la transaction avec sa clé. Le sponsor ne signe pas chaque transaction utilisateur car la subvention `CanUseFeeSponsor` précédente constitue l'autorisation.

## Modèle 1 : Les utilisateurs ne paient aucun frais {#pattern-1-users-pay-no-fees}

Utilisez ceci lorsque l'application ou l'opérateur prend en charge tous les frais réseau.

Liste de contrôle du développeur :

1. Conservez la charge utile de transaction normale de l'utilisateur inchangée.
2. Ajouter des métadonnées de transaction avec `fee_sponsor`.
3. Connectez-vous en tant qu'utilisateur.
4. Soumettre via la route de l'espace de données privé.

Le compte utilisateur n'a pas besoin d'un solde XOR. Le compte parrain doit conserver suffisamment de XOR pour couvrir les frais Nexus configurés.

## Modèle 2 : Les utilisateurs paient avec un jeton local {#pattern-2-users-pay-a-local-token}

Utilisez ceci lorsque les utilisateurs ne doivent pas détenir XOR, mais que l’espace de données souhaite toujours des frais d’application internes, une dépense de crédit ou un jeton de quota.

Dans ce schéma, le jeton local est un paiement d'application. Il n'est pas l'actif de frais de réseau. Le sponsor paie toujours les frais de réseau en XOR.

Par exemple, utilisez un jeton local dans l’espace de données privé :

```text
usage#billing.team
```

Financez les utilisateurs avec `usage#billing.team` lors de l'intégration, du renouvellement de l'abonnement ou de l'attribution du quota. Puis rendez la transaction utilisateur atomique :

1. transférer des jetons locaux de l'utilisateur au sponsor
2. effectuer l'opération d'application demandée
3. inclure les métadonnées `fee_sponsor` afin que le sponsor paie XOR

Un test de fumée minimal CLI est juste le transfert de jeton local parrainé par XOR :

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Pour une véritable application, ne soumettez pas le paiement en token local comme une transaction séparée de type best-effort. Créez une transaction signée unique contenant à la fois le paiement et l'instruction commerciale, ou exposez un point d'entrée de contrat qui collecte le token local avant d'appliquer l'opération commerciale.

Conservez la politique de conversion dans votre application ou contrat :

- quelle opération coûte combien d'unités de jeton local
- comment l'afflux local de jetons se traduit par des recharges du sponsor XOR
- que se passe-t-il lorsque le solde de l'utilisateur est trop faible
- que se passe-t-il lorsque le solde du sponsor XOR est trop bas

::: warning

N'utilisez pas `gas_asset_id` pour le modèle de « frais de jeton local » à moins que vous ne vouliez que le sponsor soit également facturé dans cet actif de coût d'exécution de transaction. Dans l'environnement d'exécution actuel du logiciel, `fee_sponsor` fait également du sponsor le payeur des débits d'actifs de pipeline-gaz configurés. Pour les frais d'utilisateur en jetons locaux, collectez le jeton explicitement avec un transfert ou une règle de contrat.

:::

## Échec du débogage des transactions sponsorisées {#debug-failed-sponsored-transactions}

Les raisons courantes de rejet pointent généralement vers une étape de configuration manquante :

|Texte d'erreur|Ce qu'il faut vérifier|
| --- | --- |
| `fee sponsorship is disabled` | `nexus.fees.sponsorship_enabled` est toujours `false` sur le nœud. |
| `fee sponsor is not authorized` |L'utilisateur n'a pas `CanUseFeeSponsor` pour ce sponsor.|
| `fee asset ... is missing` |Le sponsor ne détient pas l'actif de frais configuré XOR.|
| `fee balance ... is insufficient` |Rechargez le solde du sponsor XOR.|
| `fee exceeds sponsor_max_fee` |Augmentez `sponsor_max_fee` ou réduisez la taille/la consommation de gaz de la transaction.|
| `invalid nexus fee asset id` |Corrigez `nexus.fees.fee_asset_id` ou l'alias d'actif XOR.|

Lors du débogage du motif 2, vérifiez les deux soldes :

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

## Faire fonctionner le sponsor {#operate-the-sponsor}

Traitez le sponsor comme un compte de trésorerie :

- garder des clés de sponsor séparées pour testnet, staging et mainnet
- alerter avant que le solde du sponsor XOR n'atteigne le plancher d'admission
- définir un plafond `sponsor_max_fee` non nul une fois que le trafic est caractérisé
- limiter le taux d'écriture sponsorisée dans votre application ou passerelle
- révoquer `CanUseFeeSponsor` lorsque les utilisateurs quittent l’espace de données
- rapprocher les hachages des transactions utilisateur, les paiements en jetons locaux et les débits XOR du sponsor

Révoquer le parrainage d'un utilisateur :

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

## Pages liées {#related-pages}

- [Connecter aux espaces de données SORA Nexus](/fr/get-started/sora-nexus-dataspaces.md)
- [Faire fonctionner Iroha 3 via CLI](/fr/get-started/operate-iroha-via-cli.md)
- [Actifs](/fr/blockchain/assets.md)
- [Autorisations](/fr/blockchain/permissions.md)
- [Jetons de permission](/fr/reference/permissions.md)
