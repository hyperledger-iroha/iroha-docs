---
translation_locale: fr
translation_source: /cookbook/stream-events.md
translation_source_hash: 1267a7e22bb6601674557f349e4fc5c6b883ce83b7dc62115ea2b8c3a0c39261
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Diffusion d'événements {#stream-events}

## Le résultat {#outcome}

Consommer en direct Taira des événements de pipeline sur les événements envoyés par le serveur (SSE), se reconnecter avec un backoff limité, et de rafraîchir l'état durable après ouverture du courant de remplacement. Parce que le terminal n'a pas de curseur de lecture, traitez les événements comme des notifications plutôt qu'un historique complet.

## Conditions préalables {#prerequisites}

- `curl` pour un test de fumée publique.
- Node.js 24 pour le consommateur de JavaScript.
- Aucun signataire n'est requis. `https://taira.sora.org/v1/events/sse` est un flux public, à lire uniquement; cette recette ne réalise aucun Minamoto ni aucune écriture de Taira.

## Les étapes {#steps}

### 1. Confirmer la réponse SSE {#_1-confirm-the-sse-response}

Taira négocie actuellement cette route uniquement lorsque l'en-tête `Accept` inclut à la fois le flux d'événements préféré et un retrait de JSON. Désactiver le tampon curl. La commande prend fin après 15 secondes; recevoir seulement des commentaires au rythme cardiaque pendant une période calme est valable.

```bash
curl -sS -N --max-time 15 \
  -H 'Accept: text/event-stream, application/json' \
  https://taira.sora.org/v1/events/sse
```

Ne l' envoyez pas `Last-Event-ID`. Torii C' est ... SSE Endpoint est un flux de fans en direct, pas un journal de répétition, et rejette les demandes de répétitions.

### 2. Ajouter un consommateur filtré JavaScript {#_2-add-a-filtered-javascript-consumer}

Enregistrer les éléments suivants en tant que `stream-taira.mjs`. Il utilise Fetch directement pour que la demande puisse envoyer Taira est nécessaire mélangé `Accept` l'intitulé. `FilterExpr` sélectionne les événements de transaction approuvés, et le parseur consomme SSE des cadres sans curseur de répétition.

```js
const baseUrl = 'https://taira.sora.org'
const shutdown = new AbortController()
const filter = {
  op: 'eq',
  args: ['tx_status', 'Approved'],
}

process.once('SIGINT', () => shutdown.abort())
process.once('SIGTERM', () => shutdown.abort())

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

async function reconcile() {
  const response = await fetch(
    `${baseUrl}/v1/explorer/transactions?page=1&per_page=25`,
    { headers: { Accept: 'application/json' } },
  )
  if (!response.ok) {
    throw new Error(`reconciliation failed: HTTP ${response.status}`)
  }
  console.log('recent transaction diagnostic', await response.json())
}

async function* streamOnce() {
  const url = new URL('/v1/events/sse', baseUrl)
  url.searchParams.set('filter', JSON.stringify(filter))
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

L'exécution jusqu'à ce qu'au moins une transaction atteigne `Approved` sur Taira:

```bash
node ./stream-taira.mjs
```

SSE Les commentaires de battements cardiaques maintiennent en vie les connexions inutiles mais n'établirent pas l'ordre du registre. Utilisez les hauteurs des blocs, les hashes de transaction et les requêtes du registre lorsque l'ordre ou l'exhaustivité sont importants.

La dernière demande de 25 explorateurs n'est qu'un diagnostic public.Un consommateur de production doit remplacer ou étendre `reconcile()` par des requêtes pour ses ressources d'application durables et une récupération limitée suffisamment grande pour son point de contrôle.

Lors de l'envoi fiché, `ToriiClient.streamEvents()` envoie uniquement `Accept: text/event-stream`; en direct Taira rejette cette en-tête plus étroite avec `406`. Utilisez le formulaire Raw Fetch ci-dessus jusqu'à ce que le SDK et le point final public négocient les mêmes types de média.

## Vérifiez {#verify}

Dans un terminal, lancez le consommateur JavaScript. Dans un autre, lisez l'instantané de transaction publique:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=25' |
  jq .
```

Pour chaque événement de transaction qui vous intéresse, localiser son hash dans l'instantané ou la requérir directement. et redémarrer le consommateur: il doit se reconnecter sans fournir un événement ID et imprimer un nouveau diagnostic après l'ouverture du courant de remplacement.

## Résolution des problèmes {#troubleshooting}

- Une connexion avec des commentaires cardiaques mais aucun événement de données est saine; l'état du pipeline sélectionné peut simplement être silencieux.
- `406 Not Acceptable` en direct Taira signifie généralement la demande annoncée uniquement `text/event-stream`. Envoyer `text/event-stream, application/json` exactement comme indiqué ci-dessus.
- Un événement `stream_error` indique que le serveur a détecté un retard ou une autre condition de flux terminal. Torii envoie cet événement une fois et ferme le flux; concilier avant de se reconnecter.
- Un proxy peut tamponner SSE même lorsque Torii ne le fait pas. Désactiver le tamponage et la compression de réponse dans le proxy, et garder `curl -N` dans les diagnostics.
- Ne remplissez jamais une lacune de déconnexion en supposant que l'événement suivant suit le précédent. Le point d'extrémité n'a pas de curseur de répétition; demandez à la place l'état actuel du registre.

## Sources et documents connexes {#source-and-related-docs}

- [JavaScript recette de diffusion à l'aide d'un fichier fixe](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/recipes/streaming.mjs)
- [Tests d'intégration SSE à l'implémentation fixée](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/events/sse_smoke.rs)
- [Parseur Torii FilterExpr à l'accord fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/filter.rs)
- [Torii routage de l'événement à l'engagement fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/src/routing.rs)
- [Les événements](/fr/blockchain/events.md)
- [points d'extrémité Torii](/fr/reference/torii-endpoints.md)
- [État du registre de requête](./query-ledger-state.md)
