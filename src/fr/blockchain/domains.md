---
translation_locale: fr
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Domaines {#domains}

Les domaines sont des espaces de noms nommés enregistrés dans le `World`. Dans le modèle de données actuel Iroha 3, un domaine est qualifié par son espace de données parent, donc l'identifiant canonique est :

```text
domain.dataspace
```

Par exemple, `payments.universal` nomme le domaine `payments` à l'intérieur de l'espace de données `universal`.

## Structure {#structure}

Un `Domain` enregistré contient :

- `id` : le `DomainId` qualifié par l'espace de données
- `logo` : un `SoraFS` URI facultatif pour un logo de domaine
- `metadata` : métadonnées clé-valeur arbitraires
- `owned_by` : le compte qui possède le domaine, normalement le compte qui l'a enregistré

La charge utile d’amorçage utilisée pour matérialiser un domaine est `NewDomain`. Elle contient le `id`, le `logo` facultatif et le `metadata` initial. L’environnement d’exécution renseigne `owned_by` à partir de l’autorité. Les clients ordinaires ne soumettent pas directement cette charge utile.

## Inscription {#registration}

La création de domaine ordinaire utilise le flux de configuration d'alias déclaratif. Cela maintient le bail SNS, les capacités du propriétaire, le protection de cotation et la ligne de domaine dans une seule transaction atomique `EnsureAlias`. `Register::Domain` reste une surface de genèse/bootstrap, et la commande `ledger domain` n'a pas de sous-commande `register`.

Créez une intention `AliasSetupPlanRequestV1` sans secret avec un SDK ou un service d'intégration, puis faites planifier cela par le CLI par rapport à l'état en direct et soumettez ce plan exact :

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

L'intention identifie `payments.universal`, son espace de données numérique, canonique I105 propriétaire, durée d'acquisition du bail, et protection de la politique/cotisation actuelle. Le planificateur API le point de terminaison est `POST /v1/aliases/setup/plan`; son plan renvoyé est lié à la chaîne, à l'autorité, à l'État et aux délais. La suppression de domaine utilise toujours [`Unregister`](/fr/blockchain/instructions.md#un-register).

Créer ou supprimer un domaine nécessite la gestion appropriée du domaine autorisation sous le validateur d'exécution logicielle actif. Les métadonnées de domaine peuvent être mises à jour avec [`SetKeyValue` et `RemoveKeyValue`](/fr/blockchain/instructions.md#setkeyvalue-removekeyvalue) lorsque le principal d'autorisation a la permission de modifier ce domaine.

## Essayez-le sur Taira {#try-it-on-taira}

Listez les domaines actuellement visibles sur le testnet public Taira :

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Cartographier le catalogue des voies d'exécution publique vers les alias de l'espace de données :

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Utilisez la première commande lorsqu'une application doit vérifier si un domaine existe. Utilisez le catalogue des voies d'exécution lorsque vous devez confirmer si un espace de données est public, restreint ou en retard par rapport à la voie d'exécution principale.

La configuration d’un domaine est une écriture payante. Avant de l’essayer sur Taira, enregistrez l’outil de [Obtention de XOR de test sur Taira](/fr/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) sous `taira_faucet_claim.py`, financez le signataire via le distributeur public et joignez les métadonnées de frais :

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

Construisez l'intention pour un nom de domaine unique lors des exécutions répétées sur le testnet, et utilisez la politique actuelle de Taira et le garde-cotation des frais en actifs. Ne réutilisez pas un plan produit pour le localnet ou Minamoto.

## Relation avec d'autres entités {#relationship-to-other-entities}

Les domaines regroupent les objets du grand livre de la blockchain et fournissent un espace de noms pour les données à l'échelle du domaine. Les définitions d'actifs utilisent des identifiants qualifiés par le domaine, et les requêtes peuvent lister les domaines ou trouver des objets limités à un domaine. Les comptes eux-mêmes n'ont pas de domaine dans le modèle de données actuel, mais les comptes peuvent posséder des domaines et détenir des actifs dont les définitions se trouvent sous des domaines.

Voir aussi :

- [Monde](/fr/blockchain/world.md)
- [Actifs](/fr/blockchain/assets.md)
- [Métadonnées](/fr/blockchain/metadata.md)
- [Règles de dénomination](/fr/reference/naming.md)
