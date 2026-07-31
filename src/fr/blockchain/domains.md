---
translation_locale: fr
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Domaines {#domains}

Les domaines sont des espaces nommés enregistrés dans le `World`. Dans le courant Iroha
Un domaine est qualifié par son espace de données parent, donc le canonique
l'identifiant est:

```text
domain.dataspace
```

Par exemple, `payments.universal` les noms des `payments` domaine à l'intérieur du
`universal` espace de données.

## La structure {#structure}

Un enregistré `Domain` contient:

- `id`: la qualification de l'espace de données `DomainId`
- `logo`: une option `SoraFS` URI pour un logo de domaine
- `metadata`: métadonnées de valeur clé arbitraire
- `owned_by`: le compte qui possède le domaine, normalement le compte qui
  enregistré

La charge utile du bootstrap utilisée pour matérialiser un domaine est `NewDomain`. Elle porte
le `id`, optionnel `logo`, et initiale `metadata`. Le temps d'exécution se remplit
`owned_by` Les clients ordinaires ne soumettent pas cette charge utile
directement.

## Enregistrement {#registration}

La création de domaine ordinaire utilise le flux d'installation des alias déclaratifs.
SNS location, capacités de propriétaire, garde des devis et rangée de domaine dans un seul atome
`EnsureAlias` une transaction. `Register::Domain` reste une génèse/bootstrap
la surface, et le `ledger domain` le commandement n' a pas `register` Le sous-commandant.

Créez un livre sans secrets `AliasSetupPlanRequestV1` l'intention avec un SDK ou à bord
le service, puis avoir CLI Planifiez-le contre l'état de vie et soumettez-le exactement.
Le plan:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

L'intention identifie `payments.universal`, son espace de données numérique, canonique
I105 le propriétaire, la durée de l'acquisition du bail et la protection des cotes actuelles.
Le point final du planificateur est `POST /v1/aliases/setup/plan`; son plan de retour est
L'élimination de domaine est toujours utilisée dans les
[`Unregister`](/fr/blockchain/instructions.md#un-register).

La création ou la suppression d'un domaine nécessite une gestion appropriée du domaine
permis sous le validateur d'exécution actif. Les métadonnées de domaine peuvent être mises à jour avec
[`SetKeyValue` et `RemoveKeyValue`](/fr/blockchain/instructions.md#setkeyvalue-removekeyvalue)
lorsque l'autorité a la permission de modifier ce domaine.

## Essayez-le . Taira {#try-it-on-taira}

Liste des domaines actuellement visibles par le public Taira réseau de test:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Mettez le catalogue de voies publiques dans les aliases de l'espace de données:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Utilisez la première commande lorsqu'une application doit vérifier l'existence d'un domaine.
le catalogue des voies lorsque vous devez confirmer si un espace de données est public,
restreint ou en retard dans la voie principale.

L'installation de domaine est une écriture payante avant d'essayer Taira, le sauvegarder
auxiliaire du robinet
[Prenez le testnet XOR sur le Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
comme `taira_faucet_claim.py`, financer le signataire par l'intermédiaire du robinet public, et
métadonnées de frais d'adhésion:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Construisez l'intention d'un nom de domaine unique sur les tests répétés et utilisez
Taira La politique actuelle et la protection des cotations d' actifs.
pour le localnet ou Minamoto.

## Relations avec d'autres entités {#relationship-to-other-entities}

Les domaines regroupent les objets du registre et fournissent un espace de noms pour les données à portée de domaine.
Les définitions d'actifs utilisent des identifiants qualifiés par domaine, et les requêtes peuvent répertorier
les domaines ou trouver des objets visés par un domaine.
sans domaine dans le modèle de données actuel, mais les comptes peuvent posséder des domaines et garder
les actifs dont les définitions se trouvent dans des domaines.

Voir aussi:

- [Le monde](/fr/blockchain/world.md)
- [Les actifs](/fr/blockchain/assets.md)
- [Les métadonnées](/fr/blockchain/metadata.md)
- [Règles de dénomination](/fr/reference/naming.md)
