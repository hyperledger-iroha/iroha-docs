---
translation_locale: fr
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

## Résultat {#outcome}

Inspecter l'état de Taira NFT, puis enregistrer, mettre à jour, transférer et interroger un NFT unique sur un réseau local généré. Le flux de travail utilise un `name$domain.dataspace` NFT ID entièrement qualifié et des IDs de propriétaire I105 canoniques.

## Prérequis {#prerequisites}

- `curl`, `jq`, Python 3.11 ou ultérieur, et le `iroha` CLI actuel.
- Accès en lecture seule Taira.
- Pour les écritures, un réseau local généré à partir de [Lancer Iroha](/fr/get-started/launch-iroha.md), avec `./localnet/client.toml` et Torii sur `http://127.0.0.1:8080`.

## Étapes {#steps}

### 1. Inspecter la collection publique Taira {#_1-inspect-the-public-taira-collection}

Une page vide est une lecture réussie : cela signifie qu’aucun des NFTs visibles ne figure dans la page demandée.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

Les NFTs sont des enregistrements uniques, et non des soldes numériques. Chacun possède un ID, un propriétaire et une petite table de métadonnées `content`.

### 2. Préparer les identifiants des propriétaires locaux {#_2-prepare-local-owner-ids}

L'exemple écrit utilise le domaine `wonderland.universal` enregistré. Dérivez le principal d'autorisation configuré sans exposer sa clé privée, puis choisissez un autre compte enregistré comme destination du transfert.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

Le séparateur `$` appartient au formulaire de texte NFT. Conservez le domaine complet `wonderland.universal` et le suffixe de l’espace de données.

### 3. Enregistrez le NFT avec le contenu initial {#_3-register-the-nft-with-initial-content}

Le CLI lit l'objet initial JSON à partir de l'entrée standard. Le principal d'autorisation actuel devient le propriétaire.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Mettre à jour la carte de contenu {#_4-update-the-content-map}

Les valeurs des métadonnées sont JSON. Définir une clé insère ou remplace cette entrée ; cela ne remplace pas l'ensemble de l'enregistrement NFT.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Transférer la propriété {#_5-transfer-ownership}

Fournissez les deux identifiants de compte canoniques I105. Un alias doit être résolu avant d'être utilisé en tant que `--from` ou `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Limite d'autorisation

Sur Taira, chaque écriture nécessite également `--metadata ./taira.tx-metadata.json` et un payeur de frais explicite. L’environnement d’exécution actif vérifie l’inscription, le transfert, la suppression et les mises à jour de métadonnées (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` et `CanModifyNftMetadata` dans la surface d’autorisation par défaut). Utilisez un domaine attribué à votre application ou suivez ce guide sur localnet.

:::

Pour les flux de travail détenus par contrat, Kotodama expose des appels hôtes typés NFT. Ce qui suit est l'artifact de test de cycle de vie exact compilé et exécuté par la documentation de test IVM épinglée :

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

Les deux valeurs fixes I105 sont des artefacts de test en amont ; le moteur de test enregistre la destination avant l'exécution. Ce ne sont pas `CURRENT_OWNER` et `NEW_OWNER` du parcours CLI. Pour un contrat d'application, fournissez ses comptes canoniques réels, puis compilez-le, testez-le, déployez-le et appelez-le via [Contrats intelligents](./smart-contracts.md). Ne soumettez pas de bytecode non révisé à Taira, et rappelez-vous que l'exécution du contrat passe toujours par l'autorisation d'exécution du logiciel.

## Vérifier {#verify}

Lisez le NFT directement et affirmez que son propriétaire a changé tandis que son contenu est resté attaché :

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Si le CLI enveloppe l'enregistrement dans un conteneur de données de sortie, inspectez le JSON une fois et appliquez l'assertion à l'objet NFT contenu. Les invariants autoritaires sont `id`, `owned_by` et `content`.

## Dépannage {#troubleshooting}

- `name$domain` peut revenir à l’espace de données universel dans certains parseurs, mais les identifiants de cookbook et d’application devraient utiliser la forme explicite `name$domain.dataspace`.
- Une inscription répétée du même ID NFT est rejetée. Utilisez un nouveau localnet ou choisissez un nouvel ID stable pour un enregistrement distinct.
- Les métadonnées saisies doivent être du JSON valide sur l’entrée standard. Une chaîne shell dépourvue de guillemets JSON n’est pas une valeur de métadonnée.
- Un transfert signé par un compte autre que le propriétaire actuel nécessite une autorisation exacte ; modifier `--from` ne change pas le signataire cryptographique.
- Après le transfert, il se peut que le client original ne soit plus autorisé à modifier ou à désenregistrer le NFT. Utilisez le signataire cryptographique du nouveau propriétaire ou un contrôleur autorisé.
- Taira peut renvoyer une collection NFT vide. Ne considérez pas `items: []` comme une preuve que les instructions NFT ne sont pas disponibles.

## Source et documents connexes {#source-and-related-docs}

- [NFT tests d'intégration au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT tests d'appels hôtes au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Vecteur exact de test du cycle de vie d’un NFT Kotodama au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/fr/blockchain/nfts.md)
- [Métadonnées](/fr/blockchain/metadata.md)
- [Instructions](/fr/blockchain/instructions.md)
- [Jetons d'autorisation](/fr/reference/permissions.md)
