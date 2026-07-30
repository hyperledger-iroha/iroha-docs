---
translation_locale: fr
translation_source: /blockchain/domains.md
translation_source_hash: ba8b76d3f943caa433a7c29a425f895a0625c4cd27f9d875a3a089f35b3a5cc6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Domaines

Les domaines sont des espaces nommés enregistrés dans le `World`Dans le courant Iroha
3 modèle de données un domaine est qualifié par son espace de données parent, de sorte que le canonique
l'identifiant est:

```text
domain.dataspace
```

Par exemple, `payments.universal` les noms des `payments` domaine à l'intérieur du
`universal` espace de données.

## La structure

Un enregistré `Domain` contient:

- `id`: le espace de données qualifié `DomainId`
- `logo`: optionnel `SoraFS` URI pour un logo de domaine
- `metadata`: métadonnées de valeur clé arbitraire
- `owned_by`: le compte qui détient le domaine, normalement le compte qui
  enregistré

La charge utile de transaction utilisée pour créer un domaine est `NewDomain`- Elle porte .
le `id`, facultatif `logo`, et initiale `metadata`Le temps de course est plein .
`owned_by` de l'autorité qui enregistre le domaine.

## Enregistrement

Les domaines sont enregistrés et non enregistrés avec le générique
[`Register` et `Unregister`](/blockchain/instructions.md#un-register)
avec les CLI:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain register --id payments.universal
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

L'enregistrement d'un domaine nécessite une autorisation de gestion de domaine appropriée
Les métadonnées de domaine peuvent être mises à jour avec
[`SetKeyValue` et `RemoveKeyValue`](/blockchain/instructions.md#setkeyvalue-removekeyvalue)
lorsque l'autorité a l'autorisation de modifier ce domaine.

## Essayez sur Taira.

Liste des domaines actuellement visibles sur le réseau public de test Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Mettez le catalogue de la voie publique dans les aliases de l'espace de données:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Utilisez la première commande lorsqu'une application doit vérifier l'existence d'un domaine.
le catalogue des voies lorsque vous devez confirmer si un espace de données est public,
restreint ou en retard dans la voie principale.

L'enregistrement de domaine est une écriture payante. Avant de l'essayer sur Taira, sauvegardez le
auxiliaire du robinet
[Obtenez le testnet XOR sur Taira](/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
comme `taira_faucet_claim.py`, financer le signataire par le robinet public, et
les métadonnées des frais d'adhésion:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger domain register --id docs-example.universal
```

Utilisez un nom de domaine unique pour les tests répétés.

## Relations avec d'autres entités

Les domaines regroupent les objets du registre et fournissent un espace de noms pour les données de domaine.
Les définitions d'actifs utilisent des identifiants qualifiés par domaine, et les requêtes peuvent répertorier
Les comptes eux-mêmes sont
sans domaine dans le modèle de données actuel, mais les comptes peuvent posséder des domaines et garder
les actifs dont les définitions se trouvent dans les domaines.

Voir aussi:

- [Le monde](/blockchain/world.md)
- [Les actifs](/blockchain/assets.md)
- [Les métadonnées](/blockchain/metadata.md)
- [Règles de dénomination](/reference/naming.md)
