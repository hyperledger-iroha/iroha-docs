---
translation_locale: fr
translation_source: /cookbook/nfts.md
translation_source_hash: f34043c1940b556439c23de7decc5e79f198f52eca8517dd8a9a5892d997e211
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## Le résultat {#outcome}

L'inspection Taira NFT l'état, puis enregistrer, mettre à jour, transférer et demander un unique NFT Le flux de travail utilise un réseau local `name$domain.dataspace` NFT ID et canonique I105 propriétaire IDs.

## Conditions préalables {#prerequisites}

- `curl`, `jq`, Python 3.11 ou ultérieur, et le courant `iroha` CLI.
- Accès en lecture seulement Taira.
- Pour les écrits, un réseau local généré à partir de [Déploiement Iroha](/fr/get-started/launch-iroha.md), avec `./localnet/client.toml` et Torii sur `http://127.0.0.1:8080`.

## Les étapes {#steps}

### 1. Inspection de la collecte publique Taira {#_1-inspect-the-public-taira-collection}

Une page vide est une lecture réussie: cela signifie qu'il n'y a pas de NFTs visible dans la page demandée.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs sont des enregistrements uniques, pas des équilibres numériques. Ils ont un ID, un propriétaire et une carte de métadonnées compacte `content`.

### 2. Préparez le propriétaire local IDs {#_2-prepare-local-owner-ids}

L'exemple d'écriture utilise le domaine `wonderland.universal` enregistré. Dériver l'autorité configurée sans exposer sa clé privée, puis choisir un autre compte enregistré comme destination de transfert.

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

Le séparateur `$` appartient au formulaire texte NFT. Gardez le suffixe de domaine et d'espace de données complet `wonderland.universal`.

### 3. Enregistrer le NFT avec son contenu initial {#_3-register-the-nft-with-initial-content}

Le CLI lit l'objet initial JSON de l'entrée standard. L'autorité actuelle devient le propriétaire.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Mise à jour de la carte du contenu {#_4-update-the-content-map}

Les valeurs des métadonnées sont JSON. La définition d'une clé insère ou remplace cette entrée; elle ne remplace pas l'ensemble de l'enregistrement NFT.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Le transfert de la propriété {#_5-transfer-ownership}

Fournir à la fois le compte canonique I105 IDs. Un alias doit être résolu avant qu'il ne soit utilisé comme `--from` ou `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Limites d'autorisation

Sur Taira, chaque écriture a également besoin de `--metadata ./taira.tx-metadata.json` et d'un payeur explicite. L'enregistrement, le transfert, la suppression et les mises à jour des métadonnées sont vérifiées par l'exécution active (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` et `CanModifyNftMetadata` dans la surface d'autorisation par défaut).

:::

Pour les flux de travail détenus par contrat, Kotodama expose les appels d'hébergement NFT typés. Voici la fixation exacte du cycle de vie compilée et exécutée à l'aide du test de documentation IVM en fiches:

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

Les deux fixés I105 les valeurs sont des dispositifs d'essai en amont; le harnais enregistre la destination avant l'exécution. `CURRENT_OWNER` et `NEW_OWNER` à partir du CLI Pour un contrat de candidature, fournissez ses comptes canoniques réels, puis compilez, testez, déployez et appelez-le via [Contrats intelligents](./smart-contracts.md). Ne soumettez pas de code octal non examiné à: Taira, Et rappelez-vous que l'exécution du contrat passe toujours par l'autorisation d'exécution.

## Vérifiez {#verify}

Lisez directement le NFT et affirmez que son propriétaire a changé pendant que son contenu est resté attaché:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Si le CLI enveloppe l'enregistrement dans une enveloppe de sortie, inspectez le JSON une fois et appliquez l'affirmation à l'objet contenu NFT. Les invariants autorisés sont `id`, `owned_by` et `content`.

## Résolution des problèmes {#troubleshooting}

- `name$domain` peut être utilisé par défaut dans l'espace de données universel dans certains paramètres, mais le manuel de cuisine et l'application IDs doivent utiliser le formulaire explicite `name$domain.dataspace`.
- L'enregistrement répété du même NFT ID est rejeté. Utilisez un localnet frais ou choisissez un nouveau ID stable pour un enregistrement distinct.
- L'entrée de métadonnées doit être valide JSON sur l'entrée standard. Une chaîne shell sans mention de JSON n'est pas une valeur de métadonnée.
- Un transfert signé par un compte autre que le propriétaire actuel a besoin d'une autorisation exacte; la modification de `--from` ne change pas le signateur.
- Après le transfert, le client original ne peut plus être autorisé à muter ou à annuler l'enregistrement du NFT. Utilisez la signature du nouveau propriétaire ou un contrôleur autorisé.
- Taira peut retourner une collecte vide NFT. Ne considérez pas `items: []` comme la preuve que les instructions NFT ne sont pas disponibles.

## Sources et documents connexes {#source-and-related-docs}

- [Tests d'intégration NFT à l'implémentation fixée](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/nft.rs)
- [Kotodama NFT Tests d'appel hôte à l'engagement fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Fixation exacte du cycle de vie Kotodama NFT à l'engagement fixé](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/fr/blockchain/nfts.md)
- [Metadonnées ](/fr/blockchain/metadata.md)
- [Instructions ](/fr/blockchain/instructions.md)
- [Les jetons d'autorisation ](/fr/reference/permissions.md)
