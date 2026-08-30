---
translation_locale: fr
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 01907ea433e711cb0b1aa327d46c44744aad0a7571a65430dddd7a8aed3df373
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Envoyer et vérifier les transactions {#submit-and-verify-transactions}

## Le résultat {#outcome}

Prévoyez une transaction Taira, acceptez un devis de frais exact, signez-le et soumettez-le, attendez la finalisation appliquée et vérifiez la transaction engagée par hash.

## Conditions préalables {#prerequisites}

- Une aide financière `taira.client.toml`, `taira.tx-metadata.json`, et `TAIRA_ACCOUNT_ID` produit par [Connectez-vous Taira](./connect-to-taira.md).
- Le courant `iroha` CLI et `jq`.
- Un signataire jetable Taira. Ne réutilisez pas sa clé ni ces commandes d'écriture sur Minamoto.

## Les étapes {#steps}

### 1. Prévoir le point final, l'autorité et l'équilibre des frais. {#_1-preflight-the-endpoint-authority-and-fee-balance}

Lisez d'abord l'instantané de la file d'attente, puis prouvez que le solde des frais de l'autorité est visible. ID à partir des métadonnées générées par la recette de connexion.

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

Une instruction valide ne peut pas passer l'admission des frais lorsque son autorité ne peut pas payer.

### 2. Citation, signature et soumission une fois {#_2-quote-sign-and-submit-once}

Le CLI envoie la charge utile non signée exacte pour un devis de frais, lie l'intention de paiement acceptée à la transaction, signe et soumet. Le mode JSON renvoie le hash de transaction, la transaction signée et le devis accepté ensemble.

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

N'utilisez pas `--no-wait` dans cette recette. La commande attend la confirmation avant d'écrire un reçu de succès.

### 3. Attendez l'état du pipeline terminal. {#_3-wait-for-terminal-pipeline-state}

Utilisez l'assistant d'état typé au lieu de déduire le succès à partir de l'acceptation HTTP ou de l'admission en file d'attente. Avec `--wait`, la portée de routage sécurisée est sélectionnée automatiquement et la cible par défaut est Appliqué finalité.

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

`Rejected` et `Expired` sont des échecs terminaux, et non des états de réussite rétractables. Enregistrer leur raison avant de modifier ou reconstruire la transaction.

### 4. Lisez la transaction stockée {#_4-read-the-stored-transaction}

L'état du pipeline répond si le traitement a été terminé. Une requête de transaction vérifie que la transaction admise est stockée sous le même hash.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

L'explorateur est une deuxième surface d'observation à lire uniquement, qui peut être un peu en retard sur la finalisation du pipeline.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Pour un changement d'état, terminer par une requête de l'objet qui a été muté. [Les métadonnées](./metadata.md), [Les actifs fonciers](./fungible-assets.md), et [NFTs](./nfts.md) Les recettes incluent les lectures post-étatiques.

## Vérifiez {#verify}

Vérifiez que les trois enregistrements sont d' accord sur le même hash et que l' explorateur ne rapporte plus un état en attente:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Gardez le reçu de la soumission et l'état final comme preuve d'essai. Ils contiennent du matériel de transaction publique, pas la clé de signature.

## Résolution des problèmes {#troubleshooting}

- HTTP `202` ou un statut de file d'attente ne prouve que l'admission. Continuez à polluter le statut typé jusqu'à ce qu'il soit appliqué, rejeté, expiré ou limité.
- Si le délai de soumission s'arrête après avoir retourné un hash, consultez ce hash avant de créer une autre transaction. Une réintroduction aveugle crée une nouvelle charge utile citée et signée.
- Une cotation peut être refusée avant la signature. `--fee-payer authority`, `gas_asset_id`, l'équilibre de l'autorité et la chaîne réseau; ID.
- `Rejected` indique généralement la validation de l'instruction, les autorisations, les frais ou l'état obsolète. C'est une preuve engagée d'une exécution ratée et ne doit pas être reclassée comme une nouvelle tentative de transport.
- Un explorateur `404` immédiatement après Applied peut indexer le retard. Essayez à nouveau la lecture; ne renvoyez pas l'opération.
- Si une instruction privilégiée fonctionne sur un localnet généré mais que Taira le rejette, obtenez l'autorisation exacte Taira ou l'affectation de l'espace de nomenclature régie.

## Sources et documents connexes {#source-and-related-docs}

- [La soumission des transactions et la mise en œuvre du taux de rémunération à l'échéance fixée ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Tests de confirmation de transaction à l'engagement fixé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [Les opérations ](/fr/blockchain/transactions.md)
- [Guide CLI](/fr/get-started/operate-iroha-via-cli.md)
- [points d'extrémité Torii](/fr/reference/torii-endpoints.md)
