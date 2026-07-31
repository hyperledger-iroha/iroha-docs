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

Les transactions entrent dans une file d'attente avant Sumeragi Il les propose dans un bloc.
Les validateurs valident et exécutent indépendamment la proposition, puis ne signent que
Le bloc s'engage après la transition d'état qu'il peut reproduire.
le quorum de validateur est d'accord sur ce résultat et la charge utile correspondante est disponible.

Tout le monde Iroha 3 Les réseaux utilisent les voies de diffusion fiables et la disponibilité des données.
Ce sont des exigences de consensus, pas des fonctionnalités de déploiement facultatives.

## Sumeragi {#sumeragi}

Sumeragi est Iroha Le moteur de consensus byzantin tolérant la faute.
les transactions de la file d'attente, les pairs validateurs sont d'accord sur le même ordre
bloc, et finaliser ce bloc seulement après que suffisamment de validateurs ont
a reproduit le même résultat et signé le certificat d'engagement.

<img :src="withBase('/sumeragi-round-dataflow.svg')" alt="Sumeragi proposal-to-commit data flow" />

### Voie de proposition et d'engagement {#proposal-and-commit-path}

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
le validateur vérifie que la proposition appartient à la chaîne, à la hauteur et à l'échelle attendues;
voir que les signatures et limites des transactions sont valables;
la validation de l'exécuteur est déterministe; et que l'exécution de la charge utile produit
Si le résultat local est différent, le validateur
Le Conseil européen rejette la proposition au lieu de voter pour elle.

Les votes sont des petits messages de consensus signés.
Les collecteurs regroupent ces données dans le tableau de bord.
Le certificat est le certificat d'acceptation de l'établissement du
preuve durable que suffisamment de validateurs ont observé le même résultat pour la même
Le bloc.

### Quorum, collecteurs et observateurs {#quorum-collectors-and-observers}

Le nombre de validateurs du vote `n` Il est important que la Commission élabore une stratégie de révision des dépenses.
les réseaux avec au moins quatre validateurs, le budget est `f = floor((n - 1) / 3)`
et le quorum du comité est `2f + 1`. Pour un à trois validateurs, tous les validateurs
Il s'agit d'un projet de loi qui est nécessaire à l'engagement, ce qui est utile pour le développement mais n'a pas d'effet pratique.
Laissez tomber.

Les collectionneurs sont une optimisation de fanout. Au lieu de chaque validateur envoyer chaque
vote à tous les autres validateurs, Sumeragi peut sélectionner un ou plusieurs collectionneurs pour une
Les collecteurs rassemblent les votes, publient les progrès du quorum et réduisent le nombre d'élections.
Les paramètres de collecteur effectifs sont exposés
à travers `GET /v1/sumeragi/collectors`; le CLI Je suis là .
`ops sumeragi telemetry` Rapport sur le nombre actuel de collectionneurs.

Les pairs observateurs peuvent synchroniser les blocs engagés, mais ils ne proposent pas:
Les membres de la commission des droits de l'homme peuvent être appelés à voter, à recueillir des voix ou à compter pour le quorum du comité.
déploiement nécessite une capacité de requête locale, une indexation, un suivi ou un bloc régional
La réplique sans augmenter le nombre de validateurs de vote.

### Afficher les modifications et récupérer {#view-changes-and-recovery}

Une vue est Sumeragi Une tentative de finaliser une hauteur avec un proposant particulier
Si les propositions, la charge utile, le vote ou l'engagement de progrès sont bloqués, les
Un marqueur de rythme peut déplacer la hauteur vers une vue ultérieure.
modifie la façon dont les validateurs tentent de terminer le non-engagé
hauteur, portant le quorum le plus élevé connu ou en faisant preuve de manière à ce que les pairs
ne finalisent pas les blocs en conflit.

La récupération de la charge utile est séparée de la décision finale.
un quorum ou un certificat d'engagement avant de pouvoir remplir la charge utile totale du bloc.
Dans ce cas, le pair utilise une diffusion fiable (RBC) ou de synchronisation à bloc pour récupérer les
La charge utile est vérifiée par rapport aux haches annoncées, et ne s'applique qu'après
bloc à l'État mondial et Kura.

### Mode de consensus {#consensus-modes}

Le mode sélectionné contrôle la façon dont l'ensemble de validateurs est formé et fonctionne.
est déclaré dans la Genèse par [`consensus_mode`](/fr/reference/genesis.md)
et en configuration par les pairs à travers `sumeragi.consensus_mode`. Traitez-le comme
l'état du réseau: les validateurs ont besoin de la même génèse signée, topologie,
des données de pairs fiables et efficaces Sumeragi les paramètres.

<img :src="withBase('/sumeragi-mode-dataflow.svg')" alt="Sumeragi consensus mode data flow" />

| Mode de fonctionnement         | Le meilleur ajustement                                                                               | Ensemble de validateur                                                                                                      | L'objectif opérationnel                                                                                          |
| ------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Autorisé | Réseaux privés, de consortium et gérés par les opérateurs                                     | Les validateurs proviennent de la topologie de confiance par rapport aux autres approuvés par le déploiement                                            | Gardez tous les validateurs sur la même génèse signée, des pairs de confiance, des clés de pairs, et Sumeragi paramètres          |
| NPOS         | public ou Nexus- les réseaux orientés où la validation suit la politique de nomination et d'engagement | Les validateurs sont sélectionnés selon le profil NPoS, généralement sur plusieurs époques, et nécessitent BLS clés plus preuve de possession | Conserver des instantanés de mise, des paramètres d'époque, validateur PoPs, et les délais de phase NPoS alignés sur le réseau |

::: tip Mode autorisé

Utiliser le mode autorisé lorsque la liste de validateurs est une opération explicite
C'est le point de départ habituel pour les auto-hébergements Iroha réseaux
parce que les changements d'adhésion sont une gouvernance ou un administrateur délibéré
La règle opérationnelle importante est que chaque validateur doit fonctionner avec
la même vision de la génèse, des pairs de confiance, BLS Les preuves de possession et
Sumeragi Paramètres. Un seul homologue avec une topologie différente ou une génèse signée
peut empêcher le réseau de s'engager.

:::

::: tip Mode NPOS

Utiliser le mode NPoS lorsque le profil de déploiement attend la participation du validateur
Les résultats de l'enquête sont basés sur la nomination et l'état des enjeux. SORA Nexus déploiements
Les profils générés par ces derniers comprennent: BLS le validateur
les identités, les preuves de possession, les paramètres d'époque et Sumeragi NPOS
les paramètres nécessaires au démarrage. changements d'époque peuvent remplacer le validateur actif
Les mesures de sécurité sont fixées à des hauteurs définies, de sorte que les opérateurs doivent surveiller à la fois la santé consensuelle et
l'état de mise ou de nomination qui alimente la liste suivante.

:::

## Consensus multilatéral {#multilane-consensus}

Iroha La voie du consensus multilane est mise en œuvre à travers Nexus la voie et
Configuration de l'espace de données. Il ne démarre pas une instance consensus séparée
pour chaque voie. Sumeragi encore finaliser un flux de bloc commandé; voies
décrire la façon dont les transactions sont routées, planifiées, comptabilisées et stockées
à l'intérieur de ce ruisseau.

La configuration de temps d'exécution construit trois éléments de l'état de la voie:

- `lane_catalog`: les voies configurées, chacune avec un chiffre `LaneId`,
  l'alias, l'espace de données, la visibilité, le profil de stockage, le schéma d'épreuve et
  les métadonnées.
- `dataspace_catalog`: les espaces de données configurés, chacun avec une valeur numérique
  `DataSpaceId` et une valeur de tolérance aux défauts utilisée pour le comité de relais
  le taille.
- `routing_policy`: la paire de faisceaux/espaces de données par défaut et le routage ordonné
  des règles pouvant correspondre aux comptes ou aux itinéraires d'instructions.

Lorsqu'une transaction entre dans la file d'attente, le routeur de voie la résout à un
`RoutingDecision { lane_id, dataspace_id }`. En mode simple, c'est
Toujours dans la voie `0` et l'espace de données universel. Nexus mode, le configuré
le routeur applique des règles en fonction de l'espace de données, du routage de règlement, des règles de compte;
les règles de routage explicites, et finalement la route par défaut.
et l'espace de données doit exister dans leurs catalogues, et la voie doit être liée
l'espace de données résolu; autrement, la transaction est rejetée avant sa réalisation
Ils sont en file d'attente.

La file d'attente maintient cette décision de routage avec le hash de transaction afin que
Il n'est pas nécessaire d'en déduire à nouveau les phases ultérieures.
les métadonnées de la voie sont fournies de deux façons:

- Il interrompt les transactions par voie, de sorte qu'une seule voie ne domine pas la
  bloc juste parce que ses transactions ont été mises en file d'attente.
- Il s'applique à l'unité d'exécution des transactions par voie (TEU- les limites.
  les véhicules qui dépasseraient la capacité configurée d'une voie sont reportés et réquisitionnés,
  sauf que la première transaction en surpoids pour une voie peut être admise
  Pour éviter le blocage.

Pendant une diffusion fiable, Sumeragi regroupe la charge utile proposée par voie
Les totaux enregistrés comprennent le nombre de transactions, la diffusion
des blocs, des octets de charge utile et TEU. Après l'engagement, ces totaux deviennent la voie
et des instantanés d'engagement dans le domaine des données exposées à travers Sumeragi le statut.
Le bloc contient des reçus de règlement de la voie, le traitement du bloc crée également une voie
les engagements de règlement et les enveloppes relais qui lient l'en-tête du bloc,
certificat d'engagement, hachage de l'engagement en matière de disponibilité des données, preuve de règlement;
et la taille de la charge utile.

## Diffusion fiable (RBC) {#reliable-broadcast-rbc}

Diffusion fiable (RBC) est Sumeragi La diffusion et la récupération des charges utiles
Il aide les validateurs et les observateurs à obtenir le corps du bloc qui lui appartient
une proposition ou un certificat d'engagement, en particulier lorsqu'une `BlockCreated`
le message, la mise à jour de synchronisation par bloc ou le transfert direct de charge utile est retardé ou perdu.

RBC Le proposant annonce une RBC une séance pour un
bloc hauteur, vue et la charge utile hash, puis envoie des morceaux de charge utile à travers le
Les pairs suivent la réception des pièces, valident la charge utile récupérée
contre le hachage annoncé, et l'échange `READY` et `DELIVER` signaux
Une fois que suffisamment de validateurs ont observé la même charge utile.
par TTL, les dépôts de stockage en vrac, en finition, en stockage pendant et en conservation persistante
Le trafic de récupération ne peut pas croître sans limite.

RBC n'est pas une décision de consensus distincte et ne remplace pas l'engagement
Un bloc ne se termine que lorsque le paire a un engagement valide
le certificat et la charge utile correspondante localement. RBC contribue obligatoirement
Les résultats obtenus par l'OMC et la Commission ont montré que les
le certificat d'engagement plus la charge utile locale.
la charge utile, le paire peut récupérer la charge utile à travers RBC ou synchronisation par bloc et
Alors, engagez-vous.

Opérément, RBC est utile pour diagnostiquer la charge utile manquante et
les problèmes de disponibilité des données:

- `iroha --output-format text ops sumeragi telemetry` montre l'ensemble
  les votes de disponibilité, le nombre actuel de collectionneurs et les résultats en attente RBC les séances.
- `GET /v1/sumeragi/rbc` et `GET /v1/sumeragi/rbc/sessions` exposer des détails
  données agrégées et actives sur les séances Torii, y compris les progrès par morceaux,
  la disponibilité, l'état de livraison et le backlog de la voie ou du espace de données; voir
  [Torii points de fin](/fr/reference/torii-endpoints.md).
- Les signaux de Prométhée tels que `sumeragi_rbc_store_pressure`,
  `sumeragi_rbc_backpressure_deferrals_total`, et par voie ou
  par espace de données RBC Les détecteurs de backlog aident à séparer la perte de réseau,
  la récupération et la pression de stockage; voir
  [Performance et mesures](/fr/guide/advanced/metrics.md).

Kura utilise la configuration de voie dérivée pour la mise en page du stockage.
reçoit des noms de stockage déterministes tels que `blocks/lane_000_core` et
`merge_ledger/lane_000_core_merge.log`; Les changements de cycle de vie des voies peuvent être
Les résultats de l'enquête ont été obtenus par le
Il est bloqué.
