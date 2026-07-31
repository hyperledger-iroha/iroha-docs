---
translation_locale: fr
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Troubleshooting des problèmes d'installation {#troubleshooting-installation-issues}

Cette section offre des conseils de résolution des problèmes pour Iroha 3 l'installation.
le problème que vous rencontrez n'est pas décrit ici,
communiquer avec nous via [Télégramme](https://t.me/hyperledgeriroha).

## Contrôles rapides {#quick-checks}

La plupart des défaillances d'installation proviennent de quatre endroits:

- à la Rust chaîne d'outils plus ancienne que la version fixée par l'espace de travail en amont
- `cargo` ou `rustc` résolution vers une installation différente de celle `rustup`
- les outils de construction du système manquants tels qu'un compilateur C, `pkg-config`, ou CMake
- des extraits générés par l'ancienneté ou des artefacts de construction locale après changement de source
  révision

Le rapport Iroha le paiement de la source, en commençant par:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

Si `cargo metadata` échec, réparer la chaîne d'outils locale avant l'exécution
`pnpm refresh:iroha --source /path/to/iroha`, parce que le rafraîchissement peut invoquer
Kagami pour générer le schéma de modèle de données actuel.

## Résolution des problèmes Rust Chaîne d'outils {#troubleshooting-rust-toolchain}

Parfois, les choses ne vont pas comme prévu. `rust` sur votre
Le système a été mis à jour il y a un certain temps, mais n'a pas été mis à niveau.
Python: XKCD a un exemple célèbre de ce à quoi cela pourrait ressembler:

<div class="flex justify-center">

![Python comic pour résoudre les problèmes environnementaux](/img/install-troubles.png)

</div>

### Vérifiez Rust version {#check-rust-version}

Dans l'intérêt de préserver votre santé mentale et la nôtre, assurez-vous
avoir la bonne version de `cargo` associé à la bonne version de `rustc`.
L'espace de travail actuel en amont déclare `rust-version = "1.92"` et les pinces
canal de chaîne d'outils dans `rust-toolchain.toml`. Pour montrer les versions, faites

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

et puis

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

Si vous avez des versions plus élevées, vous êtes bien.
peut exécuter la commande suivante pour la mettre à jour:

```bash
$ rustup toolchain update stable
```

### Vérifiez le lieu d'installation {#check-installation-location}

Si vous obtenez des numéros de version inférieurs **et** vous avez mis à jour la chaîne d'outils et il
n'a pas fonctionné... disons juste que c'est un problème commun, mais il n'y a pas de problème
une solution commune.

Tout d'abord, vous devez établir où la version que vous voulez utiliser est
sont installés:

```bash
$ rustup which rustc
$ rustup which cargo
```

Les installations utilisateur des chaînes d'outils sont _habituellement_ dans
`~/.rustup/toolchains/stable-*/bin/`. Si c'est le cas, vous devriez être
capable de courir

```bash
$ rustup toolchain update stable
```

et ça devrait résoudre vos problèmes.

### Vérifiez le paramètre par défaut Rust version {#check-the-default-rust-version}

Une autre option est que vous ayez les informations actuelles `stable` la chaîne d'outils, mais il
n'est pas réglé par défaut.

```bash
$ rustup default stable
```

Cela peut se produire si vous installez un `nightly` une version, ou de définir un
Rust la version, mais j'ai oublié de le dé-installer.

### Vérifiez s' il y a d' autres Rust versions {#check-if-there-are-other-rust-versions}

Continuant le trou de dépannage du lapin, nous pourrions avoir une coquille
les pseudonymes:

```bash
$ type rustc
$ type cargo
```

Si ces points pointent vers d'autres endroits que celui que vous avez vu lors de la course
`rustup which *`, Si vous avez un problème, il ne suffit pas de
Je suis juste

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

Parce qu'il y a une logique interne qui pourrait se briser, peu importe comment vous
Réorganisez vos aliases.

La solution la plus simple serait de supprimer les versions que vous n'utilisez pas.

C'est plus facile. _dit_ plus que _réalisé_, Toutefois, puisqu'elle implique le suivi de toutes les
versions de rustup Il n'y a généralement que des
Deux: la version du gestionnaire de paquets système et celle qui a été installée dans
l'emplacement standard dans votre dossier d'origine lorsque vous avez exécuté la commande dans le
Pour le premier, consultez votre (Linux)
Le manuel de distribution (`apt remove rust`Pour ce dernier, exécuter:

```bash
$ rustup toolchain list
```

Et puis, pour chaque `<toolchain>` (sans les boucles d'angle bien sûr):

```bash
$ rustup remove <toolchain>
```

Après ça, assurez-vous que

```bash
$ cargo --help
```

entraîne une erreur de commande non trouvée, c'est-à-dire que vous n'avez pas d'actif Rust
la chaîne d'outils est installée.

```bash
$ rustup toolchain install stable
```

## Résolution des problèmes Python chaîne d'outils {#troubleshooting-python-toolchain}

Lorsque vous installez le Python L'emballage des roues à l'aide d'un tuyau pendant [Python configuration du client](/fr/guide/tutorials/python.md), vous pouvez rencontrer une erreur comme:
"Iroha_Le python...*.whl n'est pas une roue supportée sur cette plateforme".

Cette erreur signifie que pip est obsolète, vous devez donc le mettre à jour.
Tout d'abord, il est recommandé de vérifier votre OS pour les mises à jour et effectuer une mise à niveau du système.

Si ça ne marche pas, tu peux essayer de mettre à jour `pip` pour votre répertoire d'utilisateurs.

`python -m pip install --upgrade pip`

Assurez-vous que `pip` qui est installé dans votre répertoire d'accueil. `whereis pip` et vérifier si `/home/username/.local/bin/pip` Si ce n'est pas le cas, mettez à jour votre coquille. `PATH` une variable.

Si le problème persiste, s'il vous plaît [communiquer avec nous](/fr/help/) et de signaler les résultats.

```
python --version
python3 --version
pip --version
pip3 --version
```
