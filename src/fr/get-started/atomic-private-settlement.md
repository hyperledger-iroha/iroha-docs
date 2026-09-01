---
translation_locale: fr
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: d4c2c1a4e29e0352ac20be5320f79a2686527d55a19d65a6154aedcd63fa447e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Exécuter un règlement privé atomique inter-espaces de données {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1` coordonne un transfert confidentiel d'un règlement dans chacun des 2 à 255 SORA Nexus espaces de données et finalise chaque étape dans un état global transaction. Un lot rejeté, expiré ou annulé n'applique aucune étape. Transparent Native AMX DvP/PvP reste un chemin de protocole distinct.

::: warning Statut de publication
Cette fonctionnalité est régie, désactivée par défaut et pas encore qualifiée pour la production. Ne l'activez pas pour une valeur réelle CBDC tant que la fonctionnalité publiée les contrôles de confidentialité, de faute, de performance, de reconstruction reproductible, de révision cryptographique indépendante et de publication d'artefacts ont tous été réussis pour la version exacte.
:::

## Ce que le protocole cache {#what-the-protocol-hides}

Chaque volet utilise une preuve de note privée à deux entrées et trois sorties fixe. Les validateurs du comité vérifient la preuve et une transition d'état opaque ; ils ne reçoivent pas les parties en clair, l'actif, le montant, le mémo ou le résultat commercial. Un auditeur local autorisé déchiffre la capsule d'audit remplie, vérifie ces contenus et signe une approbation à usage séparé. La politique par défaut accepte une approbation provenant de l'ensemble des auditeurs régulés.

La transaction porteuse publique et le reçu révèlent délibérément :

- les identifiants de réseau et de groupe
- routes de l’espace de données des participants et nombre de participants
- hauteurs de synchronisation et d'expiration
- identifiants de pool opaques stables, racines, annulatoires, engagements et emplacements de texte chiffré fixes
- principes d'autorisation du comité et disponibilité exacte de 3 sur 4, certificats Préparer et Engager
- parrain, frais de réseau public et état du terminal

Il s'agit de la confidentialité du contenu, pas de l'anonymat du flux de trafic. Le moment, le nombre de participants, l'identité de l'espace de données et l'activité du pool stable restent publics. Un espace de données qui héberge un seul CBDC peut également rendre l'actif inférable à partir de l'itinéraire même si aucun identifiant d'actif littéral n'est publié.

## Exigences de déploiement {#deployment-requirements}

Avant l'activation, les opérateurs ont besoin de tout ce qui suit :

1. exactement quatre validateurs pour chaque espace de données participant, avec des clés de consensus BLS distinctes et des preuves de possession
2. obligatoire Sumeragi DA/RBC activé pour chaque hauteur
3. un pool de règlement confidentiel gouverné et une racine initiale dans chaque espace de données
4. une capacité de note privée V1 active et le profil de preuve de règlement séparé
5. au moins un `PrivateSettlementAuditPolicyV1` local gouverné, incluant la signature d'auditeur distincte et les clés de chiffrement hybride, une époque de clé, la validité en hauteur et un seuil d'approbation
6. suffisamment de stockage d'enregistrements auxiliaires privés pour la période de conservation configurée
7. un compte de sponsor neutre capable de soumettre la transaction porteuse publique finale

Un auditeur peut également exploiter un validateur, mais doit utiliser des clés distinctes pour le consensus, la signature d'auditeur et le chiffrement d'auditeur. Conservez les clés de déchiffrement mises hors service pendant la période de conservation réglementaire, ou gérez et testez le reconditionnement des capsules avant de les mettre hors service.

L’autorité des quatre validateurs est ancrée dans l’état ; elle n’est pas fournie par le client. À l’`authority_context_height` du manifeste, chaque validateur extrait de l’état de consensus la liste ordonnée exacte des voies et espaces de données ainsi que l’incarnation active de la voie, exige que la hauteur obtenue corresponde et vérifie les quatre clés BLS et leurs preuves de possession. Le chargement, la préparation et l’admission du reçu final utilisent cette même autorité historique.

## Configurer l'admission {#configure-admission}

Tout comportement de production provient de la configuration du nœud. Les variables d'environnement ne peuvent pas activer ce chemin. La valeur par défaut fournie est `enabled = false` ; laisser la fonctionnalité désactivée ne nécessite aucune configuration spécifique au règlement.

Après que la gouvernance a enregistré la capacité requise et choisi une hauteur d'activation avec un préavis adéquat, configurez chaque nœud pertinent de manière cohérente :

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

L'exemple utilise les limites V1 livrées, et non une recommandation de performance. Mesurez le stockage, la preuve, la capsule, la transaction du porteur et les conteneurs de données de latence sur le matériel prévu avant de choisir les limites opérationnelles. Les délais de trois phases doivent tenir à l'intérieur de `max_expiry_blocks`, et la conservation des enregistrements auxiliaires doit être au moins égale à cette fenêtre d'expiration.

`max_capsule_bytes` limite le codage canonique Norito de l'ensemble `PrivateSettlementAuditCapsuleV1` : AAD, valeur de nonce cryptographique, texte chiffré, cadrage vectoriel, identités des auditeurs, et chaque ligne enveloppée-DEK. Il ne s'agit pas d'une limite portant uniquement sur le texte chiffré. Chaque classe de rembourrage configurée doit s'adapter au conteneur de données à capsule complète et conservatrice pour au moins `default_min_auditor_approvals` auditeurs. Torii rejette également une politique nouvellement admise dont `min_approvals` est en dessous du seuil réglementé, et rejette toute capsule réelle dont l'encodage canonique complet est trop volumineux.

`max_carrier_bytes` limite la transaction complète signée par le sponsor canonique, pas seulement le lot certifié. Le compte inclut l'encadrement des instructions enregistrées, Autorisation de transaction : principal et métadonnées, intention de frais et signature. Les limites de transaction ordinaires du réseau s'appliquent toujours comme plafond indépendant.

L'activation échoue fermée à moins que la capacité régie soit active, que son état et les hauteurs d'activation satisfassent la période de préavis, que le profil de preuve compilé corresponde à V1, et que le registre de pool et d'audit sur la chaîne soit à jour. Activer uniquement le drapeau de configuration est insuffisant.

## Flux de règlement {#settlement-workflow}

Le client construit des preuves et des capsules chiffrées localement. Les témoins secrets doivent rester dans le portefeuille natif ou le travailleur natif ; ne les sérialisez pas dans les journaux d'application, les objets Python, les requêtes HTTP ou les enregistrements de coordination durables.

Les données authentifiées encapsulées et par auditeur DEK-wrap incluent la valeur du résumé cryptographique du comité exactement ancré dans l'état et `authority_context_height`, ainsi que le réseau, route/incarnation, paquet, volet, politique, époque clé et engagement en texte clair. Une clé emballée ne peut pas être déplacée vers un autre registre ou contexte d'autorisation historique.

Pour chaque volet canonique, le coordinateur effectue ensuite cette séquence :

1. Téléchargez le matériel chiffré provisoire sur les quatre validateurs et obtenez un certificat de disponibilité canonique exact 3-sur-4.
2. Faites en sorte qu'un auditeur autorisé récupère et déchiffre sa capsule, recalculer les liaisons publiques, applique la politique locale et soumette une approbation.
3. Demandez de préparer les votes des quatre validateurs. Chaque validateur vérifie de manière indépendante et enregistre de façon durable le delta avant de voter. Conservez le certificat préparatoire canonique 3-sur-4 sur chaque répondeur enregistré.
4. Après que chaque volet ait un certificat Prepare, construisez la barrière Prepare complète et immuable. Demandez et enregistrez de manière persistante les certificats Commit canoniques 3-sur-4. Si le coordinateur redémarre, interrogez les nœuds participants pour leurs certificats Prepare et Commit durablement locaux. sélectionnez un certificat équivalent à un quorum canonique, et redistribuez-le avant de continuer ; ne reconstituez jamais un certificat à partir d’un cache local non authentifié.
5. Faites signer et soumettre par le sponsor du manifeste technique exactement une transaction porteuse globale. La transaction porteuse contient une instruction `FinalizeAtomicPrivateSettlementV1` et le lot certifié complet exact. Le coordinateur et WSV mesurent en pré-vol l'instruction de finalisation complète effacée de type, y compris le cadrage des instructions enregistrées. Torii et la liaison centrale de la transaction porteuse à usage unique imposent `max_carrier_bytes` sur la transaction exacte signée par le sponsor canonique, y compris le principal d'autorisation, les métadonnées, l'intention de frais et la signature. Torii rejette une transaction porteuse avant son contexte de principal d'autorisation, à ou après la dernière hauteur d'entrée qui pourrait atteindre la finalité par expiration, ou au-delà de la période d'expiration régie.
6. Interrogez le statut du paquet public et l’enregistrement des résultats du protocole jusqu’à la finalité globale. Considérez l’état de l’enregistrement auxiliaire local comme provisoire jusqu’à ce qu’il se réconcilie avec cet enregistrement terminal global immuable.

Le client Rust expose ce flux par des méthodes incluant `certify_and_upload_private_settlement_legs_v1`, `prepare_private_settlement_bundle_v1`, `commit_private_settlement_bundle_v1` et `submit_private_settlement_bundle_v1`. La coordination sécurisée au redémarrage utilise `recover_or_prepare_private_settlement_bundle_v1` et `recover_or_commit_private_settlement_bundle_v1`. Les appels du comité et de l'auditeur nécessitent des identifiants de rôle explicites ; ils ne réutilisent pas le signataire cryptographique du compte ordinaire.

## Faire tourner une politique d'auditeur en toute sécurité {#rotate-an-auditor-policy-safely}

Utilisez l'instruction autorisée par la gouvernance de la confidentialité `RotatePrivateSettlementPoolPolicyV1`. Elle doit nommer la valeur exacte actuelle du condensé cryptographique de gouvernance, conserver le même chemin, pool et engagement de liaison des actifs, avancer la révision de la gouvernance d'un pas, utilisez une époque de clé strictement plus récente et des empreintes cryptographiques de politique/gouvernance différentes, et activez au bloc qui contient la rotation. La frontière du pool, les racines, les nullificateurs, les sorties, les ensembles de relecture, et les enregistrements de résultats de protocole finalisés sont conservés. N'incluez pas un enregistrement de résultat de protocole touchant cette même route/pool à la hauteur d'activation de la rotation ; l'instruction rejette cette limite.

La projection de l’ensemble public conserve l'intégralité de la lignée des révisions de politique supplantées. Un enregistrement de résultat de protocole finalisé avant la rotation reste donc valide après le redémarrage, et rejouer exactement cet enregistrement de résultat de protocole reste idempotent. La lignée n'autorise pas le travail inachevé : tout paquet de l'ancienne politique qui franchit la limite d'activation échoue fermé avant les changements d'état global. Conservez chaque ancienne clé de déchiffrement nécessaire pour ouvrir les capsules stockées, ou effectuez un reconditionnement de capsule gouverné et testé avant de la détruire.

## Torii famille de route {#torii-route-family}

Ces routes utilisent des objets de requête et de réponse canoniques Norito. Les réponses authentifiées et restreintes utilisent un comportement de cache privé `no-store`.

|Opération|Méthode et chemin|Principal|
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
|Téléverser le volet| `POST /v1/nexus/private-settlements/legs`                                  |signature de compte canonique|
|Partage de disponibilité| `POST /v1/nexus/private-settlements/legs/availability-shares`              |signature de compte canonique|
|Préparer le vote| `POST /v1/nexus/private-settlements/phases/prepare-votes`                  |signature de compte canonique|
|Valider le vote| `POST /v1/nexus/private-settlements/phases/commit-votes`                   |signature de compte canonique|
|Phase de persistance QC| `POST /v1/nexus/private-settlements/phases/certificates`                   |signature de compte canonique|
|Phase de récupération QCs| `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` |parrain du manifeste technique|
|Statut du volet| `GET /v1/nexus/private-settlements/legs/{payload_digest}/status`           |signature de compte canonique|
|Épreuve du comité| `GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof`  |validateur de liste exacte|
|Audit capsule| `GET /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule`    |auditeur régulé|
|Approbation de l'auditeur| `POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals` |auditeur régulé|
|Soumettre final/annuler| `POST /v1/nexus/private-settlements/bundles`                               |parrain du manifeste technique|
|Statut du paquet| `GET /v1/nexus/private-settlements/bundles/{bundle_id}`                    |publique|
|enregistrement du résultat du protocole ou abandon| `GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt`            |publique|

Les APIs publiques de statut et de reçu n’exposent que les champs publics documentés. En particulier, le statut ordinaire d’un volet ne révèle ni le nombre d’approbations ni le seuil d’auditeurs régi. Les lectures restreintes rendent volontairement indiscernables les données absentes, non autorisées ou dont la conservation a expiré, en renvoyant la même classe de réponse indisponible. La route de soumission n’accepte qu’une seule instruction directe de finalisation ou d’abandon signée par le sponsor. Sa réponse `202` contient uniquement l’identifiant du bundle, la hauteur d’admission observée et le hachage de la transaction porteuse ; elle n’affirme pas qu’un abandon en attente est déjà définitif. Les SDKs exigent que les deux identifiants soient des littéraux JSON `Hash` de Norito canoniques et munis d’une somme de contrôle, et que la hauteur soit un entier non signé exact de 64 bits ; les champs absents, supplémentaires, mal typés, non canoniques, à somme invalide, négatifs, égaux à zéro négatif, fractionnaires ou en dépassement entraînent un échec fermé. Utilisez le statut ou le reçu du bundle comme état terminal faisant autorité. Le code d’état est lui aussi exact : cette route d’admission de la transaction porteuse exige `202`, tandis que toutes les autres réponses de succès de règlement privé V1 exigent `200`. Les clients rejettent les autres codes de succès `2xx` comme une dérive du contrat sans reproduire le corps inattendu dans leurs erreurs. Ils n’exposent un code de rejet du serveur que s’il correspond à `[A-Za-z0-9_.:-]{1,128}` et écartent les causes d’analyse ou de validation de la réponse, empêchant ainsi le contenu du corps ou les noms de champs JSON choisis par un attaquant de réapparaître dans les journaux qui incluent les causes.

## Échec et récupération {#failure-and-recovery}

Les approbations d'auditeur manquantes ou obsolètes, moins de trois votes de validateurs, des racines ou époques incorrectes, des nullificateurs en double, des preuves ou capsules substituées, un ordre de volets non canonique, des lots expirés et des conditions de remboursement non correspondantes échouent tous avant la mutation globale. Les certificats de commit ne modifient jamais l'état privé.

Les validateurs fsync les enregistrements auxiliaires, les deltas mis en scène et les certificats de phase avant de les reconnaître. Au redémarrage, ils reconstruisent les réservations à partir des enregistrements durables canoniques, puis réconcilient les enregistrements de résultats du protocole global immuables, les marqueurs d'abandon ou les expirations. Le réconciliateur supervisé exécute également l'élagage de la rétention terminale à la hauteur autoritaire observée de manière synchrone même lorsqu'il n'y a aucun candidat terminal à réconcilier, et il se ferme en cas d'erreur de taille. Seul un enregistrement terminal global autoritaire libère les verrous en attente. Rejouer un enregistrement de résultat de protocole finalisé identique est idempotent ; un rejouage conflictuel échoue de manière déterministe.

L'identité de réservation inclut l'itinéraire complet. Les têtes de pool utilisent `(route, pool_id, epoch, root)`, les annulateurs utilisent `(route, pool_id, nullifier)`, et les sorties utilisent `(route, pool_id, commitment)`. Les valeurs opaques égales sur un autre itinéraire sont indépendantes ; une collision sur un itinéraire exact reste verrouillée après redémarrage.

Les alertes opérationnelles ne doivent utiliser que les champs de bundle opaque, de route, de phase, de valeur de résumé cryptographique, de hauteur et de classe de raison. Ne jamais placer de capsules décryptées, d'identifiants de compte ou d'actifs, de montants, de mémos, de données de vue, de témoins de preuve ou de charges utiles de parseur dans les journaux, les événements, les étiquettes de métriques ou les intervalles de traçage.

## Qualification avant la valeur réelle {#qualification-before-real-value}

Pour la version et la configuration exactes que vous avez l'intention de déployer, archivez les preuves couvrant :

- preuve conflictuelle, capsule, politique, rotation des clés, remboursement et cas de lecture répétée
- véritables processus à quatre validateurs pour 2, 3, 4, 8 et 16 espaces de données, incluant les redémarrages de validateurs et de coordinateurs, la perte de messages authentifiée de 5 %, 10 % et 20 %, les partitions de phase, la récupération et les plantages aux limites de persistance
- canari et analyse des fuites différentielles à travers Torii, P2P, blocs, Kura, vues de données ponctuelles, requêtes, événements, journaux et télémétrie
- au moins cinq échauffements et trente lots mesurés par nombre de participants du réseau réel, avec p50, p95, p99, intervalles de confiance, ressources, trafic, tailles des enregistrements de preuve et de résultat du protocole, et AMX transparent comme contrôle
- tests stricts de l'espace de travail, vérifications lint et de format, graines aléatoires, soak, builds reproductibles, SBOMs, et hachages cryptographiques des artefacts signés
- les deux couches formelles : les vérifications de symétrie du nombre de pattes 3/255 et l’indexation exacte du comité à quatre validateurs N=2 centrée sur le validateur plus la configuration complète bornée de panne, le papier principal N=3 panne, N=4 propre, et N=3 expiration/relecture, avec des budgets de panne indépendants par comité
- révision indépendante de la relation de preuve, des sélecteurs de slots fictifs, des liaisons d'actifs et de capsules, de la relation de remboursement, de la cryptographie et de la machine à états inter-espaces de données

Publiez les preuves brutes et assainies, le modèle de menace, l'argument du protocole, les limitations, l'ID de commit, la description matérielle et les rapports d'audit dans un artefact immuable soutenu par DOI. Les tests du dépôt à eux seuls ne transforment pas la fonctionnalité en un système de règlement CBDC qualifié pour la production.

À partir du checkout final propre Iroha, générez l'inventaire source de la version et scellez-le dans une racine de bundle préexistante en dehors de ce checkout :

```sh
python3 scripts/private_settlement_source_evidence.py \
  --repository-root . \
  --bundle-root /absolute/path/to/release-bundle
```

Le producteur échoue sur les fichiers mis en scène, non mis en scène, non suivis ou non fusionnés et sur toute modification de source pendant la capture. Il conserve l’objet de commit brut, l’inventaire de l’arbre Git canonique, la liste exacte des chemins binaires, le sceau de source déterministe et `Cargo.lock`; inclure chaque déclaration d'artifact provenant de son résultat JSON dans le manifeste technique final de la version. Cela ne dispense pas du vérificateur de bundle final DOI ni d'aucune étape de validation externe de la version.

Le sceau source est portable et ferme en cas de défaut : le producteur et le vérificateur final résolvent l'ensemble du graphe de liens symboliques archivés, donc un lien qui semble être à la racine mais qui s'échappe par un autre lien, un cycle, une traversée `.git` ou une cible de style Windows est rejeté avant que les liens ne soient créés. Les rapports structurés de source et de passerelle ne sont analysés qu'à partir de fichiers stables délimités dont la valeur de résumé cryptographique et la longueur correspondent au manifeste technique de publication, et chaque type de charge utile source doit apparaître exactement une fois.

Chaque échantillon brut de défaut, d’exécution et de latence doit lier le commit de version complet, le SHA-256 d’une description matérielle épinglée structurée, et le SHA-256 de sa configuration exacte du nombre de participants. Archiver un manifeste technique de configuration canonique couvrant N=2,3,4,8,16 ; chaque entrée doit référencer les octets de configuration conservés et affirmer exactement quatre validateurs par espace de données, un quorum de 3 sur 4, et RS16 DA/RBC signé obligatoirement. Le vérificateur de version rejette les résumés produits sur une version, un profil matériel ou une configuration réseau différente. Chaque perte individuelle, coupe de phase et ligne de crash de persistance doit en outre nommer des références d'enregistrement exactes JSONL globalement non réutilisables à l'intérieur des limites de SHA-256 artefacts d'authentification du contrôleur et de capture d'atomicité. Le vérificateur de version résout ces digests cryptographiques et exige que les lignes correspondent à l'identité de l'exécution, à l'indice de l'essai et aux paramètres, à l'accusé de réception du contrôleur ou au résultat de récupération, au nombre de vérifications continues, et aucune observation de visibilité partielle ni de capacité de dépense. Les comparaisons p95/p99 publiées plus tard rejettent également une base signée dont le matériel, les configurations ou les exigences de mesure diffèrent du candidat. Le vérificateur final régénère tous les percentiles signalés, MADs, et les intervalles de confiance déterministes à partir des échantillons bruts archivés au lieu de se fier à un résumé de benchmark détaché. Il recharge également le manifeste technique canari et rescane indépendamment chaque surface de confidentialité archivée, de sorte qu’un rapport ne peut pas supprimer un secret planté après avoir rebindé les digests cryptographiques des fichiers. Chaque exécution réservée aux secrets doit conserver son pcap de boucle locale non filtré réservé au propriétaire, le stderr brut de tcpdump et les statistiques à zéro perte, le manifeste technique des ports canoniques, l'archive source restreinte compressée et toutes les observations d'atomicité entre tous les pairs. Le vérificateur final relance la répartition des paquets liés aux ports, les projections de source et les vérifications d'atomicité de la ligne de base au terminal à partir de ces octets archivés plutôt que de se fier aux résumés publiés.

L'archive doit également inclure des manifestes techniques canoniques de comptage du trafic apparié et de paires différentielles liant les chemins de fichiers exacts gauche et droit, les types, les longueurs en octets et les digests cryptographiques SHA-256 pour chaque surface de confidentialité requise. Ses racines déclarées doivent contenir exactement l'inventaire d'archives apparié. Le vérificateur exige des tailles de fichiers entières égales et des formes publiques JSON pour les surfaces ordinaires. La capture en boucle brute portant l'entropie et l'archive source restreinte empaquetée sont des exceptions de taille explicites ; elle compare plutôt le type de lien de paquet et les longueurs par paquet, les identités de source restreinte et les longueurs de ligne à forme fixe. Chaque demande/réponse Torii, paquet public/restreint P2P, bloc, requête, événement, journal et comptage du trafic de télémétrie doivent également correspondre. Un changement de forme de paquet, une fuite structurelle de même taille, une fausse revendication de provenance, ou un fichier non apparié ne peut pas être caché en réécrivant le rapport de fuite et ses hachages cryptographiques.
