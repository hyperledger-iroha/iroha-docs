---
translation_locale: fr
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Connectez-vous à Taira {#connect-to-taira}

## Résultat {#outcome}

Confirmez que Taira est joignable, dérivez l'ID de compte canonique I105 à partir d'une configuration client locale, financez le signataire cryptographique avec le XOR du réseau de test, et soumettez une transaction canari avec frais cotés. Cette recette n'envoie jamais d'écriture à Minamoto.

## Prérequis {#prerequisites}

- `curl`, `jq`, Python 3.11 ou version ultérieure, et les binaires actuels `iroha` et `kagami`.
- Un `taira.client.toml` créé avec la chaîne Taira, le `network_id` exact, le point de terminaison API, le profil de compte et une clé testnet dédiée. Suivez [Créer une configuration client Taira](/fr/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) et gardez le fichier hors du contrôle de version.
- Un répertoire de travail accessible en écriture pour le journal du service de financement du testnet : `iroha taira account faucet prepare` crée `./taira-faucet` avec des permissions privées et refuse de remplacer un répertoire existant.

## Étapes {#steps}

### 1. Séparer la vivacité de la disponibilité {#_1-separate-liveness-from-readiness}

`/livez`, `/health` et `/readyz` sont des sondes en texte clair ; `/status` renvoie du JSON. Un nœud en fonctionnement peut légitimement renvoyer `503` depuis `/readyz` lorsque l'admission au consensus ou un autre sous-système requis est indisponible.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Utilisez `/livez` uniquement pour décider si le processus répond. Utilisez `/readyz` pour l'admission du trafic. Son `503` est une enveloppe d'erreur `service_unavailable` sans détails de bloqueur ; exécutez donc les diagnostics ci-dessous avant de le traiter comme une panne.

### 2. Exécuter les diagnostics publics {#_2-run-the-public-diagnostics}

Cette vérification est en lecture seule et ne charge pas la configuration du signataire cryptographique :

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Ne continuez pas à écrire lorsque le médecin signale un échec de point de terminaison dur DNS, TLS, chaîne ou API. Une file d'attente publique saturée est transitoire ; attendez et réessayez avec une politique limitée.

### 3. Dérivez l'identifiant de compte Taira sans imprimer de secret {#_3-derive-the-taira-account-id-without-printing-a-secret}

Lisez uniquement la clé publique à partir de la configuration, puis encodez-la avec le profil Taira I105. L'ID du compte ne comporte aucun domaine ; `[account].profile` ne sélectionne que son préfixe réseau.

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

La politique du service de financement du testnet indique la définition actuelle de l'actif de frais. Conservez son ID Base58 au lieu de copier un ID d'un autre réseau ou d'une ancienne exécution. La politique est une donnée de découverte non signée : l'automatisation doit donc épingler l'émetteur, la définition d'actif et le montant qu'elle attend au lieu de faire confiance à chaque réponse.

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` résout la preuve de travail et enregistre la transaction signée exacte ; `submit` l'envoie une seule fois et rend la main après son application. Si `submit` signale `Pending` ou expire, exécutez `taira account faucet resume` avec la même configuration et le même journal au lieu de préparer une autre réclamation. Sondez ensuite le solde pendant au maximum une minute.

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

Utilisez `--fee-payer authority` pour chaque écriture sur Taira. La sélection est liée à la signature, et le CLI établit le devis exact des frais, dans l'actif de frais de Taira, avant de signer.

## Vérifier {#verify}

Soumettez une instruction de journal, conservez l'enregistrement du résultat du protocole JSON et attendez la finalité appliquée. Omettre `--no-wait` fait également que la soumission initiale attend la confirmation ; la lecture explicite du statut prouve l'état final du pipeline de traitement.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

La commande finale ne réussit qu'une fois que le statut global exact signale une finalité `Applied` résolue dans l'état. Conservez le hachage cryptographique dans les preuves de test ; ne stockez jamais la clé privée ni la configuration complète du client avec celui-ci.

## Dépannage {#troubleshooting}

- `/livez`, `/health` et `/readyz` renvoient `406` lorsqu'on leur demande uniquement du JSON, car ils répondent en `text/plain`. Envoyez les en-têtes `Accept` indiqués ci-dessus.
- `/readyz` peut renvoyer `503` avec une enveloppe d'erreur `service_unavailable` même lorsque `/livez` et `/status` fonctionnent. Attendez la disponibilité ou exécutez `iroha taira doctor` ; régénérer les clés ne changera pas la disponibilité du nœud.
- Un `502` ou un délai d’attente du distributeur pendant `submit` laisse le résultat de la réclamation inconnu : exécutez `taira account faucet resume` avec la même configuration et le même journal au lieu de préparer une autre réclamation. Une ancre de preuve de travail obsolète fait échouer `prepare` ; préparez à nouveau dans un nouveau répertoire de journal.
- Une erreur de préfixe I105 signifie que la clé publique a été encodée avec le mauvais profil. Re-exécutez `iroha tools address convert --profile taira`.
- Un rejet de devis de frais signifie généralement que le principal d'autorisation n'est pas financé ou que le `network_id` configuré n'est pas celui de Taira. L'absence de `--fee-payer`, ou une clé de frais telle que `gas_asset_id` dans `--metadata`, échoue localement avant le devis.
- L'enregistrement, l'émission ou la gestion de l'espace de noms peuvent toujours être refusés après la réussite de ce test canari. Ces opérations nécessitent des autorisations d'exécution logicielle distinctes ; répétez-les sur le réseau local généré lorsque l'accès Taira n'a pas été accordé.

## Source et documents connexes {#source-and-related-docs}

- [Diagnostics CLI de Taira et source canari](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) et [commandes du service de financement du testnet](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs) au commit épinglé
- [Sélection explicite des frais et source de soumission CLI au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Guide du service de compte et de financement testnet Taira](/fr/get-started/sora-nexus-dataspaces.md)
- [Configuration du client](/fr/guide/configure/client-configuration.md)
- [Transactions](/fr/blockchain/transactions.md)
