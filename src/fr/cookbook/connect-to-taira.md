---
translation_locale: fr
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Connectez-vous à Taira {#connect-to-taira}

## Résultat {#outcome}

Confirmez que Taira est joignable, dérivez l'ID de compte canonique I105 à partir d'une configuration client locale, financez le signataire cryptographique avec le XOR du réseau de test, et soumettez une transaction canari avec frais cotés. Cette recette n'envoie jamais d'écriture à Minamoto.

## Prérequis {#prerequisites}

- `curl`, `jq`, Python 3.11 ou version ultérieure, et les binaires actuels `iroha` et `kagami`.
- Un `taira.client.toml` créé avec la chaîne Taira, le point de terminaison API, le profil de compte et une clé testnet dédiée. Suivez [Créer une configuration client Taira](/fr/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) et gardez le fichier hors du contrôle de version.
- Le `taira_faucet_claim.py` prêt à l'emploi de [Obtenir le Testnet XOR sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), enregistré à côté de la configuration du client.

## Étapes {#steps}

### 1. Séparer la vivacité de la disponibilité {#_1-separate-liveness-from-readiness}

`/livez` est une sonde de vivacité de processus en texte clair. `/status`, `/health` et `/readyz` renvoient JSON. Un nœud en fonctionnement peut légitimement renvoyer `503` à partir des sondes de préparation lorsqu'un sous-système requis est bloqué.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Utilisez `/livez` uniquement pour décider si le processus répond. Utilisez `/readyz` pour l'admission du trafic et inspectez ses détails de bloqueur JSON avant de traiter un `503` comme une panne.

### 2. Exécuter les diagnostics publics {#_2-run-the-public-diagnostics}

Cette vérification est en lecture seule et ne charge pas la configuration du signataire cryptographique :

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Ne continuez pas à écrire lorsque le médecin signale un échec de point de terminaison dur DNS, TLS, chaîne ou API. Une file d'attente publique saturée est transitoire ; attendez et réessayez avec une politique limitée.

### 3. Dérivez l'identifiant de compte Taira sans imprimer de secret {#_3-derive-the-taira-account-id-without-printing-a-secret}

Lisez uniquement la clé publique à partir de la configuration, puis encodez-la avec le profil Taira I105. La valeur `[account].domain` fournit le contexte de routage ; elle ne fait pas partie de l'ID du compte.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

La sortie est une adresse canonique sans domaine I105. Les noms tels que `wallet@payments.universal` sont des alias et doivent être résolus avant d'être utilisés dans des champs de compte stricts.

### 4. Réclamez l'actif de frais actuel Taira {#_4-claim-the-current-taira-fee-asset}

La réponse du service de financement du testnet est la source de vérité pour la définition de l'actif de frais. Conservez l'ID Base58 renvoyé au lieu de copier un ID d'un autre réseau ou d'une ancienne exécution.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Sondez le solde pendant au maximum une minute. Le service de financement du testnet peut renvoyer `202 Accepted` avant que la transaction de financement ne soit visible.

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

`gas_asset_id` est des métadonnées de transaction. La sélection explicite `--fee-payer authority` est liée à la signature, et le CLI obtient une estimation exacte du prix des frais avant de signer.

## Vérifier {#verify}

Soumettez une instruction de journal, conservez l'enregistrement du résultat du protocole JSON et attendez la finalité appliquée. Omettre `--no-wait` fait également que la soumission initiale attend la confirmation ; la lecture explicite du statut prouve l'état final du pipeline de traitement.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

La commande finale ne réussit qu'après que la transaction atteint l'état terminal par défaut `Applied`. Conservez le hachage cryptographique dans les preuves de test ; ne stockez jamais la clé privée ni la configuration complète du client avec celui-ci.

## Dépannage {#troubleshooting}

- `/livez` retourne `406` lorsqu'on demande JSON parce que ce point de terminaison API est `text/plain`. Envoyez `Accept: text/plain` comme indiqué ci-dessus.
- `/health` ou `/readyz` peut renvoyer `503` avec un bloqueur lisible par machine même lorsque `/livez` et `/status` fonctionnent. Corrigez ou attendez ce bloqueur ; régénérer les clés ne changera pas la disponibilité du nœud.
- Une erreur `502` du distributeur, un délai d’attente ou une ancre de preuve de travail obsolète signalent une défaillance du service public. Récupérez un nouveau défi et réessayez plus tard.
- Une erreur de préfixe I105 signifie que la clé publique a été encodée avec le mauvais profil. Re-exécutez `iroha tools address convert --profile taira`.
- Un rejet de devis de frais signifie généralement que le principal d'autorisation n'a pas été financé, que les métadonnées de l'actif de frais sont obsolètes, ou qu'aucun payeur de frais explicite n'a été sélectionné.
- L'enregistrement, l'émission ou la gestion de l'espace de noms peuvent toujours être refusés après la réussite de ce test canari. Ces opérations nécessitent des autorisations d'exécution logicielle distinctes ; répétez-les sur le réseau local généré lorsque l'accès Taira n'a pas été accordé.

## Source et documents connexes {#source-and-related-docs}

- [Taira CLI diagnostics et source canari au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [Sélection explicite des frais et source de soumission CLI au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Guide du service de compte et de financement testnet Taira](/fr/get-started/sora-nexus-dataspaces.md)
- [Configuration du client](/fr/guide/configure/client-configuration.md)
- [Transactions](/fr/blockchain/transactions.md)
