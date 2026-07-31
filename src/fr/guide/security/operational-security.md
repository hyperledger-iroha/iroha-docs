---
translation_locale: fr
translation_source: /guide/security/operational-security.md
translation_source_hash: 01397a0e53a3f62df21e33b1473babd910cc733713ef69e43b3bbb501b48e7a5
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Sécurité opérationnelle {#operational-security}

La sécurité opérationnelle (OPSEC) est une approche systématique de la sécurité et de la gestion des risques, qui constitue essentiellement un ensemble de stratégies et de conseils adoptés pour des cas d'utilisation spécifiques dans le but de prévenir l'accès non autorisé et les fuites de données.

<abbr title="Operational Security">OPSEC</abbr> est la pratique standard de la plupart des entreprises pour garantir la disponibilité et la stabilité de leurs actifs. Cela inclut prendre en compte des facteurs tels que la sécurité physique (par exemple, s'assurer que les billets post-it non surveillés ne contiennent pas de données sensibles), les protocoles de communication sécurisés (par exemple, le non-envoi de données sensibles par voie non cryptée SMS), l'analyse des menaces (p. ex., la détermination de parties malveillantes potentielles, l'apprentissage des méthodes d'attaque les plus récentes), la formation du personnel (par ex., sans que les employés suivent les mesures <abbr title="Operational Security">OPSEC</abbr>; Ils s'avéreront, tôt ou tard, inefficaces) et réduiront les risques (par exemple en cryptant vos disques durs et vos appareils USB.

Étant donné que Iroha est susceptible d'être déployé comme un registre financier, <abbr title="Operational Security">OPSEC</abbr> mesures et pratiques doivent être prises au sérieux. Ce sujet décrit les stratégies et approches que les individus et les organisations utilisant Iroha dans leurs opérations devraient considérer comme faisant partie de leur un protocole de sécurité étendu.

Toutefois, le suivi et l'adoption des lignes directrices en la matière constituent une étape nécessaire vers la réalisation d'une sécurité totale. Pour améliorer encore votre sécurité, apprenez-en davantage au cours du reste de l'étude. [Sécurité](./index.md) section et en particulier les sujets suivants:

- [Principaux de sécurité](./security-principles.md)
- [Sécurité par mot de passe ](./password-security.md)

## Les mesures recommandées OPSEC {#recommended-opsec-measures}

- Restez vigilants. La façon la plus probable [ ](https://arxiv.org/pdf/2209.08356.pdf) par laquelle on peut perdre ses actifs dans une blockchain est de donner leurs données sensibles.

- Encrivez vos disques. Le chiffrement des dispositifs de démarrage leur permet de protéger vos données même si un attaquant a obtenu l'accès au matériel. Le faire pour vos appareils portables est deux fois plus important.

- Utilisez un logiciel de confiance. Le logiciel qui est livré via des constructions binaires reproducibles, et que vous construisez à partir de la source, est le plus fiable. Un logiciel propriétaire ou open source qui n'a pas été audité est un risque potentiel qui doit être pris au sérieux.

- Ne laissez jamais les appareils portables avec des données sensibles sans surveillance. Une fraction de seconde suffit à voler votre appareil.

- Vérifiez les signatures sur les paquets binaires. Cela ne diffère pas beaucoup de la cryptographie à clé publique utilisée dans Iroha.

- Pour éviter un accès non autorisé, sécurisez toujours votre ordinateur portable ou informatique lorsqu'il est laissé sans surveillance. Utilisez des mots de passe forts, verrouillez l'écran et suivez les meilleures pratiques pour sécuriser vos appareils.

- Établissez un système de sécurité [à vide d'air](https://en.wikipedia.org/wiki/Air_gap_(networking)Tout d'abord, chiffrez les clés, puis stockez-les dans un appareil hors ligne seulement. Dans l'idéal, avec un bouclier électromagnétique installé. [Les clés matérielles](./storing-cryptographic-keys.md#using-a-hardware-key) sont conçus spécifiquement à cette fin.

- Gardez toujours votre logiciel à jour avec sa dernière version sur tous les appareils, y compris les ordinateurs et les téléphones. Les mises à jour régulières permettent de corriger les vulnérabilités et de minimiser les risques potentiels associés au logiciel obsolète, avant même que de telles vulnérabilités ne soient révélées.

- Développer une routine pour mettre à jour périodiquement les mots de passe et les clés cryptographiques. Cette approche proactive contribue significativement à améliorer la posture de sécurité globale, car il est beaucoup plus difficile de toucher une cible en mouvement.

## En utilisant les navigateurs {#using-browsers}

Si une application connectée à Iroha dispose d'un web UI, votre navigateur peut soit aider la sécurité ou représenter une menace potentielle. Il est essentiel de faire preuve de prudence, surtout en ce qui concerne les plugins que vous choisissez d'installer.

Considérez les mesures suivantes pour améliorer la sécurité de votre navigation:

- Évitez d'utiliser des navigateurs qui sont connus pour avoir de mauvais modèles de sécurité et pour fuir les données de leurs utilisateurs. Vous pouvez rechercher des violations de la vie privée et des problèmes de sécurité pour n'importe quel navigateur. Par exemple, [ cet article sur la confidentialité du navigateur ](https://www.unixsheikh.com/articles/choose-your-browser-carefully.html) discute d'une variété de navigateurs et de leur sécurité. Notez que les navigateurs propriétaires (tels que Chrome, Safari, Opera, Vivaldi, Edge et autres) sont généralement extrêmement difficiles à vérifier en raison de leur code caché au public, ce qui signifie que vous ne pouvez pas être sûr de sa sécurité.

- Préférer les navigateurs ayant une solide expérience de valorisation et de protection de la vie privée et de la sécurité de leurs utilisateurs:
  - [Librewolf](https://librewolf.net/), [Icecat](https://www.gnu.org/software/gnuzilla/), [Firedragon](https://github.com/dr460nf1r3/firedragon-browser), etc.  fourches bien établies de Mozilla Firefox avec des fonctionnalités de sécurité ajoutées .
  - [Unoogled chromium ](https://github.com/ungoogled-software/ungoogled-chromium)  une version open source hautement vérifiée de Google Chrome qui est améliorée avec des mesures de sécurité supplémentaires et a tous les services Web liés à Google supprimés.
  - [Courageux !](https://brave.com/)  une version open-source très vérifiée de [Le chrome de Google](https://www.chromium.org/Home/) qui est renforcée par des mesures de sécurité supplémentaires; possède un système intégré <abbr title="Virtual Private Network">VPN</abbr> et la fonctionnalité de blocage des annonces.
  - [Falkon](https://www.falkon.org/)  un navigateur Web basé sur Qt open-source (construit sur `QtWebEngine`, une enveloppe pour [Google Chromium](https://www.chromium.org/Home/)) avec un historique connu d'être sécurisé; dispose d'un certain nombre d'extensions disponibles à télécharger depuis sa page de magasin [KDE ](https://store.falkon.org/browse/).
  - [Qutebrowser](https://qutebrowser.org/)  un navigateur Web basé sur Qt open-source (construit sur `QtWebEngine`, une enveloppe pour [Google Chromium](https://www.chromium.org/Home/)) avec une expérience connue d'être sécurisé; dispose d'une approche unique axée sur le clavier avec un minimaliste GUI; considéré comme un navigateur de choix pour beaucoup de spécialistes de la sécurité.

- Évitez d'activer `JavaScript` à moins que cela ne soit nécessaire.

- Utilisez le mécanisme de confinement intégré du navigateur pour les plugins afin de restreindre les droits d'accès que les plugins installés ont.

- Nettoyer les cookies avant et après des opérations importantes. Veillez à ne pas activer les fonctionnalités Mettez-moi connecté ou Souvenez-vous de moi. Gardez à l'esprit que certains sites Web ont cette fonctionnalité activée par défaut.

- Utilisez un bloqueur d'annonces. Ceux-ci bloquent non seulement les annonces, mais désactivent également les fonctionnalités de suivi du site. Selon le navigateur que vous utilisez, un bloqueur de publicités peut ne pas être une fonctionnalité intégrée.

- Prenez garde à des personnages similaires (par exemple: `0`, `θ`, `O`, `О`, `ዐ` à la fois `߀` Prendre soin de détails comme celui-ci peut vous sauver d'une attaque de phishing.

- Évitez les clients de messagerie web UI en faveur des clients de bureau. Avant de l'utiliser, configurez votre client de messengerie de bureau pour signer et vérifier les signatures de clé GPG.

- Évitez d'utiliser des services de messagerie basés sur le Web. Par exemple, Discord (construit avec le célèbre framework `electron`) est sensible à beaucoup des mêmes attaques qu'une fenêtre Google Chromium avec la version web de discord ouverte.

- Mettez votre navigateur à jour vers la dernière version chaque fois que cela est possible. Les mises à jour incluent souvent des correctifs de sécurité critiques qui résolvent les vulnérabilités.

- Soyez prudent quant aux extensions de navigateur que vous installez. Utilisez uniquement des extensions bien connues et fiables provenant de sources réputées. Les extensions pirates peuvent compromettre vos données et votre vie privée.

- Créer des profils de navigateur distincts pour diverses tâches. Utilisez un profil pour la navigation quotidienne et un autre pour les activités impliquant une sécurité élevée et des données sensibles. De cette façon, les extensions installées sur le profil pour la Navigation quotidien ne peuvent pas accéder aux données sensibles à partir de celui sécurisé.

- Utilisez une version portable de votre navigateur copiée sur un lecteur flash USB. Cette méthode garantit que, même si un bug de sécurité accorde à l'un des plugins installés l'accès aux données entre les profils, votre profil lié à la sécurité reste sur un appareil séparé et amovible.

- Effacer périodiquement le cache et les cookies de votre navigateur pour supprimer les données potentiellement sensibles qui pourraient être stockées accidentellement sur votre appareil.

## Plan de rétablissement {#recovery-plan}

En cas d'urgence, par exemple en cas de perte d'une clé ou en cas de violation de sécurité, Un plan de récupération bien structuré et préparé à l'avance est une ligne de sauvetage essentielle. La mise en place d'un ensemble clair de mesures à suivre peut aider à atténuer les dommages potentiels et à rétablir rapidement la sécurité.

Les organisations devraient prendre en compte les aspects clés suivants lors de l'élaboration de leur plan de relance:

- Décrire les procédures étape par étape à suivre en cas de perte de clé ou d'autres incidents de sécurité. Veiller à ce que ces mesures soient facilement accessibles et compréhensibles aux utilisateurs et/ou aux employés.

- Établissez un canal de communication qui peut être utilisé pour signaler rapidement des violations de la sécurité et des menaces potentielles, telles que des clés cryptographiques et des mots de passe perdus ou fuyants.

- Si vous utilisez des clés matérielles (par exemple, [YubiKey](https://www.yubico.com/products/) ou [ SoloKeys Solo](https://solokeys.com/collections/all)) comme mesure de sécurité, envisagez d'adopter une stratégie de redondance. Gardez deux clés: l'une pour un usage quotidien et l'autre stockée dans un emplacement sécurisé. Cette mesure de précaution assure l'accès même si la clé principale est compromise ou perdue.

- Lorsque des violations de sécurité ou des fuites sont signalées, réagissez rapidement en remplaçant ou en désactivant les clés et mots de passe affectés.

- Réviser et mettre à jour périodiquement votre plan de récupération, ce qui garantit que le plan reste pertinent et efficace au fur et à mesure de l'évolution de votre paysage de sécurité.

::: avertissement

Rappelez-vous qu'un plan de rétablissement n'est pas seulement un autre document, c'est plutôt une ligne de sauvetage qui aide à surmonter les défis inattendus. vous fortifiez votre sécurité opérationnelle et améliorez votre préparation à réagir efficacement à tout incident de sécurité.

:::
