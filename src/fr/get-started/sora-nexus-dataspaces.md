---
translation_locale: fr
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 63c317ab61ba912176c43c83d5b4f026f23a7a6e5fb633872a133c9ea1295686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# On s'en remet SORA 3: Taira et Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 est la piste de déploiement public face à l'application construite sur Iroha 3 et SORA
Nexus. Construire et répétition sur Taira d'abord, puis déplacer la même forme de client
à Minamoto uniquement lorsque vous avez des clés mainnet séparées, réelles XOR pour les frais,
et approbation de la production.

Ce tutoriel montre comment configurer un Iroha client pour le public SORA 3
les réseaux:

- Taira réseau de test à `https://taira.sora.org`
- Minamoto à l'intérieur `https://minamoto.sora.org`

Utilisation Taira pour les essais d'intégration, les canaries d'écriture financées par les robinets, et
Les répétitions de déploiement. Minamoto uniquement pour le mainnet prêt à la production
Les deux réseaux facturent des frais en XOR:

- Taira utilise testnet XOR du robinet public.
- Minamoto utilise réelle XOR. Il n'y a pas Minamoto Le robinet.

## Chemin du constructeur {#builder-path}

| Pas de départ                        | Taira Réseau de test                                                | Minamoto Le mainnet                                   |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| Commencez à lire l' état du réseau | Résumé `/status` sans clés                                 | Résumé `/status` sans clés                       |
| Choisissez un espace de données            | Utilisation publique `universal` à moins que votre application ait besoin d'une voie régulée | Utilisez le même espace de données uniquement après l'approbation du réseau principal |
| Obtenez une bourse .               | Utilisez le public Taira robinet                                  | Réception XOR d'une entreprise financée Minamoto flux de compte ou de trésorerie approuvé |
| Test écrit                 | Utilisation d'essais financés par robinet XOR                                   | N'utilisez pas d'outils de test; les écrivains dépensent réellement XOR     |
| Promouvoir                     | Continuez à réessayer la logique, le suivi et la manipulation des signatures            | Utilisez des clés séparées, des contrôles de financement et de libération   |

Le flux pratique est:

1. Construire le client contre Taira et utiliser le public `universal` espace de données.
2. Ajouter un signataire et le financer avec Taira Le robinet.
3. Exercez votre logique de l'application contre Taira jusqu'à ce que les échecs soient ennuyeux et
   Il est observable.
4. Créez une séparation Minamoto signataire, le financer avec réel XOR, et ne bouge que
   les mêmes opérations éprouvées pour mainnet.

## 1. Comprenez ce que vous voulez faire {#_1-understand-what-you-are-setting-up}

Dans SORA Nexus, un espace de données fait partie du catalogue de la voie réseau et du routage.
Un client ne crée pas un nouvel espace de données public simplement en changeant
`client.toml`. La configuration du client fait deux choses:

1. Points le client à droite Torii point final
2. sélectionne le contexte de routage du domaine et de l'espace de données pour son compte canonique

`AccountId` Il est toujours canonique et sans domaine. `[account].domain` valeur en
`client.toml` fournit un contexte de routage et d'alias; il ne fait pas partie
Pour la plupart des demandes, commencez par le public
`universal` L'espace de données. utilise le contexte du domaine `domain.dataspace` forme, pour
l'exemple:

```text
wonderland.universal
```

Si vous avez besoin d'un nouvel espace de données organisationnelle, préparez un catalogue et un routage
propositions au lieu d'essayer de les enregistrer sur un compte client ordinaire.
Vous voyez ? [Un nouvel espace de données](#_8-provision-a-new-dataspace) Vous êtes en dessous.

## 2. Vérifiez le public Torii Point final {#_2-check-the-public-torii-endpoint}

Vérifiez que le point final cible est en direct avant de configurer un signataire.

Pour Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Pour Minamoto:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Inspecter l'espace de données et la vue des voies exposées par le nœud:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Utilisez la même commande que `https://minamoto.sora.org/status` Pour mainnet.

## Taira MCP pour les agents {#taira-mcp-for-agents}

Taira a également exposé une Torii- protocole de contexte modèle natif (MCP) pont pour
Utilisez-le quand un agent a besoin de tests en direct.
des tests de diagnostic ou des répétitions d'écriture étroitement révisées sans créer une habitude
Torii Le client d'abord.

| Réglage | La valeur |
| --- | --- |
| MCP point final | `https://taira.sora.org/v1/mcp` |
| Racine réseau | `https://taira.sora.org` |
| Utilisation prévue | Taira Les lectures de testnet et les répétitions d'écriture financées par les robinets |
| Équivalent de production | Ne pointent pas cette entrée vers: Minamoto à moins qu'un réseau principal MCP les contrôles des points d'extrémité et de la libération sont expressément approuvés |

Vérifiez les métadonnées du pont avant d'ajouter le matériel de signature:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

Configurer le URL en tant qu'utilisateur local MCP Le serveur en temps d'exécution.
agent d'engagement MCP config, API les jetons, les en-têtes d'auteur transmis, `authority`, ou
`private_key` les valeurs dans ce repo de documents ou un repo d'application.

Les règles de l'agent qui fonctionnent bien avec Taira:

- Découvrez les outils MCP le serveur avant de l'appeler;
  rapports du serveur `listChanged`.
- Je préfère les cures. `iroha.*` outils sur les matières premières `torii.*` les outils.
- Commencez à lire uniquement: inspecter le statut, les comptes, les actifs, les pseudonymes, les blocs,
  l'état de gouvernance et le statut de la transaction avant de proposer des écritures.
- Exiger une instruction humaine explicite avant les mutations du réseau de test en direct.
  enveloppes de transaction prédésignées, utilisation `iroha.transactions.submit_and_wait`
  Donc l'agent attend le résultat au lieu de se soumettre.
- Résumez les hashes de transaction, l'état final et les erreurs de validation du serveur dans
  la réponse de l'agent.

### Développement du flux de travail avec les agents {#development-workflow-with-agents}

Utiliser des agents comme aides au développement pour Iroha clients, constructeurs de transactions,
les scripts diagnostiques et les manuels de test.
Il peut inspecter le code, lire Taira l'état, proposer des changements et effectuer des tests locaux,
Mais il ne devrait pas muter un réseau vivant jusqu'à ce qu'un humain approuve l' exact
l'opération.

Un flux de travail pratique est:

1. Demandez à l'agent d'inspecter les médecins pertinents. SDK le code, CLI commandement, ou MCP
   Schéma d'outil avant qu'il ne rédige le code.
2. Demandez à l'agent d'écrire le plus petit chemin du client en premier: vérification de statut, compte
   recherche, résolution alias ou recherche d'équilibre.
3. Ajouter le code de construction des transactions seulement après que les appels uniquement lus fonctionnent contre
   Taira.
4. Garder l'opt-in aux tests en direct, par exemple derrière `TAIRA_LIVE=1`, alors une
   La mise à l'essai d'unité normale ne dépense jamais les fonds du réseau de test ou dépend du réseau
   la disponibilité.
5. Obliger l'agent à signaler le réseau, la chaîne, le compte de l'autorité,
   résumé de l'instruction, actif des frais et changement d'état attendu avant sa soumission
   toute transaction.
6. Examiner le code généré pour la manipulation secrète, le comportement réessayer, l'idempotence, et
   traitement du rejet avant de le promouvoir CI ou des flux de travail continus.

Utilisée uniquement en lecture MCP les outils de développement comprennent des recherches sur les actifs du compte,
résolution par alias, recherche de blocs, recherche de transactions, listes de transactions et
les vérifications de l'état des pipelines.
une charge utile signée.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Flux de travail des transactions à travers les agents {#transaction-workflow-through-agents}

Les MCP bridge peut soumettre une lettre signée Iroha transaction, mais elle ne supprime pas
Les exigences normales en matière de transaction.
autorité, autorisations, financement des frais, chaîne ID, Metadata et signature.

Pour le brut Iroha les transactions, construire et signer l'enveloppe de transaction avec un
SDK ou CLI Tout d'abord, donnez ensuite à l'agent seulement la transaction canonique signée
octets codés comme `body_base64`. L' agent peut soumettre l' enveloppe
`iroha.transactions.submit_and_wait`, ou soumettre avec
`iroha.transactions.submit` et de sondage avec `iroha.transactions.wait`.

Ne pas coller des clés privées dans une demande d'agent.
la transaction, appuyez-la sur le code local qui charge les secrets du temps d'exécution de l'utilisateur
L'environnement, la chaîne de clés, le signataire matériel ou le fichier de configuration du testnet ignoré.
l'agent ne devrait jamais écrire le matériel clé dans Markdown, fixtures, journaux, ou
Il s'est engagé.

Avant de soumettre une transaction, obligez l'agent à effectuer une transaction courte
Le plan:

- `network`: Taira racine et chaîne du réseau de test ID
- `authority`: compte qui signe et paie des frais
- `instructions`: enregistrer, éliminer, brûler, transférer, métadonner, autoriser ou
  résumé de l'appel d'offres
- `fee asset`: actif qui sera facturé Taira
- `preflight reads`: compte, solde des actifs, autorisations, alias ou bloc
  contrôles déjà effectués
- `expected result`: l'état qui doit être visible après confirmation
- `idempotency`: ce qui se passe si la même demande est réexaminée

Après la soumission, faites attendre l'agent pour un état terminal, puis vérifiez le
changement d'état avec une requête de lecture.

- hash de transaction
- le statut terminal tel que `Committed`, `Applied`, `Rejected`, ou `Expired`
- détail du bloc ou de l'explorateur, lorsqu'il est disponible
- résultats de lecture de vérification
- le message de rejet et si l'échec ressemble à des autorisations, des frais,
  la validation, l'état obsolète ou la disponibilité du point final

Précédent de l'exemple:

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

Le traitement Taira MCP en tant que surface de contrôle publique du réseau d'essai. Taira clés, réseau de test XOR,
Les comptes de robinets et les signatures canaries sont jetables et doivent rester séparés
Minamoto les clés et les flux de travail de libération de production.

## Des jouets que vous pouvez essayer maintenant {#toy-examples-you-can-try-now}

Ces exemples sont uniquement lisibles sauf mention. Ils fonctionnent avant que vous génériez
les clés et sont sûres de se lancer contre les deux réseaux publics.

Comparaison Taira réseau de test et Minamoto santé du réseau:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Liste des voies d'espace public exposées par Taira:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Faites la même commande contre Minamoto lorsque vous avez besoin de la vue mainnet:

```bash
curl -fsS https://minamoto.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Faites une petite Node.js sonde d'état pour un tableau de bord, un bot ou un déploiement
vérifier:

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`).then((res) => res.json());
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

Le premier jouet à écrire devrait être un Taira Il utilise le réseau de test
XOR et ne devrait jamais être pointé vers Minamoto.

## 3. Créer une Taira Configuration du client {#_3-create-a-taira-client-config}

Générer une paire de clés si vous n' en avez pas déjà:

```bash
kagami keys --algorithm ed25519 --json
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

Le niveau supérieur `chain` C'est exactement Taira chaîne de transactions ID. Les
`[account].profile = "taira"` l'établissement sélectionne indépendamment le Taira I105
La chaîne est discriminante. ID ne sélectionne pas le profil du compte.

Exécutez un chèque à lecture seule:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Réguler le public Taira Diagnostics avant les tests d'écriture:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Financer le Taira Compte à travers le robinet avant d'exécuter des billets de paiement.
Le débit direct du robinet est en
[Prenez le testnet XOR sur le Taira](#_4-get-testnet-xor-on-taira).

Après l'acceptation de la demande de robinet et le financement du compte, les Taira
le canary est un test de fumée d'écriture facultatif:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Le canary soumet un ping signé, attend la confirmation, et écrit le
configuration du signataire d'exécution lorsque `--write-config` est fournie. Taira est un public
testnet, de sorte que la saturation des files d'attente peut faire échouer le ping signé même lorsque le
Le robinet lui-même fonctionne. `taira doctor` rapporte une file d'attente saturée
Retours canariens `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, attendre et réessayer avant
le traiter comme une erreur de configuration du client.

Pour les essais de fumée non surveillés, enveloppez le canary dans une boucle de retrait limitée:

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

Arrêtez de réessayer si `iroha taira doctor` montre des défaillances difficiles.
et les refus d'admission à la redevance sont des conditions transitoires pour le réseau public de test; DNS,
TLS, ou `status = "fail"` Les diagnostics ne le sont pas.

## Générer un SORA Nexus Compte ID {#generate-a-sora-nexus-account-id}

Une SORA Nexus compte ID est un canonical I105 l'adresse dérivée de la
la clé publique du compte et le préfixe du réseau cible.
`[account].domain` valeur en client TOML. Les mêmes codes de clé publique pour
différente IDs sur le Taira et Minamoto, et les utilisateurs de la production devraient générer un
paires de clés séparées pour Minamoto.

Générer ou charger la paire de touches Ed25519 qui contrôlera le compte:

```bash
kagami keys --algorithm ed25519 --json
```

Convertir la clé publique en Taira compte ID:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Convertir une Minamoto clé publique avec le préfixe mainnet:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Utilisez le compte résultant ID partout où une Nexus API ou CLI le commandement demande une
compte canonique ID, Par exemple, le Taira robinet `account_id`, équilibre
des requêtes, des champs de compte stricts ou des liaisons alias.
clé privée dans votre configuration client, et sélectionnez le même réseau public avec
`[account].profile = "taira"` ou `[account].profile = "minamoto"`.

Génération de la ID ne crée pas par elle-même un compte en chaîne financé.
Taira, le robinet peut créer et financer le compte pour testnet écrit.
Minamoto, Utiliser une connexion à l'appareil principal approuvée ou un flux de trésorerie.

### Le stockage et la sauvegarde des clés {#key-storage-and-backup}

Le compte ID et la clé publique peut être partagée.
Les mots de passe, les graines et le matériel de récupération doivent être traités comme secrets.

Utilisez ces pratiques pour SORA Nexus comptes:

- Conserver les clés privées dans un gestionnaire de mots de passe crypté, supporté par le matériel
  Ne pas attribuer les clés à la source
  contrôler ou laisser des clés de production dans l'historique du shell, les journaux, le chat, les billets,
  ou des sauvegardes non cryptées.
- Utilisez un mot de passe unique à haute entropie pour chaque caisse ou signataire de production.
  Les mots de passe doivent être stockés dans un gestionnaire de mots de passe ou un processus de conservation partagé, pas dans
  le même fichier ou ensemble de sauvegarde que la clé privée cryptée.
- Restez Taira et Minamoto Les clés séparées. Taira les clés comme jetables
  matériau de réseau d'essai et Minamoto les clés en tant qu'autorité des fonds de production.
- Réservez la clé privée, clé publique, compte ID, le profil du compte et tout
  Une note de récupération ou de conservation du compte nécessaire pour restaurer le signataire.
  la clé sans le contexte réseau est facile à abuser lors de la récupération.
- Gardez au moins une sauvegarde hors ligne cryptée et une géographiquement
  une sauvegarde cryptée séparée pour les signataires de production.
  une petite opération en lecture seule avant, selon la sauvegarde.
- Rotation ou remplacement d'un signataire si la clé privée, la phrase de passe, le support de sauvegarde,
  ou l'hôte signataire peut avoir été exposé.

Pour plus de détails, voir
[Le stockage des clés cryptographiques](/fr/guide/security/storing-cryptographic-keys.md)
et [Sécurité des mots de passe](/fr/guide/security/password-security.md).

## 4. Prenez Testnet XOR sur le Taira {#_4-get-testnet-xor-on-taira}

Utilisez le robinet public directement.

1. Générer ou charger un signataire et calculer son canonique Taira compte ID.
2. Apportez le puzzle du robinet actuel.
3. Résolvez le puzzle si `difficulty_bits` est supérieur à `0`.
4. Soumettez la demande de robinet.
5. Attendez que le solde du compte ou des actifs soit visible avant d'envoyer
   Les frais sont payants.

Convertir une clé publique en Taira I105 compte ID attendu par le robinet:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Apportez le puzzle:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
```

Le robinet est un service public de testnet.
Retour `502`, une pause de temps ou une autre erreur au niveau du gateway, attendre et réessayer
avant de changer vos clés ou la configuration du client.

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

Quand ? `difficulty_bits` est `0`, soumettre uniquement le compte ID:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}'
```

Quand ? `difficulty_bits` est supérieur à `0`, résoudre le puzzle et inclure
la hauteur de l'ancre plus le nonce:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }'
```

L' algorithme du puzzle est:

1. Construisez le défi comme SHA-256 sur:
   - les octets de `iroha:accounts:faucet:pow:v2`
   - le UTF-8 compte ID
   - `anchor_height` comme un grand-endian `u64`
   - `anchor_block_hash_hex` décodés en octets
   - `challenge_salt_hex` décodés en octets, lorsqu'ils sont présents
2. Essayez ! `u64` nonces codées comme des valeurs de 8 bytes big-endian.
3. Pour chaque nonce, scrypt avec:
   - mot de passe: le nonce à 8 octets
   - Sal: le défi de 32 octets
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - longueur de sortie: 32 octets
4. Le nonce gagnant est le premier digeste avec au moins `difficulty_bits`
   conduisant à zéro bits.

La réponse au robinet comprend l'actif financé et le hash de la transaction en file d'attente:

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "asset_id": "...",
  "amount": "25000",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

La réponse est actuellement renvoyée avec: HTTP `202 Accepted`. L'actif
définition ID ci-dessus est le Taira Les actifs de redevances financés par le robinet public.
le robinet a accepté la demande lorsqu'il est retourné `tx_hash_hex` et
`status: "QUEUED"`.

Ensuite, enquête sur l'actif financé avant de soumettre votre propre paiement des frais
les opérations:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition 6TEAJqbb8oEPmLncoNiMRbLEK6tw \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Si la demande du robinet a été acceptée mais que le compte ou l'actif n'est pas visible
Pourtant, la transaction est toujours derrière le traitement public des files d'attente.
et réessayez la lecture avant d'envoyer des lettres.

Pour une ligne directe prête à fonctionner API Vérifiez, gardez ceci comme `taira_faucet_claim.py`
et passer le Taira I105 compte ID:

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

with urllib.request.urlopen(f"{root}/v1/accounts/faucet/puzzle") as res:
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
    headers={"content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

Le robinet est uniquement pour Taira les fonds testnet. n'utilisez pas testnet XOR, robinet
les comptes, ou Taira signataires canariens Minamoto Il coule.

## 5. Créer une Minamoto Configuration du client {#_5-create-a-minamoto-client-config}

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

Le niveau supérieur `chain` est le courant Nexus chaîne de réseaux principaux ID.
`[account].profile = "minamoto"` sélectionne le Minamoto I105 chaîne
discriminant; le nom d'hôte et la chaîne du point final ID ne le sélectionnez pas implicitement.

Convertir une Minamoto clé publique dans son canonique I105 compte ID avec le
préfixe mainnet:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Exécuter uniquement des contrôles de lecture jusqu'à ce que le compte soit fourni et financé
à travers le flux d'intégration ou de gouvernance du réseau principal:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Ne pas exécuter le Taira un appareil de réception ou d'écriture à l'aide d'un canneau Minamoto.

## 6. Fonds a Minamoto Compte avec XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto les frais sont payés avec la production XOR, et Minamoto n'a pas de public
le robinet. financer le compte configuré par une connexion approuvée au réseau principal
ou le transfert du trésor, ou la réception XOR à partir d'un fonds existant Minamoto
compte.

Vérifiez le compte canonique ID et le financement avec des contrôles de lecture uniquement avant
Je suis en train de présenter une lettre. Minamoto XOR En tant que fonds de production: répétition
même opération sur Taira d'abord, conserver des clés de production séparées et ne pas
en supposant qu'une transaction de mainnet peut être réinitialisée.

Taira XOR ne peut pas payer Minamoto les redevances du réseau d'essai et les créances des robinets
n'est pas transférée à Minamoto.

## 7. Travailler dans un espace de données existant {#_7-work-inside-an-existing-dataspace}

Utilisez des noms de domaine entièrement qualifiés pour les objets du registre qui vivent à l'intérieur d'une
Par exemple, un domaine de projet dans l'espace de données public devrait
utilisation:

```text
apps.universal
```

Une fois que votre compte a obtenu les autorisations requises, créez un secret-free
`AliasSetupPlanRequestV1` l'intention du domaine et utilisez le planificateur déclaratif:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Pour Minamoto, générer et approuver un plan d'intention et de projet mainnet distincts.
sont liés à leur chaîne, autorité, ancrage de l'état vivant et date limite, donc une
Taira le plan ne peut pas être promu ou répété:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Les pseudonymes de compte utilisent le même suffixe espace de données:

```text
alice@apps.universal
alice@universal
```

Les champs de comptes stricts utilisent encore les canoniques I105 compte IDs. Traiter les pseudonymes
en tant qu'engagements lisibles par l'homme qui résolvent le compte canonique IDs.

## 8. Un nouvel espace de données {#_8-provision-a-new-dataspace}

Un nouvel espace de données est un opérateur et un changement de gouvernance. Torii
Endpoint peut diriger le trafic vers les espaces de données configurés, mais il rejettera
des pseudonymes d'espace de données inconnus.

Avant de préparer un changement, saisissez le catalogue en direct actuel:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Pour un compte d'exploitant, vérifiez également la posture du manifeste de voie:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Ne pas promouvoir un nouveau pseudonyme à moins que la voie ID, espace de données ID, un ensemble de validateurs,
la tolérance aux défauts, le manifeste, les règles de routage et le propriétaire opérationnel ont été
Un compte utilisateur normal avec les autorisations requises peut
l'acquisition d'un domaine et de ses SNS leasing à l'intérieur d'un espace de données existant par le biais du
alias Planner; il ne peut pas ajouter en toute sécurité un nouvel espace de données public.

Pour un espace de données privé ou organisationnel, préparez une modification du catalogue avec:

- un alias unique de l'espace de données et numérique `id`
- une entrée de voie correspondante ou une assignation existante de voie
- l'espace de données `fault_tolerance`
- règles de routage pour les instructions ou les champs d'application des comptes qui devraient atterrir
  Il y a
- un manifeste du répertoire spatial ou des preuves de déploiement équivalentes, lorsque le
  expositions de l'espace de données UAID les capacités
- approbation de la gouvernance pour le validateur, la conformité, le règlement et le suivi
  politique

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

L'acceptation par l'opérateur devrait inclure les portes suivantes:

- `irohad --sora --config <config.toml> --trace-config` passe sur le
  configuration de nœud résolue
- le manifeste généré ou examiné est archivé avec des haches et des signatures
- Les essais de fumée passent Taira avant tout Minamoto promotion
- le changement postérieur `/status` le catalogue indique la voie et l'espace de données prévus
- `iroha app nexus lane-report --summary` n'indique pas la disparition requise
  les manifestes

```bash
curl -fsS https://taira.sora.org/status \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Promouvoir le même espace de données à Minamoto seulement après le Taira déploiement,
Les tests de fumée, la surveillance et les preuves de gouvernance sont complets.

## Pages connexes {#related-pages}

- [Installation Iroha 3](/fr/get-started/install-iroha.md)
- [Opérer Iroha 3 par le biais CLI](/fr/get-started/operate-iroha-via-cli.md)
- [Frais de parrainage pour un espace de données privé](/fr/get-started/private-dataspace-fee-sponsor.md)
- [Torii points de fin](/fr/reference/torii-endpoints.md)
- [Références de la Genèse](/fr/reference/genesis.md)
