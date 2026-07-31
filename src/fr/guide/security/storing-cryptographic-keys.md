---
translation_locale: fr
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: a420551345570c4f6b6c0288bc78041665b199727b177eb0aee1f6495850fae6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Le stockage des clés cryptographiques {#storing-cryptographic-keys}

Vos données sensibles restent privées uniquement si vous adoptez des pratiques <abbr title="Operational Security">OPSEC</abbr> pour protéger les clés cryptographiques. Les menaces d'ingénierie sociale, où quelqu'un qui se présente comme une figure avec autorité tente de vous manipuler pour leur donner votre clé cryptographique privée, sont réelles. Soyez toujours prudent et évitez de partager votre clé privée, en la traitant comme si vous réserviez vos clés d'appartement à des personnes de confiance seulement.

Pour plus d'informations sur <abbr title="Operational Security">OPSEC</abbr> et ses meilleures pratiques, voir [Sécurité opérationnelle ](./operational-security).

## Le stockage numérique des clés cryptographiques {#storing-cryptographic-keys-digitally}

Lorsqu'il s'agit de protéger les clés cryptographiques numériquement, principalement seulement deux approches[SSH](https://www.ssh.com/) et [GPG](https://www.gnupg.org/) sont disponibles. Ces méthodes fournissent des couches de sécurité pour empêcher l'accès non autorisé à vos clés cryptomonnaies.

De nombreuses décisions d'architecture Iroha ont été influencées par les principes du protocole Secure Shell (`SSH`, ce qui explique pourquoi cette section se concentre principalement sur l'approche `SSH`, offrant des instructions sur la manière d'implémenter efficacement le protocole de stockage de vos clés cryptographiques dans l'écosystème Iroha.

### Utilisation de l'agent SSH et SSH {#using-ssh-and-ssh-agent}

Secure Shell Protocol (`SSH`) est un protocole de réseau cryptographique qui sert de passerelle virtuelle, permettant un accès sécurisé à des machines distantes via des réseaux potentiellement moins sûrs en utilisant les clés SSH accessions. Il fournit un moyen efficace d'interagir à distance avec les systèmes sans avoir besoin d'une présence physique. Dans ce contexte, `SSH` offre deux mécanismes principaux d'authentification: l'approche traditionnelle basée sur le mot de passe et la méthode plus sécurisée des paires de clés public-privée.

Pour plus d'informations sur `SSH`, voir [le sujet connexe de l'Académie SSH](https://www.ssh.com/academy/ssh).

Pour rationaliser le processus de connexion et contourner la nécessité d'une entrée répétitive, il est possible d'accoupler les touches `SSH` avec l'Agent SSH (`ssh-agent`)le programme d'assistant qui se souvient de vos touches et/ou mot de passe `SSH` pendant toute une session. Cette configuration permet à la passerelle `SSH` d'accéder sans effort aux clés chaque fois qu'elle se connecte à d'autres machines.

Le flux de travail ici est le suivant: vous avez votre clé publique stockée sur un système distant et gardez votre clé privée sécurisée. Chaque fois que vous voulez accéder à un système distant, le `ssh-agent` Le système distant renvoie ensuite un message d'accès à la clé. [défi](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) que seule votre clé privée peut réagir correctement. `ssh-agent` s'occupe de ce défi en utilisant votre clé privée et envoie la réponse correcte au système à distance. Si la réponse correspond à ce que le système s'attendait, vous avez accès.

La beauté du `ssh-agent` est qu'il conserve votre clé privée pendant votre session, il n'est donc pas nécessaire de continuer à entrer votre mot de passe ou la phrase de clé privée chaque fois que vous vous connectez à un système distant.

Pour plus d'informations sur le sujet `ssh-agent`, voir [le sujet connexe de l'Académie SSH](https://www.ssh.com/academy/ssh/agent).

::: info Remarque

Pour une vue d'ensemble détaillée des `SSH` le protocole et les `ssh-agent` outil, voir ce qui suit: [SSH Académie](https://www.ssh.com/academy) les sujets suivants:

  - [Qu'est-ce qui est SSH (Secure Shell) ?](https://www.ssh.com/academy/ssh)
  - [ssh-agent: Comment configurer l'agent ssh, le transfert d'agents et le protocole de l'agent](https://www.ssh.com/academy/ssh/agent)

:::

### Ajout d' un programme de gestion des mots de passe {#adding-a-password-manager-program}

Il est recommandé d'améliorer la sécurité de vos clés `SSH` en les protégeant par un mot de passe, ce qui constitue un obstacle supplémentaire aux parties malveillantes qui cherchent à obtenir vos informations sensibles.

Une variété de gestionnaires de mots de passe peut être utilisée pour stocker les mots de passe des utilisateurs et `SSH` Les clés sont temporaires, pour l'évidence. [KeePass](https://keepass.info/) est utilisé comme exemple de gestionnaire de mots de passe, en particulier, le [KeePassXC](https://keepassxc.org/) port exécuté sur les systèmes d'exploitation Linux.

Pour les instructions sur la configuration de KeePassXC, voir la section [Configurer KeePassXC](#configuring-keepassxc) ci-dessous.

![KeePassXC: écran `Main` UI](../../../img/KeePassXC.png)

KeePassXC offre une sécurité, une flexibilité et un contrôle améliorés. Il stocke non seulement les mots de passe mais aussi les clés `SSH`. Lorsqu'il est utilisé pour le stockage des clés, ce gestionnaire de mots de passe fournit aux `ssh-agent` les clés stockées, qui sont ensuite promptement supprimés de sa mémoire une fois la fenêtre KeePassXC fermée.

::: astuce

En théorie, l'un des KeePass les ports [figurant sur le site officiel](https://keepass.info/download.html) Il est recommandé d'utiliser l'un des éléments suivants: [KeePassX](https://www.keepassx.org/) ou [KeePassXC](https://keepassxc.org/).

:::

#### Configuration KeePassXC {#configuring-keepassxc}

Pour configurer KeePassXC, procédez aux étapes suivantes:

1. Lancer KeePassXC, puis aller dans Tools > Paramètres, ou sélectionner le bouton Gear du panneau supérieur UI.

2. Dans l'onglet Paramètres d'application qui apparaît, sélectionnez SSH Agent dans le menu gauche, puis sélectionner la case de codage Activer SSH Integration de l'agent.

   ::: info Afficher une capture d'écran de référence

   ![L'affichage KeePassXC `SSH Agent`: Activation de l'agent SSH ](../../../img/keepassxc_ssh_agent.png)

   :::

3. Créer une nouvelle base de données KeePassXC. Pour les instructions, voir le guide utilisateur [KeePassXC > Créer votre première base de données](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

4. Pour chaque clé que vous souhaitez stocker dans la base de données KeePassXC que vous avez créée, procédez aux étapes suivantes:

   - Ajoutez une nouvelle entrée dans la base de données. Pour les instructions, voir [KeePassXC Guide d'utilisateur > Créer votre première base de données ](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

   - Lors de l'ajout d'une nouvelle entrée, joindre le fichier contenant la clé en faisant ce qui suit: sélectionnez Avancé dans le menu à gauche, puis sélectionner Ajouter dans la section Joints, choisissez le fichiers requis dans la fenêtre Sélectionner les fichiers qui apparaît.

   - Lors de l'ajout d'une nouvelle entrée, sélectionnez SSH Agent dans le menu gauche, puis le fichier clé que vous avez ajouté dans le menu Ajout dans la section clé privée; puis sélectionner les cases de codage suivantes:

      - Ajouter une clé à l'agent lorsque la base de données est ouverte/déverrouillée.

      - Retirer la clé de l'agent lorsque la base de données est fermée/verrouillée

      - Exiger une confirmation de l'utilisateur lorsque cette clé est utilisée

   - Si nécessaire, apporter d'autres modifications à l'entrée.

   - Lorsqu'il est prêt, sélectionnez OK pour enregistrer l'entrée.

   ::: details Afficher des captures d'écran de référence

   ![L'onglet KeePassXC `Advanced`: Ajout d'une pièce jointe à la clé privée ](../../../img/keepassxc_private_key.png)

   ![L'onglet KeePassXC `SSH Agent`: Ajout d'une pièce jointe à la clé privée ](../../../img/keepassxc_pk_agent.png)

   :::

##### Les résultats attendus {#expected-results}

- Les clés cryptographiques et `shh` sont stockées en tant qu'entrées dans une base de données KeePassXC à laquelle on peut accéder pendant que la fenêtre KeePassXC est ouverte.

- Les clés cryptographiques stockées et `ssh` peuvent être utilisées chaque fois qu'elles sont requises pour l'autorisation.

- cryptographique stockée et `ssh` Les clés sont retirées de la `ssh-agent` une fois le KeePassXC La fenêtre est fermée.

::: info Remarque

Sans avoir activé l'option Require confirmation utilisateur lorsque cette clé est utilisée, le `ssh-agent` ne peut pas surveiller le processus qui lui a fourni une clé. Dans le cas où le processus de gestion des mots de passe est arrêté par un logiciel malveillant ou un service système via un signal `SIGKILL`, la clé restera probablement dans le `ssh-agent`, puisque les programmes système Unix ne peuvent pas intercepter `SIGKILL`.

:::

## Le stockage physique des clés cryptographiques {#storing-cryptographic-keys-physically}

Pour ceux qui recherchent le plus haut niveau de sécurité hors ligne, l'option de stocker des clés cryptographiques garantit physiquement que les clés restent complètement déconnectées des réseaux numériques, minimisant ainsi le risque d'accès non autorisé. Le fait de reconnaître l'option physique souligne notre engagement à répondre aux divers besoins en matière de sécurité.

### À l'aide d'une clé matérielle {#using-a-hardware-key}

Notre équipe considère les clés matérielles comme l'une des meilleures mesures de sécurité. Une clé matérielle est un appareil compact qui se connecte via un port USB et a la taille d'un lecteur flash typique. Cela vous permet de déconnecter facilement l'appareil en cas de violation de la sécurité, ou simplement de le reconnecter à une autre machine chaque fois que cela est nécessaire.

Cependant, comme il existe de nombreuses marques de clés matérielles dont chacune possède son APIs unique, il est important d'effectuer des recherches sur le marché pour trouver la clé qui convient le mieux à vos besoins.

Jusqu'à présent, notre équipe a testé en interne la clé de matériel [YubiKey 5C](https://www.yubico.com/il/product/yubikey-5c/) qui s'est avérée avoir beaucoup de fonctionnalités positives, y compris la fonctionnalité polyvalente API.

Cependant, il y a un inconvénient potentiel à considérer. La mise en œuvre de l'authentification [HMAC challenge-response](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) et le stockage d'une clé privée correspondante pour cette réponse pourrait créer une vulnérabilité. Cette configuration pourrait, par inadvertance, permettre aux attaquants de faire des suppositions éclairées sur les informations stockées dans la mémoire du YubiKey 5C, compromettant ainsi la sécurité globale.

Heureusement, cette vulnérabilité peut être atténuée en adoptant une approche alternative à l'utilisation de la clé YubiKey 5C. L'idée est d'utiliser YubiKey 5C pour accéder en toute sécurité à une base de données KeePassXC qui stocke vos clés cryptographiques et `SSH`. Cette méthode peut même être considérée comme bénéfique, car elle dépasse la sécurité de la plupart des mots de passe et rend nécessaire que la partie malveillante soit en possession de votre clé matérielle au cas où la base de données KeePassXC serait fuite.

::: informations

Pour en savoir plus sur la méthode ci-dessus, voir la réponse de l'un des développeurs KeePassXC[Janek Bevendorff](https://github.com/phoerious)à la question suivante StackExchange:

[Est-il raisonnable d'utiliser KeePassXC avec YubiKey?](https://security.stackexchange.com/questions/201345/is-it-reasonable-to-use-keepassxc-with-yubikey/258414#258414)

:::

### L'utilisation d'une phrase mnemonique {#using-a-mnemonic-phrase}

Alternativement, vous pouvez mémoriser une clé privée sous la forme d'une série de mots, connue sous le nom de phrase mnemonique. Cette méthode, utilisée dans de nombreux portefeuilles, nécessite de se souvenir d'environ 25 mots spécifiques. La plupart des gestionnaires de mots de passe, y compris les précédemment discutés KeePassXC, offrent une génération de mots de passe mnemoniques.
