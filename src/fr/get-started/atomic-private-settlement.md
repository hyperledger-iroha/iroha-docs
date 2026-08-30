---
translation_locale: fr
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: 18b5e9c80bfa5542b996548fd07603a311099f76a4443cf143cd959991f80dc3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Exécuter la réglementation de l'espace des données privée atomique {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1` coordonne une étape de règlement confidentiel dans chacun des espaces de données 2 à 255 SORA Nexus et conclut chaque étape dans une transaction d'état mondial. Un paquet rejeté, expiré ou annulé n'applique aucune étape. Transparent Native AMX DvP/PvP reste un chemin de protocole séparé.

::: warning L'état de sortie Cette fonction est régie, désactivée par défaut,
Ne pas l'activer pour une valeur réelle CBDC jusqu'à ce que les portes de publication fonctionnelle, confidentialité, défaut, performance, construction reproduisable, critique cryptographique indépendante et artefact-publication publiées aient toutes passé pour la libération exacte.

## Ce que le protocole cache {#what-the-protocol-hides}

Chaque étape utilise une preuve privée de deux entrées fixes, trois sorties. Les validateurs du comité vérifient la preuve et une transition d'état opaque; ils ne reçoivent pas les parties claires du texte, l'actif, le montant, la note ou le résultat commercial. Un auditeur local autorisé décrypte la capsule d'audit rembourrée, vérifie ce contenu et signe une approbation séparée de l'objectif.

Le transporteur public et le reçu révèlent délibérément:

- les identifiants de réseau et de paquet
- les itinéraires de l'espace de données des participants et le nombre de participants
- délais et hauteurs d'expiration
- des identifiants de pool opaques stables, des racines, des annulateurs, des engagements et des espaces fixes pour le texte cryptographique
- les autorités du comité et la disponibilité exacte des certificats 3 sur 4, préparer et commettre.
- sponsor, redevance de réseau public et statut du terminal

Il s'agit de confidentialité du contenu, pas d'anonymat des flux de trafic. Le timing, le nombre de participants, l'identité de l'espace de données et l'activité stable-pool restent publics. Un espace de données qui héberge seulement un CBDC peut également rendre l'actif inférieur à la route même si aucun identifiant d'actif littéral n'est publié.

## Les exigences en matière de déploiement {#deployment-requirements}

Avant l'activation, les opérateurs ont besoin de tout ce qui suit:

1. exactement quatre validateurs pour chaque espace de données participant, avec des clés de consensus distinctes BLS et des preuves de possession
2. obligatoire Sumeragi DA/RBC activé pour chaque hauteur
3. un pool de règlement confidentiel réglementé et une racine initiale dans chaque espace de données
4. une capacité active V1 de notes privées et le profil séparé de preuve de règlement;
5. au moins un local réglementé `PrivateSettlementAuditPolicyV1`, y compris des clés distinctes de signature d'auditeur et de cryptage hybride, une époque clé, une validité à hauteur et un seuil d'approbation
6. un stockage privé suffisant pour la période de conservation configurée
7. un compte parrain neutre capable de soumettre le transporteur public final

Un auditeur peut également utiliser un validateur, mais doit utiliser des clés séparées de consensus, de signature d'auditeur et de cryptage d'audit. Gardez les clés de décryptage retirées pour la période de conservation réglementaire, ou réglez et réenroulez la capsule d'essai avant de les retirer.

L'autorité des quatre validateurs est ancrée dans l'état et non fournie par le client. Dans le manifeste `authority_context_height`, chaque validateur résout la liste exacte ordonnée de voie/espace de données et l'incarnation active de voie depuis l'état de consensus, exige la hauteur résolue pour correspondre et vérifie les quatre clés BLS et des preuves de possession. téléchargement, préparation et réception finale d'admission utilisent tous cette même autorité historique.

## Configurer l'admission {#configure-admission}

Tout le comportement de production provient de la configuration du nœud. Les variables environnementales ne peuvent pas activer ce chemin. Le paramètre par défaut envoyé est `enabled = false`; la désactivation de la fonctionnalité ne nécessite aucune configuration spécifique au règlement.

Une fois que la gouvernance a enregistré la capacité requise et choisi une hauteur d'activation avec un avis adéquat, configurer chaque nœud pertinent de manière cohérente:

```toml
[nexus.atomic_private_settlement]
enabled = true
activation_height = 500000
minimum_activation_notice_blocks = 7200
proof_profile_version = 1
max_participants = 255
max_expiry_blocks = 7200
audit_timeout_blocks = 1200
prepare_timeout_blocks = 1200
commit_timeout_blocks = 1200
capsule_padding_classes_bytes = [4096, 16384, 65536, 262144]
max_proof_bytes = 8388608
max_capsule_bytes = 1048576
max_carrier_bytes = 4194304
sidecar_retention_blocks = 1000000
sidecar_max_records = 256
sidecar_max_total_bytes = 3221225472
default_min_auditor_approvals = 1
permitted_policy_versions = [1]
```

L'exemple utilise les limites expédiées V1, et non une recommandation de performance. le matériel prévu avant de choisir les limites d'exploitation. Les trois délais de phase doivent s'intégrer à l'intérieur `max_expiry_blocks`, et la rétention du sidecar doit être au moins cette fenêtre d'expiration.

`max_capsule_bytes` limite le codage canonique Norito de l'ensemble `PrivateSettlementAuditCapsuleV1`: AAD, nonce, texte chiffré, encadrement vectoriel, identités d'auditeur et chaque ligne enveloppée-DEK. Il ne s'agit pas d'une limite seulement pour le texte chiffré. Chaque classe de rembourrage configurée doit s'adapter à l'enveloppe entière conservatrice pour au moins `default_min_auditor_approvals` auditeurs. Torii rejette également une politique nouvellement admise dont `min_approvals` est inférieur à ce plancher réglementé, et rejette toute capsule réelle dont le codage canonique complet est trop grand.

`max_carrier_bytes` limite l'ensemble de la transaction canonique signée par le sponsor, pas seulement le paquet certifié. Le compte comprend le cadre d'instructions enregistré, l'autorité de transaction et les métadonnées, l'intention des frais et la signature. Les limites ordinaires des transactions réseau s'appliquent toujours comme une limite supérieure indépendante.

L'activation n'est pas fermée à moins que la capacité réglée soit active, son état et ses hauteurs d'activation ne remplissent le délai de préavis; le profil de preuve compilé correspond à V1, et la base de données en chaîne et les dossiers d'audit sont actuels. Il ne suffit pas d'activer le drapeau de configuration seul.

## Flux de travail de règlement {#settlement-workflow}

Le client construit des preuves et des capsules cryptées localement. Les témoins secrets doivent rester dans le portefeuille natif ou le travailleur natif; ne pas les sérialiser en journaux d'applications, Python objets, HTTP requêtes, ou enregistrements de coordination durables.

Les données authentifiées par capsule et par auditeur DEK comprennent le résumé exact du comité ancré par l'État et `authority_context_height`, ainsi que le réseau, l'itinéraire/l'incarnation, le paquet, la étape, la politique, l'époque clé et l'engagement du texte clair. Une clé enveloppée ne peut pas être déplacée vers une liste ou un contexte d'autorité historique différent.

Pour chaque étape canonique, le coordonnateur effectue ensuite cette séquence:

1. Télécharger le matériel crypté provisoire sur les quatre validateurs et obtenir un certificat de disponibilité exact canonique 3 sur 4.
2. Faites en sorte qu'un auditeur autorisé récupère et déchiffre sa capsule, recalcule les obligations publiques, applique la politique locale et soumette une approbation.
3. Requête Préparez les votes des quatre validateurs. Chaque validateur vérifie indépendamment et étape durablement le delta avant de voter. Persistez le certificat canonique 3 sur 4 Préparez sur chaque répondant stagé.
4. Une fois que chaque jambe a un certificat de préparation, construisez la barrière complète immutable de préparation. Demandez et persistez des certificats canoniques 3 sur 4 Commit. Si le coordinateur redémarre, interrogez les nœuds participants sur leurs certificats Prepare et Commit stockés durablement en local, sélectionnez un certificat canonique équivalent au quorum et redistribuez-le avant de poursuivre ; ne reconstruisez jamais un certificat à partir d’un cache local non authentifié.
5. Prenez la signature du sponsor manifeste et soumettez exactement un transporteur mondial. Le transporteur contient une instruction `FinalizeAtomicPrivateSettlementV1` et le paquet certifié complet exact. Coordinateur et WSV avant vol mesurer l'instruction de finalisation complète en boîte, y compris l'encadrement enregistré des instructions. Torii et l'obligation obligatoire du transporteur principal à un seul coup `max_carrier_bytes` sur la transaction canonique exacte signée par le sponsor, y compris l'autorité, les métadonnées, l'intention des frais et la signature Torii rejette un transporteur avant le contexte de son autorité, à ou après la dernière hauteur d'entrée susceptible d'atteindre l'échéance finale, ou au-delà de la période d'expiration régie.
6. Demandez l'état du paquet public et la réception jusqu'à la finalisation globale. Traiter l'état local de la voiture secondaire comme provisoire jusqu'à ce qu'il réconcilie cet immutable record mondial du terminal.

Le client Rust expose ce flux par des méthodes comprenant `certify_and_upload_private_settlement_legs_v1`, `prepare_private_settlement_bundle_v1`, `commit_private_settlement_bundle_v1` et `submit_private_settlement_bundle_v1`. La coordination résistante aux redémarrages utilise `recover_or_prepare_private_settlement_bundle_v1` et `recover_or_commit_private_settlement_bundle_v1`. Les appels au comité et à l'auditeur exigent des identifiants explicites de rôle; ils ne réutilisent pas le signataire ordinaire du compte.

## Retourner une politique d'audit en toute sécurité {#rotate-an-auditor-policy-safely}

Utilisez l'instruction `RotatePrivateSettlementPoolPolicyV1` autorisée par la gouvernance en matière de protection des renseignements personnels. Elle doit nommer le digeste exact actuel de gouvernances, conserver le même itinéraire, le même pool et l'engagement liant les actifs, faire avancer la révision de la gouvernabilité d'une seule fois, utiliser une époque clé strictement plus récente et différents digests politiques/gouvernance; et activer au bloc qui contient la rotation. La limite du bassin, les racines, les annulateurs, les sorties, les ensembles de répétition et les reçus finaux sont conservés. N'incluez pas un reçu touchant cette même route/bassin à la hauteur d'activation du tour; l'instruction rejette cette limite.

La projection public conserve la lignée complète de révision des politiques remplacée. Un reçu finalisé avant la rotation reste donc valable après le redémarrage, et la reproduction de ce reçu exact demeure indépendant. La lignée n'autorise pas les travaux inachevés: tout ensemble de vieilles politiques qui traverse la limite d'activation échoue à fermer avant les changements de l'état global. Conservez toutes les anciennes clés de décryptage nécessaires pour ouvrir les capsules stockées, ou remplir une capsule contrôlée et testée avant de la détruire.

## La famille des routes Torii {#torii-route-family}

Ces routes utilisent des objets de requête et de réponse canoniques Norito. Les réponses authentifiées et restreintes utilisent un comportement caché privé `no-store`.

|Opération |La méthode et le parcours|Le directeur |
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
|Charger la jambe |`POST /v1/nexus/private-settlements/legs` |signature du compte canonique |
|Partie de disponibilité |`POST /v1/nexus/private-settlements/legs/availability-shares` |signature du compte canonique |
|Préparez le vote |`POST /v1/nexus/private-settlements/phases/prepare-votes` |signature du compte canonique |
|Committez votre vote |`POST /v1/nexus/private-settlements/phases/commit-votes` |signature du compte canonique |
|La phase persistante QC |`POST /v1/nexus/private-settlements/phases/certificates` |signature du compte canonique |
| Récupérer les QCs de phase | `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` | défenseur manifeste |
|L' état des jambes |`GET /v1/nexus/private-settlements/legs/{payload_digest}/status` |signature du compte canonique |
|La preuve du comité |`GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof` |validateur de liste exacte |
|Capsule de vérification |`GET /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule` |auditeur régi |
|Approbation du vérificateur |`POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals` |auditeur régi |
|Envoyer le paquet |`POST /v1/nexus/private-settlements/bundles` |défenseur manifeste |
|Statut du paquet |`GET /v1/nexus/private-settlements/bundles/{bundle_id}` |le public |
|Réception ou annulation |`GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt` |le public |

Le statut public et le reçu APIs exposent uniquement les champs publics documentés, en particulier l'état ordinaire de la jambe ne révèle pas le nombre d'approbations ou les Les lectures restreintes font délibérément défaut de matériel manquant, non autorisé et expiré dans la même classe de réponse indisponible.

## L'échec et la récupération {#failure-and-recovery}

Les approbations des auditeurs manquantes ou périmées, moins de trois votes validateurs, les racines ou les époques erronées, les annulateurs dupliqués, les preuves ou capsules remplacées, l'ordre non canonique des étapes, les paquets expirés et les conditions de remboursement inégalées échouent avant la mutation mondiale. Les certificats d'engagement ne changent jamais l'état privé.

Les validateurs synchronisent les voitures latérales, les delta en scène et les certificats de phase avant de les reconnaître. Lors du redémarrage, ils reconstruisent les réservations à partir d'enregistrements canoniques durables, puis réconcilient des reçus globaux immuables, des marqueurs d'annulation ou de l'expiration. Le réconciliateur supervisé effectue également une taille de retenue terminale à la hauteur autorisée observée en synchronisation, même s'il n'y a pas de candidat terminal à réconcilier. Il s'agit d'un enregistrement terminal global autorisé qui libère des serrures en scène.

L'identité de la réservation comprend l'itinéraire complet. Utilisation des têtes de piscine `(route, pool_id, epoch, root)`, l'utilisation des annulateurs `(route, pool_id, nullifier)`, et utilisation des sorties `(route, pool_id, commitment)`. Les valeurs opaques égales sur une autre route sont indépendantes; une collision de la route exacte reste bloquée au cours du redémarrage.

Les alertes opérationnelles ne devraient utiliser que des champs opaques de paquet, de route, de phase, de digestion, d'altitude et de classe raison. Ne jamais placer des capsules déchiffrées, des identifiants de compte ou d'actifs, des montants, des mémoires, des données d'affichage, des témoins de preuve ou des charges utiles du parseur dans les journaux, les événements, les étiquettes métriques ou les intervalles de suivi.

## Qualification avant la valeur réelle {#qualification-before-real-value}

Pour la construction et la configuration exactes que vous avez l'intention de déployer, archivez les preuves qui couvrent:

- preuve d'adversité, capsule, politique, rotation des clés, remboursement et cas de répétition
- processus réels à quatre validateurs pour les bases de données 2, 3, 4, 8 et 16, y compris le redémarrage du validateur et du coordonnateur, la perte d'authentification des messages de 5%, 10% et 20%, les partitions de phase, la récupération et les pannes aux limites de persistance;
- analyse des fuites canariennes et différentielles à travers Torii, P2P, blocs, Kura, instantanés, requêtes, événements, journaux et télémétrie.
- au moins cinq réchauffements et trente paquets mesurés par nombre de participants au réseau réel, avec p50, p95, p99, intervalles de confiance, ressources, trafic, tailles de preuve et reçus, et transparent AMX comme contrôle.
- Tests rigoureux de l'espace de travail, vérification des liens et du format, semences randomisées, trempage, constructions reproductibles, SBOMs, et hashs d'artefacts signés
- les deux couches formelles: les vérifications de simétrie du comptage des 3/255 pieds et l'indexation exacte par comité de quatre validateurs N=2 axée sur le validateur plus une faille entièrement limitée, la faille primaire en papier N=3, la configuration d'expiration / répétition nette N=4 et N=3, avec un budget de défaillance indépendant par comité.
- révision indépendante de la relation de preuve, des sélecteurs de machines à sous, des liaisons entre les actifs et les capsules, la relation de remboursement, la cryptographie et la machine d'état de l'espace cross-data

Publier la preuve brute et désinfectée, le modèle de menace, l'argument du protocole, les limitations, l'engagement ID, une description du matériel et des rapports d'audit dans un format immutable DOI Les tests de dépôt seuls ne transforment pas la caractéristique en un objet qualifié pour une production CBDC système de règlement.

Chaque échantillon de défaut brut et d'échantillon de latence doit lier le débit complet de la libération, le SHA-256 d'une description structurée du matériel fiché, et le SHA-256 de sa configuration exacte du nombre de participants. Archiver un manifeste de configuration canonique couvrant N=2,3,4,8,16; chaque entrée doit faire référence aux octets de configuration conservés et affirmer exactement quatre validateurs par espace de données, un quorum de 3 sur 4 et une signature obligatoire RS16 DA/RBC. Le vérificateur de sortie rejette les résumés produits sur une construction, un profil matériel ou une configuration réseau différente. Chaque ligne de perte individuelle, de coupure de phase et de collision de persistance doit également nommer des références d'enregistrement exactes JSONL non réutilisables à l'échelle mondiale à l'intérieur de SHA-256 liées les artefacts du contrôleur authentifié et de la capture d'atomisation. Le vérificateur de dégagement résout ces digestions et exige que les lignes correspondent à l'identité d'exécution, à l'indice et aux paramètres d'essai, au résultat de reconnaissance ou de récupération du contrôleur, au nombre continu de vérifications; Les comparaisons de version ultérieure p95/p99 rejettent également une ligne de base signée dont le matériel, les configurations ou les exigences de mesure diffèrent du candidat. Le vérificateur final régénère tous les percentiles déclarés, MADs, et les intervalles de confiance déterministes à partir des échantillons bruts archivés au lieu de se fier à un résumé détaché d'un indice de référence. Il recharge également le manifeste canarien et scanne indépendamment chaque surface de confidentialité archivée, de sorte qu'un rapport ne peut pas supprimer un accès secret planté après avoir relié les fichiers digérés. L'archive doit également inclure un manifeste de paire différentielle canonique liant les chemins exacts du fichier gauche et droit, les types, la longueur des octets et SHA-256 pour chaque surface de confidentialité requise. Ses racines déclarées doivent contenir exactement l'inventaire d'archives en couple. Le vérificateur final exige indépendamment des tailles égales et recompte les formes publiques JSON, de sorte qu'une fuite structurelle de la même taille ou un fichier différentiel non couplé ne peut pas être caché en réécrivant le rapport sur la fuite.
