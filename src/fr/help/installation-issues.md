---
translation_locale: fr
translation_source: /help/installation-issues.md
translation_source_hash: 1a2519123edc5224e720e23ef3e2bc2a7b4dba38ef87af49216c31c054c85a2a
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Résolution des problèmes d'installation {#troubleshooting-installation-issues}

Cette section offre des conseils de dépannage pour l'installation de Iroha 3. Si le problème que vous rencontrez n'est pas décrit ici, contactez-nous via [Télégramme](https://t.me/hyperledgeriroha).

## Vérifications rapides {#quick-checks}

La plupart des échecs d'installation proviennent de l'un des quatre endroits :

- une chaîne d'outils Rust plus ancienne que la version fixée par l'espace de travail en amont
- `cargo` ou `rustc` résolvant vers une installation différente de `rustup`
- outils de construction système manquants tels qu'un compilateur C, `pkg-config`, ou CMake
- extrémités générées périmées ou artefacts de construction locaux après avoir modifié les révisions de source

À partir de la copie de travail du code source Iroha, commencez par :

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

Si `cargo metadata` échoue, corrigez la chaîne d'outils locale avant d'exécuter `pnpm refresh:iroha --source /path/to/iroha`, car le rafraîchissement peut invoquer Kagami pour générer le schéma du modèle de données actuel.

## Dépannage Rust Chaîne d'outils {#troubleshooting-rust-toolchain}

Parfois, les choses ne se passent pas comme prévu. Surtout si vous aviez `rust` sur votre système il y a quelque temps, mais que vous n'avez pas fait de mise à jour. Un problème similaire peut se produire dans Python : XKCD a un exemple célèbre de ce à quoi cela pourrait ressembler :

<div class="flex justify-center">

![Python bande dessinée de dépannage d'environnement](/img/install-troubles.png)

</div>

### Vérifiez la version Rust {#check-rust-version}

Dans l'intérêt de préserver votre santé mentale ainsi que la nôtre, assurez-vous que vous avez la bonne version de `cargo` associée à la bonne version de `rustc`. L'espace de travail en amont actuel déclare `rust-version = "1.92"` et fixe le canal de la chaîne d'outils dans `rust-toolchain.toml`. Pour afficher les versions, faites

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

et puis

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

Si vous avez des versions plus récentes, vous êtes bon. Si vous avez des versions plus anciennes, vous pouvez exécuter la commande suivante pour la mettre à jour :

```bash
$ rustup toolchain update stable
```

### Vérifier l'emplacement d'installation {#check-installation-location}

Si vous obtenez des numéros de version inférieurs et que vous avez mis à jour la chaîne d'outils sans que cela fonctionne… disons simplement que c'est un problème courant, mais qu'il n'a pas de solution courante.

Tout d'abord, vous devriez déterminer où la version que vous souhaitez utiliser est installée :

```bash
$ rustup which rustc
$ rustup which cargo
```

Les installations utilisateur des chaînes d'outils se trouvent généralement dans `~/.rustup/toolchains/stable-*/bin/`. Si c'est le cas, vous devriez être capable d'exécuter

```bash
$ rustup toolchain update stable
```

et cela devrait résoudre vos problèmes.

### Vérifiez la version par défaut Rust {#check-the-default-rust-version}

Une autre option est que vous disposez de la chaîne d'outils `stable` à jour, mais qu'elle n'est pas définie comme valeur par défaut. Exécutez :

```bash
$ rustup default stable
```

Installer une version `nightly` ou définir une version spécifique Rust sans la désactiver ensuite peut causer ce problème.

### Vérifiez s'il existe d'autres versions de Rust {#check-if-there-are-other-rust-versions}

En continuant dans le terrier de dépannage, nous pourrions avoir des alias de shell :

```bash
$ type rustc
$ type cargo
```

Si ceux-ci pointent vers des emplacements autres que celui que vous avez vu lors de l'exécution de `rustup which *`, alors vous avez un problème. Notez que l'ajout d'alias comme ceux-ci ne suffit pas :

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

La logique interne peut encore échouer quelle que soit la façon dont vous arrangez vos alias de shell.

La solution la plus simple serait de supprimer les versions que vous n'utilisez pas.

C’est plus facile à dire qu’à faire, cependant, car cela implique de suivre toutes les versions de rustup installées et disponibles pour vous. En général, il n’y en a que deux : la version du gestionnaire de paquets du système et celle qui a été installée dans l'emplacement standard de votre dossier personnel lorsque vous avez exécuté la commande au début de ce tutoriel. Pour la première, consultez le manuel de votre distribution (Linux), (`apt remove rust`). Pour la seconde, exécutez :

```bash
$ rustup toolchain list
```

Et ensuite, pour chaque `<toolchain>` (sans les crochets angulaires bien sûr) :

```bash
$ rustup remove <toolchain>
```

Après avoir supprimé les chaînes d'outils, cette commande devrait signaler une erreur de commande introuvable :

```bash
$ cargo --help
```

Cette erreur confirme qu'aucune chaîne d'outils Rust active n'est installée. Ensuite, exécutez :

```bash
$ rustup toolchain install stable
```

## Dépannage de la chaîne d'outils Python {#troubleshooting-python-toolchain}

Lorsque vous installez le package Wheel Python en utilisant pip pendant [Python configuration du client](/fr/guide/tutorials/python.md), vous pouvez rencontrer une erreur comme : "iroha_python-*.whl n'est pas une roue supportée sur cette plateforme".

Cette erreur signifie que pip est obsolète, vous devez donc le mettre à jour. Tout d'abord, il est recommandé de vérifier vos OS pour les mises à jour et d'effectuer une mise à niveau du système.

Si cela ne fonctionne pas, vous pouvez essayer de mettre à jour `pip` pour votre répertoire utilisateur.

`python -m pip install --upgrade pip`

Assurez-vous que `pip` est installé dans votre répertoire personnel. Pour ce faire, exécutez `whereis pip` et vérifiez si `/home/username/.local/bin/pip` figure parmi les chemins. Sinon, mettez à jour la variable `PATH` de votre shell.

Si le problème persiste, veuillez [contactez-nous](/fr/help/) et signaler les résultats.

```
python --version
python3 --version
pip --version
pip3 --version
```
