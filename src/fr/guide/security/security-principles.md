---
translation_locale: fr
translation_source: /guide/security/security-principles.md
translation_source_hash: ca78f72b2e319a67a5fa5c74126de108cd552cdc758e3a2b981f7a7930a3b61e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Principes de sécurité {#security-principles}

Les organisations et les utilisateurs individuels doivent travailler ensemble pour assurer des interactions sécurisées avec Iroha Ce thème explique les principes fondamentaux de cette coopération.

## Principes généraux de sécurité {#general-security-principles}

1. Utilisez un [Réseau privé virtuel](./vpn.md) (VPN):

    - Lorsque vous accédez à des données ou ressources sensibles, en particulier par le biais de réseaux publics, utilisez un <abbr title="Virtual Private Network">VPN</abbr> pour établir une connexion sécurisée qui protège vos informations.

2. Utilisez un pare-feu pour protéger le réseau:

    - Renforcer les réseaux domestiques et/ou de bureau en installant un pare-feu qui aide à contrer l'accès non autorisé et à protéger les appareils connectés contre les virus et les logiciels malveillants.

3. Sécurisation des informations physiques et numériques:

    - Garder les documents physiques contenant des informations sensibles dans un emplacement sécurisé et veiller à ce que les documents numériques soient cryptés et stockés dans des dossiers protégés par mot de passe.

4. Garder une sauvegarde régulière des données:

    - Gardez toujours des copies de vos informations importantes stockées dans un endroit sécurisé. De cette façon, si vous perdez vos données ou que quelque chose ne va pas, vous pouvez rapidement tout remettre sur pied. Gardez ces sauvegardes dans un endroit sûr différent de celui où vous gardez habituellement vos données.

## Principes de sécurité pour les utilisateurs individuels {#security-principles-for-individual-users}

1. Adopter des règles d'authentification robustes:

    - Utilisez des mots de passe forts et uniques pour tous les comptes.

    - Ne réutilisez jamais les mots de passe.

    - Développé <abbr title="Two-Factor Authentication">2FA</abbr> chaque fois que c'est possible. <abbr title="Two-Factor Authentication">2FA</abbr> améliore la sécurité globale en exigeant non seulement un mot de passe, mais aussi un facteur supplémentaire tel qu'un <abbr title="One-Time Password">OTP</abbr>, une empreinte digitale ou une authentification basée sur des applications tierces (par exemple, Google Authenticator).

    - Évitez d' utiliser SMS Il n'y a aucune garantie que les logiciels malveillants ne surveillent pas tous vos SMS Les messages. Android Les applications ne peuvent se limiter à accéder uniquement aux messages qui leur sont destinés spécifiquement.

2. Faites preuve de prudence dans la communication numérique:
    - Configurez un client de messagerie pour signer et vérifier les signatures de tous les courriels reçus.
    - Désactiver les deux HTML les messages et le chargement de ressources externes à partir d'adresses inconnues ou non vérifiées.

    - Apprenez à connaître les techniques de phishing courantes pour reconnaître et éviter les e-mails, liens et demandes de renseignements personnels suspects.

    - Configurez un client de messagerie pour signer et vérifier les signatures de tous les courriels reçus.

3. Protection des renseignements personnels:

    - Lorsque vous communiquez avec des inconnus, surtout par téléphone ou en ligne, faites attention à ne pas leur donner de renseignements personnels.

    - Considérez d'effectuer des recherches indépendantes sur les personnes ou organisations avec lesquelles vous communiquez pour confirmer leur identité.

    - Prenez garde aux informations personnelles que vous partagez sur les réseaux sociaux, car des parties malveillantes peuvent exploiter ces informations.

## Principes de sécurité pour les organisations {#security-principles-for-organisations}

1. Définir des politiques et procédures de sécurité claires:

    - Développer des politiques et protocoles de sécurité bien définis pour tous les employés traitant de données sensibles.

    - Veiller à ce que les politiques de sécurité soient accessibles à tous les employés et qu'elles soient régulièrement examinées et mises à jour pour refléter les changements dans le paysage de la sécurité.

    - Fournir aux politiques de sécurité des exemples et des scénarios pour les rendre plus réalisables et pratiques pour les employés.

2. Cultiver la sensibilisation des employés:

    - Éduquer les employés sur les mesures de sécurité des données et des opérations.

    - Encouragez les employés à signaler rapidement toute activité suspecte ou tout problème de sécurité.

3. Protéger les infrastructures physiques:

    - Restreindre l'accès physique aux serveurs et à l'infrastructure.

    - Veiller à ce que les mesures de contrôle d'accès soient régulièrement examinées et mises à jour pour s'adapter aux besoins en matière de sécurité en évolution.

    - Considérez la mise en œuvre de contrôles d'accès biométriques pour les zones sensibles afin de renforcer la sécurité physique.

4. Déployer une surveillance de la sécurité:

    - Appliquer un système complet de surveillance de la sécurité qui examine les activités et identifie les atteintes potentielles à la sécurité.

    - Mettre en œuvre des alertes automatisées pour notifier rapidement le personnel de sécurité de toute activité inhabituelle ou non autorisée.

    - Considérez l'utilisation d'algorithmes de machine learning pour améliorer la capacité du système à détecter les anomalies et les menaces potentielles.

    - Employer du personnel ou désigner du personnel pour superviser la sécurité des bases de données, identifier, suivre et résoudre les vulnérabilités logicielles et effectuer régulièrement des vérifications sur les machines critiques pour la présence de logiciels non autorisés qui ne figurent pas dans la liste approuvée.

5. Effectuer des audits de sécurité récurrents:

    - Effectuer des audits de sécurité de routine pour évaluer les vulnérabilités et confirmer que les mesures de sécurité établies sont conformes aux normes et réglementations communément acceptées.

    - Considérez l'embauche d'experts externes en sécurité pour des évaluations périodiques afin d'obtenir une évaluation impartiale de la condition de sécurité de votre organisation.

6. Mettre en œuvre un système de contrôle d'accès:

    - Mettre en place un système de contrôle d'accès fondé sur les rôles afin que les employés n'aient accès qu'aux ressources et aux informations nécessaires à leurs rôles.

7. Adoptez l'amélioration continue:

    - Reconnaître que la sécurité est un processus continu; maintenir une évaluation continue des mesures de sécurité et les améliorer de manière proactive pour faire face aux menaces et aux défis émergents.

    - Considérez l'établissement d'une boucle de rétroaction qui encourage les employés à apporter des suggestions d'amélioration de la sécurité, favorisant ainsi une culture de l'amélioration continue.
