---
translation_locale: fr
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les événements

Les événements sont émis lorsque certaines choses se produisent dans la blockchain, par exemple un
un nouveau compte est créé ou un bloc est engagé.
des événements:

- événements du pipeline
- événements de données
- événements dans le temps
- déclencher des événements d'exécution

## Les événements du pipeline

Les événements du pipeline sont émis lorsque des transactions sont soumises, exécutées ou
Un événement de pipeline contient les informations suivantes:
le type d'entité qui a causé un événement (transaction ou bloc), son hash
Le statut peut être `Validating` (validation en cours),
`Rejected`ou `Committed`Si une entité a été rejetée, la raison de la
le rejet est prévu.

### Essayez sur Taira.

Vérifiez que le flux d'événements du pipeline public est monté:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Pour une photo d'instant vous pouvez inspecter sans garder un courant ouvert, lire récemment
les opérations d'explorateur:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Ouvrez la route SSE dans un terminal lorsque vous avez besoin d'événements en direct:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Si aucune transaction n'est soumise pendant que le flux est ouvert, la commande peut rester
C'est calme, même si la route est saine.

## Événements de données

Les événements de données sont émis lorsqu'il y a une modification liée aux données du registre telles que:
comme pairs, domaines, comptes, actifs, définitions d'actifs, NFT, déclencheurs,
les rôles, la configuration en chaîne, l'état de l'exécuteur, les preuves, les actifs confidentiels,
des ponts, ou SORALes objets spécifiques au Nexus.
[Filtres d'événements de données](./filters.md#data-event-filters)- Je ne sais pas .

## Les événements du temps

Les événements du temps sont émis lorsque la vision du monde est prête à gérer
[déclencheurs de temps](./triggers.md#time-triggers)- Je ne sais pas .

## Événements d'exécution déclencheurs

Les événements d'exécution du déclencheur sont émis lorsque le
[`ExecuteTrigger`](./instructions.md#executetrigger) les instructions sont
Les événements d'achèvement du déclencheur sont émis après une action du déclencheur
Il finit.
