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

Il est probable que vous ayez déjà rencontré des recommandations sur la façon d'élaborer un mot de passe fort. Elles peuvent impliquer des conseils tels que la longueur minimale du mot de passe, l'ajout de caractères spéciaux, etc. Ces recommandations visent à accroître la force de votre mot de passe qui dépend de l'entropie, c'est-à-dire de l'empathie. le hasard du mot de passe.

Alors, qu'est-ce qui définit un mot de passe fort? Un mot de passe solide est un mot de parole avec une entropie élevée.

Pour calculer l'entropie d'un mot de passe, on peut suivre la formule Entropy:

::: tip Formule d'entropie

$L$  Longueur du mot de passe; nombre de symboles dans le mot de passe.\ $S$  Ensemble de caractères; taille du groupe de symboles uniques possibles.\ $S^L$  Nombre de combinaisons possibles.

$$Entropy=log_2(S^L)$$

Le nombre résultant est la quantité de bits d'entropie dans un mot de passe. Plus le nombre est élevé, plus le mot de passe est difficile à craquer.

En connaissant la valeur d'entropie, le nombre de tentatives requises pour forcer un mot de passe brute avec cette entropie peut être dérivé en utilisant la formule suivante:

$$S^L=2^Entropy$$

Il n'y a pas de réponse universelle quant à la hauteur de l'entropie d'un mot de passe. Pour les organisations financières, il est conseillé de garder l'enthropie de leurs mots de passe dans la plage de `64` à `127` bits (`128` bits ou plus sont généralement considérés comme un excès). Cependant, gardez à l'esprit que les <abbr title="Graphics Processing Unit">GPU</abbr> continuent d'évoluer en permanence et que le temps nécessaire au crackage du mot de passe continue de diminuer avec le temps.

:::

En suivant la formule de l'entropie, comparons les deux exemples suivants:

  1. Un mot de passe de 16 caractères avec l'ensemble des caractères utilisant uniquement les petites lettres de l'alphabet anglais moderne (26 caractères) donne environ 43 sextillion ($43*10^21$) combinaisons possibles.

$$Entropy=log_2(26^{16})=log_2(43,608,742,899,428,874,059,776)=75.20703...$$

  2. Un mot de passe de 16 caractères avec le jeu de caractères élargi à 96, y compris les lettres majuscules et les symboles spéciaux, gonfle le nombre de combinaisons possibles à 52 nonmillions ( $52*10^30$), améliorant considérablement l'entropie.

$$Entropy=log_2(96^{16})=log_2(52,040,292,466,647,269,602,037,015,248,896)=105.35940... $$

Comme on peut le voir, même en élargissant seulement l'ensemble de caractères de 26 à 96 symboles, le nombre de combinaisons possibles dont une partie malveillante aurait besoin pour bruteforce s'est accru de $1.1933*10^9$ fois.

En plus d'augmenter la longueur du mot de passe, le nombre de combinaisons possibles augmentera encore davantage, améliorant ainsi l'entropie et la force du mot de mot de passe.

Cependant, au lieu de lutter contre les complexités, nous vous conseillons d'utiliser un programme de gestionnaire de mots de passe comme [KeePassXC](https://keepassxc.org/) (pour plus de détails, voir [ Ajouter un programme de gestion de mot de passe ](./storing-cryptographic-keys.md#adding-a-password-manager-program) et [Configurer KeePassXC](./storing-cryptographic-keys.md#configuring-keepassxc))  pour générer et stocker vos mots de passe en toute sécurité.

::: astuce

Certains sites Web limitent l'entropie maximale possible des mots de passe, c'est-à-dire limitent soit la longueur maximale du mot de passe, soit l'ensemble des caractères acceptés, ou les deux.

Gardez cela à l'esprit lorsque vous utilisez ces sites Web et essayez de mettre vos mots de passe à jour périodiquement.

:::

## Les vulnérabilités des mots de passe {#password-vulnerabilities}

Les mots de passe peuvent être victimes d'attaques brute-force, généralement exécutées à l'aide de puissants GPUs en conjonction avec des dictionnaires ou une itération exhaustive dans toutes les possibilités. Pour éviter ces tentatives, créez un mot de passe unique qui ne contient pas d'informations personnelles telles que les anniversaires, les adresses, les numéros de téléphone ou le numéro de sécurité sociale et évitez de donner aux agresseurs des indices faciles à deviner.

Combien il est difficile de déchiffrer un mot de passe moderne?

Avec une mise en place comme [Kevin Mitnick](https://en.wikipedia.org/wiki/Kevin_Mitnick)C' est ... [configuration du groupe](https://twitter.com/kevinmitnick/status/1649421434899275778?s=20) logement 24 NVIDIA® GeForce RTX 4090s et 6 NVIDIA® GeForce RTX Dans les années 2080, ils courent tous [Hachtopolis](https://github.com/hashtopolis) Il avait l'habitude de craquer des mots de passe qui prenaient un an en seulement six mois.

Cependant, comparons-le maintenant à un seul RTX 4090, capable de traiter jusqu'à 300 <abbr title="Hashes per second">H/s</abbr> en utilisant [`NTLM`](https://www.tarlogic.com/cybersecurity-glossary/ntlm-hash) et 200 <abbr title="Hashes per second">H/s </abbr> en utilisant[`bcrypt`](https://en.wikipedia.org/wiki/Bcrypt), comme décrit dans [ ce tweet ](https://twitter.com/Chick3nman512/status/1580712040179826688).

Comme une extension de nos précédents calculs d'entropie, examinons maintenant les temps de fissuration projetés suivants:

  1. Il y a $31,540,000$ secondes dans une année normale non bissextile. En supposant le pire scénario avec `NTLM`, à la vitesse de $300*10^9$ <abbr title="Hashes per second">H/s</abbr>, il faudrait une seule RTX 4090 environ $4,608.83$ années pour déchiffrer un mot de passe de 16 caractères avec un ensemble de caractères de 26 lettres de l'alphabet anglais moderne.

  2. Si au lieu de `NTLM` nous utilisons `bcrypt`, réduisant donc la vitesse d'itération à $200*10^3$ <abbr title="Hashes per second">H/s</abbr>, tout en élargissant l'ensemble des caractères à 96, y compris les lettres majuscules et les symboles spéciaux, le temps de fissuration augmente à environ $8,249,887,835,549,662,270.456$ années, Bien au-delà de l'âge de l'univers.

Donc, en choisissant simplement une entropie plus élevée a augmenté le temps qu'il faut pour déchiffrer un mot de passe à des nombres insondables. Oui, le processus peut être accéléré en utilisant plusieurs GPUs, mais cette méthode pâle par rapport à l'approche [XKCD](https://xkcd.com/538/).

Il est important de noter qu'un ensemble de caractères étendu n'est pas toujours nécessaire pour atteindre une entropie élevée. Il peut être obtenu en utilisant des mots de passe à plusieurs mots, ou en particulier des phrases longues. [XKCD comédienne](https://xkcd.com/936/) l'explique de façon éloquente.

::: avertissement

Évitez d'écrire votre mot de passe n'importe où. Conservez votre phrase de récupération de mot de passe en toute sécurité. Si la phrase est trop longue, vous pouvez l'enregistrer pour vous assurer que vous pouvez la lire et la taper plus tard. Conservez la copie physique de la phrase dans un emplacement sécurisé et/ou un conteneur.

:::
