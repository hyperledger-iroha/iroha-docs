---
translation_locale: fr
translation_source: /blockchain/instructions.md
translation_source_hash: 3251078b2b2268ff78563c02a0f935c63dc0569f0b6d38071150cbb4b89394d6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Instructions spéciales {#iroha-special-instructions}

Quand nous avons parlé de [comment Iroha exploite](/fr/blockchain/iroha-explained), On l'a dit Iroha Les instructions spéciales sont le seul moyen de modifier l'état du monde. Quel genre d'instructions spéciales avons-nous ? Si vous avez lu les guides spécifiques à la langue dans ce tutoriel, Vous avez déjà vu quelques instructions: `Register<Account>` à la fois `Mint<Numeric>`.

Voici la liste complète des instructions spéciales Iroha:

|Instruction |Des descriptions |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Enregistrement/annulation du registre ](#un-register) |Donner un ID à une nouvelle entité sur la blockchain. |
| [La menthe/le feu ](#mint-burn) |Les actifs numériques de la menthe/de la combustion ou les répétitions déclencheurs. |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Mettez à jour les métadonnées des objets de la blockchain. |
| [SetParameter](#setparameter) |Définir un paramètre à l'échelle de la chaîne. |
| [Grâce ou révocation ](#grant-revoke) |Donner ou supprimer des autorisations et des rôles. |
| [Transfert](#transfer) |Transfert de la propriété ou de la valeur des actifs |
| [Les clôtures de garanties et d'actifs natifs ](#native-escrow-and-asset-locks) |Fermez les actifs numériques à la garde du protocole. |
| [ExecuteTrigger](#executetrigger) |Exécutez les déclencheurs.|
| [Logiciel/Custom/Upgrade ](#other-instructions)|Enregistrer, étendre ou améliorer le comportement de l'exécution. |

Commençons par un résumé de Iroha Instructions spéciales; quels objets chaque instruction peut être appelé pour et quelles instructions sont disponibles pour chaque objet.

## Résumé {#summary}

Pour chaque instruction, il y a une liste d'objets sur lesquels cette instruction peut être exécutée. Par exemple, les variantes de transfert couvrent des objets du registre propriétaire et des actifs numériques, tandis que le montage couvre les actifs numérique et déclenche les répétitions.

Certaines instructions exigent qu'une destination soit spécifiée. Par exemple, si vous transférez des actifs, vous devez toujours préciser à quel compte vous les transferez.

|Instruction |Objets |Destination |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias) |Déménagement de domaine ordinaire, alias espace de données et alias compte |                      |
| [Enregistrement/annulation du registre ](#un-register) |comptes, définitions d'actifs, NFTs, rôles, déclencheurs, pairs; suppression de domaine |                      |
| [La menthe/le feu ](#mint-burn) |Les actifs numériques, les répétitions déclencheuses |les comptes ou déclencheurs |
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |les objets qui ont [méta-données](./metadata.md): domaines, comptes, définitions d'actifs, NFTs, RWAs, déclencheurs |                      |
| [SetParameter](#setparameter) |les paramètres de la chaîne |                      |
| [Grâce ou révocation ](#grant-revoke) | [Rôle, jetons d'autorisation ](/fr/blockchain/permissions.md) |comptes ou rôles |
| [Transfert](#transfer) |domaines, définitions d'actifs, actifs numériques, NFTs |comptes |
| [Les clôtures de garanties et d'actifs natifs ](#native-escrow-and-asset-locks) |garanties numériques d'actifs, verrouillage des actifs, engagements de garantie anonymes |les acheteurs, les destinations ou les différends |
| [ExecuteTrigger](#executetrigger) |déclencheurs |                      |
| [Logiciel/Custom/Upgrade ](#other-instructions)|les journaux, les charges utiles spécifiques à l'exécuteur, les mises à niveau des exécuteurs |                      |

Il existe également une autre façon de voir ISI, en termes d'objet du registre qu'ils touchent:

|Cible .|Les instructions |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Compte |enregistrer/annuler des comptes, recevoir des actifs, mettre à jour les métadonnées du compte, accorder ou révoquer des autorisations et des rôles |
|Domaine |s'assurer de la mise en place du domaine, supprimer l'enregistrement des domaines, transférer la propriété du domaine, mettre à jour les métadonnées du domaine |
|Définition des actifs |définitions de registre/déregistre, transfert de la propriété, mise à jour des métadonnées |
|Les actifs |quantité numérique de menthe/brûlure, quantité numérique de transfert |
|Réservé |ouvrir, accepter, marquer le paiement envoyé, libérer, annuler, disputer, résoudre, retirer ou expirer les dossiers de garde natifs |
|NFT |enregistrement/annulation du registre NFTs, transfert de la propriété, mise à jour des métadonnées |
|RWA |enregistrement des lots, quantité de transfert, détention/libération, congélation/décongélation, échange, fusion, mise à jour des métadonnées et contrôles |
|Le déclencheur|enregistrer/annuler l'enregistrement, répéter le déclencheur de la menthe/de la combustion, exécuter le déclenchement, mettre à jour les métadonnées du déclenchements |
|Le monde |enregistrer/annuler les pairs et rôles, définir des paramètres, améliorer l'exécuteur |

## CLI Exemples {#cli-examples}

Les exemples de cette page supposent que vous exécutez des commandes depuis l'espace de travail Iroha en amont contre la configuration par défaut du client local:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Si vous avez installé le `iroha` binaire, utilisez `iroha --config ./defaults/client.toml` à la place. Remplacez les places ci-dessous par des valeurs de votre réseau:

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Lorsqu'il s'adresse au public Taira testnet, utilisez une Taira configuration du client. Avant d'exécuter des exemples payants, sauvegarder l'aide au robinet de [Prenez le testnet XOR sur le Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) en tant que `taira_faucet_claim.py`, puis la plainte de testnet XOR du robinet:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Une fois que l'actif financé par le robinet est visible, joindre les métadonnées des actifs de gaz nécessaires pour écrire les transactions:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` est le chemin de première sortie ordinaire pour la création de domaines et leurs SNS locations. Il lie déclarativement l'espace de données exact, propriétaire, terme de location, et garde des devis, puis crée ou répare tous les états requis atomiquement. Utilisez le point d'extrémité authentifié `POST /v1/aliases/setup/plan` ou le flux de travail correspondant CLI:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

L'intention et le plan sont sans secret, mais l'application des signes d'étape et soumet une transaction ordinaire avec le compte configuré. Un plan est lié à sa chaîne, autorité, ancrage de l'état en direct et date limite; ne jamais réutiliser un autre réseau.

## (Un) Enregistrement {#un-register}

L'enregistrement et la non-enregistrement sont les instructions utilisées pour remettre un ID à une nouvelle entité sur la blockchain.

Tout ce qui peut être enregistré est à la fois `Registrable` et `Identifiable`, mais tout ce qui est `Identifiable` n'est pas `Registrable`. La plupart des choses sont enregistrées directement, mais dans certains cas, la représentation de la blockchain a beaucoup plus de données. Pour des raisons de sécurité et de performance, nous utilisons des constructeurs pour ces structures de données (par exemple `NewAccount`), et l'enregistrement par les pairs a une instruction dédiée à la preuve de possession. En règle générale, tout ce qui peut être enregistré peut également être non enregistré, mais ce n'est pas une règle dure et rapide.

Vous pouvez enregistrer des comptes, des définitions d'actifs, NFTs, les pairs, les rôles et les déclencheurs `EnsureAlias`; la matière première `Register::Domain` La charge utile est réservée à la génèse/bootstrap. `RegisterPeerWithPop`, qui porte une preuve de possession pour la clé peer. [nommage des conventions](/fr/reference/naming.md) pour connaître les restrictions imposées aux noms d'entités.

Les lots RWA sont créés par l'intermédiaire de l'instruction `RegisterRwa` dédiée. Le code actuel n'expose pas une instruction `UnregisterRwa`; utilisez `RedeemRwa` pour retirer la quantité représentée.

::: informations

Veuillez noter que selon la façon dont vous décidez de mettre en place votre [bloc de la génèse](/fr/guide/configure/genesis.md) dans `genesis.json` (en particulier, que vous incluiez ou non l'enregistrement des jetons d'autorisation), Le processus d'enregistrement d'un compte peut être très différent.

- Dans une blockchain publique, n'importe qui devrait pouvoir enregistrer un compte.
- Dans une blockchain privée, il peut y avoir un processus unique pour enregistrer des comptes. Dans une blockchain particulière typique, c'est-à-dire une blockchain sans processus uniques d'enregistrement de comptes, vous avez besoin d'un compte pour enregistrer un autre compte.

Nous discutons de ces différences en détail lorsque nous comparons [ les chaînes privées et publiques de blocs ](/fr/guide/configure/modes.md).

:::

::: informations

L'enregistrement d'un paire est actuellement la seule façon d'ajouter des paires qui ne faisaient pas partie du paire de confiance initial mis sur le réseau.

:::

Consultez l'un des guides spécifiques à la langue pour vous guider dans le processus d'enregistrement d'objets sur une blockchain:

|La langue |Guide |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
|CLI |Utilisez le [Iroha CLI](/fr/get-started/operate-iroha-via-cli.md) pour créer des domaines et enregistrer des comptes et des actifs. |
|Rust |Utilisez le tutoriel [Rust ](/fr/guide/tutorials/rust.md). |
|Kotlin/Java |Utilisez le tutoriel [Kotlin/Java](/fr/guide/tutorials/kotlin-java.md). |
|Python |Utilisez le tutoriel [Python ](/fr/guide/tutorials/python.md). |
|JavaScript/TypeScript |Utilisez le tutoriel [JavaScript/TypeScript ](/fr/guide/tutorials/javascript.md). |

Planifier et appliquer une configuration de domaine ordinaire, puis désinscrire le domaine quand il n'est plus nécessaire:

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

Comptes d'enregistrement et de désenregistrement:

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

Enregistrer et annuler NFTs. L'enregistrement NFT lit son contenu JSON à partir de l'entrée standard:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Rôle d'enregistrement et de non-enregistrement:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Les déclencheurs enregistrés et non enregistrés. L'enregistrement du déclencheur a besoin d'un code octal IVM compilé ou d'une liste d'instructions sérialisée. Cet exemple construit une instruction `Log` avec le CLI et l'aligne dans l'enregistrements de déclenchement:

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

Enregistrer et désenregistrer les pairs. Générer la clé BLS et PoP avec `kagami` si vous ne les possédez pas déjà:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## La menthe et le bois {#mint-burn}

La mouture et la combustion peuvent désigner des actifs numériques et des déclencheurs avec un nombre limité de répétitions. Certains actifs peuvent être déclarés non mobiles, ce qui signifie qu'ils ne peuvent être moités qu'une seule fois après l'enregistrement.

Les actifs sont comptés sur un compte spécifique, généralement celui qui a enregistré l'actif en premier lieu. Les quantités d'actifs ne sont pas négatives, donc vous ne pouvez jamais avoir `$-1.0` d'un actif ou brûler un montant négatif et obtenir une menthe.

Consultez l'un des guides spécifiques à la langue pour vous guider dans le processus d'extraction d'actifs dans une blockchain:

- [CLI](/fr/get-started/operate-iroha-via-cli.md)
- [Rust](/fr/guide/tutorials/rust.md)
- [Kotlin/Java](/fr/guide/tutorials/kotlin-java.md)
- [Python](/fr/guide/tutorials/python.md)
- [JavaScript/TypeScript ](/fr/guide/tutorials/javascript.md)

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

Répétitions de la menthe et des déclencheurs de brûlure:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Le transfert {#transfer}

Les transferts déplacent la propriété ou la valeur entre les comptes. Les variantes génériques de transfert couvrent les domaines, les définitions d'actifs, les actifs numériques et NFTs. Le mouvement de quantité RWA utilise les instructions dédiées `TransferRwa` et `ForceTransferRwa` décrites dans [Real-World Assets](/fr/blockchain/rwas.md).

Pour ce faire, un compte doit être accordé aux [autorisation de transfert d'actifs](/fr/reference/permissions.md). Veuillez vous référer à un exemple sur la façon de transférer des actifs [CLI](/fr/get-started/operate-iroha-via-cli.md) ou [Rust](/fr/guide/tutorials/rust.md).

Transfert d'actifs numériques:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Le domaine de transfert, la définition de l'actif et la propriété NFT:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Les serrures de dépôt et d'actifs natifs {#native-escrow-and-asset-locks}

Les instructions de dépôt natif bloquent les actifs numériques dans la garde du protocole géré par un registre. Ils sont utilisés pour le règlement au style du marché, les verrous d'actifs génériques et les flux de dépôts protégés anonymes.

Utilisation des dépôts sur le marché `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, et `ResolveEscrowDispute`. Utilisation de serrures d'actifs génériques `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock`, et `ExpireAssetLock`. Les garanties anonymes reflètent le cycle de vie du marché avec `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute`, et `ResolveAnonymousEscrowDispute`.

Celles-ci ISIs n'ont pas actuellement de première classe CLI commandes. Utilisez typé SDK les constructeurs ou les charges utiles d'instruction sérialisées, et voir [Réservation des actifs natifs](/fr/blockchain/escrow.md) pour les détails du cycle de vie, les autorisations, les requêtes, les événements et Rust des exemples.

## Grants et révocations {#grant-revoke}

Les instructions d'octroi et de révocation sont utilisées pour les autorisations et rôles du compte [ ](permissions.md).

`Grant` est utilisé pour accorder définitivement à un utilisateur soit une seule autorisation, soit un groupe d'autorisations (un " rôle "). Les rôles et les autorisations octroyés ne peuvent être supprimés que par l'intermédiaire de l'instruction `Revoke`.

accorder et révoquer un rôle sur un compte:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Donner et annuler des jetons d'autorisation. Les commandes d'autorités lisent un objet d'autoriété à partir de l'entrée standard:

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

Ces instructions mettent à jour les métadonnées de l'objet [](/fr/blockchain/metadata.md). Utilisez `SetKeyValue` pour insérer ou remplacer une entrée de métadonnées et `RemoveKeyValue` pour en supprimer une.

Les commandes de métadonnées `set` lisent la valeur de JSON à partir de l'entrée standard:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Le même schéma est disponible pour les comptes, les définitions d'actifs NFTs, RWAs et les déclencheurs:

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

`SetParameter` modifie les paramètres de la chaîne exposés par le modèle et l'exécuteur de données actifs.

Définir un paramètre en passant un seul paramètre JSON à l'entrée standard:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Cette instruction est utilisée pour l'exécution des déclencheurs [ ](./triggers.md).

Le CLI peut enregistrer les déclencheurs et s'abonner directement aux événements d'exécution de déclenchement. Il ne fournit pas une commande `execute trigger` typée, donc pour soumettre une instruction manuelle `ExecuteTrigger`, générer un `InstructionBox` sérialisé avec un outil d'exécution SDK et passer l'ensemble résultant JSON à travers `ledger transaction stdin`:

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Autres instructions {#other-instructions}

Iroha expose également les instructions de niveau inférieur pour l'intégration du temps d'exécution et de l'exécuteur:

- `Log`: émettez une entrée de journal pendant l'exécution
- `CustomInstruction`: transporter des charges utiles spécifiques à l'exécuteur JSON
- `Upgrade`: activer une mise à niveau de l'exécuteur

Soumettez une instruction `Log` à l'aide du ping:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Soumettez une instruction d'exécution personnalisée sous forme sérialisée `InstructionBox`. La forme de charge utile est spécifique à l'exécuteur, générez donc l'instruction avec le matching SDK ou l'outillage d'exécutant:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Mise à niveau de l'exécuteur à partir d'un fichier par code octal IVM compilé:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
