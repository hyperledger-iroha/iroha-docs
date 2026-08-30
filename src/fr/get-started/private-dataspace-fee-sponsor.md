---
translation_locale: fr
translation_source: /get-started/private-dataspace-fee-sponsor.md
translation_source_hash: 37a2c29dccf3d2abacbbba16869d65b70b93545875a122470601194231c2263b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Frais de parrainage pour un espace de données privé {#sponsor-fees-for-a-private-dataspace}

Le parrainage des frais permet aux utilisateurs de soumettre des transactions dans l'espace de données privé sans détenir XOR. L'utilisateur signe toujours la transaction. Les métadonnées de la transaction pointent vers un compte du parrain et le temps d'exécution débite le solde du parrain XOR pour les frais de réseau.

L'intégration est composée de trois parties mobiles:

1. le nœud autorise le parrainage des frais
2. le compte parrain existe et dispose de XOR
3. chaque utilisateur dispose de `CanUseFeeSponsor` pour ce commanditaire

Après cela, chaque transaction utilisateur sponsorisée n'a besoin que de ces métadonnées:

```json
{
  "fee_sponsor": "<SPONSOR_ACCOUNT_I105>"
}
```

Cette page montre deux modèles communs:

- L'utilisateur gratuit écrit: le commanditaire paie XOR et l'utilisateur ne paie rien.
- Tarifs pour les jetons locaux: l'utilisateur paie au sponsor un jeton d'application et le sponsor le réseau XOR.

Utilisez Taira ou un réseau de test privé d'abord. Un nouvel espace de données privé est un opérateur et une modification de gouvernance; il n'est pas créé par la configuration du client.

## Les valeurs d'exemple {#example-values}

Les commandes ci-dessous utilisent ces détenteurs de place:

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

Utilisez le compte canonique I105 IDs sauf si votre déploiement a des aliases de compte actif pour les mêmes comptes.

## 1. Préparer l'espace de données {#_1-prepare-the-dataspace}

Commencez par le catalogue de l'espace de données privé et le travail de routage décrit dans [Connectez-vous à SORA Nexus Dataspaces](/fr/get-started/sora-nexus-dataspaces.md#_8-provision-a-new-dataspace). Un fragment face à l'opérateur ressemble à ceci:

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

- La voie privée apparaît dans la réponse du nœud `/status`
- Les comptes d'utilisateur sont admis par votre flux privé de connexion.
- l'existence du compte sponsor
- l'actif de redevance XOR et le compte d'échange des redevances sont valables sur le réseau;

## 2. Enregistrer les actifs dans l'espace de données {#_2-register-assets-in-the-dataspace}

Enregistrer les définitions d'actifs que les utilisateurs conserveront à l'intérieur de l'espace de données privé avant de les brancher dans la logique de l'application. Pour le modèle local-token fee, le tutoriel utilise `usage#billing.team`:

```text
<asset-name>#<domain>.<dataspace>
usage#billing.team
```

Tout d'abord mettre en place le domaine et SNS Créer un espace de noms d'actifs sans secrets `AliasSetupPlanRequestV1` l'intention `$BILLING_DOMAIN`, y compris le chiffre `team` espace de données ID, propriétaire canonique, terme de location et garde actuelle des devis:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./billing-domain.intent.json \
  --plan-file ./billing-domain.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./billing-domain.plan.json
```

Enregistrer la définition de l'actif. Le `--id` canonique est la définition d'actif au niveau du réseau ID. Le pseudonyme est ce que les développeurs et les utilisateurs finaux devraient utiliser dans le code de l'espace de données:

```bash
iroha --config ./operator.client.toml \
  ledger asset definition register \
  --id "$LOCAL_FEE_ASSET_ID" \
  --name usage \
  --alias "$LOCAL_FEE_ASSET" \
  --scale 0
```

Mint ou transfert du jeton local à un utilisateur lors de l'intégration:

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

Utilisez le même schéma pour les actifs d'application dans l'espace de données. Enregistrez une définition d'actif par jeton, donnez à chacun un alias de espace de données et renvoyez à l'alias du code SDK au lieu de la définition canonique des actifs IDs en code dur.

## 3. Enregistrer les prénoms d'utilisateur {#_3-register-user-aliases}

Les comptes sont toujours canoniques. I105 compte IDs. Les noms d'utilisateur sont des pseudonymes de compte, et les pseudonymes doivent être des poignées non sensibles telles que `alice@team` ou `alice@members.team`. N' utilisez pas les numéros de téléphone ou les adresses e-mail comme alias. Ils appartiennent au flux d'identifiants privés dans la section suivante.

L'installation d'alias utilise le même planificateur déclaratif que l'installation de domaine. Faites en sorte que le SDK ou le service d'intégration crée une intention `AliasSetupPlanRequestV1` sans secret dont les cibles d'entrée de compte-alias sont `$USER`, sélectionne le rôle principal, pinne l'espace de données numérique ID et porte la garde actuelle du devis de location. Ensuite, planifiez et appliquez-le comme une seule transaction atomique:

```bash
iroha --config ./operator.client.toml \
  app alias setup plan \
  --intent-file ./user-alias.intent.json \
  --plan-file ./user-alias.plan.json

iroha --config ./operator.client.toml \
  app alias setup apply --plan-file ./user-alias.plan.json
```

Si l'utilisateur ne doit pas payer XOR, utilisez le service d' embarquement approuvé par un sponsor pour construire et soumettre la configuration transaction. Ne divisez pas l'acquisition de bail et les alias liants en transactions d'application indépendantes.

Une fois le pseudonyme lié, vérifiez-le à partir du CLI:

```bash
iroha --config ./operator.client.toml \
  app alias resolve --alias "$USER_ALIAS"

iroha --config ./operator.client.toml \
  app alias by-account \
  --account-id "$USER" \
  --dataspace "$DATASPACE"
```

Pour la création d'un nouveau compte, préférer un service de connexion qui crée `NewAccount` avec une étagère `uaid` et, si nécessaire, une première `label`. Le plus simple `ledger account register --id` Le commandement n'enregistre que le compte canonique. ID.

## 4. Enregistrer le téléphone et l'e-mail en privé auprès de FHE {#_4-register-phone-and-email-privately-with-fhe}

Utilisez les numéros de téléphone et les adresses e-mail comme revendications d'identifiants privés, pas des aliases publiques. Le flux soutenu par FHE garde les identifiants bruts hors des aliases de compte, des métadonnées de transaction et de l'état mondial:

1. l'opérateur enregistre une politique de programme [RAM-LFE/FHE ](/fr/blockchain/ram-lfe.md) pour le téléphone et le courrier électronique;
2. l'exploitant enregistre les politiques d'identification active telles que `phone#team` et `email#team`;
3. le portefeuille normalise le téléphone ou l'e-mail localement
4. le portefeuille envoie la valeur cryptée au résolveur
5. Le résolveur renvoie un `IdentifierResolutionReceipt`
6. l'utilisateur soumet `ClaimIdentifier` avec le reçu;
7. la chaîne stocke un identifiant opaque et un hachage de reçus, pas la valeur brute du téléphone ou de l'e-mail

L'établissement des politiques du côté de l'opérateur est une tâche SDK ou un service. Construire et soumettre ces paires d'instructions pour chaque type d'identificateur:

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

Répétez pour le courrier électronique avec:

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

Après la création du fichier de métadonnées par le sponsor à l'étape 8, soumettre une instruction de demande signée par l'utilisateur avec ces métadonnées:

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

Le courant CLI n'expose pas les commandes typées pour ces instructions d'identification. Générez des valeurs sérialisées `InstructionBox` avec le SDK et soumettez-les par l'intermédiaire de `ledger transaction stdin`:

```bash
printf '["<BASE64_CLAIM_IDENTIFIER_INSTRUCTION_BOX>"]\n' |
  iroha --config ./alice.client.toml \
    --metadata ./sponsored-fee.json \
    ledger transaction stdin
```

Gardez ces barreaux dans le service d' embarquement:

- Les pseudonymes de compte sont des poignées lisibles uniquement par les humains
- les valeurs de téléphone et d'e-mail brutes ne sont jamais affichées dans des aliases, des métadonnées, des journaux ou des charges utiles pour les transactions
- le compte a un `uaid` avant de réclamer des identifiants privés;
- les reçus sont liés à `policy_id`, `opaque_id`, `uaid`, `account_id` et expirent
- Les clés de résolution et les engagements des programmes cachés sont contrôlés par la gouvernance

## 5. Activer le parrainage sur le nœud {#_5-enable-sponsorship-on-the-node}

Le parrainage des frais est une politique de nœuds/temps d'exécution. Nexus configuration des frais:

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

`fee_asset_id` est l'actif de la redevance réseau. SORA Nexus C' est ça. XOR. Utilisez l' active XOR des alias ou canoniques XOR définition d'actif ID exposé par votre réseau.

`sponsor_max_fee = "0"` signifie qu'il n'y a pas de plafond pour les sponsors par transaction. Pour la production, fixez un plafond non zéro après avoir connu la taille normale et le profil du gaz de vos transactions en espace de données.

Réinitialisez ou roulez cette configuration à travers votre processus d'opérateur normal.

## 6. Créer et financer le commanditaire {#_6-create-and-fund-the-sponsor}

Générer une paire de clés parrain si nécessaire:

```bash
kagami keys --algorithm ed25519 --out-dir ./fee-sponsor-key
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

Financer le commanditaire avec XOR provenant d'un trésor, d'un compte de créances ou d'un autre compte financé:

```bash
iroha --config ./treasury.client.toml \
  ledger asset transfer \
  --definition-alias "$XOR_ASSET" \
  --account "$TREASURY" \
  --to "$SPONSOR" \
  --quantity 1000
```

Pour les répétitions Taira, économisez l'assistant du robinet à partir de [Obtenir le testnet XOR sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) comme `taira_faucet_claim.py`, puis financer le sponsor avec le robinet public au lieu d'un virement du trésor:

```bash
export SPONSOR='<SPONSOR_TAIRA_I105_ACCOUNT_ID>'
export XOR_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$SPONSOR"

iroha --config ./sponsor.client.toml \
  ledger asset get \
  --definition "$XOR_ASSET" \
  --account "$SPONSOR"
```

Vérifiez le solde XOR du commanditaire:

```bash
iroha --config ./operator.client.toml \
  ledger asset get \
  --definition-alias "$XOR_ASSET" \
  --account "$SPONSOR"
```

## 7. Accordez à l'utilisateur un accès au commanditaire {#_7-grant-a-user-access-to-the-sponsor}

Le parrain doit accorder à chaque utilisateur la permission de lui facturer des frais. La subvention est ce qui empêche les utilisateurs de nommer des comptes sponsors arbitraires.

Exécutez ceci comme le compte sponsor, ou comme un compte opérationnel autorisé par votre politique d'exécution:

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

Pour les services d'intégration, il s'agit d'une étape normale de fourniture de compte et de l'enregistrement:

- compte d'utilisateur
- compte du commanditaire
- espace de données ou application
- billet d'approbation ou décision de gouvernance

Pour inspecter les subventions d'un utilisateur:

```bash
iroha --config ./operator.client.toml \
  ledger account permission list --id "$USER"
```

## 8. joindre les métadonnées du commanditaire {#_8-attach-sponsor-metadata}

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

Pour SDKs, joindre le même objet de métadonnées de transaction à la transaction signée. L'utilisateur signe la transaction avec la clé de l'utilisateur. Le sponsor ne signe pas chaque transaction utilisateur parce que la subvention précédente `CanUseFeeSponsor` est l'autorisation.

## Modèle 1: Les utilisateurs ne paient pas de frais {#pattern-1-users-pay-no-fees}

Utilisez-le lorsque l'application ou l'opérateur absorbe tous les frais de réseau.

Liste de contrôle des développeurs:

1. Garder la charge utile normale des transactions de l'utilisateur inchangée.
2. Ajouter des métadonnées de transaction avec `fee_sponsor`.
3. Signez en tant qu'utilisateur.
4. Envoyez par l'intermédiaire de l'espace de données privé.

Le compte utilisateur n'a pas besoin d'un solde XOR; le compte sponsor doit conserver suffisamment de XOR pour couvrir les frais configurés Nexus.

## Modèle 2: Les utilisateurs paient un jeton local {#pattern-2-users-pay-a-local-token}

Utilisez ceci lorsque les utilisateurs ne devraient pas détenir XOR, mais que l'espace de données souhaite toujours une redevance interne pour l'application, des dépenses de crédit ou des jetons de quota.

Dans ce modèle, le jeton local est un paiement d'application. Ce n'est pas l'actif de redevance réseau. Le sponsor paie toujours la redevance de réseau en XOR.

Par exemple, utiliser un jeton local dans l'espace de données privé:

```text
usage#billing.team
```

Les utilisateurs de fonds avec `usage#billing.team` lors de l'intégration, du renouvellement des abonnements ou de l'allocation de quotas.

1. Transférer des jetons locaux de l'utilisateur au sponsor
2. effectuer l'opération de l'application demandée
3. inclure des métadonnées `fee_sponsor` afin que le sponsor paie XOR;

Un test de fumée minimal CLI n'est que le transfert local-token parrainé par XOR:

```bash
iroha --config ./alice.client.toml \
  --metadata ./sponsored-fee.json \
  ledger asset transfer \
  --definition-alias "$LOCAL_FEE_ASSET" \
  --account "$USER" \
  --to "$SPONSOR" \
  --quantity 1
```

Pour une application réelle, ne soumettez pas le paiement local-token comme une transaction séparée de meilleur effort. Construisez une transaction signée contenant à la fois le paiement et l'instruction d'affaires, ou exposez un point d'entrée du contrat qui collecte le jeton local avant d'appliquer l'opération commerciale.

Gardez la politique de conversion dans votre application ou contrat:

- quelle opération coûte combien d'unités de jetons locales
- Comment les cartes d'afflux de jetons locaux pour parrainer XOR des compléments
- ce qui se passe lorsque l'équilibre de l'utilisateur est trop bas
- ce qui se passe lorsque le solde du sponsor XOR est trop faible;

::: warning

Ne pas utiliser `gas_asset_id` pour le modèle de "compte local-token" sauf si vous voulez que le sponsor soit facturé dans cet actif de gaz aussi. `fee_sponsor` fait également du commanditaire le payeur des débitations d'actifs en gaz et pipeline configurées. Pour les frais d'utilisation des jetons locaux, recueillez le jeton explicitement avec une règle de transfert ou de contrat.

:::

## Débug des transactions sponsorisées ratées {#debug-failed-sponsored-transactions}

Les raisons courantes de rejet indiquent généralement qu'une étape d'installation manque:

|Le texte d' erreur |Ce qu' il faut vérifier .|
| --- | --- |
|`fee sponsorship is disabled` |`nexus.fees.sponsorship_enabled` est toujours `false` sur le noeud. |
|`fee sponsor is not authorized` |L'utilisateur ne dispose pas de `CanUseFeeSponsor` pour ce sponsor. |
|`fee asset ... is missing` |Le commanditaire ne détient pas l'actif de redevance XOR configuré. |
|`fee balance ... is insufficient` | Remplissez le portefeuille du sponsor. XOR l'équilibre. |
|`fee exceeds sponsor_max_fee` |Augmenter `sponsor_max_fee` ou réduire la taille/gaz de l'opération. |
|`invalid nexus fee asset id` |Fix `nexus.fees.fee_asset_id` ou l'alias de l'actif XOR. |

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

- conserver des clés de sponsoring séparées pour le testnet, la mise en scène et le mainnet
- l'alerte avant que le solde du sponsor XOR atteigne le niveau d'admission;
- définir un plafond non nul `sponsor_max_fee` une fois le trafic caractérisé;
- écrites sponsorisées dans votre demande ou gateway
- révoquer `CanUseFeeSponsor` lorsque les utilisateurs quittent l'espace de données
- réconcilier les hachages des transactions utilisateurs, les paiements par jetons locaux et les débits du sponsor XOR

Révoquer le parrainage d'un utilisateur:

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

- [Connectez-vous à SORA Nexus Les espaces de données](/fr/get-started/sora-nexus-dataspaces.md)
- [L'opération Iroha 3 est effectuée par l'intermédiaire de CLI ](/fr/get-started/operate-iroha-via-cli.md)
- [Les actifs ](/fr/blockchain/assets.md)
- [Autorisations ](/fr/blockchain/permissions.md)
- [Des jetons d'autorisation ](/fr/reference/permissions.md)
