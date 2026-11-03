---
translation_locale: fr
translation_source: /cookbook/stream-events.md
translation_source_hash: d6202b208288688cdfd927491d6670f094f631ccaecd7ff62858a94267c5306a
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Événements de streaming {#stream-events}

## Résultat {#outcome}

Consommez les événements du pipeline de traitement en direct Taira via des événements envoyés par le serveur (SSE), reconnectez-vous avec une reconnexion limitée, et actualisez l'état durable après l'ouverture du flux de remplacement. Comme le point de terminaison API n'a pas de curseur de relecture, considérez les événements comme des notifications plutôt que comme un historique complet.

## Prérequis {#prerequisites}

- `curl` pour un test public de fumée.
- Node.js 24 pour le consommateur JavaScript.
- Aucun signataire cryptographique n'est requis. `https://taira.sora.org/v1/events/sse` est un flux public en lecture seule ; cette recette n'effectue aucune écriture Minamoto ou Taira.

## Étapes {#steps}

### 1. Confirmez la réponse SSE {#_1-confirm-the-sse-response}

Demandez le flux d'événements avec un repli JSON : Torii diffuse `text/event-stream` et signale une requête rejetée, comme un filtre invalide, sous forme d'erreur JSON. Désactivez le tamponnage curl. La commande se termine après 20 secondes. Torii envoie un commentaire de battement de cœur après 15 secondes d'inactivité ; recevoir uniquement des commentaires de battement de cœur pendant une période de calme est donc valide.

```bash
curl -sS -N --max-time 20 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

Ne pas envoyer `Last-Event-ID`. Le point de terminaison SSE de Torii API est un flux de diffusion en direct, pas un journal de relecture, et rejette les demandes de relecture.

### 2. Ajouter un consommateur filtré JavaScript {#_2-add-a-filtered-javascript-consumer}

Enregistrez ce qui suit sous `stream-taira.mjs`. Il utilise Fetch directement pour montrer le format de transmission. Le paramètre de requête `filter` utilise la grammaire de filtres textuels de Torii pour sélectionner les événements de transaction approuvés, et l'analyseur consomme les trames SSE sans curseur de relecture.

```js
const baseUrl = 'https://taira.sora.org'
const shutdown = new AbortController()
const filter = 'tx_status = "Approved"'

process.once('SIGINT', () => shutdown.abort())
process.once('SIGTERM', () => shutdown.abort())

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

async function reconcile() {
  const response = await fetch(
    `${baseUrl}/v1/explorer/transactions?limit=25`,
    { headers: { Accept: 'application/json' } },
  )
  if (!response.ok) {
    throw new Error(`reconciliation failed: HTTP ${response.status}`)
  }
  console.log('recent transaction diagnostic', await response.json())
}

async function* streamOnce() {
  const url = new URL('/v1/events/sse', baseUrl)
  url.searchParams.set('filter', filter)
  const response = await fetch(url, {
    headers: { Accept: 'text/event-stream, application/json' },
    signal: shutdown.signal,
  })
  if (!response.ok) {
    throw new Error(
      `SSE request failed: HTTP ${response.status}: ${await response.text()}`,
    )
  }
  if (
    !response.headers.get('content-type')?.startsWith('text/event-stream')
  ) {
    throw new Error('Taira did not negotiate an event-stream response')
  }
  if (!response.body) throw new Error('SSE response has no body')

  // Establish the replacement stream first. Events that arrive while the
  // durable-state query runs remain buffered on this live response.
  try {
    await reconcile()
  } catch (error) {
    console.error(error)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (!shutdown.signal.aborted) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    for (;;) {
      const boundary = buffer.match(/\r?\n\r?\n/)
      if (!boundary || boundary.index === undefined) break
      const block = buffer.slice(0, boundary.index)
      buffer = buffer.slice(boundary.index + boundary[0].length)

      let event = 'message'
      const dataLines = []
      for (const line of block.split(/\r?\n/)) {
        if (line.startsWith(':')) continue
        if (line.startsWith('event:')) event = line.slice(6).trim()
        if (line.startsWith('data:'))
          dataLines.push(line.slice(5).trimStart())
      }
      if (dataLines.length === 0) continue
      const rawData = dataLines.join('\n')
      let data
      try {
        data = JSON.parse(rawData)
      } catch {
        data = rawData
      }
      yield { event, data }
    }
  }
}

async function follow() {
  let backoffMs = 250

  while (!shutdown.signal.aborted) {
    try {
      for await (const event of streamOnce()) {
        if (event.event === 'stream_error') {
          throw new Error(
            `server closed stream: ${JSON.stringify(event.data)}`,
          )
        }

        console.log(event)
        backoffMs = 250
      }
    } catch (error) {
      if (shutdown.signal.aborted) break
      console.error(error)
    }

    // The disconnected interval cannot be replayed. Back off, then establish
    // a new stream; streamOnce refreshes state after the response is open.
    await delay(backoffMs)
    backoffMs = Math.min(backoffMs * 2, 10_000)
  }
}

await follow()
```

Exécutez-le jusqu'à ce qu'au moins une transaction atteigne `Approved` sur Taira :

```bash
node ./stream-taira.mjs
```

Les commentaires heartbeat du flux SSE maintiennent les connexions inactives, mais n’établissent pas l’ordre du registre. Utilisez les hauteurs de bloc, les hachages de transaction et les requêtes du registre lorsque l’ordre ou l’exhaustivité importent.

La dernière requête d'explorateur-25 n'est qu'un diagnostic public. Un consommateur en production doit remplacer ou étendre `reconcile()` avec des requêtes pour ses ressources applicatives durables et une limite de récupération suffisamment grande pour son point de contrôle. La vue des données à un point dans le temps limitée à elle seule ne peut pas prouver qu'aucun événement n'a été manqué.

`ToriiClient.streamEvents({ filter })` de `@iroha/iroha-js` lit le même flux : passez `field('tx_status').eq('Approved')` ou le filtre textuel ci-dessus. Il produit la trame terminale `stream_error` avant la fin du flux ; les règles de reconnexion et de réconciliation ci-dessus s'appliquent donc toujours.

## Vérifier {#verify}

Dans un terminal, exécutez le consommateur JavaScript. Dans un autre, lisez la vue des données publiques des transactions à un instant donné :

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?limit=25' |
  jq .
```

Pour chaque événement de transaction qui vous intéresse, localisez son hachage cryptographique dans la vue des données à un instant donné ou interrogez-le directement. La page limitée peut omettre les transactions plus anciennes. Puis arrêtez et redémarrez le consommateur : il doit se reconnecter sans fournir d'identifiant d'événement et doit afficher un nouveau diagnostic après l'ouverture du flux de remplacement.

## Dépannage {#troubleshooting}

- Une connexion avec des commentaires de battement de cœur mais sans événements de données est saine ; l'état du pipeline de traitement sélectionné peut simplement être silencieux.
- `400` avec le code `invalid_filter` signifie que le `filter` ne respecte pas la grammaire textuelle de Torii ou nomme un champ que les flux d'événements ne prennent pas en charge. Les flux d'événements filtrent sur `tx_status`, `tx_hash`, `tx_block_height`, `tx_lane_id`, `tx_dataspace_id`, `block_status`, `block_height`, `proof_backend`, `proof_call_hash` et `proof_envelope_hash`.
- Un événement `stream_error` indique que le serveur a détecté un retard ou une autre condition de flux terminal. Torii envoie cet événement une fois et ferme le flux ; ouvrez un flux de remplacement, puis réconciliez.
- Un proxy peut mettre en mémoire tampon SSE même lorsque Torii ne le fait pas. Désactivez la mise en mémoire tampon et la compression des réponses dans le proxy, et conservez `curl -N` dans le diagnostic.
- Ne comblez jamais un écart de déconnexion en supposant que l'événement suivant suit le précédent. Le point de terminaison API n'a pas de curseur de relecture ; interrogez plutôt l'état actuel du grand livre de la blockchain.

## Source et documents connexes {#source-and-related-docs}

- [JavaScript recette de streaming au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/recipes/streaming.mjs)
- [SSE tests d'intégration au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/events/sse_smoke.rs)
- [Grammaire textuelle des filtres Torii au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/src/list_query/text.rs)
- [Torii routage d'événement au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii/src/routing.rs)
- [Événements](/fr/blockchain/events.md)
- [Torii API points de terminaison](/fr/reference/torii-endpoints.md)
- [Interroger l'état du grand livre blockchain](./query-ledger-state.md)
