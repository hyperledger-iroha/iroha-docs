---
translation_locale: fr
translation_source: /guide/security/password-security.md
translation_source_hash: 39d03f2fa20a21745056353be8f132310fcf9cde051a4fb6528f6257ddc3158a
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Sécurité des mots de passe {#password-security}

Dans le domaine de la sécurité blockchain, protéger les mots de passe est primordial. Pour s'assurer que vos données et tout ce qu'elles représentent restent imperméables à un accès non autorisé, examinons les nuances de la sécurité des mots de passe.

## La force du mot de passe {#password-strength}

Il est probable que vous ayez déjà rencontré des recommandations sur la façon de trouver un _fort_ Ces recommandations peuvent impliquer des conseils tels que la longueur minimale du mot de passe, l'ajout de caractères spéciaux, etc. Ces recommandations visent à augmenter la force de votre mot de passe qui dépend de l'entropie, c'est-à-dire de la randomité du mot de parole.

Donc, ce qui définit une _mot de passe fort_? Un mot de passe fort est un mot de passe avec _haute entropie_.

Pour calculer l'entropie d'un mot de passe, nous pouvons suivre le **Formule d'entropie**:

::: tip Formule d'entropie

$L$  Longueur du mot de passe; nombre de symboles dans le mot de passe.\
$S$  Ensemble de caractères; taille du groupe de symboles uniques possibles.\
$S^L$  Nombre de combinaisons possibles.

$$Entropy=log_2(S^L)$$

Le nombre résultant est la quantité de bits d'entropie dans un mot de passe.

Connaissant la valeur d'entropie, le nombre de tentatives requises pour forcer un mot de passe brute avec cette entropie peut être dérivé en utilisant la formule suivante:

$$S^L=2^Entropy$$

Il n'existe pas de réponse universelle quant à l'entropie d'un mot de passe. `64` à `127` des bits (`128` Le nombre de bits ou plus est généralement considéré comme un excès). <abbr title="Graphics Processing Unit">GPU</abbr>Les systèmes de détection des mots de passe continuent d'évoluer et le temps nécessaire au crack du mot de passe diminue avec le temps.

:::

Following la formule d'entropie, comparons les deux exemples suivants:

  1. Un mot de passe de 16 caractères avec le jeu de caractères utilisant uniquement des lettres minuscules de l'alphabet anglais moderne (26 caractères) donne environ 43 sextillion ($43*10^21$) des combinaisons possibles.

    $$Entropy=log_2(26^{16})=log_2(43,608,742,899,428,874,059,776)=75.20703...$$

  2. Un mot de passe de 16 caractères avec le jeu de caractères élargi à 96, y compris les lettres majuscules et les symboles spéciaux, gonfle le nombre de combinaisons possibles à 52 non millions ($52*10^30$), améliorant considérablement l'entropie.

    $$Entropy=log_2(96^{16})=log_2(52,040,292,466,647,269,602,037,015,248,896)=105.35940... $$

Comme on peut le voir, même en étendant seulement l'ensemble de caractères de 26 à 96 symboles, le nombre de combinaisons possibles qu'une partie malveillante aurait besoin pour bruteforce a augmenté par $1.1933*10^9$ Des fois.

En plus d'augmenter la longueur du mot de passe, le nombre de combinaisons possibles augmentera encore davantage, améliorant ainsi l'entropiestrengthdu mot de passe.

Cependant, au lieu de lutter contre les complexités, nous vous conseillons d'utiliser un programme de gestion de mots de passe comme [KeePassXC](https://keepassxc.org/) (pour plus de détails, voir _[Ajout d' un programme de gestion des mots de passe](./storing-cryptographic-keys.md#adding-a-password-manager-program)_ et _[Configuration KeePassXC](./storing-cryptographic-keys.md#configuring-keepassxc)_Pour générer et stocker vos mots de passe en toute sécurité.

::: tip

Certains sites Web limitent l'entropie maximale possible des mots de passe, c'est-à-dire limitent soit la longueur maximale du mot de passe, soit l'ensemble des caractères acceptés, ou les deux.

Gardez cela à l'esprit lorsque vous utilisez ces sites Web et essayez de mettre régulièrement à jour vos mots de passe.

:::

## Les vulnérabilités des mots de passe {#password-vulnerabilities}

Les mots de passe peuvent être victimes d'attaques brute-force, généralement exécutées à l'aide de puissants GPUs Pour contrecarrer ces tentatives, créez un mot de passe unique dépourvu d'informations personnelles telles que les anniversaires, les adresses, les numéros de téléphone ou les chiffres de sécurité sociale. Évitez de fournir aux attaquants des indices facilement devinables.

Il est difficile de déchiffrer un mot de passe moderne.

Avec une configuration comme [Kevin Mitnick](https://en.wikipedia.org/wiki/Kevin_Mitnick)Je suis là . [configuration du groupe](https://twitter.com/kevinmitnick/status/1649421434899275778?s=20) logement 24 NVIDIA® GeForce RTX 4090 et 6 NVIDIA® GeForce RTX Les années 2080, ils courent tous [Hachtopolis](https://github.com/hashtopolis) logiciel, il avait l'habitude de craquer des mots de passe qui auraient pris un an en seulement six mois.

Cependant, comparons-le à un seul RTX 4090, capable de traiter jusqu'à 300 <abbr title="Hashes per second">H/s</abbr> en utilisant [`NTLM`](https://www.tarlogic.com/cybersecurity-glossary/ntlm-hash) et 200 <abbr title="Hashes per second">H/s</abbr> en utilisant [`bcrypt`](https://en.wikipedia.org/wiki/Bcrypt), comme indiqué dans [ce tweet](https://twitter.com/Chick3nman512/status/1580712040179826688).

En prolongation de nos précédents calculs d'entropie, examinons maintenant les temps de fissuration projetés suivants:

  1. Il y en a $31,540,000$ En supposant que le pire scénario soit `NTLM`, à la vitesse de $300*10^9$ <abbr title="Hashes per second">H/s</abbr>, Il faudrait un seul. RTX 4090 environ $4,608.83$ Des années pour déchiffrer un mot de passe de 16 caractères avec un ensemble de 26 lettres de l'alphabet anglais moderne.

  2. Si au lieu de `NTLM` nous utilisons `bcrypt`, réduire la vitesse d'itération à $200*10^3$ <abbr title="Hashes per second">H/s</abbr>, tout en élargissant le caractère à 96, y compris les lettres majuscules et les symboles spéciaux, le temps de craquer augmente à environ $8,249,887,835,549,662,270.456$ des années, dépassant de loin l'âge de l'univers.

Donc, en choisissant simplement une entropie plus élevée a augmenté le temps qu'il faut pour déchiffrer un mot de passe à des nombres insondables. GPUs, Toutefois, cette méthode est palissante par rapport aux [XKCD approche](https://xkcd.com/538/).

Il est important de noter qu'un ensemble étendu de caractères n'est pas toujours nécessaire pour atteindre une entropie élevée. [XKCD comédies](https://xkcd.com/936/) Il y a un exemple éloquent de ce concept.

::: warning

Évitez d'écrire votre mot de passe n'importe où. Conservez votre phrase de récupération de mot de passe en toute sécurité. Si la phrase est trop longue, vous pouvez l'enregistrer, en vous assurant que vous pouvez la lire et la taper plus tard. Conservez la copie physique de la phrase dans un endroit sûr et/ou un conteneur.

:::
