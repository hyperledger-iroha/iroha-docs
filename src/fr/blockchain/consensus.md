---
translation_locale: fr
translation_source: /blockchain/consensus.md
translation_source_hash: a123d79ee6ce9a0bf12cbce91e41fd9e48b27626946b89e0261cdd63d5c66a3a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

<script setup>
import { withBase } from 'vitepress'
</script>

# Consensus

Les transactions entrent dans une file d'attente avant Sumeragi Il les propose dans un bloc.
Les validateurs valident et exécutent indépendamment la proposition, puis ne la signent que
Le bloc s'engage après la transition d'état qu'il peut reproduire.
le quorum de validateur est d'accord sur ce résultat et la charge utile correspondante est disponible.

Tout le monde Iroha 3 réseaux utilisent les voies de diffusion fiables et de disponibilité des données.
Ce sont des exigences de consensus, pas des fonctionnalités de déploiement facultatives.

## Sumeragi

Sumeragi est IrohaLe moteur de consensus byzantin tolérant la faute.
les transactions de la file d'attente, les pairs de validateur sont d'accord sur le même ordre
bloc, et finaliser ce bloc seulement après que suffisamment de validateurs ont
a reproduit le même résultat et a signé le certificat d'engagement.

<img :src="withBase('/sumeragi-round-dataflow.svg')" alt="Sumeragi proposal-to-commit data flow" />

### Voie de proposition et d'engagement

Sumeragi Il fait avancer le registre à une hauteur de bloc à la fois.
Un validateur agit en tant que proposant pour la vision actuelle.
les transactions admissibles à partir de la file d'attente, crée un bloc de candidats et annonce
la proposition de l'ensemble de validateurs actifs.

La même chose Sumeragi Le pipeline est utilisé dans les deux permis et nommé
Les déploiements de preuve d'implication (NPoS):

1. Un validateur propose un blocage des transactions en file d'attente.
2. Les validateurs valident la proposition en exécutant les opérations contre
   le même état mondial.
3. Les validateurs échangent des voix et des certificats de quorum pour la hauteur actuelle
   et la vue.
4. Une fois que le quorum de commande est atteint, les pairs engagent le blocage et la mise à jour
   leur état mondial.

Les validateurs ne signent que les données qu'ils peuvent reproduire localement.
le validateur vérifie que la proposition appartient à la chaîne, à la hauteur et à la hauteur attendues;
voir que les signatures et les limites de la transaction sont valables;
la validation de l'exécuteur est déterministe; et que l'exécution de la charge utile produit
Si le résultat local est différent, le validateur
Le Parlement européen rejette la proposition au lieu de voter pour elle.

Les votes sont de petits messages de consensus signés.
Les collecteurs regroupent ces données dans le tableau de bord.
Le certificat est le certificat d'acceptation de l'établissement d'un
preuve durable que suffisamment de validateurs ont observé le même résultat pour le même
Le bloc.

### Quorum, collecteurs et observateurs

Le nombre de validateurs de vote `n` Il est important que la Commission élabore une stratégie de réforme de l'économie.
les réseaux avec au moins quatre validateurs, le budget est `f = floor((n - 1) / 3)`
et le quorum du comité est `2f + 1`Pour un à trois validateurs, tous les validateurs
Il s'agit d'un projet de loi qui est nécessaire à l'engagement, qui est utile pour le développement, mais qui n'a pas d'effet pratique.
Laissez tomber.

Les collectionneurs sont une optimisation de fanout. Au lieu de chaque validateur envoyer chaque
vote à tous les autres validateurs, Sumeragi peut sélectionner un ou plusieurs collectionneurs pour un
Les collecteurs rassemblent les votes, publient les progrès du quorum et réduisent les
Les paramètres de collecteur effectifs sont exposés
à travers `ops sumeragi collectors` et `/v1/sumeragi/collectors`- Je ne sais pas .

Les pairs observateurs peuvent synchroniser les blocs engagés, mais ils ne proposent pas,
Les membres de la commission de l'information et de l'information ont été invités à voter, à recueillir des voix ou à compter pour le quorum du comité.
déploiement nécessite une capacité de requête locale, une indexation, un suivi ou un bloc régional
La réplique sans augmenter le nombre de validateurs de vote.

### Afficher les modifications et récupérer

Une vue est SumeragiUne tentative de finaliser une hauteur avec un proposant particulier
Si la proposition, la charge utile, le vote ou l'engagement de progrès sont bloqués, les
Un marqueur de rythme peut déplacer la hauteur vers une vue ultérieure.
modifie la façon dont les validateurs tentent de terminer le non-engagé
hauteur, portant le quorum le plus élevé connu ou en faisant des preuves afin que les pairs
ne finalisent pas les blocs en conflit.

La récupération de la charge utile est séparée de la décision finale.
un quorum ou un certificat d'engagement avant d'avoir la charge utile totale du bloc.
cas, le pair utilise une diffusion fiable (RBC) ou une synchronisation de bloc pour récupérer le
La charge utile est vérifiée par rapport aux haches annoncées, et ne s'applique qu'après
Le bloc à l'Etat mondial et Kura.

### Mode de consensus

Le mode sélectionné contrôle la façon dont l'ensemble de validateurs est formé et fonctionne.
est déclaré dans la Genèse par [`consensus_mode`](/reference/genesis.md)
et en configuration par les pairs à travers `sumeragi.consensus_mode`- Traitez-le comme
l'état de l'ensemble du réseau: les validateurs ont besoin de la même génèse signée, topologie,
des données de pairs fiables et efficaces Sumeragi les paramètres.

<img :src="withBase('/sumeragi-mode-dataflow.svg')" alt="Sumeragi consensus mode data flow" />

| Mode de fonctionnement         | Le meilleur ajustement                                                                               | Ensemble de validateur                                                                                                      | L'objectif opérationnel                                                                                          |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Autorisé | Réseaux privés, de consortium et gérés par les opérateurs                                     | Les validateurs proviennent de la topologie de confiance par les pairs convenue par le déploiement                                            | Gardez tous les validateurs sur la même génèse signée, des pairs de confiance, des clés de pairs, et Sumeragi paramètres          |
| NPOS         | Réseaux publics ou axés sur Nexus où la validation suit la politique de nomination et de participation | Les validateurs sont sélectionnés selon le profil NPoS, généralement à travers des époques, et nécessitent des clés BLS plus des preuves de possession | Garder les instantanés des enjeux, les paramètres d'époque, les PoP du validateur et les délais de phase NPoS alignés sur le réseau |

::: tip Mode autorisé

Utiliser le mode autorisé lorsque la liste de validateurs est une opération explicite
C'est le point de départ habituel pour les auto-hébergements Iroha réseaux
parce que les changements d'adhésion sont une gouvernance ou un administrateur délibéré
La règle opérationnelle importante est que chaque validateur doit fonctionner avec
le même point de vue sur la génèse, les pairs de confiance, les preuves de possession du BLS, et
Sumeragi Paramètres. Un seul homologue avec une topologie différente ou une génèse signée
peut empêcher le réseau de s'engager.

:::

::: tip Mode NPOS

Utiliser le mode NPoS lorsque le profil de déploiement attend la participation du validateur
Les résultats de l'enquête sont basés sur la nomination et l'état de la participation. SORA Déploiements de Nexus
utiliser NPoS, et leurs profils générés comprennent le validateur BLS
les identités, les preuves de possession, les paramètres de l'époque, et Sumeragi NPOS
les paramètres nécessaires au démarrage. changements d'époque peuvent remplacer le validateur actif
Les mesures de sécurité sont fixées à des hauteurs définies, de sorte que les opérateurs doivent surveiller à la fois la santé consensuelle et
l'état de mise ou de nomination qui alimente la liste suivante.

:::

## Consensus multilatéral

IrohaLa voie de consensus multilane est mise en œuvre à travers la voie Nexus et
configuration de l'espace de données. Il ne démarre pas une instance consensus séparée
pour chaque voie. Sumeragi encore finaliser un flux de bloc commandé; voies
décrire la façon dont les transactions sont routées, planifiées, comptabilisées et stockées
à l'intérieur de ce ruisseau.

La configuration de temps d'exécution construit trois éléments de l'état de la voie:

- `lane_catalog`: les voies configurées, chacune avec un chiffre `LaneId`Il y en a .
  l'alias, l'espace de données, la visibilité, le profil de stockage, le schéma de preuve, et
  les métadonnées.
- `dataspace_catalog`: les espaces de données configurés, chacun avec un chiffre
  `DataSpaceId` et une valeur de tolérance aux défauts utilisée pour le comité de relais
  le taille.
- `routing_policy`: la paire de faisceaux/espaces de données par défaut et le routage ordonné
  les règles qui peuvent correspondre aux comptes ou aux itinéraires d'instructions.

Lorsqu'une transaction entre dans la file d'attente, le routeur de voie la résout à un
`RoutingDecision { lane_id, dataspace_id }`En mode simple , c' est
Toujours dans la voie `0` Dans le mode Nexus, la configuration
le routeur applique des règles en fonction de l'espace de données, du routage de règlement, des règles de compte,
les règles de routage explicites, et finalement la route par défaut.
et l'espace de données doit exister dans leurs catalogues, et la voie doit être liée à
l'espace de données résolu; autrement, la transaction est rejetée avant sa réalisation
Ils sont en file d'attente.

La file d'attente maintient cette décision de routage avec le hash de la transaction de sorte que
Il n'est pas nécessaire d'en déduire à nouveau les phases ultérieures.
les métadonnées de la voie de deux façons:

- Il interrompt les transactions par voie, de sorte qu'une voie ne domine pas les
  bloc juste parce que ses transactions ont été mises en file d'attente.
- Il applique des limites d'unité d'exécution des transactions par voie (TEU).
  les véhicules qui dépasseraient la capacité configurée d'une voie sont reportés et réquisitionnés,
  sauf que la première transaction en surpoids pour une voie peut être admise
  Pour éviter le blocage.

Pendant une diffusion fiable, Sumeragi regroupe la charge utile proposée par voie
Les totaux enregistrés comprennent le nombre de transactions, la diffusion
Après l'engagement, ces totaux deviennent la voie
et des instantanés d'engagement dans le domaine des données exposés à travers Sumeragi le statut.
Le bloc contient des reçus de règlement de la voie, le traitement du bloc crée également la voie
les engagements de règlement et les enveloppes de relais qui lient l'en-tête de bloc,
certificat d'engagement, hachage de l'engagement de disponibilité des données, preuve de règlement,
et la taille de la charge utile de la voie.

## Diffusion fiable (RBC)

La diffusion fiable (RBC) est Sumeragila diffusion et la récupération de la charge utile
Il aide les validateurs et les observateurs à obtenir le corps du bloc qui lui appartient
une proposition ou un certificat d'engagement, en particulier lorsqu'une `BlockCreated`
le message, la mise à jour de la synchronisation de bloc ou le transfert direct de charge utile est retardé ou perdu.

La RBC travaille au niveau de la charge utile.
bloc hauteur, vue, et la charge utile hash, puis envoie des morceaux de charge utile à travers le
Les pairs suivent la réception des pièces, valident la charge utile récupérée
contre le hachage annoncé, et l'échange `READY` et `DELIVER` signaux
Une fois que suffisamment de validateurs ont observé la même charge utile.
par TTL, par morceau, par finition, par stockage en attente et par stockage persistant
Le trafic de récupération ne peut pas croître sans limite.

La RBC n'est pas une décision de consensus distincte et ne remplace pas l'engagement
Un bloc ne se termine que lorsque le paire a un engagement valide
Le certificat et la charge utile correspondante localement.
Les résultats obtenus par l'OMC et les résultats obtenus par l'OMC
le certificat d'engagement plus la charge utile locale.
la charge utile, le coéquipier peut récupérer la charge utile par RBC ou par synchronisation de bloc et
Alors, engagez-vous.

Sur le plan opérationnel, le RBC est utile pour diagnostiquer la charge utile manquante et
les problèmes de disponibilité des données:

- `iroha --output-format text ops sumeragi rbc status` indique l'ensemble du RBC
  compteurs de session et de débit.
- `iroha --output-format text ops sumeragi rbc sessions` listes actives
  les séances, y compris les progrès par étapes, la préparation, l'état de livraison, et
  l'arrière-plan de la voie/espace de données.
- `GET /v1/sumeragi/rbc` et `GET /v1/sumeragi/rbc/sessions` exposer les
  les mêmes données sur Toriivoir
  [Torii points de fin](/reference/torii-endpoints.md)- Je ne sais pas .
- Les signaux de Prométhée tels que `sumeragi_rbc_store_pressure`Il y en a .
  `sumeragi_rbc_backpressure_deferrals_total`, et par voie ou
  les détecteurs de backlog RBC par espace de données aident à séparer la perte de réseau,
  la récupération et la pression de stockage; voir
  [Performance et mesures](/guide/advanced/metrics.md)- Je ne sais pas .

Kura utilise la configuration de voie dérivée pour la mise en page de stockage.
reçoit des noms de stockage déterministes tels que `blocks/lane_000_core` et
`merge_ledger/lane_000_core_merge.log`; les changements de cycle de vie de la voie peuvent être
Les résultats de l'enquête ont été obtenus par le
Il est bloqué.
