---
translation_locale: fr
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les événements {#events}

Les événements sont émis lorsque certaines choses se produisent dans la blockchain, par exemple un
Un nouveau compte est créé ou un bloc est engagé.
des événements:

- événements du pipeline
- événements de données
- événements dans le temps
- déclencher des événements d'exécution

## Les événements du pipeline {#pipeline-events}

Les événements du pipeline sont émis lorsque des transactions sont soumises, exécutées ou
Un événement de pipeline contient les informations suivantes:
le type d'entité qui a causé un événement (transaction ou bloc), son hash
Le statut peut être `Validating` (validation en cours),
`Rejected`, ou `Committed`. Si une entité a été rejetée, la raison
le rejet est prévu.

### Essayez-le . Taira {#try-it-on-taira}

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

Ouvrez le SSE Route dans un terminal lorsque vous avez besoin d'événements en direct:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Si aucune transaction n'est soumise pendant que le flux est ouvert, la commande peut rester
C'est calme, même si la route est saine.

## Événements de données {#data-events}

Les événements de données sont émis lorsqu'il y a une modification liée aux données du registre telles que:
en tant que pairs, domaines, comptes, actifs, définitions d'actifs, NFTs, des déclencheurs,
les rôles, la configuration en chaîne, l'état de l'exécuteur, les preuves, les actifs confidentiels,
des ponts, ou SORA/Nexus Ces types d'événements sont utilisés dans
[Filtres d'événements de données](./filters.md#data-event-filters).

## Les événements du temps {#time-events}

Les événements du temps sont émis lorsque la vision de l'état mondial est prête à gérer
[déclencheurs de temps](./triggers.md#time-triggers).

## Événements d'exécution déclencheurs {#trigger-execution-events}

Les événements d'exécution du déclencheur sont émis lorsque le
[`ExecuteTrigger`](./instructions.md#executetrigger) les instructions sont
Les événements d'achèvement du déclencheur sont émis après une action de déclenchement
Il finit.
