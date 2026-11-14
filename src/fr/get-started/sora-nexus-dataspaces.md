---
translation_locale: fr
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 3d2285e5a27819897b6dcc6d165c468baead29d2922420728fcfbe2433d36fdd
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Développer sur SORA Nexus : Taira et Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA Nexus fournit des environnements de déploiement publics fondés sur Iroha 3. Développez et répétez les opérations d'abord sur Taira, puis transférez la même structure de client vers Minamoto uniquement lorsque vous disposez de clés distinctes pour le mainnet, de vrais XOR pour les frais et de l'approbation de production.

Ce tutoriel explique comment configurer un client Iroha pour les réseaux publics SORA Nexus :

- Taira réseau de test à `https://taira.sora.org`
- Minamoto réseau principal à `https://minamoto.sora.org`

Utilisez Taira pour les tests d'intégration, les canaris d'écriture financés par le testnet et les répétitions de déploiement. Utilisez Minamoto uniquement pour les activités mainnet prêtes pour la production. Les deux réseaux facturent des frais en XOR :

- Taira utilise le testnet XOR du service public de financement du testnet.
- Minamoto utilise de vrais XOR. Il n'y a pas de service de financement testnet Minamoto.

## Chemin du constructeur {#builder-path}

|Étape| Taira Testnet                                                | Minamoto Réseau principal                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Commencer à lire l'état du réseau|Requête `/status` sans clés|Requête `/status` sans clés|
| Choisir un espace de données | Utilisez l'espace public `universal`, sauf si votre application exige une voie régie par la gouvernance | Utilisez le même espace de données uniquement après approbation pour le mainnet |
|Obtenir l'actif de frais|Utilisez le service public de financement du testnet Taira|Recevoir XOR d'un compte Minamoto financé ou d'un flux de trésorerie approuvé|
|Test écrit|Utilisez un test financé par le testnet XOR|Ne pas utiliser d'outils de test ; écrit des dépenses réelles XOR|
|Promouvoir|Gardez les nouvelles tentatives, la supervision et la gestion des signataires|Séparez les clés, les fonds et les contrôles de mise en production|

Le flux pratique est :

1. Développez le client pour Taira et utilisez l'espace de données public `universal`.
2. Ajoutez un signataire cryptographique et financez-le avec le service de financement du testnet Taira.
3. Exercez la logique de votre application contre Taira jusqu'à ce que les échecs deviennent ennuyeux et observables.
4. Créez un signataire cryptographique Minamoto séparé, financez-le avec de vrais XOR, et transférez seulement les mêmes opérations vérifiées vers le réseau principal.

## Continuer avec le livre de cuisine {#continue-with-the-cookbook}

Utilisez ce guide pour choisir un réseau, configurer un signataire cryptographique et financer les frais. Ensuite, continuez avec la recette qui correspond au comportement de l'application que vous souhaitez construire :

|But|Recette|
| --- | --- |
|Vérifiez Taira et configurez un client| [Connectez-vous à Taira](/fr/cookbook/connect-to-taira.md) |
|Envoyez une première écriture et vérifiez son résultat| [Soumettre et vérifier les transactions](/fr/cookbook/submit-and-verify-transactions.md) |
|Enregistrer, émettre et déplacer de la valeur| [Actifs fongibles](/fr/cookbook/fungible-assets.md) |
|Lire l'état de l'application filtré| [Interroger l'état du grand livre blockchain](/fr/cookbook/query-ledger-state.md) |
|Réagir aux modifications engagées| [Événements de streaming](/fr/cookbook/stream-events.md) |

Le livre de cuisine maintient chaque flux de travail concentré et renvoie ici lorsqu'il a besoin de financement Taira ou de contexte réseau SORA Nexus.

## 1. Comprendre ce que vous êtes en train de mettre en place {#_1-understand-what-you-are-setting-up}

Dans SORA Nexus, le catalogue des espaces de données définit les espaces de données. Le catalogue des voies définit les voies séparément : chaque voie référence un seul espace de données, et un espace de données peut contenir plusieurs voies. Un client ne crée pas un nouvel espace de données public simplement en modifiant `client.toml`. La configuration du client remplit deux fonctions :

1. dirige le client vers le bon point d'accès Torii
2. sélectionne le contexte réseau et la clé de signature de son compte canonique

`AccountId` est toujours canonique et dépourvu de domaine, et `client.toml` ne comporte aucun paramètre de domaine : `[account].profile` sélectionne uniquement le préfixe I105 du réseau. Le contexte de domaine appartient aux alias et aux objets détenus par le domaine. Pour la plupart des applications, commencez par l'espace de données public `universal`. Le contexte de domaine prend la forme `domain.dataspace`, par exemple :

```text
wonderland.universal
```

Si vous avez besoin d'un nouvel espace de données organisationnel, préparez une proposition de catalogue et de routage au lieu d'essayer de l'enregistrer depuis un compte client ordinaire. Consultez [Créer un nouvel espace de données](#_8-provision-a-new-data-space) ci-dessous.

## 2. Vérifier le point d’accès public Torii {#_2-check-the-public-torii-endpoint}

Vérifiez que le point d'accès cible fonctionne avant de configurer un signataire.

Pour Taira :

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Pour Minamoto :

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Inspectez la vue des espaces de données et des voies exposée par le nœud :

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Utilisez la même commande avec `https://minamoto.sora.org/status` pour le réseau principal.

## Taira MCP pour les agents {#taira-mcp-for-agents}

Taira expose également un pont Torii-native du protocole de contexte de modèle (MCP) pour les environnements d'exécution de logiciels d'agent. Utilisez-le lorsqu'un agent a besoin de lectures en direct sur le testnet, de diagnostics scriptés ou de répétitions d'écriture soigneusement examinées sans construire d'abord un client Torii personnalisé.

|Cadre|Valeur|
| --- | --- |
| Point d’accès MCP | `https://taira.sora.org/v1/mcp` |
|Racine du réseau| `https://taira.sora.org` |
|Usage prévu|Taira lectures sur le testnet et répétitions d'écriture financées par le testnet|
| Équivalent en production | Ne dirigez pas cette entrée vers Minamoto sans approbation explicite d'un point d'accès MCP du mainnet et des contrôles de version |

Le pont accepte uniquement des requêtes JSON-RPC `POST` sans état. Vérifiez ses métadonnées de découverte avant d'ajouter les éléments de signature :

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
```

Configurez le URL comme un serveur MCP local à l'utilisateur dans l'environnement d'exécution du logiciel agent. Ne validez pas la configuration MCP de l'agent, les jetons API, les en-têtes d'authentification transférés, `authority` ou les valeurs `private_key` dans ce dépôt de documentation ou dans un dépôt d'application.

Règles d'invite pour les agents qui fonctionnent bien avec Taira :

- Découvrez les outils du serveur MCP avant de les appeler ; redécouvrez-les si le serveur rapporte `listChanged`.
- Préférez les outils `iroha.*` sélectionnés aux outils `torii.*` bruts.
- Commencer en lecture seule : inspecter le statut, les comptes, les actifs, les alias, les blocs, l'état de la gouvernance et le statut des transactions avant de proposer des écritures.
- Exiger une instruction humaine explicite avant les modifications en direct sur le testnet. Pour les conteneurs de données de transaction pré-signées, utilisez `iroha.transactions.submit_and_wait` afin que l'agent attende le résultat au lieu de seulement soumettre.
- Résumez les hachages cryptographiques de la transaction, le statut final et les erreurs de validation du serveur dans la réponse de l'agent.

### Flux de travail de développement avec des agents {#development-workflow-with-agents}

Utilisez des agents comme assistants de développement pour les clients Iroha, les constructeurs de transactions, les scripts de diagnostic et les manuels de testnet. Maintenez le principe d'autorisation de l'agent limité : il peut inspecter le code, lire l'état Taira, proposer des changements et exécuter des tests locaux, mais il ne doit pas modifier un réseau en direct avant qu'un humain n'approuve l'opération exacte.

Un flux de travail pratique est :

1. Demandez à l'agent d'inspecter les documents pertinents, le code SDK, la commande CLI ou le schéma de l'outil MCP avant qu'il n'écrive du code.
2. Faites en sorte que l'agent écrive d'abord le chemin client le plus petit : vérification du statut, recherche de compte, résolution d'alias ou consultation du solde.
3. Ajoutez le code de construction de transaction uniquement après que les appels en lecture seule fonctionnent avec Taira.
4. Gardez les tests en direct sur le réseau sur option, par exemple derrière `TAIRA_LIVE=1`, afin qu'une exécution normale des tests unitaires ne dépense jamais de fonds de testnet ni ne dépende de la disponibilité du réseau.
5. Exiger que l'agent communique la racine du réseau, la chaîne, le compte principal d'autorisation, le résumé des instructions, l'actif des frais et le changement d'état attendu avant de soumettre toute transaction.
6. Examinez le code généré pour la gestion des secrets, le comportement de réessai, l'idempotence et la gestion des rejets avant de le promouvoir vers CI ou les workflows mainnet.

Les outils utiles en lecture seule MCP pour le développement comprennent les recherches d'actifs de compte, la résolution d'alias, la recherche de blocs, la recherche de transactions, les listes de transactions et les vérifications de l'état du pipeline de traitement. Utilisez-les pour acquérir de la confiance avant de soumettre toute charge utile signée.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Flux de transactions via les agents {#transaction-workflow-through-agents}

Le pont MCP peut soumettre une transaction Iroha signée, mais il ne supprime pas les exigences normales de transaction. Une transaction nécessite toujours un principal d'autorisation correct, des permissions, le financement des frais, un ID de chaîne, des métadonnées et une signature.

Pour les transactions Iroha brutes, construisez et signez d’abord l’enveloppe de transaction avec un SDK ou la CLI. Ne donnez à l’agent que les octets canoniques de la transaction signée, encodés dans `body_base64`. L’agent peut soumettre l’enveloppe avec `iroha.transactions.submit_and_wait`, ou utiliser `iroha.transactions.submit` puis consulter son état avec `iroha.transactions.wait`.

Ne collez pas de clés privées dans l’invite d’un agent. Si un agent doit construire une transaction, orientez-le vers du code local qui charge les secrets depuis l’environnement d’exécution de l’utilisateur, le trousseau, un signataire matériel ou un fichier de configuration de testnet ignoré. L’agent ne doit jamais écrire les clés dans Markdown, les artefacts de test, les journaux ou les commits.

Avant de soumettre une transaction, faites en sorte que l'agent produise un court plan de transaction :

- `network` : racine du réseau de test Taira et ID de chaîne
- `authority` : compte qui signe et paie les frais
- `instructions` : enregistrement, émission, gravure, transfert, métadonnées, autorisation ou résumé d'appel de contrat
- `fee asset` : actif qui sera facturé sur Taira
- `preflight reads` : compte, solde des actifs, autorisations, alias ou vérifications de bloc déjà effectués
- `expected result` : l'état qui devrait être visible après confirmation
- `idempotency` : que se passe-t-il si la même demande est réessayée

Après la soumission, faites attendre l'agent jusqu'à ce qu'un état terminal soit atteint, puis vérifiez le changement d'état avec une requête de lecture. Un rapport de finalisation utile inclut :

- hachage cryptographique de transaction
- statut du terminal tel que `Committed`, `Applied`, `Rejected` ou `Expired`
- détails du bloc ou de l'explorateur lorsqu'ils sont disponibles
- résultats de lecture de vérification
- message de rejet et indication de la cause apparente : permissions, frais, validation, état périmé ou disponibilité du point d'accès

Exemple de prompt protégé :

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Lorsque le conteneur de données signé est déjà préparé :

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Traitez Taira MCP comme une surface de contrôle du testnet public. Les clés Taira, le testnet XOR, les comptes de service de financement du testnet et les signataires cryptographiques canari sont jetables et doivent rester séparés des clés Minamoto et des workflows de publication en production.

## Exemples de jouets que vous pouvez essayer maintenant {#toy-examples-you-can-try-now}

Ces exemples sont en lecture seule sauf indication contraire. Ils fonctionnent avant que vous ne génériez des clés et sont sûrs à exécuter sur les réseaux publics.

Comparer la santé du testnet Taira et du mainnet Minamoto :

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Listez les voies de l'espace de données public exposées par Taira :

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Exécutez la même commande sur Minamoto lorsque vous avez besoin de la vue mainnet :

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Construisez une petite sonde de statut Node.js pour un tableau de bord, un bot ou une vérification de déploiement :

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
EOF
```

Le premier jouet côté écriture devrait être une réclamation de service de financement du testnet Taira. Il utilise le XOR du testnet et ne devrait jamais être dirigé vers Minamoto.

## 3. Créer une configuration client Taira {#_3-create-a-taira-client-config}

Générez une paire de clés si vous n'en avez pas déjà une :

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

Créer `taira.client.toml` :

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Le paramètre racine `chain` est l'identifiant exact de chaîne des transactions Taira, et `network_id` est l'identité réseau exacte à laquelle chaque signature est liée. Configurez exactement l'un des paramètres `network_id` ou `network_id_file`. Le paramètre `[account].profile = "taira"` sélectionne indépendamment le discriminant de chaîne I105 de Taira. L'identifiant de chaîne ne sélectionne pas le profil du compte.

Exécuter une vérification en lecture seule :

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Exécutez les diagnostics publics Taira avant les tests d'écriture :

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Alimentez le compte Taira via le faucet avant d'effectuer des écritures soumises à des frais. La procédure de faucet est décrite dans [Obtenir des XOR de test sur Taira](#_4-get-testnet-xor-on-taira).

Une fois le compte alimenté, une instruction de journalisation signée permet un test d'écriture élémentaire facultatif. Chaque transaction soumise nomme son payeur de frais, et la CLI calcule les frais exacts avant la signature :

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

La commande attend une confirmation. Taira est un testnet public : une file saturée peut faire échouer le ping même si le faucet fonctionne. Si `taira doctor` signale une file saturée ou si le ping renvoie `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, attendez et réessayez avant d'y voir une erreur de configuration du client.

Pour des tests élémentaires sans surveillance, placez le ping dans une boucle de nouvelles tentatives bornée :

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

Arrêtez de réessayer si `iroha taira doctor` affiche des échecs critiques. La saturation de la file d'attente et les refus d'admission pour frais sont des conditions transitoires du testnet public ; les diagnostics DNS, TLS ou `status = "fail"` ne le sont pas.

## Générer un identifiant de compte SORA Nexus {#generate-a-sora-nexus-account-id}

Un identifiant de compte SORA Nexus est une adresse I105 canonique dérivée de la clé publique du compte et du préfixe réseau cible. La même clé publique s'encode en identifiants différents sur Taira et Minamoto ; les utilisateurs de production doivent générer une paire de clés distincte pour Minamoto.

Générez ou chargez la paire de clés Ed25519 qui contrôlera le compte :

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

Convertissez la clé publique en un identifiant de compte Taira :

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Convertir une clé publique Minamoto avec le préfixe mainnet :

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Utilisez l'identifiant obtenu partout où une API ou une commande CLI SORA Nexus demande un identifiant de compte canonique, par exemple pour les requêtes de solde, les champs de compte stricts ou les liaisons d'alias. Conservez la clé privée correspondante dans la configuration client et sélectionnez le même réseau public avec `[account].profile = "taira"` ou `[account].profile = "minamoto"`.

Générer l'identifiant ne crée pas à lui seul un compte financé sur la blockchain. Sur Taira, le service de financement du testnet peut créer et financer le compte pour les écritures sur le testnet. Sur Minamoto, utilisez un processus d'intégration ou de trésorerie approuvé sur le mainnet.

### Stockage et sauvegarde des clés {#key-storage-and-backup}

L'identifiant du compte et la clé publique peuvent être partagés. La clé privée correspondante, la phrase secrète, la graine et le matériel de récupération doivent être considérés comme secrets.

Utilisez ces pratiques pour les comptes SORA Nexus :

- Stockez les clés privées dans un gestionnaire de mots de passe chiffré, un magasin de clés sécurisé par matériel ou un service de signature dédié. Ne commettez pas les clés dans le contrôle de version et ne laissez pas les clés de production dans l'historique du shell, les journaux, les discussions, les tickets ou les sauvegardes non chiffrées.
- Utilisez une phrase de passe unique à haute entropie pour chaque coffre ou signataire cryptographique de production. Stockez les phrases de passe dans un gestionnaire de mots de passe ou par un processus de garde partagée, pas dans le même fichier ou bundle de sauvegarde que la clé privée chiffrée.
- Gardez les clés Taira et Minamoto séparées. Considérez les clés Taira comme du matériel testnet jetable et les clés Minamoto comme le principal d'autorisation des fonds de production.
- Sauvegardez la clé privée, la clé publique, l'identifiant de compte, le profil de compte, ainsi que toutes les notes de récupération ou de garde de compte nécessaires pour restaurer le signataire cryptographique. Une clé privée sans le contexte du réseau est facile à mal utiliser lors de la récupération.
- Conservez au moins une sauvegarde chiffrée hors ligne et une sauvegarde chiffrée géographiquement séparée pour les signataires cryptographiques de production. Testez la récupération avec une petite opération en lecture seule avant de compter sur la sauvegarde.
- Faites pivoter ou remplacez un signataire cryptographique si la clé privée, la phrase de passe, le support de sauvegarde ou l'hôte de signature ont pu être exposés.

Pour plus de détails, voir [Stockage des clés cryptographiques](/fr/guide/security/storing-cryptographic-keys.md) et [Sécurité des mots de passe](/fr/guide/security/password-security.md).

## 4. Obtenez Testnet XOR sur Taira {#_4-get-testnet-xor-on-taira}

Demandez des XOR de test avec la procédure de faucet de la CLI. Le faucet alimente le compte configuré dans `taira.client.toml` et l'enregistre d'abord s'il n'existe pas encore. La procédure est la suivante :

1. Lisez la politique publique du faucet : son autorité, l'actif de frais et le montant.
2. Préparez la demande. La CLI résout la preuve de travail, vérifie la transaction exacte préparée et signée par Torii, puis l'enregistre dans un répertoire de journal privé sans la soumettre.
3. Soumettez une seule fois la transaction enregistrée.
4. Attendez que le solde de l'actif soit visible avant d'envoyer des écritures soumises à des frais.

Lisez la politique :

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

La réponse a cette forme :

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

La politique est une donnée de découverte non signée. L'automatisation doit fixer l'autorité, la définition d'actif et le montant attendus, au lieu de faire confiance à chaque réponse. `prepare` refuse une transaction préparée qui diffère des valeurs fournies.

Préparez et soumettez la demande :

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` crée le répertoire de journal avec un accès privé et refuse de remplacer un répertoire existant ; utilisez donc un nouveau répertoire pour chaque demande. Le faucet est un service du testnet public. Si `submit` signale `Pending`, dépasse le délai d'attente ou reçoit `502`, exécutez `taira account faucet resume` avec la même configuration et le même journal au lieu de préparer une nouvelle demande. Un ancrage de preuve de travail périmé fait échouer `prepare` ; recommencez la préparation dans un nouveau répertoire de journal.

Ensuite, interrogez l'actif financé avant de soumettre vos propres transactions payantes :

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Si la demande a été appliquée mais que l'actif n'est pas encore visible, attendez et répétez la lecture avant d'envoyer des écritures.

Le distributeur fournit uniquement des fonds pour le réseau de test Taira. N’utilisez ni le XOR de test, ni les comptes du distributeur, ni les signataires canaris Taira dans les flux Minamoto.

## 5. Créer une configuration client Minamoto {#_5-create-a-minamoto-client-config}

Utilisez une paire de clés séparée pour Minamoto. Ne réutilisez pas les clés Taira pour le mainnet.

Créer `minamoto.client.toml` :

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Le paramètre racine `chain` est l'identifiant actuel de chaîne du mainnet SORA Nexus, et `network_id` est l'identité réseau exacte de Minamoto ; lisez-la sur la route des capacités avant la première opération signée. `[account].profile = "minamoto"` sélectionne le discriminant de chaîne I105 de Minamoto ; ni le nom d'hôte du point d'accès ni l'identifiant de chaîne ne le sélectionnent implicitement.

Convertir une clé publique Minamoto en son identifiant de compte canonique I105 avec le préfixe du réseau principal :

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Exécutez uniquement des vérifications côté lecture jusqu'à ce que le compte soit approvisionné et financé via le processus d'intégration au mainnet ou le flux de gouvernance :

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

N'exécutez pas sur Minamoto les commandes de faucet ou de tests élémentaires de Taira.

## 6. Financer un compte Minamoto avec XOR {#_6-fund-a-minamoto-account-with-xor}

Les frais de Minamoto sont payés en XOR de production, et Minamoto ne dispose d’aucun service public de financement. Financez le compte configuré au moyen d’une procédure d’admission approuvée sur le réseau principal ou d’un transfert de trésorerie, ou recevez des XOR d’un compte Minamoto déjà financé.

Vérifiez l'identifiant de compte canonique et le financement avec des vérifications en lecture seule avant de soumettre une écriture. Traitez Minamoto XOR comme des fonds de production : répétez d'abord la même opération sur Taira, conservez des clés de production séparées et ne supposez pas qu'une transaction sur le réseau principal puisse être réinitialisée.

Le XOR de Taira ne peut pas payer les frais de Minamoto. Les soldes et demandes de fonds du réseau de test ne sont pas transférés vers Minamoto.

## 7. Travailler dans un espace de données existant {#_7-work-inside-an-existing-data-space}

Utilisez des noms de domaine pleinement qualifiés pour les objets du registre situés dans un espace de données. Par exemple, un domaine de projet dans l'espace de données public doit utiliser :

```text
apps.universal
```

Après que votre compte dispose des autorisations requises, créez une intention `AliasSetupPlanRequestV1` sans secret pour le domaine et utilisez le planificateur déclaratif :

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Pour Minamoto, générez et approuvez une intention et un plan mainnet séparés. Les plans sont liés à leur chaîne, au principal d'autorisation, à l'ancre de l'état vivant et à la date limite, donc un plan Taira ne peut pas être promu ou rejoué :

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Les alias de comptes utilisent le même suffixe d'espace de données :

```text
alice@apps.universal
alice@universal
```

Les champs de compte stricts utilisent toujours des identifiants de compte canoniques I105. Considérez les alias comme des liaisons lisibles par l'homme qui se résolvent en identifiants de compte canoniques.

## 8. Créer un nouvel espace de données {#_8-provision-a-new-data-space}

La création d'un espace de données est une modification relevant des opérateurs et de la gouvernance. Le point d'accès public Torii peut acheminer le trafic vers les espaces de données configurés, mais rejette les alias d'espaces de données inconnus.

Avant de préparer un changement, capturez le catalogue en production actuel :

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Pour un compte opérateur, vérifiez également la posture du manifeste technique de la voie d'exécution :

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Ne mettez pas un nouvel alias en service avant l'examen conjoint de l'identifiant de voie, de l'identifiant d'espace de données, de l'ensemble de validateurs, de la tolérance aux défaillances, du manifeste, des règles de routage et du responsable opérationnel. Un compte utilisateur ordinaire doté des permissions nécessaires peut acquérir un domaine et son bail SNS dans un espace de données existant via le planificateur d'alias ; il ne peut pas ajouter de manière sûre un nouvel espace de données public.

Pour un espace de données privé ou organisationnel, préparez une modification de catalogue comprenant :

- un alias unique d'espace de données et un `id` numérique
- une entrée de voie d'exécution correspondante ou une affectation de voie d'exécution existante
- le paramètre `fault_tolerance` de l'espace de données
- règles de routage pour les instructions ou les portées de compte qui devraient y atterrir
- un manifeste du répertoire des espaces ou une preuve équivalente du déploiement progressif, lorsque l'espace de données expose des capacités UAID
- approbation de la gouvernance pour la politique de validateur, de conformité, de règlement et de suivi

Un fragment de configuration révisable ressemble à ceci :

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
instruction = "transfer::asset"
description = "Route asset transfers to the payments dataspace"
```

L'acceptation par l'opérateur devrait inclure ces étapes :

- `iroha3d --sora --config <config.toml> --trace-config` transmet la configuration du nœud résolue
- le manifeste technique généré ou examiné est archivé avec des hachages cryptographiques et des signatures
- les tests de fumée passent sur Taira avant toute promotion Minamoto
- le catalogue `/status` après modification montre la voie et l'espace de données prévus
- `iroha app nexus lane-report --summary` ne signale pas les manifestes techniques requis manquants

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Ne déployez le même espace de données sur Minamoto qu'une fois terminés le déploiement Taira, les tests élémentaires, la surveillance et les preuves de gouvernance.

## Pages liées {#related-pages}

- [Installer Iroha 3](/fr/get-started/install-iroha.md)
- [Faire fonctionner Iroha 3 via CLI](/fr/get-started/operate-iroha-via-cli.md)
- [Prendre en charge les frais d’un espace de données privé](/fr/get-started/private-dataspace-fee-sponsor.md)
- [Points d’accès Torii](/fr/reference/torii-endpoints.md)
- [référence de genèse de la blockchain](/fr/reference/genesis.md)
