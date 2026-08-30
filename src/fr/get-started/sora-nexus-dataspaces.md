---
translation_locale: fr
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# S' appuyer sur SORA 3: Taira et Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 est la piste de déploiement public face à l'application construite sur Iroha 3 et SORA Nexus. Construisez et répétissez d'abord sur Taira, puis déplacez la même forme client vers Minamoto uniquement lorsque vous avez des clés mainnet distinctes, réelles XOR pour les frais et l'approbation de la production.

Ce didacticiel montre comment configurer un client Iroha pour les réseaux publics SORA 3:

- Réseau d'essai Taira à `https://taira.sora.org`
- Réseau principal Minamoto à `https://minamoto.sora.org`

Utilisez Taira pour les essais d'intégration, les canaries d'écriture financées par le robinet et les répétitions de déploiement. Utiliser Minamoto uniquement pour l'activité mainnet prête à la production. Les deux réseaux facturent des frais en XOR:

- Taira utilise le réseau d'essai XOR du robinet public.
- Minamoto utilise un véritable XOR. Il n'y a pas de robinet Minamoto.

## Le chemin du constructeur {#builder-path}

|Passe |Taira Testnet | Minamoto Réservations                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Commencez à lire l' état du réseau |Recherche `/status` sans clés |Recherche `/status` sans clés |
|Choisissez un espace de données |Utilisez public `universal` à moins que votre application n'ait besoin d'une voie contrôlée |Utilisez le même espace de données uniquement après l' approbation du mainnet |
|Obtenez des droits d' action .|Utilisez le robinet public Taira |Recevoir XOR d' un compte Minamoto financé ou d' un flux de trésorerie approuvé |
|Test écrit |Utilisation de l'essai financé par robinet XOR |N'utilisez pas d'outillage de test; écrites dépenser réel XOR |
|Promouvoir |Continuez à réessayer la logique, le suivi et le traitement des signatures |Utilisez des clés séparées, des contrôles de financement et de libération |

Le flux pratique est le suivant:

1. Construire le client contre Taira et utiliser l'espace public de données `universal`.
2. Ajouter un signataire et le financer avec le robinet Taira.
3. Exercez votre logique de l'application contre Taira jusqu'à ce que les défaillances soient ennuyeuses et observables.
4. Créer un signataire séparé Minamoto, le financer avec réel XOR, et déplacer uniquement les mêmes opérations éprouvées sur mainnet.

## Continuez avec le manuel de cuisine {#continue-with-the-cookbook}

Utilisez ce guide pour choisir un réseau, configurer un signataire et payer des frais. Ensuite, continuez avec la recette qui correspond au comportement de l'application que vous souhaitez créer:

|Objectif |La recette |
| --- | --- |
|Vérifiez Taira et configurez un client | [Connectez-vous à Taira](/fr/cookbook/connect-to-taira.md) |
|Envoyez une première écriture et vérifiez son résultat | [Envoyer et vérifier les transactions ](/fr/cookbook/submit-and-verify-transactions.md) |
|Enregistrement, monnaie et valeur de déplacement | [Les actifs fonciers](/fr/cookbook/fungible-assets.md) |
|Lire l' état de la demande filtrée | [L'état du registre de requêtes ](/fr/cookbook/query-ledger-state.md) |
|Réagir aux changements engagés | [Événements de flux](/fr/cookbook/stream-events.md) |

Le manuel de cuisine maintient chaque flux de travail concentré et renvoie les liens ici lorsqu'il a besoin d'un financement Taira ou d'un contexte réseau SORA Nexus.

## 1. Comprenez ce que vous voulez faire {#_1-understand-what-you-are-setting-up}

Dans SORA Nexus, un espace de données fait partie du catalogue de la voie réseau et du routage. Un client ne crée pas un nouveau espace public de données simplement en modifiant `client.toml`.

1. Points du client à la droite Torii point final
2. Sélectionne le contexte de routage du domaine et de l'espace de données pour son compte canonique

`AccountId` est toujours canonique et sans domaine. La valeur `[account].domain` dans `client.toml` fournit un contexte de routage et d'alias; elle ne fait pas partie de l'identité du compte. Pour la plupart des applications, commencez par l'espace de données public `universal`. Le contexte de domaine utilise le formulaire `domain.dataspace`, par exemple:

```text
wonderland.universal
```

Si vous avez besoin d'un nouvel espace de données organisationnel, préparez un catalogue et une proposition de routage au lieu d'essayer de l'enregistrer à partir d'un compte client ordinaire. Voir [Provision a New Dataspace ](#_8-provision-a-new-dataspace) ci-dessous.

## 2. Vérifiez le point final public Torii {#_2-check-the-public-torii-endpoint}

Vérifiez que le point final cible est en direct avant de configurer un signataire.

Pour Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Pour Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Inspecter l'espace de données et la vue des voies exposées par le nœud:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Utilisez la même commande que `https://minamoto.sora.org/status` pour le mainnet.

## Taira MCP pour les agents {#taira-mcp-for-agents}

Taira expose également un Torii-native Model Context Protocol (MCP) pont pour les temps d'exécution de l'agent. Utilisez-le lorsqu'un agent a besoin des lectures en direct du testnet, des diagnostics scriptés ou des répétitions d'écriture étroitement examinées sans construire d'abord un client personnalisé Torii.

|Définition |La valeur |
| --- | --- |
|MCP point final |`https://taira.sora.org/v1/mcp` |
|Root réseau |`https://taira.sora.org` |
|Utilisation prévue |Taira testnet de lecture et des répétitions d'écriture financées par les robinets |
|L' équivalent de production |N'indiquez pas cette entrée à Minamoto sauf si un point d'extrémité du réseau principal MCP et les contrôles de dégagement sont expressément approuvés |

Vérifiez les métadonnées du pont avant d'ajouter un matériau de signature:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

Configurer le URL en tant qu'utilisateur local MCP Serveur en temps d'exécution de l'agent. MCP config, API des jetons, des en-têtes d'auteur transmises, `authority`, ou `private_key` les valeurs dans ce repo de documents ou dans un repo d'application.

Règles d'intervention de l'agent qui fonctionnent bien avec Taira:

- Découvrez les outils du serveur MCP avant de les appeler; découvrez à nouveau si le serveur rapporte `listChanged`.
- Les outils `iroha.` sélectionnés sont préférables aux outils bruts `torii.`.
- Commencez à lire uniquement: inspectez le statut, les comptes, les actifs, les aliases, les blocs, l'état de gouvernance et le statut des transactions avant de proposer des écritures.
- Requérir une instruction humaine explicite avant les mutations du réseau test vivant. Pour les enveloppes de transaction pré-signées, utilisez `iroha.transactions.submit_and_wait` afin que l'agent attend le résultat au lieu de ne pas simplement soumettre.
- Résumez les hashes de transaction, l'état final et les erreurs de validation du serveur dans la réponse de l'agent.

### Flux de travail en développement avec les agents {#development-workflow-with-agents}

Utilisez des agents comme auxiliaires de développement pour les clients Iroha, les constructeurs de transactions, les scripts diagnostiques et les manuels d'exécution du testnet. Il peut inspecter le code, lire l'état de Taira, proposer des modifications et exécuter des tests locaux, mais il ne doit pas muter un réseau en direct tant qu'un humain n'approuve pas l'opération exacte.

Un flux de travail pratique est:

1. Demandez à l'agent d'inspecter les documents pertinents, le code SDK, la commande CLI ou le schéma de l'outil MCP avant qu'il n'écrive du code.
2. Demandez à l'agent d'écrire d'abord le plus petit chemin client: vérification de statut, recherche de compte, résolution alias ou recherche de solde.
3. Ajouter un code de construction des transactions uniquement après que les appels à lecture seule aient fonctionné contre Taira.
4. Garder l'opt-in des tests de réseau en direct, par exemple derrière `TAIRA_LIVE=1`, afin qu'une opération normale d'essai unitaire ne dépense jamais les fonds du testnet ou dépend de la disponibilité du réseau.
5. Exiger de l'agent qu'il rapporte la racine du réseau, la chaîne, le compte d'autorité, le résumé des instructions, l'actif des frais et les modifications attendues de l'état avant de soumettre une transaction.
6. Examinez le code généré pour la manipulation secrète, le comportement de réessayer, l'idempotence et la manipulation du rejet avant de le promouvoir dans CI ou les flux de travail mainnet.

Les outils utiles MCP pour le développement comprennent les recherches d'actifs de compte, la résolution des alias, la recherche de blocs, la recherche des transactions, les listes de transactions et les vérifications de l'état du pipeline.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Flux de travail des transactions par l'intermédiaire des agents {#transaction-workflow-through-agents}

Les États membres MCP bridge peut soumettre une lettre signée Iroha la transaction, mais elle ne supprime pas les exigences normales en matière de transaction. Une transaction a encore besoin d'une autorité correcte, des autorisations, du financement des frais, de la chaîne ID, Les métadonnées et la signature

Pour le brut Iroha les transactions, construire et signer l'enveloppe de transaction avec une SDK ou CLI d'abord, donnez ensuite à l'agent seulement les octets de transaction canoniques signés codés comme `body_base64`. L' agent peut soumettre l' enveloppe avec `iroha.transactions.submit_and_wait`, ou soumettre avec `iroha.transactions.submit` et les sondages avec `iroha.transactions.wait`.

Ne pas coller des clés privées dans une demande d'agent. Si un agent a besoin de construire une transaction, appuyez-la sur le code local qui charge les secrets du temps d'exécution de l'utilisateur L'agent ne devrait jamais écrire le matériel clé dans Markdown, fixtures, journaux ou commits.

Avant de soumettre une transaction, demandez à l'agent d'élaborer un court plan de transaction:

- `network`: Taira la racine et la chaîne du réseau de test ID
- `authority`: compte signataire et payeur de frais
- `instructions`: répertoire, ébauche, combustion, transfert, métadonnées, autorisation ou résumé de l'appel d'offres
- `fee asset`: actif qui sera facturé sur Taira
- `preflight reads`: vérifications de compte, de solde d'actifs, d'autorisations, d'alias ou de blocs déjà effectuées
- `expected result`: l'état qui doit être visible après confirmation
- `idempotency`: ce qui se passe si la même demande est réexaminée

Après soumission, laissez l'agent attendre un état terminal, puis vérifiez le changement d'état avec une requête de lecture.

- hash de transaction
- l'état du terminal tel que `Committed`, `Applied`, `Rejected` ou `Expired`
- les détails du bloc ou de l'explorateur, lorsqu'ils sont disponibles
- résultats de la lecture des vérifications
- message de rejet et si le défaut ressemble à des autorisations, des frais, une validation, un état obsolète ou la disponibilité d'un point final.

Exemple de mise en garde rapide:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Lorsque l'enveloppe signée est déjà préparée:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Traiter Taira MCP comme une surface de contrôle du réseau d'essai publique. Les touches Taira, le réseau d'essais XOR, les comptes des robinets et les signatures canaries sont jetables et doivent rester séparées des touches Minamoto et des flux de travail de libération de la production.

## Des exemples de jouets que vous pouvez essayer {#toy-examples-you-can-try-now}

Ces exemples sont à lire uniquement, sauf mention. Ils fonctionnent avant que vous génériez des clés et peuvent être utilisés en toute sécurité contre les deux réseaux publics.

Comparer la santé du réseau de test Taira et celle du réseau principal Minamoto:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Liste des voies de l'espace de données public exposées par Taira:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Exécutez la même commande contre Minamoto lorsque vous avez besoin de l'affichage mainnet:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Construisez une petite sonde d'état Node.js pour un tableau de bord, un bot ou une vérification du déploiement:

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

Le premier jouet à côté de l'écriture doit être une demande de robinet Taira. Il utilise un réseau d'essai XOR et ne doit jamais être indiqué sur Minamoto.

## 3. Créer une configuration de client Taira {#_3-create-a-taira-client-config}

Générer une paire de clés si vous n'en avez pas déjà:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

Créer `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Le plus haut niveau `chain` est l' exact Taira la chaîne de transactions ID. Les États membres `[account].profile = "taira"` l'établissement sélectionne indépendamment le Taira I105 discriminant de la chaîne. ID ne sélectionne pas le profil du compte.

Exécutez une vérification en lecture seulement:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Exécuter le diagnostic public Taira avant d'écrire des tests:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Financer le Taira compte à travers le robinet avant d'exécuter des frais de paiement écrites. [Prenez le testnet XOR sur le Taira](#_4-get-testnet-xor-on-taira).

Après l'acceptation de la demande du robinet et le financement du compte, le canary Taira est un test de fumée d'écriture facultatif:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Le canary soumet un ping signé, attend la confirmation, et écrit la configuration du signataire de l'exécution quand `--write-config` est fournie. Taira est un réseau de test public, donc la saturation de file d'attente peut faire échouer le ping signé même lorsque le robinet lui-même fonctionne. `taira doctor` rapporte une file d'attente saturée ou les retours des canaries `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, attendre et réessayer avant de le traiter comme une erreur de configuration du client.

Pour les essais de fumée non surveillés, enveloppez le canary dans une boucle de réessai limitée:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

Arrêtez de réessayer si `iroha taira doctor` montre des défaillances graves. La saturation de la file d'attente et le rejet des frais d'admission sont des conditions transitoires du réseau public de test; les diagnostics DNS, TLS ou `status = "fail"` ne le sont pas.

## Générer un compte SORA Nexus ID {#generate-a-sora-nexus-account-id}

Un compte SORA Nexus ID est une adresse canonique I105 dérivée de la clé publique du compte et du préfixe réseau cible. Il ne s'agit pas de la valeur `[account].domain` en client TOML. Les mêmes clés publiques codent différentes IDs sur Taira et Minamoto, et les utilisateurs de production devraient générer une paire de clés séparée pour Minamoto.

Générer ou charger la paire de touches Ed25519 qui va contrôler le compte:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

Convertir la clé publique en un compte Taira ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Convertir une clé publique Minamoto avec le préfixe de réseau principal:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Utilisez le compte résultant ID partout où une Nexus API ou CLI Le commandement demande un compte canonique. ID, Par exemple, le Taira robinet `account_id`, les requêtes d'équilibre, les champs de compte stricts ou les liaisons par alias. clé privée dans votre configuration client, et sélectionnez le même réseau public avec `[account].profile = "taira"` ou `[account].profile = "minamoto"`.

La génération de ID ne crée pas elle-même un compte en chaîne financé. Sur Taira, le robinet peut créer et financer le compte pour les écrits testnet. sur Minamoto, utilisez une connexion principale approuvée ou un flux de trésorerie.

### Le stockage et la sauvegarde des clés {#key-storage-and-backup}

Le compte ID et la clé publique peuvent être partagés. La clé privée correspondante, le mot de passe, les graines et le matériel de récupération doivent être traités comme secrets.

Utilisez ces pratiques pour les comptes SORA Nexus:

- Conservez les clés privées dans un gestionnaire de mots de passe crypté, un keystore supporté par le matériel ou un service de signature dédié. N'engagez pas les clés au contrôle des sources ni ne laissez les clés de production dans l'historique du shell, les journaux, le chat, les billets ou les sauvegardes non cryptées.
- Utilisez un mot de passe unique à haute entropie pour chaque caisse ou signataire de production. stocker des mots de passe dans un gestionnaire de mots de passe ou un processus de conservation partagé, n'est pas dans le même fichier ou ensemble de sauvegarde que la clé privée cryptée.
- Je le garde. Taira et Minamoto Les clés séparées. Taira les clés en tant que matériau d'essai jetable et Minamoto les clés en tant qu'autorité des fonds de production.
- Faites une sauvegarde de la clé privée, de la clé publique, du compte ID, du profil du compte et de toutes les notes de récupération ou de conservation du compte nécessaires pour restaurer le signataire.
- Garder au moins une sauvegarde hors ligne cryptée et une sauvegarme géographiquement séparée pour les signataires de production. Testez la récupération avec une petite opération en lecture seule avant de dépendre de la sauvegarde.
- Rotation ou remplacement d'un signataire si la clé privée, le mot de passe, les supports de sauvegarde ou l'hôte de signature ont pu être exposés.

Pour plus de détails, voir [Le stockage des clés cryptographiques](/fr/guide/security/storing-cryptographic-keys.md) et [La sécurité par mot de passe](/fr/guide/security/password-security.md).

## Prenez le testnet XOR sur le Taira {#_4-get-testnet-xor-on-taira}

Utilisez directement le robinet public.

1. Générer ou charger un signer et calculer son compte canonique Taira ID.
2. Apporte le puzzle du robinet actuel.
3. Résolvez le puzzle si `difficulty_bits` est supérieur à `0`.
4. Faites une demande de robinet.
5. Attendez que le solde du compte ou de l'actif soit visible avant d'envoyer des courriels de paiement.

Convertir une clé publique sur le compte Taira I105 ID attendu par le robinet:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Apportez le puzzle:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

Le robinet est un service public de testnet. Si le puzzle ou le point d'extrémité de la demande renvoie `502`, un délai ou une autre erreur au niveau du gateway, attendez et réessayez avant de modifier vos clés ou votre configuration client.

La réponse a la forme suivante:

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

Lorsque `difficulty_bits` est `0`, soumettez uniquement le compte ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

Lorsque `difficulty_bits` est supérieur à `0`, résoudre le puzzle et inclure la hauteur de l'ancre plus la nonce:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

L'algorithme du puzzle est:

1. Construire le défi en SHA-256 sur:
   - les octets de `iroha:accounts:faucet:pow:v2`
   - le compte UTF-8 ID
   - `anchor_height` en tant que big-endian `u64`
   - `anchor_block_hash_hex` décodé en octets
   - `challenge_salt_hex` décodé en octets, lorsqu'il est présent.
2. Essayez les nonces `u64` codées comme des valeurs de 8 octets à large enjeu.
3. Pour chaque nonce, utilisez scrypt:
   - mot de passe: le nonce à 8 octets
   - sal: le défi de 32 octets
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - longueur de sortie: 32 octets
4. Le nonce gagnant est le premier digeste avec au moins `difficulty_bits` en tête de zéro bits.

La réponse au robinet comprend l'actif financé et le hash des transactions en file d'attente:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

La réponse est actuellement renvoyée avec HTTP `202 Accepted`. Il est `asset_definition_id` est le courant Taira l'actif de frais financé par le robinet public; dériver de la réponse au lieu de copier un exemple ID. Le robinet a accepté la demande à son retour. `tx_hash_hex` et `status: "QUEUED"`.

Ensuite, enquête sur l'actif financé avant de soumettre vos propres transactions de paiement de frais:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Si la demande de robinet a été acceptée mais que le compte ou l'actif n'est pas encore visible, la transaction est toujours derrière le traitement public des files d'attente du testnet. Attendez et réessayez la lecture avant d'envoyer des écritures.

Pour une vérification directe prête à l'exécution API, enregistrez ceci sous la forme de `taira_faucet_claim.py` et passez-le sur le compte Taira I105 ID:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

Le robinet est uniquement destiné aux fonds du réseau de test Taira. N'utilisez pas le testnet XOR, les comptes du robinet ou les signatures canaries Taira dans les flux Minamoto.

## 5. Créer une configuration de client Minamoto {#_5-create-a-minamoto-client-config}

Utilisez une paire de touches séparée pour Minamoto. Ne pas réutiliser Taira les clés du réseau principal.

Créer `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Le niveau supérieur `chain` est le courant Nexus chaîne de réseau principal ID. `[account].profile = "minamoto"` sélectionne le Minamoto I105 discriminant de la chaîne; le nom d'hôte du point final et la chaîne ID Ne le sélectionnez pas implicitement.

Convertir une clé publique Minamoto en son compte canonique I105 ID avec le préfixe de la file principale:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Exécuter uniquement des vérifications du côté de la lecture jusqu'à ce que le compte soit fourni et financé par l'intermédiaire du flux d'intégration ou de gouvernance du mainnet:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

N'utilisez pas le robinet Taira ou l'aide à écrire avec Minamoto.

## 6. Financer un compte Minamoto auprès de XOR {#_6-fund-a-minamoto-account-with-xor}

Les frais Minamoto sont payés avec la production XOR, et Minamoto n'a pas de robinet public. Financer le compte configuré par l'intermédiaire d'un onboarding ou d'un transfert de trésorerie approuvés, ou recevoir XOR à partir d'un compte déjà financé Minamoto.

Vérifiez le compte canonique ID et le financement avec des contrôles de lecture uniquement avant de soumettre un écrit. Traitez Minamoto XOR comme des fonds de production: répétez d'abord la même opération sur Taira, gardez les clés de production séparées et ne présumez pas qu'une transaction en réseau principal peut être réinitialisée.

Taira XOR ne peut pas payer les frais de Minamoto. Les soldes du réseau d'essai et les créances sur les robinets ne sont pas transférées à Minamoto.

## 7. Travailler dans un espace de données existant {#_7-work-inside-an-existing-dataspace}

Utiliser des noms de domaine entièrement qualifiés pour les objets du registre qui vivent à l'intérieur d'un espace de données. Par exemple, un domaine de projet dans l'espace de données public devrait utiliser:

```text
apps.universal
```

Une fois que votre compte a obtenu les autorisations requises, créez une intention `AliasSetupPlanRequestV1` sans secret pour le domaine et utilisez le planificateur déclaratif:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Pour Minamoto, générer et approuver une intention et un plan mainnet distincts. Les plans sont liés à leur chaîne, autorité, ancrage de l'état-vivant et date limite, de sorte qu'un plan Taira ne peut pas être promu ou reproduit:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Les pseudonymes de compte utilisent le même suffixe de zone de données:

```text
alice@apps.universal
alice@universal
```

Les champs de comptes stricts utilisent encore les canoniques I105 compte IDs. Traiter les pseudonymes comme des liaisons lisibles par l'homme qui se résolvent à un compte canonique IDs.

## 8. Donner un nouvel espace de données {#_8-provision-a-new-dataspace}

Un nouvel espace de données est un changement d'opérateur et de gouvernance. Le point final public Torii peut rediriger le trafic vers des espaces de données configurés, mais il rejettera les pseudonymes inconnus du domaine de données.

Avant de préparer un changement, saisissez le catalogue en direct actuel:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Pour un compte d'exploitant, vérifiez également la posture du manifeste de voie:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Ne pas promouvoir un nouveau pseudonyme à moins que la voie ID, l'espace de données ID, le réglage du validateur, la tolérance aux défauts, le manifeste, les règles d'itinéraire et le propriétaire opérationnel n'aient été examinés ensemble. Un compte d'utilisateur normal avec les autorisations requises peut acquérir un domaine et sa location SNS à l'intérieur d'un espace de données existant par le biais du planificateur alias; il ne peut pas ajouter en toute sécurité un nouveau espace de data public.

Pour un espace de données privé ou organisationnel, préparez un changement de catalogue avec:

- un alias unique et numérique de l'espace de données `id`
- une entrée de voie correspondante ou une assignation de voie existante
- l'espace de données `fault_tolerance`
- les règles de routage pour les instructions ou les champs d'application des comptes qui doivent y arriver
- un manifeste du répertoire spatial ou une preuve de déploiement équivalente, lorsque l'espace de données expose les capacités UAID
- approbation de la gouvernance pour les politiques de validation, de conformité, de règlement et de suivi;

Un fragment de configuration révisable ressemble à ceci:

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
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

L'acceptation par l'opérateur doit inclure les portes suivantes:

- `iroha3d --sora --config <config.toml> --trace-config` passe sur la configuration du nœud résolu
- le manifeste généré ou examiné est archivé avec des hachages et des signatures
- les essais de fumée passent à Taira avant toute promotion Minamoto;
- le catalogue post-changement `/status` indique la voie et l'espace de données prévus;
- `iroha app nexus lane-report --summary` ne fait pas état d'un manquement de manifestes requis

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Promouvoir le même espace de données à Minamoto seulement après que le déploiement, les essais de fumée, la surveillance et les preuves de gouvernance Taira soient complétés.

## Pages connexes {#related-pages}

- [Installation de Iroha 3](/fr/get-started/install-iroha.md)
- [L'opération Iroha 3 est effectuée par l'intermédiaire de CLI ](/fr/get-started/operate-iroha-via-cli.md)
- [Frais de parrainage pour un espace de données privé](/fr/get-started/private-dataspace-fee-sponsor.md)
- [points d'extrémité Torii](/fr/reference/torii-endpoints.md)
- [Référencement de la Genèse](/fr/reference/genesis.md)
