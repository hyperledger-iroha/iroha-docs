---
translation_locale: fr
translation_source: /blockchain/consensus.md
translation_source_hash: a4c59672f20f0a3363fdd098852a7e0e8159fa082e88825d6346731733ecdcb0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import { withBase } from 'vitepress'
</script>

# Consensus {#consensus}

Les transactions entrent en file d'attente avant que Sumeragi ne les propose dans un bloc. Les validateurs valident et exécutent indépendamment la proposition, puis signent uniquement l'état de transition qu'ils peuvent reproduire. Un bloc s'engage après que le quorum de validateur requis soit d'accord sur ce résultat et que la charge utile correspondante soit disponible.

Tous les réseaux Iroha 3 utilisent la disponibilité des données et les voies de diffusion fiables. Ce sont des exigences consensuelles, pas des fonctionnalités de déploiement facultatives.

## Sumeragi {#sumeragi}

Sumeragi est le moteur de consensus Byzantine-fault-tolerant de Iroha. Il prend les transactions à partir de la file d'attente, a des pairs de validateurs d'accord sur le même bloc ordonné, et finaliser ce bloc seulement après suffisamment de validateurs ont reproduit le même résultat et signé le certificat d'engagement.

<img :src="withBase('/sumeragi-round-dataflow.svg')" alt="Sumeragi proposal-to-commit data flow" />

### Parcours de proposition et d'engagement {#proposal-and-commit-path}

Sumeragi fait avancer le livre à une hauteur de bloc à la fois. À chaque hauteur, un validateur agit comme proposant pour la vue actuelle. Le proposant draine les transactions admissibles de la file d'attente, construit un bloc candidat et annonce la proposition à l'ensemble de validateurs actifs

Le même pipeline Sumeragi est utilisé à la fois dans les déploiements autorisés et nommés de preuve d'implication (NPoS):

1. Un validateur propose un blocage des transactions en file d'attente.
2. Les validateurs valident la proposition en exécutant les transactions contre le même État mondial.
3. Les validateurs échangent des votes et des certificats de quorum pour la hauteur et la vue actuelles.
4. Une fois que le quorum du comité est atteint, les pairs s'engagent à bloquer et à mettre à jour leur état mondial.

Les validateurs signent uniquement les données qu'ils peuvent reproduire localement. Avant de voter, un validateur vérifie que la proposition appartient à la chaîne, à la hauteur et à la vue attendues; que les signatures et les limites des transactions sont valables; que le routage de voie et la validation de l'exécuteur sont déterministiques; Si le résultat local est différent, le validateur rejette la proposition au lieu de voter pour elle.

Les votes sont des petits messages de consensus signés. Ils se réfèrent au bloc proposé, à la hauteur, à la vue et à l'identité du validateur. Le certificat est la preuve durable qu'un nombre suffisant de validateurs ont observé le même résultat pour le même bloc.

### Quorum, collecteurs et observateurs {#quorum-collectors-and-observers}

Le nombre de validateurs de vote `n` détermine le budget des défauts byzantins. Pour les réseaux avec au moins quatre validateurs, le budget est `f = floor((n - 1) / 3)` et le quorum du comité d'exécution est `2f + 1`. Pour un à trois validateurs, tous les validateurs sont requis pour le commit, ce qui est utile pour le développement mais n'a pas de relâche pratique hors ligne.

Au lieu d'envoyer chaque vote à tous les autres validateurs, Sumeragi peut sélectionner un ou plusieurs collectionneurs pour une hauteur. Les collecteurs rassemblent des votes, publient la progression du quorum et réduisent le trafic de voix en double. Les paramètres de collectionneurs effectifs sont exposés à travers `GET /v1/sumeragi/collectors`; l'imagerie instantanée `ops sumeragi telemetry` du CLI rapporte le nombre actuel de collecteurs.

Les pairs d'observateurs peuvent synchroniser les blocs engagés, mais ils ne proposent pas, ne votent pas, collectent pas de voix ou ne comptent pas vers le quorum du comité. Utilisez des observateurs lorsqu'un déploiement a besoin de capacité de requête locale, d'indexation, de surveillance ou de réplication de bloc régional sans augmenter le nombre de validateurs de vote.

### Afficher les modifications et la récupération {#view-changes-and-recovery}

Un point de vue est la tentative Sumeragi de finaliser une hauteur avec un proposant et un plan de calendrier particulier. Si la proposition, la charge utile, le vote ou l'engagement des progrès interrompt, le pacemaker peut déplacer la hauteur vers un point de vue ultérieur. Il modifie la façon dont les validateurs tentent de terminer la hauteur non engagée, en faisant avancer le quorum le plus élevé connu ou en engageant des preuves afin que les pairs ne finalisent pas les blocs contradictoires.

La récupération de charge utile est séparée de la décision de finalisation. Un paire peut recevoir un quorum ou un certificat d'engagement avant d'avoir la charge utile totale du bloc. Dans ce cas, le paire utilise une diffusion fiable (RBC) ou une synchronisation de bloc pour récupérer la charge utile, la vérifie contre les hashes annoncés, et ne s'applique alors que le bloc à l'État mondial et Kura.

### Les modes de consensus {#consensus-modes}

Le mode sélectionné contrôle la façon dont l'ensemble de validateur est formé et fonctionne. Il est déclaré en génèse par [`consensus_mode`](/fr/reference/genesis.md) et en configuration par les pairs par le biais de `sumeragi.consensus_mode`. Traitez-le comme un état à l'échelle du réseau: les validateurs ont besoin de la même génèse signée, topologie, données partagées fiables et des paramètres Sumeragi efficaces.

<img :src="withBase('/sumeragi-mode-dataflow.svg')" alt="Sumeragi consensus mode data flow" />

|Mode |Le mieux adapté .|Définition du validateur |L' objectif opérationnel |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
|Il est permis .|Réseaux privés, de consortiums et gérés par les opérateurs |Les validateurs proviennent de la topologie de confiance des pairs acceptée par le déploiement |Gardez tous les validateurs sur la même génèse signée, des pairs de confiance, des clés de pair et des paramètres Sumeragi |
|NPOS |Réseaux publics ou orientés vers Nexus où la validation suit une politique de nomination et d' implications |Les validateurs sont sélectionnés selon le profil NPoS, généralement sur plusieurs périodes, et nécessitent des clés BLS plus des preuves de possession |Garder les instantanés des enjeux, les paramètres d'époque, le validateur PoPs et les délais de phase NPoS alignés sur tout le réseau |

::: tip Mode autorisé

Utilisez le mode autorisé lorsque la liste de validateurs est un choix opérationnel explicite. C' est le point de départ habituel pour les auto-hébergements. Iroha les réseaux parce que les changements d'adhésion sont des actions délibérées de gouvernance ou d'administration. La règle d'exploitation importante est que chaque validateur doit fonctionner avec la même vision de la génèse, des pairs de confiance, BLS Des preuves de possession, et Sumeragi Un seul paire avec une topologie différente ou une génèse signée peut empêcher le réseau de s'engager.

:::

::: tip Mode NPOS

Utilisez le mode NPoS lorsque le profil de déploiement s'attend à ce que la participation du validateur soit motivée par la nomination et l'état des enjeux. Les déploiements publics SORA Nexus utilisent NPoS, et leurs profils générés comprennent les identités du validateur BLS, les preuves de possession, les réglages d'époque, et Sumeragi paramètres NPoS nécessaires au démarrage. Les changements d'époque peuvent remplacer le validateur actif réglé à des hauteurs définies, de sorte que les opérateurs doivent surveiller la santé du consensus et l'état de mise ou de nomination qui alimente la liste suivante.

:::

## Un consensus multilatéral {#multilane-consensus}

Le chemin de consensus multilane Iroha est mis en œuvre via la configuration Nexus voie et espace de données. Il ne démarre pas une instance de consensus séparée pour chaque voie. Sumeragi conclut toujours un flux de blocs commandé; les voies décrivent comment les transactions sont routées, planifiées, comptabilisées et stockées à l'intérieur de ce flux.

La configuration de temps d'exécution construit trois éléments de l'état de la voie:

- `lane_catalog`: les voies configurées, chacune avec un code numérique `LaneId`, alias, espace de données, visibilité, profil de stockage, schéma de preuve et métadonnées.
- `dataspace_catalog`: les espaces de données configurés, chacun avec une valeur numérique `DataSpaceId` et une valeur de tolérance aux défauts utilisée pour la taille des comités de relais.
- `routing_policy`: la paire voie/espace de données par défaut et les règles de routage commandées pouvant correspondre aux comptes ou aux chemins d'instructions.

Lorsqu'une transaction entre dans la file d'attente, le routeur de voie la résout à un `RoutingDecision { lane_id, dataspace_id }`. En mode simple, c'est toujours une voie `0` et l'espace de données universel. En mode Nexus, le routeur configuré applique des règles à l'échelle de l'espace de données, un routage de règlement, des règles de compte, des règles explicites de routage et enfin la route par défaut. La voie résolue et l'espace de données doivent exister dans leurs catalogues, et la voie doit être liée à l'escale de données résolue; autrement, la transaction est rejetée avant qu'elle ne soit mise en file d'attente.

La file d'attente conserve cette décision de routage avec le hash de la transaction afin que les étapes ultérieures n'aient pas à l'en déduire à nouveau.

- Il interrompt les transactions par voie de sorte qu'une seule voie ne domine pas le bloc simplement parce que ses transactions ont été mises en file d'attente.
- Il applique des limites de l'unité d'exécution des transactions par voie (TEU). Les transactions qui dépasseraient la capacité configurée d'une voie sont reportées et réquisitions, sauf que la première transaction en surpoids pour une voie peut être admise afin d'éviter le blocage à vie.

Pendant la diffusion fiable, Sumeragi l'ensemble de la charge utile proposée par voie et espace de données. les totaux enregistrés comprennent le nombre de transactions, les fractions de diffusion, octets de charge utile, et TEU. Après l'engagement, ces totaux deviennent les instantanés d'engagement de la voie et de l'espace de données exposés à travers Sumeragi Si un bloc contient des reçus de règlement de la voie, le traitement du bloc crée également des engagements et relais en matière de règlement de voie. les enveloppes qui lient l'en-tête de bloc, le certificat d'engagement, le hachage des engagements sur la disponibilité des données, la preuve de règlement; et la taille de la charge utile.

## Diffusion fiable (RBC) {#reliable-broadcast-rbc}

La diffusion fiable (RBC) est le chemin de diffusion et de récupération de la charge utile de Sumeragi. Elle aide les validateurs et les observateurs à obtenir l'organisme du bloc qui appartient à une proposition ou un certificat d'engagement, en particulier lorsqu'un message `BlockCreated`, une mise à jour de synchronisation de bloc ou un transfert direct de charge utile sont retardés ou perdus.

RBC fonctionne au niveau de la charge utile. Le proposant annonce une session RBC pour un hash de hauteur de bloc, de vue et de charge utile, puis envoie des blocs de charge utile à travers la topologie commit. Les pairs suivent la réception des pièces, valident la charge utile récupérée contre le hash annoncé et échangent les signaux `READY` et `DELIVER` une fois que suffisamment de validateurs ont observé la même charge utile. Les séances sont limitées par TTL, par morceau, fanout, stock en attente et limites de magasin persistantes, de sorte que le trafic de récupération ne peut pas croître sans limite.

RBC n'est pas une décision de consensus distincte et ne remplace pas le certificat d'engagement. Un bloc ne se termine toujours que lorsque le coéquipier dispose d'un certificat de l'engagement valide et de la charge utile correspondante localement. RBC contribue à la preuve obligatoire de disponibilité et à la récupération des charges utiles, tandis que les progrès du commit sont motivés par le certificat commit plus la charge utile locale. Si le certificat arrive avant la charge utile, le coéquipier peut récupérer la charge utile par l'intermédiaire de RBC ou d'une synchronisation de bloc et ensuite s'engager.

Sur le plan opérationnel, RBC est utile pour diagnostiquer les goulots d'étranglement en matière de charge utile manquants et de disponibilité des données:

- `iroha --output-format text ops sumeragi telemetry` indique les votes de disponibilité agrégés, le nombre actuel de collecteurs et les sessions RBC en attente.
- `GET /v1/sumeragi/rbc` et `GET /v1/sumeragi/rbc/sessions` exposer des données agrégées détaillées et actives sur les séances Torii, y compris la progression partielle, la préparation, l'état de livraison et l'arriéré des files d'attente ou des espaces de données; voir [Torii points d'expiration](/fr/reference/torii-endpoints.md).
- Les signaux Prometheus tels que `sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total`, et les détecteurs de backlog par voie ou par espace de données RBC aident à séparer la perte de réseau, la récupération des pièces et la pression de stockage; voir [Performance et métriques](/fr/guide/advanced/metrics.md).

Kura utilise la configuration de voie dérivée pour la mise en page du stockage. Chaque voie reçoit des noms de stockage déterministes tels que `blocks/lane_000_core` et `merge_ledger/lane_000_core_merge.log`; les modifications du cycle de vie de la voie peuvent fournir, retirer ou réétiqueter ces segments sans modifier l'ordre global des blocs.
