---
translation_locale: fr
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 9391bab95aa0ee20c7f036cc175f3a6d3a8852e6ea90b09d9ebf1a838973c765
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Opérer Iroha 3 par le biais CLI {#operate-iroha-3-via-cli}

Les `iroha` binary est le client de ligne de commande pour Iroha 3. Utilisez-le pour la requête
l'état du registre, la soumission des transactions et l'inspection des points finaux de l'opérateur.

## 1. Les prérequis {#_1-prerequisites}

Démarrer un réseau local d'abord:

- [Lancement Iroha 3](./launch-iroha.md)

Les exemples ci-dessous supposent la configuration du client générée à partir du localnet
créée en [Lancement Iroha 3](./launch-iroha.md):

```bash
./localnet/client.toml
```

## 2. Fondamentaux CLI Mise en place {#_2-basic-cli-setup}

Montrez l'aide de haut niveau:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

Les CLI est organisé en ces groupes de commandes de haut niveau:

- `account` pour les raccourcis axés sur le compte
- `tx` pour les assistants au niveau des transactions
- `ledger` pour les personnes qui lisent et écrivent
- `ops` pour les diagnostics des opérateurs
- `app` pour l'application API les aides
- `contract` pour le déploiement des contrats et les appels
- `tools` pour les services de diagnostic et de développement
- `taira` pour Taira et Nexus- les flux de travail orientés

Les `ledger` Le groupe contient également des aides à la transaction spécifiques aux domaines tels que
`ledger transaction`.

Utilisation `--output-format text` pour la sortie de l'opérateur lisible par l'homme et `--machine`
pour le mode d'automatisation strict.

## 3. Essayez le public Taira Réseau de test {#_3-try-the-public-taira-testnet}

Tu peux essayer de lire seulement Taira vérifier avant d'exécuter une comparaison locale ou de créer un
Ces commandes utilisent public Torii JSON les itinéraires et ne pas dépenser testnet
XOR.

Vérifiez Taira la santé:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Liste des domaines publics dans le `universal` espace de données:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Lisez quelques définitions d'actifs et leur offre actuelle:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Si vous avez le courant `iroha` binaire, faire fonctionner le Taira assistant de diagnostic:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Créer `taira.client.toml` seulement quand vous êtes prêt à tester les commandes signées.
Vous voyez ? [Connectez-vous SORA Nexus Les bases de données](/fr/get-started/sora-nexus-dataspaces.md)
pour le config, le robinet et le flux canarien.
Taira jusqu'à ce que le compte soit financé par l'actif des frais de robinet.

Pour tout paiement de frais Taira CLI par exemple, sauver l'aide au robinet de
[Prenez le testnet XOR sur le Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
comme `taira_faucet_claim.py`, puis demande testnet XOR Tout d'abord:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Si le puzzle du robinet ou la route de réclamation revient `502`, Attends et réessaye.
problème de disponibilité du testnet public, pas un signal pour régénérer les clés du compte.

Une fois que le solde est visible, joindre les métadonnées de l'actif des frais pour écrire:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Les commandes de base du registre {#_4-basic-ledger-commands}

Liste des domaines:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

La création de domaine ordinaire utilise le planificateur d'alias déclaratif; `ledger
domain` le commandement n' a pas `register` Préparez un commandement sans secret.
`AliasSetupPlanRequestV1` l'intention `docs.universal` avec votre SDK ou
le service d'intégration, puis planifier et l'appliquer:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

L'intention pin l'espace de données ID, compte du propriétaire canonique, terme de location et
Le planificateur vérifie l'état en direct et renvoie le
nucléaire `EnsureAlias` Ne pas copier manuellement les valeurs de garde d'un autre
le réseau.

Envoyez une simple transaction de ping:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Lisez un bloc récent ou abonnez-vous aux événements de blocage:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Commandes de l'opérateur {#_5-operator-commands}

Statut du consensus:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

Récapitulatif de latence par phase:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

Disponibilité, collecteur, RBC l'arrière-plan, et VRF une photo instantanée

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

Paramètres de consensus en chaîne:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. Où aller ensuite? {#_6-where-to-go-next}

- [SDK Les tutoriels](/fr/guide/tutorials/)
- [Torii points de fin](/fr/reference/torii-endpoints.md)
- [Travailler avec Iroha à binaries](/fr/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Pour régénérer une capture d'écran de l'aide Markdown complète à partir du guichet source, exécutez:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
