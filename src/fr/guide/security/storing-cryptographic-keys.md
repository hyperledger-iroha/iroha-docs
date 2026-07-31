---
translation_locale: fr
translation_source: /guide/security/storing-cryptographic-keys.md
translation_source_hash: a420551345570c4f6b6c0288bc78041665b199727b177eb0aee1f6495850fae6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Le stockage des clés cryptographiques {#storing-cryptographic-keys}

Vos données sensibles ne restent confidentielles que si vous adoptez <abbr title="Operational Security">OPSEC</abbr> Les menaces d'ingénierie sociale, dans lesquelles quelqu'un qui se présente comme une personne ayant autorité essaie de vous manipuler pour lui donner votre clé cryptographique privée, sont réelles.

Pour plus d'informations sur <abbr title="Operational Security">OPSEC</abbr> et ses meilleures pratiques, voir [Sécurité opérationnelle](./operational-security).

## Le stockage numérique des clés cryptographiques {#storing-cryptographic-keys-digitally}

En ce qui concerne la protection numérique des clés cryptographiques, il n'y a principalement que deux approches[SSH](https://www.ssh.com/) et [GPG](https://www.gnupg.org/)Ces méthodes offrent des couches de sécurité pour empêcher un accès non autorisé à vos clés cryptographiques.

Beaucoup Iroha Les décisions architecturales ont été influencées par les principes de la **La coque sécurisée** (`SSH`Le protocole, qui est la raison pour laquelle cette section se concentre principalement sur les `SSH` L'approche, offrant des instructions sur la façon d'implémenter efficacement le protocole pour stocker vos clés cryptographiques au sein du Iroha l'écosystème.

### Utilisation SSH et SSH Agente ! {#using-ssh-and-ssh-agent}

**Protocole de coque sécurisé** (`SSH`) est un protocole réseau cryptographique qui sert de passerelle virtuelle, permettant un accès sécurisé à des machines distantes via des réseaux potentiellement moins sûrs en utilisant SSH Il fournit un moyen efficace d'interagir à distance avec les systèmes sans avoir besoin de présence physique. `SSH` offre deux mécanismes principaux d'authentification: l'approche traditionnelle basée sur le mot de passe et la méthode plus sécurisée des paires de clés public-privé.

Pour plus d'informations sur `SSH`, voir [les liés SSH Thème de l'Académie](https://www.ssh.com/academy/ssh).

Pour rationaliser le processus de connexion et contourner la nécessité d'une entrée répétitive, il est possible d'accoupler les `SSH` les clés avec le **SSH Agente !** (`ssh-agent`Le programme d'assistants qui se souvient de votre `SSH` les clés et/ou le mot de passe pour la durée d'une session. `SSH` une passerelle permettant d'accéder sans effort aux clés chaque fois qu'elle se connecte à d'autres machines.

Le flux de travail ici est le suivant: vous avez votre clé publique stockée sur un système distant et gardez votre clé privée sécurisée. `ssh-agent` les mesures prises pour communiquer votre _le public_ Le système distant renvoie ensuite un [défi](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) que seulement votre _privé_ La clé peut répondre correctement. `ssh-agent` Il peut relever ce défi en utilisant _privé_ Si la réponse correspond à ce que le système s'attendait, vous avez accès.

La beauté de la `ssh-agent` est qu'il conserve votre clé privée pendant votre session, il n'y a donc pas besoin de continuer à entrer votre mot de passe ou phrase de clé privée chaque fois que vous vous connectez à un système distant.

Pour plus d'informations sur le `ssh-agent`, voir [les liés SSH Thème de l'Académie](https://www.ssh.com/academy/ssh/agent).

::: info Note

Pour une vue d'ensemble détaillée des `SSH` le protocole et les `ssh-agent` outil, voir ce qui suit: [SSH Académie](https://www.ssh.com/academy) les thèmes suivants:

  - [Qu'est-ce qui est SSH (Secure Shell) ?](https://www.ssh.com/academy/ssh)
  - [ssh-agent: Comment configurer l'agent ssh, le transfert d'agent et le protocole de l'agent](https://www.ssh.com/academy/ssh/agent)

:::

### Ajout d' un programme de gestion des mots de passe {#adding-a-password-manager-program}

Il est recommandé d'améliorer la sécurité de votre `SSH` les clés en les protégeant par un mot de passe, ce qui constitue un obstacle supplémentaire aux parties malveillantes visant à obtenir vos informations sensibles.

Une variété de gestionnaires de mots de passe peut être utilisée pour stocker les mots de passe des utilisateurs et `SSH` Pour l'évidence, [KeePass](https://keepass.info/) est utilisé comme exemple de gestionnaire de mots de passe, en particulier le [KeePassXC](https://keepassxc.org/) port exécuté sur des systèmes d'exploitation basés sur Linux.

Pour les instructions sur la configuration KeePassXC voir le [Configuration KeePassXC](#configuring-keepassxc) section ci-dessous.

![KeePassXC: `Main` écran UI](../../../img/KeePassXC.png)

KeePassXC Il offre une sécurité, une flexibilité et un contrôle améliorés. `SSH` Lorsque utilisé pour le stockage des clés, ce gestionnaire de mots de passe fournit la `ssh-agent` les clés stockées, qui sont ensuite rapidement supprimées de sa mémoire une fois que le KeePassXC La fenêtre est fermée.

::: tip

En théorie, l'un des KeePass Portes [figurant sur le site officiel](https://keepass.info/download.html) peuvent être utilisées à des fins de stockage clés.
Nous vous recommandons l'un des éléments suivants: [KeePassX](https://www.keepassx.org/) ou [KeePassXC](https://keepassxc.org/).

:::

#### Configuration KeePassXC {#configuring-keepassxc}

Pour configurer KeePassXC, effectuer les étapes suivantes:

1. Lancement KeePassXC, alors allez à **Les outils** > **Paramètres**, ou sélectionner le **Équipement** bouton depuis le haut UI Le panneau.

2. Dans le **Paramètres de l'application** l'onglet qui apparaît, sélectionnez **SSH Agente !** dans le menu de gauche, puis sélectionnez **Activer SSH Intégration des agents** la boîte à chèques.

   ::: info Afficher des captures d'écran de référence

   ![KeePassXC `SSH Agent` onglet: Activation SSH Agente !](../../../img/keepassxc_ssh_agent.png)

   :::

3. Créer une nouvelle KeePassXC Base de données. Pour les instructions, voir [KeePassXC Guide de l'utilisateur > Créer votre première base de données](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

4. Pour chaque clé que vous souhaitez stocker dans le KeePassXC Base de données que vous avez créée, effectuez les étapes suivantes:

   - Ajouter une nouvelle entrée dans la base de données. [KeePassXC Guide de l'utilisateur > Créer votre première base de données](https://keepassxc.org/docs/KeePassXC_UserGuide#_creating_your_first_database).

   - Lorsque vous ajoutez une nouvelle entrée, joignez le fichier contenant la clé en faisant ce qui suit: sélectionnez **Avancé** dans le menu de gauche, puis sélectionnez **Ajouter** dans le **Les pièces jointes** section, choisissez le fichier requis dans la **Sélectionner les fichiers** la fenêtre qui apparaît.

   - Lorsque vous ajoutez une nouvelle entrée, sélectionnez **SSH Agente !** dans le menu de gauche, puis sélectionnez le fichier clé que vous avez ajouté à partir du **Appareil de liaison** menu dans le **clé privée** section; puis sélectionnez les cases de codage suivantes:

      - **Ajouter une clé à l'agent lorsque la base de données est ouverte/déverrouillée**

      - **Retirer la clé de l'agent lorsque la base de données est fermée/verrouillée**

      - **Exiger une confirmation de l'utilisateur lorsque cette clé est utilisée**

   - Si nécessaire, apporter d'autres modifications à l'entrée.

   - Lorsque vous êtes prêt, sélectionnez **OK** Pour sauver l'entrée.

   ::: details Afficher des captures d'écran de référence

   ![KeePassXC `Advanced` onglet: Ajout d'une clé privée jointe](../../../img/keepassxc_private_key.png)

   ![KeePassXC `SSH Agent` onglet: Ajout d'une clé privée jointe](../../../img/keepassxc_pk_agent.png)

   :::

##### Les résultats attendus {#expected-results}

- La cryptographie et `shh` les clés sont stockées sous forme d'entrées dans un KeePassXC Une base de données à laquelle on peut accéder pendant le KeePassXC La fenêtre est ouverte.

- cryptographiques stockées et `ssh` Les clés peuvent être utilisées chaque fois qu'elles sont requises pour l'autorisation.

- cryptographiques stockées et `ssh` Les clés sont retirées de la `ssh-agent` une fois que le KeePassXC La fenêtre est fermée.

::: info Note

En effet, il n'y a pas de **Exiger une confirmation de l'utilisateur lorsque cette clé est utilisée** l'option, le `ssh-agent` Il peut ne pas surveiller le processus qui lui a fourni une clé. Dans le cas où le processus de gestion des mots de passe est terminé par un logiciel malveillant ou un service système via un `SIGKILL` signal, la clé restera probablement dans le `ssh-agent`, comme les programmes de système Unix ne peuvent pas intercepter `SIGKILL`.

:::

## Le stockage physique des clés cryptographiques {#storing-cryptographic-keys-physically}

Pour ceux qui recherchent le plus haut niveau de sécurité hors ligne, l'option de stockage des clés cryptographiques garantit physiquement que les clés restent complètement déconnectées des réseaux numériques, minimisant ainsi le risque d'accès non autorisé.

### Utilisation d'une clé matérielle {#using-a-hardware-key}

Notre équipe considère les clés matérielles comme l'une des meilleures mesures de sécurité. USB Le système d'exploitation de l'appareil peut être utilisé pour la déconnexion du périphérique en cas de violation de sécurité ou simplement le reconnecter à une autre machine chaque fois qu'il est nécessaire.

Cependant, comme il existe de nombreuses marques de clés matérielles, chacune possède sa propre APIs il est important de faire des recherches sur le marché pour trouver la clé qui convient le mieux à vos besoins.

Jusqu'à présent, notre équipe a testé en interne [YubiKey 5C](https://www.yubico.com/il/product/yubikey-5c/) clé matérielle qui s'est avérée avoir de nombreuses caractéristiques positives, y compris la polyvalence API fonctionnalité.

Cependant, il y a un inconvénient potentiel à considérer. [HMAC l'authentification des défis et des réponses](https://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication) et le stockage d'un _privé_ Cette configuration pourrait par inadvertance permettre aux attaquants de faire des conjectures éclairées sur les informations stockées dans le YubiKey La mémoire de 5C, compromettant ainsi la sécurité globale.

Heureusement, cette vulnérabilité peut être atténuée en adoptant une approche YubiKey L'idée est d'utiliser YubiKey 5C pour accéder en toute sécurité KeePassXC base de données stockant votre cryptographie et `SSH` Cette méthode peut même être considérée comme bénéfique, car elle dépasse la sécurité de la plupart des mots de passe et rend nécessaire que la partie malveillante soit en possession de votre clé matérielle au cas où le KeePassXC La base de données est fuite.

::: info

Pour en savoir plus _la méthode ci-dessus_, voir la réponse de l'un des KeePassXC développeurs[Janek Bevendorff](https://github.com/phoerious)à ce qui suit StackExchange La question:

[Est-il raisonnable d'utiliser KeePassXC avec YubiKey?](https://security.stackexchange.com/questions/201345/is-it-reasonable-to-use-keepassxc-with-yubikey/258414#258414)

:::

### Utilisation d'une phrase mémonique {#using-a-mnemonic-phrase}

Alternativement, vous pouvez mémoriser une clé privée comme une série de mots, connu sous le nom d'une _phrase mnemonique_. Cette méthode, utilisée dans de nombreux portefeuilles, nécessite la mémorisation d'environ 25 mots spécifiques. KeePassXC, offrent la génération de mots de passe mnemoniques.
