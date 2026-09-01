---
translation_locale: fr
translation_source: /blockchain/instructions.md
translation_source_hash: ade5ba2b693de7e798490be0947099d0306d9565b88550e201dccd181810fb18
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha Opérations d'instruction {#iroha-special-instructions}

Lorsque nous avons parlé de [comment Iroha fonctionne](/fr/blockchain/iroha-explained), nous avons dit que les opérations d'instruction Iroha sont le seul moyen de modifier l'état du monde. Alors, quel type d'instruction Quelles opérations avons-nous ? Si vous avez lu les guides spécifiques aux langues dans ce tutoriel, vous avez déjà vu quelques instructions : `Register<Account>` et `Mint<Numeric>`.

Voici la liste complète des opérations d'instruction Iroha :

|Instruction|Descriptions|
| --------------------------------------------------------- | ------------------------------------------------ |
| [S'inscrire / Se désinscrire](#un-register)                       |Attribuez un identifiant à une nouvelle entité sur la blockchain.|
| [Mint/Burn](#mint-burn)                                   |Créer/retirer des actifs numériques ou déclencher des répétitions.|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |Mettre à jour les métadonnées de l'objet blockchain.|
| [SetParameter](#setparameter)                             |Définir un paramètre à l'échelle de la chaîne.|
| [Grant/Revoke](#grant-revoke)                             |Attribuer ou retirer des autorisations et des rôles.|
| [Transférer](#transfer)                                     |Transférer la propriété ou la valeur de l'actif.|
| [Verrouillages d'entiercement et d'actifs natifs](#native-escrow-and-asset-locks) |Verrouillez les actifs numériques dans la garde du protocole.|
| [Règlement privé atomique](#atomic-private-settlement)   |Gérer des pools confidentiels et des ensembles atomiques.|
| [ExecuteTrigger](#executetrigger)                         |Exécuter les déclencheurs.|
| [Log/Custom/Upgrade](#other-instructions)                 |Journaliser, étendre ou mettre à niveau le comportement d'exécution du logiciel.|

Commençons par un résumé des opérations d'instruction Iroha ; quels objets chaque instruction peut appeler et quelles instructions sont disponibles pour chaque objet.

## Résumé {#summary}

Pour chaque instruction, il existe une liste d'objets sur lesquels cette instruction peut être exécutée. Par exemple, les variantes de transfert couvrent les objets du grand livre blockchain pouvant être possédés et les actifs numériques, tandis que l'émission couvre les actifs numériques et les répétitions de déclenchement.

Certaines instructions nécessitent qu'une destination soit spécifiée. Par exemple, si vous transférez des actifs, vous devez toujours préciser vers quel compte vous les transférez. En revanche, lorsque vous enregistrez quelque chose, tout ce dont vous avez besoin est l'objet que vous souhaitez enregistrer.

|Instruction|Objets|Destination|
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [EnsureAlias](#ensurealias)                               |configuration du domaine ordinaire, de l'alias d'espace de données et de l'alias de compte|                      |
| [S'inscrire / Se désinscrire](#un-register)                       |comptes, définitions d'actifs, NFTs, rôles, déclencheurs, pairs réseau ; suppression de domaine|                      |
| [Mint/Burn](#mint-burn)                                   |actifs numériques, déclencher des répétitions|comptes ou déclencheurs|
| [SetKeyValue/RemoveKeyValue](#setkeyvalue-removekeyvalue) |objets qui ont [métadonnées](./metadata.md) : domaines, comptes, définitions d'actifs, NFTs, RWAs, déclencheurs|                      |
| [SetParameter](#setparameter)                             |paramètres de chaîne|                      |
| [Grant/Revoke](#grant-revoke)                             | [rôles, jetons d'autorisation](/fr/blockchain/permissions.md)                                                  |comptes ou rôles|
| [Transférer](#transfer)                                     |domaines, définitions d'actifs, actifs numériques, NFTs|comptes|
| [Verrouillages d'entiercement et d'actifs natifs](#native-escrow-and-asset-locks) | séquestres d'actifs numériques, verrous d'actifs, engagements d'entiercement anonymes |acheteurs, destinations ou partages de litiges|
| [Règlement privé atomique](#atomic-private-settlement)   |ensembles confidentiels limités à la route, rotations de politiques, bundles finalisés et marqueurs d'abandon|                      |
| [ExecuteTrigger](#executetrigger)                         |déclencheurs|                      |
| [Log/Custom/Upgrade](#other-instructions)                 |journaux, charges utiles spécifiques à l'exécuteur, mises à niveau de l'exécuteur|                      |

Il existe également une autre façon de voir ISI, en termes de l'objet registre de la blockchain qu'ils touchent :

|Cible|Instructions|
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
|Compte|enregistrer/désenregistrer des comptes, recevoir des actifs, mettre à jour les métadonnées des comptes, accorder/révoker des permissions et des rôles|
|Domaine|assurer la configuration du domaine, désenregistrer les domaines, transférer la propriété du domaine, mettre à jour les métadonnées du domaine|
|Définition de l'actif|enregistrer/désenregistrer des définitions, transférer la propriété, mettre à jour les métadonnées|
|Actif|créer/retirer une quantité numérique, transférer une quantité numérique|
|Séquestre|ouvrir, accepter, marquer le paiement comme envoyé, libérer, annuler, contester, résoudre, retirer, ou expirer les enregistrements de garde natifs|
| NFT              |enregistrer/désenregistrer NFTs, transférer la propriété, mettre à jour les métadonnées|
| RWA              |enregistrer des lots, transférer la quantité, bloquer/libérer, geler/dégeler, échanger, fusionner, mettre à jour les métadonnées et les contrôles|
|Déclencheur|enregistrer/désenregistrer, créer/brûler des déclenchements répétés, exécuter le déclencheur, mettre à jour les métadonnées du déclencheur|
|Monde|enregistrer/désenregistrer des pairs et des rôles réseau, définir des paramètres, mettre à niveau l'exécuteur|

## CLI Exemples {#cli-examples}

Les exemples sur cette page supposent que vous exécutez des commandes depuis l'espace de travail en amont Iroha avec la configuration client locale par défaut :

```bash
cargo run --bin iroha -- --config ./defaults/client.toml <command>
```

Si vous avez installé le binaire `iroha`, utilisez plutôt `iroha --config ./defaults/client.toml`. Remplacez les espaces réservés ci-dessous par des valeurs de votre réseau :

```bash
export ALICE="<ALICE_ACCOUNT_I105>"
export BOB="<BOB_ACCOUNT_I105>"
export ASSET_DEF="<ASSET_DEFINITION_BASE58>"
export PEER_KEY="<BLS_PUBLIC_KEY_MULTIHASH>"
export PEER_POP="<PROOF_OF_POSSESSION_HEX>"
```

Lors de la cible du réseau test public Taira, utilisez une configuration client Taira. Avant d'exécuter des exemples payants, enregistrez l'assistant de service de financement du réseau test à partir de [Obtenir le Testnet XOR sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) sous `taira_faucet_claim.py`, puis réclamez des XOR du réseau test depuis le service de financement du réseau test :

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Après que l'actif financé par le testnet soit visible, joignez les métadonnées de l'actif du coût d'exécution de la transaction requis aux transactions d'écriture :

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## EnsureAlias {#ensurealias}

`EnsureAlias` est le chemin de première publication ordinaire pour créer des domaines et leurs baux SNS. Il lie de manière déclarative l'espace de données exact, le propriétaire, la durée du bail, et cite le garde, puis crée ou répare tous les états requis de manière atomique. Utilisez le point de terminaison authentifié `POST /v1/aliases/setup/plan` API ou le flux de travail correspondant CLI :

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./domain.intent.json \
  --plan-file ./domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./domain.plan.json
```

L'intention et le plan sont sans secret, mais l'étape d'application signe et soumet une transaction ordinaire avec le compte configuré. Un plan est lié à sa chaîne, au principal d'autorisation, à l'ancre de l'état en direct et à la date limite ; ne jamais en réutiliser un sur un autre réseau.

## (Dés)enregistrer {#un-register}

L'enregistrement et la désinscription sont les instructions utilisées pour attribuer un identifiant à une nouvelle entité sur la blockchain.

Tout ce qui peut être enregistré est à la fois `Registrable` et `Identifiable`, mais tout ce qui est `Identifiable` n'est pas `Registrable`. La plupart des choses sont enregistrées directement, mais dans certains cas, la représentation dans la blockchain contient beaucoup plus de données. Pour des raisons de sécurité et de performance, nous utilisons des constructeurs pour de telles structures de données (par exemple `NewAccount`), et l'enregistrement des pairs réseau dispose d'une instruction dédiée de preuve de possession. En règle générale, tout ce qui peut être enregistré peut également être désenregistré, mais ce n'est pas une règle absolue.

Vous pouvez enregistrer des comptes, des définitions d'actifs, NFTs, des pairs réseau, des rôles et des déclencheurs. La configuration du domaine utilise `EnsureAlias` ; la charge utile brute `Register::Domain` est réservée à genesis/bootstrap. L'enregistrement des pairs du réseau utilise `RegisterPeerWithPop`, qui contient une preuve de possession pour la clé du pair du réseau. Consultez notre [conventions de nommage](/fr/reference/naming.md) pour en savoir plus sur les restrictions imposées aux noms des entités.

RWA les lots sont créés via l'instruction dédiée `RegisterRwa`. Le code actuel n'expose pas d'instruction `UnregisterRwa` ; utilisez `RedeemRwa` pour mettre hors service la quantité représentée.

::: info

Notez que selon la manière dont vous décidez de configurer votre [bloc genesis de la blockchain](/fr/guide/configure/genesis.md) dans `genesis.json` (en particulier, que vous incluiez ou non l'enregistrement des jetons d'autorisation), le processus d'enregistrement d'un compte peut être très différent. En général, nous pouvons le résumer ainsi :

- Dans une blockchain publique, tout le monde devrait pouvoir créer un compte.
- Dans une blockchain privée, il peut y avoir un processus unique pour enregistrer des comptes. Dans une blockchain privée typique, c'est-à-dire une blockchain sans processus unique pour enregistrer des comptes, vous avez besoin d'un compte pour en enregistrer un autre.

Nous discutons de ces différences en détail lorsque nous [comparer les blockchains privées et publiques](/fr/guide/configure/modes.md).

:::

::: info

L'enregistrement d'un pair réseau est actuellement le seul moyen d'ajouter des pairs réseau qui ne faisaient pas partie du jeu initial de pairs réseau de confiance au réseau.

:::

Utilisez un guide spécifique à la langue pour enregistrer des objets blockchain :

|Langue|Guide|
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   |Utilisez le [Iroha CLI](/fr/get-started/operate-iroha-via-cli.md) pour configurer des domaines et enregistrer des comptes et des actifs.|
| Rust                  |Utilisez le [Rust tutoriel](/fr/guide/tutorials/rust.md).|
| Kotlin/Java           |Utilisez le [Kotlin/Java](/fr/guide/tutorials/kotlin-java.md).|
| Python                |Utilisez le [Python tutoriel](/fr/guide/tutorials/python.md).|
| JavaScript/TypeScript |Utilisez le [JavaScript/TypeScript](/fr/guide/tutorials/javascript.md).|

Planifiez et appliquez la configuration ordinaire du domaine, puis désenregistrez le domaine lorsqu'il n'est plus nécessaire :

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

Enregistrer et désenregistrer des comptes :

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account register --id "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account unregister --id "$BOB"
```

Enregistrer et désenregistrer les définitions d'actifs :

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

Enregistrer et désenregistrer NFTs. L'enregistrement de NFT lit son contenu JSON depuis l'entrée standard :

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Enregistrer et désenregistrer des rôles :

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role register --id operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role unregister --id operators
```

Enregistrer et désenregistrer des déclencheurs. L'enregistrement d'un déclencheur nécessite soit du bytecode compilé IVM, soit une liste d'instructions sérialisée. Cet exemple construit une instruction `Log` avec le CLI et la transmet à l'enregistrement du déclencheur :

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

Enregistrez et désenregistrez les pairs du réseau. Générez la clé BLS et PoP avec `kagami` si vous ne les avez pas déjà :

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./peer-key
PEER_KEY=$(tr -d '\n' < ./peer-key/public.key)
PEER_POP=$(tr -d '\n' < ./peer-key/pop.hex)

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## Créer/Brûler {#mint-burn}

L'émission et la destruction peuvent se référer aux actifs numériques et aux déclencheurs avec un nombre limité de répétitions. Certains actifs peuvent être déclarés comme non-mintables, ce qui signifie qu'ils ne peuvent être émis qu'une seule fois après l'enregistrement.

Les actifs sont attribués à un compte spécifique, généralement celui qui a enregistré l'actif en premier lieu. Les quantités d'actifs sont non négatives, donc vous ne pouvez jamais avoir `$-1.0` d'un actif ou brûler une quantité négative et obtenir une émission.

Utilisez un guide spécifique à la langue pour émettre des actifs blockchain :

- [CLI](/fr/get-started/operate-iroha-via-cli.md)
- [Rust](/fr/guide/tutorials/rust.md)
- [Kotlin/Java](/fr/guide/tutorials/kotlin-java.md)
- [Python](/fr/guide/tutorials/python.md)
- [JavaScript/TypeScript](/fr/guide/tutorials/javascript.md)

Voici des exemples d'actifs brûlants :

- [CLI](/fr/get-started/operate-iroha-via-cli.md)
- [Rust](/fr/guide/tutorials/rust.md)

émission et destruction d'actifs numériques :

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

émission et répétitions de déclenchement de brûlure :

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger mint --id hourly_cleanup --repetitions 5

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger trigger burn --id hourly_cleanup --repetitions 1
```

## Transférer {#transfer}

Les transferts déplacent la propriété ou la valeur entre les comptes. Les variantes de transfert génériques couvrent les domaines, les définitions d'actifs, les actifs numériques et NFTs. Le mouvement de quantité RWA utilise les instructions dédiées `TransferRwa` et `ForceTransferRwa` décrites dans [Actifs du monde réel](/fr/blockchain/rwas.md).

Pour ce faire, un compte doit se voir attribuer le [autorisation de transférer des actifs](/fr/reference/permissions.md). Reportez-vous à un exemple sur la manière de transférer des actifs avec [CLI](/fr/get-started/operate-iroha-via-cli.md) ou [Rust](/fr/guide/tutorials/rust.md).

Transférer des actifs numériques :

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Transférer le domaine, la définition de l'actif et la propriété de NFT :

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Escrow natif et verrous d'actifs {#native-escrow-and-asset-locks}

Les instructions d'entiercement natives verrouillent les actifs numériques dans la garde d'un protocole géré par un grand livre. Elles sont utilisées pour le règlement de type marché, les verrous d'actifs génériques et les flux d'entiercement anonymes protégés.

L'entiercement du marché utilise `OpenAssetEscrow`, `AcceptAssetEscrow`, `MarkEscrowPaymentSent`, `ReleaseAssetEscrow`, `CancelAssetEscrow`, `OpenEscrowDispute`, et `ResolveEscrowDispute`. Les verrous d'actifs génériques utilisent `OpenAssetLock`, `DrawdownAssetLock`, `CancelAssetLock` et `ExpireAssetLock`. L'entiercement anonyme reflète le cycle de vie du marché avec `OpenAnonymousAssetEscrow`, `AcceptAnonymousAssetEscrow`, `MarkAnonymousEscrowPaymentSent`, `ReleaseAnonymousAssetEscrow`, `CancelAnonymousAssetEscrow`, `OpenAnonymousEscrowDispute` et `ResolveAnonymousEscrowDispute`.

Ces ISIs n'ont actuellement pas de commandes CLI de première classe. Utilisez des constructeurs SDK typés ou des charges utiles d'instructions sérialisées, et consultez [Compte séquestre d'actifs natifs](/fr/blockchain/escrow.md) pour les détails sur le cycle de vie, les autorisations, les requêtes, les événements et des exemples Rust.

## Règlement privé atomique {#atomic-private-settlement}

La famille d'instructions de règlement privé atomique gouvernée est séparée du Native transparent AMX. `ActivatePrivateSettlementPoolV1` établit un pool confidentiel à portée de route à partir d'une projection de gouvernance expurgée et d'engagements d'origine canoniques. `FinalizeAtomicPrivateSettlementV1` applique un lot complet certifié par le comité de manière atomique, tandis que `AbortAtomicPrivateSettlementV1` publie uniquement le marqueur terminal public autorisé par le sponsor.

`RotatePrivateSettlementPoolPolicyV1` est limité à la gouvernance de la vie privée. Il nécessite la valeur exacte du digest cryptographique de gouvernance actuelle, préserve l'itinéraire, le pool, l'engagement de liaison des actifs, la frontière d'état, les ensembles de relecture et les enregistrements de résultats de protocole finalisés, et fait progresser la révision publique d'un cran, et utilise une nouvelle époque de clé d'auditeur. La rotation s'active à sa hauteur d'inclusion et ne peut pas partager cette hauteur avec un enregistrement de résultat de protocole pour le même itinéraire/pool. La lignée de révision publique conserve les enregistrements des résultats du protocole finalisés avant le redémarrage de la rotation - valides et exacts en répétition idempotente ; les anciens paquets de politique en cours échouent fermés. Les opérateurs doivent conserver les anciennes clés de décryptage pour les capsules stockées ou gérer et tester le reconditionnement des capsules avant de les détruire.

Le chemin reste désactivé par défaut et n'est pas qualifié pour la production. Voir [Exécuter un règlement privé atomique inter-espaces de données](/fr/get-started/atomic-private-settlement) pour la configuration, le principal d'autorisation, l'audit, la récupération et les exigences de publication.

## Accorder/Révoquer {#grant-revoke}

Les instructions d'octroi et de révocation sont utilisées pour le compte [autorisations et rôles](permissions.md).

`Grant` est utilisé pour accorder de manière permanente à un utilisateur soit une seule autorisation, soit un groupe d'autorisations (un « rôle »). Les rôles et autorisations accordés ne peuvent être supprimés que via l'instruction `Revoke`. En tant que tel, ces instructions doivent être utilisées avec précaution.

Accorder et révoquer un rôle sur un compte :

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role grant --id "$BOB" --role operators

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account role revoke --id "$BOB" --role operators
```

Accorder et révoquer des jetons de permission. Les commandes de permission lisent un objet de permission depuis l'entrée standard :

```bash
printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission grant --id "$BOB"

printf '{"name":"CanSetParameters","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger account permission revoke --id "$BOB"
```

Accorder et révoquer des autorisations sur un rôle :

```bash
printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission grant --id operators

printf '{"name":"CanRegisterDomain","payload":null}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger role permission revoke --id operators
```

## `SetKeyValue`/`RemoveKeyValue` {#setkeyvalue-removekeyvalue}

Ces instructions mettent à jour l'objet [métadonnées](/fr/blockchain/metadata.md). Utilisez `SetKeyValue` pour insérer ou remplacer une entrée de métadonnées et `RemoveKeyValue` pour en supprimer une.

Les commandes Metadata `set` lisent la valeur JSON depuis l'entrée standard :

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Le même modèle est disponible pour les comptes, les définitions d'actifs, NFTs, RWAs et les déclencheurs :

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

`SetParameter` modifie les paramètres à l'échelle de la chaîne exposés par le modèle de données actif et l'exécuteur.

Définissez un paramètre en passant un objet de paramètre unique JSON en entrée standard :

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger` {#executetrigger}

Cette instruction est utilisée pour exécuter [déclencheurs](./triggers.md).

Le CLI peut enregistrer des déclencheurs et s'abonner directement aux événements d'exécution des déclencheurs. Il ne fournit pas de commande `execute trigger` typée, donc pour soumettre un instruction manuelle `ExecuteTrigger`, générer un `InstructionBox` sérialisé avec un SDK ou un outil exécuteur et passer le tableau JSON résultant à travers `ledger transaction stdin` :

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Autres instructions {#other-instructions}

Iroha expose également des instructions de niveau inférieur pour l’intégration de l’environnement d’exécution et de l’exécuteur :

- `Log` : émettre une entrée de journal pendant l'exécution
- `CustomInstruction` : transporter des charges utiles JSON spécifiques à l’exécuteur
- `Upgrade` : activer une mise à jour de l'exécuteur

Soumettez une instruction `Log` avec l'assistant ping :

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Soumettez une instruction d'exécuteur personnalisée sous forme de `InstructionBox` sérialisé. La structure de la charge utile est spécifique à l'exécuteur, donc générez l'instruction avec le SDK correspondant ou les outils de l'exécuteur :

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Mettez à niveau l'exécuteur à partir d'un fichier bytecode compilé IVM :

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
