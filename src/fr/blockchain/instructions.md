---
translation_locale: fr
translation_source: /blockchain/instructions.md
translation_source_hash: 43ac95eaf3bb07ec19ae392d7c7113bd28a2421fa92dcc88f3baa5903aeff0cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Instructions spéciales

Quand nous avons parlé de [comment Iroha exploite](/fr/blockchain/iroha-explained), nous
dit que Iroha Les instructions spéciales sont le seul moyen de modifier le monde
Donc, quel genre d'instructions spéciales avons-nous ?
des guides spécifiques à la langue dans ce tutoriel, vous avez déjà vu un couple de
les instructions: `Register<Account>` et `Mint<Numeric>`- Je ne sais pas .

Voici la liste complète des Iroha Instructions spéciales:

| Instructions                                               | Des descriptions                                     |
| --------------------------------------------------------- | ------------------------------------------------ |
| [Registre/annuler l'enregistrement](#un-register)                       | Donnez une pièce d'identité à une nouvelle entité sur la blockchain.    |
| [La menthe ou le bois](#mint-burn)                                   | Les actifs numériques de la menthe/de la combustion ou les répétitions déclenchantes. |
| [Retour de la valeur de la clé](#setkeyvalue-removekeyvalue) | Mettez à jour les métadonnées des objets de la blockchain.               |
| [Paramètre de définition](#setparameter)                             | Définir un paramètre à l'échelle de la chaîne                      |
| [Grants et révocations](#grant-revoke)                             | Donner ou supprimer des autorisations et des rôles.            |
| [Transfert](#transfer)                                     | Transfert de la propriété ou de la valeur des actifs.               |
| [Réservations et verrouillages d'actifs natifs](#native-escrow-and-asset-locks) | Fermez les actifs numériques en garde à vue.     |
| [Trigger d' exécution](#executetrigger)                         | Exécutez les déclencheurs.                                |
| [Logi/Custom/Upgrade](#other-instructions)                 | Log, étendre ou améliorer le comportement de l'exécution.        |

Commençons par un résumé de Iroha Instructions spéciales; quels objets chacun
les instructions peuvent être demandées et quelles instructions sont disponibles pour chaque
objet.

## Résumé

Pour chaque instruction, il y a une liste d'objets sur lesquels cette instruction
Par exemple, les variantes de transfert couvrent les objets du registre propriétaires
et les actifs numériques, tandis que la mine couvre les actifs numériques et le déclencheur
répétitions.

Certaines instructions exigent que la destination soit spécifiée.
Si vous transférez des actifs, vous devez toujours préciser à quel compte vous êtes
En revanche, lorsque vous enregistrez quelque chose,
Tout ce dont vous avez besoin, c'est de l'objet que vous voulez enregistrer.

| Instructions                                               | Objets                                                                                                 | Destination          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| [Registre/annuler l'enregistrement](#un-register)                       | les domaines, les comptes, les définitions d'actifs, les FFT, les rôles, les déclencheurs, les pairs                                      |                      |
| [La menthe ou le bois](#mint-burn)                                   | actifs numériques, répétitions déclencheuses                                                                     | comptes ou déclencheurs |
| [Retour de la valeur de la clé](#setkeyvalue-removekeyvalue) | les objets qui ont [métadonnées](./metadata.md): domaines, comptes, définitions d'actifs, NFT, RWA, déclencheurs |                      |
| [Paramètre de définition](#setparameter)                             | paramètres de la chaîne                                                                                        |                      |
| [Grants et révocations](#grant-revoke)                             | [rôles, jetons d'autorisation](/blockchain/permissions.md)                                                  | comptes ou rôles    |
| [Transfert](#transfer)                                     | les domaines, les définitions d'actifs, les actifs numériques, les NFT                                                        | comptes             |
| [Réservations et verrouillages d'actifs natifs](#native-escrow-and-asset-locks) | les garanties numériques d'actifs, les verrouillages d'actifs, les engagements anonymes en garantie                                    | les acheteurs, les destinations ou les différends |
| [Trigger d' exécution](#executetrigger)                         | déclencheurs                                                                                                |                      |
| [Logi/Custom/Upgrade](#other-instructions)                 | logs, charges utiles spécifiques à l'exécuteur, mises à niveau de l'exécuteur                                                     |                      |

Il y a aussi une autre façon de voir l'ISI, en termes d'objet de registre
Ils touchent:

| Cible           | Instructions                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Compte          | enregistrer/annuler des comptes, recevoir des actifs, mettre à jour les métadonnées des comptes, accorder/annuler des autorisations et des rôles    |
| Domaine           | enregistrer/annuler les domaines, transférer la propriété du domaine, mettre à jour les métadonnées du domaine                               |
| Définition des actifs | définitions de registre/déclaration du registre, transfert de propriété, mise à jour des métadonnées                                         |
| Les actifs            | quantité numérique de la menthe/de la combustion, quantité numérique de transfert                                                        |
| Réservoir           | ouvrir, accepter, marquer le paiement envoyé, libérer, annuler, contester, résoudre, retirer ou expirer les dossiers de garde natifs |
| NFT              | enregistrer/annuler les NFT, transférer la propriété, mettre à jour les métadonnées                                                |
| RWA              | enregistrement des lots, quantité de transfert, détention/libération, congélation/décongélation, rachat, fusion, mise à jour des métadonnées et contrôles |
| Le déclencheur          | enregistrer/annuler l'enregistrement, répétition du déclencheur de la menthe/de la combustion, exécution du déclencheur, mise à jour des métadonnées du déclencheur                 |
| Le monde            | enregistrer/annuler les pairs et les rôles, définir des paramètres, mettre à niveau l'exécuteur                                    |

## Exemples de CLI

Les exemples de cette page supposent que vous exécutez des commandes à partir du flux en amont
Iroha espace de travail par rapport à la configuration par défaut du client local:

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

Lorsque vous ciblez le réseau de test public Taira, utilisez une configuration client Taira.
Avant d'exécuter des exemples payants, économisez l'aide au robinet
[Obtenez le testnet XOR sur Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
comme `taira_faucet_claim.py`, puis prétendre le réseau de test XOR du robinet:

```bash
export TAIRA_ACCOUNT_ID="<TAIRA_I105_ACCOUNT_ID>"
export TAIRA_FEE_ASSET="6TEAJqbb8oEPmLncoNiMRbLEK6tw"

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Une fois que l'actif financé par le robinet est visible, attachez l'actif à gaz requis.
métadonnées pour écrire les transactions:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

cargo run --bin iroha -- \
  --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  <command>
```

## (Un) Registre

L'enregistrement et la non-enregistrement sont les instructions utilisées pour donner une ID à un
une nouvelle entité sur la blockchain.

Tout ce qui peut être enregistré est `Registrable` et `Identifiable`Il y en a .
mais pas tout ce qui est `Identifiable` est `Registrable`La plupart des choses sont
enregistré directement, mais dans certains cas la représentation dans la blockchain
Pour des raisons de sécurité et de performance, nous utilisons
les constructeurs de ces structures de données (par exemple, `NewAccount`), et par rapport aux autres
l'enregistrement dispose d'une instruction spécifique sur la preuve de possession.
Tout ce qui peut être enregistré peut aussi être non enregistré, mais ce n'est pas le cas.
une règle dure et rapide.

Vous pouvez enregistrer des domaines, des comptes, des définitions d'actifs, des NFT, des pairs, des rôles,
et déclencheurs. utilisation de l'enregistrement par les pairs `RegisterPeerWithPop`, qui porte un
Prouver la possession de la clé partagée.
[nommage des conventions](/reference/naming.md) Pour en savoir plus sur les restrictions
mettre des noms d'entités.

Les lots RWA sont créés par l'intermédiaire de `RegisterRwa` L'enseignement.
le code actuel n'expose pas un `UnregisterRwa` instruction; utilisation
`RedeemRwa` pour retirer la quantité représentée.

::: info

Notez que selon la façon dont vous décidez de configurer votre
[bloc de la génèse](/guide/configure/genesis.md) dans `genesis.json`
(en particulier, que vous incluiez ou non l'enregistrement de la permission
En ce qui concerne les comptes, le processus d'enregistrement d'un compte peut être très différent.
Général, nous pouvons le résumer comme suit:

- Dans un _le public_ Chaque personne devrait pouvoir enregistrer un compte.
- Dans un _privé_ blockchain, il peut y avoir un processus unique pour l'enregistrement
  Les comptes. _typique_ blockchain privée, c'est-à-dire une blockchain sans
  pour les processus uniques d'enregistrement de comptes, vous avez besoin d'un compte pour
  enregistrer un autre compte.

Nous discutons de ces différences en détail lorsque nous
[comparer les chaînes de blocs privées et publiques](/guide/configure/modes.md)- Je ne sais pas .

:::

::: info

L'enregistrement d'un coéquipier est actuellement le seul moyen d'ajouter des coéquipiers qui n'étaient pas
partie de l'équipe de confiance d'origine mise sur le réseau.

:::

Refer à l'un des guides linguistiques spécifiques pour vous guider à travers le
processus d'enregistrement d'objets dans une blockchain:

| La langue              | Le guide                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| CLI                   | Utilisez le [Iroha CLI](/get-started/operate-iroha-via-cli.md) pour enregistrer des domaines, des comptes et des actifs. |
| Rost                  | Utilisez le [Tutoriel sur la rouille](/guide/tutorials/rust.md)- Je ne sais pas .                                                      |
| Kotlin/Java           | Utilisez le [Tutoriel pour le Java et Kotlin](/guide/tutorials/kotlin-java.md)- Je ne sais pas .                                        |
| Python                | Utilisez le [Tutoriel Python](/guide/tutorials/python.md)- Je ne sais pas .                                                  |
| JavaScript/TypeScript | Utilisez le [Le tutoriel JavaScript/TypeScript](/guide/tutorials/javascript.md)- Je ne sais pas .                               |

Registre et déregistre les domaines:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain register --id docs.universal

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

L'enregistrement de NFT lit son contenu en JSON à partir de
entrée standard:

```bash
printf '{"kind":"badge","level":"intro"}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft register --id 'badge$docs.universal'

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft unregister --id 'badge$docs.universal'
```

Les rôles d'enregistrement et de non-enregistrement:

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

Registrez et désinscrivez vos pairs. `kagami`
si vous ne les avez pas déjà:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer register --key "$PEER_KEY" --pop "$PEER_POP"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger peer unregister --key "$PEER_KEY"
```

## La menthe ou le bois

La mouture et la combustion peuvent se référer aux actifs numériques et aux déclencheurs avec une limite
nombre de répétitions. Certains actifs peuvent être déclarés non échangeables, ce qui signifie
qu'ils ne peuvent être coulés qu'une seule fois après l'enregistrement.

Les actifs sont comptés sur un compte spécifique, généralement celui qui les a enregistrés
Les quantités d'actifs ne sont pas négatives, donc vous pouvez
Je n'ai jamais `$-1.0` d'un actif ou brûler un montant négatif et obtenir une menthe.

Consultez l'un des guides linguistiques spécifiques pour vous guider dans le
Processus d'extraction des actifs dans une blockchain:

- [CLI](/get-started/operate-iroha-via-cli.md)
- [Rost](/guide/tutorials/rust.md)
- [Kotlin/Java](/guide/tutorials/kotlin-java.md)
- [Python](/guide/tutorials/python.md)
- [JavaScript/TypeScript](/guide/tutorials/javascript.md)

Voici quelques exemples d'actifs brûlés:

- [CLI](/get-started/operate-iroha-via-cli.md)
- [Rost](/guide/tutorials/rust.md)

Les actifs numériques de la menthe et du brûle:

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

## Transfert

Les transferts transférent la propriété ou la valeur entre les comptes.
les variantes couvrent les domaines, les définitions d'actifs, les actifs numériques et les FFT.
le mouvement de la quantité utilise le dédié `TransferRwa` et `ForceTransferRwa`
les instructions décrites dans [Les actifs du monde réel](/blockchain/rwas.md)- Je ne sais pas .

Pour ce faire, un compte doit être accordé aux
[autorisation de transfert d'actifs](/reference/permissions.md)- Référez-vous à un
exemple sur la manière de transférer des actifs avec
[CLI](/get-started/operate-iroha-via-cli.md) ou
[Rost](/guide/tutorials/rust.md)- Je ne sais pas .

Transfert d'actifs numériques:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset transfer \
  --definition "$ASSET_DEF" \
  --account "$ALICE" \
  --to "$BOB" \
  --quantity 25
```

Les actifs détenus par la société ne sont pas détenus par les acteurs financiers.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain transfer --id docs.universal --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger asset definition transfer --id "$ASSET_DEF" --from "$ALICE" --to "$BOB"

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger nft transfer --id 'badge$docs.universal' --from "$ALICE" --to "$BOB"
```

## Les verrous de dépôt et d'actifs natifs

Instructions de dépôt native pour verrouiller les actifs numériques dans le protocole géré par le registre
Ils sont utilisés pour le règlement de marché, l'actif générique
les verrous et les flux de garanties anonymes.

Utilisation de l'escroquerie sur le marché `OpenAssetEscrow`Il y en a . `AcceptAssetEscrow`Il y en a .
`MarkEscrowPaymentSent`Il y en a . `ReleaseAssetEscrow`Il y en a . `CancelAssetEscrow`Il y en a .
`OpenEscrowDispute`, et `ResolveEscrowDispute`. Utilisation de verrous d' actifs génériques
`OpenAssetLock`Il y en a . `DrawdownAssetLock`Il y en a . `CancelAssetLock`, et
`ExpireAssetLock`Les garanties anonymes reflètent le cycle de vie du marché
`OpenAnonymousAssetEscrow`Il y en a . `AcceptAnonymousAssetEscrow`Il y en a .
`MarkAnonymousEscrowPaymentSent`Il y en a . `ReleaseAnonymousAssetEscrow`Il y en a .
`CancelAnonymousAssetEscrow`Il y en a . `OpenAnonymousEscrowDispute`, et
`ResolveAnonymousEscrowDispute`- Je ne sais pas .

Ces ISI ne disposent pas actuellement de commandes CLI de première classe.
les constructeurs ou les charges utiles d'instructions sérialisées, et voir
[Réservation des actifs natifs](/blockchain/escrow.md) pour les détails du cycle de vie,
permissions, requêtes, événements et exemples de Rust.

## Grants et révocations

Les instructions d'octroi et de révocation sont utilisées pour le compte
[permissions et rôles](permissions.md)- Je ne sais pas .

`Grant` est utilisé pour accorder à l'utilisateur une autorisation unique de manière permanente, ou
Un groupe d'autorisations (un " rôle ").
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

## `SetKeyValue`- Je ne sais pas .`RemoveKeyValue`

Ces instructions mettent à jour l' objet [métadonnées](/blockchain/metadata.md)Utilisez .
`SetKeyValue` pour insérer ou remplacer une entrée de métadonnées et `RemoveKeyValue` à
supprimer une.

Les métadonnées `set` Les commandes lisent la valeur JSON à partir de l'entrée standard:

```bash
printf '"production"\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta set --id docs.universal --key environment

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger domain meta remove --id docs.universal --key environment
```

Le même schéma est disponible pour les comptes, les définitions d'actifs, les NFT, les RWA,
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

## `SetParameter`

`SetParameter` modification des paramètres à l'échelle de la chaîne exposés aux données actives
modèle et exécuteur.

Définir un paramètre en passant un seul paramètre objet JSON sur standard
entrée:

```bash
printf '{"Sumeragi":{"BlockTimeMs":1000}}\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger parameter set
```

## `ExecuteTrigger`

Cette instruction est utilisée pour exécuter [déclencheurs](./triggers.md)- Je ne sais pas .

Le CLI peut enregistrer les déclencheurs et souscrire aux événements d'exécution de déclencheurs
Il ne fournit pas une `execute trigger` commandement, donc à
soumettre un manuel `ExecuteTrigger` instruction, générer une série
`InstructionBox` avec un SDK ou un outil d'exécution et passer le JSON résultant
rangée à travers `ledger transaction stdin`- Je ne sais pas.

```bash
printf '["<BASE64_EXECUTE_TRIGGER_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin

cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger events trigger-execute --timeout 30s
```

## Autres instructions

Iroha exposer également les instructions de niveau inférieur pour le temps d'exécution et l'exécuteur
intégration:

- `Log`: émettre une entrée de journal lors de l'exécution
- `CustomInstruction`: transporter des charges utiles JSON spécifiques à l'exécuteur
- `Upgrade`: activer une mise à niveau de l' exécuteur

Envoyer une `Log` instruction avec l'aide au ping:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction ping --log-level INFO --msg "hello from docs"
```

Soumettez une instruction d' exécution personnalisée en tant que sérialisé `InstructionBox`Le ...
La forme de charge utile est spécifique à l'exécuteur, alors générez l'instruction avec le
l'outillage de mise en œuvre du SDK ou de l'exécuteur correspondant:

```bash
printf '["<BASE64_CUSTOM_INSTRUCTION_BOX>"]\n' |
  cargo run --bin iroha -- --config ./defaults/client.toml \
  ledger transaction stdin
```

Mise à niveau de l'exécuteur à partir d'une compilation IVM fichier de code octal:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  ops executor upgrade --path ./target/ivm/executor.ivm
```
