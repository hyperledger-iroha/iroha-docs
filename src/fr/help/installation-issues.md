---
translation_locale: fr
translation_source: /help/installation-issues.md
translation_source_hash: 2f548e96f8a72ea83a8b39fabf7f3713ad7b8df0eac627ed2138cbd9d3f7ea36
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Troubleshooting des problèmes d'installation {#troubleshooting-installation-issues}

Cette section offre des conseils de dépannage pour l'installation Iroha 3. Si le problème que vous rencontrez n'est pas décrit ici, contactez-nous via [Telegram](https://t.me/hyperledgeriroha).

## Contrôles rapides {#quick-checks}

La plupart des défaillances d'installation proviennent de l'un des quatre points suivants:

- une chaîne d'outils Rust plus ancienne que la version fixée par l'espace de travail en amont;
- `cargo` ou `rustc` résolvant dans une installation différente de celle de `rustup`
- outils de construction du système manquants tels qu'un compilateur C, `pkg-config`, ou CMake
- des extraits générés par l'ancienneté ou des artefacts de construction locale après avoir modifié les modifications de la source

À partir de la caisse source Iroha, commencez par:

```bash
rustup show
cargo --version
rustc --version
cargo metadata --no-deps
```

Si `cargo metadata` ne fonctionne pas, réparez la chaîne d'outils locale avant d'exécuter `pnpm refresh:iroha --source /path/to/iroha`, car le rafraîchissement peut invoquer Kagami pour générer le schéma de modèle de données en cours.

## Réparation des problèmes Rust Chaîne d'outils {#troubleshooting-rust-toolchain}

Parfois, les choses ne vont pas comme prévu. Surtout si vous aviez `rust` sur votre système il y a un certain temps, mais n'avez pas mis à niveau. Un problème similaire peut se produire dans Python: XKCD a un exemple célèbre de ce que cela pourrait ressembler:

<div class="flex justify-center">

![Python comic pour résoudre les problèmes environnementaux](/img/install-troubles.png)

</div>

### Vérifiez la version Rust {#check-rust-version}

Dans l'intérêt de préserver votre santé mentale et la nôtre, assurez-vous d'avoir la bonne version de `cargo` associée à la bonne version du `rustc`. L'espace de travail en amont actuel déclare `rust-version = "1.92"` et fixe le canal de chaîne d'outils dans `rust-toolchain.toml`.

```bash
$ cargo -V
$ cargo 1.93.1 (...)
```

et puis

```bash
$ rustc --version
$ rustc 1.93.1 (...)
```

Si vous avez des versions supérieures, c'est bien. Si vous avez les versions inférieures, vous pouvez exécuter la commande suivante pour la mettre à jour:

```bash
$ rustup toolchain update stable
```

### Vérifiez le lieu d'installation {#check-installation-location}

Si vous obtenez des numéros de version inférieurs et que vous avez mis à jour la chaîne d'outils et qu'il n'a pas fonctionné... disons juste que c'est un problème commun, mais il n'y a pas de solution commune

Tout d'abord, vous devez déterminer où la version que vous souhaitez utiliser est installée:

```bash
$ rustup which rustc
$ rustup which cargo
```

Les installations utilisateurs des chaînes d'outils sont généralement en `~/.rustup/toolchains/stable-*/bin/`.

```bash
$ rustup toolchain update stable
```

et ça devrait résoudre vos problèmes.

### Vérifiez la version par défaut Rust {#check-the-default-rust-version}

Une autre option est d'avoir la chaîne d'outils `stable` mise à jour, mais elle n'est pas définie par défaut.

```bash
$ rustup default stable
```

Cela peut se produire si vous avez installé une version `nightly`, ou configuré une version spécifique Rust, mais que vous avez oublié de la désactiver.

### Vérifiez s'il existe d'autres versions Rust {#check-if-there-are-other-rust-versions}

En continuant à résoudre les problèmes dans le trou du lapin, nous pourrions avoir des pseudonymes:

```bash
$ type rustc
$ type cargo
```

Si ces points pointent vers d'autres endroits que celui que vous avez vu lors de l'exécution `rustup which *`, alors vous avez un problème.

```bash
$ alias rustc "~/.rustup/toolchains/stable-*/bin/rustc"
$ alias cargo "~/.rustup/toolchains/stable-*/bin/cargo"
```

Parce qu'il y a une logique interne qui pourrait être cassée, peu importe comment vous réorganisez vos aliases de shell.

La solution la plus simple serait de supprimer les versions que vous n'utilisez pas.

Cependant, il est plus facile à dire qu'à faire car cela implique le suivi de toutes les versions de rustup installées et disponibles pour vous. la version du gestionnaire de paquets système et celle qui a été installée dans l'emplacement standard de votre dossier d'accueil lorsque vous avez exécuté la commande au début de ce tutoriel. Pour le premier, consultez votre manuel de distribution (Linux) `apt remove rust` .

```bash
$ rustup toolchain list
```

Et puis, pour chaque `<toolchain>` (sans les parenthèses d'angle bien sûr):

```bash
$ rustup remove <toolchain>
```

Après ça, assurez-vous que

```bash
$ cargo --help
```

Cela entraîne une erreur de commande non trouvée, c'est-à-dire que vous n'avez pas installé la chaîne d'outils active Rust.

```bash
$ rustup toolchain install stable
```

## Résolution des problèmes de chaîne d'outils Python {#troubleshooting-python-toolchain}

Lorsque vous installez le Python L'emballage des roues à l'aide d'un tuyau pendant [Python configuration du client](/fr/guide/tutorials/python.md), vous pouvez rencontrer une erreur comme: "iroha_Le python...*.whl n'est pas une roue supportée sur cette plateforme. "

Cette erreur signifie que pip est dépassé, vous devez donc le mettre à jour. Tout d'abord, il est recommandé de vérifier votre OS pour les mises à jour et effectuer une mise à niveau du système.

Si cela ne fonctionne pas, vous pouvez essayer de mettre à jour `pip` pour votre annuaire d'utilisateurs.

`python -m pip install --upgrade pip` Il est nécessaire d'effectuer une vérification.

Assurez-vous que `pip` est installé dans votre répertoire d'accueil. Pour ce faire, exécutez `whereis pip` et vérifiez si `/home/username/.local/bin/pip` figure parmi les chemins. Si non, mettez à jour la variable `PATH` de votre coquille.

Si le problème persiste, s'il vous plaît [communiquer avec nous](/fr/help/) et de signaler les résultats.

```
python --version
python3 --version
pip --version
pip3 --version
```
