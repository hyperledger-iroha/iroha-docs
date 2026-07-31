---
translation_locale: fr
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Les événements {#events}

Les événements sont émis lorsque certaines choses se produisent au sein de la blockchain, par exemple lorsqu'un nouveau compte est créé ou qu'un bloc est engagé.

- événements du pipeline
- événements de données
- événements dans le temps
- déclenche des événements d'exécution

## Les événements sur le pipeline {#pipeline-events}

Les événements de pipeline sont émis lorsque des transactions sont soumises, exécutées ou engagées sur un bloc. Un événement de pipeline contient les informations suivantes: le type d'entité qui a causé un événement (transaction ou bloc), son hash et son statut. Le statut peut être `Validating` (validation en cours), `Rejected` ou `Committed`. Si une entité a été rejetée, la raison du refus est indiquée.

### Essayez le sur Taira {#try-it-on-taira}

Vérifiez que le flux d'événements du pipeline public est monté:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Pour une capture d'écran que vous pouvez inspecter sans garder un flux ouvert, lisez les transactions récentes de l'explorateur:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Ouvrir la route SSE dans un terminal lorsque vous avez besoin d'événements en direct:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Si aucune transaction n'est déposée pendant que le flux est ouvert, la commande peut rester silencieuse même si la route est saine.

## Événements de données {#data-events}

Les événements de données sont émis lorsqu'il y a une modification liée aux données du registre telles que les pairs, les domaines, les comptes, les actifs, les définitions d'actifs, NFTs, les déclencheurs, les rôles, la configuration sur la chaîne, l'état de l'exécuteur, les preuves, les biens confidentiels, les ponts ou les objets spécifiques à SORA/Nexus. Ces types d'événements sont utilisés dans les filtres [ pour les événements de données ](./filters.md#data-event-filters).

## Les événements du temps {#time-events}

Les événements temporels sont émis lorsque la vue de l'état mondial est prête à gérer les déclencheurs du temps [ ](./triggers.md#time-triggers).

## Événements d'exécution déclencheurs {#trigger-execution-events}

Les événements d'exécution de déclencheur sont émis lorsque l'instruction [`ExecuteTrigger`](./instructions.md#executetrigger) est exécutée.
