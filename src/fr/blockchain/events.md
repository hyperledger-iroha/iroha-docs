---
translation_locale: fr
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Événements {#events}

Des événements sont émis lorsque certaines actions se produisent au sein de la blockchain, par exemple la création d'un nouveau compte ou la validation d'un bloc. Il existe différents types d'événements :

- traitement des événements du pipeline
- événements de données
- événements temporels
- déclencher des événements d'exécution

## Événements du pipeline de traitement {#pipeline-events}

Les événements du pipeline de traitement sont émis lorsque des transactions sont soumises, exécutées ou validées dans un bloc. Un événement du pipeline de traitement contient les informations suivantes : le type d'entité qui a causé un événement (transaction ou bloc), son empreinte cryptographique et son statut. Le statut peut être soit `Validating` (validation en cours), `Rejected`, ou `Committed`. Si une entité a été rejetée, la raison du rejet est fournie.

### Essayez-le sur Taira {#try-it-on-taira}

Vérifiez que le flux d'événements du pipeline de traitement public est monté :

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Pour une vue des données à un moment donné que vous pouvez consulter sans garder un flux ouvert, lisez les transactions récentes de l'explorateur :

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Ouvrez le chemin SSE dans un terminal lorsque vous avez besoin d'événements en direct :

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Si aucune transaction n'est soumise pendant que le flux est ouvert, la commande peut rester silencieuse même si le chemin est sain.

## Événements de données {#data-events}

Les événements de données sont émis lorsqu'il y a un changement lié aux données du grand livre blockchain telles que les pairs du réseau, les domaines, les comptes, les actifs, les définitions d'actifs, NFTs, les déclencheurs, rôles, configuration on-chain, état de l'exécuteur, preuves, actifs confidentiels, ponts, ou objets spécifiques à SORA/Nexus. Ces types d'événements sont utilisés dans [filtres d'événements de données](./filters.md#data-event-filters).

## Événements temporels {#time-events}

Les événements temporels sont émis lorsque la vue de l'état du monde est prête à gérer [déclencheurs de temps](./triggers.md#time-triggers).

## Déclencher des événements d'exécution {#trigger-execution-events}

Des événements d'exécution de déclencheur sont émis lorsque le [`ExecuteTrigger`](./instructions.md#executetrigger) L'instruction est exécutée. Les événements de complétion de déclenchement sont émis après qu'une action de déclenchement est terminée.
