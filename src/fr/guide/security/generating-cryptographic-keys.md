---
translation_locale: fr
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Génération de clés cryptographiques {#generating-cryptographic-keys}

Utilisez `kagami keys` pour générer le matériel de clés des clients, des pairs et des validateurs d'Iroha 3.

## Utilisation de base {#basic-usage}

Depuis une copie du code source d'Iroha :

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

La sortie JSON est généralement la plus facile à copier en TOML ou à automatiser:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

La commande affiche une clé publique et une clé privée exposée. Traitez la clé privée comme un secret ; n'ajoutez jamais au dépôt les clés de production générées.

Pour une exportation locale sécurisée ou un transfert vers un dispositif de conservation sur une plateforme Unix prise en charge, écrivez une nouvelle paire de clés dans un répertoire vide accessible uniquement au propriétaire au lieu d'afficher la clé privée :

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Le répertoire parent doit déjà exister. Le répertoire cible doit être nouveau ou appartenir déjà à l'utilisateur actuel, avoir le mode `0700`, ne contenir aucun lien symbolique et être vide. `kagami` écrit `public.key` et `private.key` avec le mode `0600` et n'affiche pas la clé privée. Avec `--pop`, il écrit également `pop.hex`.

`--out-dir` échoue de façon sûre sur les plateformes où Kagami ne peut pas appliquer ces règles du système de fichiers qui limitent l'accès au propriétaire. Le fichier de clé privée est une exportation non chiffrée, et non un signataire de production protégé par le matériel ou non exportable. Importez-le dans le dispositif de conservation approuvé, puis supprimez l'exportation conformément à la procédure de déploiement.

## Algorithmes {#algorithms}

Les algorithmes communs sont les suivants:

- `ed25519` pour les comptes clients et les identités de diffusion.
- `secp256k1` lorsqu'un compte client nécessite une identité secp256k1.
- `bls_normal` pour l'identité de consensus de chaque nœud ou pair lorsque la compilation active la prise en charge de BLS.

Vérifiez les algorithmes exacts pris en charge par votre compilation avec :

```bash
cargo run --bin kagami -- keys --help
```

## Clés de développement déterministes {#deterministic-development-keys}

Pour des fixtures reproductibles, fournissez une graine de 32 octets codée sous forme de 64 caractères hexadécimaux. Un préfixe `0x` facultatif est accepté :

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

La graine constitue du matériel de clé privée. N'utilisez des graines déterministes que pour le développement local et les tests. Omettez `--seed-hex` pour générer une clé de production à partir de la source aléatoire du système d'exploitation.

## Clés de consensus BLS et preuves de possession {#bls-consensus-keys-and-proofs-of-possession}

Les identités de consensus des nœuds et des pairs d'Iroha 3 utilisent des clés BLS normales. Générez une clé BLS normale et une preuve de possession (PoP) avec :

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` n'est valide qu'avec `bls_normal`. La sortie JSON comprend `pop_hex`. La genèse signée exige une PoP correspondante pour chaque validateur votant. Dans la configuration des pairs, une table `trusted_peers_pop` non vide sélectionne le sous-ensemble des validateurs ; les pairs de confiance omis de cette table non vide sont des observateurs. Si la table est vide, tous les pairs de confiance dotés de clés BLS normales entrent dans l'ensemble initial des candidats, les PoPs des validateurs votants étant toujours fournies par la genèse signée.

## Formats de sortie {#output-formats}

Utilisez la sortie par défaut pour l'inspection du terminal, `--json` pour l'automatisation et `--compact` lorsqu'un autre script a besoin de valeurs orientées vers des lignes simples:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Pour l'aide générée intégralement Kagami:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
