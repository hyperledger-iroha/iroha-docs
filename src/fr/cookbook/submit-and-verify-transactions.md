---
translation_locale: fr
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Soumettre et vérifier les transactions {#submit-and-verify-transactions}

## Résultat {#outcome}

Préflight d'une transaction Taira, accepter une estimation exacte des frais, la signer et la soumettre, attendre la finalité appliquée et vérifier la transaction engagée par le hachage cryptographique.

## Prérequis {#prerequisites}

- Un `taira.client.toml`, `taira.tx-metadata.json` et `TAIRA_ACCOUNT_ID` financé produit par [Connectez-vous à Taira](./connect-to-taira.md).
- Le `iroha` CLI et `jq` actuels.
- Un dispositif de signature cryptographique jetable Taira. Ne réutilisez pas sa clé ni ces commandes d'écriture sur Minamoto.

## Étapes {#steps}

### 1. Prévoler le point de terminaison API, le principal d'autorisation et le solde des frais {#_1-preflight-the-endpoint-authority-and-fee-balance}

Lisez d'abord la vue de données de point dans le temps de la file d'attente, puis prouvez que le solde des frais du principal d'autorisation est visible. Lisez l'ID de définition d'actif Base58 à partir des métadonnées générées par la recette de connexion.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Arrêtez si le compte ou le solde des frais est absent. Une instruction valide ne peut pas passer l'admission des frais si son principal d'autorisation ne peut pas payer.

### 2. Citez, signez et soumettez une fois {#_2-quote-sign-and-submit-once}

Le CLI envoie la charge utile exacte non signée pour une estimation de prix des frais, lie l'intention de paiement acceptée dans la transaction, signe et soumet. Le mode JSON renvoie le hachage cryptographique de la transaction, la transaction signée et le devis accepté ensemble.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

Ne pas utiliser `--no-wait` dans cette recette. La commande attend une confirmation avant d'écrire un enregistrement de résultat de protocole réussi.

### 3. Attendre l'état de traitement final du pipeline {#_3-wait-for-terminal-pipeline-state}

Utilisez l'assistant de statut saisi au lieu de déduire le succès de l'acceptation ou de l'admission dans la file d'attente de HTTP. Avec `--wait`, le périmètre de routage sûr est sélectionné automatiquement et la cible par défaut est la finalité appliquée.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` et `Expired` sont des échecs définitifs, pas des états de succès pouvant être réessayés. Enregistrez leur raison avant de modifier ou de reconstruire la transaction.

### 4. Lire la transaction enregistrée {#_4-read-the-stored-transaction}

Le statut du pipeline de traitement indique si le traitement est terminé. Une requête de transaction vérifie que la transaction admise est stockée sous le même hachage cryptographique.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

L'explorateur est une seconde surface d'observation en lecture seule. Il peut prendre un certain retard par rapport à la finalité du pipeline de traitement.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Pour une instruction qui change l'état, terminez par une requête de l'objet qui a été modifié. Les recettes [Métadonnées](./metadata.md), [Actifs fongibles](./fungible-assets.md) et [NFTs](./nfts.md) incluent ces lectures après l'état.

## Vérifier {#verify}

Vérifiez que les trois enregistrements correspondent au même hachage cryptographique et que l'explorateur ne signale plus un état en attente :

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Conservez l'enregistrement du résultat du protocole de soumission et le statut final comme preuve de test. Ils contiennent du matériel de transaction public, pas la clé de signature.

## Dépannage {#troubleshooting}

- HTTP `202` ou un statut en file d'attente ne prouve que l'admission. Continuez à interroger le statut saisi jusqu'à ce qu'il soit Appliqué, Rejeté, Expiré ou que le délai imparti soit atteint.
- Si la soumission expire après avoir retourné une empreinte cryptographique, interrogez cette empreinte cryptographique avant de créer une autre transaction. Une nouvelle soumission à l'aveugle crée une nouvelle charge utile citée et signée.
- Une estimation du prix des frais peut être rejetée avant la signature. Vérifiez `--fee-payer authority`, `gas_asset_id`, le solde du mandant d'autorisation et l'ID de chaîne du réseau.
- `Rejected` indique généralement la validation des instructions, les autorisations, les frais ou un état obsolète. Il s'agit d'une preuve confirmée d'une exécution échouée et ne doit pas être reclassé comme une tentative de transport.
- Un explorateur `404` immédiatement après l'application peut présenter un retard d'indexation. Réessayez la lecture ; ne soumettez pas à nouveau la transaction.
- Si une instruction privilégiée fonctionne sur un localnet généré mais que Taira la rejette, obtenez la permission exacte Taira ou l'affectation de l'espace de noms régulé. Le résultat local n'accorde pas le principal d'autorisation du réseau public.

## Source et documents connexes {#source-and-related-docs}

- [Soumission de transaction et mise en œuvre du devis de frais au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Mise en œuvre et tests de la confirmation de transaction au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [Transactions](/fr/blockchain/transactions.md)
- [Guide de la CLI](/fr/get-started/operate-iroha-via-cli.md)
- [Torii API points de terminaison](/fr/reference/torii-endpoints.md)
