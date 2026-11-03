---
translation_locale: fr
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# NFTs {#nfts}

## Résultat {#outcome}

Inspecter l'état de Taira NFT, puis enregistrer, mettre à jour, transférer et interroger un NFT unique sur un réseau local généré. Le flux de travail utilise un `name$domain.dataspace` NFT ID entièrement qualifié et des IDs de propriétaire I105 canoniques.

## Prérequis {#prerequisites}

- `curl`, `jq`, Python 3.11 ou ultérieur, et le `iroha` CLI actuel.
- Accès en lecture seule Taira.
- Pour les écritures, un réseau local créé avec `kagami localnet generate --peers 4 --out-dir ./localnet` comme dans [Lancer Iroha](/fr/get-started/launch-iroha.md), avec `./localnet/client.toml` et Torii sur `http://127.0.0.1:8080`, ainsi qu'un domaine NFT que possède son signataire (voir l'étape 2).

## Étapes {#steps}

### 1. Inspecter la collection publique Taira {#_1-inspect-the-public-taira-collection}

Une page vide est une lecture réussie : cela signifie qu’aucun des NFTs visibles ne figure dans la page demandée.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

Les NFTs sont des enregistrements uniques, et non des soldes numériques. Chacun possède un ID, un propriétaire et une table de contenu compacte, que les lignes de collection de Torii renvoient sous la forme `metadata` et que `ledger nft get` renvoie sous la forme `content`.

### 2. Préparer les identifiants des propriétaires locaux {#_2-prepare-local-owner-ids}

L'exemple d'écriture nécessite un domaine que possède le compte signataire, ou un octroi de `CanRegisterNft` pour celui-ci. Un réseau local généré n'enregistre aucun domaine d'application pour son client, et l'enregistrement direct de domaines est réservé à la genèse : définissez donc `NFT_DOMAIN` sur un domaine `name.dataspace` que contrôle votre signataire. Dérivez le principal d'autorisation configuré sans exposer sa clé privée, puis choisissez un autre compte enregistré comme destination du transfert.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

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

Le séparateur `$` appartient à la forme textuelle du NFT. Conservez le domaine `name.dataspace` complet dans l'ID.

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

Sur Taira, chaque écriture utilise `--fee-payer authority` ; le CLI établit le devis exact des frais, dans l'actif de frais de Taira, avant de signer. L’environnement d’exécution actif vérifie l’inscription, le transfert, la suppression et les mises à jour de métadonnées (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` et `CanModifyNftMetadata` dans la surface d’autorisation par défaut). Utilisez un domaine que possède votre compte, ou un domaine pour lequel il détient ces autorisations.

:::

Pour les flux de travail détenus par contrat, Kotodama expose des appels hôtes typés NFT. Ce qui suit est l'artifact de test de cycle de vie exact compilé et exécuté par la documentation de test IVM épinglée :

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
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

Le CLI imprime l'enregistrement NFT lui-même. Les invariants qui font foi sont `id`, `owned_by` et `content`.

## Dépannage {#troubleshooting}

- `name$domain` peut revenir à l’espace de données universel dans certains parseurs, mais les identifiants de cookbook et d’application devraient utiliser la forme explicite `name$domain.dataspace`.
- Une inscription répétée du même ID NFT est rejetée. Utilisez un nouveau localnet ou choisissez un nouvel ID stable pour un enregistrement distinct.
- Les métadonnées saisies doivent être du JSON valide sur l’entrée standard. Une chaîne shell dépourvue de guillemets JSON n’est pas une valeur de métadonnée.
- Un transfert signé par un compte autre que le propriétaire actuel nécessite la propriété du domaine du NFT ou un octroi exact de `CanTransferNft` ; modifier `--from` ne change pas le signataire cryptographique.
- Le transfert ne modifie que `owned_by`. Les mises à jour de métadonnées et le désenregistrement restent du ressort du propriétaire du domaine ou d'un compte détenant `CanModifyNftMetadata` ou `CanUnregisterNft` pour ce NFT ; le nouveau propriétaire peut le transférer à son tour.
- Taira peut renvoyer une collection NFT vide. Ne considérez pas `items: []` comme une preuve que les instructions NFT ne sont pas disponibles.

## Source et documents connexes {#source-and-related-docs}

- [NFT tests d'intégration au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT tests d'appels hôtes au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Vecteur exact de test du cycle de vie d’un NFT Kotodama au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [Tests des exemples de documentation Kotodama au commit épinglé](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/fr/blockchain/nfts.md)
- [Métadonnées](/fr/blockchain/metadata.md)
- [Instructions](/fr/blockchain/instructions.md)
- [Jetons d'autorisation](/fr/reference/permissions.md)
