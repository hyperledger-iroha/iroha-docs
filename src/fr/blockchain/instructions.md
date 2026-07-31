---
translation_locale: fr
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Instructions spéciales {#iroha-special-instructions}

Quand nous avons parlé de [comment Iroha exploite](/fr/blockchain/iroha-explained), Nous sommes
dit que Iroha Les instructions spéciales sont la seule façon de modifier le monde .
Donc, quel genre d'instructions spéciales avons-nous ?
des guides spécifiques à la langue dans ce tutoriel, vous avez déjà vu un couple de
les instructions: `Register<Account>` et `Mint<Numeric>`.

Voici la liste complète des Iroha Instructions spéciales:

| Instructions                                               | Des descriptions                                     |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Registre/annuler l'enregistrement](#un-register)                       | Donnez un ID à une nouvelle entité sur la blockchain.    |
| [La menthe ou le bois](#mint-burn)                                   | Les actifs numériques de la menthe/de la combustion ou les répétitions déclenchantes. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | Mettez à jour les métadonnées des objets de la blockchain.               |
| [SetParameter](#setparameter)                             | Définir un paramètre à l'échelle de la chaîne                      |
| [Grants et révocations](#grant-revoke)                             | Donner ou supprimer des autorisations et des rôles.            |
| [Transfert](#transfer)                                     | Transfert de la propriété ou de la valeur des actifs.               |
| [Réservations et verrouillages d'actifs natifs](#native-escrow-and-asset-locks) | Fermez les actifs numériques en garde à vue.     |
| [ExecuteTrigger](#executetrigger)                         | Exécutez les déclencheurs.                                |
| [Logi/Custom/Upgrade](#other-instructions)                 | Log, étendre ou améliorer le comportement de l'exécution.        |

Commençons par un résumé de Iroha Instructions spéciales; quels objets chacun
les instructions peuvent être demandées et quelles instructions sont disponibles pour chaque
objet.

## Résumé {#summary}

Pour chaque instruction, il y a une liste d'objets sur lesquels cette
Par exemple, les variantes de transfert couvrent des objets du registre propriétaires
et des actifs numériques, tandis que la mine couvre les actifs numérique et le déclencheur
répétitions.

Certaines instructions exigent que la destination soit spécifiée.
Si vous transférez des actifs, vous devez toujours préciser à quel compte vous êtes
En revanche, lorsque vous enregistrez quelque chose,
Tout ce dont vous avez besoin est l'objet que vous voulez enregistrer.

| Instructions                                               | Objets                                                                                                 | Destination          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               | Domaine ordinaire, alias espace de données et alias compte                                                 |                      |
| [Registre/annuler l'enregistrement](#un-register)                       | comptes, définitions d'actifs, NFTs, les rôles, déclencheurs, pairs; suppression de domaine                                |                      |
| [La menthe ou le bois](#mint-burn)                                   | actifs numériques, répétitions déclenchantes                                                                     | comptes ou déclencheurs |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) | les objets qui ont [métadonnées](./metadata.md): domaines, comptes, définitions d'actifs; NFTs, RWAs, déclencheurs |                      |
| [SetParameter](#setparameter)                             | paramètres de la chaîne                                                                                        |                      |
| [Grants et révocations](#grant-revoke)                             | [rôles, jetons d'autorisation](/fr/blockchain/permissions.md)                                                  | comptes ou rôles    |
| [Transfert](#transfer)                                     | domaines, définitions d'actifs, actifs numériques, NFTs                                                        | comptes             |
| [Réservations et verrouillages d'actifs natifs](#native-escrow-and-asset-locks) | les garanties d'actifs numériques, les verrouillages des actifs, les engagements anonymes en garantie                                    | les acheteurs, les destinations ou les différends |
| [ExecuteTrigger](#executetrigger)                         | déclencheurs                                                                                                |                      |
| [Logi/Custom/Upgrade](#other-instructions)                 | les journaux, les charges utiles spécifiques à l'exécuteur, les mises à niveau des exécuteurs                                                     |                      |

Il y a aussi une autre façon de voir ISI, en ce qui concerne l'objet du registre
Ils touchent:

| Cible           | Instructions                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Compte          | enregistrer/annuler des comptes, recevoir des actifs, mettre à jour les métadonnées du compte, accorder ou révoquer des autorisations et des rôles    |
| Domaine           | assurer la configuration du domaine, désinscrire les domaines, transférer la propriété de domaine, mettre à jour les métadonnées du domaine                    |
| Définition des actifs | définitions de registre/déclaration du registre, transfert de propriété, mise à jour des métadonnées                                         |
| Les actifs            | quantité numérique de la menthe/de la brûlure, quantité numérique de transfert                                                        |
| Réservoir           | ouvrir, accepter, marquer le paiement envoyé, libérer, annuler, contester, résoudre, retirer ou expirer les dossiers de garde natifs |
| NFT              | enregistrement/annulation du registre NFTs, transfert de propriété, mise à jour des métadonnées                                                |
| RWA              | enregistrement des lots, quantité de transfert, détention/libération, congélation/décongélation, rachat, fusion, mise à jour des métadonnées et contrôles |
| Le déclencheur          | enregistrer/annuler l'enregistrement, répétition du déclencheur de la menthe/de la combustion, exécuter le déclencher, mettre à jour les métadonnées du déclencher                 |
| Le monde            | enregistrer/annuler les pairs et rôles, définir des paramètres, mettre à niveau l'exécuteur                                    |

## CLI Exemples {#cli-examples}

Les exemples de cette page supposent que vous exécutez des commandes à partir du flux en amont
Iroha espace de travail par rapport à la configuration locale par défaut du client:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Si vous avez installé le `iroha` d'utilisation binaire
`iroha --config ./defaults/client.toml` Remplacez les titulaires de place
ci-dessous avec les valeurs de votre réseau:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

En ciblant le public Taira testnet, utilisez une Taira la configuration du client.
Avant d'exécuter des exemples payants, économisez l'aide au robinet
[Prenez le testnet XOR sur le Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
comme `taira_faucet_claim.py`, puis demande testnet XOR du robinet:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Une fois que l'actif financé par le robinet est visible, attachez l'actifs à gaz requis
métadonnées pour écrire les transactions:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` est le chemin ordinaire de première sortie pour la création de domaines et
leur SNS Il est déclaratif de lier l'espace de données exact, le propriétaire, le bail
Il crée ou répare l'état nécessaire atomquement.
Utilisez l' authentification `POST /v1/aliases/setup/plan` point final ou l'équivalent
CLI flux de travail:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

L'intention et le plan sont sans secret, mais les signes d'étape appliquer et soumettre une
Le plan est lié à la transaction ordinaire avec le compte configuré.
chaîne, autorité, ancrage de l'état vivant et date limite; ne jamais les réutiliser les uns sur les autres
le réseau.

## (Un) Registre {#un-register}

L'enregistrement et la non-enregistrement sont les instructions utilisées pour donner une ID à une
une nouvelle entité sur la blockchain.

Tout ce qui peut être enregistré est `Registrable` et `Identifiable`,
mais pas tout ce qui est `Identifiable` est `Registrable`. La plupart des choses sont
enregistré directement, mais dans certains cas la représentation dans la blockchain
Pour des raisons de sécurité et de performance, nous utilisons
les constructeurs de ces structures de données (par exemple, `NewAccount`), et par rapport aux autres
l'enregistrement dispose d'une instruction spécifique sur la preuve de possession.
Tout ce qui peut être enregistré peut aussi être non enregistré, mais cela ne l'est pas.
une règle dure et rapide.

Vous pouvez enregistrer des comptes, des définitions d'actifs, NFTs, les pairs, les rôles et
déclencheurs. Utilisation de la configuration du domaine `EnsureAlias`; le brut `Register::Domain` charge utile
est réservé à la génèse/bootstrap. Utilisation de l'enregistrement par pairs
`RegisterPeerWithPop`, qui contient une preuve de possession pour la clé.
[nommage des conventions](/fr/reference/naming.md) Pour en savoir plus sur les restrictions
mettre des noms d'entités.

RWA Les lots sont créés par le biais des dévoués `RegisterRwa` L'enseignement.
le code actuel n'expose pas un `UnregisterRwa` instruction; utilisation
`RedeemRwa` pour retirer la quantité représentée.

::: info

Notez que selon la façon dont vous décidez de configurer votre
[bloc de la génèse](/fr/guide/configure/genesis.md) dans `genesis.json`
(en particulier, que vous incluiez ou non l'enregistrement de la permission
En ce qui concerne les comptes, le processus d'enregistrement d'un compte peut être très différent.
Général, nous pouvons le résumer comme suit:

- Dans un _le public_ Chaque personne devrait pouvoir enregistrer un compte.
- Dans un _privé_ blockchain, il peut y avoir un processus unique pour l'enregistrement
  Les comptes. _typique_ blockchain privée, c'est-à-dire une blockchain sans
  pour les processus uniques d'enregistrement de comptes, vous avez besoin d'un compte
  enregistrer un autre compte.

Nous discutons de ces différences en détail lorsque nous
[comparer les chaînes de blocs privées et publiques](/fr/guide/configure/modes.md).

:::

::: info

L'enregistrement d'un coéquipier est actuellement le seul moyen d'ajouter des coéquipiers qui n'ont pas été
une partie de l'équipe de confiance d'origine mise sur le réseau.

:::

Refer à l'un des guides linguistiques spécifiques pour vous accompagner dans le
processus d'enregistrement des objets dans une blockchain:

| La langue              | Le guide                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   | Utilisez le [Iroha CLI](/fr/get-started/operate-iroha-via-cli.md) créer des domaines et enregistrer des comptes et des actifs. |
| Rust                  | Utilisez le [Rust tutoriel](/fr/guide/tutorials/rust.md).                                                      |
| Kotlin/ Java           | Utilisez le [Kotlin/ Tutoriel Java](/fr/guide/tutorials/kotlin-java.md).                                        |
| Python                | Utilisez le [Python tutoriel](/fr/guide/tutorials/python.md).                                                  |
| JavaScript/TypeScript | Utilisez le [JavaScript/TypeScript tutoriel](/fr/guide/tutorials/javascript.md).                               |

Planifier et appliquer la configuration de domaine ordinaire, puis désinscrire le domaine quand il n'est pas
besoin plus long:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain unregister --id docs.universal
```

Comptes enregistrés et non enregistrés:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Définitions d'actifs enregistrés et non enregistrés:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition register \
  --id "$ASSET_DEF" \
  --name docs_token \
  --alias docs_token#docs.universal \
  --scale 0

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition unregister --id "$ASSET_DEF"
```

Enregistrement et non-enregistrement NFTs. NFT l'enregistrement lit son contenu JSON à partir
entrée standard:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Les rôles d'enregistrement et de non-enregistrement

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Les déclencheurs doivent être enregistrés ou non.
compilés IVM Un code octal ou une liste d'instructions sérialisée. Cet exemple construit
à la `Log` l'instruction avec le CLI et le conduit à l'enregistrement du déclencheur:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml -o \
  ledger transaction ping --log-level INFO --msg "hourly cleanup" |
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger register --id hourly_cleanup \
  --instructions-stdin \
  --filter time \
  --time-start 5m \
  --time-period-ms 3600000

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger unregister --id hourly_cleanup
```

Enregistrez et désenregistrez les pairs. BLS clé et PoP avec `kagami`
si vous ne les avez pas déjà:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## La menthe ou le bois {#mint-burn}

La mouture et la combustion peuvent se référer aux actifs numériques et à des déclencheurs avec une limitation
nombre de répétitions. Certains actifs peuvent être déclarés non échangeables, ce qui signifie
qu'ils ne peuvent être coulés qu'une seule fois après l'enregistrement.

Les actifs sont comptés sur un compte spécifique, généralement celui qui a été enregistré
Les quantités d'actifs ne sont pas négatives, donc vous pouvez
Je n'ai jamais `$-1.0` d'un actif ou brûler un montant négatif et obtenir une menthe.

Consultez l'un des guides linguistiques spécifiques pour vous guider à travers
Processus d'extraction des actifs dans une blockchain:

- [CLI](/fr/get-started/operate-iroha-via-cli.md)
- [Rust](/fr/guide/tutorials/rust.md)
- [Kotlin/ Java](/fr/guide/tutorials/kotlin-java.md)
- [Python](/fr/guide/tutorials/python.md)
- [JavaScript/TypeScript](/fr/guide/tutorials/javascript.md)

Voici quelques exemples d'actifs brûlés:

- [CLI](/fr/get-started/operate-iroha-via-cli.md)
- [Rust](/fr/guide/tutorials/rust.md)

Actifs numériques de la menthe et du brûle:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset mint \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 100

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset burn \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --quantity 10
```

Répétitions de la menthe et du déclencheur de brûlure:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Transfert {#transfer}

Les transferts transférent la propriété ou la valeur entre les comptes.
les variantes couvrent des domaines, des définitions d'actifs, des actifs numériques et NFTs. RWA
le mouvement de la quantité utilise le dédié `TransferRwa` et `ForceTransferRwa`
les instructions décrites dans [Les actifs du monde réel](/fr/blockchain/rwas.md).

Pour ce faire, un compte doit être accordé aux
[autorisation de transfert d'actifs](/fr/reference/permissions.md). En ce qui concerne le
l'exemple de transfert d'actifs avec
[CLI](/fr/get-started/operate-iroha-via-cli.md) ou
[Rust](/fr/guide/tutorials/rust.md).

Transfert d'actifs numériques:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Le domaine de transfert, la définition des actifs et NFT propriété:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Les verrous de dépôt et d'actifs natifs {#native-escrow-and-asset-locks}

Instructions de dépôt native pour verrouiller les actifs numériques dans le protocole géré par un registre
Ils sont utilisés pour le règlement de marché, l'actif générique
les verrous et les flux de garanties anonymes.

Utilisation de l'escroquerie sur le marché `OpenAssetEscrow`, `AcceptAssetEscrow`,
`MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`,
`OpenEscrowDispute`, et `ResolveEscrowDispute`. Utilisation des verrous d'actifs génériques
`OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, et
`ExpireAssetLock`. Les garanties anonymes reflètent le cycle de vie du marché avec
`OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`,
`MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`,
`CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, et
`ResolveAnonymousEscrowDispute`.

Ces ISIs ne possèdent pas actuellement de première classe CLI commandes. Utilisez typé SDK
les constructeurs ou les charges utiles d'instructions sérialisées, et voir
[Réservation des actifs natifs](/fr/blockchain/escrow.md) pour les détails du cycle de vie,
permissions, requêtes, événements et Rust les exemples.

## Grants et révocations {#grant-revoke}

Les instructions d'octroi et de révocation sont utilisées pour le compte
[permissions et rôles](permissions.md).

`Grant` est utilisé pour accorder à l'utilisateur une autorisation unique de manière permanente, ou
Un groupe d'autorisations (un " rôle ") Les rôles et les autorisations accordés ne peuvent être
être retiré par l'intermédiaire de la `Revoke` En tant que tel, ces instructions doivent être
être utilisé avec précaution.

Accorder et révoquer un rôle sur un compte:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Accorder et révoquer des jetons d'autorisation.
Objet d'entrée standard:

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Accorder et révoquer les autorisations d'un rôle:

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Ces instructions mettent à jour l' objet [métadonnées](/fr/blockchain/metadata.md). Utilisation
`SetKeyValue` pour insérer ou remplacer une entrée de métadonnées et `RemoveKeyValue` à
supprimer une.

Les métadonnées `set` Les commandes lisent le JSON valeur de l'entrée standard:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Le même schéma est disponible pour les comptes, les définitions d'actifs, NFTs, RWAs,
et déclencheurs:

```bash
printf '{"display_name":"Alice"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account meta set --id "$ALICE" --key profile

printf '{"issuer":"docs"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition meta set --id "$ASSET_DEF" --key issuer

printf '{"color":"blue"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft meta set --id 'badge$docs.universal' --key traits

printf '{"owner":"ops"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger meta set --id hourly_cleanup --key owner
```

## `SetParameter` {#setparameter}

`SetParameter` modification des paramètres à l'échelle de la chaîne exposés aux données actives
modèle et exécuteur.

Définir un paramètre en passant un seul paramètre JSON objet sur la norme
entrée:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Cette instruction est utilisée pour exécuter [déclencheurs](./triggers.md).

Les CLI peut enregistrer les déclencheurs et s'abonner aux événements d'exécution de déclenchement
Il ne fournit pas une `execute trigger` commandement, donc à
soumettre un manuel `ExecuteTrigger` instruction, générer une série
`InstructionBox` avec un SDK ou l'outil d'exécution et de passer le résultat JSON
rangée à travers `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Autres instructions {#other-instructions}

Iroha exposer également les instructions de niveau inférieur pour le temps d'exécution et l'exécuteur
intégration:

- `Log`: émettre une entrée de journal pendant l'exécution
- `CustomInstruction`: transporter spécifique à l'exécuteur JSON charges utiles
- `Upgrade`: activer une mise à niveau de l'exécuteur

Envoyer une `Log` instruction avec l'aide au ping:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Soumettez une instruction d' exécuteur personnalisée en tant que sérialisation `InstructionBox`. Les
la forme de charge utile est spécifique à l'exécuteur, alors générez l'instruction avec le
correspondance SDK ou des outils d'exécution:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Mise à niveau de l'exécuteur d'une compilation IVM fichier de code octal:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
