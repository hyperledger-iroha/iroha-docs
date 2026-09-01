---
translation_locale: fr
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: f3d08a8e7fe7569ef783b93bccdc900ca74b85179a749b48b96c32028c749233
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Génération de clés cryptographiques {#generating-cryptographic-keys}

Utilisez `kagami keys` pour générer le matériel de clé client, pair réseau et validateur pour Iroha 3.

## Utilisation de base {#basic-usage}

À partir de la copie de travail du code source Iroha :

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

Le répertoire parent doit déjà exister. La cible doit être nouvelle ou déjà possédée par l'utilisateur actuel, en mode `0700`, sans liens symboliques et vide. `kagami` écrit `public.key` et `private.key` en mode `0600` et n'affiche pas le matériel de clé. Avec `--pop`, il écrit également `pop.hex`.

`--out-dir` échoue en position fermée sur les plateformes où Kagami ne peut pas appliquer ces règles de système de fichiers réservées au propriétaire. Le fichier de clé privée est une exportation non chiffrée, pas un matériel ou signataire cryptographique de production non exportable. Importez-le dans la limite de garde approuvée et supprimez l'exportation selon la procédure de déploiement.

## Algorithmes {#algorithms}

Les algorithmes courants sont :

- `ed25519` pour les comptes clients et les identités de streaming.
- `secp256k1` lorsqu'un compte client nécessite une identité secp256k1.
- `bls_normal` pour chaque nœud ou identité de consensus de pair réseau.

Vérifiez les algorithmes exacts pris en charge par votre version avec :

```bash
cargo run --bin kagami -- keys --help
```

## Clés de développement déterministes {#deterministic-development-keys}

Pour des artefacts de test reproductibles, fournissez une graine de 32 octets codée en 64 caractères hexadécimaux. Un préfixe optionnel `0x` est accepté :

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

La graine est un matériel de clé privée. Utilisez des graines déterministes uniquement pour le développement local et les tests. Omettez `--seed-hex` pour générer une clé de production à partir de l'aléa du système d'exploitation.

## BLS Clés de consensus et preuves de possession {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 les identités de consensus des nœuds et des pairs du réseau utilisent des clés BLS-normales. Générez une clé BLS-normale et une preuve de possession (PoP) avec :

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` n'est valide qu'avec `bls_normal` ; il ajoute `pop.hex` au répertoire de garde. La genèse de la blockchain signée nécessite un PoP correspondant pour chaque validateur de vote. Dans la configuration des pairs du réseau, une carte `trusted_peers_pop` non vide sélectionne le sous-ensemble de validateurs ; les pairs de réseau de confiance omis de cette carte non vide sont des observateurs. Si la carte est vide, tous les pairs du réseau de confiance BLS-normaux entrent dans l'ensemble des candidats au bootstrap, le votant PoPs étant toujours fourni par la genèse du blockchain signée.

## Sortie de garde {#custody-output}

`kagami keys` nécessite `--out-dir` et n'écrit jamais de matériel de clé privée sur la sortie standard. Lire `public.key`, `private.key` et éventuellement `pop.hex` depuis le répertoire généré. Chaque fichier contient une valeur canonique suivie d'un saut de ligne, ce qui rend l'automatisation basée sur les fichiers explicite et simple :

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

Pour obtenir une aide complète générée Kagami :

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
