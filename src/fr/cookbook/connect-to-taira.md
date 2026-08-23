---
translation_locale: fr
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: a7347a7e8ea055fd5bab9a34b6124ea19ef6f355f9beef9e9488794d9c6e3202
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Se connecter à Taira {#connect-to-taira}

## Le résultat {#outcome}

Confirmez-le Taira est accessible, déduire le canonique I105 compte ID à partir d'une configuration locale du client, financer le signataire avec testnet XOR, Cette recette n'envoie jamais une lettre à Minamoto.

## Conditions préalables {#prerequisites}

- Les valeurs binaires actuelles `iroha` et `kagami` sont les suivantes: `curl`, `jq`, Python 3.11 ou plus.
- Une `taira.client.toml` créée avec le Taira la chaîne, le point final, le profil du compte et une clé de réseau test dédiée. [Créer un Taira Configuration du client](/fr/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) et de garder le fichier hors du contrôle source.
- Le `taira_faucet_claim.py` prêt à l'exécution de [Obtenir Testnet XOR sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), enregistré à côté de la configuration du client.

## Les étapes {#steps}

### 1. Séparation de la vitalité et de la préparation {#_1-separate-liveness-from-readiness}

`/livez` est une sonde de durée de vie des processus en texte clair. `/status`, `/health` et `/readyz` retournent JSON. Un nœud en cours d'exécution peut légitimement retourner `503` depuis les sondes de préparation lorsqu'un sous-système requis est bloqué.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Utilisez `/livez` uniquement pour décider si le processus répond.Utilisez`/readyz` pour l'entrée de la circulation et inspectez les détails du blocage JSON avant de considérer un `503` comme une panne.

### 2. Exécuter les diagnostics publics {#_2-run-the-public-diagnostics}

Cette vérification est à lecture seule et ne charge pas la configuration du signataire:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Ne continuez pas à écrire lorsque le médecin rapporte une insuffisance DNS, TLS, d'une chaîne ou d'un point de terminaison. Une file d'attente publique saturée est transitoire; attendez et essayez à nouveau avec une politique limitée.

### 3. Dériver le compte Taira ID sans imprimer un secret {#_3-derive-the-taira-account-id-without-printing-a-secret}

Lisez seulement la clé publique de la configuration, puis encodez-la avec le code Taira I105 Le profil. `[account].domain` le contexte de routage des fournitures de valeur; il ne fait pas partie du compte ID.

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

La sortie est une adresse canonique I105 sans domaine. Les noms tels que `wallet@payments.universal` sont des aliases et doivent être résolus avant qu'ils ne soient utilisés dans les champs de compte stricts.

### 4. réclamer l'actif actuel des frais Taira {#_4-claim-the-current-taira-fee-asset}

La réponse du robinet est la source de vérité pour la définition de l'actif des frais. Gardez la Base58 retournée ID au lieu de copier une ID d'un autre réseau ou d'une ancienne mise à jour.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Renseignez-vous au plus pendant une minute. Le robinet peut retourner `202 Accepted` avant que l'opération de financement ne soit visible.

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

`gas_asset_id` sont des métadonnées de transaction. La sélection explicite `--fee-payer authority` est liée à la signature, et le CLI obtient une cotation exacte avant qu'il ne signe.

## Vérifiez {#verify}

Envoyer une instruction de journal, conserver le reçu JSON et attendre la finalisation appliquée. L'émission `--no-wait` fait également que la soumission initiale attend la confirmation; la lecture explicite du statut prouve l'état final du pipeline.

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

La commande finale ne réussit qu'après que la transaction a atteint l'état terminal par défaut `Applied`. Gardez le hash dans les preuves de test; ne gardez jamais la clé privée ou la configuration complète du client avec elle.

## Résolution des problèmes {#troubleshooting}

- `/livez` renvoie `406` lorsqu'on lui demande JSON parce que ce point final est `text/plain`. Envoyez `Accept: text/plain` comme indiqué ci-dessus.
- `/health` ou `/readyz` peuvent retourner `503` avec un blocageur lisible par machine, même pendant que `/livez` et `/status` fonctionnent. Fixer ou attendre ce bloqueur; les touches de régénération ne changeront pas la préparation des nœuds.
- Un robinet `502`, un délai d'attente ou une ancre de preuve de travail obsolète est une défaillance des services publics.
- Une I105 l'erreur de préfixe signifie que la clé publique a été codée avec le mauvais profil. `iroha tools address convert --profile taira`.
- Un rejet d'une cotisation de redevance signifie généralement que l'autorité n'a pas été financée, que les métadonnées relatives aux actifs des redevances sont périmées ou qu'aucun payeur explicite de redevances n'a été sélectionné.
- L'enregistrement, le montage ou la gestion de l'espace de noms peuvent toujours être rejetés après que ce canary ait réussi. Ces opérations nécessitent des autorisations d'exécution distinctes; répétition sur le réseau local généré lorsque Taira n'a pas été accordé.

## Sources et documents connexes {#source-and-related-docs}

- [Taira CLI diagnostic et source canarienne à l'appui fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/taira.rs)
- [Sélection explicite des frais et source de soumission CLI à l'obligation fixée](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Guide du compte Taira et du robinet](/fr/get-started/sora-nexus-dataspaces.md)
- [Configuration du client ](/fr/guide/configure/client-configuration.md)
- [Les opérations ](/fr/blockchain/transactions.md)
