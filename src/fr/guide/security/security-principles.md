---
translation_locale: fr
translation_source: /guide/security/security-principles.md
translation_source_hash: ca78f72b2e319a67a5fa5c74126de108cd552cdc758e3a2b981f7a7930a3b61e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Principes de sécurité {#security-principles}

Les organisations et les utilisateurs individuels doivent collaborer pour assurer une interaction sécurisée avec les installations Iroha.

## Principes généraux de sécurité {#general-security-principles}

1. Utiliser un réseau privé virtuel [ ](./vpn.md) (VPN):

    - Chaque fois que vous accédez à des données ou ressources sensibles, en particulier via des réseaux publics, utilisez un <abbr title="Virtual Private Network">VPN </abbr> pour établir une connexion sécurisée qui protège vos informations.

2. Utiliser un pare-feu pour la protection du réseau:

    - Renforcer les réseaux domestiques et/ou de bureau en installant un pare-feu qui aide à contrer l'accès non autorisé et à protéger les appareils connectés contre les virus et les logiciels malveillants.

3. Sécuriser les informations physiques et numériques:

    - Garder les documents physiques contenant des informations sensibles dans un emplacement sécurisé et veiller à ce que les documents numériques soient cryptés et stockés dans des dossiers protégés par mot de passe.

4. Garder une sauvegarde régulière des données:

    - Gardez toujours des copies de vos informations importantes sauvegardées dans un endroit sûr. De cette façon, si vous perdez vos données ou que quelque chose ne va pas, vous pouvez rapidement tout remettre sur pied. Gardez ces sauvegardes dans un endroit sécurisé différent de l'endroit où vous gardez généralement vos données

## Principes de sécurité pour les utilisateurs individuels {#security-principles-for-individual-users}

1. Adopter des règles d'authentification solides:

    - Utilisez des mots de passe uniques et solides pour tous les comptes.

    - N'utilisez jamais les mots de passe.

    - Configurez <abbr title="Two-Factor Authentication">2FA</abbr> chaque fois que cela est possible. <abbr title="Two-Factor Authentication">2FA</abbr> améliore la sécurité globale en exigeant non seulement un mot de passe, mais aussi un facteur supplémentaire tel qu'un <abbr title="One-Time Password">OTP</abbr>, une empreinte digitale ou une authentification basée sur des applications tierces (par exemple, Google Authenticator).

    - Évitez d'utiliser l'authentification SMS comme deuxième facteur. Il n'y a aucune garantie que les logiciels malveillants ne surveillent pas tous vos messages SMS. Par exemple, les applications Android ne peuvent être limitées à accéder uniquement aux messages destinés spécifiquement à elles.

2. Faites preuve de prudence dans la communication numérique: - Configurez un client de messagerie électronique pour signer et vérifier les signatures de tous les emails reçus. - Désactiver les messages HTML et le chargement des ressources externes à partir d'adresses inconnues ou non vérifiées.

    - Apprenez à connaître les techniques courantes de phishing pour reconnaître et éviter les e-mails, liens et demandes de renseignements personnels suspects.

    - Créer un client de messagerie pour signer et vérifier les signatures de tous les courriels reçus.

3. Protection des renseignements personnels:

    - Lorsque vous communiquez avec des inconnus, surtout par téléphone ou en ligne, faites attention à ne pas leur donner de renseignements personnels.

    - Considérez d'effectuer des recherches indépendantes sur les individus ou organisations avec lesquels vous communiquez pour confirmer leur identité.

    - Prenez garde aux renseignements personnels que vous partagez sur les réseaux sociaux, car des parties malveillantes peuvent exploiter ces informations.

## Principes de sécurité pour les organisations {#security-principles-for-organisations}

1. Définir des politiques et procédures de sécurité claires:

    - Développer des politiques et protocoles de sécurité bien définis pour tous les employés qui traitent de données sensibles.

    - Veiller à ce que les politiques de sécurité soient accessibles à tous les employés et qu'elles soient régulièrement examinées et mises à jour pour tenir compte des changements dans le paysage de la sécurité.

    - Fournir aux politiques de sécurité des exemples et des scénarios afin qu'elles soient plus faciles à comprendre et à mettre en œuvre pour les employés.

2. Cultiver la prise de conscience des employés:

    - Éduquer les employés sur les mesures de sécurité des données et des opérations.

    - Encouragez les employés à signaler rapidement toute activité suspecte ou toute préoccupation en matière de sécurité.

3. Protéger les infrastructures physiques:

    - Restriction de l'accès physique aux serveurs et à l'infrastructure.

    - Veiller à ce que les mesures de contrôle d'accès soient régulièrement réexaminées et mises à jour afin de s'aligner sur les besoins en matière de sécurité en évolution.

    - Considérer la mise en œuvre de contrôles d'accès biométriques pour les zones sensibles afin d'améliorer la sécurité physique.

4. Mettre en place une surveillance de la sécurité:

    - Faire appliquer un système complet de surveillance de la sécurité qui examine les activités et identifie les violations potentielles de sécurité.

    - Mettre en œuvre des alertes automatisées pour notifier rapidement le personnel de sécurité de toute activité inhabituelle ou non autorisée.

    - Considérez l'utilisation d'algorithmes d'apprentissage automatique pour améliorer la capacité du système à détecter les anomalies et les menaces potentielles.

    - Employer du personnel ou désigner du personnel pour superviser la sécurité des bases de données, identifier, suivre et résoudre les vulnérabilités logicielles et effectuer régulièrement des vérifications sur les machines critiques pour la présence de logiciels non autorisés qui ne sont pas inclus dans la liste approuvée.

5. Effectuer des audits de sécurité récurrents:

    - Effectuer des audits de sécurité de routine afin d'évaluer les vulnérabilités et de confirmer que les mesures de sécurité établies sont conformes aux normes et réglementations communément acceptées.

    - Considérez l'embauche d'experts externes en sécurité pour des évaluations périodiques afin d'obtenir une évaluation impartiale de l'état de sécurité de votre organisation.

6. Mettre en place un système de contrôle d'accès:

    - Mettre en place un système de contrôle d'accès fondé sur les rôles afin que les employés n'aient accès qu'aux ressources et aux informations nécessaires à leurs rôles.

7. Adoptez l'amélioration continue:

    - Reconnaître que la sécurité est un processus continu; maintenir une évaluation continue des mesures de sécurité et les renforcer de manière proactive pour faire face aux menaces et aux défis émergents.

    - Considérez l'établissement d'une boucle de rétroaction qui encourage les employés à apporter des suggestions d'amélioration de la sécurité, favorisant ainsi une culture de l'amélioration continue.
