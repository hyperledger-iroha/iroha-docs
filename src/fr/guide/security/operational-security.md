---
translation_locale: fr
translation_source: /guide/security/operational-security.md
translation_source_hash: 01397a0e53a3f62df21e33b1473babd910cc733713ef69e43b3bbb501b48e7a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Sécurité opérationnelle {#operational-security}

Sécurité opérationnelle (OPSEC) est une approche systématique de la sécurité et de la gestion des risques, qui constitue essentiellement un ensemble de stratégies et de conseils adoptés pour les cas d'utilisation spécifiques dans le but de prévenir l'accès non autorisé et la fuite de données.

<abbr title="Operational Security">OPSEC</abbr> est la pratique standard de la plupart des entreprises pour garantir la disponibilité et la stabilité de leurs actifs. Cela comprend la prise en compte de facteurs tels que la sécurité physique (par exemple, s'assurer que les notes post-it non surveillées ne contiennent pas de données sensibles), les protocoles de communication sécurisés (par exemple: ne pas envoyer de données sensiibles par voie non cryptée) SMS), analyse des menaces (par exemple, détermination de parties malveillantes potentielles, apprentissage des méthodes d'attaque les plus récentes), formation du personnel <abbr title="Operational Security">OPSEC</abbr> mesures, ils _le fait_, d'une manière ou d'une autre, il est possible de réduire les risques (par exemple en cryptant vos disques durs et USB les dispositifs).

Depuis Iroha est susceptible d'être déployé comme un registre financier, <abbr title="Operational Security">OPSEC</abbr> Les mesures et les pratiques doivent être prises au sérieux. Iroha Dans le cadre de leurs opérations, elles devraient être considérées comme faisant partie de leur protocole de sécurité étendu.

La mise en œuvre et l'adoption des lignes directrices de ce sujet est une étape nécessaire vers la réalisation d'une sécurité totale, mais elle ne suffit pas à elle seule. [Sécurité](./index.md) section et en particulier les thèmes suivants:

- [Principes de sécurité](./security-principles.md)
- [Sécurité des mots de passe](./password-security.md)

## Recommandé OPSEC Mesures {#recommended-opsec-measures}

- Restez vigilants. [le plus probable](https://arxiv.org/pdf/2209.08356.pdf) La façon dont on peut perdre ses actifs dans une blockchain est de donner leurs détails sensibles.

- Encrypter vos disques. Le chiffrement des dispositifs de démarrage leur permet de protéger vos données même si un attaquant a obtenu l'accès au matériel.

- Utilisez un logiciel fiable. Le logiciel qui est livré via des builds binaires reproductibles, et que vous construisez à partir de la source, est le plus digne de confiance.

- Ne laissez jamais les appareils portables avec des données sensibles sans surveillance.

- Vérifiez les signatures sur les paquets binaires. Iroha.

- Pour éviter l'accès non autorisé, sécurisez toujours votre ordinateur portable ou informatique lorsque vous le laissez sans surveillance.

- Établissez une sécurité [d'une capacité de chargement](https://en.wikipedia.org/wiki/Air_gap_(networking)En premier lieu, chiffrez les clés, puis stockez-les dans un _uniquement hors ligne_ dispositif, idéalement avec un bouclier électromagnétique installé. [Les clés matérielles](./storing-cryptographic-keys.md#using-a-hardware-key) sont spécialement conçus à cet effet.

- Gardez toujours votre logiciel à jour vers sa dernière version sur tous les appareils, y compris les ordinateurs et les téléphones.

- Développer une routine pour mettre à jour périodiquement les mots de passe et les clés cryptographiques. Cette approche proactive contribue significativement à améliorer la posture de sécurité globale, car il est beaucoup plus difficile de toucher une cible mobile.

## Utilisation des navigateurs {#using-browsers}

Si une demande est liée à Iroha est doté d'un réseau UI, Il est essentiel de faire preuve de prudence, surtout en ce qui concerne les plugins que vous choisissez d'installer.

Considérez les mesures suivantes pour améliorer la sécurité de votre navigation:

- Évitez d'utiliser des navigateurs qui sont connus pour avoir de mauvais modèles de sécurité et pour fuir les données de leurs utilisateurs.
  
  Vous pouvez rechercher des violations de la vie privée et des problèmes de sécurité pour n'importe quel navigateur. [cet article sur la confidentialité du navigateur](https://www.unixsheikh.com/articles/choose-your-browser-carefully.html) Les navigateurs propriétaires (comme Chrome, Safari, Opera, Vivaldi, Edge et autres) sont généralement extrêmement difficiles à vérifier en raison de leur code caché au public, ce qui signifie que vous ne pouvez pas être sûr de leur sécurité.

- Préférer les navigateurs ayant une solide expérience de valorisation et de protection de la vie privée et de la sécurité de leurs utilisateurs:
  - [Loup libre](https://librewolf.net/), [Le chat glacé](https://www.gnu.org/software/gnuzilla/), [Le feu de la forêt](https://github.com/dr460nf1r3/firedragon-browser), etc.  bien établis fourches de Mozilla Firefox avec des fonctionnalités de sécurité ajoutées.
  - [Le chrome non glacé](https://github.com/ungoogled-software/ungoogled-chromium)  une version open-source hautement vérifiée de Google Chrome qui est améliorée avec des mesures de sécurité supplémentaires et a supprimé tous les services Web liés à Google.
  - [Courageux !](https://brave.com/)  une version open-source très vérifiée de [Google Chromium](https://www.chromium.org/Home/) qui est renforcée par des mesures de sécurité supplémentaires; <abbr title="Virtual Private Network">VPN</abbr> et la fonction de blocage des annonces.
  - [Le Falkon](https://www.falkon.org/)  un navigateur Web open source basé sur Qt (construit sur `QtWebEngine`, une enveloppe pour [Google Chromium](https://www.chromium.org/Home/)) avec un historique connu de sécurité; dispose d'un certain nombre d'extensions disponibles pour téléchargement à partir de son [KDE page du magasin](https://store.falkon.org/browse/).
  - [Le qute-brasseur](https://qutebrowser.org/)  un navigateur Web open source basé sur Qt (construit sur `QtWebEngine`, une enveloppe pour [Google Chromium](https://www.chromium.org/Home/)) avec une expérience connue d'être sécurisé; a une approche unique axée sur le clavier GUI; considéré comme un navigateur de choix pour de nombreux spécialistes de la sécurité.

- Évitez de permettre `JavaScript` à moins que ce ne soit nécessaire.

- Utilisez le mécanisme de confinement intégré du navigateur pour les plugins afin de restreindre les droits d'accès des plugins installés.

- Éliminer les cookies avant et après des opérations importantes. **Restez inscrit** ou **Vous vous souvenez de moi ?** Rappelons que certains sites Web ont cette fonctionnalité activée par défaut.

- Utilisez un bloqueur d'annonces. Ils bloquent non seulement les annonces, mais désactivent également les fonctionnalités de suivi du site. Selon le navigateur que vous utilisez, un bloqueur de publicités peut ne pas être une fonctionnalité intégrée.

- Prenez garde à des personnages similaires (par exemple, `0`, `θ`, `O`, `О`, `ዐ` et `߀` Prendre soin de détails comme celui-ci peut vous sauver d'une attaque de phishing.

- Évitez le web UI Clients de messagerie en faveur des clients de bureau. Avant d'utiliser, configurer votre client de courrier électronique de bureau pour signer et vérifier GPG les signatures clés.

- Évitez d'utiliser des services de messagerie basés sur le Web. `electron` Le framework) est susceptible de nombreuses attaques similaires à celles d'une fenêtre Google Chromium avec la version Web de Discord ouverte.

- Les mises à jour incluent souvent des correctifs de sécurité critiques qui résolvent les vulnérabilités.

- Soyez prudent quant aux extensions de navigateur que vous installez. Utilisez uniquement des extensions bien connues et fiables provenant de sources réputées.

- Créez des profils de navigateur séparés pour diverses tâches. Utilisez un profil pour la navigation quotidienne et un autre pour les activités impliquant une sécurité élevée et des données sensibles. De cette façon, les extensions installées sur le profil pour la Navigation quotidien ne peuvent pas accéder aux données sensibles à partir de celui sécurisé.

- Utilisez une version portable de votre navigateur copiée à un USB Cette méthode garantit que même si un bug de sécurité donne accès à des données entre les profils à l'un des plugins installés, votre profil lié à la sécurité reste sur un appareil séparé et amovible.

- Effacer périodiquement le cache et les cookies de votre navigateur pour supprimer des données potentiellement sensibles qui pourraient être stockées accidentellement sur votre appareil.

## Plan de rétablissement {#recovery-plan}

En cas d'urgence, comme la perte d'une clé ou une violation de la sécurité, un plan de récupération bien structuré et préparé à l'avance est essentiel.

Les organisations devraient tenir compte des aspects clés suivants lors de l'élaboration de leur plan de relance:

- Décrire les procédures étape par étape à suivre en cas de perte de clé ou d'autres incidents de sécurité. Veiller à ce que ces mesures soient facilement accessibles et compréhensibles aux utilisateurs et/ou aux employés.

- Établissez un canal de communication qui peut être utilisé pour signaler rapidement des violations de la sécurité et des menaces potentielles, telles que des clés cryptographiques et des mots de passe perdus ou fuyants.

- Si vous utilisez des clés matérielles (par exemple, [YubiKey](https://www.yubico.com/products/) ou [SoloKeys Solitaire](https://solokeys.com/collections/all)En ce qui concerne la sécurité, envisagez d'adopter une stratégie de redondance: gardez deux clés: l'une pour un usage quotidien et l'autre stockée dans un endroit sécurisé.

- Lorsque des violations ou fuites de sécurité sont signalées, réagissez rapidement en remplaçant ou en désactivant les clés et mots de passe affectés.

- Réviser et mettre à jour périodiquement votre plan de récupération, ce qui garantit que le plan reste pertinent et efficace au fur et à mesure que votre paysage de sécurité évolue.

::: warning

Rappelez-vous qu'un plan de rétablissement n'est pas seulement un autre document, mais plutôt une ligne de sauvetage qui vous aide à surmonter les défis inattendus. En anticipant des scénarios potentiels et en établissant une feuille de route claire pour l'action, vous fortifiez votre sécurité opérationnelle et améliorez votre préparation à répondre efficacement à tout incident de sécurité.

:::
